# Andrey IT Operations — Workspace

Portfólio de Andrey Vinícius de Souza Silva, organizado como um workspace profissional de operações de TI. Foco em Suporte N1/N2, Sistemas/ERP, Service Desk, Windows, redes e SQL. Linux, Docker e desenvolvimento aparecem como conhecimentos complementares.

## Executar localmente

Node.js 22.12+; recomendado Node 24 e npm.

```sh
npm ci
npm run dev
```

Abra o endereço informado pelo Vite. Para conferir a versão pré-renderizada:

```sh
npm run check
npm run preview
```

| Comando | Função |
| --- | --- |
| `npm run dev` | Desenvolvimento local |
| `npm run typecheck` | TypeScript estrito |
| `npm run build` | Build cliente/servidor e pré-renderização |
| `npm test` | Testes do HTML produzido; requer build |
| `npm run check` | Build e testes do HTML |
| `npm run test:e2e` | Suíte de testes de navegador; requer build e Chrome instalado |
| `npm run preview` | Preview local de `dist/` |

Os testes E2E usam Google Chrome por interceptação de requisições para `portfolio.test`, servindo o build real e a CSP sem precisar de sockets locais ou publicação. Eles também geram as capturas em `docs/screenshots/`. Para outro navegador instalado, ajuste o `channel` em `playwright.config.ts`. Não há instalação automática de navegador.

## Arquitetura e rotas

React + TypeScript + Vite + Tailwind. Componentes por funcionalidade; perfil, experiências e projetos em dados tipados. `WorkspaceShell` reúne sidebar, menu mobile, breadcrumb, cabeçalho e área principal. Fontes locais e ícones SVG próprios, sem CDNs ou backend.

| Rota | Conteúdo |
| --- | --- |
| `/` | Overview com perfil compacto, áreas de trabalho e atividade documentada |
| `/incidents/` | Incident Explorer com catálogo, filtros e páginas individuais |
| `/infrastructure/` | Infrastructure Lab com topologia interativa e inventário |
| `/terminal/` | Interactive Terminal — prévia de escopo |
| `/projects/` | Engineering Projects com lista/detalhe nativa |
| `/profile/` | Professional Profile com trajetória, competências, formação e contato |

`src/content/routes.ts` centraliza navegação e rotas públicas. O build usa `renderToString` para gerar um HTML próprio para cada rota; React hidrata o menu no navegador. Links nativos preservam navegação direta, refresh e conteúdo sem JavaScript, sem roteador cliente nesta fase. `<details>` mantém os registros de projetos utilizáveis sem JavaScript.

`netlify.toml` publica `dist`, configura Node e cabeçalhos de segurança. Diretórios com `index.html` preservam URLs diretas; desconhecidas usam `404.html`, sem fallback genérico SPA. Pretty URLs e cabeçalhos reais exigem homologação no Netlify. O domínio canônico preservado é `https://andreyportifolio.netlify.app`; alterações futuras devem atualizar o manifesto e `public/robots.txt`.

## Organização

- `src/app/`: seleção de página e composição.
- `src/components/`: shell, ícones, títulos e links externos.
- `src/content/`: dados profissionais e manifesto de rotas.
- `src/features/`: Overview, perfil, projetos e módulos futuros.
- `src/styles/index.css`: tokens, layouts e responsividade.
- `scripts/prerender.mjs`: HTML, metadados e sitemap.
- `tests/`: verificações estáticas e E2E.
- `docs/PHASE15.md`: decisões, inventário, limites e pendências.
- `docs/screenshots/`: capturas desktop/mobile das seis rotas e navegação mobile.

## Acessibilidade e escopo

Validação da Fase 1.5: TypeScript e build aprovados, **6/6 testes de HTML e 20/20 testes E2E aprovados**. As seis páginas foram verificadas em doze larguras entre 320 e 1920px, com acesso direto, refresh, teclado, JavaScript desativado, movimento reduzido, texto a 200% e contraste de texto.

Link para pular conteúdo, landmarks, foco visível, navegação ativa com `aria-current`, menu mobile com Escape e retorno/ciclo de foco, conteúdo de fundo `inert`, fontes escaláveis e movimento reduzido. Sem JavaScript, a navegação permanece disponível. Contraste automatizado não equivale a uma auditoria completa de acessibilidade ou validação com leitor de tela.

Não há métricas fictícias, incidentes inventados, monitoramento, comandos executáveis ou acesso à infraestrutura privada. O Incident Explorer oferece quatro casos profissionais anonimizados, com duas simulações de processos. Infrastructure Lab documenta o servidor, os caminhos de acesso e as aplicações hospedadas. Interactive Terminal continua como prévia. A atividade técnica lista apenas os dois projetos já existentes; novos estudos de caso, automação e SQL dependem de documentação e evidências revisadas.

## Backup e estado Git

Fase 1 preservada no commit `50e41d2`, referência `backup/phase1-foundation`, antes do redesign.

```sh
git show backup/phase1-foundation:src/app/App.tsx
git archive backup/phase1-foundation -o ../portfolio-fase1.zip
```

A versão anterior ao React está no commit `bbd5730cead4237143f97f2c69483498fd57968f`. O checkout de trabalho também preserva a referência local `backup/pre-it-operations`.

## Pendências

- Confirmar instituição de ensino: o nome do legado não foi confirmado; a página mantém ADS em andamento, previsão 2027.
- Confirmar acesso público e atualização do currículo no Google Drive.
- Validar os serviços externos de contato; URLs existentes foram preservadas, sem envio de mensagens.
- Documentar casos de suporte e inventário de laboratório para as próximas fases.
- Homologar Pretty URLs, cabeçalhos e status HTTP no Netlify quando houver autorização.
- A imagem de compartilhamento social da Fase 1 foi preservada.

A branch `main` é a origem dos deploys de produção no Netlify.

Veja os roteiros, contratos e detalhes em [Fase 2](docs/PHASE2.md).

Veja também a [Fase 3.1](docs/PHASE31.md).
