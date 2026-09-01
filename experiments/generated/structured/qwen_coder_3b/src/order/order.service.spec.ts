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

    // assert: verify result or thrown exception
  });
});
});

  describe('FN_createOrder_END', () => {
describe('createOrder', () => {
  it('should throw BadRequestException if encounter status is DISCHARGED', async () => {
    const dto: CreateOrderDto = {
      encounterId: '123',
      examType: ExamType.HEMOGRAM,
      requestedAt: '2023-01-01T12:00:00Z',
      requestedBy: 'John Doe',
      notes: 'Sample notes',
    };

    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      status: EncounterStatus.DISCHARGED,
    });

    await expect(() => service.createOrder(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if requestedAt is before admitDate', async () => {
    const dto: CreateOrderDto = {
      encounterId: '123',
      examType: ExamType.HEMOGRAM,
      requestedAt: '2022-12-31T12:00:00Z',
      requestedBy: 'John Doe',
      notes: 'Sample notes',
    };

    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      status: EncounterStatus.ADMITTED,
      admitDate: new Date('2023-01-01T12:00:00Z'),
    });

    await expect(() => service.createOrder(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw ConflictException if a pending order already exists', async () => {
    const dto: CreateOrderDto = {
      encounterId: '123',
      examType: ExamType.HEMOGRAM,
      requestedAt: '2023-01-01T12:00:00Z',
      requestedBy: 'John Doe',
      notes: 'Sample notes',
    };

    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      status: EncounterStatus.ADMITTED,
      admitDate: new Date('2023-01-01T12:00:00Z'),
    });

    orderRepositoryMock.existsPendingOrder.mockResolvedValueOnce(true);

    await expect(() => service.createOrder(dto)).rejects.toThrow(ConflictException);
  });
});
});

  describe('FN_searchOrdersAdvanced_END', () => {
describe('searchOrdersAdvanced', () => {
  it('should return a paginated orders object', async () => {
    // Arrange: mock dependencies
    const dto: SearchOrdersAdvancedDto = {
      status: OrderStatus.PENDING,
      examType: ExamType.HEMOGRAM,
      dateFrom: '2023-01-01',
      dateTo: '2023-12-31',
      patientId: '123',
      encounterId: '456',
      requestedBy: 'John Doe',
      sortBy: OrderSortField.REQUESTED_AT,
      sortDirection: SortDirection.DESC,
      page: 1,
      limit: 10,
    };

    const expectedResponse: PaginatedOrders = {
      data: [
        {
          id: '1',
          status: OrderStatus.PENDING,
          examType: ExamType.HEMOGRAM,
          requestedAt: new Date('2023-01-01T00:00:00Z'),
          patientId: '123',
          encounterId: '456',
          requestedBy: 'John Doe',
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    };

    orderRepositoryMock.searchAdvanced.mockResolvedValueOnce(expectedResponse);

    // Act: call the service method
    const result = await service.searchOrdersAdvanced(dto);

    // Assert: verify result or thrown exception
    expect(result).toEqual(expectedResponse);
  });

  it.skip('should throw a BadRequestException if dto is invalid', async () => {
        // Arrange: mock dependencies
        const dto: SearchOrdersAdvancedDto = {
          status: 'invalidStatus' as OrderStatus,
          examType: 'invalidExamType' as ExamType,
          dateFrom: 'invalidDate',
          dateTo: 'invalidDate',
          patientId: 'invalidId',
          encounterId: 'invalidId',
          requestedBy: 'invalidName',
          sortBy: 'invalidSortField' as OrderSortField,
          sortDirection: 'invalidSortDirection' as SortDirection,
          page: 'invalidPage' as number,
          limit: 'invalidLimit' as number,
        };

        // Act: call the service method
        await expect(service.searchOrdersAdvanced(dto)).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw a NotFoundException if no orders are found', async () => {
        // Arrange: mock dependencies
        const dto: SearchOrdersAdvancedDto = {
          status: OrderStatus.PENDING,
          examType: ExamType.HEMOGRAM,
          dateFrom: '2023-01-01',
          dateTo: '2023-12-31',
          patientId: '123',
          encounterId: '456',
          requestedBy: 'John Doe',
          sortBy: OrderSortField.REQUESTED_AT,
          sortDirection: SortDirection.DESC,
          page: 1,
          limit: 10,
        };

        orderRepositoryMock.searchAdvanced.mockResolvedValueOnce({
          data: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        });

        // Act: call the service method
        await expect(service.searchOrdersAdvanced(dto)).rejects.toThrow(NotFoundException);
      });

  it('should throw a ConflictException if there is a conflict', async () => {
    // Arrange: mock dependencies
    const dto: SearchOrdersAdvancedDto = {
      status: OrderStatus.PENDING,
      examType: ExamType.HEMOGRAM,
      dateFrom: '2023-01-01',
      dateTo: '2023-12-31',
      patientId: '123',
      encounterId: '456',
      requestedBy: 'John Doe',
      sortBy: OrderSortField.REQUESTED_AT,
      sortDirection: SortDirection.DESC,
      page: 1,
      limit: 10,
    };

    orderRepositoryMock.searchAdvanced.mockRejectedValueOnce(new ConflictException('Conflict message'));

    // Act: call the service method
    await expect(service.searchOrdersAdvanced(dto)).rejects.toThrow(ConflictException);
  });
});
});

  describe('FN_validateOrderResult_END', () => {
describe('validateOrderResult', () => {
  it('should throw BadRequestException when order.status is CANCELLED', async () => {
    const orderId = '123';
    const incomingStatus = ResultStatus.PRELIMINARY;

    jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValueOnce({
      status: OrderStatus.CANCELLED,
    });

    await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw BadRequestException when encounter.status is DISCHARGED', async () => {
    const orderId = '123';
    const incomingStatus = ResultStatus.PRELIMINARY;

    jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValueOnce({
      status: OrderStatus.IN_PROGRESS,
      encounterId: '456',
    });

    jest.spyOn(encounterServiceMock, 'getEncounterById').mockResolvedValueOnce({
      status: EncounterStatus.DISCHARGED,
    });

    await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(
      BadRequestException,
    );
  });

  it.skip('should return order when incomingStatus is CORRECTED', async () => {
          const orderId = '123';
          const incomingStatus = ResultStatus.CORRECTED;

          jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValueOnce({
            id: orderId,
            encounterId: '456',
            status: OrderStatus.COMPLETED,
            results: [
              { status: ResultStatus.FINAL },
              { status: ResultStatus.CORRECTED },
            ],
          });

          jest.spyOn(encounterServiceMock, 'getEncounterById').mockResolvedValueOnce({
            id: '456',
            status: EncounterStatus.IN_PROGRESS,
          });

          const result = await service.validateOrderResult(orderId, incomingStatus);

          expect(result).toBeDefined();
        });


  it.skip('should throw BadRequestException when order.status is not COMPLETED', async () => {
        const orderId = '123';
        const incomingStatus = ResultStatus.PRELIMINARY;

        jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValueOnce({
          status: OrderStatus.PENDING,
        });

        await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(
          BadRequestException,
        );
      });

  it('should throw BadRequestException when order.results has both FINAL and CORRECTED', async () => {
    const orderId = '123';
    const incomingStatus = ResultStatus.CORRECTED;

    jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValueOnce({
      status: OrderStatus.COMPLETED,
      results: [
        { status: ResultStatus.FINAL },
        { status: ResultStatus.CORRECTED },
      ],
    });

    jest.spyOn(encounterServiceMock, 'getEncounterById').mockResolvedValueOnce({
      status: EncounterStatus.IN_PROGRESS,
    });

    await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(
      BadRequestException,
    );
  });

  it.skip('should throw BadRequestException when order.status is COMPLETED', async () => {
          const orderId = '123';
          const incomingStatus = ResultStatus.PRELIMINARY;

          jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValueOnce({
            id: orderId,
            encounterId: '456',
            status: OrderStatus.COMPLETED,
            encounter: {
              status: EncounterStatus.DISCHARGED,
            },
            results: [],
          });

          await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(
            BadRequestException,
          );
        });


  it('should throw BadRequestException when order.results has both FINAL and CORRECTED', async () => {
    const orderId = '123';
    const incomingStatus = ResultStatus.CORRECTED;

    jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValueOnce({
      status: OrderStatus.COMPLETED,
      results: [
        { status: ResultStatus.FINAL },
        { status: ResultStatus.CORRECTED },
      ],
    });

    jest.spyOn(encounterServiceMock, 'getEncounterById').mockResolvedValueOnce({
      status: EncounterStatus.IN_PROGRESS,
    });

    await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(
      BadRequestException,
    );
  });

  it.skip('should throw BadRequestException when order.status is PENDING and incomingStatus is FINAL', async () => {
          const orderId = '123';
          const incomingStatus = ResultStatus.FINAL;

          jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValueOnce({
            id: orderId,
            encounterId: '456',
            status: OrderStatus.PENDING,
          });

          await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(
            BadRequestException,
          );
        });


  it.skip('should update order status to IN_PROGRESS and save it', async () => {
          const orderId = '123';
          const incomingStatus = ResultStatus.FINAL;

          jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValueOnce({
            id: orderId,
            encounterId: '456',
            status: OrderStatus.PENDING,
            encounter: {
              id: '456',
              status: EncounterStatus.IN_PROGRESS,
            },
            results: [],
          });

          jest.spyOn(encounterServiceMock, 'getEncounterById').mockResolvedValueOnce({
            id: '456',
            status: EncounterStatus.IN_PROGRESS,
          });

          const result = await service.validateOrderResult(orderId, incomingStatus);

          expect(result).toBeDefined();
          expect(orderRepositoryMock.save).toHaveBeenCalledWith(result);
        });


  it.skip('should update order status to COMPLETED and save it', async () => {
          const orderId = '123';
          const incomingStatus = ResultStatus.FINAL;

          jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValueOnce({
            id: orderId,
            encounterId: '456',
            status: OrderStatus.IN_PROGRESS,
            results: [],
          });

          jest.spyOn(encounterServiceMock, 'getEncounterById').mockResolvedValueOnce({
            id: '456',
            status: EncounterStatus.IN_PROGRESS,
          });

          const result = await service.validateOrderResult(orderId, incomingStatus);

          expect(result).toBeDefined();
          expect(orderRepositoryMock.save).toHaveBeenCalledWith(result);
        });

});
});

  describe('FN_cancelOrder_END', () => {
describe('cancelOrder', () => {
  it('should throw BadRequestException when order is already cancelled', async () => {
    // arrange: mock dependencies
    const order = { status: OrderStatus.CANCELLED } as Order;
    orderRepositoryMock.findById.mockResolvedValue(order);

    // act: call the service method
    await expect(service.cancelOrder('123')).rejects.toThrow(BadRequestException);
  });

  it('should update order status to cancelled and save it', async () => {
    // arrange: mock dependencies
    const order = { status: OrderStatus.PENDING } as Order;
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
    const order = { status: OrderStatus.CANCELLED } as Order;
    jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValue(order);
    await expect(service.updateOrder('1', { requestedBy: 'John' })).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when order status is IN_PROGRESS and requestedBy is provided', async () => {
    const order = { status: OrderStatus.IN_PROGRESS } as Order;
    jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValue(order);
    await expect(service.updateOrder('1', { requestedBy: 'John' })).rejects.toThrow(BadRequestException);
  });

  it('should update requestedBy when provided', async () => {
    const order = { requestedBy: 'John' } as Order;
    jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValue(order);
    jest.spyOn(orderRepositoryMock, 'save').mockResolvedValue(order);
    await service.updateOrder('1', { requestedBy: 'Jane' });
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
  });

  it('should update notes when provided', async () => {
    const order = { notes: 'Old notes' } as Order;
    jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValue(order);
    jest.spyOn(orderRepositoryMock, 'save').mockResolvedValue(order);
    await service.updateOrder('1', { notes: 'New notes' });
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
  });
});
});

  // TESTS_APPEND_HERE
});
