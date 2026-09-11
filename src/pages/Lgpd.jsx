import { useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";
import { dataPhases } from "../data/content.js";

const rights = [
  ["Confirmação e acesso", "Saber se há tratamento e obter uma cópia dos dados."],
  ["Correção", "Atualizar dados incompletos, inexatos ou desatualizados."],
  ["Anonimização ou eliminação", "Pedir a remoção de dados desnecessários ou excessivos."],
  ["Portabilidade", "Levar os dados para outro fornecedor de serviço."],
  ["Informação sobre compartilhamento", "Saber com quem os dados foram compartilhados."],
  ["Revogação do consentimento", "Retirar a autorização a qualquer momento."],
];

export default function Lgpd() {
  const [phaseId, setPhaseId] = useState(dataPhases[0].id);
  const phase = dataPhases.find((item) => item.id === phaseId) ?? dataPhases[0];
  const phaseIndex = dataPhases.findIndex((item) => item.id === phase.id);

  return (
    <>
      <PageHero
        index="03"
        eyebrow="JORNADA LGPD"
        title={
          <>
            Dados não são só um ativo.
            <br />
            <span>São uma responsabilidade.</span>
          </>
        }
        lead="A LGPD aproxima arquitetura e ética: coletar o necessário, explicar o tratamento, proteger durante o uso e eliminar quando não houver motivo para manter."
      />

      <section className="section section-wrap lgpd-section">
        <Reveal className="data-journey">
          <div className="journey-track" role="tablist" aria-label="Ciclo de vida do dado">
            <div className="journey-line" aria-hidden="true">
              <span style={{ width: `${(phaseIndex / (dataPhases.length - 1)) * 100}%` }} />
            </div>
            {dataPhases.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={item.id === phase.id}
                className={item.id === phase.id ? "journey-node is-active" : "journey-node"}
                onClick={() => setPhaseId(item.id)}
              >
                <i aria-hidden="true" />
                <b>{item.number}</b>
                <span>{item.title}</span>
              </button>
            ))}
          </div>

          <article className="journey-panel" aria-live="polite">
            <p className="section-index">FASE {phase.number}</p>
            <h2>{phase.question}</h2>
            <p>{phase.copy}</p>
            <div className="panel-tools">
              {phase.controls.map((control) => (
                <span key={control}>{control}</span>
              ))}
            </div>
            <p className="journey-law">{phase.lgpd}</p>
          </article>
        </Reveal>
      </section>

      <section className="section section-wrap">
        <Reveal className="section-heading">
          <p className="section-index">DIREITOS DO TITULAR</p>
          <h2>
            A lei devolve o controle
            <br />
            <span>para quem é dono do dado.</span>
          </h2>
          <p>Todo produto que trata dados pessoais precisa ter um caminho claro para cada um destes pedidos.</p>
        </Reveal>
        <div className="rights-grid">
          {rights.map(([title, copy], index) => (
            <Reveal key={title} className="right-card" delay={index * 60}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section section-wrap">
        <div className="lgpd-bottom">
          <Reveal as="article" className="lgpd-callout">
            <p className="section-index">ATENÇÃO CORPORATIVA</p>
            <h3>BYOD amplia a superfície de ataque.</h3>
            <p>
              Equipamentos pessoais no trabalho remoto exigem política clara, segmentação, gestão de dispositivos e uma
              visão de Zero Trust: nenhum acesso é confiável só por estar dentro da rede.
            </p>
            <Link to="/ferramentas">Checar maturidade →</Link>
          </Reveal>
          <Reveal as="article" className="lgpd-callout callout-green" delay={80}>
            <p className="section-index">PRINCÍPIO DE PROJETO</p>
            <h3>Privacy by Design</h3>
            <p>
              Privacidade não é correção pós-lançamento. Ela é configuração padrão do produto e do processo, decidida
              junto com a arquitetura.
            </p>
            <div className="privacy-stamp">
              DEFAULT
              <br />
              <b>PRIVATE</b>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
