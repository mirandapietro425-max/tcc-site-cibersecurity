# CyberShield — Auditoria UX / Arquitetura V38

## Escopo
Auditoria conservadora das páginas de entrada e experiências: index, Playbook/Protege, Laboratório, Privacidade, Cadeia de Ataque e Radar. O objetivo foi corrigir sobreposições, referências quebradas e redundâncias sem reestruturar a arquitetura.

## Achados corrigidos
1. **Referências de assets quebradas** nas experiências novas: corrigidas copiando os personagens necessários para `assets/protect-characters/` e padronizando o Radar para reutilizar os mesmos assets canônicos.
2. **Duplicação exata de `pages.css` e `immersive.css`**: `immersive.css` foi removido das páginas, mantendo `pages.css` como fonte canônica.
3. **GLBs duplicados byte-a-byte** em `assets/models/` foram removidos somente quando não havia referência local; nomes canônicos continuam preservados.
4. **Camadas de layout** receberam um hotfix único (`ux-audit-v38.css`) para limitar overflow horizontal, estabilizar z-index/isolamento, melhorar foco e reduzir riscos de clipping/áreas clicáveis estreitas.
5. **Acessibilidade de interação**: foco visível, alvos touch mínimos e respeito a `prefers-reduced-motion` foram reforçados sem mudar a lógica das experiências.

## Verificações
- 7 documentos HTML analisados; tags balanceadas.
- IDs duplicados: nenhum encontrado nas páginas auditadas.
- Referências locais de HTML: OK.
- Sintaxe de JavaScript: OK para todos os `.js` do diretório.
- Smoke test local: `index.html`, `playbook.html`, `laboratorio.html`, `privacidade.html`, `cadeia-ataque.html` e `radar.html` retornaram HTTP 200.

## Pontos que deliberadamente NÃO foram alterados
- Não foi criada uma nova arquitetura de componentes.
- Não foram removidos os READMEs/benchmarks históricos.
- Não foi refeito o sistema 3D da Home.
- Dependências externas legadas da `index-v9.html` foram mantidas por serem de uma página legada e não por fazerem parte do fluxo principal.

## Tecnologia de UX adotada
As experiências podem usar scroll-driven animations, View Transition API e Web Animations API com fallback, evitando depender de animação contínua pesada. Para performance, as transições preferem `transform` e `opacity`.

Referências:
- MDN — Scroll-driven animations: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations
- MDN — View Transition API: https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
- web.dev — High-performance CSS animations: https://web.dev/articles/animations-guide

## Resultado
A V38 é uma limpeza de "última milha": as experiências recentes permanecem, mas as sobreposições e redundâncias que podiam causar conteúdo cortado, camadas competindo e assets duplicados foram reduzidas.
