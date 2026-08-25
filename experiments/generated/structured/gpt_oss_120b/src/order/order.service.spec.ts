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

  describe('FN_getOrderById_END', () => {
describe('getOrderById', () => {
  it('should return the order when it exists', async () => {
    const mockOrder: Order = {
      id: 'order-id',
      encounterId: 'encounter-id',
      examType: ExamType.HEMOGRAM,
      status: OrderStatus.PENDING,
      requestedAt: new Date(),
      requestedBy: 'user-id',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      encounter: {} as any,
      results: [] as any[],
    };
    orderRepositoryMock.findById.mockResolvedValueOnce(mockOrder);
    const result = await service.getOrderById('order-id');
    expect(result).toBe(mockOrder);
  });

  it('should throw NotFoundException when the order does not exist', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce(undefined);
    await expect(service.getOrderById('nonexistent-id')).rejects.toThrow(NotFoundException);
  });
});
});

  describe('FN_createOrder_END', () => {
describe('createOrder', () => {
  it('should throw BadRequestException when encounter is discharged', async () => {
    const dto: CreateOrderDto = {
      encounterId: 'enc1',
      examType: ExamType.HEMOGRAM,
      requestedAt: new Date().toISOString(),
      requestedBy: 'user1',
    };
    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      id: 'enc1',
      status: EncounterStatus.DISCHARGED,
      admitDate: new Date(),
    } as any);
    await expect(service.createOrder(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when requestedAt is before admission date', async () => {
    const admitDate = new Date('2023-01-10T10:00:00Z');
    const dto: CreateOrderDto = {
      encounterId: 'enc2',
      examType: ExamType.GLUCOSE,
      requestedAt: new Date('2023-01-05T09:00:00Z').toISOString(),
      requestedBy: 'user2',
    };
    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      id: 'enc2',
      status: EncounterStatus.ADMITTED,
      admitDate,
    } as any);
    await expect(service.createOrder(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw ConflictException when a pending order already exists', async () => {
    const admitDate = new Date('2023-01-01T08:00:00Z');
    const dto: CreateOrderDto = {
      encounterId: 'enc3',
      examType: ExamType.CREATININE,
      requestedAt: new Date('2023-01-02T09:00:00Z').toISOString(),
      requestedBy: 'user3',
    };
    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      id: 'enc3',
      status: EncounterStatus.ADMITTED,
      admitDate,
    } as any);
    orderRepositoryMock.existsPendingOrder.mockResolvedValueOnce(true);
    await expect(service.createOrder(dto)).rejects.toThrow(ConflictException);
  });
});
});

  describe('FN_searchOrders_END', () => {
describe('searchOrders', () => {
  it('should return orders from repository', async () => {
    const dto: SearchOrdersDto = {
      status: OrderStatus.PENDING,
      dateFrom: '2023-01-01',
      dateTo: '2023-12-31',
      patientId: 'patient-123',
      encounterId: 'encounter-456',
    };
    const expectedOrders: Order[] = [
      {
        id: 'order-1',
        encounterId: 'encounter-456',
        examType: ExamType.HEMOGRAM,
        status: OrderStatus.PENDING,
        requestedAt: new Date('2023-06-01T10:00:00Z'),
        requestedBy: 'doctor-1',
        notes: null,
        created_at: new Date(),
        updated_at: new Date(),
        encounter: {} as any,
        results: [] as any[],
      },
    ];
    orderRepositoryMock.search.mockReturnValueOnce(expectedOrders);
    const result = await service.searchOrders(dto);
    expect(result).toBe(expectedOrders);
    expect(orderRepositoryMock.search).toHaveBeenCalledWith(dto);
  });
});
});

  describe('FN_searchOrdersAdvanced_END', () => {
describe('searchOrdersAdvanced', () => {
  it('should return paginated orders from repository', async () => {
            const dto: SearchOrdersAdvancedDto = {
              status: OrderStatus.PENDING,
              examType: ExamType.HEMOGRAM,
              dateFrom: '2023-01-01',
              dateTo: '2023-01-31',
              patientId: 'patient-1',
              encounterId: 'enc-1',
              requestedBy: 'user-1',
              page: 1,
              limit: 10,
            };
            const expected: PaginatedOrders = {
              data: [] as Order[],
              total: 0,
              page: 1,
              limit: 10,
              totalPages: 0,
            };
            orderRepositoryMock.searchAdvanced.mockReturnValueOnce(expected);
            const result = await service.searchOrdersAdvanced(dto);
            expect(result).toBe(expected);
            expect(orderRepositoryMock.searchAdvanced).toHaveBeenCalledWith(dto);
          });


});
});

  describe('FN_validateOrderResult_END', () => {
describe('validateOrderResult', () => {
  it('should throw BadRequestException when order is cancelled', async () => {
    const order = {
      id: 'order-1',
      encounterId: 'enc-1',
      examType: ExamType.HEMOGRAM,
      status: OrderStatus.CANCELLED,
      requestedAt: new Date(),
      requestedBy: 'user-1',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      results: [],
    } as Order;
    jest.spyOn(service as any, 'getOrderById').mockResolvedValueOnce(order);
    await expect(
      service.validateOrderResult('order-1', ResultStatus.PRELIMINARY),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when order is completed', async () => {
    const order = {
      id: 'order-2',
      encounterId: 'enc-2',
      examType: ExamType.GLUCOSE,
      status: OrderStatus.COMPLETED,
      requestedAt: new Date(),
      requestedBy: 'user-2',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      results: [],
    } as Order;
    jest.spyOn(service as any, 'getOrderById').mockResolvedValueOnce(order);
    await expect(
      service.validateOrderResult('order-2', ResultStatus.PRELIMINARY),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when encounter is discharged', async () => {
    const order = {
      id: 'order-3',
      encounterId: 'enc-3',
      examType: ExamType.CREATININE,
      status: OrderStatus.PENDING,
      requestedAt: new Date(),
      requestedBy: 'user-3',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      results: [],
    } as Order;
    const encounter = {
      id: 'enc-3',
      status: EncounterStatus.DISCHARGED,
    };
    jest.spyOn(service as any, 'getOrderById').mockResolvedValueOnce(order);
    encounterServiceMock.getEncounterById.mockResolvedValueOnce(encounter);
    await expect(
      service.validateOrderResult('order-3', ResultStatus.PRELIMINARY),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when order already has a final or corrected result', async () => {
    const order = {
      id: 'order-4',
      encounterId: 'enc-4',
      examType: ExamType.TSH,
      status: OrderStatus.IN_PROGRESS,
      requestedAt: new Date(),
      requestedBy: 'user-4',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      results: [{ status: ResultStatus.FINAL }],
    } as Order;
    const encounter = {
      id: 'enc-4',
      status: EncounterStatus.ADMITTED,
    };
    jest.spyOn(service as any, 'getOrderById').mockResolvedValueOnce(order);
    encounterServiceMock.getEncounterById.mockResolvedValueOnce(encounter);
    await expect(
      service.validateOrderResult('order-4', ResultStatus.PRELIMINARY),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when pending order receives FINAL result', async () => {
    const order = {
      id: 'order-5',
      encounterId: 'enc-5',
      examType: ExamType.URINE,
      status: OrderStatus.PENDING,
      requestedAt: new Date(),
      requestedBy: 'user-5',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      results: [],
    } as Order;
    const encounter = {
      id: 'enc-5',
      status: EncounterStatus.ADMITTED,
    };
    jest.spyOn(service as any, 'getOrderById').mockResolvedValueOnce(order);
    encounterServiceMock.getEncounterById.mockResolvedValueOnce(encounter);
    await expect(
      service.validateOrderResult('order-5', ResultStatus.FINAL),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when pending order receives CORRECTED result', async () => {
    const order = {
      id: 'order-6',
      encounterId: 'enc-6',
      examType: ExamType.HEMOGRAM,
      status: OrderStatus.PENDING,
      requestedAt: new Date(),
      requestedBy: 'user-6',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      results: [],
    } as Order;
    const encounter = {
      id: 'enc-6',
      status: EncounterStatus.ADMITTED,
    };
    jest.spyOn(service as any, 'getOrderById').mockResolvedValueOnce(order);
    encounterServiceMock.getEncounterById.mockResolvedValueOnce(encounter);
    await expect(
      service.validateOrderResult('order-6', ResultStatus.CORRECTED),
    ).rejects.toThrow(BadRequestException);
  });

  it('should transition pending order to IN_PROGRESS and save', async () => {
    const order = {
      id: 'order-7',
      encounterId: 'enc-7',
      examType: ExamType.GLUCOSE,
      status: OrderStatus.PENDING,
      requestedAt: new Date(),
      requestedBy: 'user-7',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      results: [],
    } as Order;
    const encounter = {
      id: 'enc-7',
      status: EncounterStatus.ADMITTED,
    };
    const savedOrder = { ...order, status: OrderStatus.IN_PROGRESS };
    jest.spyOn(service as any, 'getOrderById').mockResolvedValueOnce(order);
    encounterServiceMock.getEncounterById.mockResolvedValueOnce(encounter);
    orderRepositoryMock.save.mockReturnValueOnce(savedOrder);
    const result = await service.validateOrderResult(
      'order-7',
      ResultStatus.PRELIMINARY,
    );
    expect(result).toBe(savedOrder);
    expect(orderRepositoryMock.save).toHaveBeenCalledWith({
      ...order,
      status: OrderStatus.IN_PROGRESS,
    });
  });

  it('should transition in-progress order to COMPLETED when FINAL result is added and save', async () => {
    const order = {
      id: 'order-8',
      encounterId: 'enc-8',
      examType: ExamType.TSH,
      status: OrderStatus.IN_PROGRESS,
      requestedAt: new Date(),
      requestedBy: 'user-8',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      results: [],
    } as Order;
    const encounter = {
      id: 'enc-8',
      status: EncounterStatus.ADMITTED,
    };
    const savedOrder = { ...order, status: OrderStatus.COMPLETED };
    jest.spyOn(service as any, 'getOrderById').mockResolvedValueOnce(order);
    encounterServiceMock.getEncounterById.mockResolvedValueOnce(encounter);
    orderRepositoryMock.save.mockReturnValueOnce(savedOrder);
    const result = await service.validateOrderResult(
      'order-8',
      ResultStatus.FINAL,
    );
    expect(result).toBe(savedOrder);
    expect(orderRepositoryMock.save).toHaveBeenCalledWith({
      ...order,
      status: OrderStatus.COMPLETED,
    });
  });
});
});

  describe('FN_cancelOrder_END', () => {
describe('cancelOrder', () => {
  it('should throw BadRequestException when order is already cancelled', async () => {
    const order = { id: 'order-1', status: OrderStatus.CANCELLED } as Order;
    jest.spyOn(service, 'getOrderById').mockResolvedValueOnce(order);
    await expect(service.cancelOrder('order-1')).rejects.toThrow(BadRequestException);
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should cancel order and persist the change when order is not cancelled', async () => {
    const order = { id: 'order-2', status: OrderStatus.PENDING } as Order;
    const cancelledOrder = { ...order, status: OrderStatus.CANCELLED } as Order;
    jest.spyOn(service, 'getOrderById').mockResolvedValueOnce(order);
    orderRepositoryMock.save.mockResolvedValueOnce(cancelledOrder);
    const result = await service.cancelOrder('order-2');
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(expect.objectContaining({ status: OrderStatus.CANCELLED }));
    expect(result).toBe(cancelledOrder);
  });
});
});

  describe('FN_updateOrder_END', () => {
describe('updateOrder', () => {
  it('should throw BadRequestException when order status is CANCELLED', async () => {
    const order = {
      id: 'order1',
      status: OrderStatus.CANCELLED,
      requestedBy: 'userA',
      notes: null,
    } as unknown as Order;
    jest.spyOn(service, 'getOrderById').mockResolvedValueOnce(order);
    const dto: UpdateOrderDto = {};
    await expect(service.updateOrder('order1', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when order status is IN_PROGRESS and requestedBy is provided', async () => {
    const order = {
      id: 'order2',
      status: OrderStatus.IN_PROGRESS,
      requestedBy: 'userB',
      notes: null,
    } as unknown as Order;
    jest.spyOn(service, 'getOrderById').mockResolvedValueOnce(order);
    const dto: UpdateOrderDto = { requestedBy: 'newUser' };
    await expect(service.updateOrder('order2', dto)).rejects.toThrow(BadRequestException);
  });

  it('should update requestedBy when provided and order status allows it', async () => {
    const order = {
      id: 'order3',
      status: OrderStatus.PENDING,
      requestedBy: 'oldUser',
      notes: null,
    } as unknown as Order;
    const updatedOrder = {
      ...order,
      requestedBy: 'newUser',
    } as unknown as Order;
    jest.spyOn(service, 'getOrderById').mockResolvedValueOnce(order);
    orderRepositoryMock.save.mockResolvedValueOnce(updatedOrder);
    const dto: UpdateOrderDto = { requestedBy: 'newUser' };
    const result = await service.updateOrder('order3', dto);
    expect(result).toEqual(updatedOrder);
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(expect.objectContaining({ requestedBy: 'newUser' }));
  });

  it('should update notes when provided and order status allows it', async () => {
    const order = {
      id: 'order4',
      status: OrderStatus.PENDING,
      requestedBy: 'userC',
      notes: null,
    } as unknown as Order;
    const updatedOrder = {
      ...order,
      notes: 'new notes',
    } as unknown as Order;
    jest.spyOn(service, 'getOrderById').mockResolvedValueOnce(order);
    orderRepositoryMock.save.mockResolvedValueOnce(updatedOrder);
    const dto: UpdateOrderDto = { notes: 'new notes' };
    const result = await service.updateOrder('order4', dto);
    expect(result).toEqual(updatedOrder);
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(expect.objectContaining({ notes: 'new notes' }));
  });
});
});

  // TESTS_APPEND_HERE
});
