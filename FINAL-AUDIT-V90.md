# CyberShield — Auditoria Final V90

## Escopo
Auditoria final do pacote CyberShield V89 antes do congelamento da versão final.

Foram verificados os 7 pontos principais do site:

- Home (`index.html`)
- Playbook (`playbook.html`)
- Cadeia de Ataque (`cadeia-ataque.html`)
- Laboratório (`laboratorio.html`)
- Radar (`radar.html`)
- Privacidade (`privacidade.html`)
- Hexad (`hexad.html`)

Também foram verificados assets, referências locais, JavaScript, estrutura responsiva e o filme contínuo do Hexad.

## Resultado estrutural

- 7 páginas principais presentes.
- 2 variantes antigas/arquivadas também presentes no pacote (`index-v9.html` e `hexad-v72.html`); não são removidas para evitar regressão de arquivos existentes.
- 355 arquivos em `assets`.
- 98 frames do storyboard.
- 49 frames em 2560×1440.
- 49 frames em 1280×720.
- Nenhum asset do diretório `assets` com 0 bytes.
- 8 narrações individuais.
- 1 `narration-master.mp3`.
- Todos os 7 HTMLs principais possuem `meta viewport`.
- Todas as referências locais de HTML verificadas existem no pacote.
- Todos os JavaScripts presentes passaram em `node --check`.

## Áudio / continuidade

Durações verificadas por `ffprobe`:

| Arquivo | Duração |
|---|---:|
| narration-01.mp3 | 38.269375 s |
| narration-02.mp3 | 42.240000 s |
| narration-03.mp3 | 33.854688 s |
| narration-04.mp3 | 49.319125 s |
| narration-05.mp3 | 59.846500 s |
| narration-06.mp3 | 51.226063 s |
| narration-07.mp3 | 61.283250 s |
| narration-08.mp3 | 40.620375 s |
| narration-master.mp3 | 376.685714 s |

A timeline declarada do filme termina em 376.659 s. A diferença entre o master e a timeline é aproximadamente 0.027 s, suficientemente pequena para ser tratada como tolerância de finalização do arquivo.

## Responsividade — matriz de dimensionamento

| Viewport | Tratamento recomendado/implementado |
|---|---|
| 2560×1440 | Desktop grande / composição ampla |
| 1920×1080 | Desktop 16:9 / encaixe natural |
| 1600×900 | Desktop grande |
| 1536×864 | Desktop grande |
| 1440×900 | Desktop não-16:9; imagem 16:9 com espaço vertical residual |
| 1366×768 | Desktop/notebook 16:9 |
| 1280×720 | Desktop compacto |
| 1200×800 | Desktop compacto / atenção às zonas laterais |
| 1024×768 | Tablet/desktop compacto; zonas laterais reduzidas |
| 1024×1366 | Portrait; composição vertical |
| 834×1112 | Tablet portrait |
| 768×1024 | Tablet portrait |
| 430×932 | Mobile portrait |
| 390×844 | Mobile portrait |
| 360×800 | Mobile portrait mais estreito |
| 844×390 | Mobile landscape |
| 915×412 | Mobile landscape |

## Safe-zones calculadas

### Desktop
- Margem externa de conteúdo: aproximadamente 6vw, limitada pelo container.
- Copy principal: largura controlada, evitando ocupação integral da viewport.
- Gap mínimo entre copy e módulos laterais: 64 px em desktop amplo.

### Notebook / desktop compacto
- Gap mínimo entre copy e módulos laterais: 40 px.
- Módulos laterais devem reduzir antes de colidir com o texto.
- Atos densos como Forças e Restauração têm regras específicas de largura.

### Mobile / tablet portrait
- Elementos horizontais deixam de competir por espaço.
- Imagem continua 16:9.
- Controles e copy ocupam zonas separadas.
- Respeito a safe-area-inset.

## Hexad

O Hexad mantém:

- 98 frames.
- Filme contínuo.
- Áudio como referência temporal.
- Imagem como protagonista visual.
- 3D como camada secundária.
- Memória Visual.
- Viewer de frames.
- Investigação.
- Simulação.
- Restauração.
- Lente/Deck UX.
- Navegação final somente no término do filme.

## Navegação final

Ao término do filme, os destinos finais ficam disponíveis:

- Capítulo 1 / O Vazio.
- Universo CyberShield.
- Playbook.
- Cadeia de Ataque.
- Explorar as 6 Forças.
- Investigar o Incidente.
- Simular uma Falha.

Durante a reprodução, os grupos finais permanecem ocultos.

## Interligações entre páginas

As referências locais principais verificadas não apresentam caminhos inexistentes no pacote.

Principais destinos presentes:

- Home → Radar / Hexad / Playbook / Laboratório.
- Playbook → Home / Radar / Laboratório / Privacidade / Cadeia.
- Cadeia → Home / Radar / Playbook / Laboratório / Privacidade.
- Laboratório → Home / Radar / Playbook / Privacidade / Cadeia.
- Radar → Home / Playbook / Laboratório / Privacidade / Cadeia.
- Privacidade → Home / Radar / Laboratório / Cadeia.
- Hexad → Home / Playbook / Cadeia e navegação final da própria experiência.

## Status de validação

### Confirmado por análise estática
- Estrutura HTML principal presente.
- Referências locais verificadas.
- Assets existentes.
- Nenhum asset zero-byte.
- JavaScript sem erro de sintaxe em `node --check`.
- 98 frames presentes e dimensionados em dois tamanhos 16:9.
- 8 narrações + master presentes.
- Meta viewport presente nos 7 HTMLs principais.
- CSS responsivo distribuído por todos os principais módulos.

### Limitação desta auditoria
A inspeção visual automatizada com Chromium não foi concluída de forma integral neste ambiente devido a timeout dos próprios sites durante a renderização. Portanto, não é correto declarar uma certificação pixel-perfect de todos os viewports. A análise abaixo do nível de layout é estrutural/matemática, não uma promessa de screenshot perfeito.

## Congelamento

Esta versão deve ser tratada como **versão final candidata**, sem alterações adicionais de conteúdo, áudio ou assets sem nova auditoria.
