import "@tanstack/react-start/server-only";

import { Pool, type QueryResultRow } from "pg";

type SqlValue = string | number | boolean | Date | null | undefined;

let pool: Pool | undefined;

function getPool(): Pool {
  if (pool) return pool;

  const connectionString = process.env.SIGCLIN_DATABASE_URL;
  if (!connectionString) {
    throw new Error("O banco CLIM não está configurado neste computador.");
  }

  pool = new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 10_000,
    ssl: process.env.SIGCLIN_DATABASE_SSL === "true",
  });

  return pool;
}

export async function execute<Row extends QueryResultRow>(
  sql: string,
  values: SqlValue[] = [],
): Promise<Row[]> {
  const result = await getPool().query<Row>(sql, values);
  return result.rows;
}

export async function pingDatabase(): Promise<void> {
  await execute("select 1 as connected");
}
