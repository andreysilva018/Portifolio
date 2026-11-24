import { useReducer, useState } from 'react';
import { connectivityPaths, initialSimulation, scenarios, simulate } from '../../content/connectivity';
import { components } from '../../content/infrastructure';
import './connectivity.css';

type Step = (typeof connectivityPaths)[number]['steps'][number];

export function ConnectivityWorkspace() {
  return <>
    <ConnectivityExplorer />
    <TroubleshootingSimulator />
  </>;
}

function ConnectivityExplorer() {
  const [pathId, setPathId] = useState(connectivityPaths[0].id);
  const [stepIndex, setStepIndex] = useState(0);
  const path = connectivityPaths.find(item => item.id === pathId) ?? connectivityPaths[0];
  const step = path.steps[stepIndex];

  return <section className="panel connectivity" aria-labelledby="connectivity-title">
    <div className="panel-heading"><h2 id="connectivity-title">Connectivity Explorer</h2></div>
    <div className="connectivity-body">
      <div className="connectivity-interactive">
        <label className="connectivity-picker">Caminho de acesso
          <select value={pathId} onChange={event => { setPathId(event.target.value); setStepIndex(0); }}>
            {connectivityPaths.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
        </label>
        <p className="connectivity-scope">{path.scope}</p>
        <div className="connectivity-grid">
          <ol className="connectivity-steps" aria-label="Etapas do caminho">
            {path.steps.map((item, index) => <li key={item.id}>
              <button type="button" className="lab-node" aria-pressed={index === stepIndex}
                aria-controls="connectivity-detail" onClick={() => setStepIndex(index)}>
                <span className="mono" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span> {item.label}
              </button>
            </li>)}
          </ol>
          <div className="lab-detail" id="connectivity-detail" aria-live="polite" aria-atomic="true">
            <StepDetails step={step} />
          </div>
        </div>
      </div>
      <noscript>
        <p>Consulte os caminhos e as etapas na referência abaixo.</p>
        {connectivityPaths.map(item => <details key={item.id} className="connectivity-reference">
          <summary>{item.title}</summary>
          <p>{item.scope}</p>
          {item.steps.map(stage => <StepDetails key={stage.id} step={stage} />)}
        </details>)}
      </noscript>
    </div>
  </section>;
}

function StepDetails({ step }: { step: Step }) {
  return <>
    <h3>{step.label}</h3>
    {step.component && <p className="muted">{components[step.component].name}</p>}
    <dl className="connectivity-facts">
      <dt>Função</dt><dd>{step.purpose}</dd>
      <dt>Como funciona</dt><dd>{step.explanation}</dd>
      <dt>Dependências</dt><dd>{step.dependsOn}</dd>
      <dt>Possíveis falhas</dt><dd>{step.failure}</dd>
      <dt>Verificação recomendada</dt><dd>{step.check}</dd>
    </dl>
  </>;
}

function TroubleshootingSimulator() {
  const [state, dispatch] = useReducer(simulate, undefined, () => initialSimulation());
  const scenario = scenarios.find(item => item.id === state.scenarioId) ?? scenarios[0];
  const checked = state.checked.map(id => scenario.checks.find(item => item.id === id)!).filter(Boolean);
  const remaining = scenario.checks.filter(item => item.decisive && !state.checked.includes(item.id));

  return <section className="panel connectivity" aria-labelledby="troubleshooting-title">
    <div className="panel-heading"><h2 id="troubleshooting-title">Troubleshooting Simulator</h2></div>
    <div className="connectivity-body">
      <p className="connectivity-scope">Cenários fictícios. As observações são simuladas e servem para praticar a investigação.</p>
      <div className="connectivity-interactive">
        <label className="connectivity-picker">Cenário de diagnóstico
          <select value={scenario.id} onChange={event => dispatch({ type: 'select', id: event.target.value })}>
            {scenarios.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
        </label>
        <p><strong>Sintoma:</strong> {scenario.symptom}</p>
        <p className="muted">{scenario.context}</p>
        <div className="connectivity-grid simulator-grid">
          <div>
            <h3>Verificações</h3>
            <ul className="simulation-checks">
              {scenario.checks.map(check => <li key={check.id}>
                <button className="lab-node" type="button" aria-pressed={state.checked.includes(check.id)}
                  onClick={() => dispatch({ type: 'verify', id: check.id })}>
                  {check.label}{state.checked.includes(check.id) && <span aria-hidden="true"> ✓</span>}
                </button>
              </li>)}
            </ul>
          </div>
          <div className="lab-detail">
            <h3>Observações simuladas</h3>
            <div role="log" aria-label="Histórico de verificações">
              {checked.length ? <ol className="simulation-observations">{checked.map(check => <li key={check.id}>
                <strong>{check.label}</strong><p>{check.observation}</p>
              </li>)}</ol> : <p>Escolha uma verificação para iniciar.</p>}
            </div>
            <div className="simulation-actions">
              <button className="button" type="button" onClick={() => dispatch({ type: 'conclude' })}>Consultar diagnóstico</button>
              <button className="text-link" type="button" onClick={() => dispatch({ type: 'reset' })}>Reiniciar simulação</button>
            </div>
            <div className="simulation-result" aria-live="polite" aria-atomic="true">
              {state.phase === 'more-needed' && <p>Para concluir, compare as observações de: {remaining.map(item => item.label).join(' e ')}.</p>}
              {state.phase === 'complete' && <><h4>{scenario.diagnosis}</h4><p>{scenario.explanation}</p></>}
            </div>
          </div>
        </div>
      </div>
      <noscript>
        {scenarios.map(item => <details key={item.id} className="connectivity-reference">
          <summary>{item.title}</summary><p>{item.symptom} {item.context}</p>
          <p>{item.diagnosis} {item.explanation}</p>
        </details>)}
      </noscript>
    </div>
  </section>;
}
