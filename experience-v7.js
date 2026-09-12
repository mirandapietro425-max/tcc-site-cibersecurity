(function(){
  'use strict';
  const root=document.documentElement;
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const q=(s,c=document)=>c.querySelector(s);
  const qa=(s,c=document)=>Array.from(c.querySelectorAll(s));

  root.dataset.csMotion=reduce?'off':'on';

  // Reveal only after observer is ready; content never becomes permanently hidden.
  if(!reduce && 'IntersectionObserver' in window){
    const obs=new IntersectionObserver((entries,observer)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.08,rootMargin:'0px 0px -10% 0px'});
    qa('.reveal').forEach(el=>obs.observe(el));
  }else qa('.reveal').forEach(el=>el.classList.add('is-visible'));

  // Global progress bar.
  const progress=q('#scroll-progress');
  let raf=0;
  const paint=()=>{
    raf=0;
    const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    const pct=Math.min(100,Math.max(0,(scrollY/max)*100));
    if(progress) progress.style.width=pct+'%';
    updateStory();
  };
  addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(paint)},{passive:true});
  addEventListener('resize',()=>{if(!raf)raf=requestAnimationFrame(paint)},{passive:true});

  // Cinematic story: scroll position changes the active security layer.
  const scene=q('.story-scene');
  const panels=qa('.story-panel');
  const nodes=qa('.story-node');
  const core=q('.story-core');
  const meter=qa('.story-meter i');
  function updateStory(){
    if(!scene||reduce)return;
    const r=scene.getBoundingClientRect();
    const total=Math.max(1,r.height-innerHeight);
    const p=Math.max(0,Math.min(1,-r.top/total));
    const idx=Math.min(panels.length-1,Math.floor(p*panels.length));
    panels.forEach((el,i)=>el.classList.toggle('is-active',i===idx));
    meter.forEach((el,i)=>el.classList.toggle('is-active',i===idx));
    const angle=(-22+p*44).toFixed(2);
    const scale=(.92+p*.16).toFixed(3);
    const y=(p*18).toFixed(1);
    if(core)core.style.transform=`translate3d(0,${y}px,0) scale(${scale}) rotate(${angle}deg)`;
    nodes.forEach((n,i)=>{
      const dir=i%2===0?1:-1;
      const amount=(p*24*dir).toFixed(1);
      const base=n.dataset.base||'';
      n.dataset.base=base;
      n.style.transform=`translate3d(${amount}px,${(-p*18*(i%3))}px,0)`;
    });
  }
  updateStory();

  // Micro spotlight, only for fine pointers.
  if(!reduce && matchMedia('(pointer:fine)').matches){
    qa('.focus-card,.threat-card,.tcc-insight,.data-step').forEach(card=>{
      card.addEventListener('pointermove',e=>{
        const r=card.getBoundingClientRect();
        card.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');
        card.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');
      });
    });
  }

  // Mobile navigation with safe viewport bounds.
  const toggle=q('#menu-toggle'),nav=q('#nav-links');
  if(toggle&&nav){
    const close=()=>{nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open')};
    toggle.addEventListener('click',()=>{
      const open=!nav.classList.contains('is-open');
      nav.classList.toggle('is-open',open);
      toggle.setAttribute('aria-expanded',String(open));
      document.body.classList.toggle('menu-open',open);
    });
    qa('a',nav).forEach(a=>a.addEventListener('click',close));
    addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  }
})();
