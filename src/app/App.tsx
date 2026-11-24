import { WorkspaceShell } from '../components/WorkspaceShell';
import { Overview } from '../features/overview/Overview';
import { ModulePage } from '../features/modules/ModulePage';
import { ProjectsPage } from '../features/projects/ProjectsPage';
import { ProfilePage } from '../features/profile/ProfilePage';
import { modules, normalizePath } from '../content/routes';

export function App({ path = '/' }: { path?: string }) {
  const current = normalizePath(path);
  const module = modules.find(item => item.path === current);
  return <WorkspaceShell path={current}>
    {current === '/' ? <Overview /> : module ? <ModulePage module={module} /> : current === '/projects/' ? <ProjectsPage /> : current === '/profile/' ? <ProfilePage /> : <div className="empty-route"><span className="kicker">CAMINHO NÃO ENCONTRADO</span><h1>Este caminho não existe.</h1><p>Continue por uma das áreas do workspace.</p><a className="button" href="/">Abrir Overview</a></div>}
  </WorkspaceShell>;
}
