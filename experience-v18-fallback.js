
(() => {
  'use strict';
  /*
    Fallback layer: text/interaction/scroll behavior remains alive even if
    the Three.js module cannot be imported.
  */
  const $ = (s,c=document) => c.querySelector(s);
  const $$ = (s,c=document) => [...c.querySelectorAll(s)];
  const chapters = $$('.chapter');
  const progress = $('#topbar-progress-fill');
  let ticking=false;
  const intro = document.querySelector('.hero-3d');
  // V21 is the authoritative controller. This layer becomes inert once it has loaded.
  const primaryLoaded = () => window.__cyberShieldExperienceLoaded === true;

  const animateText = chapter => {
    if (!chapter) return;
    $$('.chapter-content > *, .intro-copy > *', chapter).forEach((el,i)=>{
      el.animate(
        [{opacity:0, transform:'translate3d(0,28px,0)'},{opacity:1, transform:'translate3d(0,0,0)'}],
        {duration:650,delay:Math.min(i*50,250),easing:'cubic-bezier(.2,.8,.2,1)',fill:'both'}
      );
    });
  };

  const update = () => {
    ticking=false;
    if (primaryLoaded()) return;
    const center=innerHeight*.44;
    let active=0,best=Infinity;
    chapters.forEach((chapter,i)=>{
      const r=chapter.getBoundingClientRect();
      const d=Math.abs((r.top+r.height*.45)-center);
      if(d<best){best=d;active=i;}
      const local=Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight+Math.max(r.height,1))));
      chapter.style.setProperty('--scroll-progress',local.toFixed(4));

      const content=chapter.querySelector('.chapter-content') || chapter.querySelector('.intro-copy');
      if(content){
        const fromCenter=(r.top+r.height*.5)-center;
        const move=Math.max(-28,Math.min(28,-fromCenter*.045));
        const opacity=Math.max(.35,Math.min(1,1-Math.abs(fromCenter)/(innerHeight*1.8)));
        content.style.transform=`translate3d(0,${move}px,0)`;
        content.style.opacity=opacity;
      }

      if(i===0 && intro){
        const p=Math.max(0,Math.min(1,local));
        intro.style.transform=`perspective(900px) rotateX(${12-p*7}deg) translate3d(0,${(p-.5)*-16}px,${p*34}px) scale(${1+p*.035})`;
        intro.style.letterSpacing=`${(-0.08 + p*.01)}em`;
        intro.style.filter=`brightness(${.88+p*.22}) blur(${Math.max(0,.5-p*.5)}px)`;
      }
    });
    if(progress){
      const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
      progress.style.width=Math.max(0,Math.min(100,scrollY/max*100))+'%';
    }
    if(active!==window.__cyberShieldActiveScene){
      window.__cyberShieldOnSceneChange?.(active);
      window.__cyberShieldAnimateScene?.(chapters[active]);
      window.__cyberShieldActiveScene=active;
    }
  };

  const onScroll = () => { if(!ticking){ requestAnimationFrame(update); ticking=true; } };
  addEventListener('scroll',onScroll,{passive:true});
  addEventListener('resize',update);
  addEventListener('load',()=>setTimeout(update,40));

  $$('.scene-action[data-reveal]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      btn.classList.remove('is-pulse'); void btn.offsetWidth; btn.classList.add('is-pulse');
    });
  });
})();
