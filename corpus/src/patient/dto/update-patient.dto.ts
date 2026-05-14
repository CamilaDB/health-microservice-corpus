import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { IsNotFutureDate } from 'src/common/validators/is-not-future-date.validator';
import { Sex } from '../enums/sex.enum';

export class UpdatePatientDto {
  @ApiProperty({ example: 'Maria Silva Santos', required: false })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  name?: string;

  @ApiProperty({ example: '1990-05-20', required: false })
  @IsDateString()
  @IsNotFutureDate()
  @IsOptional()
  birthDate?: string;

  @ApiProperty({ enum: Sex, example: Sex.F, required: false })
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

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
