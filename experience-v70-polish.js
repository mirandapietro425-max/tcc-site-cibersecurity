/* CyberShield V70 — scroll-triggered letter reveal with one tactile sound per letter. */
(() => {
  'use strict';

  const waitForHeadlines = (attempt = 0) => {
    const headlines = [...document.querySelectorAll('.chapter-content h2 .scene-letter')];
    if (!headlines.length && attempt < 24) {
      setTimeout(() => waitForHeadlines(attempt + 1), 120);
      return;
    }
    if (!headlines.length) return;

    const seen = new WeakSet();
    const sound = document.getElementById('sfx-click');
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const reveal = heading => {
      if (!heading || seen.has(heading)) return;
      seen.add(heading);
      const letters = [...heading.querySelectorAll('.scene-letter')];
      letters.forEach((letter, index) => {
        const delay = reduced ? 0 : Math.min(index, 28) * 24;
        setTimeout(() => {
          letter.classList.add('is-visible');
          if (!reduced && document.body.classList.contains('experience-started') && sound) {
            try {
              sound.currentTime = 0;
              sound.volume = index % 2 ? .045 : .065;
              const play = sound.play();
              play?.catch?.(() => {});
            } catch (_) {}
          }
        }, delay);
      });
    };

    const observe = heading => {
      const chapter = heading.closest('.chapter');
      if (!chapter) return;
      if (!('IntersectionObserver' in window)) {
        reveal(heading);
        return;
      }
      const io = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          reveal(heading);
          io.disconnect();
        }
      }, {rootMargin:'-12% 0px -28% 0px', threshold:.08});
      io.observe(chapter);
    };

    document.querySelectorAll('.chapter-content h2:not(.hero-3d)').forEach(heading => {
      heading.querySelectorAll('.scene-letter').forEach(letter => letter.classList.remove('is-visible'));
      observe(heading);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => waitForHeadlines(), {once:true});
  } else {
    waitForHeadlines();
  }
  window.addEventListener('load', () => waitForHeadlines(), {once:true, passive:true});
})();