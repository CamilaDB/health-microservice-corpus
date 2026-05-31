import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Order } from './entities/order.entity';
import { SearchOrdersDto } from './dto/search-orders.dto';
import { SearchOrdersAdvancedDto } from './dto/search-orders-advanced';
import { OrderSortField } from './enums/order-sort-field.enum';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { PaginatedOrders } from './interfaces/order.interface';
import { ExamType } from './enums/exam-type.enum';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly repo: Repository<Order>,
  ) {}

  findById(id: string): Promise<Order | null> {
    return this.repo.findOne({ where: { id }, relations: ['results'] });
  }

  search(dto: SearchOrdersDto): Promise<Order[]> {
    const qb = this.repo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.encounter', 'encounter');

    if (dto.status) {
      qb.andWhere('order.status = :status', { status: dto.status });
    }

    if (dto.dateFrom) {
      qb.andWhere('order.requestedAt >= :dateFrom', { dateFrom: dto.dateFrom });
    }

    if (dto.dateTo) {
      qb.andWhere('order.requestedAt <= :dateTo', { dateTo: dto.dateTo });
    }

    if (dto.patientId) {
      qb.andWhere('encounter.patientId = :patientId', {
        patientId: dto.patientId,
      });
    }

    return qb.getMany();
  }

  async searchAdvanced(dto: SearchOrdersAdvancedDto): Promise<PaginatedOrders> {
    const qb = this.repo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.encounter', 'encounter');

    this.applyAdvancedFilters(qb, dto);

    const sortField = dto.sortBy ?? OrderSortField.REQUESTED_AT;
    const sortDirection = dto.sortDirection ?? SortDirection.DESC;
    qb.orderBy(`order.${sortField}`, sortDirection);

    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  existsPendingOrder(
    encounterId: string,
    examType: ExamType,
  ): Promise<boolean> {
    return this.repo.exists({
      where: { encounterId, examType, status: OrderStatus.PENDING },
    });
  }

  async cancelOpenOrdersByEncounter(encounterId: string): Promise<number> {
    const result = await this.repo
      .createQueryBuilder()
      .update(Order)
      .set({ status: OrderStatus.CANCELLED })
      .where('encounterId = :encounterId', {
        encounterId,
      })
      .andWhere('status IN (:...statuses)', {
        statuses: [OrderStatus.PENDING, OrderStatus.IN_PROGRESS],
      })
      .execute();

    return result.affected ?? 0;
  }

  save(order: Order): Promise<Order> {
    return this.repo.save(order);
  }

  create(data: Partial<Order>): Order {
    return this.repo.create(data);
  }

  private applyAdvancedFilters(
    qb: SelectQueryBuilder<Order>,
    dto: SearchOrdersAdvancedDto,
  ): void {
    if (dto.status) {
      qb.andWhere('order.status = :status', { status: dto.status });
    }

    if (dto.examType) {
      qb.andWhere('order.examType = :examType', { examType: dto.examType });
    }

    if (dto.dateFrom) {
      qb.andWhere('order.requestedAt >= :dateFrom', { dateFrom: dto.dateFrom });
    }

    if (dto.dateTo) {
      qb.andWhere('order.requestedAt <= :dateTo', { dateTo: dto.dateTo });
    }

    if (dto.patientId) {
      qb.andWhere('encounter.patientId = :patientId', {
        patientId: dto.patientId,
      });
    }

    if (dto.encounterId) {
      qb.andWhere('order.encounterId = :encounterId', {
        encounterId: dto.encounterId,
      });
    }

    if (dto.requestedBy) {
      qb.andWhere('order.requestedBy ILIKE :requestedBy', {
        requestedBy: `%${dto.requestedBy}%`,
      });
    }
  }
}
