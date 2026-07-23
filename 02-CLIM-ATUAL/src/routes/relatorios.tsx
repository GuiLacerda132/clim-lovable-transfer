import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { PageHeader } from "../components/page-header";
import { EmptyState } from "../components/empty-state";

export const Route = createFileRoute("/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios | CLIM" },
      { name: "description", content: "Relatórios operacionais da CLIM - Clínica Integrada Matonense." },
      { property: "og:title", content: "Relatórios | CLIM" },
      { property: "og:description", content: "Indicadores de agenda, atendimentos e faturamento." },
    ],
  }),
  component: Relatorios,
});

function Relatorios() {
  const grupos = [
    { titulo: "Agenda", descricao: "Ocupação, cancelamentos e horários ociosos." },
    { titulo: "Atendimentos", descricao: "Volume por profissional, especialidade e convênio." },
    { titulo: "Financeiro", descricao: "Faturamento, glosas e repasses." },
    { titulo: "Pacientes", descricao: "Novos cadastros, retornos e frequência." },
  ];

  return (
    <div className="p-5 lg:p-6">
      <PageHeader
        eyebrow="Administração"
        title="Relatórios"
        description="Indicadores operacionais e gerenciais da clínica."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
        {grupos.map((g) => (
          <div key={g.titulo} className="rounded-xl border border-[#E6ECE8] bg-white p-4 shadow-sm">
            <div className="font-display text-lg font-bold text-[#07553F]">{g.titulo}</div>
            <p className="mt-1 text-xs text-gray-500">{g.descricao}</p>
          </div>
        ))}
      </div>
      <EmptyState
        icon={FileText}
        title="Nenhum relatório disponível"
        description="Os relatórios serão gerados automaticamente assim que houver dados registrados no sistema."
      />
    </div>
  );
}

