import { InfrastructureLab } from '../features/infrastructure/InfrastructureLab';
import { IncidentExplorer } from '../features/incidents/IncidentExplorer';
import { incidentBasePath, incidentForPath } from '../content/incidents';
import { WorkspaceShell } from '../components/WorkspaceShell';
import { Overview } from '../features/overview/Overview';
import { ModulePage } from '../features/modules/ModulePage';
import { ProjectsPage } from '../features/projects/ProjectsPage';
import { ProfilePage } from '../features/profile/ProfilePage';
import { modules, normalizePath } from '../content/routes';

export function App({ path = '/' }: { path?: string }) {
  const current = normalizePath(path);
  const module = modules.find(item => item.path === current);
  const incident = incidentForPath(current);
  return <WorkspaceShell path={incident ? incidentBasePath : current}>
    {current === '/' ? <Overview /> : incident || current === incidentBasePath ? <IncidentExplorer incident={incident} /> : current === '/infrastructure/' ? <InfrastructureLab /> : module ? <ModulePage module={module} /> : current === '/projects/' ? <ProjectsPage /> : current === '/profile/' ? <ProfilePage /> : <div className="empty-route"><span className="kicker">CAMINHO NÃO ENCONTRADO</span><h1>Este caminho não existe.</h1><p>Continue por uma das áreas do workspace.</p><a className="button" href="/">Abrir Overview</a> <a className="button" href={incidentBasePath}>Abrir catálogo de incidentes</a></div>}
  </WorkspaceShell>;
}
