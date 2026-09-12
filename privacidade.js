
(() => {
  const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
  const data={
    public:{title:"Público",copy:"Pode ser divulgado sem criar impacto relevante à privacidade. Mesmo assim, a origem e a finalidade devem ser claras.",controls:["Rotulagem","Origem conhecida","Revisão periódica"]},
    internal:{title:"Interno",copy:"É útil para a organização, mas seu acesso deve ser restrito a pessoas e processos que realmente precisam dele.",controls:["Acesso por função","Logs","Compartilhamento controlado"]},
    confidential:{title:"Confidencial",copy:"Exige controles reforçados porque sua exposição pode gerar impactos pessoais, financeiros ou operacionais.",controls:["MFA","Criptografia","Menor privilégio"]}
    ,sensitive:{title:"Pessoal sensível",copy:"Dados pessoais sensíveis exigem atenção reforçada e controles proporcionais ao impacto de uma exposição.",controls:["Finalidade clara","Acesso mínimo","Proteção reforçada"]}
  };
  $$(".classification-card").forEach(card=>card.addEventListener("click",()=>{
    const d=data[card.dataset.classification]||data.internal;
    $$("#classification-detail,#classification-title,#classification-copy").forEach(()=>{});
    $("#classification-title").textContent=d.title;
    $("#classification-copy").textContent=d.copy;
    $("#classification-controls").innerHTML=d.controls.map(x=>`<span>${x}</span>`).join("");
    $$(".classification-card").forEach(c=>c.classList.remove("is-active"));card.classList.add("is-active");
  }));
  function byod(){
    const b=$("#byod-checklist"), items=b?Array.from(b.querySelectorAll("input[type=checkbox]")):[],done=items.filter(x=>x.checked).length;
    $("#byod-count").textContent=done+" / "+items.length+" verificados";
    $("#byod-bar").style.width=(items.length?done/items.length*100:0)+"%";
    localStorage.setItem("cybershield-byod",JSON.stringify(items.map(x=>x.checked)));
  }
  try{const a=JSON.parse(localStorage.getItem("cybershield-byod")||"[]");Array.from(document.querySelectorAll("#byod-checklist input")).forEach((x,i)=>x.checked=!!a[i])}catch{}
  $("#byod-checklist")?.addEventListener("change",byod);byod();
})();
