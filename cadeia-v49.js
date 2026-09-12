(() => {
  'use strict';
  const root = document.querySelector('.attack-page');
  if (!root) return;
  const $ = (s, el = root) => el.querySelector(s);
  const $$ = (s, el = root) => [...el.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const stages = [
    {id:'recon',index:'01',name:'Reconhecimento',short:'Coleta de informação',line:'observing_surface_01…',signal:'Tentativas de login, varreduras incomuns ou pedidos de informação fora do padrão.',threat:'O invasor começa observando: pessoas, tecnologias expostas, fornecedores e o que o próprio alvo publica.',defenses:[['GV','Política sobre o que a organização publica e compartilha'],['ID','Inventário atualizado da superfície de ataque'],['PR','Treinamento para reduzir exposição desnecessária']],fn:'GV · ID · PR'},
    {id:'weapon',index:'02',name:'Armamento',short:'Preparo do ataque',line:'building_payload_02…',signal:'O primeiro indício costuma aparecer quando um artefato ou dependência chega ao alvo.',threat:'Com uma oportunidade identificada, o invasor prepara o conteúdo ou dependência que pretende usar contra o alvo.',defenses:[['ID','Gestão de vulnerabilidades e acompanhamento de CVEs'],['PR','Atualizações e patches em dia'],['PR','Verificação de integridade de dependências']],fn:'ID · PR'},
    {id:'delivery',index:'03',name:'Entrega',short:'O conteúdo chega ao alvo',line:'delivery_channel_03…',signal:'Urgência incomum, remetente inesperado ou link fora do padrão oficial.',threat:'O conteúdo chega por e-mail, mensagem, site falso ou outro canal. É quando o risco passa a disputar atenção com a rotina.',defenses:[['PR','Filtros e verificação de domínio'],['DE','Sandbox e análise de anexos'],['PR','Pausa de três segundos: verificar antes de agir']],fn:'PR · DE'},
    {id:'exploit',index:'04',name:'Exploração',short:'A falha é usada',line:'anomaly_detected_04…',signal:'Processos inesperados, falhas repetidas ou comportamento fora do padrão.',threat:'Uma vulnerabilidade é usada para executar uma ação que não deveria existir. A possibilidade vira comportamento concreto.',defenses:[['PR','Menor privilégio e segmentação'],['DE','Detecção de comportamento anômalo em endpoints'],['ID','Desenvolvimento seguro no ciclo de vida']],fn:'PR · DE · ID'},
    {id:'install',index:'05',name:'Instalação',short:'Persistência',line:'persistence_attempt_05…',signal:'Tarefas agendadas novas, serviços desconhecidos ou contas criadas fora do processo.',threat:'O acesso procura sobreviver. Persistência transforma um evento pontual em presença prolongada.',defenses:[['DE','Monitoramento de integridade de arquivos e processos'],['PR','Autenticação multifator'],['RS','Plano para isolar rapidamente hosts comprometidos']],fn:'DE · PR · RS'},
    {id:'c2',index:'06',name:'Comando e controle',short:'Canal de saída',line:'outbound_channel_06…',signal:'Tráfego de saída incomum ou conexões para domínios recentes e de baixa reputação.',threat:'O sistema comprometido busca um canal externo para receber instruções. O controle passa a continuar sem nova ação da vítima.',defenses:[['DE','Monitoramento de saída e consultas DNS'],['PR','Política de rede com destinos permitidos'],['RS','Conter, revogar acessos e registrar']],fn:'DE · PR · RS'},
    {id:'objectives',index:'07',name:'Ações sobre os objetivos',short:'O objetivo é cumprido',line:'objective_reached_07…',signal:'O impacto fica visível: disponibilidade alterada, dados comprometidos ou operação interrompida.',threat:'O objetivo final aparece: exfiltração, indisponibilidade ou outro impacto. A partir daqui, a organização já paga o custo do atraso.',defenses:[['RC','Backup testado e comprovadamente restaurável'],['RS','Comunicação de incidente e obrigações previstas'],['GV','Revisão pós-incidente para fechar a lacuna']],fn:'RC · RS · GV'}
  ];

  const scene=$('#attack-scene'), panel=$('#attack-panel'), rail=$('#attack-rail-list'), deepGrid=$('#deep-grid'), decisionGrid=$('#decision-grid'), breakChain=$('#break-chain');
  if(!scene||!panel) return;
  const els={
    railStatus:$('#rail-status'), sceneCounter:$('#scene-counter'), sceneName:$('#scene-name'), sceneSignal:$('#scene-signal'), terminal:$('#terminal-line'), sceneLabel:$('#scene-progress-label'), sceneFill:$('#scene-progress-fill'),
    panelType:$('#panel-type'), panelStage:$('#panel-stage'), panelTitle:$('#panel-title'), panelCopy:$('#panel-copy'), panelSignal:$('#panel-signal-text'), panelDefense:$('#panel-defense'), nextHint:$('#panel-next-hint'), nextName:$('#panel-next-name'), result:$('#decision-result'), resultLabel:$('#decision-result-label'), resultTitle:$('#decision-result-title'), resultCopy:$('#decision-result-copy'),
    atlasStage:$('#atlas-stage'), atlasName:$('#atlas-name'), atlasSignal:$('#atlas-signal'), atlasFocus:$('#atlas-focus')
  };
  let active=0, mode='threat', audio=null, soundOn=false;

  function transition(fn){
    if(document.startViewTransition && !reduce){ document.startViewTransition(fn); } else fn();
  }
  function renderRail(){
    rail.innerHTML=stages.map((s,i)=>`<li><button type="button" data-index="${i}" class="rail-btn ${i===active?'is-active':''}" aria-current="${i===active?'step':'false'}"><span>${s.index}</span><b>${s.name}</b><small>${s.short}</small></button></li>`).join('');
    $$('.rail-btn',rail).forEach(b=>b.addEventListener('click',()=>setActive(Number(b.dataset.index),true)));
  }
  function renderDeep(){
    deepGrid.innerHTML=stages.map((s,i)=>`<article class="deep-card ${i===active?'is-active':''}" data-deep-index="${i}" tabindex="0"><div class="deep-card-top"><span>${s.index}</span><em>${s.fn}</em></div><h3>${s.name}</h3><p>${s.short}</p><div class="deep-card-bar"><i style="--w:${((i+2)/stages.length)*100}%"></i></div></article>`).join('');
    $$('.deep-card',deepGrid).forEach(card=>{const go=()=>setActive(Number(card.dataset.deepIndex),true);card.addEventListener('click',go);card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}})});
  }
  function renderDecisions(){
    decisionGrid.innerHTML=stages.map((s,i)=>`<button type="button" class="decision-chip" data-decision="${i}"><span>${s.index}</span><b>${s.name}</b></button>`).join('');
    $$('.decision-chip',decisionGrid).forEach(b=>b.addEventListener('click',()=>decide(Number(b.dataset.decision))));
  }
  function renderBreakChain(selected=null){
    breakChain.innerHTML=stages.map((s,i)=>`<div class="break-node ${i<(selected??-1)?'is-passed':''} ${i===selected?'is-selected':''}"><span>${s.index}</span><small>${s.name}</small></div>${i<stages.length-1?'<i class="break-link"></i>':''}`).join('');
  }
  function setAtlas(i){
    const s=stages[i];
    if(els.atlasStage) els.atlasStage.textContent=s.index;
    if(els.atlasName) els.atlasName.textContent=s.name;
    if(els.atlasSignal) els.atlasSignal.textContent=s.short;
    if(els.atlasFocus) els.atlasFocus.innerHTML=`<span>ELO ${s.index}</span><b>${s.name} · ${s.short}</b>`;
    $$('.atlas-hot').forEach((b,k)=>b.classList.toggle('is-active',k===i));
  }
  function animateScene(){
    if(reduce) return;
    scene.animate([{transform:'translate3d(0,0,0) scale(.985)',opacity:.74,filter:'blur(2px)'},{transform:'translate3d(0,-5px,0) scale(1)',opacity:1,filter:'blur(0)'}],{duration:620,easing:'cubic-bezier(.2,.78,.2,1)'});
    panel.animate([{opacity:.5,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,easing:'cubic-bezier(.2,.78,.2,1)'});
  }
  function setActive(i, move=false){
    active=Math.max(0,Math.min(stages.length-1,i)); mode='threat'; const s=stages[active], next=stages[Math.min(stages.length-1,active+1)];
    transition(()=>{
      scene.dataset.stage=s.id;
      els.railStatus.textContent=active===6?'OBJETIVO VISÍVEL':`ELO ${s.index} EM FOCO`;
      els.sceneCounter.textContent=s.index; els.sceneName.textContent=s.name.toUpperCase(); els.sceneSignal.textContent=s.short.toUpperCase(); els.terminal.textContent=s.line;
      els.sceneLabel.textContent=`${s.index} / 07`; els.sceneFill.style.width=`${((active+1)/7)*100}%`;
      els.panelType.textContent='SINAL'; els.panelStage.textContent=`${s.index} / 07`; els.panelTitle.textContent=s.name; els.panelCopy.textContent=s.threat; els.panelSignal.textContent=s.signal;
      els.panelNextName.textContent=active===6?'Encerrar a sequência →':`${next.name} →`; els.nextHint.textContent=active===6?'Fechamento':'Próximo elo';
      els.panelDefense.hidden=true; els.panelDefense.innerHTML='';
      $$('.panel-switch button').forEach((b,k)=>{const on=k===0;b.classList.toggle('is-active',on);b.setAttribute('aria-selected',String(on));});
      renderRail(); renderDeep(); setAtlas(active); animateScene();
    });
    if(move) scene.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'});
  }
  $$('.panel-switch button').forEach(btn=>btn.addEventListener('click',()=>{
    mode=btn.dataset.mode; const s=stages[active];
    $$('.panel-switch button').forEach(b=>{const on=b===btn;b.classList.toggle('is-active',on);b.setAttribute('aria-selected',String(on));});
    transition(()=>{ if(mode==='defense'){els.panelType.textContent='MEDIAÇÃO'; els.panelDefense.hidden=false; els.panelDefense.innerHTML=`<p>O ponto de interrupção mais útil aqui combina:</p><ul>${s.defenses.map(([fn,text])=>`<li><span>${fn}</span><b>${text}</b></li>`).join('')}</ul>`;} else {els.panelType.textContent='SINAL';els.panelDefense.hidden=true;els.panelDefense.innerHTML='';} });
  }));
  $('#prev-stage')?.addEventListener('click',()=>setActive(active-1));
  $('#next-stage')?.addEventListener('click',()=>setActive(active+1));
  function decide(i){
    const s=stages[i], late=6-i, efficacy=Math.max(18,100-late*12);
    $$('.decision-chip').forEach((b,k)=>b.classList.toggle('is-selected',k===i)); renderBreakChain(i);
    els.result.dataset.state=i<=2?'early':i<=4?'mid':'late';
    els.resultLabel.textContent=i<=2?'INTERRUPÇÃO ANTECIPADA':i<=4?'CONTENÇÃO TARDIA':'RESPOSTA NO IMPACTO';
    els.resultTitle.textContent=i<=2?`Você colocou fricção em ${s.name}.`:i<=4?`Você conteve a sequência em ${s.name}.`:`Você chegou ao impacto em ${s.name}.`;
    els.resultCopy.textContent=`Índice educativo de interrupção: ${efficacy}%. Quanto mais cedo a organização consegue agir, mais opções permanecem abertas para conter, responder e recuperar.`;
  }
  function makeAtlas(){
    const holder=$('#atlas-hotspots'); if(!holder) return;
    const points=[[10,70],[25,36],[41,23],[57,31],[70,48],[81,63],[88,29]];
    points.forEach(([x,y],i)=>{const b=document.createElement('button');b.type='button';b.className='atlas-hot'+(i===0?' is-active':'');b.textContent=String(i+1).padStart(2,'0');b.style.left=`${x}%`;b.style.top=`${y}%`;b.setAttribute('aria-label',`${stages[i].index} ${stages[i].name}`);b.addEventListener('click',()=>{setActive(i,true);});holder.appendChild(b);});
  }
  const theater=document.getElementById('theater');
  if(theater&&'IntersectionObserver' in window){new IntersectionObserver(entries=>entries.forEach(e=>scene.classList.toggle('is-in-view',e.isIntersecting)),{threshold:.12}).observe(theater);}
  const parallaxZone=document.querySelector('[data-parallax-zone]');
  if(parallaxZone&&!reduce&&matchMedia('(pointer:fine)').matches){parallaxZone.addEventListener('pointermove',e=>{const r=parallaxZone.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;parallaxZone.style.setProperty('--px',`${x*16}px`);parallaxZone.style.setProperty('--py',`${y*12}px`);},{passive:true});parallaxZone.addEventListener('pointerleave',()=>{parallaxZone.style.setProperty('--px','0px');parallaxZone.style.setProperty('--py','0px');},{passive:true});}
  $$('[data-parallax-zone] img').forEach(img=>{img.addEventListener('error',()=>{img.closest('[data-parallax-zone]')?.classList.add('media-fallback');},{once:true});});
  document.addEventListener('keydown',e=>{if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;if(/^\d$/.test(e.key)&&Number(e.key)>=1&&Number(e.key)<=7){e.preventDefault();setActive(Number(e.key)-1,true);}if(e.key==='ArrowRight'){e.preventDefault();setActive(active+1);}if(e.key==='ArrowLeft'){e.preventDefault();setActive(active-1);}});
  const soundBtn=$('#chain-sound');
  soundBtn?.addEventListener('click',async()=>{try{if(!audio){audio=new Audio('assets/superproduction-v41/cybershield-cadeia.mp3');audio.loop=true;audio.volume=.09;}if(!soundOn){await audio.play();soundOn=true;soundBtn.textContent='Som da sequência · ON';soundBtn.setAttribute('aria-pressed','true');}else{audio.pause();soundOn=false;soundBtn.textContent='Som da sequência · OFF';soundBtn.setAttribute('aria-pressed','false');}}catch{soundBtn.textContent='Som indisponível';}});
  renderDecisions(); renderBreakChain(); makeAtlas(); setActive(0,false);
})();
