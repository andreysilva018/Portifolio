export interface Experience {
  company: string;
  role: string;
  start: string;
  end: string;
  period: string;
  description: string;
  responsibilities: string[];
}

export interface SkillGroup {
  title: string;
  description: string;
  skills: string[];
}
export interface Project {
  title: string;
  category: string;
  description: string;
  stack: string[];
  url: string;
}
export interface Contact {
  label: string;
  display: string;
  url: string;
}

export const profile = {
  name: "Andrey Vinícius de Souza Silva",
  role: "Suporte de TI · Sistemas & ERP · Service Desk",
  summary:
    "Experiência no atendimento a usuários e no suporte a ambientes corporativos, conectando demandas do dia a dia, sistemas ERP e processos empresariais. Atuação com Windows, redes, impressoras, chamados e investigação de inconsistências, com atenção à documentação e à comunicação com quem utiliza a tecnologia.",
  curriculumUrl:
    "https://drive.google.com/file/d/14kf3A-JKIvVqD1BDIgz6GAb1IPEqsabL/view?usp=sharing",
  education: {
    degree: "Análise e Desenvolvimento de Sistemas",
    status: "Em andamento",
    expected: "Previsão de conclusão: 2027",
  },
} as const;

export const experiences: Experience[] = [
  {
    company: "Souza Indústria e Comércio de Peças",
    role: "Assistente de TI",
    start: "2025-04",
    end: "2026-11",
    period: "abr. 2025 — nov. 2026",
    description:
      "Suporte próximo à operação, aos usuários e aos sistemas da empresa.",
    responsibilities: [
      "Suporte a usuários, Windows, redes e impressoras no ambiente corporativo.",
      "Acompanhamento e suporte ao ERP Doctus nos processos administrativos e operacionais.",
      "Investigação de inconsistências de estoque, faturamento e movimentações no sistema.",
      "Levantamento e documentação de processos internos e regras de negócio.",
    ],
  },
  {
    company: "Doctus Tecnologia",
    role: "Estágio em suporte",
    start: "2024-08",
    end: "2025-02",
    period: "ago. 2024 — fev. 2025",
    description:
      "Atendimento a usuários de ERP e apoio à investigação de problemas.",
    responsibilities: [
      "Suporte aos usuários e acompanhamento de chamados técnicos.",
      "Investigação, reprodução e documentação de falhas relatadas pelos clientes.",
      "Apoio à equipe de desenvolvimento na análise de problemas e regras de negócio.",
    ],
  },
];

export const skillGroups: SkillGroup[] = [
  {
    title: "Suporte e sistemas",
    description: "O usuário e o processo no centro do atendimento.",
    skills: [
      "Suporte N1/N2",
      "Service Desk",
      "Sistemas ERP",
      "Chamados",
      "Documentação",
      "Investigação de inconsistências",
    ],
  },
  {
    title: "Infraestrutura",
    description: "A base que sustenta o trabalho diário.",
    skills: [
      "Windows",
      "Redes",
      "Impressoras",
      "Linux · complementar",
      "Docker · complementar",
    ],
  },
  {
    title: "Banco de dados",
    description: "Consultas e entendimento dos dados como apoio à análise.",
    skills: ["SQL", "Bancos relacionais", "Regras de negócio"],
  },
  {
    title: "Engenharia de software",
    description:
      "Conhecimentos complementares para compreender e construir sistemas.",
    skills: ["Java", "Spring Boot", "APIs REST"],
  },
];

export const projects: Project[] = [
  {
    title: "Sistema de Cadastro de Clientes",
    category: "Aplicação desktop",
    description:
      "Projeto em Java com interface Swing, cadastro de clientes, validação de dados e persistência relacional. Uma prática de desenvolvimento para compreender o funcionamento dos sistemas além da interface.",
    stack: ["Java", "Swing", "JDBC", "MySQL"],
    url: "https://github.com/andreysilva018/Desktop-client-management-system",
  },
  {
    title: "Task Manager Java",
    category: "Organização de tarefas",
    description:
      "Gerenciador de tarefas desktop com criação, edição, priorização e conclusão de atividades. Organização em camadas e persistência em banco de dados.",
    stack: ["Java", "MySQL", "Swing", "MVC"],
    url: "https://github.com/andreysilva018/task-manager-java",
  },
];

export const contacts: Contact[] = [
  {
    label: "LinkedIn",
    display: "andrey-ssilva",
    url: "https://www.linkedin.com/in/andrey-ssilva/",
  },
  {
    label: "E-mail",
    display: "andreysilvatisuporte@gmail.com",
    url: "mailto:andreysilvatisuporte@gmail.com",
  },
  {
    label: "GitHub",
    display: "andreysilva018",
    url: "https://github.com/andreysilva018",
  },
  {
    label: "WhatsApp",
    display: "+55 (18) 99772-7839",
    url: "https://wa.me/5518997727839",
  },
  {
    label: "Instagram",
    display: "@andreysouzasilvaa",
    url: "https://www.instagram.com/andreysouzasilvaa/",
  },
];
