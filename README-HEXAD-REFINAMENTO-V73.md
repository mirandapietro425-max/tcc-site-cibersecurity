# CyberShield — Hexad V73 Refinado

Esta versão parte da base **CyberShield-V70-PLAYBOOK-CADEIA-FINAL-HEXAD-UX-REVIEW.zip** e preserva os consertos de Playbook, Cadeia de Ataque e mobile.

## Refinamentos desta rodada

- Entrada do Hexad permanece na navegação do site principal e abre em nova aba.
- Loader real da experiência, com progresso de carregamento dos assets 3D.
- Skip link para acessibilidade e navegação por teclado.
- Mapa narrativo persistente com os 9 atos e salto direto para cada capítulo.
- Estado ativo do capítulo sincronizado com a timeline.
- Gate opcional e não intrusivo para ativação do áudio; o usuário pode continuar sem som.
- Melhor controle do Escape para fechar overlays e viewers.
- Modo “Investigar o incidente” leva o usuário diretamente ao ato de investigação em vez de abrir dois overlays simultaneamente.
- Simulador com sequência determinística de cenários, evitando decisões aleatórias no mesmo fluxo.
- Duração exibida corrigida para 06:16, coerente com a timeline real de 376,659 s.
- Preservação de `prefers-reduced-motion`.
- Preservação dos links e comportamento mobile existentes.

## Base conceitual

A direção continua baseada em experiências WebGL recentes que tratam scroll, câmera, narrativa e interação como um único sistema, em vez de efeitos independentes.

## Validação

- `node --check hexad-v72-cinematic.js` — OK.
- Auditoria de `href`/`src` locais nos HTMLs — 0 referências quebradas.
- Assets 3D, vídeo, áudio e storyboard usados pelo Hexad presentes no pacote.
- A publicação deve ser feita sobre a branch `main` sem alterações fora desta entrega.
