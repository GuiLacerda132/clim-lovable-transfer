import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ execute: vi.fn() }));

vi.mock("./sigclin-db.server", () => ({ execute: mocks.execute }));

import { legacyRepository } from "./sigclin-repository.server";

describe("repositório do SIGClin", () => {
  beforeEach(() => mocks.execute.mockReset());

  it("lista a agenda usando a tabela existente e preserva a ordenação", async () => {
    mocks.execute.mockResolvedValueOnce([
      {
        nro_seq_agenda: "11",
        nro_atendente: "3",
        nom_atendente: "Profissional de teste",
        dat_agenda: "2026-07-22",
        hor_agenda: "09:00:00",
        nom_paciente: "Paciente de teste",
        fla_compareceu: "N",
        fla_status: "N",
      },
    ]);

    const result = await legacyRepository.listAppointments({ date: "2026-07-22" });

    expect(result[0]).toMatchObject({ id: "11", status: "normal", time: "09:00" });
    expect(mocks.execute).toHaveBeenCalledWith(expect.stringContaining("from agenda a"), [
      "2026-07-22",
    ]);
    expect(mocks.execute.mock.calls[0][0]).toContain("order by a.dat_agenda, a.hor_agenda");
  });
});
