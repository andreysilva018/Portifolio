import { archivedIncidentPaths, incidentBasePath, incidentForPath, incidentPath, incidents } from './incidents';
import type { IconName } from '../components/WorkspaceIcon';

export const siteUrl = 'https://andreyportifolio.netlify.app';

interface NavigationItem { path: string; name: string; icon: IconName; group: 'Workspace' | 'Biblioteca'; future?: boolean }
export const navigation: NavigationItem[] = [
  { path: '/', name: 'Overview', icon: 'overview', group: 'Workspace' },
  { path: incidentBasePath, name: 'Incident Explorer', icon: 'incident', group: 'Workspace' },
  { path: '/infrastructure/', name: 'Infrastructure Lab', icon: 'infrastructure', group: 'Workspace' },
  { path: '/terminal/', name: 'Interactive Terminal', icon: 'terminal', group: 'Workspace' },
  { path: '/projects/', name: 'Engineering Projects', icon: 'projects', group: 'Biblioteca' },
  { path: '/profile/', name: 'Professional Profile', icon: 'profile', group: 'Biblioteca' },
];
export const publicPaths = [...navigation.map(item => item.path), ...incidents.map(incidentPath)];

export const renderedPaths = [...publicPaths, ...archivedIncidentPaths];

export interface ModuleDefinition {
  path: string;
  name: string;
  label: string;
  description: string;
  planned: string[];
  icon: 'incident' | 'infrastructure' | 'terminal';
}

export const modules: ModuleDefinition[] = [
  { path: '/incidents/', name: 'Incident Explorer', label: 'Casos técnicos', description: 'O caminho entre o sintoma, a investigação e a solução. Casos documentados de suporte e sistemas.', planned: ['Contexto e sintoma', 'Investigação documentada', 'Solução e validação'], icon: 'incident' },
  { path: '/infrastructure/', name: 'Infrastructure Lab', label: 'Ambientes e conexões', description: 'Um espaço para explorar a infraestrutura e entender suas conexões, com documentação de laboratório.', planned: ['Inventário validado', 'Topologia documentada', 'Contexto dos componentes'], icon: 'infrastructure' },
  { path: '/terminal/', name: 'Interactive Terminal', label: 'Exploração guiada', description: 'Uma futura interface simulada para navegar pelo portfólio usando comandos predefinidos.', planned: ['Comandos predefinidos', 'Navegação pelo portfólio', 'Simulação local'], icon: 'terminal' },
];

export function normalizePath(path: string): string {
  return path === '/' ? '/' : `${path.replace(/\/+$/, '')}/`;
}

export function routeMetadata(path: string) {
  if (normalizePath(path) === '/terminal/') return {
    title: 'Interactive Terminal | Andrey IT Operations',
    description: 'Explore o perfil profissional e pratique comandos simulados de Linux e redes em um terminal educativo no navegador.',
    path: '/terminal/',
  };
  if (normalizePath(path) === '/infrastructure/') return {
    title: 'Infrastructure Lab | Andrey IT Operations',
    description: 'Topologia e inventário do laboratório Linux: HP ProLiant ML30 Gen, Docker, acesso interno pela LAN e publicação de agendamento via Cloudflare Tunnel.',
    path: '/infrastructure/',
  };
  const incident = incidentForPath(normalizePath(path));
  if (incident) return { title: incident.id + ' — ' + incident.title + ' | Incident Explorer', description: incident.description + (incident.origin === 'Experiência profissional' ? ' Relato profissional anonimizado.' : ' Roteiro demonstrativo não executado.'), path: incidentPath(incident) };
  if (normalizePath(path) === incidentBasePath) return { title: 'Incident Explorer | Andrey IT Operations', description: 'Casos profissionais anonimizados de ERP, redes corporativas e automação com Python e OCR.', path: incidentBasePath };
  if (normalizePath(path) === '/projects/') return { title: 'Engineering Projects | Andrey IT Operations', description: 'Projetos documentados de software, Java e persistência relacional. Conhecimentos complementares ao suporte de sistemas.', path: '/projects/' };
  if (normalizePath(path) === '/profile/') return { title: 'Professional Profile | Andrey Vinícius', description: 'Experiência profissional, competências, formação e contato de Andrey Vinícius de Souza Silva. Suporte N1/N2, ERP e Service Desk.', path: '/profile/' };
  const module = modules.find(item => item.path === normalizePath(path));
  if (module) return { title: `${module.name} | Andrey IT Operations`, description: `${module.description} Módulo em desenvolvimento.`, path: module.path };
  if (normalizePath(path) === '/') return { title: 'Andrey Vinícius | Suporte de TI, Sistemas e ERP', description: 'Portfólio de Andrey Vinícius de Souza Silva. Suporte técnico N1/N2, sistemas ERP, Service Desk, SQL e infraestrutura. Desenvolvimento como competência complementar.', path: '/' };
  return { title: 'Página não encontrada | Andrey IT Operations', description: 'A página solicitada não foi encontrada. Acesse o portfólio profissional de Andrey Vinícius.', path: '/404.html' };
}
