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
  const control = root.querySelector('#protect-control');
  const imageStep = root.querySelector('#protect-image-step');
  const imageCaption = root.querySelector('#protect-image-caption');
  const imageHint = root.querySelector('#protect-image-hint');
  const navCount = root.querySelector('#protect-nav-count');
  const progress = root.querySelector('#protect-nav-progress');
  const miniTitle = root.querySelector('#protect-mini-title');
  const miniBody = root.querySelector('#protect-mini-body');
  const buttons = [...root.querySelectorAll('.protect-scene-btn')];
  const summaryButtons = [...root.querySelectorAll('.protect-summary-grid button')];
  const replay = root.querySelector('#protect-explore');
  const bgLayers = [...root.querySelectorAll('.protect-bg-image')];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scenes = [
    {img:'assets/protect-story/01-guardiao-humano.png',alt:'Guardião humano',bg:'command',meta:'IDENTIDADE',title:'A proteção começa por <em>você</em>.',body:'Antes de proteger sistemas, precisamos saber quem está entrando. Identidade forte reduz o espaço para abuso antes do primeiro acesso.',control:'MFA + autenticação',caption:'IDENTIDADE',status:'CAMADA ATIVA',miniTitle:'MFA ativo',miniBody:'Uma identidade validada reduz a superfície de abuso.'},
    {img:'assets/protect-story/02-dispositivo-protegido.png',alt:'Dispositivo protegido',bg:'command',meta:'DISPOSITIVO',title:'Todo dispositivo é uma <em>porta</em>.',body:'Atualização, configuração e autenticação transformam o endpoint em uma superfície controlada — não em um ponto cego.',control:'Higiene + configuração',caption:'ENDPOINT PROTEGIDO',status:'CAMADA ATIVA',miniTitle:'Endpoint controlado',miniBody:'Configuração e atualização reduzem a superfície exposta.'},
    {img:'assets/protect-story/03-nucleo-rede.png',alt:'Núcleo de rede',bg:'command',meta:'REDE',title:'Nenhum dispositivo está <em>isolado</em>.',body:'Segmentação e menor privilégio restringem caminhos de movimentação e reduzem o impacto de uma conta comprometida.',control:'Segmentação + privilégio',caption:'NÚCLEO CONECTADO',status:'CAMADA ATIVA',miniTitle:'Caminhos reduzidos',miniBody:'Segmentação impede que uma falha se transforme em movimento lateral.'},
    {img:'assets/protect-story/04-ameaca-hacker.png',alt:'Ameaça hacker',bg:'threat',meta:'AMEAÇA',title:'O ataque encontra <em>fricção</em>.',body:'A ameaça observa, testa e procura uma brecha. Logs, sinais e controles tornam a aproximação percebida antes do impacto.',control:'Logs + monitoramento',caption:'ENTRADA INTERROMPIDA',status:'SINAL DETECTADO',miniTitle:'Anomalia percebida',miniBody:'Um sinal antes do impacto muda o tempo de resposta.'},
    {img:'assets/protect-story/05-escudo-cibernetico.png',alt:'Escudo cibernético',bg:'protected',meta:'ESCUDO',title:'As camadas fecham o <em>circuito</em>.',body:'Prevenção, detecção, resposta e recuperação formam uma defesa contínua — não uma parede única.',control:'Prevenção + resposta',caption:'PROTEÇÃO CONSOLIDADA',status:'SISTEMA PROTEGIDO',miniTitle:'Proteção consolidada',miniBody:'As camadas trabalham juntas para reduzir e conter o impacto.'}
  ];

  let index = 0;
  let lock = false;
  let wheelLock = false;
  let transitionTimer = 0;

  function swapBg(name){
    bgLayers.forEach(layer => layer.classList.toggle('is-active', layer.dataset.bg === name));
  }

  function render(i, animate=true){
    i = Math.max(0, Math.min(scenes.length-1, i));
    const s = scenes[i];
    index = i;
    buttons.forEach((b,k)=>b.classList.toggle('is-active',k===i));
    current.textContent=String(i+1).padStart(2,'0');
    navCount.textContent=`${String(i+1).padStart(2,'0')} / 05`;
    progress.style.width=`${((i+1)/scenes.length)*100}%`;
    meta.textContent=s.meta;
    status.innerHTML=`<i></i> ${s.status}`;
    title.innerHTML=s.title;
    body.textContent=s.body;
    control.querySelector('b').textContent=s.control;
    imageStep.textContent=`CAMADA ${String(i+1).padStart(2,'0')}`;
    imageCaption.textContent=s.caption;
    imageHint.textContent= i===4 ? 'SISTEMA CONSOLIDADO' : 'CLIQUE PARA DETALHAR';
    miniTitle.textContent=s.miniTitle;
    miniBody.textContent=s.miniBody;
    stage.dataset.scene=String(i+1);
    swapBg(s.bg);

    if(transitionTimer) clearTimeout(transitionTimer);
    if(animate && !reduce){
      lock=true;
      image.classList.add('is-entering');
      transitionTimer=setTimeout(()=>{
        image.src=s.img;
        image.alt=s.alt;
        image.onload=()=>requestAnimationFrame(()=>image.classList.remove('is-entering'));
        image.onerror=()=>image.classList.remove('is-entering');
        transitionTimer=setTimeout(()=>{lock=false;},500);
      },170);
    } else {
      image.src=s.img;
      image.alt=s.alt;
      image.classList.remove('is-entering');
      lock=false;
    }
  }

  buttons.forEach(btn=>btn.addEventListener('click',()=>render(Number(btn.dataset.step))));
  summaryButtons.forEach(btn=>btn.addEventListener('click',()=>{
    render(Number(btn.dataset.step));
    stage.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'});
  }));
  replay?.addEventListener('click',()=>{
    render(0,false);
    root.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
  });
  control?.addEventListener('click',()=>{
    const item=summaryButtons[index];
    item?.animate?.([{transform:'translateX(0)'},{transform:'translateX(7px)'},{transform:'translateX(0)'}],{duration:360});
  });

  root.addEventListener('wheel',(event)=>{
    if(reduce || Math.abs(event.deltaY)<14 || wheelLock || lock) return;
    const rect=stage.getBoundingClientRect();
    if(!(rect.top < innerHeight*.70 && rect.bottom > innerHeight*.30)) return;
    const next=index+(event.deltaY>0?1:-1);
    if(next<0 || next>=scenes.length) return;
    event.preventDefault();
    wheelLock=true;
    render(next);
    setTimeout(()=>{wheelLock=false;},560);
  },{passive:false});

  render(0,false);
})();
