import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export type HexadState = 'INTRO' | 'ORBIT' | 'PLANET' | 'SIMULATION' | 'SYNTHESIS'
export type RestorePhase = 'DETECT' | 'ISOLATE' | 'REPAIR' | 'VERIFY' | 'RESTORE' | 'STABILIZE'

export class HexadAssetLoader {
  private loader = new GLTFLoader()
  constructor(private basePath = '/assets/hexad/3d/') {}
  async load(file: string) {
    const result = await this.loader.loadAsync(`${this.basePath}${file}`)
    result.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true
        object.receiveShadow = true
      }
    })
    return result.scene
  }
}

export class HexadAudioManager {
  private master: HTMLAudioElement
  private ambient: HTMLAudioElement | null = null
  private enabled = false
  constructor(private basePath = '/assets/hexad/audio/') {
    this.master = new Audio(`${basePath}ambience/hexad-main.mp3`)
    this.master.loop = true
    this.master.volume = 0.28
  }
  async tryAutoplay() {
    try { await this.master.play(); this.enabled = true } catch { this.enabled = false }
    return this.enabled
  }
  unlock() { return this.tryAutoplay() }
  setEnabled(on: boolean) {
    this.enabled = on
    if (on) this.master.play().catch(() => undefined)
    else this.master.pause()
  }
  setAmbient(id: string) {
    if (this.ambient) { this.ambient.pause(); this.ambient.src = '' }
    this.ambient = new Audio(`${this.basePath}ambience/hexad-${id}.mp3`)
    this.ambient.loop = true
    this.ambient.volume = 0
    if (this.enabled) this.ambient.play().catch(() => undefined)
    const start = performance.now()
    const crossfade = (now: number) => {
      if (!this.ambient) return
      const p = Math.min((now - start) / 900, 1)
      this.ambient.volume = p * 0.18
      this.master.volume = 0.28 - p * 0.08
      if (p < 1) requestAnimationFrame(crossfade)
    }
    requestAnimationFrame(crossfade)
  }
  playSfx(name: string) {
    if (!this.enabled) return
    const audio = new Audio(`${this.basePath}sfx/hexad-${name}.wav`)
    audio.volume = 0.36
    audio.play().catch(() => undefined)
  }
  dispose() { this.master.pause(); this.ambient?.pause() }
}

export class HexadStateMachine {
  state: HexadState = 'INTRO'
  restorePhase: RestorePhase | null = null
  currentPlanet = 0
  incident: string | null = null
  private listeners = new Set<() => void>()
  subscribe(listener: () => void) { this.listeners.add(listener); return () => this.listeners.delete(listener) }
  private emit() { this.listeners.forEach((listener) => listener()) }
  setState(state: HexadState) { this.state = state; this.emit() }
  selectPlanet(index: number) { this.currentPlanet = Math.max(0, Math.min(5, index)); this.state = 'PLANET'; this.emit() }
  setIncident(incident: string) { this.incident = incident; this.state = 'SIMULATION'; this.emit() }
  async restore(onPhase?: (phase: RestorePhase) => void) {
    const phases: RestorePhase[] = ['DETECT','ISOLATE','REPAIR','VERIFY','RESTORE','STABILIZE']
    for (const phase of phases) {
      this.restorePhase = phase; onPhase?.(phase); this.emit()
      await new Promise((resolve) => window.setTimeout(resolve, 420))
    }
    this.restorePhase = null; this.incident = null; this.state = 'SYNTHESIS'; this.emit()
  }
}

export const setupAutoplayUnlock = (audio: HexadAudioManager) => {
  const unlock = () => { audio.unlock(); window.removeEventListener('pointerdown', unlock); window.removeEventListener('touchstart', unlock); window.removeEventListener('keydown', unlock) }
  window.addEventListener('pointerdown', unlock, { once: true })
  window.addEventListener('touchstart', unlock, { once: true })
  window.addEventListener('keydown', unlock, { once: true })
  return () => { window.removeEventListener('pointerdown', unlock); window.removeEventListener('touchstart', unlock); window.removeEventListener('keydown', unlock) }
}
