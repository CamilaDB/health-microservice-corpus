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
  it('should return the order when found', async () => {
    const mockOrder = { id: '1', encounterId: 'e1', examType: 'HEMOGRAM', status: 'PENDING', requestedAt: new Date(), requestedBy: 'user1', notes: null, created_at: new Date(), updated_at: new Date(), encounter: {}, results: [] };
    orderRepositoryMock.findById.mockResolvedValue(mockOrder);

    const result = await service.getOrderById('1');

    expect(orderRepositoryMock.findById).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockOrder);
  });

  it('should throw NotFoundException when order is not found', async () => {
    orderRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      service.getOrderById('999')
    ).rejects.toThrow(`Order with id 999 not found`);

    expect(orderRepositoryMock.findById).toHaveBeenCalledWith('999');
  });
});
});

  describe('FN_createOrder_END', () => {
describe('createOrder', () => {
  it('should throw BadRequestException when encounter is discharged', async () => {
    encounterServiceMock.getEncounterById.mockResolvedValue({
      status: EncounterStatus.DISCHARGED,
      admitDate: new Date('2023-01-01'),
    });

    await expect(
      service.createOrder({
        encounterId: '123',
        examType: ExamType.HEMOGRAM,
        requestedAt: '2023-01-02',
        requestedBy: 'patientA',
      })
    ).rejects.toThrow(BadRequestException);

    expect(encounterServiceMock.getEncounterById).toHaveBeenCalledWith('123');
    expect(orderRepositoryMock.existsPendingOrder).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when requested date is before admission date', async () => {
    encounterServiceMock.getEncounterById.mockResolvedValue({
      status: EncounterStatus.ADMITTED,
      admitDate: new Date('2023-01-01'),
    });

    await expect(
      service.createOrder({
        encounterId: '123',
        examType: ExamType.GLUCOSE,
        requestedAt: '2022-12-31',
        requestedBy: 'patientA',
      })
    ).rejects.toThrow(BadRequestException);

    expect(encounterServiceMock.getEncounterById).toHaveBeenCalledWith('123');
    expect(orderRepositoryMock.existsPendingOrder).not.toHaveBeenCalled();
  });

  it('should throw ConflictException when a pending order already exists', async () => {
    encounterServiceMock.getEncounterById.mockResolvedValue({
      status: EncounterStatus.ADMITTED,
      admitDate: new Date('2023-01-01'),
    });

    orderRepositoryMock.existsPendingOrder.mockResolvedValue(true);

    await expect(
      service.createOrder({
        encounterId: '123',
        examType: ExamType.CREATININE,
        requestedAt: '2023-01-02',
        requestedBy: 'patientA',
      })
    ).rejects.toThrow(ConflictException);

    expect(encounterServiceMock.getEncounterById).toHaveBeenCalledWith('123');
    expect(orderRepositoryMock.existsPendingOrder).toHaveBeenCalledWith('123', ExamType.CREATININE);
    expect(orderRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('should create and save a new order successfully', async () => {
    const encounter = {
      status: EncounterStatus.ADMITTED,
      admitDate: new Date('2023-01-01'),
    };
    encounterServiceMock.getEncounterById.mockResolvedValue(encounter);
    orderRepositoryMock.existsPendingOrder.mockResolvedValue(false);
    const savedOrder = {
      id: 'order1',
      encounterId: '123',
      examType: ExamType.HEMOGRAM,
      status: OrderStatus.PENDING,
      requestedAt: new Date('2023-01-02'),
      requestedBy: 'patientA',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      encounter: encounter,
      results: [],
    };
    orderRepositoryMock.create.mockReturnValue(savedOrder);
    orderRepositoryMock.save.mockResolvedValue(savedOrder);

    const result = await service.createOrder({
      encounterId: '123',
      examType: ExamType.HEMOGRAM,
      requestedAt: '2023-01-02',
      requestedBy: 'patientA',
      notes: 'Some notes',
    });

    expect(result).toBe(savedOrder);
    expect(encounterServiceMock.getEncounterById).toHaveBeenCalledWith('123');
    expect(orderRepositoryMock.existsPendingOrder).toHaveBeenCalledWith('123', ExamType.HEMOGRAM);
    expect(orderRepositoryMock.create).toHaveBeenCalledWith({
      encounterId: '123',
      examType: ExamType.HEMOGRAM,
      requestedAt: new Date('2023-01-02'),
      requestedBy: 'patientA',
      notes: 'Some notes',
      status: OrderStatus.PENDING,
      requestedAt: new Date('2023-01-02'),
      notes: 'Some notes',
    });
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(savedOrder);
  });
});
});

  describe('FN_searchOrders_END', () => {
describe('searchOrders', () => {
  it('should return the results from the order repository search', async () => {
    const mockOrders = [{ id: '1', encounterId: 'e1', status: OrderStatus.PENDING }];
    orderRepositoryMock.search.mockResolvedValue(mockOrders);

    const dto = { status: OrderStatus.PENDING };
    const result = await service.searchOrders(dto);

    expect(orderRepositoryMock.search).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockOrders);
  });
});
});

  describe('FN_searchOrdersAdvanced_END', () => {
describe('searchOrdersAdvanced', () => {
  it('should return the result from orderRepository.searchAdvanced', async () => {
    const mockPaginatedOrders: PaginatedOrders = {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };

    orderRepositoryMock.searchAdvanced.mockResolvedValue(mockPaginatedOrders);

    const dto: SearchOrdersAdvancedDto = {
      status: 'PENDING',
    };

    const result = await service.searchOrdersAdvanced(dto);

    expect(orderRepositoryMock.searchAdvanced).toHaveBeenCalledWith(dto);
    expect(result).toBe(mockPaginatedOrders);
  });
});
});

  describe('FN_validateOrderResult_END', () => {
describe('validateOrderResult', () => {
  it('should throw BadRequestException when the order is cancelled', async () => {
    orderRepositoryMock.findById.mockResolvedValue({
      id: '1',
      status: OrderStatus.CANCELLED,
      encounterId: 'e1',
      results: [],
    });

    await expect(
      service.validateOrderResult('1', ResultStatus.FINAL),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when the encounter is discharged', async () => {
    orderRepositoryMock.findById.mockResolvedValue({
      id: '1',
      status: OrderStatus.PENDING,
      encounterId: 'e1',
      results: [],
    });
    encounterServiceMock.getEncounterById.mockResolvedValue({
      status: EncounterStatus.DISCHARGED,
    });

    await expect(
      service.validateOrderResult('1', ResultStatus.FINAL),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when trying to register a CORRECTED result before completion', async () => {
    orderRepositoryMock.findById.mockResolvedValue({
      id: '1',
      status: OrderStatus.PENDING,
      encounterId: 'e1',
      results: [{ status: ResultStatus.PRELIMINARY }],
    });
    encounterServiceMock.getEncounterById.mockResolvedValue({ status: EncounterStatus.ADMITTED });

    await expect(
      service.validateOrderResult('1', ResultStatus.CORRECTED),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when trying to register a CORRECTED result if a final result already exists', async () => {
    orderRepositoryMock.findById.mockResolvedValue({
      id: '1',
      status: OrderStatus.PENDING,
      encounterId: 'e1',
      results: [{ status: ResultStatus.FINAL }],
    });
    encounterServiceMock.getEncounterById.mockResolvedValue({ status: EncounterStatus.ADMITTED });

    await expect(
      service.validateOrderResult('1', ResultStatus.CORRECTED),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when trying to register a FINAL result for a PENDING order', async () => {
    orderRepositoryMock.findById.mockResolvedValue({
      id: '1',
      status: OrderStatus.PENDING,
      encounterId: 'e1',
      results: [],
    });
    encounterServiceMock.getEncounterById.mockResolvedValue({ status: EncounterStatus.ADMITTED });

    await expect(
      service.validateOrderResult('1', ResultStatus.FINAL),
    ).rejects.toThrow(BadRequestException);
  });

  it('should transition order status from IN_PROGRESS to COMPLETED when registering a FINAL result', async () => {
            const orderId = '1';
            const order = {
              id: orderId,
              status: OrderStatus.IN_PROGRESS,
              encounterId: 'e1',
              results: [],
            };
            orderRepositoryMock.findById.mockResolvedValue(order);
            encounterServiceMock.getEncounterById.mockResolvedValue({ status: EncounterStatus.ADMITTED });
            orderRepositoryMock.save.mockResolvedValue(order);

            const result = await service.validateOrderResult(orderId, ResultStatus.FINAL);

            expect(result).toEqual(order);
            expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
            expect(order.status).toBe(OrderStatus.COMPLETED);
          });



  it('should transition order status from IN_PROGRESS to COMPLETED when registering a FINAL result', async () => {
    const orderId = '1';
    const order = {
      id: orderId,
      status: OrderStatus.IN_PROGRESS,
      encounterId: 'e1',
      results: [],
    };
    orderRepositoryMock.findById.mockResolvedValue(order);
    encounterServiceMock.getEncounterById.mockResolvedValue({ status: EncounterStatus.ADMITTED });
    orderRepositoryMock.save.mockResolvedValue(order);

    const result = await service.validateOrderResult(orderId, ResultStatus.FINAL);

    expect(result).toEqual(order);
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
    expect(order.status).toBe(OrderStatus.COMPLETED);
  });

  it('should return the order unmodified if no status transition is required', async () => {
    const orderId = '1';
    const order = {
      id: orderId,
      status: OrderStatus.IN_PROGRESS,
      encounterId: 'e1',
      results: [{ status: ResultStatus.PRELIMINARY }],
    };
    orderRepositoryMock.findById.mockResolvedValue(order);
    encounterServiceMock.getEncounterById.mockResolvedValue({ status: EncounterStatus.ADMITTED });

    const result = await service.validateOrderResult(orderId, ResultStatus.PRELIMINARY);

    expect(result).toEqual(order);
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });
});
});

  describe('FN_cancelOrder_END', () => {
describe('cancelOrder', () => {
  it('should throw BadRequestException when the order is already cancelled', async () => {
    const cancelledOrder = {
      id: '123',
      status: OrderStatus.CANCELLED,
    };
    orderRepositoryMock.findById.mockResolvedValue(cancelledOrder);

    await expect(
      service.cancelOrder('123'),
    ).rejects.toThrow(BadRequestException);

    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should successfully cancel the order and save it', async () => {
    const pendingOrder = {
      id: '123',
      status: OrderStatus.PENDING,
    };
    const savedOrder = {
      id: '123',
      status: OrderStatus.CANCELLED,
    };
    orderRepositoryMock.findById.mockResolvedValue(pendingOrder);
    orderRepositoryMock.save.mockResolvedValue(savedOrder);

    const result = await service.cancelOrder('123');

    expect(orderRepositoryMock.findById).toHaveBeenCalledWith('123');
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(savedOrder);
    expect(result).toEqual(savedOrder);
  });
});
});

  describe('FN_updateOrder_END', () => {
describe('updateOrder', () => {
  it('should throw BadRequestException when order status is CANCELLED', async () => {
    orderRepositoryMock.findById.mockResolvedValue({
      id: '1',
      status: OrderStatus.CANCELLED,
    });

    await expect(
      service.updateOrder('1', { notes: 'new notes' } as UpdateOrderDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when order status is COMPLETED', async () => {
    orderRepositoryMock.findById.mockResolvedValue({
      id: '1',
      status: OrderStatus.COMPLETED,
    });

    await expect(
      service.updateOrder('1', { notes: 'new notes' } as UpdateOrderDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when order is IN_PROGRESS and requestedBy is provided', async () => {
    orderRepositoryMock.findById.mockResolvedValue({
      id: '1',
      status: OrderStatus.IN_PROGRESS,
    });

    await expect(
      service.updateOrder('1', { requestedBy: 'new_user' } as UpdateOrderDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should update notes and save the order when status is valid', async () => {
    const initialOrder = {
      id: '1',
      status: OrderStatus.PENDING,
      notes: null,
    };
    orderRepositoryMock.findById.mockResolvedValue(initialOrder);
    orderRepositoryMock.save.mockResolvedValue({ id: '1', status: OrderStatus.PENDING, notes: 'new notes' });

    const dto = { notes: 'new notes' };
    const result = await service.updateOrder('1', dto);

    expect(orderRepositoryMock.findById).toHaveBeenCalledWith('1');
    expect(orderRepositoryMock.save).toHaveBeenCalledWith({
      id: '1',
      status: OrderStatus.PENDING,
      notes: 'new notes',
    });
    expect(result).toEqual({ id: '1', status: OrderStatus.PENDING, notes: 'new notes' });
  });

  it('should update requestedBy and save the order when status is valid', async () => {
    const initialOrder = {
      id: '1',
      status: OrderStatus.PENDING,
      requestedBy: 'old_user',
      notes: null,
    };
    orderRepositoryMock.findById.mockResolvedValue(initialOrder);
    orderRepositoryMock.save.mockResolvedValue({ id: '1', status: OrderStatus.PENDING, requestedBy: 'new_user', notes: null });

    const dto = { requestedBy: 'new_user' };
    const result = await service.updateOrder('1', dto);

    expect(orderRepositoryMock.save).toHaveBeenCalledWith({
      id: '1',
      status: OrderStatus.PENDING,
      requestedBy: 'new_user',
      notes: null,
    });
    expect(result).toEqual({ id: '1', status: OrderStatus.PENDING, requestedBy: 'new_user', notes: null });
  });

  it('should update both requestedBy and notes and save the order when status is valid', async () => {
    const initialOrder = {
      id: '1',
      status: OrderStatus.PENDING,
      requestedBy: 'old_user',
      notes: null,
    };
    orderRepositoryMock.findById.mockResolvedValue(initialOrder);
    orderRepositoryMock.save.mockResolvedValue({ id: '1', status: OrderStatus.PENDING, requestedBy: 'new_user', notes: 'updated notes' });

    const dto = { requestedBy: 'new_user', notes: 'updated notes' };
    const result = await service.updateOrder('1', dto);

    expect(orderRepositoryMock.save).toHaveBeenCalledWith({
      id: '1',
      status: OrderStatus.PENDING,
      requestedBy: 'new_user',
      notes: 'updated notes',
    });
    expect(result).toEqual({ id: '1', status: OrderStatus.PENDING, requestedBy: 'new_user', notes: 'updated notes' });
  });
});
});

  // TESTS_APPEND_HERE
});
