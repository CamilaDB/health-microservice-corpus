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
  it('should throw NotFoundException when order not found', async () => {
    // arrange
    orderRepositoryMock.findById.mockResolvedValue(undefined);

    // act
    await expect(service.getOrderById('test-id')).rejects.toThrow(NotFoundException);

    // assert
    expect(orderRepositoryMock.findById).toHaveBeenCalled();
  });
});
});

  describe('FN_createOrder_END', () => {
describe('createOrder', () => {
  it('should throw BadRequestException when encounter is discharged', async () => {
    const dto: CreateOrderDto = {
      encounterId: 'enc-123',
      examType: ExamType.HEMOGRAM,
      requestedAt: new Date().toISOString(),
      requestedBy: 'test-user',
      notes: undefined,
    };

    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      status: EncounterStatus.DISCHARGED,
      admitDate: new Date('2024-01-01'),
    });

    await expect(service.createOrder(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when requestedAt is before admitDate', async () => {
    const dto: CreateOrderDto = {
      encounterId: 'enc-123',
      examType: ExamType.HEMOGRAM,
      requestedAt: new Date('2024-01-01').toISOString(),
      requestedBy: 'test-user',
      notes: undefined,
    };

    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      status: EncounterStatus.ADMITTED,
      admitDate: new Date('2024-06-01'),
    });

    await expect(service.createOrder(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw ConflictException when existing pending order exists', async () => {
    const dto: CreateOrderDto = {
      encounterId: 'enc-123',
      examType: ExamType.HEMOGRAM,
      requestedAt: new Date().toISOString(),
      requestedBy: 'test-user',
      notes: undefined,
    };

    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      status: EncounterStatus.ADMITTED,
      admitDate: new Date('2024-01-01'),
    });

    orderRepositoryMock.existsPendingOrder.mockResolvedValueOnce(true);

    await expect(service.createOrder(dto)).rejects.toThrow(ConflictException);
  });
});
});

  describe('FN_searchOrders_END', () => {
describe('searchOrders', () => {
  it('should return orders when search succeeds', async () => {
    const mockOrder: Order = {
      id: '123',
      encounterId: 'enc-001',
      examType: ExamType.HEMOGRAM,
      status: OrderStatus.PENDING,
      requestedAt: new Date(),
      requestedBy: 'test-user',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      encounter: { id: 'enc-001' },
      results: []
    };

    orderRepositoryMock.search.mockResolvedValueOnce([mockOrder]);

    const dto: SearchOrdersDto = {
      status: OrderStatus.PENDING,
      dateFrom: '2024-01-01',
      dateTo: '2024-12-31',
      patientId: 'patient-123',
      encounterId: 'enc-001'
    };

    const result = await service.searchOrders(dto);

    expect(result).toEqual([mockOrder]);
    expect(orderRepositoryMock.search).toHaveBeenCalledWith(dto);
  });

  it('should return empty array when search returns no results', async () => {
    orderRepositoryMock.search.mockResolvedValueOnce([]);

    const dto: SearchOrdersDto = {};

    const result = await service.searchOrders(dto);

    expect(result).toEqual([]);
    expect(orderRepositoryMock.search).toHaveBeenCalledWith(dto);
  });

  it('should throw error when search fails', async () => {
    orderRepositoryMock.search.mockRejectedValueOnce(new Error('Search failed'));

    const dto: SearchOrdersDto = {};

    await expect(service.searchOrders(dto)).rejects.toThrow(Error);
  });
});
});

  describe('FN_searchOrdersAdvanced_END', () => {
describe('searchOrdersAdvanced', () => {
  it('should delegate to orderRepository and return PaginatedOrders', async () => {
    const dto: SearchOrdersAdvancedDto = {
      status: OrderStatus.PENDING,
      examType: ExamType.HEMOGRAM,
      dateFrom: '2024-01-01',
      dateTo: '2024-12-31',
      patientId: 'patient-123',
      encounterId: 'encounter-456',
      requestedBy: 'doctor-name',
      sortBy: OrderSortField.REQUESTED_AT,
      sortDirection: SortDirection.DESC,
      page: 1,
      limit: 10
    };

    const paginatedOrders: PaginatedOrders = {
      data: [
        { id: 'order-1', status: OrderStatus.PENDING },
        { id: 'order-2', status: OrderStatus.IN_PROGRESS }
      ],
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1
    };

    orderRepositoryMock.searchAdvanced.mockResolvedValueOnce(paginatedOrders);

    const result = await service.searchOrdersAdvanced(dto);

    expect(result).toEqual(paginatedOrders);
    expect(orderRepositoryMock.searchAdvanced).toHaveBeenCalledWith(dto);
  });

  it('should throw exception when repository throws error', async () => {
    const dto: SearchOrdersAdvancedDto = {
      status: OrderStatus.PENDING,
      examType: ExamType.GLUCOSE,
      page: 1,
      limit: 5
    };

    orderRepositoryMock.searchAdvanced.mockRejectedValueOnce(new Error('Database error'));

    await expect(service.searchOrdersAdvanced(dto)).rejects.toThrow(Error);
  });
});
});

  describe('FN_validateOrderResult_END', () => {
describe('validateOrderResult', () => {
  it('should throw BadRequestException when order is cancelled', async () => {
    const order = {
      id: '123',
      encounterId: '456',
      examType: ExamType.HEMOGRAM,
      status: OrderStatus.CANCELLED,
      requestedAt: new Date(),
      requestedBy: 'test',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      encounter: { id: '456' },
      results: [],
    };

    orderRepositoryMock.findById.mockResolvedValueOnce(order);

    await expect(service.validateOrderResult('123', ResultStatus.FINAL)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when encounter is discharged', async () => {
    const order = {
      id: '123',
      encounterId: '456',
      examType: ExamType.HEMOGRAM,
      status: OrderStatus.IN_PROGRESS,
      requestedAt: new Date(),
      requestedBy: 'test',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      encounter: { id: '456' },
      results: [],
    };

    orderRepositoryMock.findById.mockResolvedValueOnce(order);
    const encounter = {
      id: '456',
      status: EncounterStatus.DISCHARGED,
    };
    encounterServiceMock.getEncounterById.mockResolvedValueOnce(encounter);

    await expect(service.validateOrderResult('123', ResultStatus.FINAL)).rejects.toThrow(BadRequestException);
  });

  it('should return order when incoming status is CORRECTED with valid conditions', async () => {
    const order = {
      id: '123',
      encounterId: '456',
      examType: ExamType.HEMOGRAM,
      status: OrderStatus.COMPLETED,
      requestedAt: new Date(),
      requestedBy: 'test',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      encounter: { id: '456' },
      results: [
        { status: ResultStatus.FINAL },
      ],
    };

    orderRepositoryMock.findById.mockResolvedValueOnce(order);
    const encounter = {
      id: '456',
      status: EncounterStatus.ADMITTED,
    };
    encounterServiceMock.getEncounterById.mockResolvedValueOnce(encounter);

    const result = await service.validateOrderResult('123', ResultStatus.CORRECTED);
    expect(result).toEqual(order);
  });

  it('should throw BadRequestException when CORRECTED but order not COMPLETED', async () => {
    const order = {
      id: '123',
      encounterId: '456',
      examType: ExamType.HEMOGRAM,
      status: OrderStatus.IN_PROGRESS,
      requestedAt: new Date(),
      requestedBy: 'test',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      encounter: { id: '456' },
      results: [
        { status: ResultStatus.FINAL },
      ],
    };

    orderRepositoryMock.findById.mockResolvedValueOnce(order);
    const encounter = {
      id: '456',
      status: EncounterStatus.ADMITTED,
    };
    encounterServiceMock.getEncounterById.mockResolvedValueOnce(encounter);

    await expect(service.validateOrderResult('123', ResultStatus.CORRECTED)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when CORRECTED but no final result or has corrected result', async () => {
    const order = {
      id: '123',
      encounterId: '456',
      examType: ExamType.HEMOGRAM,
      status: OrderStatus.COMPLETED,
      requestedAt: new Date(),
      requestedBy: 'test',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      encounter: { id: '456' },
      results: [
        { status: ResultStatus.PRELIMINARY },
      ],
    };

    orderRepositoryMock.findById.mockResolvedValueOnce(order);
    const encounter = {
      id: '456',
      status: EncounterStatus.ADMITTED,
    };
    encounterServiceMock.getEncounterById.mockResolvedValueOnce(encounter);

    await expect(service.validateOrderResult('123', ResultStatus.CORRECTED)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when order already completed', async () => {
    const order = {
      id: '123',
      encounterId: '456',
      examType: ExamType.HEMOGRAM,
      status: OrderStatus.COMPLETED,
      requestedAt: new Date(),
      requestedBy: 'test',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      encounter: { id: '456' },
      results: [],
    };

    orderRepositoryMock.findById.mockResolvedValueOnce(order);
    const encounter = {
      id: '456',
      status: EncounterStatus.ADMITTED,
    };
    encounterServiceMock.getEncounterById.mockResolvedValueOnce(encounter);

    await expect(service.validateOrderResult('123', ResultStatus.FINAL)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when order already has final or corrected result', async () => {
    const order = {
      id: '123',
      encounterId: '456',
      examType: ExamType.HEMOGRAM,
      status: OrderStatus.IN_PROGRESS,
      requestedAt: new Date(),
      requestedBy: 'test',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      encounter: { id: '456' },
      results: [
        { status: ResultStatus.FINAL },
      ],
    };

    orderRepositoryMock.findById.mockResolvedValueOnce(order);
    const encounter = {
      id: '456',
      status: EncounterStatus.ADMITTED,
    };
    encounterServiceMock.getEncounterById.mockResolvedValueOnce(encounter);

    await expect(service.validateOrderResult('123', ResultStatus.PRELIMINARY)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when FINAL result for PENDING order', async () => {
    const order = {
      id: '123',
      encounterId: '456',
      examType: ExamType.HEMOGRAM,
      status: OrderStatus.PENDING,
      requestedAt: new Date(),
      requestedBy: 'test',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      encounter: { id: '456' },
      results: [],
    };

    orderRepositoryMock.findById.mockResolvedValueOnce(order);
    const encounter = {
      id: '456',
      status: EncounterStatus.ADMITTED,
    };
    encounterServiceMock.getEncounterById.mockResolvedValueOnce(encounter);

    await expect(service.validateOrderResult('123', ResultStatus.FINAL)).rejects.toThrow(BadRequestException);
  });

  it('should update order status to IN_PROGRESS and save when PENDING with PRELIMINARY result', async () => {
        const order = {
          id: '123',
          encounterId: '456',
          examType: ExamType.HEMOGRAM,
          status: OrderStatus.PENDING,
          requestedAt: new Date(),
          requestedBy: 'test',
          notes: null,
          created_at: new Date(),
          updated_at: new Date(),
          encounter: { id: '456' },
          results: [],
        };

        orderRepositoryMock.findById.mockResolvedValueOnce(order);
        const encounter = {
          id: '456',
          status: EncounterStatus.ADMITTED,
        };
        encounterServiceMock.getEncounterById.mockResolvedValueOnce(encounter);
        orderRepositoryMock.save.mockResolvedValueOnce({ ...order, status: OrderStatus.IN_PROGRESS });

        const result = await service.validateOrderResult('123', ResultStatus.PRELIMINARY);
        expect(result.status).toBe(OrderStatus.IN_PROGRESS);
      });


  it('should update order status to COMPLETED and save when IN_PROGRESS with FINAL result', async () => {
    const order = {
      id: '123',
      encounterId: '456',
      examType: ExamType.HEMOGRAM,
      status: OrderStatus.IN_PROGRESS,
      requestedAt: new Date(),
      requestedBy: 'test',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      encounter: { id: '456' },
      results: [],
    };

    orderRepositoryMock.findById.mockResolvedValueOnce(order);
    const encounter = {
      id: '456',
      status: EncounterStatus.ADMITTED,
    };
    encounterServiceMock.getEncounterById.mockResolvedValueOnce(encounter);
    orderRepositoryMock.save.mockResolvedValueOnce({ ...order, status: OrderStatus.COMPLETED });

    const result = await service.validateOrderResult('123', ResultStatus.FINAL);
    expect(result.status).toBe(OrderStatus.COMPLETED);
  });
});
});

  describe('FN_cancelOrder_END', () => {
describe('cancelOrder', () => {
  it.skip('should throw BadRequestException when order is already cancelled', async () => {
                // arrange: mock dependencies
                const order = {
                  id: 'test-id',
                  status: OrderStatus.CANCELLED,
                } as Order;
                
                jest.spyOn(service, 'orderRepository').mockImplementation({
                  getOrderById: jest.fn().mockResolvedValue(order),
                  save: jest.fn().mockResolvedValue(order),
                });

                // act: call the service method
                await expect(service.cancelOrder('test-id')).rejects.toThrow(BadRequestException);

                // assert: verify result or thrown exception
              });


});
});

  // TESTS_APPEND_HERE
});
