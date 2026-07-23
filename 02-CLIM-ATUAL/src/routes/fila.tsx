import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ListChecks, Ticket } from "lucide-react";
import { format } from "date-fns";
import { PageHeader } from "../components/page-header";
import { EmptyState } from "../components/empty-state";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useQueue } from "../hooks/use-queries";

export const Route = createFileRoute("/fila")({
  head: () => ({
    meta: [
      { title: "Fila de atendimento | CLIM" },
      { name: "description", content: "Fila e situação da agenda atual da CLIM." },
    ],
  }),
  component: Fila,
});

const statusLabel = { normal: "Normal", encaixe: "Encaixe", desmarcado: "Desmarcado" };

function Fila() {
  const date = format(new Date(), "yyyy-MM-dd");
  const { data: entries = [], isLoading } = useQueue(date);

  return (
    <div className="p-5 lg:p-6">
      <PageHeader
        eyebrow="Operação"
        title="Fila de atendimento"
        description="Consultas de hoje, na mesma ordem da agenda da CLIM."
        actions={
          <Button
            asChild
            className="h-9 rounded-lg bg-[#07553F] text-xs font-bold text-white hover:bg-[#147A5B]"
          >
            <Link to="/agenda">
              Ir para a Agenda <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        }
      />

      {isLoading ? (
        <p className="text-sm text-gray-500">Carregando fila...</p>
      ) : entries.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-[#E6ECE8] bg-white shadow-sm">
          <div className="grid grid-cols-[72px_100px_1fr_160px] gap-3 border-b border-[#E6ECE8] bg-[#F7F8F5] px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#07553F]">
            <span>Senha</span>
            <span>Horário</span>
            <span>Paciente</span>
            <span>Situação</span>
          </div>
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="grid grid-cols-[72px_100px_1fr_160px] items-center gap-3 border-b border-[#F0F3F1] px-4 py-3 last:border-0"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#07553F] text-xs font-bold text-white">
                {entry.ticketNumber ?? entry.position}
              </span>
              <span className="text-sm font-semibold text-[#202825]">{entry.time}</span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#202825]">{entry.patientName}</p>
                <p className="truncate text-xs text-gray-400">{entry.professionalName}</p>
              </div>
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary" className="text-[10px]">
                  {statusLabel[entry.status]}
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  Compareceu: {entry.attendance || "—"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ListChecks}
          title="Nenhuma senha na agenda de hoje"
          description="As consultas do dia aparecem aqui conforme forem registradas na agenda."
          action={
            <Button
              asChild
              className="h-9 rounded-lg bg-gradient-to-r from-[#C7962D] to-[#E5C878] text-xs font-bold text-white hover:opacity-90"
            >
              <Link to="/agenda">
                <Ticket className="mr-1.5 h-3.5 w-3.5" />
                Abrir Agenda
              </Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
