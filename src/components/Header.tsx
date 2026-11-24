import { useEffect, useRef, useState } from 'react';
import { ExternalLink } from './ExternalLink';
import { profile } from '../content/profile';

const links = [['perfil', 'Perfil'], ['experiencia', 'Experiência'], ['competencias', 'Competências'], ['modulos', 'Explorar'], ['contato', 'Contato']] as const;

export function Header({ home }: { home: boolean }) {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
      if (event.key !== 'Tab') return;
      const items = [toggle.current, ...Array.from(panel.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [])].filter(Boolean) as HTMLElement[];
      const first = items[0]; const last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    function onResize() { if (window.matchMedia('(min-width: 960px)').matches) setOpen(false); }
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', onKey); window.removeEventListener('resize', onResize); };
  }, [open]);

  function navigate(id: string) {
    setOpen(false);
    // Transfer focus after React removes the mobile overlay.
    requestAnimationFrame(() => document.getElementById(id)?.focus({ preventScroll: true }));
  }

  return <header className="site-header">
    <div className="shell header-inner">
      <a href="/" className="brand" aria-label="Andrey IT Operations — início"><span className="brand-symbol" aria-hidden="true">a<span>.</span></span><span>ANDREY<span className="brand-sub">IT OPERATIONS</span></span></a>
      <button ref={toggle} className="menu-toggle" type="button" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>{open ? 'Fechar' : 'Menu'}<span aria-hidden="true">{open ? '×' : '☰'}</span></button>
      <nav ref={panel} id="primary-navigation" className={`primary-nav ${open ? 'is-open' : ''}`} aria-label="Navegação principal">
        {links.map(([id, label]) => <a key={id} href={`${home ? '' : '/'}#${id}`} onClick={() => navigate(id)}>{label}</a>)}
        <ExternalLink href={profile.curriculumUrl} className="nav-cv">Currículo PDF</ExternalLink>
      </nav>
    </div>
  </header>;
}
