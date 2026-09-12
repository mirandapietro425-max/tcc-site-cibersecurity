
(() => {
  const scenarios=[
    {channel:"E-MAIL",title:"Sua conta será bloqueada hoje",copy:"Uma mensagem pede ação imediata e aponta para um endereço que não corresponde ao domínio esperado.",link:"https://seguranca-exemplo.local/confirmar",good:"Verificar por um canal oficial antes de agir.",why:"Urgência + domínio fora do padrão são sinais clássicos de phishing."},
    {channel:"VOZ",title:"Precisamos confirmar seu cadastro",copy:"Uma pessoa liga dizendo representar um serviço conhecido e solicita um código recebido no telefone.",link:"CÓDIGO DE VERIFICAÇÃO",good:"Encerrar e retornar pelo telefone oficial do serviço.",why:"Códigos de autenticação não devem ser compartilhados com quem iniciou o contato."},
    {channel:"SMS",title:"Você ganhou um benefício",copy:"A mensagem usa um prêmio inesperado e um link curto para acelerar a decisão.",link:"https://premio-exemplo.local",good:"Ignorar o link e consultar o serviço pelo caminho conhecido.",why:"Mensagem curta + recompensa + link inesperado formam um padrão de risco."}
  ];
  let index=0, score=0;
  const $=s=>document.querySelector(s);
  function render(){
    const s=scenarios[index];
    $("#message-channel").textContent=s.channel;
    $("#message-title").textContent=s.title;
    $("#message-copy").textContent=s.copy;
    $("#message-link").textContent=s.link;
    $("#lab-progress").style.setProperty("--progress",((index+1)/scenarios.length*100)+"%");
    $("#scenario-counter")?.setAttribute("aria-label",(index+1)+" de "+scenarios.length);
    $(".decision-options").innerHTML=[
      ["is-safe","Parar e verificar"],
      ["is-risk","Agir imediatamente"],
      ["is-risk","Responder ao contato"]
    ].map(([cls,text])=>`<button class="button button-secondary ${cls}" type="button">${text}</button>`).join("");
    $$(".decision-options button").forEach((b,i)=>b.addEventListener("click",()=>{
      const safe=i===0; if(safe)score++;
      $("#feedback-title").textContent=safe?"Boa decisão":"Pare e verifique";
      $("#feedback-copy").textContent=safe?s.good:s.why+" "+s.good;
      $("#feedback-box").classList.add("is-visible");
      $("#lab-score").textContent=score+" / "+(index+1);
      $("#next-scenario").textContent=index===scenarios.length-1?"Refazer laboratório":"Próximo cenário";
    }));
  }
  const $all=s=>Array.from(document.querySelectorAll(s));
  window.$$=$all;
  $("#next-scenario")?.addEventListener("click",()=>{
    index=(index+1)%scenarios.length;
    if(index===0)score=0;
    $("#feedback-box").classList.remove("is-visible"); render();
  });
  render();
})();
