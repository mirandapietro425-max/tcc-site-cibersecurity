# CyberShield Hexad V76 — pesquisa UX e integração dos 98 frames

## Decisão de produto

A V75 já transforma os 98 frames auditados em sequência visual principal do filme. A V76 mantém essa narrativa e adiciona uma camada de interação que trata cada frame como um ponto navegável da história, não apenas como uma imagem de fundo.

O objetivo é combinar três camadas sem competir entre si:

1. **Storyboard visual** — as 98 imagens, sincronizadas com os oito áudios.
2. **Universo 3D** — profundidade, contexto, ambiente e transições.
3. **UX de exploração** — navegação por frame, inspeção contextual, comparação e retorno exato ao filme.

## Pesquisa internacional

### Event Horizon — CSS Design Awards
Experiência de WebGL dirigida por scroll e dividida em nove capítulos. O principal aprendizado para o Hexad é tratar a progressão como uma jornada contínua, com capítulos claros, e não como páginas independentes.

Fonte: https://www.cssdesignawards.com/sites/event-horizon/49186/

### GQ & AP The Extraordinary Lab — CSS Design Awards
Experiência responsiva que combina scroll e WebGL e recebeu avaliações muito altas em UX e Innovation. O aprendizado é manter a interação inteligível mesmo dentro de uma linguagem visual experimental.

Fonte: https://www.cssdesignawards.com/sites/gq-ap-the-extraordinary-lab/49383/

### The Spark — Codrops / CSS Design Awards
O projeto foi concebido como uma história que acontece no navegador, com ritmo, som, motion e mundo 3D dirigidos por uma progressão contínua. O case também destaca carregamento por cenas e uma única progressão compartilhada entre a experiência visual e a interface.

Fontes:
- https://tympanus.net/codrops/2026/01/09/the-spark-engineering-an-immersive-story-first-web-experience/
- https://www.cssdesignawards.com/sites/the-spark/48435/

### ZERO — Codrops
A experiência começa com uma interação pequena e significativa, em vez de um botão de entrada tradicional. O aprendizado aplicável ao Hexad é que a interação deve revelar o sistema, não interromper a história com controles excessivos.

Fonte: https://tympanus.net/codrops/2026/07/17/zero-the-engineering-behind-a-defiant-interactive-narrative/

### Scroll-driven animations — Chrome
As APIs modernas de Scroll Timelines e View Timelines permitem que parte das animações de interface vinculadas ao scroll seja executada fora da linha principal, reduzindo risco de jank. A V76 mantém o scrubber como uma camada leve de interface e continua deixando a progressão principal no estado central do filme.

Fonte: https://developer.chrome.com/docs/css-ui/scroll-driven-animations

### Gallery / image reveal — Codrops
Galerias WebGL modernas sincronizam imagens e WebGL e permitem que o usuário entre de uma imagem em uma visualização detalhada. Isso inspirou o modo de inspeção do frame atual, com anterior / atual / próximo e retorno ao ponto exato do filme.

Fonte: https://tympanus.net/codrops/2026/02/02/building-a-scroll-revealed-webgl-gallery-with-gsap-three-js-astro-and-barba-js/

## O que foi aplicado na V76

### 1. Storyboard scrubber
O visitante pode navegar diretamente pelos 98 frames sem abandonar a experiência. O scrubber transforma a sequência de imagens em uma linha do tempo física.

### 2. Navegação por atos
Os nove atos aparecem como marcadores discretos no scrubber. Um clique leva exatamente ao início do ato.

### 3. Inspeção do frame atual
O frame em exibição pode ser aberto em um modo de contexto. O modo mostra:

- frame anterior;
- frame atual;
- próximo frame;
- ato correspondente;
- tempo da narrativa;
- texto do capítulo;
- retorno ao ponto exato do filme.

### 4. Comparação temporal
Em vez de apenas ampliar uma imagem, a experiência mostra a vizinhança da imagem. Isso transforma a sequência em linguagem narrativa: o usuário percebe o que mudou entre antes, momento atual e depois.

### 5. Retorno ao filme
Depois de explorar um frame, o visitante pode continuar a narração a partir daquele ponto sem reiniciar o capítulo.

### 6. Teclado
`I` abre o contexto do frame atual; setas esquerda/direita percorrem os frames quando o modo de inspeção está aberto; `Esc` fecha a inspeção.

### 7. Imagem continua sendo protagonista
Durante o filme, o storyboard fica na frente e o WebGL recua. O 3D continua importante, mas funciona como camada de profundidade e contexto em vez de competir com a sequência produzida.

## Correção adicional encontrada durante a revisão

O arquivo `049.webp` estava vazio na V75. A versão V76 recompõe esse frame a partir do asset original auditado e normaliza sua saída para 1280×720, mantendo os 98 frames válidos.

## Resultado esperado

O Hexad passa a ser um sistema de três modos que compartilham a mesma narrativa:

**Assistir** → filme sincronizado com áudio + 98 imagens + 3D.

**Explorar** → scrubber e navegação por atos.

**Investigar um momento** → comparação local, contexto e retorno ao ponto exato.

Isso preserva a estrutura narrativa auditada e adiciona UX sem transformar o filme em dashboard.
