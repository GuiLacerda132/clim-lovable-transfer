import { describe, expect, it } from "vitest";
import {
  createPreviewDatabase,
  previewDatabaseSeed,
} from "./demo-database";

describe("previewDatabaseSeed", () => {
  it("contains only internally consistent demonstration records", () => {
    const patientIds = new Set(previewDatabaseSeed.patients.map((patient) => patient.id));
    const professionalIds = new Set(
      previewDatabaseSeed.professionals.map((professional) => professional.id),
    );

    expect(previewDatabaseSeed.appointments.every((appointment) =>
      professionalIds.has(appointment.professionalId) &&
      (!appointment.patientId || patientIds.has(appointment.patientId)),
    )).toBe(true);
  });

  it("creates an independent in-memory database for each preview session", () => {
    const firstPreview = createPreviewDatabase();
    const secondPreview = createPreviewDatabase();

    firstPreview.patients[0].fullName = "Alteração somente local";

    expect(secondPreview.patients[0].fullName).toBe(
      previewDatabaseSeed.patients[0].fullName,
    );
  });
});
