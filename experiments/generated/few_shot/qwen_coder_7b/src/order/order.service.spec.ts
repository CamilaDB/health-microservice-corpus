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

  it('should return the order when it exists', async () => {
    const order = { id: '1', encounterId: '2', examType: ExamType.HEMOGRAM, status: OrderStatus.PENDING, requestedAt: new Date(), requestedBy: 'user1', notes: null, created_at: new Date(), updated_at: new Date(), encounter: null, results: [] };
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
      service.createOrder({
        encounterId: '1',
        examType: ExamType.HEMOGRAM,
        requestedAt: new Date().toISOString(),
        requestedBy: 'user1',
      } as CreateOrderDto),
    ).rejects.toThrow(BadRequestException);

    expect(encounterServiceMock.getEncounterById).toHaveBeenCalledWith('1');
    expect(orderRepositoryMock.existsPendingOrder).not.toHaveBeenCalled();
    expect(orderRepositoryMock.create).not.toHaveBeenCalled();
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when order date is before admission date', async () => {
    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      id: '1',
      status: EncounterStatus.ADMITTED,
      admitDate: new Date().toISOString(),
    });

    await expect(
      service.createOrder({
        encounterId: '1',
        examType: ExamType.HEMOGRAM,
        requestedAt: new Date(new Date().getTime() - 1000).toISOString(),
        requestedBy: 'user1',
      } as CreateOrderDto),
    ).rejects.toThrow(BadRequestException);

    expect(encounterServiceMock.getEncounterById).toHaveBeenCalledWith('1');
    expect(orderRepositoryMock.existsPendingOrder).not.toHaveBeenCalled();
    expect(orderRepositoryMock.create).not.toHaveBeenCalled();
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw ConflictException when pending order already exists', async () => {
    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      id: '1',
      status: EncounterStatus.ADMITTED,
      admitDate: new Date().toISOString(),
    });

    orderRepositoryMock.existsPendingOrder.mockResolvedValueOnce(true);

    await expect(
      service.createOrder({
        encounterId: '1',
        examType: ExamType.HEMOGRAM,
        requestedAt: new Date().toISOString(),
        requestedBy: 'user1',
      } as CreateOrderDto),
    ).rejects.toThrow(ConflictException);

    expect(encounterServiceMock.getEncounterById).toHaveBeenCalledWith('1');
    expect(orderRepositoryMock.existsPendingOrder).toHaveBeenCalledWith('1', ExamType.HEMOGRAM);
    expect(orderRepositoryMock.create).not.toHaveBeenCalled();
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it.skip('should create and save the order when all conditions are met', async () => {
        encounterServiceMock.getEncounterById.mockResolvedValueOnce({
          id: '1',
          status: EncounterStatus.ADMITTED,
          admitDate: new Date().toISOString(),
        });

        orderRepositoryMock.existsPendingOrder.mockResolvedValueOnce(false);

        const createdOrder = {
          id: '2',
          encounterId: '1',
          examType: ExamType.HEMOGRAM,
          status: OrderStatus.PENDING,
          requestedAt: new Date().toISOString(),
          requestedBy: 'user1',
          notes: null,
          created_at: new Date(),
          updated_at: new Date(),
          encounter: { id: '1' },
          results: [],
        };

        orderRepositoryMock.create.mockReturnValueOnce(createdOrder);
        orderRepositoryMock.save.mockResolvedValueOnce(createdOrder);

        const result = await service.createOrder({
          encounterId: '1',
          examType: ExamType.HEMOGRAM,
          requestedAt: new Date().toISOString(),
          requestedBy: 'user1',
        } as CreateOrderDto);

        expect(result).toEqual(createdOrder);
        expect(encounterServiceMock.getEncounterById).toHaveBeenCalledWith('1');
        expect(orderRepositoryMock.existsPendingOrder).toHaveBeenCalledWith('1', ExamType.HEMOGRAM);
        expect(orderRepositoryMock.create).toHaveBeenCalledWith({
          ...createdOrder,
          requestedAt: new Date(createdOrder.requestedAt),
          status: OrderStatus.PENDING,
          notes: null,
        });
        expect(orderRepositoryMock.save).toHaveBeenCalledWith(createdOrder);
      });
});
});

  describe('FN_searchOrders_END', () => {
describe('searchOrders', () => {
  it('should return orders based on search criteria', async () => {
    const searchDto: SearchOrdersDto = {
      status: OrderStatus.COMPLETED,
      dateFrom: '2023-01-01',
      dateTo: '2023-12-31',
      patientId: 'patient123',
      encounterId: 'encounter456',
    };

    const expectedOrders: Order[] = [
      { id: 'order1', encounterId: 'encounter456', status: OrderStatus.COMPLETED, requestedAt: new Date('2023-06-01'), requestedBy: 'user1', notes: null },
      { id: 'order2', encounterId: 'encounter456', status: OrderStatus.COMPLETED, requestedAt: new Date('2023-11-01'), requestedBy: 'user2', notes: null },
    ];

    orderRepositoryMock.search.mockResolvedValueOnce(expectedOrders);

    const result = await service.searchOrders(searchDto);

    expect(result).toBe(expectedOrders);
    expect(orderRepositoryMock.search).toHaveBeenCalledWith(searchDto);
  });
});
});

  describe('FN_searchOrdersAdvanced_END', () => {
describe('searchOrdersAdvanced', () => {
  it('should call orderRepository.searchAdvanced with the provided DTO', async () => {
    const dto: SearchOrdersAdvancedDto = {
      status: OrderStatus.PENDING,
      examType: ExamType.HEMOGRAM,
      dateFrom: '2023-01-01',
      dateTo: '2023-12-31',
      patientId: '123',
      encounterId: '456',
      requestedBy: 'user1',
      sortBy: OrderSortField.REQUESTED_AT,
      sortDirection: SortDirection.ASC,
      page: 1,
      limit: 10,
    };

    await service.searchOrdersAdvanced(dto);

    expect(orderRepositoryMock.searchAdvanced).toHaveBeenCalledWith(dto);
  });
});
});

  describe('FN_validateOrderResult_END', () => {
describe('validateOrderResult', () => {
  it('should throw BadRequestException when order is cancelled', async () => {
    const orderId = '1';
    orderRepositoryMock.findById.mockResolvedValueOnce({
      id: orderId,
      status: OrderStatus.CANCELLED,
    });

    await expect(
      service.validateOrderResult(orderId, ResultStatus.FINAL),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when encounter is discharged', async () => {
    const orderId = '1';
    const encounterId = '2';
    orderRepositoryMock.findById.mockResolvedValueOnce({
      id: orderId,
      encounterId,
      status: OrderStatus.PENDING,
    });
    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      id: encounterId,
      status: EncounterStatus.DISCHARGED,
    });

    await expect(
      service.validateOrderResult(orderId, ResultStatus.FINAL),
    ).rejects.toThrow(BadRequestException);
  });

  it.skip('should throw BadRequestException when incoming status is CORRECTED and order is not completed', async () => {
          const orderId = '1';
          orderRepositoryMock.findById.mockResolvedValueOnce({
            id: orderId,
            status: OrderStatus.PENDING,
            encounterId: 'encounterId',
            encounter: {
              status: EncounterStatus.ADMITTED,
            },
            results: [],
          });

          await expect(
            service.validateOrderResult(orderId, ResultStatus.CORRECTED),
          ).rejects.toThrow(BadRequestException);
        });


  it.skip('should throw BadRequestException when incoming status is CORRECTED and order does not have exactly one final result', async () => {
          const orderId = '1';
          orderRepositoryMock.findById.mockResolvedValueOnce({
            id: orderId,
            status: OrderStatus.COMPLETED,
            results: [
              { status: ResultStatus.FINAL },
              { status: ResultStatus.FINAL },
            ],
          });

          await expect(
            service.validateOrderResult(orderId, ResultStatus.CORRECTED),
          ).rejects.toThrow(BadRequestException);
        });



  it.skip('should throw BadRequestException when order is already completed', async () => {
        const orderId = '1';
        orderRepositoryMock.findById.mockResolvedValueOnce({
          id: orderId,
          status: OrderStatus.COMPLETED,
        });

        await expect(
          service.validateOrderResult(orderId, ResultStatus.FINAL),
        ).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw BadRequestException when order already has a final or corrected result', async () => {
        const orderId = '1';
        orderRepositoryMock.findById.mockResolvedValueOnce({
          id: orderId,
          status: OrderStatus.PENDING,
          results: [{ status: ResultStatus.FINAL }],
        });

        await expect(
          service.validateOrderResult(orderId, ResultStatus.FINAL),
        ).rejects.toThrow(BadRequestException);
      });

  it('should throw BadRequestException when incoming status is FINAL and order is PENDING', async () => {
      const orderId = '1';
      orderRepositoryMock.findById.mockResolvedValueOnce({
        id: orderId,
        status: OrderStatus.PENDING,
        encounterId: 'encounterId',
      });

      encounterServiceMock.getEncounterById.mockResolvedValueOnce({
        id: 'encounterId',
        status: EncounterStatus.DISCHARGED,
      });

      await expect(
        service.validateOrderResult(orderId, ResultStatus.FINAL),
      ).rejects.toThrow(BadRequestException);
    });


  it.skip('should update order status to IN_PROGRESS when incoming status is FINAL and order is PENDING', async () => {
          const orderId = '1';
          orderRepositoryMock.findById.mockResolvedValueOnce({
            id: orderId,
            status: OrderStatus.PENDING,
            encounterId: 'encounterId',
          });
          orderRepositoryMock.save.mockResolvedValueOnce({
            id: orderId,
            status: OrderStatus.IN_PROGRESS,
            encounterId: 'encounterId',
          });

          encounterRepositoryMock.findOne.mockResolvedValueOnce({
            id: 'encounterId',
            status: EncounterStatus.ADMITTED,
          });

          encounterRepositoryMock = {
            findOne: jest.fn().mockResolvedValueOnce({
              id: 'encounterId',
              status: EncounterStatus.ADMITTED,
            }),
          };

          const result = await service.validateOrderResult(orderId, ResultStatus.FINAL);

          expect(result.status).toBe(OrderStatus.IN_PROGRESS);
        });




  it.skip('should update order status to COMPLETED when incoming status is FINAL and order is IN_PROGRESS', async () => {
          const orderId = '1';
          orderRepositoryMock.findById.mockResolvedValueOnce({
            id: orderId,
            status: OrderStatus.IN_PROGRESS,
            encounterId: 'encounterId',
            results: [],
          });
          orderRepositoryMock.save.mockResolvedValueOnce({
            id: orderId,
            status: OrderStatus.COMPLETED,
            encounterId: 'encounterId',
            results: [],
          });

          const result = await service.validateOrderResult(orderId, ResultStatus.FINAL);

          expect(result.status).toBe(OrderStatus.COMPLETED);
        });


  it.skip('should return the order when incoming status is FINAL and order is PENDING', async () => {
          const orderId = '1';
          orderRepositoryMock.findById.mockResolvedValueOnce({
            id: orderId,
            status: OrderStatus.PENDING,
            encounterId: 'encounterId',
            encounter: { status: EncounterStatus.ADMITTED },
            results: [],
          });

          const result = await service.validateOrderResult(orderId, ResultStatus.FINAL);

          expect(result).toBeDefined();
        });

});
});

  describe('FN_updateOrder_END', () => {
describe('updateOrder', () => {
  it('should throw BadRequestException when order status is CANCELLED', async () => {
    const order = { id: '1', status: OrderStatus.CANCELLED } as Order;
    orderRepositoryMock.findById.mockResolvedValueOnce(order);

    await expect(
      service.updateOrder('1', { requestedBy: 'user1' } as UpdateOrderDto),
    ).rejects.toThrow(BadRequestException);

    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when order status is COMPLETED', async () => {
    const order = { id: '1', status: OrderStatus.COMPLETED } as Order;
    orderRepositoryMock.findById.mockResolvedValueOnce(order);

    await expect(
      service.updateOrder('1', { requestedBy: 'user1' } as UpdateOrderDto),
    ).rejects.toThrow(BadRequestException);

    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when order status is IN_PROGRESS and requestedBy is provided', async () => {
    const order = { id: '1', status: OrderStatus.IN_PROGRESS } as Order;
    orderRepositoryMock.findById.mockResolvedValueOnce(order);

    await expect(
      service.updateOrder('1', { requestedBy: 'user1' } as UpdateOrderDto),
    ).rejects.toThrow(BadRequestException);

    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should update notes and return the updated order', async () => {
    const order = { id: '1', status: OrderStatus.PENDING } as Order;
    orderRepositoryMock.findById.mockResolvedValueOnce(order);

    const updatedOrder = { ...order, notes: 'new notes' };
    orderRepositoryMock.save.mockResolvedValueOnce(updatedOrder);

    const result = await service.updateOrder('1', { notes: 'new notes' } as UpdateOrderDto);

    expect(result).toBe(updatedOrder);
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(updatedOrder);
  });

  it('should update requestedBy and return the updated order', async () => {
    const order = { id: '1', status: OrderStatus.PENDING } as Order;
    orderRepositoryMock.findById.mockResolvedValueOnce(order);

    const updatedOrder = { ...order, requestedBy: 'user1' };
    orderRepositoryMock.save.mockResolvedValueOnce(updatedOrder);

    const result = await service.updateOrder('1', { requestedBy: 'user1' } as UpdateOrderDto);

    expect(result).toBe(updatedOrder);
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(updatedOrder);
  });
});
});

  // TESTS_APPEND_HERE
});
