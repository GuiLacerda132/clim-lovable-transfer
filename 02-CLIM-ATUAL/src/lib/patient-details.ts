import type { PatientAddress } from "../domain/types";

const NOT_INFORMED = "Não informado";

export function patientDetailValue(value?: string | null): string {
  return value?.trim() || NOT_INFORMED;
}

export function patientSexLabel(value?: "F" | "M" | "O"): string {
  const labels = { F: "Feminino", M: "Masculino", O: "Outro" } as const;
  return value ? labels[value] : NOT_INFORMED;
}

export function formatPatientAddress(address?: PatientAddress): string {
  if (!address) return NOT_INFORMED;

  const street = [address.street, address.addressNumber].filter(Boolean).join(", ");
  const location = [address.city, address.state].filter(Boolean).join("/");
  return [street, location].filter(Boolean).join(" · ") || NOT_INFORMED;
}
