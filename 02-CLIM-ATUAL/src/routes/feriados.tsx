import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarClock, Copy, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../components/page-header";
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
import { useCreateHoliday, useHolidays } from "../hooks/use-queries";
import { repositories } from "../lib/repositories";

export const Route = createFileRoute("/feriados")({
  head: () => ({
    meta: [
      { title: "Feriados | CLIM" },
      { name: "description", content: "Feriados que impactam a agenda da CLIM." },
    ],
  }),
  component: Feriados,
});

function HolidaySheet() {
  const [open, setOpen] = useState(false);
  const createHoliday = useCreateHoliday();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      await createHoliday.mutateAsync({
        date: String(data.get("date") ?? ""),
        description: String(data.get("description") ?? ""),
      });
      toast.success("Feriado registrado na CLIM.");
      event.currentTarget.reset();
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível cadastrar o feriado.");
    }
  };
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="h-9 rounded-lg bg-gradient-to-r from-[#C7962D] to-[#E5C878] text-xs font-bold text-white hover:opacity-90">
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Novo feriado
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl text-[#07553F]">Novo feriado</SheetTitle>
          <SheetDescription>Data que a agenda antiga reconhece como feriado.</SheetDescription>
        </SheetHeader>
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="date">Data</Label>
            <Input id="date" name="date" type="date" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Input id="description" name="description" maxLength={20} required />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#07553F] text-white"
              disabled={createHoliday.isPending}
            >
              {createHoliday.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function CopyHolidaysSheet({ currentYear }: { currentYear: string }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const copy = useMutation({
    mutationFn: ({ fromYear, toYear }: { fromYear: string; toYear: string }) =>
      repositories.holidays.copy(fromYear, toYear),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["holidays"] }),
  });
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const copied = await copy.mutateAsync({
        fromYear: String(data.get("fromYear") ?? ""),
        toYear: String(data.get("toYear") ?? ""),
      });
      toast.success(`${copied} feriado(s) copiado(s) pela função original.`);
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível copiar os feriados.");
    }
  };
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="h-9 rounded-lg border-[#E6ECE8] text-xs font-bold text-[#07553F]"
        >
          <Copy className="mr-1.5 h-3.5 w-3.5" />
          Copiar de outro ano
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl text-[#07553F]">Copiar feriados</SheetTitle>
          <SheetDescription>
            Executa a função original do banco, sem recriar a regra.
          </SheetDescription>
        </SheetHeader>
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="fromYear">Ano de</Label>
            <Input id="fromYear" name="fromYear" inputMode="numeric" pattern="[0-9]{4}" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="toYear">Ano para</Label>
            <Input
              id="toYear"
              name="toYear"
              defaultValue={currentYear}
              inputMode="numeric"
              pattern="[0-9]{4}"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#07553F] text-white" disabled={copy.isPending}>
              {copy.isPending ? "Copiando..." : "Copiar"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function Feriados() {
  const year = String(new Date().getFullYear());
  const { data: holidays = [], isLoading } = useHolidays(year);
  const queryClient = useQueryClient();
  const remove = useMutation({
    mutationFn: repositories.holidays.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["holidays"] }),
  });

  const handleRemove = async (date: string) => {
    if (!window.confirm("Remover este feriado da CLIM?")) return;
    try {
      await remove.mutateAsync(date);
      toast.success("Feriado removido.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível remover o feriado.");
    }
  };

  return (
    <div className="p-5 lg:p-6">
      <PageHeader
        eyebrow="Cadastros"
        title="Feriados"
        description={`Feriados cadastrados para ${year}.`}
        actions={
          <div className="flex gap-2">
            <CopyHolidaysSheet currentYear={year} />
            <HolidaySheet />
          </div>
        }
      />
      {isLoading ? (
        <p className="text-sm text-gray-500">Carregando feriados...</p>
      ) : holidays.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-[#E6ECE8] bg-white shadow-sm">
          <div className="grid grid-cols-[150px_1fr_48px] border-b border-[#E6ECE8] bg-[#F7F8F5] px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#07553F]">
            <span>Data</span>
            <span>Descrição</span>
            <span />
          </div>
          {holidays.map((holiday) => (
            <div
              key={holiday.id}
              className="grid grid-cols-[150px_1fr_48px] items-center border-b border-[#F0F3F1] px-4 py-3 last:border-0"
            >
              <span className="font-mono text-sm text-[#07553F]">{holiday.date}</span>
              <span className="text-sm text-[#202825]">{holiday.description}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-rose-600"
                onClick={() => handleRemove(holiday.date)}
                disabled={remove.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[#E6ECE8] bg-[#F7F8F5]/50 px-6 py-10 text-center">
          <CalendarClock className="mx-auto h-7 w-7 text-[#C7962D]" />
          <p className="mt-2 text-sm text-gray-500">Nenhum feriado cadastrado para este ano.</p>
        </div>
      )}
    </div>
  );
}
