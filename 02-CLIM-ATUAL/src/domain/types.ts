// Contratos da interface. Eles refletem as entidades existentes no SIGClin.

export type UUID = string;

export interface Clinic {
  id: UUID;
  name: string;
  street?: string;
  addressNumber?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zip?: string;
  logoUrl?: string;
}

export interface Professional {
  id: UUID;
  name: string;
  specialty: string;
  clinicId: UUID;
  crm?: string;
  cro?: string;
  councilNumber?: string;
  slotMinutes?: number;
  morningStart?: string;
  morningEnd?: string;
  afternoonStart?: string;
  afternoonEnd?: string;
}

export interface HealthPlan {
  id: UUID;
  name: string;
  document?: string;
  notes?: string;
}

export interface PatientAddress {
  street?: string;
  addressNumber?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface Patient {
  id: UUID;
  fullName: string;
  birthDate?: string;
  sex?: "F" | "M" | "O";
  document: string;
  phone?: string;
  mobile?: string;
  email?: string;
  profession?: string;
  address?: PatientAddress;
  healthPlans?: HealthPlan[];
}

export interface PatientPage {
  items: Patient[];
  nextCursor?: string;
}

export type AppointmentStatus = "normal" | "encaixe" | "desmarcado";

export interface Appointment {
  id: UUID;
  professionalId: UUID;
  professionalName?: string;
  patientId?: UUID;
  patientName: string;
  healthPlanName?: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  attendance: string;
  notes?: string;
  phone?: string;
  ticketNumber?: number;
}

export interface QueueEntry extends Appointment {
  position?: number;
}

export interface ClinicalRecord {
  id: UUID;
  patientId: UUID;
  professionalId: UUID;
  recordNumber?: number;
  createdAt?: string;
  observations?: string;
}

export interface Characteristic {
  professionalId: UUID;
  id: number;
  description: string;
}

export interface CharacteristicAnswer {
  patientId: UUID;
  professionalId: UUID;
  id: number;
  characteristicId?: number;
  information?: string;
  answer?: string;
}

export interface Holiday {
  id: string;
  date: string;
  description: string;
}

export interface AvailableDate {
  date: string;
  type?: string;
}
