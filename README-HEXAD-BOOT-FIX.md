# CyberShield Hexad — Boot Fix

## Problema corrigido
A tela `PREPARANDO A EXPERIÊNCIA` podia permanecer indefinidamente porque o loader dependia do carregamento completo de todos os assets 3D antes de liberar a interface.

## Correção
- Entrada antecipada baseada nos assets críticos (core/fragment/drone).
- Timeout de segurança de 4,8 s para liberar a experiência mesmo com assets secundários lentos.
- Fallback de 7,5 s no HTML para impedir tela de carregamento permanente caso o módulo Three.js/GLTFLoader não possa ser importado.
- `LoadingManager.onError` agora registra falhas sem bloquear a entrada.
- O restante dos GLBs continua carregando progressivamente em segundo plano.

## Validação
- `node --check hexad-v72-cinematic.js` passou.
- Os assets 3D e vídeos usados pelo Hexad existem no pacote.
