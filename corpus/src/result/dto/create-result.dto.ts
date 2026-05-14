import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Min,
} from 'class-validator';
import { ResultStatus } from '../enums/result-status.enum';

export class CreateResultDto {
  @ApiProperty({ example: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({ example: 5.4 })
  @IsNumber()
  @Min(0)
  value: number;

  @ApiProperty({ example: 'mg/dL' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  unit: string;

  @ApiProperty({ enum: ResultStatus, example: ResultStatus.FINAL })
  @IsEnum(ResultStatus)
  status: ResultStatus;

  @ApiProperty({ example: 3.5, required: false })
  @IsNumber()
  @IsOptional()
  referenceMin?: number;

  @ApiProperty({ example: 10.5, required: false })
  @IsNumber()
  @IsOptional()
  referenceMax?: number;

  @ApiProperty({ example: '2026-01-16' })
  @IsDateString()
  resultDate: string;

  @ApiProperty({ example: 'LAB_INTERNO', required: false })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  sourceSystem?: string;

  @ApiProperty({ example: 'Coleta realizada em jejum', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
