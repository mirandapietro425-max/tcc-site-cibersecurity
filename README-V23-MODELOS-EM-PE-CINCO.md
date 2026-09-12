# V23 — cinco novos personagens 3D em pé

A primeira página usa somente estes cinco modelos do ZIP mais recente para a composição principal:

1. `cybershield_human_man.glb`
2. `cybershield_human_woman.glb`
3. `cybershield_robot_woman.glb`
4. `cybershield_robot_normal.glb`
5. `cybershield_robot_boy.glb`

Eles são posicionados na frente da capa, em cinco posições fixas e pequenas para não encobrir o conteúdo. Os arquivos vieram do ZIP fornecido pelo usuário; os demais GLBs do ZIP permanecem no projeto, mas não são usados na composição da capa.

Os GLBs novos têm Z como eixo vertical. A cena Three.js usa Y, então a capa aplica `rotation.x = -Math.PI / 2` para colocá-los em pé.

Apenas a rotação Y lenta continua ativa na capa. Não há resposta ao mouse, scroll ou escala pulsante dos cinco personagens.
