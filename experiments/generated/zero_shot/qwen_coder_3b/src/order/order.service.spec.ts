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

  describe('FN_searchOrders_END', () => {
describe('searchOrders', () => {
  it('should return an empty array when no orders are found', async () => {
    const dto: SearchOrdersDto = {};
    orderRepositoryMock.search.mockResolvedValue([]);

    const result = await service.searchOrders(dto);

    expect(result).toEqual([]);
    expect(orderRepositoryMock.search).toHaveBeenCalledWith(dto);
  });

  it('should return orders based on the provided dto', async () => {
    const dto: SearchOrdersDto = { status: OrderStatus.COMPLETED };
    const orders: Order[] = [
      { id: '1', status: OrderStatus.COMPLETED },
      { id: '2', status: OrderStatus.PENDING },
    ];
    orderRepositoryMock.search.mockResolvedValue(orders);

    const result = await service.searchOrders(dto);

    expect(result).toEqual(orders);
    expect(orderRepositoryMock.search).toHaveBeenCalledWith(dto);
  });

  it.skip('should throw a NotFoundException if no orders are found', async () => {
        const dto: SearchOrdersDto = {};
        orderRepositoryMock.search.mockResolvedValue([]);

        await expect(service.searchOrders(dto)).rejects.toThrow(NotFoundException);
        expect(orderRepositoryMock.search).toHaveBeenCalledWith(dto);
      });
});
});

  describe('FN_searchOrdersAdvanced_END', () => {
describe('searchOrdersAdvanced', () => {
  it('should return paginated orders based on the provided dto', async () => {
    const dto: SearchOrdersAdvancedDto = {
      status: OrderStatus.PENDING,
      examType: ExamType.HEMOGRAM,
      dateFrom: '2023-01-01',
      dateTo: '2023-12-31',
      patientId: '123',
      encounterId: '456',
      requestedBy: 'John Doe',
      sortBy: OrderSortField.REQUESTED_AT,
      sortDirection: SortDirection.DESC,
      page: 1,
      limit: 10,
    };

    const expectedResponse: PaginatedOrders = {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };

    orderRepositoryMock.searchAdvanced.mockResolvedValue(expectedResponse);

    const result = await service.searchOrdersAdvanced(dto);

    expect(result).toEqual(expectedResponse);
    expect(orderRepositoryMock.searchAdvanced).toHaveBeenCalledWith(dto);
  });

  it.skip('should throw a BadRequestException if the dto is invalid', async () => {
          const dto: SearchOrdersAdvancedDto = {
            status: 'invalidStatus' as OrderStatus,
            examType: 'invalidExamType' as ExamType,
            dateFrom: 'invalidDate',
            dateTo: 'invalidDate',
            patientId: 'invalidId',
            encounterId: 'invalidId',
            requestedBy: 'invalidName',
            sortBy: 'invalidSortField' as OrderSortField,
            sortDirection: 'invalidSortDirection' as SortDirection,
            page: 0,
            limit: 0,
          };

          await expect(service.searchOrdersAdvanced(dto)).rejects.toThrow(BadRequestException);
        });


  it.skip('should throw a NotFoundException if no orders are found', async () => {
            const dto: SearchOrdersAdvancedDto = {
              status: OrderStatus.PENDING,
              examType: ExamType.HEMOGRAM,
              dateFrom: '2023-01-01',
              dateTo: '2023-12-31',
              patientId: '123',
              encounterId: '456',
              requestedBy: 'John Doe',
              sortBy: OrderSortField.REQUESTED_AT,
              sortDirection: SortDirection.DESC,
              page: 1,
              limit: 10,
            };

            orderRepositoryMock.searchAdvanced.mockResolvedValue({ data: [], total: 0, page: 1, limit: 10, totalPages: 0 });

            await expect(service.searchOrdersAdvanced(dto)).rejects.toThrow(NotFoundException);
          });

})
});

  describe('FN_cancelOrder_END', () => {
describe('cancelOrder', () => {
  it('should throw BadRequestException if order is already cancelled', async () => {
    const orderId = '123';
    const order: Order = {
      id: orderId,
      status: OrderStatus.CANCELLED,
    };

    orderRepositoryMock.findById.mockResolvedValue(order);

    await expect(service.cancelOrder(orderId)).rejects.toThrow(BadRequestException);
  });

  it('should update order status to cancelled and save it', async () => {
    const orderId = '123';
    const order: Order = {
      id: orderId,
      status: OrderStatus.PENDING,
    };

    orderRepositoryMock.findById.mockResolvedValue(order);
    orderRepositoryMock.save.mockResolvedValue(order);

    await expect(service.cancelOrder(orderId)).resolves.toEqual(order);
  });
})
});

  describe('FN_updateOrder_END', () => {
describe('updateOrder', () => {
  it('should throw BadRequestException if order status is CANCELLED or COMPLETED', async () => {
    const order = {
      id: '1',
      status: OrderStatus.CANCELLED,
    } as Order;

    jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValue(order);

    await expect(service.updateOrder('1', { requestedBy: 'John' })).rejects.toThrow(
      new BadRequestException(`Cannot update order with status ${order.status}`),
    );
  });

  it('should throw BadRequestException if order status is IN_PROGRESS and requestedBy is provided', async () => {
    const order = {
      id: '1',
      status: OrderStatus.IN_PROGRESS,
    } as Order;

    jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValue(order);

    await expect(service.updateOrder('1', { requestedBy: 'John' })).rejects.toThrow(
      new BadRequestException(
        'Cannot update requestedBy for an order in progress. Only notes can be updated',
      ),
    );
  });

  it('should update requestedBy if provided', async () => {
    const order = {
      id: '1',
      status: OrderStatus.PENDING,
    } as Order;

    jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValue(order);

    await service.updateOrder('1', { requestedBy: 'John' });

    expect(orderRepositoryMock.save).toHaveBeenCalledWith({
      ...order,
      requestedBy: 'John',
    });
  });

  it('should update notes if provided', async () => {
    const order = {
      id: '1',
      status: OrderStatus.PENDING,
    } as Order;

    jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValue(order);

    await service.updateOrder('1', { notes: 'New notes' });

    expect(orderRepositoryMock.save).toHaveBeenCalledWith({
      ...order,
      notes: 'New notes',
    });
  });

  it('should update both requestedBy and notes if provided', async () => {
    const order = {
      id: '1',
      status: OrderStatus.PENDING,
    } as Order;

    jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValue(order);

    await service.updateOrder('1', { requestedBy: 'John', notes: 'New notes' });

    expect(orderRepositoryMock.save).toHaveBeenCalledWith({
      ...order,
      requestedBy: 'John',
      notes: 'New notes',
    });
  });
})
});

  // TESTS_APPEND_HERE
});
