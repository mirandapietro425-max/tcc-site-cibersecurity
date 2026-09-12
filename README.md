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
- Sala de Resposta com cenários educativos de phishing, ransomware e exposição de dados.
- Laboratório de decisões com cenários fictícios de phishing, vishing e smishing, feedback imediato e pontuação somente na sessão.
- Jornada de privacidade com ciclo de vida de dados, classificação da informação, checkpoint BYOD e Hexagrama Parkeriano.
- Cadeia de ataque interativa (em React, sem etapa de build) com os sete elos do Cyber Kill Chain, mediações de proteção mapeadas às funções do NIST CSF 2.0 e uma simulação local de "quebrar a corrente".
- Referências do TCC para OWASP, CERT.br e legislação brasileira.

O benchmark que orientou as decisões de experiência está documentado em [`BENCHMARK-2026.md`](./BENCHMARK-2026.md) e em [`BENCHMARK-2026-2.md`](./BENCHMARK-2026-2.md). As referências foram usadas como inspiração de padrões, sem copiar identidade, texto ou código.

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
├── BENCHMARK-2026.md       # benchmark mundial e limites do produto
├── BENCHMARK-2026-2.md     # segunda rodada de benchmark (Cadeia de Ataque)
├── laboratorio.html        # treino de decisões contra engenharia social
├── privacidade.html        # jornada de dados, LGPD e Parkerian hexad
├── cadeia-ataque.html      # explorador e simulador da cadeia de ataque
├── cadeia-ataque.js        # componentes React (sem build) da página acima
├── cadeia-ataque.css       # estilos exclusivos da página acima
├── vendor/                 # React e ReactDOM (UMD, MIT) hospedados localmente
├── immersive.css           # sistema visual das novas experiências
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
- React 18 (UMD, `React.createElement`, sem JSX) somente em `cadeia-ataque.html`, com os arquivos da biblioteca hospedados em `vendor/` — sem CDN e sem build, para preservar o CSP e o deploy estático
- Google Fonts: DM Sans, Space Grotesk e Space Mono


## Redesign UX/UI — setembro de 2026

Esta versão reorganiza o sistema visual em uma camada CSS centralizada (`style.css`, `pages.css`, `immersive.css` e `ux-polish.css`) com variáveis de cor editáveis no `:root`. A paleta combina verde, ciano, violeta, laranja, rosa e vermelho sobre fundo escuro translúcido, permitindo alterar a identidade inteira sem editar cada componente.

Também foram recuperadas as páginas `radar.html` e `playbook.html` que estavam referenciadas pela navegação, mas não estavam presentes no ZIP original, além de `script.js`, `laboratorio.js` e `privacidade.js` para restaurar as interações locais.

A home recebeu uma nova camada `07 / CONHECIMENTO DO TCC`, com conteúdo derivado das seções sobre Defesa em Profundidade, Hexagrama Parkeriano, segurança de websites, Privacy by Design, ética/fator humano, APIs, CI/CD, secrets, logs/SIEM e resposta a incidentes.

### Princípios de UX usados

- **Informação em camadas:** visão geral primeiro, detalhes depois, seguindo a recomendação de breadth-first e informação arquitetural para ferramentas de segurança. 
- **Ação antes de complexidade:** CTAs claros, estados ativos, feedback imediato e progressos visíveis.
- **Pessoa no centro:** segurança sem criar fricção desnecessária; a experiência deve ajudar o usuário a tomar uma decisão segura.
- **Transparência:** as ferramentas locais deixam explícito quando nada é enviado ou coletado.
- **Defesa em profundidade:** o visual usa camadas de cards, sinais e conexões para refletir a lógica do próprio TCC.
