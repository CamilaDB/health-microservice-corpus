import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateOrderDto {
  @ApiProperty({ example: 'Dr. Maria Souza', required: false })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  requestedBy?: string;

  @ApiProperty({ example: 'Paciente em jejum de 12h', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
