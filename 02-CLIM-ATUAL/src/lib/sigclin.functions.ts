import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { assertLocalDatabaseRequest } from "../server/sigclin-access.server";
import { pingDatabase } from "../server/sigclin-db.server";
import {
  appointmentAttendanceInputSchema,
  appointmentInputSchema,
  appointmentUpdateInputSchema,
  characteristicAnswerInputSchema,
  characteristicInputSchema,
  clinicInputSchema,
  dateSchema,
  healthPlanInputSchema,
  holidayInputSchema,
  numericIdSchema,
  patientInputSchema,
  patientPageInputSchema,
  professionalInputSchema,
  recordInputSchema,
} from "../server/sigclin-inputs";
import { legacyRepository } from "../server/sigclin-repository.server";

const idInputSchema = z.object({ id: numericIdSchema });
const appointmentFiltersSchema = z.object({
  date: dateSchema.optional(),
  professionalId: numericIdSchema.optional(),
});
const patientHealthPlanKeySchema = z.object({
  patientId: numericIdSchema,
  healthPlanId: numericIdSchema,
});
const patientProfessionalKeySchema = z.object({
  patientId: numericIdSchema,
  professionalId: numericIdSchema,
});
const recordKeySchema = z.object({
  patientId: numericIdSchema,
  professionalId: numericIdSchema,
});
const characteristicKeySchema = z.object({
  professionalId: numericIdSchema,
  characteristicId: numericIdSchema,
});
const characteristicUpdateSchema = characteristicKeySchema.extend({
  description: z.string().trim().min(1).max(200),
});
const characteristicAnswerKeySchema = z.object({
  patientId: numericIdSchema,
  professionalId: numericIdSchema,
  answerId: numericIdSchema,
});

function prepareDatabaseCall(): void {
  assertLocalDatabaseRequest();
}

export const checkSigclinConnection = createServerFn({ method: "GET" }).handler(async () => {
  prepareDatabaseCall();
  await pingDatabase();
  return { connected: true };
});

export const getClinics = createServerFn({ method: "GET" }).handler(async () => {
  prepareDatabaseCall();
  return legacyRepository.listClinics();
});

export const createClinic = createServerFn({ method: "POST" })
  .validator(clinicInputSchema)
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    return legacyRepository.createClinic(data);
  });

export const updateClinic = createServerFn({ method: "POST" })
  .validator(z.object({ id: numericIdSchema, input: clinicInputSchema }))
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    return legacyRepository.updateClinic(data.id, data.input);
  });

export const removeClinic = createServerFn({ method: "POST" })
  .validator(idInputSchema)
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    await legacyRepository.removeClinic(data.id);
  });

export const getProfessionals = createServerFn({ method: "GET" }).handler(async () => {
  prepareDatabaseCall();
  return legacyRepository.listProfessionals();
});

export const createProfessional = createServerFn({ method: "POST" })
  .validator(professionalInputSchema)
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    return legacyRepository.createProfessional(data);
  });

export const updateProfessional = createServerFn({ method: "POST" })
  .validator(z.object({ id: numericIdSchema, input: professionalInputSchema }))
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    return legacyRepository.updateProfessional(data.id, data.input);
  });

export const removeProfessional = createServerFn({ method: "POST" })
  .validator(idInputSchema)
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    await legacyRepository.removeProfessional(data.id);
  });

export const getPatients = createServerFn({ method: "GET" })
  .validator(patientPageInputSchema)
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    return legacyRepository.listPatientPage(data);
  });

export const getPatient = createServerFn({ method: "GET" })
  .validator(idInputSchema)
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    return legacyRepository.getPatient(data.id);
  });

export const createPatient = createServerFn({ method: "POST" })
  .validator(patientInputSchema)
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    return legacyRepository.createPatient(data);
  });

export const updatePatient = createServerFn({ method: "POST" })
  .validator(z.object({ id: numericIdSchema, input: patientInputSchema }))
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    return legacyRepository.updatePatient(data.id, data.input);
  });

export const removePatient = createServerFn({ method: "POST" })
  .validator(idInputSchema)
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    await legacyRepository.removePatient(data.id);
  });

export const getHealthPlans = createServerFn({ method: "GET" }).handler(async () => {
  prepareDatabaseCall();
  return legacyRepository.listHealthPlans();
});

export const getPatientHealthPlans = createServerFn({ method: "GET" })
  .validator(z.object({ patientId: numericIdSchema }))
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    return legacyRepository.listPatientHealthPlans(data.patientId);
  });

export const createHealthPlan = createServerFn({ method: "POST" })
  .validator(healthPlanInputSchema)
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    return legacyRepository.createHealthPlan(data);
  });

export const updateHealthPlan = createServerFn({ method: "POST" })
  .validator(z.object({ id: numericIdSchema, input: healthPlanInputSchema }))
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    return legacyRepository.updateHealthPlan(data.id, data.input);
  });

export const removeHealthPlan = createServerFn({ method: "POST" })
  .validator(idInputSchema)
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    await legacyRepository.removeHealthPlan(data.id);
  });

export const addHealthPlanToPatient = createServerFn({ method: "POST" })
  .validator(patientHealthPlanKeySchema)
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    await legacyRepository.assignHealthPlanToPatient(data.patientId, data.healthPlanId);
  });

export const removeHealthPlanFromPatient = createServerFn({ method: "POST" })
  .validator(patientHealthPlanKeySchema)
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    await legacyRepository.removeHealthPlanFromPatient(data.patientId, data.healthPlanId);
  });

export const addPatientToProfessional = createServerFn({ method: "POST" })
  .validator(patientProfessionalKeySchema)
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    await legacyRepository.assignPatientToProfessional(data.patientId, data.professionalId);
  });

export const removePatientFromProfessional = createServerFn({ method: "POST" })
  .validator(patientProfessionalKeySchema)
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    await legacyRepository.removePatientFromProfessional(data.patientId, data.professionalId);
  });

export const getAppointments = createServerFn({ method: "GET" })
  .validator(appointmentFiltersSchema)
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    return legacyRepository.listAppointments(data);
  });

export const createAppointment = createServerFn({ method: "POST" })
  .validator(appointmentInputSchema)
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    return legacyRepository.createAppointment(data);
  });

export const updateAppointmentDetails = createServerFn({ method: "POST" })
  .validator(z.object({ id: numericIdSchema, input: appointmentUpdateInputSchema }))
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    return legacyRepository.updateAppointmentDetails(data.id, data.input);
  });

export const updateAppointmentAttendance = createServerFn({ method: "POST" })
  .validator(z.object({ id: numericIdSchema, input: appointmentAttendanceInputSchema }))
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    return legacyRepository.updateAppointmentAttendance(data.id, data.input);
  });

export const removeAppointment = createServerFn({ method: "POST" })
  .validator(idInputSchema)
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    await legacyRepository.removeAppointment(data.id);
  });

export const getQueue = createServerFn({ method: "GET" })
  .validator(z.object({ date: dateSchema }))
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    return legacyRepository.listQueue(data.date);
  });

export const getAvailableTimes = createServerFn({ method: "GET" })
  .validator(z.object({ professionalId: numericIdSchema, date: dateSchema }))
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    return legacyRepository.listAvailableTimes(data.professionalId, data.date);
  });

export const getAvailableDates = createServerFn({ method: "GET" })
  .validator(z.object({ professionalId: numericIdSchema }))
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    return legacyRepository.listAvailableDates(data.professionalId);
  });

export const getHolidays = createServerFn({ method: "GET" })
  .validator(
    z.object({
      year: z
        .string()
        .regex(/^\d{4}$/)
        .optional(),
    }),
  )
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    return legacyRepository.listHolidays(data.year);
  });

export const createHoliday = createServerFn({ method: "POST" })
  .validator(holidayInputSchema)
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    return legacyRepository.createHoliday(data);
  });

export const updateHoliday = createServerFn({ method: "POST" })
  .validator(z.object({ previousDate: dateSchema, input: holidayInputSchema }))
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    return legacyRepository.updateHoliday(data.previousDate, data.input);
  });

export const removeHoliday = createServerFn({ method: "POST" })
  .validator(z.object({ date: dateSchema }))
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    await legacyRepository.removeHoliday(data.date);
  });

export const copyHolidays = createServerFn({ method: "POST" })
  .validator(
    z.object({ fromYear: z.string().regex(/^\d{4}$/), toYear: z.string().regex(/^\d{4}$/) }),
  )
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    return legacyRepository.copyHolidays(data.fromYear, data.toYear);
  });

export const getRecords = createServerFn({ method: "GET" })
  .validator(
    z.object({ patientId: numericIdSchema.optional(), professionalId: numericIdSchema.optional() }),
  )
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    return legacyRepository.listRecords(data.patientId, data.professionalId);
  });

export const createRecord = createServerFn({ method: "POST" })
  .validator(recordInputSchema)
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    return legacyRepository.createRecord(data);
  });

export const updateRecord = createServerFn({ method: "POST" })
  .validator(
    z.object({
      patientId: numericIdSchema,
      professionalId: numericIdSchema,
      input: recordInputSchema,
    }),
  )
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    return legacyRepository.updateRecord(data.patientId, data.professionalId, data.input);
  });

export const removeRecord = createServerFn({ method: "POST" })
  .validator(recordKeySchema)
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    await legacyRepository.removeRecord(data.patientId, data.professionalId);
  });

export const getCharacteristics = createServerFn({ method: "GET" })
  .validator(z.object({ professionalId: numericIdSchema }))
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    return legacyRepository.listCharacteristics(data.professionalId);
  });

export const createCharacteristic = createServerFn({ method: "POST" })
  .validator(characteristicInputSchema)
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    return legacyRepository.createCharacteristic(data);
  });

export const updateCharacteristic = createServerFn({ method: "POST" })
  .validator(characteristicUpdateSchema)
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    return legacyRepository.updateCharacteristic(
      data.professionalId,
      data.characteristicId,
      data.description,
    );
  });

export const removeCharacteristic = createServerFn({ method: "POST" })
  .validator(characteristicKeySchema)
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    await legacyRepository.removeCharacteristic(data.professionalId, data.characteristicId);
  });

export const getCharacteristicAnswers = createServerFn({ method: "GET" })
  .validator(recordKeySchema)
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    return legacyRepository.listCharacteristicAnswers(data.patientId, data.professionalId);
  });

export const createCharacteristicAnswer = createServerFn({ method: "POST" })
  .validator(characteristicAnswerInputSchema)
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    return legacyRepository.createCharacteristicAnswer(data);
  });

export const updateCharacteristicAnswer = createServerFn({ method: "POST" })
  .validator(
    z.object({
      patientId: numericIdSchema,
      professionalId: numericIdSchema,
      answerId: numericIdSchema,
      input: characteristicAnswerInputSchema,
    }),
  )
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    return legacyRepository.updateCharacteristicAnswer(
      data.patientId,
      data.professionalId,
      data.answerId,
      data.input,
    );
  });

export const removeCharacteristicAnswer = createServerFn({ method: "POST" })
  .validator(characteristicAnswerKeySchema)
  .handler(async ({ data }) => {
    prepareDatabaseCall();
    await legacyRepository.removeCharacteristicAnswer(
      data.patientId,
      data.professionalId,
      data.answerId,
    );
  });
