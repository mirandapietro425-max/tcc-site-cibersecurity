import * as THREE from 'https://esm.sh/three@0.170.0';
import {GLTFLoader} from 'https://esm.sh/three@0.170.0/examples/jsm/loaders/GLTFLoader.js';

(()=>{
  const root=document.querySelector('.pb-protect');
  if(!root) return;
  const canvas=document.querySelector('#pb-protect-canvas');
  const story=document.querySelector('#pb-protect-story');
  const stage=document.querySelector('#pb-protect-stage');
  const title=document.querySelector('#pb-protect-title');
  const body=document.querySelector('#pb-protect-body');
  const metaKicker=document.querySelector('#pb-protect-meta-kicker');
  const metaTitle=document.querySelector('#pb-protect-meta-title');
  const index=document.querySelector('#pb-protect-index');
  const railCode=document.querySelector('#pb-defense-rail-code');
  const progress=document.querySelector('#pb-defense-progress');
  const progressLabel=document.querySelector('#pb-defense-progress-label');
  const statusText=document.querySelector('#pb-protect-status-text');
  const layers=[...document.querySelectorAll('.pb-defense-layer')];
  const panel=document.querySelector('#pb-protect-panel');
  const panelKicker=document.querySelector('#pb-protect-panel-kicker');
  const panelTitle=document.querySelector('#pb-protect-panel-title');
  const panelBody=document.querySelector('#pb-protect-panel-body');
  const close=document.querySelector('#pb-protect-close');
  const replay=document.querySelector('#pb-protect-replay');

  const steps=[
    {file:'01-guardiao-humano.glb',poster:'01-guardiao-humano.png',meta:'IDENTIDADE',name:'Guardião humano',title:'A proteção começa por <em>você</em>.',body:'Antes de proteger sistemas, precisamos saber quem está entrando. Identidade forte reduz o espaço para abuso antes do primeiro acesso.',status:'CAMADA · IDENTIDADE',rotX:0,target:2.65,accent:'green',scene:'A primeira barreira'},
    {file:'02-dispositivo-protegido.glb',poster:'02-dispositivo-protegido.png',meta:'DISPOSITIVO',name:'Endpoint protegido',title:'Todo dispositivo é uma <em>porta</em>.',body:'Atualização, configuração e autenticação transformam o endpoint em uma superfície controlada — não em um ponto cego.',status:'CAMADA · ENDPOINT',rotX:0,target:2.55,accent:'cyan',scene:'A porta precisa de contexto'},
    {file:'03-nucleo-rede.glb',poster:'03-nucleo-rede.png',meta:'REDE',name:'Núcleo conectado',title:'Nenhum dispositivo está <em>isolado</em>.',body:'Cada conexão cria um caminho. Segmentação e menor privilégio limitam a movimentação quando um ponto falha.',status:'CAMADA · REDE',rotX:0,target:2.55,accent:'violet',scene:'Os caminhos precisam de limites'},
    {file:'04-ameaca-hacker.glb',poster:'04-ameaca-hacker.png',meta:'AMEAÇA',name:'Entrada interrompida',title:'O ataque encontra <em>fricção</em>.',body:'A ameaça observa, testa e procura uma brecha. Sinais, logs e controles tornam a aproximação percebida antes do impacto.',status:'CAMADA · VISIBILIDADE',rotX:0,target:2.72,accent:'red',scene:'O ataque não avisa'},
    {file:'05-escudo-cibernetico.glb',poster:'05-escudo-cibernetico.png',meta:'ESCUDO',name:'Proteção consolidada',title:'As camadas fecham o <em>circuito</em>.',body:'Prevenção, detecção, resposta e recuperação formam uma defesa contínua — não uma parede única.',status:'SISTEMA · PROTEÇÃO CONSOLIDADA',rotX:0,target:2.55,accent:'green',scene:'A defesa vira sistema'}
  ];

  const topics={
    mfa:['CONTROLE · 01','Identidade','MFA acrescenta uma segunda prova de identidade. Assim, uma senha comprometida não deve ser suficiente para atravessar a primeira barreira.'],
    validation:['APLICAÇÃO · 02','Dispositivo','Higiene de endpoint, atualização e configuração reduzem a superfície de ataque. O dispositivo precisa ser um ponto controlado, não um ponto cego.'],
    privilege:['ARQUITETURA · 03','Rede','Segmentação e menor privilégio restringem caminhos de movimentação e reduzem o impacto de uma conta comprometida.'],
    monitoring:['VISIBILIDADE · 04','Ameaça','Logs, sinais e controles ajudam a perceber a aproximação da ameaça e acelerar a resposta antes do impacto.'],
    crypto:['DEFESA · 05','Escudo','A proteção consolidada combina prevenção, detecção, resposta e recuperação para que uma falha isolada não encerre a defesa.']
  };

  const openPanel=(key)=>{
    const t=topics[key];
    if(!t)return;
    panelKicker.textContent=t[0];
    panelTitle.textContent=t[1];
    panelBody.textContent=t[2];
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden','false');
    document.body.classList.add('pb-panel-open');
  };
  const closePanel=()=>{
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden','true');
    document.body.classList.remove('pb-panel-open');
  };
  close?.addEventListener('click',closePanel);
  panel?.addEventListener('click',e=>{if(e.target===panel)closePanel()});
  addEventListener('keydown',e=>{if(e.key==='Escape')closePanel()});

  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:innerWidth>900,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.25));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.02;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(29,1,.1,100);
  camera.position.set(0,0.05,9.5);
  const hemi=new THREE.HemisphereLight(0xa9efff,0x03070a,1.35);scene.add(hemi);
  const key=new THREE.DirectionalLight(0xe1fff2,2.35);key.position.set(4,6,7);scene.add(key);
  const rim=new THREE.PointLight(0x70e7f7,15,14);rim.position.set(-2.8,1.5,3.8);scene.add(rim);
  const glow=new THREE.PointLight(0x8cffb5,11,13);glow.position.set(2.6,-1.3,2.4);scene.add(glow);
  const world=new THREE.Group();scene.add(world);

  const dustCount=innerWidth>700?130:55;
  const dg=new THREE.BufferGeometry();const dp=new Float32Array(dustCount*3);
  for(let i=0;i<dustCount;i++){const a=Math.random()*Math.PI*2,r=THREE.MathUtils.randFloat(3.8,7.4);dp[i*3]=Math.cos(a)*r;dp[i*3+1]=THREE.MathUtils.randFloatSpread(4.2);dp[i*3+2]=Math.sin(a)*r}
  dg.setAttribute('position',new THREE.BufferAttribute(dp,3));
  world.add(new THREE.Points(dg,new THREE.PointsMaterial({color:0x79e9f0,size:.018,transparent:true,opacity:.18,blending:THREE.AdditiveBlending,depthWrite:false})));

  const loader=new GLTFLoader();
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeModel=null;
  let activeIndex=-1;
  let pendingIndex=-1;
  let outgoingModel=null;
  let transition=1;
  let transitionDirection=1;
  let running=true;
  let currentStep=0;
  let lastT=performance.now();

  function disposeObject(obj){
    if(!obj)return;
    obj.traverse(n=>{
      if(n.isMesh){n.geometry?.dispose?.();if(Array.isArray(n.material))n.material.forEach(m=>m?.dispose?.());else n.material?.dispose?.()}
    });
  }
  function prepareModel(model,step){
    model.rotation.set(step.rotX,0,0);
    model.updateMatrixWorld(true);
    const box=new THREE.Box3().setFromObject(model);
    const size=box.getSize(new THREE.Vector3());
    const max=Math.max(size.x,size.y,size.z)||1;
    const scale=step.target/max;
    model.scale.setScalar(scale);
    model.updateMatrixWorld(true);
    const box2=new THREE.Box3().setFromObject(model);
    const center=box2.getCenter(new THREE.Vector3());
    model.position.sub(center);
    model.position.x=1.15;
    model.position.y=-.10;
    model.position.z=0;
    model.userData.baseScale=scale;
    model.userData.homeY=-.10;
    model.userData.homeX=1.15;
    model.userData.baseRotY=0;
    model.traverse(n=>{if(n.isMesh&&n.material){n.material.envMapIntensity=1.1;n.frustumCulled=true}});
    return model;
  }
  function loadStep(i){
    if(i===activeIndex||i===pendingIndex)return;
    const step=steps[i];pendingIndex=i;stage.classList.remove('model-load-failed');
    const finish=(gltf)=>{pendingIndex=-1;const model=prepareModel(gltf.scene,step);activate(i,model)};
    const fail=()=>{pendingIndex=-1;stage.classList.add('model-load-failed')};
    loader.load('assets/protect-story/'+step.file,finish,undefined,fail);
  }
  function activate(i,next){
    if(activeIndex===i)return;
    if(!next)return;
    if(outgoingModel){world.remove(outgoingModel);disposeObject(outgoingModel);outgoingModel=null}
    outgoingModel=activeModel;
    transitionDirection=i>activeIndex?1:-1;
    transition=0;
    activeModel=next;
    activeIndex=i;
    activeModel.visible=true;
    activeModel.userData.introX=1.15+transitionDirection*.70;
    activeModel.userData.introY=-.10-.14;
    activeModel.position.x=activeModel.userData.introX;
    activeModel.position.y=activeModel.userData.introY;
    activeModel.scale.setScalar((activeModel.userData.baseScale||1)*.82);
    activeModel.rotation.y=transitionDirection>0?.22:-.22;
    world.add(activeModel);
    stage.dataset.accent=steps[i].accent;
    stage.classList.toggle('step-threat',i===3);
  }
  function setStep(i){
    currentStep=Math.max(0,Math.min(steps.length-1,i));
    const s=steps[currentStep];
    index.textContent=String(currentStep+1).padStart(2,'0');
    railCode.textContent=String(currentStep+1).padStart(2,'0')+' / 05';
    title.innerHTML=s.title;body.textContent=s.body;metaKicker.textContent=s.meta;metaTitle.textContent=s.name;statusText.textContent=s.status;
    layers.forEach((b,k)=>b.classList.toggle('is-on',k===currentStep));
    loadStep(currentStep);
  }

  function sceneProgress(){const r=story.getBoundingClientRect();const total=Math.max(1,story.offsetHeight-innerHeight);return Math.min(1,Math.max(0,-r.top/total))}
  function update(t){
    const p=sceneProgress();
    const raw=Math.min(steps.length-.0001,p*steps.length);
    const idx=Math.min(steps.length-1,Math.floor(raw));
    if(idx!==currentStep&&pendingIndex<0)setStep(idx);
    const local=raw-idx;
    const percent=Math.round(Math.min(100,((p*(steps.length-1))+1)/steps.length*100));
    progress.style.width=percent+'%';progressLabel.textContent=percent+'%';

    const cameraT=THREE.MathUtils.smoothstep(p,0,1);
    camera.position.x=.10*Math.sin(cameraT*Math.PI*1.1);
    camera.position.y=.035*Math.cos(cameraT*Math.PI*1.4);
    camera.position.z=9.5-.34*Math.sin(cameraT*Math.PI);
    camera.lookAt(1.05,0,0);

    const incoming=activeModel;
    if(transition<1)transition=Math.min(1,transition+(reduced?.12:.047));
    if(incoming){
      const e=THREE.MathUtils.smoothstep(transition,0,1);
      const base=incoming.userData.baseScale||1;
      incoming.scale.setScalar(base*(.82+.18*e));
      incoming.position.x=THREE.MathUtils.lerp(incoming.userData.introX||1.15,incoming.userData.homeX||1.15,e);
      incoming.position.y=THREE.MathUtils.lerp(incoming.userData.introY||-.10,incoming.userData.homeY||-.10,e)+(!reduced?Math.sin(t*.0006)*.022:0);
      incoming.rotation.y=(incoming.userData.baseRotY||0)+(.22*transitionDirection*(1-e))+(reduced?0:t*.00028);
    }
    if(outgoingModel){
      const e=THREE.MathUtils.smoothstep(transition,0,1);
      outgoingModel.position.x=THREE.MathUtils.lerp(outgoingModel.userData.homeX||1.15,(outgoingModel.userData.homeX||1.15)-transitionDirection*.72,e);
      outgoingModel.position.y=(outgoingModel.userData.homeY||-.10)-.10*e;
      outgoingModel.scale.setScalar((outgoingModel.userData.baseScale||1)*(1-.18*e));
      outgoingModel.rotation.y+=reduced?0:-.0008;
      if(transition>=1){world.remove(outgoingModel);disposeObject(outgoingModel);outgoingModel=null}
    }

    if(activeIndex===3){rim.color.setHex(0xff7080);glow.color.setHex(0xff7d87)}
    else {rim.color.setHex(0x70e7f7);glow.color.setHex(0x8cffb5)}

    if(activeIndex===4&&local>.25){stage.classList.add('protect-sealed')}else{stage.classList.remove('protect-sealed')}
  }

  function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
  addEventListener('resize',resize,{passive:true});resize();

  layers.forEach(b=>b.addEventListener('click',()=>{const i=+b.dataset.step;setStep(i);closePanel();}));
  replay?.addEventListener('click',()=>{closePanel();story.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});setStep(0)});

  const io=new IntersectionObserver(es=>{running=es.some(e=>e.isIntersecting)}, {threshold:.02});io.observe(root);
  function frame(){const now=performance.now();lastT=now;if(running){update(now);renderer.render(scene,camera)}requestAnimationFrame(frame)}
  setStep(0);frame();
})();
