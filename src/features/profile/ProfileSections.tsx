import { SectionHeading } from '../../components/SectionHeading';
import { experiences, profile, skillGroups } from '../../content/profile';

export function ProfileSummary() {
  return <section id="perfil" tabIndex={-1} className="section-block shell profile-grid" aria-labelledby="profile-title"><SectionHeading id="profile-title" eyebrow="VISÃO PROFISSIONAL">O suporte começa<br />por entender.</SectionHeading><div className="profile-body"><p className="lead">A tecnologia faz parte do processo.<br /><span>As pessoas dão sentido a ele.</span></p><p>{profile.summary}</p><p>Meu foco profissional está em Analista de Suporte Técnico, Suporte N1/N2, Sistemas/ERP e Service Desk. Desenvolvimento de software é uma competência complementar para compreender aplicações e dialogar com equipes técnicas.</p></div></section>;
}

export function ExperienceSection() {
  return <section id="experiencia" tabIndex={-1} className="experience-band section-block" aria-labelledby="experience-title"><div className="shell"><div className="section-top"><SectionHeading id="experience-title" eyebrow="TRAJETÓRIA">Experiência na operação.</SectionHeading><p>Atendimento, sistemas e processos.<br />Vivência em ambientes corporativos.</p></div><div className="experience-list">{experiences.map(item => <article className="experience-row" key={item.company}><div className="experience-period"><p><time dateTime={item.start}>{item.period.split(' — ')[0]}</time><span aria-hidden="true"> — </span><time dateTime={item.end}>{item.period.split(' — ')[1]}</time></p><span>EXPERIÊNCIA PROFISSIONAL</span></div><div className="experience-main"><h3>{item.role}</h3><p className="company">{item.company}</p><p className="experience-description">{item.description}</p><ul>{item.responsibilities.map(text => <li key={text}>{text}</li>)}</ul></div></article>)}</div></div></section>;
}

export function SkillsSection() {
  return <section id="competencias" tabIndex={-1} className="section-block shell" aria-labelledby="skills-title"><div className="section-top"><SectionHeading id="skills-title" eyebrow="REPERTÓRIO TÉCNICO">Uma base conectada.</SectionHeading><p>Suporte como foco.<br />Engenharia como complemento.</p></div><div className="skills-list">{skillGroups.map(group => <article className="skill-row" key={group.title}><div><h3>{group.title}</h3><p>{group.description}</p></div><ul className="skill-tags">{group.skills.map(skill => <li key={skill}>{skill}</li>)}</ul></article>)}</div></section>;
}

export function EducationSection() {
  return <section id="formacao" tabIndex={-1} className="education-section section-block shell" aria-labelledby="education-title"><SectionHeading id="education-title" eyebrow="FORMAÇÃO ACADÊMICA">Aprendizado contínuo.</SectionHeading><div className="education-detail"><span className="status-tag">{profile.education.status}</span><h3>{profile.education.degree}</h3><p>{profile.education.expected}</p><p className="education-note">Formação técnica conectada à prática em suporte e sistemas.</p></div></section>;
}
