(() => {
  'use strict';
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const page = document.body;
  if (!page) return;

  // Ensure images that fail to decode do not leave an empty reserved canvas.
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => img.closest('figure,.hero-art,.ps-art,.scene-object,.scene-workstation,.lab-scene-image-wrap')?.classList.add('media-fallback'), {once:true});
  });

  // Generic reveal fallback for desktop/mobile where a page's specific observer has not run.
  const reveal = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window && reveal.length) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    }), {rootMargin:'0px 0px -8% 0px',threshold:.08});
    reveal.forEach(el => io.observe(el));
  } else if (reveal.length) reveal.forEach(el => el.classList.add('is-visible'));

  // Avoid focus traps when a fixed dossier/panel is closed.
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const open = document.querySelector('.pb45-dossier:not([hidden]), .explore-panel.is-open');
    if (!open) return;
    open.querySelector('button')?.click();
  });

  page.dataset.csV53 = 'ready';
  page.dataset.motion = reduce ? 'reduced' : 'full';
})();
