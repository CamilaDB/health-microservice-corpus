// AUTO-GENERATED-BOOTSTRAP-START
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { EncounterStatus } from '../encounter/enums/encounter-status.enum';
import { ResultStatus } from '../result/enums/result-status.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { SearchOrdersAdvancedDto } from './dto/search-orders-advanced.dto';
import { SearchOrdersDto } from './dto/search-orders.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { ExamType } from './enums/exam-type.enum';
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

  describe('getOrderById', () => {
  it('returns the order when found', async () => {
    const mockOrder: Order = {
      id: 'order-123',
      encounterId: 'enc-1',
      examType: ExamType.HEMOGRAM,
      status: OrderStatus.PENDING,
      requestedAt: new Date(),
      requestedBy: 'user-1',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      encounter: {} as any,
      results: [],
    };
    orderRepositoryMock.findById.mockResolvedValueOnce(mockOrder);
    const result = await service.getOrderById('order-123');
    expect(result).toBe(mockOrder);
    expect(orderRepositoryMock.findById).toHaveBeenCalledWith('order-123');
  });

  it('throws NotFoundException when order does not exist', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce(undefined);
    await expect(service.getOrderById('nonexistent-id')).rejects.toThrow(NotFoundException);
    expect(orderRepositoryMock.findById).toHaveBeenCalledWith('nonexistent-id');
  });
});

  describe('createOrder', () => {
  it('throws BadRequestException when encounter is discharged', async () => {
    const dto: CreateOrderDto = {
      encounterId: 'enc1',
      examType: ExamType.HEMOGRAM,
      requestedAt: new Date().toISOString(),
      requestedBy: 'user1',
    };
    encounterServiceMock.getEncounterById.mockResolvedValue({
      id: 'enc1',
      status: EncounterStatus.DISCHARGED,
      admitDate: new Date(),
    } as any);
    await expect(service.createOrder(dto)).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequestException when requestedAt is before admitDate', async () => {
    const admitDate = new Date('2023-01-02T00:00:00Z');
    const dto: CreateOrderDto = {
      encounterId: 'enc2',
      examType: ExamType.GLUCOSE,
      requestedAt: new Date('2023-01-01T00:00:00Z').toISOString(),
      requestedBy: 'user2',
    };
    encounterServiceMock.getEncounterById.mockResolvedValue({
      id: 'enc2',
      status: EncounterStatus.ADMITTED,
      admitDate,
    } as any);
    await expect(service.createOrder(dto)).rejects.toThrow(BadRequestException);
  });

  it('throws ConflictException when a pending order already exists', async () => {
    const dto: CreateOrderDto = {
      encounterId: 'enc3',
      examType: ExamType.CREATININE,
      requestedAt: new Date().toISOString(),
      requestedBy: 'user3',
    };
    encounterServiceMock.getEncounterById.mockResolvedValue({
      id: 'enc3',
      status: EncounterStatus.ADMITTED,
      admitDate: new Date('2023-01-01T00:00:00Z'),
    } as any);
    orderRepositoryMock.existsPendingOrder.mockResolvedValue(true);
    await expect(service.createOrder(dto)).rejects.toThrow(ConflictException);
  });

  it('creates and saves order when all validations pass', async () => {
    const dto: CreateOrderDto = {
      encounterId: 'enc4',
      examType: ExamType.TSH,
      requestedAt: new Date('2023-01-05T00:00:00Z').toISOString(),
      requestedBy: 'user4',
      notes: 'test note',
    };
    const encounter = {
      id: 'enc4',
      status: EncounterStatus.ADMITTED,
      admitDate: new Date('2023-01-01T00:00:00Z'),
    } as any;
    encounterServiceMock.getEncounterById.mockResolvedValue(encounter);
    orderRepositoryMock.existsPendingOrder.mockResolvedValue(false);
    const createdOrder = {} as any;
    orderRepositoryMock.create.mockReturnValue(createdOrder);
    const savedOrder = { id: 'order1' } as any;
    orderRepositoryMock.save.mockResolvedValue(savedOrder);
    const result = await service.createOrder(dto);
    expect(orderRepositoryMock.create).toHaveBeenCalledWith({
      ...dto,
      requestedAt: new Date(dto.requestedAt),
      status: OrderStatus.PENDING,
      notes: dto.notes ?? null,
    });
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(createdOrder);
    expect(result).toBe(savedOrder);
  });
});

  describe('searchOrders', () => {
  it('should return orders from repository search', async () => {
    const mockOrders: Order[] = [
      {
        id: '1',
        encounterId: 'e1',
        examType: ExamType.HEMOGRAM,
        status: OrderStatus.PENDING,
        requestedAt: new Date(),
        requestedBy: 'user1',
        notes: null,
        created_at: new Date(),
        updated_at: new Date(),
        encounter: {} as any,
        results: [],
      },
    ];
    const dto: SearchOrdersDto = {
      status: OrderStatus.PENDING,
      dateFrom: '2023-01-01',
      dateTo: '2023-12-31',
      patientId: 'p1',
      encounterId: 'e1',
    };
    orderRepositoryMock.search.mockResolvedValue(mockOrders);
    const result = await service.searchOrders(dto);
    expect(orderRepositoryMock.search).toHaveBeenCalledWith(dto);
    expect(result).toBe(mockOrders);
  });
});

  describe('searchOrdersAdvanced', () => {
  it('should return paginated orders from repository', async () => {
    const dto = {
      status: undefined,
      examType: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      patientId: undefined,
      encounterId: undefined,
      requestedBy: undefined,
      sortBy: undefined,
      sortDirection: undefined,
      page: 1,
      limit: 10,
    } as any;
    const expectedResult = {
      data: [] as any[],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };
    orderRepositoryMock.searchAdvanced.mockResolvedValue(expectedResult);
    await expect(service.searchOrdersAdvanced(dto)).resolves.toEqual(expectedResult);
    expect(orderRepositoryMock.searchAdvanced).toHaveBeenCalledWith(dto);
  });

  it('should propagate repository errors', async () => {
    const dto = {} as any;
    const error = new BadRequestException('invalid');
    orderRepositoryMock.searchAdvanced.mockRejectedValue(error);
    await expect(service.searchOrdersAdvanced(dto)).rejects.toThrow(BadRequestException);
    expect(orderRepositoryMock.searchAdvanced).toHaveBeenCalledWith(dto);
  });
});

  describe('validateOrderResult', () => {
  it('throws BadRequestException when order is cancelled', async () => {
    const order = { id: 'o1', encounterId: 'e1', status: OrderStatus.CANCELLED, results: [] } as any;
    jest.spyOn(service as any, 'getOrderById').mockResolvedValue(order);
    await expect(
      service.validateOrderResult('o1', ResultStatus.PRELIMINARY),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequestException when order is completed', async () => {
    const order = { id: 'o2', encounterId: 'e2', status: OrderStatus.COMPLETED, results: [] } as any;
    jest.spyOn(service as any, 'getOrderById').mockResolvedValue(order);
    await expect(
      service.validateOrderResult('o2', ResultStatus.PRELIMINARY),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequestException when encounter is discharged', async () => {
    const order = { id: 'o3', encounterId: 'e3', status: OrderStatus.IN_PROGRESS, results: [] } as any;
    const encounter = { status: EncounterStatus.DISCHARGED } as any;
    jest.spyOn(service as any, 'getOrderById').mockResolvedValue(order);
    encounterServiceMock.getEncounterById.mockResolvedValue(encounter);
    await expect(
      service.validateOrderResult('o3', ResultStatus.PRELIMINARY),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequestException when order already has final result', async () => {
    const order = {
      id: 'o4',
      encounterId: 'e4',
      status: OrderStatus.IN_PROGRESS,
      results: [{ status: ResultStatus.FINAL }],
    } as any;
    const encounter = { status: EncounterStatus.ADMITTED } as any;
    jest.spyOn(service as any, 'getOrderById').mockResolvedValue(order);
    encounterServiceMock.getEncounterById.mockResolvedValue(encounter);
    await expect(
      service.validateOrderResult('o4', ResultStatus.PRELIMINARY),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequestException when pending order receives FINAL result', async () => {
    const order = { id: 'o5', encounterId: 'e5', status: OrderStatus.PENDING, results: [] } as any;
    const encounter = { status: EncounterStatus.ADMITTED } as any;
    jest.spyOn(service as any, 'getOrderById').mockResolvedValue(order);
    encounterServiceMock.getEncounterById.mockResolvedValue(encounter);
    await expect(
      service.validateOrderResult('o5', ResultStatus.FINAL),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequestException when pending order receives CORRECTED result', async () => {
    const order = { id: 'o6', encounterId: 'e6', status: OrderStatus.PENDING, results: [] } as any;
    const encounter = { status: EncounterStatus.ADMITTED } as any;
    jest.spyOn(service as any, 'getOrderById').mockResolvedValue(order);
    encounterServiceMock.getEncounterById.mockResolvedValue(encounter);
    await expect(
      service.validateOrderResult('o6', ResultStatus.CORRECTED),
    ).rejects.toThrow(BadRequestException);
  });

  it('transitions pending order to IN_PROGRESS and saves', async () => {
    const order = { id: 'o7', encounterId: 'e7', status: OrderStatus.PENDING, results: [] } as any;
    const saved = { ...order, status: OrderStatus.IN_PROGRESS };
    const encounter = { status: EncounterStatus.ADMITTED } as any;
    jest.spyOn(service as any, 'getOrderById').mockResolvedValue(order);
    encounterServiceMock.getEncounterById.mockResolvedValue(encounter);
    orderRepositoryMock.save.mockResolvedValue(saved);
    const result = await service.validateOrderResult('o7', ResultStatus.PRELIMINARY);
    expect(result.status).toBe(OrderStatus.IN_PROGRESS);
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
  });

  it('transitions in-progress order with FINAL result to COMPLETED and saves', async () => {
    const order = { id: 'o8', encounterId: 'e8', status: OrderStatus.IN_PROGRESS, results: [] } as any;
    const saved = { ...order, status: OrderStatus.COMPLETED };
    const encounter = { status: EncounterStatus.ADMITTED } as any;
    jest.spyOn(service as any, 'getOrderById').mockResolvedValue(order);
    encounterServiceMock.getEncounterById.mockResolvedValue(encounter);
    orderRepositoryMock.save.mockResolvedValue(saved);
    const result = await service.validateOrderResult('o8', ResultStatus.FINAL);
    expect(result.status).toBe(OrderStatus.COMPLETED);
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
  });

  it('returns order unchanged for in-progress order with non-final result', async () => {
    const order = { id: 'o9', encounterId: 'e9', status: OrderStatus.IN_PROGRESS, results: [] } as any;
    const encounter = { status: EncounterStatus.ADMITTED } as any;
    jest.spyOn(service as any, 'getOrderById').mockResolvedValue(order);
    encounterServiceMock.getEncounterById.mockResolvedValue(encounter);
    const result = await service.validateOrderResult('o9', ResultStatus.PRELIMINARY);
    expect(result).toBe(order);
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });
});

  describe('cancelOrder', () => {
  it('cancels an order that is not already cancelled', async () => {
    const order = {
      id: 'order-1',
      status: OrderStatus.PENDING,
    } as Order;
    jest.spyOn(service as any, 'getOrderById').mockResolvedValue(order);
    orderRepositoryMock.save.mockResolvedValue({
      ...order,
      status: OrderStatus.CANCELLED,
    } as Order);
    const result = await service.cancelOrder('order-1');
    expect(result.status).toBe(OrderStatus.CANCELLED);
    expect(orderRepositoryMock.save).toHaveBeenCalledWith({
      ...order,
      status: OrderStatus.CANCELLED,
    });
  });

  it('throws BadRequestException when order is already cancelled', async () => {
    const order = {
      id: 'order-2',
      status: OrderStatus.CANCELLED,
    } as Order;
    jest.spyOn(service as any, 'getOrderById').mockResolvedValue(order);
    await expect(service.cancelOrder('order-2')).rejects.toThrow(BadRequestException);
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });
});

  describe('updateOrder', () => {
  it('throws BadRequestException when order status is CANCELLED', async () => {
    const cancelledOrder = {
      id: '1',
      status: OrderStatus.CANCELLED,
      requestedBy: 'old',
      notes: 'old',
    } as unknown as Order;
    orderRepositoryMock.findById.mockResolvedValueOnce(cancelledOrder);
    await expect(
      service.updateOrder('1', { notes: 'new' } as UpdateOrderDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequestException when updating requestedBy on IN_PROGRESS order', async () => {
    const inProgressOrder = {
      id: '2',
      status: OrderStatus.IN_PROGRESS,
      requestedBy: 'old',
      notes: 'old',
    } as unknown as Order;
    orderRepositoryMock.findById.mockResolvedValueOnce(inProgressOrder);
    await expect(
      service.updateOrder('2', { requestedBy: 'new' } as UpdateOrderDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('updates notes and requestedBy on PENDING order and returns saved order', async () => {
    const pendingOrder = {
      id: '3',
      status: OrderStatus.PENDING,
      requestedBy: 'old',
      notes: 'old',
    } as unknown as Order;
    const savedOrder = {
      ...pendingOrder,
      requestedBy: 'newUser',
      notes: 'new notes',
    } as Order;
    orderRepositoryMock.findById.mockResolvedValueOnce(pendingOrder);
    orderRepositoryMock.save.mockResolvedValueOnce(savedOrder);
    const result = await service.updateOrder('3', {
      requestedBy: 'newUser',
      notes: 'new notes',
    } as UpdateOrderDto);
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(pendingOrder);
    expect(result).toBe(savedOrder);
  });
});

  // TESTS_APPEND_HERE
});
