(() => {
  'use strict';
  const root = document.querySelector('.attack-page');
  const stage = document.querySelector('#hero-stage');
  const art = document.querySelector('.chain-hero-art');
  const nodes = [...document.querySelectorAll('.chain-hero-node')];
  const theater = document.querySelector('#theater');
  if (!root || !stage || !art || nodes.length !== 7) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const names = ['Reconhecimento','Armamento','Entrega','Exploração','Instalação','Comando e controle','Ações sobre os objetivos'];
  const keys = ['recon','weapon','delivery','exploit','install','c2','objectives'];
  let active = 0;
  let timer = 0;
  let probe = art.querySelector('.chain-hero-probe');

  if (!probe) {
    probe = document.createElement('span');
    probe.className = 'chain-hero-probe';
    probe.setAttribute('aria-hidden','true');
    art.appendChild(probe);
  }

  function setProbe(index, instant=false) {
    const target = nodes[index];
    if (!target) return;
    const ar = art.getBoundingClientRect();
    const nr = target.getBoundingClientRect();
    const x = nr.left + nr.width/2 - ar.left;
    const y = nr.top + nr.height/2 - ar.top;
    const keyframes = { transform: `translate3d(${x-10}px,${y-10}px,0) scale(${instant?1:1.08})` };
    if (instant || reduce) {
      probe.getAnimations().forEach(a => a.cancel());
      probe.style.transform = keyframes.transform;
      return;
    }
    probe.animate([probe.getAnimations().length ? {} : {transform:probe.style.transform || 'translate3d(0,0,0)'}, keyframes], {
      duration: 900,
      easing: 'cubic-bezier(.2,.8,.2,1)',
      fill: 'forwards'
    });
  }

  function syncStage(index, {move=false, announce=true}={}) {
    active = Math.max(0, Math.min(6, index));
    nodes.forEach((n,i) => {
      n.classList.toggle('is-live', i === active);
      n.setAttribute('aria-label', `${String(i+1).padStart(2,'0')} · ${names[i]}`);
    });
    art.dataset.liveStage = String(active + 1);
    root.style.setProperty('--chain-gateway-progress', `${((active+1)/7)*100}%`);
    root.dataset.gatewayStage = String(active+1);
    setProbe(active);

    const setAuthoritative = window.__cyberShieldChainSetStage;
    if (typeof setAuthoritative === 'function') setAuthoritative(active, move);
    else {
      const scene = document.querySelector('#attack-scene');
      if (scene) scene.dataset.stage = keys[active];
    }
    if (announce && theater?.classList.contains('is-in-view')) {
      root.setAttribute('aria-label', `Cadeia de ataque · ${String(active+1).padStart(2,'0')} de 07 · ${names[active]}`);
    }
  }

  nodes.forEach((node,i) => {
    node.tabIndex = 0;
    const choose = () => {
      syncStage(i, {move:true});
      resetAuto();
    };
    node.addEventListener('click', choose);
    node.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); nodes[(i+1)%7].focus(); choose(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); nodes[(i+6)%7].focus(); choose(); }
    });
  });

  function advance() {
    const next = (active + 1) % 7;
    syncStage(next, {move:false});
  }
  function resetAuto() {
    if (timer) window.clearInterval(timer);
    timer = 0;
    if (reduce) return;
    timer = window.setInterval(advance, 4200);
  }

  const heroIO = new IntersectionObserver(entries => {
    const visible = entries.some(e => e.isIntersecting);
    if (visible) { setProbe(active, true); resetAuto(); }
    else if (timer) { window.clearInterval(timer); timer = 0; }
  }, {threshold:.2});
  heroIO.observe(stage);

  window.addEventListener('resize', () => setProbe(active, true), {passive:true});
  window.addEventListener('pageshow', () => setProbe(active, true));

  syncStage(0, {move:false, announce:false});
  resetAuto();
})();
