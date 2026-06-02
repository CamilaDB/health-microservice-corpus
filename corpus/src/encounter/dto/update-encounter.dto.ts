import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { Ward } from '../enums/ward.enum';

export class UpdateEncounterDto {
  @ApiProperty({ example: '2024-01-15', required: false })
  @IsDateString()
  @IsOptional()
  admitDate?: string;

  @ApiProperty({ enum: Ward, required: false })
  @IsEnum(Ward)
  @IsOptional()
  ward?: Ward;
}
