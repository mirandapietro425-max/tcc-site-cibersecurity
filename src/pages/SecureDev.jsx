import { useEffect, useMemo, useState } from "react";
import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";
import { devStages } from "../data/content.js";

const STORAGE_KEY = "cybershield:secure-dev-checklist";

const allItems = devStages.flatMap((stage) => stage.checklist.map((item, index) => `${stage.id}-${index}`));

function loadChecked() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => allItems.includes(id)) : [];
  } catch {
    return [];
  }
}

export default function SecureDev() {
  const [stageId, setStageId] = useState(devStages[0].id);
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    setChecked(loadChecked());
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
    } catch {
      /* armazenamento indisponível: o checklist segue funcionando na sessão */
    }
  }, [checked]);

  const stage = devStages.find((item) => item.id === stageId) ?? devStages[0];
  const progress = useMemo(() => Math.round((checked.length / allItems.length) * 100), [checked]);

  const toggle = (id) =>
    setChecked((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  return (
    <>
      <PageHero
        index="04"
        eyebrow="PIPELINE DEV SEGURO"
        title={
          <>
            Um deploy seguro
            <br />
            <span>é construído em etapas.</span>
          </>
        }
        lead="Segurança em software não é uma revisão no fim: é uma decisão repetida em cada etapa. O checklist abaixo fica salvo apenas no seu navegador."
      />

      <section className="section section-wrap dev-section">
        <Reveal className="dev-workbench">
          <div className="dev-tabs" role="tablist" aria-label="Etapas do desenvolvimento seguro">
            {devStages.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={item.id === stage.id}
                className={item.id === stage.id ? "dev-tab is-active" : "dev-tab"}
                onClick={() => setStageId(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="dev-panel">
            <div className="dev-panel-copy">
              <p className="terminal-label">
                <span>●</span> SECURE_PIPELINE / <b>{stage.stage}</b>
              </p>
              <h2>{stage.title}</h2>
              <p>{stage.copy}</p>
              <pre className="dev-terminal" aria-label={`Comandos ilustrativos da etapa ${stage.title}`}>
                {stage.lines.join("\n")}
              </pre>
            </div>

            <div className="checklist">
              {stage.checklist.map((item, index) => {
                const id = `${stage.id}-${index}`;
                return (
                  <label key={id} className={checked.includes(id) ? "is-checked" : undefined}>
                    <input type="checkbox" checked={checked.includes(id)} onChange={() => toggle(id)} />
                    <span>{item}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="checklist-progress">
            <span>PROGRESSO DA REVISÃO</span>
            <div>
              <i style={{ width: `${progress}%` }} />
            </div>
            <b>
              {checked.length} / {allItems.length}
            </b>
          </div>
        </Reveal>

        <Reveal className="security-notes">
          <span>
            × sem <code>console.log</code> sensível
          </span>
          <span>
            × sem <code>.map</code> público
          </span>
          <span>✓ HTTPS + HSTS</span>
          <span>✓ CSP e headers de segurança</span>
          <span>✓ logs e resposta a incidentes</span>
        </Reveal>
      </section>
    </>
  );
}
