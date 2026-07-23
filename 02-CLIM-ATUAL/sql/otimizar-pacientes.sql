-- Otimizacao tecnica para a busca local de pacientes.
-- Nao cria, altera ou remove registros clinicos.

create extension if not exists pg_trgm;

create index if not exists idx_paciente_nome_trgm_lower
  on paciente using gin (lower(nom_paciente) gin_trgm_ops);

create index if not exists idx_paciente_documento_busca
  on paciente (num_documento)
  where num_documento is not null;

create index if not exists idx_paciente_telefone_busca
  on paciente (num_telefone)
  where num_telefone is not null;

create index if not exists idx_paciente_celular_busca
  on paciente (num_celular)
  where num_celular is not null;

analyze paciente;
