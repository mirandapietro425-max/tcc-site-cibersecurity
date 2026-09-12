# CyberShield — Cinematic Interactive V12

Esta versão integra de fato os modelos GLB fornecidos pelo projeto às 8 cenas da narrativa.

## Modelos usados
- Intro: character_avatar.glb
- Usuário/Phishing: computer_terminal.glb
- Ameaça: threat_robot.glb
- Cadeia de ataque: server_environment.glb
- Defesa em profundidade: defense_core.glb
- LGPD/Privacidade: database_core.glb
- Desenvolvimento seguro: server_environment.glb
- Resposta/Recuperação: database_core.glb

## Stack
- Three.js r170 + GLTFLoader
- GSAP 3.12.5
- Lenis 1.1.18
- Web Audio API / elementos `<audio>` existentes
- GLTF/GLB local em `assets/models/`

## Comportamento
- carregamento progressivo dos áudios;
- cenas 3D com luzes, partículas e anéis;
- modelos GLB visíveis e clicáveis;
- animações de câmera controladas pelo scroll;
- animações embutidas nos GLB, quando presentes;
- fallback procedural se algum modelo falhar;
- responsividade e redução de qualidade no mobile.

## Observação
A Home usa módulos Three.js por CDN, enquanto os modelos e áudios ficam locais no pacote. Para abrir a experiência 3D em navegador com segurança, recomenda-se servir a pasta por um servidor HTTP local (por exemplo Live Server). Em hospedagem web normal, os assets locais funcionam diretamente.
