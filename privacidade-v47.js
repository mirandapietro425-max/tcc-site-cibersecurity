(() => {
  'use strict';
  const root = document.querySelector('.privacy-super');
  const quiet = document.querySelector('#ps-quiet');
  if (!root || !quiet) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const prefersFinePointer = matchMedia('(pointer:fine)').matches;
  const bubbles = [...quiet.querySelectorAll('.ps-data-bubble')];
  const title = quiet.querySelector('#ps-quiet-title');
  const copy = quiet.querySelector('#ps-quiet-copy');
  const retention = quiet.querySelector('#ps-retention');
  const retentionValue = quiet.querySelector('#ps-retention-value');
  const model = quiet.querySelector('#ps-model');

  const data = {
    identidade: ['IDENTIDADE', 'Nome, credenciais e identificadores precisam de finalidade clara e acesso limitado.'],
    contato: ['CONTATO', 'Telefone e e-mail não são “dados neutros”: o contexto decide quem pode usar e por quanto tempo.'],
    comportamento: ['COMPORTAMENTO', 'Logs e eventos podem revelar hábitos. Colete somente o necessário para a finalidade definida.'],
    localização: ['LOCALIZAÇÃO', 'Precisão demais pode significar exposição demais. Pergunte se o produto realmente precisa desse nível de detalhe.'],
    preferências: ['PREFERÊNCIAS', 'Personalização não deve virar coleta infinita. Defina finalidade, controle e encerramento.']
  };

  function focusBubble(el) {
    const key = el.dataset.quietData;
    const item = data[key];
    if (!item) return;
    bubbles.forEach(b => b.classList.remove('is-focus'));
    el.classList.add('is-focus');
    quiet.classList.add('is-observing');
    title.textContent = item[0];
    copy.textContent = item[1];
    if (model && !reduce && 'cameraOrbit' in model) {
      const angles = { identidade: '20deg 75deg auto', contato: '55deg 72deg auto', comportamento: '100deg 68deg auto', localização: '155deg 72deg auto', preferências: '210deg 70deg auto' };
      model.cameraOrbit = angles[key] || '0deg 75deg auto';
    }
  }

  bubbles.forEach(b => b.addEventListener('click', () => focusBubble(b)));
  quiet.querySelector('.ps-data-core')?.addEventListener('click', () => {
    quiet.classList.toggle('is-observing');
    if (!quiet.classList.contains('is-observing')) {
      title.textContent = 'Núcleo de dados';
      copy.textContent = 'Toque em uma esfera para observar o que muda.';
      bubbles.forEach(b => b.classList.remove('is-focus'));
    }
  });

  retention?.addEventListener('input', () => {
    const months = Number(retention.value);
    retentionValue.textContent = `${months} ${months === 1 ? 'mês' : 'meses'}`;
    const risk = Math.min(1, (months - 1) / 23);
    quiet.style.setProperty('--retention-risk', risk.toFixed(2));
    const label = months <= 3 ? 'retenção curta' : months <= 12 ? 'retenção moderada' : 'retenção longa';
    retentionValue.setAttribute('aria-label', `${retentionValue.textContent}, ${label}`);
  });

  if (prefersFinePointer && !reduce) {
    quiet.addEventListener('pointermove', e => {
      const r = quiet.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - .5) * 2;
      const y = ((e.clientY - r.top) / r.height - .5) * 2;
      quiet.style.setProperty('--qpx', `${x.toFixed(3)}`);
      quiet.style.setProperty('--qpy', `${y.toFixed(3)}`);
    }, { passive: true });
  }

  const obs = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) quiet.classList.add('is-visible');
    else quiet.classList.remove('is-visible');
  }), { threshold: .22 });
  obs.observe(quiet);
})();

// Defensive fallback for the optional 3D layer.
(() => {
  const viewer = document.querySelector('#ps-model');
  const fallback = document.querySelector('.ps-model-fallback');
  if (!viewer || !fallback) return;
  const showFallback = () => { viewer.style.display = 'none'; fallback.style.display = 'grid'; };
  viewer.addEventListener('error', showFallback, { once: true });
  window.setTimeout(() => {
    if (!customElements.get('model-viewer')) showFallback();
  }, 2200);
})();
