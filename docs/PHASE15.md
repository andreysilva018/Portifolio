# Fase 1.5 — IT Operations Workspace

## Resultado e localização

Implementação em `C:\Users\Admin\Documents\Codex\2026-11-24\new-chat\work\Portifolio`.
Este é o checkout recuperado do trabalho anterior; outras pastas chamadas Portifolio não foram alteradas.

A landing page foi substituída por um shell de aplicação: sidebar, breadcrumb, cabeçalho compacto, área de trabalho e painéis de contexto. O Overview apresenta identificação compacta, áreas de trabalho, projetos documentados e resumo profissional. Não há hero com foto, gráficos, SLAs, uptime ou indicadores operacionais inventados.

## Arquitetura

- `WorkspaceShell` é compartilhado pelas seis páginas e pelo estado 404. A sidebar mostra a rota ativa com `aria-current`.
- Navegação por links reais e documentos HTML completos, preservando refresh, histórico e navegação sem JavaScript. Não há backend nem roteador cliente adicional.
- `navigation` e `publicPaths` centralizam URLs, nomes e estrutura da sidebar; o build usa o mesmo manifesto para gerar as páginas e o sitemap.
- React hidrata os documentos estáticos. Apenas o menu mobile precisa de JavaScript; sem JavaScript, a navegação fica visível no fluxo.
- Projetos usam `details`/`summary`: lista e detalhe por mouse, toque ou teclado, inclusive sem JavaScript.
- Ícones SVG locais e tipografia Inter local, com monoespaçada do sistema para rótulos técnicos. Fontes em `rem` permitem ampliação pelo usuário.
- Menu mobile com Escape, retorno de foco, ciclo de foco, bloqueio de rolagem e conteúdo de fundo `inert`. Ao voltar ao desktop, o menu é fechado.
- Os três módulos têm superfícies próprias e painéis de escopo. Não há filtros, topologia interativa, parser, execução de comandos ou dados de infraestrutura privada.
- CSS responsivo, foco visível e redução de movimento; sem animações automáticas.
- Netlify mantém arquivos físicos por rota e `404.html`, sem fallback genérico SPA. Cabeçalhos de segurança preservados.

## Rotas

| URL                | Conteúdo                      |
| ------------------ | ----------------------------- |
| `/`                | Overview                      |
| `/incidents/`      | Incident Explorer — prévia    |
| `/infrastructure/` | Infrastructure Lab — prévia   |
| `/terminal/`       | Interactive Terminal — prévia |
| `/projects/`       | Engineering Projects          |
| `/profile/`        | Professional Profile          |

## Preservação Git

Fase 1 preservada antes das alterações no commit `50e41d2`, referência `backup/phase1-foundation`.
Branch da Fase 1.5: `feat/it-operations-workspace`. Nenhum push ou deploy.
O backup anterior ao React continua em `backup/pre-it-operations`.

Para consultar sem trocar o checkout:

```sh
git show backup/phase1-foundation:src/app/App.tsx
git archive backup/phase1-foundation -o ../portfolio-fase1.zip
```

## Arquivos

Criados:

- `src/components/WorkspaceShell.tsx`
- `src/components/WorkspaceIcon.tsx`
- `src/components/PageHeading.tsx`
- `src/features/overview/Overview.tsx`
- `src/features/profile/ProfilePage.tsx`
- `src/features/projects/ProjectsPage.tsx`
- `docs/PHASE15.md`
- `docs/screenshots/` — capturas das seis rotas em desktop e mobile e do menu mobile.

Modificados:

- `src/app/App.tsx`
- `src/content/routes.ts`
- `src/entry-server.tsx`
- `src/features/modules/ModulePage.tsx`
- `src/styles/index.css`
- `scripts/prerender.mjs`
- `tests/build.test.mjs`
- `tests/e2e/portfolio.spec.ts`
- `README.md`

Removidos os componentes antigos de landing page: `Header`, `Footer`, `Hero`, `SectionHeading`, `ModuleIcon`, `ModulePreview`, `ProfileSections`, `ProjectsSection` e `ContactSection`. Permanecem recuperáveis na referência da Fase 1. Os dados de `src/content/profile.ts` e o componente `ExternalLink` foram preservados.

## Validação e limites

Resultado: TypeScript e build de produção aprovados, seis testes de HTML aprovados e vinte testes E2E aprovados. As seis rotas e a página 404 foram pré-renderizadas. `git diff --check` não apontou problemas. Foram geradas treze capturas (seis páginas em desktop/mobile e o menu mobile), com revisão visual do Overview, navegação, projetos e infraestrutura.

Os testes de navegador usam Google Chrome instalado e os arquivos reais de `dist` por interceptação de requisições de `portfolio.test`, com a CSP de produção. Não exigem publicar o site. A fixture reproduz respostas estáticas; não é homologação do Netlify.

Verificações: TypeScript estrito, build cliente/servidor, HTML pré-renderizado, metadados únicos, sitemap, links internos, conteúdo sem JavaScript, previews honestas, seis rotas em larguras de 320 a 1920px, hidratação, acesso direto e refresh, menu por teclado, lista/detalhe nativa, movimento reduzido, texto ampliado e contraste de texto.

O contraste automatizado não substitui uma auditoria completa de acessibilidade nem testes com leitor de tela. O comportamento real de Pretty URLs, cabeçalhos e 404 no Netlify depende de homologação autorizada.

## Pendências

- Confirmar nome oficial da instituição de ensino. ADS em andamento, previsão 2027, permanece sem instituição não confirmada.
- Confirmar se o PDF do currículo está atualizado e publicamente acessível. O link existente foi preservado.
- Validar acesso aos serviços de contato. Nenhuma mensagem foi enviada.
- Preparar casos reais de suporte e inventário de laboratório para as próximas fases. Só os dois projetos existentes aparecem como atividade documentada.
- Acrescentar projetos de automação e SQL após revisão de documentação e evidências.
- A imagem de compartilhamento social da Fase 1 foi preservada; não é uma captura da nova interface.

Instruções de execução no README. Capturas em `docs/screenshots/`.

## Capturas

| Página               | Desktop                                           | Mobile                                          |
| -------------------- | ------------------------------------------------- | ----------------------------------------------- |
| Overview             | [Desktop](screenshots/overview-desktop.png)       | [Mobile](screenshots/overview-mobile.png)       |
| Incident Explorer    | [Desktop](screenshots/incidents-desktop.png)      | [Mobile](screenshots/incidents-mobile.png)      |
| Infrastructure Lab   | [Desktop](screenshots/infrastructure-desktop.png) | [Mobile](screenshots/infrastructure-mobile.png) |
| Interactive Terminal | [Desktop](screenshots/terminal-desktop.png)       | [Mobile](screenshots/terminal-mobile.png)       |
| Engineering Projects | [Desktop](screenshots/projects-desktop.png)       | [Mobile](screenshots/projects-mobile.png)       |
| Professional Profile | [Desktop](screenshots/profile-desktop.png)        | [Mobile](screenshots/profile-mobile.png)        |

[Navegação lateral mobile](screenshots/navigation-mobile.png).
