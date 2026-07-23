import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, Plus } from "lucide-react";
import { PageHeader } from "../components/page-header";
import { EmptyState } from "../components/empty-state";
import { Button } from "../components/ui/button";
import { notifyInterfaceOnly } from "../components/interface-only-toast";

export const Route = createFileRoute("/financeiro")({
  head: () => ({
    meta: [
      { title: "Financeiro | CLIM" },
      { name: "description", content: "Controle financeiro da CLIM - Clínica Integrada Matonense." },
      { property: "og:title", content: "Financeiro | CLIM" },
      { property: "og:description", content: "Contas a receber, repasses e faturamento por convênio." },
    ],
  }),
  component: Financeiro,
});

function Financeiro() {
  return (
    <div className="p-5 lg:p-6">
      <PageHeader
        eyebrow="Administração"
        title="Financeiro"
        description="Contas a receber, repasses aos profissionais e faturamento por convênio."
        actions={
          <Button onClick={notifyInterfaceOnly} className="bg-[#07553F] text-white hover:bg-[#0C6B50]">
            <Plus className="mr-2 h-4 w-4" /> Novo lançamento
          </Button>
        }
      />
      <EmptyState
        icon={CreditCard}
        title="Nenhum lançamento registrado"
        description="Os lançamentos financeiros aparecerão aqui assim que a integração com o backend estiver disponível."
      />
    </div>
  );
}

