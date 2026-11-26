import { incidents, incidentPath } from "../../content/incidents";
import { components, inventoryGroups } from "../../content/infrastructure";
import {
  experiences,
  profile,
  projects,
  skillGroups,
} from "../../content/profile";
import { commands, linuxExamples, type Destination } from "./commands";
import { investigate, scenarioControls, type Investigation } from "./scenarios";
import { parseCommand } from "./parser";

type Link = { label: string; href: string };
export type Response =
  | { kind: "blank" | "clear" | "reset" }
  | { kind: "info"; text: string; links?: readonly Link[] }
  | {
      kind: "simulation" | "error" | "scenario" | "evidence" | "diagnosis";
      text: string;
    };

export function helpResponse(): Response {
  return {
    kind: "info",
    text:
      commands.map((item) => item.name + " — " + item.description).join("\n") +
      "\n\nInvestigação: " +
      scenarioControls.join(" · "),
  };
}

export function respond(parsed: ReturnType<typeof parseCommand>): Response {
  if (parsed.kind === "blank") return parsed;
  if (parsed.kind === "error") return { kind: "error", text: parsed.message };

  if (parsed.kind === "scenario")
    return { kind: "error", text: "Use o console de investigação." };

  switch (parsed.name) {
    case "help":
      return helpResponse();
    case "about":
      return {
        kind: "info",
        text: [
          profile.name,
          profile.role,
          skillGroups[0].skills.slice(0, 3).join(" · "),
          profile.summary,
        ].join("\n"),
        links: [
          { label: "Abrir Professional Profile", href: "/profile/" },
          { label: "Abrir Infrastructure Lab", href: "/infrastructure/" },
        ],
      };
    case "skills":
      return {
        kind: "info",
        text: skillGroups
          .map((group) => group.title + ": " + group.skills.join(", "))
          .join("\n"),
      };
    case "experience":
      return {
        kind: "info",
        text: experiences
          .map(
            (item) =>
              item.company +
              " — " +
              item.role +
              " (" +
              item.period +
              ")\n" +
              item.description,
          )
          .join("\n\n"),
      };
    case "projects":
      return {
        kind: "info",
        text: "Projetos documentados no Engineering Projects.",
        links: projects.map((item, index) => ({
          label: item.title,
          href: "/projects/#project-" + (index + 1),
        })),
      };
    case "lab":
      return {
        kind: "info",
        text: inventoryGroups
          .map(
            (group) =>
              group.category +
              ": " +
              group.items.map((id) => components[id].name).join(", "),
          )
          .join("\n"),
        links: [
          { label: "Ver topologia e inventário", href: "/infrastructure/" },
        ],
      };
    case "cases":
      return {
        kind: "info",
        text: "Estudos de caso profissionais do Incident Explorer.",
        links: incidents.map((item) => ({
          label: item.id + " — " + item.title,
          href: incidentPath(item),
        })),
      };
    case "clear":
      return { kind: "clear" };
    case "reset":
      return { kind: "reset" };
    case "ping":
    case "nslookup":
    case "traceroute":
      return {
        kind: "simulation",
        text: networkExample(parsed.name, parsed.destination),
      };
    default:
      return { kind: "simulation", text: linuxExamples[parsed.name] };
  }
}

function networkExample(
  command: "ping" | "nslookup" | "traceroute",
  destination?: Destination,
) {
  const target =
    destination ?? (command === "nslookup" ? "example.com" : "192.0.2.10");
  switch (command) {
    case "ping":
      return (
        "Destino de exemplo: " +
        target +
        "\nCenário fixo: resposta ICMP ilustrativa de 192.0.2.10. Nenhuma medição feita."
      );
    case "nslookup":
      return (
        "Nome de exemplo: " +
        target +
        "\nResposta DNS ilustrativa: 192.0.2.10 (endereço de documentação)."
      );
    case "traceroute":
      return (
        "Destino de exemplo: " +
        target +
        "\n1  198.51.100.1\n2  203.0.113.1\n3  192.0.2.10\nSaltos fictícios. Nenhum pacote enviado."
      );
  }
}

export function execute(input: string, investigation: Investigation | null) {
  const parsed = parseCommand(input);
  if (parsed.kind === "scenario")
    return investigate(investigation, parsed.command);
  const response = respond(parsed);
  if (
    investigation &&
    response.kind === "simulation" &&
    parsed.kind === "allowed"
  ) {
    const command = parsed.destination
      ? parsed.name + " " + parsed.destination
      : parsed.name;
    const defaultCheck =
      parsed.name === "nslookup"
        ? "nslookup example.com"
        : parsed.name === "ping"
          ? "ping 192.0.2.10"
          : command;
    return investigate(
      investigation,
      parsed.destination ? command : defaultCheck,
    );
  }
  return { response, investigation };
}
