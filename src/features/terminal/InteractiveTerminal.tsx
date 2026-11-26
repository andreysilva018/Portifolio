import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { PageHeading } from "../../components/PageHeading";
import { WorkspaceIcon } from "../../components/WorkspaceIcon";
import { commands, maxInputLength } from "./commands";
import { completions, parseCommand } from "./parser";
import { newSession, submitCommand } from "./session";
import { scenarios } from "./scenarios";
import "./terminal.css";

const responseLabels = {
  info: "Portfólio",
  simulation: "Resposta simulada",
  error: "Orientação",
  scenario: "Investigação simulada",
  evidence: "Evidência simulada",
  diagnosis: "Feedback diagnóstico simulado",
};

export function InteractiveTerminal() {
  const [session, setSession] = useState(newSession);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const active = session.investigation;
  const selectedId = pendingId ?? active?.scenario.id ?? scenarios[0].id;
  const selectedTitle = scenarios.find((item) => item.id === selectedId)?.title;
  const pending = Boolean(active && selectedId !== active.scenario.id);
  const phase = !active
    ? "Nenhum cenário ativo"
    : active.phase === "confirmed"
      ? "Diagnóstico confirmado"
      : "Investigação em andamento";
  const nextChecks =
    active?.scenario.checks
      .filter(([command]) => !active.observed.includes(command))
      .slice(0, 2) ?? [];
  const shortcuts = !active
    ? ["scenario list", "scenario help"]
    : active.phase === "confirmed"
      ? ["scenario status", "scenario reset"]
      : [
          "scenario status",
          ...nextChecks.map(([command]) => command),
          "scenario diagnose",
        ];
  const [input, setInput] = useState("");
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [suggestion, setSuggestion] = useState("");
  const draft = useRef("");
  const field = useRef<HTMLInputElement>(null);
  const output = useRef<HTMLDivElement>(null);
  const latest = session.entries.at(-1)?.response;

  useEffect(() => {
    if (output.current) output.current.scrollTop = output.current.scrollHeight;
  }, [session]);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    function keepPromptVisible() {
      const element = field.current;
      if (!element || document.activeElement !== element || !viewport) return;
      if (
        element.getBoundingClientRect().bottom >
        viewport.offsetTop + viewport.height - 12
      ) {
        element.scrollIntoView({ block: "center", behavior: "instant" });
      }
    }
    viewport.addEventListener("resize", keepPromptVisible);
    return () => viewport.removeEventListener("resize", keepPromptVisible);
  }, []);

  function fillCommand(command: string) {
    setInput(command);
    setHistoryIndex(null);
    setSuggestion("");
    draft.current = "";
    field.current?.focus();
  }

  function run(value: string) {
    const parsed = parseCommand(value);
    if (
      (parsed.kind === "allowed" && parsed.name === "reset") ||
      (parsed.kind === "scenario" &&
        (parsed.command.startsWith("scenario start ") ||
          parsed.command === "scenario exit" ||
          parsed.command === "scenario reset"))
    ) {
      setPendingId(null);
    }
    setSession((previous) => submitCommand(previous, value));
    setInput("");
    setHistoryIndex(null);
    setSuggestion("");
    draft.current = "";
    field.current?.focus();
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (input.trim()) run(input.trim());
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.nativeEvent.isComposing
    )
      return;
    if (event.key === "Tab") {
      const matches = completions(input);
      if (matches.length === 1 && matches[0] !== input.trim().toLowerCase()) {
        event.preventDefault();
        setInput(matches[0]);
        setSuggestion("Completado: " + matches[0]);
        setHistoryIndex(null);
      } else if (matches.length > 1) {
        setSuggestion("Opções: " + matches.join(", "));
      }
      return;
    }
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    const history = session.history;
    if (!history.length || (historyIndex === null && event.key === "ArrowDown"))
      return;

    event.preventDefault();
    setSuggestion("");
    if (historyIndex === null) draft.current = input;
    const index =
      (historyIndex ?? history.length) + (event.key === "ArrowUp" ? -1 : 1);
    if (index >= history.length) {
      setHistoryIndex(null);
      setInput(draft.current);
    } else {
      const bounded = Math.max(0, index);
      setHistoryIndex(bounded);
      setInput(history[bounded]);
    }
  }

  return (
    <div className="terminal-workspace">
      <PageHeading
        label="EXPLORAÇÃO GUIADA"
        title="Interactive Terminal"
        description="Explore o portfólio e pratique a leitura de comandos de Linux e redes em uma sessão simulada no navegador."
      />
      <section
        className="panel terminal-panel"
        aria-labelledby="terminal-session"
      >
        <div className="panel-heading">
          <h2 id="terminal-session">
            <WorkspaceIcon name="terminal" /> Console local
          </h2>
          <span className="status">Ambiente demonstrativo</span>
        </div>
        <p className="terminal-description">
          Os comandos educativos exibem respostas fictícias. Os comandos de
          portfólio consultam o conteúdo documentado.
        </p>
        <section className="terminal-lab" aria-labelledby="terminal-lab-title">
          <h3 id="terminal-lab-title">Troubleshooting Lab</h3>
          <p>
            Investigue três cenários fictícios e formule um diagnóstico com base
            nas evidências simuladas.
          </p>
          <ul className="terminal-lab-list">
            {scenarios.map((item) => (
              <li key={item.id}>{item.title}</li>
            ))}
          </ul>
          <div className="terminal-lab-controls">
            <label>
              Cenário de investigação
              <select
                value={selectedId}
                aria-describedby="terminal-selected-scenario"
                onChange={(event) => setPendingId(event.target.value)}
              >
                {scenarios.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.id}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="button"
              type="button"
              onClick={() => run("scenario start " + selectedId)}
            >
              Iniciar cenário
            </button>
          </div>
          <p id="terminal-selected-scenario" className="terminal-lab-choice">
            Seleção{pending ? " pendente" : ""}: {selectedTitle}.
            {pending &&
              " A investigação atual continua até você iniciar a seleção."}
          </p>
          <p
            className="terminal-lab-state"
            aria-live="polite"
            aria-atomic="true"
          >
            <strong>Estado atual:</strong> {phase}.
            {active && <> Cenário ativo: {active.scenario.title}.</>}
          </p>
          <div className="terminal-lab-guidance">
            <p>
              {!active
                ? "Escolha um cenário e selecione Iniciar cenário. Use scenario list ou scenario help no console."
                : active.phase === "confirmed"
                  ? "A justificativa permanece no histórico. Reinicie ou escolha outro cenário para investigar."
                  : "Use scenario status para revisar as evidências. Faça as verificações do cenário antes de enviar uma hipótese."}
            </p>
            <ul
              className="terminal-suggestions"
              aria-label="Comandos sugeridos"
            >
              {shortcuts.map((command) => (
                <li key={command}>
                  <button
                    type="button"
                    className="text-link"
                    aria-label={"Preencher " + command}
                    onClick={() => fillCommand(command)}
                  >
                    <code>{command}</code>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <a className="text-link" href="/infrastructure/">
            Consultar arquitetura do Infrastructure Lab
          </a>
        </section>
        <div className="terminal-interactive">
          <div className="terminal-controls">
            <button
              type="button"
              className="button"
              onClick={() => run("help")}
            >
              Ajuda
            </button>
            <button
              type="button"
              className="text-link"
              onClick={() => run("reset")}
            >
              Reiniciar sessão
            </button>
          </div>
          <p className="terminal-hint">
            Histórico da sessão. Cada resposta registra o estado no momento da
            execução.
          </p>
          <div
            className="terminal-output"
            ref={output}
            tabIndex={0}
            role="region"
            aria-label="Histórico e respostas"
          >
            {session.notice && (
              <p className="terminal-notice">{session.notice}</p>
            )}
            <ol>
              {session.entries.map((entry) => (
                <li key={entry.id}>
                  <p className="terminal-entry">
                    <span aria-hidden="true">$ </span>
                    {entry.input}
                  </p>
                  <p className="kicker">
                    {responseLabels[entry.response.kind]}
                  </p>
                  <pre>{entry.response.text}</pre>
                  {entry.response.kind === "info" && entry.response.links && (
                    <ul className="terminal-links">
                      {entry.response.links.map((link) => (
                        <li key={link.href}>
                          <a className="text-link" href={link.href}>
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          </div>
          <form className="terminal-form" onSubmit={submit}>
            <label htmlFor="terminal-command">Comando do terminal</label>
            <div className="terminal-prompt">
              <span aria-hidden="true">$</span>
              <input
                id="terminal-command"
                ref={field}
                value={input}
                maxLength={maxInputLength}
                onChange={(event) => {
                  setInput(event.target.value);
                  setHistoryIndex(null);
                  setSuggestion("");
                }}
                onKeyDown={onKeyDown}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                enterKeyHint="go"
                placeholder="Ex.: help"
                aria-describedby="terminal-shortcuts"
              />
              <button className="button" type="submit">
                Enviar
              </button>
            </div>
          </form>
          <p id="terminal-shortcuts" className="terminal-hint">
            Enter envia, ↑ e ↓ navegam no histórico e Tab completa um prefixo
            único. Shift+Tab sai do campo.
          </p>
          {suggestion && <p className="terminal-hint">{suggestion}</p>}
          <span className="sr-only" role="status">
            {suggestion ||
              session.notice ||
              (latest &&
                responseLabels[latest.kind] +
                  ". " +
                  latest.text.split("\n")[0])}
          </span>
        </div>
        <noscript>
          <p className="terminal-description">
            A sessão interativa requer JavaScript. Consulte os comandos abaixo.
          </p>
        </noscript>
        <details className="terminal-reference">
          <summary>Referência de comandos</summary>
          <dl>
            {commands.map((item) => (
              <div key={item.name}>
                <dt>
                  <code>{item.name}</code> <span>· {item.category}</span>
                </dt>
                <dd>{item.description}</dd>
              </div>
            ))}
          </dl>
        </details>
      </section>
    </div>
  );
}
