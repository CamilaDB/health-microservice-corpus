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
    const order = { id: '1' };
    orderRepositoryMock.findById.mockResolvedValueOnce(order);

    const result = await service.getOrderById('1');

    expect(result).toBe(order);
  });
});
});

  describe('FN_createOrder_END', () => {
describe('createOrder', () => {
  it('should throw BadRequestException when encounter is discharged', async () => {
    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      status: EncounterStatus.DISCHARGED,
      admitDate: new Date(),
    });

    await expect(
      service.createOrder({
        encounterId: '1',
        examType: ExamType.HEMOGRAM,
        requestedAt: '2024-01-01T00:00:00Z',
        requestedBy: 'test',
        notes: undefined,
      } as CreateOrderDto),
    ).rejects.toThrow(BadRequestException);

    expect(orderRepositoryMock.existsPendingOrder).not.toHaveBeenCalled();
    expect(orderRepositoryMock.create).not.toHaveBeenCalled();
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when requestedAt is before admitDate', async () => {
    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      status: EncounterStatus.ADMITTED,
      admitDate: new Date('2024-01-01T00:00:00Z'),
    });

    await expect(
      service.createOrder({
        encounterId: '1',
        examType: ExamType.HEMOGRAM,
        requestedAt: '2023-01-01T00:00:00Z',
        requestedBy: 'test',
        notes: undefined,
      } as CreateOrderDto),
    ).rejects.toThrow(BadRequestException);

    expect(orderRepositoryMock.existsPendingOrder).not.toHaveBeenCalled();
    expect(orderRepositoryMock.create).not.toHaveBeenCalled();
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw ConflictException when pending order already exists', async () => {
    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      status: EncounterStatus.ADMITTED,
      admitDate: new Date('2024-01-01T00:00:00Z'),
    });

    orderRepositoryMock.existsPendingOrder.mockResolvedValueOnce(true);

    await expect(
      service.createOrder({
        encounterId: '1',
        examType: ExamType.HEMOGRAM,
        requestedAt: '2024-01-02T00:00:00Z',
        requestedBy: 'test',
        notes: undefined,
      } as CreateOrderDto),
    ).rejects.toThrow(ConflictException);

    expect(orderRepositoryMock.create).not.toHaveBeenCalled();
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should save and return the created order', async () => {
        encounterServiceMock.getEncounterById.mockResolvedValueOnce({
          status: EncounterStatus.ADMITTED,
          admitDate: new Date('2024-01-01T00:00:00Z'),
        });

        orderRepositoryMock.existsPendingOrder.mockResolvedValueOnce(false);

        const createdOrder = {
          id: '1',
          encounterId: '1',
          examType: ExamType.HEMOGRAM,
          status: OrderStatus.PENDING,
          requestedAt: new Date('2024-01-02T00:00:00Z'),
          requestedBy: 'test',
          notes: null,
        };

        orderRepositoryMock.create.mockReturnValueOnce(createdOrder);
        orderRepositoryMock.save.mockResolvedValueOnce(createdOrder);

        const result = await service.createOrder({
          encounterId: '1',
          examType: ExamType.HEMOGRAM,
          requestedAt: '2024-01-02T00:00:00Z',
          requestedBy: 'test',
          notes: undefined,
        } as CreateOrderDto);

        expect(orderRepositoryMock.create).toHaveBeenCalledWith({
          encounterId: '1',
          examType: ExamType.HEMOGRAM,
          requestedAt: new Date('2024-01-02T00:00:00Z'),
          status: OrderStatus.PENDING,
          notes: null,
          requestedBy: 'test',
        });

        expect(orderRepositoryMock.save).toHaveBeenCalledWith(createdOrder);
      });

});
});

  describe('FN_searchOrders_END', () => {
describe('searchOrders', () => {
  it('should return orders from repository', async () => {
    const orders = [
      { id: '1', status: OrderStatus.PENDING },
      { id: '2', status: OrderStatus.IN_PROGRESS },
    ];

    orderRepositoryMock.search.mockResolvedValueOnce(orders);

    const result = await service.searchOrders({} as SearchOrdersDto);

    expect(result).toEqual(orders);
    expect(orderRepositoryMock.search).toHaveBeenCalledWith({} as SearchOrdersDto);
  });

  it('should return empty array when no orders found', async () => {
    orderRepositoryMock.search.mockResolvedValueOnce([]);

    const result = await service.searchOrders({} as SearchOrdersDto);

    expect(result).toEqual([]);
    expect(orderRepositoryMock.search).toHaveBeenCalledWith({} as SearchOrdersDto);
  });
});
});

  describe('FN_searchOrdersAdvanced_END', () => {
describe('searchOrdersAdvanced', () => {
  it('should return paginated orders when search is successful', async () => {
    const dto = {
      status: OrderStatus.PENDING,
      examType: ExamType.HEMOGRAM,
      page: 1,
      limit: 10,
    } as SearchOrdersAdvancedDto;

    const mockData = [
      { id: '1', patientId: 'patient-1' },
      { id: '2', patientId: 'patient-2' },
    ];

    orderRepositoryMock.searchAdvanced.mockResolvedValueOnce({
      data: mockData,
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    });

    const result = await service.searchOrdersAdvanced(dto);

    expect(result).toEqual({
      data: mockData,
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
  });

  it('should pass all dto properties to repository', async () => {
    const dto = {
      status: OrderStatus.IN_PROGRESS,
      examType: ExamType.GLUCOSE,
      dateFrom: '2024-01-01',
      dateTo: '2024-12-31',
      patientId: 'patient-1',
      encounterId: 'encounter-1',
      requestedBy: 'doctor-1',
      sortBy: OrderSortField.REQUESTED_AT,
      sortDirection: SortDirection.DESC,
      page: 2,
      limit: 5,
    } as SearchOrdersAdvancedDto;

    orderRepositoryMock.searchAdvanced.mockResolvedValueOnce({
      data: [],
      total: 0,
      page: 2,
      limit: 5,
      totalPages: 0,
    });

    await service.searchOrdersAdvanced(dto);

    expect(orderRepositoryMock.searchAdvanced).toHaveBeenCalledWith(dto);
  });
});
});

  describe('FN_validateOrderResult_END', () => {
describe('validateOrderResult', () => {
  it('should throw BadRequestException when order is cancelled', async () => {
    const order = {
      id: '1',
      encounterId: 'enc1',
      status: OrderStatus.CANCELLED,
      results: [],
    };

    orderRepositoryMock.findById.mockResolvedValueOnce(order);

    await expect(
      service.validateOrderResult('1', ResultStatus.FINAL),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when encounter is discharged', async () => {
    const order = {
      id: '1',
      encounterId: 'enc1',
      status: OrderStatus.IN_PROGRESS,
      results: [],
    };

    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      id: 'enc1',
      status: EncounterStatus.DISCHARGED,
    });

    orderRepositoryMock.findById.mockResolvedValueOnce(order);

    await expect(
      service.validateOrderResult('1', ResultStatus.FINAL),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when CORRECTED result on non-completed order', async () => {
    const order = {
      id: '1',
      encounterId: 'enc1',
      status: OrderStatus.IN_PROGRESS,
      results: [{ status: ResultStatus.FINAL }],
    };

    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      id: 'enc1',
      status: EncounterStatus.ADMITTED,
    });

    orderRepositoryMock.findById.mockResolvedValueOnce(order);

    await expect(
      service.validateOrderResult('1', ResultStatus.CORRECTED),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when CORRECTED result on order with corrected result', async () => {
    const order = {
      id: '1',
      encounterId: 'enc1',
      status: OrderStatus.COMPLETED,
      results: [
        { status: ResultStatus.FINAL },
        { status: ResultStatus.CORRECTED },
      ],
    };

    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      id: 'enc1',
      status: EncounterStatus.ADMITTED,
    });

    orderRepositoryMock.findById.mockResolvedValueOnce(order);

    await expect(
      service.validateOrderResult('1', ResultStatus.CORRECTED),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when order already completed', async () => {
    const order = {
      id: '1',
      encounterId: 'enc1',
      status: OrderStatus.COMPLETED,
      results: [],
    };

    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      id: 'enc1',
      status: EncounterStatus.ADMITTED,
    });

    orderRepositoryMock.findById.mockResolvedValueOnce(order);

    await expect(
      service.validateOrderResult('1', ResultStatus.FINAL),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when order has existing final result', async () => {
    const order = {
      id: '1',
      encounterId: 'enc1',
      status: OrderStatus.IN_PROGRESS,
      results: [{ status: ResultStatus.FINAL }],
    };

    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      id: 'enc1',
      status: EncounterStatus.ADMITTED,
    });

    orderRepositoryMock.findById.mockResolvedValueOnce(order);

    await expect(
      service.validateOrderResult('1', ResultStatus.FINAL),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when PENDING order with FINAL result', async () => {
    const order = {
      id: '1',
      encounterId: 'enc1',
      status: OrderStatus.PENDING,
      results: [],
    };

    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      id: 'enc1',
      status: EncounterStatus.ADMITTED,
    });

    orderRepositoryMock.findById.mockResolvedValueOnce(order);

    await expect(
      service.validateOrderResult('1', ResultStatus.FINAL),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when trying to add FINAL result to PENDING order', async () => {
        const order = {
          id: '1',
          encounterId: 'enc1',
          status: OrderStatus.PENDING,
          results: [],
        };

        encounterServiceMock.getEncounterById.mockResolvedValueOnce({
          id: 'enc1',
          status: EncounterStatus.ADMITTED,
        });

        orderRepositoryMock.findById.mockResolvedValueOnce(order);
        orderRepositoryMock.save.mockResolvedValueOnce({ ...order, status: OrderStatus.IN_PROGRESS });

        await expect(service.validateOrderResult('1', ResultStatus.FINAL)).rejects.toThrow(BadRequestException);
      });


  it('should update IN_PROGRESS order to COMPLETED and save when FINAL result', async () => {
    const order = {
      id: '1',
      encounterId: 'enc1',
      status: OrderStatus.IN_PROGRESS,
      results: [],
    };

    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      id: 'enc1',
      status: EncounterStatus.ADMITTED,
    });

    orderRepositoryMock.findById.mockResolvedValueOnce(order);
    orderRepositoryMock.save.mockResolvedValueOnce({ ...order, status: OrderStatus.COMPLETED });

    const result = await service.validateOrderResult('1', ResultStatus.FINAL);

    expect(result).toEqual({ ...order, status: OrderStatus.COMPLETED });
  });

  it('should return order when no changes needed', async () => {
    const order = {
      id: '1',
      encounterId: 'enc1',
      status: OrderStatus.IN_PROGRESS,
      results: [],
    };

    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      id: 'enc1',
      status: EncounterStatus.ADMITTED,
    });

    orderRepositoryMock.findById.mockResolvedValueOnce(order);

    const result = await service.validateOrderResult('1', ResultStatus.PRELIMINARY);

    expect(result).toBe(order);
  });
});
});

  describe('FN_cancelOrder_END', () => {
describe('cancelOrder', () => {
  it('should throw BadRequestException when order is already cancelled', async () => {
    const order = { id: '1', status: OrderStatus.CANCELLED };
    orderRepositoryMock.findById.mockResolvedValueOnce(order);

    await expect(
      service.cancelOrder('1'),
    ).rejects.toThrow(BadRequestException);

    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should save and return the order with updated status', async () => {
        const originalOrder = { id: '1', status: OrderStatus.PENDING };
        const savedOrder = { id: '1', status: OrderStatus.CANCELLED, ...originalOrder };
        
        orderRepositoryMock.findById.mockResolvedValueOnce(originalOrder);
        orderRepositoryMock.save.mockResolvedValueOnce(savedOrder);

        const result = await service.cancelOrder('1');

        expect(result).toEqual(savedOrder);
        expect(orderRepositoryMock.save).toHaveBeenCalledWith({ id: '1', status: OrderStatus.CANCELLED, ...originalOrder });
      });

});
});

  describe('FN_updateOrder_END', () => {
describe('updateOrder', () => {
  it('should throw BadRequestException when order is cancelled', async () => {
    const order = { id: '1', status: OrderStatus.CANCELLED };
    orderRepositoryMock.findById.mockResolvedValueOnce(order);

    await expect(
      service.updateOrder('1', {} as UpdateOrderDto),
    ).rejects.toThrow(BadRequestException);

    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when order is completed', async () => {
    const order = { id: '1', status: OrderStatus.COMPLETED };
    orderRepositoryMock.findById.mockResolvedValueOnce(order);

    await expect(
      service.updateOrder('1', {} as UpdateOrderDto),
    ).rejects.toThrow(BadRequestException);

    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when order is in progress and requestedBy is provided', async () => {
    const order = { id: '1', status: OrderStatus.IN_PROGRESS };
    orderRepositoryMock.findById.mockResolvedValueOnce(order);

    await expect(
      service.updateOrder('1', { requestedBy: 'test' } as UpdateOrderDto),
    ).rejects.toThrow(BadRequestException);

    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when requestedBy is set for in-progress order', async () => {
        const order = { id: '1', status: OrderStatus.IN_PROGRESS };
        orderRepositoryMock.findById.mockResolvedValueOnce(order);

        await expect(service.updateOrder('1', { requestedBy: 'test' } as UpdateOrderDto)).rejects.toThrow(BadRequestException);
    });


  it('should update and save order with notes field', async () => {
    const order = { id: '1', status: OrderStatus.IN_PROGRESS };
    orderRepositoryMock.findById.mockResolvedValueOnce(order);

    const updatedOrder = { ...order, notes: 'test' };
    orderRepositoryMock.save.mockResolvedValueOnce(updatedOrder);

    await service.updateOrder('1', { notes: 'test' } as UpdateOrderDto);

    expect(orderRepositoryMock.save).toHaveBeenCalledWith(updatedOrder);
  });

  it('should update and save order with both requestedBy and notes fields', async () => {
                const order = { id: '1', status: OrderStatus.PENDING };
                orderRepositoryMock.findById.mockResolvedValueOnce(order);

                const updatedOrder = { ...order, requestedBy: 'test', notes: 'notes' };
                orderRepositoryMock.save.mockResolvedValueOnce(updatedOrder);

                await service.updateOrder('1', { requestedBy: 'test', notes: 'notes' } as UpdateOrderDto);

                expect(orderRepositoryMock.save).toHaveBeenCalledWith(updatedOrder);
            });



});
});

  // TESTS_APPEND_HERE
});
