/**
 * Conversões de representação entre a interface e o banco que já existe.
 * Nenhuma regra de agenda é reproduzida aqui: as validações continuam nos
 * gatilhos e funções originais do PostgreSQL do SIGClin.
 */

export type LegacyAppointmentStatus = "N" | "E" | "D";
export type AppointmentStatus = "normal" | "encaixe" | "desmarcado";

const statusByLegacy: Record<LegacyAppointmentStatus, AppointmentStatus> = {
  N: "normal",
  E: "encaixe",
  D: "desmarcado",
};

const legacyByStatus: Record<AppointmentStatus, LegacyAppointmentStatus> = {
  normal: "N",
  encaixe: "E",
  desmarcado: "D",
};

export function appointmentStatusFromLegacy(value: string): AppointmentStatus {
  return statusByLegacy[value as LegacyAppointmentStatus] ?? "normal";
}

export function appointmentStatusToLegacy(value: AppointmentStatus): LegacyAppointmentStatus {
  return legacyByStatus[value];
}

export function minutesToLegacyInterval(minutes: number): string {
  if (!Number.isInteger(minutes) || minutes < 1 || minutes > 23 * 60 + 59) {
    throw new Error("O intervalo deve estar entre 1 e 1439 minutos.");
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(remainingMinutes).padStart(2, "0")}:00`;
}

export function legacyIntervalToMinutes(value: string | null | undefined): number | null {
  if (!value) return null;

  const match = /^(\d{1,2}):(\d{2})/.exec(value);
  if (!match) return null;

  return Number(match[1]) * 60 + Number(match[2]);
}

export function toIsoDate(value: string | Date | null | undefined): string | null {
  if (!value) return null;
  if (typeof value === "string") return value.slice(0, 10);
  return value.toISOString().slice(0, 10);
}

export function toClockTime(value: string | Date | null | undefined): string | null {
  if (!value) return null;
  const text = typeof value === "string" ? value : value.toISOString().slice(11, 19);
  return text.slice(0, 5);
}
