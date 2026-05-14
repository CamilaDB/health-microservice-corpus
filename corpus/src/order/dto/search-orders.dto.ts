import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { OrderStatus } from '../enums/oreder-status.enum';

export class SearchOrdersDto {
  @ApiProperty({ enum: OrderStatus, required: false })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @ApiProperty({ example: '2026-01-01', required: false })
  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @ApiProperty({ example: '2026-01-31', required: false })
  @IsDateString()
  @IsOptional()
  dateTo?: string;

  @ApiProperty({ example: 'uuid', required: false })
  @IsUUID()
  @IsOptional()
  patientId?: string;
}
