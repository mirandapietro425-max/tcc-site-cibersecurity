(function(){
  'use strict';
  const $=(s,c=document)=>c.querySelector(s); const $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const boot=$('#boot'), bar=$('#boot-progress'), pct=$('#boot-percent'), status=$('#boot-status'), start=$('#boot-start');
  const ambient=$('#ambient'); const hud=$('#audio-hud'); const audioToggle=$('#audio-toggle');
  const sfx={detect:$('#sfx-detect'),transition:$('#sfx-transition'),alert:$('#sfx-alert'),success:$('#sfx-success'),click:$('#sfx-click'),whoosh:$('#sfx-whoosh')};
  const chapters=$$('.chapter'); const dots=$('#scene-dots'); const counter=$('#scene-number');
  const explorePanel=$('#explore-panel'), exploreTitle=$('#explore-title'), exploreBody=$('#explore-body'), exploreExtra=$('#explore-extra'), exploreKicker=$('#explore-kicker'), exploreTip=$('#explore-tip');
  let audioOn=false, started=false, lastScene=0;

  // Preloader robusto: nenhum asset de áudio pode bloquear a entrada.
  const preload=[ambient,...Object.values(sfx)].filter(Boolean);
  const loadedAssets=new Set();
  const totalAssets=preload.length || 1;
  let fallbackReleased=false;
  const paintProgress=(label='PREPARANDO CENA')=>{
    const n=Math.min(100,Math.round((loadedAssets.size/totalAssets)*100));
    bar.style.width=n+'%';
    pct.textContent=String(n).padStart(2,'0')+'%';
    status.textContent=label;
    if(n>=100 && !start.disabled){ status.textContent='AMBIENTE PRONTO'; }
  };
  const markLoaded=(asset,label)=>{
    if(loadedAssets.has(asset)) return;
    loadedAssets.add(asset);
    paintProgress(label);
    if(loadedAssets.size>=totalAssets) releaseBoot('AMBIENTE PRONTO');
  };
  const releaseBoot=(label='AMBIENTE PRONTO')=>{
    if(fallbackReleased) return;
    fallbackReleased=true;
    bar.style.width='100%';
    pct.textContent='100%';
    status.textContent=label;
    start.disabled=false;
  };
  preload.forEach((a)=>{
    const done=()=>markLoaded(a,'ASSET PRONTO');
    const failed=()=>markLoaded(a,'FALLBACK ATIVO');
    a.addEventListener('canplaythrough',done,{once:true});
    a.addEventListener('loadeddata',done,{once:true});
    a.addEventListener('error',failed,{once:true});
    try { a.load(); } catch(e) { failed(); }
  });
  // Nunca deixa a tela de carregamento presa por causa de autoplay/política do navegador,
  // cache, arquivo local ou codec específico.
  setTimeout(()=>releaseBoot('AMBIENTE PRONTO'),3500);

  function playSfx(name,vol=.32){const a=sfx[name]; if(!a)return; a.currentTime=0; a.volume=vol; a.play().catch(()=>{});}
  function setAudio(on){audioOn=on; if(on){ambient.volume=.18; ambient.play().catch(()=>{}); hud.classList.add('is-playing'); $('#audio-label').textContent='SOM ON';} else {ambient.pause();hud.classList.remove('is-playing');$('#audio-label').textContent='SOM OFF';}}
  start.addEventListener('click',()=>{ if(started)return; started=true; setAudio(true); hud.hidden=false; playSfx('transition',.22); if(window.gsap){gsap.to(boot,{opacity:0,duration:1,ease:'power2.inOut',onComplete:()=>boot.remove()});}else{boot.classList.add('is-done');setTimeout(()=>boot.remove(),1200);} });
  audioToggle.addEventListener('click',()=>{setAudio(!audioOn); if(audioOn)playSfx('click',.18)});

  // Safe smooth scroll: use Lenis when available; native fallback otherwise.
  let lenis=null;
  if(window.Lenis && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    lenis=new Lenis({duration:1.05,smoothWheel:true,wheelMultiplier:.82,touchMultiplier:1.1});
    function raf(t){lenis.raf(t);requestAnimationFrame(raf)} requestAnimationFrame(raf);
  }
  $$('.topbar a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=$(a.getAttribute('href'));if(t){e.preventDefault();lenis?lenis.scrollTo(t,{offset:-20,duration:1.4}):t.scrollIntoView({behavior:'smooth'});}}));

  chapters.forEach((c,i)=>{const b=document.createElement('button');b.setAttribute('aria-label','Ir para cena '+(i+1));b.addEventListener('click',()=>lenis?lenis.scrollTo(c,{duration:1.2}):c.scrollIntoView({behavior:'smooth'}));dots.appendChild(b);});

  const motionOK=!matchMedia('(prefers-reduced-motion: reduce)').matches;
  const three=window.THREE;
  const worlds=new Map();
  const TOPICS={
    'cid':{k:'FUNDAMENTO',t:'Tríade CID',b:'Confidencialidade, integridade e disponibilidade organizam a proteção da informação. Aqui, cada pilar vira uma camada visual da cena.',x:'Base conceitual do TCC: a segurança precisa proteger o acesso, a consistência e a disponibilidade dos dados.'},
    'privacy-by-design':{k:'PRIVACIDADE',t:'Privacy by Design',b:'A privacidade entra na arquitetura desde a concepção, e não apenas depois que o produto está pronto.',x:'No TCC, Privacy by Design e Privacy by Default aparecem como princípios para integrar proteção ao ciclo de vida do software.'},
    'social-engineering':{k:'FATOR HUMANO',t:'Engenharia social',b:'O ataque pode começar antes de existir qualquer malware: urgência, confiança e manipulação podem fazer o próprio usuário abrir a porta.',x:'A experiência pode ser explorada como um laboratório de decisão: identificar sinais antes de agir.'},
    'phishing':{k:'SIMULAÇÃO',t:'Phishing',b:'Uma mensagem fraudulenta tenta criar urgência e conduzir a vítima a um link ou solicitação de credenciais.',x:'Clique em INVESTIGAR SINAL na cena para comparar pistas de uma mensagem suspeita.'},
    'malware':{k:'AMEAÇA',t:'Malware',b:'Malware é o guarda-chuva para códigos maliciosos como vírus, worms e cavalos de Troia.',x:'Nesta cena, o ponto de ameaça pode representar diferentes caminhos de comprometimento.'},
    'ransomware':{k:'AMEAÇA',t:'Ransomware',b:'O ransomware bloqueia o acesso aos dados e usa a indisponibilidade como pressão para extorsão.',x:'O contraste visual desta cena representa o impacto sobre o pilar da disponibilidade.'},
    'api':{k:'ARQUITETURA',t:'API como fronteira',b:'Cada requisição entre sistemas precisa ser autenticada e autorizada. A API amplia a superfície de ataque quando não há controles adequados.',x:'O próximo salto visual da cena é entrar da aplicação na camada de dados.'},
    'source-maps':{k:'DESENVOLVIMENTO',t:'Source Maps',b:'Source Maps podem revelar a estrutura original de código minificado e, quando publicados indevidamente, transformar uma proteção de build em exposição.',x:'No fluxo seguro, artefatos de debug devem ser tratados como ativos sensíveis.'},
    'defense-depth':{k:'ARQUITETURA',t:'Defesa em Profundidade',b:'Uma barreira isolada não basta. A proteção funciona como um conjunto de camadas que continuam atuando quando uma delas falha.',x:'Cada camada pode ser explorada individualmente antes de continuar a narrativa.'},
    'least-privilege':{k:'CONTROLE',t:'Princípio do Menor Privilégio',b:'Usuários e sistemas devem ter apenas as permissões necessárias para sua função.',x:'No universo de defesa, reduzir privilégios reduz a superfície de impacto de um comprometimento.'},
    'lgpd':{k:'PRIVACIDADE',t:'LGPD',b:'A proteção de dados exige medidas de segurança e responsabilidade sobre o tratamento de informações pessoais.',x:'O fluxo desta cena traduz a jornada do dado em escolhas de proteção.'},
    'accountability':{k:'GOVERNANÇA',t:'Accountability',b:'Além de implementar controles, a organização precisa conseguir demonstrar que adotou medidas eficazes de proteção.',x:'Registros, testes e evidências fazem parte da governança do sistema.'},
    'sast':{k:'CÓDIGO',t:'SAST',b:'A análise estática ajuda a identificar possíveis vulnerabilidades diretamente no código durante o desenvolvimento.',x:'A ideia é encontrar falhas antes de elas chegarem ao ambiente de produção.'},
    'validation':{k:'CÓDIGO',t:'Validação no servidor',b:'Dados recebidos precisam ser validados do lado do servidor; não é suficiente confiar apenas no navegador.',x:'Isso ajuda a reduzir ataques de injeção e entradas maliciosas.'},
    'incident-response':{k:'RESPOSTA',t:'Resposta a incidentes',b:'Detectar, conter, investigar e solucionar um incidente é parte do sistema de defesa.',x:'O final da narrativa deve levar o usuário do alerta para uma ação prática.'},
    'recovery':{k:'CONTINUIDADE',t:'Recuperação',b:'Backups, recuperação de desastres e continuidade ajudam a restabelecer serviços após incidentes.',x:'A história não termina quando o ataque é detectado: ela termina quando o sistema consegue se recuperar.'}
  };
  const openTopic=(key,opts={})=>{const t=TOPICS[key]; if(!t)return; exploreKicker.textContent=t.k; exploreTitle.textContent=t.t; exploreBody.textContent=t.b; exploreExtra.textContent=t.x||''; explorePanel.classList.add('is-open'); explorePanel.setAttribute('aria-hidden','false'); document.body.classList.add('panel-open'); playSfx('click',.18); if(opts.focus){opts.focus.classList.add('is-focused'); setTimeout(()=>opts.focus.classList.remove('is-focused'),900);}};
  const closeTopic=()=>{explorePanel.classList.remove('is-open');explorePanel.setAttribute('aria-hidden','true');document.body.classList.remove('panel-open');};
  $('#explore-close').addEventListener('click',closeTopic); $$('[data-close-panel]').forEach(x=>x.addEventListener('click',closeTopic)); addEventListener('keydown',e=>{if(e.key==='Escape')closeTopic();});
  $$('.scene-hotspot').forEach(b=>b.addEventListener('click',()=>openTopic(b.dataset.topic,{focus:b})));
  const hotspotHint=()=>{if(lastScene===0){exploreTip.classList.remove('is-hidden');} else {exploreTip.classList.add('is-hidden');}};
  hotspotHint();
  
  function makeWorld(canvas,kind){
    if(!canvas||!three)return null;
    const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:!matchMedia('(max-width:700px)').matches,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(devicePixelRatio,matchMedia('(max-width:700px)').matches?1.35:1.8));
    renderer.setSize(canvas.clientWidth,canvas.clientHeight,false);
    const scene=new THREE.Scene(); scene.fog=new THREE.FogExp2(0x05070b,.018);
    const camera=new THREE.PerspectiveCamera(42,canvas.clientWidth/canvas.clientHeight,.1,140); camera.position.z=8;
    const group=new THREE.Group(); scene.add(group);
    const core=new THREE.Mesh(new THREE.IcosahedronGeometry(kind==='defense'?0.42:0.34,2),new THREE.MeshBasicMaterial({color:0x6ee7f7,transparent:true,opacity:.12,wireframe:true})); core.userData.hotspot=true; core.userData.kind=kind; group.add(core);
    const ambientLight=new THREE.AmbientLight(0x6f859d,.35); scene.add(ambientLight);
    const points=kind==='attack'?900:kind==='threat'?700:kind==='defense'?800:650;
    const geo=new THREE.BufferGeometry(); const pos=new Float32Array(points*3); const colors=new Float32Array(points*3);
    for(let i=0;i<points;i++){const r=kind==='defense'?THREE.MathUtils.randFloat(2,6):THREE.MathUtils.randFloat(2.5,8); const a=Math.random()*Math.PI*2; const y=THREE.MathUtils.randFloatSpread(6); pos[i*3]=Math.cos(a)*r+THREE.MathUtils.randFloatSpread(1); pos[i*3+1]=y; pos[i*3+2]=Math.sin(a)*r; const c=new THREE.Color().setHSL(.52+Math.random()*.28,.75,.55); colors[i*3]=c.r;colors[i*3+1]=c.g;colors[i*3+2]=c.b;}
    geo.setAttribute('position',new THREE.BufferAttribute(pos,3)); geo.setAttribute('color',new THREE.BufferAttribute(colors,3));
    const mat=new THREE.PointsMaterial({size:kind==='intro'?.018:.026,transparent:true,opacity:.58,vertexColors:true,blending:THREE.AdditiveBlending,depthWrite:false});
    group.add(new THREE.Points(geo,mat));
    const rings=[]; const ringCount=kind==='defense'?7:kind==='attack'?5:3;
    for(let i=0;i<ringCount;i++){const rg=new THREE.TorusGeometry(1.15+i*.5,.006+i*.001,8,120);const rm=new THREE.MeshBasicMaterial({color:[0x8cffb5,0x6ee7f7,0xb69cff][i%3],transparent:true,opacity:.16,blending:THREE.AdditiveBlending});const m=new THREE.Mesh(rg,rm);m.rotation.x=.8+i*.12;m.rotation.y=i*.25;group.add(m);rings.push(m)}
    if(kind==='attack'){const nodes=[];for(let i=0;i<5;i++){const sph=new THREE.Mesh(new THREE.SphereGeometry(.08,12,12),new THREE.MeshBasicMaterial({color:0x6ee7f7}));sph.position.x=(i-2)*1.3;sph.position.y=Math.sin(i)*.5;nodes.push(sph);group.add(sph);}worlds.set(canvas.id,{renderer,scene,camera,group,rings,nodes,kind,core});return worlds.get(canvas.id)}
    worlds.set(canvas.id,{renderer,scene,camera,group,rings,kind,core}); return worlds.get(canvas.id);
  }
  const worldKinds={ 'scene-intro':'intro','scene-user':'user','scene-threat':'threat','scene-attack':'attack','scene-defense':'defense','scene-privacy':'privacy','scene-dev':'dev','scene-final':'final'};
  Object.entries(worldKinds).forEach(([id,kind])=>makeWorld($('#'+id),kind));
  const MODEL_BASE='assets/models/';
  const modelLoader = (three && THREE.GLTFLoader) ? new THREE.GLTFLoader() : null;
  const modelMap = new Map();
  const fitModel = (obj, target=2.5) => {
    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3());
    const max = Math.max(size.x,size.y,size.z) || 1;
    const scale = target / max;
    obj.scale.setScalar(scale); obj.__baseScale=scale;
    const box2 = new THREE.Box3().setFromObject(obj);
    const center = box2.getCenter(new THREE.Vector3());
    obj.position.sub(center);
  };
  function loadChapterModel(chapter){
    if(!modelLoader || !chapter) return;
    const canvas=chapter.querySelector('canvas');
    const w=worlds.get(canvas?.id);
    const file=chapter.dataset.model;
    if(!w || !file) return;
    modelLoader.load(MODEL_BASE+file, gltf=>{
      const model=gltf.scene;
      fitModel(model, chapter.classList.contains('chapter-intro')?3.25:2.8);
      model.position.set(0,0,-.25);
      model.rotation.y=Math.PI*.15;
      model.traverse(o=>{
        o.userData.topic=chapter.dataset.topic;
        o.userData.isStoryModel=true;
        if(o.isMesh){o.castShadow=false;o.receiveShadow=false; if(o.material){o.material.transparent=true;}}
      });
      w.group.add(model);
      w.model=model;
      w.modelTargetOpacity=1;
      modelMap.set(canvas.id,model);
      const badge=chapter.querySelector('.model-label'); if(badge) badge.classList.add('is-ready');
    }, undefined, ()=>{
      const badge=chapter.querySelector('.model-label'); if(badge) badge.textContent='VISUAL PROCEDURAL';
    });
  }
  chapters.forEach(loadChapterModel);

  const raycaster=new THREE.Raycaster(); const mouseNdc=new THREE.Vector2();
  worlds.forEach(w=>{
    w.renderer.domElement.style.cursor='crosshair';
    w.renderer.domElement.addEventListener('click',e=>{
      const rect=w.renderer.domElement.getBoundingClientRect();
      mouseNdc.x=((e.clientX-rect.left)/rect.width)*2-1;
      mouseNdc.y=-((e.clientY-rect.top)/rect.height)*2+1;
      raycaster.setFromCamera(mouseNdc,w.camera);
      const targets=[w.core]; if(w.model) targets.push(w.model);
      const hit=raycaster.intersectObjects(targets,true)[0];
      if(hit){
        const key=hit.object.userData.topic || (w.kind==='intro'?'cid':w.kind==='defense'?'defense-depth':w.kind==='attack'?'api':w.kind==='privacy'?'lgpd':w.kind==='dev'?'sast':w.kind==='threat'?'malware':w.kind==='user'?'social-engineering':'incident-response');
        openTopic(key); playSfx('detect',.08);
      }
    });
  });

  let pointer={x:0,y:0}; addEventListener('pointermove',e=>{pointer.x=(e.clientX/innerWidth-.5);pointer.y=(e.clientY/innerHeight-.5); if(innerWidth>900){document.body.classList.add('has-cursor');const c=$('#cursor');c.style.left=e.clientX+'px';c.style.top=e.clientY+'px';}});
  addEventListener('pointerleave',()=>document.body.classList.remove('has-cursor'));

  function render(){const now=performance.now()*.001; worlds.forEach(w=>{const r=w.renderer; const c=r.domElement; if(c.clientWidth!==c.width||c.clientHeight!==c.height){r.setSize(c.clientWidth,c.clientHeight,false);w.camera.aspect=c.clientWidth/c.clientHeight;w.camera.updateProjectionMatrix();} w.group.rotation.y=now*.025 + pointer.x*.08; w.group.rotation.x=pointer.y*.05; if(w.core){const pulse=1+Math.sin(now*1.8)*.08;w.core.scale.setScalar(pulse);w.core.rotation.x=now*.18;w.core.rotation.y=now*.24;} w.rings.forEach((m,i)=>{m.rotation.z=now*(.04+i*.012)*(i%2?1:-1);m.rotation.x=.7+Math.sin(now*.35+i)*.08}); if(w.model){ const sc=1+Math.sin(now*1.1+(w.kind.length))*0.035; w.model.rotation.y += 0.0018; w.model.rotation.x = Math.sin(now*.38)*.035; w.model.scale.setScalar((w.model.__baseScale||1)*sc); } if(w.nodes){w.nodes.forEach((n,i)=>{n.position.y=Math.sin(now*.7+i)*.55;});} r.render(w.scene,w.camera);});requestAnimationFrame(render)} render();

  // Scroll-driven camera / UI choreography. GSAP is used when available.
  let lastScroll=scrollY;
  function updateScroll(){
    const prevScroll=lastScroll;
    const center=innerHeight*.48; let active=0; chapters.forEach((c,i)=>{const r=c.getBoundingClientRect();const focus=Math.min(1,Math.max(0,1-Math.abs(r.top+innerHeight/2-center)/innerHeight)); if(focus>.5)active=i; const canvas=c.querySelector('canvas'); if(canvas)canvas.style.transform='scale('+(1+focus*.035)+')';});
    if(active!==lastScene){const direction=active>lastScene?1:-1;chapters.forEach((c,i)=>c.classList.toggle('is-active',i===active));lastScene=active;counter.textContent=String(active+1).padStart(2,'0');dots.querySelectorAll('button').forEach((b,i)=>b.classList.toggle('is-active',i===active)); hotspotHint(); if(started)playSfx(direction>0?'whoosh':'transition',.12); if(window.gsap){gsap.fromTo(chapters[active].querySelectorAll('.eyebrow,h2,.story-copy>p,.data-flow,.code-window,.defense-stack,.attack-path,.threat-orbit,.final-actions'),{opacity:0,y:direction>0?28:-18},{opacity:1,y:0,duration:.8,stagger:.05,ease:'power3.out',overwrite:true});}}
    const delta=scrollY-prevScroll;
    chapters.forEach((c,i)=>{
      const r=c.getBoundingClientRect();
      const local=Math.min(1,Math.max(0,(innerHeight-r.top)/(innerHeight+c.offsetHeight)));
      const w=worlds.get(c.querySelector('canvas')?.id);
      if(w){
        const centered=Math.max(0,1-Math.min(1,Math.abs(r.top)/innerHeight));
        const depth=1+centered*.55;
        w.camera.position.z = (w.kind==='intro'?7.8:8.6) - centered*1.35;
        w.camera.position.x = pointer.x*(0.8+centered*1.2);
        w.camera.position.y = pointer.y*(-0.45-centered*.45);
        w.group.position.y = (local-.5)*.55;
        w.group.rotation.z = pointer.x*.02 + (local-.5)*.045;
        if(w.model){
          const rise=(.5-Math.abs(local-.5))*1.15;
          w.model.position.y = rise*.22;
          w.model.position.z = -0.25 + centered*.42;
        }
      }
      c.style.setProperty('--chapter-progress',local.toFixed(4));
    });

    lastScroll=scrollY;
    if(active===2 && Math.abs(delta)>8)playSfx('detect',.06);
    const defense=$('#defense-stack'); if(defense){const r=defense.getBoundingClientRect();const p=Math.min(1,Math.max(0,1-Math.abs(r.top-innerHeight*.55)/innerHeight)); defense.querySelectorAll('div').forEach((el,i)=>{el.style.transform=`translateY(${(1-p)*(4-i)*8}px) scale(${.96+p*.04})`;el.style.opacity=.55+p*.45;});}
  }
  let scrollTick=false; addEventListener('scroll',()=>{if(!scrollTick){requestAnimationFrame(()=>{updateScroll();scrollTick=false});scrollTick=true;}},{passive:true}); updateScroll();
  $$('[data-jump]').forEach(btn=>btn.addEventListener('click',()=>{const t=$('#'+btn.dataset.jump); if(t){lenis?lenis.scrollTo(t,{duration:1.25}):t.scrollIntoView({behavior:'smooth'}); playSfx('whoosh',.11);}}));
  const progressFill=$('#topbar-progress-fill'); const modelBadgeText=$('#model-badge-text');
  const sceneNames=['CIBERSEGURANÇA','O USUÁRIO','A AMEAÇA','CADEIA DE ATAQUE','DEFESA EM PROFUNDIDADE','LGPD & PRIVACIDADE','DESENVOLVIMENTO SEGURO','RESPOSTA'];
  const originalUpdateScroll=updateScroll;
  updateScroll=function(){
    originalUpdateScroll();
    const max=Math.max(1,document.documentElement.scrollHeight-innerHeight); const p=Math.min(1,Math.max(0,scrollY/max)); if(progressFill) progressFill.style.width=(p*100)+'%';
    if(modelBadgeText) modelBadgeText.textContent=(sceneNames[lastScene]||'AMBIENTE 3D')+' · 3D';
    chapters.forEach((c,i)=>c.classList.toggle('scene-past',i<lastScene));
  };
  updateScroll();

  // First interactive scene.
  $$('[data-reveal]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.reveal;if(id==='phishing'){const card=$('#phishing-card');card.hidden=!card.hidden;playSfx(card.hidden?'click':'detect',.22);}}));
  $$('[data-threat]').forEach(b=>b.addEventListener('click',()=>{ $$('.threat-chip').forEach(x=>x.classList.remove('is-hot')); b.classList.add('is-hot'); const map={phishing:'Engenharia social por link ou mensagem.',malware:'Código criado para comprometer sistemas.',ransomware:'Bloqueio de dados para extorsão.',spyware:'Coleta de dados sem consentimento.',trojan:'Software disfarçado de algo legítimo.',worm:'Propagação automática pela rede.'}; $('#threat-caption').textContent=map[b.dataset.threat]||'Ameaça'; playSfx('alert',.12); }));
})();
