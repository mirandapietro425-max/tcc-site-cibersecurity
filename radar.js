(() => {
  const root = document.querySelector('.radar-page');
  if (!root) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stage = root.querySelector('.story__stage');
  const ambient = root.querySelector('.story__ambient');
  const title = root.querySelector('[data-copy-title]');
  const body = root.querySelector('[data-copy-body]');
  const step = root.querySelector('[data-step]');
  const sceneStatus = root.querySelector('[data-status]');
  const counter = root.querySelector('[data-counter]');
  const card = root.querySelector('.threat-card');
  const cardTag = root.querySelector('[data-card-tag]');
  const cardTitle = root.querySelector('[data-card-title]');
  const cardBody = root.querySelector('[data-card-body]');
  const outcome = root.querySelector('.outcome');
  const nodes = [...root.querySelectorAll('.node')];
  const dots = [...root.querySelectorAll('.chapter-dot')];
  const sweep = root.querySelector('.sweep');
  const soundBtn = root.querySelector('.sound');
  const scenes = [
    { n:'01', tag:'VIGÍLIA', title:'A rede parece <em>quieta</em>.', body:'O Radar começa sem respostas prontas. Você observa o ambiente, identifica padrões e acompanha a leitura sem transformar ruído em alarme.', status:'AMBIENTE ESTÁVEL', count:'00', accent:'calm', focus:null },
    { n:'02', tag:'PRIMEIRO SINAL', title:'Um ponto foge do <em>ritmo</em>.', body:'Um sinal aparece. Ele não prova um ataque, mas merece atenção. Clique no alvo para abrir a primeira leitura contextual.', status:'SINAL DETECTADO', count:'01', accent:'warn', focus:1 },
    { n:'03', tag:'CORRELAÇÃO', title:'O que importa é o <em>contexto</em>.', body:'Quando os sinais se conectam, o risco muda de peso. Compare origem, comportamento e impacto antes de escolher a resposta.', status:'PADRÃO CORRELACIONADO', count:'03', accent:'medium', focus:2 },
    { n:'04', tag:'DECISÃO', title:'Agora o Radar pede uma <em>decisão</em>.', body:'Você pode investigar, conter ou apenas monitorar. Cada escolha muda a leitura da cena — a intenção é ensinar postura, não simular um SOC real.', status:'RESPOSTA NECESSÁRIA', count:'05', accent:'danger', focus:3 },
    { n:'05', tag:'CONTAINMENT', title:'Uma boa resposta devolve <em>controle</em>.', body:'Ao conter o sinal certo, o mapa desacelera e o ambiente volta ao equilíbrio. O Radar termina onde a segurança começa: na ação informada.', status:'AMBIENTE PROTEGIDO', count:'00', accent:'safe', focus:null }
  ];
  let sceneIndex = 0;
  let audioCtx = null;
  let oscillator = null;
  let gain = null;
  let audioOn = false;

  function setScene(i, animate = true) {
    sceneIndex = Math.max(0, Math.min(scenes.length - 1, i));
    const s = scenes[sceneIndex];
    root.dataset.scene = String(sceneIndex + 1);
    step.textContent = `${s.n} / 05 · ${s.tag}`;
    title.innerHTML = s.title;
    body.textContent = s.body;
    sceneStatus.textContent = s.status;
    counter.textContent = s.count;
    dots.forEach((d, k) => d.classList.toggle('is-current', k === sceneIndex));
    const bg = s.accent === 'danger' ? 'radial-gradient(circle at 70% 40%,rgba(255,122,138,.10),transparent 32%),linear-gradient(180deg,#12070b,#07060a)' : s.accent === 'safe' ? 'radial-gradient(circle at 60% 50%,rgba(140,255,181,.10),transparent 35%),linear-gradient(180deg,#03100d,#02070b)' : s.accent === 'warn' ? 'radial-gradient(circle at 70% 48%,rgba(255,199,107,.09),transparent 34%),linear-gradient(180deg,#0c0b06,#02070b)' : 'radial-gradient(circle at 60% 50%,rgba(112,231,247,.07),transparent 34%),linear-gradient(180deg,#031018,#02070b)';
    ambient.style.background = bg;
    nodes.forEach((n,k)=>n.classList.toggle('is-muted', (sceneIndex===0 && k!==0) || (sceneIndex===4)));
    if (sceneIndex === 3) {
      cardTag.textContent = 'PRIORIDADE ALTA'; cardTitle.textContent = 'CREDENCIAL EM RISCO'; cardBody.textContent = 'A combinação de origem incomum, horário e tentativas repetidas aumenta o peso do sinal. Verifique antes de liberar acesso.'; card.classList.add('is-visible');
    } else if (sceneIndex === 2) {
      cardTag.textContent = 'PADRÃO'; cardTitle.textContent = 'ACESSO ANÔMALO'; cardBody.textContent = 'Três sinais pequenos podem formar um quadro maior. A correlação reduz o risco de tratar eventos isolados como ruído.'; card.classList.add('is-visible');
    } else if (sceneIndex === 1) {
      cardTag.textContent = 'SINAL'; cardTitle.textContent = 'DOMÍNIO SUSPEITO'; cardBody.textContent = 'A primeira leitura indica um desvio. Antes de clicar, confirme remetente, domínio, urgência e canal.'; card.classList.add('is-visible');
    } else card.classList.remove('is-visible');
    if (!reduce && animate) {
      title.animate([{opacity:.2, transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}], {duration:420,easing:'cubic-bezier(.2,.75,.2,1)'});
      body.animate([{opacity:.2},{opacity:1}], {duration:520,delay:60,easing:'ease-out'});
      if (sceneIndex===3) ping('danger'); else if (sceneIndex===4) ping('safe');
    }
  }

  function ping(kind='safe') {
    if (!audioOn) return;
    try {
      const now = audioCtx.currentTime;
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sine'; o.frequency.value = kind === 'danger' ? 180 : 420;
      g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(kind === 'danger' ? 0.025 : 0.018, now + .02); g.gain.exponentialRampToValueAtTime(0.0001, now + .26);
      o.connect(g).connect(audioCtx.destination); o.start(now); o.stop(now+.28);
    } catch (_) {}
  }
  function toggleAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    audioOn = !audioOn;
    soundBtn.textContent = audioOn ? 'SOM · ATIVO' : 'SOM · OFF';
    soundBtn.setAttribute('aria-pressed', String(audioOn));
    if (audioOn) ping('safe');
  }
  function selectNode(node) {
    nodes.forEach(n=>n.classList.remove('is-selected'));
    node.classList.add('is-selected');
    const sev = node.dataset.severity || 'low';
    const labels = {
      low:['OBSERVAÇÃO','sinal fraco','confirme contexto antes de agir'],
      medium:['ATENÇÃO','padrão incomum','correlacione antes de escalar'],
      high:['ALTO RISCO','credencial exposta','contenha o caminho de acesso e valide por canal confiável']
    };
    const [tag,ttl,desc] = labels[sev];
    cardTag.textContent = tag; cardTitle.textContent = ttl.toUpperCase(); cardBody.textContent = desc; card.classList.add('is-visible');
    ping(sev==='high'?'danger':'safe');
  }
  function chooseAction(action) {
    outcome.classList.remove('is-visible');
    const messages = {
      investigate:'INVESTIGAÇÃO ABERTA · contexto preservado',
      contain:'CONTENÇÃO ATIVA · caminho de risco isolado',
      monitor:'MONITORAMENTO · sinal mantido sob observação'
    };
    outcome.textContent = messages[action];
    outcome.classList.add('is-visible');
    ping(action==='contain'?'safe':'danger');
    if (action === 'contain') nodes.forEach(n=>n.classList.add('is-muted'));
    setTimeout(()=>outcome.classList.remove('is-visible'), 2600);
  }

  nodes.forEach(n=>n.addEventListener('click',()=>selectNode(n)));
  dots.forEach((d,i)=>d.addEventListener('click',()=>{ const target = root.querySelectorAll('.story__track .story__marker')[i]; if(target) target.scrollIntoView({behavior:reduce?'auto':'smooth'}); setScene(i); }));
  root.querySelectorAll('.action').forEach(btn=>btn.addEventListener('click',()=>chooseAction(btn.dataset.action)));
  soundBtn?.addEventListener('click',toggleAudio);
  root.querySelector('.replay')?.addEventListener('click',()=>{setScene(0,false);root.querySelector('.story').scrollIntoView({behavior:reduce?'auto':'smooth'});nodes.forEach(n=>n.classList.remove('is-selected','is-muted'));});

  const markers = [...root.querySelectorAll('.story__marker')];
  const io = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting){ const idx = Number(entry.target.dataset.scene); if(Number.isFinite(idx)) setScene(idx); }}), {rootMargin:'-30% 0px -55% 0px',threshold:0});
  markers.forEach(m=>io.observe(m));

  window.addEventListener('keydown',e=>{
    if(e.key==='ArrowDown'||e.key==='PageDown'){ if(sceneIndex<4){e.preventDefault(); markers[sceneIndex+1]?.scrollIntoView({behavior:reduce?'auto':'smooth'});} }
    if(e.key==='ArrowUp'||e.key==='PageUp'){ if(sceneIndex>0){e.preventDefault(); markers[sceneIndex-1]?.scrollIntoView({behavior:reduce?'auto':'smooth'});} }
    if(e.key===' ' && document.activeElement?.tagName!=='BUTTON'){ e.preventDefault(); toggleAudio(); }
  });

  // Lightweight pointer parallax; only affects transform layers.
  root.addEventListener('pointermove', e=>{
    if(reduce || !stage) return;
    const x=(e.clientX/innerWidth-.5)*2, y=(e.clientY/innerHeight-.5)*2;
    const r=root.querySelector('.radar-wrap'), c=root.querySelector('.char--robot'), g=root.querySelector('.char--guardian');
    if(r) r.style.transform=`translate3d(${x*8}px,${y*5}px,0)`;
    if(c) c.style.marginLeft=`${x*5}px`;
    if(g) g.style.marginLeft=`${-x*3}px`;
  }, {passive:true});

  setScene(0,false);
})();
