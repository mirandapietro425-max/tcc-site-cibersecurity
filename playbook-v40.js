(() => {
  const root = document.querySelector('.immersive-page');
  if (!root) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const protocols = [
    {name:'GOVERNAR', code:'GV', copy:'Defina direção, responsabilidade e critérios antes da ação.', detail:'Políticas, papéis, prioridades e critérios tornam a segurança uma decisão organizacional — não uma reação isolada.'},
    {name:'IDENTIFICAR', code:'ID', copy:'Entenda ativos, contexto, exposição e onde o risco realmente mora.', detail:'Mapear ativos, dependências e exposição ajuda a decidir o que precisa ser protegido primeiro.'},
    {name:'PROTEGER', code:'PR', copy:'Aplique controles antes que o problema precise virar incidente.', detail:'Identidade, acesso, configuração segura, proteção de dados e treinamento reduzem a superfície de exposição.'},
    {name:'DETECTAR', code:'DE', copy:'Transforme sinais dispersos em percepção antes do impacto.', detail:'Monitoramento e análise ajudam a perceber anomalias e distinguir ruído de eventos que merecem investigação.'},
    {name:'RESPONDER', code:'RS', copy:'Quando algo acontece, preserve contexto e escolha o próximo passo.', detail:'Conter, investigar, comunicar e preservar evidências exige uma resposta definida antes da pressão do incidente.'},
    {name:'RECUPERAR', code:'RC', copy:'Restaure operação, aprenda e feche o ciclo sem repetir a falha.', detail:'Recuperação também produz aprendizado: rever impacto, restaurar serviços e atualizar controles fortalece o próximo ciclo.'}
  ];
  const nodes = [...root.querySelectorAll('.pb40-node')];
  const name = root.querySelector('[data-protocol-name]');
  const copy = root.querySelector('[data-protocol-copy]');
  function selectProtocol(index, focus=false){
    const p = protocols[index]; if(!p) return;
    nodes.forEach((n,i)=>n.classList.toggle('is-active',i===index));
    if(name) name.textContent=p.name;
    if(copy) copy.textContent=p.copy;
    if(focus) nodes[index]?.focus();
  }
  nodes.forEach((n,i)=>n.addEventListener('click',()=>selectProtocol(i)));
  selectProtocol(0);

  const packets = [...root.querySelectorAll('.pb40-packet')];
  const detail = root.querySelector('.pb40-packet-detail');
  const close = root.querySelector('.pb40-detail-close');
  const dtag = root.querySelector('[data-detail-tag]');
  const dtitle = root.querySelector('[data-detail-title]');
  const dbody = root.querySelector('[data-detail-body]');
  const droute = root.querySelector('[data-detail-route]');
  const intel = [
    ['PESSOAS','MFA + senhas únicas','Use fatores adicionais e credenciais exclusivas para reduzir o impacto de uma senha comprometida.','IDENTIDADE → ACESSO'],
    ['DADOS','Classifique e minimize','Defina necessidade, finalidade, acesso e retenção. Quanto menos dado desnecessário, menor a superfície de exposição.','DADOS → PROTEÇÃO'],
    ['CÓDIGO','Valide no servidor','Entradas, autenticação e autorização precisam ser tratadas também no servidor; o navegador não é uma fronteira de confiança.','CÓDIGO → CONTROLE'],
    ['SEGREDOS','Proteja .env e chaves','Tokens, senhas e chaves não devem ser incorporados ao repositório nem expostos em rotas de teste.','SEGREDOS → SUPERFÍCIE'],
    ['BUILD','Higienize o deploy','Reduza exposição de informações técnicas e revise artefatos, logs e configurações antes da publicação.','BUILD → PRODUÇÃO'],
    ['RESPOSTA','Tenha um caminho','Defina contenção, investigação, comunicação, recuperação e continuidade antes que um evento exija improviso.','RESPOSTA → RECUPERAÇÃO']
  ];
  function openPacket(index){
    const p=intel[index]; if(!p) return;
    packets.forEach((n,i)=>n.classList.toggle('is-selected',i===index));
    if(dtag) dtag.textContent=p[0];
    if(dtitle) dtitle.textContent=p[1];
    if(dbody) dbody.textContent=p[2];
    if(droute) droute.textContent=p[3];
    if(detail) detail.hidden=false;
  }
  packets.forEach((p,i)=>p.addEventListener('click',()=>openPacket(i)));
  close?.addEventListener('click',()=>{detail.hidden=true;packets.forEach(p=>p.classList.remove('is-selected'));});
  document.addEventListener('keydown',e=>{if(e.key==='Escape' && detail && !detail.hidden) close.click();});

  // Small pointer-depth effect; disabled for reduced motion and coarse pointers.
  if(!reduce && !matchMedia('(pointer: coarse)').matches){
    const art=root.querySelector('.pb40-command');
    art?.addEventListener('pointermove',e=>{
      const r=art.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      art.style.setProperty('--mx',`${x*8}px`); art.style.setProperty('--my',`${y*5}px`);
      const core=art.querySelector('.pb40-core'); if(core) core.style.transform=`translate(calc(-50% + ${x*4}px),calc(-50% + ${y*3}px))`;
    },{passive:true});
  }
})();
