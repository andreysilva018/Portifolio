import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { PageHeading } from '../../components/PageHeading';
import { WorkspaceIcon } from '../../components/WorkspaceIcon';
import { commands, maxInputLength } from './commands';
import { completions } from './parser';
import { newSession, submitCommand } from './session';
import './terminal.css';

export function InteractiveTerminal() {
  const [session, setSession] = useState(newSession);
  const [input, setInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [suggestion, setSuggestion] = useState('');
  const draft = useRef('');
  const field = useRef<HTMLInputElement>(null);
  const output = useRef<HTMLDivElement>(null);
  const latest = session.entries.at(-1)?.response;

  useEffect(() => {
    if (output.current) output.current.scrollTop = output.current.scrollHeight;
  }, [session]);

  function run(value: string) {
    setSession(previous => submitCommand(previous, value));
    setInput('');
    setHistoryIndex(null);
    setSuggestion('');
    draft.current = '';
    field.current?.focus();
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (input.trim()) run(input.trim());
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.nativeEvent.isComposing) return;
    if (event.key === 'Tab') {
      const matches = completions(input);
      if (matches.length === 1 && matches[0] !== input.trim().toLowerCase()) {
        event.preventDefault();
        setInput(matches[0]);
        setSuggestion('Completado: ' + matches[0]);
        setHistoryIndex(null);
      } else if (matches.length > 1) {
        setSuggestion('Opções: ' + matches.join(', '));
      }
      return;
    }
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    const history = session.history;
    if (!history.length || (historyIndex === null && event.key === 'ArrowDown')) return;

    event.preventDefault();
    setSuggestion('');
    if (historyIndex === null) draft.current = input;
    const index = (historyIndex ?? history.length) + (event.key === 'ArrowUp' ? -1 : 1);
    if (index >= history.length) {
      setHistoryIndex(null);
      setInput(draft.current);
    } else {
      const bounded = Math.max(0, index);
      setHistoryIndex(bounded);
      setInput(history[bounded]);
    }
  }

  return <div className="terminal-workspace">
    <PageHeading label="EXPLORAÇÃO GUIADA" title="Interactive Terminal"
      description="Explore o portfólio e pratique a leitura de comandos de Linux e redes em uma sessão simulada no navegador." />
    <section className="panel terminal-panel" aria-labelledby="terminal-session">
      <div className="panel-heading">
        <h2 id="terminal-session"><WorkspaceIcon name="terminal" /> Console local</h2>
        <span className="status">Ambiente demonstrativo</span>
      </div>
      <p className="terminal-description">Os comandos educativos exibem respostas fictícias. Os comandos de portfólio consultam o conteúdo documentado.</p>
      <div className="terminal-interactive">
        <div className="terminal-controls">
          <button type="button" className="button" onClick={() => run('help')}>Ajuda</button>
          <button type="button" className="text-link" onClick={() => run('reset')}>Reiniciar sessão</button>
        </div>
        <div className="terminal-output" ref={output} tabIndex={0} role="region" aria-label="Histórico e respostas">
          {session.notice && <p className="terminal-notice">{session.notice}</p>}
          <ol>
            {session.entries.map(entry => <li key={entry.id}>
              <p className="terminal-entry"><span aria-hidden="true">$ </span>{entry.input}</p>
              <p className="kicker">{entry.response.kind === 'simulation' ? 'Resposta simulada' : entry.response.kind === 'error' ? 'Orientação' : 'Portfólio'}</p>
              <pre>{entry.response.text}</pre>
              {entry.response.kind === 'info' && entry.response.links && <ul className="terminal-links">
                {entry.response.links.map(link => <li key={link.href}><a className="text-link" href={link.href}>{link.label}</a></li>)}
              </ul>}
            </li>)}
          </ol>
        </div>
        <form className="terminal-form" onSubmit={submit}>
          <label htmlFor="terminal-command">Comando do terminal</label>
          <div className="terminal-prompt">
            <span aria-hidden="true">$</span>
            <input id="terminal-command" ref={field} value={input} maxLength={maxInputLength}
              onChange={event => { setInput(event.target.value); setHistoryIndex(null); setSuggestion(''); }}
              onKeyDown={onKeyDown} autoComplete="off" autoCapitalize="off" spellCheck={false}
              enterKeyHint="go" placeholder="Ex.: help" aria-describedby="terminal-shortcuts" />
            <button className="button" type="submit">Enviar</button>
          </div>
        </form>
        <p id="terminal-shortcuts" className="terminal-hint">Enter envia, ↑ e ↓ navegam no histórico e Tab completa um prefixo único. Shift+Tab sai do campo.</p>
        {suggestion && <p className="terminal-hint">{suggestion}</p>}
        <span className="sr-only" role="status">{suggestion || session.notice || (latest && (latest.kind === 'simulation' ? 'Resposta simulada. ' : '') + latest.text.split('\n')[0])}</span>
      </div>
      <noscript><p className="terminal-description">A sessão interativa requer JavaScript. Consulte os comandos abaixo.</p></noscript>
      <details className="terminal-reference">
        <summary>Referência de comandos</summary>
        <dl>{commands.map(item => <div key={item.name}>
          <dt><code>{item.name}</code> <span>· {item.category}</span></dt><dd>{item.description}</dd>
        </div>)}</dl>
      </details>
    </section>
  </div>;
}
