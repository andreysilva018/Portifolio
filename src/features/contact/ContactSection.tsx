import { contacts } from '../../content/profile';
import { ExternalLink } from '../../components/ExternalLink';

export function ContactSection() {
  return <section id="contato" tabIndex={-1} className="contact-section section-block" aria-labelledby="contact-title"><div className="shell contact-grid"><div><p className="eyebrow">PRÓXIMA CONEXÃO</p><h2 id="contact-title">Vamos<br /><span>conversar.</span></h2><p>Oportunidades em suporte de TI,<br />sistemas ERP e Service Desk.</p><ExternalLink href="mailto:andreysilvatisuporte@gmail.com" className="button button-primary">Entrar em contato</ExternalLink></div><ul className="contact-list">{contacts.map(contact => <li key={contact.label}><ExternalLink href={contact.url}><span className="contact-label">{contact.label}</span><span className="contact-value">{contact.display}</span></ExternalLink></li>)}</ul></div></section>;
}
