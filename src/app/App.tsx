import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Hero } from '../features/profile/Hero';
import { ProfileSummary, ExperienceSection, SkillsSection, EducationSection } from '../features/profile/ProfileSections';
import { ModulePreview } from '../features/modules/ModulePreview';
import { ModulePage } from '../features/modules/ModulePage';
import { ProjectsSection } from '../features/projects/ProjectsSection';
import { ContactSection } from '../features/contact/ContactSection';
import { modules, normalizePath } from '../content/routes';

export function App({ path = '/' }: { path?: string }) {
  const home = normalizePath(path) === '/';
  const module = modules.find(item => item.path === normalizePath(path));
  return <><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><Header home={home} /><main id="conteudo" tabIndex={-1}>{home ? <><Hero /><ProfileSummary /><ExperienceSection /><SkillsSection /><ModulePreview /><ProjectsSection /><EducationSection /><ContactSection /></> : module ? <ModulePage module={module} /> : <section className="shell module-page"><p className="eyebrow">PÁGINA NÃO ENCONTRADA</p><h1>Este caminho<br />não existe.</h1><p>Você pode continuar pela página inicial do portfólio.</p><a className="button button-primary" href="/">Voltar ao início</a></section>}</main><Footer /></>;
}
