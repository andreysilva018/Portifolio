import { CatalogueDemo, PaymentsDemo } from './ProcessDemos';
import { NetworkTopology } from './NetworkTopology';
import { useEffect, useState } from 'react';
import { incidentPath, type Incident } from '../../content/incidents';

export function IncidentDetail({ incident }: { incident: Incident }) {
  const professional = incident.origin === 'Experiência profissional';
  return <article className="panel incident-detail" aria-labelledby="incident-title">
    <header>
      <p className="kicker">{incident.id} / {incident.category}</p>
      <h2 id="incident-title">{incident.title}</h2>
      <p>{incident.description}</p>
      <div className="incident-meta">
        <span className="status">{incident.origin}</span>
        <span className="status">{incident.status}</span>
        {incident.type && <span className="status">{incident.type}</span>}
        <CopyButton label="Copiar link" value={incidentPath(incident)} link />
      </div>
    </header>
    <section>
      <h3>Contexto e sintomas</h3>
      <p>{incident.context}</p>
      <ul className="incident-bullets">{incident.symptoms.map(symptom => <li key={symptom}>{symptom}</li>)}</ul>
      {incident.impact && <p><strong>Impacto previsto:</strong> {incident.impact}</p>}
    </section>
    {incident.hypotheses?.length ? <section>
      <h3>Hipóteses a investigar</h3>
      <ul className="incident-bullets">{incident.hypotheses.map(hypothesis => <li key={hypothesis}>{hypothesis}</li>)}</ul>
    </section> : null}
    <section>
      <h3>{incident.demo ? 'Etapas da melhoria de processo' : incident.timelineIntro ? 'Diagnóstico do incidente' : professional ? 'Linha do tempo da metodologia' : 'Linha do tempo planejada'}</h3>
      <p>{incident.timelineIntro ?? (professional
        ? 'Metodologia baseada em atividades recorrentes de investigação, tratativa e acompanhamento na rotina de suporte.'
        : 'Etapas propostas. Os trechos servem como referência para o laboratório.')}</p>
      <ol className="incident-timeline">{incident.steps.map(step => <li key={step.title}>
        <h4>{step.title}</h4>
        {step.qualifier && <p><span className="status">{step.qualifier}</span></p>}
        <p>{step.procedure}</p>
        {step.snippet && <div className="incident-snippet">
          <pre><code>{step.snippet}</code></pre>
          <CopyButton label={'Copiar trecho: ' + step.title} value={step.snippet}>Copiar trecho</CopyButton>
        </div>}
      </li>)}</ol>
    </section>
    {!incident.demo && <section>
      <h3>Evidências e resultados observados</h3>
      {incident.evidence?.length ? <dl>{incident.evidence.map(item => <div key={item.title}>
        <dt>{item.title}</dt><dd>{item.observation}</dd>
      </div>)}</dl> : <p>{professional ? 'O relato não inclui evidências publicadas, causa raiz confirmada ou desfecho documentado de um chamado específico.' : 'Nenhuma evidência coletada. O roteiro ainda não foi executado.'}</p>}
      {incident.rootCause && <p><strong>Causa raiz confirmada:</strong> {incident.rootCause}</p>}
      {incident.resolution && <p><strong>Resolução realizada:</strong> {incident.resolution}</p>}
    </section>}
    {incident.complementaryAnalysis && <section>
      <h3>Análise complementar</h3>
      <p>{incident.complementaryAnalysis}</p>
    </section>}
    {incident.improvement && <section>
      <h3>Melhoria estrutural</h3>
      <p>{incident.improvement}</p>
    </section>}
    {incident.demo === 'catalogues' && <CatalogueDemo />}
    {incident.demo === 'payments' && <PaymentsDemo />}
    {incident.topology === 'corporate-network' && <NetworkTopology />}
    {incident.competencies?.length ? <section>
      <h3>Competências aplicadas</h3>
      <ul className="incident-bullets">{incident.competencies.map(skill => <li key={skill}>{skill}</li>)}</ul>
    </section> : null}
    {(incident.validation || incident.learning) && <section>
      <h3>Validação planejada e aprendizado proposto</h3>
      {incident.validation && <p>{incident.validation}</p>}
      {incident.learning && <p>{incident.learning}</p>}
    </section>}
  </article>;
}

function CopyButton({ label, value, link = false, children }: {
  label: string;
  value: string;
  link?: boolean;
  children?: string;
}) {
  const [available, setAvailable] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => setAvailable(Boolean(navigator.clipboard?.writeText)), []);

  async function copy() {
    try {
      const content = link ? new URL(value, window.location.origin).href : value;
      await navigator.clipboard.writeText(content);
      setMessage('Copiado.');
    } catch {
      setMessage(link ? 'Copie o endereço na barra do navegador.' : 'Selecione o trecho para copiar manualmente.');
    }
  }

  return available ? <span className="incident-copy">
    <button type="button" className="text-link" aria-label={label} onClick={() => void copy()}>{children ?? label}</button>
    <span role="status">{message}</span>
  </span> : null;
}
