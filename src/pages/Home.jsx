import { useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal.jsx";
import NetworkArt from "../components/NetworkArt.jsx";
import { pillars } from "../data/content.js";

const experiences = [
  {
    to: "/ameacas",
    number: "01",
    kicker: "MAPA DE AMEAÇAS",
    title: "O risco não fica parado",
    copy: "Nove ameaças do TCC em um radar animado, com vetor de entrada e defesa recomendada.",
    modifier: "card-map",
  },
  {
    to: "/laboratorio",
    number: "02",
    kicker: "LABORATÓRIO DE GOLPES",
    title: "A decisão acontece em segundos",
    copy: "Cinco cenários reais de engenharia social, feedback por escolha e pontuação no fim.",
    modifier: "card-lab",
  },
  {
    to: "/lgpd",
    number: "03",
    kicker: "JORNADA LGPD",
    title: "Privacidade também é arquitetura",
    copy: "O ciclo de vida do dado — coletar, usar, proteger e descartar — com o artigo correspondente.",
    modifier: "card-data",
  },
  {
    to: "/dev-seguro",
    number: "04",
    kicker: "PIPELINE SEGURO",
    title: "Código seguro é processo",
    copy: "Modelagem de ameaças, construção e publicação com checklist salvo no seu navegador.",
    modifier: "card-dev",
  },
];

export default function Home() {
  const [activePillar, setActivePillar] = useState(pillars[0].id);
  const pillar = pillars.find((item) => item.id === activePillar) ?? pillars[0];

  return (
    <>
      <section className="hero section-wrap">
        <Reveal className="hero-copy">
          <p className="kicker">
            <span className="pulse-dot" /> TCC · MÉTODOS DE SEGURANÇA NA INTERNET
          </p>
          <h1>
            Segurança digital começa <em>antes</em> do próximo clique.
          </h1>
          <p className="hero-lead">
            Uma experiência interativa para entender ameaças, treinar decisões, respeitar a LGPD e construir software
            seguro desde a primeira linha.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/laboratorio">
              Entrar no laboratório <span>→</span>
            </Link>
            <Link className="button button-secondary" to="/ameacas">
              Ver o mapa de ameaças <span>↓</span>
            </Link>
          </div>
          <div className="hero-proof">
            <div>
              <strong>06</strong>
              <span>experiências interativas</span>
            </div>
            <div>
              <strong>09</strong>
              <span>ameaças mapeadas</span>
            </div>
            <div>
              <strong>05</strong>
              <span>cenários de decisão</span>
            </div>
          </div>
        </Reveal>

        <Reveal className="hero-visual" delay={90} aria-label="Mapa visual da defesa em profundidade">
          <div className="visual-label visual-label-top">
            DEFESA EM PROFUNDIDADE <span>↗</span>
          </div>
          <div className="orbit orbit-outer">
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="orbit orbit-inner">
            <i />
            <i />
          </div>
          <div className="shield-core">
            <svg viewBox="0 0 80 80" fill="none" aria-hidden="true">
              <path d="M40 8 15 18v17c0 16.4 10.9 29.9 25 36 14.1-6.1 25-19.6 25-36V18L40 8Z" stroke="currentColor" strokeWidth="2" />
              <path d="m27 40 8 8 18-20" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>
              PROTEÇÃO
              <br />
              <b>ATIVA</b>
            </span>
          </div>
          <span className="orbit-tag tag-people">
            PESSOAS <small>01</small>
          </span>
          <span className="orbit-tag tag-company">
            EMPRESAS <small>02</small>
          </span>
          <span className="orbit-tag tag-code">
            CÓDIGO <small>03</small>
          </span>
          <span className="orbit-tag tag-data">
            DADOS <small>04</small>
          </span>
          <div className="visual-footer">
            <span className="signal-bars">
              <i />
              <i />
              <i />
              <i />
            </span>{" "}
            CAMADAS CONECTADAS <span>●</span>
          </div>
        </Reveal>
      </section>

      <div className="signal-strip" aria-label="Princípios do guia">
        <div className="container signal-strip-inner">
          <span>CONFIDENCIALIDADE</span>
          <i />
          <span>INTEGRIDADE</span>
          <i />
          <span>DISPONIBILIDADE</span>
          <i />
          <span>PRIVACY BY DESIGN</span>
          <i />
          <span>MENOR PRIVILÉGIO</span>
          <i />
          <span>ZERO TRUST</span>
        </div>
      </div>

      <section className="section section-wrap">
        <Reveal className="section-heading">
          <p className="section-index">01 / EXPERIÊNCIAS</p>
          <h2>
            Comece pelo risco.
            <br />
            <span>Termine com uma ação.</span>
          </h2>
          <p>
            Cada página é uma porta de entrada diferente para o mesmo objetivo: transformar teoria de segurança em
            decisão prática.
          </p>
        </Reveal>
        <div className="experience-grid">
          {experiences.map((item, index) => (
            <Reveal key={item.to} delay={index * 80}>
              <Link className={`experience-card ${item.modifier}`} to={item.to}>
                <span className="card-number">{item.number}</span>
                {item.modifier === "card-map" ? <NetworkArt variant="compact" /> : null}
                <div className="experience-card-copy">
                  <small>{item.kicker}</small>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                  <b>abrir experiência →</b>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section section-wrap pillars-section">
        <Reveal className="section-heading">
          <p className="section-index">02 / FUNDAMENTO</p>
          <h2>
            O equilíbrio entre o que
            <br />
            <span>deve ser protegido.</span>
          </h2>
          <p>A tríade CID transforma um conceito amplo em perguntas práticas para qualquer sistema.</p>
        </Reveal>
        <Reveal className="pillar-layout">
          <div className="pillar-menu" role="tablist" aria-label="Pilares de segurança">
            {pillars.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={item.id === activePillar}
                className={item.id === activePillar ? "pillar-tab is-active" : "pillar-tab"}
                onClick={() => setActivePillar(item.id)}
              >
                <span>{item.letter}</span>
                <b>{item.title}</b>
                <small>{item.short}</small>
              </button>
            ))}
          </div>
          <div className="pillar-panel" aria-live="polite">
            <div className="panel-orb" aria-hidden="true" />
            <span className="panel-kicker">
              PILAR <b>{pillar.number}</b>
            </span>
            <h3>{pillar.title}</h3>
            <p>{pillar.description}</p>
            <div className="panel-tools">
              {pillar.tools.map((tool) => (
                <span key={tool}>{tool}</span>
              ))}
            </div>
            <div className="panel-question">
              <span>↳</span>
              <b>{pillar.question}</b>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="final-cta">
        <div className="final-cta-grid container">
          <div>
            <p className="section-index">A DEFESA COMEÇA AGORA</p>
            <h2>
              Não espere o incidente
              <br />
              <em>para mudar o processo.</em>
            </h2>
          </div>
          <Link className="button button-primary" to="/ferramentas">
            Fazer minha avaliação <span>↗</span>
          </Link>
        </div>
      </section>
    </>
  );
}
