import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { EncounterStatus } from '../enums/encounter-status.enum';
import { Ward } from '../enums/ward.enum';

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
