# Atualização autorizada: Preview funcional com dados fictícios

Esta instrução substitui qualquer trecho anterior que proíba dados fictícios no Preview.

É permitido — e obrigatório — usar a base demonstrativa em `02-CLIM-ATUAL/src/lib/preview/demo-database.ts` para que o Preview da Lovable funcione como uma versão completa do CLIM. Todos os registros desse arquivo são inventados e não representam pacientes, profissionais, convênios ou dados clínicos reais.

Use os dados somente quando `VITE_CLIM_PREVIEW=true`. Nesse modo, clone a seed em `localStorage` com a chave `clim-preview-db-v1` e permita CRUD, pesquisa, paginação, agenda, fichas, características e feriados dentro do navegador.

Inclua um botão visível somente no Preview: `Restaurar dados demonstrativos`.

No Electron/local, nunca importe nem consulte essa base. O aplicativo normal deve continuar usando exclusivamente a integração PostgreSQL local existente.
