import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { UserCog, Plus, Clock, IdCard } from "lucide-react";
import { PageHeader } from "../components/page-header";
import { EmptyState } from "../components/empty-state";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { toast } from "sonner";
import { useClinics, useCreateProfessional, useProfessionals } from "../hooks/use-queries";
import { Skeleton } from "../components/ui/skeleton";

export const Route = createFileRoute("/profissionais")({
  head: () => ({
    meta: [
      { title: "Profissionais | CLIM" },
      {
        name: "description",
        content: "Cadastro de profissionais da CLIM com especialidade, conselho e agenda.",
      },
    ],
  }),
  component: Profissionais,
});

function ProfissionalSheet() {
  const [open, setOpen] = useState(false);
  const [clinicId, setClinicId] = useState("");
  const { data: clinics = [] } = useClinics();
  const createProfessional = useCreateProfessional();
  const canCreate = clinics.length > 0;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const optionalTime = (name: string) => String(form.get(name) ?? "") || null;
    const intervalMinutes = String(form.get("intervalMinutes") ?? "");

    try {
      await createProfessional.mutateAsync({
        name: String(form.get("name") ?? ""),
        specialty: String(form.get("specialty") ?? ""),
        clinicId,
        crm: String(form.get("crm") ?? ""),
        cro: String(form.get("cro") ?? ""),
        intervalMinutes: intervalMinutes || undefined,
        morningStart: optionalTime("morningStart"),
        morningEnd: optionalTime("morningEnd"),
        afternoonStart: optionalTime("afternoonStart"),
        afternoonEnd: optionalTime("afternoonEnd"),
      });
      toast.success("Profissional cadastrado na CLIM.");
      event.currentTarget.reset();
      setClinicId("");
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível cadastrar o profissional.",
      );
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="h-9 bg-gradient-to-r from-[#C7962D] to-[#E5C878] text-white hover:opacity-90 rounded-lg text-xs font-bold shadow-sm">
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Cadastrar profissional
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl text-[#07553F]">
            Cadastrar profissional
          </SheetTitle>
          <SheetDescription>Dados profissionais e horários da CLIM.</SheetDescription>
        </SheetHeader>
        {!canCreate && (
          <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            Cadastre uma clínica antes de adicionar profissionais.
          </p>
        )}
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="nome">Nome completo</Label>
            <Input id="nome" name="name" required disabled={!canCreate} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="esp">Especialidade</Label>
              <Input id="esp" name="specialty" required disabled={!canCreate} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="crm">CRM</Label>
              <Input id="crm" name="crm" disabled={!canCreate} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="cro">CRO</Label>
              <Input id="cro" name="cro" disabled={!canCreate} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="intervalo">Intervalo (min)</Label>
              <Input
                id="intervalo"
                name="intervalMinutes"
                type="number"
                min={1}
                disabled={!canCreate}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="clinica">Clínica</Label>
            <select
              id="clinica"
              value={clinicId}
              onChange={(event) => setClinicId(event.target.value)}
              disabled={!canCreate}
              required
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Selecionar clínica</option>
              {clinics.map((clinic) => (
                <option key={clinic.id} value={clinic.id}>
                  {clinic.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="iniManha">Início da manhã</Label>
              <Input id="iniManha" name="morningStart" type="time" disabled={!canCreate} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fimManha">Fim da manhã</Label>
              <Input id="fimManha" name="morningEnd" type="time" disabled={!canCreate} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="iniTarde">Início da tarde</Label>
              <Input id="iniTarde" name="afternoonStart" type="time" disabled={!canCreate} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fimTarde">Fim da tarde</Label>
              <Input id="fimTarde" name="afternoonEnd" type="time" disabled={!canCreate} />
            </div>
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#07553F] text-white hover:bg-[#147A5B]"
              disabled={!canCreate || createProfessional.isPending}
            >
              {createProfessional.isPending ? "Salvando..." : "Salvar profissional"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function Profissionais() {
  const { data: profissionais, isLoading } = useProfessionals();

  return (
    <div className="p-5 lg:p-6">
      <PageHeader
        eyebrow="Cadastros"
        title="Profissionais"
        description="Gestão da equipe médica, especialidades e horários de atendimento."
        actions={<ProfissionalSheet />}
      />

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : profissionais && profissionais.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {profissionais.map((prof) => (
            <div
              key={prof.id}
              className="group relative rounded-xl border border-[#E6ECE8] bg-white p-4 transition-all hover:border-[#C7962D]/40 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F7F8F5] ring-1 ring-[#C7962D]/30 text-[#07553F] font-display font-bold text-lg">
                  {prof.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-[#202825] truncate">{prof.name}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#C7962D]">
                    {prof.specialty}
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-1.5 border-t border-[#F0F3F1] pt-3 text-xs">
                <div className="flex items-center justify-between text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <IdCard className="h-3.5 w-3.5" /> Conselho
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-[#202825]">
                    {prof.councilNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> Sessão
                  </span>
                  <span className="font-semibold text-[#202825]">{prof.slotMinutes} min</span>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-[10px] h-8 font-bold uppercase tracking-wider border-[#E6ECE8] text-[#07553F] hover:bg-[#F7F8F5]"
                >
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-[10px] h-8 font-bold uppercase tracking-wider text-[#C7962D] hover:bg-[#C7962D]/10"
                >
                  Agenda
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={UserCog}
          title="Nenhum profissional cadastrado"
          description="Adicione o primeiro profissional para liberar agenda e atendimentos na clínica."
          action={<ProfissionalSheet />}
        />
      )}
    </div>
  );
}
