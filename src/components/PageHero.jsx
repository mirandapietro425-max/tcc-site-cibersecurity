import Reveal from "./Reveal.jsx";

export default function PageHero({ index, eyebrow, title, lead, aside }) {
  return (
    <section className="page-hero section-wrap">
      <Reveal className="page-hero-copy">
        <p className="section-index">
          {index} / {eyebrow}
        </p>
        <h1>{title}</h1>
        <p className="hero-lead">{lead}</p>
      </Reveal>
      {aside ? (
        <Reveal className="page-hero-aside" delay={90}>
          {aside}
        </Reveal>
      ) : null}
    </section>
  );
}
