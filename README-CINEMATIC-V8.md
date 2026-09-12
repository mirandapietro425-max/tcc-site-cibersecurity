# CyberShield — Cinematic UX V8

A home experience rebuilt around scroll-driven WebGL, progressive preloading, audio and interactive chapters.

## Stack
- Three.js / WebGL (loaded from CDN)
- GSAP (loaded from CDN; available for timeline extensions)
- Lenis (loaded from CDN; used for smooth scrolling)
- Web Audio / HTMLMediaElement for the ambient track and SFX
- CSS/SVG/Canvas for HUD and interaction layers

## Local use
Open `index.html` in a browser with internet access so the Three.js / GSAP / Lenis CDNs can load. The audio assets are bundled locally.

For a fully offline build, vendor the three libraries into `/vendor` and change the three script tags in `index.html` to local files.

## Story
01 Intro / Cibersegurança
02 O usuário / Engenharia social
03 A ameaça / Phishing, malware, ransomware, spyware, trojan, worm
04 Cadeia de ataque / Credencial → aplicação → API → dados
05 Defesa em profundidade
06 LGPD & privacidade
07 Desenvolvimento seguro
08 Resposta / exploração do ecossistema
