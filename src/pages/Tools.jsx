import { useMemo, useState } from "react";
import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";

const questions = [
  { id: "q1", legend: "Você reutiliza a mesma senha em mais de um serviço?", options: [["Sim", 2], ["Não", 0]] },
  { id: "q2", legend: "Você mantém backups testados dos arquivos importantes?", options: [["Sim", 0], ["Não", 2]] },
  { id: "q3", legend: "Antes de clicar, você confere o domínio e o contexto?", options: [["Sempre", 0], ["Nem sempre", 1]] },
  { id: "q4", legend: "Suas contas críticas usam autenticação em duas etapas?", options: [["Sim", 0], ["Ainda não", 2]] },
  { id: "q5", legend: "Seu projeto protege secrets e roda análise de código?", options: [["Sim", 0], ["Ainda não", 2]] },
];

const SHORTENERS = ["bit.ly", "tinyurl.com", "goo.gl", "is.gd", "cutt.ly", "encurtador.com.br", "t.co"];

function passwordStrength(value) {
  if (!value) return { score: 0, label: "aguardando entrada", rules: {} };
  const rules = {
    length: value.length >= 12,
    variety: /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value) && /[^\w\s]/.test(value),
    unique: !/^(?:\d+|[a-z]+|[A-Z]+)$/.test(value) && !/(.)\1{2,}/.test(value) && !/(123|abc|qwer|senha|password)/i.test(value),
  };
  let score = Object.values(rules).filter(Boolean).length;
  if (value.length >= 16) score += 1;
  score = Math.min(score, 4);
  const labels = ["muito fraca", "fraca", "razoável", "forte", "muito forte"];
  return { score, label: labels[score], rules };
}

function analyseUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  let url;
  try {
    url = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
  } catch {
    return { invalid: true, signals: [], host: trimmed };
  }
  const host = url.hostname.toLowerCase();
  const signals = [];
  if (url.protocol !== "https:") signals.push("Não usa HTTPS: o tráfego pode ser lido ou alterado no caminho.");
  if (SHORTENERS.some((short) => host === short || host.endsWith(`.${short}`)))
    signals.push("É um encurtador: o destino real está escondido até você abrir.");
  if (host.startsWith("xn--") || host.includes(".xn--"))
    signals.push("Contém punycode: pode imitar letras de uma marca conhecida.");
  if (/\d/.test(host.replace(/\.\d+$/, "")) && /[a-z]/.test(host))
    signals.push("Mistura números e letras no domínio, padrão comum em imitações (ex.: micros0ft).");
  if (host.split(".").length > 3) signals.push("Muitos subdomínios: a marca pode estar só no começo, não no domínio real.");
  if (host.includes("-") && /(login|secure|verify|banco|conta|suporte|update)/.test(host))
    signals.push("Palavras de urgência ou marca dentro de um domínio com hífen.");
  if (url.username) signals.push("Há credenciais embutidas na URL, truque clássico de ofuscação.");
  const registrable = host.split(".").slice(-2).join(".");
  return { invalid: false, host, registrable, signals };
}

function generatePassword(length = 18) {
  const alphabet = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*?-_";
  const bytes = new Uint32Array(length);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

export default function Tools() {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [generated, setGenerated] = useState("");
  const [link, setLink] = useState("");

  const strength = useMemo(() => passwordStrength(password), [password]);
  const linkReport = useMemo(() => analyseUrl(link), [link]);

  const submit = (event) => {
    event.preventDefault();
    const score = questions.reduce((total, question) => total + (answers[question.id] ?? 0), 0);
    if (score <= 1) {
      setResult({
        title: "Postura madura.",
        copy: "Sua rotina já cobre o básico bem feito. O próximo passo é revisar acessos antigos e testar a restauração do backup.",
      });
    } else if (score <= 4) {
      setResult({
        title: "Boa base, com brechas.",
        copy: "Priorize senha única por serviço e autenticação em duas etapas nas contas de e-mail e banco — é o maior ganho com o menor esforço.",
      });
    } else {
      setResult({
        title: "Risco concentrado.",
        copy: "Comece por três ações: gerenciador de senhas, MFA nas contas críticas e um backup testado fora do computador.",
      });
    }
  };

  return (
    <>
      <PageHero
        index="05"
        eyebrow="FERRAMENTAS DE APRENDIZADO"
        title={
          <>
            Teste sua postura.
            <br />
            <span>Sem enviar seus dados.</span>
          </>
        }
        lead="As quatro ferramentas desta página rodam inteiramente no seu navegador. Nada é enviado, salvo em servidor ou compartilhado."
      />

      <section className="section section-wrap tools-section">
        <div className="tools-grid">
          <Reveal as="article" className="tool-card diagnostic-card">
            <div className="tool-heading">
              <span className="tool-icon">◒</span>
              <div>
                <p className="section-index">AUTOAVALIAÇÃO</p>
                <h2>Qual é seu próximo risco?</h2>
              </div>
            </div>
            <form onSubmit={submit}>
              {questions.map((question) => (
                <fieldset key={question.id}>
                  <legend>{question.legend}</legend>
                  {question.options.map(([label, value]) => (
                    <label key={label}>
                      <input
                        type="radio"
                        name={question.id}
                        required
                        onChange={() => setAnswers((current) => ({ ...current, [question.id]: value }))}
                      />{" "}
                      {label}
                    </label>
                  ))}
                </fieldset>
              ))}
              <button className="button button-primary button-full" type="submit">
                Ver recomendação <span>→</span>
              </button>
            </form>
            {result ? (
              <div className="tool-result">
                <span className="result-mark">✓</span>
                <div>
                  <b>{result.title}</b>
                  <p>{result.copy}</p>
                </div>
              </div>
            ) : null}
          </Reveal>

          <Reveal as="article" className="tool-card" delay={70}>
            <div className="tool-heading">
              <span className="tool-icon tool-icon-purple">✦</span>
              <div>
                <p className="section-index">HIGIENE DIGITAL</p>
                <h2>Uma senha aguenta o teste?</h2>
              </div>
            </div>
            <p className="tool-intro">Digite uma senha fictícia para avaliar a força localmente. Nunca use uma senha real aqui.</p>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="ex.: uma frase longa..."
                autoComplete="off"
              />
              <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label="Mostrar ou ocultar senha">
                ◉
              </button>
            </div>
            <div className="strength-meter" data-level={strength.score}>
              {[0, 1, 2, 3].map((index) => (
                <i key={index} />
              ))}
            </div>
            <div className="strength-caption">
              <span>{strength.label}</span>
              <span>{strength.score} / 4</span>
            </div>
            <ul className="password-rules">
              <li className={strength.rules.length ? "is-valid" : undefined}>12+ caracteres</li>
              <li className={strength.rules.variety ? "is-valid" : undefined}>mistura de caracteres</li>
              <li className={strength.rules.unique ? "is-valid" : undefined}>não é uma sequência óbvia</li>
            </ul>
            <div className="generator">
              <button type="button" className="button button-secondary button-full" onClick={() => setGenerated(generatePassword())}>
                Gerar senha aleatória <span>↻</span>
              </button>
              {generated ? <code className="generated-value">{generated}</code> : null}
            </div>
            <p className="privacy-note">↳ Nada é salvo ou enviado. A geração usa a API de criptografia do navegador.</p>
          </Reveal>

          <Reveal as="article" className="tool-card tool-card-wide" delay={140}>
            <div className="tool-heading">
              <span className="tool-icon tool-icon-orange">⌕</span>
              <div>
                <p className="section-index">LEITURA DE LINK</p>
                <h2>O que este endereço está tentando esconder?</h2>
              </div>
            </div>
            <p className="tool-intro">
              Cole um link suspeito (sem abrir) e veja os sinais de alerta. A análise é apenas textual e local: o
              endereço não é acessado nem enviado a lugar nenhum.
            </p>
            <div className="password-field">
              <input
                type="text"
                value={link}
                onChange={(event) => setLink(event.target.value)}
                placeholder="ex.: http://entrega-brasil.info/atualizar"
                autoComplete="off"
                spellCheck="false"
              />
            </div>
            {linkReport ? (
              linkReport.invalid ? (
                <p className="link-verdict">Não consegui interpretar isso como um endereço. Confira se copiou o link inteiro.</p>
              ) : (
                <div className="link-report">
                  <p className="link-verdict">
                    domínio real: <b>{linkReport.registrable}</b> <i>({linkReport.host})</i>
                  </p>
                  {linkReport.signals.length ? (
                    <ul className="link-signals">
                      {linkReport.signals.map((signal) => (
                        <li key={signal}>{signal}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="link-ok">
                      Nenhum sinal textual de alerta. Isso não garante que o site seja legítimo — confirme se o domínio
                      é mesmo o da empresa e prefira abrir pelo aplicativo oficial.
                    </p>
                  )}
                </div>
              )
            ) : null}
          </Reveal>
        </div>
      </section>
    </>
  );
}
