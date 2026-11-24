import { accessPaths, components, type ComponentId } from './infrastructure';

interface Step {
  id: string;
  label: string;
  component?: ComponentId;
  purpose: string;
  explanation: string;
  dependsOn: string;
  failure: string;
  check: string;
}

interface Path {
  id: string;
  title: string;
  scope: string;
  steps: readonly Step[];
}

const external = accessPaths.external.steps;
const internal = accessPaths.internal.steps;

export const connectivityPaths: readonly Path[] = [
  {
    id: 'external', title: 'External Access — Cloudflare Tunnel',
    scope: 'Caminho documentado do agendamento, com etapas técnicas conceituais.',
    steps: [
      { id: 'visitor', ...external[0], purpose: 'Iniciar a solicitação.', explanation: 'O navegador solicita o domínio configurado.', dependsOn: 'Conectividade do visitante.', failure: 'Cliente sem acesso à internet.', check: 'Distinguir falha do cliente de falha específica do domínio.' },
      { id: 'domain', ...external[1], purpose: 'Identificar o destino público.', explanation: 'A resolução do nome é necessária antes do encaminhamento da solicitação.', dependsOn: 'Resolução do domínio.', failure: 'Nome indisponível ou resolução incorreta.', check: 'Confirmar se o domínio resolve conforme esperado.' },
      { id: 'edge', label: 'Rede Cloudflare', purpose: 'Encaminhar a solicitação pública.', explanation: 'A Cloudflare encaminha o acesso conforme a rota publicada.', dependsOn: 'Correspondência entre domínio e rota.', failure: 'Rota ausente ou associada a outro serviço.', check: 'Conferir a associação da rota ao serviço esperado.' },
      { id: 'tunnel', label: 'Túnel cloudflared', component: 'tunnel', purpose: 'Alcançar o serviço de origem.', explanation: 'O conector cloudflared conecta a rota publicada ao serviço de origem. Túnel conectado e aplicação disponível são verificações distintas.', dependsOn: 'Conectividade do conector e acesso à origem.', failure: 'Conector indisponível ou origem inacessível.', check: 'Verificar separadamente o túnel e o alcance da origem.' },
      { id: 'booking', ...external[3], purpose: 'Responder à solicitação.', explanation: 'O serviço de agendamento no HP ML30 processa o pedido e devolve a resposta.', dependsOn: 'Serviço de origem em execução e apto a responder.', failure: 'Aplicação parada ou com erro.', check: 'Confirmar a resposta da aplicação no ambiente de origem.' },
    ],
  },
  {
    id: 'internal', title: 'Internal Access — LAN',
    scope: 'Caminho documentado da aplicação de boletos pela rede local.',
    steps: [
      { id: 'visitor', ...internal[0], purpose: 'Iniciar o acesso interno.', explanation: 'O usuário acessa a aplicação a partir da LAN.', dependsOn: 'Dispositivo conectado à rede local.', failure: 'Perda de conectividade do cliente.', check: 'Confirmar a conectividade local do dispositivo.' },
      { id: 'lan', ...internal[1], purpose: 'Transportar a conexão dentro da LAN.', explanation: 'A rede local entrega o tráfego ao endereço privado do servidor.', dependsOn: 'Caminho local disponível entre cliente e servidor.', failure: 'Falha de enlace ou restrição local.', check: 'Verificar se o cliente consegue alcançar o host na LAN.' },
      { id: 'host', ...internal[2], purpose: 'Endereçar o servidor.', explanation: 'O endereço privado identifica o HP ML30 dentro do ambiente. O host acessível pode ter uma aplicação indisponível.', dependsOn: 'Endereço de destino correto e host alcançável.', failure: 'Destino incorreto ou servidor fora de alcance.', check: 'Validar primeiro o alcance do host e depois o serviço.' },
      { id: 'bills', ...internal[3], purpose: 'Atender a consulta de boletos.', explanation: 'O serviço interno recebe a conexão e fornece a interface da aplicação.', dependsOn: 'Aplicação disponível e comunicação permitida até o serviço.', failure: 'Serviço indisponível ou acesso local restrito.', check: 'Verificar a resposta da aplicação e, se necessário, a porta de serviço como conceito.' },
    ],
  },
  {
    id: 'remote', title: 'Remote Administration — Tailscale / SSH',
    scope: 'Fluxo conceitual de administração remota. A combinação instalada e sua configuração são informações distintas.',
    steps: [
      { id: 'device', label: 'Dispositivo administrativo', purpose: 'Iniciar uma sessão remota.', explanation: 'No exemplo, um dispositivo autorizado precisa de conectividade para iniciar o acesso.', dependsOn: 'Conectividade do dispositivo e destino correto.', failure: 'Dispositivo desconectado ou destino incorreto.', check: 'Confirmar a conectividade básica e revisar o destino informado.' },
      { id: 'tailscale', label: components.tailscale.name, component: 'tailscale', purpose: 'Oferecer conectividade privada.', explanation: 'Tailscale pode conectar dispositivos autorizados conforme a configuração do ambiente.', dependsOn: 'Conexão privada e autorização conforme configuração.', failure: 'Conexão privada indisponível.', check: 'Validar a conectividade privada quando ela fizer parte do caminho.' },
      { id: 'ssh', label: components.ssh.name, component: 'ssh', purpose: 'Fornecer administração por SSH.', explanation: 'SSH é uma tecnologia distinta da conectividade privada e pode ser usada sobre ela. A combinação exata não foi confirmada no laboratório.', dependsOn: 'Destino alcançável, serviço disponível e acesso autorizado.', failure: 'Serviço SSH indisponível ou sessão não autorizada.', check: 'Separar disponibilidade do serviço de autorização de acesso.' },
    ],
  },
];

interface Verification {
  id: string;
  label: string;
  observation: string;
  decisive?: true;
}

interface Scenario {
  id: string;
  title: string;
  symptom: string;
  context: string;
  checks: readonly Verification[];
  diagnosis: string;
  explanation: string;
}

export const scenarios: readonly Scenario[] = [
  {
    id: 'public', title: 'Domínio não acessa a aplicação', symptom: 'O domínio público não permite acessar o sistema de agendamento.',
    context: 'A investigação fictícia separa a publicação da disponibilidade da origem.',
    checks: [
      { id: 'dns', label: 'Resolução DNS', observation: 'O domínio resolve conforme esperado no cenário.' },
      { id: 'tunnel', label: 'Conectividade do túnel', observation: 'O túnel está conectado na simulação. Falta confirmar se o serviço responde.', decisive: true },
      { id: 'route', label: 'Rota publicada', observation: 'A rota aponta para o serviço de agendamento esperado.' },
      { id: 'origin', label: 'Disponibilidade do serviço de origem', observation: 'O serviço de agendamento não responde na origem.', decisive: true },
    ],
    diagnosis: 'Serviço de origem indisponível neste cenário.',
    explanation: 'O túnel está conectado, mas o serviço de origem não responde. A conectividade do túnel não comprova a disponibilidade da aplicação.',
  },
  {
    id: 'lan', title: 'Aplicação interna indisponível', symptom: 'Um usuário da LAN não consegue acessar a aplicação de boletos.',
    context: 'O exemplo separa alcance do host e resposta do serviço interno.',
    checks: [
      { id: 'client', label: 'Conectividade do cliente', observation: 'O cliente está conectado à rede local.' },
      { id: 'host', label: 'Acesso ao IP privado do servidor', observation: 'O host está alcançável pela LAN no cenário.', decisive: true },
      { id: 'service', label: 'Serviço da aplicação', observation: 'A aplicação de boletos não está ativa neste cenário.', decisive: true },
      { id: 'port', label: 'Porta de serviço (conceito)', observation: 'O ponto de entrada conceitual do serviço não responde. Isso, por si só, não distingue serviço parado de restrição.' },
      { id: 'local', label: 'Restrições locais de acesso', observation: 'As restrições consultadas neste exemplo não impedem o acesso pretendido.' },
    ],
    diagnosis: 'Aplicação interna inativa neste cenário.',
    explanation: 'O servidor está alcançável pela rede local. A verificação do serviço confirma que a aplicação não está ativa.',
  },
  {
    id: 'admin', title: 'Acesso administrativo remoto indisponível', symptom: 'Uma sessão administrativa remota não pode ser estabelecida.',
    context: 'Exemplo hipotético no qual a sessão depende de conectividade privada e do serviço SSH.',
    checks: [
      { id: 'device', label: 'Conectividade do dispositivo', observation: 'O dispositivo tem conectividade básica.' },
      { id: 'private', label: 'Estado da conexão privada', observation: 'O caminho privado até o destino está disponível no cenário.', decisive: true },
      { id: 'ssh', label: 'Disponibilidade do serviço SSH', observation: 'O serviço SSH está indisponível no destino fictício.', decisive: true },
      { id: 'auth', label: 'Autorização de acesso', observation: 'A autorização é esperada no cenário. A falha ocorre antes de uma sessão ser estabelecida.' },
      { id: 'target', label: 'Configuração de destino', observation: 'O destino corresponde ao host pretendido no exemplo.' },
    ],
    diagnosis: 'Serviço SSH indisponível neste cenário.',
    explanation: 'O caminho privado está disponível, mas o serviço SSH não aceita conexões. A conectividade privada e o serviço SSH são camadas independentes.',
  },
];

export type Simulation = { scenarioId: string; checked: readonly string[]; phase: 'exploring' | 'more-needed' | 'complete' };
export type SimulationAction = { type: 'select'; id: string } | { type: 'verify'; id: string } | { type: 'reset' } | { type: 'conclude' };

export function initialSimulation(scenarioId = scenarios[0].id): Simulation {
  return { scenarioId, checked: [], phase: 'exploring' };
}

export function simulate(state: Simulation, action: SimulationAction): Simulation {
  const scenario = scenarios.find(item => item.id === state.scenarioId);
  if (!scenario) return state;

  switch (action.type) {
    case 'select':
      return scenarios.some(item => item.id === action.id) ? initialSimulation(action.id) : state;
    case 'reset':
      return initialSimulation(state.scenarioId);
    case 'verify':
      if (state.checked.includes(action.id) || !scenario.checks.some(check => check.id === action.id)) return state;
      return { ...state, checked: [...state.checked, action.id], phase: state.phase === 'complete' ? 'complete' : 'exploring' };
    case 'conclude':
      return { ...state, phase: scenario.checks.filter(check => check.decisive).every(check => state.checked.includes(check.id)) ? 'complete' : 'more-needed' };
  }
}
