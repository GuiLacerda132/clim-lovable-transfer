import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, startOfWeek, eachDayOfInterval, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { PageHeader } from "../components/page-header";
import { Button } from "../components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  useAppointments,
  useAvailableTimes,
  useCreateAppointment,
  useHealthPlans,
  usePatientPage,
  useProfessionals,
} from "../hooks/use-queries";
import { cn } from "../lib/utils";

export const Route = createFileRoute("/agenda")({
  head: () => ({
    meta: [
      { title: "Agenda | CLIM" },
      {
        name: "description",
        content: "Agenda diária e semanal da CLIM.",
      },
    ],
  }),
  component: Agenda,
});

const statusLabel = { normal: "Normal", encaixe: "Encaixe", desmarcado: "Desmarcado" };
const statusStyle = {
  normal: "border-[#07553F] bg-emerald-50 text-[#07553F]",
  encaixe: "border-[#C7962D] bg-amber-50 text-amber-800",
  desmarcado: "border-gray-300 bg-gray-50 text-gray-500 line-through",
};

function NovaConsultaSheet() {
  const [open, setOpen] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [patientSearch, setPatientSearch] = useState("");
  const [professionalId, setProfessionalId] = useState("");
  const [healthPlanId, setHealthPlanId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [legacyStatus, setLegacyStatus] = useState<"N" | "E" | "D">("N");
  const { data: patientPage } = usePatientPage({ search: patientSearch, pageSize: 25 });
  const patients = patientPage?.items ?? [];
  const { data: professionals = [] } = useProfessionals();
  const { data: healthPlans = [] } = useHealthPlans();
  const { data: availableTimes = [] } = useAvailableTimes(
    professionalId || undefined,
    date || undefined,
  );
  const createAppointment = useCreateAppointment();

  const canSubmit = Boolean(patientId && professionalId && date && time);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const patient = patients.find((item) => item.id === patientId);
    const healthPlan = healthPlans.find((item) => item.id === healthPlanId);
    const form = new FormData(event.currentTarget);

    if (!patient || !canSubmit) return;

    try {
      await createAppointment.mutateAsync({
        professionalId,
        date,
        time,
        patientId,
        patientName: patient.fullName,
        healthPlanName: healthPlan?.name ?? "",
        notes: String(form.get("notes") ?? ""),
        attendance: "N",
        legacyStatus,
        phone: patient.mobile || patient.phone || "",
        ticketNumber: undefined,
      });
      toast.success("Consulta registrada na CLIM.");
      event.currentTarget.reset();
      setPatientId("");
      setPatientSearch("");
      setProfessionalId("");
      setHealthPlanId("");
      setDate("");
      setTime("");
      setLegacyStatus("N");
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível agendar a consulta.");
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="h-9 rounded-lg bg-gradient-to-r from-[#C7962D] to-[#E5C878] text-xs font-bold text-white shadow-sm hover:opacity-90">
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Nova consulta
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl text-[#07553F]">Nova consulta</SheetTitle>
          <SheetDescription>Usa os mesmos campos e status da agenda antiga.</SheetDescription>
        </SheetHeader>
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="paciente">Paciente</Label>
            <Input
              id="buscar-paciente"
              value={patientSearch}
              onChange={(event) => setPatientSearch(event.target.value)}
              placeholder="Buscar paciente por nome, CPF ou telefone"
            />
            <Select value={patientId} onValueChange={setPatientId}>
              <SelectTrigger id="paciente">
                <SelectValue placeholder="Selecionar paciente" />
              </SelectTrigger>
              <SelectContent>
                {patients.length > 0 ? (
                  patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.fullName}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="_" disabled>
                    Nenhum paciente cadastrado
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="profissional">Profissional</Label>
            <Select
              value={professionalId}
              onValueChange={(value) => {
                setProfessionalId(value);
                setTime("");
              }}
            >
              <SelectTrigger id="profissional">
                <SelectValue placeholder="Selecionar profissional" />
              </SelectTrigger>
              <SelectContent>
                {professionals.length > 0 ? (
                  professionals.map((professional) => (
                    <SelectItem key={professional.id} value={professional.id}>
                      {professional.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="_" disabled>
                    Nenhum profissional cadastrado
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="convenio">Convênio</Label>
            <Select value={healthPlanId} onValueChange={setHealthPlanId}>
              <SelectTrigger id="convenio">
                <SelectValue placeholder="Sem convênio" />
              </SelectTrigger>
              <SelectContent>
                {healthPlans.map((healthPlan) => (
                  <SelectItem key={healthPlan.id} value={healthPlan.id}>
                    {healthPlan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                type="date"
                value={date}
                onChange={(event) => {
                  setDate(event.target.value);
                  setTime("");
                }}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hora">Horário</Label>
              {availableTimes.length > 0 ? (
                <Select value={time} onValueChange={setTime} disabled={!professionalId || !date}>
                  <SelectTrigger id="hora">
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimes.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="hora"
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  required
                  disabled={!professionalId || !date}
                />
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={legacyStatus}
              onValueChange={(value) => setLegacyStatus(value as "N" | "E" | "D")}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="N">Normal</SelectItem>
                <SelectItem value="E">Encaixe</SelectItem>
                <SelectItem value="D">Desmarcado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="obs">Observação</Label>
            <Textarea id="obs" name="notes" rows={3} placeholder="Opcional" />
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#07553F] text-white hover:bg-[#147A5B]"
              disabled={!canSubmit || createAppointment.isPending}
            >
              {createAppointment.isPending ? "Salvando..." : "Criar consulta"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function Agenda() {
  const [mode, setMode] = useState<"dia" | "semana">("dia");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [professionalId, setProfessionalId] = useState("");
  const hours = Array.from(
    { length: 12 },
    (_, index) => `${String(7 + index).padStart(2, "0")}:00`,
  );
  const dateFilter = format(currentDate, "yyyy-MM-dd");

  const { data: professionals = [] } = useProfessionals();
  const { data: appointments = [], isLoading } = useAppointments(
    mode === "dia" ? dateFilter : undefined,
  );

  const handlePrev = () => setCurrentDate((date) => addDays(date, mode === "dia" ? -1 : -7));
  const handleNext = () => setCurrentDate((date) => addDays(date, mode === "dia" ? 1 : 7));
  const handleToday = () => setCurrentDate(new Date());

  const daysOfStep =
    mode === "semana"
      ? eachDayOfInterval({
          start: startOfWeek(currentDate, { weekStartsOn: 1 }),
          end: addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), 4),
        })
      : [currentDate];

  const visibleAppointments = appointments.filter(
    (appointment) => !professionalId || appointment.professionalId === professionalId,
  );
  const appointmentsAt = (day: Date, hour: string) => {
    const dayId = format(day, "yyyy-MM-dd");
    return visibleAppointments.filter(
      (appointment) =>
        appointment.date === dayId && appointment.time.slice(0, 2) === hour.slice(0, 2),
    );
  };

  return (
    <div className="p-5 lg:p-6">
      <PageHeader
        eyebrow="Operação"
        title="Agenda"
        description="Consultas e encaixes registrados na CLIM."
        actions={<NovaConsultaSheet />}
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E6ECE8] bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <Tabs value={mode} onValueChange={(value) => setMode(value as "dia" | "semana")}>
            <TabsList className="h-8">
              <TabsTrigger value="dia" className="text-xs">
                Diário
              </TabsTrigger>
              <TabsTrigger value="semana" className="text-xs">
                Semanal
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePrev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 min-w-[80px] border-[#E6ECE8] text-xs font-semibold"
              onClick={handleToday}
            >
              Hoje
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="hidden text-xs font-semibold text-[#07553F] first-letter:uppercase md:block">
            {mode === "semana"
              ? `${format(daysOfStep[0], "dd/MM")} - ${format(daysOfStep[daysOfStep.length - 1], "dd/MM")}`
              : format(currentDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={professionalId} onValueChange={setProfessionalId}>
            <SelectTrigger className="h-8 w-44 border-[#E6ECE8] bg-white text-xs">
              <SelectValue placeholder="Profissionais" />
            </SelectTrigger>
            <SelectContent>
              {professionals.map((professional) => (
                <SelectItem key={professional.id} value={professional.id}>
                  {professional.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-gray-500 hover:text-[#07553F]"
            onClick={() => setProfessionalId("")}
          >
            <Filter className="mr-1.5 h-3.5 w-3.5" /> Limpar
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E6ECE8] bg-white shadow-sm">
        {isLoading ? (
          <p className="p-6 text-sm text-gray-500">Carregando agenda...</p>
        ) : mode === "dia" ? (
          <div className="grid grid-cols-[80px_1fr]">
            {hours.map((hour) => {
              const events = appointmentsAt(currentDate, hour);
              return (
                <div key={hour} className="contents">
                  <div className="border-b border-r border-[#F0F3F1] bg-[#F7F8F5]/50 px-3 py-5 text-center text-[10px] font-bold text-gray-400">
                    {hour}
                  </div>
                  <div className="min-h-[54px] border-b border-[#F0F3F1] p-2">
                    {events.map((appointment) => (
                      <div
                        key={appointment.id}
                        className={cn(
                          "rounded-md border-l-4 px-2 py-1 text-xs",
                          statusStyle[appointment.status],
                        )}
                      >
                        <span className="font-bold">{appointment.time}</span>{" "}
                        {appointment.patientName}
                        <span className="ml-2 text-[10px]">{statusLabel[appointment.status]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-[80px_repeat(5,1fr)]">
            <div className="border-b border-r border-[#F0F3F1] bg-[#F7F8F5]/50" />
            {daysOfStep.map((day) => (
              <div
                key={day.toISOString()}
                className={cn(
                  "border-b border-r border-[#F0F3F1] bg-[#F7F8F5]/30 p-2.5 text-center",
                  isSameDay(day, new Date()) && "bg-[#C7962D]/5",
                )}
              >
                <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                  {format(day, "EEE", { locale: ptBR })}
                </div>
                <div className="mt-0.5 text-sm font-bold text-[#202825]">{format(day, "dd")}</div>
              </div>
            ))}
            {hours.map((hour) => (
              <div key={hour} className="contents">
                <div className="border-b border-r border-[#F0F3F1] bg-[#F7F8F5]/50 px-3 py-4 text-center text-[10px] font-bold text-gray-400">
                  {hour}
                </div>
                {daysOfStep.map((day) => {
                  const events = appointmentsAt(day, hour);
                  return (
                    <div
                      key={`${day.toISOString()}-${hour}`}
                      className="min-h-[44px] border-b border-r border-[#F0F3F1] p-1"
                    >
                      {events.map((appointment) => (
                        <p
                          key={appointment.id}
                          className={cn(
                            "truncate border-l-2 px-1 text-[9px]",
                            statusStyle[appointment.status],
                          )}
                        >
                          {appointment.patientName}
                        </p>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
