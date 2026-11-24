# Andrey IT Operations

Portfólio profissional de **Andrey Vinícius de Souza Silva**. Foco em Analista de Suporte Técnico, Suporte N1/N2, Sistemas/ERP e Service Desk. SQL e infraestrutura integram o repertório; Java, Spring Boot e APIs REST são conhecimentos complementares.

## Executar localmente

Requer Node.js 22.12+ (recomendado: Node 24) e npm.

```sh
npm ci
npm run dev
```

Abra o endereço local informado pelo Vite. Para conferir o HTML pré-renderizado:

```sh
npm run check
npm run preview
```

O desenvolvimento usa React no cliente; a pré-renderização ocorre no build. `dist/` é o resultado estático e não deve ser editado manualmente.

## Comandos

| Comando | Função |
| --- | --- |
| `npm run dev` | Servidor local de desenvolvimento |
| `npm run typecheck` | TypeScript estrito, sem emissão |
| `npm run build` | Tipagem, build cliente/servidor e pré-renderização |
| `npm test` | Verifica HTML, links internos, assets, metadados e sitemap após o build |
| `npm run check` | Build e testes do resultado estático |
| `npm run test:e2e` | Testes de navegador sobre o build, usando Google Chrome instalado |
| `npm run preview` | Preview local do build |

Os testes E2E abrem o build real no Google Chrome usando interceptação de requisições para um domínio reservado (`portfolio.test`), sem servidor HTTP ou acesso à internet. A fixture reproduz a política CSP de produção, mas não substitui homologação dos redirecionamentos e cabeçalhos no Netlify. Para outro navegador instalado, ajuste `channel` em `playwright.config.ts`. Não há instalação automática de navegador.

## Arquitetura

React + TypeScript + Vite + Tailwind CSS, com versões registradas em `package-lock.json`. Fontes Inter hospedadas localmente e ícones SVG próprios, sem dependências de CDN.

- `src/app/`: composição da aplicação e seleção de página.
- `src/components/`: navegação, links externos, títulos e rodapé.
- `src/content/`: perfil tipado, experiências, competências, projetos, contatos e manifesto de rotas.
- `src/features/`: perfil, projetos, contato e prévias dos módulos.
- `src/styles/`: Tailwind, tokens e composição editorial responsiva.
- `src/entry-server.tsx`: renderização React utilizada durante o build.
- `scripts/prerender.mjs`: gera HTML e metadados por rota e sitemap.
- `public/`: favicon, compartilhamento social e robots.txt.
- `tests/`: validação do HTML produzido e fluxos E2E.

## Rotas e SEO

| URL | Conteúdo |
| --- | --- |
| `/` | Portfólio completo |
| `/incidents/` | Prévia do Incident Explorer |
| `/infrastructure/` | Prévia do Infrastructure Lab |
| `/terminal/` | Prévia do Interactive Terminal |
| `/404.html` | Página de erro, sem indexação |

Cada rota implementada recebe HTML próprio, com conteúdo profissional legível sem JavaScript. React hidrata o conteúdo para ativar o menu mobile. Links nativos preservam navegação, histórico e URLs diretas sem adicionar um roteador cliente nesta fase. Para criar uma rota futura, atualize o manifesto, a composição e os testes; não adicione URLs que só funcionam por fallback.

`netlify.toml` define build, pasta publicada e cabeçalhos de segurança. As rotas correspondem a diretórios com `index.html`; a normalização das barras fica com o recurso Pretty URLs do Netlify. Não há regras para adicionar ou remover barras, pois a normalização do serviço pode fazê-las entrar em loop. Não usa redirecionamento genérico para a página inicial: URLs desconhecidas mantêm resposta 404 no Netlify. Os cabeçalhos de produção não são aplicados pelo preview do Vite; precisam ser conferidos em homologação autorizada. Não há servidor Node em produção.

O domínio canônico preservado é `https://andreyportifolio.netlify.app`. Se mudar, atualize `src/content/routes.ts` e `public/robots.txt`. Este trabalho não publicou a nova versão.

## Escopo da Fase 1

Identidade grafite, azul petróleo e ciano moderado; foto original reutilizada; composição com hierarquia editorial, experiências em linhas e competências agrupadas. Sem Matrix, digitação automática ou métricas decorativas.

As páginas dos três módulos são somente prévias de escopo, claramente identificadas como **em desenvolvimento**. Não contêm incidentes inventados, inventário de infraestrutura ou terminal executável.

Acessibilidade: link para pular conteúdo, landmarks, foco visível, menu por teclado com Escape e ciclo de foco, transferência de foco para seções, descrições de imagens e respeito a movimento reduzido. Sem JavaScript, a navegação mobile permanece disponível.

## Conteúdo a confirmar

Validação da Fase 1: TypeScript e build aprovados; seis testes do HTML e dezesseis testes de navegador aprovados, incluindo larguras de 320 a 1920 px, teclado, texto ampliado, conteúdo sem JavaScript e contraste. O inventário completo de arquivos e os limites de validação estão em [docs/PHASE1.md](docs/PHASE1.md).

- **Instituição de ensino:** o legado informa “UNIFAI — Centro Universitário Assunção”; a identificação não foi confirmada e não é exibida na nova versão. ADS em andamento e previsão 2027 foram fornecidos pelo autor.
- **Currículo:** link original do Google Drive preservado; é necessário confirmar acesso público e se o documento já reflete o novo posicionamento. O botão informa “Ver currículo”, sem prometer download direto.
- **Contatos externos:** URLs existentes mantidas e normalizadas. Sintaxe validada; LinkedIn, Instagram e Drive impediram verificação automática de acesso. WhatsApp e e-mail dependem dos respectivos serviços/aplicativos.
- **Projetos:** descrições e links reaproveitados do legado, sem alegações novas sobre resultados ou estado atual de execução.
- Não foram incluídos certificados sem comprovação nem afirmação de fluência em inglês.

## Referência recuperável

Antes da migração, a versão original foi preservada localmente em `backup/pre-it-operations`, no commit **bbd5730cead4237143f97f2c69483498fd57968f**. Desenvolvimento em `feat/it-operations-foundation`.

Como o terminal não tinha resolução de rede, os seis arquivos originais foram recuperados pelo conector GitHub. Seus blobs e a árvore Git foram conferidos contra o commit original; o checkout local contém esse commit exato como base rasa, sem os ancestrais. Nenhum commit de implementação ou push foi criado. Em ambiente com rede, `git fetch --unshallow origin` recupera o histórico anterior.

Para consultar a versão anterior sem descartar o trabalho atual:

```sh
git show backup/pre-it-operations:index.html
git archive backup/pre-it-operations -o ../portfolio-anterior.zip
```

## Publicação

Não há automação de deploy nesta entrega. Push e deploy exigem autorização do proprietário. Se o repositório já estiver conectado ao Netlify, um push futuro pode acionar a publicação configurada nesse serviço; revisar essa configuração antes de enviar alterações.
