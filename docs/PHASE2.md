# Fase 2 — Incident Explorer

O catálogo local em '/incidents/' oferece pesquisa sem distinção de acentos, filtros por categoria, tecnologia e origem, contagem de resultados e limpeza. Os links abrem páginas próprias. O desktop combina lista e detalhe. No celular, o detalhe tem uma vista dedicada e um link de volta ao catálogo.

| Roteiro                                                                         | URL local                                        |
| ------------------------------------------------------------------------------- | ------------------------------------------------ |
| CASE-002 · Falha de conectividade e reorganização de rede                       | /incidents/falha-conectividade-rede-corporativa/ |
| CASE-001 · Investigação e tratamento de divergências entre estoque físico e ERP | /incidents/inconsistencia-erp/                   |
| CASE-003 · Digitalização de catálogos                                           | /incidents/catalogos-tecnicos/                   |
| CASE-004 · Automação de boletos                                                 | /incidents/automacao-boletos/                    |

Os contratos em 'src/content/incidents.ts' registram código, slug, classificação, tecnologias, origem, estado documental, sintomas, contexto, impacto opcional, hipóteses, etapas, evidências, validação e aprendizado. Causa raiz e resolução são opcionais. LAB-002 foi retirado do catálogo e do sitemap. Sua URL direta permanece disponível com noindex. CASE-002 substitui LAB-001 e separa o restabelecimento da conexão da reorganização física posterior. A topologia conceitual usa opções de rádio e detalhes nativos, funcionando também sem JavaScript. O Netlify está configurado para redirecionar a antiga URL de DNS com HTTP 301. O preview do Vite não aplica essa regra. CASE-001 é um relato profissional anonimizado, priorizado no catálogo, com seis etapas de investigação, tratativa e acompanhamento. A etapa de inventário registra uma medida avaliada. A URL anterior de ERP foi preservada. Evidências, causa raiz, desfecho e validação podem ficar ausentes.

As páginas têm HTML estático, metadados canônicos e entrada no sitemap. Com JavaScript desativado, o catálogo e os detalhes continuam disponíveis via links. Pesquisa e filtros usam estado local e reiniciam ao trocar de página. A cópia depende da disponibilidade da API de área de transferência. Endereços inexistentes usam o 404 do workspace.

## Executar localmente

    npm ci
    npm run dev

Abra '/incidents/' no endereço indicado pelo Vite. Para conferir o HTML de produção, execute 'npm run check' e 'npm run preview'. Após o build, 'npm run test:e2e' roda a suíte no Chrome.

## Arquivos

- Novos: 'src/content/incidents.ts', 'src/features/incidents/IncidentExplorer.tsx', 'src/features/incidents/IncidentDetail.tsx' e 'tests/e2e/incidents.spec.ts'.
- Atualizados: 'src/app/App.tsx', 'src/content/routes.ts', link de incidentes no Overview, 'src/styles/index.css', testes anteriores e duas capturas em 'docs/screenshots/'.

O ponto de recuperação local da Fase 1.5.1 é 'backup/phase151' no commit 'c408048'. O trabalho está em 'feat/incident-explorer'.

Capturas do CASE-002: [desktop, depois da reorganização](screenshots/case-002-desktop.png) e [mobile, antes da reorganização](screenshots/case-002-mobile.png).

### Demonstrações dos casos de automação

CASE-003 usa três itens fictícios pesquisáveis e uma página conceitual com medidas e especificações de exemplo. CASE-004 usa três lotes fictícios, contadores derivados dos resultados de cada lote e a matriz de permissões fornecida. As duas demonstrações usam somente estado local do navegador. O relato e o cenário inicial são pré-renderizados, e a interação requer JavaScript. O simulador não processa arquivos nem se conecta a serviços.
