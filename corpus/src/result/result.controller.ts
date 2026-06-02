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
import { ResultService } from './result.service';
import { CreateResultDto } from './dto/create-result.dto';
import { SearchResultsDto } from './dto/search-results.dto';
import { Result } from './entities/result.entity';
import { ResultReport } from './interfaces/result-report.interface';
import { UpdateResultDto } from './dto/update-result.dto';

@ApiTags('results')
@Controller('results')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Post()
  @ApiOperation({ summary: 'Registra um novo resultado de exame' })
  @ApiResponse({ status: 201, type: Result })
  @ApiResponse({
    status: 400,
    description: 'Order em status inválido para receber resultado',
  })
  @ApiResponse({ status: 404, description: 'Order não encontrada' })
  create(@Body() dto: CreateResultDto): Promise<Result> {
    return this.resultService.createResult(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca resultado por ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: Result })
  @ApiResponse({ status: 404, description: 'Resultado não encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Result> {
    return this.resultService.getResultById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Busca resultados com filtros opcionais' })
  @ApiResponse({ status: 200, type: [Result] })
  search(@Query() dto: SearchResultsDto): Promise<Result[]> {
    return this.resultService.searchResults(dto);
  }

  @Get('order/:orderId/report')
  @ApiOperation({
    summary: 'Gera relatório agregado de resultados de uma ordem',
  })
  @ApiParam({ name: 'orderId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404, description: 'Order não encontrada' })
  report(
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<ResultReport> {
    return this.resultService.buildResultReport(orderId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualiza laudo — transições de status e correções',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: Result })
  @ApiResponse({
    status: 400,
    description: 'Transição inválida ou campo imutável',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateResultDto,
  ): Promise<Result> {
    return this.resultService.updateResult(id, dto);
  }
}
