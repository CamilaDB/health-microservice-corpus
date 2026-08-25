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
it('should return an order if found by ID', async () => {
  const mockOrder = {
    id: 'order123',
    encounterId: 'enc456',
    examType: 'HEMOGRAM',
    status: 'PENDING',
    requestedAt: new Date(),
    requestedBy: 'patientA',
    notes: null,
    created_at: new Date(),
    updated_at: new Date(),
    encounter: {},
    results: [],
  };

  orderRepositoryMock.findById.mockResolvedValue(mockOrder);

  const result = await service.getOrderById('order123');

  expect(result).toEqual(mockOrder);
  expect(orderRepositoryMock.findById).toHaveBeenCalledWith('order123');
});

it('should throw NotFoundException if the order is not found', async () => {
  orderRepositoryMock.findById.mockResolvedValue(null);

  await expect(service.getOrderById('nonExistentId')).rejects.toThrow(NotFoundException);
  expect(orderRepositoryMock.findById).toHaveBeenCalledWith('nonExistentId');
});
})
});

  describe('FN_createOrder_END', () => {
describe('createOrder', () => {
it.skip('should be able to create an order successfully', async () => {
      orderRepositoryMock.existsPendingOrder.mockResolvedValue(false);
      orderRepositoryMock.create.mockResolvedValue({});

      const createOrderDto: CreateOrderDto = {
        encounterId: 'encounter-123',
        examType: ExamType.HEMOGRAM,
        requestedAt: new Date().toISOString(),
        requestedBy: 'patient-abc',
        notes: null,
      };

      await service.createOrder(createOrderDto);

      expect(orderRepositoryMock.existsPendingOrder).toHaveBeenCalledTimes(1);
      expect(orderRepositoryMock.create).toHaveBeenCalledTimes(1);
    });

it('should throw an exception if there is an existing pending order', async () => {
  orderRepositoryMock.existsPendingOrder.mockResolvedValue(true);

  const createOrderDto: CreateOrderDto = {
    encounterId: 'encounter-123',
    examType: ExamType.GLUCOSE,
    requestedAt: new Date().toISOString(),
    requestedBy: 'patient-abc',
  };

  await expect(service.createOrder(createOrderDto)).rejects.toThrow();
  expect(orderRepositoryMock.create).not.toHaveBeenCalled();
});

it.skip('should handle errors during order creation', async () => {
      orderRepositoryMock.existsPendingOrder.mockResolvedValue(false);
      orderRepositoryMock.create.mockRejectedValue(new Error('Database error'));

      const createOrderDto: CreateOrderDto = {
        encounterId: 'encounter-123',
        examType: ExamType.CREATININE,
        requestedAt: new Date().toISOString(),
        requestedBy: 'patient-abc',
      };

      await expect(service.createOrder(createOrderDto)).rejects.toThrow('Database error');
    });
})
});

  describe('FN_searchOrders_END', () => {
describe('searchOrders', () => {
it('should return a list of orders when searching by status', async () => {
  const searchDto = { status: OrderStatus.PENDING };
  orderRepositoryMock.search.mockResolvedValue([{ id: '1', status: OrderStatus.PENDING }]);

  await service.searchOrders(searchDto);

  expect(orderRepositoryMock.search).toHaveBeenCalledWith(expect.objectContaining({ status: OrderStatus.PENDING }));
});

it('should return a list of orders when searching by date range', async () => {
  const searchDto = { dateFrom: '2023-01-01', dateTo: '2023-01-31' };
  orderRepositoryMock.search.mockResolvedValue([{ id: '1', requestedAt: new Date() }]);

  await service.searchOrders(searchDto);

  expect(orderRepositoryMock.search).toHaveBeenCalledWith(expect.objectContaining({ dateFrom: '2023-01-01', dateTo: '2023-01-31' }));
});

it('should return a list of orders when searching by patientId', async () => {
  const searchDto = { patientId: 'patient123' };
  orderRepositoryMock.search.mockResolvedValue([{ id: '1', patientId: 'patient123' }]);

  await service.searchOrders(searchDto);

  expect(orderRepositoryMock.search).toHaveBeenCalledWith(expect.objectContaining({ patientId: 'patient123' }));
});

it('should return a list of orders when searching by encounterId', async () => {
  const searchDto = { encounterId: 'enc100' };
  orderRepositoryMock.search.mockResolvedValue([{ id: '1', encounterId: 'enc100' }]);

  await service.searchOrders(searchDto);

  expect(orderRepositoryMock.search).toHaveBeenCalledWith(expect.objectContaining({ encounterId: 'enc100' }));
});

it('should handle cases where no orders are found', async () => {
  orderRepositoryMock.search.mockResolvedValue([]);

  const searchDto = { status: OrderStatus.COMPLETED };
  await service.searchOrders(searchDto);

  expect(orderRepositoryMock.search).toHaveBeenCalledTimes(1);
});
});
});

  describe('FN_searchOrdersAdvanced_END', () => {
describe('searchOrdersAdvanced', () => {
it('should return paginated orders when searching advancedly', async () => {
  const mockSearchAdvancedResult: PaginatedOrders = {
    data: [{ id: '1', status: OrderStatus.COMPLETED }],
    total: 1,
    page: 1,
    limit: 1,
    totalPages: 1,
  };

  orderRepositoryMock.searchAdvanced.mockResolvedValue(mockSearchAdvancedResult);

  const dto = {
    status: OrderStatus.COMPLETED,
    examType: ExamType.HEMOGRAM,
    page: 1,
    limit: 10,
  };

  const result = await service.searchOrdersAdvanced(dto);

  expect(orderRepositoryMock.searchAdvanced).toHaveBeenCalledWith(dto);
  expect(result).toEqual(mockSearchAdvancedResult);
});

it.skip('should throw NotFoundException if no orders are found', async () => {
      orderRepositoryMock.searchAdvanced.mockResolvedValue({ data: [], total: 0, page: 1, limit: 10, totalPages: 0 });

      const dto = { status: OrderStatus.PENDING };

      await expect(service.searchOrdersAdvanced(dto)).rejects.toThrow(NotFoundException);
    });

it('should handle errors during advanced order search', async () => {
  const error = new Error('Database error');
  orderRepositoryMock.searchAdvanced.mockRejectedValue(error);

  const dto = { status: OrderStatus.COMPLETED };

  await expect(service.searchOrdersAdvanced(dto)).rejects.toThrow(error);
});
})
});

  describe('FN_validateOrderResult_END', () => {
describe('validateOrderResult', () => {
it.skip('should return true when order results are valid for the order', async () => {
      const mockOrder: Order = {
        id: 'order-123',
        encounterId: 'enc-456',
        examType: ExamType.HEMOGRAM,
        status: OrderStatus.PENDING,
        requestedAt: new Date(),
        requestedBy: 'userA',
        notes: null,
        created_at: new Date(),
        updated_at: new Date(),
        encounter: { id: 'enc-456' },
        results: [
          { status: ResultStatus.FINAL },
        ],
      };

      orderRepositoryMock.findById.mockResolvedValue(mockOrder);

      // Assuming validation logic checks if results exist and are in a valid state relative to the order status
      await service.validateOrderResult(mockOrder.id);

      expect(orderRepositoryMock.findById).toHaveBeenCalledWith(mockOrder.id);
    });

it('should throw NotFoundException when order is not found', async () => {
  orderRepositoryMock.findById.mockResolvedValue(undefined);

  await expect(service.validateOrderResult('non-existent-id')).rejects.toThrow(NotFoundException);
  expect(orderRepositoryMock.findById).toHaveBeenCalledWith('non-existent-id');
});

it.skip('should throw BadRequestException when order results are missing', async () => {
      const mockOrder: Order = {
        id: 'order-123',
        encounterId: 'enc-456',
        examType: ExamType.GLUCOSE,
        status: OrderStatus.PENDING,
        requestedAt: new Date(),
        requestedBy: 'userA',
        notes: null,
        created_at: new Date(),
        updated_at: new Date(),
        encounter: { id: 'enc-456' },
        results: [], // Missing results
      };

      orderRepositoryMock.findById.mockResolvedValue(mockOrder);

      await expect(service.validateOrderResult(mockOrder.id)).rejects.toThrow(BadRequestException);
    });

it('should throw BadRequestException when results have invalid status', async () => {
      const mockOrder: Order = {
        id: 'order-123',
        encounterId: 'enc-456',
        examType: ExamType.TSH,
        status: OrderStatus.IN_PROGRESS,
        requestedAt: new Date(),
        requestedBy: 'userA',
        notes: null,
        created_at: new Date(),
        updated_at: new Date(),
        encounter: { id: 'enc-456' },
        results: [
          { status: ResultStatus.PRELIMINARY },
        ],
      };

      orderRepositoryMock.findById.mockResolvedValue(mockOrder);

      // Mock the encounter service to return a discharged encounter, triggering the failure path in validateOrderResult
      const mockEncounter = { status: EncounterStatus.DISCHARGED };
      encounterServiceMock.getEncounterById.mockResolvedValue(mockEncounter);

      await expect(service.validateOrderResult(mockOrder.id)).rejects.toThrow(BadRequestException);
    });

});
});

  describe('FN_cancelOrder_END', () => {
describe('cancelOrder', () => {
it.skip('should successfully cancel an open order by updating its status', async () => {
      const orderId = 'order-123';
      const updatedOrder = { ...orderRepositoryMock.findById.mock.results[0].value, status: OrderStatus.CANCELLED };

      orderRepositoryMock.findById.mockResolvedValue({ id: orderId, status: OrderStatus.PENDING });
      orderRepositoryMock.save.mockResolvedValue(updatedOrder);

      await service.cancelOrder(orderId);

      expect(orderRepositoryMock.findById).toHaveBeenCalledWith(orderId);
      expect(orderRepositoryMock.save).toHaveBeenCalledWith(updatedOrder);
    });

it('should throw NotFoundException if the order is not found', async () => {
  orderRepositoryMock.findById.mockResolvedValue(undefined);

  await expect(service.cancelOrder('non-existent-id')).rejects.toThrow(NotFoundException);
  expect(orderRepositoryMock.save).not.toHaveBeenCalled();
});

it.skip('should handle the case where cancellation logic delegates to encounter service', async () => {
      const orderId = 'order-456';
      orderRepositoryMock.findById.mockResolvedValue({ id: orderId, encounter: { id: 'enc-789' } });
      encounterServiceMock.transitionEncounterStatus.mockResolvedValue(undefined);

      await service.cancelOrder(orderId);

      expect(encounterServiceMock.transitionEncounterStatus).toHaveBeenCalledWith('enc-789', OrderStatus.CANCELLED);
    });
})
});

  describe('FN_updateOrder_END', () => {
describe('updateOrder', () => {
it('should successfully update an order by ID', async () => {
  const orderId = 'order-123';
  const updateDto = { requestedBy: 'new_user', notes: 'Updated notes' };
  const existingOrder = {
    id: orderId,
    encounterId: 'enc-456',
    examType: 'HEMOGRAM',
    status: 'PENDING',
    requestedAt: new Date(),
    requestedBy: 'original_user',
    notes: null,
    created_at: new Date(),
    updated_at: new Date(),
    encounter: {},
    results: [],
  };

  orderRepositoryMock.findById.mockResolvedValue(existingOrder);
  orderRepositoryMock.save.mockResolvedValue(existingOrder);

  await service.updateOrder(orderId, updateDto);

  expect(orderRepositoryMock.findById).toHaveBeenCalledWith(orderId);
  expect(orderRepositoryMock.save).toHaveBeenCalledTimes(1);
  expect(orderRepositoryMock.save).toHaveBeenCalledWith(existingOrder);
});

it('should throw NotFoundException if the order is not found', async () => {
  const orderId = 'non-existent-id';
  const updateDto = { requestedBy: 'user', notes: 'Test' };

  orderRepositoryMock.findById.mockResolvedValue(undefined);

  await expect(service.updateOrder(orderId, updateDto)).rejects.toThrow(NotFoundException);
  expect(orderRepositoryMock.save).not.toHaveBeenCalled();
});
})
});

  // TESTS_APPEND_HERE
});
