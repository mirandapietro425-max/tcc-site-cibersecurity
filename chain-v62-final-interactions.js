(() => {
  'use strict';
  const root = document.querySelector('.attack-page');
  if (!root) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nodes = [...root.querySelectorAll('.chain-hero-node')];
  if (nodes.length !== 7) return;

  const keys = ['recon','weapon','delivery','exploit','install','c2','objectives'];
  const authoritative = (index) => {
    const fn = window.__cyberShieldChainSetStage;
    if (typeof fn === 'function') {
      fn(index, true);
      return true;
    }
    const scene = root.querySelector('#attack-scene');
    if (scene) {
      scene.dataset.stage = keys[index];
      scene.scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block: 'center'});
      return true;
    }
    return false;
  };

  const go = (index) => {
    index = Math.max(0, Math.min(6, Number(index) || 0));
    nodes.forEach((n,i) => n.classList.toggle('is-live', i === index));
    root.dataset.gatewayStage = String(index + 1);
    const theater = root.querySelector('#theater');
    if (authoritative(index)) {
      requestAnimationFrame(() => theater?.scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block: 'center'}));
    }
  };

  nodes.forEach((node,index) => {
    node.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      go(index);
    }, {capture:true});
    node.addEventListener('pointerup', (event) => {
      if (event.pointerType === 'mouse') return;
      event.preventDefault();
      event.stopImmediatePropagation();
      go(index);
    }, {capture:true, passive:false});
  });

  // Also make every stage selector in the page converge on the same authoritative stage.
  root.querySelector('#attack-rail-list')?.addEventListener('click', (event) => {
    const btn = event.target.closest?.('.rail-btn');
    if (!btn) return;
    const index = Number(btn.dataset.index);
    if (Number.isFinite(index)) authoritative(index);
  }, {capture:true});

  root.querySelector('#atlas-hotspots')?.addEventListener('click', (event) => {
    const btn = event.target.closest?.('.atlas-hot');
    if (!btn) return;
    const index = Number(btn.dataset.stageIndex);
    if (Number.isFinite(index)) authoritative(index);
  }, {capture:true});
})();
