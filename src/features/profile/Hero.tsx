import portrait from '../../../imagens/Andrey fundo branco.jpeg';
import { profile } from '../../content/profile';
import { ExternalLink } from '../../components/ExternalLink';

export function Hero() {
  return <section className="hero shell" aria-labelledby="hero-title">
    <div className="hero-copy">
      <p className="eyebrow hero-eyebrow">SUPORTE DE TI / SISTEMAS / INFRAESTRUTURA</p>
      <h1 id="hero-title">Andrey<br /><span>Vinícius.</span><span className="sr-only"> de Souza Silva</span></h1>
      <p className="hero-statement">Tecnologia que funciona.<br />Suporte que aproxima.</p>
      <p className="hero-description">Suporte técnico N1/N2, sistemas ERP e Service Desk. Investigação de problemas, atendimento a usuários e documentação para o dia a dia da operação.</p>
      <div className="flex flex-wrap gap-3 hero-actions"><a href="#experiencia" className="button button-primary">Conheça minha experiência</a><ExternalLink href={profile.curriculumUrl} className="button button-secondary">Ver currículo PDF</ExternalLink></div>
      <div className="hero-footnote"><span className="small-rule" aria-hidden="true" />Pessoas. Sistemas. Continuidade.</div>
    </div>
    <div className="hero-visual">
      <div className="portrait-meta"><span>PERFIL PROFISSIONAL</span><span>TI / OPERAÇÕES</span></div>
      <div className="portrait-frame"><img src={portrait} width="480" height="520" alt="Retrato de Andrey Vinícius de Souza Silva" fetchPriority="high" /><span className="portrait-corner" aria-hidden="true" /></div>
      <div className="portrait-caption"><span>ANDREY VINÍCIUS</span><p>Entre a necessidade do usuário<br />e o funcionamento do sistema.</p></div>
      <div className="hero-tag" aria-hidden="true"><span>FOCO DE ATUAÇÃO</span><strong>Support<br />Engineering</strong></div>
    </div>
  </section>;
}
