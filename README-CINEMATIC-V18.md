CyberShield Interactive V18

This release integrates the three newly supplied 3D assets:
- ai_defense_core.glb
- network_infrastructure_hub.glb
- digital_threat_entity.glb

Scene mapping:
01 Intro: AI Defense Core
02 User / phishing: Network Infrastructure Hub
03 Threat: Digital Threat Entity
04 Attack: Network Infrastructure Hub
05 Defense: existing Defense Core
06 Privacy: existing Database Core
07 Development: Network Infrastructure Hub
08 Response: AI Defense Core

UX fixes:
- scroll-driven text motion is restored and no longer depends on GSAP;
- interactions get explicit motion + sound feedback;
- native scroll remains available even if optional smooth-scroll libraries fail;
- Three.js/GLTFLoader is loaded as ES modules;
- mobile particle count is reduced for performance.
