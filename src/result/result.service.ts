import { Injectable, NotFoundException } from '@nestjs/common';
import { Result, ResultStatus } from './entities/result.entity';
import { OrderService } from '../order/order.service';
import { CreateResultDto } from './dto/create-result.dto';
import { SearchResultsDto } from './dto/search-results.dto';
import { ExamType } from '../order/entities/order.entity';
import { ResultRepository } from './result.repository';

export interface ReferenceRange {
  min: number;
  max: number;
}

export interface ResultReportItem {
  resultId: string;
  examType: ExamType;
  value: number;
  unit: string;
  status: ResultStatus;
  referenceMin: number | null;
  referenceMax: number | null;
  flag: 'LOW' | 'NORMAL' | 'HIGH' | 'UNKNOWN';
  sourceSystem: string | null;
  resultDate: Date;
}

export interface ResultReport {
  orderId: string;
  examType: ExamType;
  items: ResultReportItem[];
  summary: {
    total: number;
    preliminary: number;
    final: number;
    corrected: number;
    abnormal: number;
  };
}

@Injectable()
export class ResultService {
  constructor(
    private readonly resultRepository: ResultRepository,
    private readonly orderService: OrderService,
  ) {}

  // CCM BAIXA — função 5
  async createResult(dto: CreateResultDto): Promise<Result> {
    await this.orderService.validateOrderResult(dto.orderId);

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

  // CCM MÉDIA — função 10
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

  // CCM ALTA — função 15
  async buildResultReport(orderId: string): Promise<ResultReport> {
    const order = await this.orderService.getOrderById(orderId);
    const results = await this.resultRepository.findByOrderId(orderId);

    const summary = {
      total: results.length,
      preliminary: 0,
      final: 0,
      corrected: 0,
      abnormal: 0,
    };

    const items: ResultReportItem[] = results.map((result) => {
      // contabiliza por status
      if (result.status === ResultStatus.PRELIMINARY) {
        summary.preliminary++;
      } else if (result.status === ResultStatus.FINAL) {
        summary.final++;
      } else if (result.status === ResultStatus.CORRECTED) {
        summary.corrected++;
      }

      // calcula flag de referência
      const flag = this.calculateFlag(result);

      if (flag === 'LOW' || flag === 'HIGH') {
        summary.abnormal++;
      }

      return {
        resultId: result.id,
        examType: order.examType,
        value: Number(result.value),
        unit: result.unit,
        status: result.status,
        referenceMin: result.referenceMin ? Number(result.referenceMin) : null,
        referenceMax: result.referenceMax ? Number(result.referenceMax) : null,
        flag,
        sourceSystem: result.sourceSystem,
        resultDate: result.resultDate,
      };
    });

    return {
      orderId,
      examType: order.examType,
      items,
      summary,
    };
  }

  private calculateFlag(result: Result): 'LOW' | 'NORMAL' | 'HIGH' | 'UNKNOWN' {
    const value = Number(result.value);

    if (result.referenceMin === null && result.referenceMax === null) {
      return 'UNKNOWN';
    }

    if (result.referenceMin !== null && value < Number(result.referenceMin)) {
      return 'LOW';
    }

    if (result.referenceMax !== null && value > Number(result.referenceMax)) {
      return 'HIGH';
    }

    return 'NORMAL';
  }
}
