(() => {
  'use strict';
  window.__cyberShieldExperienceLoaded = true;
  const $=(s,c=document)=>c.querySelector(s);
  const $$=(s,c=document)=>[...c.querySelectorAll(s)];

  THREE.ColorManagement.enabled = true;

  const boot=$('#boot'), bar=$('#boot-progress'), pct=$('#boot-percent'), status=$('#boot-status'), start=$('#boot-start');
  const externalBootRelease=window.__cyberShieldBootRelease;
  const ambient=$('#ambient'), hud=$('#audio-hud'), audioToggle=$('#audio-toggle');
  const sfx={detect:$('#sfx-detect'),transition:$('#sfx-transition'),alert:$('#sfx-alert'),success:$('#sfx-success'),click:$('#sfx-click'),whoosh:$('#sfx-whoosh')};
  const chapters=$$('.chapter'), dots=$('#scene-dots'), counter=$('#scene-number');
  const explorePanel=$('#explore-panel'), exploreTitle=$('#explore-title'), exploreBody=$('#explore-body'), exploreExtra=$('#explore-extra'), exploreKicker=$('#explore-kicker');
  let audioOn=false, started=false, lastScene=0;

  const preload=[ambient,...Object.values(sfx)].filter(Boolean);
  const loadedAssets=new Set();
  const totalAssets=preload.length||1;
  function paintProgress(label='PREPARANDO CENA'){
    const n=Math.min(100,Math.round(loadedAssets.size/totalAssets*100));
    if(bar) bar.style.width=n+'%'; if(pct) pct.textContent=String(n).padStart(2,'0')+'%'; if(status) status.textContent=label;
  }
  function releaseBoot(label='AMBIENTE PRONTO'){
    if(start?.disabled!==true && start?.dataset.released==='1') return;
    if(start) { start.disabled=false; start.dataset.released='1'; }
    if(bar) bar.style.width='100%'; if(pct) pct.textContent='100%'; if(status) status.textContent=label;
  }
  preload.forEach(a=>{
    const done=()=>{ if(loadedAssets.has(a)) return; loadedAssets.add(a); paintProgress('ASSET PRONTO'); if(loadedAssets.size>=totalAssets) releaseBoot(); };
    a.addEventListener('loadeddata',done,{once:true}); a.addEventListener('canplaythrough',done,{once:true}); a.addEventListener('error',done,{once:true});
    try{a.load();}catch{done();}
  });
  setTimeout(()=>releaseBoot('AMBIENTE PRONTO'),3200);
  if(externalBootRelease) setTimeout(()=>externalBootRelease('AMBIENTE PRONTO'),150);

  function playSfx(name,vol=.32){const a=sfx[name]; if(!a)return; a.currentTime=0; a.volume=vol; a.play().catch(()=>{});}
  function setAudio(on){ audioOn=!!on; if(audioOn){ambient.volume=.16; ambient.play().catch(()=>{}); hud?.classList.add('is-playing'); const l=$('#audio-label'); if(l)l.textContent='SOM ON';} else {ambient.pause(); hud?.classList.remove('is-playing'); const l=$('#audio-label'); if(l)l.textContent='SOM OFF';} }
  start?.addEventListener('click',()=>{ if(started)return; started=true; setAudio(true); if(hud)hud.hidden=false; playSfx('transition',.22); document.body.classList.add('experience-started'); if(boot){boot.classList.add('is-done'); setTimeout(()=>boot.remove(),1100);} worlds.forEach((w,i)=>{ if(w.group){ w.group.scale.setScalar(.82); if(window.gsap){ window.gsap.to(w.group.scale,{x:1,y:1,z:1,duration:1.35,delay:Math.min(i*.05,.28),ease:'power3.out'}); } else { w.group.scale.setScalar(1); } }}); setTimeout(()=>{ if(worlds.get('scene-intro')){ const wi=worlds.get('scene-intro'); if(wi.model) playSfx('success',.08); } },650); });
  audioToggle?.addEventListener('click',()=>{setAudio(!audioOn); if(audioOn)playSfx('click',.18)});

  let lenis=null;
  if(window.Lenis && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    lenis=new window.Lenis({duration:1.05,smoothWheel:true,wheelMultiplier:.82,touchMultiplier:1.1});
    function raf(t){lenis.raf(t);requestAnimationFrame(raf)} requestAnimationFrame(raf);
  }

  const TOPICS={
    cid:{k:'FUNDAMENTO',t:'Tríade CID',b:'Confidencialidade, integridade e disponibilidade organizam a proteção da informação.',x:'Base conceitual do TCC: proteger acesso, consistência e disponibilidade.'},
    phishing:{k:'SIMULAÇÃO',t:'Phishing',b:'Uma mensagem fraudulenta tenta criar urgência e conduzir a vítima a um link ou solicitação de credenciais.',x:'Procure sinais antes de agir.'},
    malware:{k:'AMEAÇA',t:'Malware',b:'Malware reúne códigos maliciosos como vírus, worms e cavalos de Troia.',x:'A ameaça visual representa diferentes caminhos de comprometimento.'},
    api:{k:'ARQUITETURA',t:'API como fronteira',b:'Cada requisição entre sistemas precisa ser autenticada e autorizada.',x:'A API amplia a superfície de ataque quando os controles falham.'},
    'defense-depth':{k:'ARQUITETURA',t:'Defesa em Profundidade',b:'Uma barreira isolada não basta. A proteção funciona como camadas.',x:'Explore cada camada e continue a narrativa.'},
    lgpd:{k:'PRIVACIDADE',t:'LGPD',b:'A proteção de dados exige segurança e responsabilidade no tratamento de informações pessoais.',x:'O fluxo visualiza a jornada do dado.'},
    sast:{k:'CÓDIGO',t:'SAST',b:'A análise estática ajuda a encontrar vulnerabilidades durante o desenvolvimento.',x:'Encontrar falhas antes da produção reduz a superfície de ataque.'},
    recovery:{k:'CONTINUIDADE',t:'Recuperação',b:'Backups, recuperação de desastres e continuidade restabelecem serviços após incidentes.',x:'A história termina quando o sistema consegue se recuperar.'},
    'social-engineering':{k:'FATOR HUMANO',t:'Engenharia social',b:'Urgência, confiança e distração podem fazer o usuário abrir a porta.',x:'A decisão humana é parte da superfície de ataque.'}
  };
  const openTopic=key=>{const t=TOPICS[key]||TOPICS.cid; exploreKicker.textContent=t.k;exploreTitle.textContent=t.t;exploreBody.textContent=t.b;exploreExtra.textContent=t.x||'';explorePanel.classList.add('is-open');explorePanel.setAttribute('aria-hidden','false');document.body.classList.add('panel-open');playSfx('click',.18);};
  const closeTopic=()=>{explorePanel.classList.remove('is-open');explorePanel.setAttribute('aria-hidden','true');document.body.classList.remove('panel-open');};
  $('#explore-close')?.addEventListener('click',closeTopic); addEventListener('keydown',e=>{if(e.key==='Escape')closeTopic()});
  $$('.scene-hotspot').forEach(b=>b.addEventListener('click',()=>openTopic(b.dataset.topic)));

  const worlds=new Map();
  const worldKinds={'scene-intro':'intro','scene-user':'user','scene-threat':'threat','scene-attack':'attack','scene-defense':'defense','scene-privacy':'privacy','scene-dev':'dev','scene-final':'final'};
  const MODEL_BASE='assets/models/';
  const configs={
    intro:{target:4.4,pos:[0,-.15,0],rot:[0,.18,0],tilt:.05},
    user:{target:3.7,pos:[0,-.25,0],rot:[0,-.18,0],tilt:.08},
    threat:{target:3.9,pos:[.5,-.15,-.1],rot:[0,.65,0],tilt:.02},
    attack:{target:5.1,pos:[0,-.6,-.2],rot:[0,-.2,0],tilt:.03},
    defense:{target:3.5,pos:[0,-.3,-.15],rot:[0,.25,0],tilt:.02},
    privacy:{target:3.7,pos:[.2,-.3,-.15],rot:[0,-.35,0],tilt:.04},
    dev:{target:5.1,pos:[.3,-.5,-.1],rot:[0,.25,0],tilt:.03},
    final:{target:3.9,pos:[0,-.3,-.15],rot:[0,.1,0],tilt:.03}
  };

  function makeWorld(canvas,kind){
    if(!canvas)return null;
    const mobile=matchMedia('(max-width:700px)').matches;
    const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:!mobile,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.2:1.8));
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.05;
    renderer.setClearColor(0x000000,0);
    renderer.setSize(Math.max(1,canvas.clientWidth),Math.max(1,canvas.clientHeight),false);
    const scene=new THREE.Scene();
    scene.fog=new THREE.FogExp2(0x05070b,.018);
    const camera=new THREE.PerspectiveCamera(35,Math.max(1,canvas.clientWidth)/Math.max(1,canvas.clientHeight),.1,160); camera.position.set(0,.1,8.8);
    const group=new THREE.Group(); scene.add(group);
    const hemi=new THREE.HemisphereLight(0x9fe9ff,0x0a1020,1.25); scene.add(hemi);
    const key=new THREE.DirectionalLight(0xbafee3,3.2); key.position.set(3,4,5); scene.add(key);
    const rim=new THREE.PointLight(0x6ee7f7,30,30,2); rim.position.set(-3,1,4); scene.add(rim);
    const fill=new THREE.PointLight(0xb69cff,22,28,2); fill.position.set(3,-2,-1); scene.add(fill);
    const points=kind==='attack'?1200:kind==='defense'?1000:800;
    const geo=new THREE.BufferGeometry(); const pos=new Float32Array(points*3); const cols=new Float32Array(points*3);
    for(let i=0;i<points;i++){const r=kind==='defense'?THREE.MathUtils.randFloat(2,6):THREE.MathUtils.randFloat(2.5,8);const a=Math.random()*Math.PI*2;const y=THREE.MathUtils.randFloatSpread(6);pos[i*3]=Math.cos(a)*r+THREE.MathUtils.randFloatSpread(1);pos[i*3+1]=y;pos[i*3+2]=Math.sin(a)*r;const c=new THREE.Color().setHSL(.52+Math.random()*.28,.76,.56);cols[i*3]=c.r;cols[i*3+1]=c.g;cols[i*3+2]=c.b;}
    geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('color',new THREE.BufferAttribute(cols,3));
    group.add(new THREE.Points(geo,new THREE.PointsMaterial({size:mobile?.018:.026,vertexColors:true,transparent:true,opacity:.52,blending:THREE.AdditiveBlending,depthWrite:false})));
    const rings=[];for(let i=0;i<(kind==='defense'?7:4);i++){const m=new THREE.Mesh(new THREE.TorusGeometry(1.15+i*.48,.008,12,140),new THREE.MeshBasicMaterial({color:[0x8cffb5,0x6ee7f7,0xb69cff][i%3],transparent:true,opacity:.17,blending:THREE.AdditiveBlending}));m.rotation.x=.8+i*.14;m.rotation.y=i*.23;group.add(m);rings.push(m)}
    const world={renderer,scene,camera,group,kind,rings,model:null,mixer:null,modelRoot:null,loadProgress:0,ready:false}; worlds.set(canvas.id,world); return world;
  }
  Object.entries(worldKinds).forEach(([id,kind])=>makeWorld($('#'+id),kind));

  const loader=new THREE.GLTFLoader();
  const mixers=[];
  function fitModel(obj,target){
    const box=new THREE.Box3().setFromObject(obj); const size=box.getSize(new THREE.Vector3()); const max=Math.max(size.x,size.y,size.z)||1; const scale=target/max; obj.scale.setScalar(scale);
    const box2=new THREE.Box3().setFromObject(obj); const center=box2.getCenter(new THREE.Vector3()); obj.position.sub(center); obj.userData.baseScale=scale;
  }
  function setupModel(chapter){
    const canvas=chapter.querySelector('canvas'); const w=worlds.get(canvas?.id); const file=chapter.dataset.model; if(!w||!file)return;
    loader.load(MODEL_BASE+file,gltf=>{
      const model=gltf.scene; const cfg=configs[w.kind]||configs.intro; fitModel(model,cfg.target);
      model.position.set(...cfg.pos); model.rotation.set(...cfg.rot); model.userData.topic=chapter.dataset.topic||'cid'; model.userData.baseScale=model.scale.x; model.traverse(o=>{o.userData.topic=model.userData.topic; if(o.isMesh){o.castShadow=false;o.receiveShadow=false; if(o.material){o.material.envMapIntensity=.8;}}});
      w.group.add(model);w.model=model;w.modelRoot=model;w.ready=true;
      if(gltf.animations?.length){w.mixer=new THREE.AnimationMixer(model);gltf.animations.forEach(clip=>w.mixer.clipAction(clip).play());mixers.push(w.mixer)}
      const badge=chapter.querySelector('.model-state'); if(badge)badge.textContent='3D ONLINE';
      const title=chapter.querySelector('.model-title'); if(title)title.textContent=file.replace('.glb','').replace(/_/g,' ').toUpperCase();
      playSfx('success',.07);
    },xhr=>{const p=xhr.total?xhr.loaded/xhr.total:0;w.loadProgress=p;const badge=chapter.querySelector('.model-state');if(badge&&p>0)badge.textContent='3D '+Math.round(p*100)+'%';},()=>{const badge=chapter.querySelector('.model-state');if(badge)badge.textContent='3D FALLBACK';});
  }
  chapters.forEach(c=>setupModel(c));

  const raycaster=new THREE.Raycaster(), mouseNdc=new THREE.Vector2();
  function handleCanvasClick(w,e){ if(!w.model && !w.core)return; const rect=w.renderer.domElement.getBoundingClientRect(); mouseNdc.x=((e.clientX-rect.left)/rect.width)*2-1;mouseNdc.y=-((e.clientY-rect.top)/rect.height)*2+1;raycaster.setFromCamera(mouseNdc,w.camera);const targets=[];if(w.model)targets.push(w.model);const hit=raycaster.intersectObjects(targets,true)[0];if(hit){openTopic(hit.object.userData.topic||'cid');playSfx('detect',.12);}}
  worlds.forEach(w=>{w.renderer.domElement.style.cursor='pointer';w.renderer.domElement.addEventListener('click',e=>handleCanvasClick(w,e));});

  let pointer={x:0,y:0}; addEventListener('pointermove',e=>{pointer.x=e.clientX/innerWidth-.5;pointer.y=e.clientY/innerHeight-.5;const c=$('#cursor');if(c&&innerWidth>900){document.body.classList.add('has-cursor');c.style.left=e.clientX+'px';c.style.top=e.clientY+'px'}});
  addEventListener('resize',()=>{worlds.forEach(w=>{const c=w.renderer.domElement;w.renderer.setSize(c.clientWidth,c.clientHeight,false);w.camera.aspect=Math.max(1,c.clientWidth)/Math.max(1,c.clientHeight);w.camera.updateProjectionMatrix();});updateScroll();});

  function render(){
    const t=performance.now()*.001;
    mixers.forEach(m=>m.update(.016));
    worlds.forEach(w=>{
      const r=w.renderer,c=r.domElement;
      if(c.clientWidth>0&&c.clientHeight>0&&(c.width!==Math.floor(c.clientWidth*r.getPixelRatio())||c.height!==Math.floor(c.clientHeight*r.getPixelRatio()))){r.setSize(c.clientWidth,c.clientHeight,false);w.camera.aspect=c.clientWidth/c.clientHeight;w.camera.updateProjectionMatrix();}
      w.group.rotation.y += .0008 + pointer.x*.0006; w.group.rotation.x += (pointer.y*.00035-w.group.rotation.x)*.03;
      w.rings.forEach((m,i)=>{m.rotation.z=t*(.04+i*.014)*(i%2?1:-1);m.rotation.y += .0003;});
      if(w.model){const pulse=1+Math.sin(t*1.25+w.kind.length)*.025; w.model.scale.setScalar((w.model.userData.baseScale||1)*pulse); const cfg=configs[w.kind]||configs.intro; w.model.position.y=cfg.pos[1]+Math.sin(t*.75+w.kind.length)*.045; w.model.rotation.y=cfg.rot[1]+t*.12;}
      r.render(w.scene,w.camera);
    });
    requestAnimationFrame(render);
  }
  worlds.forEach((w)=>{const canvasId=w.renderer.domElement.id; w.chapter=document.querySelector(`[data-model] canvas#${canvasId}`)?.closest('.chapter')||null;});
  render();

  chapters.forEach((c,i)=>{const b=document.createElement('button');b.setAttribute('aria-label','Ir para cena '+(i+1));b.addEventListener('click',()=>lenis?lenis.scrollTo(c,{duration:1.2}):c.scrollIntoView({behavior:'smooth'}));dots?.appendChild(b)});
  const sceneNames=['CIBERSEGURANÇA','O USUÁRIO','A AMEAÇA','CADEIA DE ATAQUE','DEFESA EM PROFUNDIDADE','LGPD & PRIVACIDADE','DESENVOLVIMENTO SEGURO','RESPOSTA'];
  const progressFill=$('#topbar-progress-fill'),modelBadgeText=$('#model-badge-text');
  let lastScroll=scrollY;
  function updateScroll(){
    const center=innerHeight*.48;let active=0;
    chapters.forEach((c,i)=>{const r=c.getBoundingClientRect();const focus=Math.min(1,Math.max(0,1-Math.abs(r.top+innerHeight/2-center)/innerHeight));if(focus>.52)active=i;const w=worlds.get(c.querySelector('canvas')?.id);if(w){const local=Math.min(1,Math.max(0,(innerHeight-r.top)/(innerHeight+c.offsetHeight)));const centered=Math.max(0,1-Math.min(1,Math.abs(r.top)/innerHeight));w.camera.position.z=(configs[w.kind]?.target>4?9.8:8.7)-centered*1.55;w.camera.position.x=pointer.x*(1.0+centered*1.8)+(i%2?0.12:-0.08);w.camera.position.y=pointer.y*(-.55-centered*.4);w.group.position.y=(local-.5)*.4;w.group.rotation.z=(local-.5)*.025;if(w.model){const cfg=configs[w.kind]||configs.intro;const hero=1+centered*.16;w.model.scale.setScalar((w.model.userData.baseScale||1)*hero);w.model.position.z=cfg.pos[2]+centered*.45;w.model.position.y=cfg.pos[1]+Math.sin(local*Math.PI)*.18;w.model.rotation.x=cfg.rot[0]+pointer.y*.08;w.model.rotation.y=cfg.rot[1]+pointer.x*.22;}}c.style.setProperty('--chapter-progress',local.toFixed(4));c.classList.toggle('is-active',i===active);c.classList.toggle('scene-past',i<active);});
    if(active!==lastScene){const dir=active>lastScene?1:-1;counter.textContent=String(active+1).padStart(2,'0');dots?.querySelectorAll('button').forEach((b,i)=>b.classList.toggle('is-active',i===active));if(started)playSfx(dir>0?'whoosh':'transition',.12);if(window.gsap){gsap.fromTo(chapters[active].querySelectorAll('.eyebrow,h2,.story-copy>p,.data-flow,.code-window,.defense-stack,.attack-path,.threat-orbit,.final-actions'),{opacity:0,y:dir>0?26:-18},{opacity:1,y:0,duration:.8,stagger:.04,ease:'power3.out',overwrite:true});}lastScene=active;}
    const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);const p=Math.min(1,Math.max(0,scrollY/max));if(progressFill)progressFill.style.width=p*100+'%';if(modelBadgeText)modelBadgeText.textContent=(sceneNames[active]||'AMBIENTE 3D')+' · '+(worlds.get(chapters[active].querySelector('canvas')?.id)?.ready?'3D':'CARREGANDO');
    lastScroll=scrollY;
  }
  let tick=false;addEventListener('scroll',()=>{if(!tick){requestAnimationFrame(()=>{updateScroll();tick=false});tick=true;}},{passive:true});updateScroll();
  $$('.scene-action[data-reveal]').forEach(b=>b.addEventListener('click',()=>{const card=$('#phishing-card');if(card){card.hidden=!card.hidden;playSfx(card.hidden?'click':'detect',.22);}}));
  $$('.threat-chip').forEach(b=>b.addEventListener('click',()=>{ $$('.threat-chip').forEach(x=>x.classList.remove('is-hot'));b.classList.add('is-hot');const map={phishing:'Engenharia social por link ou mensagem.',malware:'Código criado para comprometer sistemas.',ransomware:'Bloqueio de dados para extorsão.',spyware:'Coleta de dados sem consentimento.',trojan:'Software disfarçado de algo legítimo.',worm:'Propagação automática pela rede.'};const cap=$('#threat-caption');if(cap)cap.textContent=map[b.dataset.threat]||'Ameaça';playSfx('alert',.12);}));
})();
