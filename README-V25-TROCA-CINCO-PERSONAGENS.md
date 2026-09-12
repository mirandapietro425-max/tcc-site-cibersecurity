# CyberShield V25 — troca dos 3D da primeira página

A primeira página agora usa somente cinco modelos do ZIP `cybershield_character_models.glb(2).zip`:

1. `cybershield_human_man.glb` — capa / introdução
2. `cybershield_human_woman.glb` — o usuário
3. `cybershield_robot_woman.glb` — ameaça
4. `cybershield_robot_normal.glb` — cadeia de ataque
5. `cybershield_robot_boy.glb` — defesa

Os modelos antigos continuam guardados em `assets/models`, mas não são mais carregados na primeira página. As etapas seguintes (`privacidade`, `desenvolvimento seguro` e `resposta`) ficam sem personagem 3D.

Os cinco personagens têm orientação corrigida para ficar em pé (eixo Z dos GLBs convertido para Y da cena), rotação lenta no próprio eixo e escala reduzida para não cobrir o texto nem responder ao mouse/scroll.
