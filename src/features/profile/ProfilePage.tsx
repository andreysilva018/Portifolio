import { PageHeading } from "../../components/PageHeading";
import { ExternalLink } from "../../components/ExternalLink";
import { WorkspaceIcon } from "../../components/WorkspaceIcon";
import {
  contacts,
  experiences,
  profile,
  skillGroups,
} from "../../content/profile";

export function ProfilePage() {
  return (
    <>
      <PageHeading
        label="BIBLIOTECA / PERFIL"
        title="Professional Profile"
        description={profile.name}
      >
        <ExternalLink className="button" href={profile.curriculumUrl}>
          Ver currículo PDF
          <WorkspaceIcon name="external" />
        </ExternalLink>
      </PageHeading>
      <nav className="section-navigation" aria-label="Seções do perfil">
        <a href="#resumo">Resumo</a>
        <a href="#experiencia">Experiência</a>
        <a href="#competencias">Competências</a>
        <a href="#formacao">Formação</a>
        <a href="#contato">Contato</a>
      </nav>
      <div className="profile-content">
        <section className="profile-section" id="resumo" tabIndex={-1}>
          <div className="section-label">
            <span className="kicker">POSICIONAMENTO</span>
            <h2>Suporte técnico & sistemas</h2>
          </div>
          <div>
            <p className="profile-lead">
              Analista de Suporte N1/N2, Sistemas/ERP e Service Desk.
            </p>
            <p>{profile.summary}</p>
            <p>
              Windows, redes e infraestrutura fazem parte da base de atuação.
              SQL auxilia a investigação de inconsistências. Linux, Docker,
              Java, Spring Boot e APIs REST são conhecimentos complementares.
            </p>
          </div>
        </section>
        <section className="profile-section" id="experiencia" tabIndex={-1}>
          <div className="section-label">
            <span className="kicker">TRAJETÓRIA</span>
            <h2>Experiência profissional</h2>
          </div>
          <div className="experience-register">
            {experiences.map((item) => (
              <article key={item.company}>
                <p className="mono experience-date">
                  <time dateTime={item.start}>
                    {item.period.split(" - ")[0]}
                  </time>{" "}
                  —{" "}
                  <time dateTime={item.end}>{item.period.split(" - ")[1]}</time>
                </p>
                <h3>{item.role}</h3>
                <p className="company">{item.company}</p>
                <p>{item.description}</p>
                <ul className="responsibilities">
                  {item.responsibilities.map((text) => (
                    <li key={text}>{text}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
        <section className="profile-section" id="competencias" tabIndex={-1}>
          <div className="section-label">
            <span className="kicker">BASE TÉCNICA</span>
            <h2>Competências</h2>
          </div>
          <dl className="skills-register">
            {skillGroups.map((group) => (
              <div key={group.title}>
                <dt>{group.title}</dt>
                <dd>
                  <p>{group.description}</p>
                  <p className="skill-line">{group.skills.join(" / ")}</p>
                </dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="profile-section" id="formacao" tabIndex={-1}>
          <div className="section-label">
            <span className="kicker">FORMAÇÃO</span>
            <h2>Formação acadêmica</h2>
          </div>
          <div>
            <span className="status">{profile.education.status}</span>
            <h3 className="degree">{profile.education.degree}</h3>
            <p>{profile.education.expected}</p>
          </div>
        </section>
        <section className="profile-section" id="contato" tabIndex={-1}>
          <div className="section-label">
            <span className="kicker">CONEXÕES</span>
            <h2>Contato profissional</h2>
          </div>
          <dl className="contacts-register">
            {contacts.map((contact) => (
              <div key={contact.label}>
                <dt>{contact.label}</dt>
                <dd>
                  <ExternalLink href={contact.url}>
                    {contact.display}
                    <WorkspaceIcon
                      name={
                        contact.url.startsWith("https") ? "external" : "arrow"
                      }
                    />
                  </ExternalLink>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </>
  );
}
