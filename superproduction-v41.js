(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const path = location.pathname.toLowerCase();
  const map = path.includes('laboratorio') ? ['laboratorio','cybershield-laboratorio.mp3','cybershield-laboratorio.jpg']
    : path.includes('privacidade') ? ['privacidade','cybershield-privacidade.mp3','cybershield-privacidade.jpg']
    : path.includes('cadeia') ? ['cadeia','cybershield-cadeia.mp3','cybershield-cadeia-seven-stages-ptbr.png']
    : path.includes('radar') ? ['radar','cybershield-radar.mp3','cybershield-radar.jpg']
    : path.includes('playbook') ? ['playbook','cybershield-playbook.mp3','cybershield-archive.jpg']
    : ['home','cybershield-home.mp3','cybershield-city.jpg'];
  const [page,audioFile,imageFile] = map;
  document.documentElement.dataset.spPage=page;
  if(!document.body.classList.contains('sp-enhanced')) document.body.classList.add('sp-enhanced');

  const style=document.createElement('style'); style.textContent=`body::selection{background:rgba(112,231,247,.25)} body.sp-enhanced{--sp-image:url("assets/superproduction-v41/${imageFile}")}`; document.head.appendChild(style);
  const layer=document.createElement('div'); layer.className='sp-cinematic-layer'; layer.setAttribute('aria-hidden','true'); document.body.prepend(layer);
  const beacon=document.createElement('div'); beacon.className='sp-story-beacon'; beacon.innerHTML='<i></i><span>CYBERSHIELD / EXPERIÊNCIA ATIVA</span>'; document.body.appendChild(beacon);
  const bar=document.createElement('div'); bar.className='sp-transition-bar'; document.body.appendChild(bar);

  // Use transform-only parallax for a subtle art-directed camera feel.
  if(!reduce && !coarse){
    let raf=0,lastX=0,lastY=0;
    const update=()=>{raf=0; const x=(lastX/innerWidth-.5)*2, y=(lastY/innerHeight-.5)*2; layer.style.transform=`translate3d(${x*5}px,${y*3}px,0)`};
    addEventListener('pointermove',e=>{lastX=e.clientX;lastY=e.clientY;if(!raf)raf=requestAnimationFrame(update)},{passive:true});
  }

  const audio=document.createElement('audio'); audio.preload='metadata'; audio.loop=true; audio.src=`assets/superproduction-v41/${audioFile}`; audio.setAttribute('aria-hidden','true'); audio.style.display='none'; document.body.appendChild(audio);
  let on=false;
  const existing = document.querySelector('#sound-toggle,.sound,#privacy-sound,.ps-sound,#audio-hud');
  // Existing pages keep their native sound systems. Add V41 ambient control only where no native control exists.
  const button = existing ? null : (()=>{const b=document.createElement('button');b.className='sp-audio-toggle';b.type='button';b.textContent='SOM · OFF';b.setAttribute('aria-pressed','false');document.body.appendChild(b);return b})();
  const updateAudio=()=>{on=!on; if(on){audio.volume=.13; audio.play().catch(()=>{on=false});}else{audio.pause();} if(button){button.textContent=on?'SOM · ATIVO':'SOM · OFF';button.setAttribute('aria-pressed',String(on));}};
  button?.addEventListener('click',(e)=>{e.stopPropagation();updateAudio()});
  // Native View Transition API handles document navigation progressively; never hijack ordinary links.
})();
