(() => {
  'use strict';

  const root = document.body;
  const qs = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scenarios = [
    {
      channel: 'E-MAIL / 09:42', avatar: 'M', sender: 'micros0ft-support.com', subject: 'Conta · verificação de segurança', priority: 'URGENTE',
      title: 'Seu acesso será suspenso em 10 minutos.', copy: 'Detectamos atividade incomum. Confirme sua senha imediatamente para evitar o bloqueio.', link: 'confirmar-acesso.example', location: 'Recebido no e-mail pessoal',
      risk: 76, riskLabel: 'Risco alto · pressão + domínio inconsistente', correct: 0,
      evidence: [
        ['Domínio', 'micros0ft-support.com', 'Um caractere trocado muda a origem aparente do serviço.'],
        ['Urgência', '10 minutos', 'A contagem regressiva cria pressão para agir sem checar.'],
        ['Pedido', 'senha', 'Serviços legítimos não precisam que você entregue sua senha por este canal.'],
        ['Verificação', 'caminho alternativo', 'Abra o serviço por conta própria e confira o estado da conta.']
      ],
      options: [
        ['Parar e verificar', 'Trocar de canal antes de qualquer ação.'],
        ['Acessar o link', 'Resolver logo enquanto o aviso está ativo.'],
        ['Responder ao remetente', 'Perguntar se a mensagem é verdadeira.']
      ],
      good: 'Você interrompeu o canal suspeito e criou uma rota independente de verificação.', why: 'O padrão combina domínio parecido, urgência e pedido de credencial.'
    },
    {
      channel: 'VOZ / 15:08', avatar: 'B', sender: 'Central de segurança', subject: 'Confirmação · atividade incomum', priority: 'ALERTA',
      title: 'Precisamos do código enviado ao seu telefone.', copy: 'A pessoa diz representar o banco e pede o código de autenticação que acabou de chegar.', link: 'CÓDIGO DE VERIFICAÇÃO', location: 'Ligação recebida',
      risk: 88, riskLabel: 'Risco crítico · código + chamada iniciada por terceiro', correct: 1,
      evidence: [
        ['Canal', 'ligação recebida', 'A chamada foi iniciada por quem está pedindo o dado.'],
        ['Pedido', 'código MFA', 'O código é uma prova de autenticação e deve permanecer com você.'],
        ['Pressão', 'agora', 'O atacante pode tentar ocupar sua atenção antes que você confirme a origem.'],
        ['Verificação', 'telefone oficial', 'Encerre e retorne usando o número oficial do serviço.']
      ],
      options: [
        ['Passar o código', 'A pessoa parece conhecer seus dados.'],
        ['Encerrar e retornar', 'Usar o telefone oficial do banco.'],
        ['Continuar na chamada', 'Pedir que o atendente explique mais.']
      ],
      good: 'Perfeito: um código de autenticação nunca precisa sair do seu controle para validar uma chamada recebida.', why: 'A solicitação de um código MFA por uma chamada iniciada por terceiro é um sinal de alto risco.'
    },
    {
      channel: 'SMS / 18:21', avatar: 'D', sender: 'entrega-rastreio.co', subject: 'Entrega · atualização necessária', priority: 'PRESSÃO',
      title: 'Sua entrega está retida. Atualize em até 12h.', copy: 'A mensagem promete liberar uma entrega após uma pequena atualização e aponta para um endereço encurtado.', link: 'rastreio-atualizacao.example', location: 'SMS recebido',
      risk: 67, riskLabel: 'Risco alto · recompensa + prazo + link inesperado', correct: 0,
      evidence: [
        ['Contexto', 'entrega não esperada', 'Uma situação que você não iniciou aumenta a incerteza.'],
        ['Pressão', '12h', 'Um prazo curto tenta transformar curiosidade em ação.'],
        ['Link', 'domínio desconhecido', 'O endereço não corresponde necessariamente ao serviço de entrega.'],
        ['Verificação', 'aplicativo oficial', 'Abra o rastreio pelo aplicativo ou site que você já conhece.']
      ],
      options: [
        ['Ignorar o link', 'Consultar a entrega pelo caminho conhecido.'],
        ['Abrir rapidamente', 'Só para ver o que precisa ser atualizado.'],
        ['Responder ao SMS', 'Perguntar qual pedido é esse.']
      ],
      good: 'Boa: você não aceitou a história como prova. A confirmação veio por um caminho independente.', why: 'Mensagem inesperada + prazo + link desconhecido é um conjunto forte de sinais de engenharia social.'
    }
  ];

  let index = 0;
  let totalScore = 0;
  let answered = [false, false, false];
  let soundOn = false;
  let audioCtx = null;

  const els = {
    progress: qs('#lab-progress-line'), simStep: qs('#sim-step'), signalChannel: qs('#signal-channel'),
    avatar: qs('#signal-avatar'), sender: qs('#signal-sender'), subject: qs('#signal-subject'), title: qs('#signal-title'), copy: qs('#signal-copy'), link: qs('#signal-link'), location: qs('#signal-location'),
    risk: qs('#inspector-risk'), riskFill: qs('#risk-meter-fill'), riskCaption: qs('#risk-caption'), evidence: qs('#evidence-list'), decisions: qs('#decision-grid'),
    feedback: qs('#feedback'), feedbackIcon: qs('#feedback-icon'), feedbackKicker: qs('#feedback-kicker'), feedbackTitle: qs('#feedback-title'), feedbackCopy: qs('#feedback-copy'), feedbackNext: qs('#feedback-next'),
    heroRisk: qs('#hero-risk'), clueCount: qs('#clue-count'), cluePanel: qs('#clue-panel'), practiceCheck: qs('#practice-check'), resultNumber: qs('#result-number'), resultTitle: qs('#result-title'), resultText: qs('#result-text')
  };

  function tone(kind = 'click') {
    if (!soundOn) return;
    try {
      audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
      const o = audioCtx.createOscillator(); const g = audioCtx.createGain();
      o.type = 'sine'; o.frequency.value = kind === 'success' ? 660 : kind === 'danger' ? 220 : 420;
      g.gain.setValueAtTime(0.0001, audioCtx.currentTime); g.gain.exponentialRampToValueAtTime(0.028, audioCtx.currentTime + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.09);
      o.connect(g).connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime + 0.1);
    } catch (_) { /* audio is decorative */ }
  }

  function updateProgress() {
    const max = Math.max(document.documentElement.scrollHeight - innerHeight, 1);
    els.progress.style.width = `${Math.min(scrollY / max * 100, 100)}%`;
  }

  function renderScenario(next, animate = true) {
    index = Math.max(0, Math.min(scenarios.length - 1, next));
    const s = scenarios[index];
    const update = () => {
      els.simStep.textContent = `${String(index + 1).padStart(2, '0')} / 03`;
      els.signalChannel.textContent = s.channel; els.avatar.textContent = s.avatar; els.sender.textContent = s.sender; els.subject.textContent = s.subject;
      els.title.textContent = s.title; els.copy.textContent = s.copy; els.link.textContent = s.link; els.location.textContent = s.location;
      els.risk.textContent = s.risk; els.riskFill.style.width = `${s.risk}%`; els.riskCaption.textContent = s.riskLabel; els.heroRisk.textContent = `RISK ${String(s.risk).padStart(2, '0')}`;
      qsa('.lab-scenario').forEach((b, i) => { b.classList.toggle('is-active', i === index); b.setAttribute('aria-selected', i === index); });
      els.evidence.innerHTML = s.evidence.map((e, i) => `<button class="evidence" type="button"><strong>${e[0]}<span>${String(i + 1).padStart(2, '0')}</span></strong><p><b>${e[1]}</b><br>${e[2]}</p></button>`).join('');
      qsa('.evidence').forEach(btn => btn.addEventListener('click', () => { btn.classList.toggle('is-open'); tone('click'); }));
      els.decisions.innerHTML = s.options.map((o, i) => `<button class="decision-button" type="button" data-choice="${i}"><strong>${o[0]}</strong><small>${o[1]}</small></button>`).join('');
      qsa('.decision-button').forEach(btn => btn.addEventListener('click', () => decide(Number(btn.dataset.choice))));
      els.feedback.hidden = true;
    };

    if (animate && document.startViewTransition && !reduce) {
      document.startViewTransition(update);
    } else update();
  }

  function decide(choice) {
    if (answered[index]) return;
    const s = scenarios[index];
    answered[index] = true;
    const safe = choice === s.correct;
    const buttons = qsa('.decision-button');
    buttons.forEach((b, i) => { b.disabled = true; b.classList.toggle('is-correct', i === s.correct); b.classList.toggle('is-wrong', i === choice && !safe); });
    if (safe) totalScore += 100;
    els.feedbackIcon.textContent = safe ? '✓' : '!';
    els.feedbackKicker.textContent = safe ? 'DECISÃO SEGURA' : 'SINAL DE RISCO';
    els.feedbackTitle.textContent = safe ? 'Você criou distância.' : 'A urgência venceu a verificação.';
    els.feedbackCopy.textContent = safe ? s.good : `${s.why} ${s.good}`;
    els.feedback.hidden = false;
    els.feedbackNext.textContent = index === scenarios.length - 1 ? 'Ver minha leitura →' : 'Próximo sinal →';
    tone(safe ? 'success' : 'danger');
    els.feedback.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
    updateResult();
  }

  function nextScenario() {
    if (index === scenarios.length - 1) {
      qs('#resultado')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      return;
    }
    renderScenario(index + 1);
    document.querySelector('#lab-console')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  }

  function resetLab() {
    index = 0; totalScore = 0; answered = [false, false, false];
    renderScenario(0, false); updateResult();
    qs('#inicio-lab')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    tone('click');
  }

  function updateResult() {
    const count = answered.filter(Boolean).length;
    const pct = count ? Math.round(totalScore / (count * 100) * 100) : 0;
    els.resultNumber.textContent = `${pct}%`;
    if (!count) { els.resultTitle.innerHTML = 'Seu treino<br /><em>ainda não terminou.</em>'; els.resultText.textContent = 'Passe pelos três sinais para receber uma leitura do seu padrão de decisão. O resultado é local e não é enviado a nenhum servidor.'; return; }
    if (pct === 100) { els.resultTitle.innerHTML = 'Você criou<br /><em>fricção.</em>'; els.resultText.textContent = 'Seu padrão foi consistente: você interrompeu a urgência e escolheu um canal independente para verificar.'; }
    else if (pct >= 66) { els.resultTitle.innerHTML = 'Boa leitura.<br /><em>Continue questionando.</em>'; els.resultText.textContent = 'Você identificou o princípio central na maior parte dos sinais. Em situações reais, repita o mesmo ritual antes de agir.'; }
    else { els.resultTitle.innerHTML = 'A pausa<br /><em>é o treino.</em>'; els.resultText.textContent = 'O laboratório mostra onde a pressa pode tomar a decisão. Na dúvida, desacelere e troque de canal.'; }
  }

  // Practice / clue hunt
  const clueData = {
    urgency: ['URGÊNCIA', 'O prazo não prova que a mensagem é verdadeira. Ele só aumenta a pressão para você agir.'],
    time: ['CONTAGEM REGRESSIVA', 'Um limite curto é usado para reduzir o tempo de investigação e aumentar a chance de impulso.'],
    link: ['LINK FORA DO CAMINHO CONHECIDO', 'A rota mais segura é abrir o serviço por conta própria, não seguir o endereço enviado.']
  };
  const found = new Set();
  qsa('.hotspot').forEach(h => h.addEventListener('click', () => inspectClue(h)));
  qsa('.hotspot').forEach(h => h.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inspectClue(h); } }));
  function inspectClue(el) {
    const key = el.dataset.clue; found.add(key); el.classList.add('is-inspected'); els.clueCount.textContent = found.size; const [title, text] = clueData[key];
    els.cluePanel.innerHTML = `<div><b>${title}</b><p>${text}</p></div>`; els.practiceCheck.disabled = found.size < 3; tone('click');
  }
  els.practiceCheck.addEventListener('click', () => { els.practiceCheck.textContent = 'Análise concluída ✓'; els.practiceCheck.disabled = true; els.cluePanel.innerHTML = '<div><b>Você encontrou o padrão.</b><p>Agora aplique a mesma leitura a qualquer canal: observe, questione e verifique por outra rota.</p></div>'; tone('success'); });

  qsa('.lab-scenario').forEach(btn => btn.addEventListener('click', () => renderScenario(Number(btn.dataset.scenario))));
  els.feedbackNext.addEventListener('click', nextScenario);
  qs('#start-lab')?.addEventListener('click', () => qs('#simulacao')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }));
  qs('#replay-lab')?.addEventListener('click', resetLab);
  qs('#sound-toggle')?.addEventListener('click', () => {
    soundOn = !soundOn;
    const b = qs('#sound-toggle'); b.setAttribute('aria-pressed', String(soundOn)); b.querySelector('span').textContent = soundOn ? 'ON' : 'OFF';
    tone('click');
  });

  // Keyboard shortcuts — lightweight, no global trapping while typing.
  window.addEventListener('keydown', e => {
    if (['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)) return;
    if (e.key === '1') renderScenario(0); else if (e.key === '2') renderScenario(1); else if (e.key === '3') renderScenario(2);
  });
  window.addEventListener('scroll', updateProgress, { passive: true });

  // Start state
  renderScenario(0, false); updateResult(); updateProgress();
})();
