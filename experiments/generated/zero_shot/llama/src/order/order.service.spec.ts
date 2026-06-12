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

  describe('getOrderById', () => {
  it('should throw NotFoundException when order is not found', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce(undefined);
    await expect(service.getOrderById('some-id')).rejects.toThrow(NotFoundException);
  });

  it('should return order when found', async () => {
    const order: Order = {
      id: 'some-id',
      encounterId: 'some-encounter-id',
      examType: ExamType.HEMOGRAM,
      status: OrderStatus.PENDING,
      requestedAt: new Date(),
      requestedBy: 'some-requested-by',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      encounter: {} as any,
      results: [],
    };
    orderRepositoryMock.findById.mockResolvedValueOnce(order);
    const result = await service.getOrderById('some-id');
    expect(result).toEqual(order);
  });
});

  describe('createOrder', () => {
  it('should throw BadRequestException when encounter is discharged', async () => {
    const dto: CreateOrderDto = {
      encounterId: 'encounterId',
      examType: ExamType.HEMOGRAM,
      requestedAt: '2022-01-01T00:00:00.000Z',
      requestedBy: 'requestedBy',
    };
    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      status: EncounterStatus.DISCHARGED,
      admitDate: '2022-01-01T00:00:00.000Z',
    });
    await expect(service.createOrder(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when order date is before admission date', async () => {
    const dto: CreateOrderDto = {
      encounterId: 'encounterId',
      examType: ExamType.HEMOGRAM,
      requestedAt: '2021-12-31T00:00:00.000Z',
      requestedBy: 'requestedBy',
    };
    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      status: EncounterStatus.ADMITTED,
      admitDate: '2022-01-01T00:00:00.000Z',
    });
    await expect(service.createOrder(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw ConflictException when a pending order for this exam already exists', async () => {
    const dto: CreateOrderDto = {
      encounterId: 'encounterId',
      examType: ExamType.HEMOGRAM,
      requestedAt: '2022-01-01T00:00:00.000Z',
      requestedBy: 'requestedBy',
    };
    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      status: EncounterStatus.ADMITTED,
      admitDate: '2022-01-01T00:00:00.000Z',
    });
    orderRepositoryMock.existsPendingOrder.mockResolvedValueOnce(true);
    await expect(service.createOrder(dto)).rejects.toThrow(ConflictException);
  });
});

  describe('searchOrders', () => {
  it('should call orderRepository.search with provided SearchOrdersDto', async () => {
    const searchOrdersDto: SearchOrdersDto = {
      status: OrderStatus.PENDING,
      dateFrom: '2022-01-01',
      dateTo: '2022-01-31',
      patientId: 'patient-id',
      encounterId: 'encounter-id',
    };
    const orders: Order[] = [
      {
        id: 'order-id',
        encounterId: 'encounter-id',
        examType: ExamType.HEMOGRAM,
        status: OrderStatus.PENDING,
        requestedAt: new Date(),
        requestedBy: 'requested-by',
        notes: 'notes',
        created_at: new Date(),
        updated_at: new Date(),
        encounter: {} as any,
        results: [],
      },
    ];
    orderRepositoryMock.search.mockResolvedValue(orders);
    const result = await service.searchOrders(searchOrdersDto);
    expect(orderRepositoryMock.search).toHaveBeenCalledTimes(1);
    expect(orderRepositoryMock.search).toHaveBeenCalledWith(searchOrdersDto);
    expect(result).toEqual(orders);
  });

  it('should return empty array when orderRepository.search returns empty array', async () => {
    const searchOrdersDto: SearchOrdersDto = {
      status: OrderStatus.PENDING,
      dateFrom: '2022-01-01',
      dateTo: '2022-01-31',
      patientId: 'patient-id',
      encounterId: 'encounter-id',
    };
    orderRepositoryMock.search.mockResolvedValue([]);
    const result = await service.searchOrders(searchOrdersDto);
    expect(orderRepositoryMock.search).toHaveBeenCalledTimes(1);
    expect(orderRepositoryMock.search).toHaveBeenCalledWith(searchOrdersDto);
    expect(result).toEqual([]);
  });
});

  describe('searchOrdersAdvanced', () => {
  it.skip('should call orderRepository.searchAdvanced with provided dto', async () => {
              const dto: SearchOrdersAdvancedDto = {
                status: OrderStatus.PENDING,
                examType: ExamType.HEMOGRAM,
                dateFrom: '2022-01-01',
                dateTo: '2022-01-31',
                patientId: 'patient-1',
                encounterId: 'encounter-1',
                requestedBy: 'user-1',
                sortBy: OrderSortField.REQUESTED_AT,
                sortDirection: SortDirection.ASC,
                page: 1,
                limit: 10,
              };
              const result: PaginatedOrders = {
                data: [],
                total: 0,
                page: 1,
                limit: 10,
                totalPages: 1,
              };
              orderRepositoryMock.searchAdvanced.mockResolvedValue(result);
              const response = await service.searchOrdersAdvanced(dto);
              expect(orderRepositoryMock.searchAdvanced).toHaveBeenCalledTimes(1);
              expect(orderRepositoryMock.searchAdvanced).toHaveBeenCalledWith({
                status: OrderStatus.PENDING,
                examType: ExamType.HEMOGRAM,
                dateFrom: '2022-01-01',
                dateTo: '2022-01-31',
                patientId: 'patient-1',
                encounterId: 'encounter-1',
                requestedBy: 'user-1',
                sortBy: OrderSortField.REQUESTED_AT,
                sortDirection: SortDirection.ASC,
                page: 1,
                limit: 10,
              });
              expect(response).toEqual(result);
            });


});

  describe('validateOrderResult', () => {
  it('should throw BadRequestException when order is cancelled', async () => {
    const orderId = 'orderId';
    const incomingStatus = ResultStatus.PRELIMINARY;
    const order = { id: orderId, status: OrderStatus.CANCELLED } as Order;
    orderRepositoryMock.findById.mockResolvedValue(order);
    await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when order is completed', async () => {
    const orderId = 'orderId';
    const incomingStatus = ResultStatus.PRELIMINARY;
    const order = { id: orderId, status: OrderStatus.COMPLETED } as Order;
    orderRepositoryMock.findById.mockResolvedValue(order);
    await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when encounter is discharged', async () => {
    const orderId = 'orderId';
    const incomingStatus = ResultStatus.PRELIMINARY;
    const order = { id: orderId, status: OrderStatus.PENDING, encounterId: 'encounterId' } as Order;
    const encounter = { id: 'encounterId', status: EncounterStatus.DISCHARGED };
    orderRepositoryMock.findById.mockResolvedValue(order);
    encounterServiceMock.getEncounterById.mockResolvedValue(encounter);
    await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when order already has a final or corrected result', async () => {
    const orderId = 'orderId';
    const incomingStatus = ResultStatus.PRELIMINARY;
    const order = { id: orderId, status: OrderStatus.PENDING, encounterId: 'encounterId', results: [{ status: ResultStatus.FINAL }] } as Order;
    const encounter = { id: 'encounterId', status: EncounterStatus.ADMITTED };
    orderRepositoryMock.findById.mockResolvedValue(order);
    encounterServiceMock.getEncounterById.mockResolvedValue(encounter);
    await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when registering a FINAL result for a PENDING order', async () => {
    const orderId = 'orderId';
    const incomingStatus = ResultStatus.FINAL;
    const order = { id: orderId, status: OrderStatus.PENDING, encounterId: 'encounterId' } as Order;
    const encounter = { id: 'encounterId', status: EncounterStatus.ADMITTED };
    orderRepositoryMock.findById.mockResolvedValue(order);
    encounterServiceMock.getEncounterById.mockResolvedValue(encounter);
    await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when registering a CORRECTED result for a PENDING order', async () => {
    const orderId = 'orderId';
    const incomingStatus = ResultStatus.CORRECTED;
    const order = { id: orderId, status: OrderStatus.PENDING, encounterId: 'encounterId' } as Order;
    const encounter = { id: 'encounterId', status: EncounterStatus.ADMITTED };
    orderRepositoryMock.findById.mockResolvedValue(order);
    encounterServiceMock.getEncounterById.mockResolvedValue(encounter);
    await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
  });
});

  describe('cancelOrder', () => {
  it('should throw BadRequestException when order is already cancelled', async () => {
    const id = 'orderId';
    const order = { status: OrderStatus.CANCELLED } as Order;
    orderRepositoryMock.findById.mockResolvedValue(order);
    await expect(service.cancelOrder(id)).rejects.toThrow(BadRequestException);
  });

  it('should cancel order when order is not cancelled', async () => {
    const id = 'orderId';
    const order = { status: OrderStatus.PENDING } as Order;
    orderRepositoryMock.findById.mockResolvedValue(order);
    orderRepositoryMock.save.mockResolvedValue(order);
    const result = await service.cancelOrder(id);
    expect(result.status).toBe(OrderStatus.CANCELLED);
  });

  it('should throw error when order is not found', async () => {
    const id = 'orderId';
    orderRepositoryMock.findById.mockResolvedValue(undefined);
    await expect(service.cancelOrder(id)).rejects.toThrow();
  });
});

  describe('updateOrder', () => {
  it('should throw BadRequestException when order status is CANCELLED', async () => {
    const id = 'id';
    const dto: UpdateOrderDto = { requestedBy: 'requestedBy' };
    orderRepositoryMock.findById.mockResolvedValue({ status: OrderStatus.CANCELLED } as Order);
    await expect(service.updateOrder(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when order status is COMPLETED', async () => {
    const id = 'id';
    const dto: UpdateOrderDto = { requestedBy: 'requestedBy' };
    orderRepositoryMock.findById.mockResolvedValue({ status: OrderStatus.COMPLETED } as Order);
    await expect(service.updateOrder(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when updating requestedBy for an order in progress', async () => {
    const id = 'id';
    const dto: UpdateOrderDto = { requestedBy: 'requestedBy' };
    orderRepositoryMock.findById.mockResolvedValue({ status: OrderStatus.IN_PROGRESS } as Order);
    await expect(service.updateOrder(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should update order successfully when order status is PENDING and requestedBy is updated', async () => {
    const id = 'id';
    const dto: UpdateOrderDto = { requestedBy: 'requestedBy' };
    const order: Order = { id, status: OrderStatus.PENDING } as Order;
    orderRepositoryMock.findById.mockResolvedValue(order);
    orderRepositoryMock.save.mockResolvedValue(order);
    const result = await service.updateOrder(id, dto);
    expect(result).toEqual(order);
  });

  it('should update order successfully when order status is PENDING and notes are updated', async () => {
    const id = 'id';
    const dto: UpdateOrderDto = { notes: 'notes' };
    const order: Order = { id, status: OrderStatus.PENDING } as Order;
    orderRepositoryMock.findById.mockResolvedValue(order);
    orderRepositoryMock.save.mockResolvedValue(order);
    const result = await service.updateOrder(id, dto);
    expect(result).toEqual(order);
  });

  it('should update order successfully when order status is IN_PROGRESS and notes are updated', async () => {
    const id = 'id';
    const dto: UpdateOrderDto = { notes: 'notes' };
    const order: Order = { id, status: OrderStatus.IN_PROGRESS } as Order;
    orderRepositoryMock.findById.mockResolvedValue(order);
    orderRepositoryMock.save.mockResolvedValue(order);
    const result = await service.updateOrder(id, dto);
    expect(result).toEqual(order);
  });
});

  // TESTS_APPEND_HERE
});
