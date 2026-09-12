# CyberShield Cinematic Interactive V17

## Correção principal
A versão anterior carregava o GLTFLoader pela URL `examples/js/loaders/GLTFLoader.js` como script clássico. Essa versão não existe mais nesse formato no Three.js moderno; por isso a execução principal parava antes de criar o mundo 3D.

V17 usa ES modules e `GLTFLoader` via `esm.sh`, que resolve as importações do Three.js corretamente no navegador. O carregador dos modelos GLB agora é realmente executado.

## Modelos
- character_avatar.glb
- computer_terminal.glb
- threat_robot.glb
- server_environment.glb
- defense_core.glb
- database_core.glb

## Execução
Abra por Live Server ou `python -m http.server 5500`. A experiência também precisa de acesso à internet para carregar os módulos Three.js/GLTFLoader do CDN.
