import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Encounter } from 'src/encounters/entities/encounter.entity';

export enum Sex {
  M = 'M',
  F = 'F',
  U = 'U',
}

@Entity('patients')
export class Patient {
  @ApiProperty({ example: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Maria Silva' })
  @Column({ length: 255 })
  name: string;

  @ApiProperty({ example: '1990-05-20' })
  @Column({ type: 'date' })
  birthDate: Date;

  @ApiProperty({ example: '12345678900' })
  @Column({ unique: true, length: 11 })
  cpf: string;

  @ApiProperty({ enum: Sex, example: Sex.F })
  @Column({ type: 'enum', enum: Sex })
  sex: Sex;

  @ApiProperty({ example: 'maria@email.com', required: false })
  @Column({ type: 'varchar', unique: true, nullable: true, length: 255 })
  email: string | null;

  @ApiProperty({ example: '(51) 99999-0000', required: false })
  @Column({ type: 'varchar', nullable: true, length: 20 })
  phone: string | null;

  @ApiProperty({ example: true })
  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Encounter, (encounter) => encounter.patient)
  encounters: Encounter[];
}
