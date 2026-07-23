# Paridade funcional obrigatória: legado → CLIM

Este inventário foi produzido por inspeção do aplicativo original sem gravar, editar ou excluir dados. Ele é requisito de aceite da versão atualizada.

## Princípios de implementação

1. Não inventar regras de negócio, tabelas ou dados de exemplo.
2. Usar a camada já existente em `02-CLIM-ATUAL/src/server` e `src/lib/sigclin.functions.ts`; ela conversa com o banco legado real quando uma configuração local for fornecida fora do repositório.
3. Manter as regras existentes do banco (triggers, funções e validações), sem duplicá-las de forma divergente no front-end.
4. Cada botão abaixo precisa ter ação funcional, tratamento de erro e atualização da tela após sucesso.
5. Nenhuma tela pode carregar toda a base de pacientes. A pesquisa e a paginação devem permanecer no servidor, por cursor, com listas pequenas.

## Menu principal original

| Área | Funções obrigatórias |
| --- | --- |
| Menu | Backup local e saída do aplicativo. |
| Manutenção > Clínica | Listar, incluir, alterar e excluir clínica. Cadastro: código, nome, endereço, número, bairro, CEP, cidade, estado e logotipo. |
| Manutenção > Atendentes | Listar, incluir, alterar e excluir profissional. Cadastro: código, nome, especialidade, CRM, CRO, clínica, intervalo e horários de manhã/tarde. |
| Manutenção > Convênios | Listar, incluir, alterar e excluir convênio. Cadastro: código, nome, documento e observações. |
| Manutenção > Características | Selecionar profissional; listar, adicionar/editar em grade, salvar e excluir características (perguntas clínicas). |
| Pacientes > Gerenciar | Pesquisar/limpar por código, ficha, nome, cidade, convênio e profissional; listar; incluir, editar e excluir paciente. |
| Agenda > Gerenciar | Filtrar por profissional; pesquisar paciente; incluir, alterar, excluir, consultar horários, abrir último agendamento e operar a agenda. |
| Agenda > Feriados | Listar/editar/salvar, excluir e copiar feriados entre anos. |

## Pacientes — tela e ações obrigatórias

### Busca e lista

- Critérios: código, ficha, nome, cidade, convênio e profissional.
- Botões: `Pesquisar`, `Limpar`, `Novo`, `Editar`, `Excluir`.
- A listagem deve suportar dezenas de milhares de pacientes sem travar a janela: busca remota, paginação por cursor, tabela com altura estável e scroll somente dentro da lista.

### Cadastro/edição

Todos estes campos existem no legado e precisam ser exibidos/gravados conforme o banco original: código, data de cadastro, nome, sexo, data de nascimento/idade, RG/CPF, profissão, logradouro, número, bairro, CEP, cidade, estado, telefone, celular e e-mail.

### Convênios relacionados

- Listar os convênios do paciente.
- Botão de adicionar relação com convênio existente.
- Botão de remover a relação selecionada, com confirmação clara.

### Atendentes relacionados / fichas

- Listar ficha, profissional e especialidade ligados ao paciente.
- Incluir ficha para um profissional, editar a ficha selecionada e excluir a ficha selecionada.
- A ficha contém profissional, número/data de cadastro, observações e uma grade de características/respostas.
- Deve existir o botão para carregar as características definidas para o profissional e o botão para remover a resposta/característica selecionada.
- Salvar e sair/cancelar devem ser explícitos; fechar sem salvar não pode descartar alterações silenciosamente.

## Agenda — ações obrigatórias

### Gerenciador

- Lista os agendamentos do profissional com data, hora, paciente, convênio, telefone, senha, comparecimento, status e observações.
- Incluir, alterar e excluir agendamento.
- Pesquisa de paciente.
- Consulta de horários disponíveis e de dias disponíveis do profissional.
- Acesso ao último agendamento.

### Cadastro de agendamento

- Data e hora.
- Buscar/selecionar paciente.
- Selecionar convênio relacionado.
- Calendário, lista de dias e lista de horários disponíveis.
- Status, observações, telefone e senha.
- Salvar e sair/cancelar.

Os status e bloqueios devem obedecer às regras existentes no banco legado; não substituir por lógica inventada no navegador.

## Feriados, backup e regras já existentes

- Feriados: manipulação em grade, salvar, excluir e copiar de um ano para outro.
- Backup: somente local, sem upload automático.
- Banco legado usado pelo CLIM: `agenda`, `atendente`, `atendente_paciente`, `caract_atendente`, `caract_paciente`, `clinica`, `convenio`, `convenio_paciente`, `feriado`, `ficha` e `paciente`.
- Funções existentes a preservar: cópia de feriados, dias disponíveis, horários disponíveis e validações de conflito de agenda.
- As triggers existentes de agenda e características são a referência para duplicidade, sequência e consistência.

## Critérios de aceite

- Todos os itens desta página são navegáveis e operacionais com o banco local configurado.
- Nenhum item é apenas botão visual, toast genérico ou dado fictício.
- O aplicativo continua desktop via Electron e abre como `CLIM`.
- Não exibir a marca antiga ao usuário.
- Não incluir nem publicar dados reais.
