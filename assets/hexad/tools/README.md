# CyberShield Hexad — Asset Pack v1.0

Este pacote contém os assets e ferramentas de produção solicitados no documento `PROMPT MASTER — CYBERSHIELD HEXAD`. Os modelos principais foram gerados como **GLB procedural**, com nomes de nós que correspondem às partes narrativas. O pacote não depende de OBJ/FBX.

## Estrutura

- `3d/` — 13 modelos `.glb`: núcleo, sol, drone, satélite, node, fragmento, scanner e seis mundos.
- `textures/` — fontes PNG 1024×1024 para nebula, starfield, ruído e superfícies planetárias. O script `tools/build_ktx2.sh` converte para KTX2/Basis quando `toktx` estiver disponível.
- `2d/` — fallback, overview, failure e restoration em WebP 1920×1080.
- `video/` — genesis, collapse e restoration em WebM + MP4; reparo de integridade e scan de autenticidade em WebM.
- `audio/ambience/` — trilha principal e seis beds ambientais com identidade contínua.
- `audio/sfx/` — 16 efeitos individuais WAV.
- `tools/asset-manifest.json` — catálogo de arquivos e regras de runtime.
- `tools/hexad-runtime-kit.ts` — utilitários para Three.js: carregamento GLB, `HexadAudioManager`, transições, estados e fallback.

## Integração Three.js

Use um único `WebGLRenderer`, um único `requestAnimationFrame` e um único `HexadAudioManager`. Os planetas podem compartilhar o mesmo `hexad-data-fragment.glb`. Para mobile, reduza DPR, partículas, sombras e meshes secundários; preserve estados e perguntas.

```ts
import { HexadAssetLoader, HexadAudioManager, HexadStateMachine } from './tools/hexad-runtime-kit'
const loader = new HexadAssetLoader('/assets/hexad/3d/')
const core = await loader.load('hexad-data-core.glb')
const audio = new HexadAudioManager('/assets/hexad/audio/')
await audio.tryAutoplay()
const state = new HexadStateMachine()
```

## Compressão

Os GLB estão prontos para passar por Draco/Meshopt no pipeline de build. As texturas PNG são fontes; rode `tools/build_ktx2.sh` em uma máquina com o Khronos KTX-Software (`toktx`) para criar os arquivos KTX2 finais. Não usar 4K como padrão.

## Estados e narrativa

- `INTRO` → `ORBIT` → `PLANET 01–06` → `SIMULATION` → `SYNTHESIS`.
- Incidentes: `EXPOSE`, `STEAL`, `ALTER`, `SPOOF`, `DISRUPT`, `CORRUPT`.
- Restauração: `DETECT` → `ISOLATE` → `REPAIR` → `VERIFY` → `RESTORE` → `STABILIZE`.
- Consequência visual: planeta, nodes, núcleo, partículas, luz, áudio e HUD.

## Nota sobre formatos

Os `.mp4` são fallback H.264. Os `.webm` são o formato web principal. Os `.wav` são SFX individuais para baixa latência. O master gerado respeita o limite de geração de aproximadamente 3 minutos; para uma trilha de 3–6 minutos, concatenar uma segunda variação com crossfade de 1–2 segundos no pipeline de produção.
