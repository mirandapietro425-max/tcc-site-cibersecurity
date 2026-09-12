(() => {
  const stages = [
    {id:'recon', index:'01', name:'Reconhecimento', short:'Coleta de informação', line:'observing_surface_01…', signal:'Muitas tentativas de login, varreduras incomuns ou pedidos de informação fora do padrão.', threat:'O invasor começa sem tocar no sistema. Ele observa pessoas, tecnologias expostas, fornecedores e o que o próprio alvo publica.', defenses:[['GV','Política sobre o que a organização publica e compartilha'],['ID','Inventário atualizado da superfície de ataque'],['PR','Treinamento para reduzir exposição desnecessária']], fn:'GV · ID · PR'},
    {id:'weapon', index:'02', name:'Armamento', short:'Preparo do ataque', line:'building_payload_02…', signal:'A etapa tende a ser invisível do lado do alvo; o primeiro indício aparece quando o artefato chega.', threat:'Com uma oportunidade identificada, o invasor prepara o conteúdo ou dependência que pretende usar contra o alvo.', defenses:[['ID','Gestão de vulnerabilidades e acompanhamento de CVEs'],['PR','Atualizações e patches em dia'],['PR','Verificação de integridade de dependências']], fn:'ID · PR'},
    {id:'delivery', index:'03', name:'Entrega', short:'O conteúdo chega ao alvo', line:'delivery_channel_03…', signal:'Urgência incomum, remetente inesperado ou link fora do padrão oficial.', threat:'O conteúdo chega por e-mail, mensagem, site falso ou outro canal de entrega. É quando o risco passa a disputar atenção com a rotina.', defenses:[['PR','Filtros e verificação de domínio'],['DE','Sandbox e análise de anexos'],['PR','Pausa de três segundos: verificar antes de agir']], fn:'PR · DE'},
    {id:'exploit', index:'04', name:'Exploração', short:'A falha é usada', line:'anomaly_detected_04…', signal:'Processos inesperados, falhas repetidas ou comportamento fora do padrão.', threat:'Uma vulnerabilidade é usada para executar uma ação que não deveria existir. A possibilidade vira comportamento concreto.', defenses:[['PR','Menor privilégio e segmentação'],['DE','Detecção de comportamento anômalo em endpoints'],['ID','Desenvolvimento seguro no ciclo de vida']], fn:'PR · DE · ID'},
    {id:'install', index:'05', name:'Instalação', short:'Persistência', line:'persistence_attempt_05…', signal:'Tarefas agendadas novas, serviços desconhecidos ou contas criadas fora do processo.', threat:'O acesso procura sobreviver. Persistência muda um evento pontual em presença prolongada.', defenses:[['DE','Monitoramento de integridade de arquivos e processos'],['PR','Autenticação multifator'],['RS','Plano para isolar rapidamente hosts comprometidos']], fn:'DE · PR · RS'},
    {id:'c2', index:'06', name:'Comando e controle', short:'Canal de saída', line:'outbound_channel_06…', signal:'Tráfego de saída incomum ou conexões para domínios recentes e de baixa reputação.', threat:'O sistema comprometido busca um canal externo para receber instruções. A partir daqui, o controle pode continuar sem nova ação da vítima.', defenses:[['DE','Monitoramento de saída e consultas DNS'],['PR','Política de rede com destinos permitidos'],['RS','Conter, revogar acessos e registrar']], fn:'DE · PR · RS'},
    {id:'objectives', index:'07', name:'Ações sobre os objetivos', short:'O objetivo é cumprido', line:'objective_reached_07…', signal:'O impacto já é visível: disponibilidade alterada, dados comprometidos ou operação interrompida.', threat:'O objetivo final aparece: exfiltração, indisponibilidade ou outro impacto. A partir daqui, a organização já está pagando o custo do atraso.', defenses:[['RC','Backup testado e comprovadamente restaurável'],['RS','Comunicação de incidente e obrigações previstas'],['GV','Revisão pós-incidente para fechar a lacuna']], fn:'RC · RS · GV'}
  ];

  const scene = document.getElementById('attack-scene');
  const panel = document.getElementById('attack-panel');
  const rail = document.getElementById('attack-rail-list');
  const deepGrid = document.getElementById('deep-grid');
  const decisionGrid = document.getElementById('decision-grid');
  const breakChain = document.getElementById('break-chain');
  const progressBar = document.getElementById('attack-progress-bar');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let active = 0;
  let mode = 'threat';

  if (!scene || !panel) return;

  const els = {
    railStatus: document.getElementById('rail-status'), sceneCounter: document.getElementById('scene-counter'), sceneName: document.getElementById('scene-name'), sceneSignal: document.getElementById('scene-signal'),
    terminal: document.getElementById('terminal-line'), sceneLabel: document.getElementById('scene-progress-label'), sceneFill: document.getElementById('scene-progress-fill'),
    panelType: document.getElementById('panel-type'), panelStage: document.getElementById('panel-stage'), panelTitle: document.getElementById('panel-title'), panelCopy: document.getElementById('panel-copy'),
    panelSignal: document.getElementById('panel-signal-text'), panelDefense: document.getElementById('panel-defense'), nextHint: document.getElementById('panel-next-hint'), nextName: document.getElementById('panel-next-name'), result: document.getElementById('decision-result'),
    resultLabel: document.getElementById('decision-result-label'), resultTitle: document.getElementById('decision-result-title'), resultCopy: document.getElementById('decision-result-copy')
  };

  function startViewTransition(fn) {
    if (document.startViewTransition && !reduce) document.startViewTransition(fn);
    else fn();
  }

  function animateScene() {
    if (reduce) return;
    scene.animate([
      {transform:'translate3d(0, 0, 0) scale(.985)', opacity:.72, filter:'blur(2px)'},
      {transform:'translate3d(0, -6px, 0) scale(1)', opacity:1, filter:'blur(0)'}
    ], {duration:680, easing:'cubic-bezier(.22,.8,.2,1)'});
    panel.animate([
      {opacity:.55, transform:'translateY(12px)'},
      {opacity:1, transform:'translateY(0)'}
    ], {duration:480, easing:'cubic-bezier(.22,.8,.2,1)'});
  }

  function renderRail() {
    rail.innerHTML = stages.map((s,i) => `<li><button type="button" data-index="${i}" class="rail-btn ${i===active?'is-active':''}" aria-current="${i===active?'step':'false'}"><span>${s.index}</span><b>${s.name}</b><small>${s.short}</small></button></li>`).join('');
    rail.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => setActive(Number(btn.dataset.index), true)));
  }

  function renderDeep() {
    deepGrid.innerHTML = stages.map((s,i) => `<article class="deep-card ${i===active?'is-active':''}" data-deep-index="${i}"><div class="deep-card-top"><span>${s.index}</span><em>${s.fn}</em></div><h3>${s.name}</h3><p>${s.short}</p><div class="deep-card-bar"><i style="--w:${((i+2)/stages.length)*100}%"></i></div></article>`).join('');
    deepGrid.querySelectorAll('.deep-card').forEach(card => card.addEventListener('click', () => setActive(Number(card.dataset.deepIndex), true)));
  }

  function renderDecisions() {
    decisionGrid.innerHTML = stages.map((s,i) => `<button type="button" class="decision-chip" data-decision="${i}"><span>${s.index}</span><b>${s.name}</b></button>`).join('');
    decisionGrid.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => decide(Number(btn.dataset.decision))));
  }

  function renderBreakChain(selected = null) {
    breakChain.innerHTML = stages.map((s,i) => `<div class="break-node ${i<=(selected??-1)?'is-passed':''} ${i===selected?'is-selected':''}"><span>${s.index}</span><small>${s.name}</small></div>${i<stages.length-1?'<i class="break-link"></i>':''}`).join('');
  }

  function setActive(index, move = false) {
    active = Math.max(0, Math.min(stages.length-1, index));
    mode = 'threat';
    const s = stages[active];
    const next = stages[Math.min(stages.length-1, active+1)];
    startViewTransition(() => {
      scene.dataset.stage = s.id;
      els.railStatus.textContent = active===stages.length-1 ? 'OBJETIVO VISÍVEL' : `ELO ${s.index} EM FOCO`;
      els.sceneCounter.textContent = s.index;
      els.sceneName.textContent = s.name.toUpperCase();
      els.sceneSignal.textContent = s.short.toUpperCase();
      els.terminal.textContent = s.line;
      els.sceneLabel.textContent = `${s.index} / ${String(stages.length).padStart(2,'0')}`;
      els.sceneFill.style.width = `${((active+1)/stages.length)*100}%`;
      els.panelType.textContent = 'SINAL';
      els.panelStage.textContent = `${s.index} / ${String(stages.length).padStart(2,'0')}`;
      els.panelTitle.textContent = s.name;
      els.panelCopy.textContent = s.threat;
      els.panelSignal.textContent = s.signal;
      els.panelNextName.textContent = active===stages.length-1 ? 'Encerrar a sequência →' : `${next.name} →`;
      els.nextHint.textContent = active===stages.length-1 ? 'Próxima jornada' : 'Próximo elo';
      els.panelDefense.hidden = true;
      els.panelDefense.innerHTML = '';
      panel.querySelectorAll('.panel-switch button').forEach((b,i)=>{const on=i===0;b.classList.toggle('is-active',on);b.setAttribute('aria-selected',String(on));});
      renderRail(); renderDeep(); animateScene();
    });
    if (move) scene.scrollIntoView({behavior:reduce?'auto':'smooth', block:'center'});
  }

  panel.querySelectorAll('.panel-switch button').forEach(btn => btn.addEventListener('click', () => {
    mode = btn.dataset.mode;
    const s = stages[active];
    panel.querySelectorAll('.panel-switch button').forEach(b=>{const on=b===btn;b.classList.toggle('is-active',on);b.setAttribute('aria-selected',String(on));});
    startViewTransition(() => {
      if (mode==='defense') {
        els.panelType.textContent = 'MEDIAÇÃO';
        els.panelDefense.hidden = false;
        els.panelDefense.innerHTML = `<p>O ponto de interrupção mais útil aqui é uma combinação de:</p><ul>${s.defenses.map(([fn,text])=>`<li><span>${fn}</span><b>${text}</b></li>`).join('')}</ul>`;
      } else {
        els.panelType.textContent = 'SINAL';
        els.panelDefense.hidden = true;
        els.panelDefense.innerHTML = '';
      }
    });
  }));

  document.getElementById('prev-stage')?.addEventListener('click', () => setActive(active-1, false));
  document.getElementById('next-stage')?.addEventListener('click', () => setActive(active+1, false));
  document.addEventListener('keydown', e => {
    if (['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)) return;
    if (e.key==='ArrowRight') setActive(active+1, false);
    if (e.key==='ArrowLeft') setActive(active-1, false);
    if (/^[1-7]$/.test(e.key)) setActive(Number(e.key)-1, true);
  });

  function decide(index) {
    const stage = stages[index];
    const late = stages.length-1-index;
    const efficacy = Math.max(18, 100 - late*12);
    decisionGrid.querySelectorAll('button').forEach((b,i)=>b.classList.toggle('is-selected',i===index));
    renderBreakChain(index);
    els.result.dataset.state = index <= 2 ? 'early' : index <= 4 ? 'mid' : 'late';
    els.resultLabel.textContent = index <= 2 ? 'INTERRUPÇÃO ANTECIPADA' : index <= 4 ? 'CONTENÇÃO TARDIA' : 'RESPOSTA NO IMPACTO';
    els.resultTitle.textContent = index <= 2 ? `Você colocou fricção em ${stage.name}.` : index <= 4 ? `Você conteve a sequência em ${stage.name}.` : `Você chegou ao impacto em ${stage.name}.`;
    els.resultCopy.textContent = `Índice educativo de interrupção: ${efficacy}%. Quanto mais cedo a organização consegue agir, mais opções permanecem abertas para conter, responder e recuperar.`;
  }

  const stageSections = document.querySelectorAll('[data-stage-section]');
  if (stageSections.length) {
    const io = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) setActive(Number(entry.target.dataset.stageSection), false); }), {rootMargin:'-38% 0px -38% 0px', threshold:0.01});
    stageSections.forEach(el=>io.observe(el));
  }

  const theaterObserver = new IntersectionObserver(entries => entries.forEach(entry => scene.classList.toggle('is-in-view', entry.isIntersecting)), {threshold:.15});
  theaterObserver.observe(document.getElementById('theater'));

  const progressObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    const ratio = Math.max(0, Math.min(1, entry.intersectionRatio));
    if (progressBar) progressBar.style.transform = `scaleX(${ratio})`;
  }), {threshold:[0,.25,.5,.75,1]});
  progressObserver.observe(document.querySelector('main'));

  const parallaxZone = document.querySelector('[data-parallax-zone]');
  if (parallaxZone && !reduce) {
    parallaxZone.addEventListener('pointermove', e => {
      const r = parallaxZone.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      parallaxZone.style.setProperty('--px', `${x*18}px`);
      parallaxZone.style.setProperty('--py', `${y*14}px`);
    }, {passive:true});
    parallaxZone.addEventListener('pointerleave', () => {parallaxZone.style.setProperty('--px','0px');parallaxZone.style.setProperty('--py','0px');},{passive:true});
  }

  document.querySelectorAll('.signal-card').forEach(card => card.addEventListener('mouseenter', () => {
    if (reduce) return;
    card.animate([{transform:'translateY(0)'},{transform:'translateY(-5px)'},{transform:'translateY(0)'}],{duration:420,easing:'ease-out'});
  }));

  renderDecisions();
  renderBreakChain();
  setActive(0, false);
})();
