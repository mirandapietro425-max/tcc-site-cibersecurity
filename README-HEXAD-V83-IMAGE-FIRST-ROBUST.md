# CyberShield HEXAD V83 — Image-First Robustness Review

## Objetivo
Corrigir a inicialização da experiência e tornar as 98 imagens autorais a camada visual principal desde o primeiro paint, sem depender do carregamento do Three.js/CDN.

## Correções principais
- Primeiro frame (`001.webp`) é pré-carregado no `<head>` com `fetchpriority="high"` e exibido diretamente no HTML.
- Novo runtime `hexad-image-first-runtime.js` inicia a camada de storyboard independentemente do módulo 3D.
- O filme possui fallback visual e de narração quando o módulo Three.js ainda não está pronto.
- Loader não bloqueia a obra: some após o primeiro frame carregar (com watchdog de segurança).
- A camada de imagem usa fundo desfocado do próprio frame para evitar áreas pretas em telas com outra proporção.
- `object-fit: contain` no mobile preserva a arte completa; o fundo desfocado preenche as laterais.
- Margens de colisão maiores em desktop para evitar sobreposição entre texto e módulos laterais.
- Espaçamento e área dos controles aumentados no mobile para reduzir toques acidentais.
- Fallback para `hexad-overview.webp` caso o primeiro frame falhe.

## Responsive safety
Alvos considerados: 1366x768, 1440x900, 1920x1080, 1024x1366, 390x844 e 430x932.

A estrutura foi ajustada para:
- evitar overflow horizontal;
- manter overlays dentro da viewport;
- preservar safe-area;
- manter botões com espaçamento seguro;
- não depender de hover;
- manter o 3D discreto como contexto.

## Validação
- `node --check` passou no runtime V83 e no módulo cinematográfico.
- 98 frames WebP presentes e não vazios.
- 98 thumbnails WebP presentes e válidos.
- A tentativa de screenshot automatizado Chromium neste ambiente continua limitada por timeout do headless; portanto não foi declarada validação visual pixel-a-pixel.

## Direção UX
A referência é: imagem = filme; áudio = relógio; 3D = profundidade; interação = exploração.

A arquitetura original também pede uma única timeline central (`experience.progress`) e uma experiência de filme + exploração + interação.
