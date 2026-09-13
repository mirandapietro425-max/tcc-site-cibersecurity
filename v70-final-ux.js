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

  function reveal(el){
    if(!el || seen.has(el)) return;
    if(!document.body.classList.contains('experience-started')) return;
    seen.add(el);
    el.querySelectorAll('.v70-letter').forEach((letter,i)=>{
      const delay=reduced?0:Math.min(i,36)*22;
      setTimeout(()=>{
        letter.classList.add('is-visible');
        if(!reduced && audio && document.body.classList.contains('experience-started')){
          try{ audio.currentTime=0; audio.volume=(i%2?.035:.05); const p=audio.play(); p?.catch?.(()=>{});}catch(_){}
        }
      },delay);
    });
  }

  function init(){
    document.querySelectorAll('.chapter-content h2:not(.hero-3d), .gateway-choice-head h2').forEach(wrapTextNodes);
    const heads=[...document.querySelectorAll('.chapter-content h2:not(.hero-3d), .gateway-choice-head h2')];
    if(!heads.length) return;
    if(reduced || !('IntersectionObserver' in window)){ heads.forEach(reveal); return; }
    const io=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){ reveal(entry.target); io.unobserve(entry.target); }
      });
    },{root:null,rootMargin:'-34% 0px -38% 0px',threshold:0.01});
    heads.forEach(h=>{ h.querySelectorAll('.v70-letter').forEach(s=>s.classList.remove('is-visible')); io.observe(h); });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
