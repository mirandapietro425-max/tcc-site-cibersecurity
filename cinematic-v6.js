(function(){
  'use strict';
  const root=document.documentElement;
  root.classList.remove('reveal-ready');

  const q=(s,c=document)=>c.querySelector(s);
  const qa=(s,c=document)=>Array.from(c.querySelectorAll(s));
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Reveal motion is explicitly enabled only after the observer is ready. */
  const reveals=qa('.reveal');
  if('IntersectionObserver' in window && !reduce){
    const observer=new IntersectionObserver((entries,obs)=>{
      for(const entry of entries){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      }
    },{threshold:0.08,rootMargin:'0px 0px -8% 0px'});
    root.classList.add('reveal-ready');
    requestAnimationFrame(()=>reveals.forEach(el=>observer.observe(el)));
  }else{
    reveals.forEach(el=>el.classList.add('is-visible'));
  }

  /* Scroll progress: clamped, so it never paints beyond 100%. */
  const progress=q('#scroll-progress');
  let ticking=false;
  function onScroll(){
    if(ticking)return;
    ticking=true;
    requestAnimationFrame(()=>{
      const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
      const pct=Math.min(100,Math.max(0,(window.scrollY/max)*100));
      if(progress)progress.style.width=pct+'%';

      const hero=q('.hero-visual');
      if(hero && window.innerWidth>920 && !reduce){
        const rect=hero.closest('.hero')?.getBoundingClientRect();
        const delta=rect ? Math.max(-26,Math.min(26,(-rect.top*0.035))) : 0;
        hero.style.setProperty('--hero-parallax',delta.toFixed(1)+'px');
      }
      ticking=false;
    });
  }
  addEventListener('scroll',onScroll,{passive:true});
  addEventListener('resize',onScroll,{passive:true});
  onScroll();

  /* Spotlight micro-interaction: disabled for coarse pointers. */
  if(!reduce && matchMedia('(pointer:fine)').matches){
    qa('.focus-card,.threat-card,.tcc-insight,.data-step').forEach(card=>{
      card.addEventListener('pointermove',ev=>{
        const r=card.getBoundingClientRect();
        card.style.setProperty('--mx',((ev.clientX-r.left)/r.width*100).toFixed(1)+'%');
        card.style.setProperty('--my',((ev.clientY-r.top)/r.height*100).toFixed(1)+'%');
      });
      card.addEventListener('pointerleave',()=>{
        card.style.setProperty('--mx','50%');
        card.style.setProperty('--my','50%');
      });
    });
  }

  /* Mobile navigation: close on escape and lock accidental page scroll while open. */
  const toggle=q('#menu-toggle'),nav=q('#nav-links');
  if(toggle&&nav){
    const close=()=>{
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded','false');
      document.body.classList.remove('menu-open');
    };
    toggle.addEventListener('click',()=>{
      const open=!nav.classList.contains('is-open');
      if(open){nav.classList.add('is-open');toggle.setAttribute('aria-expanded','true');document.body.classList.add('menu-open');}
      else close();
    });
    qa('a',nav).forEach(a=>a.addEventListener('click',close));
    addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  }

  /* Accessible focus cue for keyboard users. */
  addEventListener('keydown',e=>{
    if(e.key==='Tab')document.body.classList.add('keyboard-user');
  },{once:true});
})();
