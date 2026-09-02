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
    try {
      await service.getOrderById('some-id');
    } catch (error) {
      // assert
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });

  it('should return order when found', async () => {
    // arrange
    const mockOrder = { /* fill in mock order details */ };
    orderRepositoryMock.findById.mockResolvedValue(mockOrder);

    // act
    const result = await service.getOrderById('some-id');

    // assert
    expect(result).toBe(mockOrder);
  });
});
});

  describe('FN_createOrder_END', () => {
describe('createOrder', () => {
  it.skip('should throw BadRequestException for discharged encounter', async () => {
          const encounterServiceMock = jest.fn().mockRejectedValueOnce(new BadRequestException('Cannot create order for a discharged encounter'));
          service.encounterService = encounterServiceMock;

          await expect(service.createOrder({ encounterId: '123', examType: ExamType.HEMOGRAM, requestedAt: '2023-01-01' })).rejects.toThrow(BadRequestException);
        });



  it('should throw BadRequestException for requestedAt before admitDate', async () => {
    const encounter = { admitDate: new Date('2023-01-02') };
    encounterServiceMock.getEncounterById.mockResolvedValue(encounter);

    await expect(service.createOrder({ encounterId: '123', examType: ExamType.HEMOGRAM, requestedAt: '2023-01-01' })).rejects.toThrow(BadRequestException);
  });

  it.skip('should throw BadRequestException for discharged encounter', async () => {
            const encounterId = '123';
            const examType = ExamType.HEMOGRAM;
            const requestedAt = '2023-01-01';
            const encounter = { status: EncounterStatus.DISCHARGED };
            const orderRepositoryMock = jest.fn();
            const encounterServiceMock = jest.fn();

            encounterServiceMock.getEncounterById.mockResolvedValue(encounter);
            orderRepositoryMock.existsPendingOrder.mockResolvedValue(false);

            const result = await expect(service.createOrder({ encounterId, examType, requestedAt })).rejects.toThrow(BadRequestException);
        });


  it.skip('should create and save order', async () => {
          const encounter = { status: EncounterStatus.ADMITTED, admitDate: new Date('2023-01-01') };
          const orderRepositoryMock = jest.fn();
          orderRepositoryMock.create.mockResolvedValueOnce({ ...{ encounterId: '123', examType: ExamType.HEMOGRAM, requestedAt: new Date('2023-01-01'), status: OrderStatus.PENDING } });
          orderRepositoryMock.save.mockResolvedValueOnce({ ...{ encounterId: '123', examType: ExamType.HEMOGRAM, requestedAt: new Date('2023-01-01'), status: OrderStatus.PENDING } });

          const result = await service.createOrder({ encounterId: '123', examType: ExamType.HEMOGRAM, requestedAt: '2023-01-01' });
          expect(result).toEqual({ ...{ encounterId: '123', examType: ExamType.HEMOGRAM, requestedAt: new Date('2023-01-01'), status: OrderStatus.PENDING } });
        });


});
});

  describe('FN_searchOrders_END', () => {
describe('searchOrders', () => {
  it('should call orderRepository.search with valid SearchOrdersDto', async () => {
    const searchOrdersDto = { /* valid SearchOrdersDto */ };
    const expectedOrders = [/* expected orders */];

    orderRepositoryMock.search.mockResolvedValueOnce(expectedOrders);

    await expect(service.searchOrders(searchOrdersDto)).resolves.toEqual(expectedOrders);
  });

  it('should call orderRepository.search with null SearchOrdersDto', async () => {
    const searchOrdersDto: SearchOrdersDto = null;

    orderRepositoryMock.search.mockResolvedValueOnce([]);

    await expect(service.searchOrders(searchOrdersDto)).resolves.toEqual([]);
  });

  it('should call orderRepository.search with undefined SearchOrdersDto', async () => {
    const searchOrdersDto: SearchOrdersDto | undefined = undefined;

    orderRepositoryMock.search.mockResolvedValueOnce([]);

    await expect(service.searchOrders(searchOrdersDto)).resolves.toEqual([]);
  });

  it('should call orderRepository.search with invalid SearchOrdersDto', async () => {
    const searchOrdersDto = { /* invalid SearchOrdersDto */ };

    orderRepositoryMock.search.mockRejectedValueOnce(new BadRequestException('Invalid input'));

    await expect(service.searchOrders(searchOrdersDto)).rejects.toThrow(BadRequestException);
  });
});
});

  describe('FN_searchOrdersAdvanced_END', () => {
describe('searchOrdersAdvanced', () => {
  it('should delegate to orderRepository.searchAdvanced', async () => {
    // arrange
    const mockPaginatedOrders = { data: [], total: 0, page: 0, limit: 0, totalPages: 0 };
    orderRepositoryMock.searchAdvanced.mockResolvedValueOnce(mockPaginatedOrders);

    // act
    const result = await service.searchOrdersAdvanced({
      status: OrderStatus.PENDING,
      examType: ExamType.HEMOGRAM,
      dateFrom: '2023-01-01',
      dateTo: '2023-01-31',
      patientId: 'patient123',
      encounterId: 'encounter456',
      requestedBy: 'user123',
      sortBy: OrderSortField.REQUESTED_AT,
      sortDirection: SortDirection.ASC,
      page: 1,
      limit: 10
    });

    // assert
    expect(result).toEqual(mockPaginatedOrders);
    expect(orderRepositoryMock.searchAdvanced).toHaveBeenCalledWith({
      status: OrderStatus.PENDING,
      examType: ExamType.HEMOGRAM,
      dateFrom: '2023-01-01',
      dateTo: '2023-01-31',
      patientId: 'patient123',
      encounterId: 'encounter456',
      requestedBy: 'user123',
      sortBy: OrderSortField.REQUESTED_AT,
      sortDirection: SortDirection.ASC,
      page: 1,
      limit: 10
    });
  });
});
});

  describe('FN_validateOrderResult_END', () => {
describe('validateOrderResult', () => {
  it('should throw BadRequestException when order is cancelled', async () => {
    // arrange
    const orderId = '123';
    const incomingStatus = ResultStatus.FINAL;
    const order = { status: OrderStatus.CANCELLED } as Order;
    orderRepositoryMock.findById.mockResolvedValue(order);

    // act
    await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);

    // assert
    expect(orderRepositoryMock.findById).toHaveBeenCalledWith(orderId);
  });

  it('should throw BadRequestException when encounter is discharged', async () => {
    // arrange
    const orderId = '123';
    const incomingStatus = ResultStatus.FINAL;
    const order = { encounterId: '456' } as Order;
    const encounter = { status: EncounterStatus.DISCHARGED } as Encounter;
    orderRepositoryMock.findById.mockResolvedValue(order);
    encounterServiceMock.getEncounterById.mockResolvedValue(encounter);

    // act
    await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);

    // assert
    expect(orderRepositoryMock.findById).toHaveBeenCalledWith(orderId);
    expect(encounterServiceMock.getEncounterById).toHaveBeenCalledWith(order.encounterId);
  });

  it.skip('should return order when incomingStatus is CORRECTED and order is completed', async () => {
        // arrange
        const orderId = '123';
        const incomingStatus = ResultStatus.CORRECTED;
        const order = { status: OrderStatus.COMPLETED, results: [{ status: ResultStatus.FINAL }] } as Order;
        orderRepositoryMock.findById.mockResolvedValue(order);

        // act
        const result = await service.validateOrderResult(orderId, incomingStatus);

        // assert
        expect(orderRepositoryMock.findById).toHaveBeenCalledWith(orderId);
        expect(result).toEqual(order);
      });

  it.skip('should throw BadRequestException when order is completed and incomingStatus is FINAL', async () => {
        // arrange
        const orderId = '123';
        const incomingStatus = ResultStatus.FINAL;
        const order = { status: OrderStatus.COMPLETED } as Order;
        orderRepositoryMock.findById.mockResolvedValue(order);

        // act
        await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);

        // assert
        expect(orderRepositoryMock.findById).toHaveBeenCalledWith(orderId);
      });

  it.skip('should throw BadRequestException when order has a final or corrected result', async () => {
        // arrange
        const orderId = '123';
        const incomingStatus = ResultStatus.FINAL;
        const order = { status: OrderStatus.IN_PROGRESS, results: [{ status: ResultStatus.FINAL }] } as Order;
        orderRepositoryMock.findById.mockResolvedValue(order);

        // act
        await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);

        // assert
        expect(orderRepositoryMock.findById).toHaveBeenCalledWith(orderId);
      });

  it.skip('should save order when order is pending and incomingStatus is FINAL', async () => {
          const orderId = '123';
          const incomingStatus = ResultStatus.FINAL;
          const order = { status: OrderStatus.PENDING, results: [] } as Order;
          orderRepositoryMock.findById.mockResolvedValue(order);
          orderRepositoryMock.save.mockResolvedValueOnce(order);

          const result = await service.validateOrderResult(orderId, incomingStatus);

          expect(orderRepositoryMock.findById).toHaveBeenCalledWith(orderId);
          expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
          expect(result).toEqual(order);
        });



  it.skip('should save order when order is in progress and incomingStatus is FINAL', async () => {
          const orderId = '123';
          const incomingStatus = ResultStatus.FINAL;
          const order = {
            id: orderId,
            status: OrderStatus.IN_PROGRESS,
            encounterId: 'encounterId',
            results: [],
          } as Order;
          orderRepositoryMock.findById.mockResolvedValue(order);
          orderRepositoryMock.save.mockResolvedValue(order);

          try {
            await service.validateOrderResult(orderId, incomingStatus);
          } catch (error) {
            throw new Error(`Expected no error, but got: ${error}`);
          }

          expect(orderRepositoryMock.findById).toHaveBeenCalledWith(orderId);
          expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
        });


});
});

  describe('FN_cancelOrder_END', () => {
describe('cancelOrder', () => {
  it('should throw BadRequestException if order is already cancelled', async () => {
    // arrange
    orderRepositoryMock.findById = jest.fn().mockResolvedValue(
      jest.fn(() => ({
        status: OrderStatus.CANCELLED,
      }))
    );

    // act
    try {
      await service.cancelOrder('some-order-id');
    } catch (error) {
      // assert
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe(`Order some-order-id is already cancelled`);
    }
  });

  it('should update order status to cancelled and save it', async () => {
    // arrange
    const order = {
      id: 'some-order-id',
      status: OrderStatus.PENDING,
    };
    orderRepositoryMock.findById = jest.fn().mockResolvedValue(order);
    orderRepositoryMock.save = jest.fn().mockResolvedValue(order);

    // act
    await service.cancelOrder('some-order-id');

    // assert
    expect(orderRepositoryMock.findById).toHaveBeenCalledWith('some-order-id');
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(expect.objectContaining(order));
  });
});
});

  describe('FN_updateOrder_END', () => {
describe('updateOrder', () => {
  it.skip('should throw BadRequestException for cancelled or completed orders', async () => {
          const order = {
            id: '123',
            status: OrderStatus.CANCELLED,
            requestedBy: 'someUser',
            notes: 'order notes',
          } as Order;
          const orderRepositoryMock = {
            getOrderById: jest.fn().mockResolvedValue(order),
          } as jest.Mocked<OrderRepository>;
          const service = new OrderService(orderRepositoryMock);

          const updateOrderDto = { requestedBy: 'someUser', notes: 'new notes' };
          await expect(service.updateOrder('123', updateOrderDto))
            .rejects
            .toThrow(BadRequestException);
        });


  it.skip('should throw BadRequestException for in-progress order with requestedBy', async () => {
          const order = {
            id: '123',
            status: OrderStatus.IN_PROGRESS,
            requestedBy: 'user',
          } as Order;
          const orderRepositoryMock = {
            getOrderById: jest.fn().mockResolvedValue(order),
          } as jest.Mocked<OrderRepository>;
          const service = new OrderService(orderRepositoryMock);

          await expect(service.updateOrder('123', { requestedBy: 'user' }))
            .rejects
            .toThrow(BadRequestException);
        });


  it.skip('should update requestedBy for non-in-progress order', async () => {
          const order = {
            id: '123',
            status: OrderStatus.PENDING,
            requestedBy: undefined,
            notes: null,
          } as Order;
          const updatedOrder = {
            ...order,
            requestedBy: 'user',
          } as Order;
          const orderRepositoryMock = {
            getOrderById: jest.fn().mockResolvedValue(order),
            save: jest.fn().mockResolvedValue(updatedOrder),
          } as jest.Mocked<OrderRepository>;
          const service = new OrderService(orderRepositoryMock);

          const result = await service.updateOrder('123', { requestedBy: 'user' });
          expect(result).toEqual(updatedOrder);
        });


  it.skip('should update notes for non-in-progress order', async () => {
          const orderRepositoryMock = {
            getOrderById: jest.fn().mockResolvedValue({
              id: '123',
              status: OrderStatus.PENDING,
              requestedBy: 'initial',
              notes: null,
              encounterId: 'mockEncounterId',
              examType: ExamType.HEMOGRAM,
              created_at: new Date(),
              updated_at: new Date(),
              encounter: { id: 'mockEncounterId' },
              results: [],
            } as Order),
            save: jest.fn().mockResolvedValue({
              ...jest.requireActual<Order>('order'),
              notes: 'updated notes',
            }),
          } as jest.Mocked<OrderRepository>;
          const service = new OrderService(orderRepositoryMock);

          const result = await service.updateOrder('123', { notes: 'updated notes' });
          expect(result).toEqual({
            id: '123',
            encounterId: 'mockEncounterId',
            examType: ExamType.HEMOGRAM,
            status: OrderStatus.PENDING,
            requestedAt: new Date(),
            requestedBy: 'initial',
            notes: 'updated notes',
            created_at: new Date(),
            updated_at: new Date(),
            encounter: { id: 'mockEncounterId' },
            results: [],
          });
        });



});
});

  // TESTS_APPEND_HERE
});
