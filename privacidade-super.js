(() => {
  const root = document.querySelector('.privacy-super');
  if (!root) return;
  const $ = (s, el = root) => el.querySelector(s);
  const $$ = (s, el = root) => [...el.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll progress + active scene
  const dots = $$('.ps-progress button');
  const scenes = $$('.ps-scene');
  const activateScene = (i) => {
    scenes.forEach((s, n) => s.classList.toggle('is-visible', n === i));
    dots.forEach((d, n) => d.classList.toggle('is-active', n === i));
  };
  new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) activateScene(Number(e.target.dataset.scene)); });
  }, { threshold: .55 }).observe(scenes[0]);
  const sceneObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) activateScene(Number(e.target.dataset.scene)); });
  }, { threshold: .45 });
  scenes.forEach(s => sceneObserver.observe(s));
  dots.forEach(d => d.addEventListener('click', () => $(d.dataset.target)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })));

  // Lifecycle cards: the selected phase becomes the active question.
  $$('.ps-life').forEach(card => card.addEventListener('click', () => {
    $$('.ps-life').forEach(c => c.classList.remove('is-active'));
    card.classList.add('is-active');
    const target = document.querySelector(card.dataset.target);
    target?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  }));

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
  const audio = new Audio('assets/audio/cybershield-ambient-hazy-after-hours.mp3');
  audio.loop = true; audio.volume = .12;
  let soundOn = false;
  sound?.addEventListener('click', async () => {
    try {
      if (!soundOn) { await audio.play(); soundOn = true; sound.textContent = 'SOM · ON'; }
      else { audio.pause(); soundOn = false; sound.textContent = 'SOM · OFF'; }
    } catch { sound.textContent = 'SOM · BLOQUEADO'; }
  });
})();
