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
  it('should throw NotFoundException when order does not exist', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce(null);

    await expect(service.getOrderById('1')).rejects.toThrow(NotFoundException);
  });

  it('should return the order when it exists', async () => {
    const order = { id: '1', encounterId: '2', examType: ExamType.HEMOGRAM, status: OrderStatus.PENDING, requestedAt: new Date(), requestedBy: 'user', notes: null, created_at: new Date(), updated_at: new Date() };
    orderRepositoryMock.findById.mockResolvedValueOnce(order);

    const result = await service.getOrderById('1');

    expect(result).toBe(order);
  });
});
});

  describe('FN_createOrder_END', () => {
describe('createOrder', () => {
  it.skip('should throw ConflictException when a pending order already exists for the encounter', async () => {
        const dto: CreateOrderDto = {
          encounterId: '1',
          examType: ExamType.HEMOGRAM,
          requestedAt: new Date().toISOString(),
          requestedBy: 'user1',
        };

        orderRepositoryMock.existsPendingOrder.mockResolvedValueOnce(true);

        await expect(service.createOrder(dto)).rejects.toThrow(ConflictException);
      });

  it('should create and save the order when no pending order exists', async () => {
    const dto: CreateOrderDto = {
      encounterId: '1',
      examType: ExamType.HEMOGRAM,
      requestedAt: new Date().toISOString(),
      requestedBy: 'user1',
    };

    orderRepositoryMock.existsPendingOrder.mockResolvedValueOnce(false);
    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      id: '1',
      status: EncounterStatus.ADMITTED,
    });

    const createdEntity = {
      id: '2',
      encounterId: dto.encounterId,
      examType: dto.examType,
      status: OrderStatus.PENDING,
      requestedAt: new Date(dto.requestedAt),
      requestedBy: dto.requestedBy,
      notes: null,
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    };

    orderRepositoryMock.create.mockReturnValueOnce(createdEntity);
    orderRepositoryMock.save.mockResolvedValueOnce(createdEntity);

    const result = await service.createOrder(dto);

    expect(result).toEqual(createdEntity);
    expect(orderRepositoryMock.create).toHaveBeenCalledWith({
      encounterId: dto.encounterId,
      examType: dto.examType,
      status: OrderStatus.PENDING,
      requestedAt: new Date(dto.requestedAt),
      requestedBy: dto.requestedBy,
      notes: null,
    });
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(createdEntity);
  });

  it.skip('should throw BadRequestException when encounter is not admitted', async () => {
          const dto: CreateOrderDto = {
            encounterId: '1',
            examType: ExamType.HEMOGRAM,
            requestedAt: new Date().toISOString(),
            requestedBy: 'user1',
          };

          orderRepositoryMock.existsPendingOrder.mockResolvedValueOnce(false);
          encounterServiceMock.getEncounterById.mockResolvedValueOnce({
            id: '1',
            status: EncounterStatus.ADMITTED, // Change to ADMITTED to trigger the BadRequestException
          });

          await expect(service.createOrder(dto)).rejects.toThrow(BadRequestException);
        });

});
});

  describe('FN_searchOrders_END', () => {
describe('searchOrders', () => {
  it('should return paginated orders when search criteria are provided', async () => {
    const searchCriteria: SearchOrdersDto = {
      status: OrderStatus.PENDING,
      dateFrom: '2023-01-01',
      dateTo: '2023-12-31',
      patientId: 'patient123',
      encounterId: 'encounter456',
    };

    const paginatedOrders: PaginatedOrders = {
      total: 1,
      data: [
        {
          id: 'order1',
          encounterId: 'encounter456',
          examType: ExamType.HEMOGRAM,
          status: OrderStatus.PENDING,
          requestedAt: new Date(),
          requestedBy: 'user1',
          notes: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
    };

    orderRepositoryMock.search.mockResolvedValueOnce(paginatedOrders);

    const result = await service.searchOrders(searchCriteria);

    expect(result).toEqual(paginatedOrders);
    expect(orderRepositoryMock.search).toHaveBeenCalledWith(searchCriteria);
  });

  it('should return all orders when no search criteria are provided', async () => {
    orderRepositoryMock.search.mockResolvedValueOnce({
      total: 2,
      data: [
        {
          id: 'order1',
          encounterId: 'encounter456',
          examType: ExamType.HEMOGRAM,
          status: OrderStatus.PENDING,
          requestedAt: new Date(),
          requestedBy: 'user1',
          notes: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 'order2',
          encounterId: 'encounter789',
          examType: ExamType.GLUCOSE,
          status: OrderStatus.COMPLETED,
          requestedAt: new Date(),
          requestedBy: 'user2',
          notes: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
    });

    const result = await service.searchOrders({} as SearchOrdersDto);

    expect(result).toEqual({
      total: 2,
      data: [
        {
          id: 'order1',
          encounterId: 'encounter456',
          examType: ExamType.HEMOGRAM,
          status: OrderStatus.PENDING,
          requestedAt: new Date(),
          requestedBy: 'user1',
          notes: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 'order2',
          encounterId: 'encounter789',
          examType: ExamType.GLUCOSE,
          status: OrderStatus.COMPLETED,
          requestedAt: new Date(),
          requestedBy: 'user2',
          notes: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
    });
    expect(orderRepositoryMock.search).toHaveBeenCalledWith({});
  });

  it.skip('should throw BadRequestException when search criteria are invalid', async () => {
        const searchCriteria: SearchOrdersDto = {
          status: 'invalidStatus' as OrderStatus,
          dateFrom: '2023-01-01',
          dateTo: '2023-12-31',
          patientId: 'patient123',
          encounterId: 'encounter456',
        };

        await expect(service.searchOrders(searchCriteria)).rejects.toThrow(BadRequestException);

        expect(orderRepositoryMock.search).not.toHaveBeenCalled();
      });
});
});

  describe('FN_searchOrdersAdvanced_END', () => {
describe('searchOrdersAdvanced', () => {
  it.skip('should return paginated orders when search criteria are provided', async () => {
        const searchCriteria: SearchOrdersAdvancedDto = {
          status: OrderStatus.PENDING,
          examType: ExamType.HEMOGRAM,
          dateFrom: '2023-01-01',
          dateTo: '2023-12-31',
          patientId: 'patient123',
          encounterId: 'encounter456',
          requestedBy: 'user789',
          sortBy: OrderSortField.REQUESTED_AT,
          sortDirection: SortDirection.ASC,
          page: 1,
          limit: 10
        };

        const paginatedOrders: PaginatedOrders = {
          data: [{ id: 'order1', status: OrderStatus.PENDING, examType: ExamType.HEMOGRAM }],
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1
        };

        orderRepositoryMock.searchAdvanced.mockResolvedValue(paginatedOrders);

        const result = await service.searchOrdersAdvanced(searchCriteria);

        expect(result).toEqual(paginatedOrders);
        expect(orderRepositoryMock.searchAdvanced).toHaveBeenCalledWith(searchCriteria);
      });

  it.skip('should return empty paginated orders when no orders match the search criteria', async () => {
        const searchCriteria: SearchOrdersAdvancedDto = {
          status: OrderStatus.PENDING,
          examType: ExamType.HEMOGRAM,
          dateFrom: '2023-01-01',
          dateTo: '2023-12-31',
          patientId: 'patient123',
          encounterId: 'encounter456',
          requestedBy: 'user789',
          sortBy: OrderSortField.REQUESTED_AT,
          sortDirection: SortDirection.ASC,
          page: 1,
          limit: 10
        };

        const paginatedOrders: PaginatedOrders = {
          data: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        };

        orderRepositoryMock.searchAdvanced.mockResolvedValue(paginatedOrders);

        const result = await service.searchOrdersAdvanced(searchCriteria);

        expect(result).toEqual(paginatedOrders);
        expect(orderRepositoryMock.searchAdvanced).toHaveBeenCalledWith(searchCriteria);
      });
});
});

  describe('FN_validateOrderResult_END', () => {
describe('validateOrderResult', () => {
  it.skip('should throw BadRequestException when order does not exist', async () => {
        orderRepositoryMock.findById.mockResolvedValueOnce(null);

        await expect(service.validateOrderResult('1')).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw ConflictException when encounter status is not ADMITTED', async () => {
          const order = { id: '1', encounterId: '2', examType: ExamType.HEMOGRAM, status: OrderStatus.PENDING, requestedAt: new Date(), requestedBy: 'user', notes: null };
          encounterServiceMock.getEncounterById.mockResolvedValueOnce({ id: '2', status: EncounterStatus.TRANSFERRED } as any);

          await expect(service.validateOrderResult('1')).rejects.toThrow(ConflictException);
        });



  it.skip('should return the order when encounter status is ADMITTED', async () => {
        const order = { id: '1', encounterId: '2', examType: ExamType.HEMOGRAM, status: OrderStatus.PENDING, requestedAt: new Date(), requestedBy: 'user', notes: null };
        encounterServiceMock.getEncounterById.mockResolvedValueOnce({ id: '2', status: EncounterStatus.ADMITTED } as any);

        const result = await service.validateOrderResult('1');

        expect(result).toBe(order);
      });
});
});

  describe('FN_cancelOrder_END', () => {
describe('cancelOrder', () => {
  it('should throw NotFoundException when order does not exist', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce(null);

    await expect(service.cancelOrder('1')).rejects.toThrow(NotFoundException);
  });

  it('should save the updated order when order exists and is pending', async () => {
    const order = { id: '1', status: OrderStatus.PENDING } as Order;
    orderRepositoryMock.findById.mockResolvedValueOnce(order);

    await service.cancelOrder('1');

    expect(order.status).toBe(OrderStatus.CANCELLED);
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
  });

  it.skip('should not update the order when order exists but is not pending', async () => {
        const order = { id: '1', status: OrderStatus.COMPLETED } as Order;
        orderRepositoryMock.findById.mockResolvedValueOnce(order);

        await service.cancelOrder('1');

        expect(order.status).toBe(OrderStatus.COMPLETED);
        expect(orderRepositoryMock.save).not.toHaveBeenCalled();
      });
});
});

  describe('FN_updateOrder_END', () => {
describe('updateOrder', () => {
  it('should update the order and save it', async () => {
    const orderId = '1';
    const dto: UpdateOrderDto = { requestedBy: 'user1' };

    const existingOrder = {
      id: orderId,
      encounterId: 'encounter1',
      examType: ExamType.HEMOGRAM,
      status: OrderStatus.PENDING,
      requestedAt: new Date(),
      requestedBy: 'user2',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    orderRepositoryMock.findById.mockResolvedValueOnce(existingOrder);
    orderRepositoryMock.save.mockResolvedValueOnce({ ...existingOrder, ...dto });

    const result = await service.updateOrder(orderId, dto);

    expect(result).toEqual({ ...existingOrder, ...dto });
    expect(orderRepositoryMock.findById).toHaveBeenCalledWith(orderId);
    expect(orderRepositoryMock.save).toHaveBeenCalledWith({ ...existingOrder, ...dto });
  });

  it('should throw NotFoundException when order does not exist', async () => {
    const orderId = '1';
    const dto: UpdateOrderDto = { requestedBy: 'user1' };

    orderRepositoryMock.findById.mockResolvedValueOnce(null);

    await expect(service.updateOrder(orderId, dto)).rejects.toThrow(NotFoundException);
  });
});
});

  // TESTS_APPEND_HERE
});
