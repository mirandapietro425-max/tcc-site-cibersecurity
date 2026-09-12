# CyberShield UX Benchmark — V7

## Direção
A versão V7 transforma o CyberShield de um conjunto de páginas com blocos estáticos em uma narrativa de segurança orientada por scroll, sem abandonar a acessibilidade e a leitura.

## Referências pesquisadas
- Cloudflare Security Overview (2026): visão consolidada da postura, itens de ação priorizados por criticidade e caminhos diretos para revisão/remediação.
- Cloudflare Security Center (2026): inventário de superfície de ataque, descoberta de ativos, identificação de riscos e ligação entre achado e mitigação.
- NCSC — Usability of the product: segurança deve ser intuitiva, previsível, acessível e favorecer a escolha segura.
- NCSC — People-centred design: considerar diferentes necessidades e validar o produto com testes de usabilidade.
- CSS Design Awards — Chipsa (2025): referência de scroll animado/WebGL e linguagem visual imersiva.
- CSS Design Awards — Cartier Watches & Wonders 2025: referência de narrativa visual por scroll, animação e WebGL.
- CSS Design Awards — The Pendragon Cycle (2025): referência de storytelling cinematográfico com animação e vídeo/som.

## O que foi incorporado
1. Um sistema único de largura e contenção para evitar overflow horizontal.
2. Breakpoints graduais para notebook, Chromebook/tablet e celular.
3. Hero com composição de duas colunas baseada em `minmax(0, ...)`, evitando crescimento por min-content.
4. Scroll story em seção sticky com quatro estados: sinal, entrada, código/dados e resposta/recuperação.
5. Animações de entrada com fallback: o conteúdo nunca fica invisível quando JavaScript ou movimento reduzido está ativo.
6. Microinteração de spotlight para ponteiro fino.
7. Navegação móvel com limites da viewport, fechamento por Escape e fechamento após seleção.
8. Redução de movimentos e transformações em `prefers-reduced-motion`.
9. Cards menos uniformes e composição em grid de 12 colunas em desktop.

## Relação com o TCC
A narrativa usa os conceitos já trabalhados no TCC: engenharia social, malware, CID, defesa em profundidade, LGPD, Privacy by Design, autenticação, validação, APIs, monitoramento e resposta a incidentes.
