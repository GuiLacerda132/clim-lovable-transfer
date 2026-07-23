import { describe, expect, it } from "vitest";
import {
  appointmentStatusFromLegacy,
  appointmentStatusToLegacy,
  minutesToLegacyInterval,
} from "./sigclin-contracts";

describe("contratos da agenda legada", () => {
  it("preserva os três estados que já existiam no SIGClin", () => {
    expect(appointmentStatusFromLegacy("N")).toBe("normal");
    expect(appointmentStatusFromLegacy("E")).toBe("encaixe");
    expect(appointmentStatusFromLegacy("D")).toBe("desmarcado");

    expect(appointmentStatusToLegacy("normal")).toBe("N");
    expect(appointmentStatusToLegacy("encaixe")).toBe("E");
    expect(appointmentStatusToLegacy("desmarcado")).toBe("D");
  });

  it("converte o intervalo da tela para o tipo time usado pelo banco legado", () => {
    expect(minutesToLegacyInterval(5)).toBe("00:05:00");
    expect(minutesToLegacyInterval(30)).toBe("00:30:00");
    expect(minutesToLegacyInterval(90)).toBe("01:30:00");
  });
});
