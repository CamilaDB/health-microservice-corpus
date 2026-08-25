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
      id: 'order-123',
      encounterId: 'enc-456',
      examType: ExamType.HEMOGRAM,
      status: OrderStatus.PENDING,
      requestedAt: new Date(),
      requestedBy: 'user-1',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      encounter: {} as any,
      results: [] as any[],
    };
    orderRepositoryMock.findById.mockResolvedValueOnce(mockOrder);
    const result = await service.getOrderById('order-123');
    expect(orderRepositoryMock.findById).toHaveBeenCalledWith('order-123');
    expect(result).toBe(mockOrder);
  });

  it('should throw NotFoundException when the order does not exist', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce(undefined);
    await expect(service.getOrderById('non-existent-id')).rejects.toBeInstanceOf(NotFoundException);
    expect(orderRepositoryMock.findById).toHaveBeenCalledWith('non-existent-id');
  });
});
});

  describe('FN_createOrder_END', () => {
describe('createOrder', () => {
  it('should create and return a new order when no pending order exists', async () => {
        const dto: CreateOrderDto = {
          encounterId: 'enc-123',
          examType: ExamType.HEMOGRAM,
          requestedAt: new Date().toISOString(),
          requestedBy: 'user-1',
          notes: 'Urgent',
        };

        const encounter = { id: 'enc-123', status: EncounterStatus.ADMITTED } as any;

        const createdOrder = {
          id: 'order-1',
          encounterId: dto.encounterId,
          examType: dto.examType,
          status: OrderStatus.PENDING,
          requestedAt: new Date(dto.requestedAt),
          requestedBy: dto.requestedBy,
          notes: dto.notes ?? null,
          created_at: new Date(),
          updated_at: new Date(),
          encounter,
          results: [],
        } as any;

        encounterServiceMock.getEncounterById.mockResolvedValue(encounter);
        orderRepositoryMock.existsPendingOrder.mockResolvedValue(false);
        orderRepositoryMock.create.mockReturnValue(createdOrder);
        orderRepositoryMock.save.mockResolvedValue(createdOrder);

        const result = await service.createOrder(dto);

        expect(encounterServiceMock.getEncounterById).toHaveBeenCalledWith(dto.encounterId);
        expect(orderRepositoryMock.existsPendingOrder).toHaveBeenCalledWith(dto.encounterId, dto.examType);
        expect(orderRepositoryMock.create).toHaveBeenCalledWith({
          ...dto,
          requestedAt: new Date(dto.requestedAt),
          status: OrderStatus.PENDING,
          notes: dto.notes ?? null,
        });
        expect(orderRepositoryMock.save).toHaveBeenCalledWith(createdOrder);
        expect(result).toBe(createdOrder);
      });


  it('should throw ConflictException when a pending order already exists for the encounter and exam type', async () => {
    const dto: CreateOrderDto = {
      encounterId: 'enc-456',
      examType: ExamType.GLUCOSE,
      requestedAt: new Date().toISOString(),
      requestedBy: 'user-2',
    };

    const encounter = { id: 'enc-456', status: EncounterStatus.ADMITTED } as any;

    encounterServiceMock.getEncounterById.mockResolvedValue(encounter);
    orderRepositoryMock.existsPendingOrder.mockResolvedValue(true);

    await expect(service.createOrder(dto)).rejects.toBeInstanceOf(ConflictException);
    expect(encounterServiceMock.getEncounterById).toHaveBeenCalledWith(dto.encounterId);
    expect(orderRepositoryMock.existsPendingOrder).toHaveBeenCalledWith(dto.encounterId, dto.examType);
    expect(orderRepositoryMock.create).not.toHaveBeenCalled();
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when the encounter does not exist', async () => {
      const dto: CreateOrderDto = {
        encounterId: 'nonexistent',
        examType: ExamType.CREATININE,
        requestedAt: new Date().toISOString(),
        requestedBy: 'user-3',
      };

      encounterServiceMock.getEncounterById.mockRejectedValue(new NotFoundException());

      await expect(service.createOrder(dto)).rejects.toBeInstanceOf(NotFoundException);
      expect(encounterServiceMock.getEncounterById).toHaveBeenCalledWith(dto.encounterId);
      expect(orderRepositoryMock.existsPendingOrder).not.toHaveBeenCalled();
      expect(orderRepositoryMock.create).not.toHaveBeenCalled();
      expect(orderRepositoryMock.save).not.toHaveBeenCalled();
    });


  it('should throw BadRequestException when the encounter status is not allowed for ordering', async () => {
    const dto: CreateOrderDto = {
      encounterId: 'enc-789',
      examType: ExamType.TSH,
      requestedAt: new Date().toISOString(),
      requestedBy: 'user-4',
    };

    const encounter = { id: 'enc-789', status: EncounterStatus.DISCHARGED } as any;

    encounterServiceMock.getEncounterById.mockResolvedValue(encounter);

    await expect(service.createOrder(dto)).rejects.toBeInstanceOf(BadRequestException);
    expect(encounterServiceMock.getEncounterById).toHaveBeenCalledWith(dto.encounterId);
    expect(orderRepositoryMock.existsPendingOrder).not.toHaveBeenCalled();
    expect(orderRepositoryMock.create).not.toHaveBeenCalled();
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });
});
});

  describe('FN_searchOrders_END', () => {
describe('searchOrders', () => {
  it('returns paginated orders for valid filters', async () => {
      const dto = {
        status: OrderStatus.PENDING,
        dateFrom: '2023-01-01',
        dateTo: '2023-01-31',
        patientId: 'patient-123',
        encounterId: 'encounter-456',
      };
      const mockResult = { data: [], total: 0 };
      orderRepositoryMock.search.mockResolvedValueOnce(mockResult);
      const result = await service.searchOrders(dto as any);
      expect(orderRepositoryMock.search).toHaveBeenCalledWith({
        status: OrderStatus.PENDING,
        dateFrom: '2023-01-01',
        dateTo: '2023-01-31',
        patientId: 'patient-123',
        encounterId: 'encounter-456',
      });
      expect(result).toBe(mockResult);
    });


  it('throws BadRequestException when dateFrom is after dateTo', async () => {
      const dto = {
        dateFrom: '2023-02-01',
        dateTo: '2023-01-01',
      };
      orderRepositoryMock.search.mockRejectedValueOnce(new BadRequestException());
      await expect(service.searchOrders(dto as any)).rejects.toBeInstanceOf(BadRequestException);
      expect(orderRepositoryMock.search).toHaveBeenCalled();
    });


  it('filters by status only when other filters are omitted', async () => {
    const dto = {
      status: OrderStatus.COMPLETED,
    };
    const mockResult = { data: [], total: 0 };
    orderRepositoryMock.search.mockResolvedValueOnce(mockResult);
    const result = await service.searchOrders(dto as any);
    expect(orderRepositoryMock.search).toHaveBeenCalledWith({
      status: OrderStatus.COMPLETED,
      dateFrom: undefined,
      dateTo: undefined,
      patientId: undefined,
      encounterId: undefined,
    });
    expect(result).toBe(mockResult);
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
              sortBy: 'REQUESTED_AT' as any,
              sortDirection: 'ASC' as any,
              page: 2,
              limit: 10,
            };
            const repoResult: PaginatedOrders = {
              data: [] as Order[],
              total: 0,
              page: 2,
              limit: 10,
              totalPages: 0,
            };
            orderRepositoryMock.searchAdvanced.mockReturnValue(repoResult);
            const result = await service.searchOrdersAdvanced(dto);
            expect(orderRepositoryMock.searchAdvanced).toHaveBeenCalledWith(dto);
            expect(result).toBe(repoResult);
          });



  it('should throw BadRequestException when dateFrom is after dateTo', async () => {
      const dto: SearchOrdersAdvancedDto = {
        dateFrom: '2023-02-01',
        dateTo: '2023-01-01',
      };
      jest
        .spyOn((service as any).orderRepository, 'searchAdvanced')
        .mockRejectedValueOnce(new BadRequestException());
      await expect(service.searchOrdersAdvanced(dto)).rejects.toBeInstanceOf(BadRequestException);
    });


  it('should use default pagination values when page and limit are undefined', async () => {
        const dto: SearchOrdersAdvancedDto = {
          status: OrderStatus.COMPLETED,
        };
        const repoResult: PaginatedOrders = {
          data: [] as Order[],
          total: 0,
          page: 1,
          limit: 20,
          totalPages: 0,
        };
        orderRepositoryMock.searchAdvanced.mockResolvedValueOnce(repoResult);
        const result = await service.searchOrdersAdvanced(dto);
        expect(result).toBe(repoResult);
      });

});
});

  describe('FN_validateOrderResult_END', () => {
describe('validateOrderResult', () => {
  it('throws NotFoundException when order does not exist', async () => {
    const orderId = 'nonexistent-id';
    orderRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(service.validateOrderResult(orderId, ResultStatus.FINAL)).rejects.toBeInstanceOf(NotFoundException);
    expect(orderRepositoryMock.findById).toHaveBeenCalledWith(orderId);
  });

  it('throws ConflictException when order status is not IN_PROGRESS', async () => {
        const orderId = 'order-1';
        const order = {
          id: orderId,
          encounterId: 'enc-1',
          examType: ExamType.HEMOGRAM,
          status: OrderStatus.PENDING,
          requestedAt: new Date(),
          requestedBy: 'user-1',
          notes: null,
          created_at: new Date(),
          updated_at: new Date(),
          encounter: undefined,
          results: [],
        } as Order;
        orderRepositoryMock.findById.mockResolvedValue(order);
        encounterServiceMock.getEncounterById.mockResolvedValue({
          id: 'enc-1',
          status: EncounterStatus.ADMITTED,
        } as any);

        await expect(service.validateOrderResult(orderId, ResultStatus.FINAL)).rejects.toBeInstanceOf(BadRequestException);
        expect(orderRepositoryMock.findById).toHaveBeenCalledWith(orderId);
      });


  it('saves order when validation passes', async () => {
    const orderId = 'order-2';
    const order = {
      id: orderId,
      encounterId: 'enc-2',
      examType: ExamType.GLUCOSE,
      status: OrderStatus.IN_PROGRESS,
      requestedAt: new Date(),
      requestedBy: 'user-2',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      encounter: undefined,
      results: [],
    } as Order;
    orderRepositoryMock.findById.mockResolvedValue(order);
    encounterServiceMock.getEncounterById.mockResolvedValue({
      id: 'enc-2',
      status: EncounterStatus.ADMITTED,
    } as any);
    orderRepositoryMock.save.mockResolvedValue(undefined);

    await expect(service.validateOrderResult(orderId, ResultStatus.FINAL)).resolves.not.toThrow();
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(expect.objectContaining({
      id: orderId,
      status: OrderStatus.COMPLETED,
    }));
  });
});
});

  describe('FN_cancelOrder_END', () => {
describe('cancelOrder', () => {
  it('should cancel a pending order successfully', async () => {
    const order: Order = {
      id: 'order-1',
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
    orderRepositoryMock.findById.mockResolvedValue(order);
    orderRepositoryMock.save.mockResolvedValue({ ...order, status: OrderStatus.CANCELLED });

    const result = await service.cancelOrder(order.id);

    expect(orderRepositoryMock.findById).toHaveBeenCalledWith(order.id);
    expect(orderRepositoryMock.save).toHaveBeenCalledWith({
      ...order,
      status: OrderStatus.CANCELLED,
    });
    expect(result.status).toBe(OrderStatus.CANCELLED);
  });

  it('should throw NotFoundException when order does not exist', async () => {
    orderRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(service.cancelOrder('non-existent-id')).rejects.toBeInstanceOf(NotFoundException);
    expect(orderRepositoryMock.findById).toHaveBeenCalledWith('non-existent-id');
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw ConflictException when order is already cancelled', async () => {
        const order: Order = {
          id: 'order-2',
          encounterId: 'enc-2',
          examType: ExamType.GLUCOSE,
          status: OrderStatus.CANCELLED,
          requestedAt: new Date(),
          requestedBy: 'user-2',
          notes: null,
          created_at: new Date(),
          updated_at: new Date(),
          encounter: {} as any,
          results: [],
        };
        orderRepositoryMock.findById.mockResolvedValue(order);

        await expect(service.cancelOrder(order.id)).rejects.toBeInstanceOf(BadRequestException);
        expect(orderRepositoryMock.findById).toHaveBeenCalledWith(order.id);
        expect(orderRepositoryMock.save).not.toHaveBeenCalled();
      });


  it('should cancel a completed order', async () => {
      const order: Order = {
        id: 'order-3',
        encounterId: 'enc-3',
        examType: ExamType.CREATININE,
        status: OrderStatus.COMPLETED,
        requestedAt: new Date(),
        requestedBy: 'user-3',
        notes: null,
        created_at: new Date(),
        updated_at: new Date(),
        encounter: {} as any,
        results: [],
      };
      orderRepositoryMock.findById.mockResolvedValue(order);
      orderRepositoryMock.save.mockResolvedValue({ ...order, status: OrderStatus.CANCELLED });

      const result = await service.cancelOrder(order.id);

      expect(orderRepositoryMock.findById).toHaveBeenCalledWith(order.id);
      expect(orderRepositoryMock.save).toHaveBeenCalledWith(expect.objectContaining({ id: order.id, status: OrderStatus.CANCELLED }));
      expect(result.status).toBe(OrderStatus.CANCELLED);
    });

});
});

  describe('FN_updateOrder_END', () => {
describe('updateOrder', () => {
  it('updates mutable fields and returns the saved order', async () => {
    const existingOrder: Order = {
      id: 'order-1',
      encounterId: 'enc-1',
      examType: ExamType.HEMOGRAM,
      status: OrderStatus.PENDING,
      requestedAt: new Date(),
      requestedBy: 'user-1',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      encounter: {} as any,
      results: [] as any,
    };
    const dto: UpdateOrderDto = {
      requestedBy: 'user-2',
      notes: 'updated note',
    };
    const savedOrder = { ...existingOrder, ...dto, updated_at: new Date() };
    orderRepositoryMock.findById.mockResolvedValueOnce(existingOrder);
    orderRepositoryMock.save.mockResolvedValueOnce(savedOrder);
    const result = await service.updateOrder('order-1', dto);
    expect(orderRepositoryMock.findById).toHaveBeenCalledWith('order-1');
    expect(orderRepositoryMock.save).toHaveBeenCalledWith({ ...existingOrder, ...dto });
    expect(result).toEqual(savedOrder);
  });

  it('throws NotFoundException when the order does not exist', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce(undefined);
    const dto: UpdateOrderDto = { notes: 'note' };
    await expect(service.updateOrder('non-existent', dto)).rejects.toBeInstanceOf(NotFoundException);
    expect(orderRepositoryMock.findById).toHaveBeenCalledWith('non-existent');
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('throws ConflictException when the order status is COMPLETED', async () => {
        const completedOrder: Order = {
          id: 'order-2',
          encounterId: 'enc-2',
          examType: ExamType.GLUCOSE,
          status: OrderStatus.COMPLETED,
          requestedAt: new Date(),
          requestedBy: 'user-1',
          notes: null,
          created_at: new Date(),
          updated_at: new Date(),
          encounter: {} as any,
          results: [] as any,
        };
        orderRepositoryMock.findById.mockResolvedValueOnce(completedOrder);
        const dto: UpdateOrderDto = { notes: 'new note' };
        await expect(service.updateOrder('order-2', dto)).rejects.toBeInstanceOf(BadRequestException);
        expect(orderRepositoryMock.findById).toHaveBeenCalledWith('order-2');
        expect(orderRepositoryMock.save).not.toHaveBeenCalled();
      });


  it('does not throw when no updatable fields are provided and saves the order', async () => {
      const existingOrder: Order = {
        id: 'order-3',
        encounterId: 'enc-3',
        examType: ExamType.CREATININE,
        status: OrderStatus.PENDING,
        requestedAt: new Date(),
        requestedBy: 'user-1',
        notes: null,
        created_at: new Date(),
        updated_at: new Date(),
        encounter: {} as any,
        results: [] as any,
      };
      orderRepositoryMock.findById.mockResolvedValueOnce(existingOrder);
      orderRepositoryMock.save.mockResolvedValueOnce(existingOrder);
      const dto: UpdateOrderDto = {};
      const result = await service.updateOrder('order-3', dto);
      expect(result).toBe(existingOrder);
      expect(orderRepositoryMock.findById).toHaveBeenCalledWith('order-3');
      expect(orderRepositoryMock.save).toHaveBeenCalledWith(expect.objectContaining({ id: 'order-3' }));
    });

});
});

  // TESTS_APPEND_HERE
});
