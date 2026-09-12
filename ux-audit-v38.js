(() => {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Generic resilient media fallback: never leave a broken-image icon as the only feedback.
  document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('error', () => {
      img.classList.add('is-media-error');
      img.setAttribute('aria-hidden', 'true');
      const fallback = document.createElement('span');
      fallback.className = 'media-fallback';
      fallback.setAttribute('role', 'img');
      fallback.setAttribute('aria-label', 'Visual indisponível; conteúdo textual preservado.');
      fallback.textContent = 'VISUAL INDISPONÍVEL';
      img.replaceWith(fallback);
    }, { once: true });
  });

  // Keyboard support for custom tab-like button groups.
  document.querySelectorAll('[role="tablist"]').forEach((list) => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    tabs.forEach((tab, i) => {
      if (!tab.id) tab.id = `tab-${Math.random().toString(36).slice(2, 8)}`;
      tab.setAttribute('tabindex', tab.getAttribute('aria-selected') === 'true' ? '0' : '-1');
      tab.addEventListener('keydown', (event) => {
        if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const delta = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : ['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 0;
        const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (i + delta + tabs.length) % tabs.length;
        tabs[nextIndex].focus();
        tabs[nextIndex].click();
      });
    });
  });

  // Keep selected tab focusability synchronized when pages update aria-selected dynamically.
  const selectedObserver = new MutationObserver((mutations) => {
    mutations.forEach(({ target, attributeName }) => {
      if (attributeName !== 'aria-selected' || target.getAttribute('role') !== 'tab') return;
      const selected = target.getAttribute('aria-selected') === 'true';
      target.setAttribute('tabindex', selected ? '0' : '-1');
    });
  });
  document.querySelectorAll('[role="tab"]').forEach(tab => selectedObserver.observe(tab, { attributes: true, attributeFilter: ['aria-selected'] }));

  // Escape closes transient UI when a page exposes an obvious close target.
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const closeable = document.querySelector('[data-close], .is-open[aria-expanded="true"]');
    if (closeable instanceof HTMLElement) closeable.click();
  });

  // Reduce-motion pages should not force smooth scrolling from inline page handlers.
  if (reduce) document.documentElement.classList.add('motion-reduced');
})();
