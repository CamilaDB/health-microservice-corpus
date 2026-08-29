import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Result } from './entities/result.entity';
import { OrderService } from '../order/order.service';
import { CreateResultDto } from './dto/create-result.dto';
import { SearchResultsDto } from './dto/search-results.dto';
import { ResultRepository } from './result.repository';
import { ResultStatus } from './enums/result-status.enum';
import {
  ResultReport,
  ResultReportItem,
} from './interfaces/result-report.interface';
import { ExamType } from 'src/order/enums/exam-type.enum';
import { UpdateResultDto } from './dto/update-result.dto';

@Injectable()
export class ResultService {
  constructor(
    private readonly resultRepository: ResultRepository,
    private readonly orderService: OrderService,
  ) {}

  async createResult(dto: CreateResultDto): Promise<Result> {
    await this.orderService.validateOrderResult(dto.orderId, dto.status);

    const result = this.resultRepository.create({
      ...dto,
      resultDate: new Date(dto.resultDate),
      referenceMin: dto.referenceMin ?? null,
      referenceMax: dto.referenceMax ?? null,
      sourceSystem: dto.sourceSystem ?? null,
      notes: dto.notes ?? null,
    });

    return this.resultRepository.save(result);
  }

  searchResults(dto: SearchResultsDto): Promise<Result[]> {
    return this.resultRepository.search(dto);
  }

  async getResultById(id: string): Promise<Result> {
    const result = await this.resultRepository.findById(id);
    if (!result) {
      throw new NotFoundException(`Result with id ${id} not found`);
    }
    return result;
  }

  async buildResultReport(orderId: string): Promise<ResultReport> {
    const order = await this.orderService.getOrderById(orderId);
    const results = await this.resultRepository.findByOrderId(orderId);

    if (results.length === 0) {
      throw new NotFoundException(`No results found for order ${orderId}`);
    }

    const defaultRanges: Partial<
      Record<ExamType, { min: number; max: number }>
    > = {
      [ExamType.GLUCOSE]: { min: 70, max: 99 },
      [ExamType.CREATININE]: { min: 0.6, max: 1.2 },
      [ExamType.TSH]: { min: 0.4, max: 4.0 },
    };

    const summary = {
      total: results.length,
      preliminary: 0,
      final: 0,
      corrected: 0,
      abnormal: 0,
    };

    const items: ResultReportItem[] = results.map((result) => {
      if (result.status === ResultStatus.PRELIMINARY) summary.preliminary++;
      else if (result.status === ResultStatus.FINAL) summary.final++;
      else if (result.status === ResultStatus.CORRECTED) summary.corrected++;

      // resolve referências — usa as do result, cai para padrão por examType, ou null
      const refMin =
        result.referenceMin !== null
          ? Number(result.referenceMin)
          : (defaultRanges[order.examType]?.min ?? null);

      const refMax =
        result.referenceMax !== null
          ? Number(result.referenceMax)
          : (defaultRanges[order.examType]?.max ?? null);

      // calcula flag inline
      const value = Number(result.value);
      let flag: 'LOW' | 'NORMAL' | 'HIGH' | 'UNKNOWN';

      if (refMin === null && refMax === null) {
        flag = 'UNKNOWN';
      } else if (refMin !== null && value < refMin) {
        flag = 'LOW';
      } else if (refMax !== null && value > refMax) {
        flag = 'HIGH';
      } else {
        flag = 'NORMAL';
      }

      if (flag === 'LOW' || flag === 'HIGH') summary.abnormal++;

      return {
        resultId: result.id,
        examType: order.examType,
        value,
        unit: result.unit,
        status: result.status,
        referenceMin: refMin,
        referenceMax: refMax,
        flag,
        sourceSystem: result.sourceSystem,
        resultDate: result.resultDate,
      };
    });

    return { orderId, examType: order.examType, items, summary };
  }

  async updateResult(id: string, dto: UpdateResultDto): Promise<Result> {
    const result = await this.getResultById(id);

    if (result.status === ResultStatus.CORRECTED && dto.status !== undefined) {
      throw new BadRequestException(
        'Cannot change status of a CORRECTED result — it is terminal',
      );
    }

    if (dto.status !== undefined) {
      const validTransitions: Record<ResultStatus, ResultStatus[]> = {
        [ResultStatus.PRELIMINARY]: [
          ResultStatus.FINAL,
          ResultStatus.CORRECTED,
        ],
        [ResultStatus.FINAL]: [ResultStatus.CORRECTED],
        [ResultStatus.CORRECTED]: [],
      };

      if (!validTransitions[result.status].includes(dto.status)) {
        throw new BadRequestException(
          `Invalid status transition from ${result.status} to ${dto.status}`,
        );
      }
    }

    if (dto.value !== undefined && result.status !== ResultStatus.PRELIMINARY) {
      throw new BadRequestException(
        'Cannot update value of a non-preliminary result',
      );
    }

    if (dto.unit !== undefined && result.status !== ResultStatus.PRELIMINARY) {
      throw new BadRequestException(
        'Cannot update unit of a non-preliminary result',
      );
    }

    if (
      dto.referenceMin !== undefined &&
      result.status === ResultStatus.FINAL
    ) {
      throw new BadRequestException(
        'Cannot update referenceMin of a final result',
      );
    }

    if (
      dto.referenceMax !== undefined &&
      result.status === ResultStatus.FINAL
    ) {
      throw new BadRequestException(
        'Cannot update referenceMax of a final result',
      );
    }

    const newMin =
      dto.referenceMin ??
      (result.referenceMin !== null ? Number(result.referenceMin) : null);
    const newMax =
      dto.referenceMax ??
      (result.referenceMax !== null ? Number(result.referenceMax) : null);

    if (newMin !== null && newMax !== null && newMin >= newMax) {
      throw new BadRequestException(
        'referenceMin must be less than referenceMax',
      );
    }

    const updateData: Partial<Result> = {
      ...(dto.status !== undefined && { status: dto.status }),
      ...(dto.value !== undefined && { value: dto.value }),
      ...(dto.unit !== undefined && { unit: dto.unit }),
      ...(dto.referenceMin !== undefined && { referenceMin: dto.referenceMin }),
      ...(dto.referenceMax !== undefined && { referenceMax: dto.referenceMax }),
      ...(dto.notes !== undefined && { notes: dto.notes }),
    };

    Object.assign(result, updateData);
    return this.resultRepository.save(result);
  }
}
