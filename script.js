
(function(){
  "use strict";
  document.documentElement.classList.add("js");
  const $=(s,c=document)=>c.querySelector(s);
  const $$=(s,c=document)=>Array.from(c.querySelectorAll(s));

  const progress=$("#scroll-progress");
  function updateScroll(){
    if(!progress)return;
    const h=document.documentElement.scrollHeight-innerHeight;
    progress.style.width=(h>0?(scrollY/h)*100:0)+"%";
  }
  addEventListener("scroll",updateScroll,{passive:true}); updateScroll();

  const menu=$("#menu-toggle"), nav=$("#nav-links");
  if(menu&&nav){
    menu.addEventListener("click",()=>{
      const open=nav.classList.toggle("is-open");
      menu.setAttribute("aria-expanded",String(open));
    });
    $$("#nav-links a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("is-open")));
  }

  if ("IntersectionObserver" in window) {
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{
      if(e.isIntersecting){e.target.classList.add("is-visible");io.unobserve(e.target)}
    }),{threshold:.05, rootMargin:"0px 0px -4% 0px"});
    $$(".reveal").forEach(x=>io.observe(x));
  } else {
    $$(".reveal").forEach(x=>x.classList.add("is-visible"));
  }

  const pillarData={
    confidencialidade:{question:"Quem pode ver?",desc:"A informação deve ser acessível apenas a quem tem autorização. No TCC, isso se conecta a controle de acesso, classificação da informação, menor privilégio e proteção de credenciais.",tools:["MFA","Menor privilégio","Classificação"]},
    integridade:{question:"O dado mudou?",desc:"Integridade significa preservar o conteúdo contra alteração indevida ou acidental. Validação no servidor, revisão de código, hashing e logs ajudam a detectar ou impedir mudanças não autorizadas.",tools:["Validação","Hashing","Logs"]},
    disponibilidade:{question:"Está acessível?",desc:"Disponibilidade exige que serviços e dados estejam utilizáveis quando necessários. Backups testados, recuperação de desastres, continuidade e monitoramento reduzem o impacto das interrupções.",tools:["Backups","Recuperação","Continuidade"]}
  };
  const renderPillar=(id)=>{
    const d=pillarData[id]; if(!d)return;
    const q=$("#pillar-question"),desc=$("#pillar-description"),tools=$("#pillar-tools");
    if(q)q.textContent=d.question; if(desc)desc.textContent=d.desc;
    if(tools)tools.innerHTML=d.tools.map(x=>"<span>"+x+"</span>").join("");
    const title=$("#pillar-title"); if(title)title.textContent=id[0].toUpperCase()+id.slice(1);
    const n=$("#pillar-number"); if(n)n.textContent=id==="confidencialidade"?"01":id==="integridade"?"02":"03";
  };
  $$(".pillar-tab").forEach(btn=>btn.addEventListener("click",()=>{
    $$(".pillar-tab").forEach(b=>{b.classList.remove("is-active");b.setAttribute("aria-selected","false")});
    btn.classList.add("is-active");btn.setAttribute("aria-selected","true");renderPillar(btn.dataset.pillar);
  }));

  const threatData={
    ransomware:{title:"Ransomware",copy:"Criptografa arquivos e pode interromper a operação. O TCC destaca backups periódicos, atualizações, privilégio mínimo, resposta a incidentes e recuperação.",items:["Backup testado e restaurável","Atualizações e segmentação","Plano de resposta e recuperação"]},
    trojan:{title:"Trojan",copy:"Disfarça-se de software legítimo para executar uma atividade secundária sem conhecimento do usuário. A defesa depende de origem confiável, atualização e controle de execução.",items:["Verifique origem de downloads","Mantenha aplicações atualizadas","Reduza privilégios de execução"]},
    worm:{title:"Worm",copy:"Pode se propagar automaticamente pela rede explorando vulnerabilidades. Inventário, correção de falhas e segmentação diminuem a superfície de propagação.",items:["Patches de segurança","Segmentação de rede","Monitoramento de comportamento"]},
    phishing:{title:"Phishing",copy:"Usa e-mail, links e urgência para capturar credenciais ou instalar código malicioso. A melhor primeira resposta é pausar, verificar domínio e contexto.",items:["Verifique o domínio","Confirme por outro canal","Não clique por impulso"]},
    vishing:{title:"Vishing",copy:"Manipula a vítima por telefone com autoridade e pressão. A resposta segura é interromper a pressão e usar um canal oficial independente.",items:["Não valide dados na própria chamada","Retorne por canal oficial","Registre e reporte a tentativa"]},
    smishing:{title:"Smishing",copy:"Leva o golpe para SMS ou mensagens curtas com links alarmistas. A defesa é verificar o remetente e acessar o serviço por aplicativo ou site oficial.",items:["Ignore links inesperados","Abra o serviço por caminho conhecido","Reporte a mensagem"]}
  };
  $$(".threat-card").forEach(btn=>btn.addEventListener("click",()=>{
    $$(".threat-card").forEach(b=>b.classList.remove("is-selected"));btn.classList.add("is-selected");
    const d=threatData[btn.dataset.threat]; if(!d)return;
    $("#threat-detail-title").textContent=d.title;
    $("#threat-detail-description").textContent=d.copy;
    $("#threat-detail-list").innerHTML=d.items.map(x=>"<li>"+x+"</li>").join("");
  }));

  const scenarios={
    phishing:{phase:"FASE 01 / IDENTIFICAR",title:"Não clique. Preserve o contexto.",desc:"Uma mensagem pede urgência e direciona para um link. A defesa começa antes de qualquer abertura: observar canal, domínio e pedido.",actions:["Verificar domínio por outro caminho","Abrir o link para conferir","Responder pedindo urgência"]},
    ransomware:{phase:"FASE 02 / CONTER",title:"Isole o dano sem apagar evidências.",desc:"Arquivos ficaram inacessíveis. O objetivo imediato é conter propagação, preservar contexto e acionar o processo definido pela organização.",actions:["Isolar o equipamento","Apagar os arquivos comprometidos","Desligar todos os sistemas sem registrar"]},
    vazamento:{phase:"FASE 03 / RECUPERAR",title:"Proteja o titular e organize a resposta.",desc:"Um dado foi exposto. A resposta precisa reduzir a exposição, registrar o incidente e seguir o fluxo de comunicação e conformidade aplicável.",actions:["Registrar o ocorrido e limitar exposição","Ignorar se o sistema continua funcionando","Publicar detalhes internos do incidente"]}
  };
  let scenarioIndex=0;
  const scenarioKeys=["phishing","ransomware","vazamento"];
  function renderScenario(key){
    const d=scenarios[key]; if(!d)return;
    $("#scenario-phase").textContent=d.phase;$("#scenario-title").textContent=d.title;$("#scenario-description").textContent=d.desc;
    $("#scenario-actions").innerHTML=d.actions.map((x,i)=>'<button class="scenario-action" type="button" data-choice="'+i+'">'+x+"</button>").join("");
    $$(".scenario-action").forEach(b=>b.addEventListener("click",()=> {
      const good=(key==="phishing"&&b.dataset.choice==="0")||(key==="ransomware"&&b.dataset.choice==="0")||(key==="vazamento"&&b.dataset.choice==="0");
      b.style.borderColor=good?"rgba(140,255,181,.5)":"rgba(255,112,128,.45)";
      b.style.color=good?"var(--green)":"var(--red)";
    }));
  }
  $$(".scenario-tab").forEach((btn,i)=>btn.addEventListener("click",()=>{
    $$(".scenario-tab").forEach(b=>{b.classList.remove("is-active");b.setAttribute("aria-selected","false")});
    btn.classList.add("is-active");btn.setAttribute("aria-selected","true");scenarioIndex=i;renderScenario(scenarioKeys[i]);
    const c=$("#scenario-counter");if(c)c.textContent=(i+1)+" / 3";
  }));
  if($("#scenario-actions"))renderScenario("phishing");
  $("#scenario-next")?.addEventListener("click",()=>{scenarioIndex=(scenarioIndex+1)%3;$$(".scenario-tab")[scenarioIndex]?.click()});

  // Development tabs + checklist
  const devData=[
    ["01 / ARQUITETAR","Comece pela superfície de ataque.","Identifique dados sensíveis, rotas críticas, permissões e o que realmente precisa existir no sistema."],
    ["02 / REVISAR","Valide antes do deploy.","Use revisão de código, SAST, validação no servidor, proteção de secrets e testes de segurança."],
    ["03 / PUBLICAR","Higienize o build.","Evite console.log sensível, não publique Source Maps desnecessariamente e monitore a aplicação em produção."]
  ];
  $$(".dev-tab").forEach((b,i)=>b.addEventListener("click",()=>{
    $$(".dev-tab").forEach(x=>x.classList.remove("is-active"));b.classList.add("is-active");
    const d=devData[i];$("#dev-stage").textContent=d[0];$("#dev-title").textContent=d[1];$("#dev-description").textContent=d[2];
  }));
  function updateChecklist(){
    const boxes=$$("#checklist input[type=checkbox]"), done=boxes.filter(x=>x.checked).length,total=boxes.length;
    const bar=$("#checklist-bar"); if(bar)bar.style.width=(total?done/total*100:0)+"%";
    const count=$("#checklist-count"); if(count)count.textContent=done+" / "+total+" concluídos";
    localStorage.setItem("cybershield-checklist",JSON.stringify(boxes.map(x=>x.checked)));
  }
  try{
    const saved=JSON.parse(localStorage.getItem("cybershield-checklist")||"[]");
    $$("#checklist input[type=checkbox]").forEach((x,i)=>x.checked=!!saved[i]);
  }catch{}
  $$("#checklist input[type=checkbox]").forEach(x=>x.addEventListener("change",updateChecklist)); updateChecklist();

  // Diagnostic: local only
  const diag=$("#diagnostic-form"), result=$("#diagnostic-result");
  function updateDiag(){
    if(!diag||!result)return;
    const checks=$$('input[type=radio]:checked',diag);
    let score=0; checks.forEach(c=>score+=Number(c.dataset.score||0));
    const max=checks.length*2, pct=max?Math.round(score/max*100):0;
    $("#result-title").textContent=pct>=80?"Boa base de proteção":pct>=50?"Há pontos para reforçar":"Comece pelos fundamentos";
    $("#result-copy").textContent=pct>=80?"Priorize monitoramento, resposta a incidentes e revisão contínua.":pct>=50?"Reforce MFA, backups testados, higiene de links e proteção de secrets.":"Comece por senhas únicas, MFA, backups, atualização e validação antes de clicar.";
    $("#diagnostic-result").dataset.score=pct;
  }
  diag?.addEventListener("change",updateDiag); updateDiag();
  $("#diagnostic-reset")?.addEventListener("click",()=>{diag?.reset();updateDiag()});

  const pwd=$("#password-input");
  const toggle=$("#password-toggle");
  function assessPassword(){
    if(!pwd)return;
    const v=pwd.value; const rules=[
      [v.length>=12,"12+ caracteres"],[/[A-Za-z]/.test(v)&&/\d/.test(v),"mistura de letras e números"],[!(/^(.)\1+$/.test(v)||/12345|qwerty|senha/i.test(v)),"não é uma sequência óbvia"],[!/\s/.test(v),"sem espaços triviais"]
    ];
    $$(".password-rules span").forEach((el,i)=>el.classList.toggle("is-ok",!!rules[i]?.[0]));
    const score=Math.round(rules.reduce((a,r)=>a+(r[0]?1:0),0)/rules.length*100);
    const bar=$(".strength-score"); if(bar)bar.style.setProperty("--score",score+"%");
    const label=$("#strength-label"); if(label)label.textContent=score>=75?"forte":score>=50?"moderada":v?"fraca":"aguardando entrada";
  }
  pwd?.addEventListener("input",assessPassword); assessPassword();
  toggle?.addEventListener("click",()=>{if(!pwd)return;pwd.type=pwd.type==="password"?"text":"password";toggle.textContent=pwd.type==="password"?"Mostrar":"Ocultar"});

})();
