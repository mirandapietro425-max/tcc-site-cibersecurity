(() => {
  const root = document.querySelector('.protect-cinema');
  if (!root) return;
  const stage = root.querySelector('#protect-cinema-stage');
  const image = root.querySelector('#protect-cinema-main-image');
  const title = root.querySelector('#protect-cinema-title');
  const body = root.querySelector('#protect-cinema-body');
  const kicker = root.querySelector('#protect-cinema-kicker');
  const status = root.querySelector('#protect-cinema-status');
  const control = root.querySelector('#protect-cinema-control');
  const chips = root.querySelector('#protect-cinema-chips');
  const surfaceImage = root.querySelector('#protect-cinema-surface-image');
  const surfaceTitle = root.querySelector('#protect-cinema-surface-title');
  const surfaceBody = root.querySelector('#protect-cinema-surface-body');
  const sceneCurrent = root.querySelector('#protect-cinema-current');
  const sceneNav = root.querySelector('#protect-cinema-nav');
  const progress = root.querySelector('#protect-cinema-progress');
  const artLabel = root.querySelector('#protect-cinema-art-label');
  const steps = [...root.querySelectorAll('.protect-cinema-step')];
  const dots = [...root.querySelectorAll('.protect-cinema-dot')];
  const assets = [...root.querySelectorAll('.protect-cinema-asset')];
  const backgrounds = [...root.querySelectorAll('.protect-cinema-bg-layer')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const audioToggle = root.querySelector('#protect-cinema-audio');
  const enter = root.querySelector('#protect-cinema-enter');
  const transitionAudio = new Audio('assets/audio/transition.wav');
  const ambientAudio = new Audio('assets/audio/cybershield-ambient-hazy-after-hours.mp3');
  transitionAudio.preload = 'auto';
  ambientAudio.preload = 'auto';
  ambientAudio.loop = true;
  ambientAudio.volume = .13;

  const scenes = [
    {
      bg:'command', img:'assets/protect-story/01-guardiao-humano.png', asset:'assets/protect/cybershield_hacker.png',
      label:'IDENTIDADE', step:'01', status:'CAMADA ATIVA', kicker:'QUEM PODE ATRAVESSAR', title:'A primeira barreira é <em>saber quem entra.</em>',
      body:'Credenciais, MFA e contexto de acesso transformam uma porta invisível em uma decisão verificável. Antes do incidente, existe uma pergunta simples: quem é você?',
      control:'MFA + autenticação', surfaceTitle:'CONTEXTO DE ACESSO', surfaceBody:'Identidade validada antes de liberar o próximo passo.', chips:['MFA','ACESSO','CONTEXTO']
    },
    {
      bg:'command', img:'assets/protect-story/02-dispositivo-protegido.png', asset:'assets/protect/cybershield_old_phone.png',
      label:'DISPOSITIVO', step:'02', status:'CAMADA ATIVA', kicker:'A PORTA TEM ESTADO', title:'Todo dispositivo revela uma <em>superfície.</em>',
      body:'Atualizações, configuração segura e controle do endpoint reduzem a quantidade de caminhos que um atacante pode explorar. O dispositivo deixa de ser ponto cego e vira ativo governado.',
      control:'Higiene + configuração', surfaceTitle:'SUPERFÍCIE REDUZIDA', surfaceBody:'Menos exposição. Mais previsibilidade operacional.', chips:['PATCH','ENDPOINT','CONFIGURAÇÃO']
    },
    {
      bg:'network', img:'assets/protect-story/03-nucleo-rede.png', asset:'assets/protect/cybershield_router.png',
      label:'REDE', step:'03', status:'CAMADA ATIVA', kicker:'CAMINHOS CONTROLADOS', title:'A segurança cresce quando a rede <em>deixa de confiar.</em>',
      body:'Segmentação, menor privilégio e caminhos definidos impedem que um acesso comprometido vire liberdade de movimento. A rede cria limites mesmo quando alguém atravessa uma camada.',
      control:'Segmentação + privilégio', surfaceTitle:'CAMINHOS LIMITADOS', surfaceBody:'Cada conexão precisa de contexto e autorização.', chips:['SEGMENTAÇÃO','PRIVILÉGIO','FLUXO']
    },
    {
      bg:'threat', img:'assets/protect-story/04-ameaca-hacker.png', asset:'assets/protect/cybershield_hero_scene.png',
      label:'AMEAÇA', step:'04', status:'SINAL DETECTADO', kicker:'A APROXIMAÇÃO É PERCEBIDA', title:'O ataque encontra <em>fricção.</em>',
      body:'Logs, sinais e monitoramento transformam uma aproximação silenciosa em evento observável. A defesa não precisa esperar o impacto para começar a responder.',
      control:'Logs + monitoramento', surfaceTitle:'VISIBILIDADE ATIVA', surfaceBody:'O comportamento estranho deixa rastros antes do dano.', chips:['LOGS','SINAIS','DETECÇÃO']
    },
    {
      bg:'protected', img:'assets/protect-story/05-escudo-cibernetico.png', asset:'assets/protect/cybershield_robot.png',
      label:'ESCUDO', step:'05', status:'SISTEMA PROTEGIDO', kicker:'DEFESA EM PROFUNDIDADE', title:'As camadas fecham o <em>circuito.</em>',
      body:'Prevenção, detecção, resposta e recuperação formam um sistema contínuo. O objetivo não é prometer risco zero — é limitar impacto, aprender rápido e voltar ao controle.',
      control:'Prevenção + resposta', surfaceTitle:'RESILIÊNCIA', surfaceBody:'Falhar não vira colapso quando existe caminho de recuperação.', chips:['PREVENIR','RESPONDER','RECUPERAR']
    }
  ];
  const preloads = [...new Set(scenes.flatMap(s => [s.img,s.asset]))];
  preloads.forEach(src => { const img = new Image(); img.src = src; });
  let index = 0;
  let locked = false;
  let ambientOn = false;
  let wheelBlocked = false;

  function playTransition(){
    if (reduced) return;
    transitionAudio.currentTime = 0;
    transitionAudio.play().catch(() => {});
  }
  function setBackground(key){
    backgrounds.forEach(b => b.classList.toggle('is-active', b.dataset.bg === key));
  }
  function render(next, animate = true){
    next = Math.max(0, Math.min(scenes.length - 1, next));
    const s = scenes[next];
    index = next;
    steps.forEach((b,i) => b.classList.toggle('is-active', i === next));
    dots.forEach((d,i) => d.classList.toggle('is-active', i === next));
    assets.forEach((b,i) => b.classList.toggle('is-active', i === next));
    sceneCurrent.textContent = s.step;
    sceneNav.textContent = `${s.step} / 05`;
    progress.style.width = `${((next + 1) / scenes.length) * 100}%`;
    kicker.textContent = s.kicker;
    status.innerHTML = `<i></i>${s.status}`;
    title.innerHTML = s.title;
    body.textContent = s.body;
    control.textContent = s.control;
    artLabel.textContent = s.label;
    surfaceTitle.textContent = s.surfaceTitle;
    surfaceBody.textContent = s.surfaceBody;
    chips.innerHTML = s.chips.map(c => `<span class="protect-cinema-chip">${c}</span>`).join('');
    setBackground(s.bg);
    if (animate && !reduced) {
      image.classList.add('is-entering');
      locked = true;
      window.setTimeout(() => {
        image.src = s.img;
        image.alt = s.label;
        surfaceImage.src = s.asset;
        requestAnimationFrame(() => image.classList.remove('is-entering'));
        window.setTimeout(() => { locked = false; }, 120);
      }, 160);
      playTransition();
    } else {
      image.src = s.img;
      image.alt = s.label;
      surfaceImage.src = s.asset;
      image.classList.remove('is-entering');
      locked = false;
    }
  }

  function move(delta){
    const next = index + delta;
    if (locked || next < 0 || next >= scenes.length) return;
    render(next);
  }
  steps.forEach(btn => btn.addEventListener('click', () => render(Number(btn.dataset.step))));
  dots.forEach((dot,i) => dot.addEventListener('click', () => render(i)));
  assets.forEach(btn => btn.addEventListener('click', () => render(Number(btn.dataset.step))));
  enter?.addEventListener('click', () => stage.scrollIntoView({behavior:reduced?'auto':'smooth', block:'center'}));
  root.addEventListener('wheel', event => {
    if (Math.abs(event.deltaY) < 18 || wheelBlocked || locked) return;
    const r = stage.getBoundingClientRect();
    const inside = r.top < innerHeight * .74 && r.bottom > innerHeight * .28;
    if (!inside) return;
    const next = index + (event.deltaY > 0 ? 1 : -1);
    if (next < 0 || next >= scenes.length) return;
    event.preventDefault();
    wheelBlocked = true;
    render(next);
    window.setTimeout(() => { wheelBlocked = false; }, reduced ? 40 : 620);
  }, {passive:false});
  window.addEventListener('keydown', event => {
    if (!document.body.contains(root)) return;
    if (event.key === 'ArrowDown' || event.key === 'PageDown') move(1);
    if (event.key === 'ArrowUp' || event.key === 'PageUp') move(-1);
  });
  stage.addEventListener('pointermove', event => {
    if (reduced || window.innerWidth < 900 || locked) return;
    const x = (event.clientX / window.innerWidth - .5) * 2;
    const y = (event.clientY / window.innerHeight - .5) * 2;
    image.style.transform = `translate3d(${x * 8}px,${y * 5}px,0) scale(1.01)`;
  });
  stage.addEventListener('pointerleave', () => { image.style.transform = ''; });
  audioToggle?.addEventListener('click', () => {
    ambientOn = !ambientOn;
    audioToggle.textContent = ambientOn ? 'Som ambiente · ligado' : 'Som ambiente · desligado';
    if (ambientOn) ambientAudio.play().catch(() => {}); else ambientAudio.pause();
  });
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && ambientOn) ambientAudio.play().catch(() => {});
    });
  }, {threshold:.25});
  io.observe(stage);
  window.addEventListener('beforeunload', () => { ambientAudio.pause(); transitionAudio.pause(); });
  render(0, false);
})();
