import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ExamType, OrderStatus } from '../entities/order.entity';

export enum OrderSortField {
  REQUESTED_AT = 'requestedAt',
  EXAM_TYPE = 'examType',
  STATUS = 'status',
  CREATED_AT = 'created_at',
}

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class SearchOrdersAdvancedDto {
  @ApiProperty({ enum: OrderStatus, required: false })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @ApiProperty({ enum: ExamType, required: false })
  @IsEnum(ExamType)
  @IsOptional()
  examType?: ExamType;

  @ApiProperty({ example: '2024-01-01', required: false })
  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @ApiProperty({ example: '2024-01-31', required: false })
  @IsDateString()
  @IsOptional()
  dateTo?: string;

  @ApiProperty({ example: 'uuid', required: false })
  @IsUUID()
  @IsOptional()
  patientId?: string;

  @ApiProperty({ example: 'uuid', required: false })
  @IsUUID()
  @IsOptional()
  encounterId?: string;

  @ApiProperty({ example: 'Dr. João', required: false })
  @IsString()
  @IsOptional()
  requestedBy?: string;

  @ApiProperty({
    enum: OrderSortField,
    required: false,
    default: OrderSortField.REQUESTED_AT,
  })
  @IsEnum(OrderSortField)
  @IsOptional()
  sortBy?: OrderSortField;

  @ApiProperty({
    enum: SortDirection,
    required: false,
    default: SortDirection.DESC,
  })
  @IsEnum(SortDirection)
  @IsOptional()
  sortDirection?: SortDirection;

  @ApiProperty({ example: 1, required: false, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @ApiProperty({ example: 20, required: false, default: 20 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number;
}
