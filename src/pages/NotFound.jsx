import { Link } from "react-router-dom";
import Reveal from "../components/Reveal.jsx";

export default function NotFound() {
  return (
    <section className="section section-wrap not-found">
      <Reveal>
        <p className="section-index">ERRO 404</p>
        <h1>
          Esta rota não existe.
          <br />
          <span>Boa hora para conferir o endereço.</span>
        </h1>
        <p className="hero-lead">
          Verificar a URL antes de continuar é o mesmo hábito que evita phishing. Volte para o início e siga por um
          caminho conhecido.
        </p>
        <div className="hero-actions">
          <Link className="button button-primary" to="/">
            Voltar ao início <span>→</span>
          </Link>
          <Link className="button button-secondary" to="/ameacas">
            Ver o mapa de ameaças <span>↗</span>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
