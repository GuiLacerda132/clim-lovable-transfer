import { describe, expect, it } from "vitest";
import { mapLegacyAppointment, mapLegacyPatient } from "./sigclin-mappers.server";

describe("mapeamento de dados legados", () => {
  it("mantém a identificação e o status original de uma agenda", () => {
    const appointment = mapLegacyAppointment({
      nro_seq_agenda: "9",
      nro_atendente: "2",
      nom_atendente: "Profissional de teste",
      dat_agenda: "2026-07-22",
      hor_agenda: "08:30:00",
      nro_paciente: "7",
      nom_paciente: "Paciente de teste",
      nom_convenio: "Particular",
      out_dados: null,
      fla_compareceu: "N",
      fla_status: "E",
      num_telefone: null,
      num_senha: "3",
    });

    expect(appointment).toMatchObject({
      id: "9",
      professionalId: "2",
      date: "2026-07-22",
      time: "08:30",
      status: "encaixe",
      attendance: "N",
      ticketNumber: 3,
    });
  });

  it("não inventa documento ou contato quando o cadastro antigo não possui valor", () => {
    const patient = mapLegacyPatient({
      nro_paciente: "7",
      nom_paciente: "Paciente de teste",
      ind_sexo: null,
      dat_nascimento: null,
      num_documento: null,
      num_telefone: null,
      num_celular: null,
      email: null,
      des_profissao: null,
      nom_logradouro: null,
      num_endereco: "",
      nom_bairro: null,
      num_cep: null,
      nom_cidade: null,
      sig_uf: null,
    });

    expect(patient.document).toBe("");
    expect(patient.phone).toBeUndefined();
    expect(patient.address).toBeUndefined();
  });
});
