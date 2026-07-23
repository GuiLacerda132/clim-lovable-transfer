import { describe, expect, it } from "vitest";
import { formatPatientAddress, patientDetailValue, patientSexLabel } from "./patient-details";

describe("detalhes do paciente", () => {
  it("exibe apenas valores existentes, sem inventar dados", () => {
    expect(patientDetailValue(undefined)).toBe("Não informado");
    expect(patientDetailValue("  ")).toBe("Não informado");
    expect(patientDetailValue("Dado existente")).toBe("Dado existente");
  });

  it("monta o endereço somente com os campos cadastrados", () => {
    expect(
      formatPatientAddress({ street: "Rua A", addressNumber: "10", city: "Matão", state: "SP" }),
    ).toBe("Rua A, 10 · Matão/SP");
    expect(formatPatientAddress(undefined)).toBe("Não informado");
  });

  it("traduz apenas os valores de sexo existentes no cadastro", () => {
    expect(patientSexLabel("F")).toBe("Feminino");
    expect(patientSexLabel(undefined)).toBe("Não informado");
  });
});
