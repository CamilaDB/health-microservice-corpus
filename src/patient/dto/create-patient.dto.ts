import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Sex } from '../entities/patient.entity';

export class CreatePatientDto {
  @ApiProperty({ example: 'Maria Silva' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @ApiProperty({ example: '1990-05-20' })
  @IsDateString()
  birthDate: string;

  @ApiProperty({ example: '123.456.789-00' })
  @IsString()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: 'cpf must follow the format 000.000.000-00',
  })
  cpf: string;

  @ApiProperty({ enum: Sex, example: Sex.F })
  @IsEnum(Sex)
  sex: Sex;

  @ApiProperty({ example: 'maria@email.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '(51) 99999-0000', required: false })
  @IsString()
  @IsOptional()
  @Length(1, 20)
  phone?: string;
}
