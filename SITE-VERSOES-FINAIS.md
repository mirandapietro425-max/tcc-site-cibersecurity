# CyberShield — Site completo consolidado

Base geral: Superprodução V42 / UX hardening V38

Páginas finais integradas:
- index.html — Home / base V42 + áudio Home dedicado
- playbook.html — Playbook V45
- laboratorio.html — Laboratório V46
- privacidade.html — Privacidade V47
- radar.html — Radar V43
- cadeia-ataque.html — Cadeia de Ataque V49
- Protege — experiência incorporada ao Playbook, preservada em V32/V38+

Controladores específicos:
- playbook-v45.js
- laboratorio-v46.js (com laboratório base preservado quando necessário)
- privacidade-v47.js + privacidade-super.js para os módulos complementares
- radar-v43.js
- cadeia-v49.js

Assets da superprodução em assets/superproduction-v41/

Esta pasta é um pacote de deploy do site inteiro. Não é necessário juntar outros ZIPs.


## Revisão de produção V50

- Cadeia de Ataque: hero simplificado para um único artwork canônico (`cybershield-cadeia.jpg`), removendo sobreposição de imagens.
- Cadeia: removidas camadas CSS legadas específicas que não eram mais usadas no hero.
- Cadeia: mantido apenas o mapa canônico em português no Atlas.
- Laboratório: corrigidos atributos `style` duplicados no espectro.
- Todas as seis páginas principais: 0 IDs duplicados e 0 referências locais quebradas na auditoria estática.
