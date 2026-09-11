# CyberShield — Métodos de segurança na internet

Experiência educativa e responsiva baseada no TCC de Pietro de Moraes Miranda. O site organiza cibersegurança pessoal, proteção corporativa, LGPD, engenharia social e desenvolvimento seguro em uma jornada interativa.

## O que mudou

- Hero visual com mapa de defesa em profundidade, sem alegações de monitoramento em tempo real.
- Mapa de quatro frentes: pessoas, empresas, código e dados.
- Explorador interativo da tríade CID (confidencialidade, integridade e disponibilidade).
- Filtro e painel de defesa para ransomware, trojans, worms, phishing, vishing e smishing.
- Fluxo educativo de engenharia social com a regra dos três segundos.
- Ciclo visual de tratamento de dados alinhado a Privacy by Design e LGPD.
- Checklist de desenvolvimento seguro com progresso salvo somente no navegador.
- Autoavaliação de postura e verificador de força de senha executados localmente.
- Referências do TCC para OWASP, CERT.br e legislação brasileira.

## Deploy no Vercel

O projeto continua sendo um site estático: `index.html` está na raiz e não exige build, framework ou variáveis de ambiente.

1. Importe `mirandapietro425-max/tcc-site-cibersecurity` no Vercel.
2. Use **Other** como Framework Preset.
3. Deixe Build Command e Install Command vazios.
4. Use `.` como Root Directory.

O `vercel.json` aplica headers de segurança e cada push na branch principal pode gerar uma nova versão no projeto já conectado ao Vercel.

## Estrutura

```text
.
├── index.html              # conteúdo, estrutura e ferramentas da experiência
├── style.css               # sistema visual responsivo e acessível
├── script.js               # tabs, filtros, checklist e ferramentas locais
├── vercel.json             # deploy e headers de segurança
├── img-referencias/        # materiais visuais já presentes no repositório
├── PROMPTS.md              # prompts de referências anteriores
└── preview-*.png           # prévias anteriores
```

## Executar localmente

```bash
python3 -m http.server 8000
```

Depois, acesse `http://localhost:8000`.

## Tecnologias

- HTML5 semântico e navegação por teclado
- CSS3 com Grid, Flexbox, custom properties e animações reduzidas quando necessário
- JavaScript vanilla, sem dependências de build
- Google Fonts: DM Sans, Space Grotesk e Space Mono
