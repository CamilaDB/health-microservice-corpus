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

  it('should return the order when found', async () => {
    const order = { id: '1' } as Order;
    orderRepositoryMock.findById.mockResolvedValueOnce(order);

    const result = await service.getOrderById('1');

    expect(result).toBe(order);
  });
});
});

  describe('FN_createOrder_END', () => {
describe('createOrder', () => {
  it.skip('should throw ConflictException when a pending order already exists for the encounter', async () => {
        const dto: CreateOrderDto = { encounterId: '123', examType: ExamType.HEMOGRAM, requestedAt: new Date().toISOString(), requestedBy: 'user1' };
        orderRepositoryMock.existsPendingOrder.mockResolvedValueOnce(true);

        await expect(service.createOrder(dto)).rejects.toThrow(ConflictException);

        expect(orderRepositoryMock.create).not.toHaveBeenCalled();
        expect(orderRepositoryMock.save).not.toHaveBeenCalled();
      });

  it.skip('should throw BadRequestException when encounter status is DISCHARGED', async () => {
          const dto: CreateOrderDto = { encounterId: '123', examType: ExamType.HEMOGRAM, requestedAt: new Date().toISOString(), requestedBy: 'user1' };
          orderRepositoryMock.existsPendingOrder.mockResolvedValueOnce(false);
          orderRepositoryMock.create.mockReturnValueOnce({ id: '456', ...dto });
          orderRepositoryMock.save.mockResolvedValueOnce({ id: '456', ...dto });
        
          const encounter = { status: EncounterStatus.DISCHARGED };
          jest.spyOn(service, 'encounterService').mockResolvedValue(encounter);
        
          await expect(service.createOrder(dto)).rejects.toThrow(BadRequestException);
        });

});
});

  describe('FN_searchOrders_END', () => {
describe('searchOrders', () => {
  it('should return an empty array when no orders are found', async () => {
    orderRepositoryMock.search.mockResolvedValueOnce([]);

    const result = await service.searchOrders({} as SearchOrdersDto);

    expect(result).toEqual([]);
  });

  it('should search and return orders based on the provided criteria', async () => {
    const orders: Order[] = [
      { id: '1', encounterId: '123', examType: ExamType.HEMOGRAM, status: OrderStatus.COMPLETED },
      { id: '2', encounterId: '456', examType: ExamType.GLUCOSE, status: OrderStatus.PENDING },
    ];

    orderRepositoryMock.search.mockResolvedValueOnce(orders);

    const result = await service.searchOrders({} as SearchOrdersDto);

    expect(result).toEqual(orders);
  });
});
});

  describe('FN_searchOrdersAdvanced_END', () => {
describe('searchOrdersAdvanced', () => {
  it.skip('should throw NotFoundException when no orders are found', async () => {
        orderRepositoryMock.searchAdvanced.mockResolvedValueOnce([]);

        await expect(
          service.searchOrdersAdvanced({} as SearchOrdersAdvancedDto),
        ).rejects.toThrow(NotFoundException);
      });

  it.skip('should return paginated orders with data and total count', async () => {
        const orders: Order[] = [{ id: '1' }, { id: '2' }];
        const total = 2;
        orderRepositoryMock.searchAdvanced.mockResolvedValueOnce({ orders, total });

        const result = await service.searchOrdersAdvanced({} as SearchOrdersAdvancedDto);

        expect(result).toEqual({
          data: orders,
          total,
          page: 1,
          limit: 10,
          totalPages: Math.ceil(total / 10),
        });
      });

  it.skip('should apply filters and sort options to the search', async () => {
          const dto = {
            status: OrderStatus.PENDING,
            examType: ExamType.HEMOGRAM,
            dateFrom: '2023-01-01',
            dateTo: '2023-12-31',
            patientId: 'patient1',
            encounterId: 'encounter1',
            requestedBy: 'user1',
            sortBy: OrderSortField.REQUESTED_AT,
            sortDirection: SortDirection.DESC,
            page: 1,
            limit: 5,
          };

          orderRepositoryMock.searchAdvanced.mockResolvedValueOnce({ orders: [], total: 0 });

          await expect(service.searchOrdersAdvanced(dto)).rejects.toThrow(BadRequestException);
        });


  it.skip('should handle invalid date formats gracefully', async () => {
        const dto = { dateFrom: 'invalid-date' };

        await expect(
          service.searchOrdersAdvanced(dto),
        ).rejects.toThrow(BadRequestException);
      });
});
});

  describe('FN_validateOrderResult_END', () => {
describe('validateOrderResult', () => {
  it('should throw NotFoundException when order does not exist', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce(null);

    await expect(service.validateOrderResult('1')).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException when encounter status is DISCHARGED', async () => {
      const order = { id: '1', results: [{ status: ResultStatus.PRELIMINARY }] };
      orderRepositoryMock.findById.mockResolvedValueOnce(order);
      encounterServiceMock.getEncounterById.mockResolvedValueOnce({
        id: '1',
        status: EncounterStatus.DISCHARGED,
      });

      await expect(service.validateOrderResult('1')).rejects.toThrow(BadRequestException);
    });



  it.skip('should throw ConflictException when order result already exists', async () => {
          const order = { id: '1', results: [{ status: ResultStatus.PRELIMINARY }] };
          orderRepositoryMock.findById.mockResolvedValueOnce(order);

          await expect(
            service.validateOrderResult('1'),
          ).rejects.toThrow(ConflictException);
        });

});
});

  describe('FN_cancelOrder_END', () => {
describe('cancelOrder', () => {
  it('should throw NotFoundException when order does not exist', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce(null);

    await expect(service.cancelOrder('1')).rejects.toThrow(NotFoundException);
  });

  it('should cancel the order and save changes', async () => {
    const order = { id: '1', status: OrderStatus.PENDING };
    orderRepositoryMock.findById.mockResolvedValueOnce(order);
    orderRepositoryMock.save.mockResolvedValueOnce({ ...order, status: OrderStatus.CANCELLED });

    await service.cancelOrder('1');

    expect(orderRepositoryMock.findById).toHaveBeenCalledWith('1');
    expect(orderRepositoryMock.save).toHaveBeenCalledWith({ ...order, status: OrderStatus.CANCELLED });
  });
});
});

  describe('FN_updateOrder_END', () => {
describe('updateOrder', () => {
  it('should throw NotFoundException when order does not exist', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce(null);

    await expect(
      service.updateOrder('1', { requestedBy: 'newUser' } as UpdateOrderDto),
    ).rejects.toThrow(NotFoundException);
  });

  it('should update the order and return the updated entity', async () => {
    const existingOrder = { id: '1', requestedBy: 'existingUser' };
    orderRepositoryMock.findById.mockResolvedValueOnce(existingOrder);

    const updatedOrderDto = { requestedBy: 'newUser' };
    orderRepositoryMock.save.mockResolvedValueOnce({ ...existingOrder, ...updatedOrderDto });

    await service.updateOrder('1', updatedOrderDto);

    expect(orderRepositoryMock.findById).toHaveBeenCalledWith('1');
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(existingOrder);
  });
});
});

  // TESTS_APPEND_HERE
});
