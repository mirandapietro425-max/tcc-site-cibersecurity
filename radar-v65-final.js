(() => {
  'use strict';
  const root = document.querySelector('.radar-page');
  if (!root) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const $ = (sel, scope=root) => scope.querySelector(sel);
  const $$ = (sel, scope=root) => [...scope.querySelectorAll(sel)];

  const signals = [
    { id:'A', label:'SINAL FRACO', x:.29, y:.27, severity:'low', origin:'endpoint', impact:'baixo', confidence:'31%', text:'Um desvio pequeno. Ainda não há contexto suficiente para tratá-lo como ameaça.', best:'monitor', hint:'Baixa confiança: observe antes de interromper.' },
    { id:'B', label:'ANOMALIA', x:.68, y:.23, severity:'medium', origin:'autenticação', impact:'médio', confidence:'58%', text:'O comportamento se afasta do padrão esperado. Compare horário, origem e frequência.', best:'investigate', hint:'Contexto incompleto: investigue antes de conter.' },
    { id:'C', label:'CORRELAÇÃO', x:.76, y:.62, severity:'medium', origin:'rede + identidade', impact:'alto', confidence:'76%', text:'Eventos independentes começam a compartilhar contexto. O padrão merece investigação.', best:'investigate', hint:'Vários sinais convergentes: abra o contexto.' },
    { id:'D', label:'CREDENCIAL', x:.44, y:.70, severity:'high', origin:'acesso', impact:'alto', confidence:'91%', text:'Tentativas repetidas e origem incomum elevam a confiança de risco. Valide por um canal confiável.', best:'contain', hint:'Risco alto e confiança alta: contenha o caminho.' },
    { id:'E', label:'RUÍDO', x:.52, y:.38, severity:'low', origin:'telemetria', impact:'baixo', confidence:'22%', text:'Um evento isolado. Monitorar é mais proporcional do que interromper o fluxo.', best:'monitor', hint:'É ruído: não interrompa o sistema.' },
    { id:'F', label:'MALWARE', x:.23, y:.67, severity:'high', origin:'endpoint', impact:'alto', confidence:'87%', text:'O padrão de execução coincide com comportamento suspeito. Conter reduz o caminho de propagação.', best:'contain', hint:'A ameaça é de alta confiança: isole imediatamente.' },
    { id:'G', label:'ORIGEM', x:.83, y:.42, severity:'medium', origin:'externo', impact:'médio', confidence:'63%', text:'A origem é incomum para o serviço. Correlacione com outros sinais antes de escalar.', best:'investigate', hint:'Origem incomum: investigue o contexto primeiro.' }
  ];

  const canvas = $('#radarCanvas');
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
  const audio = $('[data-r43-audio-file]');
  const overlay = $('[data-r53-game-overlay]');
  const overlayTitle = $('[data-r53-overlay-title]');
  const overlayBody = $('[data-r53-overlay-body]');
  const startBtn = $('[data-r53-start]');
  const roundEl = $('[data-r53-round]');
  const accuracyEl = $('[data-r53-accuracy]');
  const missionStatus = $('[data-r53-mission-status]');
  const objective = $('[data-r53-objective]');

  if (!canvas || !stage) return;
  const ctx = canvas.getContext('2d', {alpha:true});
  if (!ctx) return;

  const fx = {};
  [['click','assets/audio/click.wav'],['detect','assets/audio/detect.wav'],['success','assets/audio/success.wav'],['alert','assets/audio/alert.wav']].forEach(([k,src]) => { const a=new Audio(src); a.preload='auto'; a.volume=.16; fx[k]=a; });
  let audioOn = false;
  function fxPlay(k){ if(!audioOn || !fx[k]) return; try{fx[k].currentTime=0;void fx[k].play();}catch{} }

  const state = {
    running:false, won:false, round:0, maxRounds:5, hits:0, misses:0, selected:null,
    scan:true, elapsed:0, last:performance.now(), raf:0, visible:true, sweep:0,
    dots:[], target:null, targetHintUntil:0, feedbackTimer:0
  };

  function setText(el, text){ if(el) el.textContent=text; }
  function addLog(text, tone='info'){
    if(!eventLog) return;
    const li=document.createElement('li'); const t=document.createElement('time'); const m=document.createElement('span');
    t.textContent=new Date().toLocaleTimeString('pt-BR',{hour12:false,minute:'2-digit',second:'2-digit'}); m.textContent=text;
    if(tone==='danger') m.style.color='#ffb1bc'; if(tone==='safe') m.style.color='#cbffe1';
    li.append(t,m); eventLog.prepend(li); while(eventLog.children.length>6) eventLog.lastElementChild.remove(); setText(eventCount,String(eventLog.children.length).padStart(2,'0'));
  }
  function sectorFor(deg){ const n=['NORTE','NORDESTE','LESTE','SUDESTE','SUL','SUDOESTE','OESTE','NOROESTE']; return n[Math.floor((((deg+22.5)%360)/45))]; }
  function updateSignalUI(s, source='interface'){
    setText(title,s.label); setText(body,s.text); setText(origin,s.origin.toUpperCase()); setText(impact,s.impact.toUpperCase()); setText(confidence,s.confidence);
    const deg=Math.round(Math.atan2(s.x-.5,.5-s.y)*180/Math.PI+360)%360; setText(azimuth,`${String(deg).padStart(3,'0')}°`); setText(sector,sectorFor(deg));
    $$('.r43-signal-btn').forEach(b=>b.classList.toggle('is-active',b.dataset.id===s.id));
    const risk=s.severity==='high'?86:s.severity==='medium'?58:24; if(riskBar) riskBar.style.width=`${risk}%`; setText(riskValue,`${risk}%`);
    postures.forEach(p=>p.textContent=s.severity==='high'?'CAUTELA':s.severity==='medium'?'CORRELAÇÃO':'ATENTA');
    setText(status,s.severity==='high'?'RESPOSTA NECESSÁRIA':s.severity==='medium'?'PADRÃO CORRELACIONADO':'VIGILÂNCIA');
    setText(feedback,`${s.label} · ${source==='canvas'?'alvo detectado':'alvo selecionado'} · escolha a resposta indicada pela leitura.`);
    addLog(`${s.label} localizado · ${s.origin}`,s.severity==='high'?'danger':'info'); fxPlay('detect');
  }
  function clearSignal(){ state.selected=null; $$('.r43-signal-btn').forEach(b=>b.classList.remove('is-active')); setText(title,'Aguarde o primeiro retorno.'); setText(body,'Observe o campo e localize a anomalia marcada pelo scanner.'); setText(origin,'—'); setText(impact,'—'); setText(confidence,'—'); setText(feedback,'Localize um alvo no campo.'); }
  function makeButtons(){
    signalDock.innerHTML=signals.map((s,i)=>`<button class="r43-signal-btn" type="button" data-id="${s.id}" aria-label="${s.label}"><span>ALVO ${String(i+1).padStart(2,'0')}</span><b>${s.label}</b></button>`).join('');
    $$('.r43-signal-btn').forEach(b=>b.addEventListener('click',()=>{ const s=signals.find(x=>x.id===b.dataset.id); if(s) selectSignal(s,'interface'); }));
  }
  function pickTarget(){
    const pool=signals.filter(s=>s.id!==state.target?.id); state.target=pool[Math.floor(Math.random()*pool.length)]; state.dots=signals.map(s=>({...s,pulse:Math.random()*Math.PI*2,lastSeen:-10}));
    state.dots.find(d=>d.id===state.target.id).lastSeen=state.elapsed; state.targetHintUntil=state.elapsed+3.6; clearSignal();
    setText(roundEl,`${String(Math.min(state.round+1,state.maxRounds)).padStart(2,'0')}/${String(state.maxRounds).padStart(2,'0')}`); setText(missionStatus,'ANOMALIA ATIVA');
    setText(feedback,'Nova anomalia detectada. Encontre o sinal pulsando no radar.'); addLog(`Nova anomalia detectada · rodada ${state.round+1}`,'danger'); fxPlay('alert');
  }
  function selectSignal(s,source='interface'){
    state.selected=s; updateSignalUI(s,source);
    const target=state.target;
    if(!state.running || state.won) return;
    if(target && s.id===target.id){ setText(feedback,`ALVO CORRETO · ${s.hint}`); state.targetHintUntil=state.elapsed+99; }
    else setText(feedback,'Esse sinal não é o alvo da rodada. Continue escaneando.');
  }
  function setAudio(on){ audioOn=on; if(audio){audio.volume=.1;if(on) void audio.play().catch(()=>{});else audio.pause();} if(audioBtn){audioBtn.setAttribute('aria-pressed',String(on));audioBtn.innerHTML=`<i></i><span>SOM DO UNIVERSO · ${on?'ATIVO':'OFF'}</span>`;} if(on) fxPlay('click'); }
  function finishRound(correct, action){
    const target=state.target; if(!target) return;
    if(correct){ state.hits++; state.round++; addLog(`Resposta correta · ${action.toUpperCase()} · ${target.label}`,'safe'); setText(feedback,`ACERTO · ${action.toUpperCase()} foi proporcional ao risco. O caminho foi neutralizado.`); fxPlay('success');
      if(state.round>=state.maxRounds){ winGame(); return; }
      setText(missionStatus,'NEUTRALIZADA'); setTimeout(()=>{if(state.running&&!state.won) pickTarget();}, reduce?350:900);
    }else{
      state.misses++; addLog(`Resposta inadequada · ${action.toUpperCase()} em ${target.label}`,'danger'); setText(feedback,`RESPOSTA INADEQUADA · ${target.hint}`); fxPlay('alert'); state.targetHintUntil=state.elapsed+2.4;
      const wrongBtns=$$('.r43-decision-btn'); wrongBtns.forEach(b=>b.classList.add('r53-shake')); setTimeout(()=>wrongBtns.forEach(b=>b.classList.remove('r53-shake')),380);
    }
    const total=state.hits+state.misses; setText(accuracyEl,total?`${Math.round(state.hits/total*100)}%`:'—');
  }
  function attempt(action){
    if(!state.running){ startMission(); return; }
    if(!state.selected){ setText(feedback,'Primeiro localize a anomalia e selecione o sinal correto.'); return; }
    if(!state.target){return;}
    if(state.selected.id!==state.target.id){ setText(feedback,'Esse alvo não pertence à rodada atual. Procure o sinal pulsando.'); fxPlay('click'); return; }
    finishRound(action===state.target.best,action);
  }
  function startMission(){
    state.running=true; state.won=false; state.round=0; state.hits=0; state.misses=0; state.selected=null; state.elapsed=0; state.target=null;
    if(overlay){overlay.classList.remove('is-visible');overlay.setAttribute('aria-hidden','true');}
    setText(missionStatus,'EM ESCUTA'); setText(accuracyEl,'100%'); if(objective) objective.textContent=`OBJETIVO: neutralize ${state.maxRounds} anomalias. Acertos ${state.maxRounds} · Erros permitidos.`;
    clearSignal(); addLog('Missão iniciada · encontre o sinal pulsando'); pickTarget(); fxPlay('click');
  }
  function winGame(){
    state.won=true; state.running=false; setText(missionStatus,'MISSÃO CONCLUÍDA'); setText(feedback,'MISSÃO CONCLUÍDA · todas as anomalias foram neutralizadas.'); addLog('Missão concluída · observatório estabilizado','safe');
    const acc=Math.round(state.hits/Math.max(1,state.hits+state.misses)*100); setText(accuracyEl,`${acc}%`); setText(roundEl,`${String(state.maxRounds).padStart(2,'0')}/${String(state.maxRounds).padStart(2,'0')}`);
    if(overlay){overlay.classList.add('is-visible');overlay.setAttribute('aria-hidden','false');setText(overlayTitle,'ANOMALIA NEUTRALIZADA');setText(overlayBody,`Observatório estabilizado. Você neutralizou ${state.hits} de ${state.maxRounds} anomalias com ${acc}% de precisão.`);setText(startBtn,'JOGAR NOVAMENTE');}
    fxPlay('success');
  }
  function resetGame(){ state.running=false;state.won=false;state.round=0;state.hits=0;state.misses=0;state.target=null;state.elapsed=0;clearSignal();setText(roundEl,'00/05');setText(accuracyEl,'—');setText(missionStatus,'AGUARDANDO');setText(feedback,'Inicie a missão para começar a escuta.');if(overlay){overlay.classList.add('is-visible');overlay.setAttribute('aria-hidden','false');setText(overlayTitle,'ENCONTRE A ANOMALIA');setText(overlayBody,'Observe o campo. Quando um sinal aparecer, selecione-o e escolha a resposta proporcional ao risco.');setText(startBtn,'INICIAR MISSÃO');}addLog('Radar reiniciado · pronto para missão','safe');}

  const dots=state.dots;
  let dpr=1,radius=0,center={x:0,y:0};
  function resize(){ const r=stage.getBoundingClientRect();dpr=Math.min(window.devicePixelRatio||1,coarse?1.5:2);canvas.width=Math.max(1,Math.floor(r.width*dpr));canvas.height=Math.max(1,Math.floor(r.height*dpr));canvas.style.width=`${r.width}px`;canvas.style.height=`${r.height}px`;ctx.setTransform(dpr,0,0,dpr,0,0);center={x:r.width/2,y:r.height/2};radius=Math.min(r.width,r.height)*.38; }
  function draw(){ const w=canvas.clientWidth,h=canvas.clientHeight;ctx.clearRect(0,0,w,h);ctx.save();ctx.translate(center.x,center.y);ctx.strokeStyle='rgba(113,231,245,.14)';ctx.lineWidth=1;[1,.74,.48,.24].forEach(k=>{ctx.beginPath();ctx.arc(0,0,radius*k,0,Math.PI*2);ctx.stroke();});ctx.strokeStyle='rgba(113,231,245,.08)';for(let a=0;a<Math.PI*2;a+=Math.PI/8){ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(a)*radius,Math.sin(a)*radius);ctx.stroke();}
    if(state.scan&&!reduce){const g=ctx.createLinearGradient(0,0,Math.cos(state.sweep)*radius,Math.sin(state.sweep)*radius);g.addColorStop(0,'rgba(142,255,186,.3)');g.addColorStop(1,'rgba(142,255,186,0)');ctx.strokeStyle=g;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(state.sweep)*radius,Math.sin(state.sweep)*radius);ctx.stroke();ctx.fillStyle='rgba(142,255,186,.08)';ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,radius,state.sweep-.23,state.sweep);ctx.closePath();ctx.fill();}
    state.dots.forEach(d=>{const x=(d.x-.5)*radius*1.72,y=(d.y-.5)*radius*1.72;const isTarget=state.running&&state.target?.id===d.id;const isSelected=state.selected?.id===d.id;const pul=isTarget?1.25+Math.sin(state.elapsed*5+d.pulse)*.2:.82+Math.sin(state.elapsed*2+d.pulse)*.12;let c=d.severity==='high'?'#ff7789':d.severity==='medium'?'#ffc66b':'#71e7f5';if(isSelected)c='#fff';if(isTarget)c='#9effcf';ctx.shadowBlur=isTarget?28:isSelected?22:12;ctx.shadowColor=c;ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,5.2*pul,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;if(isTarget&&state.elapsed<state.targetHintUntil){ctx.strokeStyle=c;ctx.globalAlpha=.75;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x,y,18+Math.sin(state.elapsed*4)*6,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}});ctx.restore(); }
  function hitTest(cx,cy){const r=canvas.getBoundingClientRect();const x=cx-r.left,y=cy-r.top;let best=null,bd=32;state.dots.forEach(d=>{const px=center.x+(d.x-.5)*radius*1.72,py=center.y+(d.y-.5)*radius*1.72,dist=Math.hypot(px-x,py-y);if(dist<bd){bd=dist;best=d;}});return best;}
  canvas.addEventListener('pointerdown',e=>{const hit=hitTest(e.clientX,e.clientY);if(hit)selectSignal(hit,'canvas');});
  canvas.addEventListener('pointermove',e=>{if(reduce)return;const r=stage.getBoundingClientRect();root.style.setProperty('--r43-hero-x',`${((e.clientX-r.left)/r.width-.5)*3}px`);root.style.setProperty('--r43-hero-y',`${((e.clientY-r.top)/r.height-.5)*2}px`);},{passive:true});
  function step(ts){if(!state.raf)return;const dt=Math.min(.05,(ts-state.last)/1000);state.last=ts;state.elapsed+=dt;if(state.scan&&!reduce)state.sweep=(state.sweep+dt*.72)%(Math.PI*2);draw();state.raf=requestAnimationFrame(step);}
  function startLoop(){if(state.raf||reduce||!state.visible||document.hidden)return;state.last=performance.now();state.raf=requestAnimationFrame(step);}
  function stopLoop(){if(state.raf){cancelAnimationFrame(state.raf);state.raf=0;}draw();}
  scanBtn?.addEventListener('click',()=>{state.scan=!state.scan;scanBtn.setAttribute('aria-pressed',String(state.scan));scanBtn.textContent=`SCAN · ${state.scan?'ON':'OFF'}`;if(state.scan)startLoop();});
  resetBtn?.addEventListener('click',resetGame);
  replayBtn?.addEventListener('click',resetGame);
  startBtn?.addEventListener('click',startMission);
  audioBtn?.addEventListener('click',()=>setAudio(!audioOn));
  $$('.r43-decision-btn').forEach(b=>b.addEventListener('click',()=>attempt(b.dataset.action)));
  $('.r43-next')?.addEventListener('click',()=>document.querySelector('#radar-correlation')?.scrollIntoView({behavior:reduce?'auto':'smooth'}));
  window.addEventListener('keydown',e=>{const f=document.activeElement;if(['INPUT','TEXTAREA','SELECT'].includes(f?.tagName))return;if(e.key==='Enter'&&overlay?.classList.contains('is-visible')){e.preventDefault();startMission();return;}if(e.key==='ArrowRight'){const i=state.selected?Math.max(0,signals.findIndex(s=>s.id===state.selected.id)):0;selectSignal(signals[(i+1)%signals.length]);}if(e.key==='ArrowLeft'){const i=state.selected?Math.max(0,signals.findIndex(s=>s.id===state.selected.id)):0;selectSignal(signals[(i-1+signals.length)%signals.length]);}if(e.key.toLowerCase()==='s'){e.preventDefault();scanBtn?.click();}if(e.key.toLowerCase()==='m'){e.preventDefault();audioBtn?.click();}if(e.key==='Escape'){clearSignal();}});
  const io=new IntersectionObserver(es=>{state.visible=es.some(e=>e.isIntersecting);if(state.visible)startLoop();else stopLoop();},{threshold:.08});io.observe(stage);document.addEventListener('visibilitychange',()=>document.hidden?stopLoop():startLoop());new ResizeObserver(resize).observe(stage);window.addEventListener('resize',resize,{passive:true});
  makeButtons();resize();draw();clearSignal();addLog('Observatório online · modo missão disponível');if(!reduce)startLoop();
})();
