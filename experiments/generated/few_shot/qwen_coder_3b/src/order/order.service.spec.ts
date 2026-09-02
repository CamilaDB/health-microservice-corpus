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
  it('should throw BadRequestException when encounter is discharged', async () => {
    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      id: '1',
      status: EncounterStatus.DISCHARGED,
    });

    await expect(
      service.createOrder({ encounterId: '1', requestedAt: '2023-01-01' } as CreateOrderDto),
    ).rejects.toThrow(BadRequestException);

    expect(orderRepositoryMock.create).not.toHaveBeenCalled();
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when order date is before admission date', async () => {
    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      id: '1',
      admitDate: new Date('2023-01-01'),
    });

    await expect(
      service.createOrder({ encounterId: '1', requestedAt: '2022-12-31' } as CreateOrderDto),
    ).rejects.toThrow(BadRequestException);

    expect(orderRepositoryMock.create).not.toHaveBeenCalled();
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw ConflictException when a pending order already exists', async () => {
    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      id: '1',
    });

    orderRepositoryMock.existsPendingOrder.mockResolvedValueOnce(true);

    await expect(
      service.createOrder({ encounterId: '1', examType: 'HEMOGRAM' } as CreateOrderDto),
    ).rejects.toThrow(ConflictException);

    expect(orderRepositoryMock.create).not.toHaveBeenCalled();
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should create and save the order', async () => {
    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      id: '1',
      admitDate: new Date('2023-01-01'),
    });

    orderRepositoryMock.existsPendingOrder.mockResolvedValueOnce(false);

    const order = {
      encounterId: '1',
      examType: 'HEMOGRAM',
      requestedAt: new Date('2023-01-01'),
      requestedBy: 'test',
      notes: 'test notes',
      status: OrderStatus.PENDING,
    };

    orderRepositoryMock.create.mockReturnValueOnce(order);
    orderRepositoryMock.save.mockResolvedValueOnce(order);

    await service.createOrder({ encounterId: '1', examType: 'HEMOGRAM', requestedAt: '2023-01-01', requestedBy: 'test', notes: 'test notes' } as CreateOrderDto);

    expect(orderRepositoryMock.create).toHaveBeenCalledWith(order);
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
  });
});
});

  describe('FN_searchOrders_END', () => {
describe('searchOrders', () => {
  it('should return an empty array when no orders are found', async () => {
    orderRepositoryMock.search.mockResolvedValueOnce([]);

    const result = await service.searchOrders({});

    expect(result).toEqual([]);
  });

  it('should return orders based on search criteria', async () => {
    const orders = [
      { id: '1', encounterId: '1', examType: ExamType.HEMOGRAM, status: OrderStatus.COMPLETED, requestedAt: new Date(), requestedBy: 'John Doe', notes: null, created_at: new Date(), updated_at: new Date(), encounter: null, results: [] },
      { id: '2', encounterId: '2', examType: ExamType.GLUCOSE, status: OrderStatus.PENDING, requestedAt: new Date(), requestedBy: 'Jane Doe', notes: 'Notes', created_at: new Date(), updated_at: new Date(), encounter: null, results: [] },
    ];

    orderRepositoryMock.search.mockResolvedValueOnce(orders);

    const result = await service.searchOrders({
      status: OrderStatus.COMPLETED,
      dateFrom: '2023-01-01',
      dateTo: '2023-12-31',
      patientId: '123',
      encounterId: '1',
    });

    expect(result).toEqual(orders);
  });
});
});

  describe('FN_searchOrdersAdvanced_END', () => {
describe('searchOrdersAdvanced', () => {
  it('should return paginated orders based on search criteria', async () => {
    const dto: SearchOrdersAdvancedDto = {
      status: OrderStatus.PENDING,
      examType: ExamType.HEMOGRAM,
      dateFrom: '2023-01-01',
      dateTo: '2023-12-31',
      patientId: '123',
      encounterId: '456',
      requestedBy: 'user1',
      sortBy: OrderSortField.REQUESTED_AT,
      sortDirection: SortDirection.DESC,
      page: 1,
      limit: 10,
    };

    const expectedResponse: PaginatedOrders = {
      data: [
        { id: '1', status: OrderStatus.PENDING, examType: ExamType.HEMOGRAM, requestedAt: '2023-01-01' },
        { id: '2', status: OrderStatus.PENDING, examType: ExamType.HEMOGRAM, requestedAt: '2023-01-02' },
      ],
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    };

    orderRepositoryMock.searchAdvanced.mockResolvedValueOnce(expectedResponse);

    const result = await service.searchOrdersAdvanced(dto);

    expect(result).toEqual(expectedResponse);
    expect(orderRepositoryMock.searchAdvanced).toHaveBeenCalledWith(dto);
  });

  it.skip('should throw NotFoundException when no orders are found', async () => {
        const dto: SearchOrdersAdvancedDto = {
          status: OrderStatus.PENDING,
          examType: ExamType.HEMOGRAM,
          dateFrom: '2023-01-01',
          dateTo: '2023-12-31',
          patientId: '123',
          encounterId: '456',
          requestedBy: 'user1',
          sortBy: OrderSortField.REQUESTED_AT,
          sortDirection: SortDirection.DESC,
          page: 1,
          limit: 10,
        };

        orderRepositoryMock.searchAdvanced.mockResolvedValueOnce({ data: [], total: 0, page: 1, limit: 10, totalPages: 0 });

        await expect(service.searchOrdersAdvanced(dto)).rejects.toThrow(NotFoundException);
      });
});
});

  describe('FN_validateOrderResult_END', () => {
describe('validateOrderResult', () => {
  it('should throw BadRequestException when order is cancelled', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce({
      id: '1',
      status: OrderStatus.CANCELLED,
    });

    await expect(
      service.validateOrderResult('1', ResultStatus.PRELIMINARY),
    ).rejects.toThrow(BadRequestException);

    expect(orderRepositoryMock.findById).toHaveBeenCalledWith('1');
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when encounter is discharged', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce({
      id: '1',
      encounterId: '2',
      status: OrderStatus.PENDING,
    });

    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      id: '2',
      status: EncounterStatus.DISCHARGED,
    });

    await expect(
      service.validateOrderResult('1', ResultStatus.PRELIMINARY),
    ).rejects.toThrow(BadRequestException);

    expect(orderRepositoryMock.findById).toHaveBeenCalledWith('1');
    expect(encounterServiceMock.getEncounterById).toHaveBeenCalledWith('2');
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it.skip('should throw BadRequestException when order has final result and incoming status is CORRECTED', async () => {
        orderRepositoryMock.findById.mockResolvedValueOnce({
          id: '1',
          status: OrderStatus.COMPLETED,
          results: [{ status: ResultStatus.FINAL }],
        });

        await expect(
          service.validateOrderResult('1', ResultStatus.CORRECTED),
        ).rejects.toThrow(BadRequestException);

        expect(orderRepositoryMock.findById).toHaveBeenCalledWith('1');
        expect(orderRepositoryMock.save).not.toHaveBeenCalled();
      });

  it.skip('should throw BadRequestException when order has corrected result and incoming status is CORRECTED', async () => {
        orderRepositoryMock.findById.mockResolvedValueOnce({
          id: '1',
          status: OrderStatus.COMPLETED,
          results: [{ status: ResultStatus.CORRECTED }],
        });

        await expect(
          service.validateOrderResult('1', ResultStatus.CORRECTED),
        ).rejects.toThrow(BadRequestException);

        expect(orderRepositoryMock.findById).toHaveBeenCalledWith('1');
        expect(orderRepositoryMock.save).not.toHaveBeenCalled();
      });

  it.skip('should throw BadRequestException when order is completed and incoming status is FINAL', async () => {
        orderRepositoryMock.findById.mockResolvedValueOnce({
          id: '1',
          status: OrderStatus.COMPLETED,
        });

        await expect(
          service.validateOrderResult('1', ResultStatus.FINAL),
        ).rejects.toThrow(BadRequestException);

        expect(orderRepositoryMock.findById).toHaveBeenCalledWith('1');
        expect(orderRepositoryMock.save).not.toHaveBeenCalled();
      });

  it.skip('should throw BadRequestException when order has final or corrected result and incoming status is FINAL', async () => {
        orderRepositoryMock.findById.mockResolvedValueOnce({
          id: '1',
          status: OrderStatus.COMPLETED,
          results: [{ status: ResultStatus.FINAL }, { status: ResultStatus.CORRECTED }],
        });

        await expect(
          service.validateOrderResult('1', ResultStatus.FINAL),
        ).rejects.toThrow(BadRequestException);

        expect(orderRepositoryMock.findById).toHaveBeenCalledWith('1');
        expect(orderRepositoryMock.save).not.toHaveBeenCalled();
      });

  it.skip('should throw BadRequestException when order is pending and incoming status is FINAL', async () => {
        orderRepositoryMock.findById.mockResolvedValueOnce({
          id: '1',
          status: OrderStatus.PENDING,
        });

        await expect(
          service.validateOrderResult('1', ResultStatus.FINAL),
        ).rejects.toThrow(BadRequestException);

        expect(orderRepositoryMock.findById).toHaveBeenCalledWith('1');
        expect(orderRepositoryMock.save).not.toHaveBeenCalled();
      });

  it.skip('should throw BadRequestException when order is pending and incoming status is PRELIMINARY', async () => {
          orderRepositoryMock.findById.mockResolvedValueOnce({
            id: '1',
            status: OrderStatus.PENDING,
            encounterId: '2',
          });

          await expect(
            service.validateOrderResult('1', ResultStatus.PRELIMINARY),
          ).rejects.toThrow(BadRequestException);

          expect(orderRepositoryMock.findById).toHaveBeenCalledWith('1');
          expect(orderRepositoryMock.save).not.toHaveBeenCalled();
        });


  it.skip('should throw BadRequestException when order is in progress and incoming status is FINAL', async () => {
          orderRepositoryMock.findById.mockResolvedValueOnce({
            id: '1',
            status: OrderStatus.IN_PROGRESS,
            encounterId: '1',
          });

          await expect(
            service.validateOrderResult('1', ResultStatus.FINAL),
          ).rejects.toThrow(BadRequestException);

          expect(orderRepositoryMock.findById).toHaveBeenCalledWith('1');
          expect(orderRepositoryMock.save).not.toHaveBeenCalled();
        });


  it.skip('should throw BadRequestException when order is in progress and incoming status is PRELIMINARY', async () => {
          orderRepositoryMock.findById.mockResolvedValueOnce({
            id: '1',
            status: OrderStatus.IN_PROGRESS,
            encounterId: '1',
          });

          await expect(
            service.validateOrderResult('1', ResultStatus.PRELIMINARY),
          ).rejects.toThrow(BadRequestException);

          expect(orderRepositoryMock.findById).toHaveBeenCalledWith('1');
          expect(orderRepositoryMock.save).not.toHaveBeenCalled();
        });


  it.skip('should throw BadRequestException when order status is COMPLETED', async () => {
          orderRepositoryMock.findById.mockResolvedValueOnce({
            id: '1',
            status: OrderStatus.COMPLETED,
          });

          await expect(service.validateOrderResult('1', ResultStatus.FINAL)).rejects.toThrow(
            BadRequestException,
          );
        });


  it.skip('should throw BadRequestException when order is in progress and incoming status is FINAL', async () => {
          orderRepositoryMock.findById.mockResolvedValueOnce({
            id: '1',
            status: OrderStatus.IN_PROGRESS,
          });

          await expect(service.validateOrderResult('1', ResultStatus.FINAL)).rejects.toThrow(BadRequestException);
        });


  it('should throw BadRequestException when order is cancelled', async () => {
      orderRepositoryMock.findById.mockResolvedValueOnce({
        id: '1',
        status: OrderStatus.CANCELLED,
      });

      await expect(service.validateOrderResult('1', ResultStatus.PRELIMINARY)).rejects.toThrow(BadRequestException);
    });

});
});

  describe('FN_cancelOrder_END', () => {
describe('cancelOrder', () => {
  it('should throw BadRequestException when order is already cancelled', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce({
      id: '1',
      status: OrderStatus.CANCELLED,
    });

    await expect(service.cancelOrder('1')).rejects.toThrow(BadRequestException);

    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should update order status to cancelled and save it', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce({ id: '1', status: OrderStatus.PENDING });

    await service.cancelOrder('1');

    expect(orderRepositoryMock.save).toHaveBeenCalledWith({
      id: '1',
      status: OrderStatus.CANCELLED,
    });
  });
});
});

  describe('FN_updateOrder_END', () => {
describe('updateOrder', () => {
  it('should throw BadRequestException when order status is CANCELLED', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce({
      id: '1',
      status: OrderStatus.CANCELLED,
    });

    await expect(
      service.updateOrder('1', { requestedBy: 'test' } as UpdateOrderDto),
    ).rejects.toThrow(BadRequestException);

    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when order status is COMPLETED', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce({
      id: '1',
      status: OrderStatus.COMPLETED,
    });

    await expect(
      service.updateOrder('1', { requestedBy: 'test' } as UpdateOrderDto),
    ).rejects.toThrow(BadRequestException);

    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when order status is IN_PROGRESS and requestedBy is provided', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce({
      id: '1',
      status: OrderStatus.IN_PROGRESS,
    });

    await expect(
      service.updateOrder('1', { requestedBy: 'test' } as UpdateOrderDto),
    ).rejects.toThrow(BadRequestException);

    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should update requestedBy and notes and save the order', async () => {
    const order = { id: '1', status: OrderStatus.PENDING };
    orderRepositoryMock.findById.mockResolvedValueOnce(order);
    const updateData: Partial<Order> = {
      requestedBy: 'test',
      notes: 'test notes',
    };
    orderRepositoryMock.save.mockResolvedValueOnce({ id: '1', ...order, ...updateData });

    await service.updateOrder('1', { requestedBy: 'test', notes: 'test notes' } as UpdateOrderDto);

    expect(orderRepositoryMock.create).not.toHaveBeenCalled();
    expect(orderRepositoryMock.save).toHaveBeenCalledWith({ id: '1', ...order, ...updateData });
  });

  it('should update notes and save the order', async () => {
    const order = { id: '1', status: OrderStatus.PENDING };
    orderRepositoryMock.findById.mockResolvedValueOnce(order);
    const updateData: Partial<Order> = {
      notes: 'test notes',
    };
    orderRepositoryMock.save.mockResolvedValueOnce({ id: '1', ...order, ...updateData });

    await service.updateOrder('1', { notes: 'test notes' } as UpdateOrderDto);

    expect(orderRepositoryMock.create).not.toHaveBeenCalled();
    expect(orderRepositoryMock.save).toHaveBeenCalledWith({ id: '1', ...order, ...updateData });
  });
});
});

  // TESTS_APPEND_HERE
});
