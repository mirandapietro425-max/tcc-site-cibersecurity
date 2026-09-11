# CyberShield — Métodos de segurança na internet

Experiência educativa e responsiva baseada no TCC de Pietro de Moraes Miranda. O site organiza cibersegurança pessoal, proteção corporativa, LGPD, engenharia social e desenvolvimento seguro em uma jornada interativa, agora como aplicação React (Vite) com várias páginas.

## Páginas

| Rota | O que oferece |
| --- | --- |
| `/` | Hero imersivo, arte de defesa em profundidade, tríade CID e resumo das experiências |
| `/ameacas` | Radar animado em Canvas, filtros por grupo e painel de defesa por ameaça |
| `/laboratorio` | Cenários de phishing, vishing, smishing, quishing e deepfake com feedback e pontuação |
| `/lgpd` | Ciclo interativo do dado (coletar, usar, proteger, descartar) e direitos do titular |
| `/dev-seguro` | Pipeline modelar/construir/publicar com checklist salvo no navegador |
| `/ferramentas` | Autoavaliação, medidor e gerador de senha, analisador textual de links |
| `/referencias` | Benchmark internacional e referências técnicas do TCC |

## Privacidade das ferramentas

Autoavaliação, senha, links e checklist rodam inteiramente no navegador. Nenhum dado é enviado para servidor, nenhum link informado é acessado automaticamente e o progresso do checklist fica apenas no `localStorage`. O radar de ameaças é uma visualização educativa simulada, não telemetria real.

## Deploy no Vercel

O projeto agora usa build Vite. O `vercel.json` já declara tudo:

- Framework: `vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Rewrites de SPA para que as rotas funcionem em acesso direto
- Headers de segurança (CSP, HSTS, X-Frame-Options, Permissions-Policy)

Root Directory continua `.`. Cada push na branch principal gera nova versão no projeto já conectado ao Vercel.

## Executar localmente

```bash
npm install
npm run dev      # servidor de desenvolvimento
npm run build    # build de produção em dist/
npm run preview  # serve o build
npm run lint     # ESLint
```

## Estrutura

```text
.
├── index.html              # shell da aplicação (Vite)
├── src/
│   ├── main.jsx            # bootstrap React + Router
│   ├── App.jsx             # rotas
│   ├── components/         # layout, arte SVG, radar Canvas, animação de entrada
│   ├── data/content.js     # ameaças, cenários, LGPD, pipeline, referências, benchmark
│   ├── pages/              # uma página por rota
│   └── styles/             # base.css (sistema visual original) + app.css (camada React)
├── vercel.json             # build, rewrites de SPA e headers de segurança
├── img-referencias/        # materiais visuais já presentes no repositório
├── PROMPTS.md              # prompts de referências anteriores
└── preview-*.png           # prévias anteriores
```

## Tecnologias

- React 18 + React Router 6
- Vite 5
- Canvas 2D e SVG animado para as artes
- CSS3 com Grid, Flexbox, custom properties e respeito a `prefers-reduced-motion`
- Google Fonts: DM Sans, Space Grotesk e Space Mono
