# Mapa de consolidação do CyberShield

## Diagnóstico

O projeto é um site estático multipágina, mas evoluiu por camadas de correção versionadas. O padrão atual mistura arquivos de entrada (`index.html`, `playbook.html`, `hexad.html`), folhas globais, folhas específicas por página e vários arquivos numerados que já não são carregados. Essa estratégia preserva histórico no diretório de produção e aumenta o risco de uma regra antiga ser referenciada por engano.

A experiência chamada informalmente de “Hashed” corresponde à página **Hexad**, acessível por `hexad.html`. A entrada ativa foi mantida em `hexad.html`; `hexad-v72.html` era uma duplicata antiga e foi movida para `legacy/hexad/`.

## Correção mobile

O CSS principal do Hexad continha um seletor incompleto na camada V81: `.hx71-chapter-copy, .hx71-center-message, .hx71-force-panel,` não possuía bloco de regras. Isso interrompia a interpretação daquela parte da folha e tornava o resultado mobile dependente do ponto em que o navegador descartava o seletor inválido. O seletor foi removido.

A página continua com `viewport-fit=cover`, unidades `svh`, áreas de toque mínimas e regras específicas para larguras de 800, 560 e 400 pixels. O fallback storyboard permanece visível antes do WebGL e o runtime consolidado mantém a ordem correta: imagem inicial, controlador cinematográfico e controles de acessibilidade/interação.

## Estrutura ativa

| Área | Entrada atual | Arquivos ativos | Estado |
|---|---|---|---|
| Home | `index.html` | camadas globais e scripts da home | Mantida; consolidação futura recomendada |
| Radar | `radar.html` | `radar-v52.css`, `radar-v52.js` e camadas globais | Mantida |
| Playbook | `playbook.html` | `playbook-v45.css`, `playbook-v46-final.css`, `playbook-v48-desktop-mobile-flow.css` e `playbook-v45.js` | Corrigida anteriormente; ainda recomenda consolidação própria |
| Hexad | `hexad.html` | `hexad.css`, `hexad.js` e assets `assets/hexad/` | Consolidada nesta atualização |
| Laboratório | `laboratorio.html` | versões `laboratorio-*` | Mantida |
| Privacidade | `privacidade.html` | versões `privacidade-*` | Mantida |
| Cadeia de ataque | `cadeia-ataque.html` | versões `cadeia-*` e `chain-*` | Mantida |

## Regra para a próxima etapa

Cada página deve possuir uma única folha específica e um único runtime específico. As folhas globais devem conter apenas tokens, reset, navegação compartilhada e componentes realmente reutilizados. Correções novas devem ser incorporadas ao arquivo ativo, não adicionadas como outro arquivo numerado. Arquivos antigos devem ficar em `legacy/` ou no histórico Git, nunca no caminho de produção.

## Arquivos consolidados nesta atualização

`hexad.css` combina a camada cinematográfica V72 corrigida com a camada estrutural V90. `hexad.js` combina o fallback image-first e o controlador cinematográfico V72 em um único módulo ES. `hexad.html` deixou de carregar as versões fragmentadas. As versões anteriores foram preservadas em `legacy/hexad/` para auditoria e rollback, mas não são mais dependências da experiência ativa.

## Verificações realizadas

Os runtimes consolidados passam por verificação sintática com Node.js. A entrada possui viewport responsivo. A correção foi validada com capturas em desktop e mobile, e o boot completo é executado com espera ampliada por causa do carregamento de WebGL, módulos externos e storyboard.
