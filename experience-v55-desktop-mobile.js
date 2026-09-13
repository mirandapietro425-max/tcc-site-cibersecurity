(function(){
  'use strict';
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const page = document.body?.dataset?.spPage || (document.body?.className||'').split(/\s+/).find(c=>['radar','playbook','laboratorio','privacidade','cadeia-ataque'].includes(c)) || '';
  root.classList.add('cs-v55-runtime');

  function mark(sel, cls){
    document.querySelectorAll(sel).forEach((el,i)=>{
      if(el.dataset.csV55Motion) return;
      el.dataset.csV55Motion='1';
      el.classList.add(cls);
      el.style.animationDelay = `${(i%7)*-0.55}s`;
    });
  }

  // Always-on environmental motion; pointer interaction remains an enhancement, not a prerequisite.
  mark('.hero-haze,.hero-orbit,.final-glow,.lab-ambient,.ps-rights-orbit','cs-v55-drift');
  mark('.r43-corr-node.danger,.r43-system-pill i,.live-dot','cs-v55-pulse');
  mark('.r43-scope-art,.ps-hero-bg','cs-v55-drift');

  // Keep visuals alive even on desktop where hover-based controllers may choose to remain idle.
  const fine = window.matchMedia?.('(pointer:fine)').matches;
  if(!reduce && fine){
    let raf=0,lastX=.5,lastY=.5;
    const move=e=>{
      lastX=e.clientX/innerWidth; lastY=e.clientY/innerHeight;
      if(raf) return;
      raf=requestAnimationFrame(()=>{
        raf=0;
        const x=(lastX-.5)*2,y=(lastY-.5)*2;
        document.documentElement.style.setProperty('--cs-pointer-x',`${x.toFixed(3)}`);
        document.documentElement.style.setProperty('--cs-pointer-y',`${y.toFixed(3)}`);
      });
    };
    addEventListener('pointermove',move,{passive:true});
  }

  // Audio is owned by the page-specific controller. This layer only exposes a safe state hook.
  // Do not create a second <audio> element or a second click handler here.
  const primaryAudio = document.querySelector('#ambient,#chain-audio,[data-r43-audio-file],audio[data-page-audio]');
  if(primaryAudio){
    primaryAudio.volume = Math.min(primaryAudio.volume || .55,.65);
    primaryAudio.addEventListener('play',()=>document.body.classList.add('cs-audio-on'),{passive:true});
    primaryAudio.addEventListener('pause',()=>document.body.classList.remove('cs-audio-on'),{passive:true});
  }

  // Mobile-safe active navigation: expose a compact scroll cue, never hide primary content.
  const nav = document.querySelector('.primary-nav,.immersive-nav');
  if(nav) nav.setAttribute('aria-label',nav.getAttribute('aria-label')||'Navegação principal');

  // Detect media/canvas sizing errors and force a second layout pass after fonts/images settle.
  const relayout=()=>{
    document.querySelectorAll('canvas').forEach(c=>{ if(c.clientWidth<2 || c.clientHeight<2){ const p=c.parentElement; if(p){ c.style.width='100%'; c.style.height='100%'; } } });
  };
  addEventListener('load',()=>setTimeout(relayout,120));
  addEventListener('resize',()=>setTimeout(relayout,80),{passive:true});

  // Generic reveal fallback: content remains visible even if an observer/controller fails.
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target);}}),{rootMargin:'0px 0px -8% 0px',threshold:.04});
    document.querySelectorAll('.reveal,.ps-scene,.r43-correlation,.r43-finish,.signal-gallery,.final-attack-cta,.lab46-chamber').forEach(el=>{el.classList.add('cs-v55-observed');io.observe(el);});
  }

  root.dataset.csV55Page=page;
})();
