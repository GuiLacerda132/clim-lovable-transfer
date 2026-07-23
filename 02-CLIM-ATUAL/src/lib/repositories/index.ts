// Cliente da ponte local SIGClin. As funções abaixo não guardam dados no
// navegador: cada chamada passa pelo servidor local e pelo banco existente.

import * as sigclin from "../sigclin.functions";
import type {
  AppointmentAttendanceRequest,
  AppointmentRequest,
  AppointmentUpdateRequest,
  CharacteristicAnswerRequest,
  CharacteristicRequest,
  ClinicRequest,
  HealthPlanRequest,
  HolidayRequest,
  PatientRequest,
  PatientPageInput,
  ProfessionalRequest,
  RecordRequest,
} from "../../server/sigclin-inputs";

const asId = (id: string) => Number(id);
const today = () => new Date().toISOString().slice(0, 10);

export const repositories = {
  clinics: {
    list: () => sigclin.getClinics(),
    create: (input: ClinicRequest) => sigclin.createClinic({ data: input }),
    update: (id: string, input: ClinicRequest) =>
      sigclin.updateClinic({ data: { id: asId(id), input } }),
    remove: (id: string) => sigclin.removeClinic({ data: { id: asId(id) } }),
  },
  professionals: {
    list: () => sigclin.getProfessionals(),
    create: (input: ProfessionalRequest) => sigclin.createProfessional({ data: input }),
    update: (id: string, input: ProfessionalRequest) =>
      sigclin.updateProfessional({ data: { id: asId(id), input } }),
    remove: (id: string) => sigclin.removeProfessional({ data: { id: asId(id) } }),
    addPatient: (patientId: string, professionalId: string) =>
      sigclin.addPatientToProfessional({
        data: { patientId: asId(patientId), professionalId: asId(professionalId) },
      }),
    removePatient: (patientId: string, professionalId: string) =>
      sigclin.removePatientFromProfessional({
        data: { patientId: asId(patientId), professionalId: asId(professionalId) },
      }),
  },
  patients: {
    listPage: (input: PatientPageInput) => sigclin.getPatients({ data: input }),
    getById: (id: string) => sigclin.getPatient({ data: { id: asId(id) } }),
    create: (input: PatientRequest) => sigclin.createPatient({ data: input }),
    update: (id: string, input: PatientRequest) =>
      sigclin.updatePatient({ data: { id: asId(id), input } }),
    remove: (id: string) => sigclin.removePatient({ data: { id: asId(id) } }),
    healthPlans: (patientId: string) =>
      sigclin.getPatientHealthPlans({ data: { patientId: asId(patientId) } }),
    addHealthPlan: (patientId: string, healthPlanId: string) =>
      sigclin.addHealthPlanToPatient({
        data: { patientId: asId(patientId), healthPlanId: asId(healthPlanId) },
      }),
    removeHealthPlan: (patientId: string, healthPlanId: string) =>
      sigclin.removeHealthPlanFromPatient({
        data: { patientId: asId(patientId), healthPlanId: asId(healthPlanId) },
      }),
  },
  healthPlans: {
    list: () => sigclin.getHealthPlans(),
    create: (input: HealthPlanRequest) => sigclin.createHealthPlan({ data: input }),
    update: (id: string, input: HealthPlanRequest) =>
      sigclin.updateHealthPlan({ data: { id: asId(id), input } }),
    remove: (id: string) => sigclin.removeHealthPlan({ data: { id: asId(id) } }),
  },
  appointments: {
    list: (filters: { date?: string; professionalId?: string } = {}) =>
      sigclin.getAppointments({
        data: {
          date: filters.date,
          professionalId: filters.professionalId ? asId(filters.professionalId) : undefined,
        },
      }),
    create: (input: AppointmentRequest) => sigclin.createAppointment({ data: input }),
    updateDetails: (id: string, input: AppointmentUpdateRequest) =>
      sigclin.updateAppointmentDetails({ data: { id: asId(id), input } }),
    updateAttendance: (id: string, input: AppointmentAttendanceRequest) =>
      sigclin.updateAppointmentAttendance({ data: { id: asId(id), input } }),
    remove: (id: string) => sigclin.removeAppointment({ data: { id: asId(id) } }),
    availableTimes: (professionalId: string, date: string) =>
      sigclin.getAvailableTimes({ data: { professionalId: asId(professionalId), date } }),
    availableDates: (professionalId: string) =>
      sigclin.getAvailableDates({ data: { professionalId: asId(professionalId) } }),
  },
  queue: {
    list: (date = today()) => sigclin.getQueue({ data: { date } }),
  },
  holidays: {
    list: (year?: string) => sigclin.getHolidays({ data: { year } }),
    create: (input: HolidayRequest) => sigclin.createHoliday({ data: input }),
    update: (previousDate: string, input: HolidayRequest) =>
      sigclin.updateHoliday({ data: { previousDate, input } }),
    remove: (date: string) => sigclin.removeHoliday({ data: { date } }),
    copy: (fromYear: string, toYear: string) =>
      sigclin.copyHolidays({ data: { fromYear, toYear } }),
  },
  clinicalRecords: {
    list: (filters: { patientId?: string; professionalId?: string } = {}) =>
      sigclin.getRecords({
        data: {
          patientId: filters.patientId ? asId(filters.patientId) : undefined,
          professionalId: filters.professionalId ? asId(filters.professionalId) : undefined,
        },
      }),
    create: (input: RecordRequest) => sigclin.createRecord({ data: input }),
    update: (patientId: string, professionalId: string, input: RecordRequest) =>
      sigclin.updateRecord({
        data: { patientId: asId(patientId), professionalId: asId(professionalId), input },
      }),
    remove: (patientId: string, professionalId: string) =>
      sigclin.removeRecord({
        data: { patientId: asId(patientId), professionalId: asId(professionalId) },
      }),
  },
  characteristics: {
    list: (professionalId: string) =>
      sigclin.getCharacteristics({ data: { professionalId: asId(professionalId) } }),
    create: (input: CharacteristicRequest) => sigclin.createCharacteristic({ data: input }),
    update: (professionalId: string, characteristicId: number, description: string) =>
      sigclin.updateCharacteristic({
        data: { professionalId: asId(professionalId), characteristicId, description },
      }),
    remove: (professionalId: string, characteristicId: number) =>
      sigclin.removeCharacteristic({
        data: { professionalId: asId(professionalId), characteristicId },
      }),
    answers: (patientId: string, professionalId: string) =>
      sigclin.getCharacteristicAnswers({
        data: { patientId: asId(patientId), professionalId: asId(professionalId) },
      }),
    createAnswer: (input: CharacteristicAnswerRequest) =>
      sigclin.createCharacteristicAnswer({ data: input }),
    updateAnswer: (
      patientId: string,
      professionalId: string,
      answerId: number,
      input: CharacteristicAnswerRequest,
    ) =>
      sigclin.updateCharacteristicAnswer({
        data: { patientId: asId(patientId), professionalId: asId(professionalId), answerId, input },
      }),
    removeAnswer: (patientId: string, professionalId: string, answerId: number) =>
      sigclin.removeCharacteristicAnswer({
        data: { patientId: asId(patientId), professionalId: asId(professionalId), answerId },
      }),
  },
};
