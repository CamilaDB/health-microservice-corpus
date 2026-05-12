import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ResultStatus } from '../entities/result.entity';
import { ExamType } from '../../order/entities/order.entity';

export class SearchResultsDto {
  @ApiProperty({ example: 'uuid', required: false })
  @IsUUID()
  @IsOptional()
  orderId?: string;

  @ApiProperty({ enum: ResultStatus, required: false })
  @IsEnum(ResultStatus)
  @IsOptional()
  status?: ResultStatus;

  @ApiProperty({ enum: ExamType, required: false })
  @IsEnum(ExamType)
  @IsOptional()
  examType?: ExamType;

  @ApiProperty({ example: '2026-01-01', required: false })
  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @ApiProperty({ example: '2026-01-31', required: false })
  @IsDateString()
  @IsOptional()
  dateTo?: string;

  @ApiProperty({ example: 'LAB_INTERNO', required: false })
  @IsString()
  @IsOptional()
  sourceSystem?: string;
}
