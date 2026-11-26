type Verification = readonly [
  command: string,
  observation: string,
  decisive?: true,
];
type Hypothesis = readonly [id: string, title: string, feedback: string];
interface Scenario {
  id: string;
  title: string;
  symptom: string;
  context: string;
  checks: readonly Verification[];
  hypotheses: readonly Hypothesis[];
  expected: string;
  explanation: string;
}

export const scenarios: readonly Scenario[] = [
  {
    id: "external",
    title: "Acesso externo por domínio",
    symptom:
      "Um usuário não consegue acessar uma aplicação publicada por domínio.",
    context:
      "Domínio de exemplo, rede Cloudflare, túnel e serviço de origem fictício.",
    checks: [
      [
        "nslookup example.com",
        "O domínio demonstrativo resolve para 192.0.2.10.",
        true,
      ],
      ["scenario check tunnel", "O túnel está conectado no cenário.", true],
      [
        "scenario check route",
        "A rota conceitual referencia o serviço esperado.",
        true,
      ],
      ["systemctl status", "O serviço de origem está inativo.", true],
    ],
    hypotheses: [
      [
        "dns",
        "DNS incorreto",
        "A resolução demonstrativa retornou o endereço esperado.",
      ],
      ["tunnel", "Túnel indisponível", "O túnel está conectado no cenário."],
      ["origin", "Serviço de origem indisponível", "A origem está inativa."],
    ],
    expected: "origin",
    explanation:
      "O domínio resolve, a rota está correta e o túnel está conectado. A falha observada está no serviço de origem, que permanece inativo.",
  },
  {
    id: "lan",
    title: "Aplicação interna pela LAN",
    symptom:
      "Um usuário da rede local não consegue acessar uma aplicação interna.",
    context:
      "Cliente e servidor fictícios na LAN. O destino usa endereço reservado para documentação.",
    checks: [
      [
        "ip addr",
        "A interface do cliente tem o endereço demonstrativo 192.0.2.20/24.",
      ],
      ["ping 192.0.2.10", "O servidor demonstrativo responde ao ICMP.", true],
      [
        "systemctl status",
        "O serviço da aplicação interna está inativo.",
        true,
      ],
    ],
    hypotheses: [
      [
        "network",
        "Falha de alcance do servidor",
        "A resposta ICMP indica que o host é alcançável no cenário.",
      ],
      [
        "service",
        "Aplicação interna indisponível",
        "O serviço da aplicação está inativo.",
      ],
    ],
    expected: "service",
    explanation:
      "O host responde ao ICMP e o serviço da aplicação está inativo. O alcance do host não confirma a disponibilidade da aplicação.",
  },
  {
    id: "remote",
    title: "Administração remota conceitual",
    symptom: "Uma sessão administrativa remota não pode ser estabelecida.",
    context:
      "Exemplo educativo de rede privada e SSH. A configuração conjunta do laboratório real não está confirmada.",
    checks: [
      [
        "scenario check connectivity",
        "O dispositivo tem conectividade e o caminho privado conceitual está disponível.",
      ],
      ["ping 192.0.2.10", "O destino demonstrativo está alcançável.", true],
      ["systemctl status", "O serviço SSH fictício está ativo.", true],
      [
        "scenario check access",
        "A política fictícia indica que o acesso neste contexto não é autorizado. Nenhuma autenticação foi tentada.",
        true,
      ],
    ],
    hypotheses: [
      [
        "network",
        "Destino inalcançável",
        "O alcance do destino foi confirmado na simulação.",
      ],
      ["ssh", "Serviço SSH indisponível", "O serviço SSH fictício está ativo."],
      [
        "access",
        "Restrição de acesso",
        "A política do cenário não autoriza o acesso.",
      ],
    ],
    expected: "access",
    explanation:
      "O destino é alcançável e o SSH está ativo. A evidência decisiva está na restrição de acesso da política fictícia.",
  },
];

export const scenarioControls = [
  "scenario help",
  "scenario list",
  "scenario status",
  "scenario diagnose",
  "scenario reset",
  "scenario exit",
] as const;
export const scenarioSyntax = [
  ...new Set([
    ...scenarioControls,
    ...scenarios.flatMap((item) => [
      "scenario start " + item.id,
      ...item.checks
        .map(([command]) => command)
        .filter((command) => command.startsWith("scenario ")),
      ...item.hypotheses.map(([id]) => "scenario diagnose " + id),
    ]),
  ]),
];

export type Investigation = {
  scenario: Scenario;
  observed: readonly string[];
  phase: "investigating" | "confirmed";
};

type Report = { kind: "scenario" | "evidence" | "diagnosis"; text: string };
type Transition = { investigation: Investigation | null; response: Report };
const help = [
  "scenario list · lista os cenários",
  "scenario start <id> · inicia uma investigação",
  "scenario status · mostra sintomas, evidências e verificações disponíveis",
  "scenario diagnose · lista as hipóteses do cenário",
  "scenario diagnose <hipótese> · avalia a hipótese",
  "scenario reset · reinicia apenas a investigação",
  "scenario exit · sai da investigação",
].join("\n");

export function investigate(
  current: Investigation | null,
  command: string,
): Transition {
  const report = (
    text: string,
    kind: Report["kind"] = "scenario",
    investigation = current,
  ): Transition => ({ investigation, response: { kind, text } });
  if (command === "scenario help") return report(help);
  if (command === "scenario list")
    return report(
      scenarios.map((item) => item.id + " — " + item.title).join("\n"),
    );

  const [namespace, action, argument] = command.split(" ");
  if (namespace === "scenario" && action === "start") {
    const scenario = scenarios.find((item) => item.id === argument);
    if (scenario) {
      return report(
        scenario.title +
          "\n" +
          scenario.symptom +
          "\n" +
          scenario.context +
          "\nDigite scenario status para consultar as verificações.",
        "scenario",
        { scenario, observed: [], phase: "investigating" },
      );
    }
  }
  if (!current)
    return report(
      "Inicie um cenário com scenario start <id>. Consulte scenario list.",
    );
  const { scenario, observed } = current;

  if (command === "scenario exit")
    return report(
      "Investigação encerrada. O terminal voltou ao modo demonstrativo padrão.",
      "scenario",
      null,
    );
  if (command === "scenario reset")
    return report(
      "Investigação reiniciada. Nenhuma evidência coletada.",
      "scenario",
      { ...current, observed: [], phase: "investigating" },
    );
  if (command === "scenario status")
    return report(
      [
        scenario.title,
        scenario.symptom,
        scenario.context,
        "Estado: " +
          (current.phase === "confirmed"
            ? "diagnóstico confirmado"
            : "em investigação"),
        "Evidências coletadas: " +
          (observed.length ? observed.join(", ") : "nenhuma"),
        "Verificações disponíveis:",
        ...scenario.checks.map(([name]) => name),
      ].join("\n"),
    );

  if (namespace === "scenario" && action === "diagnose") {
    if (!argument)
      return report(
        scenario.hypotheses
          .map(([id, title]) => "scenario diagnose " + id + " — " + title)
          .join("\n"),
      );
    const hypothesis = scenario.hypotheses.find(([id]) => id === argument);
    if (!hypothesis)
      return report(
        "Esta hipótese não pertence ao cenário. Digite scenario diagnose para ver as opções.",
        "diagnosis",
      );
    const missing = scenario.checks.filter(
      ([name, , decisive]) => decisive && !observed.includes(name),
    );
    if (missing.length)
      return report(
        "Evidências insuficientes. Ainda faltam: " +
          missing.map(([name]) => name).join(", ") +
          ".",
        "diagnosis",
      );
    if (argument !== scenario.expected)
      return report(
        "Revise a hipótese à luz das evidências. " + hypothesis[2],
        "diagnosis",
      );
    return report(
      "Diagnóstico confirmado na simulação: " +
        hypothesis[1] +
        ".\n" +
        scenario.explanation,
      "diagnosis",
      { ...current, phase: "confirmed" },
    );
  }

  const check = scenario.checks.find(([name]) => name === command);
  if (!check)
    return report(
      "Verificação fora do cenário atual. Digite scenario status para consultar as opções.",
    );
  return report(
    check[1],
    "evidence",
    observed.includes(command)
      ? current
      : { ...current, observed: [...observed, command] },
  );
}
