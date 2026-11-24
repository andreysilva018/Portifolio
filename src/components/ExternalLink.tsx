import type { AnchorHTMLAttributes } from 'react';

export function ExternalLink({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isWeb = href?.startsWith('https://');
  return <a href={href} {...props} {...(isWeb ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{children}{isWeb && <span className="sr-only"> (abre em nova aba)</span>}</a>;
}
