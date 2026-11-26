import { useState } from "react";

const samples = [
  {
    id: "DEMO-A",
    name: "Bucha cilíndrica",
    page: 2,
    dimensions: "Ø externo 40 mm × altura 24 mm",
    material: "Polímero ilustrativo",
  },
  {
    id: "DEMO-B",
    name: "Suporte em L",
    page: 5,
    dimensions: "60 × 35 × 4 mm",
    material: "Aço ilustrativo",
  },
  {
    id: "DEMO-C",
    name: "Anel espaçador",
    page: 8,
    dimensions: "Ø externo 48 mm × espessura 6 mm",
    material: "Liga ilustrativa",
  },
];

function normalize(value: string) {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();
}

export function CatalogueDemo() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(samples[0].id);
  const needle = normalize(query);
  const results = samples.filter((item) =>
    normalize(item.id + " " + item.name + " " + item.dimensions).includes(
      needle,
    ),
  );
  const selected = results.find((item) => item.id === selectedId) ?? results[0];

  return (
    <section className="process-demo" aria-labelledby="catalogue-demo-title">
      <h3 id="catalogue-demo-title">Demonstração de consulta ao catálogo</h3>
      <p>
        Produtos, páginas e especificações fictícios para ilustrar a consulta.
      </p>
      <label className="demo-search">
        Pesquisar produtos fictícios
        <input
          type="search"
          placeholder="Ex.: bucha, anel ou DEMO-B"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      <p role="status">
        {results.length}{" "}
        {results.length === 1 ? "produto encontrado" : "produtos encontrados"}
      </p>
      {selected ? (
        <div className="demo-catalogue">
          <ul aria-label="Resultados da consulta">
            {results.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  aria-pressed={selected.id === item.id}
                  onClick={() => setSelectedId(item.id)}
                >
                  {item.name}
                  <span className="mono">{item.id}</span>
                </button>
              </li>
            ))}
          </ul>
          <article className="demo-sheet" aria-labelledby="demo-product-title">
            <p className="kicker">
              Página fictícia {selected.page} · Prévia conceitual
            </p>
            <h4 id="demo-product-title">{selected.name}</h4>
            <div
              className="demo-sheet-figure"
              data-part={selected.id}
              aria-hidden="true"
            >
              <span className="demo-part" />
            </div>
            <dl>
              <dt>Medidas ilustrativas</dt>
              <dd>{selected.dimensions}</dd>
              <dt>Material ilustrativo</dt>
              <dd>{selected.material}</dd>
            </dl>
          </article>
        </div>
      ) : (
        <p>Nenhum produto fictício corresponde à pesquisa.</p>
      )}
    </section>
  );
}

const outcomes = ["Importados", "Já existentes", "Fora do padrão"] as const;
type Outcome = (typeof outcomes)[number];

const scenarios: readonly {
  id: string;
  label: string;
  documents: readonly Outcome[];
}[] = [
  {
    id: "new",
    label: "Documentos novos",
    documents: ["Importados", "Importados", "Importados"],
  },
  {
    id: "existing",
    label: "Documentos já existentes",
    documents: ["Importados", "Já existentes", "Já existentes"],
  },
  {
    id: "exception",
    label: "Documentos fora do padrão",
    documents: ["Importados", "Fora do padrão", "Fora do padrão"],
  },
];

const permissions = [
  { action: "Importar", allowed: [true, false, true] },
  { action: "Consultar", allowed: [true, true, true] },
  { action: "Exportar PDF", allowed: [true, true, true] },
  { action: "Criar usuários", allowed: [false, false, true] },
  { action: "Auditoria", allowed: [false, false, true] },
];

export function PaymentsDemo() {
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const scenario =
    scenarios.find((item) => item.id === scenarioId) ?? scenarios[0];
  const counts = outcomes.map(
    (outcome) =>
      scenario.documents.filter((document) => document === outcome).length,
  );

  return (
    <section className="process-demo" aria-labelledby="payments-demo-title">
      <h3 id="payments-demo-title">Demonstração do processamento de boletos</h3>
      <p>
        Simulação local com documentos fictícios. Os indicadores ilustram cada
        cenário.
      </p>
      <ol className="demo-flow" aria-label="Fluxo da simulação">
        {[
          "Importação",
          "Processamento/OCR",
          "Validação",
          "Organização",
          "Consulta/Exportação",
        ].map((stage) => (
          <li key={stage}>{stage}</li>
        ))}
      </ol>
      <label className="demo-search">
        Cenário de processamento
        <select
          value={scenarioId}
          onChange={(event) => setScenarioId(event.target.value)}
        >
          {scenarios.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <dl className="demo-counts" aria-live="polite" aria-atomic="true">
        <div>
          <dt>PDFs encontrados</dt>
          <dd>{scenario.documents.length}</dd>
        </div>
        {outcomes.map((outcome, index) => (
          <div key={outcome}>
            <dt>{outcome}</dt>
            <dd>{counts[index]}</dd>
          </div>
        ))}
      </dl>
      <table className="demo-permissions">
        <caption>Matriz de permissões por perfil</caption>
        <thead>
          <tr>
            {["Funcionalidade", "Financeiro", "Vendas", "Administrador"].map(
              (label) => (
                <th scope="col" key={label}>
                  {label}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {permissions.map(({ action, allowed }) => (
            <tr key={action}>
              <th scope="row">{action}</th>
              {allowed.map((value, index) => (
                <td key={index}>{value ? "Sim" : "Não"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
