type PrefetchOptions = {
  queryKey: readonly unknown[];
  queryFn: () => Promise<unknown>;
  staleTime: number;
};

type QueryPrefetcher = {
  prefetchQuery: (options: PrefetchOptions) => Promise<unknown>;
};

type NavigationRepositories = {
  patients: {
    listPage: (input: { search: string; pageSize: number }) => Promise<unknown>;
  };
  professionals: { list: () => Promise<unknown> };
  healthPlans: { list: () => Promise<unknown> };
  clinics: { list: () => Promise<unknown> };
  appointments: { list: (filters: { date: string }) => Promise<unknown> };
  queue: { list: (date: string) => Promise<unknown> };
  holidays: { list: (year: string) => Promise<unknown> };
};

const MINUTE = 60 * 1000;

export async function warmNavigationData(
  queryClient: QueryPrefetcher,
  repositories: NavigationRepositories,
  now = new Date(),
): Promise<void> {
  const date = now.toISOString().slice(0, 10);
  const year = date.slice(0, 4);

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["patient-page", "", undefined, 50],
      queryFn: () => repositories.patients.listPage({ search: "", pageSize: 50 }),
      staleTime: 5 * MINUTE,
    }),
    queryClient.prefetchQuery({
      queryKey: ["professionals"],
      queryFn: repositories.professionals.list,
      staleTime: 5 * MINUTE,
    }),
    queryClient.prefetchQuery({
      queryKey: ["healthPlans"],
      queryFn: repositories.healthPlans.list,
      staleTime: 10 * MINUTE,
    }),
    queryClient.prefetchQuery({
      queryKey: ["clinics"],
      queryFn: repositories.clinics.list,
      staleTime: 60 * MINUTE,
    }),
    queryClient.prefetchQuery({
      queryKey: ["appointments", date],
      queryFn: () => repositories.appointments.list({ date }),
      staleTime: MINUTE,
    }),
    queryClient.prefetchQuery({
      queryKey: ["queue", date],
      queryFn: () => repositories.queue.list(date),
      staleTime: MINUTE,
    }),
    queryClient.prefetchQuery({
      queryKey: ["holidays", year],
      queryFn: () => repositories.holidays.list(year),
      staleTime: 10 * MINUTE,
    }),
  ]);
}
