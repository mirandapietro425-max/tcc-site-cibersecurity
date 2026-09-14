# CyberShield HEXAD V86 — First Frame / Black Screen Fix

Fix crítico da V85: o primeiro frame podia permanecer com `opacity:0` quando o evento `load` já tivesse ocorrido antes do listener do runtime, deixando o storyboard completamente preto.

Correções:
- primeiro frame marcado como `is-active` no HTML;
- runtime detecta imagem já carregada via `complete + naturalWidth`;
- `currentId` inicializado em 0 para permitir o primeiro `setFrame(1)`;
- camada de storyboard visível independentemente do bootstrap Three.js;
- 3D continua secundário;
- demais funcionalidades preservadas.
