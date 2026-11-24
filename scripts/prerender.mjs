import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { render, publicPaths, routeMetadata, siteUrl } from '../.prerender/entry-server.js';

const template = await readFile('dist/index.html', 'utf8');
if (!template.includes('<!--app-html-->')) throw new Error('Missing prerender template marker');
const escape = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const routes = [...publicPaths, '/404.html'];
for (const path of routes) {
  const meta = routeMetadata(path);
  const canonical = `${siteUrl}${meta.path}`;
  const head = `${path === '/404.html' ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${canonical}" />`}
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Andrey IT Operations" />
    <meta property="og:title" content="${escape(meta.title)}" />
    <meta property="og:description" content="${escape(meta.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${siteUrl}/social-preview.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Andrey IT Operations — Suporte de TI, sistemas e ERP" />
    <meta name="twitter:card" content="summary_large_image" />`;
  const html = template.replace(/<title>.*?<\/title>/, `<title>${escape(meta.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escape(meta.description)}" />`)
    .replace('<!--route-head-->', head)
    .replace('<!--app-html-->', render(path));
  const directory = path === '/404.html' ? 'dist' : join('dist', path.slice(1));
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, path === '/404.html' ? '404.html' : 'index.html'), html);
  console.log(`Pre-rendered ${path}`);
}
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.filter(path => path !== '/404.html').map(path => `<url><loc>${siteUrl}${path}</loc></url>`).join('')}</urlset>`);
