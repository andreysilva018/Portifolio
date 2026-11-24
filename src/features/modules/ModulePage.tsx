import { ModuleIcon } from '../../components/ModuleIcon';
import type { ModuleDefinition } from '../../content/routes';

export function ModulePage({ module }: { module: ModuleDefinition }) {
  return <section className="shell module-page" aria-labelledby="module-title"><a className="text-link" href="/#modulos">Voltar ao portfólio</a><div className="module-page-heading"><ModuleIcon kind={module.icon} /><span className="status-tag">Em desenvolvimento</span></div><p className="eyebrow">{module.label}</p><h1 id="module-title">{module.name}</h1><p className="module-page-intro">{module.description}</p><div className="module-scope"><h2>O que está previsto</h2><ul>{module.planned.map(item => <li key={item}>{item}</li>)}</ul></div><p className="module-disclaimer">Esta é uma prévia de escopo. O módulo completo será implementado em uma próxima fase, com conteúdo revisado antes da publicação.</p><a href="/#contato" className="button button-primary">Conversar com Andrey</a></section>;
}
