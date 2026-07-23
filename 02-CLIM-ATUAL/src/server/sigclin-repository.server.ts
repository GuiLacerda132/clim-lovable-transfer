import "@tanstack/react-start/server-only";

import type {
  Appointment,
  AvailableDate,
  Characteristic,
  CharacteristicAnswer,
  ClinicalRecord,
  Clinic,
  HealthPlan,
  Holiday,
  Patient,
  PatientPage,
  Professional,
  QueueEntry,
} from "../domain/types";
import { minutesToLegacyInterval } from "./sigclin-contracts";
import { execute } from "./sigclin-db.server";
import type {
  AppointmentAttendanceInput,
  AppointmentInput,
  AppointmentUpdateInput,
  CharacteristicAnswerInput,
  CharacteristicInput,
  ClinicInput,
  HealthPlanInput,
  HolidayInput,
  PatientInput,
  PatientPageInput,
  ProfessionalInput,
  RecordInput,
} from "./sigclin-inputs";
import {
  mapLegacyAppointment,
  mapLegacyCharacteristic,
  mapLegacyCharacteristicAnswer,
  mapLegacyClinic,
  mapLegacyHealthPlan,
  mapLegacyHoliday,
  mapLegacyPatient,
  mapLegacyProfessional,
  mapLegacyRecord,
  type LegacyRow,
} from "./sigclin-mappers.server";

type SqlValue = string | number | boolean | Date | null | undefined;

function asRow<T>(rows: T[], message: string): T {
  const row = rows[0];
  if (!row) throw new Error(message);
  return row;
}

const clinicColumns = `
  nro_clinica, nom_clinica, des_endereco, num_endereco, des_bairro,
  num_cep, nom_cidade, sig_estado, path_logotipo`;

const professionalColumns = `
  nro_atendente, nom_atendente, des_especialidade, nro_clinica, num_crm, num_cro,
  val_intervalo, hor_ini_manha, hor_fim_manha, hor_ini_tarde, hor_fim_tarde`;

const patientColumns = `
  nro_paciente, nom_paciente, ind_sexo, dat_nascimento, num_documento,
  num_telefone, num_celular, email, des_profissao, nom_logradouro,
  num_endereco, nom_bairro, num_cep, nom_cidade, sig_uf`;

const healthPlanColumns = `nro_convenio, nom_convenio, num_documento, des_observacao`;

const appointmentColumns = `
  a.nro_seq_agenda, a.nro_atendente, at.nom_atendente, a.dat_agenda, a.hor_agenda,
  a.nro_paciente, a.nom_paciente, a.nom_convenio, a.out_dados, a.fla_compareceu,
  a.fla_status, a.num_telefone, a.num_senha`;

async function getAppointment(id: number): Promise<Appointment> {
  const rows = await execute<LegacyRow>(
    `
    select ${appointmentColumns}
      from agenda a
      left join atendente at on at.nro_atendente = a.nro_atendente
     where a.nro_seq_agenda = $1`,
    [id],
  );
  return mapLegacyAppointment(asRow(rows, "Agendamento não encontrado."));
}

export const legacyRepository = {
  async listClinics(): Promise<Clinic[]> {
    const rows = await execute<LegacyRow>(
      `select ${clinicColumns} from clinica order by nom_clinica`,
    );
    return rows.map(mapLegacyClinic);
  },

  async createClinic(input: ClinicInput): Promise<Clinic> {
    const rows = await execute<LegacyRow>(
      `
      insert into clinica (
        nom_clinica, des_endereco, num_endereco, des_bairro, num_cep,
        nom_cidade, sig_estado, path_logotipo
      ) values ($1, $2, $3, $4, $5, $6, $7, $8)
      returning ${clinicColumns}`,
      [
        input.name,
        input.street,
        input.addressNumber,
        input.neighborhood,
        input.zip,
        input.city,
        input.state,
        input.logoPath,
      ],
    );
    return mapLegacyClinic(asRow(rows, "Não foi possível cadastrar a clínica."));
  },

  async updateClinic(id: number, input: ClinicInput): Promise<Clinic> {
    const rows = await execute<LegacyRow>(
      `
      update clinica
         set nom_clinica = $1, des_endereco = $2, num_endereco = $3, des_bairro = $4,
             num_cep = $5, nom_cidade = $6, sig_estado = $7, path_logotipo = $8
       where nro_clinica = $9
      returning ${clinicColumns}`,
      [
        input.name,
        input.street,
        input.addressNumber,
        input.neighborhood,
        input.zip,
        input.city,
        input.state,
        input.logoPath,
        id,
      ],
    );
    return mapLegacyClinic(asRow(rows, "Clínica não encontrada."));
  },

  async removeClinic(id: number): Promise<void> {
    await execute("delete from clinica where nro_clinica = $1", [id]);
  },

  async listProfessionals(): Promise<Professional[]> {
    const rows = await execute<LegacyRow>(
      `select ${professionalColumns} from atendente order by nom_atendente`,
    );
    return rows.map(mapLegacyProfessional);
  },

  async createProfessional(input: ProfessionalInput): Promise<Professional> {
    const rows = await execute<LegacyRow>(
      `
      insert into atendente (
        nom_atendente, des_especialidade, nro_clinica, num_crm, num_cro,
        val_intervalo, hor_ini_manha, hor_fim_manha, hor_ini_tarde, hor_fim_tarde
      ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      returning ${professionalColumns}`,
      [
        input.name,
        input.specialty,
        input.clinicId,
        input.crm,
        input.cro,
        input.intervalMinutes === null || input.intervalMinutes === undefined
          ? null
          : minutesToLegacyInterval(input.intervalMinutes),
        input.morningStart,
        input.morningEnd,
        input.afternoonStart,
        input.afternoonEnd,
      ],
    );
    return mapLegacyProfessional(asRow(rows, "Não foi possível cadastrar o profissional."));
  },

  async updateProfessional(id: number, input: ProfessionalInput): Promise<Professional> {
    const rows = await execute<LegacyRow>(
      `
      update atendente
         set nom_atendente = $1, des_especialidade = $2, nro_clinica = $3,
             num_crm = $4, num_cro = $5, val_intervalo = $6, hor_ini_manha = $7,
             hor_fim_manha = $8, hor_ini_tarde = $9, hor_fim_tarde = $10
       where nro_atendente = $11
      returning ${professionalColumns}`,
      [
        input.name,
        input.specialty,
        input.clinicId,
        input.crm,
        input.cro,
        input.intervalMinutes === null || input.intervalMinutes === undefined
          ? null
          : minutesToLegacyInterval(input.intervalMinutes),
        input.morningStart,
        input.morningEnd,
        input.afternoonStart,
        input.afternoonEnd,
        id,
      ],
    );
    return mapLegacyProfessional(asRow(rows, "Profissional não encontrado."));
  },

  async removeProfessional(id: number): Promise<void> {
    await execute("delete from atendente where nro_atendente = $1", [id]);
  },

  async listPatientPage(input: PatientPageInput): Promise<PatientPage> {
    const search = input.search.trim();
    const lookup = search.replace(/\D/g, "") || search;
    const values: SqlValue[] = [input.cursor ?? 0];
    let filter = "";

    if (search) {
      values.push(`%${search.toLocaleLowerCase("pt-BR")}%`, lookup);
      filter = `
        and (
          lower(nom_paciente) like $2
          or num_documento = $3
          or num_telefone = $3
          or num_celular = $3
        )`;
    }

    values.push(input.pageSize + 1);
    const limitParameter = values.length;
    const rows = await execute<LegacyRow>(
      `
      select ${patientColumns}
        from paciente
       where nro_paciente > $1
       ${filter}
       order by nro_paciente asc
       limit $${limitParameter}`,
      values,
    );
    const hasNextPage = rows.length > input.pageSize;
    const items = rows.slice(0, input.pageSize).map(mapLegacyPatient);

    return {
      items,
      nextCursor: hasNextPage ? items.at(-1)?.id : undefined,
    };
  },

  async getPatient(id: number): Promise<Patient> {
    const rows = await execute<LegacyRow>(
      `select ${patientColumns} from paciente where nro_paciente = $1`,
      [id],
    );
    return mapLegacyPatient(asRow(rows, "Paciente não encontrado."));
  },

  async createPatient(input: PatientInput): Promise<Patient> {
    const rows = await execute<LegacyRow>(
      `
      insert into paciente (
        nom_paciente, ind_sexo, dat_nascimento, num_documento, num_telefone,
        num_celular, email, des_profissao, nom_logradouro, nom_bairro, num_cep,
        nom_cidade, sig_uf, dat_cadastro, num_endereco
      ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, current_date, $14)
      returning ${patientColumns}`,
      [
        input.fullName,
        input.sex ?? null,
        input.birthDate ?? null,
        input.document,
        input.phone,
        input.mobile,
        input.email,
        input.profession,
        input.street,
        input.neighborhood,
        input.zip,
        input.city,
        input.state,
        input.addressNumber,
      ],
    );
    return mapLegacyPatient(asRow(rows, "Não foi possível cadastrar o paciente."));
  },

  async updatePatient(id: number, input: PatientInput): Promise<Patient> {
    const rows = await execute<LegacyRow>(
      `
      update paciente
         set nom_paciente = $1, ind_sexo = $2, dat_nascimento = $3, num_documento = $4,
             num_telefone = $5, num_celular = $6, email = $7, des_profissao = $8,
             nom_logradouro = $9, nom_bairro = $10, num_cep = $11, nom_cidade = $12,
             sig_uf = $13, num_endereco = $14
       where nro_paciente = $15
      returning ${patientColumns}`,
      [
        input.fullName,
        input.sex ?? null,
        input.birthDate ?? null,
        input.document,
        input.phone,
        input.mobile,
        input.email,
        input.profession,
        input.street,
        input.neighborhood,
        input.zip,
        input.city,
        input.state,
        input.addressNumber,
        id,
      ],
    );
    return mapLegacyPatient(asRow(rows, "Paciente não encontrado."));
  },

  async removePatient(id: number): Promise<void> {
    await execute("delete from paciente where nro_paciente = $1", [id]);
  },

  async listHealthPlans(): Promise<HealthPlan[]> {
    const rows = await execute<LegacyRow>(
      `select ${healthPlanColumns} from convenio order by nom_convenio`,
    );
    return rows.map(mapLegacyHealthPlan);
  },

  async listPatientHealthPlans(patientId: number): Promise<HealthPlan[]> {
    const rows = await execute<LegacyRow>(
      `
      select ${healthPlanColumns}
        from convenio c
        join convenio_paciente cp on cp.nro_convenio = c.nro_convenio
       where cp.nro_paciente = $1
       order by c.nom_convenio`,
      [patientId],
    );
    return rows.map(mapLegacyHealthPlan);
  },

  async createHealthPlan(input: HealthPlanInput): Promise<HealthPlan> {
    const rows = await execute<LegacyRow>(
      `
      insert into convenio (nom_convenio, num_documento, des_observacao)
      values ($1, $2, $3)
      returning ${healthPlanColumns}`,
      [input.name, input.document, input.notes],
    );
    return mapLegacyHealthPlan(asRow(rows, "Não foi possível cadastrar o convênio."));
  },

  async updateHealthPlan(id: number, input: HealthPlanInput): Promise<HealthPlan> {
    const rows = await execute<LegacyRow>(
      `
      update convenio
         set nom_convenio = $1, num_documento = $2, des_observacao = $3
       where nro_convenio = $4
      returning ${healthPlanColumns}`,
      [input.name, input.document, input.notes, id],
    );
    return mapLegacyHealthPlan(asRow(rows, "Convênio não encontrado."));
  },

  async removeHealthPlan(id: number): Promise<void> {
    await execute("delete from convenio where nro_convenio = $1", [id]);
  },

  async assignHealthPlanToPatient(patientId: number, healthPlanId: number): Promise<void> {
    await execute("insert into convenio_paciente (nro_paciente, nro_convenio) values ($1, $2)", [
      patientId,
      healthPlanId,
    ]);
  },

  async removeHealthPlanFromPatient(patientId: number, healthPlanId: number): Promise<void> {
    await execute("delete from convenio_paciente where nro_paciente = $1 and nro_convenio = $2", [
      patientId,
      healthPlanId,
    ]);
  },

  async assignPatientToProfessional(patientId: number, professionalId: number): Promise<void> {
    await execute("insert into atendente_paciente (nro_paciente, nro_atendente) values ($1, $2)", [
      patientId,
      professionalId,
    ]);
  },

  async removePatientFromProfessional(patientId: number, professionalId: number): Promise<void> {
    await execute("delete from atendente_paciente where nro_paciente = $1 and nro_atendente = $2", [
      patientId,
      professionalId,
    ]);
  },

  async listAppointments(
    filters: { date?: string; professionalId?: number } = {},
  ): Promise<Appointment[]> {
    const conditions: string[] = [];
    const values: SqlValue[] = [];

    if (filters.date) {
      values.push(filters.date);
      conditions.push(`a.dat_agenda = $${values.length}`);
    }
    if (filters.professionalId) {
      values.push(filters.professionalId);
      conditions.push(`a.nro_atendente = $${values.length}`);
    }

    const where = conditions.length > 0 ? `where ${conditions.join(" and ")}` : "";
    const rows = await execute<LegacyRow>(
      `
      select ${appointmentColumns}
        from agenda a
        left join atendente at on at.nro_atendente = a.nro_atendente
        ${where}
       order by a.dat_agenda, a.hor_agenda, a.num_senha`,
      values,
    );
    return rows.map(mapLegacyAppointment);
  },

  async createAppointment(input: AppointmentInput): Promise<Appointment> {
    const rows = await execute<LegacyRow>(
      `
      insert into agenda (
        nro_atendente, dat_agenda, hor_agenda, nro_paciente, nom_paciente,
        nom_convenio, out_dados, fla_compareceu, fla_status, num_telefone, num_senha
      ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      returning nro_seq_agenda`,
      [
        input.professionalId,
        input.date,
        input.time,
        input.patientId ?? null,
        input.patientName,
        input.healthPlanName,
        input.notes,
        input.attendance,
        input.legacyStatus,
        input.phone,
        input.ticketNumber ?? null,
      ],
    );
    return getAppointment(Number(asRow(rows, "Não foi possível agendar.").nro_seq_agenda));
  },

  async updateAppointmentAttendance(
    id: number,
    input: AppointmentAttendanceInput,
  ): Promise<Appointment> {
    await execute(
      `
      update agenda
         set fla_compareceu = $1, fla_status = $2
       where nro_seq_agenda = $3`,
      [input.attendance, input.legacyStatus, id],
    );
    return getAppointment(id);
  },

  async updateAppointmentDetails(id: number, input: AppointmentUpdateInput): Promise<Appointment> {
    await execute(
      `
      update agenda
         set nro_paciente = $1, nom_paciente = $2, nom_convenio = $3, out_dados = $4,
             num_telefone = $5, hor_agenda = $6, num_senha = $7
       where nro_seq_agenda = $8`,
      [
        input.patientId ?? null,
        input.patientName,
        input.healthPlanName,
        input.notes,
        input.phone,
        input.time,
        input.ticketNumber ?? null,
        id,
      ],
    );
    return getAppointment(id);
  },

  async removeAppointment(id: number): Promise<void> {
    await execute("delete from agenda where nro_seq_agenda = $1", [id]);
  },

  async listQueue(date: string): Promise<QueueEntry[]> {
    const appointments = await this.listAppointments({ date });
    return appointments.map((appointment, index) => ({ ...appointment, position: index + 1 }));
  },

  async listAvailableTimes(professionalId: number, date: string): Promise<string[]> {
    const rows = await execute<LegacyRow>("select * from fun_horarios_disponiveis($1, $2)", [
      professionalId,
      date,
    ]);
    return rows.map((row) => String(row.hora ?? "")).filter(Boolean);
  },

  async listAvailableDates(professionalId: number): Promise<AvailableDate[]> {
    const rows = await execute<LegacyRow>("select * from fun_dias_disponiveis_2($1)", [
      professionalId,
    ]);
    return rows.map((row) => ({
      date: String(row.dia ?? ""),
      type: row.tipo ? String(row.tipo) : undefined,
    }));
  },

  async listHolidays(year?: string): Promise<Holiday[]> {
    const rows = year
      ? await execute<LegacyRow>(
          `
          select dat_feriado, des_feriado
            from feriado
           where to_char(dat_feriado, 'yyyy') = $1
           order by dat_feriado`,
          [year],
        )
      : await execute<LegacyRow>(
          "select dat_feriado, des_feriado from feriado order by dat_feriado",
        );
    return rows.map(mapLegacyHoliday);
  },

  async createHoliday(input: HolidayInput): Promise<Holiday> {
    const rows = await execute<LegacyRow>(
      `
      insert into feriado (dat_feriado, des_feriado)
      values ($1, $2)
      returning dat_feriado, des_feriado`,
      [input.date, input.description],
    );
    return mapLegacyHoliday(asRow(rows, "Não foi possível cadastrar o feriado."));
  },

  async updateHoliday(previousDate: string, input: HolidayInput): Promise<Holiday> {
    const rows = await execute<LegacyRow>(
      `
      update feriado
         set dat_feriado = $1, des_feriado = $2
       where dat_feriado = $3
      returning dat_feriado, des_feriado`,
      [input.date, input.description, previousDate],
    );
    return mapLegacyHoliday(asRow(rows, "Feriado não encontrado."));
  },

  async removeHoliday(date: string): Promise<void> {
    await execute("delete from feriado where dat_feriado = $1", [date]);
  },

  async copyHolidays(fromYear: string, toYear: string): Promise<number> {
    const rows = await execute<LegacyRow>("select fun_copia_feriados($1, $2) as copied", [
      fromYear,
      toYear,
    ]);
    return Number(asRow(rows, "Não foi possível copiar os feriados.").copied ?? 0);
  },

  async listRecords(patientId?: number, professionalId?: number): Promise<ClinicalRecord[]> {
    const conditions: string[] = [];
    const values: SqlValue[] = [];
    if (patientId) {
      values.push(patientId);
      conditions.push(`nro_paciente = $${values.length}`);
    }
    if (professionalId) {
      values.push(professionalId);
      conditions.push(`nro_atendente = $${values.length}`);
    }
    const where = conditions.length > 0 ? `where ${conditions.join(" and ")}` : "";
    const rows = await execute<LegacyRow>(
      `
      select nro_paciente, nro_atendente, nro_ficha, des_obs, dat_cadastro
        from ficha
        ${where}
       order by dat_cadastro desc`,
      values,
    );
    return rows.map(mapLegacyRecord);
  },

  async createRecord(input: RecordInput): Promise<ClinicalRecord> {
    const rows = await execute<LegacyRow>(
      `
      insert into ficha (nro_paciente, nro_atendente, nro_ficha, des_obs, dat_cadastro)
      values ($1, $2, $3, $4, $5)
      returning nro_paciente, nro_atendente, nro_ficha, des_obs, dat_cadastro`,
      [
        input.patientId,
        input.professionalId,
        input.recordNumber ?? null,
        input.observations,
        input.registrationDate ?? null,
      ],
    );
    return mapLegacyRecord(asRow(rows, "Não foi possível cadastrar a ficha."));
  },

  async updateRecord(
    patientId: number,
    professionalId: number,
    input: RecordInput,
  ): Promise<ClinicalRecord> {
    const rows = await execute<LegacyRow>(
      `
      update ficha
         set nro_ficha = $1, des_obs = $2, dat_cadastro = $3
       where nro_paciente = $4 and nro_atendente = $5
      returning nro_paciente, nro_atendente, nro_ficha, des_obs, dat_cadastro`,
      [
        input.recordNumber ?? null,
        input.observations,
        input.registrationDate ?? null,
        patientId,
        professionalId,
      ],
    );
    return mapLegacyRecord(asRow(rows, "Ficha não encontrada."));
  },

  async removeRecord(patientId: number, professionalId: number): Promise<void> {
    await execute("delete from ficha where nro_paciente = $1 and nro_atendente = $2", [
      patientId,
      professionalId,
    ]);
  },

  async listCharacteristics(professionalId: number): Promise<Characteristic[]> {
    const rows = await execute<LegacyRow>(
      `
      select nro_atendente, nro_caract, des_caract
        from caract_atendente
       where nro_atendente = $1
       order by nro_caract`,
      [professionalId],
    );
    return rows.map(mapLegacyCharacteristic);
  },

  async createCharacteristic(input: CharacteristicInput): Promise<Characteristic> {
    const rows = await execute<LegacyRow>(
      `
      insert into caract_atendente (nro_atendente, des_caract)
      values ($1, $2)
      returning nro_atendente, nro_caract, des_caract`,
      [input.professionalId, input.description],
    );
    return mapLegacyCharacteristic(asRow(rows, "Não foi possível cadastrar a característica."));
  },

  async updateCharacteristic(
    professionalId: number,
    characteristicId: number,
    description: string,
  ): Promise<Characteristic> {
    const rows = await execute<LegacyRow>(
      `
      update caract_atendente
         set des_caract = $1
       where nro_atendente = $2 and nro_caract = $3
      returning nro_atendente, nro_caract, des_caract`,
      [description, professionalId, characteristicId],
    );
    return mapLegacyCharacteristic(asRow(rows, "Característica não encontrada."));
  },

  async removeCharacteristic(professionalId: number, characteristicId: number): Promise<void> {
    await execute("delete from caract_atendente where nro_atendente = $1 and nro_caract = $2", [
      professionalId,
      characteristicId,
    ]);
  },

  async listCharacteristicAnswers(
    patientId: number,
    professionalId: number,
  ): Promise<CharacteristicAnswer[]> {
    const rows = await execute<LegacyRow>(
      `
      select nro_paciente, nro_atendente, nro_seq_caract, nro_caract, des_informacao, des_resposta
        from caract_paciente
       where nro_paciente = $1 and nro_atendente = $2
       order by nro_seq_caract`,
      [patientId, professionalId],
    );
    return rows.map(mapLegacyCharacteristicAnswer);
  },

  async createCharacteristicAnswer(
    input: CharacteristicAnswerInput,
  ): Promise<CharacteristicAnswer> {
    const rows = await execute<LegacyRow>(
      `
      insert into caract_paciente (
        nro_paciente, nro_atendente, nro_caract, des_informacao, des_resposta
      ) values ($1, $2, $3, $4, $5)
      returning nro_paciente, nro_atendente, nro_seq_caract, nro_caract, des_informacao, des_resposta`,
      [
        input.patientId,
        input.professionalId,
        input.characteristicId ?? null,
        input.information,
        input.answer,
      ],
    );
    return mapLegacyCharacteristicAnswer(asRow(rows, "Não foi possível registrar a resposta."));
  },

  async updateCharacteristicAnswer(
    patientId: number,
    professionalId: number,
    answerId: number,
    input: CharacteristicAnswerInput,
  ): Promise<CharacteristicAnswer> {
    const rows = await execute<LegacyRow>(
      `
      update caract_paciente
         set nro_caract = $1, des_informacao = $2, des_resposta = $3
       where nro_paciente = $4 and nro_atendente = $5 and nro_seq_caract = $6
      returning nro_paciente, nro_atendente, nro_seq_caract, nro_caract, des_informacao, des_resposta`,
      [
        input.characteristicId ?? null,
        input.information,
        input.answer,
        patientId,
        professionalId,
        answerId,
      ],
    );
    return mapLegacyCharacteristicAnswer(asRow(rows, "Resposta não encontrada."));
  },

  async removeCharacteristicAnswer(
    patientId: number,
    professionalId: number,
    answerId: number,
  ): Promise<void> {
    await execute(
      `
      delete from caract_paciente
       where nro_paciente = $1 and nro_atendente = $2 and nro_seq_caract = $3`,
      [patientId, professionalId, answerId],
    );
  },
};
