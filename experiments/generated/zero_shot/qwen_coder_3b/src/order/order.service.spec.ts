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

  describe('FN_searchOrders_END', () => {
describe('searchOrders', () => {
  it('should return an empty array when no orders are found', async () => {
    orderRepositoryMock.search.mockResolvedValue([]);

    const result = await service.searchOrders({});

    expect(result).toEqual([]);
  });

  it('should return orders based on the provided dto', async () => {
    const dto: SearchOrdersDto = {
      status: OrderStatus.COMPLETED,
      dateFrom: '2023-01-01',
      dateTo: '2023-12-31',
      patientId: '123',
      encounterId: '456',
    };

    const orders: Order[] = [
      { id: '1', encounterId: '456', examType: ExamType.HEMOGRAM, status: OrderStatus.COMPLETED, requestedAt: new Date(), requestedBy: 'John Doe', notes: null, created_at: new Date(), updated_at: new Date(), encounter: { id: '456', status: EncounterStatus.ACTIVE }, results: [] },
    ];

    orderRepositoryMock.search.mockResolvedValue(orders);

    const result = await service.searchOrders(dto);

    expect(result).toEqual(orders);
  });

  it.skip('should throw a BadRequestException if the dto is invalid', async () => {
        const dto: SearchOrdersDto = {
          status: 'INVALID_STATUS',
          dateFrom: '2023-01-01',
          dateTo: '2023-12-31',
          patientId: '123',
          encounterId: '456',
        };

        expect(() => service.searchOrders(dto)).toThrow(BadRequestException);
      });

  it.skip('should throw a NotFoundException if no orders are found with the provided dto', async () => {
        orderRepositoryMock.search.mockResolvedValue([]);

        expect(() => service.searchOrders({})).toThrow(NotFoundException);
      });
});
});

  describe('FN_searchOrdersAdvanced_END', () => {
describe('OrderService', () => {
  let service: OrderService;
  let orderRepositoryMock: jest.Mocked<OrderRepository>;

  beforeEach(async () => {
    orderRepositoryMock = {
      searchAdvanced: jest.fn().mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
      }),
    } as unknown as jest.Mocked<OrderRepository>;

    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          OrderService,
          { provide: OrderRepository, useValue: orderRepositoryMock },
        ],
      }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it.skip('should return an empty paginated orders when searchAdvanced is called with no dto', async () => {
        const result = await service.searchOrdersAdvanced({} as SearchOrdersAdvancedDto);
        expect(result).toEqual({
          data: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
        });
      });
});
});

  describe('FN_validateOrderResult_END', () => {
describe('validateOrderResult', () => {
  it('should throw BadRequestException if order is cancelled', async () => {
      const orderId = '123';
      const incomingStatus = ResultStatus.FINAL;
      const order: Order = {
        id: orderId,
        encounterId: '456',
        status: OrderStatus.CANCELLED,
      };

      jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValue(order);

      await expect(() => service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(
        new BadRequestException(`Cannot add result to a cancelled order (id: ${orderId})`),
      );
    });


  it('should throw BadRequestException if encounter is discharged', async () => {
      const orderId = '123';
      const incomingStatus = ResultStatus.FINAL;
      const order: Order = {
        id: orderId,
        encounterId: '456',
        status: OrderStatus.COMPLETED,
        encounter: {
          id: '456',
          status: EncounterStatus.DISCHARGED,
        },
      };

      jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValue(order);
      jest.spyOn(encounterServiceMock, 'getEncounterById').mockResolvedValue(order.encounter);

      await expect(() => service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(
        new BadRequestException(`Cannot add result to an order from a discharged encounter (id: ${order.encounterId})`),
      );
    });


  it.skip('should throw BadRequestException if incoming status is CORRECTED and order is not completed', async () => {
          const orderId = '123';
          const incomingStatus = ResultStatus.CORRECTED;
          const order: Order = {
            id: orderId,
            encounterId: '456',
            status: OrderStatus.PENDING,
          };

          jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValue(order);

          await expect(() => service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(
            new BadRequestException('Cannot register a CORRECTED result until the order is COMPLETED'),
          );
        });


  it.skip('should throw BadRequestException if order already has a final or corrected result', async () => {
            const orderId = '123';
            const incomingStatus = ResultStatus.FINAL;
            const order: Order = {
              id: orderId,
              encounterId: '456',
              status: OrderStatus.COMPLETED,
              results: [
                { status: ResultStatus.FINAL },
                { status: ResultStatus.CORRECTED },
              ],
            };

            jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValue(order);

            await expect(() => service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(
              `Order (id: ${orderId}) must have exactly one final result available for correction`,
            );
          });


  it.skip('should throw BadRequestException if order is already completed', async () => {
            const orderId = '123';
            const incomingStatus = ResultStatus.FINAL;
            const order: Order = {
              id: orderId,
              encounterId: '456',
              status: OrderStatus.COMPLETED,
            };

            jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValue(order);

            await expect(() => service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(
              new BadRequestException(
                `Order already completed (id: ${orderId}). Cannot add another result`,
              ),
            );
          });


  it.skip('should throw BadRequestException if order is PENDING and incoming status is FINAL', async () => {
            const orderId = '123';
            const incomingStatus = ResultStatus.FINAL;
            const order: Order = {
              id: orderId,
              encounterId: '456',
              status: OrderStatus.PENDING,
            };

            jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValue(order);

            await expect(() => service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(
              new BadRequestException(
                'Cannot register a FINAL result for a PENDING order. Order must be IN_PROGRESS first',
              ),
            );
          });


  it.skip('should update order status to IN_PROGRESS and save it', async () => {
        const orderId = '123';
        const incomingStatus = ResultStatus.FINAL;
        const order: Order = {
          id: orderId,
          encounterId: '456',
          status: OrderStatus.PENDING,
        };

        jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValue(order);
        jest.spyOn(orderRepositoryMock, 'save').mockResolvedValue(order);

        const result = await service.validateOrderResult(orderId, incomingStatus);

        expect(result).toEqual(order);
        expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
      });

  it.skip('should update order status to COMPLETED and save it', async () => {
        const orderId = '123';
        const incomingStatus = ResultStatus.FINAL;
        const order: Order = {
          id: orderId,
          encounterId: '456',
          status: OrderStatus.IN_PROGRESS,
          results: [
            { status: ResultStatus.FINAL },
          ],
        };

        jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValue(order);
        jest.spyOn(orderRepositoryMock, 'save').mockResolvedValue(order);

        const result = await service.validateOrderResult(orderId, incomingStatus);

        expect(result).toEqual(order);
        expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
      });
});
});

  describe('FN_cancelOrder_END', () => {
describe('OrderService', () => {
  let service: OrderService;
  let orderRepositoryMock: jest.Mocked<OrderRepository>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    orderRepositoryMock = {
      findById: jest.fn().mockResolvedValue({ id: '1', status: OrderStatus.PENDING }),
      save: jest.fn().mockResolvedValue({ id: '1', status: OrderStatus.CANCELLED }),
    } as unknown as jest.Mocked<OrderRepository>;

    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          OrderService,
          { provide: OrderRepository, useValue: orderRepositoryMock },
        ],
      }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it.skip('should throw BadRequestException if order is already cancelled', async () => {
          const mockOrderRepository = {
            save: jest.fn().mockResolvedValueOnce({ id: '1', status: OrderStatus.CANCELLED }),
          };

          const service = new OrderService(mockOrderRepository);

          await expect(service.cancelOrder('1')).rejects.toThrow(BadRequestException);
        });


  it.skip('should cancel the order and save it', async () => {
        await service.cancelOrder('1');
        expect(orderRepositoryMock.save).toHaveBeenCalledWith({ id: '1', status: OrderStatus.CANCELLED });
      });
});
});

  // TESTS_APPEND_HERE
});
