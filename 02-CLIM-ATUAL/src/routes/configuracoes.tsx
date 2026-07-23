import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Building2, Plus, Save } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../components/page-header";
import { EmptyState } from "../components/empty-state";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useClinics } from "../hooks/use-queries";
import { repositories } from "../lib/repositories";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Clínica | CLIM" },
      { name: "description", content: "Cadastro de clínicas da CLIM." },
    ],
  }),
  component: Configuracoes,
});

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label
        htmlFor={id}
        className="text-[11px] font-semibold uppercase tracking-wide text-[#07553F]"
      >
        {label}
      </Label>
      {children}
    </div>
  );
}

function Configuracoes() {
  const { data: clinics = [], isLoading } = useClinics();
  const [selectedId, setSelectedId] = useState("");
  const queryClient = useQueryClient();
  const selectedClinic = clinics.find((clinic) => clinic.id === selectedId);
  const save = useMutation({
    mutationFn: (input: {
      name: string;
      street: string;
      addressNumber: string;
      neighborhood: string;
      zip: string;
      city: string;
      state: string;
      logoPath: string;
    }) =>
      selectedClinic
        ? repositories.clinics.update(selectedClinic.id, input)
        : repositories.clinics.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clinics"] }),
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      const clinic = await save.mutateAsync({
        name: String(form.get("name") ?? ""),
        street: String(form.get("street") ?? ""),
        addressNumber: String(form.get("addressNumber") ?? ""),
        neighborhood: String(form.get("neighborhood") ?? ""),
        zip: String(form.get("zip") ?? ""),
        city: String(form.get("city") ?? ""),
        state: String(form.get("state") ?? ""),
        logoPath: String(form.get("logoPath") ?? ""),
      });
      setSelectedId(clinic.id);
      toast.success(selectedClinic ? "Clínica atualizada na CLIM." : "Clínica cadastrada na CLIM.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar a clínica.");
    }
  };

  return (
    <div className="flex h-full flex-col p-5 lg:p-6">
      <div className="mx-auto w-full max-w-3xl">
        <PageHeader
          eyebrow="Cadastros"
          title="Clínica"
          description="Campos existentes no cadastro de clínicas da CLIM."
          actions={
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelectedId("")}
              className="h-9 border-[#C7962D]/30 text-xs font-bold text-[#07553F]"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Nova clínica
            </Button>
          }
        />
      </div>
      {isLoading ? (
        <p className="mx-auto w-full max-w-3xl text-sm text-gray-500">Carregando clínicas...</p>
      ) : (
        <>
          <div className="mx-auto mb-4 w-full max-w-3xl">
            <select
              value={selectedId}
              onChange={(event) => setSelectedId(event.target.value)}
              className="h-9 w-full rounded-md border border-input bg-white px-3 text-sm"
            >
              <option value="">Cadastrar nova clínica</option>
              {clinics.map((clinic) => (
                <option key={clinic.id} value={clinic.id}>
                  {clinic.name}
                </option>
              ))}
            </select>
          </div>
          <form
            key={selectedId || "new"}
            onSubmit={handleSubmit}
            className="mx-auto grid w-full max-w-3xl gap-4 rounded-xl border border-[#E6ECE8] bg-white p-6 shadow-sm"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Field id="name" label="Nome da clínica">
                  <Input id="name" name="name" defaultValue={selectedClinic?.name ?? ""} required />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field id="street" label="Logradouro">
                  <Input id="street" name="street" defaultValue={selectedClinic?.street ?? ""} />
                </Field>
              </div>
              <Field id="addressNumber" label="Número">
                <Input
                  id="addressNumber"
                  name="addressNumber"
                  defaultValue={selectedClinic?.addressNumber ?? ""}
                />
              </Field>
              <Field id="neighborhood" label="Bairro">
                <Input
                  id="neighborhood"
                  name="neighborhood"
                  defaultValue={selectedClinic?.neighborhood ?? ""}
                />
              </Field>
              <Field id="city" label="Cidade">
                <Input id="city" name="city" defaultValue={selectedClinic?.city ?? ""} />
              </Field>
              <Field id="state" label="UF">
                <Input
                  id="state"
                  name="state"
                  maxLength={2}
                  defaultValue={selectedClinic?.state ?? ""}
                />
              </Field>
              <Field id="zip" label="CEP">
                <Input id="zip" name="zip" defaultValue={selectedClinic?.zip ?? ""} />
              </Field>
              <Field id="logoPath" label="Caminho do logotipo">
                <Input id="logoPath" name="logoPath" defaultValue={selectedClinic?.logoUrl ?? ""} />
              </Field>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-[#07553F] text-white hover:bg-[#147A5B]"
                disabled={save.isPending}
              >
                <Save className="mr-1.5 h-3.5 w-3.5" />
                {save.isPending ? "Salvando..." : "Salvar clínica"}
              </Button>
            </div>
          </form>
          {clinics.length === 0 && (
            <div className="mx-auto mt-4 w-full max-w-3xl">
              <EmptyState
                icon={Building2}
                title="Nenhuma clínica cadastrada"
                description="Cadastre a clínica antes de associar profissionais."
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
