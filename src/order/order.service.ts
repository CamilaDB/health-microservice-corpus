import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Order, OrderStatus } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { SearchOrdersDto } from './dto/search-orders.dto';
import { EncounterStatus } from '../encounter/entities/encounter.entity';
import { OrderRepository, PaginatedOrders } from './order.repository';
import { EncounterService } from 'src/encounter/encounter.service';
import { SearchOrdersAdvancedDto } from './dto/search-orders-advanced';

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

  async validateOrderResult(orderId: string): Promise<Order> {
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

    if (order.status === OrderStatus.PENDING) {
      order.status = OrderStatus.IN_PROGRESS;
      return this.orderRepository.save(order);
    }

    return order;
  }
}
