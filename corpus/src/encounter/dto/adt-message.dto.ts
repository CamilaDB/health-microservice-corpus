import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { AdtType } from '../enums/adt-type.enum';
import { Ward } from '../enums/ward.enum';
import { Sex } from 'src/patient/enums/sex.enum';

export class AdtMessageDto {
  @ApiProperty({ enum: AdtType, example: AdtType.A01 })
  @IsEnum(AdtType)
  adtType: AdtType;

  @ApiProperty({ example: '12345678900' })
  @IsString()
  @Matches(/^\d{11}$/, { message: 'cpf must contain exactly 11 digits' })
  cpf: string;

  @ApiProperty({ example: 'Maria Silva', required: false })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  name?: string;

  @ApiProperty({ example: '1990-05-20', required: false })
  @IsDateString()
  @IsOptional()
  birthDate?: string;

  @ApiProperty({ enum: Sex, required: false })
  @IsEnum(Sex)
  @IsOptional()
  sex?: Sex;

  @ApiProperty({ example: 'maria@email.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '(51) 99999-0000', required: false })
  @IsString()
  @IsOptional()
  @Length(1, 20)
  phone?: string;

  @ApiProperty({ example: '2026-01-15', required: false })
  @IsDateString()
  @IsOptional()
  admitDate?: string;

  @ApiProperty({ enum: Ward, required: false })
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
