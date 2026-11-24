import { projects } from '../../content/profile';
import { SectionHeading } from '../../components/SectionHeading';
import { ExternalLink } from '../../components/ExternalLink';

export function ProjectsSection() {
  return <section id="projetos" tabIndex={-1} className="section-block shell" aria-labelledby="projects-title"><div className="section-top"><SectionHeading id="projects-title" eyebrow="ENGENHARIA APLICADA">Construir para compreender.</SectionHeading><p>Projetos de desenvolvimento.<br />Uma perspectiva complementar.</p></div><div className="projects-list">{projects.map(project => <article className="project-row" key={project.title}><div className="project-mark" aria-hidden="true">{'{ }'}</div><div><p className="eyebrow">{project.category}</p><h3>{project.title}</h3><p className="project-description">{project.description}</p><ul className="project-stack">{project.stack.map(tech => <li key={tech}>{tech}</li>)}</ul></div><ExternalLink className="text-link" href={project.url}>Ver repositório<span className="sr-only"> de {project.title}</span></ExternalLink></article>)}</div></section>;
}
