import "@tanstack/react-start/server-only";

import type {
  Appointment,
  Characteristic,
  CharacteristicAnswer,
  ClinicalRecord,
  Clinic,
  HealthPlan,
  Holiday,
  Patient,
  Professional,
} from "../domain/types";
import {
  appointmentStatusFromLegacy,
  legacyIntervalToMinutes,
  toClockTime,
  toIsoDate,
} from "./sigclin-contracts";

export type LegacyRow = Record<string, string | number | Date | null | undefined>;

function text(row: LegacyRow, key: string): string | undefined {
  const value = row[key];
  return value === null || value === undefined || value === "" ? undefined : String(value);
}

function number(row: LegacyRow, key: string): number | undefined {
  const value = row[key];
  if (value === null || value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function date(row: LegacyRow, key: string): string | undefined {
  const value = row[key];
  return toIsoDate(typeof value === "number" ? String(value) : value) ?? undefined;
}

function time(row: LegacyRow, key: string): string | undefined {
  const value = row[key];
  return toClockTime(typeof value === "number" ? String(value) : value) ?? undefined;
}

export function mapLegacyClinic(row: LegacyRow): Clinic {
  return {
    id: String(row.nro_clinica),
    name: text(row, "nom_clinica") ?? "",
    street: text(row, "des_endereco"),
    addressNumber: text(row, "num_endereco"),
    neighborhood: text(row, "des_bairro"),
    city: text(row, "nom_cidade"),
    state: text(row, "sig_estado"),
    zip: text(row, "num_cep"),
    logoUrl: text(row, "path_logotipo"),
  };
}

export function mapLegacyProfessional(row: LegacyRow): Professional {
  const crm = text(row, "num_crm");
  const cro = text(row, "num_cro");

  return {
    id: String(row.nro_atendente),
    name: text(row, "nom_atendente") ?? "",
    specialty: text(row, "des_especialidade") ?? "",
    clinicId: String(row.nro_clinica),
    crm,
    cro,
    councilNumber: crm ?? cro,
    slotMinutes: legacyIntervalToMinutes(text(row, "val_intervalo")) ?? undefined,
    morningStart: time(row, "hor_ini_manha"),
    morningEnd: time(row, "hor_fim_manha"),
    afternoonStart: time(row, "hor_ini_tarde"),
    afternoonEnd: time(row, "hor_fim_tarde"),
  };
}

export function mapLegacyHealthPlan(row: LegacyRow): HealthPlan {
  return {
    id: String(row.nro_convenio),
    name: text(row, "nom_convenio") ?? "",
    document: text(row, "num_documento"),
    notes: text(row, "des_observacao"),
  };
}

export function mapLegacyPatient(row: LegacyRow): Patient {
  const address = {
    street: text(row, "nom_logradouro"),
    addressNumber: text(row, "num_endereco"),
    neighborhood: text(row, "nom_bairro"),
    city: text(row, "nom_cidade"),
    state: text(row, "sig_uf"),
    zip: text(row, "num_cep"),
  };

  const hasAddress = Object.values(address).some(Boolean);
  const sex = text(row, "ind_sexo");

  return {
    id: String(row.nro_paciente),
    fullName: text(row, "nom_paciente") ?? "",
    birthDate: date(row, "dat_nascimento"),
    sex: sex === "F" || sex === "M" || sex === "O" ? sex : undefined,
    document: text(row, "num_documento") ?? "",
    phone: text(row, "num_telefone"),
    mobile: text(row, "num_celular"),
    email: text(row, "email"),
    profession: text(row, "des_profissao"),
    address: hasAddress ? address : undefined,
  };
}

export function mapLegacyAppointment(row: LegacyRow): Appointment {
  return {
    id: String(row.nro_seq_agenda),
    professionalId: String(row.nro_atendente),
    professionalName: text(row, "nom_atendente"),
    patientId: text(row, "nro_paciente"),
    patientName: text(row, "nom_paciente") ?? "",
    healthPlanName: text(row, "nom_convenio"),
    date: date(row, "dat_agenda") ?? "",
    time: time(row, "hor_agenda") ?? "",
    status: appointmentStatusFromLegacy(text(row, "fla_status") ?? "N"),
    attendance: text(row, "fla_compareceu") ?? "",
    notes: text(row, "out_dados"),
    phone: text(row, "num_telefone"),
    ticketNumber: number(row, "num_senha"),
  };
}

export function mapLegacyHoliday(row: LegacyRow): Holiday {
  const value = date(row, "dat_feriado") ?? "";
  return { id: value, date: value, description: text(row, "des_feriado") ?? "" };
}

export function mapLegacyRecord(row: LegacyRow): ClinicalRecord {
  return {
    id: `${String(row.nro_paciente)}:${String(row.nro_atendente)}`,
    patientId: String(row.nro_paciente),
    professionalId: String(row.nro_atendente),
    recordNumber: number(row, "nro_ficha"),
    createdAt: date(row, "dat_cadastro"),
    observations: text(row, "des_obs"),
  };
}

export function mapLegacyCharacteristic(row: LegacyRow): Characteristic {
  return {
    professionalId: String(row.nro_atendente),
    id: number(row, "nro_caract") ?? 0,
    description: text(row, "des_caract") ?? "",
  };
}

export function mapLegacyCharacteristicAnswer(row: LegacyRow): CharacteristicAnswer {
  return {
    patientId: String(row.nro_paciente),
    professionalId: String(row.nro_atendente),
    id: number(row, "nro_seq_caract") ?? 0,
    characteristicId: number(row, "nro_caract"),
    information: text(row, "des_informacao"),
    answer: text(row, "des_resposta"),
  };
}
