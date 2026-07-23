import { describe, expect, it, vi } from "vitest";
import { warmNavigationData } from "./navigation-warmup";

describe("warmNavigationData", () => {
  it("preloads the existing data needed by the visible navigation", async () => {
    const prefetchQuery = vi.fn(async ({ queryFn }: { queryFn: () => Promise<unknown> }) =>
      queryFn(),
    );
    const repositories = {
      patients: { listPage: vi.fn(async () => ({ items: [], nextCursor: undefined })) },
      professionals: { list: vi.fn(async () => []) },
      healthPlans: { list: vi.fn(async () => []) },
      clinics: { list: vi.fn(async () => []) },
      appointments: { list: vi.fn(async () => []) },
      queue: { list: vi.fn(async () => []) },
      holidays: { list: vi.fn(async () => []) },
    };

    await warmNavigationData({ prefetchQuery }, repositories, new Date("2026-05-15T12:00:00.000Z"));

    expect(prefetchQuery.mock.calls.map(([options]) => options.queryKey)).toEqual([
      ["patient-page", "", undefined, 50],
      ["professionals"],
      ["healthPlans"],
      ["clinics"],
      ["appointments", "2026-05-15"],
      ["queue", "2026-05-15"],
      ["holidays", "2026"],
    ]);
  });
});
