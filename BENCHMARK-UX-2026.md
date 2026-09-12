# Benchmark UX/UI global — CyberShield 2026

## O que foi observado

A pesquisa comparou referências de cibersegurança e plataformas digitais de diferentes regiões, buscando padrões de experiência, arquitetura de informação e apresentação visual — não cópia de identidade visual, código ou conteúdo.

| Referência | Região | Padrão útil | Aplicação no CyberShield |
|---|---|---|---|
| Palo Alto Networks — Security by Design | EUA | Complexidade precisa virar contexto, hierarquia e ações rápidas; informação deve ser organizada para reduzir ruído | Seções com visão geral, cards curtos, estado ativo, ação recomendada e feedback imediato |
| Cloudflare | Global / EUA | Interface operacional consistente e simplificação de workflows | Sistema visual centralizado e navegação entre Radar, Playbook, Laboratório e Privacidade |
| MITRE ATT&CK Navigator | EUA | Visualização para explorar técnicas, cobertura e lacunas | Exploração por módulos, cadeia de ataque e blocos de defesa |
| NIST CSF 2.0 | EUA | Funções organizadas como um vocabulário de risco e defesa | Chips/estados e organização por Governar, Identificar, Proteger, Detectar, Responder e Recuperar |
| NCSC — Cyber Security Culture Principles | Reino Unido | People-centred design, reduzir esforço, prevenir erros e testar continuamente | CTAs mais explícitos, feedback visual, acessibilidade e experiências educativas |
| NCSC — Secure Design Principles | Reino Unido | Contexto, threat modelling, risco aceitável e responsabilidades desde o design | Bloco “TCC ampliado” e arquitetura do Playbook |
| ENISA | União Europeia | Organização por públicos e interfaces mais fáceis de navegar | Separação de jornadas e navegação por experiências |
| Canadian Centre for Cyber Security | Canadá | Checklists práticos para desenvolver e manter sites com segurança | Checklist de desenvolvimento e Playbook |
| Cyber.gov.au | Austrália | Orientação por tarefa e comunicação de práticas acionáveis | Estrutura “sinal → decisão → ação” e conteúdo curto |

## Linguagem visual

O benchmark visual também observou trabalhos de interface em Behance/Dribbble e dashboards de segurança: fundos escuros, superfícies translúcidas, acentos neon, tipografia grande, diagramas, cards e dashboards ajudam a transmitir uma estética técnica. A implementação usa apenas uma identidade própria e CSS local.

## Decisões implementadas

1. Variáveis CSS no `:root` controlam cores, bordas, sombras, tipografia e raios.
2. Gradientes são reservados para hero, status e ações, evitando pintar todo o site com efeitos.
3. Estados `hover`, `focus-visible`, `selected`, `active` e progresso são explícitos.
4. O conteúdo foi distribuído em camadas para reduzir paredes de texto.
5. A home ganhou um bloco adicional baseado diretamente no TCC.
6. Radar e Playbook passaram a existir como páginas coerentes com a navegação que já estava presente no HTML original.
7. O Laboratório e a Jornada de Privacidade ganharam scripts locais para interações educativas.
8. Foi mantido o caráter educativo; nenhum componente simula ataque real ou coleta telemetria.

## Fontes principais

- Palo Alto Networks. “Security by Design — UX and AI in Modern Cybersecurity.” https://www.paloaltonetworks.com/blog/2025/07/security-by-design-ux-ai-modern-cybersecurity/
- Cloudflare. “Security Architecture” / “Design Guides.” https://developers.cloudflare.com/reference-architecture/architectures/security/ ; https://developers.cloudflare.com/reference-architecture/design-guides/
- MITRE. “ATT&CK Data & Tools.” https://attack.mitre.org/resources/working-with-attack/
- NIST. “The NIST Cybersecurity Framework (CSF) 2.0.” https://www.nist.gov/cyberframework
- NCSC (UK). “Cyber security culture principles.” https://www.ncsc.gov.uk/collection/cyber-security-culture-principles/putting-people-at-the-heart-of-an-organisations-approach-to-cyber-security
- NCSC (UK). “Secure design principles.” https://www.ncsc.gov.uk/collection/cyber-security-design-principles
- ENISA. “Driving Change, Building Resilience: ENISA’s revised Strategy and Structure.” https://www.enisa.europa.eu/news/driving-change-building-resilience-enisas-revised-strategy-and-structure
- Canadian Centre for Cyber Security. “Security considerations when developing and managing your website.” https://www.cyber.gc.ca/en/guidance/security-considerations-when-developing-and-managing-your-website-itsap60005
- Cyber.gov.au. “Secure your user account.” https://www.cyber.gov.au/protect-yourself/securing-your-devices/how-secure-your-device/secure-your-user-account
- ANPD. “Aviso de Privacidade” e orientações sobre cookies/LGPD. https://www.gov.br/anpd/

As referências do TCC continuam no próprio projeto. O TCC aborda, entre outros pontos, ameaças digitais, LGPD, BYOD, boas práticas, Hexagrama Parkeriano, segurança de websites, Defesa em Profundidade, APIs, Source Maps, logs e monitoramento.
