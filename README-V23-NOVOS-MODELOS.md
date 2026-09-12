# CyberShield V23 — troca real dos modelos da primeira página

A primeira página (`#intro`) agora **não carrega mais o modelo antigo**. A composição visual da capa usa somente cinco dos novos modelos enviados:

1. `cybershield_human_man.glb`
2. `cybershield_human_woman.glb`
3. `cybershield_robot_woman.glb`
4. `cybershield_robot_normal.glb`
5. `cybershield_robot_boy.glb`

### Composição
- Os cinco foram reposicionados no plano frontal da capa, ocupando a região visual onde antes ficava o modelo antigo.
- Foram reduzidos para não dominar a tela.
- Todos entram em pé, com rotação X/Z zerada.
- Não acompanham o mouse.
- Não são reposicionados pelo scroll.
- Não fazem pulso de escala.
- Só existe uma rotação ambiente extremamente lenta de cada personagem.
- O renderer continua com antialias/pixel ratio limitados.

### Modelos antigos
Os modelos antigos continuam no diretório `assets/models/` apenas quando ainda são necessários por outras cenas do site. **Eles não são carregados na primeira página.**

Os dois modelos novos restantes (`cybershield_robot_animal.glb` e `cybershield_robot_normal_2.glb`) também ficam disponíveis no pacote, mas não participam da composição da capa, porque a composição pedida usa cinco personagens.
