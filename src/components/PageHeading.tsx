import type { ReactNode } from 'react';

export function PageHeading({ label, title, description, children }: { label: string; title: string; description: string; children?: ReactNode }) {
  return <div className="page-heading"><div><p className="kicker">{label}</p><h1>{title}</h1><p className="page-description">{description}</p></div>{children}</div>;
}
