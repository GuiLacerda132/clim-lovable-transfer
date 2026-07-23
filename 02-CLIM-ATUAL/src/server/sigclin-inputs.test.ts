import { describe, expect, it } from "vitest";
import { appointmentInputSchema, patientInputSchema } from "./sigclin-inputs";

describe("entradas do adaptador SIGClin", () => {
  it("aceita somente os campos do cadastro legado de paciente", () => {
    const result = patientInputSchema.parse({
      fullName: "Paciente de teste",
      sex: "F",
      birthDate: "1990-01-31",
      document: "00000000000",
      phone: "",
      mobile: "",
      email: "",
      profession: "",
      street: "Rua de teste",
      addressNumber: "10",
      neighborhood: "Centro",
      zip: "00000-000",
      city: "Matão",
      state: "SP",
    });

    expect(result.fullName).toBe("Paciente de teste");
    expect(result.addressNumber).toBe("10");
  });

  it("não converte os status antigos da agenda em um fluxo novo", () => {
    expect(() =>
      appointmentInputSchema.parse({
        professionalId: "1",
        date: "2026-07-22",
        time: "08:00",
        patientName: "Paciente de teste",
        legacyStatus: "confirmada",
        attendance: "N",
      }),
    ).toThrow();

    expect(
      appointmentInputSchema.parse({
        professionalId: "1",
        date: "2026-07-22",
        time: "08:00",
        patientName: "Paciente de teste",
        legacyStatus: "N",
        attendance: "N",
      }).legacyStatus,
    ).toBe("N");
  });
});
