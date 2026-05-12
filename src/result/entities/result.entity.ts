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
import { Order } from '../../order/entities/order.entity';

export enum ResultStatus {
  PRELIMINARY = 'PRELIMINARY',
  FINAL = 'FINAL',
  CORRECTED = 'CORRECTED',
}

@Entity('results')
export class Result {
  @ApiProperty({ example: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'uuid' })
  @Column({ type: 'uuid' })
  orderId: string;

  @ApiProperty({ example: 5.4 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @ApiProperty({ example: 'mg/dL' })
  @Column({ type: 'varchar', length: 50 })
  unit: string;

  @ApiProperty({ enum: ResultStatus, example: ResultStatus.FINAL })
  @Column({
    type: 'enum',
    enum: ResultStatus,
    default: ResultStatus.PRELIMINARY,
  })
  status: ResultStatus;

  @ApiProperty({ example: 3.5, required: false })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  referenceMin: number | null;

  @ApiProperty({ example: 10.5, required: false })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  referenceMax: number | null;

  @ApiProperty({ example: '2026-01-16' })
  @Column({ type: 'date' })
  resultDate: Date;

  @ApiProperty({ example: 'LAB_INTERNO', required: false })
  @Column({ type: 'varchar', length: 100, nullable: true })
  sourceSystem: string | null;

  @ApiProperty({ example: 'Coleta realizada em jejum', required: false })
  @Column({ type: 'varchar', nullable: true })
  notes: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Order, (order) => order.results)
  @JoinColumn({ name: 'orderId' })
  order: Order;
}
