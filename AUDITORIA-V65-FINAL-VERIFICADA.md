# CyberShield V65 — verificação final

## Escopo
Última verificação da versão final do site, com correção apenas da referência nominal do controlador do Radar. O comportamento do gameplay permanece o mesmo.

## Correção final
- `radar.html` agora carrega `radar-v65-final.css?v=65`.
- `radar.html` agora carrega `radar-v65-final.js?v=65`.
- `radar-v65-final.js` é uma cópia exata do controlador funcional do gameplay existente.
- `radar-v65-final.css` é uma cópia exata do CSS funcional existente.

## Integridade
- IDs duplicados: 0 nas páginas finais.
- Referências locais dos HTML finais: 0 quebradas.
- JavaScript: todos os arquivos `.js` passam `node --check`.
- Não há `hexad.html` nem referências a `assets/hexad` no runtime HTML/JS/CSS.
- O mapa português dos 7 estágios da Cadeia permanece presente.
- As três imagens finais da Cadeia permanecem presentes.

## Páginas finais
- index.html
- cadeia-ataque.html
- laboratorio.html
- privacidade.html
- radar.html
- playbook.html

## Observação
A verificação visual final em dispositivos físicos depende do navegador/dispositivo real. Esta auditoria confirma a integridade do pacote, referências, sintaxe, integração nominal e ausência de conflitos introduzidos nesta última correção.
