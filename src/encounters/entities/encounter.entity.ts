import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Patient } from '../../patient/entities/patient.entity';

export enum AdtType {
  A01 = 'A01', // admissão
  A02 = 'A02', // transferência
  A03 = 'A03', // alta
  A08 = 'A08', // atualização de dados
}

export enum EncounterStatus {
  ADMITTED = 'ADMITTED',
  TRANSFERRED = 'TRANSFERRED',
  DISCHARGED = 'DISCHARGED',
}

export enum Ward {
  ICU = 'ICU', // UTI
  INPATIENT = 'INPATIENT', // Enfermaria
  SURGERY = 'SURGERY', // Centro Cirúrgico
  EMERGENCY = 'EMERGENCY', // Pronto Socorro
}

@Entity('encounters')
export class Encounter {
  @ApiProperty({ example: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'uuid' })
  @Column({ type: 'uuid' })
  patientId: string;

  @ApiProperty({ enum: AdtType, example: AdtType.A01 })
  @Column({ type: 'enum', enum: AdtType })
  adtType: AdtType;

  @ApiProperty({ enum: EncounterStatus, example: EncounterStatus.ADMITTED })
  @Column({
    type: 'enum',
    enum: EncounterStatus,
    default: EncounterStatus.ADMITTED,
  })
  status: EncounterStatus;

  @ApiProperty({ enum: Ward, example: Ward.EMERGENCY })
  @Column({ type: 'enum', enum: Ward, nullable: true })
  ward: Ward | null;

  @ApiProperty({ example: '2026-01-15' })
  @Column({ type: 'date' })
  admitDate: Date;

  @ApiProperty({ example: '2026-01-16', required: false })
  @Column({ type: 'date', nullable: true })
  transferDate: Date | null;

  @ApiProperty({ example: '2026-01-20', required: false })
  @Column({ type: 'date', nullable: true })
  dischargeDate: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Patient, (patient) => patient.encounters)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  // TODO
  //   @OneToMany(() => Order, (order) => order.encounter)
  //   orders: Order[];
}
