# Fase 4.1 · Interactive Terminal

Na rota '/terminal/', o console local apresenta conteúdo do portfólio e respostas fictícias de Linux e redes. A referência de comandos faz parte do HTML inicial e funciona sem JavaScript. A sessão interativa requer JavaScript.

| Grupo | Comandos |
| --- | --- |
| Portfólio | help, about, skills, experience, projects, lab, cases |
| Linux | uname -a, pwd, ls, whoami, df -h, systemctl status, docker ps |
| Redes | ping, nslookup, ip addr, traceroute |
| Sessão | clear, reset |

## Arquitetura

'commands.ts' define a lista explícita, a ajuda e os exemplos fixos. 'parser.ts' valida a sintaxe e restringe os destinos de rede aos exemplos. 'engine.ts' produz respostas tipadas de dados locais. 'session.ts' mantém o histórico e diferencia limpeza visual de reinício. 'InteractiveTerminal.tsx' liga esses elementos à interface com estilos próprios.

O texto informado é tratado como texto. A simulação usa 192.0.2.10, 198.51.100.1, 203.0.113.1 e example.com como referências de documentação. As respostas são fixas e não representam o HP ML30. A sessão não possui shell nem conexões externas.

## Uso

Enter ou Enviar processa o comando. As setas percorrem entradas anteriores e restauram o rascunho ao voltar ao fim. Tab completa um prefixo único. Em caso ambíguo, as opções aparecem e o foco segue a ordem normal. 'clear' limpa a tela e mantém a navegação no histórico. 'reset' limpa ambos. São mantidas até 100 entradas na memória da página.

## Verificação e continuidade

Rode 'npm run check' e depois 'npm run test:e2e'. Os testes cobrem todos os comandos, argumentos inválidos, entradas renderizadas como texto, histórico, autocompletar, reinício, conteúdo sem JavaScript e responsividade.

O próximo passo previsto na Fase 4.2 é acrescentar investigações guiadas com evidências fictícias e conclusões explicadas.

[Captura desktop](screenshots/terminal-console-desktop.png) · [Captura mobile](screenshots/terminal-console-mobile.png)
