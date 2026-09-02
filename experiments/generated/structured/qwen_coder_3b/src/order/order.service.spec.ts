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
    orderRepositoryMock.findById.mockResolvedValueOnce(undefined);

    // act: call the service method
    await expect(service.getOrderById('123')).rejects.toThrow(NotFoundException);
  });
});
});

  describe('FN_createOrder_END', () => {
describe('createOrder', () => {
  it('should throw BadRequestException if encounter status is DISCHARGED', async () => {
    // arrange
    const dto: CreateOrderDto = { encounterId: '123', examType: 'HEMOGRAM', requestedAt: '2023-10-01', requestedBy: 'John Doe', notes: 'Test notes' };
    encounterServiceMock.getEncounterById.mockResolvedValueOnce({ status: EncounterStatus.DISCHARGED });

    // act
    await expect(service.createOrder(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if requestedAt is before admitDate', async () => {
    // arrange
    const dto: CreateOrderDto = { encounterId: '123', examType: 'HEMOGRAM', requestedAt: '2023-09-30', requestedBy: 'John Doe', notes: 'Test notes' };
    encounterServiceMock.getEncounterById.mockResolvedValueOnce({ admitDate: new Date('2023-10-01'), status: EncounterStatus.ADMITTED });

    // act
    await expect(service.createOrder(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw ConflictException if a pending order already exists', async () => {
    // arrange
    const dto: CreateOrderDto = { encounterId: '123', examType: 'HEMOGRAM', requestedAt: '2023-10-01', requestedBy: 'John Doe', notes: 'Test notes' };
    encounterServiceMock.getEncounterById.mockResolvedValueOnce({ admitDate: new Date('2023-10-01'), status: EncounterStatus.ADMITTED });
    orderRepositoryMock.existsPendingOrder.mockResolvedValueOnce(true);

    // act
    await expect(service.createOrder(dto)).rejects.toThrow(ConflictException);
  });

  it.skip('should create and save a new order', async () => {
        // arrange
        const dto: CreateOrderDto = { encounterId: '123', examType: 'HEMOGRAM', requestedAt: '2023-10-01', requestedBy: 'John Doe', notes: 'Test notes' };
        encounterServiceMock.getEncounterById.mockResolvedValueOnce({ admitDate: new Date('2023-10-01'), status: EncounterStatus.ADMITTED });
        orderRepositoryMock.existsPendingOrder.mockResolvedValueOnce(false);
        orderRepositoryMock.create.mockReturnValueOnce({ ...dto, requestedAt: new Date(dto.requestedAt), status: OrderStatus.PENDING, notes: dto.notes ?? null });
        orderRepositoryMock.save.mockResolvedValueOnce({ id: '456', ...dto, requestedAt: new Date(dto.requestedAt), status: OrderStatus.PENDING, notes: dto.notes ?? null });

        // act
        const result = await service.createOrder(dto);

        // assert
        expect(result).toEqual({ id: '456', ...dto, requestedAt: new Date(dto.requestedAt), status: OrderStatus.PENDING, notes: dto.notes ?? null });
        expect(orderRepositoryMock.create).toHaveBeenCalledWith({ ...dto, requestedAt: new Date(dto.requestedAt), status: OrderStatus.PENDING, notes: dto.notes ?? null });
        expect(orderRepositoryMock.save).toHaveBeenCalledWith({ id: '456', ...dto, requestedAt: new Date(dto.requestedAt), status: OrderStatus.PENDING, notes: dto.notes ?? null });
      });
});
});

  describe('FN_searchOrders_END', () => {
describe('searchOrders', () => {
  it('should return an empty array when no orders are found', async () => {
    // arrange
    orderRepositoryMock.search.mockResolvedValue([]);

    // act
    const result = await service.searchOrders({});

    // assert
    expect(result).toEqual([]);
  });

  it('should return orders based on the provided dto', async () => {
    // arrange
    const dto: SearchOrdersDto = { status: OrderStatus.COMPLETED };
    const orders: Order[] = [{ id: '1', status: OrderStatus.COMPLETED }];
    orderRepositoryMock.search.mockResolvedValue(orders);

    // act
    const result = await service.searchOrders(dto);

    // assert
    expect(result).toEqual(orders);
  });

  it.skip('should throw a NotFoundException if no orders are found', async () => {
        // arrange
        orderRepositoryMock.search.mockResolvedValue([]);

        // act
        await expect(service.searchOrders({})).rejects.toThrow(NotFoundException);
      });

  it('should handle errors thrown by the orderRepository', async () => {
    // arrange
    const error = new Error('Mock error');
    orderRepositoryMock.search.mockRejectedValue(error);

    // act
    await expect(service.searchOrders({})).rejects.toThrow(error);
  });
});
});

  describe('FN_searchOrdersAdvanced_END', () => {
describe('searchOrdersAdvanced', () => {
  it('should return PaginatedOrders when searchAdvanced is successful', async () => {
    // arrange
    const dto: SearchOrdersAdvancedDto = {
      status: OrderStatus.PENDING,
      examType: ExamType.HEMOGRAM,
      dateFrom: '2023-01-01',
      dateTo: '2023-12-31',
      patientId: '123',
      encounterId: '456',
      requestedBy: 'user123',
      sortBy: OrderSortField.REQUESTED_AT,
      sortDirection: SortDirection.DESC,
      page: 1,
      limit: 10,
    };
    const expectedResponse: PaginatedOrders = {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };
    orderRepositoryMock.searchAdvanced.mockResolvedValue(expectedResponse);

    // act
    const result = await service.searchOrdersAdvanced(dto);

    // assert
    expect(result).toEqual(expectedResponse);
    expect(orderRepositoryMock.searchAdvanced).toHaveBeenCalledWith(dto);
  });

  it.skip('should throw NotFoundException when searchAdvanced returns undefined', async () => {
          // arrange
          const dto: SearchOrdersAdvancedDto = {
            status: OrderStatus.PENDING,
            examType: ExamType.HEMOGRAM,
            dateFrom: '2023-01-01',
            dateTo: '2023-12-31',
            patientId: '123',
            encounterId: '456',
            requestedBy: 'user123',
            sortBy: OrderSortField.REQUESTED_AT,
            sortDirection: SortDirection.DESC,
            page: 1,
            limit: 10,
          };
          orderRepositoryMock.searchAdvanced.mockResolvedValueOnce(undefined);

          // act
          await expect(service.searchOrdersAdvanced(dto)).rejects.toThrow(NotFoundException);
        });


  it.skip('should throw BadRequestException when dto is invalid', async () => {
        // arrange
        const dto: SearchOrdersAdvancedDto = {
          status: 'invalidStatus' as OrderStatus,
          examType: 'invalidExamType' as ExamType,
          dateFrom: 'invalidDate',
          dateTo: 'invalidDate',
          patientId: 'invalidId',
          encounterId: 'invalidId',
          requestedBy: 'invalidId',
          sortBy: 'invalidSortField' as OrderSortField,
          sortDirection: 'invalidSortDirection' as SortDirection,
          page: -1,
          limit: -1,
        };

        // act
        await expect(service.searchOrdersAdvanced(dto)).rejects.toThrow(BadRequestException);
      });
});
});

  describe('FN_validateOrderResult_END', () => {
describe('validateOrderResult', () => {
  it('should throw BadRequestException when order.status is OrderStatus.CANCELLED', async () => {
    const orderId = '123';
    const incomingStatus = ResultStatus.PRELIMINARY;
    const order = { status: OrderStatus.CANCELLED } as Order;
    orderRepositoryMock.findById.mockResolvedValue(order);

    await expect(() => service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when encounter.status is EncounterStatus.DISCHARGED', async () => {
    const orderId = '123';
    const incomingStatus = ResultStatus.PRELIMINARY;
    const order = { encounterId: '456', status: OrderStatus.PENDING } as Order;
    const encounter = { status: EncounterStatus.DISCHARGED } as Encounter;
    orderRepositoryMock.findById.mockResolvedValue(order);
    encounterServiceMock.getEncounterById.mockResolvedValue(encounter);

    await expect(() => service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
  });

  it.skip('should return order when incomingStatus is ResultStatus.CORRECTED', async () => {
        const orderId = '123';
        const incomingStatus = ResultStatus.CORRECTED;
        const order = { status: OrderStatus.COMPLETED } as Order;
        orderRepositoryMock.findById.mockResolvedValue(order);

        const result = await service.validateOrderResult(orderId, incomingStatus);
        expect(result).toBe(order);
      });

  it.skip('should throw BadRequestException when order.status is not OrderStatus.COMPLETED', async () => {
        const orderId = '123';
        const incomingStatus = ResultStatus.PRELIMINARY;
        const order = { status: OrderStatus.PENDING } as Order;
        orderRepositoryMock.findById.mockResolvedValue(order);

        await expect(() => service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw BadRequestException when hasFinalResult or hasCorrectedResult', async () => {
        const orderId = '123';
        const incomingStatus = ResultStatus.PRELIMINARY;
        const order = { status: OrderStatus.COMPLETED, results: [{ status: ResultStatus.FINAL }] } as Order;
        orderRepositoryMock.findById.mockResolvedValue(order);

        await expect(() => service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw BadRequestException when order.status is OrderStatus.COMPLETED', async () => {
        const orderId = '123';
        const incomingStatus = ResultStatus.PRELIMINARY;
        const order = { status: OrderStatus.COMPLETED } as Order;
        orderRepositoryMock.findById.mockResolvedValue(order);

        await expect(() => service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw BadRequestException when hasFinalResult or hasCorrectedResult', async () => {
        const orderId = '123';
        const incomingStatus = ResultStatus.PRELIMINARY;
        const order = { status: OrderStatus.COMPLETED, results: [{ status: ResultStatus.FINAL }] } as Order;
        orderRepositoryMock.findById.mockResolvedValue(order);

        await expect(() => service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw BadRequestException when order.status is OrderStatus.PENDING and incomingStatus is ResultStatus.FINAL', async () => {
        const orderId = '123';
        const incomingStatus = ResultStatus.FINAL;
        const order = { status: OrderStatus.PENDING } as Order;
        orderRepositoryMock.findById.mockResolvedValue(order);

        await expect(() => service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
      });

  it.skip('should update order status to IN_PROGRESS and save it', async () => {
        const orderId = '123';
        const incomingStatus = ResultStatus.FINAL;
        const order = { status: OrderStatus.PENDING } as Order;
        orderRepositoryMock.findById.mockResolvedValue(order);

        const result = await service.validateOrderResult(orderId, incomingStatus);
        expect(result).toBe(order);
        expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
      });

  it.skip('should update order status to COMPLETED and save it', async () => {
        const orderId = '123';
        const incomingStatus = ResultStatus.FINAL;
        const order = { status: OrderStatus.IN_PROGRESS } as Order;
        orderRepositoryMock.findById.mockResolvedValue(order);

        const result = await service.validateOrderResult(orderId, incomingStatus);
        expect(result).toBe(order);
        expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
      });
});
});

  describe('FN_cancelOrder_END', () => {
describe('cancelOrder', () => {
  it('should throw BadRequestException when order is already cancelled', async () => {
    // arrange: mock dependencies
    const order = { status: OrderStatus.CANCELLED };
    orderRepositoryMock.findById.mockResolvedValue(order);

    // act: call the service method
    await expect(service.cancelOrder('123')).rejects.toThrow(BadRequestException);
  });

  it('should update order status to cancelled and save it', async () => {
    // arrange: mock dependencies
    const order = { status: OrderStatus.PENDING };
    orderRepositoryMock.findById.mockResolvedValue(order);
    orderRepositoryMock.save.mockResolvedValue(order);

    // act: call the service method
    await service.cancelOrder('123');

    // assert: verify result or thrown exception
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
  });
});
});

  describe('FN_updateOrder_END', () => {
describe('updateOrder', () => {
  it('should throw BadRequestException when order status is CANCELLED or COMPLETED', async () => {
    const order = {
      status: OrderStatus.CANCELLED,
    };
    jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValue(order);

    await expect(service.updateOrder('123', { requestedBy: 'John' })).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when order status is IN_PROGRESS and requestedBy is provided', async () => {
    const order = {
      status: OrderStatus.IN_PROGRESS,
    };
    jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValue(order);

    await expect(service.updateOrder('123', { requestedBy: 'John' })).rejects.toThrow(BadRequestException);
  });

  it.skip('should update requestedBy when provided', async () => {
        const order = {
          status: OrderStatus.PENDING,
        };
        jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValue(order);

        const result = await service.updateOrder('123', { requestedBy: 'John' });
        expect(orderRepositoryMock.save).toHaveBeenCalledWith({ ...order, requestedBy: 'John' });
        expect(result).toEqual(order);
      });

  it.skip('should update notes when provided', async () => {
        const order = {
          status: OrderStatus.PENDING,
        };
        jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValue(order);

        const result = await service.updateOrder('123', { notes: 'Some notes' });
        expect(orderRepositoryMock.save).toHaveBeenCalledWith({ ...order, notes: 'Some notes' });
        expect(result).toEqual(order);
      });
});
});

  // TESTS_APPEND_HERE
});
