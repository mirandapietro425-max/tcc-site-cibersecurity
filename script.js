const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

// Header, progress and mobile navigation
const navLinks = $("#nav-links");
const menuToggle = $("#menu-toggle");
menuToggle?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
$$(".nav-links a").forEach((link) => link.addEventListener("click", () => {
  navLinks.classList.remove("is-open");
  menuToggle?.setAttribute("aria-expanded", "false");
}));
window.addEventListener("scroll", () => {
  const height = document.documentElement.scrollHeight - window.innerHeight;
  $("#scroll-progress").style.width = `${height > 0 ? (window.scrollY / height) * 100 : 0}%`;
}, { passive: true });

// Reveal content as it enters the viewport.
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .08, rootMargin: "0px 0px -35px" });
$$(".reveal").forEach((element) => revealObserver.observe(element));

// CIA pillar explorer
const pillars = {
  confidencialidade: {
    number: "01", title: "Confidencialidade",
    description: "A informação deve ser acessível apenas às pessoas autorizadas. É aqui que entram autenticação forte, criptografia e controle de acesso.",
    tools: ["criptografia", "MFA", "ACL"], question: "Quem pode ver este dado?"
  },
  integridade: {
    number: "02", title: "Integridade",
    description: "Os dados precisam permanecer corretos e confiáveis, sem alterações indevidas. Hashes, assinaturas e logs ajudam a provar o que aconteceu.",
    tools: ["hash", "assinatura", "auditoria"], question: "Este dado mudou sem autorização?"
  },
  disponibilidade: {
    number: "03", title: "Disponibilidade",
    description: "Sistemas e dados devem estar acessíveis quando usuários legítimos precisarem. Redundância, backups e resposta a DDoS sustentam a operação.",
    tools: ["backup", "redundância", "anti-DDoS"], question: "O serviço responde quando necessário?"
  }
};
$$(".pillar-tab").forEach((tab) => tab.addEventListener("click", () => {
  const content = pillars[tab.dataset.pillar];
  $$(".pillar-tab").forEach((item) => {
    const active = item === tab;
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-selected", String(active));
  });
  $("#pillar-number").textContent = content.number;
  $("#pillar-title").textContent = content.title;
  $("#pillar-description").textContent = content.description;
  $("#pillar-tools").innerHTML = content.tools.map((tool) => `<span>${tool}</span>`).join("");
  $("#pillar-question").textContent = content.question;
}));

// Threat explorer
const threatContent = {
  ransomware: ["Ransomware", "A melhor resposta começa antes do incidente: mantenha backups testados, sistemas atualizados e privilégios limitados.", ["Backup offline ou imutável", "Atualizações e segmentação", "Plano de resposta a incidentes"]],
  trojan: ["Trojan", "O disfarce é a defesa do trojan. Instale software de fontes confiáveis e verifique permissões e comportamento inesperado.", ["Downloads de fontes confiáveis", "Antivírus e atualizações", "Menor privilégio no sistema"]],
  worm: ["Worm", "Como se propaga sozinho pela rede, o worm encontra força em vulnerabilidades não corrigidas e ambientes pouco segmentados.", ["Atualizações de segurança", "Segmentação de rede", "Monitoramento de tráfego"]],
  phishing: ["Phishing", "Não responda à urgência com um clique. Confira o domínio, abra o serviço pelo canal oficial e denuncie a mensagem suspeita.", ["Verifique o domínio", "Não abra anexos inesperados", "Confirme por outro canal"]],
  vishing: ["Vishing", "Uma voz convincente não prova identidade. Desligue, procure o número oficial e nunca entregue códigos ou senhas por telefone.", ["Nunca compartilhe códigos", "Desligue e ligue de volta", "Desconfie de pressão"]],
  smishing: ["Smishing", "Mensagens curtas usam urgência para esconder o contexto. Não toque no link: abra o aplicativo ou site por conta própria.", ["Não toque no link", "Abra o app oficial", "Bloqueie e denuncie"]]
};
$$(".threat-card").forEach((card) => card.addEventListener("click", () => {
  $$(".threat-card").forEach((item) => item.classList.remove("is-selected"));
  card.classList.add("is-selected");
  const content = threatContent[card.dataset.threat];
  $("#threat-detail-title").textContent = content[0];
  $("#threat-detail-description").textContent = content[1];
  $("#threat-detail-list").innerHTML = content[2].map((item) => `<li>${item}</li>`).join("");
}));
$$(".filter-button").forEach((button) => button.addEventListener("click", () => {
  $$(".filter-button").forEach((item) => item.classList.toggle("is-active", item === button));
  const filter = button.dataset.filter;
  $$(".threat-card").forEach((card) => {
    card.hidden = filter !== "all" && card.dataset.type !== filter;
  });
}));

// Secure development stages
const devStages = {
  architect: ["ARCHITECT", "Comece pela superfície de ataque.", "Antes de escrever, identifique dados sensíveis, rotas críticas, permissões e o que realmente precisa existir no sistema."],
  review: ["REVIEW", "Confie, mas valide cada dependência.", "Revisão humana, SAST, validação no servidor e mensagens de erro controladas encontram problemas antes que eles cheguem à produção."],
  deploy: ["DEPLOY", "Produção não é lugar para segredos.", "Remova dados de debug, proteja variáveis de ambiente, evite publicar source maps e monitore o comportamento depois do lançamento."]
};
$$(".dev-tab").forEach((tab) => tab.addEventListener("click", () => {
  $$(".dev-tab").forEach((item) => item.classList.toggle("is-active", item === tab));
  const stage = devStages[tab.dataset.devTab];
  $("#dev-stage").textContent = stage[0];
  $("#dev-title").textContent = stage[1];
  $("#dev-description").textContent = stage[2];
}));

// Checklist persists only in this browser, so a learner can return to it.
const checks = $$("[data-check]");
const updateChecklist = () => {
  const done = checks.filter((check) => check.checked).length;
  $("#checklist-count").textContent = `${done} / ${checks.length}`;
  $("#checklist-bar").style.width = `${(done / checks.length) * 100}%`;
  try { localStorage.setItem("cybershield-checklist", JSON.stringify(checks.map((check) => check.checked))); } catch {}
};
try {
  const saved = JSON.parse(localStorage.getItem("cybershield-checklist") || "[]");
  checks.forEach((check, index) => { check.checked = Boolean(saved[index]); });
} catch {}
checks.forEach((check) => check.addEventListener("change", updateChecklist));
updateChecklist();

// Local password strength demonstration.
const passwordInput = $("#password-input");
const strengthMeter = $(".strength-meter");
const passwordRules = {
  length: (value) => value.length >= 12,
  variety: (value) => [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((pattern) => pattern.test(value)).length >= 3,
  unique: (value) => !/(.)\1\1|1234|qwer|senha|password/i.test(value)
};
const evaluatePassword = () => {
  const value = passwordInput.value;
  const validRules = Object.entries(passwordRules).filter(([, rule]) => rule(value));
  let score = Math.min(4, validRules.length + (value.length >= 16 ? 1 : 0));
  if (!value) score = 0;
  strengthMeter.dataset.level = score;
  $("#strength-score").textContent = `${score} / 4`;
  $("#strength-label").textContent = ["aguardando entrada", "fraca", "em evolução", "boa", "forte"][score];
  Object.keys(passwordRules).forEach((rule) => $(`[data-rule="${rule}"]`).classList.toggle("is-valid", Boolean(value) && passwordRules[rule](value)));
};
passwordInput?.addEventListener("input", evaluatePassword);
$("#password-toggle")?.addEventListener("click", () => {
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
});

// A short self-assessment that gives direction, not a security certification.
const diagnosticForm = $("#diagnostic-form");
diagnosticForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const score = [...new FormData(diagnosticForm).values()].reduce((total, value) => total + Number(value), 0);
  const result = score >= 5
    ? ["Comece pelo essencial.", "Ative MFA, troque senhas reutilizadas, teste um backup e aprenda a verificar links antes do próximo acesso."]
    : score >= 2
      ? ["Você está no caminho.", "Escolha uma ação esta semana: gerenciador de senhas, backup testado ou revisão dos secrets do seu projeto."]
      : ["Boa base.", "Mantenha a rotina: atualizações, revisão de permissões, cuidado com urgência e um plano simples para responder a incidentes."];
  $("#result-title").textContent = result[0];
  $("#result-copy").textContent = result[1];
  diagnosticForm.hidden = true;
  $("#diagnostic-result").hidden = false;
});
$("#diagnostic-reset")?.addEventListener("click", () => {
  diagnosticForm.reset();
  diagnosticForm.hidden = false;
  $("#diagnostic-result").hidden = true;
});