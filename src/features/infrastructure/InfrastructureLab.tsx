import { ConnectivityWorkspace } from "./ConnectivityWorkspace";
import { useState } from "react";
import { ExternalLink } from "../../components/ExternalLink";
import { PageHeading } from "../../components/PageHeading";
import { WorkspaceIcon } from "../../components/WorkspaceIcon";
import { incidentForPath, incidentPath } from "../../content/incidents";
import {
  accessPaths,
  components,
  inventoryGroups,
  type ComponentId,
} from "../../content/infrastructure";
import "./infrastructure.css";

type View = "overview" | keyof typeof accessPaths;
type SelectComponent = (id: ComponentId) => void;
const views: readonly { id: View; label: string }[] = [
  { id: "overview", label: "Visão geral" },
  { id: "external", label: "Acesso externo" },
  { id: "internal", label: "Acesso interno" },
];

export function InfrastructureLab() {
  return (
    <div className="lab">
      <PageHeading
        label="ARQUITETURA DOCUMENTADA"
        title="Infrastructure Lab"
        description="Laboratório pessoal de infraestrutura Linux, containerização e hospedagem de aplicações."
      />
      <section className="lab-overview" aria-labelledby="lab-overview">
        <h2 id="lab-overview">Infrastructure Overview</h2>
        <ul>
          <li>1 servidor físico</li>
          <li>Ubuntu Server</li>
          <li>Docker / Docker Compose</li>
          <li>Cloudflare Tunnel</li>
          <li>Tailscale</li>
          <li>OpenSSH</li>
          <li>2 aplicações hospedadas</li>
        </ul>
      </section>
      <InteractiveTopology />
      <ConnectivityWorkspace />
      <ComponentInventory />
      <HostedApplications />
    </div>
  );
}

function InteractiveTopology() {
  const [view, setView] = useState<View>("overview");
  const [selected, setSelected] = useState<ComponentId>("host");
  const path = view === "overview" ? undefined : accessPaths[view];

  function changeView(next: View) {
    setView(next);
    setSelected(
      next === "external" ? "tunnel" : next === "internal" ? "lan" : "host",
    );
  }

  return (
    <section className="panel lab-topology" aria-labelledby="lab-topology">
      <div className="panel-heading">
        <h2 id="lab-topology">Interactive Topology</h2>
      </div>
      <fieldset className="lab-views">
        <legend>Visualização da arquitetura</legend>
        {views.map((item) => (
          <label key={item.id}>
            <input
              type="radio"
              name="lab-view"
              value={item.id}
              checked={view === item.id}
              onChange={() => changeView(item.id)}
            />
            {item.label}
          </label>
        ))}
      </fieldset>
      <div className="lab-topology-grid">
        <div className="lab-diagram">
          <div className="lab-paths">
            {(view === "overview"
              ? [accessPaths.external, accessPaths.internal]
              : [accessPaths[view]]
            ).map((route) => (
              <AccessPath
                key={route.title}
                route={route}
                selected={selected}
                onSelect={setSelected}
              />
            ))}
          </div>
          <section
            className="lab-host"
            aria-label="Servidor físico e ambiente instalado"
          >
            <p className="kicker">HOST FÍSICO ÚNICO</p>
            <LabNode id="host" selected={selected} onSelect={setSelected} />
            <div className="lab-environment">
              <LabNode id="ubuntu" selected={selected} onSelect={setSelected} />
              {view === "overview" && (
                <div className="lab-services">
                  <NodeGroup
                    label="Containerização instalada"
                    ids={["docker", "compose"]}
                    selected={selected}
                    onSelect={setSelected}
                  />
                  <NodeGroup
                    label="Conectividade e administração"
                    ids={["tunnel", "tailscale", "ssh"]}
                    selected={selected}
                    onSelect={setSelected}
                  />
                </div>
              )}
              <NodeGroup
                label="Aplicações hospedadas"
                ids={
                  view === "external"
                    ? ["booking"]
                    : view === "internal"
                      ? ["bills"]
                      : ["booking", "bills"]
                }
                selected={selected}
                onSelect={setSelected}
              />
            </div>
          </section>
        </div>
        <ComponentDetails id={selected} activePath={path?.title} />
      </div>
      <p className="lab-legend">
        As setas indicam caminhos lógicos de acesso. O contorno do host agrupa
        os recursos instalados e as aplicações hospedadas.
      </p>
    </section>
  );
}

function AccessPath({
  route,
  selected,
  onSelect,
}: {
  route: (typeof accessPaths)[keyof typeof accessPaths];
  selected: ComponentId;
  onSelect: SelectComponent;
}) {
  return (
    <section className="lab-path">
      <h3>{route.title}</h3>
      <ol>
        {route.steps.map((step) => (
          <li key={step.label}>
            {step.component ? (
              <LabNode
                id={step.component}
                label={step.label}
                selected={selected}
                onSelect={onSelect}
              />
            ) : (
              <span>{step.label}</span>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

function LabNode({
  id,
  label,
  selected,
  onSelect,
}: {
  id: ComponentId;
  label?: string;
  selected: ComponentId;
  onSelect: SelectComponent;
}) {
  return (
    <button
      className="lab-node"
      type="button"
      aria-pressed={selected === id}
      aria-controls="lab-component-detail"
      onClick={() => onSelect(id)}
    >
      {label ?? components[id].name}
    </button>
  );
}

function NodeGroup({
  label,
  ids,
  selected,
  onSelect,
}: {
  label: string;
  ids: readonly ComponentId[];
  selected: ComponentId;
  onSelect: SelectComponent;
}) {
  return (
    <div className="lab-node-group">
      <h3>{label}</h3>
      <div>
        {ids.map((id) => (
          <LabNode key={id} id={id} selected={selected} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

function ComponentDetails({
  id,
  activePath,
}: {
  id: ComponentId;
  activePath?: string;
}) {
  const item = components[id];
  const route =
    id === "bills" || id === "lan"
      ? accessPaths.internal
      : id === "booking" || id === "domain" || id === "tunnel"
        ? accessPaths.external
        : id === "host" && activePath === accessPaths.internal.title
          ? accessPaths.internal
          : undefined;
  return (
    <aside
      className="lab-detail"
      id="lab-component-detail"
      aria-label="Detalhes do componente"
    >
      <p className="kicker">Inspeção do componente</p>
      <div aria-live="polite" aria-atomic="true">
        <h3>{item.name}</h3>
        <p className="muted">{item.category}</p>
        <dl>
          <dt>Função</dt>
          <dd>{item.description}</dd>
          <dt>No laboratório</dt>
          <dd>{item.use}</dd>
          <dt>Relações</dt>
          <dd>{item.relations}</dd>
          {route && (
            <>
              <dt>Caminho lógico</dt>
              <dd>{route.steps.map((step) => step.label).join(" → ")}</dd>
            </>
          )}
          <dt>Observação</dt>
          <dd>{item.note}</dd>
        </dl>
      </div>
    </aside>
  );
}

function ComponentInventory() {
  return (
    <section className="panel lab-inventory" aria-labelledby="lab-inventory">
      <div className="panel-heading">
        <h2 id="lab-inventory">Component Inventory</h2>
      </div>
      {inventoryGroups.map((group) => (
        <section key={group.category} className="lab-inventory-group">
          <h3>{group.category}</h3>
          <dl>
            {group.items.map((id) => (
              <div key={id}>
                <dt>{components[id].name}</dt>
                <dd>
                  {components[id].description} {components[id].relations}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </section>
  );
}

function HostedApplications() {
  const case004 = incidentForPath("/incidents/automacao-boletos/");
  return (
    <section
      className="panel lab-applications"
      aria-labelledby="lab-applications"
    >
      <div className="panel-heading">
        <h2 id="lab-applications">Hosted Applications</h2>
      </div>
      <div className="lab-application-grid">
        <article>
          <h3>{components.booking.name}</h3>
          <dl>
            <dt>Cliente</dt>
            <dd>Barbearia Studio L</dd>
            <dt>Situação</dt>
            <dd>Em desenvolvimento e testes</dd>
            <dt>Hospedagem</dt>
            <dd>{components.host.name}</dd>
            <dt>Acesso</dt>
            <dd>Domínio configurado via Cloudflare Tunnel</dd>
            <dt>Finalidade</dt>
            <dd>Agendamento e gestão operacional</dd>
          </dl>
          <ExternalLink
            className="text-link"
            href={components.booking.publicUrl}
          >
            Acessar ambiente de testes <WorkspaceIcon name="external" />
          </ExternalLink>
        </article>
        <article>
          <h3>{components.bills.name}</h3>
          <dl>
            <dt>Tecnologias</dt>
            <dd>Python e Tesseract OCR</dd>
            <dt>Hospedagem</dt>
            <dd>HP ML30</dd>
            <dt>Acesso</dt>
            <dd>Rede local via IP privado</dd>
            <dt>Finalidade</dt>
            <dd>
              Processamento, organização, consulta e exportação de boletos
            </dd>
            <dt>Características</dt>
            <dd>Importação automatizada e permissões por perfil</dd>
          </dl>
          {case004 && (
            <a className="text-link" href={incidentPath(case004)}>
              Ver estudo de caso CASE-004 <WorkspaceIcon name="arrow" />
            </a>
          )}
        </article>
      </div>
    </section>
  );
}
