# Fase 4.2 · Troubleshooting Lab

O laboratório usa a rota /terminal/ e o console da Fase 4.1. A descrição e a lista dos cenários estão no HTML inicial. A sessão interativa requer JavaScript.

## Fluxo

1. Digite scenario list para ver external, lan e remote.
2. Digite scenario start <id> ou use o seletor acima do console.
3. Use scenario status para revisar o sintoma, os comandos disponíveis e as evidências registradas.
4. Digite scenario diagnose para listar as opções. Envie scenario diagnose <hipótese> para avaliá-la.
5. Use scenario reset para limpar a investigação atual ou scenario exit para voltar à simulação padrão.

scenario help resume os comandos. clear limpa a saída visual e preserva a investigação. reset reinicia toda a sessão.

## Cenários

| ID       | Exemplo de sequência                                                                                                |
| -------- | ------------------------------------------------------------------------------------------------------------------- |
| external | nslookup example.com → scenario check tunnel → scenario check route → systemctl status → scenario diagnose origin   |
| lan      | ip addr → ping 192.0.2.10 → systemctl status → scenario diagnose service                                            |
| remote   | scenario check connectivity → ping 192.0.2.10 → systemctl status → scenario check access → scenario diagnose access |

## Arquitetura

scenarios.ts contém os dados tipados e as transições. parser.ts autoriza apenas sintaxes enumeradas. engine.ts direciona os comandos à investigação ativa ou ao motor da Fase 4.1. session.ts mantém a investigação junto ao histórico. A interface apresenta evidências e feedback no console, junto às respostas existentes.

Cada cenário inicia em investigação com evidências vazias. Verificações registram observações fixas sem duplicar evidências. A hipótese confirmada exige todas as evidências decisivas e uma opção coerente com elas. Uma hipótese prematura indica as verificações necessárias. Uma hipótese incorreta recebe uma explicação baseada nas observações. Reiniciar volta ao estado inicial do cenário e sair encerra a investigação.

## Limites, testes e continuidade

As respostas usam dados locais e endereços reservados para documentação. O cenário remoto é conceitual. Não há acesso ao servidor, autenticação, shell ou requisições de diagnóstico. Cada sessão existe apenas na memória da página.

Execute npm run check e npm run test:e2e. A cobertura inclui as três investigações, evidências determinísticas, diagnósticos, reset, exit, teclado, pré-renderização, larguras solicitadas e regressão dos módulos existentes.

Uma próxima melhoria possível é oferecer investigações com causas diferentes e comparar quais evidências distinguem hipóteses parecidas.

[Desktop](screenshots/terminal-lab-desktop.png) · [Mobile](screenshots/terminal-lab-mobile.png)

## Refinamento 4.2.1

O seletor mostra uma escolha pendente sem trocar a investigação em andamento. Iniciar pelo botão ou pelo console sincroniza a seleção com o cenário ativo. scenario reset volta ao início do cenário ativo e restaura sua seleção. scenario exit encerra o cenário e o seletor volta à opção inicial.

O painel anuncia o estado derivado da sessão: nenhum cenário ativo, investigação em andamento ou diagnóstico confirmado. O console mantém as respostas no estado em que foram emitidas. Os atalhos sugeridos usam as verificações disponíveis no cenário ativo e apenas preenchem o campo de entrada.

Em telas pequenas, o seletor usa a largura disponível e mostra o título completo logo abaixo. As áreas de toque têm altura mínima de 44 px. A saída monoespaçada quebra linhas e o histórico tem altura limitada. Em navegadores com suporte a VisualViewport, o campo focado é reposicionado se uma redução da área visível o encobrir.

Validação com npm run check e npm run test:e2e. Os testes do terminal verificam seleção por botão ou comando, troca pendente, reset, saída, hipóteses, preservação do histórico, atalhos por teclado e layout em 320, 375, 390, 768, 1024 e 1440 px. A abertura do teclado virtual físico depende do navegador e não é reproduzida pelo redimensionamento automatizado.
