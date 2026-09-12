# Benchmark 2026 (rodada 2) — Cadeia de Ataque

## Conclusão

Esta rodada complementa `BENCHMARK-2026.md` com três referências adicionais, revisadas em setembro de 2026, focadas em **framework de ataque**, **visualização de cobertura defensiva** e **governança**. O padrão comum identificado foi: descrever o ataque como uma sequência de elos, mostrar a defesa como uma mediação específica por elo e tratar a governança como uma camada que sustenta as demais — não como uma etapa isolada.

| Referência | Padrão observado | Tradução no CyberShield |
| --- | --- | --- |
| Cyber Kill Chain (Lockheed Martin) [1] | Ataque modelado como sete estágios sequenciais, do reconhecimento aos objetivos finais | Nova página `cadeia-ataque.html`: sete elos navegáveis, cada um com leitura do ataque e da defesa |
| MITRE ATT&CK Navigator [2] | Matriz interativa que conecta técnicas observadas a controles e lacunas de detecção | Explorador de elos com alternância "Atacante / Defesa" e mediações específicas por elo |
| NIST Cybersecurity Framework 2.0 [3] | Seis funções (Governar, Identificar, Proteger, Detectar, Responder, Recuperar) como vocabulário comum de controles | Cada mediação de proteção é marcada com a sigla da função correspondente (GV, ID, PR, DE, RS, RC) |

O objetivo continua sendo o mesmo do benchmark anterior: usar os padrões como inspiração conceitual, sem copiar identidade visual, texto ou código de terceiros. A Cyber Kill Chain e o NIST CSF são frameworks públicos amplamente documentados; nenhuma marca, layout ou texto de nenhuma das três referências foi reproduzido.

## Implementação

A nova página é composta por três arquivos: `cadeia-ataque.html` (estrutura e conteúdo), `cadeia-ataque.css` (estilos exclusivos, reaproveitando as variáveis de `pages.css`) e `cadeia-ataque.js` (os componentes interativos). Os componentes interativos foram construídos em **React 18**, atendendo ao pedido de usar essa tecnologia para tornar a experiência mais imersiva, mas sem adicionar uma etapa de build ao projeto: o código usa `React.createElement` diretamente (sem JSX) e os arquivos `react.production.min.js` e `react-dom.production.min.js` foram baixados do registro oficial do npm e ficam versionados em `vendor/`, servidos pelo próprio domínio do Vercel.

Essa escolha foi deliberada por dois motivos:

1. **Compatibilidade com o CSP existente.** O cabeçalho definido em `vercel.json` usa `script-src 'self'`, ou seja, scripts de um CDN externo (como unpkg ou jsDelivr) seriam bloqueados pelo navegador em produção. Hospedar o React localmente evita alterar a política de segurança.
2. **Compatibilidade com o deploy sem build.** O README já documenta que o projeto é implantado no Vercel com Framework Preset "Other" e sem comando de build. Usar o build UMD do React preserva esse fluxo.

A página inclui três blocos React: uma corrente animada usada como arte do hero, um explorador dos sete elos com alternância "Atacante / Defesa" e um pequeno simulador local ("quebre a corrente") em que a pessoa decide, elo a elo, se uma mediação já existe — sem que isso represente um ataque real ou envie qualquer dado para fora do navegador.

## Limites e segurança

O explorador e o simulador são materiais didáticos. Eles não representam um ataque real, não usam dados de terceiros e não substituem uma avaliação de risco, um plano formal de resposta a incidentes ou uma consultoria especializada. As descrições do "atacante" ficam no nível conceitual (o que costuma acontecer em cada elo), sem instruções operacionais de ataque.

## Referências

[1]: https://lockheedmartin.com/en-us/capabilities/cyber/cyber-kill-chain.html "Lockheed Martin — Cyber Kill Chain"
[2]: https://attack.mitre.org/ "MITRE ATT&CK"
[3]: https://www.nist.gov/cyberframework "NIST Cybersecurity Framework 2.0"

*Documento preparado com apoio de IA (Claude, Anthropic) para continuidade do TCC CyberShield, dando sequência ao benchmark anterior assinado por Manus AI.*

## Validação local

```bash
python3 -m http.server 4173
```

Abra `/cadeia-ataque.html`. A página não faz nenhuma chamada de rede além de carregar as fontes do Google Fonts e os arquivos locais do próprio projeto.

**Fontes consultadas:** [1] [2] [3]
