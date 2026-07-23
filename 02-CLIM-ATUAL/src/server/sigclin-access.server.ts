import "@tanstack/react-start/server-only";

import { getRequest, setResponseHeader } from "@tanstack/react-start/server";

const localHosts = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

/**
 * O banco da clínica contém dados sensíveis. Esta versão é propositalmente
 * local: não atende solicitações vindas de uma URL pública e nunca permite cache.
 */
export function assertLocalDatabaseRequest(): void {
  const request = getRequest();
  const host = new URL(request.url).hostname;

  if (!localHosts.has(host)) {
    throw new Error("O acesso ao banco CLIM está permitido apenas neste computador.");
  }

  setResponseHeader("Cache-Control", "no-store");
}
