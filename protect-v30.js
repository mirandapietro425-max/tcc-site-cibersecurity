(() => {
  const root = document.querySelector('.protect-experience');
  if (!root) return;
  const stage = root.querySelector('#protect-stage');
  const image = root.querySelector('#protect-image');
  const current = root.querySelector('#protect-counter-current');
  const title = root.querySelector('#protect-scene-title');
  const body = root.querySelector('#protect-scene-body');
  const meta = root.querySelector('#protect-meta');
  const status = root.querySelector('#protect-status');
  const control = root.querySelector('#protect-scene-control');
  const imageStep = root.querySelector('#protect-image-step');
  const imageCaption = root.querySelector('#protect-image-caption');
  const navCount = root.querySelector('#protect-nav-count');
  const progress = root.querySelector('#protect-nav-progress');
  const buttons = [...root.querySelectorAll('.protect-scene-btn')];
  const takeawayButtons = [...root.querySelectorAll('.protect-takeaway-grid button')];
  const replay = root.querySelector('#protect-explore');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scenes = [
    {
      img: 'assets/protect-story/01-guardiao-humano.png', alt: 'Guardião humano',
      meta: 'IDENTIDADE', title: 'A proteção começa por <em>você</em>.',
      body: 'Antes de proteger sistemas, precisamos saber quem está entrando. Identidade forte reduz o espaço para abuso antes do primeiro acesso.',
      control: 'MFA + autenticação', caption: 'IDENTIDADE', status: 'CAMADA ATIVA'
    },
    {
      img: 'assets/protect-story/02-dispositivo-protegido.png', alt: 'Dispositivo protegido',
      meta: 'DISPOSITIVO', title: 'Todo dispositivo é uma <em>porta</em>.',
      body: 'Atualização, configuração e autenticação transformam o endpoint em uma superfície controlada — não em um ponto cego.',
      control: 'Higiene + configuração', caption: 'ENDPOINT PROTEGIDO', status: 'CAMADA ATIVA'
    },
    {
      img: 'assets/protect-story/03-nucleo-rede.png', alt: 'Núcleo de rede',
      meta: 'REDE', title: 'Nenhum dispositivo está <em>isolado</em>.',
      body: 'Segmentação e menor privilégio restringem caminhos de movimentação e reduzem o impacto de uma conta comprometida.',
      control: 'Segmentação + privilégio', caption: 'NÚCLEO CONECTADO', status: 'CAMADA ATIVA'
    },
    {
      img: 'assets/protect-story/04-ameaca-hacker.png', alt: 'Ameaça hacker',
      meta: 'AMEAÇA', title: 'O ataque encontra <em>fricção</em>.',
      body: 'A ameaça observa, testa e procura uma brecha. Logs, sinais e controles tornam a aproximação percebida antes do impacto.',
      control: 'Logs + monitoramento', caption: 'ENTRADA INTERROMPIDA', status: 'SINAL DETECTADO'
    },
    {
      img: 'assets/protect-story/05-escudo-cibernetico.png', alt: 'Escudo cibernético',
      meta: 'ESCUDO', title: 'As camadas fecham o <em>circuito</em>.',
      body: 'Prevenção, detecção, resposta e recuperação formam uma defesa contínua — não uma parede única.',
      control: 'Prevenção + resposta', caption: 'PROTEÇÃO CONSOLIDADA', status: 'SISTEMA PROTEGIDO'
    }
  ];

  let index = 0;
  let lock = false;

  function render(i, animate = true) {
    i = Math.max(0, Math.min(scenes.length - 1, i));
    const s = scenes[i];
    index = i;
    buttons.forEach((b, k) => b.classList.toggle('is-active', k === i));
    current.textContent = String(i + 1).padStart(2, '0');
    navCount.textContent = `${String(i + 1).padStart(2, '0')} / 05`;
    progress.style.width = `${((i + 1) / scenes.length) * 100}%`;
    meta.textContent = s.meta;
    status.innerHTML = `<i></i> ${s.status}`;
    title.innerHTML = s.title;
    body.textContent = s.body;
    control.textContent = s.control;
    imageStep.textContent = `CAMADA ${String(i + 1).padStart(2, '0')}`;
    imageCaption.textContent = s.caption;
    stage.dataset.scene = String(i + 1);

    if (animate && !reduce) {
      image.classList.add('is-entering');
      lock = true;
      window.setTimeout(() => {
        image.src = s.img;
        image.alt = s.alt;
        image.onload = () => {
          requestAnimationFrame(() => image.classList.remove('is-entering'));
          window.setTimeout(() => { lock = false; }, 80);
        };
      }, 150);
    } else {
      image.src = s.img;
      image.alt = s.alt;
      image.classList.remove('is-entering');
      lock = false;
    }
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => render(Number(btn.dataset.step)));
  });
  takeawayButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      render(Number(btn.dataset.step));
      stage.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    });
  });
  replay?.addEventListener('click', () => {
    render(0, false);
    root.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  });

  let wheelLock = false;
  root.addEventListener('wheel', (event) => {
    if (Math.abs(event.deltaY) < 12 || wheelLock || lock) return;
    const rect = stage.getBoundingClientRect();
    const inside = rect.top < innerHeight * .72 && rect.bottom > innerHeight * .28;
    if (!inside) return;
    const next = index + (event.deltaY > 0 ? 1 : -1);
    if (next < 0 || next >= scenes.length) return;
    event.preventDefault();
    wheelLock = true;
    render(next);
    window.setTimeout(() => { wheelLock = false; }, reduce ? 40 : 520);
  }, { passive: false });

  const io = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (!entry.isIntersecting) return;
    const ratio = Math.min(1, Math.max(0, entry.intersectionRatio));
    if (ratio > .35 && !lock && index === 0 && entry.boundingClientRect.top < innerHeight * .25) {
      // Keep the initial scene stable; scrolling no longer scrubs the entire page.
    }
  }, { threshold: [0, .35, .8] });
  io.observe(stage);
  render(0, false);
})();
