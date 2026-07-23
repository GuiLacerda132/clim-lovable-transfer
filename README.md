# CLIM — pacote para a Lovable

Este é o único pacote que pode ser enviado ou publicado. Ele contém duas referências complementares:

- `01-ORIGINAL-FUNCIONAL`: o executável e as bibliotecas do sistema legado, para consulta do comportamento real.
- `02-CLIM-ATUAL`: a estrutura-fonte completa e compartilhável do aplicativo CLIM atual: Electron, React, rotas, componentes, estilos, configuração da Lovable e camada de integração PostgreSQL.
- `03-DOCUMENTACAO`: a especificação funcional obrigatória, o prompt para a Lovable e um modelo de configuração sem segredos.

## Regra principal

O sistema legado é a fonte de verdade funcional. O CLIM é a fonte de verdade de design, experiência e desempenho. A entrega da Lovable deve unir os dois: todos os botões e operações existentes no legado precisam existir no CLIM, com a interface atualizada.

## O que não existe neste pacote

Não há banco de dados, backup, registros de pacientes, prontuários, IP interno, usuários, senhas, arquivos `config.xml` reais, variáveis de ambiente reais ou logs operacionais.

## Para a Lovable

Comece por [03-DOCUMENTACAO/LOVABLE-IMPLEMENTATION-BRIEF.md](03-DOCUMENTACAO/LOVABLE-IMPLEMENTATION-BRIEF.md). Não crie uma interface demonstrativa nem dados fictícios. Trabalhe diretamente sobre o código de `02-CLIM-ATUAL` e preserve a camada de integração já existente. Não são necessárias capturas de tela: o design deve ser clonado e evoluído a partir da estrutura e dos estilos desse código.
