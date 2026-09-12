# Correção da animação de entrada — direita e esquerda

A primeira página agora usa duas sequências direcionais:

- **Botão da esquerda / INVESTIGAR:** frames 01 + 02 compartilhados, seguidos pelos frames antigos de movimento para a esquerda.
- **Botão da direita / PROTEGER:** frames 01 + 02 compartilhados, seguidos exclusivamente pelos dois frames novos enviados em `cybersecurity_right_walk_frames.zip`, de movimento para a direita.

Os dois novos arquivos ficam em `assets/gateway/`, mas somente entram na sequência quando o botão da direita é clicado.

O frame `05` antigo continua no pacote por segurança, mas não participa mais da sequência de entrada.
