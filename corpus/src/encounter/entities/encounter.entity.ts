import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Patient } from '../../patient/entities/patient.entity';
import { Order } from '../../order/entities/order.entity';
import { AdtType } from '../enums/adt-type.enum';
import { EncounterStatus } from '../enums/encounter-status.enum';
import { Ward } from '../enums/ward.enum';

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

  @OneToMany(() => Order, (order) => order.encounter)
  orders: Order[];
}
