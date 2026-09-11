import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";
import { benchmark, references } from "../data/content.js";

export default function References() {
  return (
    <>
      <PageHero
        index="06"
        eyebrow="BENCHMARK E FONTES"
        title={
          <>
            O que o mundo já faz
            <br />
            <span>e o que foi aplicado aqui.</span>
          </>
        }
        lead="Antes de desenhar estas páginas, mapeamos referências internacionais e brasileiras de educação em segurança. A ideia não é copiar identidade ou conteúdo de ninguém, e sim entender quais padrões realmente ensinam."
      />

      <section className="section section-wrap">
        <div className="benchmark-list">
          {benchmark.map((item, index) => (
            <Reveal key={item.id} className="benchmark-row" delay={index * 60}>
              <div className="benchmark-pattern">
                <span className="section-index">PADRÃO {String(index + 1).padStart(2, "0")}</span>
                <h2>{item.pattern}</h2>
                <div className="benchmark-examples">
                  {item.examples.map((example) => (
                    <a key={example.url} href={example.url} target="_blank" rel="noopener noreferrer">
                      {example.name} ↗
                    </a>
                  ))}
                </div>
              </div>
              <div className="benchmark-copy">
                <p>
                  <b>O que observamos:</b> {item.finding}
                </p>
                <p>
                  <b>Como aplicamos:</b> {item.applied}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section section-wrap references-section">
        <Reveal className="references-intro">
          <p className="section-index">PARA IR ALÉM</p>
          <h2>
            Fontes técnicas para continuar
            <br />
            <span>a investigação.</span>
          </h2>
          <p>O conteúdo do TCC dialoga com referências técnicas e institucionais. Use-as para aprofundar cada decisão.</p>
        </Reveal>
        <Reveal className="reference-list" delay={80}>
          {references.map((item) => (
            <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer">
              <span>{item.org}</span>
              <b>{item.title}</b>
              <i>↗</i>
            </a>
          ))}
        </Reveal>
      </section>
    </>
  );
}
