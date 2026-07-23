import { z } from "zod";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => value || null);

export const numericIdSchema = z.coerce.number().int().positive();
export const dateSchema = z.iso.date();
export const patientPageInputSchema = z.object({
  search: z.string().trim().max(100).default(""),
  cursor: numericIdSchema.optional(),
  pageSize: z.coerce.number().int().min(1).max(50).default(50),
});
export const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Informe um horário válido.");

export const patientInputSchema = z.object({
  fullName: z.string().trim().min(1, "Informe o nome.").max(60),
  sex: z.enum(["F", "M", "O"]).nullable().optional(),
  birthDate: dateSchema.nullable().optional(),
  document: optionalText(20),
  phone: optionalText(15),
  mobile: optionalText(15),
  email: optionalText(50),
  profession: optionalText(50),
  street: optionalText(150),
  addressNumber: z.string().trim().max(10).optional().default(""),
  neighborhood: optionalText(20),
  zip: optionalText(10),
  city: optionalText(30),
  state: z
    .string()
    .trim()
    .toUpperCase()
    .max(2)
    .optional()
    .transform((value) => value || null),
});

export const clinicInputSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome da clínica.").max(60),
  street: optionalText(100),
  addressNumber: optionalText(10),
  neighborhood: optionalText(30),
  zip: z.coerce.number().int().min(0).max(99_999_999).nullable().optional(),
  city: optionalText(40),
  state: z
    .string()
    .trim()
    .toUpperCase()
    .max(2)
    .optional()
    .transform((value) => value || null),
  logoPath: optionalText(200),
});

export const professionalInputSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome.").max(40),
  specialty: z.string().trim().min(1, "Informe a especialidade.").max(20),
  clinicId: numericIdSchema,
  crm: optionalText(20),
  cro: optionalText(20),
  intervalMinutes: z.coerce.number().int().min(1).max(1439).nullable().optional(),
  morningStart: timeSchema.nullable().optional(),
  morningEnd: timeSchema.nullable().optional(),
  afternoonStart: timeSchema.nullable().optional(),
  afternoonEnd: timeSchema.nullable().optional(),
});

export const healthPlanInputSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do convênio.").max(40),
  document: optionalText(20),
  notes: optionalText(200),
});

export const appointmentInputSchema = z.object({
  professionalId: numericIdSchema,
  date: dateSchema,
  time: timeSchema,
  patientId: numericIdSchema.nullable().optional(),
  patientName: z.string().trim().min(1, "Informe o paciente.").max(60),
  healthPlanName: optionalText(30),
  notes: optionalText(100),
  attendance: z.string().trim().length(1).toUpperCase(),
  legacyStatus: z.enum(["N", "E", "D"]),
  phone: optionalText(15),
  ticketNumber: z.coerce.number().int().min(0).max(999).nullable().optional(),
});

export const appointmentAttendanceInputSchema = z.object({
  attendance: z.string().trim().length(1).toUpperCase(),
  legacyStatus: z.enum(["N", "E", "D"]),
});

export const appointmentUpdateInputSchema = z.object({
  patientId: numericIdSchema.nullable().optional(),
  patientName: z.string().trim().min(1, "Informe o paciente.").max(60),
  healthPlanName: optionalText(30),
  notes: optionalText(100),
  phone: optionalText(15),
  time: timeSchema,
  ticketNumber: z.coerce.number().int().min(0).max(999).nullable().optional(),
});

export const holidayInputSchema = z.object({
  date: dateSchema,
  description: z.string().trim().min(1, "Informe a descrição.").max(20),
});

export const recordInputSchema = z.object({
  patientId: numericIdSchema,
  professionalId: numericIdSchema,
  recordNumber: z.coerce.number().int().min(0).max(999_999).nullable().optional(),
  observations: optionalText(400),
  registrationDate: dateSchema.nullable().optional(),
});

export const characteristicInputSchema = z.object({
  professionalId: numericIdSchema,
  description: z.string().trim().min(1, "Informe a descrição.").max(200),
});

export const characteristicAnswerInputSchema = z.object({
  patientId: numericIdSchema,
  professionalId: numericIdSchema,
  characteristicId: z.coerce.number().int().positive().nullable().optional(),
  information: optionalText(100),
  answer: optionalText(250),
});

export type PatientInput = z.infer<typeof patientInputSchema>;
export type PatientPageInput = z.infer<typeof patientPageInputSchema>;
export type ClinicInput = z.infer<typeof clinicInputSchema>;
export type ProfessionalInput = z.infer<typeof professionalInputSchema>;
export type HealthPlanInput = z.infer<typeof healthPlanInputSchema>;
export type AppointmentInput = z.infer<typeof appointmentInputSchema>;
export type AppointmentAttendanceInput = z.infer<typeof appointmentAttendanceInputSchema>;
export type AppointmentUpdateInput = z.infer<typeof appointmentUpdateInputSchema>;
export type HolidayInput = z.infer<typeof holidayInputSchema>;
export type RecordInput = z.infer<typeof recordInputSchema>;
export type CharacteristicInput = z.infer<typeof characteristicInputSchema>;
export type CharacteristicAnswerInput = z.infer<typeof characteristicAnswerInputSchema>;

// Tipos recebidos pela interface antes dos transforms ("" ainda é texto).
// Os tipos acima são usados internamente, após a validação no servidor.
export type ClinicRequest = z.input<typeof clinicInputSchema>;
export type ProfessionalRequest = z.input<typeof professionalInputSchema>;
export type PatientRequest = z.input<typeof patientInputSchema>;
export type HealthPlanRequest = z.input<typeof healthPlanInputSchema>;
export type AppointmentRequest = z.input<typeof appointmentInputSchema>;
export type AppointmentAttendanceRequest = z.input<typeof appointmentAttendanceInputSchema>;
export type AppointmentUpdateRequest = z.input<typeof appointmentUpdateInputSchema>;
export type HolidayRequest = z.input<typeof holidayInputSchema>;
export type RecordRequest = z.input<typeof recordInputSchema>;
export type CharacteristicRequest = z.input<typeof characteristicInputSchema>;
export type CharacteristicAnswerRequest = z.input<typeof characteristicAnswerInputSchema>;
