import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { AdtType } from '../enums/adt-type.enum';
import { Ward } from '../enums/ward.enum';

export class CreateEncounterDto {
  @ApiProperty({ example: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty({ enum: AdtType, example: AdtType.A01 })
  @IsEnum(AdtType)
  adtType: AdtType;

  @ApiProperty({ example: '2026-01-15' })
  @IsDateString()
  admitDate: string;

  @ApiProperty({ enum: Ward, example: Ward.EMERGENCY, required: false })
  @IsEnum(Ward)
  @IsOptional()
  ward?: Ward;
}
