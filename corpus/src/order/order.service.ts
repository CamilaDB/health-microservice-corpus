import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { SearchOrdersDto } from './dto/search-orders.dto';
import { OrderRepository } from './order.repository';
import { EncounterService } from 'src/encounter/encounter.service';
import { SearchOrdersAdvancedDto } from './dto/search-orders-advanced';
import { EncounterStatus } from 'src/encounter/enums/encounter-status.enum';
import { ResultStatus } from 'src/result/enums/result-status.enum';
import { PaginatedOrders } from './interfaces/order.interface';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly encounterService: EncounterService,
  ) {}

  async getOrderById(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return order;
  }

  async createOrder(dto: CreateOrderDto): Promise<Order> {
    const encounter = await this.encounterService.getEncounterById(
      dto.encounterId,
    );

    if (encounter.status === EncounterStatus.DISCHARGED) {
      throw new BadRequestException(
        'Cannot create order for a discharged encounter',
      );
    }

    if (new Date(dto.requestedAt) < new Date(encounter.admitDate)) {
      throw new BadRequestException(
        'Order date cannot be before admission date',
      );
    }

    const existing = await this.orderRepository.existsPendingOrder(
      dto.encounterId,
      dto.examType,
    );

    if (existing) {
      throw new ConflictException(
        'A pending order for this exam already exists',
      );
    }

    const order = this.orderRepository.create({
      ...dto,
      requestedAt: new Date(dto.requestedAt),
      status: OrderStatus.PENDING,
      notes: dto.notes ?? null,
    });

    return this.orderRepository.save(order);
  }

  searchOrders(dto: SearchOrdersDto): Promise<Order[]> {
    return this.orderRepository.search(dto);
  }

  searchOrdersAdvanced(dto: SearchOrdersAdvancedDto): Promise<PaginatedOrders> {
    return this.orderRepository.searchAdvanced(dto);
  }

  async validateOrderResult(
    orderId: string,
    incomingStatus: ResultStatus,
  ): Promise<Order> {
    const order = await this.getOrderById(orderId);

    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException(
        `Cannot add result to a cancelled order (id: ${orderId})`,
      );
    }

    if (order.status === OrderStatus.COMPLETED) {
      throw new BadRequestException(
        `Order already completed (id: ${orderId}). Cannot add another result`,
      );
    }

    const encounter = await this.encounterService.getEncounterById(
      order.encounterId,
    );

    if (encounter.status === EncounterStatus.DISCHARGED) {
      throw new BadRequestException(
        `Cannot add result to an order from a discharged encounter (id: ${order.encounterId})`,
      );
    }

    const hasClosedResult = order.results?.some(
      (r) =>
        (r as unknown as { status: ResultStatus }).status ===
          ResultStatus.FINAL ||
        (r as unknown as { status: ResultStatus }).status ===
          ResultStatus.CORRECTED,
    );
    if (hasClosedResult) {
      throw new BadRequestException(
        `Order (id: ${orderId}) already has a final or corrected result`,
      );
    }

    if (
      order.status === OrderStatus.PENDING &&
      incomingStatus === ResultStatus.FINAL
    ) {
      throw new BadRequestException(
        'Cannot register a FINAL result for a PENDING order. Order must be IN_PROGRESS first',
      );
    }

    if (
      order.status === OrderStatus.PENDING &&
      incomingStatus === ResultStatus.CORRECTED
    ) {
      throw new BadRequestException(
        'Cannot register a CORRECTED result for a PENDING order',
      );
    }

    if (order.status === OrderStatus.PENDING) {
      order.status = OrderStatus.IN_PROGRESS;
      return this.orderRepository.save(order);
    }

    if (
      order.status === OrderStatus.IN_PROGRESS &&
      incomingStatus === ResultStatus.FINAL
    ) {
      order.status = OrderStatus.COMPLETED;
      return this.orderRepository.save(order);
    }

    return order;
  }

  async cancelOrder(id: string): Promise<Order> {
    const order = await this.getOrderById(id);
    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException(`Order ${id} is already cancelled`);
    }

    order.status = OrderStatus.CANCELLED;
    return this.orderRepository.save(order);
  }

  async updateOrder(id: string, dto: UpdateOrderDto): Promise<Order> {
    const order = await this.getOrderById(id);

    if (
      order.status === OrderStatus.CANCELLED ||
      order.status === OrderStatus.COMPLETED
    ) {
      throw new BadRequestException(
        `Cannot update order with status ${order.status}`,
      );
    }

    if (
      order.status === OrderStatus.IN_PROGRESS &&
      dto.requestedBy !== undefined
    ) {
      throw new BadRequestException(
        'Cannot update requestedBy for an order in progress. Only notes can be updated',
      );
    }

    const updateData: Partial<Order> = {};

    if (dto.requestedBy !== undefined) {
      updateData.requestedBy = dto.requestedBy;
    }

    if (dto.notes !== undefined) {
      updateData.notes = dto.notes;
    }

    Object.assign(order, updateData);
    return this.orderRepository.save(order);
  }
}
