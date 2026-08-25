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
  it('should return an order when found', async () => {
    const orderId = '123';
    const mockOrder: Order = {
      id: orderId,
      encounterId: '456',
      examType: ExamType.HEMOGRAM,
      status: OrderStatus.PENDING,
      requestedAt: new Date(),
      requestedBy: 'user1',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      encounter: {} as Encounter,
      results: [] as Result[],
    };

    orderRepositoryMock.findById.mockResolvedValue(mockOrder);

    const result = await service.getOrderById(orderId);
    expect(result).toEqual(mockOrder);
  });

  it('should throw NotFoundException when order is not found', async () => {
    const orderId = '123';
    orderRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(service.getOrderById(orderId)).rejects.toThrow(NotFoundException);
  });
});
});

  describe('FN_createOrder_END', () => {
describe('createOrder', () => {
  it('should create a new order when no pending orders exist', async () => {
    const encounterId = 'encounter123';
    const examType = ExamType.HEMOGRAM;
    const requestedAt = new Date().toISOString();
    const requestedBy = 'user123';
    const notes = 'Some notes';

    const createOrderDto: CreateOrderDto = {
      encounterId,
      examType,
      requestedAt,
      requestedBy,
      notes,
    };

    orderRepositoryMock.existsPendingOrder.mockResolvedValue(false);
    encounterServiceMock.getEncounterById.mockResolvedValue({ status: EncounterStatus.ADMITTED } as any);

    await service.createOrder(createOrderDto);

    expect(orderRepositoryMock.create).toHaveBeenCalledWith({
      encounterId,
      examType,
      requestedAt: new Date(requestedAt),
      requestedBy,
      notes,
      status: OrderStatus.PENDING,
    });
    expect(orderRepositoryMock.save).toHaveBeenCalled();
  });

  it('should throw BadRequestException if a pending order exists', async () => {
        const encounterId = 'encounter123';
        const examType = ExamType.HEMOGRAM;
        const requestedAt = new Date().toISOString();
        const requestedBy = 'user123';

        const createOrderDto: CreateOrderDto = {
          encounterId,
          examType,
          requestedAt,
          requestedBy,
        };

        orderRepositoryMock.existsPendingOrder.mockResolvedValue(true);
        encounterServiceMock.getEncounterById.mockResolvedValue({
          id: encounterId,
          status: EncounterStatus.DISCHARGED,
          admitDate: new Date(),
        });

        await expect(service.createOrder(createOrderDto)).rejects.toThrow(BadRequestException);
      });


  it.skip('should throw NotFoundException if the encounter does not exist', async () => {
        const encounterId = 'encounter123';
        const examType = ExamType.HEMOGRAM;
        const requestedAt = new Date().toISOString();
        const requestedBy = 'user123';

        const createOrderDto: CreateOrderDto = {
          encounterId,
          examType,
          requestedAt,
          requestedBy,
        };

        orderRepositoryMock.existsPendingOrder.mockResolvedValue(false);
        encounterServiceMock.getEncounterById.mockResolvedValue(undefined);

        await expect(service.createOrder(createOrderDto)).rejects.toThrow(NotFoundException);
      });
});
});

  describe('FN_searchOrders_END', () => {
describe('searchOrders', () => {
  it('should return orders based on search criteria', async () => {
    const searchDto: SearchOrdersDto = {
      status: OrderStatus.PENDING,
      dateFrom: '2023-01-01',
      dateTo: '2023-12-31',
      patientId: 'patient123',
      encounterId: 'encounter456'
    };

    const expectedOrders: Order[] = [
      { id: 'order1', status: OrderStatus.PENDING, created_at: new Date('2023-06-01') },
      { id: 'order2', status: OrderStatus.IN_PROGRESS, created_at: new Date('2023-11-01') }
    ];

    orderRepositoryMock.search.mockResolvedValue(expectedOrders);

    const result = await service.searchOrders(searchDto);

    expect(result).toEqual(expectedOrders);
    expect(orderRepositoryMock.search).toHaveBeenCalledWith(searchDto);
  });

  it('should return an empty array if no orders match the criteria', async () => {
    const searchDto: SearchOrdersDto = {
      status: OrderStatus.PENDING,
      dateFrom: '2023-01-01',
      dateTo: '2023-12-31',
      patientId: 'patient123',
      encounterId: 'encounter456'
    };

    orderRepositoryMock.search.mockResolvedValue([]);

    const result = await service.searchOrders(searchDto);

    expect(result).toEqual([]);
    expect(orderRepositoryMock.search).toHaveBeenCalledWith(searchDto);
  });

  it('should handle an error if the search fails', async () => {
    const searchDto: SearchOrdersDto = {
      status: OrderStatus.PENDING,
      dateFrom: '2023-01-01',
      dateTo: '2023-12-31',
      patientId: 'patient123',
      encounterId: 'encounter456'
    };

    orderRepositoryMock.search.mockRejectedValue(new Error('Search failed'));

    await expect(service.searchOrders(searchDto)).rejects.toThrowError('Search failed');
  });
});
});

  describe('FN_searchOrdersAdvanced_END', () => {
describe('searchOrdersAdvanced', () => {
  it.skip('should return paginated orders when valid search criteria are provided', async () => {
        const searchDto: SearchOrdersAdvancedDto = {
          status: OrderStatus.PENDING,
          examType: ExamType.HEMOGRAM,
          dateFrom: '2023-01-01',
          dateTo: '2023-12-31',
          patientId: 'patient123',
          encounterId: 'encounter456',
          requestedBy: 'user789',
          sortBy: OrderSortField.REQUESTED_AT,
          sortDirection: SortDirection.DESC,
          page: 1,
          limit: 10
        };

        const expectedOrders: Order[] = [
          // Mock order data here
        ];

        const paginatedResult: PaginatedOrders = {
          data: expectedOrders,
          total: 5,
          page: 1,
          limit: 10,
          totalPages: 1
        };

        jest.spyOn(orderRepositoryMock, 'searchAdvanced').mockResolvedValue(paginatedResult);

        const result = await service.searchOrdersAdvanced(searchDto);

        expect(result).toEqual(paginatedResult);
        expect(orderRepositoryMock.searchAdvanced).toHaveBeenCalledWith(searchDto);
      });

  it('should handle empty search criteria and return all orders', async () => {
    const searchDto: SearchOrdersAdvancedDto = {};

    const expectedOrders: Order[] = [
      // Mock order data here
    ];

    const paginatedResult: PaginatedOrders = {
      data: expectedOrders,
      total: 5,
      page: 1,
      limit: 10,
      totalPages: 1
    };

    jest.spyOn(orderRepositoryMock, 'searchAdvanced').mockResolvedValue(paginatedResult);

    const result = await service.searchOrdersAdvanced(searchDto);

    expect(result).toEqual(paginatedResult);
    expect(orderRepositoryMock.searchAdvanced).toHaveBeenCalledWith({});
  });

  it('should handle invalid search criteria and return an empty result', async () => {
      const searchDto: SearchOrdersAdvancedDto = {
        status: 'invalidStatus' as OrderStatus,
        examType: 'invalidExamType' as ExamType,
        dateFrom: '2023-13-01',
        dateTo: '2023-00-31',
        patientId: 'patient123',
        encounterId: 'encounter456',
        requestedBy: 'user789',
        sortBy: 'invalidSortField' as OrderSortField,
        sortDirection: 'invalidSortDirection' as SortDirection,
        page: 0,
        limit: -1
      };

      const expectedOrders: Order[] = [];

      const paginatedResult: PaginatedOrders = {
        data: expectedOrders,
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1
      };

      jest.spyOn(orderRepositoryMock, 'searchAdvanced').mockResolvedValue(paginatedResult);

      const result = await service.searchOrdersAdvanced(searchDto);

      expect(result).toEqual(paginatedResult);
      expect(orderRepositoryMock.searchAdvanced).toHaveBeenCalledWith(searchDto);
    });

});
});

  describe('FN_validateOrderResult_END', () => {
describe('validateOrderResult', () => {
  it.skip('should throw BadRequestException if order does not exist', async () => {
        const orderId = '123';
        orderRepositoryMock.findById.mockResolvedValue(undefined);

        await expect(service.validateOrderResult(orderId)).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw ConflictException if order status is not COMPLETED', async () => {
        const orderId = '123';
        const order: Order = {
          id: orderId,
          encounterId: '456',
          examType: ExamType.HEMOGRAM,
          status: OrderStatus.PENDING,
          requestedAt: new Date(),
          requestedBy: 'user1',
          notes: null,
          created_at: new Date(),
          updated_at: new Date(),
          encounter: { id: '456', status: EncounterStatus.ADMITTED },
          results: [],
        };
        orderRepositoryMock.findById.mockResolvedValue(order);

        await expect(service.validateOrderResult(orderId)).rejects.toThrow(ConflictException);
      });

  it.skip('should return true if order exists and status is COMPLETED', async () => {
        const orderId = '123';
        const order: Order = {
          id: orderId,
          encounterId: '456',
          examType: ExamType.HEMOGRAM,
          status: OrderStatus.COMPLETED,
          requestedAt: new Date(),
          requestedBy: 'user1',
          notes: null,
          created_at: new Date(),
          updated_at: new Date(),
          encounter: { id: '456', status: EncounterStatus.ADMITTED },
          results: [],
        };
        orderRepositoryMock.findById.mockResolvedValue(order);

        const result = await service.validateOrderResult(orderId);
        expect(result).toBe(true);
      });
});
});

  describe('FN_cancelOrder_END', () => {
describe('cancelOrder', () => {
  it('should cancel an order and update its status to CANCELLED', async () => {
    const orderId = '123';
    const order: Order = {
      id: orderId,
      encounterId: '456',
      examType: ExamType.HEMOGRAM,
      status: OrderStatus.PENDING,
      requestedAt: new Date(),
      requestedBy: 'user',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      encounter: { id: '456', status: EncounterStatus.OPEN } as Encounter,
      results: [],
    };

    orderRepositoryMock.findById.mockResolvedValue(order);
    orderRepositoryMock.save.mockResolvedValue(order);

    await service.cancelOrder(orderId);

    expect(order.status).toBe(OrderStatus.CANCELLED);
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
  });

  it('should throw NotFoundException if the order does not exist', async () => {
    const orderId = '123';

    orderRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(service.cancelOrder(orderId)).rejects.toThrow(NotFoundException);
  });
});
});

  describe('FN_updateOrder_END', () => {
describe('updateOrder', () => {
  it.skip('should update an order with new requestedBy and notes', async () => {
        const orderId = '123';
        const updateDto: UpdateOrderDto = { requestedBy: 'newUser', notes: 'updated notes' };
        const updatedOrder: Order = { ...order, requestedBy: 'newUser', notes: 'updated notes' };

        orderRepositoryMock.findById.mockResolvedValue(order);
        orderRepositoryMock.save.mockResolvedValue(updatedOrder);

        const result = await service.updateOrder(orderId, updateDto);

        expect(result).toEqual(updatedOrder);
        expect(orderRepositoryMock.findById).toHaveBeenCalledWith(orderId);
        expect(orderRepositoryMock.save).toHaveBeenCalledWith({ ...order, requestedBy: 'newUser', notes: 'updated notes' });
      });

  it('should throw NotFoundException if order is not found', async () => {
    const orderId = '123';
    const updateDto: UpdateOrderDto = { requestedBy: 'newUser', notes: 'updated notes' };

    orderRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(service.updateOrder(orderId, updateDto)).rejects.toThrow(NotFoundException);
    expect(orderRepositoryMock.findById).toHaveBeenCalledWith(orderId);
  });

  it.skip('should throw BadRequestException if new requestedBy is invalid', async () => {
            const orderId = '123';
            const updateDto: UpdateOrderDto = { requestedBy: '', notes: 'updated notes' };
            const order: Order = { ...order, status: OrderStatus.IN_PROGRESS, requestedBy: 'user' };

            orderRepositoryMock.findById.mockResolvedValue(order);

            await expect(service.updateOrder(orderId, updateDto)).rejects.toThrow(BadRequestException);
            expect(orderRepositoryMock.findById).toHaveBeenCalledWith(orderId);
          });

});
});

  // TESTS_APPEND_HERE
});
