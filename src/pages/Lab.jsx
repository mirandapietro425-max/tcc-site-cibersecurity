import { useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";
import { labScenarios } from "../data/content.js";

const VERDICT_LABEL = {
  correct: "decisão segura",
  warning: "parcialmente seguro",
  danger: "decisão arriscada",
};

export default function Lab() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);

  const scenario = labScenarios[step];
  const answer = answers[scenario.id];
  const chosen = answer ? scenario.options.find((option) => option.id === answer) : null;
  const score = Object.entries(answers).reduce((total, [id, optionId]) => {
    const found = labScenarios.find((item) => item.id === id)?.options.find((option) => option.id === optionId);
    if (found?.verdict === "correct") return total + 2;
    if (found?.verdict === "warning") return total + 1;
    return total;
  }, 0);
  const maxScore = labScenarios.length * 2;

  const choose = (optionId) => {
    if (answer) return;
    setAnswers((current) => ({ ...current, [scenario.id]: optionId }));
  };

  const next = () => {
    if (step + 1 >= labScenarios.length) {
      setFinished(true);
      return;
    }
    setStep(step + 1);
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
    setFinished(false);
  };

  const summary =
    score >= maxScore * 0.85
      ? "Você já verifica antes de agir. Leve a regra dos três segundos para as pessoas ao seu redor."
      : score >= maxScore * 0.55
        ? "Boa base. O ponto de atenção é trocar de canal para confirmar, em vez de responder no mesmo lugar."
        : "A urgência ainda está vencendo a verificação. Antes de clicar, pausar e confirmar na fonte oficial resolve a maioria dos casos.";

  return (
    <>
      <PageHero
        index="02"
        eyebrow="LABORATÓRIO DE GOLPES"
        title={
          <>
            O ataque pede um clique.
            <br />
            <span>A defesa pede uma pausa.</span>
          </>
        }
        lead="Cinco cenários simulados de engenharia social. Escolha o que você faria e veja os sinais que denunciavam o golpe. Nada aqui é real: nenhum link funciona e nenhum dado é enviado."
      />

      <section className="section section-wrap lab-section">
        <Reveal className="lab-progress">
          <div className="lab-steps">
            {labScenarios.map((item, index) => (
              <span
                key={item.id}
                className={`lab-step ${index === step ? "is-current" : ""} ${answers[item.id] ? "is-done" : ""}`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            ))}
          </div>
          <b>
            pontuação {score} / {maxScore}
          </b>
        </Reveal>

        {!finished ? (
          <Reveal className="lab-stage">
            <article className="lab-message">
              <header>
                <span className="lab-channel">{scenario.channel}</span>
                <span className="lab-dots" aria-hidden="true">
                  ● ● ●
                </span>
              </header>
              <p className="lab-from">{scenario.from}</p>
              <h2>{scenario.subject}</h2>
              <p className="lab-body">{scenario.body}</p>
              {chosen ? (
                <ul className="lab-flags">
                  {scenario.flags.map((flag) => (
                    <li key={flag}>{flag}</li>
                  ))}
                </ul>
              ) : (
                <p className="lab-hint">↳ observe remetente, urgência e o que está sendo pedido.</p>
              )}
            </article>

            <div className="lab-choices">
              <p className="section-index">{scenario.question}</p>
              {scenario.options.map((option) => {
                const selected = answer === option.id;
                const revealed = Boolean(answer);
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`lab-option ${revealed ? `verdict-${option.verdict}` : ""} ${selected ? "is-selected" : ""}`}
                    onClick={() => choose(option.id)}
                    disabled={revealed}
                  >
                    <b>{option.text}</b>
                    {revealed ? (
                      <small>
                        <i>{VERDICT_LABEL[option.verdict]}</i> — {option.feedback}
                      </small>
                    ) : null}
                  </button>
                );
              })}
              {answer ? (
                <button type="button" className="button button-primary" onClick={next}>
                  {step + 1 >= labScenarios.length ? "Ver resultado" : "Próximo cenário"} <span>→</span>
                </button>
              ) : null}
            </div>
          </Reveal>
        ) : (
          <Reveal className="lab-result">
            <p className="section-index">RESULTADO DA RODADA</p>
            <h2>
              {score} <small>/ {maxScore}</small>
            </h2>
            <p>{summary}</p>
            <div className="pause-rule">
              <span className="pause-icon">Ⅱ</span>
              <div>
                <b>Regra dos três segundos</b>
                <p>Pause. Confira o domínio, confirme por outro canal e só então decida.</p>
              </div>
              <span className="pause-rule-number">03″</span>
            </div>
            <div className="hero-actions">
              <button type="button" className="button button-primary" onClick={restart}>
                Refazer a rodada <span>↻</span>
              </button>
              <Link className="button button-secondary" to="/ferramentas">
                Testar minha postura <span>→</span>
              </Link>
            </div>
          </Reveal>
        )}
      </section>
    </>
  );
}
