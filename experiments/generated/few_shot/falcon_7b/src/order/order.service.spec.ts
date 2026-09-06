// AUTO-GENERATED-BOOTSTRAP-START
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { SortDirection } from '../common/enums/sort-direction.enum';
import { EncounterStatus } from '../encounter/enums/encounter-status.enum';
import { ResultStatus } from '../result/enums/result-status.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { SearchOrdersAdvancedDto } from './dto/search-orders-advanced.dto';
import { SearchOrdersDto } from './dto/search-orders.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { ExamType } from './enums/exam-type.enum';
import { OrderSortField } from './enums/order-sort-field.enum';
import { OrderStatus } from './enums/order-status.enum';
import { PaginatedOrders } from './interfaces/order.interface';
import { OrderRepository } from './order.repository';
import { EncounterService } from 'src/encounter/encounter.service';
import { OrderService } from './order.service';

describe('OrderService', () => {

  let service: OrderService;
  let orderRepositoryMock: jest.Mocked<OrderRepository>;
  let encounterServiceMock: jest.Mocked<EncounterService>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {

    orderRepositoryMock = {
      findById: jest.fn().mockResolvedValue(undefined),
      search: jest.fn().mockResolvedValue(undefined),
      searchAdvanced: jest.fn().mockResolvedValue(undefined),
      existsPendingOrder: jest.fn().mockResolvedValue(undefined),
      cancelOpenOrdersByEncounter: jest.fn().mockResolvedValue(undefined),
      save: jest.fn().mockResolvedValue(undefined),
      create: jest.fn().mockReturnValue(undefined),
    } as unknown as jest.Mocked<OrderRepository>;

    encounterServiceMock = {
      createEncounter: jest.fn().mockResolvedValue(undefined),
      validateEncounterFields: jest.fn().mockReturnValue(undefined),
      listEncountersByPatient: jest.fn().mockResolvedValue(undefined),
      getEncounterById: jest.fn().mockResolvedValue(undefined),
      transitionEncounterStatus: jest.fn().mockResolvedValue(undefined),
      processAdtMessage: jest.fn().mockResolvedValue(undefined),
      updateEncounter: jest.fn().mockResolvedValue(undefined),
      buildEncounterSummary: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<EncounterService>;

    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          OrderService,
          { provide: OrderRepository, useValue: orderRepositoryMock },
          { provide: EncounterService, useValue: encounterServiceMock },
        ],
      }).compile();

    service = module.get<OrderService>(OrderService);

  });
  // AUTO-GENERATED-BOOTSTRAP-END

  describe('FN_searchOrdersAdvanced_END', () => {
describe('searchOrdersAdvanced', () => {
  it('should call orderRepository.searchAdvanced with the provided SearchOrdersAdvancedDto', async () => {
    const searchDto: SearchOrdersAdvancedDto = {
      status: OrderStatus.IN_PROGRESS,
      examType: ExamType.HEMOGRAM,
      dateFrom: '2023-01-01',
      dateTo: '2023-01-31',
      patientId: 'patient1',
      encounterId: 'encounter1',
      requestedBy: 'user1',
      sortBy: OrderSortField.REQUESTED_AT,
      sortDirection: SortDirection.ASC,
      page: 1,
      limit: 10,
    };

    orderRepositoryMock.searchAdvanced.mockResolvedValueOnce({
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    } as PaginatedOrders);

    await service.searchOrdersAdvanced(searchDto);

    expect(orderRepositoryMock.searchAdvanced).toHaveBeenCalledWith(searchDto);
  });

  it('should return the paginated orders from the repository', async () => {
    const expectedPaginatedOrders: PaginatedOrders = {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };

    orderRepositoryMock.searchAdvanced.mockResolvedValueOnce(expectedPaginatedOrders);

    const result = await service.searchOrdersAdvanced({
      status: OrderStatus.IN_PROGRESS,
      examType: ExamType.HEMOGRAM,
      dateFrom: '2023-01-01',
      dateTo: '2023-01-31',
      patientId: 'patient1',
      encounterId: 'encounter1',
      requestedBy: 'user1',
      sortBy: OrderSortField.REQUESTED_AT,
      sortDirection: SortDirection.ASC,
      page: 1,
      limit: 10,
    } as SearchOrdersAdvancedDto);

    expect(result).toBe(expectedPaginatedOrders);
  });
});
});

  describe('FN_cancelOrder_END', () => {
describe('cancelOrder', () => {
  it('should throw BadRequestException when order is already cancelled', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce({ id: '1', status: OrderStatus.CANCELLED });

    await expect(service.cancelOrder('1')).rejects.toThrow(BadRequestException);
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should update order status to CANCELLED and save', async () => {
    const order = { id: '1', status: OrderStatus.PENDING };
    orderRepositoryMock.findById.mockResolvedValueOnce(order);
    orderRepositoryMock.save.mockResolvedValueOnce(order);

    await service.cancelOrder('1');

    expect(orderRepositoryMock.findById).toHaveBeenCalledWith('1');
    expect(orderRepositoryMock.save).toHaveBeenCalledWith({ id: '1', status: OrderStatus.CANCELLED });
  });
});
});

  describe('FN_updateOrder_END', () => {
describe('updateOrder', () => {
  it('should throw BadRequestException when order status is COMPLETED or CANCELLED', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce({
      id: '1',
      status: OrderStatus.COMPLETED,
    });

    await expect(
      service.updateOrder('1', {} as UpdateOrderDto),
    ).rejects.toThrow(BadRequestException);

    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when order status is IN_PROGRESS and requestedBy is provided', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce({
      id: '1',
      status: OrderStatus.IN_PROGRESS,
    });

    await expect(
      service.updateOrder('1', { requestedBy: 'test' } as UpdateOrderDto),
    ).rejects.toThrow(BadRequestException);

    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should update order with requestedBy and notes', async () => {
    const order = {
      id: '1',
      status: OrderStatus.PENDING,
    };

    orderRepositoryMock.findById.mockResolvedValueOnce(order);

    const updatedOrder = {
      id: '1',
      status: OrderStatus.PENDING,
      requestedBy: 'test',
      notes: 'update notes',
    };

    orderRepositoryMock.save.mockResolvedValueOnce(updatedOrder);

    await service.updateOrder('1', { requestedBy: 'test', notes: 'update notes' } as UpdateOrderDto);

    expect(orderRepositoryMock.save).toHaveBeenCalledWith(updatedOrder);
  });
});
});

  // TESTS_APPEND_HERE
});
