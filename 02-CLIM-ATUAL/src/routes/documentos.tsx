import { createFileRoute } from "@tanstack/react-router";
import { FileBox, Upload } from "lucide-react";
import { PageHeader } from "../components/page-header";
import { EmptyState } from "../components/empty-state";
import { Button } from "../components/ui/button";
import { notifyInterfaceOnly } from "../components/interface-only-toast";

export const Route = createFileRoute("/documentos")({
  head: () => ({
    meta: [
      { title: "Documentos | CLIM" },
      { name: "description", content: "Documentos clínicos e administrativos da CLIM." },
      { property: "og:title", content: "Documentos | CLIM" },
      { property: "og:description", content: "Modelos, exames e documentos anexados aos prontuários." },
    ],
  }),
  component: Documentos,
});

function Documentos() {
  return (
    <div className="p-5 lg:p-6">
      <PageHeader
        eyebrow="Administração"
        title="Documentos"
        description="Modelos, exames e documentos anexados aos prontuários dos pacientes."
        actions={
          <Button onClick={notifyInterfaceOnly} className="bg-[#07553F] text-white hover:bg-[#0C6B50]">
            <Upload className="mr-2 h-4 w-4" /> Enviar documento
          </Button>
        }
      />
      <EmptyState
        icon={FileBox}
        title="Nenhum documento armazenado"
        description="Modelos de receitas, atestados e exames aparecerão aqui após a integração com o backend."
      />
    </div>
  );
}

