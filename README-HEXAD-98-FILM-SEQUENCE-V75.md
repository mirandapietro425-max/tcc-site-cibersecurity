# CyberShield Hexad V75 — 98 frames sincronizados

Esta versão corrige a principal lacuna visual do filme interativo: os 98 frames auditados agora participam da timeline cinematográfica junto à narração.

## Como funciona
- `assets/hexad/storyboard/frames/001.webp` … `098.webp` são usados como a sequência visual principal.
- `assets/hexad/storyboard/storyboard-sequence.js` contém os 98 cues de tempo derivados da sequência auditada e normalizados para as durações reais dos oito áudios.
- Duas camadas de imagem fazem crossfade para evitar cortes secos.
- Durante `ASSISTIR FILME`, o storyboard ganha destaque e o WebGL fica em segundo plano, preservando o universo 3D como camada de profundidade.
- Durante scroll/pausa, o frame correspondente continua acompanhando o tempo da experiência.
- `MEMÓRIA VISUAL` permanece independente e continua abrindo os mesmos 98 frames.

## Objetivo
O vídeo/filme deixa de ser apenas áudio + objetos 3D: a sequência visual auditada agora aparece na ordem prevista, alinhada com a narrativa e com a progressão temporal.
