import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { EncounterStatus, Ward } from '../entities/encounter.entity';

export class TransitionEncounterStatusDto {
  @ApiProperty({ enum: EncounterStatus, example: EncounterStatus.TRANSFERRED })
  @IsEnum(EncounterStatus)
  status: EncounterStatus;

  @ApiProperty({ enum: Ward, example: Ward.ICU, required: false })
  @IsEnum(Ward)
  @IsOptional()
  ward?: Ward;

  @ApiProperty({ example: '2026-01-16', required: false })
  @IsDateString()
  @IsOptional()
  transferDate?: string;

  @ApiProperty({ example: '2026-01-20', required: false })
  @IsDateString()
  @IsOptional()
  dischargeDate?: string;
}
