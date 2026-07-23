import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ClipboardList, ListChecks, Save, Stethoscope, Users } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../components/page-header";
import { EmptyState } from "../components/empty-state";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  useCharacteristicAnswers,
  useCharacteristics,
  useClinicalRecords,
  usePatientPage,
  useProfessionals,
} from "../hooks/use-queries";
import { repositories } from "../lib/repositories";

export const Route = createFileRoute("/atendimentos")({
  head: () => ({
    meta: [
      { title: "Atendimentos | CLIM" },
      { name: "description", content: "Fichas e questionários da CLIM." },
    ],
  }),
  component: Atendimentos,
});

function Atendimentos() {
  const [patientId, setPatientId] = useState("");
  const [patientSearch, setPatientSearch] = useState("");
  const [professionalId, setProfessionalId] = useState("");
  const { data: patientPage } = usePatientPage({ search: patientSearch, pageSize: 25 });
  const patients = patientPage?.items ?? [];
  const { data: professionals = [] } = useProfessionals();
  const { data: records = [], isLoading: loadingRecord } = useClinicalRecords(
    patientId || undefined,
    professionalId || undefined,
  );
  const { data: characteristics = [] } = useCharacteristics(professionalId || undefined);
  const { data: answers = [] } = useCharacteristicAnswers(
    patientId || undefined,
    professionalId || undefined,
  );
  const queryClient = useQueryClient();
  const record = records[0];

  const saveRecord = useMutation({
    mutationFn: (input: {
      recordNumber: string;
      observations: string;
      registrationDate: string;
    }) => {
      const payload = {
        patientId,
        professionalId,
        recordNumber: input.recordNumber || undefined,
        observations: input.observations,
        registrationDate: input.registrationDate || null,
      };
      return record
        ? repositories.clinicalRecords.update(patientId, professionalId, payload)
        : repositories.clinicalRecords.create(payload);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["clinical-records", patientId, professionalId] }),
  });

  const saveAnswer = useMutation({
    mutationFn: ({
      characteristicId,
      information,
      answer,
      answerId,
    }: {
      characteristicId: number;
      information: string;
      answer: string;
      answerId?: number;
    }) => {
      const payload = { patientId, professionalId, characteristicId, information, answer };
      return answerId
        ? repositories.characteristics.updateAnswer(patientId, professionalId, answerId, payload)
        : repositories.characteristics.createAnswer(payload);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["characteristic-answers", patientId, professionalId],
      }),
  });

  const selectedPatient = patients.find((patient) => patient.id === patientId);
  const selectedProfessional = professionals.find(
    (professional) => professional.id === professionalId,
  );
  const ready = Boolean(patientId && professionalId);

  const handleRecordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await saveRecord.mutateAsync({
        recordNumber: String(form.get("recordNumber") ?? ""),
        observations: String(form.get("observations") ?? ""),
        registrationDate: String(form.get("registrationDate") ?? ""),
      });
      toast.success(record ? "Ficha atualizada na CLIM." : "Ficha criada na CLIM.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar a ficha.");
    }
  };

  const handleAnswerSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    characteristicId: number,
    information: string,
    answerId?: number,
  ) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await saveAnswer.mutateAsync({
        characteristicId,
        information,
        answer: String(form.get("answer") ?? ""),
        answerId,
      });
      toast.success("Resposta registrada na CLIM.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar a resposta.");
    }
  };

  return (
    <div className="p-5 lg:p-6">
      <PageHeader
        eyebrow="Operação"
        title="Atendimentos"
        description="Ficha do paciente e perguntas configuradas para o profissional."
      />
      <div className="mb-5 grid gap-3 rounded-xl border border-[#E6ECE8] bg-white p-4 shadow-sm md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="patient">Paciente</Label>
          <Input
            id="patient-search"
            value={patientSearch}
            onChange={(event) => setPatientSearch(event.target.value)}
            placeholder="Buscar por nome, CPF ou telefone"
          />
          <select
            id="patient"
            value={patientId}
            onChange={(event) => setPatientId(event.target.value)}
            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
          >
            <option value="">Selecionar paciente</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.fullName}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="professional">Profissional</Label>
          <select
            id="professional"
            value={professionalId}
            onChange={(event) => setProfessionalId(event.target.value)}
            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
          >
            <option value="">Selecionar profissional</option>
            {professionals.map((professional) => (
              <option key={professional.id} value={professional.id}>
                {professional.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!ready ? (
        <EmptyState
          icon={Stethoscope}
          title="Selecione paciente e profissional"
          description="A ficha é identificada pelo mesmo par paciente/profissional da CLIM."
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="space-y-4">
            <form
              key={`${patientId}:${professionalId}:${record?.id ?? "new"}`}
              onSubmit={handleRecordSubmit}
              className="rounded-xl border border-[#E6ECE8] bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold text-[#07553F]">
                    Ficha de atendimento
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    {selectedPatient?.fullName} · {selectedProfessional?.name}
                  </p>
                </div>
                <ClipboardList className="h-5 w-5 text-[#C7962D]" />
              </div>
              {loadingRecord ? (
                <p className="text-sm text-gray-500">Carregando ficha...</p>
              ) : (
                <div className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="recordNumber">Número da ficha</Label>
                      <Input
                        id="recordNumber"
                        name="recordNumber"
                        defaultValue={record?.recordNumber ?? ""}
                        inputMode="numeric"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="registrationDate">Data de cadastro</Label>
                      <Input
                        id="registrationDate"
                        name="registrationDate"
                        type="date"
                        defaultValue={record?.createdAt ?? ""}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="observations">Observações</Label>
                    <Textarea
                      id="observations"
                      name="observations"
                      rows={6}
                      defaultValue={record?.observations ?? ""}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-[#07553F] text-white hover:bg-[#147A5B]"
                      disabled={saveRecord.isPending}
                    >
                      <Save className="mr-1.5 h-3.5 w-3.5" />
                      {saveRecord.isPending ? "Salvando..." : "Salvar ficha"}
                    </Button>
                  </div>
                </div>
              )}
            </form>
            <section className="rounded-xl border border-[#E6ECE8] bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-[#C7962D]" />
                <div>
                  <h2 className="font-display text-xl font-bold text-[#07553F]">Características</h2>
                  <p className="text-xs text-gray-500">
                    Perguntas já cadastradas para este profissional.
                  </p>
                </div>
              </div>
              {record ? (
                characteristics.length > 0 ? (
                  <div className="space-y-3">
                    {characteristics.map((characteristic) => {
                      const existing = answers.find(
                        (answer) => answer.characteristicId === characteristic.id,
                      );
                      return (
                        <form
                          key={characteristic.id}
                          onSubmit={(event) =>
                            handleAnswerSubmit(
                              event,
                              characteristic.id,
                              characteristic.description,
                              existing?.id,
                            )
                          }
                          className="rounded-lg border border-[#E6ECE8] p-3"
                        >
                          <Label htmlFor={`answer-${characteristic.id}`}>
                            {characteristic.description}
                          </Label>
                          <div className="mt-2 flex gap-2">
                            <Input
                              id={`answer-${characteristic.id}`}
                              name="answer"
                              defaultValue={existing?.answer ?? ""}
                            />
                            <Button
                              type="submit"
                              variant="outline"
                              className="shrink-0 border-[#07553F] text-[#07553F]"
                              disabled={saveAnswer.isPending}
                            >
                              Salvar
                            </Button>
                          </div>
                        </form>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Este profissional ainda não possui características cadastradas na CLIM.
                  </p>
                )
              ) : (
                <p className="text-sm text-gray-500">Salve a ficha antes de registrar respostas.</p>
              )}
            </section>
          </section>
          <aside className="rounded-xl border border-[#E6ECE8] bg-white p-5 shadow-sm">
            <Users className="mb-3 h-6 w-6 text-[#C7962D]" />
            <h2 className="font-display text-lg font-bold text-[#07553F]">Dados do paciente</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-xs text-gray-400">Documento</dt>
                <dd>{selectedPatient?.document || "Não informado"}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">Contato</dt>
                <dd>{selectedPatient?.mobile || selectedPatient?.phone || "Não informado"}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">E-mail</dt>
                <dd className="break-all">{selectedPatient?.email || "Não informado"}</dd>
              </div>
            </dl>
          </aside>
        </div>
      )}
    </div>
  );
}
