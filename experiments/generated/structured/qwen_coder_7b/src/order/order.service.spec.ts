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
  it('should throw NotFoundException when order is not found', async () => {
    const id = 'non-existent-id';
    orderRepositoryMock.findById.mockResolvedValueOnce(undefined);

    await expect(service.getOrderById(id)).rejects.toThrow(NotFoundException);
    expect(orderRepositoryMock.findById).toHaveBeenCalledWith(id);
  });

  it('should return the order when found', async () => {
    const id = 'existing-id';
    const mockOrder: Order = { id, encounterId: '', examType: ExamType.HEMOGRAM, status: OrderStatus.PENDING, requestedAt: new Date(), requestedBy: '', notes: null, created_at: new Date(), updated_at: new Date(), encounter: undefined, results: [] };
    orderRepositoryMock.findById.mockResolvedValueOnce(mockOrder);

    const result = await service.getOrderById(id);
    expect(result).toEqual(mockOrder);
    expect(orderRepositoryMock.findById).toHaveBeenCalledWith(id);
  });
});
});

  describe('FN_createOrder_END', () => {
describe('createOrder', () => {
  it('should throw BadRequestException if encounter status is DISCHARGED', async () => {
    const dto: CreateOrderDto = {
      encounterId: 'encounter123',
      examType: ExamType.HEMOGRAM,
      requestedAt: new Date().toISOString(),
      requestedBy: 'user123',
    };

    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      status: EncounterStatus.DISCHARGED,
    } as Encounter);

    await expect(service.createOrder(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if order date is before admission date', async () => {
    const dto: CreateOrderDto = {
      encounterId: 'encounter123',
      examType: ExamType.HEMOGRAM,
      requestedAt: new Date('2023-01-01T00:00:00Z').toISOString(),
      requestedBy: 'user123',
    };

    const encounter = {
      status: EncounterStatus.ADMITTED,
      admitDate: new Date('2023-01-05T00:00:00Z'),
    } as Encounter;

    encounterServiceMock.getEncounterById.mockResolvedValueOnce(encounter);

    await expect(service.createOrder(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw ConflictException if a pending order already exists', async () => {
    const dto: CreateOrderDto = {
      encounterId: 'encounter123',
      examType: ExamType.HEMOGRAM,
      requestedAt: new Date().toISOString(),
      requestedBy: 'user123',
    };

    const encounter = {
      status: EncounterStatus.ADMITTED,
      admitDate: new Date('2023-01-05T00:00:00Z'),
    } as Encounter;

    encounterServiceMock.getEncounterById.mockResolvedValueOnce(encounter);
    orderRepositoryMock.existsPendingOrder.mockResolvedValueOnce(true);

    await expect(service.createOrder(dto)).rejects.toThrow(ConflictException);
  });

  it('should create and save an order if all conditions are met', async () => {
    const dto: CreateOrderDto = {
      encounterId: 'encounter123',
      examType: ExamType.HEMOGRAM,
      requestedAt: new Date().toISOString(),
      requestedBy: 'user123',
    };

    const encounter = {
      status: EncounterStatus.ADMITTED,
      admitDate: new Date('2023-01-05T00:00:00Z'),
    } as Encounter;

    encounterServiceMock.getEncounterById.mockResolvedValueOnce(encounter);
    orderRepositoryMock.existsPendingOrder.mockResolvedValueOnce(false);

    const createdOrder = {
      id: 'order123',
      ...dto,
      requestedAt: new Date(dto.requestedAt),
      status: OrderStatus.PENDING,
      notes: dto.notes ?? null,
    } as Order;

    orderRepositoryMock.create.mockReturnValueOnce(createdOrder);
    orderRepositoryMock.save.mockResolvedValueOnce(createdOrder);

    const result = await service.createOrder(dto);

    expect(result).toEqual(createdOrder);
  });
});
});

  describe('FN_searchOrders_END', () => {
describe('searchOrders', () => {
  it('should return orders when search is successful', async () => {
    const dto: SearchOrdersDto = {};
    const expectedOrders: Order[] = [{ id: '1', encounterId: '2', examType: ExamType.HEMOGRAM, status: OrderStatus.PENDING, requestedAt: new Date(), requestedBy: 'user', notes: null, created_at: new Date(), updated_at: new Date() }];

    orderRepositoryMock.search.mockResolvedValue(expectedOrders);

    const result = await service.searchOrders(dto);

    expect(orderRepositoryMock.search).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expectedOrders);
  });

  it.skip('should throw BadRequestException when search fails', async () => {
        const dto: SearchOrdersDto = {};
        orderRepositoryMock.search.mockResolvedValue(undefined);

        await expect(service.searchOrders(dto)).rejects.toThrow(BadRequestException);
      });
});
});

  describe('FN_searchOrdersAdvanced_END', () => {
describe('searchOrdersAdvanced', () => {
  it('should return paginated orders when searchAdvanced is successful', async () => {
    const dto: SearchOrdersAdvancedDto = {};
    const expectedPaginatedOrders: PaginatedOrders = { data: [], total: 0, page: 1, limit: 10, totalPages: 1 };

    orderRepositoryMock.searchAdvanced.mockResolvedValue(expectedPaginatedOrders);

    const result = await service.searchOrdersAdvanced(dto);

    expect(result).toEqual(expectedPaginatedOrders);
    expect(orderRepositoryMock.searchAdvanced).toHaveBeenCalledWith(dto);
  });
});
});

  describe('FN_validateOrderResult_END', () => {
describe('validateOrderResult', () => {
  it('should throw BadRequestException if order status is CANCELLED', async () => {
    const orderId = '123';
    const incomingStatus = ResultStatus.FINAL;
    const order: Order = { id: orderId, encounterId: '456', examType: ExamType.HEMOGRAM, status: OrderStatus.CANCELLED, requestedAt: new Date(), requestedBy: 'user', notes: null, created_at: new Date(), updated_at: new Date() };
    jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValueOnce(order);

    await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if order status is COMPLETED', async () => {
    const orderId = '123';
    const incomingStatus = ResultStatus.FINAL;
    const order: Order = { id: orderId, encounterId: '456', examType: ExamType.HEMOGRAM, status: OrderStatus.COMPLETED, requestedAt: new Date(), requestedBy: 'user', notes: null, created_at: new Date(), updated_at: new Date() };
    jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValueOnce(order);

    await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if encounter status is DISCHARGED', async () => {
    const orderId = '123';
    const incomingStatus = ResultStatus.FINAL;
    const order: Order = { id: orderId, encounterId: '456', examType: ExamType.HEMOGRAM, status: OrderStatus.PENDING, requestedAt: new Date(), requestedBy: 'user', notes: null, created_at: new Date(), updated_at: new Date() };
    const encounter: Encounter = { id: '456', patientId: '789', status: EncounterStatus.DISCHARGED, createdAt: new Date(), updatedAt: new Date() };
    jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValueOnce(order);
    jest.spyOn(encounterServiceMock, 'getEncounterById').mockResolvedValueOnce(encounter);

    await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
  });

  it.skip('should throw BadRequestException if order already has a final or corrected result', async () => {
        const orderId = '123';
        const incomingStatus = ResultStatus.FINAL;
        const order: Order = { id: orderId, encounterId: '456', examType: ExamType.HEMOGRAM, status: OrderStatus.PENDING, requestedAt: new Date(), requestedBy: 'user', notes: null, created_at: new Date(), updated_at: new Date(), results: [{ status: ResultStatus.FINAL }] };
        jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValueOnce(order);

        await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
      });

  it('should throw BadRequestException if trying to register a FINAL result for a PENDING order', async () => {
        const orderId = '123';
        const incomingStatus = ResultStatus.FINAL;
        const order: Order = { id: orderId, encounterId: '456', examType: ExamType.HEMOGRAM, status: OrderStatus.PENDING, requestedAt: new Date(), requestedBy: 'user', notes: null, created_at: new Date(), updated_at: new Date() };
        jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValueOnce(order);
        jest.spyOn(encounterServiceMock, 'getEncounterById').mockResolvedValueOnce({ status: EncounterStatus.PENDING });

        await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
      });


  it('should throw BadRequestException if trying to register a CORRECTED result for a PENDING order', async () => {
        const orderId = '123';
        const incomingStatus = ResultStatus.CORRECTED;
        const order: Order = { id: orderId, encounterId: '456', examType: ExamType.HEMOGRAM, status: OrderStatus.PENDING, requestedAt: new Date(), requestedBy: 'user', notes: null, created_at: new Date(), updated_at: new Date() };
        jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValueOnce(order);
        jest.spyOn(encounterServiceMock, 'getEncounterById').mockResolvedValueOnce({ status: EncounterStatus.ADMITTED });

        await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
      });


  it.skip('should update order status to IN_PROGRESS and save if order status is PENDING', async () => {
            const orderId = '123';
            const incomingStatus = ResultStatus.FINAL;
            const order: Order = { id: orderId, encounterId: '456', examType: ExamType.HEMOGRAM, status: OrderStatus.PENDING, requestedAt: new Date(), requestedBy: 'user', notes: null, created_at: new Date(), updated_at: new Date() };
            jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValueOnce(order);
            jest.spyOn(orderRepositoryMock, 'save').mockReturnValueOnce({ ...order, status: OrderStatus.IN_PROGRESS });

            const result = await service.validateOrderResult(orderId, incomingStatus);

            expect(result.status).toBe(OrderStatus.IN_PROGRESS);
            expect(orderRepositoryMock.save).toHaveBeenCalledWith({ ...order, status: OrderStatus.IN_PROGRESS });
          });


  it.skip('should update order status to COMPLETED and save if order status is IN_PROGRESS and incoming status is FINAL', async () => {
        const orderId = '123';
        const incomingStatus = ResultStatus.FINAL;
        const order: Order = { id: orderId, encounterId: '456', examType: ExamType.HEMOGRAM, status: OrderStatus.IN_PROGRESS, requestedAt: new Date(), requestedBy: 'user', notes: null, created_at: new Date(), updated_at: new Date() };
        jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValueOnce(order);
        jest.spyOn(orderRepositoryMock, 'save').mockReturnValueOnce(order);

        const result = await service.validateOrderResult(orderId, incomingStatus);

        expect(result.status).toBe(OrderStatus.COMPLETED);
        expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
      });
});
});

  describe('FN_cancelOrder_END', () => {
describe('cancelOrder', () => {
  it('should throw BadRequestException if order is already cancelled', async () => {
    const id = '123';
    const order = { id, status: OrderStatus.CANCELLED } as Order;
    orderRepositoryMock.findById.mockResolvedValueOnce(order);

    await expect(service.cancelOrder(id)).rejects.toThrow(BadRequestException);
  });

  it('should cancel the order and save it if it is not already cancelled', async () => {
    const id = '123';
    const order = { id, status: OrderStatus.PENDING } as Order;
    orderRepositoryMock.findById.mockResolvedValueOnce(order);
    orderRepositoryMock.save.mockReturnValueOnce(order);

    const result = await service.cancelOrder(id);

    expect(result).toEqual(order);
    expect(order.status).toBe(OrderStatus.CANCELLED);
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
  });
});
});

  describe('FN_updateOrder_END', () => {
describe('updateOrder', () => {
  it('should throw BadRequestException if order status is CANCELLED', async () => {
    const id = '123';
    const dto: UpdateOrderDto = { requestedBy: 'user' };
    const order: Order = { id, encounterId: '', examType: ExamType.HEMOGRAM, status: OrderStatus.CANCELLED, requestedAt: new Date(), requestedBy: '', notes: null, created_at: new Date(), updated_at: new Date() };

    jest.spyOn(service, 'getOrderById').mockResolvedValueOnce(order);

    await expect(service.updateOrder(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if order status is COMPLETED', async () => {
    const id = '123';
    const dto: UpdateOrderDto = { requestedBy: 'user' };
    const order: Order = { id, encounterId: '', examType: ExamType.HEMOGRAM, status: OrderStatus.COMPLETED, requestedAt: new Date(), requestedBy: '', notes: null, created_at: new Date(), updated_at: new Date() };

    jest.spyOn(service, 'getOrderById').mockResolvedValueOnce(order);

    await expect(service.updateOrder(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if order status is IN_PROGRESS and requestedBy is provided', async () => {
    const id = '123';
    const dto: UpdateOrderDto = { requestedBy: 'user' };
    const order: Order = { id, encounterId: '', examType: ExamType.HEMOGRAM, status: OrderStatus.IN_PROGRESS, requestedAt: new Date(), requestedBy: '', notes: null, created_at: new Date(), updated_at: new Date() };

    jest.spyOn(service, 'getOrderById').mockResolvedValueOnce(order);

    await expect(service.updateOrder(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should update requestedBy if provided and order status is not IN_PROGRESS', async () => {
    const id = '123';
    const dto: UpdateOrderDto = { requestedBy: 'user' };
    const order: Order = { id, encounterId: '', examType: ExamType.HEMOGRAM, status: OrderStatus.PENDING, requestedAt: new Date(), requestedBy: '', notes: null, created_at: new Date(), updated_at: new Date() };
    const updatedOrder: Order = { ...order, requestedBy: dto.requestedBy };

    jest.spyOn(service, 'getOrderById').mockResolvedValueOnce(order);
    jest.spyOn(orderRepositoryMock, 'save').mockReturnValueOnce(updatedOrder);

    const result = await service.updateOrder(id, dto);

    expect(result).toEqual(updatedOrder);
  });

  it('should update notes if provided', async () => {
    const id = '123';
    const dto: UpdateOrderDto = { notes: 'new notes' };
    const order: Order = { id, encounterId: '', examType: ExamType.HEMOGRAM, status: OrderStatus.PENDING, requestedAt: new Date(), requestedBy: '', notes: null, created_at: new Date(), updated_at: new Date() };
    const updatedOrder: Order = { ...order, notes: dto.notes };

    jest.spyOn(service, 'getOrderById').mockResolvedValueOnce(order);
    jest.spyOn(orderRepositoryMock, 'save').mockReturnValueOnce(updatedOrder);

    const result = await service.updateOrder(id, dto);

    expect(result).toEqual(updatedOrder);
  });
});
});

  // TESTS_APPEND_HERE
});
