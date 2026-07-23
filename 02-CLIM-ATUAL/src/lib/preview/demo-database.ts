import type {
  Appointment,
  Characteristic,
  CharacteristicAnswer,
  Clinic,
  ClinicalRecord,
  HealthPlan,
  Holiday,
  Patient,
  Professional,
} from "@/domain/types";

/**
 * Dados 100% inventados para o Preview da Lovable.
 * Não importar esta base no modo Electron/local da clínica.
 */
export interface PreviewDatabase {
  clinics: Clinic[];
  professionals: Professional[];
  healthPlans: HealthPlan[];
  patients: Patient[];
  appointments: Appointment[];
  clinicalRecords: ClinicalRecord[];
  characteristics: Characteristic[];
  characteristicAnswers: CharacteristicAnswer[];
  holidays: Holiday[];
}

const clinicId = "demo-clinic-001";
const professionalIds = {
  aurora: "demo-professional-aurora",
  horizonte: "demo-professional-horizonte",
  jardim: "demo-professional-jardim",
} as const;

const planEssencial: HealthPlan = {
  id: "demo-plan-essencial",
  name: "Plano Demonstração Essencial",
  document: "DEMO-PLAN-001",
  notes: "Convênio fictício para ambiente de prévia.",
};

const planIntegral: HealthPlan = {
  id: "demo-plan-integral",
  name: "Plano Demonstração Integral",
  document: "DEMO-PLAN-002",
  notes: "Convênio fictício para ambiente de prévia.",
};

const patients: Patient[] = [
  {
    id: "demo-patient-aurora",
    fullName: "Paciente Demonstração Aurora",
    birthDate: "1987-03-12",
    sex: "F",
    document: "DEMO-PAC-001",
    phone: "(00) 0000-0001",
    mobile: "(00) 90000-0001",
    email: "aurora@exemplo.invalid",
    profession: "Profissão demonstrativa",
    address: {
      street: "Rua Exemplo",
      addressNumber: "100",
      neighborhood: "Bairro Modelo",
      city: "Cidade Demonstração",
      state: "SP",
      zip: "00000-001",
    },
    healthPlans: [planEssencial],
  },
  {
    id: "demo-patient-brisa",
    fullName: "Paciente Demonstração Brisa",
    birthDate: "1992-08-21",
    sex: "F",
    document: "DEMO-PAC-002",
    phone: "(00) 0000-0002",
    mobile: "(00) 90000-0002",
    email: "brisa@exemplo.invalid",
    profession: "Profissão demonstrativa",
    address: {
      street: "Avenida Exemplo",
      addressNumber: "200",
      neighborhood: "Bairro Modelo",
      city: "Cidade Demonstração",
      state: "SP",
      zip: "00000-002",
    },
    healthPlans: [planIntegral],
  },
  {
    id: "demo-patient-cobalto",
    fullName: "Paciente Demonstração Cobalto",
    birthDate: "1978-11-03",
    sex: "M",
    document: "DEMO-PAC-003",
    phone: "(00) 0000-0003",
    mobile: "(00) 90000-0003",
    email: "cobalto@exemplo.invalid",
    profession: "Profissão demonstrativa",
    address: {
      street: "Travessa Exemplo",
      addressNumber: "300",
      neighborhood: "Bairro Modelo",
      city: "Cidade Demonstração",
      state: "SP",
      zip: "00000-003",
    },
    healthPlans: [planEssencial, planIntegral],
  },
  {
    id: "demo-patient-duna",
    fullName: "Paciente Demonstração Duna",
    birthDate: "2000-05-17",
    sex: "O",
    document: "DEMO-PAC-004",
    phone: "(00) 0000-0004",
    mobile: "(00) 90000-0004",
    email: "duna@exemplo.invalid",
    profession: "Profissão demonstrativa",
    address: {
      street: "Alameda Exemplo",
      addressNumber: "400",
      neighborhood: "Bairro Modelo",
      city: "Cidade Demonstração",
      state: "SP",
      zip: "00000-004",
    },
    healthPlans: [],
  },
];

export const previewDatabaseSeed: PreviewDatabase = {
  clinics: [
    {
      id: clinicId,
      name: "CLIM — Unidade Demonstração",
      street: "Rua Exemplo",
      addressNumber: "1",
      neighborhood: "Bairro Modelo",
      city: "Cidade Demonstração",
      state: "SP",
      zip: "00000-000",
    },
  ],
  professionals: [
    {
      id: professionalIds.aurora,
      name: "Profissional Demonstração Aurora",
      specialty: "Especialidade Demonstração A",
      clinicId,
      crm: "DEMO-CRM-001",
      slotMinutes: 30,
      morningStart: "08:00",
      morningEnd: "12:00",
      afternoonStart: "13:30",
      afternoonEnd: "17:30",
    },
    {
      id: professionalIds.horizonte,
      name: "Profissional Demonstração Horizonte",
      specialty: "Especialidade Demonstração B",
      clinicId,
      cro: "DEMO-CRO-002",
      slotMinutes: 30,
      morningStart: "08:00",
      morningEnd: "12:00",
      afternoonStart: "13:30",
      afternoonEnd: "17:30",
    },
    {
      id: professionalIds.jardim,
      name: "Profissional Demonstração Jardim",
      specialty: "Especialidade Demonstração C",
      clinicId,
      slotMinutes: 20,
      morningStart: "09:00",
      morningEnd: "12:00",
      afternoonStart: "14:00",
      afternoonEnd: "18:00",
    },
  ],
  healthPlans: [planEssencial, planIntegral],
  patients,
  appointments: [
    {
      id: "demo-appointment-001",
      professionalId: professionalIds.aurora,
      professionalName: "Profissional Demonstração Aurora",
      patientId: patients[0].id,
      patientName: patients[0].fullName,
      healthPlanName: planEssencial.name,
      date: "2026-07-22",
      time: "08:00",
      status: "normal",
      attendance: "aguardando",
      phone: patients[0].phone,
      ticketNumber: 1,
      notes: "Registro fictício para prévia visual.",
    },
    {
      id: "demo-appointment-002",
      professionalId: professionalIds.horizonte,
      professionalName: "Profissional Demonstração Horizonte",
      patientId: patients[1].id,
      patientName: patients[1].fullName,
      healthPlanName: planIntegral.name,
      date: "2026-07-22",
      time: "08:30",
      status: "encaixe",
      attendance: "em atendimento",
      phone: patients[1].phone,
      ticketNumber: 2,
      notes: "Registro fictício para prévia visual.",
    },
    {
      id: "demo-appointment-003",
      professionalId: professionalIds.jardim,
      professionalName: "Profissional Demonstração Jardim",
      patientId: patients[2].id,
      patientName: patients[2].fullName,
      healthPlanName: planEssencial.name,
      date: "2026-07-23",
      time: "09:00",
      status: "desmarcado",
      attendance: "não compareceu",
      phone: patients[2].phone,
      notes: "Registro fictício para prévia visual.",
    },
  ],
  clinicalRecords: [
    {
      id: "demo-record-001",
      patientId: patients[0].id,
      professionalId: professionalIds.aurora,
      recordNumber: 1,
      createdAt: "2026-01-10",
      observations: "Observação fictícia do ambiente demonstrativo.",
    },
  ],
  characteristics: [
    {
      professionalId: professionalIds.aurora,
      id: 1,
      description: "Alergia conhecida",
    },
    {
      professionalId: professionalIds.aurora,
      id: 2,
      description: "Uso de medicamento",
    },
    {
      professionalId: professionalIds.horizonte,
      id: 1,
      description: "Observação clínica inicial",
    },
  ],
  characteristicAnswers: [
    {
      patientId: patients[0].id,
      professionalId: professionalIds.aurora,
      id: 1,
      characteristicId: 1,
      information: "Alergia conhecida",
      answer: "Nenhuma informação clínica real — dado demonstrativo.",
    },
    {
      patientId: patients[0].id,
      professionalId: professionalIds.aurora,
      id: 2,
      characteristicId: 2,
      information: "Uso de medicamento",
      answer: "Nenhuma informação clínica real — dado demonstrativo.",
    },
  ],
  holidays: [
    {
      id: "demo-holiday-001",
      date: "2026-01-01",
      description: "Feriado demonstrativo",
    },
    {
      id: "demo-holiday-002",
      date: "2026-12-31",
      description: "Fechamento demonstrativo",
    },
  ],
};

/** Cria uma cópia mutável, segura para uma sessão de prévia no navegador. */
export function createPreviewDatabase(): PreviewDatabase {
  return structuredClone(previewDatabaseSeed);
}
