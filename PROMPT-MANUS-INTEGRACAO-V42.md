# Manus — integração V42 no GitHub

Repositório: `mirandapietro425-max/tcc-site-cibersecurity`

Integrar `CyberShield-SuperProducao-V42` como evolução do V41.

## Objetivo
As imagens e os áudios fornecidos precisam PARTICIPAR da experiência, e não apenas existir na pasta de assets.

### Assets obrigatórios por página
- Home: `assets/superproduction-v41/cybershield-city.jpg` + `cybershield-home.mp3`
- Playbook: `cybershield-archive.jpg` + `cybershield-playbook.mp3`
- Laboratório: `cybershield-laboratorio.jpg` + `cybershield-laboratorio.mp3`
- Privacidade: `cybershield-privacidade.jpg` + `cybershield-privacidade.mp3`
- Cadeia: `cybershield-cadeia-seven-stages-ptbr.png` + `cybershield-cadeia.mp3`
- Radar: `cybershield-radar.jpg` + `cybershield-radar.mp3`
- Protege/universo: `cybershield-protege.jpg` + `cybershield-protege.mp3`

## Arquitetura V42
Adicionar:
- `superexperience-v42.css`
- `superexperience-v42.js`

Remover a dependência do `superproduction-v41.css/js` nas seis páginas apenas depois de verificar que nenhuma função necessária foi perdida.

O V42 injeta em cada página um capítulo artístico em tela grande após o primeiro hero. Esse capítulo:
- usa o artwork como cenário dominante;
- mostra uma segunda composição do mesmo artwork em um frame explorável;
- possui hotspots semânticos;
- atualiza a leitura contextual quando o visitante seleciona um ponto;
- usa parallax somente via transform em dispositivos adequados;
- usa IntersectionObserver/ResizeObserver quando necessário;
- respeita prefers-reduced-motion.

## Áudio
Criar/usar um único controle visual V42 para o soundtrack de cada universo.
Não usar autoplay.
O som começa somente após gesto do usuário.
Volume baixo.
Loop contínuo.

Os controles nativos antigos podem continuar existindo internamente, mas não devem gerar dois controles visíveis conflitantes.

## Cadeia de Ataque
A imagem canônica em português:
`cybershield-cadeia-seven-stages-ptbr.png`

é a referência principal.
Não criar uma segunda imagem equivalente em inglês.

## Playbook
Manter a transformação V40:
- Protocol Airspace
- seis protocolos orbitais
- Knowledge Capsules
- detalhes contextuais

A arte `cybershield-archive.jpg` deve aparecer como parte da narrativa, e não apenas como fundo transparente.

## Segurança da integração
Não substituir o `playbook.html` ou qualquer página inteira sem comparar primeiro.
Preservar a experiência Protege V32/V38.
Preservar navegação, Vercel e assets compartilhados.

## Testes
Executar `node --check` nos JS finais.
Verificar IDs duplicados, links quebrados, assets ausentes e scripts duplicados.
Testar 390x844, 430x932, 768x1024, 1280x720 e 1536x864.

Criar branch:
`feat/superproducao-cybershield-v42`

Commit:
`feat: integrate artwork-led CyberShield V42`

Abrir PR para `main`.

Não declarar sucesso se o deploy ou os testes não tiverem sido realmente executados.
