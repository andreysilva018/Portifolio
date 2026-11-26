import { scenarioSyntax } from './scenarios';
import { commands, maxInputLength, type Command, type Destination } from './commands';

export type ParsedCommand =
  | { kind: 'allowed'; name: Command; destination?: Destination }
  | { kind: 'scenario'; command: string }
  | { kind: 'blank' }
  | { kind: 'error'; message: string };

const normalized = (line: string) => line.trim().toLowerCase().replace(/\s+/g, ' ');

export function parseCommand(line: string): ParsedCommand {
  if (line.length > maxInputLength) return { kind: 'error', message: 'Digite um comando de até 160 caracteres.' };
  const input = normalized(line);
  if (!input) return { kind: 'blank' };
  if (scenarioSyntax.includes(input)) return { kind: 'scenario', command: input };
  if (input === 'scenario' || input.startsWith('scenario ')) {
    return { kind: 'error', message: 'Comando de investigação não disponível. Digite scenario help.' };
  }
  const exact = commands.find(item => item.name === input);
  if (exact) return { kind: 'allowed', name: exact.name };

  const [name, ...args] = input.split(' ');
  if (name === 'ping' || name === 'nslookup' || name === 'traceroute') {
    const [destination] = args;
    if (args.length === 1 && (destination === 'example.com' || (name !== 'nslookup' && destination === '192.0.2.10'))) {
      return { kind: 'allowed', name, destination };
    }
    const allowed = name === 'nslookup' ? 'example.com' : '192.0.2.10 ou example.com';
    return { kind: 'error', message: 'Destino ou argumento fora da demonstração. Use ' + name + ' com ' + allowed + '.' };
  }
  if (commands.some(item => item.name.split(' ')[0] === name)) {
    return { kind: 'error', message: 'Argumentos não suportados. Digite help para consultar a sintaxe e os exemplos.' };
  }
  return { kind: 'error', message: 'Comando desconhecido. Digite help para ver as opções disponíveis.' };
}

export function completions(line: string): string[] {
  const prefix = normalized(line);
  return prefix ? [...commands.map(item => item.name), ...scenarioSyntax].filter(name => name.startsWith(prefix)) : [];
}
