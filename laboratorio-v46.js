(() => {
  'use strict';
  const root = document.querySelector('.lab46-chamber');
  if (!root) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const art = root.querySelector('.lab46-art');
  const nodes = [...root.querySelectorAll('.lab46-node')];
  const title = root.querySelector('[data-lab46-title]');
  const body = root.querySelector('[data-lab46-body]');
  const tags = root.querySelector('[data-lab46-tags]');
  const status = root.querySelector('[data-lab46-status]');
  const audioBox = root.querySelector('.lab46-audio');
  const audioBtn = root.querySelector('[data-lab46-audio]');
  const progress = [...root.querySelectorAll('.lab46-progress span')];
  const audio = new Audio('assets/superproduction-v41/cybershield-laboratorio.mp3');
  audio.loop = true;
  audio.preload = 'metadata';
  audio.volume = 0.28;
  let audioOn = false;
  let current = 0;

  const states = [
    {title:'INTERCEPTAR',body:'Um incidente entrou no campo. Antes de decidir, deixe o laboratório revelar o canal, a pressão e o pedido.',tags:['CANAL','CONTEXTO','SINAL'],status:'SINAL RECEBIDO',scene:0},
    {title:'INSPECIONAR',body:'A superfície parece convincente porque foi desenhada para parecer. Separe aparência, origem e intenção.',tags:['ORIGEM','URGÊNCIA','PEDIDO'],status:'EVIDÊNCIA ABERTA',scene:1},
    {title:'CORRELACIONAR',body:'Uma pista sozinha pode ser ruído. Quando domínio, pressão e solicitação apontam para a mesma direção, surge um padrão.',tags:['PADRÃO','3 PISTAS','RISCO'],status:'CORRELAÇÃO ATIVA',scene:2},
    {title:'DECIDIR',body:'A decisão segura não precisa ser rápida. Ela precisa criar distância entre o impulso e a confirmação.',tags:['PAUSE','VERIFY','ACT'],status:'DECISÃO NECESSÁRIA',scene:3}
  ];
  function render(i, scroll=false){
    current = Math.max(0, Math.min(states.length-1, i));
    const s = states[current];
    nodes.forEach((n,k)=>n.classList.toggle('is-active',k===current));
    progress.forEach((p,k)=>p.classList.toggle('is-on',k<=current));
    title.textContent = s.title;
    body.textContent = s.body;
    status.textContent = s.status;
    tags.innerHTML = s.tags.map(t=>`<span class="lab46-tag">${t}</span>`).join('');
    root.dataset.state = String(current+1);
    if(scroll) root.querySelector('.lab46-detail')?.scrollIntoView({behavior:reduce?'auto':'smooth',block:'nearest'});
  }
  nodes.forEach((n,i)=>{
    n.addEventListener('click',()=>render(i,true));
    n.addEventListener('keydown',e=>{ if(e.key==='ArrowRight'){e.preventDefault();nodes[(i+1)%nodes.length].focus();render((i+1)%nodes.length);} if(e.key==='ArrowLeft'){e.preventDefault();nodes[(i-1+nodes.length)%nodes.length].focus();render((i-1+nodes.length)%nodes.length);} });
  });
  audioBtn?.addEventListener('click',async()=>{
    try{
      if(!audioOn){await audio.play();audioOn=true;audioBox.classList.add('is-on');audioBtn.textContent='Som do laboratório · ativo';}
      else{audio.pause();audioOn=false;audioBox.classList.remove('is-on');audioBtn.textContent='Som do laboratório · desligado';}
    }catch(err){audioBtn.textContent='Som indisponível';}
  });
  if(!reduce && window.matchMedia('(pointer:fine)').matches){
    root.addEventListener('pointermove',e=>{
      const r=root.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/Math.max(r.height,1)-.5;
      art.style.transform=`translate3d(${x*-10}px,${y*-6}px,0) scale(1.06)`;
    },{passive:true});
    root.addEventListener('pointerleave',()=>{art.style.transform='translate3d(0,0,0) scale(1.04)';},{passive:true});
  }
  const io=new IntersectionObserver(entries=>entries.forEach(en=>root.classList.toggle('is-inview',en.isIntersecting)),{threshold:.12});
  io.observe(root);
  render(0,false);
})();
