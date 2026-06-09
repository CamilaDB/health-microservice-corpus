import { Encounter } from 'src/encounter/entities/encounter.entity';
import { AdtType } from 'src/encounter/enums/adt-type.enum';
import { EncounterStatus } from 'src/encounter/enums/encounter-status.enum';
import { Ward } from 'src/encounter/enums/ward.enum';
import { Order } from 'src/order/entities/order.entity';
import { ExamType } from 'src/order/enums/exam-type.enum';
import { OrderStatus } from 'src/order/enums/order-status.enum';
import { Patient } from 'src/patient/entities/patient.entity';
import { Sex } from 'src/patient/enums/sex.enum';
import { Result } from 'src/result/entities/result.entity';
import { ResultStatus } from 'src/result/enums/result-status.enum';
import { DataSource } from 'typeorm';

export async function seed(dataSource: DataSource): Promise<void> {
  const patientRepo = dataSource.getRepository(Patient);
  const encounterRepo = dataSource.getRepository(Encounter);
  const orderRepo = dataSource.getRepository(Order);
  const resultRepo = dataSource.getRepository(Result);

  console.log('Seeding database...');

  // ── Patients ──────────────────────────────────────────────
  const patients = await patientRepo.save([
    {
      name: 'Ana Beatriz Souza',
      birthDate: new Date('1985-03-12'),
      cpf: '11122233344',
      sex: Sex.F,
      email: 'ana.souza@email.com',
      phone: '(51) 98888-1111',
      active: true,
    },
    {
      name: 'Carlos Eduardo Lima',
      birthDate: new Date('1972-07-28'),
      cpf: '22233344455',
      sex: Sex.M,
      email: 'carlos.lima@email.com',
      phone: '(51) 97777-2222',
      active: true,
    },
    {
      name: 'Fernanda Oliveira',
      birthDate: new Date('1990-11-05'),
      cpf: '33344455566',
      sex: Sex.F,
      email: 'fernanda.oliveira@email.com',
      phone: null,
      active: true,
    },
    {
      name: 'Roberto Martins',
      birthDate: new Date('1955-01-20'),
      cpf: '44455566677',
      sex: Sex.M,
      email: null,
      phone: '(51) 96666-3333',
      active: true,
    },
    {
      name: 'Juliana Costa',
      birthDate: new Date('2001-09-14'),
      cpf: '55566677788',
      sex: Sex.F,
      email: 'juliana.costa@email.com',
      phone: '(51) 95555-4444',
      active: false,
    },
  ]);

  console.log(`  ${patients.length} patients`);

  // ── Encounters ────────────────────────────────────────────
  const encounters = await encounterRepo.save([
    // Ana — internada na UTI (ativa)
    {
      patientId: patients[0].id,
      adtType: AdtType.A01,
      status: EncounterStatus.ADMITTED,
      ward: Ward.ICU,
      admitDate: new Date('2026-01-10'),
      transferDate: null,
      dischargeDate: null,
    },
    // Carlos — transferido para enfermaria
    {
      patientId: patients[1].id,
      adtType: AdtType.A02,
      status: EncounterStatus.TRANSFERRED,
      ward: Ward.INPATIENT,
      admitDate: new Date('2026-01-08'),
      transferDate: new Date('2026-01-12'),
      dischargeDate: null,
    },
    // Fernanda — alta (episódio encerrado)
    {
      patientId: patients[2].id,
      adtType: AdtType.A03,
      status: EncounterStatus.DISCHARGED,
      ward: Ward.EMERGENCY,
      admitDate: new Date('2025-12-20'),
      transferDate: null,
      dischargeDate: new Date('2025-12-23'),
    },
    // Roberto — internado em cirurgia (ativo)
    {
      patientId: patients[3].id,
      adtType: AdtType.A01,
      status: EncounterStatus.ADMITTED,
      ward: Ward.SURGERY,
      admitDate: new Date('2026-01-14'),
      transferDate: null,
      dischargeDate: null,
    },
    // Fernanda — segundo episódio encerrado (histórico)
    {
      patientId: patients[2].id,
      adtType: AdtType.A03,
      status: EncounterStatus.DISCHARGED,
      ward: Ward.INPATIENT,
      admitDate: new Date('2025-10-01'),
      transferDate: null,
      dischargeDate: new Date('2025-10-05'),
    },
  ]);

  console.log(`  ${encounters.length} encounters`);

  // ── Orders ────────────────────────────────────────────────
  const orders = await orderRepo.save([
    // Ana — hemograma completo (in_progress, tem result)
    {
      encounterId: encounters[0].id,
      examType: ExamType.HEMOGRAM,
      status: OrderStatus.IN_PROGRESS,
      requestedAt: new Date('2026-01-10'),
      requestedBy: 'Dr. Paulo Salave',
      notes: 'Coleta em jejum',
    },
    // Ana — glicose (pending)
    {
      encounterId: encounters[0].id,
      examType: ExamType.GLUCOSE,
      status: OrderStatus.PENDING,
      requestedAt: new Date('2026-01-11'),
      requestedBy: 'Dr. Paulo Salave',
      notes: null,
    },
    // Carlos — TSH (completed, tem result final)
    {
      encounterId: encounters[1].id,
      examType: ExamType.TSH,
      status: OrderStatus.COMPLETED,
      requestedAt: new Date('2026-01-09'),
      requestedBy: 'Dra. Marcia Fontes',
      notes: null,
    },
    // Carlos — creatinina (pending)
    {
      encounterId: encounters[1].id,
      examType: ExamType.CREATININE,
      status: OrderStatus.PENDING,
      requestedAt: new Date('2026-01-12'),
      requestedBy: 'Dra. Marcia Fontes',
      notes: 'Avaliar função renal',
    },
    // Fernanda (episódio encerrado) — urina (completed)
    {
      encounterId: encounters[2].id,
      examType: ExamType.URINE,
      status: OrderStatus.COMPLETED,
      requestedAt: new Date('2025-12-20'),
      requestedBy: 'Dr. André Rocha',
      notes: null,
    },
    // Roberto — glicose (pending)
    {
      encounterId: encounters[3].id,
      examType: ExamType.GLUCOSE,
      status: OrderStatus.PENDING,
      requestedAt: new Date('2026-01-14'),
      requestedBy: 'Dr. Sérgio Melo',
      notes: 'Paciente diabético',
    },
    // Ana — hemograma cancelado (histórico)
    {
      encounterId: encounters[0].id,
      examType: ExamType.HEMOGRAM,
      status: OrderStatus.CANCELLED,
      requestedAt: new Date('2026-01-10'),
      requestedBy: 'Dr. Paulo Salave',
      notes: 'Duplicata — cancelado',
    },
  ]);

  console.log(`  ${orders.length} orders`);

  // ── Results ───────────────────────────────────────────────
  await resultRepo.save([
    // Ana — hemograma (preliminary, anormal)
    {
      orderId: orders[0].id,
      value: 8.2,
      unit: 'g/dL',
      status: ResultStatus.PRELIMINARY,
      referenceMin: 12.0,
      referenceMax: 16.0,
      resultDate: new Date('2026-01-11'),
      sourceSystem: 'LAB_INTERNO',
      notes: 'Hemoglobina abaixo do esperado',
    },
    // Carlos — TSH (final, normal)
    {
      orderId: orders[2].id,
      value: 2.1,
      unit: 'mIU/L',
      status: ResultStatus.FINAL,
      referenceMin: 0.4,
      referenceMax: 4.0,
      resultDate: new Date('2026-01-10'),
      sourceSystem: 'LAB_INTERNO',
      notes: null,
    },
    // Carlos — TSH corrigido
    {
      orderId: orders[2].id,
      value: 2.3,
      unit: 'mIU/L',
      status: ResultStatus.CORRECTED,
      referenceMin: 0.4,
      referenceMax: 4.0,
      resultDate: new Date('2026-01-10'),
      sourceSystem: 'LAB_INTERNO',
      notes: 'Corrigido após revisão técnica',
    },
    // Fernanda — urina (final, sem referência — qualitativo)
    {
      orderId: orders[4].id,
      value: 1.0,
      unit: 'ausência',
      status: ResultStatus.FINAL,
      referenceMin: null,
      referenceMax: null,
      resultDate: new Date('2025-12-21'),
      sourceSystem: 'DASA',
      notes: 'Ausência de leucócitos e eritrócitos',
    },
  ]);

  console.log('  4 results');
  console.log('\n Seed concluído.\n');
}
