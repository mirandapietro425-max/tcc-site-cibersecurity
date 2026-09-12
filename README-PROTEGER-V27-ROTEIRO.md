# CyberShield — Protege V27

A seção **Protege** foi fechada como uma experiência narrativa em 5 cenas, usando exclusivamente os cinco assets da pasta `assets/protect-story/`.

## Sequência
1. **Identidade** — A proteção começa por você.
2. **Dispositivo** — Todo dispositivo é uma porta.
3. **Rede** — Nenhum dispositivo está isolado.
4. **Ameaça** — O ataque encontra fricção.
5. **Escudo** — As camadas fecham o circuito.

## Interação
- Scroll troca as cenas e atualiza texto, indicador e asset.
- Clique numa camada abre o painel contextual.
- O asset atual entra do fundo, estabiliza e gira lentamente; o anterior recua e sai.
- Apenas o modelo atual e o modelo em transição ficam na cena para limitar custo de WebGL.
- O CTA **EXPLORAR A PROTEÇÃO** leva de volta ao início da sequência.
- `prefers-reduced-motion` reduz as animações.

## Assets
- `01-guardiao-humano.glb`
- `02-dispositivo-protegido.glb`
- `03-nucleo-rede.glb`
- `04-ameaca-hacker.glb`
- `05-escudo-cibernetico.glb`

Os assets antigos permanecem no pacote para compatibilidade com outras áreas do projeto, mas não são usados pela composição desta experiência.
