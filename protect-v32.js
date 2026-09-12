(() => {
  const root = document.querySelector('.protect-command');
  if (!root) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scenes = [
    {
      id:'01', label:'IDENTIDADE', kicker:'01 / QUEM PODE ENTRAR', title:'Tudo começa antes do <em>ataque.</em>',
      copy:'Identidade forte transforma uma porta invisível em uma decisão verificável. MFA, autenticação e contexto reduzem a chance de um acesso legítimo ser confundido com confiança automática.',
      control:'MFA · autenticação · contexto', bg:'command', art:'assets/protect-story/01-guardiao-humano.png',
      signal:'IDENTIDADE VALIDADA', metric:'MFA / ON'
    },
    {
      id:'02', label:'DISPOSITIVO', kicker:'02 / A SUPERFÍCIE', title:'Todo dispositivo carrega uma <em>história.</em>',
      copy:'Atualizações, configurações seguras e higiene de endpoint reduzem caminhos exploráveis. O dispositivo deixa de ser um ponto cego e passa a ser um ativo governado.',
      control:'patch · configuração · endpoint', bg:'command', art:'assets/protect-story/02-dispositivo-protegido.png',
      signal:'SUPERFÍCIE REDUZIDA', metric:'PATCH / OK'
    },
    {
      id:'03', label:'REDE', kicker:'03 / CAMINHOS CONTROLADOS', title:'A rede precisa saber <em>até onde confiar.</em>',
      copy:'Segmentação e menor privilégio limitam movimentação lateral. Mesmo quando uma camada é atravessada, o caminho seguinte continua exigindo contexto e autorização.',
      control:'segmentação · privilégio · fluxo', bg:'network', art:'assets/protect-story/03-nucleo-rede.png',
      signal:'CAMINHO LIMITADO', metric:'TRUST / LOW'
    },
    {
      id:'04', label:'AMEAÇA', kicker:'04 / O SINAL APARECE', title:'O ataque encontra <em>fricção.</em>',
      copy:'Logs, sinais e monitoramento fazem o comportamento estranho aparecer antes de virar impacto. Visibilidade encurta o tempo entre observar, entender e responder.',
      control:'logs · detecção · monitoramento', bg:'threat', art:'assets/protect-story/04-ameaca-hacker.png',
      signal:'ANOMALIA DETECTADA', metric:'RISK / WATCH'
    },
    {
      id:'05', label:'ESCUDO', kicker:'05 / DEFESA CONTÍNUA', title:'As camadas fecham o <em>circuito.</em>',
      copy:'Prevenção, detecção, resposta e recuperação formam uma defesa contínua. Não é uma promessa de risco zero; é a capacidade de preservar controle quando algo falha.',
      control:'prevenir · responder · recuperar', bg:'protected', art:'assets/protect-story/05-escudo-cibernetico.png',
      signal:'SISTEMA PROTEGIDO', metric:'DEFENSE / READY'
    }
  ];

  const $ = s => root.querySelector(s);
  const $$ = s => [...root.querySelectorAll(s)];
  const stage = $('#protect-v32-stage');
  const art = $('#protect-v32-art');
  const bgLayers = $$('.protect-v32-bg-layer');
  const dots = $$('.protect-v32-dot');
  const railItems = $$('.protect-v32-rail-item');
  const galleryItems = $$('.protect-v32-file');
  const current = $('#protect-v32-current');
  const label = $('#protect-v32-label');
  const kicker = $('#protect-v32-kicker');
  const title = $('#protect-v32-title');
  const copy = $('#protect-v32-copy');
  const control = $('#protect-v32-control-value');
  const signal = $('#protect-v32-signal');
  const metric = $('#protect-v32-metric');
  const progress = $('#protect-v32-progress');
  const play = $('#protect-v32-play');
  const mute = $('#protect-v32-mute');
  const team = $('#protect-v32-team');
  const enter = $('#protect-v32-enter');

  const audio = new Audio('assets/audio/cybershield-ambient-hazy-after-hours.mp3');
  const transition = new Audio('assets/audio/transition.wav');
  audio.loop = true; audio.volume = .10;
  transition.volume = .10;
  let audioOn = false;
  let index = 0;
  let moving = false;
  let wheelCooldown = false;

  const preloads = scenes.flatMap(s => [s.art]);
  root.querySelectorAll('img').forEach(img => { if (img.src) preloads.push(img.src); });
  [...new Set(preloads)].forEach(src => { const img = new Image(); img.src = src; });

  function setScene(next, animate = true) {
    next = Math.max(0, Math.min(scenes.length - 1, next));
    if (moving && animate) return;
    const s = scenes[next];
    index = next;
    railItems.forEach((el,i) => el.classList.toggle('is-active', i === next));
    dots.forEach((el,i) => el.classList.toggle('is-active', i === next));
    galleryItems.forEach((el,i) => el.classList.toggle('is-active', Number(el.dataset.scene) === next));
    bgLayers.forEach(el => el.classList.toggle('is-active', el.dataset.bg === s.bg));
    current.textContent = s.id;
    label.textContent = s.label;
    kicker.textContent = s.kicker;
    title.innerHTML = s.title;
    copy.textContent = s.copy;
    control.textContent = s.control;
    signal.textContent = s.signal;
    metric.textContent = s.metric;
    progress.style.width = `${((next + 1) / scenes.length) * 100}%`;
    if (animate && !reduced) {
      moving = true;
      art.classList.add('is-changing');
      root.classList.add(`scene-${next + 1}`);
      setTimeout(() => {
        art.src = s.art;
        art.alt = s.label;
        requestAnimationFrame(() => art.classList.remove('is-changing'));
        setTimeout(() => { moving = false; }, 260);
      }, 180);
      transition.currentTime = 0;
      transition.play().catch(() => {});
    } else {
      art.src = s.art; art.alt = s.label; art.classList.remove('is-changing'); moving = false;
      root.classList.add(`scene-${next + 1}`);
    }
  }

  function step(delta) {
    const next = index + delta;
    if (next < 0 || next >= scenes.length) return;
    setScene(next);
  }

  railItems.forEach((el,i) => el.addEventListener('click', () => setScene(i)));
  dots.forEach((el,i) => el.addEventListener('click', () => setScene(i)));
  galleryItems.forEach(el => el.addEventListener('click', () => setScene(Number(el.dataset.scene))));
  enter?.addEventListener('click', () => stage.scrollIntoView({behavior: reduced ? 'auto' : 'smooth', block:'center'}));
  play?.addEventListener('click', () => {
    team.classList.toggle('is-paused');
    play.textContent = team.classList.contains('is-paused') ? 'Continuar movimento' : 'Pausar movimento';
  });
  mute?.addEventListener('click', () => {
    audioOn = !audioOn;
    mute.textContent = audioOn ? 'Som ambiente · ligado' : 'Som ambiente · desligado';
    audioOn ? audio.play().catch(() => {}) : audio.pause();
  });

  root.addEventListener('wheel', e => {
    const r = stage.getBoundingClientRect();
    const focus = r.top < innerHeight * .72 && r.bottom > innerHeight * .28;
    if (!focus || Math.abs(e.deltaY) < 18 || wheelCooldown || moving) return;
    const next = index + (e.deltaY > 0 ? 1 : -1);
    if (next < 0 || next >= scenes.length) return;
    e.preventDefault();
    wheelCooldown = true;
    setScene(next);
    setTimeout(() => { wheelCooldown = false; }, reduced ? 80 : 620);
  }, {passive:false});

  window.addEventListener('keydown', e => {
    if (!root.matches(':hover') && document.activeElement?.closest('.protect-command') == null) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); step(1); }
    if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); step(-1); }
    if (e.key === 'Home') { e.preventDefault(); setScene(0); }
    if (e.key === 'End') { e.preventDefault(); setScene(scenes.length - 1); }
  });

  stage.addEventListener('pointermove', e => {
    if (reduced || innerWidth < 900 || moving) return;
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    art.style.transform = `translate3d(${x * 12}px,${y * 8}px,0) scale(1.015)`;
  });
  stage.addEventListener('pointerleave', () => { art.style.transform = ''; });

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && audioOn) audio.play().catch(() => {});
    });
  }, {threshold:.22});
  io.observe(stage);

  setScene(0, false);
})();
