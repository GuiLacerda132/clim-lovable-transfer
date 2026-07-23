import { createFileRoute } from "@tanstack/react-router";
import { CheckSquare, Plus } from "lucide-react";
import { PageHeader } from "../components/page-header";
import { EmptyState } from "../components/empty-state";
import { Button } from "../components/ui/button";
import { notifyInterfaceOnly } from "../components/interface-only-toast";

export const Route = createFileRoute("/tarefas")({
  head: () => ({
    meta: [
      { title: "Tarefas | CLIM" },
      { name: "description", content: "Tarefas internas da equipe da CLIM." },
      { property: "og:title", content: "Tarefas | CLIM" },
      { property: "og:description", content: "Acompanhe pendências administrativas e clínicas da equipe." },
    ],
  }),
  component: Tarefas,
});

function Tarefas() {
  return (
    <div className="p-5 lg:p-6">
      <PageHeader
        eyebrow="Operação"
        title="Tarefas"
        description="Pendências administrativas e clínicas da equipe."
        actions={
          <Button onClick={notifyInterfaceOnly} className="bg-[#07553F] text-white hover:bg-[#0C6B50]">
            <Plus className="mr-2 h-4 w-4" /> Nova tarefa
          </Button>
        }
      />
      <EmptyState
        icon={CheckSquare}
        title="Nenhuma tarefa cadastrada"
        description="Crie tarefas para organizar retornos, ligações e demandas internas. A persistência será habilitada após a integração."
      />
    </div>
  );
}

