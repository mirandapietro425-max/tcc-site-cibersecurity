/* CyberShield — unified ambient audio controller.
   One source of truth per page. It safely attempts autoplay, then unlocks on
   the first user gesture. All visible sound buttons control the same track. */
(() => {
  'use strict';
  const page = document.body?.dataset?.spPage || (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '') || 'home';
  const tracks = {
    home: 'assets/superproduction-v41/cybershield-home.mp3',
    radar: 'assets/superproduction-v41/cybershield-radar.mp3',
    playbook: 'assets/superproduction-v41/cybershield-playbook.mp3',
    laboratorio: 'assets/superproduction-v41/cybershield-laboratorio.mp3',
    privacidade: 'assets/superproduction-v41/cybershield-privacidade.mp3',
    'cadeia-ataque': 'assets/superproduction-v41/cybershield-cadeia.mp3',
    cadeia: 'assets/superproduction-v41/cybershield-cadeia.mp3'
  };
  const src = tracks[page];
  if (!src) return;

  const buttonsSelector = [
    '#audio-toggle', '.sp42-audio-toggle', '.r43-audio', '.pb45-audio',
    '#chain-sound-top', '#chain-sound', '.chain-sound', '[data-lab46-audio]',
    '#sound-toggle', '#protect-v32-mute', '.ps-sound', '#privacy-sound', '.sp-audio-toggle'
  ].join(',');

  let audio = [...document.querySelectorAll('audio')].find(a => {
    const u = a.currentSrc || a.src || '';
    return u.includes(src.replace(/^assets\//, '')) || u.endsWith(src);
  });
  if (!audio) {
    audio = document.createElement('audio');
    audio.src = src;
    audio.loop = true;
    audio.preload = 'auto';
    audio.setAttribute('aria-hidden', 'true');
    audio.style.display = 'none';
    document.body.appendChild(audio);
  }
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = Math.min(audio.volume || 0.12, 0.14);

  let on = false;
  let userMuted = sessionStorage.getItem('cs-audio-muted') === '1';

  const getButtons = () => [...document.querySelectorAll(buttonsSelector)];
  const label = (btn) => {
    if (btn.matches('.r43-audio')) return `SOM DO UNIVERSO · ${on ? 'ON' : 'OFF'}`;
    if (btn.matches('.sp42-audio-toggle')) return `SOM DO UNIVERSO · ${on ? 'ATIVO' : 'OFF'}`;
    if (btn.id === 'chain-sound-top' || btn.id === 'chain-sound' || btn.matches('.chain-sound')) return `Som da sequência · ${on ? 'ON' : 'OFF'}`;
    if (btn.matches('[data-lab46-audio]')) return `Som do laboratório · ${on ? 'ativo' : 'desligado'}`;
    if (btn.id === 'sound-toggle') return `Som ambiente ${on ? 'ON' : 'OFF'}`;
    if (btn.id === 'protect-v32-mute') return `Som ambiente · ${on ? 'ligado' : 'desligado'}`;
    if (btn.matches('.ps-sound,#privacy-sound')) return `SOM · ${on ? 'ON' : 'OFF'}`;
    if (btn.matches('.sp-audio-toggle')) return `SOM · ${on ? 'ATIVO' : 'OFF'}`;
    if (btn.id === 'audio-toggle') return on ? 'SOM ON' : 'SOM OFF';
    return on ? 'SOM · ON' : 'SOM · OFF';
  };
  const sync = () => {
    getButtons().forEach(btn => {
      btn.setAttribute('aria-pressed', String(on));
      btn.classList.toggle('is-active', on);
      btn.classList.toggle('is-playing', on);
      const pb = btn.querySelector('[data-pb45-audio-label]');
      if (pb) pb.textContent = on ? 'SOM DO ARQUIVO · ATIVO' : 'SOM DO ARQUIVO · OFF';
      if (!pb && btn.children.length === 0) btn.textContent = label(btn);
      if (btn.id === 'sound-toggle') {
        const span = btn.querySelector('span');
        if (span) span.textContent = on ? 'ON' : 'OFF';
        else btn.textContent = label(btn);
      }
      if (btn.matches('[data-lab46-audio]') || btn.id === 'protect-v32-mute' || btn.matches('.ps-sound,#privacy-sound,.chain-sound,#chain-sound-top,#chain-sound,.sp-audio-toggle')) {
        if (btn.children.length === 0) btn.textContent = label(btn);
      }
    });
    if (window.__cs54AudioState) window.__cs54AudioState(on);
    document.documentElement.dataset.audioOn = String(on);
  };

  async function start() {
    if (userMuted) return false;
    try {
      audio.volume = Math.min(audio.volume || 0.12, 0.14);
      await audio.play();
      on = true;
      sync();
      return true;
    } catch (_) {
      return false;
    }
  }
  function stop() {
    audio.pause();
    on = false;
    sync();
  }
  async function toggle() {
    if (on) {
      userMuted = true;
      sessionStorage.setItem('cs-audio-muted', '1');
      stop();
      return;
    }
    userMuted = false;
    sessionStorage.removeItem('cs-audio-muted');
    await start();
  }

  window.__csUniversalAudio = { audio, start, stop, toggle, isOn: () => on };

  // Capture phase prevents page-specific legacy handlers from double-toggling.
  document.addEventListener('click', e => {
    const btn = e.target.closest?.(buttonsSelector);
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    toggle();
  }, true);

  audio.addEventListener('play', () => { on = true; sync(); });
  audio.addEventListener('pause', () => { if (!audio.ended) { on = false; sync(); } });
  audio.addEventListener('ended', () => { on = false; sync(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && !userMuted) start(); });

  // Attempt audible autoplay as soon as the page is ready; browsers may require a gesture.
  const attempt = () => { if (!userMuted) start(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attempt, {once:true});
  else attempt();

  const unlock = () => {
    if (!userMuted && audio.paused) start();
    removeEventListener('pointerdown', unlock, true);
    removeEventListener('touchstart', unlock, true);
    removeEventListener('keydown', unlock, true);
  };
  addEventListener('pointerdown', unlock, true);
  addEventListener('touchstart', unlock, true);
  addEventListener('keydown', unlock, true);
  sync();
})();
