
// Robust module bootstrap: prefer jsDelivr, then fall back to esm.sh/unpkg.
// The cinematic fallback below still works if all WebGL/CDN imports fail.
let THREE, GLTFLoader;
try {
  THREE = await import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js');
  ({GLTFLoader} = await import('https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js'));
} catch (primaryError) {
  console.warn('HEXAD primary Three.js CDN unavailable; trying fallback CDN.', primaryError);
  try {
    THREE = await import('https://esm.sh/three@0.180.0');
    ({GLTFLoader} = await import('https://esm.sh/three@0.180.0/examples/jsm/loaders/GLTFLoader.js?bundle'));
  } catch (secondaryError) {
    console.warn('HEXAD secondary Three.js CDN unavailable; enabling cinematic fallback.', secondaryError);
    window.__hexadThreeUnavailable = true;
  }
}

const BASE='assets/hexad/';
import { STORYBOARD_SEQUENCE } from './assets/hexad/storyboard/storyboard-sequence.js';
import { FRAME_CONTEXT } from './assets/hexad/storyboard/frame-context.js';
const frameSource=(id)=>{const n=String(id).padStart(3,'0'); return `${BASE}storyboard/frames/${n}.webp`;};
const frameContext=(id)=>FRAME_CONTEXT.find(x=>x.id===Number(id))||null;
const app=document.querySelector('#hx71');
const story=document.querySelector('#hx71-story');
const progressFill=document.querySelector('#hx71-progress-fill');
const timeLabel=document.querySelector('#hx71-time');
const chapterNo=document.querySelector('#hx71-chapter-no');
const chapterName=document.querySelector('#hx71-chapter-name');
const captionKicker=document.querySelector('#hx71-caption-kicker');
const captionText=document.querySelector('#hx71-caption-text');
const videoLayer=document.querySelector('.hx71-cinema-layer');
const cinemaVideo=document.querySelector('#hx71-cinema-video');
const storyboardStage=document.querySelector('#hx71-storyboard-stage');
const storyboardImgs=[document.querySelector('#hx71-storyboard-img-a'),document.querySelector('#hx71-storyboard-img-b')];
const storyboardAct=document.querySelector('#hx71-storyboard-act');
const storyboardSync=document.querySelector('#hx71-storyboard-sync');
let storyboardIndex=-1;
let storyboardLayer=0;
let storyboardRequestId=0;
let storyboardReady=[false,false];
const storyboardWarm=new Map();

function preloadStoryboard(id){
  if(storyboardWarm.has(id)) return storyboardWarm.get(id);
  const entry=STORYBOARD_SEQUENCE.find(x=>x.id===id);
  if(!entry) return Promise.resolve(false);
  const p=new Promise(resolve=>{const im=new Image(); im.decoding='async'; im.onload=()=>resolve(true); im.onerror=()=>resolve(false); im.src=frameSource(entry.id);});
  storyboardWarm.set(id,p);
  return p;
}

function storyboardIndexAt(t){
  let lo=0,hi=STORYBOARD_SEQUENCE.length-1,best=0;
  while(lo<=hi){const m=(lo+hi)>>1; if(STORYBOARD_SEQUENCE[m].cue<=t){best=m;lo=m+1}else hi=m-1;}
  return best;
}

async function syncStoryboard(t,force=false){
  if(!storyboardStage || !STORYBOARD_SEQUENCE.length) return;
  const idx=storyboardIndexAt(t);
  if(!force && idx===storyboardIndex) return;
  storyboardIndex=idx;
  const requestId=++storyboardRequestId;
  const entry=STORYBOARD_SEQUENCE[idx];
  // Always warm a generous look-ahead so the next authored image is ready before its cue.
  STORYBOARD_SEQUENCE.slice(idx+1, idx+5).forEach(e=>preloadStoryboard(e.id));
  const layer=(storyboardLayer+1)%2;
  const img=storyboardImgs[layer];
  if(!img) return;
  const src=frameSource(entry.id);
  img.src=src;
  img.alt=`Frame ${String(entry.id).padStart(3,'0')} do storyboard auditado`;
  const activate=()=>{
    if(requestId!==storyboardRequestId || idx!==storyboardIndex) return;
    storyboardLayer=layer;
    storyboardImgs.forEach((el,i)=>el?.classList.toggle('is-active',i===layer));
    if(storyboardAct) storyboardAct.textContent=`FRAME ${String(entry.id).padStart(3,'0')} / 098`;
    if(storyboardSync) storyboardSync.textContent=experience.playing?'NARRAÇÃO · SINCRONIZADA':'STORYBOARD · NAVEGAÇÃO';
  };
  if(img.complete && img.naturalWidth>0) activate();
  else {
    img.addEventListener('load',activate,{once:true});
    img.addEventListener('error',()=>{ if(storyboardSync) storyboardSync.textContent='STORYBOARD · FALLBACK'; },{once:true});
  }
}


// Warm the opening frames without delaying boot.
[1,2,3,4].forEach(preloadStoryboard);
const forcePanel=document.querySelector('#hx71-force-panel');
const memoryDrawer=document.querySelector('#hx71-memory-drawer');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const loaderEl=document.querySelector('#hx72-loader');
const loaderBar=document.querySelector('#hx72-loader-bar-fill');
const loaderCopy=document.querySelector('#hx72-loader-copy');

const DURATION=376.659;
let filmPlaybackRate=1;
const chapters=[
  {id:'void',name:'O VAZIO',start:0,end:38.269,cap:'O VAZIO',copy:'Partículas quase imóveis.'},
  {id:'birth',name:'O NASCIMENTO',start:38.269,end:80.509,cap:'FORMAÇÃO',copy:'O fragmento encontra estrutura.'},
  {id:'forces',name:'AS SEIS FORÇAS',start:80.509,end:109.4,cap:'SEIS CONDIÇÕES',copy:'Uma informação, seis propriedades.'},
  {id:'equilibrium',name:'O EQUILÍBRIO',start:109.4,end:114.364,cap:'EQUILÍBRIO',copy:'Tudo responde em conjunto.'},
  {id:'threat',name:'A AMEAÇA',start:114.364,end:163.683,cap:'AMEAÇA',copy:'O sistema observa.'},
  {id:'collapse',name:'O COLAPSO',start:163.683,end:223.53,cap:'COLAPSO',copy:'O universo não explode. Ele falha.'},
  {id:'investigation',name:'A INVESTIGAÇÃO',start:223.53,end:274.756,cap:'EVIDÊNCIA',copy:'Cada leitura reduz a incerteza.'},
  {id:'restoration',name:'A RESTAURAÇÃO',start:274.756,end:336.039,cap:'RESTAURAÇÃO',copy:'Detectar. Isolar. Reparar. Verificar. Restaurar. Estabilizar.'},
  {id:'synthesis',name:'A SÍNTESE',start:336.039,end:DURATION,cap:'SÍNTESE',copy:'Seis forças, um sistema, uma informação.'}
];

const worlds=[
  {name:'Confidencialidade',short:'acesso controlado',failure:'EXPOSE',model:'hexad-confidentiality.glb',track:'confidentiality',copy:'Somente quem deve ver a informação consegue alcançá-la.',meta:'isolamento / acesso controlado'},
  {name:'Posse / Controle',short:'domínio do ativo',failure:'STEAL',model:'hexad-possession.glb',track:'possession',copy:'A informação precisa permanecer sob controle legítimo.',meta:'vínculo / transferência / resistência'},
  {name:'Integridade',short:'conteúdo coerente',failure:'ALTER',model:'hexad-integrity.glb',track:'integrity',copy:'O conteúdo precisa permanecer correto ao atravessar o sistema.',meta:'continuidade / corrupção / reparo'},
  {name:'Autenticidade',short:'identidade verificável',failure:'SPOOF',model:'hexad-authenticity.glb',track:'authenticity',copy:'É preciso verificar de onde a informação realmente veio.',meta:'assinatura / identidade / verificação'},
  {name:'Disponibilidade',short:'acesso quando necessário',failure:'DISRUPT',model:'hexad-availability.glb',track:'availability',copy:'Uma informação segura precisa estar disponível quando o sistema precisa dela.',meta:'conexão / perda / reconexão'},
  {name:'Utilidade',short:'valor em contexto',failure:'CORRUPT',model:'hexad-utility.glb',track:'utility',copy:'Preservar dados não basta se eles deixam de cumprir seu propósito.',meta:'função / degradação / restauração'}
];

const audioTracks=[
  {start:0,end:38.269,file:'narration-01.mp3'},
  {start:38.269,end:80.509,file:'narration-02.mp3'},
  {start:80.509,end:114.364,file:'narration-03.mp3'},
  {start:114.364,end:163.683,file:'narration-04.mp3'},
  {start:163.683,end:223.53,file:'narration-05.mp3'},
  {start:223.53,end:274.756,file:'narration-06.mp3'},
  {start:274.756,end:336.039,file:'narration-07.mp3'},
  {start:336.039,end:DURATION,file:'narration-08.mp3'}
];

const media=[ 
  {start:0,end:25,file:'hexad-genesis.webm',fallback:'hexad-genesis.mp4'},
  {start:163.683,end:190,file:'hexad-collapse.webm',fallback:'hexad-collapse.mp4'},
  {start:274.756,end:289,file:'hexad-restoration.webm',fallback:'hexad-restoration.mp4'},
  {start:289,end:295.856,file:'hexad-integrity-repair.webm',fallback:null},
  {start:295.856,end:305,file:'hexad-authenticity-scan.webm',fallback:null},
  {start:305,end:312,file:'hexad-restoration.webm',fallback:'hexad-restoration.mp4'}
];

let experience={time:0,progress:0,playing:false,sound:false,activeWorld:0,manualRestore:false};
let lastRAF=performance.now();
let sceneApi=null;
let narrationAudio=null;
let narrationTrackIndex=-1;
let currentMedia=-1;
let mediaBase=0;
let forceOpen=false;

const stateText={
  forces:{
    'Confidencialidade':'Somente quem deve ver pode atravessar a membrana.',
    'Posse / Controle':'Controle é uma relação: alguém precisa continuar capaz de decidir sobre o ativo.',
    'Integridade':'Se o conteúdo muda pelo caminho, a informação já não é a mesma.',
    'Autenticidade':'A identidade da fonte precisa resistir à falsificação.',
    'Disponibilidade':'Sem acesso no momento necessário, informação segura perde função.',
    'Utilidade':'Um dado preservado pode continuar sendo inútil para o propósito que deveria cumprir.'
  }
};

function clamp(v,a=0,b=1){return Math.max(a,Math.min(b,v))}
function smooth(v){return v*v*(3-2*v)}
function lerp(a,b,t){return a+(b-a)*t}
function getChapter(t){return chapters.find(c=>t>=c.start && t<c.end) || chapters[chapters.length-1]}
function fmt(t){const m=Math.floor(t/60).toString().padStart(2,'0');const s=Math.floor(t%60).toString().padStart(2,'0');return `${m}:${s}`}
function setTimeFromScroll(){
  const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
  experience.progress=clamp(scrollY/max);
  experience.time=experience.progress*DURATION;
}
function setScrollFromTime(t){
  const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
  window.scrollTo(0, clamp(t/DURATION)*max);
}
function jump(t){experience.playing=false;stopFilmClock();narrationAudio?.pause();audio.main?.pause();setScrollFromTime(t);updateUI(true)}
function closePanels(){forcePanel.classList.remove('is-open');forcePanel.setAttribute('aria-hidden','true');memoryDrawer.classList.remove('is-open');memoryDrawer.setAttribute('aria-hidden','true');document.querySelector('#hx71-frame-viewer')?.classList.remove('is-open');forceOpen=false}
function toggleMemory(v){memoryDrawer.classList.toggle('is-open',v);memoryDrawer.setAttribute('aria-hidden',String(!v))}

document.querySelectorAll('.hx71-continue').forEach(b=>b.addEventListener('click',()=>jump(Number(b.dataset.jump))));
document.querySelector('#hx71-memory').addEventListener('click',()=>{closePanels();toggleMemory(true)});
document.querySelector('#hx71-memory-close').addEventListener('click',()=>toggleMemory(false));
document.querySelector('#hx71-force-close').addEventListener('click',()=>{forcePanel.classList.remove('is-open');forcePanel.setAttribute('aria-hidden','true');forceOpen=false});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closePanels();return}
  if(e.key===' ' && e.target===document.body){e.preventDefault();toggleFilm()}
  if(e.key==='ArrowDown') jump(experience.time+8);
  if(e.key==='ArrowUp') jump(experience.time-8);
});

function openForce(i){
  experience.activeWorld=i;
  document.querySelectorAll('.hx71-force-card').forEach((el,j)=>el.classList.toggle('is-active',j===i));
  const w=worlds[i];
  document.querySelector('#hx71-force-kicker').textContent=`FORÇA ${String(i+1).padStart(2,'0')}`;
  document.querySelector('#hx71-force-title').textContent=w.name;
  document.querySelector('#hx71-force-copy').textContent=w.copy;
  document.querySelector('#hx71-force-meta').textContent=w.meta.toUpperCase();
  forcePanel.classList.add('is-open');forcePanel.setAttribute('aria-hidden','false');forceOpen=true;
}
const forceWrap=document.querySelector('#hx71-forces');
worlds.forEach((w,i)=>{
  const b=document.createElement('button');
  b.className='hx71-force-card';
  b.type='button';
  b.innerHTML=`<b>0${i+1} · ${w.name.toUpperCase()}</b><span>${w.short}</span>`;
  b.addEventListener('click',()=>{openForce(i);jump(chapters[2].start+(i/(worlds.length))*24)});
  forceWrap.appendChild(b);
});

function setupMemory(){
  const grid=document.querySelector('#hx71-memory-grid');
  if(!grid || grid.children.length) return;
  const ranges=[
    [1,11,'ATO 01'],[12,23,'ATO 02'],[24,36,'ATO 03–04'],[37,48,'ATO 04–05'],[49,57,'ATO 06'],
    [58,70,'ATO 07'],[71,81,'ATO 08'],[82,98,'ATO 09']
  ];
  for(let i=1;i<=98;i++){
    const b=document.createElement('button');b.className='hx71-memory-item';b.type='button';
    let label='STORYBOARD';
    for(const r of ranges) if(i>=r[0]&&i<=r[1]) label=r[2];
    b.innerHTML=`<img src="${BASE}storyboard/thumbs/${String(i).padStart(3,'0')}.webp" alt="Frame ${String(i).padStart(3,'0')} — ${label}" loading="lazy" ><span>${String(i).padStart(3,'0')}</span>`;
    b.addEventListener('click',()=>openFrameViewer(i));
    grid.appendChild(b);
  }
}
setupMemory();

function frameEntry(i){
  return STORYBOARD_SEQUENCE[Math.max(0,Math.min(STORYBOARD_SEQUENCE.length-1,i-1))];
}
function frameChapter(i){
  const e=frameEntry(i);
  return e ? getChapter(e.cue) : chapters[0];
}
function frameLabel(i){return `FRAME ${String(i).padStart(3,'0')} / 098`;}

function setupStoryboardUX(){
  if(document.querySelector('#hx71-storyboard-tools')) return;
  const tools=document.createElement('aside');
  tools.id='hx71-storyboard-tools';
  tools.className='hx71-storyboard-tools';
  tools.innerHTML=`
    <div class="hx71-storyboard-tools-top">
      <button type="button" class="hx71-frame-current" id="hx71-frame-current" aria-label="Abrir contexto do frame atual">FRAME 001 / 098</button>
      <span id="hx71-frame-time">00:00</span>
      <button type="button" class="hx71-frame-inspect" id="hx71-frame-inspect">INSPECIONAR</button>
    </div>
    <input id="hx71-frame-scrub" type="range" min="1" max="98" value="1" step="1" aria-label="Navegar pelos 98 frames do storyboard">
    <div class="hx71-frame-chapters" id="hx71-frame-chapters" aria-label="Capítulos do filme"></div>
    <div class="hx71-frame-tools-bottom"><span>SEQUÊNCIA VISUAL</span><span id="hx71-frame-chapter">O VAZIO</span></div>
  `;
  document.querySelector('#hx71')?.appendChild(tools);
  const range=tools.querySelector('#hx71-frame-scrub');
  const inspect=()=>openFrameViewer(Number(range.value));
  tools.querySelector('#hx71-frame-current')?.addEventListener('click',inspect);
  tools.querySelector('#hx71-frame-inspect')?.addEventListener('click',inspect);
  range?.addEventListener('input',()=>{
    const e=frameEntry(Number(range.value));
    if(!e) return;
    experience.playing=false;
    document.body.classList.remove('hx71-film-mode');
    setScrollFromTime(e.cue);
    updateUI(true);
  });
  const chapterRail=tools.querySelector('#hx71-frame-chapters');
  chapters.forEach((chapter,i)=>{
    const b=document.createElement('button');
    b.type='button'; b.className='hx71-frame-chapter-marker';
    b.textContent=String(i+1).padStart(2,'0');
    b.title=`ATO ${String(i+1).padStart(2,'0')} · ${chapter.name}`;
    b.style.left=`${(chapter.start/DURATION)*100}%`;
    b.addEventListener('click',()=>{experience.playing=false;document.body.classList.remove('hx71-film-mode');setScrollFromTime(chapter.start+.01);updateUI(true)});
    chapterRail?.appendChild(b);
  });
}
setupStoryboardUX();

let frameViewerIndex=1;
let frameViewerReturnFocus=null;
function openFrameViewer(i){
  i=Math.max(1,Math.min(98,Number(i)||1));
  frameViewerIndex=i;
  let viewer=document.querySelector('#hx71-frame-viewer');
  if(!viewer){
    viewer=document.createElement('aside');
    viewer.id='hx71-frame-viewer';
    viewer.className='hx71-frame-viewer';
    viewer.setAttribute('role','dialog');
    viewer.setAttribute('aria-modal','true');
    viewer.setAttribute('aria-label','Contexto do frame do filme');
    viewer.innerHTML=`
      <div class="hx71-frame-viewer-head">
        <div><span class="hx71-kicker">CONTEXTO DO FILME</span><b id="hx71-frame-title"></b><small id="hx71-frame-meta"></small></div>
        <button class="hx71-close" id="hx71-frame-close" type="button">FECHAR ×</button>
      </div>
      <div class="hx71-frame-compare" id="hx71-frame-compare">
        <figure><img id="hx71-frame-prev" alt=""><figcaption>ANTERIOR</figcaption></figure>
        <figure class="is-current"><img id="hx71-frame-img" alt=""><figcaption>ATUAL</figcaption></figure>
        <figure><img id="hx71-frame-next" alt=""><figcaption>PRÓXIMO</figcaption></figure>
      </div>
      <div class="hx71-frame-story">
        <div><span class="hx71-kicker" id="hx71-frame-chapter-label">O VAZIO</span><p id="hx71-frame-story-copy"></p></div>
        <div class="hx71-frame-actions">
          <button id="hx71-frame-prev-btn" class="hx71-btn" type="button">← ANTERIOR</button>
          <button id="hx71-frame-next-btn" class="hx71-btn" type="button">PRÓXIMO →</button>
          <button id="hx71-frame-continue" class="hx71-btn hx71-btn-main" type="button">CONTINUAR FILME ▶</button>
        </div>
      </div>`;
    document.body.appendChild(viewer);
    const close=()=>{
      viewer.classList.remove('is-open');
      viewer.setAttribute('aria-hidden','true');
      frameViewerReturnFocus?.focus?.();
    };
    viewer.querySelector('#hx71-frame-close').addEventListener('click',close);
    viewer.querySelector('#hx71-frame-prev-btn').addEventListener('click',()=>openFrameViewer(frameViewerIndex-1));
    viewer.querySelector('#hx71-frame-next-btn').addEventListener('click',()=>openFrameViewer(frameViewerIndex+1));
    viewer.querySelector('#hx71-frame-continue').addEventListener('click',()=>{
      const e=frameEntry(frameViewerIndex);
      close();
      if(e){setScrollFromTime(e.cue);experience.playing=true;document.body.classList.add('hx71-film-mode');updateUI(true);syncNarration(true);}
    });
  }
  const e=frameEntry(i), prev=frameEntry(i-1)||e, next=frameEntry(i+1)||e, c=e?getChapter(e.cue):chapters[0];
  const setImg=(sel,entry)=>{const el=viewer.querySelector(sel); if(!el)return; el.src=entry?.src||''; el.alt=entry?frameLabel(entry.id):'';};
  setImg('#hx71-frame-prev',prev); setImg('#hx71-frame-img',e); setImg('#hx71-frame-next',next);
  viewer.querySelector('#hx71-frame-title').textContent=frameLabel(i);
  viewer.querySelector('#hx71-frame-meta').textContent=`${fmt(e?.cue||0)} · ${c.name}`;
  viewer.querySelector('#hx71-frame-chapter-label').textContent=`ATO ${String(chapters.indexOf(c)+1).padStart(2,'0')} · ${c.name}`;
  viewer.querySelector('#hx71-frame-story-copy').textContent=c.copy;
  viewer.querySelector('#hx71-frame-prev-btn').disabled=i<=1;
  viewer.querySelector('#hx71-frame-next-btn').disabled=i>=98;
  const range=document.querySelector('#hx71-frame-scrub'); if(range) range.value=String(i);
  frameViewerReturnFocus=document.activeElement;
  viewer.setAttribute('aria-hidden','false');
  viewer.classList.add('is-open');
  requestAnimationFrame(()=>viewer.querySelector('#hx71-frame-close')?.focus());
}
document.addEventListener('keydown',(e)=>{
  const viewer=document.querySelector('#hx71-frame-viewer');
  const open=viewer?.classList.contains('is-open');
  const tag=(document.activeElement?.tagName||'').toLowerCase();
  if(e.key==='Escape' && open){e.preventDefault(); viewer.querySelector('#hx71-frame-close')?.click(); return;}
  if(e.key.toLowerCase()==='i' && !open && !['input','textarea','select'].includes(tag)){const cur=storyboardIndex+1;if(cur>0)openFrameViewer(cur); return;}
  if(open){
    if(e.key==='ArrowLeft'){e.preventDefault();openFrameViewer(Math.max(1,frameViewerIndex-1));}
    if(e.key==='ArrowRight'){e.preventDefault();openFrameViewer(Math.min(98,frameViewerIndex+1));}
    if(e.key==='Tab'){
      const f=[...viewer.querySelectorAll('button:not(:disabled)')]; if(!f.length)return;
      const first=f[0], last=f[f.length-1];
      if(e.shiftKey && document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first.focus();}
    }
  }
});

function setupAudio(){
  window.addEventListener('pointerdown',()=>{if(experience.sound===false) return},{once:true});
}
function toggleSound(){
  experience.sound=!experience.sound;
  document.querySelector('#hx71-sound').textContent=experience.sound?'SOM ATIVO':'SOM';
  document.querySelector('#hx71-sound-small').textContent=experience.sound?'SOM ON':'SOM OFF';
  if(experience.sound){
    if(!audio.main){audio.main=new Audio(BASE+'audio/ambience/hexad-main.mp3');audio.main.loop=true;audio.main.volume=.12}
    audio.main.play().catch(()=>{});
    syncNarration(true);
  }else{
    audio.main?.pause();
    audio.ambiences.forEach(a=>a.pause());
    narrationAudio?.pause();
  }
}
const audio={main:null,ambiences:new Map()};
function ensureAmbience(name){
  if(!audio.ambiences.has(name)){const a=new Audio(BASE+'audio/ambience/hexad-'+name+'.mp3');a.loop=true;a.volume=0;audio.ambiences.set(name,a)}
  return audio.ambiences.get(name);
}
function sfx(name){if(!experience.sound)return;const a=new Audio(BASE+'audio/sfx/hexad-'+name+'.wav');a.volume=.28;a.play().catch(()=>{})}
function syncAmbience(t){
  if(!experience.sound)return;
  const act=getChapter(t);
  const focus=worlds[experience.activeWorld].track;
  audio.ambiences.forEach((a,n)=>{
    const target=act.id==='forces' || act.id==='equilibrium' ? (n===focus?.08:0) : 0;
    a.volume=lerp(a.volume,target,.08);
    if(target>0 && a.paused)a.play().catch(()=>{});
    if(target===0 && a.volume<.005)a.pause();
  });
}
function syncNarration(force=false){
  if(!experience.sound) return;
  const a=window.__hexadNarrationMaster || (narrationAudio = new Audio(BASE+'audio/narration/narration-master.mp3'));
  a.preload='auto'; a.volume=.96; a.playbackRate=filmPlaybackRate;
  window.__hexadNarrationMaster=a;
  narrationAudio=a;
  const target=Math.max(0,Math.min(DURATION,experience.time));
  const seek=()=>{try{if(force || Math.abs((a.currentTime||0)-target)>.22)a.currentTime=target}catch{}};
  if(a.readyState>=1) seek(); else a.addEventListener('loadedmetadata',seek,{once:true});
  if(experience.playing) a.play().catch(()=>{});
}


function stopFilmClock(){ /* V90: unified RAF clock; kept for legacy call sites. */ }
function startFilmClock(){ /* V90: unified RAF clock runs continuously. */ }

function toggleFilm(){
  experience.playing=!experience.playing;
  if(experience.playing && !experience.sound) toggleSound();
  const b=document.querySelector('#hx71-film');
  b.setAttribute('aria-pressed',String(experience.playing));
  b.innerHTML=experience.playing?'<span>Ⅱ</span> PAUSAR FILME':'<span>▶</span> ASSISTIR FILME';
  document.querySelector('#hx71-play-indicator').hidden=!experience.playing;
  document.body.classList.toggle('hx71-film-mode',experience.playing);
  if(experience.playing){
    if(experience.time>=DURATION-.25) experience.time=0;
    syncStoryboard(experience.time,true);
    syncNarration(true);
  }else{
    narrationAudio?.pause();
    audio.main?.pause();
    if(storyboardSync) storyboardSync.textContent='STORYBOARD · PAUSADO';
  }
}
document.querySelector('#hx71-film').addEventListener('click',toggleFilm);

// V90: secondary UX controls use the same frame viewer as the cinematic engine.
window.__hexadUX={
  inspectFrame(i){ openFrameViewer(i); },
  currentFrame(){ return (STORYBOARD_SEQUENCE[storyboardIndex]||STORYBOARD_SEQUENCE[0])?.id||1; },
  compareFrame(i){ openFrameViewer(i); }
};
// Film-first presentation: the 98 authored frames are the primary visual layer whenever the film is playing.
function enforceFilmVisualState(){
  document.body.classList.toggle('hx71-film-mode', !!experience.playing);
  if(experience.playing) syncStoryboard(experience.time,true);
}

document.querySelectorAll('a[href$="index.html"]').forEach(a=>a.addEventListener('click',e=>{ if(!document.startViewTransition)return; e.preventDefault(); const href=a.href; document.startViewTransition(()=>location.href=href); }));
document.querySelector('#hx71-sound').addEventListener('click',toggleSound);
document.querySelector('#hx71-sound-small').addEventListener('click',toggleSound);

function setupRestoration(){
  const list=document.querySelector('#hx71-restoration');
  ['Detectar','Isolar','Reparar','Verificar','Restaurar','Estabilizar'].forEach((x,i)=>{
    const li=document.createElement('li');li.innerHTML=`<span>0${i+1} · ${x.toUpperCase()}</span><span>AGUARDANDO</span>`;list.appendChild(li);
  });
}
setupRestoration();
function runRestoration(){
  experience.manualRestore=true;experience.playing=false;jump(274.756);
  sfx('restore');
  document.querySelectorAll('#hx71-restoration li').forEach((li,i)=>setTimeout(()=>{li.classList.add('is-on');li.lastElementChild.textContent='CONCLUÍDO';sfx(i===5?'system-stable':'data-move')},i*650));
}
document.querySelector('#hx71-run-restore').addEventListener('click',runRestoration);

document.querySelector('#hx71-observe').addEventListener('click',()=>{sfx('alert');jump(132.464)});
document.querySelectorAll('[data-investigate]').forEach((b,i)=>{
  b.addEventListener('click',()=>{document.querySelectorAll('[data-investigate]').forEach(x=>x.classList.remove('is-active'));b.classList.add('is-active');jump(223.63+i*12)})
});
document.querySelector('#hx71-restart').addEventListener('click',()=>{experience.playing=false;stopFilmClock();narrationAudio?.pause();audio.main?.pause();experience.time=0;setScrollFromTime(0);closePanels();updateUI(true)});
document.querySelector('#hx71-chapter1')?.addEventListener('click',()=>{
  experience.playing=false;
  stopFilmClock();
  narrationAudio?.pause();
  audio.main?.pause();
  experience.time=0;
  experience.progress=0;
  setScrollFromTime(0);
  closePanels();
  updateUI(true);
  window.scrollTo({top:0,behavior:reduced?'auto':'smooth'});
});

function setup3D(){
  if(window.__hexadThreeUnavailable || !THREE || !GLTFLoader){
    throw new Error('Three.js unavailable; using cinematic fallback');
  }
  const canvas=document.querySelector('#hx71-canvas');
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<800?1.25:1.7));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.setClearColor(0x020309,0);
  const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x020309,.012);
  const camera=new THREE.PerspectiveCamera(43,innerWidth/innerHeight,.1,100);
  const ambient=new THREE.AmbientLight(0x9aa7b7,0.68);scene.add(ambient);
  const key=new THREE.PointLight(0xcdf8ff,26,28);key.position.set(0,3,5);scene.add(key);
  const rim=new THREE.PointLight(0x5e6bff,12,26);rim.position.set(-4,1,-4);scene.add(rim);
  const threatLight=new THREE.PointLight(0xff455d,0,20);threatLight.position.set(4,1,2);scene.add(threatLight);
  const root=new THREE.Group();scene.add(root);
  const coreGroup=new THREE.Group();root.add(coreGroup);
  const worldGroup=new THREE.Group();root.add(worldGroup);
  const droneGroup=new THREE.Group();root.add(droneGroup);
  const orbitGroup=new THREE.Group();root.add(orbitGroup);

  const starPos=new Float32Array(5200*3);
  for(let i=0;i<starPos.length;i+=3){starPos[i]=(Math.random()-.5)*46;starPos[i+1]=(Math.random()-.5)*25;starPos[i+2]=(Math.random()-.5)*32}
  const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(starPos,3));
  const stars=new THREE.Points(sg,new THREE.PointsMaterial({color:0xb9d7ff,size:.021,transparent:true,opacity:.54}));scene.add(stars);

  let bootFinished=false;
let criticalLoaded=0;
function finishBoot(label='Universo pronto'){
  if(bootFinished)return;
  bootFinished=true;
  if(loaderBar) loaderBar.style.width='100%';
  if(loaderCopy) loaderCopy.textContent=label;
  loaderEl?.classList.add('is-done');
  window.dispatchEvent(new CustomEvent('hexad:booted',{detail:{label}}));
}
const bootTimeout=setTimeout(()=>finishBoot('Experiência pronta'),4800);
const markCritical=()=>{
  criticalLoaded++;
  if(criticalLoaded>=2){ clearTimeout(bootTimeout); finishBoot('Universo pronto'); }
};
const loadingManager=new THREE.LoadingManager();
loadingManager.onStart=(_,loaded,total)=>{ if(loaderBar){loaderBar.style.width='4%';loaderCopy.textContent='Preparando o universo' } };
loadingManager.onProgress=(_,loaded,total)=>{ if(loaderBar){loaderBar.style.width=Math.max(8,Math.min(88,Math.round((loaded/Math.max(total,1))*88)))+'%';loaderCopy.textContent=`Carregando universo · ${loaded}/${total}` } };
loadingManager.onLoad=()=>finishBoot('Universo pronto');
loadingManager.onError=(url)=>console.warn('HEXAD asset load failed',url);
const loader=new GLTFLoader(loadingManager);
  let core=null,fragment=null,drone=null,scanner=null,sun=null;
  const planets=[];
  const satellites=[];
  const nodes=[];
  function load(name,group,cb){
    loader.load(BASE+'3d/'+name,g=>{
      const m=g.scene;
      m.traverse(o=>{if(o.isMesh){o.frustumCulled=true;if(o.material){o.material.metalness=Math.min(1,(o.material.metalness??.45)+.1);o.material.roughness=Math.max(.2,(o.material.roughness??.5)-.05)}}});
      group?.add(m);
      cb(m);
    },undefined,err=>console.warn('HEXAD asset',name,err));
  }

  load('hexad-data-core.glb',coreGroup,m=>{core=m;core.scale.setScalar(1.25);if(sceneApi)sceneApi.core=core;markCritical()});
  load('hexad-data-fragment.glb',root,m=>{fragment=m;fragment.scale.setScalar(.58);if(sceneApi)sceneApi.fragment=fragment;markCritical()});
  // Drone is secondary to the initial reveal: it can arrive progressively.
  const loadSecondary=()=>{
    load('hexad-drone.glb',droneGroup,m=>{drone=m;drone.scale.setScalar(.68);if(sceneApi)sceneApi.drone=drone});
    load('hexad-scanner.glb',droneGroup,m=>{scanner=m;scanner.scale.setScalar(.5);scanner.visible=false;if(sceneApi)sceneApi.scanner=scanner});
    load('hexad-sun.glb',root,m=>{sun=m;sun.scale.setScalar(.5);sun.visible=false;if(sceneApi)sceneApi.sun=sun});
    worlds.forEach((w,i)=>load(w.model,worldGroup,m=>{m.userData.index=i;m.scale.setScalar(.7);m.position.set(Math.cos(i*Math.PI/3-Math.PI/2)*3.15,Math.sin(i*Math.PI/3-Math.PI/2)*1.15,Math.sin(i*Math.PI/3-Math.PI/2)*1.35);planets[i]=m}));
    for(let i=0;i<6;i++)load('hexad-satellite.glb',orbitGroup,m=>{m.scale.setScalar(.24);m.userData.phase=i;satellites.push(m)});
    for(let i=0;i<6;i++)load('hexad-node.glb',orbitGroup,m=>{m.scale.setScalar(.12);m.userData.phase=i;nodes.push(m)});
  };
  const kickSecondary=()=>('requestIdleCallback' in window ? requestIdleCallback(loadSecondary,{timeout:1200}) : setTimeout(loadSecondary,120));
  window.addEventListener('hexad:booted',kickSecondary,{once:true});

  function resize(){const w=innerWidth,h=innerHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)}
  addEventListener('resize',resize,{passive:true});resize();
  sceneApi={renderer,scene,camera,root,core,fragment,drone,scanner,sun,planets,stars,orbitGroup,satellites,nodes,key,rim,threatLight};
}
try{setup3D()}catch(err){console.error(err);document.body.classList.add('hx71-no-webgl'); clearTimeout(bootTimeout); finishBoot('Modo cinematográfico')}
if(!sceneApi){ clearTimeout(bootTimeout); finishBoot('Modo cinematográfico'); }


function visual(t,now){
  if(!sceneApi)return;
  const s=sceneApi;
  const m=(a,b)=>clamp((t-a)/(b-a));
  const act=getChapter(t);
  let cx=0,cy=.5,cz=8,tx=0,ty=.3,tz=0;
  if(t<38.269){const p=smooth(m(0,38.269));cx=lerp(.1,.4,p);cy=lerp(1.0,1.25,p);cz=lerp(10,7.2,p);ty=.3}
  else if(t<80.509){const p=smooth(m(38.269,80.509));cx=lerp(.6,-.8,p);cy=lerp(1.2,.9,p);cz=lerp(7.2,4.8,p);ty=.2}
  else if(t<109.4){const p=m(80.509,109.4);const ang=p*Math.PI*2;cx=Math.sin(ang)*2.6;cy=1.25+Math.cos(ang*2)*.18;cz=5.4;tx=0;ty=.2}
  else if(t<114.364){const p=smooth(m(109.4,114.364));cx=lerp(2.7,0,p);cy=lerp(1.3,1.0,p);cz=lerp(5.4,6.0,p)}
  else if(t<163.683){const p=m(114.364,163.683);cx=lerp(0,2.2,p);cy=lerp(1,1.5,p);cz=lerp(6,4.5,p);tx=lerp(0,-.3,p)}
  else if(t<223.53){const p=smooth(m(163.683,223.53));cx=lerp(2.2,0,p);cy=lerp(1.5,.4,p);cz=lerp(4.5,3.2,p);ty=.2}
  else if(t<274.756){const p=smooth(m(223.53,274.756));cx=lerp(0,-2.2,p);cy=lerp(.4,1.2,p);cz=lerp(3.2,5.2,p);tx=0;ty=.5}
  else if(t<336.039){const p=smooth(m(274.756,336.039));cx=lerp(-2.2,0,p);cy=lerp(1.2,.8,p);cz=lerp(5.2,5.8,p);ty=.3}
  else {const p=smooth(m(336.039,376.659));cx=lerp(0,.2,p);cy=lerp(.8,2.0,p);cz=lerp(5.8,10.5,p);ty=.2}

  s.camera.position.x+=((cx)-s.camera.position.x)*.045;
  s.camera.position.y+=((cy)-s.camera.position.y)*.045;
  s.camera.position.z+=((cz)-s.camera.position.z)*.045;
  s.camera.lookAt(tx,ty,tz);

  const threat=clamp((t-124)/38);
  s.key.intensity=lerp(24,12,smooth((t-163)/25));
  s.rim.intensity=lerp(10,5,clamp((t-163)/70));
  s.threatLight.intensity=threat*10;
  s.stars.material.opacity=lerp(.24,.62,clamp((t-336)/40));
  s.stars.rotation.y+=.00016*(reduced?0.2:1)*(now%1000<16?1:1);

  if(s.core){s.core.rotation.y+=.0028*(reduced?.25:1);const p=clamp((t-38)/45);s.core.scale.setScalar(lerp(.2,1.25,smooth(p))*(t>=164?lerp(1,.72,clamp((t-164)/22)):1))}
  if(s.fragment){const entry=clamp(t/38.269);s.fragment.position.set(lerp(.7,0,smooth(clamp((t-12)/28))),.15+Math.sin(now*.0011)*.04,lerp(.8,0,smooth(clamp((t-12)/28))));s.fragment.rotation.y-=.002*(reduced?.2:1);s.fragment.scale.setScalar(lerp(.58,.32,clamp((t-38)/28))*(t<80?.1+1:1))}
  if(s.drone){
    const threatP=clamp((t-128)/34);
    const invP=clamp((t-223.63)/50);
    const rx=t<220?lerp(2.7,.6,threatP):lerp(.6,-.8,invP);
    s.drone.position.set(rx,1.35+Math.sin(now*.0012)*.07,lerp(2.8,.4,threatP));
    s.drone.rotation.y+=(.004*(reduced?.2:1));
    s.drone.visible=t>120&&t<335;
  }
  if(s.scanner){
    const inv=clamp((t-223.63)/50);
    s.scanner.visible=t>223&&t<274.8;
    s.scanner.position.set(lerp(0,-.4,inv),.45+Math.sin(now*.0017)*.06,lerp(1.4,.2,inv));
    s.scanner.rotation.y+=.006;
  }
  if(s.sun){
    const syn=clamp((t-336.039)/40.62);
    s.sun.visible=t>336;
    s.sun.position.set(0,.3,0);
    s.sun.scale.setScalar(.25+syn*.55);
    s.sun.rotation.y+=.002;
  }
  s.planets.forEach((p,i)=>{
    if(!p)return;
    const forceLocal=clamp((t-80.509)/28.891);
    const targetWorld=Math.min(5,Math.floor(forceLocal*6));
    const focus=t>=80.5&&t<114.4 && targetWorld===i;
    const active=experience.activeWorld===i;
    const scale=focus?1.12:(t>336?0.86:.68);
    p.scale.lerp(new THREE.Vector3(scale,scale,scale),.08);
    p.rotation.y+=.003*(focus?1.7:.75)*(reduced?.3:1);
    p.position.y+=(Math.sin(now*.0006+i)*.05+(focus?.1:0)-p.position.y+(Math.sin(i*Math.PI/3-Math.PI/2)*1.15))*.03;
  });
  s.satellites.forEach((sat,i)=>{
    const a=(now*.00012)+(i*Math.PI/3);
    sat.position.set(Math.cos(a)*2.3,Math.sin(a*1.15)*.6,Math.sin(a)*2.0);
    sat.rotation.y+=.003;
    sat.visible=t>80;
  });
  s.nodes.forEach((node,i)=>{
    const a=(now*.00016)+(i*Math.PI/3);
    node.position.set(Math.cos(a)*1.65,Math.sin(a*1.4)*.45,Math.sin(a)*1.45);
    node.visible=t>80;
  });
  app.dataset.scene=act.id;
}

function updateMedia(t){
  let idx=media.findIndex(x=>t>=x.start&&t<x.end);
  if(idx!==currentMedia){
    cinemaVideo.pause();
    currentMedia=idx;
    if(idx>=0){
      const m=media[idx];mediaBase=m.start;
      cinemaVideo.src=BASE+'video/'+m.file;
      cinemaVideo.loop=true;cinemaVideo.muted=true;cinemaVideo.currentTime=Math.max(0,t-m.start);
      cinemaVideo.play().catch(()=>{if(m.fallback){cinemaVideo.src=BASE+'video/'+m.fallback;cinemaVideo.currentTime=Math.max(0,t-m.start);cinemaVideo.play().catch(()=>{})}});
    }
  }else if(idx>=0 && !cinemaVideo.paused && Math.abs(cinemaVideo.currentTime-(t-mediaBase))>1.4 && !experience.playing){
    try{cinemaVideo.currentTime=Math.max(0,t-mediaBase)}catch{}
  }
  videoLayer.style.opacity=idx>=0?.42:0;
}

function syncEndOfFilm(force=false){
  const ended = experience.time >= (DURATION - 0.06);
  document.body.classList.toggle('hx71-film-ended', ended);
  document.querySelectorAll('.hx71-end-actions').forEach((el)=>{
    el.setAttribute('aria-hidden', ended ? 'false' : 'true');
  });
  const indicator=document.querySelector('#hx71-play-indicator');
  if(ended && indicator) indicator.hidden=true;
}

function updateUI(force=false){
  const t=experience.time;const p=t/DURATION;const c=getChapter(t);
  progressFill.style.width=(p*100)+'%';
  timeLabel.textContent=fmt(t);
  chapterNo.textContent=String(chapters.indexOf(c)+1).padStart(2,'0');
  chapterName.textContent=c.name;
  captionKicker.textContent=c.cap;
  captionText.textContent=c.copy;
  const fx=worlds[experience.activeWorld];
  document.querySelectorAll('.hx71-force-card').forEach((el,j)=>el.classList.toggle('is-active',j===experience.activeWorld&&c.id==='forces'));
  // chapter-specific copy states
  const impact=document.querySelector('#hx71-impact-number'); if(impact) impact.textContent=String(Math.max(0,6-Math.floor(clamp((t-169.683)/9.5)*4))).padStart(2,'0');
  const scan=clamp((t-223.63)/42);const scanState=document.querySelector('#hx71-scan-state');const scanCopy=document.querySelector('#hx71-scan-copy');
  if(scanState){scanState.textContent=scan<.28?'LOCALIZANDO':scan<.66?'COMPARANDO':'MAPEADO';scanCopy.textContent=scan<.28?'procurando a primeira diferença':scan<.66?'sinais e padrões em paralelo':'cada leitura reduz a incerteza'}
  // restoration state
  const restP=clamp((t-274.756)/(336.039-274.756))*6;
  document.querySelectorAll('#hx71-restoration li').forEach((li,i)=>{const done=restP>=i+1;li.classList.toggle('is-on',done);li.lastElementChild.textContent=done?'CONCLUÍDO':'AGUARDANDO'});
  if(force) syncNarration(true);
  syncStoryboard(t,force);
  const entry=STORYBOARD_SEQUENCE[storyboardIndex] || STORYBOARD_SEQUENCE[0];
  const range=document.querySelector('#hx71-frame-scrub');
  const cur=document.querySelector('#hx71-frame-current');
  const ft=document.querySelector('#hx71-frame-time');
  const fc=document.querySelector('#hx71-frame-chapter');
  if(entry){
    if(range) range.value=String(entry.id);
    if(cur) cur.textContent=frameLabel(entry.id);
    if(ft) ft.textContent=fmt(entry.cue);
    if(fc) fc.textContent=getChapter(entry.cue).name;
    const activeChapter=chapters.indexOf(getChapter(entry.cue));
    document.querySelectorAll('.hx71-frame-chapter-marker').forEach((m,i)=>m.classList.toggle('is-active',i===activeChapter));
  }
  updateMedia(t);
  syncAmbience(t);
  syncEndOfFilm(force);
  enforceFilmVisualState();
}

function scrollHandler(){if(!experience.playing){setTimeFromScroll();updateUI()}}
addEventListener('scroll',scrollHandler,{passive:true});

function frame(now){
  const dt=Math.min(.05,(now-lastRAF)/1000);
  lastRAF=now;
  if(experience.playing){
    // V90: o áudio master é a fonte de tempo do filme.
    // V91: o fallback RAF respeita o controle 1×/2×.
    const master=narrationAudio;
    const audioClock=(master && !master.paused && master.readyState>=2 && Number.isFinite(master.currentTime))
      ? master.currentTime
      : null;
    experience.time=audioClock===null
      ? Math.min(DURATION,experience.time+dt*filmPlaybackRate)
      : clamp(audioClock,0,DURATION);
    experience.progress=experience.time/DURATION;
    setScrollFromTime(experience.time);
    if(experience.time>=DURATION-0.06){
      experience.time=DURATION;
      experience.progress=1;
      experience.playing=false;
      try{master?.pause()}catch{}
      document.querySelector('#hx71-play-indicator')?.setAttribute('hidden','');
      document.body.classList.remove('hx71-film-mode');
      syncEndOfFilm(true);
    }
    updateUI();
  } else {
    visual(experience.time,now);
  }
  if(sceneApi)sceneApi.renderer.render(sceneApi.scene,sceneApi.camera);
  requestAnimationFrame(frame);
}

setupAudio();
setTimeFromScroll();

updateUI(true);
// V81: image-first presentation is active from the first frame; playback only adds motion/audio.
document.body.classList.add('hx81-image-first');
frame(performance.now());

// initial hero video fallback for reduced motion: still image remains behind 3D.

/* V72 EXPERIENCE LAYER ----------------------------------------------------- */
const hx72 = {
  deck: document.querySelector('#hx72-deck'),
  sim: document.querySelector('#hx72-sim'),
  worldGrid: document.querySelector('#hx72-world-grid'),
  simBody: document.querySelector('#hx72-sim-body'),
  index: document.querySelector('#hx71-index')
};

const simScenarios = [
  {k:'integrity', q:'O conteúdo de uma informação foi alterado durante a transmissão.', options:[
    ['A','Ignorar a alteração porque o sistema ainda está disponível.','wrong'],
    ['B','Comparar com uma referência confiável e isolar a versão suspeita.','good'],
    ['C','Duplicar o conteúdo alterado e distribuí-lo novamente.','wrong']
  ], explain:'Integridade exige preservar o conteúdo correto. Disponibilidade sozinha não torna um dado confiável.'},
  {k:'authenticity', q:'Uma mensagem chega com uma assinatura que não corresponde ao emissor esperado.', options:[
    ['A','Tratar como válida porque o formato está correto.','wrong'],
    ['B','Verificar a assinatura e a identidade da origem antes de utilizar.','good'],
    ['C','Apagar todos os registros para evitar risco.','wrong']
  ], explain:'Autenticidade responde à identidade da origem. A forma correta é verificar antes de confiar.'},
  {k:'availability', q:'Um sistema continua íntegro, mas a equipe não consegue acessar a informação quando precisa.', options:[
    ['A','Considerar o problema irrelevante porque o conteúdo não mudou.','wrong'],
    ['B','Restabelecer o caminho de acesso sem perder as outras propriedades.','good'],
    ['C','Modificar o conteúdo para torná-lo menor.','wrong']
  ], explain:'Disponibilidade é a capacidade de alcançar a informação no momento necessário.'}
];

function hx72ShowDeck(mode='worlds'){
  hx72.deck.classList.add('is-open'); hx72.deck.setAttribute('aria-hidden','false');
  hx72.worldGrid.innerHTML='';
  worlds.forEach((w,i)=>{
    const card=document.createElement('button'); card.type='button'; card.className='hx72-world-card';
    card.innerHTML=`<span class="hx72-world-no">0${i+1}</span><span class="hx72-world-name">${w.name}</span><span class="hx72-world-short">${w.short}</span><span class="hx72-world-open">ENTRAR ↗</span>`;
    card.addEventListener('click',()=>hx72OpenWorld(i)); hx72.worldGrid.appendChild(card);
  });
  document.querySelector('#hx72-deck-title').textContent=mode==='worlds'?'Seis condições. Um sistema.':'Exploração do Hexad';
}
function hx72HideDeck(){hx72.deck.classList.remove('is-open');hx72.deck.setAttribute('aria-hidden','true')}
function hx72OpenWorld(i){
  hx72HideDeck(); experience.activeWorld=i; openForce(i); jump(80.509+(i/(worlds.length))*24); sfx('enter');
}
function hx72OpenSim(){
  hx72.sim.classList.add('is-open'); hx72.sim.setAttribute('aria-hidden','false');
  const sc=simScenarios[Number(sessionStorage.getItem('hx72-sim-index')||'0')%simScenarios.length]; sessionStorage.setItem('hx72-sim-index', String((Number(sessionStorage.getItem('hx72-sim-index')||'0')+1)%simScenarios.length));
  hx72.simBody.innerHTML=`<div class="hx72-scenario"><span class="hx71-kicker">INCIDENTE / ${sc.k.toUpperCase()}</span><h4>${sc.q}</h4><div class="hx72-options">${sc.options.map(o=>`<button type="button" data-answer="${o[2]}"><b>${o[0]}</b><span>${o[1]}</span></button>`).join('')}</div><div id="hx72-result" class="hx72-result" aria-live="polite">SELECIONE UMA DECISÃO</div></div>`;
  hx72.simBody.querySelectorAll('[data-answer]').forEach(b=>b.addEventListener('click',()=>{
    const good=b.dataset.answer==='good';
    hx72.simBody.querySelectorAll('[data-answer]').forEach(x=>x.disabled=true);
    const r=hx72.simBody.querySelector('#hx72-result'); r.classList.add(good?'good':'bad'); r.innerHTML=good?`DECISÃO COERENTE<br><span>${sc.explain}</span>`:`DECISÃO FRÁGIL<br><span>${sc.explain}</span>`;
    sfx(good?'success':'failure');
  }));
}
function hx72HideSim(){hx72.sim.classList.remove('is-open');hx72.sim.setAttribute('aria-hidden','true')}

document.querySelector('#hx71-explore')?.addEventListener('click',()=>hx72ShowDeck());
document.querySelector('#hx71-investigate-mode')?.addEventListener('click',()=>{hx72HideDeck(); jump(223.53); sfx('scan'); document.querySelector('[data-id=investigation]')?.scrollIntoView({behavior: reduced?'auto':'smooth', block:'center'}); setTimeout(()=>document.querySelector('[data-investigate=1]')?.focus(),420);});
document.querySelector('#hx71-simulate')?.addEventListener('click',hx72OpenSim);
hx72.index?.addEventListener('click',()=>hx72ShowDeck());
const params=new URLSearchParams(location.search);
if(params.get('mode')==='film'){ setTimeout(()=>toggleFilm(),650); }
if(params.get('mode')==='explore'){ setTimeout(()=>hx72ShowDeck(),650); }
if(params.get('mode')==='simulate'){ setTimeout(()=>hx72OpenSim(),650); }
document.querySelector('#hx72-deck-close')?.addEventListener('click',hx72HideDeck);
document.querySelector('#hx72-sim-close')?.addEventListener('click',hx72HideSim);
document.addEventListener('keydown',e=>{if(e.key==='Escape'){hx72HideDeck();hx72HideSim();}});

// Safer SFX fallback: the V71 code requested a non-existing "restore" asset.
const originalSfx=sfx;
sfx=(name)=>{
  const safe=name==='restore'?'enter':name;
  originalSfx(safe);
};


// V73 interaction refinement: narrative map + non-intrusive sound onboarding.
const chapterMap = document.createElement('div');
chapterMap.className = 'hx72-chapter-map';
chapterMap.setAttribute('aria-label','Mapa narrativo');
chapters.forEach((c,i)=>{
  const b=document.createElement('button'); b.type='button'; b.dataset.chapter=c.id; b.innerHTML=`<span>${String(i+1).padStart(2,'0')}</span><b>${c.name}</b>`;
  b.addEventListener('click',()=>{closePanels(); jump(c.start);}); chapterMap.appendChild(b);
});
app.appendChild(chapterMap);

const soundGate = document.createElement('div');
soundGate.className='hx72-sound-gate';
soundGate.innerHTML=`<div><span class="hx71-kicker">EXPERIÊNCIA SONORA</span><strong>O Hexad foi dirigido com som.</strong><p>Ative o áudio para acompanhar narração, ambiente e eventos.</p><button type="button" class="hx71-btn hx71-btn-main">ATIVAR SOM</button><button type="button" class="hx71-btn">CONTINUAR SEM SOM</button></div>`;
app.appendChild(soundGate);
const gateBtns=soundGate.querySelectorAll('button');
gateBtns[0].addEventListener('click',()=>{ if(!experience.sound) toggleSound(); soundGate.classList.remove('is-open'); sessionStorage.setItem('hx72-sound-seen','1'); });
gateBtns[1].addEventListener('click',()=>{soundGate.classList.remove('is-open'); sessionStorage.setItem('hx72-sound-seen','1');});
if(!sessionStorage.getItem('hx72-sound-seen') && !reduced) setTimeout(()=>soundGate.classList.add('is-open'),900);

function syncChapterMap(){ chapterMap.querySelectorAll('button').forEach((b,i)=>b.classList.toggle('is-active', chapters[i].id===getChapter(experience.time).id)); }
const _updateUI=updateUI;
updateUI=function(force=false){ _updateUI(force); syncChapterMap(); };


window.addEventListener('pagehide',()=>{ try{narrationAudio?.pause()}catch{}; });
window.__hexadModuleReady = true;
requestAnimationFrame(frame);

/* -------------------------------------------------------------------------
   V90 SYNC CONSOLIDATION
   The narration master is the single source of truth for the film clock.
   Older V79 duplicate button orchestration was removed so the image runtime,
   cinematic controller and audio cannot toggle the same film twice.
------------------------------------------------------------------------- */

// Image parallax: deliberate and restrained, only on desktop.
if(!reduced){
  window.addEventListener('pointermove',(e)=>{
    if(innerWidth<900 || !document.body.classList.contains('hx71-film-mode')) return;
    const x=(e.clientX/innerWidth-.5), y=(e.clientY/innerHeight-.5);
    storyboardImgs.forEach((img,i)=>{
      if(!img?.classList.contains('is-active')) return;
      img.style.transform=`translate3d(${x*-7}px,${y*-5}px,0) scale(1.032)`;
    });
  },{passive:true});
}



/* V91 — playback speed and chapter visibility */
(function(){
  const speedButton=document.querySelector('#hx71-speed');
  function applyFilmRate(){
    const rate=filmPlaybackRate;
    [narrationAudio,audio?.main,cinemaVideo,...(audio?.ambiences ? [...audio.ambiences.values()] : [])]
      .filter(Boolean).forEach(media=>{try{media.playbackRate=rate;}catch{}});
    if(speedButton){speedButton.textContent=rate===2?'2×':'1×';speedButton.setAttribute('aria-pressed',String(rate===2));speedButton.title=rate===2?'Voltar para velocidade normal':'Acelerar filme';}
  }
  speedButton?.addEventListener('click',()=>{filmPlaybackRate=filmPlaybackRate===1?2:1;applyFilmRate();});
  const originalUpdateUI=window.updateUI;
  function markAct(){
    const active=document.querySelector('#hx71-story .hx71-chapter.is-active') || [...document.querySelectorAll('#hx71-story .hx71-chapter')].find(el=>{const top=el.getBoundingClientRect().top;return top<=innerHeight*.55 && top+el.offsetHeight>innerHeight*.25;});
    document.body.classList.toggle('hx71-act-void',!!active && active.dataset.id==='void');
  }
  addEventListener('scroll',markAct,{passive:true});
  addEventListener('resize',markAct,{passive:true});
  setTimeout(()=>{markAct();applyFilmRate();},0);
})();


/* V93 — explicit next phase control and dependable pause state. */
(function(){
  const next=document.querySelector('#hx71-next');
  next?.addEventListener('click',()=>{
    const current=getChapter(experience.time);
    const index=chapters.indexOf(current);
    const target=chapters[Math.min(chapters.length-1,index+1)];
    if(!target)return;
    experience.playing=false;
    narrationAudio?.pause(); audio?.main?.pause();
    experience.time=target.start;
    setScrollFromTime(target.start);
    document.body.classList.remove('hx71-film-mode');
    updateUI(true);
    document.querySelector('#hx71-film')?.setAttribute('aria-pressed','false');
    const b=document.querySelector('#hx71-film'); if(b)b.innerHTML='<span>▶</span> ASSISTIR FILME';
    const indicator=document.querySelector('#hx71-play-indicator'); if(indicator)indicator.hidden=true;
  });
})();


/* V94 — synchronized always-visible control dock. */
(function(){
  const pause=document.querySelector('#hx71-pause-dock');
  const speed=document.querySelector('#hx71-speed-dock');
  const next=document.querySelector('#hx71-next-dock');
  const headerSpeed=document.querySelector('#hx71-speed');
  function syncDock(){
    const playing=!!experience.playing;
    if(pause){pause.innerHTML=playing?'Ⅱ PAUSAR FILME':'▶ ASSISTIR FILME';pause.setAttribute('aria-pressed',String(playing));}
    const fast=filmPlaybackRate===2;
    [speed,headerSpeed].filter(Boolean).forEach(b=>{b.textContent=fast?'2×':'1×';b.setAttribute('aria-pressed',String(fast));b.title=fast?'Voltar para 1×':'Acelerar para 2×';});
  }
  pause?.addEventListener('click',()=>{toggleFilm();syncDock();});
  speed?.addEventListener('click',()=>{filmPlaybackRate=filmPlaybackRate===1?2:1;[narrationAudio,audio?.main,cinemaVideo,...(audio?.ambiences?[...audio.ambiences.values()]:[])].filter(Boolean).forEach(m=>{try{m.playbackRate=filmPlaybackRate}catch{}});syncDock();});
  next?.addEventListener('click',()=>{document.querySelector('#hx71-next')?.click();setTimeout(syncDock,0);});
  setInterval(syncDock,250);
  syncDock();
})();
