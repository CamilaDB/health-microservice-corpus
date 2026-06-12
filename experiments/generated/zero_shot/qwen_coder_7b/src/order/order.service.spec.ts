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
    const id = 'non-existent-id';
    orderRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(service.getOrderById(id)).rejects.toThrow(NotFoundException);
  });

  it('should return the order when found', async () => {
    const id = 'existing-id';
    const mockOrder: Order = { id, encounterId: '', examType: ExamType.HEMOGRAM, status: OrderStatus.PENDING, requestedAt: new Date(), requestedBy: '', notes: null, created_at: new Date(), updated_at: new Date(), encounter: undefined, results: [] };
    orderRepositoryMock.findById.mockResolvedValue(mockOrder);

    const result = await service.getOrderById(id);
    expect(result).toEqual(mockOrder);
  });
});

  describe('createOrder', () => {
  it('should throw BadRequestException if encounter is discharged', async () => {
    const dto: CreateOrderDto = {
      encounterId: 'encounter123',
      examType: ExamType.HEMOGRAM,
      requestedAt: new Date().toISOString(),
      requestedBy: 'user123',
    };

    encounterServiceMock.getEncounterById.mockResolvedValue({
      status: EncounterStatus.DISCHARGED,
    });

    await expect(service.createOrder(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if order date is before admission date', async () => {
    const dto: CreateOrderDto = {
      encounterId: 'encounter123',
      examType: ExamType.HEMOGRAM,
      requestedAt: new Date(new Date().getTime() - 86400000).toISOString(), // yesterday
      requestedBy: 'user123',
    };

    const encounter = {
      status: EncounterStatus.ADMITTED,
      admitDate: new Date(),
    };

    encounterServiceMock.getEncounterById.mockResolvedValue(encounter);

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
      admitDate: new Date(),
    };

    encounterServiceMock.getEncounterById.mockResolvedValue(encounter);
    orderRepositoryMock.existsPendingOrder.mockResolvedValue(true);

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
      admitDate: new Date(),
    };

    encounterServiceMock.getEncounterById.mockResolvedValue(encounter);
    orderRepositoryMock.existsPendingOrder.mockResolvedValue(false);

    orderRepositoryMock.create.mockReturnValue({
      ...dto,
      requestedAt: new Date(dto.requestedAt),
      status: OrderStatus.PENDING,
      notes: dto.notes ?? null,
    });

    orderRepositoryMock.save.mockResolvedValue({
      id: 'order123',
      ...dto,
      requestedAt: new Date(dto.requestedAt),
      status: OrderStatus.PENDING,
      notes: dto.notes ?? null,
    });

    const result = await service.createOrder(dto);

    expect(result).toEqual({
      id: 'order123',
      ...dto,
      requestedAt: new Date(dto.requestedAt),
      status: OrderStatus.PENDING,
      notes: dto.notes ?? null,
    });
  });
});

  describe('searchOrders', () => {
  it.skip('should throw BadRequestException when dto is undefined', async () => {
              const mockRepository = {
                search: jest.fn().mockRejectedValue(new BadRequestException())
              };

              const service = new OrderService(mockRepository);

              await expect(service.searchOrders(undefined)).rejects.toThrow(BadRequestException);
            });



  it('should call orderRepository.search with the provided dto', async () => {
    const dto: SearchOrdersDto = { status: OrderStatus.PENDING };
    await service.searchOrders(dto);
    expect(orderRepositoryMock.search).toHaveBeenCalledWith(dto);
  });
});

  describe('searchOrdersAdvanced', () => {
  it.skip('should throw BadRequestException when dto is undefined', async () => {
          await expect(() => service.searchOrdersAdvanced(undefined)).rejects.toThrow(BadRequestException);
        });

  it.skip('should call orderRepository.searchAdvanced with the provided DTO', async () => {
          const dto: SearchOrdersAdvancedDto = {
            status: OrderStatus.PENDING,
            examType: ExamType.HEMOGRAM,
            dateFrom: '2023-01-01',
            dateTo: '2023-12-31',
            patientId: 'patient123',
            encounterId: 'encounter456',
            requestedBy: 'user789',
            sortBy: OrderSortField.REQUESTED_AT,
            sortDirection: SortDirection.ASC,
            page: 1,
            limit: 10
          };

          await service.searchOrdersAdvanced(dto);

          expect(orderRepositoryMock.searchAdvanced).toHaveBeenCalledWith(dto);
        });

  it.skip('should return PaginatedOrders when orderRepository.searchAdvanced resolves', async () => {
          const dto: SearchOrdersAdvancedDto = {
            status: OrderStatus.PENDING,
            examType: ExamType.HEMOGRAM,
            dateFrom: '2023-01-01',
            dateTo: '2023-12-31',
            patientId: 'patient123',
            encounterId: 'encounter456',
            requestedBy: 'user789',
            sortBy: OrderSortField.REQUESTED_AT,
            sortDirection: SortDirection.ASC,
            page: 1,
            limit: 10
          };

          const paginatedOrders: PaginatedOrders = {
            data: [],
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0
          };

          orderRepositoryMock.searchAdvanced.mockResolvedValue(paginatedOrders);

          const result = await service.searchOrdersAdvanced(dto);

          expect(result).toEqual(paginatedOrders);
        });
});

  describe('validateOrderResult', () => {
  it('should throw BadRequestException if order is cancelled', async () => {
    const orderId = '123';
    const incomingStatus = ResultStatus.FINAL;
    const order: Order = {
      id: orderId,
      encounterId: '456',
      examType: ExamType.HEMOGRAM,
      status: OrderStatus.CANCELLED,
      requestedAt: new Date(),
      requestedBy: 'user123',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    orderRepositoryMock.findById.mockResolvedValue(order);

    await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if order is completed', async () => {
    const orderId = '123';
    const incomingStatus = ResultStatus.FINAL;
    const order: Order = {
      id: orderId,
      encounterId: '456',
      examType: ExamType.HEMOGRAM,
      status: OrderStatus.COMPLETED,
      requestedAt: new Date(),
      requestedBy: 'user123',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    orderRepositoryMock.findById.mockResolvedValue(order);

    await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if encounter is discharged', async () => {
    const orderId = '123';
    const incomingStatus = ResultStatus.FINAL;
    const order: Order = {
      id: orderId,
      encounterId: '456',
      examType: ExamType.HEMOGRAM,
      status: OrderStatus.PENDING,
      requestedAt: new Date(),
      requestedBy: 'user123',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const encounter = {
      id: '456',
      status: EncounterStatus.DISCHARGED,
    };

    orderRepositoryMock.findById.mockResolvedValue(order);
    encounterServiceMock.getEncounterById.mockResolvedValue(encounter);

    await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
  });

  it.skip('should throw BadRequestException if order already has a final or corrected result', async () => {
          const orderId = '123';
          const incomingStatus = ResultStatus.FINAL;
          const order: Order = {
            id: orderId,
            encounterId: '456',
            examType: ExamType.HEMOGRAM,
            status: OrderStatus.PENDING,
            requestedAt: new Date(),
            requestedBy: 'user123',
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
            results: [
              {
                id: '789',
                order: order,
                status: ResultStatus.FINAL,
                value: '10.5',
                unit: 'g/dL',
                requestedAt: new Date(),
                requestedBy: 'user123',
                notes: null,
                created_at: new Date(),
                updated_at: new Date(),
              },
            ],
          };

          orderRepositoryMock.findById.mockResolvedValue(order);

          await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
        });

  it.skip('should throw BadRequestException if trying to register a final result for a pending order', async () => {
          const orderId = '123';
          const incomingStatus = ResultStatus.FINAL;
          const order: Order = {
            id: orderId,
            encounterId: '456',
            examType: ExamType.HEMOGRAM,
            status: OrderStatus.PENDING,
            requestedAt: new Date(),
            requestedBy: 'user123',
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
          };

          orderRepositoryMock.findById.mockResolvedValue(order);

          await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
        });

  it.skip('should throw BadRequestException if trying to register a corrected result for a pending order', async () => {
          const orderId = '123';
          const incomingStatus = ResultStatus.CORRECTED;
          const order: Order = {
            id: orderId,
            encounterId: '456',
            examType: ExamType.HEMOGRAM,
            status: OrderStatus.PENDING,
            requestedAt: new Date(),
            requestedBy: 'user123',
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
          };

          orderRepositoryMock.findById.mockResolvedValue(order);

          await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
        });

  it.skip('should update order status to IN_PROGRESS and save if order is pending', async () => {
          const orderId = '123';
          const incomingStatus = ResultStatus.FINAL;
          const order: Order = {
            id: orderId,
            encounterId: '456',
            examType: ExamType.HEMOGRAM,
            status: OrderStatus.PENDING,
            requestedAt: new Date(),
            requestedBy: 'user123',
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
          };

          orderRepositoryMock.findById.mockResolvedValue(order);
          orderRepositoryMock.save.mockResolvedValue(order);

          const result = await service.validateOrderResult(orderId, incomingStatus);

          expect(result.status).toBe(OrderStatus.IN_PROGRESS);
          expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
        });

  it('should update order status to COMPLETED and save if order is in progress', async () => {
        const orderId = '123';
        const incomingStatus = ResultStatus.FINAL;
        const order: Order = {
          id: orderId,
          encounterId: '456',
          examType: ExamType.HEMOGRAM,
          status: OrderStatus.IN_PROGRESS,
          requestedAt: new Date(),
          requestedBy: 'user123',
          notes: null,
          created_at: new Date(),
          updated_at: new Date(),
        };

        orderRepositoryMock.findById.mockResolvedValue(order);
        encounterServiceMock.getEncounterById.mockResolvedValue({
          id: '456',
          status: EncounterStatus.ADMITTED,
        });
        orderRepositoryMock.save.mockResolvedValue(order);

        const result = await service.validateOrderResult(orderId, incomingStatus);

        expect(result.status).toBe(OrderStatus.COMPLETED);
        expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
      });


  it.skip('should return the order if no changes are needed', async () => {
          const orderId = '123';
          const incomingStatus = ResultStatus.FINAL;
          const order: Order = {
            id: orderId,
            encounterId: '456',
            examType: ExamType.HEMOGRAM,
            status: OrderStatus.COMPLETED,
            requestedAt: new Date(),
            requestedBy: 'user123',
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
          };

          orderRepositoryMock.findById.mockResolvedValue(order);

          const result = await service.validateOrderResult(orderId, incomingStatus);

          expect(result).toBe(order);
        });
});

  describe('cancelOrder', () => {
  it('should throw BadRequestException if order is already cancelled', async () => {
    const id = '123';
    const order = { id, encounterId: '456', examType: ExamType.HEMOGRAM, status: OrderStatus.CANCELLED, requestedAt: new Date(), requestedBy: 'user', notes: null, created_at: new Date(), updated_at: new Date() };
    orderRepositoryMock.findById.mockResolvedValue(order);

    await expect(service.cancelOrder(id)).rejects.toThrow(BadRequestException);
  });

  it('should cancel the order if it is not already cancelled', async () => {
    const id = '123';
    const order = { id, encounterId: '456', examType: ExamType.HEMOGRAM, status: OrderStatus.PENDING, requestedAt: new Date(), requestedBy: 'user', notes: null, created_at: new Date(), updated_at: new Date() };
    orderRepositoryMock.findById.mockResolvedValue(order);
    orderRepositoryMock.save.mockResolvedValue(order);

    const result = await service.cancelOrder(id);
    expect(result.status).toBe(OrderStatus.CANCELLED);
  });
});

  describe('updateOrder', () => {
  it('should throw BadRequestException if order status is CANCELLED', async () => {
    const id = '123';
    const dto: UpdateOrderDto = { requestedBy: 'user' };
    orderRepositoryMock.findById.mockResolvedValue({ id, status: OrderStatus.CANCELLED } as Order);

    await expect(service.updateOrder(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if order status is COMPLETED', async () => {
    const id = '123';
    const dto: UpdateOrderDto = { requestedBy: 'user' };
    orderRepositoryMock.findById.mockResolvedValue({ id, status: OrderStatus.COMPLETED } as Order);

    await expect(service.updateOrder(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if order status is IN_PROGRESS and requestedBy is provided', async () => {
    const id = '123';
    const dto: UpdateOrderDto = { requestedBy: 'user' };
    orderRepositoryMock.findById.mockResolvedValue({ id, status: OrderStatus.IN_PROGRESS } as Order);

    await expect(service.updateOrder(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should update the order with provided notes and return updated order', async () => {
    const id = '123';
    const dto: UpdateOrderDto = { notes: 'new notes' };
    const order = { id, status: OrderStatus.PENDING } as Order;
    orderRepositoryMock.findById.mockResolvedValue(order);
    orderRepositoryMock.save.mockResolvedValue({ ...order, notes: dto.notes });

    const result = await service.updateOrder(id, dto);

    expect(result).toEqual({ ...order, notes: dto.notes });
  });

  it('should update the order with provided requestedBy and return updated order', async () => {
    const id = '123';
    const dto: UpdateOrderDto = { requestedBy: 'user' };
    const order = { id, status: OrderStatus.PENDING } as Order;
    orderRepositoryMock.findById.mockResolvedValue(order);
    orderRepositoryMock.save.mockResolvedValue({ ...order, requestedBy: dto.requestedBy });

    const result = await service.updateOrder(id, dto);

    expect(result).toEqual({ ...order, requestedBy: dto.requestedBy });
  });
});

  // TESTS_APPEND_HERE
});
