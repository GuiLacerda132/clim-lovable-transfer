import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getPatients: vi.fn(),
  createPatient: vi.fn(),
}));

vi.mock("../sigclin.functions", () => mocks);

import { repositories } from "./index";

describe("repositórios da interface", () => {
  it("consulta pacientes pelo adaptador local, em vez da memória temporária", async () => {
    mocks.getPatients.mockResolvedValueOnce({ items: [
      { id: "1", fullName: "Paciente de teste", document: "" },
    ], nextCursor: undefined });

    await expect(repositories.patients.listPage({ search: "", pageSize: 1 })).resolves.toMatchObject({
      items: [{ id: "1" }],
    });
    expect(mocks.getPatients).toHaveBeenCalledOnce();
  });

  it("pede uma pagina pequena ao adaptador local", async () => {
    mocks.getPatients.mockResolvedValueOnce({ items: [], nextCursor: undefined });

    await repositories.patients.listPage({ search: "teste", pageSize: 25 });

    expect(mocks.getPatients).toHaveBeenCalledWith({
      data: { search: "teste", pageSize: 25 },
    });
  });

  it("envia os cadastros pelo mesmo contrato validado no servidor", async () => {
    const input = {
      fullName: "Paciente de teste",
      sex: "F" as const,
      birthDate: "1990-01-01",
      document: "",
      phone: "",
      mobile: "",
      email: "",
      profession: "",
      street: "",
      addressNumber: "",
      neighborhood: "",
      zip: "",
      city: "",
      state: "SP",
    };

    mocks.createPatient.mockResolvedValueOnce({ id: "1", fullName: input.fullName, document: "" });

    await repositories.patients.create(input);
    expect(mocks.createPatient).toHaveBeenCalledWith({ data: input });
  });
});
