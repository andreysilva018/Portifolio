import { useId, useState } from 'react';
import { PageHeading } from '../../components/PageHeading';
import { WorkspaceIcon } from '../../components/WorkspaceIcon';
import { incidents, incidentBasePath, incidentPath, type Incident } from '../../content/incidents';
import { IncidentDetail } from './IncidentDetail';

const categories = [...new Set(incidents.map(item => item.category))];
const technologies = [...new Set(incidents.flatMap(item => item.technologies))];
const origins = [...new Set(incidents.map(item => item.origin))];
const fold = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

export function IncidentExplorer({ incident }: { incident?: Incident }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [technology, setTechnology] = useState('');
  const [origin, setOrigin] = useState('');
  const terms = fold(query.trim()).split(/\s+/);
  const matches = incidents.filter(item => {
    const searchable = fold([item.id, item.title, item.description, item.category, ...item.technologies, ...item.symptoms, ...(item.competencies ?? [])].join(' '));
    return terms.every(term => searchable.includes(term)) &&
      (!category || item.category === category) &&
      (!technology || item.technologies.includes(technology)) &&
      (!origin || item.origin === origin);
  });

  function clearFilters() {
    setQuery('');
    setCategory('');
    setTechnology('');
    setOrigin('');
  }

  return <>
    <PageHeading label="INVESTIGAÇÃO TÉCNICA" title="Incident Explorer"
      description="Explore casos profissionais anonimizados de suporte a ERP, redes corporativas e automação." />
    {incident && <a className="text-link incident-back" href={incidentBasePath}>Voltar ao catálogo</a>}
    <div className={'incident-layout' + (incident ? ' incident-has-case' : '')}>
      <section className="panel incident-catalog" aria-labelledby="incident-catalog-title">
        <div className="panel-heading"><h2 id="incident-catalog-title">Catálogo de casos</h2></div>
        <div className="incident-filters" role="search" aria-label="Pesquisar casos técnicos">
          <label>Pesquisar casos<input type="search" value={query} placeholder="Título, ID ou tecnologia" onChange={event => setQuery(event.target.value)} /></label>
          <div className="incident-selects">
            <Filter label="Categoria" value={category} options={categories} change={setCategory} />
            <Filter label="Tecnologia" value={technology} options={technologies} change={setTechnology} />
            <Filter label="Tipo de caso" value={origin} options={origins} change={setOrigin} />
          </div>
          <div className="incident-filter-footer">
            <p role="status" aria-atomic="true">{matches.length} {matches.length === 1 ? 'caso' : 'casos'}</p>
            <button className="text-link" type="button" onClick={clearFilters}>Limpar filtros</button>
          </div>
        </div>
        {matches.length ? <ul className="incident-list">{matches.map(item => <li key={item.id}>
          <a href={incidentPath(item)} aria-current={incident?.id === item.id ? 'page' : undefined}>
            <span className="mono muted">{item.id} / {item.category}</span>
            <strong>{item.title}</strong>
            <span>{item.origin + ' · ' + item.technologies.join(' · ')}</span>
            <WorkspaceIcon name="arrow" />
          </a>
        </li>)}</ul> : <p className="incident-empty">Nenhum caso corresponde à pesquisa. Ajuste os filtros ou limpe a busca.</p>}
      </section>
      {incident ? <IncidentDetail incident={incident} /> : <aside className="panel incident-placeholder">
        <WorkspaceIcon name="incident" />
        <h2>Selecione um caso</h2>
        <p>Cada caso reúne contexto, etapas de trabalho e resultados relatados.</p>
      </aside>}
    </div>
  </>;
}

interface FilterProps {
  label: string;
  value: string;
  options: string[];
  change: (value: string) => void;
}

function Filter({ label, value, options, change }: FilterProps) {
  const id = useId();
  return <div className="incident-select">
    <label htmlFor={id}>{label}</label>
    <select id={id} value={value} onChange={event => change(event.target.value)}>
      <option value="">Qualquer</option>
      {options.map(option => <option key={option} value={option}>{option}</option>)}
    </select>
  </div>;
}
