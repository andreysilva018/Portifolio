import { useEffect, useRef, useState, type ReactNode } from 'react';
import { contacts, profile } from '../content/profile';
import { navigation } from '../content/routes';
import { ExternalLink } from './ExternalLink';
import { WorkspaceIcon } from './WorkspaceIcon';

export function WorkspaceShell({ path, children }: { path: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLElement>(null);
  const backdrop = useRef<HTMLButtonElement>(null);
  const current = navigation.find(item => item.path === path);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    (sidebar.current?.querySelector<HTMLAnchorElement>('[aria-current="page"]') ?? sidebar.current?.querySelector<HTMLAnchorElement>('a'))?.focus();
    const close = () => { setOpen(false); trigger.current?.focus(); };
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key !== 'Tab') return;
      const items = [...Array.from(sidebar.current?.querySelectorAll<HTMLAnchorElement>('a') ?? []), trigger.current, backdrop.current].filter(Boolean) as HTMLElement[];
      const first = items[0]; const last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    const resize = () => { if (window.matchMedia('(min-width: 1100px)').matches) close(); };
    document.addEventListener('keydown', keyboard);
    window.addEventListener('resize', resize);
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', keyboard); window.removeEventListener('resize', resize); };
  }, [open]);
  return <div className={`workspace ${open ? 'navigation-open' : ''}`}>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <aside ref={sidebar} id="workspace-sidebar" className="sidebar" aria-label="Áreas do workspace">
      <a className="brand" href="/" aria-label="Andrey IT Operations — Overview"><span className="brand-mark">a<span>.</span></span><span>ANDREY<span className="brand-sub">IT OPERATIONS</span></span></a>
      <nav aria-label="Navegação principal">{['Workspace', 'Biblioteca'].map(group => <div className="nav-group" key={group}><p className="kicker">{group}</p><ul>{navigation.filter(item => item.group === group).map(item => <li key={item.path}><a href={item.path} aria-current={path === item.path ? 'page' : undefined}><WorkspaceIcon name={item.icon} /><span>{item.name}</span></a></li>)}</ul></div>)}</nav>
      <div className="sidebar-bottom"><p className="kicker">Conexões</p>{contacts.filter(item => ['LinkedIn', 'GitHub'].includes(item.label)).map(item => <ExternalLink key={item.label} href={item.url}>{item.label}<WorkspaceIcon name="external" /></ExternalLink>)}</div>
    </aside>
    <header className="workspace-header"><div className="header-location"><button ref={trigger} className="navigation-toggle" aria-expanded={open} aria-controls="workspace-sidebar" onClick={() => setOpen(!open)}><WorkspaceIcon name={open ? 'close' : 'menu'} /><span>{open ? 'Fechar navegação' : 'Abrir navegação'}</span></button><nav aria-label="Breadcrumb" inert={open || undefined}><ol><li><a href="/">Workspace</a></li><li aria-hidden="true">/</li><li aria-current="page">{current?.name ?? '404'}</li></ol></nav></div>{path !== '/' && <ExternalLink inert={open || undefined} className="resume-link" href={profile.curriculumUrl}>Currículo PDF<WorkspaceIcon name="external" /></ExternalLink>}</header>
    {open && <button ref={backdrop} className="navigation-backdrop" aria-label="Fechar navegação lateral" onClick={() => { setOpen(false); trigger.current?.focus(); }} />}
    <div className="workspace-body" inert={open || undefined}><main id="conteudo" tabIndex={-1}>{children}</main><footer className="workspace-footer"><span>Andrey IT Operations<span className="footer-divider">/</span>Portfólio profissional</span><span>© 2026 Andrey Vinícius de Souza Silva</span></footer></div>
  </div>;
}
