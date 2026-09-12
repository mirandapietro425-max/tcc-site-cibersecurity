(() => {
  'use strict';
  const root=document.querySelector('.attack-page'); if(!root)return;
  // Dedicated chain gateway: the scene is a live system that carries state into the seven-stage theater.
  const art=document.querySelector('.chain-hero-art');
  const nodes=[...document.querySelectorAll('.chain-hero-node')];
  if(!art||!nodes.length)return;
  const theater=document.querySelector('#theater');
  const stageMap=['recon','weapon','delivery','exploit','install','c2','objectives'];
  function activate(i){
    nodes.forEach((n,k)=>n.classList.toggle('is-live',k===i));
    art.dataset.liveStage=String(i+1);
    root.style.setProperty('--chain-gateway-progress',`${((i+1)/nodes.length)*100}%`);
  }
  nodes.forEach((n,i)=>{
    n.addEventListener('click',()=>{
      activate(i);
      document.querySelector('#attack-scene')?.setAttribute('data-stage',stageMap[i]);
      document.querySelector('#attack-scene')?.scrollIntoView({behavior:'smooth',block:'center'});
      document.querySelector('#attack-rail-list')?.querySelectorAll('.rail-btn')[i]?.click();
    });
  });
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){const ratio=e.intersectionRatio; const i=Math.min(nodes.length-1,Math.max(0,Math.round(ratio*(nodes.length-1)))); activate(i);} }),{threshold:[.12,.25,.4,.55,.7,.85]});
  io.observe(art);
  activate(0);
})();
