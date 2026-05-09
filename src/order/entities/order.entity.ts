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
import { Encounter } from '../../encounter/entities/encounter.entity';
import { Result } from '../../result/entities/result.entity';

export enum ExamType {
  HEMOGRAM = 'HEMOGRAM',
  GLUCOSE = 'GLUCOSE',
  CREATININE = 'CREATININE',
  TSH = 'TSH',
  URINE = 'URINE',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('orders')
export class Order {
  @ApiProperty({ example: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'uuid' })
  @Column({ type: 'uuid' })
  encounterId: string;

  @ApiProperty({ enum: ExamType, example: ExamType.HEMOGRAM })
  @Column({ type: 'enum', enum: ExamType })
  examType: ExamType;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.PENDING })
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @ApiProperty({ example: '2024-01-15' })
  @Column({ type: 'date' })
  requestedAt: Date;

  @ApiProperty({ example: 'Dr. João Silva' })
  @Column({ type: 'varchar', length: 255 })
  requestedBy: string;

  @ApiProperty({ example: 'Paciente em jejum de 8h', required: false })
  @Column({ type: 'varchar', nullable: true })
  notes: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Encounter, (encounter) => encounter.orders)
  @JoinColumn({ name: 'encounterId' })
  encounter: Encounter;

  @OneToMany(() => Result, (result) => result.order)
  results: Result[];
}
