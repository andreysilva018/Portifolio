export const commands = [
  { name: 'help', category: 'Portfólio', description: 'Lista comandos e exemplos.' },
  { name: 'about', category: 'Portfólio', description: 'Apresentação profissional.' },
  { name: 'skills', category: 'Portfólio', description: 'Competências documentadas.' },
  { name: 'experience', category: 'Portfólio', description: 'Trajetória profissional.' },
  { name: 'projects', category: 'Portfólio', description: 'Projetos de engenharia.' },
  { name: 'lab', category: 'Portfólio', description: 'Arquitetura do laboratório.' },
  { name: 'cases', category: 'Portfólio', description: 'Estudos de caso de suporte e automação.' },
  { name: 'uname -a', category: 'Linux', description: 'Informações de um sistema fictício.' },
  { name: 'pwd', category: 'Linux', description: 'Diretório demonstrativo atual.' },
  { name: 'ls', category: 'Linux', description: 'Lista arquivos fictícios.' },
  { name: 'whoami', category: 'Linux', description: 'Identidade fictícia da sessão.' },
  { name: 'df -h', category: 'Linux', description: 'Exemplo de uso de armazenamento.' },
  { name: 'systemctl status', category: 'Linux', description: 'Exemplo de estado de um serviço.' },
  { name: 'docker ps', category: 'Linux', description: 'Exemplo de lista de containers.' },
  { name: 'ping', category: 'Redes', description: 'Alcance ilustrativo. Exemplo: ping 192.0.2.10.' },
  { name: 'nslookup', category: 'Redes', description: 'Resolução ilustrativa. Exemplo: nslookup example.com.' },
  { name: 'ip addr', category: 'Redes', description: 'Interface e endereço de documentação.' },
  { name: 'traceroute', category: 'Redes', description: 'Saltos ilustrativos. Exemplo: traceroute 192.0.2.10.' },
  { name: 'clear', category: 'Sessão', description: 'Limpa as respostas e mantém a navegação no histórico.' },
  { name: 'reset', category: 'Sessão', description: 'Apaga as respostas e o histórico de comandos.' },
] as const;

export type Command = typeof commands[number]['name'];
export type Destination = '192.0.2.10' | 'example.com';
export const maxInputLength = 160;

export const linuxExamples = {
  'uname -a': 'Linux host-demo 6.x-demo x86_64 GNU/Linux',
  pwd: '/home/visitante/workspace-demo',
  ls: 'README-demo.txt  perfil-demo.txt  inventario-demo.txt',
  whoami: 'visitante-demo',
  'df -h': 'Sistema     Tam.  Usado  Disp.  Montagem\ndemo-fs      20G     8G    12G  /demo',
  'systemctl status': 'servico-demo.service\nEstado fictício: ativo\nExemplo de leitura de estado. Nenhum serviço foi consultado.',
  'docker ps': 'NOME             IMAGEM         ESTADO FICTÍCIO\ncontainer-demo   imagem-demo    em execução',
  'ip addr': 'interface-demo\n  inet 192.0.2.10/24 (endereço reservado para documentação)',
} as const;
