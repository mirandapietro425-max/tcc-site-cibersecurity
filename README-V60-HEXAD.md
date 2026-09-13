# CyberShield V60 — Hexad Cinematográfico

Nova página: `hexad.html`

A página foi adicionada como uma experiência independente ao site V59:
- um único renderer Three.js e um único requestAnimationFrame;
- seis mundos com navegação por teclado, mouse/touch e botões sem hover obrigatório;
- gênese, colapso e restauração usando os vídeos fornecidos;
- ambiência principal + ambiências por mundo + SFX;
- fallback 2D e comportamento reduzido com `prefers-reduced-motion`;
- painel Narrador e roteiro em `HEXAD-NARRADOR-ROTEIRO.md`.

## Assets novos que ainda faltam
Somente a gravação humana do narrador. Os 12 arquivos esperados estão em `assets/hexad/audio/narration/`.
Não é necessário criar mais modelos 3D, planetas ou vídeos neste momento: o pacote enviado já cobre esses papéis.

## Antes da entrega final
Fazer teste visual real em Chrome desktop e Android/iOS para:
1. carregamento dos GLBs;
2. escala/legibilidade dos seis mundos;
3. reprodução de vídeo;
4. áudio após gesto do usuário;
5. scroll/touch;
6. fallback sem WebGL.
