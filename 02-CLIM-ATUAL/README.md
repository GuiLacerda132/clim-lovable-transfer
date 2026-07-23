# CLIM — aplicativo desktop local

Esta é a interface atualizada da Clínica Integrada Matonense, empacotada como aplicativo do Windows. Ela usa o banco PostgreSQL e as regras já existentes da clínica.

## Abrir como aplicativo

Abra este arquivo:

`release\win-unpacked\CLIM.exe`

Mantenha toda a pasta `win-unpacked` junto do executável. Para abrir mais facilmente, crie um atalho desse `CLIM.exe` na Área de Trabalho.

O aplicativo abre em sua própria janela, sem aba ou barra de navegador, e inicia internamente apenas um servidor local em `127.0.0.1`. A senha do banco não é enviada ao navegador e não é salva neste projeto.

## Escopo atual

- Agenda, fila, pacientes, profissionais, convênios, atendimentos, feriados e dados da clínica.
- Nenhuma tabela, regra clínica ou cadastro fictício foi criado.
- Não há carteirinha ou QR Code de paciente.
- A aplicação aceita somente conexões locais; não expõe os dados clínicos na rede.
- O sistema original não é alterado por esta aplicação.

## Desenvolvimento

```powershell
corepack pnpm install
corepack pnpm test
corepack pnpm desktop:build
```

`desktop:build` recria a pasta `release\win-unpacked`. Os testes não escrevem no banco clínico.

## Estrutura de integração

- `desktop\main.cjs`: janela desktop e servidor local embutido.
- `src\lib\sigclin.functions.ts`: funções chamadas pela interface.
- `src\server\sigclin-repository.server.ts`: adaptador SQL parametrizado para as tabelas e funções existentes.
- `src\hooks\use-queries.ts`: hooks React Query usados pelas telas.

As regras de negócio continuam no PostgreSQL legado: triggers e funções originais determinam conflitos, senhas, horários e feriados.
