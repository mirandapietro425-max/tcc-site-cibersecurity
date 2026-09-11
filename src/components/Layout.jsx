import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { navItems } from "../data/content.js";

function Brand({ onClick }) {
  return (
    <Link className="brand" to="/" onClick={onClick} aria-label="CyberShield, voltar ao início">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none">
          <path d="M16 3 5 7.7v7.5C5 21.8 9.5 27.8 16 29c6.5-1.2 11-7.2 11-13.8V7.7L16 3Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="m10.5 16 3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span>
        CYBER<span className="brand-slash">/</span>SHIELD
      </span>
    </Link>
  );
}

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [location.pathname]);

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <div className="scroll-progress" style={{ width: `${progress}%` }} aria-hidden="true" />
      <div className="site-noise" aria-hidden="true" />

      <header className="site-header">
        <nav className="nav container" aria-label="Navegação principal">
          <Brand />
          <div className={menuOpen ? "nav-links is-open" : "nav-links"} id="nav-links">
            {navItems.slice(1).map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? "is-active" : undefined)}>
                {item.label}
              </NavLink>
            ))}
          </div>
          <Link className="nav-button" to="/ferramentas">
            Avaliar agora <span>↗</span>
          </Link>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="nav-links"
            aria-label="Abrir menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </nav>
      </header>

      <main id="conteudo">
        <Outlet />
      </main>

      <footer className="footer container">
        <Brand />
        <p>Um guia educativo baseado no TCC “Métodos de segurança na internet”.</p>
        <span className="footer-meta">
          © 2026 · PIETRO DE MORAES MIRANDA ·{" "}
          <button type="button" className="link-button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            voltar ao topo ↑
          </button>
        </span>
      </footer>
    </>
  );
}
