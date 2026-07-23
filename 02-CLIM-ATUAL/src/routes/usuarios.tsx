import { createFileRoute } from "@tanstack/react-router";
import { Users, Plus } from "lucide-react";
import { PageHeader } from "../components/page-header";
import { EmptyState } from "../components/empty-state";
import { Button } from "../components/ui/button";
import { notifyInterfaceOnly } from "../components/interface-only-toast";

export const Route = createFileRoute("/usuarios")({
  head: () => ({
    meta: [
      { title: "Usuários | CLIM" },
      { name: "description", content: "Controle de acesso da equipe da CLIM." },
      { property: "og:title", content: "Usuários | CLIM" },
      { property: "og:description", content: "Perfis, permissões e histórico de acesso ao sistema." },
    ],
  }),
  component: Usuarios,
});

function Usuarios() {
  return (
    <div className="p-5 lg:p-6">
      <PageHeader
        eyebrow="Administração"
        title="Usuários"
        description="Perfis de acesso, permissões e auditoria de login."
        actions={
          <Button onClick={notifyInterfaceOnly} className="bg-[#07553F] text-white hover:bg-[#0C6B50]">
            <Plus className="mr-2 h-4 w-4" /> Novo usuário
          </Button>
        }
      />
      <EmptyState
        icon={Users}
        title="Nenhum usuário cadastrado"
        description="Recepção, profissionais e administradores serão gerenciados aqui após a integração com o backend."
      />
    </div>
  );
}

