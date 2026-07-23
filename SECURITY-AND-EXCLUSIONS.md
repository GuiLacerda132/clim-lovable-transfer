# Revisão de segurança do pacote

Este pacote foi separado da instalação operacional da clínica antes do compartilhamento.

## Excluído intencionalmente

- Banco PostgreSQL e qualquer exportação de dados.
- Backups do sistema legado.
- Arquivo de conexão real (`config.xml`), que continha host interno e credenciais.
- Instalador/configurador que possa reproduzir a configuração operacional.
- `node_modules`, builds locais, logs, capturas de tela e ferramentas de teste.
- Qualquer conteúdo com cadastros, documentos, telefones, e-mails, convênios vinculados ou dados clínicos.

## Incluído de forma segura

- Executável legado e bibliotecas de referência, sem configuração de conexão.
- Código do CLIM, inclusive a integração com o banco, mas sem valores de ambiente.
- Modelo de configuração com campos vazios e documentação de contratos.

## Antes de publicar

Não adicione `config.xml`, `.env`, backup, dump de banco, capturas de tela da operação ou arquivos de exportação de pacientes. Se for necessário conectar o projeto ao banco real posteriormente, isso deve ocorrer somente no computador local da clínica, usando variáveis/arquivo de configuração fora do repositório.
