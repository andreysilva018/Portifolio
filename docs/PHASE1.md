# Fase 1 — Fundação Andrey IT Operations

## Escopo entregue

Migração da página estática para React, TypeScript, Vite e Tailwind CSS. Identidade grafite, azul petróleo e ciano; foto original reutilizada com tratamento somente por CSS. Conteúdo profissional voltado a suporte técnico N1/N2, sistemas/ERP e Service Desk. Desenvolvimento mantido como competência complementar.

A página inicial reúne apresentação, resumo, experiências, competências, prévias dos módulos, projetos selecionados, formação e contato. Souza: Assistente de TI, abril/2025 a novembro/2026; Doctus Tecnologia: estágio em suporte, agosto/2024 a fevereiro/2025. Não há vínculo apresentado como atual, métricas decorativas, certificados não comprovados ou afirmação de fluência.

## Decisões arquiteturais

- Componentes organizados por funcionalidade, controles compartilhados e dados tipados independentes da interface.
- HTML gerado durante o build com `renderToString`; hidratação com React no navegador. Não há servidor em produção.
- Navegação por links nativos entre quatro páginas físicas. Evita uma dependência de roteamento cliente nesta fase e mantém URLs diretas, histórico e conteúdo sem JavaScript.
- Manifesto único de rotas em `src/content/routes.ts`, usado pelo build para metadados e sitemap. Páginas futuras precisam ser acrescentadas ao manifesto, à composição e aos testes.
- Módulos futuros têm apenas páginas de escopo, sem incidentes, inventários ou comandos implementados.
- Estilos de composição e tokens em CSS, com Tailwind integrado ao Vite para utilitários. Não há CSS legado carregado em paralelo.
- Fontes e ícones locais. Links externos com proteção `noopener noreferrer`. Nenhum formulário, credencial, integração privada ou execução de comandos.
- Netlify recebe arquivos estáticos, página 404 e cabeçalhos declarados. Sem fallback genérico SPA nem redirecionamentos que alteram somente a barra final.

## Preservação Git

Repositório de origem: `https://github.com/andreysilva018/Portifolio.git`.

Base preservada: `backup/pre-it-operations`, commit `bbd5730cead4237143f97f2c69483498fd57968f`.

Branch de trabalho: `feat/it-operations-foundation`. A implementação permanece sem commit. Nenhum push ou deploy.

O clone por terminal foi impedido pela resolução de rede. Os seis arquivos originais foram recuperados pelo conector GitHub, conferidos pelos hashes e usados para reconstruir o commit exato em uma base rasa. A árvore original é `2511eb589208115bb19428925c28512e46897c88`. Não se trata de um novo commit simulando o original; o hash original foi verificado pelo próprio Git. Ancestrais podem ser recuperados com `git fetch --unshallow origin` quando houver rede.

## Inventário de alterações

Modificados:

- `index.html`
- `README.md`

Retirados do código ativo, preservados na branch de backup:

- `css/style.css`
- `js/main.js`

Criados:

- `.gitignore`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.ts`
- `playwright.config.ts`
- `netlify.toml`
- `src/main.tsx`
- `src/entry-server.tsx`
- `src/app/App.tsx`
- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/components/ExternalLink.tsx`
- `src/components/SectionHeading.tsx`
- `src/components/ModuleIcon.tsx`
- `src/content/profile.ts`
- `src/content/routes.ts`
- `src/features/profile/Hero.tsx`
- `src/features/profile/ProfileSections.tsx`
- `src/features/projects/ProjectsSection.tsx`
- `src/features/contact/ContactSection.tsx`
- `src/features/modules/ModulePreview.tsx`
- `src/features/modules/ModulePage.tsx`
- `src/styles/index.css`
- `scripts/prerender.mjs`
- `public/favicon.svg`
- `public/robots.txt`
- `public/social-preview.png`
- `tests/build.test.mjs`
- `tests/e2e/fixture.ts`
- `tests/e2e/portfolio.spec.ts`
- `docs/PHASE1.md`

As duas fotografias originais permanecem sem alterações nos arquivos. Apenas a foto efetivamente importada integra o build. Saídas geradas, dependências e capturas de testes são ignoradas pelo Git.

## Verificações

Resultado final: **TypeScript e build aprovados; 6/6 testes do HTML e 16/16 testes E2E aprovados; `git diff --check` sem apontamentos.**

- `npm run check`: TypeScript estrito, build cliente, build de pré-renderização e seis testes do HTML produzido.
- `npm run test:e2e`: dez larguras entre 320 e 1920 px; erros de hidratação; carregamento de imagem; menu por teclado, Escape e ciclo de foco; links diretos e reload; conteúdo e navegação mobile sem JavaScript; página 404; movimento reduzido; texto a 200%; contraste AA do texto visível.
- `git diff --check`: verificação de whitespace.
- Revisão visual de capturas desktop e mobile.

O ambiente bloqueia sockets locais e resolução de rede no terminal. Por isso, os testes de Chrome usam os arquivos reais de `dist` por interceptação de requisições para `portfolio.test`, com a CSP do `netlify.toml`. Essa técnica verifica a renderização e as interações sem publicar o site. O status 404 nos testes é servido pela fixture; o comportamento real de hospedagem, Pretty URLs e os cabeçalhos ainda precisam de homologação autorizada no Netlify. O teste de contraste é automatizado e não equivale a uma certificação completa de acessibilidade ou a testes manuais com leitores de tela.

## Pendências de conteúdo e publicação

1. Confirmar o nome oficial da instituição. O legado informa “UNIFAI — Centro Universitário Assunção”; a nova página apresenta ADS em andamento e previsão 2027, sem publicar a instituição não confirmada.
2. Confirmar acesso público e atualização do PDF do currículo. O link original foi mantido como visualização, sem promessa de download direto.
3. Validar manualmente LinkedIn, Instagram e WhatsApp. Os endereços foram preservados e normalizados; os serviços externos impediram confirmação automática de acesso. E-mail e WhatsApp não foram acionados para enviar mensagens.
4. Documentar e aprovar casos reais e inventário de laboratório antes das fases seguintes.
5. Confirmar o domínio canônico e as configurações existentes de Pretty URLs antes de uma publicação autorizada.

Instruções de instalação, execução, consulta do backup e comandos disponíveis estão no README.

## Revalidação em 24/11/2026

A implementação existente foi recuperada do trabalho anterior para `work/Portifolio` neste workspace, incluindo os objetos Git e a referência de backup. Nenhuma alteração foi enviada ao remoto. Nesta sessão, `npm run check` passou (TypeScript, builds e 6 testes), `npm run test:e2e` passou com 16 testes, e `git diff --check` terminou sem apontamentos. As capturas desktop e mobile foram revisadas visualmente. Os dois repositórios de projetos selecionados também foram consultados pelo conector GitHub e continuam acessíveis. As pendências de instituição, currículo, contatos externos e homologação no Netlify permanecem abertas.
