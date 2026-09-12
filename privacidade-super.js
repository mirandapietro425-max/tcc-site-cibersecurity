(() => {
  const root = document.querySelector('.privacy-super');
  if (!root) return;
  const $ = (s, el = root) => el.querySelector(s);
  const $$ = (s, el = root) => [...el.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Progress is driven by the actual narrative sections, so inserted chapters cannot desynchronize the rail.
  const dots = $$('.ps-progress button');
  const chapterSections = $$('#ps-hero, #ps-collect, #ps-lifecycle, #ps-quiet, #ps-use, #ps-protect, #ps-close');
  const sceneSections = $$('.ps-scene');
  const activateChapter = (section) => {
    const targetId = section?.id ? `#${section.id}` : '';
    dots.forEach(d => {
      const active = d.dataset.target === targetId;
      d.classList.toggle('is-active', active);
      if (active) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current');
    });
  };
  const chapterObserver = new IntersectionObserver((entries) => {
    entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio).slice(0,1)
      .forEach(e => activateChapter(e.target));
  }, { threshold: [.2,.45,.7], rootMargin: '-10% 0px -10% 0px' });
  chapterSections.forEach(section => chapterObserver.observe(section));
  const sceneObserver = new IntersectionObserver((entries) => {
    entries.filter(e => e.isIntersecting).forEach(e => e.target.classList.add('is-visible'));
    entries.filter(e => !e.isIntersecting).forEach(e => e.target.classList.remove('is-visible'));
  }, { threshold: .35, rootMargin: '-8% 0px -8% 0px' });
  sceneSections.forEach(scene => sceneObserver.observe(scene));
  dots.forEach(d => d.addEventListener('click', () => document.querySelector(d.dataset.target)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })));

  // Lifecycle cards: the selected phase becomes the active question.
  $$('.ps-life').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    const choose = () => {
    $$('.ps-life').forEach(c => c.classList.remove('is-active'));
    card.classList.add('is-active');
    const target = document.querySelector(card.dataset.target);
    target?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    };
    card.addEventListener('click', choose);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(); } });
  });

  const dataCore = $('.ps-data-core');
  dataCore?.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const first = $('.ps-data-bubble');
      first?.focus();
    }
  });

  // Practice lab
  const evidence = $$('.ps-evidence button');
  let found = 0;
  evidence.forEach(btn => btn.addEventListener('click', () => {
    if (!btn.classList.contains('is-found')) {
      btn.classList.add('is-found');
      found += 1;
      btn.querySelector('b')?.setAttribute('aria-label', 'evidência encontrada');
      const score = $('#lab-score');
      if (score) score.textContent = `${Math.min(95, 35 + found * 20)}`;
      const meter = $('#lab-meter');
      if (meter) meter.style.width = `${Math.min(100, found / evidence.length * 100)}%`;
    }
  }));

  $$('.ps-choice').forEach(btn => btn.addEventListener('click', () => {
    const feedback = $('#decision-feedback');
    if (!feedback) return;
    const correct = btn.dataset.correct === 'true';
    feedback.textContent = correct
      ? 'DECISÃO APROVADA · registre, limite o acesso e confirme a finalidade antes de compartilhar.'
      : 'RISCO ELEVADO · essa ação amplia exposição ou quebra a finalidade original do dado.';
    feedback.style.color = correct ? 'var(--pv-green)' : 'var(--pv-warm)';
  }));

  // Privacy rights explorer
  const rightData = {
    access: ['Acesso', 'A pessoa deve conseguir entender quais dados existem sobre ela e como são tratados.'],
    correct: ['Correção', 'Dados incorretos comprometem decisões. Atualização também é uma camada de qualidade.'],
    delete: ['Eliminação', 'Quando a finalidade termina e a retenção não é necessária, o ciclo deve fechar.'],
    portability: ['Portabilidade', 'Mover dados de forma estruturada ajuda o titular a exercer controle sobre sua informação.']
  };
  $$('.ps-right').forEach(btn => btn.addEventListener('click', () => {
    $$('.ps-right').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const d = rightData[btn.dataset.right];
    if (d) { $('#rights-title').textContent = d[0]; $('#rights-copy').textContent = d[1]; }
  }));

  // Motion: subtle pointer field, not heavy canvas.
  root.addEventListener('pointermove', e => {
    const x = (e.clientX / innerWidth - .5) * 2;
    const y = (e.clientY / innerHeight - .5) * 2;
    root.style.setProperty('--px', `${x}`);
    root.style.setProperty('--py', `${y}`);
  }, { passive: true });

  // Optional ambient sound — only starts from explicit user action.
  const sound = $('#privacy-sound');
  const audio = new Audio('assets/superproduction-v41/cybershield-privacidade.mp3');
  audio.loop = true; audio.volume = .12;
  let soundOn = false;
  sound?.addEventListener('click', async () => {
    try {
      if (!soundOn) { await audio.play(); soundOn = true; sound.textContent = 'SOM · ON'; }
      else { audio.pause(); soundOn = false; sound.textContent = 'SOM · OFF'; }
    } catch { sound.textContent = 'SOM · BLOQUEADO'; }
  });
})();
