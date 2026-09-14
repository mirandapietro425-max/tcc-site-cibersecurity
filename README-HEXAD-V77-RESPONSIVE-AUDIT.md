# CyberShield Hexad V77 — Auditoria de Responsividade e Interações

## Base auditada
V76 — Frame UX Experience.

## Verificações realizadas
- 9 atos presentes e coerentes com a timeline de 376,659 s.
- 98 frames WebP presentes e com dimensões 1280×720.
- Referências locais do HTML principal sem arquivos ausentes.
- IDs do HTML sem duplicação.
- JavaScript principal passa no `node --check`.
- Modo mobile possui regras específicas para header, mapa, memória visual, forças, investigação, restauração, exploração, simulador e viewer de frames.
- Viewer de frames corrigido para manter o índice atual entre abertura, anterior/próximo e teclado.
- Viewer passou a tratar-se como modal com `role=dialog`, `aria-modal`, foco inicial no botão fechar, retorno de foco ao invocador e ciclo de Tab.
- Ajustes de safe-area e botões no mobile foram adicionados para evitar cortes em telas estreitas.

## Correções V77
1. Navegação anterior/próximo do viewer não depende mais do índice capturado na primeira abertura.
2. Setas esquerda/direita usam o frame atualmente aberto.
3. Escape fecha o viewer e devolve foco.
4. Tab fica contido no viewer enquanto ele está aberto.
5. Viewer recebe semântica modal.
6. Layout do viewer foi reforçado para mobile estreito.
7. Metadado do storyboard evita overflow horizontal em telas menores.

## Limitação
A renderização automatizada completa em Chromium não foi concluída neste ambiente por timeout do processo headless. A revisão visual de navegador real deve ser feita após publicação, especialmente em iPhone/Android e desktop 1366–1920 px.

## Referências de acessibilidade
WCAG 2.2: foco visível, navegação por teclado, foco não obscurecido e interação de modais.
