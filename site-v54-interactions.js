(() => {
  'use strict';
  const reduce = matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia?.('(pointer:fine)').matches;
  const page = document.body?.dataset?.spPage || location.pathname.split('/').pop().replace(/\.html$/,'') || 'home';
  const audioMap = {
    home:'assets/superproduction-v41/cybershield-home.mp3',
    radar:'assets/superproduction-v41/cybershield-radar.mp3',
    playbook:'assets/superproduction-v41/cybershield-playbook.mp3',
    laboratorio:'assets/superproduction-v41/cybershield-laboratorio.mp3',
    privacidade:'assets/superproduction-v41/cybershield-privacidade.mp3',
    'cadeia-ataque':'assets/superproduction-v41/cybershield-cadeia.mp3',
    cadeia:'assets/superproduction-v41/cybershield-cadeia.mp3'
  };

  function ambientAudio(){
    let audios = [...document.querySelectorAll('audio')].filter(a => /\.mp3(?:\?|$)/i.test(a.currentSrc || a.src || ''));
    const preferred = audioMap[page];
    let primary = preferred ? audios.find(a => (a.currentSrc || a.src || '').includes(preferred.replace(/^assets\//,''))) : null;
    if (!primary && preferred && audios.length) primary = audios.find(a => (a.currentSrc || a.src || '').includes(preferred.split('/').pop())) || null;
    if (!primary && preferred) {
      const a = document.createElement('audio');
      a.src = preferred; a.loop = true; a.preload='auto'; a.volume=.11; a.id='cs-v54-ambient';
      document.body.appendChild(a); primary=a; audios=[a];
    }
    if (!primary) primary = audios[0];
    if (!primary) return;
    primary.loop = true;
    if (!primary.volume || primary.volume > .16) primary.volume=.11;
    let mutedByUser = false;
    const sync = (on) => {
      document.querySelectorAll('.sp42-audio-toggle,.r43-audio,.pb45-audio,#chain-sound-top,.chain-sound,[data-lab46-audio],#protect-v32-mute,#sound-toggle,.ps-sound,#privacy-sound').forEach(btn => {
        btn.setAttribute('aria-pressed', String(on));
        btn.classList.toggle('is-active', on);
        const label = btn.querySelector?.('[data-pb45-audio-label]');
        if (label) label.textContent = on ? 'SOM · ON' : 'SOM · OFF';
        if (!label && btn.id === 'chain-sound-top') btn.textContent = `Som da sequência · ${on?'ON':'OFF'}`;
        if (!label && btn.matches?.('.r43-audio')) { const s=btn.querySelector('span'); if(s)s.textContent=`SOM DO UNIVERSO · ${on?'ON':'OFF'}`; }
        if (!label && btn.matches?.('.sp42-audio-toggle')) { const s=btn.querySelector('span:last-child'); if(s)s.textContent=on?'SOM DO UNIVERSO · ATIVO':'SOM DO UNIVERSO · OFF'; }
      });
    };
    async function play(){
      if (mutedByUser) return false;
      try { primary.volume = .11; await primary.play(); sync(true); return true; }
      catch { return false; }
    }
    function stop(){ primary.pause(); sync(false); }
    window.__cs54AudioPlay = play;
    window.__cs54AudioStop = stop;
    window.__cs54AudioPrimary = primary;
    primary.addEventListener('play',()=>sync(true));
    primary.addEventListener('pause',()=>sync(false));
    // Best-effort autoplay. Browsers may require a gesture.
    play();
    const unlock = async () => {
      if (mutedByUser) return;
      await play();
      if (!primary.paused) {
        removeEventListener('pointerdown',unlock,true);
        removeEventListener('touchstart',unlock,true);
        removeEventListener('keydown',unlock,true);
      }
    };
    addEventListener('pointerdown',unlock,true);
    addEventListener('touchstart',unlock,true);
    addEventListener('keydown',unlock,true);
    document.addEventListener('visibilitychange',()=>{ if(!document.hidden && !mutedByUser) play(); });
    document.addEventListener('click',e=>{
      const btn=e.target.closest?.('.sp42-audio-toggle,.r43-audio,.pb45-audio,#chain-sound-top,.chain-sound,[data-lab46-audio],#protect-v32-mute,#sound-toggle,.ps-sound,#privacy-sound');
      if(!btn) return;
      // Let page-specific handlers run, then align the shared audio state.
      setTimeout(()=>{
        if (primary.paused) { mutedByUser=true; sync(false); }
        else { mutedByUser=false; sync(true); }
      },80);
    },true);
  }

  function createArtMotion(){
    const stages = [...document.querySelectorAll('.sp42-art-stage')];
    if (!stages.length || page === 'cadeia' || page === 'cadeia-ataque') return;
    stages.forEach((stage, stageIndex) => {
      const existing = stage.querySelector('.cs-v54-motion'); if(existing) return;
      const layer=document.createElement('div'); layer.className='cs-v54-motion';
      const veil=document.createElement('div'); veil.className='cs-v54-stage-veil'; layer.appendChild(veil);
      const probe=document.createElement('div'); probe.className='cs-v54-probe'; layer.appendChild(probe);
      const trail=[]; for(let i=0;i<4;i++){const t=document.createElement('div');t.className='cs-v54-trail';layer.appendChild(t);trail.push(t);}
      for(let i=0;i<8;i++){const p=document.createElement('div');p.className='cs-v54-particle';p.style.left=`${8+(i*13)%84}%`;p.style.top=`${12+(i*19)%76}%`;p.style.animationDelay=`-${i*0.7}s`;layer.appendChild(p);}
      stage.appendChild(layer);
      const spots=[...stage.querySelectorAll('.sp42-hotspot')].map(h=>({x:parseFloat(h.style.left)||50,y:parseFloat(h.style.top)||50}));
      if(!spots.length) spots.push({x:50,y:50});
      let active=0, start=performance.now(), visible=true;
      const io=new IntersectionObserver(es=>visible=es.some(e=>e.isIntersecting),{threshold:.05});io.observe(stage);
      stage.addEventListener('pointermove',e=>{
        const r=stage.getBoundingClientRect();
        const mx=(e.clientX-r.left)/r.width-.5, my=(e.clientY-r.top)/r.height-.5;
        stage.style.setProperty('--mx',`${mx*8}px`);stage.style.setProperty('--my',`${my*7}px`);stage.classList.add('cs-v54-hover');
      },{passive:true});
      stage.addEventListener('pointerleave',()=>{stage.style.setProperty('--mx','0px');stage.style.setProperty('--my','0px');stage.classList.remove('cs-v54-hover');},{passive:true});
      function posAt(t){
        const segment=Math.floor(t)%spots.length, next=(segment+1)%spots.length, p=t-Math.floor(t), e=p*p*(3-2*p);
        return {x:spots[segment].x+(spots[next].x-spots[segment].x)*e,y:spots[segment].y+(spots[next].y-spots[segment].y)*e};
      }
      function frame(ts){
        if(!visible || document.hidden){requestAnimationFrame(frame);return;}
        const elapsed=(ts-start)/2300; const p=posAt(elapsed);
        probe.style.left=`${p.x}%`;probe.style.top=`${p.y}%`;
        trail.forEach((el,i)=>{const q=posAt(Math.max(0,elapsed-i*.08));el.style.left=`${q.x}%`;el.style.top=`${q.y}%`;el.style.opacity=String(.48-i*.09);});
        if (!reduce) requestAnimationFrame(frame);
      }
      if(!reduce) requestAnimationFrame(frame);
      stage.querySelectorAll('.sp42-hotspot').forEach((h,i)=>h.addEventListener('click',()=>{active=i;start=performance.now()-i*2300;}, {passive:true}));
    });
  }

  function createChainMotion(){
    const pageRoot=document.querySelector('.attack-page');
    if(!pageRoot) return;
    const stage=document.querySelector('#hero-stage');
    const art=document.querySelector('.chain-hero-art');
    if(!stage || !art) return;
    const layer=document.createElement('div'); layer.className='cs-v54-motion';
    const drone=document.createElement('div'); drone.className='cs-v54-chain-drone'; drone.innerHTML='<span class="cs-v54-chain-ring"></span>'; layer.appendChild(drone);
    for(let i=0;i<5;i++){const p=document.createElement('span');p.className='cs-v54-chain-packet';p.style.left=`${8+i*19}%`;p.style.top=`${42+(i%2)*15}%`;p.style.animationDelay=`-${i*.34}s`;layer.appendChild(p);}
    stage.appendChild(layer);
    const nodes=[...art.querySelectorAll('.chain-hero-node')];
    const coords=nodes.map(n=>({x:parseFloat(getComputedStyle(n).left)||50,y:parseFloat(getComputedStyle(n).top)||50,el:n}));
    let start=performance.now(); let visible=true;
    const io=new IntersectionObserver(es=>visible=es.some(e=>e.isIntersecting),{threshold:.05});io.observe(stage);
    stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;art.style.setProperty('--hero-mx',`${x*10}px`);art.style.setProperty('--hero-my',`${y*8}px`);},{passive:true});
    stage.addEventListener('pointerleave',()=>{art.style.setProperty('--hero-mx','0px');art.style.setProperty('--hero-my','0px');},{passive:true});
    nodes.forEach((n,i)=>n.addEventListener('click',()=>{start=performance.now()-i*1450;}));
    function frame(ts){
      if(!visible||document.hidden){requestAnimationFrame(frame);return;}
      const total=coords.length*1.45, t=((ts-start)/1000)%total, seg=Math.floor(t/1.45), local=(t%1.45)/1.45;
      const a=coords[seg], b=coords[(seg+1)%coords.length], e=local*local*(3-2*local);
      const x=a.x+(b.x-a.x)*e, y=a.y+(b.y-a.y)*e;
      drone.style.left=`${x}%`;drone.style.top=`${y}%`;
      coords.forEach((c,i)=>c.el.classList.toggle('is-live',i===seg));
      if(!reduce) requestAnimationFrame(frame);
    }
    if(!reduce) requestAnimationFrame(frame);
  }

  function enrichRadar(){
    const hero=document.querySelector('.r43-hero');
    if(hero && !hero.querySelector('.cs-v54-radar-beacon')){
      const b=document.createElement('span');b.className='cs-v54-radar-beacon';b.style.left='67%';b.style.top='28%';hero.appendChild(b);
    }
    const scope=document.querySelector('#radar-observatory .r43-scope-stage');
    if(scope){
      const signals=[...scope.querySelectorAll('.r43-signal-btn')];
      signals.forEach((b,i)=>{b.style.setProperty('--signal-delay',`${i*.14}s`);b.animate?.([{transform:'translateY(4px)',opacity:.45},{transform:'translateY(0)',opacity:1}],{duration:700,delay:i*70,easing:'ease-out',fill:'both'});});
    }
  }

  function enrichLab(){
    const root=document.querySelector('.lab46-chamber'); if(!root||root.querySelector('.cs-v54-lab-scan')) return;
    const scan=document.createElement('div');scan.className='cs-v54-lab-scan';root.appendChild(scan);
  }
  function enrichPrivacy(){
    const quiet=document.querySelector('#ps-quiet'); if(!quiet||quiet.querySelector('.cs-v54-data-orbit')) return;
    const orbit=document.createElement('div');orbit.className='cs-v54-data-orbit';quiet.appendChild(orbit);
  }
  function enrichPlaybook(){
    const archive=document.querySelector('.pb45-archive');if(!archive||archive.querySelector('.cs-v54-archive-beacon'))return;
    const beacon=document.createElement('span');beacon.className='cs-v54-archive-beacon';beacon.style.left='18%';beacon.style.top='27%';archive.appendChild(beacon);
  }

  function boot(){
    ambientAudio();
    createArtMotion();
    createChainMotion();
    enrichRadar();enrichLab();enrichPrivacy();enrichPlaybook();
    document.body.dataset.csV54='ready';
  }
  if(document.readyState==='loading') addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();
