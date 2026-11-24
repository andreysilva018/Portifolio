import { respond, type Response } from './engine';

type Entry = { id: number; input: string; response: Extract<Response, { text: string }> };
export type Session = { entries: readonly Entry[]; history: readonly string[]; nextId: number; notice: string };
const sessionLimit = 100;

export function newSession(): Session {
  return { entries: [], history: [], nextId: 0, notice: 'Sessão demonstrativa pronta. Digite help para começar.' };
}

export function submitCommand(state: Session, input: string): Session {
  const response = respond(input);
  if (response.kind === 'blank') return state;
  if (response.kind === 'reset') return { ...newSession(), notice: 'Sessão reiniciada. Digite help para começar.' };

  const history = [...state.history, input].slice(-sessionLimit);
  if (response.kind === 'clear') return { ...state, history, entries: [], notice: 'Histórico visual limpo.' };
  if (!('text' in response)) return state;

  const entry = { id: state.nextId, input, response };
  return {
    entries: [...state.entries, entry].slice(-sessionLimit),
    history,
    nextId: state.nextId + 1,
    notice: '',
  };
}
