# Fase 3.1 · Infrastructure Lab

A rota existente '/infrastructure/' apresenta a topologia conceitual, o inventário declarado e as duas aplicações hospedadas no HP ProLiant ML30 Gen. O domínio configurado conduz ao agendamento via Cloudflare Tunnel. A aplicação de boletos é acessada pela LAN por IP privado. Docker, Compose, Tailscale e OpenSSH são recursos instalados no ambiente.

A topologia permite alternar entre visão geral, acesso externo e acesso interno. Os nós exibem detalhes no painel de inspeção. O inventário e as aplicações são renderizados em HTML junto da topologia inicial. A mudança de vista e a seleção requerem JavaScript.

A página documenta o ambiente e usa dados estáticos. Os caminhos de acesso são explicativos. Especificações de hardware, endereços, configurações e estado operacional ficam fora do inventário. As aplicações estão agrupadas pelo host, sem inferir como foram empacotadas.

## Implementação

- Dados tipados em 'src/content/infrastructure.ts'.
- Módulo e componentes de vista, caminhos, nós, inspeção, inventário e aplicações em 'src/features/infrastructure/InfrastructureLab.tsx'.
- Estilos isolados em 'src/features/infrastructure/infrastructure.css'.
- Rota e SEO atualizados em 'src/app/App.tsx' e 'src/content/routes.ts'. O Overview recebeu apenas a atualização do status do módulo.
- Testes específicos em 'tests/e2e/infrastructure.spec.ts'. Os testes de prévias passam a tratar apenas o Interactive Terminal como prévia.

## Execução e verificação

    npm run dev
    npm run check
    npm run test:e2e

Abra '/infrastructure/' no endereço local indicado pelo Vite.

Para uma próxima etapa, documentar a distribuição confirmada das aplicações, o processo de publicação e os procedimentos de manutenção revisados antes de acrescentá-los ao laboratório.

[Captura desktop](screenshots/infrastructure-lab-desktop.png) · [Captura mobile](screenshots/infrastructure-lab-mobile.png)
