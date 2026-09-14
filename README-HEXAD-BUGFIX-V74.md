# CyberShield HEXAD — Bugfix V74

Esta entrega corrige os problemas observados na abertura e na exploração da experiência Hexad.

## Correções principais

1. **Modelos 3D não apareciam**: o loader GLTF recebia um grupo, mas não adicionava o modelo carregado ao grupo. A rotina passou a executar `group.add(model)` antes do callback.
2. **Referências 3D assíncronas ficavam nulas no estado de cena**: core, fragment, drone, scanner e sun agora atualizam as referências da `sceneApi` quando terminam de carregar.
3. **Carregamento inicial pesado**: apenas core + fragment são críticos para o primeiro boot; drone, seis mundos, satélites, nodes e demais assets passam a carregar progressivamente após a experiência estar liberada.
4. **Dependência rígida de CDN**: Three.js/GLTFLoader agora tentam jsDelivr, depois esm.sh; se ambos falharem, a página entra em modo cinematográfico sem WebGL.
5. **Fallback visual**: existe uma imagem de universo atrás do WebGL, para que a experiência nunca fique com um fundo vazio.
6. **ASSISTIR FILME**: o botão possui um fallback independente do módulo Three.js e consegue iniciar o material cinematográfico mesmo em modo degradado.
7. **MEMÓRIA VISUAL**: foram incorporados thumbnails e frames otimizados dos 98 frames auditados enviados no pacote `CyberShield_Hexad_Sequencia_Auditada_98_imagens`.
8. **Duplicação da memória visual**: o construtor do storyboard ignora execução repetida quando a grade já estiver preenchida.
9. **Frame viewer**: usa versões WebP otimizadas dos frames, com fallback para thumbnails.

## Base

Base utilizada: `CyberShield_HEXAD_BOOT_FIX_FINAL.zip`.

Nenhuma página fora do Hexad foi alterada nesta entrega.
