# CyberShield — Interactive V15

## Correções principais

- Corrigido o carregamento do Three.js + GLTFLoader usando Import Map.
- O GLTFLoader agora resolve o módulo `three` corretamente, evitando o erro `Failed to resolve module specifier "three"`.
- Preloader e botão de entrada têm caminho independente do módulo 3D.
- Fallback visual mantém a experiência acessível mesmo quando uma biblioteca externa falha.
- Scroll/Lenis continua opcional; o site funciona com scroll nativo se o CDN do Lenis não carregar.
- GSAP continua opcional; as transições têm fallback CSS/JS.
- Corrigido o vínculo entre canvas e capítulo para animação por cena.
- Adicionada camada final de segurança de layout contra overflow horizontal.

## Para testar os modelos 3D

Abra por servidor local (Live Server ou `python -m http.server`) para permitir o carregamento dos `.glb` locais.

O site ainda depende dos CDNs do Three.js/GSAP/Lenis, portanto o navegador precisa ter internet para a versão distribuída.
