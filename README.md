# CyberShield — Site de Cibersegurança

Site estático responsivo sobre cibersegurança, LGPD e segurança para desenvolvedores, com tema dark cyberpunk, glassmorphism, animações e partículas.

## Deploy no Vercel

Este projeto já está organizado para deploy direto como site estático: o `index.html` fica na raiz e não exige build, framework ou variáveis de ambiente.

1. No Vercel, selecione **Add New → Project → Import Git Repository**.
2. Escolha o repositório `mirandapietro425-max/tcc-site-cibersecurity`.
3. Em **Framework Preset**, mantenha **Other**.
4. Deixe **Build Command** e **Install Command** vazios.
5. Use `.` como **Root Directory** e clique em **Deploy**.

O arquivo `vercel.json` já inclui alguns headers básicos de segurança. Após o primeiro deploy, cada push na branch principal gera uma nova versão automaticamente.

## Estrutura

```text
.
├── index.html              # página principal
├── style.css               # estilos e tema visual
├── script.js               # partículas, contadores e interações
├── vercel.json             # configuração do deploy e headers
├── img-referencias/        # imagens originais de referência
├── PROMPTS.md              # prompts para gerar imagens
└── preview-*.png           # prévias do site
```

## Executar localmente

Abra o `index.html` diretamente no navegador ou execute um servidor local:

```bash
python3 -m http.server 8000
```

Depois, acesse `http://localhost:8000`.

## Tecnologias

- HTML5 semântico
- CSS3 com Grid, Flexbox, custom properties e glassmorphism
- JavaScript vanilla com Canvas API e IntersectionObserver
- Google Fonts: Inter e JetBrains Mono

## Observação

O projeto não usa dependências externas de build. As imagens dentro de `img-referencias/` são opcionais para a página atual e permanecem no repositório como material de referência.
