import * as THREE from 'https://esm.sh/three@0.170.0';
import { GLTFLoader } from 'https://esm.sh/three@0.170.0/examples/jsm/loaders/GLTFLoader.js';

(() => {
  'use strict';

  // V21: semantic, tangible asset set — human, laptop, attack robot, server, digital vault.

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const boot = $('#boot');
  const start = $('#boot-start');
  const ambient = $('#ambient');
  const hud = $('#audio-hud');
  const audioToggle = $('#audio-toggle');
  const sfx = Object.fromEntries(['detect','transition','alert','success','click','whoosh'].map(k => [k, $('#' + 'sfx-' + k)]));
  const chapters = $$('.chapter');
  const dots = $('#scene-dots');
  const counter = $('#scene-number');
  const progressFill = $('#topbar-progress-fill');

  let started = false;
  let audioOn = false;
  let activeScene = 0;
  let lastScene = -1;
  let rafId = 0;

  /* ---------- audio ---------- */
  const playSfx = (name, volume = .28) => {
    const a = sfx[name];
    if (!a) return;
    try {
      a.currentTime = 0;
      a.volume = volume;
      const p = a.play();
      if (p?.catch) p.catch(() => {});
    } catch {}
  };

  const setAudio = on => {
    audioOn = !!on;
    if (audioOn) {
      if (ambient) {
        ambient.volume = .14;
        const p = ambient.play();
        if (p?.catch) p.catch(() => {});
      }
      hud?.classList.add('is-playing');
      const label = $('#audio-label');
      if (label) label.textContent = 'SOM ON';
    } else {
      ambient?.pause();
      hud?.classList.remove('is-playing');
      const label = $('#audio-label');
      if (label) label.textContent = 'SOM OFF';
    }
  };

  audioToggle?.addEventListener('click', () => {
    setAudio(!audioOn);
    playSfx('click', .18);
  });

  /* ---------- scene / text animation ---------- */
  const animateScene = (chapter) => {
    if (!chapter) return;
    // Scene transitions are now driven by the existing scroll/WebGL system.
    // Do not animate the whole content block here; that caused headings to reveal early.
    chapter.classList.add('is-active');
  };

  const openTopic = key => {
    const panel = $('#explore-panel');
    const kicker = $('#explore-kicker');
    const title = $('#explore-title');
    const body = $('#explore-body');
    const extra = $('#explore-extra');
    const topics = {
      cid: ['FUNDAMENTO','Tríade CID','Confidencialidade, integridade e disponibilidade organizam a proteção da informação.','Base conceitual do TCC.'],
      phishing: ['SIMULAÇÃO','Phishing','Uma mensagem fraudulenta cria urgência e tenta capturar credenciais.','Analise o remetente, domínio, link e pedido.'],
      malware: ['AMEAÇA','Malware','Código malicioso projetado para comprometer sistemas.','Vírus, worms e trojans são categorias abordadas no TCC.'],
      api: ['ARQUITETURA','API como fronteira','Cada requisição entre sistemas precisa de autenticação e autorização.','A API amplia a superfície de ataque quando os controles falham.'],
      'defense-depth': ['ARQUITETURA','Defesa em Profundidade','Uma barreira isolada não basta. A proteção funciona como camadas.','Explore as camadas de defesa.'],
      lgpd: ['PRIVACIDADE','LGPD','A proteção de dados exige segurança e responsabilidade no tratamento.','Privacy by Design e Privacy by Default entram desde a concepção.'],
      sast: ['CÓDIGO','SAST','A análise estática ajuda a encontrar vulnerabilidades no desenvolvimento.','Detectar cedo reduz a superfície de ataque.'],
      recovery: ['CONTINUIDADE','Recuperação','Backups, recuperação de desastres e continuidade restabelecem serviços.','Uma defesa madura também precisa recuperar.']
    };
    const t = topics[key] || topics.cid;
    if (kicker) kicker.textContent = t[0];
    if (title) title.textContent = t[1];
    if (body) body.textContent = t[2];
    if (extra) extra.textContent = t[3];
    panel?.classList.add('is-open');
    panel?.setAttribute('aria-hidden', 'false');
    document.body.classList.add('panel-open');
    playSfx('click', .2);
  };

  const closeTopic = () => {
    $('#explore-panel')?.classList.remove('is-open');
    $('#explore-panel')?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('panel-open');
  };

  $('#explore-close')?.addEventListener('click', closeTopic);
  addEventListener('keydown', e => { if (e.key === 'Escape') closeTopic(); });

  $$('.scene-hotspot').forEach(btn => btn.addEventListener('click', () => {
    openTopic(btn.dataset.topic);
  }));

  $$('.threat-chip').forEach(btn => btn.addEventListener('click', () => {
    $$('.threat-chip').forEach(x => x.classList.remove('is-hot'));
    btn.classList.add('is-hot');
    const map = {
      phishing:'Engenharia social por link ou mensagem.',
      malware:'Código criado para comprometer sistemas.',
      ransomware:'Bloqueio de dados para extorsão.',
      spyware:'Coleta de dados sem consentimento.',
      trojan:'Software disfarçado de algo legítimo.',
      worm:'Propagação automática pela rede.'
    };
    const cap = $('#threat-caption');
    if (cap) cap.textContent = map[btn.dataset.threat] || 'Ameaça';
    playSfx('alert', .12);
    btn.animate(
      [{ transform:'translate3d(0,0,0) scale(1)' }, { transform:'translate3d(0,-4px,0) scale(1.04)' }, { transform:'translate3d(0,0,0) scale(1)' }],
      { duration: 440, easing:'cubic-bezier(.2,.8,.2,1)' }
    );
  }));

  $$('.scene-action[data-reveal]').forEach(btn => btn.addEventListener('click', () => {
    const card = $('#phishing-card');
    if (!card) return;
    card.hidden = !card.hidden;
    btn.animate(
      [{ transform:'translate3d(0,0,0)' }, { transform:'translate3d(0,-3px,0)' }, { transform:'translate3d(0,0,0)' }],
      { duration: 320, easing:'ease-out' }
    );
    playSfx(card.hidden ? 'click' : 'detect', .22);
  }));

  /* ---------- 3D worlds ---------- */
  const worlds = new Map();
  const worldKinds = {
    'scene-intro':'intro',
    'scene-user':'user',
    'scene-threat':'threat',
    'scene-attack':'attack',
    'scene-defense':'defense',
    'scene-privacy':'privacy',
    'scene-dev':'dev',
    'scene-final':'final'
  };

  const MODEL_BASE = 'assets/models/';
  // Primeira página: somente estes CINCO personagens novos.
  // Eles substituem os objetos/personagens grandes antigos nos cinco primeiros pontos visuais.
  const introSatellites = [
    {file:'cybershield_robot_woman.glb', target:1.42, pos:[0.00, 1.05,.30], rotY:.10, speed:.08},
    {file:'cybershield_robot_normal.glb', target:1.42, pos:[0.00,-1.15,.30], rotY:-.10, speed:.08}
  ];

  const modelByKind = {
    intro:null,
    user:null,
    threat:'cybershield_robot_woman.glb',
    attack:'cybershield_robot_normal.glb',
    defense:'cybershield_robot_boy.glb',
    privacy:null,
    dev:null,
    final:null
  };

  const configs = {
    intro:   { target:2.45, pos:[-1.85,-.05,.15], rot:[0,.10,0], character:true },
    user:    { target:2.25, pos:[2.20,-.20,.25], rot:[0,-.12,0], character:true },
    threat:  { target:2.35, pos:[0.00,-.05,.20], rot:[0,.08,0], character:true },
    attack:  { target:2.30, pos:[2.05,-.30,.10], rot:[0,-.14,0], character:true },
    defense: { target:2.20, pos:[-1.95,-.28,.20], rot:[0,.12,0], character:true },
    privacy: { target:3.5, pos:[.1,-.25,-.1], rot:[0,-.32,0], character:false },
    dev:     { target:4.55, pos:[.15,-.45,-.1], rot:[0,.2,0], character:false },
    final:   { target:4.0, pos:[0,-.18,0], rot:[0,.1,0], character:false }
  };

  let THREEReady = true;

  function makeWorld(canvas, kind) {
    if (!canvas) return null;
    const mobile = matchMedia('(max-width: 700px)').matches;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha:true,
      antialias: !mobile,
      powerPreference:'high-performance'
    });
    renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.15 : 1.65));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070b, .018);

    const camera = new THREE.PerspectiveCamera(33, 1, .1, 150);
    camera.position.set(0,0.15,9);

    const group = new THREE.Group();
    scene.add(group);

    scene.add(new THREE.HemisphereLight(0x9fe9ff, 0x060812, 1.15));

    const key = new THREE.DirectionalLight(0xcfffe9, 3.0);
    key.position.set(3,4,5);
    scene.add(key);

    const rim = new THREE.PointLight(0x54e7ff, 30, 28, 2);
    rim.position.set(-3,1.5,4);
    scene.add(rim);

    const fill = new THREE.PointLight(0xa778ff, 20, 28, 2);
    fill.position.set(3,-1.5,0);
    scene.add(fill);

    const count = mobile ? 260 : 520;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i=0;i<count;i++) {
      const radius = THREE.MathUtils.randFloat(2.4,7.5);
      const angle = Math.random() * Math.PI * 2;
      positions[i*3] = Math.cos(angle) * radius;
      positions[i*3+1] = THREE.MathUtils.randFloatSpread(5);
      positions[i*3+2] = Math.sin(angle) * radius;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions,3));
    group.add(new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        color:0x6ee7f7,
        size:mobile ? .025 : .032,
        transparent:true,
        opacity:.42,
        blending:THREE.AdditiveBlending,
        depthWrite:false
      })
    ));

    const rings = [];
    for (let i=0;i<3;i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.5+i*.55, .008, 10, 128),
        new THREE.MeshBasicMaterial({
          color:[0x6ee7f7,0x9c8cff,0x8cffb5][i],
          transparent:true,
          opacity:.15,
          blending:THREE.AdditiveBlending
        })
      );
      ring.rotation.x=.9 + i*.12;
      ring.rotation.y=i*.25;
      group.add(ring);
      rings.push(ring);
    }

    const world = {
      canvas,
      renderer,
      scene,
      camera,
      group,
      kind,
      rings,
      model:null,
      models:[],
      mixer:null,
      clock:new THREE.Clock(),
      ready:false,
      mouse:{x:0,y:0}
    };
    worlds.set(canvas.id, world);

    canvas.addEventListener('pointermove', e => {
      const r = canvas.getBoundingClientRect();
      world.mouse.x = ((e.clientX-r.left)/r.width-.5);
      world.mouse.y = ((e.clientY-r.top)/r.height-.5);
    });

    canvas.addEventListener('click', e => {
      if (!world.model) return;
      const rect=canvas.getBoundingClientRect();
      const ndc=new THREE.Vector2(
        ((e.clientX-rect.left)/rect.width)*2-1,
        -((e.clientY-rect.top)/rect.height)*2+1
      );
      const raycaster=new THREE.Raycaster();
      raycaster.setFromCamera(ndc,camera);
      const hit=raycaster.intersectObject(world.model,true)[0];
      if(hit){
        openTopic(world.model.userData.topic || 'cid');
        playSfx('detect',.13);
      }
    });

    return world;
  }

  const loader = new GLTFLoader();
  const mixers = [];

  function fitModel(obj, target) {
    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3());
    const max = Math.max(size.x,size.y,size.z) || 1;
    const scale = target/max;
    obj.scale.setScalar(scale);

    const box2 = new THREE.Box3().setFromObject(obj);
    const center = box2.getCenter(new THREE.Vector3());
    obj.position.sub(center);
    obj.userData.baseScale = scale;
  }

  function markModelReady(chapter, text='3D ONLINE') {
    const state=chapter.querySelector('.model-state');
    if (state) state.textContent=text;
    const title=chapter.querySelector('.model-title');
    if (title) title.textContent='PERSONAGENS 3D';
  }

  function loadSingleModel(chapter, world, file) {
    loader.load(
      MODEL_BASE + file,
      gltf => {
        const model=gltf.scene;
        const cfg=configs[world.kind] || configs.intro;

        fitModel(model,cfg.target);
        model.position.set(...cfg.pos);
        model.rotation.set(...cfg.rot);
        if (cfg.character) {
          // Os cinco novos personagens usam Z como eixo vertical; a cena usa Y.
          // Mantemos os corpos em pé e o rosto para a frente.
          model.rotation.x = -Math.PI / 2;
          model.userData.character=true;
          model.userData.baseRotationY = cfg.rot[1] || 0;
          model.userData.baseY = model.position.y;
        }
        model.userData.topic=chapter.dataset.topic || 'cid';

        model.traverse(obj => {
          obj.userData.topic=model.userData.topic;
          if (obj.isMesh) {
            obj.castShadow=false;
            obj.receiveShadow=false;
            if (obj.material) {
              obj.material.transparent = obj.material.transparent ?? false;
              obj.material.envMapIntensity=.9;
            }
          }
        });

        world.group.add(model);
        world.model=model;
        world.models.push(model);
        world.ready=true;

        if (gltf.animations?.length) {
          world.mixer=new THREE.AnimationMixer(model);
          gltf.animations.forEach(clip => {
            const action=world.mixer.clipAction(clip);
            action.play();
          });
          mixers.push(world.mixer);
        }

        const state=chapter.querySelector('.model-state');
        const title=chapter.querySelector('.model-title');
        if (state) state.textContent='3D ONLINE';
        if (title) title.textContent=chapter.dataset.object || file.replace('.glb','').replace(/_/g,' ').toUpperCase();
        playSfx('success', .05);
      },
      xhr => {
        const state=chapter.querySelector('.model-state');
        if (!state) return;
        const p=xhr.total ? xhr.loaded/xhr.total : 0;
        if (p > 0) state.textContent='3D '+Math.round(p*100)+'%';
      },
      () => {
        const state=chapter.querySelector('.model-state');
        if (state) state.textContent='3D OFFLINE';
      }
    );
  }

  function loadIntroSatellites(chapter, world) {
    let loaded=0;
    introSatellites.forEach((cfg, index) => {
      loader.load(
        MODEL_BASE + cfg.file,
        gltf => {
          const model=gltf.scene;

          // Escala pequena e distância maior: mantém os personagens como ambientação.
          fitModel(model,cfg.target);
          model.position.set(...cfg.pos);

          // Os GLBs novos usam Z como eixo vertical; a cena Three.js usa Y.
          // Rotacionamos 90° no X para colocá-los realmente em pé, mantendo a rotação Y para a volta.
          model.rotation.set(-Math.PI / 2, cfg.rotY, 0);
          model.userData.introSpin = cfg.speed;
          model.userData.baseRotationY = cfg.rotY || 0;
          model.userData.baseY = model.position.y;
          model.userData.topic=chapter.dataset.topic || 'cid';
          model.userData.satelliteIndex=index;

          model.traverse(obj => {
            if (obj.isMesh) {
              obj.castShadow=false;
              obj.receiveShadow=false;
              if (obj.material) {
                obj.material.transparent = obj.material.transparent ?? false;
                obj.material.envMapIntensity=.78;
              }
            }
          });

          world.group.add(model);
          world.models.push(model);
          loaded++;

          if (loaded === introSatellites.length) {
            world.ready=true;
            markModelReady(chapter);
          }
        },
        null,
        () => {}
      );
    });
  }

  function ensureWorld(chapter){
    if(!chapter) return null;
    const canvas=chapter.querySelector('canvas');
    if(!canvas) return null;
    const existing=worlds.get(canvas.id);
    if(existing){ existing._loadRequested=true; return existing; }
    const kind=worldKinds[canvas.id];
    if(!kind) return null;
    const world=makeWorld(canvas,kind);
    world._loadRequested=true;
    const file=modelByKind[kind] || null;
    chapter.dataset.model = file || (kind==='intro' ? 'intro-orbit' : '');
    if(kind==='intro') loadIntroSatellites(chapter,world);
    else if(file) loadSingleModel(chapter,world,file);
    else {
      chapter.classList.add('no-character');
      const state=chapter.querySelector('.model-state'); const title=chapter.querySelector('.model-title');
      if(state) state.textContent='AMBIENTE'; if(title) title.textContent='SEM PERSONAGEM';
      world.ready=true;
    }
    return world;
  }

  const introChapter=document.querySelector('.chapter-intro');
  if(introChapter) ensureWorld(introChapter);
  const worldLoadIO='IntersectionObserver' in window ? new IntersectionObserver(entries=>{
    entries.forEach(entry=>{ if(entry.isIntersecting){ ensureWorld(entry.target); worldLoadIO.unobserve(entry.target); } });
  },{root:null,rootMargin:'45% 0px 45% 0px',threshold:0.01}) : null;
  const worldVisibilityIO='IntersectionObserver' in window ? new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      const canvas=entry.target.querySelector('canvas'); const world=canvas && worlds.get(canvas.id);
      if(world) world._visible=entry.isIntersecting;
    });
  },{root:null,rootMargin:'0px',threshold:0.02}) : null;
  chapters.forEach((chapter,i)=>{
    if(chapter===introChapter){ chapter.querySelector('canvas') && (worlds.get('scene-intro')._visible=true); }
    else {
      if(worldLoadIO) worldLoadIO.observe(chapter); else ensureWorld(chapter);
    }
    if(worldVisibilityIO) worldVisibilityIO.observe(chapter);
  });

  let lastFrame=0;
  function render(now){
    rafId=requestAnimationFrame(render);
    if(document.hidden) return;
    if(now && now-lastFrame < 20) return;
    if(now) lastFrame=now;
    const t=performance.now()*.001;

    worlds.forEach(world => {
      const { renderer, canvas, camera, group, rings, kind, model } = world;

      if (kind !== 'intro' && !world._visible) return;
      const width=canvas.clientWidth;
      const height=canvas.clientHeight;
      if (!width || !height) return;
      if (world._width !== width || world._height !== height) {
        renderer.setSize(width,height,false);
        camera.aspect=width/height;
        camera.updateProjectionMatrix();
        world._width=width; world._height=height;
      }

      const local = world.mouse;
      const cfg=configs[kind] || configs.intro;
      if (cfg.character && model) {
        // V54: os personagens ficam vivos mesmo em desktop: rotação + respiração vertical.
        group.rotation.set(0,0,0);
        model.rotation.x = -Math.PI / 2;
        const satellite = model.userData.satelliteIndex ?? -1;
        const baseY = model.userData.baseY ?? model.position.y;
        if (satellite >= 0) {
          model.rotation.y = (model.userData.baseRotationY || 0) + t * (0.22 + (model.userData.introSpin || 0.08));
          model.position.y = baseY + Math.sin(t * 0.9 + satellite * 0.8) * 0.07;
        } else {
          model.rotation.y = (model.userData.baseRotationY || 0) + t * 0.34;
          model.position.y = baseY + Math.sin(t * 0.75) * 0.045;
        }
        model.rotation.z = Math.sin(t * 0.55 + Math.max(0,satellite) * .4) * 0.018;
      } else {
        group.rotation.y += .001;
        group.rotation.y += local.x*.00055;
        group.rotation.x += ((local.y*-0.08)-group.rotation.x)*.025;

        rings.forEach((ring,i)=>{
          ring.rotation.z += (i%2 ? .0016 : -.0012);
          ring.rotation.y += .0007;
        });

        if (model) {
          const pulse=1+Math.sin(t*1.2+kind.length)*.022;
          model.scale.setScalar((model.userData.baseScale||1)*pulse);
          model.rotation.y += .0015;
        }
      }

      if (world.mixer) world.mixer.update(world.clock.getDelta());
      renderer.render(world.scene,camera);
    });

  }
  render();

  /* ---------- scroll-controlled camera + text ---------- */
  const sceneNames=['CIBERSEGURANÇA','O USUÁRIO','A AMEAÇA','CADEIA DE ATAQUE','DEFESA EM PROFUNDIDADE','LGPD & PRIVACIDADE','DESENVOLVIMENTO SEGURO','RESPOSTA'];

  function updateScroll() {
    const center=innerHeight*.42;
    let nearest=0;
    let best=Infinity;

    chapters.forEach((chapter,index)=>{
      const r=chapter.getBoundingClientRect();
      const centerDist=Math.abs((r.top+r.height*.45)-center);
      if(centerDist<best){best=centerDist;nearest=index;}

      const world=worlds.get(chapter.querySelector('canvas')?.id);
      if(world){
        const local=Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight+Math.max(r.height,1))));
        const centered=Math.max(0,1-Math.min(1,Math.abs((r.top+ r.height*.5)-center)/innerHeight));

        const cfg=configs[world.kind] || configs.intro;

        if (cfg.character) {
          // Personagens novos: câmera e grupo estáveis; a rotação acontece apenas no próprio modelo.
          world.camera.position.set(0,0.15,9);
          world.group.position.set(0,0,0);
          world.group.rotation.z=0;
        } else {
          world.camera.position.z=(cfg.target>4.4?10:9) - centered*1.75;
          world.camera.position.x=world.mouse.x*(1.5+centered*1.2);
          world.camera.position.y=world.mouse.y*(-.55-centered*.35);

          world.group.position.y=(local-.5)*.65;
          world.group.rotation.z=(local-.5)*.06;
        }

        if(world.model){
          if (cfg.character) {
            // Personagens: tamanho e postura constantes; sem deslocamento por scroll/mouse.
            world.model.scale.setScalar(world.model.userData.baseScale||1);
            world.model.position.set(...cfg.pos);
            world.model.rotation.x = -Math.PI / 2;
            world.model.rotation.z = 0;
          } else if (world.kind !== 'intro') {
            const travel=Math.sin(local*Math.PI);
            const heroScale=1+centered*.18;
            world.model.scale.setScalar((world.model.userData.baseScale||1)*heroScale);
            world.model.position.z=cfg.pos[2]+centered*.65;
            world.model.position.y=cfg.pos[1]+travel*.18;
            world.model.rotation.x=cfg.rot[0] + world.mouse.y*.12;
            world.model.rotation.y=cfg.rot[1] + local*.7 + world.mouse.x*.25;
          }
        }

        chapter.style.setProperty('--chapter-progress',local.toFixed(4));

        // scroll-linked content motion: enter -> settle -> exit
        const content = chapter.querySelector('.chapter-content, .intro-copy');
        if(content){
          const reveal = Math.max(0, Math.min(1, (local - 0.16) / 0.34));
          const exit = Math.max(0, Math.min(1, (local - 0.74) / 0.22));
          const opacity = Math.max(0.18, reveal * (1 - exit * 0.55));
          const y = (1 - reveal) * 44 - exit * 34;
          const scale = 0.97 + reveal * 0.03 - exit * 0.015;
          content.style.opacity = opacity.toFixed(3);
          content.style.transform = `translate3d(0,${y.toFixed(1)}px,0) scale(${scale.toFixed(3)})`;
        }
      }
    });

    if(nearest!==lastScene){
      const dir=nearest>lastScene?1:-1;
      activeScene=nearest;
      if(counter) counter.textContent=String(nearest+1).padStart(2,'0');

      dots?.querySelectorAll('button').forEach((b,i)=>b.classList.toggle('is-active',i===nearest));

      if(started) playSfx(dir>0?'whoosh':'transition',.11);
      animateScene(chapters[nearest],dir);
      lastScene=nearest;
    }

    const total=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    if(progressFill) progressFill.style.width=Math.max(0,Math.min(100,scrollY/total*100))+'%';

    const label=$('#model-badge-text');
    if(label){
      const world=worlds.get(chapters[nearest].querySelector('canvas')?.id);
      label.textContent=(sceneNames[nearest]||'AMBIENTE')+' · '+(world?.ready?'3D':'CARREGANDO');
    }
  }

  chapters.forEach((chapter,i)=>{
    const b=document.createElement('button');
    b.setAttribute('aria-label','Ir para cena '+(i+1));
    b.addEventListener('click',()=>{
      chapter.scrollIntoView({behavior:'smooth',block:'start'});
      playSfx('click',.16);
    });
    dots?.appendChild(b);
  });

  addEventListener('scroll',()=>requestAnimationFrame(updateScroll),{passive:true});
  addEventListener('resize',updateScroll);
  updateScroll();

  /* ---------- entrance ---------- */
  start?.addEventListener('click',()=>{
    if(started) return;
    started=true;
    setAudio(true);
    if(hud) hud.hidden=false;
    playSfx('transition',.22);
    document.body.classList.add('experience-started');
    document.dispatchEvent(new CustomEvent('cybershield:started'));
    if(boot){
      boot.classList.add('is-done');
      setTimeout(()=>boot.remove(),1200);
    }
    chapters[0]?.scrollIntoView({behavior:'auto',block:'start'});
    setTimeout(()=>animateScene(chapters[0],1),120);
  },{once:true});

  /* ---------- keep content visible even if module had delays ---------- */
  addEventListener('load',()=>{
    chapters.forEach(c=>c.classList.add('is-ready'));
    updateScroll();
  });

  window.__cyberShieldOnSceneChange = index => {
    const dir = index >= activeScene ? 1 : -1;
    activeScene = index;
    if (started) playSfx(dir > 0 ? 'whoosh' : 'transition', .10);
    if (counter) counter.textContent = String(index + 1).padStart(2,'0');
  };
  window.__cyberShieldAnimateScene = animateScene;
  window.__cyberShieldActiveScene = activeScene;

  window.__cyberShieldExperienceLoaded=true;
})();
