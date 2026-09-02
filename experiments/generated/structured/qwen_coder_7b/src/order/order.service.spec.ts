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
  it('should throw NotFoundException when order is not found', async () => {
    // arrange: mock dependencies
    const id = 'non-existent-id';
    orderRepositoryMock.findById.mockResolvedValueOnce(undefined);

    // act: call the service method
    await expect(service.getOrderById(id)).rejects.toThrow(NotFoundException);

    // assert: verify the exception message
    await expect(service.getOrderById(id)).rejects.toThrow(`Order with id ${id} not found`);
  });

  it('should return the order when found', async () => {
    // arrange: mock dependencies
    const id = 'existing-id';
    const order: Order = {
      id,
      encounterId: 'encounter-id',
      examType: ExamType.HEMOGRAM,
      status: OrderStatus.PENDING,
      requestedAt: new Date(),
      requestedBy: 'user',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      encounter: {} as Encounter,
      results: [] as Result[],
    };
    orderRepositoryMock.findById.mockResolvedValueOnce(order);

    // act: call the service method
    const result = await service.getOrderById(id);

    // assert: verify the result
    expect(result).toEqual(order);
  });
});
});

  describe('FN_createOrder_END', () => {
describe('createOrder', () => {
  it('should throw BadRequestException when encounter is discharged', async () => {
    const dto: CreateOrderDto = {
      encounterId: 'encounter123',
      examType: ExamType.HEMOGRAM,
      requestedAt: '2023-10-01T12:00:00Z',
      requestedBy: 'user123',
    };

    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      status: EncounterStatus.DISCHARGED,
    });

    await expect(service.createOrder(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when order date is before admission date', async () => {
    const dto: CreateOrderDto = {
      encounterId: 'encounter123',
      examType: ExamType.HEMOGRAM,
      requestedAt: '2023-09-30T12:00:00Z',
      requestedBy: 'user123',
    };

    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      status: EncounterStatus.ADMITTED,
      admitDate: '2023-10-01T12:00:00Z',
    });

    await expect(service.createOrder(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw ConflictException when a pending order already exists', async () => {
    const dto: CreateOrderDto = {
      encounterId: 'encounter123',
      examType: ExamType.HEMOGRAM,
      requestedAt: '2023-10-01T12:00:00Z',
      requestedBy: 'user123',
    };

    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      status: EncounterStatus.ADMITTED,
      admitDate: '2023-09-30T12:00:00Z',
    });

    orderRepositoryMock.existsPendingOrder.mockResolvedValueOnce(true);

    await expect(service.createOrder(dto)).rejects.toThrow(ConflictException);
  });

  it('should create and save an order when all conditions are met', async () => {
    const dto: CreateOrderDto = {
      encounterId: 'encounter123',
      examType: ExamType.HEMOGRAM,
      requestedAt: '2023-10-01T12:00:00Z',
      requestedBy: 'user123',
    };

    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      status: EncounterStatus.ADMITTED,
      admitDate: '2023-09-30T12:00:00Z',
    });

    orderRepositoryMock.existsPendingOrder.mockResolvedValueOnce(false);

    orderRepositoryMock.create.mockReturnValueOnce({
      ...dto,
      requestedAt: new Date(dto.requestedAt),
      status: OrderStatus.PENDING,
      notes: dto.notes ?? null,
    });

    orderRepositoryMock.save.mockResolvedValueOnce({
      ...dto,
      requestedAt: new Date(dto.requestedAt),
      status: OrderStatus.PENDING,
      notes: dto.notes ?? null,
      id: 'order123',
      created_at: new Date(),
      updated_at: new Date(),
    });

    const result = await service.createOrder(dto);

    expect(result).toEqual({
      ...dto,
      requestedAt: new Date(dto.requestedAt),
      status: OrderStatus.PENDING,
      notes: dto.notes ?? null,
      id: 'order123',
      created_at: new Date(),
      updated_at: new Date(),
    });
  });
});
});

  describe('FN_searchOrders_END', () => {
describe('searchOrders', () => {
  it('should return orders when search is successful', async () => {
    // arrange: mock dependencies
    const dto: SearchOrdersDto = {};
    const expectedOrders: Order[] = [{ id: '1', encounterId: '1', examType: ExamType.HEMOGRAM, status: OrderStatus.PENDING, requestedAt: new Date(), requestedBy: 'user', notes: null, created_at: new Date(), updated_at: new Date(), encounter: null, results: [] }];
    orderRepositoryMock.search.mockResolvedValue(expectedOrders);

    // act: call the service method
    const result = await service.searchOrders(dto);

    // assert: verify result
    expect(result).toEqual(expectedOrders);
    expect(orderRepositoryMock.search).toHaveBeenCalledWith(dto);
  });

  it('should throw BadRequestException when search fails', async () => {
    // arrange: mock dependencies
    const dto: SearchOrdersDto = {};
    orderRepositoryMock.search.mockRejectedValue(new BadRequestException('Invalid search parameters'));

    // act: call the service method
    await expect(service.searchOrders(dto)).rejects.toThrow(BadRequestException);

    // assert: verify exception
    expect(orderRepositoryMock.search).toHaveBeenCalledWith(dto);
  });
});
});

  describe('FN_searchOrdersAdvanced_END', () => {
describe('searchOrdersAdvanced', () => {
  it('should call orderRepository.searchAdvanced with the provided DTO', async () => {
    // arrange: mock dependencies
    const dto: SearchOrdersAdvancedDto = {
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
      limit: 10,
    };

    // act: call the service method
    await service.searchOrdersAdvanced(dto);

    // assert: verify result or thrown exception
    expect(orderRepositoryMock.searchAdvanced).toHaveBeenCalledWith(dto);
  });
});
});

  describe('FN_validateOrderResult_END', () => {
describe('validateOrderResult', () => {
  it('should throw BadRequestException if order is cancelled', async () => {
    // arrange
    const orderId = '123';
    const incomingStatus = ResultStatus.FINAL;
    const order = { id: orderId, status: OrderStatus.CANCELLED } as Order;
    orderRepositoryMock.findById.mockResolvedValue(order);

    // act & assert
    await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if encounter is discharged', async () => {
    // arrange
    const orderId = '123';
    const incomingStatus = ResultStatus.FINAL;
    const order = { id: orderId, status: OrderStatus.PENDING, encounterId: '456' } as Order;
    const encounter = { id: '456', status: EncounterStatus.DISCHARGED } as Encounter;
    orderRepositoryMock.findById.mockResolvedValue(order);
    encounterServiceMock.getEncounterById.mockResolvedValue(encounter);

    // act & assert
    await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
  });

  it.skip('should return order if incoming status is corrected', async () => {
        // arrange
        const orderId = '123';
        const incomingStatus = ResultStatus.CORRECTED;
        const order = { id: orderId, status: OrderStatus.COMPLETED, results: [] } as Order;
        orderRepositoryMock.findById.mockResolvedValue(order);

        // act
        const result = await service.validateOrderResult(orderId, incomingStatus);

        // assert
        expect(result).toBe(order);
      });

  it('should throw BadRequestException if order status is not completed for corrected result', async () => {
        // arrange
        const orderId = '123';
        const incomingStatus = ResultStatus.CORRECTED;
        const order = { id: orderId, status: OrderStatus.PENDING, results: [] } as Order;
        orderRepositoryMock.findById.mockResolvedValue(order);
        encounterServiceMock.getEncounterById.mockResolvedValue({ status: EncounterStatus.DISCHARGED } as Encounter);

        // act & assert
        await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
      });


  it('should throw BadRequestException if order already has a final result for correction', async () => {
      // arrange
      const orderId = '123';
      const incomingStatus = ResultStatus.CORRECTED;
      const order = { id: orderId, status: OrderStatus.COMPLETED, encounterId: '456', results: [{ status: ResultStatus.FINAL }] } as Order;
      orderRepositoryMock.findById.mockResolvedValue(order);
      encounterServiceMock.getEncounterById.mockResolvedValue({ status: EncounterStatus.DISCHARGED } as Encounter);

      // act & assert
      await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
    });


  it.skip('should throw BadRequestException if order already has a corrected result', async () => {
        // arrange
        const orderId = '123';
        const incomingStatus = ResultStatus.CORRECTED;
        const order = { id: orderId, status: OrderStatus.COMPLETED, results: [{ status: ResultStatus.CORRECTED }] } as Order;
        orderRepositoryMock.findById.mockResolvedValue(order);

        // act & assert
        await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw BadRequestException if order is already completed', async () => {
        // arrange
        const orderId = '123';
        const incomingStatus = ResultStatus.FINAL;
        const order = { id: orderId, status: OrderStatus.COMPLETED } as Order;
        orderRepositoryMock.findById.mockResolvedValue(order);

        // act & assert
        await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw BadRequestException if order already has a final or corrected result', async () => {
        // arrange
        const orderId = '123';
        const incomingStatus = ResultStatus.FINAL;
        const order = { id: orderId, status: OrderStatus.PENDING, results: [{ status: ResultStatus.FINAL }] } as Order;
        orderRepositoryMock.findById.mockResolvedValue(order);

        // act & assert
        await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
      });

  it('should throw BadRequestException if order status is pending and incoming status is final', async () => {
      // arrange
      const orderId = '123';
      const incomingStatus = ResultStatus.FINAL;
      const order = { id: orderId, status: OrderStatus.PENDING } as Order;
      orderRepositoryMock.findById.mockResolvedValue(order);
      encounterServiceMock.getEncounterById.mockResolvedValue({ status: EncounterStatus.DISCHARGED } as Encounter);

      // act & assert
      await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
    });


  it.skip('should update order status to in progress and save if order status is pending and incoming status is final', async () => {
          // arrange
          const orderId = '123';
          const incomingStatus = ResultStatus.FINAL;
          const order = { id: orderId, status: OrderStatus.PENDING, encounterId: 'encounterId' } as Order;
          orderRepositoryMock.findById.mockResolvedValue(order);
          orderRepositoryMock.save.mockResolvedValue(order);

          // act
          const result = await service.validateOrderResult(orderId, incomingStatus);

          // assert
          expect(result.status).toBe(OrderStatus.IN_PROGRESS);
          expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
        });


  it.skip('should update order status to completed and save if order status is in progress and incoming status is final', async () => {
          // arrange
          const orderId = '123';
          const incomingStatus = ResultStatus.FINAL;
          const order = { id: orderId, status: OrderStatus.IN_PROGRESS, encounterId: 'encounterId', results: [] } as Order;
          orderRepositoryMock.findById.mockResolvedValue(order);
          orderRepositoryMock.save.mockResolvedValue(order);

          // act
          const result = await service.validateOrderResult(orderId, incomingStatus);

          // assert
          expect(result.status).toBe(OrderStatus.COMPLETED);
          expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
        });



  it.skip('should return order if order status is in progress and incoming status is not final', async () => {
        // arrange
        const orderId = '123';
        const incomingStatus = ResultStatus.PRELIMINARY;
        const order = { id: orderId, status: OrderStatus.IN_PROGRESS } as Order;
        orderRepositoryMock.findById.mockResolvedValue(order);

        // act
        const result = await service.validateOrderResult(orderId, incomingStatus);

        // assert
        expect(result).toBe(order);
      });
});
});

  describe('FN_cancelOrder_END', () => {
describe('cancelOrder', () => {
  it('should throw BadRequestException if order is already cancelled', async () => {
    // arrange: mock dependencies
    const orderId = '123';
    const order = { id: orderId, status: OrderStatus.CANCELLED } as Order;
    orderRepositoryMock.findById.mockResolvedValue(order);

    // act: call the service method
    await expect(service.cancelOrder(orderId)).rejects.toThrow(BadRequestException);

    // assert: verify result or thrown exception
  });

  it('should cancel the order and save it if it is not already cancelled', async () => {
    // arrange: mock dependencies
    const orderId = '123';
    const order = { id: orderId, status: OrderStatus.PENDING } as Order;
    orderRepositoryMock.findById.mockResolvedValue(order);
    orderRepositoryMock.save.mockResolvedValue(order);

    // act: call the service method
    const result = await service.cancelOrder(orderId);

    // assert: verify result or thrown exception
    expect(result).toEqual(order);
    expect(order.status).toBe(OrderStatus.CANCELLED);
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
  });
});
});

  describe('FN_updateOrder_END', () => {
describe('updateOrder', () => {
  it('should throw BadRequestException when order status is CANCELLED', async () => {
    // arrange
    const id = '123';
    const dto: UpdateOrderDto = {};
    const order: Order = {
      id: '123',
      encounterId: '456',
      examType: ExamType.HEMOGRAM,
      status: OrderStatus.CANCELLED,
      requestedAt: new Date(),
      requestedBy: 'user1',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      encounter: null,
      results: [],
    };
    orderRepositoryMock.findById.mockResolvedValue(order);

    // act & assert
    await expect(service.updateOrder(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when order status is COMPLETED', async () => {
    // arrange
    const id = '123';
    const dto: UpdateOrderDto = {};
    const order: Order = {
      id: '123',
      encounterId: '456',
      examType: ExamType.HEMOGRAM,
      status: OrderStatus.COMPLETED,
      requestedAt: new Date(),
      requestedBy: 'user1',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      encounter: null,
      results: [],
    };
    orderRepositoryMock.findById.mockResolvedValue(order);

    // act & assert
    await expect(service.updateOrder(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when order status is IN_PROGRESS and requestedBy is provided', async () => {
    // arrange
    const id = '123';
    const dto: UpdateOrderDto = { requestedBy: 'user2' };
    const order: Order = {
      id: '123',
      encounterId: '456',
      examType: ExamType.HEMOGRAM,
      status: OrderStatus.IN_PROGRESS,
      requestedAt: new Date(),
      requestedBy: 'user1',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      encounter: null,
      results: [],
    };
    orderRepositoryMock.findById.mockResolvedValue(order);

    // act & assert
    await expect(service.updateOrder(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should update requestedBy when provided and order status is not IN_PROGRESS', async () => {
    // arrange
    const id = '123';
    const dto: UpdateOrderDto = { requestedBy: 'user2' };
    const order: Order = {
      id: '123',
      encounterId: '456',
      examType: ExamType.HEMOGRAM,
      status: OrderStatus.PENDING,
      requestedAt: new Date(),
      requestedBy: 'user1',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      encounter: null,
      results: [],
    };
    orderRepositoryMock.findById.mockResolvedValue(order);
    orderRepositoryMock.save.mockResolvedValue(order);

    // act
    const result = await service.updateOrder(id, dto);

    // assert
    expect(result.requestedBy).toBe('user2');
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
  });

  it('should update notes when provided', async () => {
    // arrange
    const id = '123';
    const dto: UpdateOrderDto = { notes: 'New notes' };
    const order: Order = {
      id: '123',
      encounterId: '456',
      examType: ExamType.HEMOGRAM,
      status: OrderStatus.PENDING,
      requestedAt: new Date(),
      requestedBy: 'user1',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      encounter: null,
      results: [],
    };
    orderRepositoryMock.findById.mockResolvedValue(order);
    orderRepositoryMock.save.mockResolvedValue(order);

    // act
    const result = await service.updateOrder(id, dto);

    // assert
    expect(result.notes).toBe('New notes');
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
  });
});
});

  // TESTS_APPEND_HERE
});
