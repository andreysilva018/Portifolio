import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { join } from 'node:path';

const paths = ['/', '/incidents/', '/infrastructure/', '/terminal/', '/projects/', '/profile/', '/incidents/falha-conectividade-rede-corporativa/', '/incidents/catalogos-tecnicos/', '/incidents/automacao-boletos/', '/incidents/inconsistencia-erp/'];
const pageFile = path => join('dist', path.slice(1), 'index.html');

test('all public routes contain rendered headings and unique canonical metadata', async () => {
  const titles = new Set();
  for (const path of paths) {
    const html = await readFile(pageFile(path), 'utf8');
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, path);
    assert.match(html, new RegExp(`rel="canonical" href="https://andreyportifolio.netlify.app${path}"`));
    assert.ok(!html.includes('<!--app-html-->'));
    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    assert.ok(title);
    titles.add(title);
  }
  assert.equal(titles.size, paths.length);
});

test('professional content is present without executing JavaScript', async () => {
  const html = await readFile('dist/profile/index.html', 'utf8');
  for (const text of ['Suporte N1/N2', 'Souza Indústria', 'Doctus Tecnologia', '2026-11', 'Análise e Desenvolvimento de Sistemas', '2027']) assert.ok(html.includes(text), text);
  assert.ok(!/Desenvolvedor Java Júnior|primeira vaga como desenvolvedor|Abril\/2025 – atual|Centro Universitário Assunção/.test(html));
});

test('internal links, section anchors and assets resolve to generated files', async () => {
  for (const path of paths) {
    const html = await readFile(pageFile(path), 'utf8');
    const urls = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(match => match[1]);
    for (const url of urls) {
      assert.ok(url.length > 0, 'Empty URL');
      if (/^(https:|mailto:|data:)/.test(url)) continue;
      const [target, anchor] = url.split('#');
      const destination = decodeURIComponent(target || path);
      const file = destination.endsWith('/') ? pageFile(destination) : join('dist', destination.replace(/^\//, ''));
      await access(file);
      if (anchor) {
        const content = await readFile(file, 'utf8');
        assert.ok(content.includes(`id="${anchor}"`), `${url} on ${path}`);
      }
    }
  }
});

test('terminal introduction and command reference are pre-rendered', async () => {
  const html = await readFile(pageFile('/terminal/'), 'utf8');
  assert.match(html, /Interactive Terminal/);
  assert.match(html, /Ambiente demonstrativo/);
  assert.match(html, /Referência de comandos/);
  assert.match(html, /traceroute/);
});

test('404 is not indexed and sitemap only includes implemented public routes', async () => {
  const html = await readFile('dist/404.html', 'utf8');
  assert.match(html, /name="robots" content="noindex"/);
  const sitemap = await readFile('dist/sitemap.xml', 'utf8');
  assert.equal((sitemap.match(/<loc>/g) ?? []).length, paths.length);
  assert.ok(!sitemap.includes('404'));
});

test('social preview is a real PNG with matching dimensions', async () => {
  const png = await readFile('dist/social-preview.png');
  assert.equal(png.subarray(1, 4).toString(), 'PNG');
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
});

test('legacy DNS URL redirects to the canonical professional case', async () => {
  const config = await readFile('netlify.toml', 'utf8');
  assert.match(config, /from = "\/incidents\/diagnostico-dns\/"\s+to = "\/incidents\/falha-conectividade-rede-corporativa\/"\s+status = 301/);
  const html = await readFile(pageFile('/incidents/falha-conectividade-rede-corporativa/'), 'utf8');
  assert.match(html, /CASE-002/);
  assert.match(html, /Antes da reorganização/);
  assert.match(html, /Depois da reorganização/);
  assert.doesNotMatch(await readFile('dist/sitemap.xml', 'utf8'), /diagnostico-dns/);
});

test('the archived lab stays reachable but is absent from the catalogue and sitemap', async () => {
  const archived = await readFile(pageFile('/incidents/conectividade-de-rede/'), 'utf8');
  assert.match(archived, /name="robots" content="noindex"/);
  assert.match(archived, /LAB-002/);
  assert.doesNotMatch(await readFile(pageFile('/incidents/'), 'utf8'), /LAB-002/);
  assert.doesNotMatch(await readFile('dist/sitemap.xml', 'utf8'), /conectividade-de-rede/);
});

test('infrastructure HTML includes the documented host, inventory and distinct access paths', async () => {
  const html = await readFile(pageFile('/infrastructure/'), 'utf8');
  for (const text of ['HP ProLiant ML30 Gen', 'Ubuntu Server 26.04.1 LTS', 'Cloudflare Tunnel', 'IP privado do HP ML30', 'Hosted Applications', 'CASE-004']) {
    assert.ok(html.includes(text), text);
  }
  assert.match(html, /<title>Infrastructure Lab/);
  assert.doesNotMatch(html, /Em desenvolvimento<\/span>/);
});

test('connectivity references and simulation notice are pre-rendered', async () => {
  const html = await readFile(pageFile('/infrastructure/'), 'utf8');
  for (const text of ['Connectivity Explorer', 'Rede Cloudflare', 'Fluxo conceitual de administração remota', 'Troubleshooting Simulator', 'Cenários fictícios', 'Aplicação interna inativa neste cenário.']) {
    assert.ok(html.includes(text), text);
  }
});

test('terminal lab introduces all three scenarios in the initial HTML', async () => {
  const html = await readFile(pageFile('/terminal/'), 'utf8');
  for (const text of ['Troubleshooting Lab', 'Acesso externo por domínio', 'Aplicação interna pela LAN', 'Administração remota conceitual']) {
    assert.ok(html.includes(text), text);
  }
});
