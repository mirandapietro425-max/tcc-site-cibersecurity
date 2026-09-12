/* cadeia-ataque.js
   Experiência "Cadeia de Ataque" do CyberShield.

   Escrito em React puro (React.createElement, sem JSX e sem etapa de build)
   para poder rodar como arquivo estático, igual ao restante do projeto.
   React e ReactDOM são carregados localmente a partir de vendor/ — não há
   chamada a CDN nem a qualquer serviço externo. Nada aqui coleta dados,
   envia telemetria ou representa um ataque real: os cenários são fictícios
   e servem só para estudo, inspirados no Cyber Kill Chain (Lockheed Martin)
   e nas seis funções do NIST Cybersecurity Framework 2.0. */

const h = React.createElement;

// Sete elos do Cyber Kill Chain, com uma leitura do ataque, um sinal
// observável educativo e mediações de proteção mapeadas às funções do
// NIST CSF 2.0 (GV = Governança, ID = Identificar, PR = Proteger,
// DE = Detectar, RS = Responder, RC = Recuperar).
const STAGES = [
  {
    id: "recon",
    index: "01",
    name: "Reconhecimento",
    short: "Coleta de informação",
    attacker:
      "O invasor estuda o alvo antes de tocar em qualquer sistema: perfis públicos, tecnologias expostas, e-mails vazados e fornecedores conectados. É a etapa mais barata e mais difícil de perceber.",
    signal: "Muitas tentativas de login, varreduras incomuns ou pedidos de informação fora do padrão.",
    mediations: [
      { fn: "GV", text: "Política sobre o que a organização publica sobre si mesma" },
      { fn: "ID", text: "Inventário atualizado de ativos e da superfície de ataque" },
      { fn: "PR", text: "Treinamento para reduzir dados sensíveis em canais públicos" }
    ]
  },
  {
    id: "weapon",
    index: "02",
    name: "Armamento",
    short: "Preparo do ataque",
    attacker:
      "Com a falha encontrada, o invasor prepara um arquivo, link ou dependência capaz de explorá-la. Essa etapa costuma ser invisível para a futura vítima — ela só aparece na entrega.",
    signal: "Normalmente não observável do lado de quem será atacado; aparece de forma indireta depois.",
    mediations: [
      { fn: "ID", text: "Gestão de vulnerabilidades e acompanhamento de CVEs conhecidas" },
      { fn: "PR", text: "Atualizações e patches de segurança em dia" },
      { fn: "PR", text: "Verificação de integridade de dependências de terceiros" }
    ]
  },
  {
    id: "delivery",
    index: "03",
    name: "Entrega",
    short: "O conteúdo chega ao alvo",
    attacker:
      "O conteúdo preparado chega até a vítima por e-mail, mensagem, site falso ou uma dependência comprometida. É o mesmo tipo de sinal treinado no Laboratório de decisões.",
    signal: "Urgência incomum, remetente inesperado ou link fora do padrão de comunicação oficial.",
    mediations: [
      { fn: "PR", text: "Filtro de e-mail e verificação de domínio" },
      { fn: "DE", text: "Sandbox e análise automatizada de anexos" },
      { fn: "PR", text: "Protocolo de três segundos: pausar, verificar, agir" }
    ]
  },
  {
    id: "exploit",
    index: "04",
    name: "Exploração",
    short: "A falha é usada",
    attacker:
      "A vulnerabilidade é usada para executar código ou obter um acesso que não deveria existir. É o momento em que a teoria da etapa anterior vira uma ação concreta no sistema.",
    signal: "Processos inesperados, falhas repetidas de aplicação ou comportamento fora do padrão.",
    mediations: [
      { fn: "PR", text: "Menor privilégio e segmentação de rede" },
      { fn: "DE", text: "Detecção de comportamento anômalo em endpoints" },
      { fn: "ID", text: "Checklist de desenvolvimento seguro no ciclo de vida do software" }
    ]
  },
  {
    id: "install",
    index: "05",
    name: "Instalação",
    short: "Persistência",
    attacker:
      "O invasor garante persistência: um acesso que sobrevive a reinícios, atualizações simples e trocas isoladas de senha. É aqui que um incidente pontual pode virar uma presença de longo prazo.",
    signal: "Tarefas agendadas novas, serviços desconhecidos ou contas criadas fora do processo padrão.",
    mediations: [
      { fn: "DE", text: "Monitoramento de integridade de arquivos e processos" },
      { fn: "PR", text: "Autenticação multifator, reduzindo o valor de uma credencial isolada" },
      { fn: "RS", text: "Plano de resposta pronto para isolar hosts comprometidos" }
    ]
  },
  {
    id: "c2",
    index: "06",
    name: "Comando e controle",
    short: "Canal de saída",
    attacker:
      "O sistema comprometido abre um canal de saída para receber instruções do invasor à distância. A partir daqui, o controle deixa de depender de uma ação nova da vítima.",
    signal: "Tráfego de saída incomum ou conexões para domínios recentes e de baixa reputação.",
    mediations: [
      { fn: "DE", text: "Monitoramento de tráfego de saída e de consultas DNS" },
      { fn: "PR", text: "Política de rede com lista de destinos permitidos" },
      { fn: "RS", text: "Plano de contenção: isolar, revogar acessos e registrar" }
    ]
  },
  {
    id: "objectives",
    index: "07",
    name: "Ações sobre os objetivos",
    short: "O objetivo é cumprido",
    attacker:
      "O invasor cumpre a meta final: exfiltra dados, criptografa arquivos para extorsão ou interrompe um serviço. A partir deste ponto, o impacto já é visível para a organização.",
    signal: "Nesta altura o impacto já apareceu — por isso os elos anteriores valem tanto.",
    mediations: [
      { fn: "RC", text: "Backup testado e comprovadamente restaurável" },
      { fn: "RS", text: "Comunicação de incidente e obrigações previstas na LGPD" },
      { fn: "GV", text: "Revisão pós-incidente para fechar o elo que falhou" }
    ]
  }
];

// ---------- Hero: corrente animada usada como arte de fundo ----------

const ChainHero = () => {
  const [weak, setWeak] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      setWeak((w) => (w + 1) % STAGES.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  const row = [];
  STAGES.forEach((s, i) => {
    row.push(
      h(
        "div",
        {
          key: s.id,
          className: "chain-hero-link" + (i === weak ? " is-current" : ""),
          title: s.name
        },
        s.index
      )
    );
    if (i < STAGES.length - 1) {
      row.push(
        h("div", {
          key: "c-" + s.id,
          className: "chain-hero-connector" + (i === weak ? " is-broken" : "")
        })
      );
    }
  });

  return h(
    "div",
    { className: "chain-hero" },
    h("div", { className: "chain-hero-row" }, row),
    h(
      "p",
      { className: "chain-hero-label" },
      "ELO EM FOCO: ",
      h("b", null, STAGES[weak].index + " · " + STAGES[weak].name)
    )
  );
};

// ---------- Explorador: escolher um elo e alternar Atacante / Defesa ----------

const ChainExplorer = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [tab, setTab] = React.useState("attacker");
  const stage = STAGES[activeIndex];

  const rail = STAGES.map((s, i) =>
    h(
      "button",
      {
        key: s.id,
        type: "button",
        role: "tab",
        "aria-selected": i === activeIndex,
        className: "chain-stage-btn" + (i === activeIndex ? " is-active" : ""),
        onClick: () => setActiveIndex(i)
      },
      h("span", { className: "chain-stage-index" }, s.index),
      h("span", null, h("b", null, s.name), h("small", null, s.short))
    )
  );

  const detailBody =
    tab === "attacker"
      ? h(
          React.Fragment,
          null,
          h("h3", null, stage.name),
          h("p", null, stage.attacker),
          h(
            "div",
            { className: "chain-signal" },
            h("b", null, "SINAL OBSERVÁVEL"),
            stage.signal
          )
        )
      : h(
          React.Fragment,
          null,
          h("h3", null, "Mediações de proteção"),
          h(
            "p",
            null,
            "Controles que, aplicados neste elo, reduzem a chance de o ataque avançar para a etapa seguinte."
          ),
          h(
            "ul",
            { className: "chain-mediation-list" },
            stage.mediations.map((m, i) =>
              h(
                "li",
                { key: i },
                h("span", { className: "chain-fn-tag" }, m.fn),
                h("span", null, m.text)
              )
            )
          )
        );

  return h(
    "div",
    { className: "chain-layout" },
    h(
      "div",
      { className: "chain-stage-rail", role: "tablist", "aria-label": "Elos da cadeia de ataque" },
      rail
    ),
    h(
      "article",
      { className: "chain-detail", "aria-live": "polite" },
      h(
        "div",
        { className: "chain-detail-top" },
        h("span", null, stage.index + " / " + stage.name.toUpperCase()),
        h(
          "div",
          { className: "chain-tabs" },
          h(
            "button",
            {
              type: "button",
              "data-tab": "attacker",
              className: "chain-tab" + (tab === "attacker" ? " is-active" : ""),
              onClick: () => setTab("attacker")
            },
            "ATACANTE"
          ),
          h(
            "button",
            {
              type: "button",
              "data-tab": "defense",
              className: "chain-tab" + (tab === "defense" ? " is-active" : ""),
              onClick: () => setTab("defense")
            },
            "DEFESA"
          )
        )
      ),
      detailBody
    )
  );
};

// ---------- Simulador: "quebre a corrente" ----------

const ChainSimulator = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [status, setStatus] = React.useState("idle"); // idle | running | blocked | breached

  const start = () => {
    setCurrentIndex(0);
    setStatus("running");
  };
  const defend = () => setStatus("blocked");
  const letThrough = () => {
    if (currentIndex >= STAGES.length - 1) {
      setStatus("breached");
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };
  const reset = () => {
    setCurrentIndex(0);
    setStatus("idle");
  };

  const stage = STAGES[currentIndex];
  const track = [];

  STAGES.forEach((s, i) => {
    let nodeCls = "chain-sim-node";
    if (status === "breached" || i < currentIndex) nodeCls += " is-cleared";
    else if (i === currentIndex && status === "blocked") nodeCls += " is-blocked";
    else if (i === currentIndex && status === "running") nodeCls += " is-current";
    track.push(h("div", { key: s.id, className: nodeCls, title: s.name }, s.index));

    if (i < STAGES.length - 1) {
      let edgeCls = "chain-sim-edge";
      if (status === "breached" || i < currentIndex) edgeCls += " is-cleared";
      else if (i === currentIndex && status === "blocked") edgeCls += " is-blocked";
      track.push(h("div", { key: "e-" + s.id, className: edgeCls }));
    }
  });

  let panel;
  if (status === "idle") {
    panel = h(
      "div",
      { className: "chain-sim-console" },
      h("p", { className: "chain-sim-score" }, "SIMULAÇÃO LOCAL · DADOS FICTÍCIOS"),
      h("h3", null, "Pronto para testar sete decisões?"),
      h(
        "p",
        null,
        "A cada elo, diga se essa mediação de proteção já existe na sua rotina. O objetivo não é acertar tudo — é enxergar onde falta uma camada."
      ),
      h(
        "div",
        { className: "chain-sim-actions" },
        h(
          "button",
          { type: "button", className: "button is-defend", onClick: start },
          "Iniciar simulação"
        )
      )
    );
  } else if (status === "running") {
    panel = h(
      "div",
      { className: "chain-sim-console" },
      h(
        "p",
        { className: "chain-sim-score" },
        "ELO " + stage.index + " / 07 · " + stage.name.toUpperCase()
      ),
      h("h3", null, "Essa mediação já existe?"),
      h("p", null, stage.mediations[0].text + "."),
      h(
        "div",
        { className: "chain-sim-actions" },
        h(
          "button",
          { type: "button", className: "button is-defend", onClick: defend },
          "Sim, essa defesa existe"
        ),
        h(
          "button",
          { type: "button", className: "button is-skip", onClick: letThrough },
          "Ainda não"
        )
      )
    );
  } else if (status === "blocked") {
    panel = h(
      "div",
      { className: "chain-sim-console is-win" },
      h("p", { className: "chain-sim-score" }, "CORRENTE QUEBRADA NO ELO " + stage.index),
      h("h3", null, "Ataque interrompido em " + stage.name + "."),
      h(
        "p",
        null,
        "Quanto mais cedo uma mediação intercepta a cadeia, menor tende a ser o custo do incidente — a lógica por trás da defesa em profundidade."
      ),
      h(
        "div",
        { className: "chain-sim-actions" },
        h(
          "button",
          { type: "button", className: "button is-defend", onClick: reset },
          "Simular de novo"
        )
      )
    );
  } else {
    panel = h(
      "div",
      { className: "chain-sim-console" },
      h("p", { className: "chain-sim-score" }, "SEM INTERRUPÇÃO EM 07 / 07"),
      h("h3", null, "Ações sobre os objetivos concluídas."),
      h(
        "p",
        null,
        "Sem mediação pronta em nenhum elo, o cenário fictício termina com o invasor atingindo o objetivo: dado, acesso ou disponibilidade perdidos. Nenhuma etapa usou um ataque real."
      ),
      h(
        "div",
        { className: "chain-sim-actions" },
        h(
          "button",
          { type: "button", className: "button is-defend", onClick: reset },
          "Simular de novo"
        ),
        h("a", { className: "button", href: "playbook.html" }, "Abrir o Playbook")
      )
    );
  }

  return h(
    "div",
    { className: "chain-sim" },
    h("div", { className: "chain-sim-track", "aria-label": "Trilha da simulação" }, track),
    panel
  );
};

// ---------- Montagem ----------

const mount = (id, Component) => {
  const el = document.getElementById(id);
  if (!el) return;
  ReactDOM.createRoot(el).render(h(Component));
};

document.addEventListener("DOMContentLoaded", () => {
  mount("chain-hero-root", ChainHero);
  mount("chain-explorer-root", ChainExplorer);
  mount("chain-sim-root", ChainSimulator);
});
