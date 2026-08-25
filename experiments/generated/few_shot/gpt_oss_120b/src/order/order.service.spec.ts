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
    orderRepositoryMock.findById.mockResolvedValueOnce(undefined);

    await expect(service.getOrderById('order-id')).rejects.toThrow(NotFoundException);
    expect(orderRepositoryMock.findById).toHaveBeenCalledWith('order-id');
  });

  it('should return the order when it exists', async () => {
    const order = {
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
    } as Order;

    orderRepositoryMock.findById.mockResolvedValueOnce(order);

    const result = await service.getOrderById('order-id');

    expect(orderRepositoryMock.findById).toHaveBeenCalledWith('order-id');
    expect(result).toBe(order);
  });
});
});

  describe('FN_createOrder_END', () => {
describe('createOrder', () => {
  it('should throw NotFoundException when encounter does not exist', async () => {
        encounterServiceMock.getEncounterById.mockRejectedValueOnce(new NotFoundException());

        await expect(
          service.createOrder({
            encounterId: 'enc-1',
            examType: ExamType.HEMOGRAM,
            requestedAt: new Date().toISOString(),
            requestedBy: 'user-1',
          } as CreateOrderDto),
        ).rejects.toThrow(NotFoundException);

        expect(orderRepositoryMock.existsPendingOrder).not.toHaveBeenCalled();
        expect(orderRepositoryMock.create).not.toHaveBeenCalled();
        expect(orderRepositoryMock.save).not.toHaveBeenCalled();
      });


  it('should throw ConflictException when a pending order already exists for the encounter', async () => {
    encounterServiceMock.getEncounterById.mockResolvedValueOnce({ id: 'enc-1', status: EncounterStatus.ADMITTED } as any);
    orderRepositoryMock.existsPendingOrder.mockResolvedValueOnce(true);

    await expect(
      service.createOrder({
        encounterId: 'enc-1',
        examType: ExamType.GLUCOSE,
        requestedAt: new Date().toISOString(),
        requestedBy: 'user-2',
      } as CreateOrderDto),
    ).rejects.toThrow(ConflictException);

    expect(orderRepositoryMock.create).not.toHaveBeenCalled();
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when encounter status is not admitted', async () => {
    encounterServiceMock.getEncounterById.mockResolvedValueOnce({ id: 'enc-2', status: EncounterStatus.DISCHARGED } as any);
    orderRepositoryMock.existsPendingOrder.mockResolvedValueOnce(false);

    await expect(
      service.createOrder({
        encounterId: 'enc-2',
        examType: ExamType.CREATININE,
        requestedAt: new Date().toISOString(),
        requestedBy: 'user-3',
      } as CreateOrderDto),
    ).rejects.toThrow(BadRequestException);

    expect(orderRepositoryMock.create).not.toHaveBeenCalled();
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should create and save a new order when all validations pass', async () => {
        const encounter = { id: 'enc-3', status: EncounterStatus.ADMITTED } as any;
        encounterServiceMock.getEncounterById.mockResolvedValueOnce(encounter);
        orderRepositoryMock.existsPendingOrder.mockResolvedValueOnce(false);

        const dto = {
          encounterId: 'enc-3',
          examType: ExamType.TSH,
          requestedAt: new Date().toISOString(),
          requestedBy: 'user-4',
          notes: 'fasting',
        } as CreateOrderDto;

        const createdOrder = {
          ...dto,
          requestedAt: new Date(dto.requestedAt),
          status: OrderStatus.PENDING,
          notes: dto.notes,
        } as any;

        orderRepositoryMock.create.mockReturnValueOnce(createdOrder);
        orderRepositoryMock.save.mockResolvedValueOnce({ id: 'order-1', ...createdOrder });

        const result = await service.createOrder(dto);

        expect(orderRepositoryMock.create).toHaveBeenCalledWith({
          ...dto,
          requestedAt: new Date(dto.requestedAt),
          status: OrderStatus.PENDING,
          notes: dto.notes,
        });
        expect(orderRepositoryMock.save).toHaveBeenCalledWith(createdOrder);
        expect(result).toEqual({ id: 'order-1', ...createdOrder });
      });

});
});

  describe('FN_searchOrders_END', () => {
describe('searchOrders', () => {
  it('should throw BadRequestException when dateFrom is after dateTo', async () => {
      const dto = {
        dateFrom: '2023-12-31',
        dateTo: '2023-01-01',
      } as SearchOrdersDto;

      orderRepositoryMock.search.mockRejectedValueOnce(new BadRequestException());

      await expect(service.searchOrders(dto)).rejects.toThrow(BadRequestException);
      expect(orderRepositoryMock.search).toHaveBeenCalledWith(dto);
    });


  it('should call repository.search with provided filters and return results', async () => {
    const dto = {
      status: OrderStatus.PENDING,
      dateFrom: '2023-01-01',
      dateTo: '2023-12-31',
      patientId: 'patient-123',
      encounterId: 'encounter-456',
    } as SearchOrdersDto;

    const expectedResult: PaginatedOrders = {
      items: [
        {
          id: 'order-1',
          encounterId: 'encounter-456',
          examType: ExamType.HEMOGRAM,
          status: OrderStatus.PENDING,
          requestedAt: new Date('2023-06-01'),
          requestedBy: 'user-1',
          notes: null,
          created_at: new Date(),
          updated_at: new Date(),
          encounter: {} as any,
          results: [] as any[],
        },
      ],
      total: 1,
      limit: 10,
      offset: 0,
    };

    orderRepositoryMock.search.mockReturnValueOnce(expectedResult);

    const result = await service.searchOrders(dto);

    expect(orderRepositoryMock.search).toHaveBeenCalledWith(dto);
    expect(result).toBe(expectedResult);
  });

  it('should return all orders when no filters are provided', async () => {
    const dto = {} as SearchOrdersDto;

    const expectedResult: PaginatedOrders = {
      items: [],
      total: 0,
      limit: 10,
      offset: 0,
    };

    orderRepositoryMock.search.mockReturnValueOnce(expectedResult);

    const result = await service.searchOrders(dto);

    expect(orderRepositoryMock.search).toHaveBeenCalledWith(dto);
    expect(result).toBe(expectedResult);
  });
});
});

  describe('FN_searchOrdersAdvanced_END', () => {
describe('searchOrdersAdvanced', () => {
  it('should throw BadRequestException when dateFrom is after dateTo', async () => {
      const dto: SearchOrdersAdvancedDto = {
        dateFrom: '2023-05-10',
        dateTo: '2023-04-01',
      } as any;

      orderRepositoryMock.searchAdvanced.mockRejectedValueOnce(
        new BadRequestException(),
      );

      await expect(service.searchOrdersAdvanced(dto)).rejects.toThrow(
        BadRequestException,
      );

      expect(orderRepositoryMock.searchAdvanced).toHaveBeenCalledWith(dto);
    });


  it('should call orderRepository.searchAdvanced with provided filters and return its result', async () => {
            const dto: SearchOrdersAdvancedDto = {
              status: OrderStatus.PENDING,
              examType: ExamType.HEMOGRAM,
              dateFrom: '2023-04-01',
              dateTo: '2023-05-01',
              patientId: 'patient-1',
              encounterId: 'enc-1',
              requestedBy: 'user-1',
              sortDirection: 'ASC' as any,
              page: 2,
              limit: 20,
            };

            const repoResult: PaginatedOrders = {
              data: [] as Order[],
              total: 0,
              page: 2,
              limit: 20,
              totalPages: 0,
            };

            orderRepositoryMock.searchAdvanced.mockResolvedValueOnce(repoResult);

            const result = await service.searchOrdersAdvanced(dto);

            expect(orderRepositoryMock.searchAdvanced).toHaveBeenCalledWith(dto);
            expect(result).toBe(repoResult);
          });


});
});

  describe('FN_validateOrderResult_END', () => {
describe('validateOrderResult', () => {
  it('should throw NotFoundException when order does not exist', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce(undefined);

    await expect(
      service.validateOrderResult('order-id', ResultStatus.FINAL),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException when encounter is discharged', async () => {
    const order = {
      id: 'order-id',
      encounterId: 'encounter-id',
      status: OrderStatus.IN_PROGRESS,
    } as Order;
    orderRepositoryMock.findById.mockResolvedValueOnce(order);
    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      id: 'encounter-id',
      status: EncounterStatus.DISCHARGED,
    });

    await expect(
      service.validateOrderResult('order-id', ResultStatus.FINAL),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw ConflictException when order status is not IN_PROGRESS', async () => {
        const order = {
          id: 'order-id',
          encounterId: 'encounter-id',
          status: OrderStatus.COMPLETED,
        } as Order;
        orderRepositoryMock.findById.mockResolvedValueOnce(order);
        encounterServiceMock.getEncounterById.mockResolvedValueOnce({
          id: 'encounter-id',
          status: EncounterStatus.ADMITTED,
        });

        await expect(
          service.validateOrderResult('order-id', ResultStatus.FINAL),
        ).rejects.toThrow(BadRequestException);
      });


  it('should save and return the order when validation passes', async () => {
    const order = {
      id: 'order-id',
      encounterId: 'encounter-id',
      status: OrderStatus.IN_PROGRESS,
    } as Order;
    orderRepositoryMock.findById.mockResolvedValueOnce(order);
    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      id: 'encounter-id',
      status: EncounterStatus.ADMITTED,
    });
    const savedOrder = { ...order, status: OrderStatus.COMPLETED };
    orderRepositoryMock.save.mockResolvedValueOnce(savedOrder);

    const result = await service.validateOrderResult('order-id', ResultStatus.FINAL);

    expect(orderRepositoryMock.save).toHaveBeenCalledWith({
      ...order,
      status: OrderStatus.COMPLETED,
    });
    expect(result).toBe(savedOrder);
  });
});
});

  describe('FN_cancelOrder_END', () => {
describe('cancelOrder', () => {
  it('should throw NotFoundException when order does not exist', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce(null);

    await expect(service.cancelOrder('order-id')).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException when order is already cancelled', async () => {
        orderRepositoryMock.findById.mockResolvedValueOnce({
          id: 'order-id',
          status: OrderStatus.CANCELLED,
        } as Order);

        await expect(service.cancelOrder('order-id')).rejects.toThrow(BadRequestException);
      });


  it('should throw BadRequestException when order is completed', async () => {
        orderRepositoryMock.findById.mockResolvedValueOnce({
          id: 'order-id',
          status: OrderStatus.CANCELLED,
        } as Order);

        await expect(service.cancelOrder('order-id')).rejects.toThrow(BadRequestException);
      });


  it('should cancel a pending order and persist changes', async () => {
        const pendingOrder = {
          id: 'order-id',
          status: OrderStatus.PENDING,
          encounterId: 'encounter-id',
        } as Order;

        orderRepositoryMock.findById.mockResolvedValueOnce(pendingOrder);
        orderRepositoryMock.save.mockResolvedValueOnce({
          ...pendingOrder,
          status: OrderStatus.CANCELLED,
        } as Order);

        await service.cancelOrder('order-id');

        expect(orderRepositoryMock.save).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 'order-id',
            status: OrderStatus.CANCELLED,
          }),
        );
      });

});
});

  describe('FN_updateOrder_END', () => {
describe('updateOrder', () => {
  it('should throw NotFoundException when order does not exist', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce(undefined);

    await expect(service.updateOrder('nonexistent-id', {} as UpdateOrderDto)).rejects.toThrow(NotFoundException);
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should update requestedBy and notes and persist the changes', async () => {
    const existingOrder = {
      id: 'order-1',
      encounterId: 'enc-1',
      examType: ExamType.HEMOGRAM,
      status: OrderStatus.PENDING,
      requestedAt: new Date(),
      requestedBy: 'original-user',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      encounter: {} as any,
      results: [] as any[],
    } as Order;

    const dto = {
      requestedBy: 'updated-user',
      notes: 'updated notes',
    } as UpdateOrderDto;

    const savedOrder = { ...existingOrder, ...dto };

    orderRepositoryMock.findById.mockResolvedValueOnce(existingOrder);
    orderRepositoryMock.save.mockReturnValueOnce(savedOrder);

    const result = await service.updateOrder('order-1', dto);

    expect(orderRepositoryMock.save).toHaveBeenCalledWith(savedOrder);
    expect(result).toBe(savedOrder);
  });

  it('should persist order without changes when dto has no updatable fields', async () => {
    const existingOrder = {
      id: 'order-2',
      encounterId: 'enc-2',
      examType: ExamType.GLUCOSE,
      status: OrderStatus.PENDING,
      requestedAt: new Date(),
      requestedBy: 'user',
      notes: 'existing notes',
      created_at: new Date(),
      updated_at: new Date(),
      encounter: {} as any,
      results: [] as any[],
    } as Order;

    const dto = {} as UpdateOrderDto;

    orderRepositoryMock.findById.mockResolvedValueOnce(existingOrder);
    orderRepositoryMock.save.mockReturnValueOnce(existingOrder);

    const result = await service.updateOrder('order-2', dto);

    expect(orderRepositoryMock.save).toHaveBeenCalledWith(existingOrder);
    expect(result).toBe(existingOrder);
  });
});
});

  // TESTS_APPEND_HERE
});
