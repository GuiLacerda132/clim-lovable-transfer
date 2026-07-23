import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Users, Plus, Search } from "lucide-react";
import { PageHeader } from "../components/page-header";
import { EmptyState } from "../components/empty-state";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { toast } from "sonner";
import {
  useCreatePatient,
  usePatient,
  usePatientHealthPlans,
  usePatientPage,
} from "../hooks/use-queries";
import { Skeleton } from "../components/ui/skeleton";
import { formatPatientAddress, patientDetailValue, patientSexLabel } from "../lib/patient-details";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

export const Route = createFileRoute("/pacientes")({
  head: () => ({
    meta: [
      { title: "Pacientes | CLIM" },
      {
        name: "description",
        content: "Cadastro e busca de pacientes da CLIM - Clínica Integrada Matonense.",
      },
    ],
  }),
  component: Pacientes,
});

function DetailItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="min-w-0 rounded-lg border border-[#E6ECE8] bg-[#F7F8F5] px-3 py-2.5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#07553F]">{label}</p>
      <p className="mt-1 break-words text-sm text-[#202825]">{patientDetailValue(value)}</p>
    </div>
  );
}

function FichaClinicaSheet({
  patientId,
  onOpenChange,
}: {
  patientId?: string;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: patient, isLoading } = usePatient(patientId);
  const { data: healthPlans = [] } = usePatientHealthPlans(patientId);

  return (
    <Sheet open={Boolean(patientId)} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl text-[#07553F]">Ficha clínica</SheetTitle>
          <SheetDescription>Dados cadastrados na CLIM para este paciente.</SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="mt-6 space-y-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Skeleton key={item} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : patient ? (
          <div className="mt-6 space-y-6">
            <section>
              <div className="rounded-xl bg-[#07553F] p-4 text-white">
                <p className="text-xs font-bold uppercase tracking-widest text-[#E5C878]">
                  Paciente
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold">{patient.fullName}</h2>
                <p className="mt-1 text-xs text-white/70">Código {patient.id}</p>
              </div>
            </section>

            <section>
              <h3 className="mb-3 font-display text-lg font-bold text-[#07553F]">Dados pessoais</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <DetailItem label="Documento" value={patient.document} />
                <DetailItem label="Data de nascimento" value={patient.birthDate} />
                <DetailItem label="Sexo" value={patientSexLabel(patient.sex)} />
                <DetailItem label="Profissão" value={patient.profession} />
              </div>
            </section>

            <section>
              <h3 className="mb-3 font-display text-lg font-bold text-[#07553F]">Contato</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <DetailItem label="Telefone" value={patient.phone} />
                <DetailItem label="Celular" value={patient.mobile} />
                <div className="sm:col-span-2">
                  <DetailItem label="E-mail" value={patient.email} />
                </div>
              </div>
            </section>

            <section>
              <h3 className="mb-3 font-display text-lg font-bold text-[#07553F]">Endereço</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <DetailItem label="Logradouro" value={formatPatientAddress(patient.address)} />
                </div>
                <DetailItem label="Bairro" value={patient.address?.neighborhood} />
                <DetailItem label="CEP" value={patient.address?.zip} />
              </div>
            </section>

            <section>
              <h3 className="mb-3 font-display text-lg font-bold text-[#07553F]">Convênios</h3>
              {healthPlans.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {healthPlans.map((healthPlan) => (
                    <span
                      key={healthPlan.id}
                      className="rounded-full bg-[#EEF3EF] px-3 py-1.5 text-xs font-semibold text-[#07553F]"
                    >
                      {healthPlan.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="rounded-lg border border-dashed border-[#D6E1DA] px-3 py-3 text-sm text-gray-500">
                  Nenhum convênio vinculado.
                </p>
              )}
            </section>
          </div>
        ) : (
          <p className="mt-6 rounded-lg border border-dashed border-[#D6E1DA] px-4 py-5 text-sm text-gray-500">
            Não foi possível localizar os dados deste paciente.
          </p>
        )}
      </SheetContent>
    </Sheet>
  );
}

function CadastrarPacienteSheet() {
  const [open, setOpen] = useState(false);
  const [sex, setSex] = useState<"F" | "M" | "O">("O");
  const createPatient = useCreatePatient();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      await createPatient.mutateAsync({
        fullName: String(form.get("fullName") ?? ""),
        sex,
        birthDate: String(form.get("birthDate") ?? ""),
        document: String(form.get("document") ?? ""),
        phone: String(form.get("phone") ?? ""),
        mobile: String(form.get("mobile") ?? ""),
        email: String(form.get("email") ?? ""),
        profession: String(form.get("profession") ?? ""),
        street: String(form.get("street") ?? ""),
        addressNumber: String(form.get("addressNumber") ?? ""),
        neighborhood: String(form.get("neighborhood") ?? ""),
        zip: String(form.get("zip") ?? ""),
        city: String(form.get("city") ?? ""),
        state: String(form.get("state") ?? ""),
      });
      toast.success("Paciente cadastrado na CLIM.");
      event.currentTarget.reset();
      setSex("O");
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível cadastrar o paciente.",
      );
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="h-9 bg-gradient-to-r from-[#C7962D] to-[#E5C878] text-white hover:opacity-90 rounded-lg text-xs font-bold shadow-sm">
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Cadastrar paciente
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl text-[#07553F]">
            Cadastrar paciente
          </SheetTitle>
          <SheetDescription>Cadastro da CLIM.</SheetDescription>
        </SheetHeader>
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="nome">Nome completo</Label>
            <Input id="nome" name="fullName" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="nasc">Data de nascimento</Label>
              <Input id="nasc" name="birthDate" type="date" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sexo">Sexo</Label>
              <Select value={sex} onValueChange={(value) => setSex(value as "F" | "M" | "O")}>
                <SelectTrigger id="sexo">
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="F">Feminino</SelectItem>
                  <SelectItem value="M">Masculino</SelectItem>
                  <SelectItem value="O">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="doc">Documento</Label>
            <Input id="doc" name="document" placeholder="CPF ou RG" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="tel">Telefone</Label>
              <Input id="tel" name="phone" type="tel" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cel">Celular</Label>
              <Input id="cel" name="mobile" type="tel" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" />
          </div>
          <div className="grid grid-cols-[1fr_100px] gap-4">
            <div className="grid gap-2">
              <Label htmlFor="end">Logradouro</Label>
              <Input id="end" name="street" placeholder="Rua, avenida..." />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="numero">Número</Label>
              <Input id="numero" name="addressNumber" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input id="cidade" name="city" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="uf">UF</Label>
              <Input id="uf" name="state" maxLength={2} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cep">CEP</Label>
              <Input id="cep" name="zip" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="bairro">Bairro</Label>
              <Input id="bairro" name="neighborhood" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="profissao">Profissão</Label>
              <Input id="profissao" name="profession" />
            </div>
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#07553F] text-white hover:bg-[#147A5B]"
              disabled={createPatient.isPending}
            >
              {createPatient.isPending ? "Salvando..." : "Salvar paciente"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function useDebouncedValue(value: string, delay = 250) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeout);
  }, [delay, value]);

  return debouncedValue;
}

function Pacientes() {
  const [search, setSearch] = useState("");
  const [cursorHistory, setCursorHistory] = useState<string[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>();
  const debouncedSearch = useDebouncedValue(search);
  const cursor = cursorHistory.at(-1);
  const {
    data: page,
    isLoading,
    isFetching,
  } = usePatientPage({
    search: debouncedSearch,
    cursor: cursor ? Number(cursor) : undefined,
    pageSize: 50,
  });
  const pacientes = page?.items ?? [];

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCursorHistory([]);
  };

  const goToNextPage = () => {
    if (page?.nextCursor) {
      setCursorHistory((history) => [...history, page.nextCursor!]);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden p-5 lg:p-6">
      <PageHeader
        eyebrow="Operação"
        title="Pacientes"
        description="Gestão de cadastros e busca de pacientes da CLIM."
        actions={<CadastrarPacienteSheet />}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar por nome, CPF ou telefone"
            className="h-9 pl-9 bg-white border-[#E6ECE8] text-xs rounded-lg"
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
          />
        </div>
        <Select>
          <SelectTrigger className="h-9 w-48 bg-white border-[#E6ECE8] text-xs rounded-lg">
            <SelectValue placeholder="Todos os convênios" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="particular">Particular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : pacientes.length > 0 ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-[#E6ECE8] bg-white shadow-sm">
          <div className="min-h-0 flex-1 overflow-y-auto">
            <Table className="min-w-[760px] table-fixed">
              <colgroup>
                <col className="w-[42%]" />
                <col className="w-[18%]" />
                <col className="w-[28%]" />
                <col className="w-[12%]" />
              </colgroup>
              <TableHeader className="sticky top-0 z-10 bg-[#F7F8F5]">
                <TableRow className="bg-[#F7F8F5] border-b border-[#E6ECE8]">
                  <TableHead className="w-[300px] text-[10px] font-bold uppercase tracking-widest text-[#07553F] py-3 pl-5">
                    Nome completo
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#07553F] py-3">
                    Documento
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#07553F] py-3">
                    Contato
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#07553F] py-3 text-right pr-5">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pacientes.map((p) => (
                  <TableRow
                    key={p.id}
                    className="hover:bg-[#F7F8F5]/60 transition-colors group border-b border-[#F0F3F1] last:border-0"
                  >
                    <TableCell className="min-w-0 font-medium py-3 pl-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7F8F5] ring-1 ring-[#C7962D]/30 text-[10px] font-bold text-[#07553F] uppercase">
                          {p.fullName.charAt(0)}
                        </div>
                        <span className="truncate text-sm">{p.fullName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="truncate text-gray-500 font-mono text-xs">
                      {p.document}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs gap-0.5">
                        <span className="font-medium">{p.mobile || p.phone || "—"}</span>
                        <span className="text-gray-400 lowercase">{p.email || "sem email"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right py-3 pr-5">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-[10px] font-bold uppercase tracking-wider text-[#07553F]"
                        onClick={() => setSelectedPatientId(p.id)}
                      >
                        Ficha clínica
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex min-h-14 shrink-0 items-center justify-between border-t border-[#E6ECE8] px-4 py-3">
            <p className="text-xs text-gray-500">Página {cursorHistory.length + 1}</p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                disabled={cursorHistory.length === 0}
                onClick={() => setCursorHistory((history) => history.slice(0, -1))}
              >
                <ChevronLeft className="mr-1 h-3.5 w-3.5" /> Anterior
              </Button>
              <Button
                type="button"
                size="sm"
                className="h-8 bg-[#07553F] text-xs text-white hover:bg-[#147A5B]"
                disabled={!page?.nextCursor}
                onClick={goToNextPage}
              >
                Próximos <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title={search ? "Nenhum resultado" : "Nenhum paciente cadastrado"}
          description={
            search
              ? "Tente buscar por outro termo ou limpe os filtros."
              : "O banco de dados de pacientes está vazio. Cadastre o primeiro paciente para iniciar o histórico da clínica."
          }
          action={!search && <CadastrarPacienteSheet />}
        />
      )}
      <FichaClinicaSheet
        patientId={selectedPatientId}
        onOpenChange={(open) => {
          if (!open) setSelectedPatientId(undefined);
        }}
      />
    </div>
  );
}
