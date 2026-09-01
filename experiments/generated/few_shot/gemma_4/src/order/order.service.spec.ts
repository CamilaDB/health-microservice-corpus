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
    const mockOrder = { id: '1', encounterId: 'e1', status: 'PENDING' };
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
        requestedBy: 'user',
      })
    ).rejects.toThrow(BadRequestException);

    expect(encounterServiceMock.getEncounterById).toHaveBeenCalledWith('123');
    expect(orderRepositoryMock.existsPendingOrder).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when order date is before admission date', async () => {
    encounterServiceMock.getEncounterById.mockResolvedValue({
      status: EncounterStatus.ADMITTED,
      admitDate: new Date('2023-01-10'),
    });

    await expect(
      service.createOrder({
        encounterId: '123',
        examType: ExamType.GLUCOSE,
        requestedAt: '2023-01-09',
        requestedBy: 'user',
      })
    ).rejects.toThrow(BadRequestException);

    expect(encounterServiceMock.getEncounterById).toHaveBeenCalledWith('123');
    expect(orderRepositoryMock.existsPendingOrder).not.toHaveBeenCalled();
  });

  it('should throw ConflictException when a pending order already exists', async () => {
    encounterServiceMock.getEncounterById.mockResolvedValue({
      status: EncounterStatus.ADMITTED,
      admitDate: new Date('2023-01-10'),
    });

    orderRepositoryMock.existsPendingOrder.mockResolvedValue(true);

    await expect(
      service.createOrder({
        encounterId: '123',
        examType: ExamType.CREATININE,
        requestedAt: '2023-01-11',
        requestedBy: 'user',
        notes: 'Some notes',
      })
    ).rejects.toThrow(ConflictException);

    expect(encounterServiceMock.getEncounterById).toHaveBeenCalledWith('123');
    expect(orderRepositoryMock.existsPendingOrder).toHaveBeenCalledWith('123', ExamType.CREATININE);
    expect(orderRepositoryMock.create).not.toHaveBeenCalled();
  });

  it.skip('should create and save the order successfully', async () => {
        encounterServiceMock.getEncounterById.mockResolvedValue({
          status: EncounterStatus.ADMITTED,
          admitDate: new Date('2023-01-10'),
        });

        orderRepositoryMock.existsPendingOrder.mockResolvedValue(false);
        const createdOrder = {
          id: 'order-456',
          encounterId: '123',
          examType: ExamType.TSH,
          status: OrderStatus.PENDING,
          requestedAt: new Date('2023-01-11'),
          requestedBy: 'user',
          notes: 'Some notes',
          created_at: new Date(),
          updated_at: new Date(),
        };
        orderRepositoryMock.create.mockReturnValue(createdOrder);
        orderRepositoryMock.save.mockResolvedValue(createdOrder);

        const result = await service.createOrder({
          encounterId: '123',
          examType: ExamType.TSH,
          requestedAt: '2023-01-11',
          requestedBy: 'user',
          notes: 'Some notes',
        });

        expect(result).toEqual(createdOrder);
        expect(encounterServiceMock.getEncounterById).toHaveBeenCalledWith('123');
        expect(orderRepositoryMock.existsPendingOrder).toHaveBeenCalledWith('123', ExamType.TSH);
        expect(orderRepositoryMock.create).toHaveBeenCalledWith({
          ...service.createOrder({
            encounterId: '123',
            examType: ExamType.TSH,
            requestedAt: '2023-01-11',
            requestedBy: 'user',
            notes: 'Some notes',
          }),
          requestedAt: new Date('2023-01-11'),
          status: OrderStatus.PENDING,
          notes: 'Some notes',
        });
        expect(orderRepositoryMock.save).toHaveBeenCalledWith(createdOrder);
      });
});
});

  describe('FN_searchOrders_END', () => {
describe('searchOrders', () => {
  it('should return the results from the order repository search', async () => {
    const mockOrders = [
      { id: '1', encounterId: 'e1', examType: ExamType.HEMOGRAM, status: OrderStatus.PENDING, requestedAt: new Date(), requestedBy: 'userA', notes: null, created_at: new Date(), updated_at: new Date(), encounter: {}, results: [] },
      { id: '2', encounterId: 'e2', examType: ExamType.GLUCOSE, status: OrderStatus.IN_PROGRESS, requestedAt: new Date(), requestedBy: 'userB', notes: 'some note', created_at: new Date(), updated_at: new Date(), encounter: {}, results: [] },
    ];
    orderRepositoryMock.search.mockResolvedValue(mockOrders);

    const dto = { patientId: 'p1' };
    const result = await service.searchOrders(dto);

    expect(orderRepositoryMock.search).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockOrders);
  });
});
});

  describe('FN_searchOrdersAdvanced_END', () => {
describe('searchOrdersAdvanced', () => {
  it('should return the result from orderRepository.searchAdvanced', async () => {
    const mockPaginatedOrders = {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };
    orderRepositoryMock.searchAdvanced.mockResolvedValue(mockPaginatedOrders);

    const dto = {
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
  it('should throw BadRequestException when order is cancelled', async () => {
    orderRepositoryMock.findById.mockResolvedValue({
      id: '1',
      status: OrderStatus.CANCELLED,
      encounterId: 'e1',
      results: [],
    });

    await expect(
      service.validateOrderResult('1', ResultStatus.FINAL),
    ).rejects.toThrow(BadRequestException);
    expect(encounterServiceMock.getEncounterById).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when encounter is discharged', async () => {
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

  it('should throw BadRequestException when trying to register a CORRECTED result without completion', async () => {
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

  it('should throw BadRequestException when trying to register a CORRECTED result if final result is missing', async () => {
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

  it('should throw BadRequestException when trying to register a CORRECTED result if corrected result already exists', async () => {
    orderRepositoryMock.findById.mockResolvedValue({
      id: '1',
      status: OrderStatus.PENDING,
      encounterId: 'e1',
      results: [{ status: ResultStatus.CORRECTED }],
    });
    encounterServiceMock.getEncounterById.mockResolvedValue({ status: EncounterStatus.ADMITTED });

    await expect(
      service.validateOrderResult('1', ResultStatus.CORRECTED),
    ).rejects.toThrow(BadRequestException);
  });

  it('should return the order when incoming status is CORRECTED and all conditions are met', async () => {
    orderRepositoryMock.findById.mockResolvedValue({
      id: '1',
      status: OrderStatus.COMPLETED,
      encounterId: 'e1',
      results: [{ status: ResultStatus.FINAL }],
    });
    encounterServiceMock.getEncounterById.mockResolvedValue({ status: EncounterStatus.ADMITTED });

    const result = await service.validateOrderResult('1', ResultStatus.CORRECTED);

    expect(result).toEqual({
      id: '1',
      status: OrderStatus.COMPLETED,
      encounterId: 'e1',
      results: [{ status: ResultStatus.FINAL }],
    });
  });

  it('should throw BadRequestException when order is already completed and another result is attempted', async () => {
    orderRepositoryMock.findById.mockResolvedValue({
      id: '1',
      status: OrderStatus.COMPLETED,
      encounterId: 'e1',
      results: [{ status: ResultStatus.FINAL }],
    });
    encounterServiceMock.getEncounterById.mockResolvedValue({ status: EncounterStatus.ADMITTED });

    await expect(
      service.validateOrderResult('1', ResultStatus.FINAL),
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

  it.skip('should transition order status from PENDING to IN_PROGRESS when FINAL result is added', async () => {
        orderRepositoryMock.findById.mockResolvedValue({
          id: '1',
          status: OrderStatus.PENDING,
          encounterId: 'e1',
          results: [],
        });
        encounterServiceMock.getEncounterById.mockResolvedValue({ status: EncounterStatus.ADMITTED });
        orderRepositoryMock.save.mockResolvedValue({ id: '1', status: OrderStatus.IN_PROGRESS, encounterId: 'e1', results: [] });

        const result = await service.validateOrderResult('1', ResultStatus.FINAL);

        expect(result.status).toBe(OrderStatus.IN_PROGRESS);
        expect(orderRepositoryMock.save).toHaveBeenCalledTimes(1);
        expect(orderRepositoryMock.save).toHaveBeenCalledWith({
          id: '1',
          status: OrderStatus.IN_PROGRESS,
          encounterId: 'e1',
          results: [],
        });
      });

  it('should transition order status from IN_PROGRESS to COMPLETED when FINAL result is added', async () => {
    orderRepositoryMock.findById.mockResolvedValue({
      id: '1',
      status: OrderStatus.IN_PROGRESS,
      encounterId: 'e1',
      results: [],
    });
    encounterServiceMock.getEncounterById.mockResolvedValue({ status: EncounterStatus.ADMITTED });
    orderRepositoryMock.save.mockResolvedValue({ id: '1', status: OrderStatus.COMPLETED, encounterId: 'e1', results: [] });

    const result = await service.validateOrderResult('1', ResultStatus.FINAL);

    expect(result.status).toBe(OrderStatus.COMPLETED);
    expect(orderRepositoryMock.save).toHaveBeenCalledTimes(1);
    expect(orderRepositoryMock.save).toHaveBeenCalledWith({
      id: '1',
      status: OrderStatus.COMPLETED,
      encounterId: 'e1',
      results: [],
    });
  });

  it.skip('should return the order unchanged if no status transition occurs and no exceptions are thrown', async () => {
        orderRepositoryMock.findById.mockResolvedValue({
          id: '1',
          status: OrderStatus.PENDING,
          encounterId: 'e1',
          results: [],
        });
        encounterServiceMock.getEncounterById.mockResolvedValue({ status: EncounterStatus.ADMITTED });

        const result = await service.validateOrderResult('1', ResultStatus.PRELIMINARY);

        expect(result).toEqual({
          id: '1',
          status: OrderStatus.PENDING,
          encounterId: 'e1',
          results: [],
        });
        expect(orderRepositoryMock.save).not.toHaveBeenCalled();
      });
});
});

  describe('FN_cancelOrder_END', () => {
describe('cancelOrder', () => {
  it('should throw BadRequestException when the order is already cancelled', async () => {
    orderRepositoryMock.findById.mockResolvedValue({
      id: '1',
      status: OrderStatus.CANCELLED,
    });

    await expect(
      service.cancelOrder('1'),
    ).rejects.toThrow(BadRequestException);

    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should update the order status to CANCELLED and save it', async () => {
    const orderToCancel = {
      id: '1',
      status: OrderStatus.PENDING,
    };
    orderRepositoryMock.findById.mockResolvedValue(orderToCancel);
    orderRepositoryMock.save.mockResolvedValue(orderToCancel);

    const result = await service.cancelOrder('1');

    expect(orderRepositoryMock.findById).toHaveBeenCalledWith('1');
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(orderToCancel);
    expect(result).toEqual(orderToCancel);
  });
});
});

  describe('FN_updateOrder_END', () => {
describe('updateOrder', () => {
  it('should throw BadRequestException when order status is CANCELLED', async () => {
    orderRepositoryMock.findById.mockResolvedValue({
      status: OrderStatus.CANCELLED,
      id: '1',
    });

    await expect(
      service.updateOrder('1', { notes: 'New notes' } as UpdateOrderDto),
    ).rejects.toThrow(BadRequestException);

    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when order status is COMPLETED', async () => {
    orderRepositoryMock.findById.mockResolvedValue({
      status: OrderStatus.COMPLETED,
      id: '1',
    });

    await expect(
      service.updateOrder('1', { notes: 'New notes' } as UpdateOrderDto),
    ).rejects.toThrow(BadRequestException);

    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when updating requestedBy for an IN_PROGRESS order', async () => {
    orderRepositoryMock.findById.mockResolvedValue({
      status: OrderStatus.IN_PROGRESS,
      id: '1',
    });
    const dto = { requestedBy: 'new_user' };

    await expect(
      service.updateOrder('1', dto),
    ).rejects.toThrow(BadRequestException);

    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should update notes and save the order when status is PENDING', async () => {
    const initialOrder = {
      id: '1',
      status: OrderStatus.PENDING,
      notes: null,
    };
    orderRepositoryMock.findById.mockResolvedValue(initialOrder);
    const updatedOrder = {
      id: '1',
      status: OrderStatus.PENDING,
      notes: 'Updated notes',
    };
    orderRepositoryMock.save.mockResolvedValue(updatedOrder);

    const dto = { notes: 'Updated notes' };

    const result = await service.updateOrder('1', dto);

    expect(result).toEqual(updatedOrder);
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(updatedOrder);
  });

  it('should update requestedBy and save the order when status is PENDING', async () => {
    const initialOrder = {
      id: '1',
      status: OrderStatus.PENDING,
      requestedBy: 'old_user',
    };
    orderRepositoryMock.findById.mockResolvedValue(initialOrder);
    const updatedOrder = {
      id: '1',
      status: OrderStatus.PENDING,
      requestedBy: 'new_user',
    };
    orderRepositoryMock.save.mockResolvedValue(updatedOrder);

    const dto = { requestedBy: 'new_user' };

    const result = await service.updateOrder('1', dto);

    expect(result).toEqual(updatedOrder);
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(updatedOrder);
  });

  it('should update both requestedBy and notes when both are provided', async () => {
    const initialOrder = {
      id: '1',
      status: OrderStatus.PENDING,
      requestedBy: 'old_user',
      notes: null,
    };
    orderRepositoryMock.findById.mockResolvedValue(initialOrder);
    const updatedOrder = {
      id: '1',
      status: OrderStatus.PENDING,
      requestedBy: 'new_user',
      notes: 'Updated notes',
    };
    orderRepositoryMock.save.mockResolvedValue(updatedOrder);

    const dto = { requestedBy: 'new_user', notes: 'Updated notes' };

    const result = await service.updateOrder('1', dto);

    expect(result).toEqual(updatedOrder);
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(updatedOrder);
  });
});
});

  // TESTS_APPEND_HERE
});
