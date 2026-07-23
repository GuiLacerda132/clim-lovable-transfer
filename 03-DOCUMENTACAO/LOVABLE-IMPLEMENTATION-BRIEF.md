# Prompt para a Lovable — CLIM funcional

Cole o texto a seguir no projeto conectado ao GitHub e envie também este repositório/pasta inteira.

---

Trabalhe no projeto existente **CLIM**. A pasta `02-CLIM-ATUAL` é a estrutura real do projeto que deve ser clonada/evoluída visualmente; use seus componentes, rotas e `src/styles.css` como referência direta de design. Não peça capturas de tela. Não faça uma demo visual, não use dados fictícios, não troque o banco por Supabase e não remova a integração local já existente. O aplicativo final é desktop via Electron e deve manter a marca **CLIM**.

## Objetivo

Transformar o CLIM atual em uma versão moderna, rápida e totalmente funcional do sistema legado que está em `01-ORIGINAL-FUNCIONAL`. Use o legado como fonte de verdade para comportamento e `02-CLIM-ATUAL` como base de design e integração. A lista obrigatória de paridade está em `03-DOCUMENTACAO/LEGACY-FUNCTIONAL-PARITY.md`.

## Arquitetura que não pode ser quebrada

- Preserve Electron, TanStack Start/React e a camada server-side em `src/server`.
- Preserve `src/lib/sigclin.functions.ts`, `src/lib/repositories`, contratos, mapeadores e repositório PostgreSQL. Eles já modelam operações reais do sistema antigo.
- Não inclua valores de conexão no código. A conexão vem apenas de configuração local/variáveis de ambiente fora do repositório.
- Não adicione Supabase, autenticação em nuvem, banco paralelo, seed, mock, JSON estático nem uma API nova que replique regras existentes.
- Não altere os nomes/semântica das tabelas do legado e não crie migrações destrutivas.

## Entrega obrigatória

Implemente integralmente a paridade funcional descrita no documento, com foco inicial em: cadastro/edição completo de pacientes; relações de convênio; fichas por profissional e características/respostas; agenda completa; profissionais; clínicas; convênios; características; feriados e backup local.

Cada botão deve chamar uma ação real já existente ou o equivalente direto na camada de repositório. Se uma consulta de leitura faltar, implemente apenas a consulta mínima usando as tabelas legadas e mantendo os contratos tipados. Não deixe placeholders, toasts de “em breve” ou componentes só visuais.

## UX e desempenho

- Preserve o visual CLIM: verde escuro, dourado e branco; limpo, profissional, responsivo para a janela desktop.
- Nunca recarregue o app inteiro para navegar entre telas.
- A busca de pacientes deve ser servidor/paginada por cursor e nunca trazer toda a base para o navegador. As tabelas precisam de altura fixa, cabeçalho estável e scroll interno somente na lista.
- Não mude a largura/altura da página nem desloque a paginação ao avançar páginas.
- Todos os formulários precisam de estados de carregamento, vazio, erro, sucesso, confirmação antes de exclusão e invalidação/atualização da consulta após gravar.

## Segurança e dados

- Este pacote não contém dados reais; mantenha assim.
- Não adicione screenshots, seeds ou valores de pacientes.
- Não exponha queries, host, usuário, senha ou conexão no front-end.
- Use dados reais somente quando o aplicativo for executado localmente pela clínica com a configuração privada fora do repositório.

## Validação obrigatória antes de concluir

1. Rodar testes existentes e acrescentar testes para cada novo fluxo funcional.
2. Rodar build do desktop.
3. Validar navegação e operações de leitura sem criar/editar/excluir registros reais durante os testes.
4. Entregar uma tabela curta dizendo: função do legado, tela/ação CLIM correspondente e teste executado.

Não reescreva a aplicação do zero. Evolua o código existente para que a integração construída seja aproveitada diretamente quando o projeto voltar para desenvolvimento local.

---

Depois que a Lovable terminar, envie o link do repositório de volta para a integração final local. Não peça nem publique o banco da clínica.
