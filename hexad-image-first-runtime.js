(() => {
  'use strict';
  const root = document.querySelector('#hx71');
  const stage = document.querySelector('#hx71-storyboard-stage');
  const imgs = [document.querySelector('#hx71-storyboard-img-a'), document.querySelector('#hx71-storyboard-img-b')];
  const filmBtn = document.querySelector('#hx71-film');
  const playIndicator = document.querySelector('#hx71-play-indicator');
  if (!root || !stage || imgs.some(Boolean) === false) return;

  const frames = [
    {id:1,start:0,end:4.532,chapter:0},
    {id:2,start:4.532,end:5.035,chapter:0},
    {id:3,start:5.035,end:8.56,chapter:0},
    {id:4,start:8.56,end:9.064,chapter:0},
    {id:5,start:9.064,end:15.61,chapter:0},
    {id:6,start:15.61,end:16.113,chapter:0},
    {id:7,start:16.113,end:19.638,chapter:0},
    {id:8,start:19.638,end:20.142,chapter:0},
    {id:9,start:20.142,end:24.674,chapter:0},
    {id:10,start:24.674,end:25.177,chapter:0},
    {id:11,start:25.177,end:38.269,chapter:0},
    {id:12,start:38.269,end:40.784,chapter:1},
    {id:13,start:40.784,end:41.287,chapter:1},
    {id:14,start:41.287,end:43.801,chapter:1},
    {id:15,start:43.801,end:44.304,chapter:1},
    {id:16,start:44.304,end:47.824,chapter:1},
    {id:17,start:47.824,end:48.327,chapter:1},
    {id:18,start:48.327,end:52.852,chapter:1},
    {id:19,start:52.852,end:53.355,chapter:1},
    {id:20,start:53.355,end:55.869,chapter:1},
    {id:21,start:55.869,end:56.372,chapter:1},
    {id:22,start:56.372,end:64.418,chapter:1},
    {id:23,start:64.418,end:68.441,chapter:1},
    {id:24,start:68.441,end:72.464,chapter:1},
    {id:25,start:72.464,end:80.589,chapter:1},
    {id:26,start:80.589,end:80.589,chapter:1},
    {id:27,start:80.589,end:84.1,chapter:2},
    {id:28,start:84.1,end:84.613,chapter:2},
    {id:29,start:84.613,end:88.204,chapter:2},
    {id:30,start:88.204,end:88.717,chapter:2},
    {id:31,start:88.717,end:92.307,chapter:2},
    {id:32,start:92.307,end:92.82,chapter:2},
    {id:33,start:92.82,end:99.489,chapter:2},
    {id:34,start:99.489,end:100.001,chapter:2},
    {id:35,start:100.001,end:114.364,chapter:2},
    {id:36,start:114.364,end:114.364,chapter:2},
    {id:37,start:114.364,end:114.364,chapter:2},
    {id:38,start:114.364,end:117.887,chapter:3},
    {id:39,start:117.887,end:118.39,chapter:3},
    {id:40,start:118.39,end:128.958,chapter:3},
    {id:41,start:128.958,end:129.462,chapter:3},
    {id:42,start:129.462,end:132.985,chapter:3},
    {id:43,start:132.985,end:133.488,chapter:3},
    {id:44,start:133.488,end:138.017,chapter:3},
    {id:45,start:138.017,end:138.52,chapter:3},
    {id:46,start:138.52,end:163.763,chapter:3},
    {id:47,start:163.763,end:163.843,chapter:3},
    {id:48,start:163.843,end:163.843,chapter:3},
    {id:49,start:163.843,end:171.291,chapter:4},
    {id:50,start:171.291,end:171.798,chapter:4},
    {id:51,start:171.798,end:178.391,chapter:4},
    {id:52,start:178.391,end:178.898,chapter:4},
    {id:53,start:178.898,end:185.492,chapter:4},
    {id:54,start:185.492,end:185.999,chapter:4},
    {id:55,start:185.999,end:204.764,chapter:4},
    {id:56,start:204.764,end:205.271,chapter:4},
    {id:57,start:205.271,end:223.61,chapter:4},
    {id:58,start:223.61,end:223.69,chapter:4},
    {id:59,start:223.69,end:223.69,chapter:4},
    {id:60,start:223.69,end:229.165,chapter:5},
    {id:61,start:229.165,end:229.677,chapter:5},
    {id:62,start:229.677,end:236.336,chapter:5},
    {id:63,start:236.336,end:236.848,chapter:5},
    {id:64,start:236.848,end:245.557,chapter:5},
    {id:65,start:245.557,end:246.069,chapter:5},
    {id:66,start:246.069,end:255.802,chapter:5},
    {id:67,start:255.802,end:256.314,chapter:5},
    {id:68,start:256.314,end:274.836,chapter:5},
    {id:69,start:274.836,end:274.916,chapter:5},
    {id:70,start:274.916,end:274.916,chapter:5},
    {id:71,start:274.916,end:284.227,chapter:6},
    {id:72,start:284.227,end:284.784,chapter:6},
    {id:73,start:284.784,end:298.712,chapter:6},
    {id:74,start:298.712,end:299.269,chapter:6},
    {id:75,start:299.269,end:309.854,chapter:6},
    {id:76,start:309.854,end:310.411,chapter:6},
    {id:77,start:310.411,end:322.111,chapter:6},
    {id:78,start:322.111,end:322.668,chapter:6},
    {id:79,start:322.668,end:336.119,chapter:6},
    {id:80,start:336.119,end:336.199,chapter:6},
    {id:81,start:336.199,end:336.199,chapter:6},
    {id:82,start:336.199,end:339.345,chapter:7},
    {id:83,start:339.345,end:339.818,chapter:7},
    {id:84,start:339.818,end:347.847,chapter:7},
    {id:85,start:347.847,end:348.32,chapter:7},
    {id:86,start:348.32,end:355.405,chapter:7},
    {id:87,start:355.405,end:355.877,chapter:7},
    {id:88,start:355.877,end:364.851,chapter:7},
    {id:89,start:364.851,end:365.323,chapter:7},
    {id:90,start:365.323,end:373.905,chapter:7},
    {id:91,start:373.905,end:373.905,chapter:7},
    {id:92,start:373.905,end:374.85,chapter:7},
    {id:93,start:374.85,end:374.85,chapter:7},
    {id:94,start:374.85,end:375.795,chapter:7},
    {id:95,start:375.795,end:375.795,chapter:7},
    {id:96,start:375.795,end:376.739,chapter:7},
    {id:97,start:376.739,end:376.819,chapter:7},
    {id:98,start:376.819,end:376.659,chapter:7},
  ];
  const duration = 376.659;
  let active = 0;
  let currentId = 1;
  let playing = false;
  let raf = 0;
  let startAt = 0;
  let baseTime = 0;
  let fallbackAudio = null;
  let audioIndex = -1;
  const audioFiles = Array.from({length:8}, (_,i) => `assets/hexad/audio/narration/narration-${String(i+1).padStart(2,'0')}.mp3`);

  const srcFor = (id) => `assets/hexad/storyboard/frames/${String(id).padStart(3,'0')}.webp`;
  const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
  const frameAt = (t) => {
    let lo=0, hi=frames.length-1, best=0;
    while(lo<=hi){ const m=(lo+hi)>>1; if(frames[m].start<=t){best=m;lo=m+1}else hi=m-1; }
    return frames[best] || frames[0];
  };
  const setFrame = (id, immediate=false) => {
    const idx = frames.findIndex(f => f.id === id);
    if(idx < 0 || id === currentId && !immediate) return;
    currentId = id;
    const nextLayer = (active + 1) % 2;
    const img = imgs[nextLayer];
    if(!img) return;
    const src = srcFor(id);
    img.src = src;
    img.setAttribute('fetchpriority', id === 1 ? 'high' : 'auto');
    img.loading = id === 1 ? 'eager' : 'lazy';
    img.decoding = 'async';
    img.dataset.frame = String(id);
    const owner = img.parentElement;
    owner?.style.setProperty('--hx-frame-image', `url("${src}")`);
    img.onload = () => {
      active = nextLayer;
      imgs.forEach((el,i)=>el?.classList.toggle('is-active', i === active));
      imgs[active]?.parentElement?.style.setProperty('--hx-frame-image', `url("${src}")`);
      const act = document.querySelector('#hx71-storyboard-act');
      if(act) act.textContent = `FRAME ${String(id).padStart(3,'0')} / 098`;
      const sync = document.querySelector('#hx71-storyboard-sync');
      if(sync) sync.textContent = playing ? 'NARRAÇÃO · SINCRONIZADA' : 'STORYBOARD · NAVEGAÇÃO';
    };
  };
  // First visual is deterministic and independent of Three.js/CDN execution.
  imgs[0]?.setAttribute('src', srcFor(1));
  imgs[0]?.setAttribute('fetchpriority','high');
  imgs[0]?.setAttribute('loading','eager');
  imgs[0]?.setAttribute('decoding','sync');
  imgs[0]?.parentElement?.style.setProperty('--hx-frame-image', `url("${srcFor(1)}")`);
  imgs[0]?.addEventListener('load', () => imgs[0].classList.add('is-active'), {once:true});
  const loader = document.querySelector('#hx72-loader');
  const reveal = () => loader?.classList.add('is-done');
  if (imgs[0]?.complete) setTimeout(reveal, 160); else imgs[0]?.addEventListener('load', () => setTimeout(reveal, 120), {once:true});
  imgs[0]?.addEventListener('error', () => { imgs[0].src = 'assets/hexad/2d/hexad-overview.webp'; imgs[0].parentElement?.style.setProperty('--hx-frame-image', 'url("assets/hexad/2d/hexad-overview.webp")'); reveal(); }, {once:true});
  setTimeout(reveal, 1200);
  // Warm next frames without blocking first paint.
  [2,3,4].forEach(id => { const im = new Image(); im.decoding='async'; im.src=srcFor(id); });

  const timeFromScroll = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    return clamp((scrollY / max) * duration, 0, duration);
  };
  const visualTick = (tOverride) => {
    const t = typeof tOverride === 'number' ? tOverride : timeFromScroll();
    const f = frameAt(t);
    setFrame(f.id);
    const progress = document.querySelector('#hx71-progress-fill');
    if(progress) progress.style.width = `${(t/duration)*100}%`;
    const time = document.querySelector('#hx71-time');
    if(time) { const m=Math.floor(t/60), s=Math.floor(t%60); time.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`; }
    return t;
  };

  const chapterForTime = (t) => {
    const el = [...document.querySelectorAll('.hx71-chapter')].find(x => t >= Number(x.dataset.start) && t < Number(x.dataset.end));
    return el || document.querySelector('.hx71-chapter:last-of-type');
  };
  const updateNarration = (t) => {
    const track = frames.length && [
      [0,38.269],[38.269,80.509],[80.509,114.364],[114.364,163.683],
      [163.683,223.53],[223.53,274.756],[274.756,336.039],[336.039,376.659]
    ].findIndex(([a,b]) => t>=a && t<b);
    if(track < 0) return;
    if(track !== audioIndex){
      audioIndex=track;
      try{ fallbackAudio?.pause(); }catch{}
      fallbackAudio = new Audio(audioFiles[track]);
      fallbackAudio.preload='auto'; fallbackAudio.volume=.96;
      fallbackAudio.currentTime = Math.max(0, t - [0,38.269,80.509,114.364,163.683,223.53,274.756,336.039][track]);
      fallbackAudio.play().catch(()=>{});
    }else if(fallbackAudio && playing){
      const base = [0,38.269,80.509,114.364,163.683,223.53,274.756,336.039][track];
      const drift = Math.abs((fallbackAudio.currentTime||0) - (t-base));
      if(drift > .65){ try{fallbackAudio.currentTime = Math.max(0,t-base)}catch{} }
    }
  };

  const stop = () => {
    playing=false; cancelAnimationFrame(raf); raf=0; startAt=0;
    try{fallbackAudio?.pause()}catch{}; audioIndex=-1;
    if(playIndicator) playIndicator.hidden = true;
  };
  const tickPlay = (now) => {
    if(!playing) return;
    const t = clamp(baseTime + (now-startAt)/1000, 0, duration);
    const chapter = chapterForTime(t);
    const max = Math.max(1, document.documentElement.scrollHeight-innerHeight);
    if(max>1) scrollTo({top:(t/duration)*max,behavior:'auto'});
    visualTick(t); updateNarration(t);
    if(t>=duration-.02){ stop(); return; }
    raf=requestAnimationFrame(tickPlay);
  };
  const start = () => {
    if(playing) return;
    playing=true; document.body.classList.add('hx71-film-mode');
    if(playIndicator) playIndicator.hidden=false;
    baseTime = timeFromScroll();
    if(baseTime >= duration-.25) baseTime=0;
    startAt = performance.now();
    visualTick(baseTime);
    updateNarration(baseTime);
    raf=requestAnimationFrame(tickPlay);
  };
  const toggle = () => playing ? stop() : start();
  filmBtn?.addEventListener('click', () => {
    // This handler intentionally does not rely on the Three.js module.
    if(!window.__hexadModuleReady) toggle();
  }, {capture:true});

  addEventListener('scroll', () => { if(!playing && !window.__hexadModuleReady) visualTick(); }, {passive:true});
  addEventListener('resize', () => { if(!playing && !window.__hexadModuleReady) visualTick(); }, {passive:true});
  addEventListener('beforeunload', () => { try{fallbackAudio?.pause()}catch{}; });
  window.__hexadImageRuntime = {start, stop, setFrame, visualTick};
  document.body.classList.add('hx81-image-first');
  // Paint the first frame immediately. A black loader/3D bootstrap must never gate the artwork.
  visualTick(0);
})();
