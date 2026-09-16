import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js';

const MODEL_BASE='assets/hexad/3d/';
const AUDIO_BASE='assets/hexad/audio/';
const VIDEO_BASE='assets/hexad/video/';
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const worlds=[
 {name:'Confidencialidade',tag:'RESTRIÇÃO DE ACESSO',failure:'EXPOSE',response:'LOCK',copy:'Somente quem deve ver a informação consegue alcançá-la.',model:'hexad-confidentiality.glb'},
 {name:'Posse / Controle',tag:'DOMÍNIO DO ATIVO',failure:'STEAL',response:'ISOLATE',copy:'Não basta enxergar o dado; é preciso preservar quem o controla.',model:'hexad-possession.glb'},
 {name:'Integridade',tag:'COERÊNCIA DO CONTEÚDO',failure:'ALTER',response:'REPAIR',copy:'A informação precisa chegar ao destino sem ser alterada pelo caminho.',model:'hexad-integrity.glb'},
 {name:'Autenticidade',tag:'IDENTIDADE VERIFICADA',failure:'SPOOF',response:'VERIFY',copy:'O sistema precisa saber de onde a informação realmente veio.',model:'hexad-authenticity.glb'},
 {name:'Disponibilidade',tag:'ACESSO QUANDO NECESSÁRIO',failure:'DISRUPT',response:'RESTORE',copy:'Uma informação segura também precisa estar presente quando o sistema precisa dela.',model:'hexad-availability.glb'},
 {name:'Utilidade',tag:'VALOR EM CONTEXTO',failure:'CORRUPT',response:'RECOVER',copy:'Informação protegida perde o sentido quando deixa de ser utilizável.',model:'hexad-utility.glb'}
];
const narrator={
 hero:'A informação nasce no centro. O que a torna segura é a relação entre seis forças.',
 orbit:'Cada mundo protege uma propriedade diferente. Nenhuma existe sozinha.',
 world:w=>`${w.name}. ${w.copy}`,
 collapse:'Quando uma força cai, as demais sentem o impacto. Segurança é uma arquitetura de relações.',
 restore:'Detectar. Isolar. Reparar. Verificar. Restaurar. Estabilizar.',
 synthesis:'Quando as seis forças permanecem coerentes, a informação preserva identidade, contexto e valor.'
};
const narrationTracks={
 hero:'hexad-01-genesis.mp3', entry:'hexad-02-entry.mp3',
 confidentiality:'hexad-03-confidentiality.mp3', possession:'hexad-04-possession.mp3',
 integrity:'hexad-05-integrity.mp3', authenticity:'hexad-06-authenticity.mp3',
 availability:'hexad-07-availability.mp3', utility:'hexad-08-utility.mp3',
 collapse:'hexad-09-collapse.mp3', restore:'hexad-10-restoration.mp3',
 synthesis:'hexad-11-synthesis.mp3', outro:'hexad-12-outro.mp3'
};
let narrationAudio=null;
function playNarration(track){
 if(!narrationOn)return;
 const file=narrationTracks[track]; if(!file)return;
 const src=AUDIO_BASE+'narration/'+file;
 if(narrationAudio && narrationAudio.src===new URL(src,location.href).href){narrationAudio.currentTime=0;narrationAudio.play().catch(()=>{});return;}
 if(narrationAudio){narrationAudio.pause(); narrationAudio.src='';}
 narrationAudio=new Audio(src); narrationAudio.preload='auto'; narrationAudio.volume=.92;
 narrationAudio.play().catch(()=>{});
}

const audio={enabled:false,master:null,ambiences:new Map(),started:false};
function setupAudio(){
 audio.master=new Audio(AUDIO_BASE+'ambience/hexad-main.mp3'); audio.master.loop=true; audio.master.volume=.16; audio.master.preload='auto';
 worlds.forEach(w=>{const a=new Audio(AUDIO_BASE+'ambience/hexad-'+w.name.toLowerCase().replaceAll(' / ','-').replaceAll('í','i').replaceAll('á','a').replaceAll('é','e').replaceAll('ô','o').replaceAll('ã','a').replaceAll('ê','e').replaceAll('ç','c').replaceAll('ú','u').replaceAll('confidencialidade','confidentiality').replaceAll('posse-controle','possession').replaceAll('integridade','integrity').replaceAll('autenticidade','authenticity').replaceAll('disponibilidade','availability').replaceAll('utilidade','utility')+'.mp3'); a.loop=true; a.volume=0; audio.ambiences.set(w.name,a)});
}
function cueSfx(name){if(!audio.enabled)return; const a=new Audio(AUDIO_BASE+'sfx/hexad-'+name+'.wav'); a.volume=.34; a.play().catch(()=>{});}
function enableAudio(){audio.enabled=true; audio.master?.play().catch(()=>{}); cueSfx('enter'); updateAudioButton();}
function updateAudioButton(){const b=document.querySelector('#hx-audio'); b?.setAttribute('aria-pressed',String(audio.enabled)); if(b)b.textContent=audio.enabled?'Som ativo':'Som';}

const narrationPanel=document.querySelector('#hx-narration-panel'), narrationText=document.querySelector('#hx-narration-text');
let narrationOn=false;
function say(text,track=null){if(!narrationOn)return; narrationText.textContent=text; narrationPanel.hidden=false; if(track)playNarration(track); setTimeout(()=>{ if(narrationText.textContent===text) narrationPanel.hidden=true; },9000);}
function setNarration(on){narrationOn=on; document.querySelector('#hx-narration')?.setAttribute('aria-pressed',String(on)); if(!on){narrationPanel.hidden=true;narrationAudio?.pause();} else say(narrator.hero,'hero');}

function initRenderer(){
 const canvas=document.querySelector('#hx-canvas'); const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio,window.innerWidth<700?1.25:1.75)); renderer.setSize(canvas.clientWidth,canvas.clientHeight,false);
 const scene=new THREE.Scene(); scene.fog=new THREE.FogExp2(0x05070c,.012);
 const camera=new THREE.PerspectiveCamera(42,1,.1,100); camera.position.set(0,1.8,7);
 scene.add(new THREE.AmbientLight(0x99a7c5,1.1));
 const key=new THREE.PointLight(0xbfefff,18,30); key.position.set(0,2,4); scene.add(key);
 const loader=new GLTFLoader();
 const root=new THREE.Group(); scene.add(root);
 const stars=new THREE.Points(
   new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(Array.from({length:900},()=> (Math.random()-.5)*32),1)),
   new THREE.PointsMaterial({color:0xb8d5ff,size:.025,transparent:true,opacity:.62})
 );
 // replace malformed 1D star attribute with a proper 3D buffer
 const arr=new Float32Array(1800*3); for(let i=0;i<arr.length;i++)arr[i]=(Math.random()-.5)*34;
 const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.BufferAttribute(arr,3)); stars.geometry.dispose(); stars.geometry=geo; scene.add(stars);
 let core=null, drone=null, t0=performance.now();
 Promise.all(['hexad-data-core.glb','hexad-drone.glb','hexad-satellite.glb'].map(n=>new Promise(res=>loader.load(MODEL_BASE+n,g=>res(g.scene),undefined,()=>res(null))))).then(([c,d,s])=>{
   core=c; drone=d; [core,drone].forEach(m=>{if(m){m.scale.setScalar(1.2); root.add(m)}}); if(s){for(let i=0;i<6;i++){const q=s.clone(); q.position.set(Math.cos(i*Math.PI/3)*3.2,Math.sin(i*Math.PI/3)*.45,Math.sin(i*Math.PI/3)*1.1); q.scale.setScalar(.45); root.add(q)}}
 });
 function resize(){const w=canvas.clientWidth||window.innerWidth,h=canvas.clientHeight||window.innerHeight; camera.aspect=w/h; camera.updateProjectionMatrix(); renderer.setSize(w,h,false);}
 const ro=new ResizeObserver(resize); ro.observe(canvas); resize();
 function loop(now){
   const dt=Math.min(.05,(now-t0)/1000); t0=now;
   if(!reduced){root.rotation.y += dt*.12; if(core) core.rotation.y += dt*.5; if(drone){drone.position.y=1.15+Math.sin(now*.0011)*.12; drone.rotation.y += dt*.65;} stars.rotation.y -= dt*.015;}
   renderer.render(scene,camera); requestAnimationFrame(loop);
 }
 loop(performance.now());
 return {scene,renderer,camera,root,loader};
}

function fallback(){
 const c=document.querySelector('#hx-canvas'); if(c)c.remove();
 document.querySelector('.hx-video-bg').style.opacity='.3';
 document.querySelector('#hx-hero').classList.add('hx-webgl-fallback');
}
let renderApi=null; try{renderApi=initRenderer()}catch(e){console.warn('Hexad WebGL fallback',e);fallback()}

const ui=document.querySelector('#hx-orbit-ui');
const focusName=document.querySelector('#hx-focus-name'), focusTag=document.querySelector('#hx-focus-tag'), focusIndex=document.querySelector('#hx-focus-index');
const dossierTitle=document.querySelector('#hx-dossier-title'), dossierCopy=document.querySelector('#hx-dossier-copy'), dossierFailure=document.querySelector('#hx-dossier-failure'), dossierResponse=document.querySelector('#hx-dossier-response'), dossierNumber=document.querySelector('#hx-dossier-number');
let active=0;
function focusWorld(i,announce=true){
 active=(i+6)%6; const w=worlds[active];
 document.querySelectorAll('.hx-planet-btn').forEach((b,j)=>b.classList.toggle('is-active',j===active));
 focusIndex.textContent=String(active+1).padStart(2,'0'); focusName.textContent=w.name; focusTag.textContent=w.tag;
 dossierNumber.textContent=String(active+1).padStart(2,'0'); dossierTitle.textContent=w.name; dossierCopy.textContent=w.copy; dossierFailure.textContent=w.failure; dossierResponse.textContent=w.response;
 audio.ambiences.forEach((a,n)=>{a.volume=(audio.enabled&&n===w.name)?.10:0;if(n===w.name&&audio.enabled)a.play().catch(()=>{})});
 cueSfx('select'); if(announce){const key=['confidentiality','possession','integrity','authenticity','availability','utility'][active]; say(narrator.world(w),key);}
}
worlds.forEach((w,i)=>{const b=document.createElement('button'); b.className='hx-planet-btn'+(i===0?' is-active':''); b.type='button'; b.style.left=`${50+34*Math.cos(i*Math.PI/3-Math.PI/2)}%`; b.style.top=`${50+34*.64*Math.sin(i*Math.PI/3-Math.PI/2)}%`; b.innerHTML=`<span class="hx-planet-num">${String(i+1).padStart(2,'0')}</span>${w.name}`; b.addEventListener('click',()=>focusWorld(i)); b.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();focusWorld(i+1);document.querySelectorAll('.hx-planet-btn')[active].focus()} if(e.key==='ArrowLeft'){e.preventDefault();focusWorld(i-1);document.querySelectorAll('.hx-planet-btn')[active].focus()}}); ui.appendChild(b)});
focusWorld(0,false);

const sims=[['EXPOSE','Confidencialidade'],['STEAL','Posse / Controle + Confidencialidade'],['ALTER','Integridade + Utilidade'],['SPOOF','Autenticidade'],['DISRUPT','Disponibilidade'],['CORRUPT','Integridade + Utilidade']];
let score=6;
const list=document.querySelector('#hx-sim-list');
sims.forEach(([code,label])=>{const b=document.createElement('button');b.type='button';b.className='hx-sim';b.innerHTML=`<span>${code}</span><span>${label}</span>`;b.addEventListener('click',()=>triggerFailure(code));list.appendChild(b)});
function triggerFailure(code){score=Math.max(0,score-1);document.querySelector('#hx-cinema-state').textContent='INCIDENTE DETECTADO';document.querySelector('#hx-cinema-score').textContent=`${score} / 6`;cueSfx('alert');say(narrator.collapse,'collapse'); const v=document.querySelector('#hx-collapse-video'); v.currentTime=0; v.play().catch(()=>{});}
function resetScore(){score=6;document.querySelector('#hx-cinema-state').textContent='SISTEMA ESTÁVEL';document.querySelector('#hx-cinema-score').textContent='6 / 6';cueSfx('restore');say(narrator.restore,'restore');}

const restoreSteps=['Detectar','Isolar','Reparar','Verificar','Restaurar','Estabilizar'];
const rlist=document.querySelector('#hx-restore-steps'); restoreSteps.forEach((s,i)=>{const li=document.createElement('li');li.innerHTML=`<span>${String(i+1).padStart(2,'0')} · ${s.toUpperCase()}</span><span>AGUARDANDO</span>`;rlist.appendChild(li)});
async function runRestore(){const v=document.querySelector('#hx-restore-video'); v.currentTime=0; v.play().catch(()=>{}); say(narrator.restore,'restore'); cueSfx('restore'); for(let i=0;i<rlist.children.length;i++){const li=rlist.children[i]; li.classList.add('is-done'); li.lastElementChild.textContent='CONCLUÍDO'; await new Promise(r=>setTimeout(r,reduced?100:500));} resetScore();}

document.querySelector('#hx-enter').addEventListener('click',()=>{enableAudio();document.querySelector('#hx-orbit').scrollIntoView({behavior:reduced?'auto':'smooth'});say(narrator.orbit)});
document.querySelector('#hx-replay').addEventListener('click',()=>{const v=document.querySelector('#hx-genesis-video');v.currentTime=0;v.play().catch(()=>{});say(narrator.hero)});
document.querySelector('#hx-dossier-sim').addEventListener('click',()=>triggerFailure(worlds[active].failure));
document.querySelector('#hx-sim-reset').addEventListener('click',resetScore);
document.querySelector('#hx-restore-run').addEventListener('click',runRestore);
document.querySelector('#hx-audio').addEventListener('click',()=>audio.enabled?(()=>{audio.enabled=false;audio.master?.pause();audio.ambiences.forEach(a=>a.pause());updateAudioButton()})():enableAudio());
document.querySelector('#hx-narration').addEventListener('click',()=>setNarration(!narrationOn));
document.querySelector('#hx-narration-close').addEventListener('click',()=>narrationPanel.hidden=true);
setupAudio();
updateAudioButton();
new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return; if(e.target.id==='hx-orbit')say(narrator.orbit,'orbit'); if(e.target.id==='hx-cinema')say(narrator.collapse,'collapse'); if(e.target.id==='hx-restore')say(narrator.restore,'restore'); if(e.target.id==='hx-synthesis')say(narrator.synthesis)}),{threshold:.45}).observe(document.querySelector('#hx-orbit'));
['hx-cinema','hx-restore','hx-synthesis'].forEach(id=>new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){say(id==='hx-cinema'?narrator.collapse:id==='hx-restore'?narrator.restore:narrator.synthesis)}}),{threshold:.45}).observe(document.getElementById(id));

window.__cyberShieldHexad={version:'60',focusWorld,triggerFailure,resetScore,runRestore,narrator};
