import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { EncounterStatus } from '../enums/encounter-status.enum';

export class ListEncountersByPatientDto {
  @ApiProperty({ enum: EncounterStatus, required: false })
  @IsEnum(EncounterStatus)
  @IsOptional()
  status?: EncounterStatus;

  @ApiProperty({
    enum: ['admitDate', 'created_at'],
    required: false,
    default: 'admitDate',
  })
  @IsOptional()
  orderBy?: 'admitDate' | 'created_at';

  @ApiProperty({ enum: ['ASC', 'DESC'], required: false, default: 'DESC' })
  @IsOptional()
  order?: 'ASC' | 'DESC';
}
