import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EncounterService } from './encounter.service';
import { CreateEncounterDto } from './dto/create-encounter.dto';
import { TransitionEncounterStatusDto } from './dto/transition-encounter-status.dto';
import { ListEncountersByPatientDto } from './dto/list-encounters-by-patient.dto';
import { Encounter } from './entities/encounter.entity';
import { AdtMessageDto } from './dto/adt-message.dto';
import { UpdateEncounterDto } from './dto/update-encounter.dto';
import { EncounterSummary } from './interfaces/encounter.interface';

@ApiTags('encounters')
@Controller('encounters')
export class EncounterController {
  constructor(private readonly encounterService: EncounterService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo episódio de atendimento' })
  @ApiResponse({ status: 201, type: Encounter })
  @ApiResponse({ status: 404, description: 'Paciente não encontrado' })
  @ApiResponse({
    status: 409,
    description: 'Paciente já possui episódio ativo',
  })
  create(@Body() dto: CreateEncounterDto): Promise<Encounter> {
    this.encounterService.validateEncounterFields(dto);
    return this.encounterService.createEncounter(dto);
  }

  @Get('patient/:patientId')
  @ApiOperation({
    summary: 'Lista episódios de um paciente com filtros opcionais',
  })
  @ApiParam({ name: 'patientId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: [Encounter] })
  listByPatient(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query() dto: ListEncountersByPatientDto,
  ): Promise<Encounter[]> {
    return this.encounterService.listEncountersByPatient(patientId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca episódio por ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: Encounter })
  @ApiResponse({ status: 404, description: 'Episódio não encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Encounter> {
    return this.encounterService.getEncounterById(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Transiciona o status do episódio' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: Encounter })
  @ApiResponse({
    status: 400,
    description: 'Transição inválida ou regra de negócio violada',
  })
  @ApiResponse({ status: 404, description: 'Episódio não encontrado' })
  transition(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: TransitionEncounterStatusDto,
  ): Promise<Encounter> {
    return this.encounterService.transitionEncounterStatus(id, dto);
  }

  @Post('adt')
  @ApiOperation({ summary: 'Processa mensagem ADT do Mirth Connect' })
  @ApiResponse({ status: 201 })
  processAdt(@Body() dto: AdtMessageDto) {
    return this.encounterService.processAdtMessage(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Corrige dados do episódio (ward, admitDate)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: Encounter })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEncounterDto,
  ): Promise<Encounter> {
    return this.encounterService.updateEncounter(id, dto);
  }

  @Get(':id/summary')
  @ApiOperation({ summary: 'Resumo consolidado do episódio com risco clínico' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  summary(@Param('id', ParseUUIDPipe) id: string): Promise<EncounterSummary> {
    return this.encounterService.buildEncounterSummary(id);
  }
}
