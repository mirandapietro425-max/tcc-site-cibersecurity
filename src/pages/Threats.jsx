import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";
import ThreatCanvas from "../components/ThreatCanvas.jsx";
import { threatGroups, threats } from "../data/content.js";

export default function Threats() {
  const [filter, setFilter] = useState("all");
  const [activeId, setActiveId] = useState(threats[0].id);

  const visible = useMemo(
    () => (filter === "all" ? threats : threats.filter((threat) => threat.group === filter)),
    [filter],
  );
  const active = threats.find((threat) => threat.id === activeId) ?? threats[0];
  const handleSelect = useCallback((id) => setActiveId(id), []);

  const changeFilter = (id) => {
    setFilter(id);
    const first = id === "all" ? threats[0] : threats.find((threat) => threat.group === id);
    if (first) setActiveId(first.id);
  };

  return (
    <>
      <PageHero
        index="01"
        eyebrow="MAPA DE AMEAÇAS"
        title={
          <>
            Conheça o comportamento.
            <br />
            <span>Antecipe a defesa.</span>
          </>
        }
        lead="Malware explora tecnologia. Engenharia social explora pressa e confiança. Identificar o padrão muda a resposta — e é isso que o radar abaixo treina."
      />

      <section className="section-wrap threat-radar-wrap">
        <Reveal className="threat-radar">
          <ThreatCanvas nodes={visible} activeId={activeId} onSelect={handleSelect} />
          <p className="radar-note">
            Radar ilustrativo: os pulsos representam o comportamento das ameaças estudadas no TCC. Nenhum dado real de
            ataque é coletado ou exibido.
          </p>
        </Reveal>
      </section>

      <section className="section section-wrap threats-section">
        <Reveal className="threat-controls" role="group" aria-label="Filtrar ameaças">
          {threatGroups.map((group) => {
            const count = group.id === "all" ? threats.length : threats.filter((t) => t.group === group.id).length;
            return (
              <button
                key={group.id}
                type="button"
                className={filter === group.id ? "filter-button is-active" : "filter-button"}
                onClick={() => changeFilter(group.id)}
              >
                {group.label} <span>{String(count).padStart(2, "0")}</span>
              </button>
            );
          })}
        </Reveal>

        <div className="threat-layout">
          <div className="threat-grid">
            {visible.map((threat) => (
              <button
                key={threat.id}
                type="button"
                className={threat.id === activeId ? "threat-card is-selected" : "threat-card"}
                onClick={() => setActiveId(threat.id)}
                aria-pressed={threat.id === activeId}
              >
                <span className={`threat-type tone-${threat.tone}`}>
                  {threat.label} / {threat.risk.toUpperCase()}
                </span>
                <span className="threat-symbol">{threat.symbol}</span>
                <h3>{threat.title}</h3>
                <p>{threat.text}</p>
                <span className="threat-action">ver defesa →</span>
              </button>
            ))}
          </div>

          <aside className="threat-detail" aria-live="polite">
            <p className="detail-label">
              DEFESA RECOMENDADA <span>●</span>
            </p>
            <h3>{active.title}</h3>
            <p className="detail-headline">{active.headline}</p>
            <p>{active.text}</p>
            <p className="detail-vector">
              <b>vetor comum</b> {active.vector}
            </p>
            <ul>
              {active.defense.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="detail-meter">
              <span>camadas de defesa</span>
              <div>
                {active.defense.map((item) => (
                  <i key={item} />
                ))}
              </div>
            </div>
            <Link className="text-link" to="/laboratorio">
              treinar esta decisão <b>→</b>
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
