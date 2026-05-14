import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from './entities/result.entity';
import { SearchResultsDto } from './dto/search-results.dto';

@Injectable()
export class ResultRepository {
  constructor(
    @InjectRepository(Result)
    private readonly repo: Repository<Result>,
  ) {}

  findById(id: string): Promise<Result | null> {
    return this.repo.findOne({ where: { id }, relations: ['order'] });
  }

  findByOrderId(orderId: string): Promise<Result[]> {
    return this.repo.find({ where: { orderId }, relations: ['order'] });
  }

  search(dto: SearchResultsDto): Promise<Result[]> {
    const qb = this.repo
      .createQueryBuilder('result')
      .leftJoinAndSelect('result.order', 'order');

    if (dto.orderId) {
      qb.andWhere('result.orderId = :orderId', { orderId: dto.orderId });
    }

    if (dto.status) {
      qb.andWhere('result.status = :status', { status: dto.status });
    }

    if (dto.examType) {
      qb.andWhere('order.examType = :examType', { examType: dto.examType });
    }

    if (dto.dateFrom) {
      qb.andWhere('result.resultDate >= :dateFrom', { dateFrom: dto.dateFrom });
    }

    if (dto.dateTo) {
      qb.andWhere('result.resultDate <= :dateTo', { dateTo: dto.dateTo });
    }

    if (dto.sourceSystem) {
      qb.andWhere('result.sourceSystem = :sourceSystem', {
        sourceSystem: dto.sourceSystem,
      });
    }

    return qb.getMany();
  }

  save(result: Result): Promise<Result> {
    return this.repo.save(result);
  }

  create(data: Partial<Result>): Result {
    return this.repo.create(data);
  }
}
