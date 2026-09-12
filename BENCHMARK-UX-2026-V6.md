# CyberShield — benchmark UX e decisões da versão V6

## Problema visual identificado
A versão anterior aplicava limites ao `.container`, mas o bloco principal da home usava `.section-wrap` sem largura própria. Isso permitia que o hero ocupasse a viewport inteira enquanto o conteúdo interno era calculado fora da grade visual do cabeçalho. A V6 corrige isso criando uma grade única para `.container`, `.section-wrap`, `.section` e `.hero`.

## Referências novas
- NCSC — *Putting people at the heart of an organisation's approach to cyber security*. A recomendação central é integrar people-centred design, testes de usabilidade, acessibilidade e redução de erro ao sistema de segurança.
- NCSC — *Secure design principles*. A organização recomenda estabelecer o contexto, dificultar o comprometimento, facilitar a detecção e reduzir o impacto de incidentes.
- CSS Design Awards — *Chipsa* (Sérvia, 2025): experiência marcada por scroll, animação e WebGL.
- CSS Design Awards — *The Spark* (Canadá, 2025): storytelling 3D baseado em scroll e WebGL.
- CSS Design Awards — *Above the Clouds* (Reino Unido, 2025): uso de tela cheia, scroll e WebGL.
- CSS Design Awards — *Montfort* (França, 2025): experiência responsiva com scroll e WebGL.
- CSS Design Awards — *Light in the Darkness* (Itália, 2025): experiência interativa com luz, cor, movimento e scroll.
- CSS Design Awards — *OceanX: 2025 Year in Review* (Reino Unido, reconhecido em 2026): narrativa one-page baseada em scroll e WebGL.

## O que foi incorporado
- Hero contido em uma grade real de largura máxima.
- Hero visual com parallax suave controlado pelo scroll.
- Reveal progressivo baseado em IntersectionObserver, com fallback visível.
- Spotlight de hover nos cards, sem movimento 3D agressivo.
- Breakpoints específicos para notebook, Chromebook/tablet e celular.
- Redução de motion respeitando `prefers-reduced-motion`.
- Overflow horizontal proibido no ecossistema inteiro.
- Menu móvel com fechamento por clique e Escape.
- Seções e componentes impedidos de crescer além da largura útil.
- Interações mantidas compatíveis com teclado e toque.

## Direção visual
A experiência V6 não tenta copiar um site premiado. Ela adota a lógica de storytelling desses projetos: grande composição inicial, movimento atrelado à narrativa, pequenos estados de interação e transições que reforçam o conteúdo. O conteúdo continua sendo o do TCC, incluindo CID, defesa em profundidade, ameaças, LGPD, Privacy by Design, desenvolvimento seguro e monitoramento.

## V7 — Cinematic experience layer

This iteration replaces the previous responsive cascade with a final layout layer and introduces a scroll-driven story scene based on sticky positioning, layered SVG/CSS geometry, progressive panel reveals and reduced-motion fallback.

Benchmark refresh (September 2026): Cloudflare's 2026 security overview emphasizes a unified posture view, prioritized security action items, filters by criticality/category and direct paths from findings to remediation. NCSC emphasizes human-centred design, intuitive security functions, predictable performance, accessibility and usability testing. CSS Design Awards examples such as Chipsa and Cartier Watches & Wonders 2025 demonstrate animated scroll/WebGL storytelling as a visual reference for the experiential direction.
