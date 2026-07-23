import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, CalendarPlus, Clock3, Stethoscope, Users } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useAppointments, useProfessionals } from "../hooks/use-queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | CLIM" },
      { name: "description", content: "Painel operacional da CLIM." },
    ],
  }),
  component: Dashboard,
});

const statusLabel = { normal: "Normal", encaixe: "Encaixe", desmarcado: "Desmarcado" };

function Dashboard() {
  const today = format(new Date(), "yyyy-MM-dd");
  const readableDate = format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const { data: appointments = [], isLoading: loadingAppointments } = useAppointments(today);
  const { data: professionals = [] } = useProfessionals();
  const normal = appointments.filter((appointment) => appointment.status === "normal").length;
  const encaixe = appointments.filter((appointment) => appointment.status === "encaixe").length;
  const desmarcado = appointments.filter(
    (appointment) => appointment.status === "desmarcado",
  ).length;

  return (
    <div className="p-5 lg:p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#C7962D]">
            Operação da clínica
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-[#07553F]">Agenda de hoje</h1>
          <p className="mt-1 text-sm text-gray-500 first-letter:uppercase">{readableDate}</p>
        </div>
        <Button
          asChild
          className="h-9 rounded-lg bg-gradient-to-r from-[#C7962D] to-[#E5C878] text-xs font-bold text-white hover:opacity-90"
        >
          <Link to="/agenda">
            <CalendarPlus className="mr-1.5 h-3.5 w-3.5" />
            Nova consulta
          </Link>
        </Button>
      </div>
      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={CalendarDays} label="Consultas hoje" value={appointments.length} />
        <Metric icon={Clock3} label="Normais" value={normal} />
        <Metric icon={Stethoscope} label="Encaixes" value={encaixe} />
        <Metric icon={Clock3} label="Desmarcadas" value={desmarcado} />
      </div>
      <div className="grid gap-4">
        <section className="overflow-hidden rounded-xl border border-[#E6ECE8] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E6ECE8] px-5 py-4">
            <div>
              <h2 className="font-display text-xl font-bold text-[#07553F]">Agenda do dia</h2>
              <p className="text-xs text-gray-500">
                {professionals.length} profissional(is) cadastrado(s)
              </p>
            </div>
            <Link to="/agenda" className="text-xs font-bold text-[#C7962D] hover:underline">
              Ver agenda completa
            </Link>
          </div>
          {loadingAppointments ? (
            <p className="p-5 text-sm text-gray-500">Carregando agenda...</p>
          ) : appointments.length > 0 ? (
            <div>
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between gap-4 border-b border-[#F0F3F1] px-5 py-3 last:border-0"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <time className="rounded-md bg-[#F7F8F5] px-2 py-1 font-mono text-xs font-bold text-[#07553F]">
                      {appointment.time}
                    </time>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#202825]">
                        {appointment.patientName}
                      </p>
                      <p className="truncate text-xs text-gray-400">
                        {appointment.professionalName}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="shrink-0 text-[10px]">
                    {statusLabel[appointment.status]}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <EmptyAgenda />
          )}
        </section>
      </div>
      <section className="mt-4 rounded-xl border border-[#E6ECE8] bg-white p-5 shadow-sm">
        <h2 className="font-display text-xl font-bold text-[#07553F]">Acesso rápido</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickLink
            to="/pacientes"
            icon={Users}
            label="Pacientes"
            description="Cadastros existentes"
          />
          <QuickLink
            to="/profissionais"
            icon={Stethoscope}
            label="Profissionais"
            description="Equipe e horários"
          />
          <QuickLink
            to="/atendimentos"
            icon={Stethoscope}
            label="Atendimentos"
            description="Fichas e respostas"
          />
          <QuickLink
            to="/feriados"
            icon={CalendarDays}
            label="Feriados"
            description="Calendário da agenda"
          />
        </div>
      </section>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: number;
}) {
  return (
    <article className="flex items-center gap-3 rounded-xl border border-[#E6ECE8] bg-white p-4 shadow-sm">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F7F8F5] text-[#C7962D]">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-2xl font-bold text-[#202825]">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </article>
  );
}
function QuickLink({
  to,
  icon: Icon,
  label,
  description,
}: {
  to: string;
  icon: typeof CalendarDays;
  label: string;
  description: string;
}) {
  return (
    <Link
      to={to}
      className="group rounded-lg border border-[#E6ECE8] p-4 transition hover:border-[#C7962D]/50 hover:bg-[#F7F8F5]"
    >
      <Icon className="h-5 w-5 text-[#C7962D]" />
      <p className="mt-3 text-sm font-bold text-[#07553F]">{label}</p>
      <p className="mt-1 text-xs text-gray-500">{description}</p>
    </Link>
  );
}
function EmptyAgenda() {
  return (
    <div className="p-8 text-center">
      <CalendarDays className="mx-auto h-8 w-8 text-[#C7962D]" />
      <p className="mt-2 text-sm text-gray-500">Nenhuma consulta registrada para hoje.</p>
    </div>
  );
}
