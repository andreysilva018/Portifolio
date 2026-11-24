type Category = 'Hardware' | 'Sistema operacional' | 'Containerização' | 'Conectividade e acesso' | 'Aplicações';

interface Component {
  name: string;
  category: Category;
  description: string;
  use: string;
  relations: string;
  note: string;
  publicUrl?: `https://${string}`;
}

export const components = {
  host: { name: 'HP ProLiant ML30 Gen', category: 'Hardware', description: 'Servidor físico do laboratório.', use: 'Hospeda o sistema operacional, as ferramentas do ambiente e as duas aplicações.', relations: 'Ubuntu Server, Sistema de Agendamento e Automação de Boletos.', note: 'O inventário documenta um único servidor físico.' },
  ubuntu: { name: 'Ubuntu Server 26.04.1 LTS', category: 'Sistema operacional', description: 'Sistema operacional Linux do servidor.', use: 'Base de administração e hospedagem do laboratório.', relations: 'Instalado no HP ProLiant ML30 Gen.', note: 'A versão corresponde ao inventário informado.' },
  docker: { name: 'Docker', category: 'Containerização', description: 'Ferramenta para executar aplicações em containers.', use: 'Instalada no ambiente Linux.', relations: 'Ubuntu Server e Docker Compose.', note: 'A topologia não atribui containers às aplicações hospedadas.' },
  compose: { name: 'Docker Compose', category: 'Containerização', description: 'Ferramenta para definir e gerenciar aplicações com Docker.', use: 'Instalada no ambiente Linux.', relations: 'Docker e Ubuntu Server.', note: 'A configuração das aplicações não está representada.' },
  tunnel: { name: 'Cloudflare Tunnel', category: 'Conectividade e acesso', description: 'Publicação do sistema de agendamento por domínio configurado.', use: 'cloudflared integra o ambiente do HP ML30.', relations: 'Domínio configurado e Sistema de Agendamento.', note: 'O acesso à Automação de Boletos é pela LAN.' },
  tailscale: { name: 'Tailscale', category: 'Conectividade e acesso', description: 'Recurso de conectividade remota.', use: 'Instalado no servidor como recurso do ambiente.', relations: 'Ambiente administrativo do HP ML30.', note: 'Políticas e topologia de acesso não estão documentadas.' },
  ssh: { name: 'OpenSSH', category: 'Conectividade e acesso', description: 'Recurso de administração remota por SSH.', use: 'Instalado no servidor.', relations: 'Ambiente administrativo do Ubuntu Server.', note: 'Parâmetros de configuração e autenticação não estão documentados.' },
  booking: { name: 'Sistema de Agendamento', category: 'Aplicações', description: 'Agendamento e gestão operacional para a barbearia Studio L.', use: 'Hospedado no HP ML30 e em desenvolvimento e testes.', relations: 'Acesso externo por domínio configurado via Cloudflare Tunnel.', note: 'Studio L é a barbearia cliente.', publicUrl: 'https://studiol.andreylab.site/' },
  bills: { name: 'Automação de Boletos', category: 'Aplicações', description: 'Processamento, organização, consulta e exportação de boletos.', use: 'Aplicação interna em Python com Tesseract OCR, hospedada no HP ML30.', relations: 'Acesso pela rede local via IP privado do servidor.', note: 'Importação automatizada e controle de permissões por perfil.' },
  lan: { name: 'Rede local (LAN)', category: 'Conectividade e acesso', description: 'Rede de acesso dos usuários internos.', use: 'Permite chegar ao endereço privado do servidor para acessar boletos.', relations: 'Usuário interno, IP privado do HP ML30 e Automação de Boletos.', note: 'O endereço privado é representado de forma conceitual.' },
  domain: { name: 'Acesso externo via domínio', category: 'Conectividade e acesso', description: 'Entrada externa para o sistema de agendamento.', use: 'Usuários externos usam um domínio configurado.', relations: 'Cloudflare Tunnel e Sistema de Agendamento.', note: 'O endereço do domínio não é exibido no diagrama.' },
} satisfies Record<string, Component>;

export type ComponentId = keyof typeof components;

export const inventoryGroups: readonly { category: Category; items: readonly ComponentId[] }[] = [
  { category: 'Hardware', items: ['host'] },
  { category: 'Sistema operacional', items: ['ubuntu'] },
  { category: 'Containerização', items: ['docker', 'compose'] },
  { category: 'Conectividade e acesso', items: ['tunnel', 'tailscale', 'ssh'] },
  { category: 'Aplicações', items: ['booking', 'bills'] },
];

export const accessPaths = {
  external: {
    title: 'Acesso externo',
    steps: [
      { label: 'Usuário externo' },
      { label: 'Domínio configurado', component: 'domain' },
      { label: 'Cloudflare Tunnel', component: 'tunnel' },
      { label: 'Sistema de Agendamento no HP ML30', component: 'booking' },
    ],
  },
  internal: {
    title: 'Acesso interno',
    steps: [
      { label: 'Usuário interno' },
      { label: 'Rede local (LAN)', component: 'lan' },
      { label: 'IP privado do HP ML30', component: 'host' },
      { label: 'Automação de Boletos', component: 'bills' },
    ],
  },
} satisfies Record<string, { title: string; steps: readonly AccessStep[] }>;

interface AccessStep {
  label: string;
  component?: ComponentId;
}
