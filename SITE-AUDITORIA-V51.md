# CyberShield — Auditoria e Hardening V51

## Escopo
Auditoria estática cruzada das seis páginas principais do CyberShield em desktop, tablet e mobile, com foco em:
- overflow horizontal e elementos que poderiam ultrapassar a viewport;
- navegação e controles em telas pequenas;
- coerência dos fluxos narrativos e das máquinas de estado;
- interação por toque e teclado;
- sobreposição de painéis/controles fixos;
- integridade de IDs, âncoras e assets locais;
- conflitos entre gerações de CSS/JS que poderiam produzir comportamentos concorrentes.

## Correções aplicadas

### Home
- O `experience-v18-fallback.js` agora abandona suas atualizações visuais quando o controlador V21 informa que carregou, evitando disputa de escrita no mesmo scroll.
- Mantida a experiência V21 e o início visual original.

### Laboratório
- `Iniciar simulação` agora entra primeiro na `Incident Chamber`.
- Adicionado CTA explícito `Continuar para a simulação` ao final da Chamber.
- Texto do controle superior alterado de `Som ambiente` para `Sons de decisão`, refletindo o que o controlador realmente faz.
- Ajustado o espaçamento mobile do CTA da Chamber.

### Privacidade
- O progresso lateral passou a seguir as seções narrativas reais por `data-target`, sem depender de numeração fixa.
- O ciclo de vida deixou de usar `#ps-use` como ID de toda a seção.
- O cartão `02 / USAR` agora aponta para a cena de uso/compartilhamento correta.
- Os cartões têm suporte a foco e teclado (`Enter`/`Space`).
- O núcleo do Observatório aceita ativação por teclado.
- O progresso visual agora contempla: Início → Coletar → Ciclo → Observatório → Usar/Compartilhar → Encerrar.

### Proteção embutida no Playbook
- Corrigido `gap:-10px`, declaração inválida em CSS mobile.

### Playbook
- O dossier flutuante sobe no mobile para não ficar sobre os controles de áudio/motion.

### Cadeia de Ataque
- O menu principal voltou a ficar disponível em mobile.
- O grid do rail de sete etapas passa a usar duas colunas, com o último item ocupando a largura total.
- Mantida a arte única da Cadeia e o mapa oficial em português.

### Site inteiro
- Adicionado `responsive-v51-hardening.css` carregado por último em todas as seis páginas principais.
- Contenção de overflow com `overflow-x: clip`, safe-area para controles fixos, navegação horizontal controlada, áreas de toque e proteção de tipografia em telas muito estreitas.
- Incluída política de `prefers-reduced-motion` no hardening final.

## Verificações automatizadas
- 6 páginas principais analisadas.
- IDs duplicados: nenhum.
- Targets locais inválidos (`href`/`data-target`): nenhum.
- Assets locais ausentes referenciados pelas páginas: nenhum.
- `node --check`: todos os arquivos JavaScript do pacote passaram.
- Não foi alterado o conceito visual principal das experiências.

## Limitação de QA visual
O Chromium headless deste ambiente bloqueia navegação local (`ERR_BLOCKED_BY_ADMINISTRATOR`), então a inspeção pixel-a-pixel em screenshots reais não pôde ser concluída de forma confiável neste ambiente. Por isso, o hardening foi baseado em leitura estrutural, regras de breakpoint, CSS/JS e validações de integridade; uma rodada final no Chrome/Edge/Safari reais deve ser feita antes do deploy.
