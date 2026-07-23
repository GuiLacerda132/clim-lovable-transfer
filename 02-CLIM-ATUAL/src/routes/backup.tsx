import { createFileRoute } from "@tanstack/react-router";
import { History, DatabaseBackup } from "lucide-react";
import { PageHeader } from "../components/page-header";
import { EmptyState } from "../components/empty-state";
import { Button } from "../components/ui/button";
import { notifyInterfaceOnly } from "../components/interface-only-toast";

export const Route = createFileRoute("/backup")({
  head: () => ({
    meta: [
      { title: "Backup | CLIM" },
      { name: "description", content: "Rotinas de backup e restauração da base da CLIM." },
      { property: "og:title", content: "Backup | CLIM" },
      { property: "og:description", content: "Backups automáticos, exportações e restauração da base." },
    ],
  }),
  component: Backup,
});

function Backup() {
  const cards = [
    { titulo: "Backup automático", valor: "Diário — 02:00", descricao: "Executado automaticamente pela infraestrutura." },
    { titulo: "Último backup", valor: "—", descricao: "Aguardando integração com o backend." },
    { titulo: "Próximo backup", valor: "—", descricao: "Definido após a ativação da rotina." },
  ];

  return (
    <div className="p-5 lg:p-6">
      <PageHeader
        eyebrow="Administração"
        title="Backup"
        description="Rotinas de backup, exportações e restauração da base clínica."
        actions={
          <Button onClick={notifyInterfaceOnly} className="bg-[#07553F] text-white hover:bg-[#0C6B50]">
            <DatabaseBackup className="mr-2 h-4 w-4" /> Executar agora
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {cards.map((c) => (
          <div key={c.titulo} className="rounded-xl border border-[#E6ECE8] bg-white p-4 shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#C7962D]">{c.titulo}</div>
            <div className="mt-1 font-display text-xl font-bold text-[#07553F]">{c.valor}</div>
            <p className="mt-1 text-xs text-gray-500">{c.descricao}</p>
          </div>
        ))}
      </div>
      <EmptyState
        icon={History}
        title="Nenhum histórico de backup"
        description="O histórico de execuções e exportações aparecerá aqui assim que o backend estiver conectado."
      />
    </div>
  );
}

