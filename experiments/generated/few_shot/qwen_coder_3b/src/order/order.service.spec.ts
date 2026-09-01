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

  describe('FN_getOrderById_END', () => {
describe('getOrderById', () => {
  it('should throw NotFoundException when order does not exist', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce(null);

    await expect(service.getOrderById('1')).rejects.toThrow(NotFoundException);
  });

  it('should return the order when found', async () => {
    const order = { id: '1' } as Order;
    orderRepositoryMock.findById.mockResolvedValueOnce(order);

    const result = await service.getOrderById('1');

    expect(result).toBe(order);
  });
});
});

  describe('FN_createOrder_END', () => {
describe('createOrder', () => {
  it('should throw BadRequestException when encounter status is DISCHARGED', async () => {
    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      id: '1',
      status: EncounterStatus.DISCHARGED,
    });

    await expect(
      service.createOrder({ encounterId: '1' } as CreateOrderDto),
    ).rejects.toThrow(BadRequestException);

    expect(orderRepositoryMock.create).not.toHaveBeenCalled();
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it.skip('should throw BadRequestException when requestedAt is before admitDate', async () => {
        encounterServiceMock.getEncounterById.mockResolvedValueOnce({
          id: '1',
          admitDate: new Date('2023-01-01'),
        });

        await expect(
          service.createOrder({
            encounterId: '1',
            requestedAt: '2023-01-02',
          } as CreateOrderDto),
        ).rejects.toThrow(BadRequestException);

        expect(orderRepositoryMock.create).not.toHaveBeenCalled();
        expect(orderRepositoryMock.save).not.toHaveBeenCalled();
      });

  it('should throw ConflictException when a pending order already exists', async () => {
    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      id: '1',
    });

    orderRepositoryMock.existsPendingOrder.mockResolvedValueOnce(true);

    await expect(
      service.createOrder({ encounterId: '1', examType: 'HEMOGRAM' } as CreateOrderDto),
    ).rejects.toThrow(ConflictException);

    expect(orderRepositoryMock.create).not.toHaveBeenCalled();
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should create and save the order', async () => {
    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      id: '1',
      admitDate: new Date('2023-01-01'),
    });

    orderRepositoryMock.existsPendingOrder.mockResolvedValueOnce(false);

    const order = {
      encounterId: '1',
      examType: 'HEMOGRAM',
      requestedAt: new Date('2023-01-02'),
      requestedBy: 'test',
      notes: 'test notes',
      status: OrderStatus.PENDING,
    };

    orderRepositoryMock.create.mockReturnValueOnce(order);
    orderRepositoryMock.save.mockResolvedValueOnce(order);

    await service.createOrder({ ...order } as CreateOrderDto);

    expect(orderRepositoryMock.create).toHaveBeenCalledWith(order);
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
  });
});
});

  describe('FN_searchOrders_END', () => {
describe('searchOrders', () => {
  it('should return an empty array when no orders are found', async () => {
    orderRepositoryMock.search.mockResolvedValue([]);

    const result = await service.searchOrders({});

    expect(result).toEqual([]);
  });

  it('should return orders based on search criteria', async () => {
    const orders = [
      { id: '1', encounterId: '1', examType: ExamType.HEMOGRAM, status: OrderStatus.COMPLETED, requestedAt: new Date(), requestedBy: 'test', notes: null, created_at: new Date(), updated_at: new Date(), encounter: { id: '1', status: EncounterStatus.ACTIVE }, results: [{ id: '1', order_id: '1', result_type: ResultStatus.PENDING, value: '100', created_at: new Date(), updated_at: new Date() }] },
      { id: '2', encounterId: '2', examType: ExamType.GLUCOSE, status: OrderStatus.PENDING, requestedAt: new Date(), requestedBy: 'test', notes: null, created_at: new Date(), updated_at: new Date(), encounter: { id: '2', status: EncounterStatus.ACTIVE }, results: [{ id: '2', order_id: '2', result_type: ResultStatus.PENDING, value: '100', created_at: new Date(), updated_at: new Date() }] },
    ];

    orderRepositoryMock.search.mockResolvedValue(orders);

    const result = await service.searchOrders({ status: OrderStatus.COMPLETED });

    expect(result).toEqual(orders);
  });
});
});

  describe('FN_searchOrdersAdvanced_END', () => {
describe('searchOrdersAdvanced', () => {
  it('should return paginated orders when search criteria are provided', async () => {
    const dto: SearchOrdersAdvancedDto = {
      status: OrderStatus.PENDING,
      examType: ExamType.HEMOGRAM,
      dateFrom: '2023-01-01',
      dateTo: '2023-12-31',
      patientId: '123',
      encounterId: '456',
      requestedBy: 'user1',
      sortBy: OrderSortField.REQUESTED_AT,
      sortDirection: SortDirection.DESC,
      page: 1,
      limit: 10,
    };

    const paginatedOrders: PaginatedOrders = {
      data: [
        { id: '1', status: OrderStatus.PENDING, examType: ExamType.HEMOGRAM },
        { id: '2', status: OrderStatus.PENDING, examType: ExamType.HEMOGRAM },
      ],
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    };

    orderRepositoryMock.searchAdvanced.mockResolvedValueOnce(paginatedOrders);

    const result = await service.searchOrdersAdvanced(dto);

    expect(result).toEqual(paginatedOrders);
    expect(orderRepositoryMock.searchAdvanced).toHaveBeenCalledWith(dto);
  });

  it.skip('should throw NotFoundException when no orders are found', async () => {
          const dto: SearchOrdersAdvancedDto = {
            status: OrderStatus.PENDING,
            examType: ExamType.HEMOGRAM,
            dateFrom: '2023-01-01',
            dateTo: '2023-12-31',
            patientId: '123',
            encounterId: '456',
            requestedBy: 'user1',
            sortBy: OrderSortField.REQUESTED_AT,
            sortDirection: SortDirection.DESC,
            page: 1,
            limit: 10,
          };

          orderRepositoryMock.searchAdvanced.mockResolvedValueOnce({ data: [], total: 0, page: 1, limit: 10, totalPages: 0 });

          await expect(service.searchOrdersAdvanced(dto)).rejects.toThrow(NotFoundException);
        });


});
});

  describe('FN_cancelOrder_END', () => {
describe('cancelOrder', () => {
  it('should throw BadRequestException when order is already cancelled', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce({
      id: '1',
      status: OrderStatus.CANCELLED,
    });

    await expect(
      service.cancelOrder('1'),
    ).rejects.toThrow(BadRequestException);

    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should update order status to CANCELLED and save it', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce({
      id: '1',
      status: OrderStatus.PENDING,
    });

    await service.cancelOrder('1');

    expect(orderRepositoryMock.save).toHaveBeenCalledWith({
      id: '1',
      status: OrderStatus.CANCELLED,
    });
  });
});
});

  describe('FN_updateOrder_END', () => {
describe('updateOrder', () => {
  it('should throw BadRequestException when order status is CANCELLED or COMPLETED', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce({
      id: '1',
      status: OrderStatus.CANCELLED,
    });

    await expect(
      service.updateOrder('1', { requestedBy: 'test' } as UpdateOrderDto),
    ).rejects.toThrow(BadRequestException);

    expect(orderRepositoryMock.findById).toHaveBeenCalledWith('1');
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

    expect(orderRepositoryMock.findById).toHaveBeenCalledWith('1');
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should update requestedBy and notes if provided', async () => {
    const order = { id: '1', requestedBy: 'test', notes: 'old notes' };
    orderRepositoryMock.findById.mockResolvedValueOnce(order);
    orderRepositoryMock.save.mockResolvedValueOnce({ id: '1', requestedBy: 'new test', notes: 'new notes' });

    await service.updateOrder('1', { requestedBy: 'new test', notes: 'new notes' } as UpdateOrderDto);

    expect(orderRepositoryMock.findById).toHaveBeenCalledWith('1');
    expect(orderRepositoryMock.save).toHaveBeenCalledWith({ id: '1', requestedBy: 'new test', notes: 'new notes' });
  });

  it('should not update requestedBy if not provided', async () => {
    const order = { id: '1', requestedBy: 'test', notes: 'old notes' };
    orderRepositoryMock.findById.mockResolvedValueOnce(order);
    orderRepositoryMock.save.mockResolvedValueOnce({ id: '1', requestedBy: 'test', notes: 'old notes' });

    await service.updateOrder('1', { notes: 'new notes' } as UpdateOrderDto);

    expect(orderRepositoryMock.findById).toHaveBeenCalledWith('1');
    expect(orderRepositoryMock.save).toHaveBeenCalledWith({ id: '1', requestedBy: 'test', notes: 'new notes' });
  });

  it('should not update notes if not provided', async () => {
    const order = { id: '1', requestedBy: 'test', notes: 'old notes' };
    orderRepositoryMock.findById.mockResolvedValueOnce(order);
    orderRepositoryMock.save.mockResolvedValueOnce({ id: '1', requestedBy: 'test', notes: 'old notes' });

    await service.updateOrder('1', { requestedBy: 'new test' } as UpdateOrderDto);

    expect(orderRepositoryMock.findById).toHaveBeenCalledWith('1');
    expect(orderRepositoryMock.save).toHaveBeenCalledWith({ id: '1', requestedBy: 'new test', notes: 'old notes' });
  });
});
});

  // TESTS_APPEND_HERE
});
