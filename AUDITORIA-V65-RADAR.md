# CyberShield Radar — V65

## Mudança principal
O Radar foi convertido de uma interface ambígua de seleção em uma missão educativa clara:

1. Iniciar missão.
2. Localizar a anomalia pulsando no campo.
3. Selecionar o alvo.
4. Escolher a resposta proporcional ao risco.
5. Repetir por 5 rodadas.
6. Ao finalizar, aparece a tela **ANOMALIA NEUTRALIZADA** com precisão e opção de jogar novamente.

## Regras
- baixo: MONITORAR
- médio: INVESTIGAR
- alto: CONTER
- alvo errado: não avança e mostra feedback
- resposta errada: não avança e registra erro
- 5 acertos: vitória

## Interação
- mouse / pointer no radar
- botões de sinal
- teclado: setas, S (scan), M (áudio), Enter no overlay, Escape para limpar seleção
- mobile: toque no alvo e botões empilhados

## Arquitetura
- `radar-v53-game.js` é o controlador principal da experiência do Radar.
- `radar-v53-game.css` contém a camada visual da missão.
- `radar-v52.js` não é carregado pelo `radar.html`.
- um único RAF é usado para o Canvas do Radar.

## Verificações
- JS: `node --check` PASS
- referências locais do `radar.html`: PASS
- assets SFX: PASS
- CSS/JS novos referenciados: PASS
- IDs/markup: sem alteração estrutural destrutiva

## Nota visual
A validação em navegador real deve continuar sendo feita no Chrome/Android/iOS para confirmar renderização WebGL/Canvas, porque o ambiente de desenvolvimento não garante uma sessão headless confiável.
