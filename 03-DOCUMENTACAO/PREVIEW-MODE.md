# Modo de prévia com base demonstrativa

O arquivo `02-CLIM-ATUAL/src/lib/preview/demo-database.ts` contém dados 100% inventados: clínica, profissionais, convênios, pacientes, agenda, fichas, características/respostas e feriados.

## Implementação obrigatória na Lovable

1. Ativar apenas com `VITE_CLIM_PREVIEW=true`.
2. Clonar `previewDatabaseSeed` no primeiro acesso para `localStorage` usando a chave `clim-preview-db-v1`.
3. Fazer cada CRUD e fluxo do Preview atuar nessa cópia local, sem servidor externo.
4. Permitir restaurar os dados demonstrativos em Configurações.
5. Mostrar o selo: `Ambiente demonstrativo — dados fictícios`.
6. Manter a integração PostgreSQL intacta e exclusiva do modo Electron/local.

Esta especificação substitui a proibição anterior de seed/mock apenas para o ambiente de Preview. Nenhum dado demonstrativo pode ser usado, enviado ou misturado ao banco real da clínica.
