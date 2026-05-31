import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { ResultStatus } from '../enums/result-status.enum';

export class UpdateResultDto {
  @ApiProperty({ enum: ResultStatus, required: false })
  @IsEnum(ResultStatus)
  @IsOptional()
  status?: ResultStatus;

  @ApiProperty({ example: 6.1, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  value?: number;

  @ApiProperty({ example: 'mg/dL', required: false })
  @IsString()
  @IsOptional()
  @Length(1, 50)
  unit?: string;

  @ApiProperty({ example: 3.5, required: false })
  @IsNumber()
  @IsOptional()
  referenceMin?: number;

  @ApiProperty({ example: 10.5, required: false })
  @IsNumber()
  @IsOptional()
  referenceMax?: number;

  @ApiProperty({ example: 'Resultado revisado pelo Dr. João', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
