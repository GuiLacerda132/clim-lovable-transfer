import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { repositories } from "../lib/repositories";
import type { PatientPageInput } from "../server/sigclin-inputs";

export function usePatientPage(input: PatientPageInput) {
  const search = input.search ?? "";
  const cursor = input.cursor;
  const pageSize = input.pageSize ?? 50;

  return useQuery({
    queryKey: ["patient-page", search, cursor, pageSize],
    queryFn: () => repositories.patients.listPage({ search, cursor, pageSize }),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}

export function usePatient(patientId?: string) {
  return useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => repositories.patients.getById(patientId!),
    enabled: Boolean(patientId),
    staleTime: 1000 * 60 * 5,
  });
}

export function usePatientHealthPlans(patientId?: string) {
  return useQuery({
    queryKey: ["patient-health-plans", patientId],
    queryFn: () => repositories.patients.healthPlans(patientId!),
    enabled: Boolean(patientId),
    staleTime: 1000 * 60 * 5,
  });
}

export function useProfessionals() {
  return useQuery({
    queryKey: ["professionals"],
    queryFn: () => repositories.professionals.list(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useAppointments(date?: string) {
  return useQuery({
    queryKey: ["appointments", date],
    queryFn: () => repositories.appointments.list({ date }),
    staleTime: 1000 * 60,
  });
}

export function useQueue(date?: string) {
  return useQuery({
    queryKey: ["queue", date],
    queryFn: () => repositories.queue.list(date),
    staleTime: 1000 * 60,
  });
}

export function useHealthPlans() {
  return useQuery({
    queryKey: ["healthPlans"],
    queryFn: () => repositories.healthPlans.list(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useClinics() {
  return useQuery({
    queryKey: ["clinics"],
    queryFn: () => repositories.clinics.list(),
    staleTime: 1000 * 60 * 60,
  });
}

export function useClinicData() {
  return useQuery({
    queryKey: ["clinic"],
    queryFn: async () => {
      const list = await repositories.clinics.list();
      return list[0] || null;
    },
    staleTime: 1000 * 60 * 60,
  });
}

export function useAvailableTimes(professionalId?: string, date?: string) {
  return useQuery({
    queryKey: ["available-times", professionalId, date],
    queryFn: () => repositories.appointments.availableTimes(professionalId!, date!),
    enabled: Boolean(professionalId && date),
    staleTime: 1000 * 30,
  });
}

export function useHolidays(year?: string) {
  return useQuery({
    queryKey: ["holidays", year],
    queryFn: () => repositories.holidays.list(year),
    staleTime: 1000 * 60 * 10,
  });
}

export function useClinicalRecords(patientId?: string, professionalId?: string) {
  return useQuery({
    queryKey: ["clinical-records", patientId, professionalId],
    queryFn: () => repositories.clinicalRecords.list({ patientId, professionalId }),
    enabled: Boolean(patientId && professionalId),
    staleTime: 1000 * 60,
  });
}

export function useCharacteristics(professionalId?: string) {
  return useQuery({
    queryKey: ["characteristics", professionalId],
    queryFn: () => repositories.characteristics.list(professionalId!),
    enabled: Boolean(professionalId),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCharacteristicAnswers(patientId?: string, professionalId?: string) {
  return useQuery({
    queryKey: ["characteristic-answers", patientId, professionalId],
    queryFn: () => repositories.characteristics.answers(patientId!, professionalId!),
    enabled: Boolean(patientId && professionalId),
    staleTime: 1000 * 60,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: repositories.patients.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["patient-page"] }),
  });
}

export function useCreateProfessional() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: repositories.professionals.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["professionals"] }),
  });
}

export function useCreateHealthPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: repositories.healthPlans.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["healthPlans"] }),
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: repositories.appointments.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["appointments"] });
      void queryClient.invalidateQueries({ queryKey: ["queue"] });
    },
  });
}

export function useCreateHoliday() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: repositories.holidays.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["holidays"] }),
  });
}
