import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';

@ApiTags('patients')
@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo paciente' })
  @ApiResponse({ status: 201, type: Patient })
  @ApiResponse({ status: 409, description: 'CPF ou e-mail já cadastrado' })
  create(@Body() dto: CreatePatientDto): Promise<Patient> {
    return this.patientService.createPatient(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os pacientes' })
  @ApiResponse({ status: 200, type: [Patient] })
  findAll(): Promise<Patient[]> {
    return this.patientService.listPatients();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca paciente por ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: Patient })
  @ApiResponse({ status: 404, description: 'Paciente não encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Patient> {
    return this.patientService.getPatientById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza dados do paciente (CPF imutável)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: Patient })
  @ApiResponse({ status: 404, description: 'Paciente não encontrado' })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePatientDto,
  ): Promise<Patient> {
    return this.patientService.updatePatient(id, dto);
  }
}
