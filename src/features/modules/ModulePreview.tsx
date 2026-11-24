import { modules } from '../../content/routes';
import { ModuleIcon } from '../../components/ModuleIcon';
import { SectionHeading } from '../../components/SectionHeading';

export function ModulePreview() {
  return <section id="modulos" tabIndex={-1} className="modules-band section-block" aria-labelledby="modules-title"><div className="shell"><div className="section-top"><SectionHeading id="modules-title" eyebrow="PRÓXIMOS CAPÍTULOS">Da prática à documentação.</SectionHeading><p>Três formas de explorar o portfólio.<br />Módulos em desenvolvimento.</p></div><div className="module-list">{modules.map(module => <article className="module-row" key={module.path}><div className="module-icon"><ModuleIcon kind={module.icon} /></div><div className="module-name"><p className="eyebrow">{module.label}</p><h3><a href={module.path}>{module.name}</a></h3></div><p className="module-description">{module.description}</p><span className="status-tag">Em desenvolvimento</span></article>)}</div><p className="modules-note">As páginas apresentam o escopo previsto. Os módulos interativos ainda não estão disponíveis.</p></div></section>;
}
