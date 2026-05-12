import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { ExamType } from '../entities/order.entity';

export class CreateOrderDto {
  @ApiProperty({ example: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  encounterId: string;

  @ApiProperty({ enum: ExamType, example: ExamType.HEMOGRAM })
  @IsEnum(ExamType)
  examType: ExamType;

  @ApiProperty({ example: '2026-01-15' })
  @IsDateString()
  requestedAt: string;

  @ApiProperty({ example: 'Dr. João Silva' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  requestedBy: string;

  @ApiProperty({ example: 'Paciente em jejum de 8h', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
