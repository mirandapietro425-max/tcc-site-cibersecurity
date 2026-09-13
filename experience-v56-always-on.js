(() => {
  'use strict';
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('cs-v56-runtime');

  // The visual experience must not wait for a touch/cursor action.
  // Audio may still be blocked by browser autoplay policy; visuals must not be.
  const boot = document.querySelector('#boot');
  const start = document.querySelector('#boot-start');

  // V62: preserve the original entrance. Visual motion may run automatically,
  // but never synthesize the user's click; audible autoplay requires a trusted gesture.
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

})();
