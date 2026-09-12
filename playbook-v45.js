(() => {
  'use strict';
  const page = document.querySelector('[data-sp-page="playbook"]');
  if (!page) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const archive = page.querySelector('.pb45-archive');
  const sticky = page.querySelector('.pb45-sticky');
  const stage = page.querySelector('.pb45-stage');
  const stageImage = page.querySelector('.pb45-archive-bg img');
  const progress = page.querySelector('.pb45-progress i');
  const nodes = [...page.querySelectorAll('.pb45-node')];
  const routes = [...page.querySelectorAll('.pb45-route')];
  const name = page.querySelector('[data-pb45-name]');
  const copy = page.querySelector('[data-pb45-copy]');
  const index = page.querySelector('[data-pb45-index]');
  const inspector = page.querySelector('.pb45-inspector');
  const coreStatus = page.querySelector('[data-pb45-core-status]');
  const core = page.querySelector('.pb45-core');
  const capsules = [...page.querySelectorAll('.pb45-capsule')];
  const dossier = page.querySelector('.pb45-dossier');
  const dossierTitle = page.querySelector('[data-pb45-dossier-title]');
  const dossierBody = page.querySelector('[data-pb45-dossier-body]');
  const dossierTag = page.querySelector('[data-pb45-dossier-tag]');
  const dossierIndex = page.querySelector('[data-pb45-dossier-index]');
  const dossierClose = page.querySelector('.pb45-dossier-close');
  const audioBtn = page.querySelector('.pb45-audio');
  const motionBtn = page.querySelector('.pb45-motion');

  const protocols = [
    {code:'GV', name:'GOVERNAR', copy:'Defina direção, responsabilidade, políticas e critérios antes de transformar risco em ação.', tone:'violet', status:'DIREÇÃO / RESPONSABILIDADE'},
    {code:'ID', name:'IDENTIFICAR', copy:'Entenda ativos, pessoas, processos e contexto para saber onde a exposição realmente existe.', tone:'cyan', status:'ATIVOS / CONTEXTO'},
    {code:'PR', name:'PROTEGER', copy:'Reduza a superfície de ataque com controles concretos, acesso mínimo e proteção por camadas.', tone:'mint', status:'CONTROLES / EXPOSIÇÃO'},
    {code:'DE', name:'DETECTAR', copy:'Procure sinais e desvios que mereçam correlação, não apenas alertas isolados.', tone:'amber', status:'SINAIS / CORRELAÇÃO'},
    {code:'RS', name:'RESPONDER', copy:'Conter, investigar e comunicar são movimentos diferentes dentro do mesmo incidente.', tone:'danger', status:'CONTENÇÃO / EVIDÊNCIA'},
    {code:'RC', name:'RECUPERAR', copy:'Restaure a operação, a confiança e o aprendizado para que o sistema volte mais preparado.', tone:'mint', status:'RETORNO / APRENDIZADO'}
  ];

  const knowledge = [
    {tag:'PESSOAS', title:'MFA + senhas únicas', body:'Reduza o impacto de credenciais comprometidas usando autenticação multifator e evitando reutilização.', route:'P01 · IDENTIDADE'},
    {tag:'DADOS', title:'Classifique e minimize', body:'Use somente o que a finalidade exige; defina acesso, retenção e necessidade desde o início.', route:'D02 · CICLO DO DADO'},
    {tag:'CÓDIGO', title:'Valide no servidor', body:'Entradas, autenticação e autorização não podem depender da confiança no navegador.', route:'C03 · APLICAÇÃO'},
    {tag:'SEGREDOS', title:'Proteja .env e chaves', body:'Tokens e credenciais precisam ficar fora do código-fonte e dos artefatos que chegam ao repositório.', route:'S04 · CREDENCIAIS'},
    {tag:'BUILD', title:'Higienize o deploy', body:'Remova exposição desnecessária, revise artefatos e mantenha produção coerente com o que foi auditado.', route:'B05 · PRODUÇÃO'},
    {tag:'RESPOSTA', title:'Tenha um caminho', body:'Defina antes do incidente como conter, investigar, comunicar e recuperar sem improviso.', route:'R06 · INCIDENTE'}
  ];

  let selected = 0;
  let activeCapsule = -1;
  let soundOn = false;
  let audio;
  let audioCtx;
  let analyser;
  let audioSource;
  let motionPaused = false;
  let raf = 0;

  function setProtocol(i, focus = false) {
    selected = (i + protocols.length) % protocols.length;
    const p = protocols[selected];
    nodes.forEach((n,k) => {
      n.classList.toggle('is-active', k === selected);
      n.setAttribute('aria-pressed', String(k === selected));
    });
    routes.forEach((r,k) => r.classList.toggle('active', k === selected));
    name.textContent = p.name;
    copy.textContent = p.copy;
    index.textContent = `${String(selected + 1).padStart(2,'0')} / 06`;
    coreStatus.textContent = p.status;
    archive.dataset.protocol = String(selected + 1);
    inspector?.classList.add('is-changing');
    window.setTimeout(() => inspector?.classList.remove('is-changing'), 180);
    if (!reduce) playTone(selected === 4 ? 'danger' : 'safe');
    if (focus) nodes[selected]?.focus({preventScroll:true});
  }

  nodes.forEach((node, i) => node.addEventListener('click', () => setProtocol(i, false)));
  page.addEventListener('keydown', e => {
    if (dossier && !dossier.hidden && e.key === 'Escape') { closeDossier(); return; }
    if (e.target.closest?.('.pb45-node')) {
      if (e.key === 'ArrowRight') { e.preventDefault(); setProtocol(selected + 1, true); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); setProtocol(selected - 1, true); }
      if (e.key === 'Home') { e.preventDefault(); setProtocol(0, true); }
      if (e.key === 'End') { e.preventDefault(); setProtocol(protocols.length - 1, true); }
    }
  });

  function openDossier(i) {
    const k = knowledge[i]; if (!k || !dossier) return;
    activeCapsule = i;
    capsules.forEach((c,j) => c.classList.toggle('is-selected', j === i));
    dossier.hidden = false;
    dossierTitle.textContent = k.title;
    dossierBody.textContent = k.body;
    dossierTag.textContent = k.tag;
    dossierIndex.textContent = String(i + 1).padStart(2,'0');
    playTone('safe');
    dossierClose?.focus({preventScroll:true});
  }
  function closeDossier() {
    if (!dossier) return;
    dossier.hidden = true;
    capsules.forEach(c => c.classList.remove('is-selected'));
    if (activeCapsule > -1) capsules[activeCapsule]?.focus({preventScroll:true});
    activeCapsule = -1;
  }
  capsules.forEach((c,i) => {
    c.addEventListener('click', () => openDossier(i));
    c.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); capsules[(i + 1) % capsules.length]?.focus(); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); capsules[(i - 1 + capsules.length) % capsules.length]?.focus(); }
      if (e.key === 'Home') { e.preventDefault(); capsules[0]?.focus(); }
      if (e.key === 'End') { e.preventDefault(); capsules[capsules.length - 1]?.focus(); }
    });
  });
  dossierClose?.addEventListener('click', closeDossier);

  const progressIO = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const rect = e.target.getBoundingClientRect();
      const total = rect.height - innerHeight;
      const distance = Math.max(0, Math.min(total, -rect.top));
      progress.style.transform = `scaleX(${total > 0 ? distance / total : 0})`;
    }
  }, {threshold:[0,.25,.5,.75,1]});
  progressIO.observe(archive);

  function updateProgress() {
    const rect = archive.getBoundingClientRect();
    const total = Math.max(1, rect.height - innerHeight);
    const distance = Math.max(0, Math.min(total, -rect.top));
    const ratio = distance / total;
    if (progress) progress.style.transform = `scaleX(${ratio})`;
    const step = Math.max(0, Math.min(protocols.length - 1, Math.floor(ratio * protocols.length * 1.03)));
    if (step !== selected && document.activeElement?.closest?.('.pb45-node') == null) setProtocol(step, false);
  }
  if (!reduce) window.addEventListener('scroll', updateProgress, {passive:true});
  updateProgress();

  if (!reduce && !coarse) {
    page.addEventListener('pointermove', e => {
      const rect = sticky.getBoundingClientRect();
      const x = (e.clientX - rect.left) / Math.max(1, rect.width) - .5;
      const y = (e.clientY - rect.top) / Math.max(1, rect.height) - .5;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        page.style.setProperty('--pb45-px', `${x * 10}px`);
        page.style.setProperty('--pb45-py', `${y * 7}px`);
        page.style.setProperty('--pb45-stage-x', `${x * 5}px`);
        page.style.setProperty('--pb45-stage-y', `${y * 3}px`);
      });
    }, {passive:true});
  }

  function ensureAudio() {
    if (!audio) {
      audio = new Audio('assets/superproduction-v41/cybershield-playbook.mp3');
      audio.loop = true; audio.preload = 'metadata'; audio.volume = .11;
      audio.addEventListener('ended', () => { soundOn = false; updateAudioUI(); });
    }
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioCtx.createAnalyser(); analyser.fftSize = 256; analyser.smoothingTimeConstant = .84;
      audioSource = audioCtx.createMediaElementSource(audio); audioSource.connect(analyser); analyser.connect(audioCtx.destination);
    }
  }
  async function toggleAudio() {
    try {
      ensureAudio();
      if (audioCtx.state === 'suspended') await audioCtx.resume();
      if (!soundOn) { await audio.play(); soundOn = true; startAudioReactive(); }
      else { audio.pause(); soundOn = false; }
      updateAudioUI();
      if (soundOn) startAudioReactive();
    } catch (_) { soundOn = false; updateAudioUI(); }
  }
  function updateAudioUI() {
    if (!audioBtn) return;
    audioBtn.classList.toggle('is-active', soundOn);
    audioBtn.setAttribute('aria-pressed', String(soundOn));
    const label = audioBtn.querySelector('[data-pb45-audio-label]');
    if (label) label.textContent = soundOn ? 'SOM DO ARQUIVO · ATIVO' : 'SOM DO ARQUIVO · OFF';
  }
  function playTone(kind) {
    if (!soundOn || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
      osc.type = 'sine'; osc.frequency.value = kind === 'danger' ? 170 : 430;
      gain.gain.setValueAtTime(.0001, now); gain.gain.exponentialRampToValueAtTime(kind === 'danger' ? .022 : .014, now + .018); gain.gain.exponentialRampToValueAtTime(.0001, now + .21);
      osc.connect(gain).connect(audioCtx.destination); osc.start(now); osc.stop(now + .23);
    } catch (_) {}
  }
  function startAudioReactive() {
    if (!analyser || reduce || motionPaused) return;
    if (window.__pb45AudioRAF) return;
    const buffer = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      window.__pb45AudioRAF = requestAnimationFrame(tick);
      if (!soundOn || !archive?.isConnected) { cancelAnimationFrame(window.__pb45AudioRAF); window.__pb45AudioRAF = 0; return; }
      analyser.getByteFrequencyData(buffer);
      let sum = 0; for (let i=0;i<24;i++) sum += buffer[i];
      const level = sum / 24 / 255;
      core?.style.setProperty('--pb45-audio-level', level.toFixed(3));
      core?.style.setProperty('filter', `drop-shadow(0 0 ${18 + level*44}px rgba(112,231,247,${.10 + level*.28}))`);
    };
    tick();
  }
  audioBtn?.addEventListener('click', toggleAudio);

  motionBtn?.addEventListener('click', () => {
    motionPaused = !motionPaused;
    page.classList.toggle('pb45-motion-paused', motionPaused);
    motionBtn.setAttribute('aria-pressed', String(motionPaused));
    motionBtn.textContent = motionPaused ? 'MOVIMENTO · PAUSADO' : 'MOVIMENTO · ATIVO';
    capsules.forEach(c => { c.style.animationPlayState = motionPaused ? 'paused' : ''; });
    if (motionPaused && window.__pb45AudioRAF) { cancelAnimationFrame(window.__pb45AudioRAF); window.__pb45AudioRAF = 0; }
  });

  const resizeObserver = new ResizeObserver(() => updateProgress());
  resizeObserver.observe(archive);

  page.querySelectorAll('a[href$=".html"]').forEach(a => a.addEventListener('click', () => document.documentElement.classList.add('pb45-leaving')));

  setProtocol(0, false);
  updateAudioUI();
})();
