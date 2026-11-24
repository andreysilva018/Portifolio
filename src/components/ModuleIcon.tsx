import type { ModuleDefinition } from '../content/routes';

export function ModuleIcon({ kind }: { kind: ModuleDefinition['icon'] }) {
  return <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    {kind === 'incident' && <><path d="M8 7h24v26H8zM13 13h14M13 19h8M13 25h5" /><circle cx="27" cy="27" r="7" /><path d="m32 32 5 5" /></>}
    {kind === 'infrastructure' && <><rect x="13" y="4" width="14" height="9" rx="1" /><path d="M20 13v8M7 26v-5h26v5" /><rect x="2" y="27" width="10" height="9" rx="1" /><rect x="15" y="27" width="10" height="9" rx="1" /><rect x="28" y="27" width="10" height="9" rx="1" /></>}
    {kind === 'terminal' && <><rect x="3" y="6" width="34" height="28" rx="2" /><path d="M3 13h34M10 20l5 4-5 4M20 29h9" /><circle cx="8" cy="10" r=".5" /><circle cx="12" cy="10" r=".5" /></>}
  </svg>;
}
