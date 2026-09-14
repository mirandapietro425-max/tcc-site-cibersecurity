/* CyberShield V70 Final UX — preserved typography, on-arrival reveals, cinematic intro. */
(() => {
  'use strict';

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const audio = document.getElementById('sfx-click');
  const seen = new WeakSet();

  function makeLetter(ch, index) {
    const s = document.createElement('span');
    s.className = 'v70-letter';
    s.textContent = ch === ' ' ? '\u00a0' : ch;
    s.style.setProperty('--v70-delay', `${Math.min(index, 36) * 34}ms`);
    return s;
  }

  // Preserve every <br>/<em> and keep words indivisible on desktop and mobile.
  // Each word is wrapped in .v70-word, while its letters remain individually animated.
  function wrapTextNodes(el) {
    if (!el || el.dataset.v70Wrapped === '1') return;
    el.dataset.v70Wrapped = '1';
    el.classList.add('v70-lettered');

    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (node.parentElement?.closest('button,a,.v70-word')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);

    nodes.forEach(node => {
      const text = node.nodeValue;
      const frag = document.createDocumentFragment();
      let letterIndex = 0;
      let i = 0;

      while (i < text.length) {
        const ch = text[i];
        if (/\s/.test(ch)) {
          frag.appendChild(document.createTextNode(ch === '\n' || ch === '\r' ? ch : '\u00a0'));
          i += 1;
          continue;
        }

        let j = i;
        while (j < text.length && !/\s/.test(text[j])) j += 1;
        const word = text.slice(i, j);
        const wrap = document.createElement('span');
        wrap.className = 'v70-word';
        for (const c of word) wrap.appendChild(makeLetter(c, letterIndex++));
        frag.appendChild(wrap);
        i = j;
      }

      node.parentNode.replaceChild(frag, node);
    });
  }

  function playLetterSound(index) {
    if (reduced || !audio || !document.body.classList.contains('experience-started')) return;
    try {
      audio.currentTime = 0;
      audio.volume = index % 2 ? 0.035 : 0.05;
      const p = audio.play();
      p?.catch?.(() => {});
    } catch (_) {}
  }

  function reveal(heading, intro = false) {
    if (!heading || seen.has(heading)) return;
    if (!document.body.classList.contains('experience-started')) return;
    seen.add(heading);

    const letters = [...heading.querySelectorAll('.v70-letter')];
    letters.forEach((letter, i) => {
      const delay = reduced ? 0 : (intro ? Math.min(i, 36) * 42 : Math.min(i, 36) * 34);
      setTimeout(() => {
        letter.classList.add('is-visible');
        playLetterSound(i);
      }, delay);
    });
  }

  function revealIntro() {
    const intro = document.querySelector('.chapter-intro .hero-3d');
    if (intro) reveal(intro, true);
  }

  function headingIsActuallyVisible(heading) {
    const r = heading.getBoundingClientRect();
    if (r.bottom <= 0 || r.top >= innerHeight) return false;

    // Desktop: do not start while the user is still in the previous scene.
    // Mobile keeps the more forgiving trigger that was already working well.
    const topLimit = innerWidth <= 700 ? innerHeight * 0.82 : innerHeight * 0.58;
    const bottomLimit = innerWidth <= 700 ? innerHeight * 0.18 : innerHeight * 0.26;
    return r.top <= topLimit && r.bottom >= bottomLimit;
  }

  function init() {
    const targets = document.querySelectorAll(
      '.chapter-content h2:not(.hero-3d), .gateway-choice-head h2, .chapter-intro .hero-3d'
    );
    targets.forEach(wrapTextNodes);

    const heads = [...document.querySelectorAll('.chapter-content h2:not(.hero-3d), .gateway-choice-head h2')];
    heads.forEach(h => h.querySelectorAll('.v70-letter').forEach(s => s.classList.remove('is-visible')));

    const startIntro = () => setTimeout(revealIntro, 120);
    document.addEventListener('cybershield:started', startIntro, { once: true });
    document.getElementById('boot-start')?.addEventListener('click', startIntro, { once: true });
    if (document.body.classList.contains('experience-started')) startIntro();

    if (!heads.length) return;

    if (reduced || !('IntersectionObserver' in window)) {
      const onScrollFallback = () => {
        heads.forEach(h => {
          if (headingIsActuallyVisible(h)) reveal(h);
        });
      };
      addEventListener('scroll', onScrollFallback, { passive: true });
      onScrollFallback();
      return;
    }

    // The observer only wakes when the heading is near the readable zone.
    // The explicit rect check prevents early reveals caused by large section bounds.
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        if (!headingIsActuallyVisible(entry.target)) return;
        reveal(entry.target);
        io.unobserve(entry.target);
      });
    }, {
      root: null,
      rootMargin: innerWidth <= 700 ? '-10% 0px -18% 0px' : '-34% 0px -34% 0px',
      threshold: 0.01
    });

    heads.forEach(h => io.observe(h));

    // Covers fast wheel/trackpad jumps where the observer can fire before the
    // browser has settled the final viewport position.
    let ticking = false;
    addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        heads.forEach(h => {
          if (!seen.has(h) && headingIsActuallyVisible(h)) reveal(h);
        });
        ticking = false;
      });
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
