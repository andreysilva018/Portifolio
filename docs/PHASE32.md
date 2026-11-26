# Fase 3.2 · Connectivity Explorer & Troubleshooting

Na rota '/infrastructure/', o Connectivity Explorer detalha três caminhos de acesso depois da topologia instalada. O simulador oferece três investigações fictícias e determinísticas. A topologia, o inventário e as aplicações da Fase 3.1 continuam disponíveis na mesma página.

## Componentes e dados

- 'src/content/connectivity.ts' define caminhos, etapas, cenários e a máquina de estados. Os caminhos reaproveitam os rótulos e identificadores da topologia instalada. Cada etapa acrescenta função, explicação, dependências, falhas e verificação recomendada.
- 'ConnectivityWorkspace.tsx' reúne os dois painéis, reaproveita os estilos de nós e inspeção da topologia e oferece uma referência expansível sem JavaScript. 'connectivity.css' mantém os estilos adicionais restritos ao módulo.
- A máquina de estados começa em exploração. Cada verificação registra uma observação uma vez. A conclusão antecipada informa quais observações decisivas ainda precisam ser comparadas. Concluir após ambas revela o diagnóstico e a justificativa. Reiniciar limpa as observações do cenário atual. Selecionar outro cenário inicia uma nova investigação.

## Caminhos

| Caminho        | Escopo                                                                                                                                                                     |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Externo        | Domínio, rede Cloudflare, conector cloudflared e resposta do agendamento no HP ML30.                                                                                       |
| Interno        | Cliente na LAN, endereço privado do host e resposta da aplicação de boletos.                                                                                               |
| Administrativo | Exemplo conceitual de conectividade privada com Tailscale e serviço OpenSSH. As duas ferramentas estão instaladas. A configuração conjunta do exemplo não está confirmada. |

## Cenários fictícios

| Sintoma                            | Observações decisivas                         | Conclusão da simulação         |
| ---------------------------------- | --------------------------------------------- | ------------------------------ |
| Domínio não acessa o agendamento   | Túnel conectado e origem sem resposta         | Serviço de origem indisponível |
| Aplicação de boletos indisponível  | Host alcançável e aplicação inativa           | Aplicação interna inativa      |
| Sessão administrativa indisponível | Conexão privada disponível e SSH indisponível | Serviço SSH indisponível       |

Todos os resultados vêm de dados locais. As interações não acessam o servidor, não executam comandos e não usam endereços, credenciais ou logs reais. As referências e explicações estão no HTML inicial. A seleção de etapas e a simulação interativa requerem JavaScript.

## Validação e próximas etapas

`npm run check` verifica TypeScript, build e HTML pré-renderizado. `npm run test:e2e` cobre teclado, etapas, cenários, reinício, larguras de 320, 375, 768, 1024 e 1440 px, leitura sem JavaScript e regressão do laboratório anterior, das rotas existentes e do link público do agendamento.

Uma próxima etapa pode acrescentar cenários de autorização ou configuração de destino usando evidências simuladas que distingam falha de conexão, serviço e permissão.

[Captura desktop](screenshots/connectivity-desktop.png) · [Captura mobile](screenshots/troubleshooting-mobile.png)
