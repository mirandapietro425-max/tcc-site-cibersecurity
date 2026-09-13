(() => {
  'use strict';
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('cs-v56-runtime');

  // The visual experience must not wait for a touch/cursor action.
  // Audio may still be blocked by browser autoplay policy; visuals must not be.
  const boot = document.querySelector('#boot');
  const start = document.querySelector('#boot-start');

  function releaseVisuals() {
    try { window.__cyberShieldBootRelease?.('AMBIENTE PRONTO'); } catch (_) {}
    document.body?.classList.add('experience-started');
    if (boot) {
      boot.classList.add('is-done');
      window.setTimeout(() => boot.remove(), 900);
    }
    if (!start) return;
    start.disabled = false;
    start.removeAttribute('aria-disabled');
  }

  function triggerHomeStart() {
    if (!document.querySelector('#experience')) return;
    releaseVisuals();
    if (window.__cyberShieldExperienceLoaded && start) {
      try { start.click(); } catch (_) {}
    }
  }

  if (document.querySelector('#experience')) {
    // Try quickly, then retry until the module has registered its start handler.
    let tries = 0;
    const timer = window.setInterval(() => {
      tries += 1;
      triggerHomeStart();
      if (window.__cyberShieldExperienceLoaded || tries > 24) window.clearInterval(timer);
    }, 250);
    window.setTimeout(triggerHomeStart, 900);
  }

  // Add automatic motion to real DOM elements only; no hover is required.
  const add = (selectors, cls) => {
    document.querySelectorAll(selectors).forEach((el) => {
      if (!el.dataset.csV56Auto) {
        el.dataset.csV56Auto = '1';
        el.classList.add(cls);
      }
    });
  };

  add('.r43-hero-art,.r43-scope-art,.pb45-core,.lab46-core,.ps-data-core,.hero-haze-a,.hero-haze-b,.hero-orbit', 'cs-v56-auto');
  add('.r43-corr-ring,.lab46-scan', 'cs-v56-auto');
  add('.chain-hero-core,.chain-hero-beam,.chain-hero-node', 'cs-v56-auto');

  // Re-fire the visual entry when a bfcache restore returns to the page.
  window.addEventListener('pageshow', () => {
    if (!reduce) window.setTimeout(triggerHomeStart, 60);
  });
})();
