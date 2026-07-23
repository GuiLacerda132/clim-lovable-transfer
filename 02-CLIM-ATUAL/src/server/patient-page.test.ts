import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ execute: vi.fn() }));

vi.mock("./sigclin-db.server", () => ({ execute: mocks.execute }));

import { patientPageInputSchema } from "./sigclin-inputs";
import { legacyRepository } from "./sigclin-repository.server";

describe("pagina\u00e7\u00e3o de pacientes", () => {
  beforeEach(() => mocks.execute.mockReset());

  it("aceita somente lotes pequenos e cursores positivos", () => {
    expect(patientPageInputSchema.parse({ search: "", pageSize: 50 })).toEqual({
      search: "",
      pageSize: 50,
    });
    expect(() => patientPageInputSchema.parse({ search: "", pageSize: 51 })).toThrow();
    expect(() => patientPageInputSchema.parse({ search: "", cursor: 0 })).toThrow();
  });

  it("traz pacientes em lotes pequenos com pagina\u00e7\u00e3o por cursor", async () => {
    mocks.execute.mockResolvedValueOnce([
      { nro_paciente: "101", nom_paciente: "Paciente de teste" },
      { nro_paciente: "102", nom_paciente: "Outro paciente" },
      { nro_paciente: "103", nom_paciente: "Pr\u00f3ximo paciente" },
    ]);

    const result = await legacyRepository.listPatientPage({
      search: "teste",
      cursor: 100,
      pageSize: 2,
    });

    expect(result.items).toHaveLength(2);
    expect(result.nextCursor).toBe("102");
    expect(mocks.execute).toHaveBeenCalledWith(
      expect.stringContaining("order by nro_paciente asc"),
      [100, "%teste%", "teste", 3],
    );
  });
});
