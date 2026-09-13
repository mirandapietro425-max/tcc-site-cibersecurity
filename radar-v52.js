(() => {
  'use strict';
  const root = document.querySelector('.radar-page');
  if (!root) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const visible = { value: true };
  const state = {
    scan: true,
    selected: null,
    risk: 0,
    posture: 'ATENTA',
    elapsed: 0,
    last: performance.now(),
    raf: 0,
    audio: false,
    audioContext: null
  };

  const signals = [
    { id:'A', label:'SINAL FRACO', x:.29, y:.27, severity:'low', origin:'endpoint', impact:'baixo', confidence:'31%', text:'Um desvio pequeno. Ainda não há contexto suficiente para tratá-lo como ameaça.' },
    { id:'B', label:'ANOMALIA', x:.68, y:.23, severity:'medium', origin:'autenticação', impact:'médio', confidence:'58%', text:'O comportamento se afasta do padrão esperado. Compare horário, origem e frequência.' },
    { id:'C', label:'CORRELAÇÃO', x:.76, y:.62, severity:'medium', origin:'rede + identidade', impact:'alto', confidence:'76%', text:'Eventos independentes começam a compartilhar contexto. O padrão merece investigação.' },
    { id:'D', label:'CREDENCIAL', x:.44, y:.70, severity:'high', origin:'acesso', impact:'alto', confidence:'91%', text:'Tentativas repetidas e origem incomum elevam a confiança de risco. Valide por um canal confiável.' },
    { id:'E', label:'RUÍDO', x:.52, y:.38, severity:'low', origin:'telemetria', impact:'baixo', confidence:'22%', text:'Um evento isolado. Monitorar é mais proporcional do que interromper o fluxo.' },
    { id:'F', label:'MALWARE', x:.23, y:.67, severity:'high', origin:'endpoint', impact:'alto', confidence:'87%', text:'O padrão de execução coincide com comportamento suspeito. Conter reduz o caminho de propagação.' },
    { id:'G', label:'ORIGEM', x:.83, y:.42, severity:'medium', origin:'externo', impact:'médio', confidence:'63%', text:'A origem é incomum para o serviço. Correlacione com outros sinais antes de escalar.' }
  ];

  const $ = (sel, scope=root) => scope.querySelector(sel);
  const $$ = (sel, scope=root) => [...scope.querySelectorAll(sel)];
  const canvas = $('#radarCanvas');
  const ctx = canvas?.getContext('2d', { alpha:true });
  const stage = $('.r43-scope-stage');
  const signalDock = $('.r43-signal-dock');
  const title = $('[data-r43-intel-title]');
  const body = $('[data-r43-intel-body]');
  const origin = $('[data-r43-origin]');
  const impact = $('[data-r43-impact]');
  const confidence = $('[data-r43-confidence]');
  const eventLog = $('[data-r43-event-log]');
  const eventCount = $('[data-r43-event-count]');
  const postures = $$('[data-r43-posture]');
  const azimuth = $('[data-r43-azimuth]');
  const sector = $('[data-r43-sector]');
  const riskBar = $('[data-r43-risk-bar]');
  const riskValue = $('[data-r43-risk-value]');
  const status = $('[data-r43-status]');
  const feedback = $('[data-r43-feedback]');
  const clock = $('[data-r43-clock]');
  const scanBtn = $('[data-r43-scan]');
  const resetBtn = $('[data-r43-reset]');
  const audioBtn = $('[data-r43-audio]');
  const replayBtn = $('[data-r43-replay]');
  const heroArt = $('.r43-hero-art');
  const audio = $('[data-r43-audio-file]');

  if (!canvas || !ctx || !stage) return;

  const audioFiles = {
    detect: 'assets/audio/detect.wav',
    click: 'assets/audio/click.wav',
    success: 'assets/audio/success.wav'
  };
  const fx = {};
  Object.entries(audioFiles).forEach(([key, src]) => { const a = new Audio(src); a.preload = 'auto'; a.volume = .18; fx[key] = a; });

  function playFx(key) { if (!state.audio || !fx[key]) return; try { fx[key].currentTime = 0; void fx[key].play(); } catch (_) {} }

  function setAudio(on) {
    state.audio = on;
    if (on) {
      if (audio) { audio.volume = .10; void audio.play().catch(() => {}); }
      playFx('click');
    } else if (audio) audio.pause();
    if (audioBtn) {
      audioBtn.setAttribute('aria-pressed', String(on));
      audioBtn.innerHTML = `<i></i><span>SOM DO UNIVERSO · ${on ? 'ATIVO' : 'OFF'}</span>`;
    }
  }

  function addLog(text, tone='info') {
    if (!eventLog) return;
    const li = document.createElement('li');
    const time = document.createElement('time');
    time.textContent = new Date().toLocaleTimeString('pt-BR', { hour12:false, minute:'2-digit', second:'2-digit' });
    const msg = document.createElement('span');
    msg.textContent = text;
    if (tone === 'danger') msg.style.color = '#ffb1bc';
    if (tone === 'safe') msg.style.color = '#cbffe1';
    li.append(time,msg);
    eventLog.prepend(li);
    while (eventLog.children.length > 6) eventLog.lastElementChild.remove();
    if (eventCount) eventCount.textContent = String(eventLog.children.length).padStart(2,'0');
  }

  function updateRisk(value, postureText='ATENTA') {
    state.risk = Math.max(0, Math.min(100, value));
    state.posture = postureText;
    if (riskBar) riskBar.style.width = `${state.risk}%`;
    if (riskValue) riskValue.textContent = `${Math.round(state.risk)}%`;
    if (clock) clock.textContent = `${String(Math.floor(state.elapsed/60)).padStart(2,'0')}:${String(Math.floor(state.elapsed%60)).padStart(2,'0')}`;
    postures.forEach(el => { el.textContent = postureText; });
    if (status) status.textContent = state.risk >= 75 ? 'RESPOSTA NECESSÁRIA' : state.risk >= 45 ? 'PADRÃO CORRELACIONADO' : 'VIGILÂNCIA';
  }

  function sectorFor(deg) {
    const names = ['NORTE','NORDESTE','LESTE','SUDESTE','SUL','SUDOESTE','OESTE','NOROESTE'];
    return names[Math.floor((((deg + 22.5) % 360) / 45))];
  }

  function selectSignal(signal, source='interface') {
    state.selected = signal;
    $$('.r43-signal-btn').forEach(btn => btn.classList.toggle('is-active', btn.dataset.id === signal.id));
    title.textContent = signal.label;
    body.textContent = signal.text;
    origin.textContent = signal.origin.toUpperCase();
    impact.textContent = signal.impact.toUpperCase();
    confidence.textContent = signal.confidence;
    const deg = Math.round(Math.atan2(signal.x-.5, .5-signal.y) * 180 / Math.PI + 360) % 360;
    azimuth.textContent = `${String(deg).padStart(3,'0')}°`;
    sector.textContent = sectorFor(deg);
    updateRisk(signal.severity === 'high' ? 86 : signal.severity === 'medium' ? 58 : 24, signal.severity === 'high' ? 'CAUTELA' : signal.severity === 'medium' ? 'CORRELAÇÃO' : 'ATENTA');
    feedback.textContent = `${signal.label} · ${source === 'canvas' ? 'alvo localizado no campo' : 'alvo selecionado'} · escolha uma postura proporcional.`;
    addLog(`${signal.label} selecionado · origem ${signal.origin}`, signal.severity === 'high' ? 'danger' : 'info');
    playFx('detect');
  }

  signalDock.innerHTML = signals.map((s,i) => `<button class="r43-signal-btn" type="button" data-id="${s.id}" aria-label="${s.label}"><span>ALVO ${String(i+1).padStart(2,'0')}</span><b>${s.label}</b></button>`).join('');
  $$('.r43-signal-btn').forEach(btn => btn.addEventListener('click', () => {
    const signal = signals.find(s => s.id === btn.dataset.id);
    if (signal) selectSignal(signal);
  }));

  const dots = signals.map(s => ({...s, pulse:Math.random()*Math.PI*2, lastSeen:-10}));
  let dpr = 1;
  let radius = 0;
  let center = { x:0, y:0 };
  let sweep = 0;

  function resizeCanvas() {
    const rect = stage.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    center = {x:rect.width/2,y:rect.height/2};
    radius = Math.min(rect.width,rect.height) * .38;
  }

  function drawGrid(now) {
    const w=canvas.clientWidth,h=canvas.clientHeight;
    ctx.clearRect(0,0,w,h);
    ctx.save();
    ctx.translate(center.x,center.y);
    ctx.strokeStyle='rgba(113,231,245,.14)';
    ctx.lineWidth=1;
    [1,.74,.48,.24].forEach(k=>{ctx.beginPath();ctx.arc(0,0,radius*k,0,Math.PI*2);ctx.stroke();});
    ctx.strokeStyle='rgba(113,231,245,.08)';
    for(let a=0;a<Math.PI*2;a+=Math.PI/8){ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(a)*radius,Math.sin(a)*radius);ctx.stroke();}
    const grad=ctx.createRadialGradient(0,0,0,0,0,radius);
    grad.addColorStop(0,'rgba(113,231,245,.015)');
    grad.addColorStop(.8,'rgba(113,231,245,.035)');
    grad.addColorStop(1,'rgba(113,231,245,0)');
    ctx.fillStyle=grad;ctx.beginPath();ctx.arc(0,0,radius,0,Math.PI*2);ctx.fill();
    if(state.scan && !reduce){
      const sa=sweep;
      const g=ctx.createLinearGradient(0,0,Math.cos(sa)*radius,Math.sin(sa)*radius);
      g.addColorStop(0,'rgba(142,255,186,.28)');g.addColorStop(1,'rgba(142,255,186,0)');
      ctx.strokeStyle=g;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(sa)*radius,Math.sin(sa)*radius);ctx.stroke();
      ctx.fillStyle='rgba(142,255,186,.08)';ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,radius,sa-.23,sa);ctx.closePath();ctx.fill();
    }
    dots.forEach((d,i)=>{
      const x=(d.x-.5)*radius*1.72;
      const y=(d.y-.5)*radius*1.72;
      const age=state.elapsed-d.lastSeen;
      const pulse=.8+Math.sin(state.elapsed*2+d.pulse)*.15;
      let color=d.severity==='high'?'#ff7789':d.severity==='medium'?'#ffc66b':'#71e7f5';
      if(state.selected?.id===d.id) color='#ffffff';
      ctx.shadowBlur=state.selected?.id===d.id?24:13;ctx.shadowColor=color;ctx.fillStyle=color;
      ctx.beginPath();ctx.arc(x,y,5.5*pulse,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
      if(age<1.6){ctx.strokeStyle=color;ctx.globalAlpha=Math.max(0,1-age/1.6);ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,16+age*18,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}
    });
    ctx.restore();
  }

  function hitTest(clientX, clientY) {
    const rect=canvas.getBoundingClientRect();
    const x=clientX-rect.left, y=clientY-rect.top;
    let best=null,bestDist=28;
    dots.forEach(d=>{
      const px=center.x+(d.x-.5)*radius*1.72, py=center.y+(d.y-.5)*radius*1.72;
      const dist=Math.hypot(px-x,py-y);
      if(dist<bestDist){bestDist=dist;best=d;}
    });
    return best;
  }

  canvas.addEventListener('pointerdown', e=>{ const hit=hitTest(e.clientX,e.clientY); if(hit) selectSignal(hit,'canvas'); });
  canvas.addEventListener('pointermove', e=>{
    if(reduce) return;
    const r=stage.getBoundingClientRect();
    const tx=(e.clientX-r.left)/r.width-.5, ty=(e.clientY-r.top)/r.height-.5;
    root.style.setProperty('--r43-hero-x',`${tx*3}px`);
    root.style.setProperty('--r43-hero-y',`${ty*2}px`);
  },{passive:true});

  function step(ts){
    if(!state.raf) return;
    const dt=Math.min(.05,(ts-state.last)/1000);state.last=ts;state.elapsed+=dt;
    if(state.scan && !reduce) sweep=(sweep+dt*0.7)%(Math.PI*2);
    drawGrid(ts);
    state.raf=requestAnimationFrame(step);
  }
  function startLoop(){ if(state.raf || reduce || !visible.value || document.hidden) return; state.last=performance.now(); state.raf=requestAnimationFrame(step); }
  function stopLoop(){ if(state.raf){cancelAnimationFrame(state.raf);state.raf=0;} drawGrid(performance.now()); }

  function setScan(on){ state.scan=on; scanBtn.setAttribute('aria-pressed',String(on)); scanBtn.textContent=`SCAN · ${on?'ON':'OFF'}`; if(on) startLoop(); else drawGrid(performance.now()); }
  scanBtn.addEventListener('click',()=>setScan(!state.scan));
  resetBtn.addEventListener('click',()=>{ state.selected=null; game.phase='select'; game.evidence=0; game.investigated.clear(); game.contained=false; game.steps=0; game.score=0; updateRisk(0,'ATENTA'); title.textContent='Aguarde o primeiro retorno.'; body.textContent='O ambiente ainda está estável. O objetivo não é disparar alarmes, mas distinguir ruído de contexto.'; origin.textContent='—';impact.textContent='—';confidence.textContent='—';feedback.textContent='Escolha um sinal para investigar. Construa evidência antes de conter.'; $$('.r43-signal-btn').forEach(b=>b.classList.remove('is-active')); addLog('Radar reiniciado · novo incidente simulado','safe'); dots.forEach(d=>d.lastSeen=-10); drawGrid(performance.now()); });

  const game = {
    phase: 'select',
    evidence: 0,
    investigated: new Set(),
    contained: false,
    steps: 0,
    score: 0
  };

  function gameStatus(){
    if(game.contained) return 'INCIDENTE CONTIDO';
    if(game.evidence>=3) return 'PRONTO PARA CONTER';
    if(game.evidence===2) return 'PADRÃO CONFIRMADO';
    if(game.evidence===1) return 'EVIDÊNCIA EM FORMAÇÃO';
    return 'ESCUTA INICIADA';
  }

  function gameFeedback(text, kind='info'){
    feedback.textContent=text;
    addLog(text, kind);
    updateRisk(state.selected?.severity==='high' ? Math.max(18, 92-game.evidence*18) : state.risk, gameStatus());
  }

  function investigate(signal){
    if(!signal) return;
    if(game.investigated.has(signal.id)){
      gameFeedback(`${signal.label} já foi investigado. Correlacione outro sinal antes de repetir a análise.`);
      return;
    }
    game.investigated.add(signal.id);
    game.steps++;

    const findings = {
      D: 'CREDENCIAL INVESTIGADA · tentativas sucessivas + origem incomum. Evidência forte de comprometimento.',
      G: 'ORIGEM INVESTIGADA · o acesso vem de uma origem não habitual para este serviço. O contexto reforça o sinal.',
      B: 'ANOMALIA INVESTIGADA · horário, frequência e autenticação fogem do padrão. Há correlação com a credencial.',
      C: 'CORRELAÇÃO CONFIRMADA · rede + identidade apontam para o mesmo incidente. O risco agora é acionável.',
      A: 'SINAL FRACO · não há evidência suficiente para elevar o incidente. Evite escalar sem contexto.',
      E: 'RUÍDO CONFIRMADO · evento isolado. Tratar como incidente seria desproporcional.',
      F: 'MALWARE INVESTIGADO · execução suspeita detectada no endpoint. Isolamento é uma resposta plausível.'
    };

    const strong = ['D','G','B','C','F'].includes(signal.id);
    if(strong) game.evidence=Math.min(3,game.evidence+1);
    const kind = strong ? (signal.severity==='high'?'danger':'info') : 'safe';
    gameFeedback(findings[signal.id] || `${signal.label} investigado.`,kind);
    playFx(strong?'detect':'click');
  }

  function contain(signal){
    if(!signal) return;
    if(signal.id==='D' && game.evidence>=2){
      game.contained=true;
      game.score=Math.max(0,100-(game.steps-3)*8);
      updateRisk(8,'CONTIDO');
      feedback.textContent=`INCIDENTE CONTIDO · credencial revogada antes da propagação. Pontuação ${game.score}/100.`;
      addLog(`Resposta correta · credencial revogada com ${game.evidence} evidências`,'safe');
      playFx('success');
      const dot=dots.find(d=>d.id==='D'); if(dot) dot.lastSeen=state.elapsed;
      return;
    }
    if(signal.id==='A' || signal.id==='E'){
      updateRisk(18,'PROPORCIONAL');
      gameFeedback(`${signal.label} ainda é ruído. Conter agora criaria impacto sem evidência suficiente.`, 'safe');
    } else {
      updateRisk(Math.min(92,state.risk+10),'PREMATURO');
      gameFeedback(`CONTENÇÃO PREMATURA · ainda falta correlacionar evidências antes de interromper este caminho.`, 'danger');
    }
    playFx('click');
  }

  function monitor(signal){
    if(!signal) return;
    if(signal.id==='A' || signal.id==='E'){
      game.score=Math.min(100,game.score+8);
      updateRisk(12,'PROPORCIONAL');
      gameFeedback(`${signal.label} permanece em monitoramento. Decisão proporcional ao baixo grau de evidência.`,'safe');
    } else if(signal.id==='D' && game.evidence<2){
      updateRisk(Math.min(92,state.risk+8),'RISCO ABERTO');
      gameFeedback('MONITORAR CREDENCIAL AGORA É ARRISCADO · o sinal é forte e o tempo favorece o atacante. Investigue e correlacione.','danger');
    } else {
      updateRisk(Math.max(18,state.risk-4),'MONITORAMENTO');
      gameFeedback(`${signal.label} continua sob observação enquanto o contexto é correlacionado.`);
    }
    playFx('click');
  }

  $$('.r43-decision-btn').forEach(btn=>btn.addEventListener('click',()=>{
    if(!state.selected){ feedback.textContent='Selecione um sinal no campo antes de decidir o próximo passo.'; return; }
    if(game.contained){ feedback.textContent='Incidente encerrado. Use RESET para jogar novamente.'; return; }
    const signal=state.selected;
    const act=btn.dataset.action;
    if(act==='investigate') investigate(signal);
    else if(act==='contain') contain(signal);
    else monitor(signal);
  }));

  $('.r43-next')?.addEventListener('click',()=>document.querySelector('#radar-correlation')?.scrollIntoView({behavior:reduce?'auto':'smooth'}));
  replayBtn?.addEventListener('click',()=>resetBtn.click());
  audioBtn?.addEventListener('click',()=>setAudio(!state.audio));

  const io=new IntersectionObserver(entries=>{visible.value=entries.some(e=>e.isIntersecting); if(visible.value) startLoop(); else stopLoop();},{threshold:.08});io.observe(stage);
  document.addEventListener('visibilitychange',()=>document.hidden?stopLoop():startLoop());
  new ResizeObserver(resizeCanvas).observe(stage);

  let sceneStep=0;
  const sceneIO=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){const n=Number(e.target.dataset.scene);if(Number.isFinite(n))sceneStep=n;}}),{rootMargin:'-35% 0px -55% 0px'});
  $$('.r43-scene').forEach(s=>sceneIO.observe(s));

  window.addEventListener('keydown',e=>{
    const focused=document.activeElement;
    if(['INPUT','TEXTAREA','SELECT','BUTTON','A'].includes(focused?.tagName)) return;
    const radarSection=document.querySelector('#radar-observatory');
    if(radarSection && !radarSection.contains(focused) && !radarSection.matches(':hover')) return;
    if(e.key==='ArrowRight'){e.preventDefault();const idx=state.selected?Math.max(0,signals.findIndex(s=>s.id===state.selected.id)):0;selectSignal(signals[(idx+1)%signals.length]);}
    if(e.key==='ArrowLeft'){e.preventDefault();const idx=state.selected?Math.max(0,signals.findIndex(s=>s.id===state.selected.id)):0;selectSignal(signals[(idx-1+signals.length)%signals.length]);}
    if(e.key.toLowerCase()==='s'){e.preventDefault();setScan(!state.scan)}
    if(e.key.toLowerCase()==='m'){e.preventDefault();setAudio(!state.audio)}
    if(e.key==='Escape'){state.selected=null;$$('.r43-signal-btn').forEach(b=>b.classList.remove('is-active'));feedback.textContent='Seleção limpa. O campo volta à vigilância.';updateRisk(0,'ATENTA');}
  });

  if(!reduce){ window.addEventListener('scroll',()=>{const y=Math.min(1,window.scrollY/600);root.style.setProperty('--r43-hero-y',`${y*4}px`);},{passive:true}); }
  window.addEventListener('resize',()=>{resizeCanvas();drawGrid(performance.now());},{passive:true});
  resizeCanvas();updateRisk(0,'ATENTA');addLog('Observatório online · escuta iniciada');startLoop();
})();
