export type IncidentOrigin =
  | "Laboratório"
  | "Experiência profissional"
  | "Demonstração";
export type DocumentationStatus =
  | "Não executado"
  | "Relato anonimizado"
  | "Em documentação"
  | "Documentado";

export interface DiagnosticStep {
  title: string;
  procedure: string;
  snippet?: string;
  qualifier?: "Medida avaliada";
}

export interface IncidentEvidence {
  title: string;
  observation: string;
}

export interface Incident {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  technologies: readonly string[];
  origin: IncidentOrigin;
  status: DocumentationStatus;
  symptoms: readonly string[];
  context: string;
  impact?: string;
  hypotheses?: readonly string[];
  steps: readonly DiagnosticStep[];
  competencies?: readonly string[];
  evidence?: readonly IncidentEvidence[];
  rootCause?: string;
  resolution?: string;
  validation?: string;
  learning?: string;
  timelineIntro?: string;
  complementaryAnalysis?: string;
  improvement?: string;
  topology?: "corporate-network";
  demo?: "catalogues" | "payments";
  type?: "Melhoria de processo";
}

export const incidents: readonly Incident[] = [
  {
    id: "CASE-001",
    slug: "inconsistencia-erp",
    title:
      "Investigação e tratamento de divergências entre estoque físico e ERP",
    description:
      "Estudo de caso da rotina de suporte a ERP, com análise de movimentações, orientação aos usuários e acompanhamento operacional.",
    category: "Sistemas ERP / Controle de Estoque",
    technologies: ["ERP"],
    origin: "Experiência profissional",
    status: "Relato anonimizado",
    symptoms: [
      "Diferenças entre as quantidades físicas e os saldos registrados no ERP.",
    ],
    context:
      "Durante o suporte a um ERP corporativo, o profissional investigava diferenças entre as quantidades físicas e os saldos registrados. A análise combinava movimentações e procedimentos operacionais para identificar possíveis origens das inconsistências.",
    competencies: [
      "Suporte funcional a ERP",
      "Análise de inconsistências",
      "Rastreabilidade de movimentações",
      "Regras de negócio",
      "Troubleshooting",
    ],
    steps: [
      {
        title: "Identificação da divergência",
        procedure:
          "Comparava as informações do ERP com as movimentações e as quantidades observadas no estoque físico.",
      },
      {
        title: "Análise de movimentações",
        procedure:
          "Consultava o histórico de movimentações no ERP e conferia as entradas e saídas de produtos, incluindo as pendentes e as futuras.",
      },
      {
        title: "Localização de possíveis gaps",
        procedure:
          "Reconstruía a sequência de operações para identificar quando as diferenças começaram. Investigava lacunas nos registros e nos procedimentos que poderiam contribuir para o acúmulo das divergências.",
      },
      {
        title: "Avaliação de inventário",
        qualifier: "Medida avaliada",
        procedure:
          "Avaliava a possibilidade de realizar um inventário ao final do expediente ou antes do início das operações. O objetivo era estabelecer uma referência confiável para o estoque com a conferência em um período sem movimentações.",
      },
      {
        title: "Treinamento dos responsáveis",
        procedure:
          "Orientava os colaboradores envolvidos nos procedimentos que poderiam contribuir para as lacunas. Realizava treinamentos sobre uso do ERP, movimentações de estoque e fluxo operacional da empresa.",
      },
      {
        title: "Acompanhamento operacional",
        procedure:
          "Acompanhava a operação ao longo da semana, verificava se os procedimentos estavam sendo seguidos e observava possíveis novas inconsistências. Esclarecia dúvidas e reforçava orientações quando necessário. O acompanhamento buscava melhorar a consistência dos registros e a compreensão dos procedimentos pelos usuários.",
      },
    ],
  },
  {
    id: "CASE-002",
    slug: "falha-conectividade-rede-corporativa",
    title:
      "Diagnóstico de falha de conectividade e reorganização da rede corporativa",
    description:
      "Rastreamento de um ponto sem conectividade, confirmação da falha de encaixe e reorganização posterior das conexões físicas em colaboração com a equipe.",
    category: "Infraestrutura / Redes",
    technologies: ["Redes", "Switches", "WinBox"],
    origin: "Experiência profissional",
    status: "Relato anonimizado",
    symptoms: ["O setor de almoxarifado ficou sem conectividade."],
    context:
      "A rede corporativa tinha cabeamento desorganizado, pontos sem identificação e vários switches intermediários.",
    timelineIntro:
      "Sequência das verificações que restabeleceram a conectividade do almoxarifado.",
    competencies: [
      "Diagnóstico de conectividade",
      "Rastreamento físico",
      "Mapeamento de rede",
      "Identificação de pontos",
      "Trabalho em equipe",
    ],
    steps: [
      {
        title: "Chamado do almoxarifado",
        procedure: "O almoxarifado informou a perda de conectividade.",
      },
      {
        title: "Inspeção física",
        procedure:
          "O profissional inspecionou as conexões físicas em uma rede com pontos sem identificação e switches intermediários.",
      },
      {
        title: "Rastreamento do cabo",
        procedure:
          "O cabo do almoxarifado chegava a um switch pequeno na sala de vendas. Esse switch tinha três cabos conectados: um uplink do switch principal, um cabo para um computador de vendas e outro para o almoxarifado.",
      },
      {
        title: "Identificação do mau encaixe",
        procedure: "O profissional encontrou um cabo mal encaixado no switch.",
      },
      {
        title: "Reconexão e restabelecimento",
        procedure:
          "O encaixe correto do cabo restabeleceu a conexão no almoxarifado.",
      },
      {
        title: "Teste controlado de confirmação",
        procedure:
          "A desconexão controlada reproduziu a perda de conexão e confirmou a correspondência entre o cabo e o ponto do almoxarifado.",
      },
    ],
    hypotheses: [
      "Um deslocamento acidental pode ter afrouxado o cabo. A origem do mau encaixe não foi confirmada.",
    ],
    evidence: [
      {
        title: "Verificação funcional relatada",
        observation:
          "A conexão voltou com o encaixe correto e a perda foi reproduzida ao desconectar o cabo de forma controlada.",
      },
    ],
    resolution:
      "Conectividade do almoxarifado restabelecida após corrigir o encaixe do cabo.",
    complementaryAnalysis:
      "Durante a consulta pelo WinBox, foram observados endereços IP inicialmente desconhecidos. O relato se limita a essa observação.",
    improvement:
      "Depois do incidente, o profissional e outro integrante da equipe rastrearam as conexões físicas, identificaram cabos e pontos com etiquetas simples, removeram switches intermediários desnecessários nas salas administrativas e ligaram os cabos administrativos diretamente ao switch principal. Os switches menores necessários foram mantidos na sala de vendas, onde havia aproximadamente dez computadores.",
    topology: "corporate-network",
  },
  {
    id: "CASE-003",
    slug: "catalogos-tecnicos",
    title: "Digitalização e consulta de catálogos técnicos",
    description:
      "Aplicação Python com Tesseract OCR para consultar produtos, imagens das páginas e especificações de dois catálogos.",
    category: "Automação / Python",
    technologies: ["Python", "Tesseract OCR"],
    origin: "Experiência profissional",
    status: "Relato anonimizado",
    type: "Melhoria de processo",
    context:
      "Dois catálogos extensos tornavam difícil localizar determinados produtos e consultar suas medidas.",
    symptoms: [
      "A localização de produtos e especificações exigia procurar em muitas páginas.",
    ],
    timelineIntro: "Etapas da digitalização e da consulta técnica.",
    steps: [
      {
        title: "Digitalizar os catálogos",
        procedure:
          "A aplicação em Python utilizava Tesseract OCR para digitalizar dois catálogos.",
      },
      {
        title: "Consultar produtos",
        procedure:
          "A consulta permitia localizar produtos e abrir as imagens das páginas correspondentes.",
      },
      {
        title: "Conferir as especificações",
        procedure:
          "As imagens davam acesso às medidas e informações técnicas apresentadas nos catálogos.",
      },
    ],
    improvement:
      "A ferramenta digital facilitou o acesso às informações dos produtos.",
    demo: "catalogues",
  },
  {
    id: "CASE-004",
    slug: "automacao-boletos",
    title: "Automação do processamento e gestão de boletos",
    description:
      "Aplicação web em Python com Tesseract OCR para processar e organizar boletos em um servidor.",
    category: "Automação / Python",
    technologies: ["Python", "Tesseract OCR"],
    origin: "Experiência profissional",
    status: "Relato anonimizado",
    type: "Melhoria de processo",
    context:
      "Os boletos chegavam em arquivos compactados ou PDFs individuais. A separação era manual e a recuperação de arquivos recorria ao histórico do WhatsApp.",
    symptoms: [
      "Os documentos precisavam ser separados e localizados manualmente.",
    ],
    timelineIntro:
      "Fluxo implementado para processar, organizar e recuperar documentos.",
    steps: [
      {
        title: "Importação",
        procedure: "A aplicação recebia os documentos para processamento.",
      },
      {
        title: "Processamento e OCR",
        procedure:
          "Os PDFs eram processados automaticamente e as informações eram reconhecidas com Tesseract OCR.",
      },
      {
        title: "Validação",
        procedure:
          "A aplicação identificava documentos já existentes e documentos fora dos parâmetros configurados.",
      },
      {
        title: "Organização",
        procedure: "Os boletos eram organizados no servidor.",
      },
      {
        title: "Consulta e exportação",
        procedure:
          "Os usuários consultavam por cliente, nota fiscal e parcela e podiam exportar boletos em PDF, conforme o perfil.",
      },
    ],
    complementaryAnalysis:
      "A aplicação exibia mensagens de erro quando uma operação falhava e classificava documentos fora do padrão. Formatos novos exigiam revisão e atualização manual dos parâmetros de reconhecimento.",
    improvement:
      "A aplicação reuniu processamento e consulta, com controle de acesso por perfil, administração de usuários e funcionalidade de auditoria.",
    demo: "payments",
  },
];

const archivedIncidents: readonly Incident[] = [
  {
    id: "LAB-002",
    slug: "conectividade-de-rede",
    title: "Conectividade de rede",
    description: "Isolar falhas de comunicação entre estação, gateway e rede.",
    category: "Rede",
    technologies: ["Windows", "TCP/IP"],
    origin: "Demonstração",
    status: "Não executado",
    symptoms: [
      "No cenário proposto, uma estação perde acesso a um recurso de rede.",
    ],
    context:
      "Estação e gateway de laboratório com endereçamento reservado para documentação.",
    impact: "Possível perda de acesso a recursos fora do segmento local.",
    hypotheses: [
      "Interface ou rota padrão ausente.",
      "Gateway inalcançável ou ICMP filtrado.",
    ],
    steps: [
      {
        title: "Conferir a rota padrão",
        procedure:
          "Verificar interface, destino e gateway antes de interpretar um teste de alcance.",
        snippet: "route print -4",
      },
      {
        title: "Testar o gateway do laboratório",
        procedure:
          "Substituir o endereço de documentação pelo gateway autorizado no laboratório. Ausência de resposta ICMP, isoladamente, não confirma indisponibilidade.",
        snippet: "ping -n 4 192.0.2.1",
      },
    ],
    evidence: [],
    validation:
      "Comparar o alcance do gateway com o acesso ao serviço de teste na rede e documentar separadamente os resultados.",
    learning:
      "Testar estação, gateway e serviço em etapas, sem confundir restrição de ICMP com perda de conectividade.",
  },
];

export const incidentBasePath = "/incidents/";
export const incidentPath = (incident: Incident) =>
  incidentBasePath + incident.slug + "/";
export const incidentForPath = (path: string) =>
  [...incidents, ...archivedIncidents].find(
    (incident) => incidentPath(incident) === path,
  );

export const archivedIncidentPaths = archivedIncidents.map(incidentPath);
