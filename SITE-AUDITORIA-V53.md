# CyberShield — Auditoria V53 / Site completo reformado

## Correções aplicadas
- Home: fallback V18 tornou-se fallback real, sem segundo controlador de scroll enquanto V21 estiver ativo.
- Laboratório: fluxo Hero → Incident Chamber → Simulação mantido e reforçado; Chamber lineariza corretamente no mobile.
- Privacidade: sequência semântica corrigida para COLETAR → USAR → OBSERVATÓRIO → PROTEGER → ENCERRAR; IDs e alvos não se confundem mais.
- Privacidade: cards de ciclo de vida e núcleo do observatório mantêm equivalência de interação/foco.
- Radar: header/topbar recebeu shell visual próprio em desktop/mobile; Canvas mantém box e cálculo responsivo.
- Radar: breakpoint intermediário para desktop/tablet evita colapso do grid; dock, SVG e controles não extrapolam viewport.
- Playbook: dossier, áudio e controle de movimento recebem empilhamento seguro no mobile.
- Cadeia: somente composição CSS/Português no hero; seletores legados de arte são neutralizados; estágio 07 ocupa linha inteira no mobile.
- Cadeia: áudio inicia por melhor esforço e desbloqueia no primeiro gesto quando o navegador bloquear autoplay; controles sincronizados.
- Todas as páginas: layer responsivo V53 final + fallback genérico de reveal/media.
- Acessibilidade: foco visível, touch targets, navegação horizontal apenas no header, reduced-motion.

## Integridade
- 6 páginas principais: index, radar, playbook, laboratorio, privacidade, cadeia-ataque.
- Sem imagem inglesa da Cadeia no pacote.
- Mapa de sete estágios continua exclusivamente em português.
