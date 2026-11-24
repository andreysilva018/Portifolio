import { ExternalLink } from '../../components/ExternalLink';
import { WorkspaceIcon } from '../../components/WorkspaceIcon';
import { experiences, profile } from '../../content/profile';
import { modules } from '../../content/routes';

const moduleSummaries = {
  incident: 'Casos profissionais de ERP, redes e automação.',
  infrastructure: 'Topologia e documentação de ambientes de laboratório.',
  terminal: 'Navegação pelo portfólio em um terminal simulado.',
};

export function Overview() {
  return <div className="overview">
    <section className="professional-intro" aria-labelledby="professional-name">
      <p className="kicker">Portfólio profissional</p>
      <h1 id="professional-name">{profile.name}</h1>
      <p className="professional-role">Analista de Suporte de TI | N1/N2 | Sistemas ERP | Service Desk</p>
      <p className="professional-summary">Experiência em suporte a usuários e investigação de problemas em Windows, redes e sistemas ERP, com SQL como apoio à análise de inconsistências.</p>
      <div className="intro-actions">
        <ExternalLink className="button button-primary" href={profile.curriculumUrl}>
          Ver currículo<WorkspaceIcon name="external" />
        </ExternalLink>
        <a className="button button-secondary" href="/profile/#experiencia">
          Conhecer experiência<WorkspaceIcon name="arrow" />
        </a>
      </div>
    </section>

    <section className="overview-section" aria-labelledby="modules-title">
      <h2 id="modules-title">Explore minhas competências</h2>
      <ul className="panel module-list">
        {modules.map(module => <li key={module.path}>
          <a className="module-row" href={module.path}>
            <span className="module-symbol"><WorkspaceIcon name={module.icon} /></span>
            <div><h3>{module.name}</h3><p>{moduleSummaries[module.icon]}</p></div>
            <span className="status">{module.icon === 'incident' ? 'Casos técnicos' : module.icon === 'infrastructure' ? 'Arquitetura documentada' : 'Em desenvolvimento'}</span>
            <WorkspaceIcon name="arrow" />
          </a>
        </li>)}
      </ul>
    </section>

    <section className="overview-section" aria-labelledby="trajectory-title">
      <h2 id="trajectory-title">Trajetória e projetos</h2>
      <div className="trajectory-panel">
        <ul className="trajectory-list">
          {experiences.map(item => <li key={item.company}>
            <div><h3>{item.role}</h3><p>{item.company}</p></div>
            <span>{item.period.replace(' - ', ' – ')}</span>
          </li>)}
        </ul>
        <div className="trajectory-projects">
          <h3>Projetos documentados</h3>
          <p>Aplicações Java com persistência de dados e código disponível.</p>
          <a className="text-link" href="/projects/">Consultar projetos<WorkspaceIcon name="arrow" /></a>
        </div>
      </div>
    </section>
  </div>;
}
