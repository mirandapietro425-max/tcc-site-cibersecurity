# CyberShield V68 — Correção de abertura e Playbook

## Abertura Home
- SEGURANÇA é o primeiro elemento narrativo.
- A sequência de letras inicia ao abrir o capítulo, sem synthetic click e sem depender do áudio.
- O WebGL da abertura fica oculto durante a palavra e só aparece após a conclusão da sequência.
- O áudio de cada letra continua best-effort e é liberado quando o navegador permitir.

## Playbook
- A área superior de protocolos foi protegida contra overflow em telas pequenas.
- A rail de defesa passa para duas colunas no mobile.
- A seção de cápsulas de conhecimento deixa de usar posições absolutas/animação lateral no mobile e passa para uma coluna estável.
- O dossiê passa a ocupar largura disponível sem sair da viewport.

## Radar
- Removida a referência ao CSS legado radar-v52.css de radar.html.
- radar-v65-final.css e radar-v65-final.js continuam como implementação oficial.

## Observação
Esta versão não altera o gameplay do Radar, nem o conteúdo do Laboratório, Privacidade ou Cadeia.
