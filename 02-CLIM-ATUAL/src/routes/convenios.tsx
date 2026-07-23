import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Plus } from "lucide-react";
import { PageHeader } from "../components/page-header";
import { EmptyState } from "../components/empty-state";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { toast } from "sonner";
import { useCreateHealthPlan, useHealthPlans } from "../hooks/use-queries";

export const Route = createFileRoute("/convenios")({
  head: () => ({
    meta: [
      { title: "Convênios | CLIM" },
      { name: "description", content: "Cadastro de convênios atendidos pela CLIM." },
    ],
  }),
  component: Convenios,
});

function ConvenioSheet() {
  const [open, setOpen] = useState(false);
  const createHealthPlan = useCreateHealthPlan();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await createHealthPlan.mutateAsync({
        name: String(form.get("name") ?? ""),
        document: String(form.get("document") ?? ""),
        notes: String(form.get("notes") ?? ""),
      });
      toast.success("Convênio cadastrado na CLIM.");
      event.currentTarget.reset();
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível cadastrar o convênio.",
      );
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="h-9 bg-gradient-to-r from-[#C7962D] to-[#E5C878] text-white hover:opacity-90 rounded-lg text-xs font-bold shadow-sm">
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Cadastrar convênio
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl text-[#07553F]">
            Cadastrar convênio
          </SheetTitle>
          <SheetDescription>Informe os dados do convênio atendido.</SheetDescription>
        </SheetHeader>
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" name="name" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="doc">Documento</Label>
            <Input id="doc" name="document" placeholder="CNPJ" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="obs">Observações</Label>
            <Textarea id="obs" name="notes" rows={3} />
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#07553F] text-white hover:bg-[#147A5B]"
              disabled={createHealthPlan.isPending}
            >
              {createHealthPlan.isPending ? "Salvando..." : "Salvar convênio"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function Convenios() {
  const { data: healthPlans = [], isLoading } = useHealthPlans();
  return (
    <div className="p-5 lg:p-6">
      <PageHeader
        eyebrow="Cadastros"
        title="Convênios"
        description="Convênios aceitos pela CLIM para vínculo com pacientes e consultas."
        actions={<ConvenioSheet />}
      />
      {isLoading ? (
        <p className="text-sm text-gray-500">Carregando convênios...</p>
      ) : healthPlans.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {healthPlans.map((healthPlan) => (
            <article
              key={healthPlan.id}
              className="rounded-xl border border-[#E6ECE8] bg-white p-4 shadow-sm"
            >
              <h2 className="font-display text-lg font-bold text-[#07553F]">{healthPlan.name}</h2>
              <p className="mt-2 text-xs text-gray-500">
                {healthPlan.document || "Sem documento informado"}
              </p>
              {healthPlan.notes && <p className="mt-2 text-xs text-gray-400">{healthPlan.notes}</p>}
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ShieldCheck}
          title="Nenhum convênio cadastrado"
          description="Cadastre convênios para associar aos atendimentos."
          action={<ConvenioSheet />}
        />
      )}
    </div>
  );
}
