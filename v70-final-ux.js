/* CyberShield V70 Final — preserve HTML, reveal letters on actual viewport arrival. */
(() => {
  'use strict';
  const root = document;
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const audio = root.getElementById('sfx-click');
  const seen = new WeakSet();

  function wrapTextNodes(el){
    if(!el || el.dataset.v70Wrapped==='1') return;
    el.dataset.v70Wrapped='1';
    const walker=document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode(node){
        if(!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if(node.parentElement?.closest('button,a')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes=[]; let n; while(n=walker.nextNode()) nodes.push(n);
    nodes.forEach(node=>{
      const frag=document.createDocumentFragment();
      [...node.nodeValue].forEach((ch,i)=>{
        if(ch==='\n' || ch==='\r') { frag.appendChild(document.createTextNode(ch)); return; }
        const s=document.createElement('span'); s.className='v70-letter';
        s.textContent=ch===' '?'\u00a0':ch; s.style.setProperty('--v70-delay',`${Math.min(i,36)*22}ms`);
        frag.appendChild(s);
      });
      node.parentNode.replaceChild(frag,node);
    });
  }

  function playLetterSound(i){
    if(reduced || !audio || !document.body.classList.contains('experience-started')) return;
    try{
      audio.currentTime=0;
      audio.volume=(i%2?.035:.05);
      const p=audio.play();
      p?.catch?.(()=>{});
    }catch(_){ }
  }

  function reveal(el, immediate=false){
    if(!el || seen.has(el)) return;
    if(!document.body.classList.contains('experience-started')) return;
    seen.add(el);
    const letters=[...el.querySelectorAll('.v70-letter')];
    letters.forEach((letter,i)=>{
      const delay=immediate?Math.min(i,36)*42:(reduced?0:Math.min(i,36)*34);
      setTimeout(()=>{
        letter.classList.add('is-visible');
        playLetterSound(i);
      },delay);
    });
  }

  function revealIntro(){
    const intro=document.querySelector('.chapter-intro .hero-3d');
    if(intro) reveal(intro,true);
  }

  function init(){
    document.querySelectorAll('.chapter-content h2:not(.hero-3d), .gateway-choice-head h2, .chapter-intro .hero-3d').forEach(wrapTextNodes);
    const heads=[...document.querySelectorAll('.chapter-content h2:not(.hero-3d), .gateway-choice-head h2')];
    heads.forEach(h=>h.querySelectorAll('.v70-letter').forEach(s=>s.classList.remove('is-visible')));

    // The intro is a deliberate exception: it reveals immediately after the user enters.
    const startIntro=()=>setTimeout(revealIntro,90);
    document.addEventListener('cybershield:started', startIntro, {once:true});
    document.getElementById('boot-start')?.addEventListener('click',()=>setTimeout(revealIntro,120),{once:true});
    if(document.body.classList.contains('experience-started')) startIntro();

    if(!heads.length) return;
    if(reduced || !('IntersectionObserver' in window)){
      // Reduced-motion/accessibility fallback: reveal only when the chapter is already on screen.
      heads.forEach(h=>{
        const r=h.getBoundingClientRect();
        if(r.top < innerHeight*.72 && r.bottom > innerHeight*.28) reveal(h);
      });
      return;
    }

    const io=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting) return;
        reveal(entry.target);
        io.unobserve(entry.target);
      });
    },{root:null,rootMargin:'-28% 0px -42% 0px',threshold:0.01});
    heads.forEach(h=>io.observe(h));
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
