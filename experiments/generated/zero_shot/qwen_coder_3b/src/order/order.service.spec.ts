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

  describe('OrderService', () => {
  it('should throw NotFoundException when order with id is not found', async () => {
    const id = 'nonexistent-id';
    jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValue(undefined);

    await expect(service.getOrderById(id)).rejects.toThrow(NotFoundException);
  });
});

  describe('createOrder', () => {
  it('should throw BadRequestException if encounter is discharged', async () => {
    const dto = { encounterId: '123', examType: ExamType.HEMOGRAM, requestedAt: new Date().toISOString(), requestedBy: 'user' };
    encounterServiceMock.getEncounterById.mockResolvedValueOnce({ status: EncounterStatus.DISCHARGED });
    await expect(service.createOrder(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if order date is before admission date', async () => {
    const dto = { encounterId: '123', examType: ExamType.HEMOGRAM, requestedAt: new Date(2023, 0, 1).toISOString(), requestedBy: 'user' };
    encounterServiceMock.getEncounterById.mockResolvedValueOnce({ status: EncounterStatus.ADMITTED, admitDate: new Date(2023, 0, 5) });
    await expect(service.createOrder(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw ConflictException if a pending order for this exam already exists', async () => {
    const dto = { encounterId: '123', examType: ExamType.HEMOGRAM, requestedAt: new Date().toISOString(), requestedBy: 'user' };
    encounterServiceMock.getEncounterById.mockResolvedValueOnce({ status: EncounterStatus.ADMITTED });
    orderRepositoryMock.existsPendingOrder.mockResolvedValueOnce(true);
    await expect(service.createOrder(dto)).rejects.toThrow(ConflictException);
  });

  it('should create and save a new order', async () => {
    const dto = { encounterId: '123', examType: ExamType.HEMOGRAM, requestedAt: new Date().toISOString(), requestedBy: 'user' };
    encounterServiceMock.getEncounterById.mockResolvedValueOnce({ status: EncounterStatus.ADMITTED });
    orderRepositoryMock.existsPendingOrder.mockResolvedValueOnce(false);
    const createdOrder = { ...dto, requestedAt: new Date(dto.requestedAt), status: OrderStatus.PENDING, notes: dto.notes ?? null };
    orderRepositoryMock.create.mockReturnValue(createdOrder);
    orderRepositoryMock.save.mockResolvedValue(createdOrder);
    await expect(service.createOrder(dto)).resolves.toEqual(createdOrder);
  });
});

  describe('searchOrders', () => {
  it.skip('should throw NotFoundException when order is not found', async () => {
              const dto: SearchOrdersDto = { status: OrderStatus.PENDING };
              jest.spyOn(orderRepositoryMock, 'search').mockResolvedValueOnce(null);

              await expect(() => service.searchOrders(dto)).rejects.toThrow(NotFoundException);
            });


  it('should return an empty array when no orders match the criteria', async () => {
    const dto: SearchOrdersDto = { status: OrderStatus.PENDING };
    jest.spyOn(orderRepositoryMock, 'search').mockResolvedValueOnce([]);

    expect(await service.searchOrders(dto)).toEqual([]);
  });
});

  describe('searchOrdersAdvanced', () => {
  it('should throw a BadRequestException if the dto is invalid', async () => {
        const mockSearchOrdersAdvanced = jest.fn().mockRejectedValue(new BadRequestException());
        service.searchOrdersAdvanced = mockSearchOrdersAdvanced;

        await expect(() => service.searchOrdersAdvanced({} as SearchOrdersAdvancedDto)).rejects.toThrow(BadRequestException);
      });


  it.skip('should call orderRepository.searchAdvanced with the correct dto', async () => {
          const dto: SearchOrdersAdvancedDto = {
            status: OrderStatus.PENDING,
            examType: ExamType.HEMOGRAM,
            dateFrom: '2023-10-01',
            dateTo: '2023-10-31',
            patientId: 'patient123',
            encounterId: 'encounter456',
            requestedBy: 'user789',
            sortBy: OrderSortField.REQUESTED_AT,
            sortDirection: SortDirection.DESC,
            page: 1,
            limit: 10,
          };

          await service.searchOrdersAdvanced(dto);

          expect(orderRepositoryMock.searchAdvanced).toHaveBeenCalledWith(dto);
        });
})

  describe('validateOrderResult', () => {
  it('should throw NotFoundException when order is not found', async () => {
        const orderId = '123';
        await expect(service.validateOrderResult(orderId, ResultStatus.FINAL)).rejects.toThrow(NotFoundException);
      });


  it.skip('should throw BadRequestException when order is completed', async () => {
          const orderId = '456';
          const incomingStatus = ResultStatus.FINAL;

          await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
        });

  it.skip('should throw BadRequestException when encounter is discharged', async () => {
          const orderId = '789';
          const incomingStatus = ResultStatus.FINAL;

          await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
        });

  it.skip('should throw BadRequestException when order already has a final or corrected result', async () => {
          const orderId = '101112';
          const incomingStatus = ResultStatus.FINAL;

          await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
        });

  it.skip('should throw BadRequestException when registering a FINAL result for a PENDING order', async () => {
          const orderId = '131415';
          const incomingStatus = ResultStatus.FINAL;

          await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
        });

  it.skip('should throw BadRequestException when registering a CORRECTED result for a PENDING order', async () => {
          const orderId = '161718';
          const incomingStatus = ResultStatus.CORRECTED;

          await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
        });

  it.skip('should update order status to IN_PROGRESS when order is PENDING and incoming status is FINAL', async () => {
          const orderId = '192021';
          const incomingStatus = ResultStatus.FINAL;

          await expect(service.validateOrderResult(orderId, incomingStatus)).resolves.toEqual(expect.any(Order));
        });

  it.skip('should update order status to COMPLETED when order is IN_PROGRESS and incoming status is FINAL', async () => {
          const orderId = '222324';
          const incomingStatus = ResultStatus.FINAL;

          await expect(service.validateOrderResult(orderId, incomingStatus)).resolves.toEqual(expect.any(Order));
        });
});

  describe('cancelOrder', () => {
  it('should throw BadRequestException when order is already cancelled', async () => {
    const mockOrder = { id: '123', status: OrderStatus.CANCELLED };
    jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValue(mockOrder);

    await expect(service.cancelOrder('123')).rejects.toThrow(BadRequestException);
  });

  it('should update order status to cancelled and save it', async () => {
    const mockOrder = { id: '123', status: OrderStatus.PENDING };
    jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValue(mockOrder);
    jest.spyOn(orderRepositoryMock, 'save').mockResolvedValue(mockOrder);

    await expect(service.cancelOrder('123')).resolves.toBe(mockOrder);
  });
});

  describe('updateOrder', () => {
  it('should throw BadRequestException if order status is CANCELLED or COMPLETED', async () => {
    const order = { id: '123', status: OrderStatus.CANCELLED } as Order;
    jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValue(order);

    await expect(service.updateOrder('123', {})).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if order status is IN_PROGRESS and requestedBy is provided', async () => {
    const order = { id: '123', status: OrderStatus.IN_PROGRESS } as Order;
    jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValue(order);

    await expect(service.updateOrder('123', { requestedBy: 'John' })).rejects.toThrow(BadRequestException);
  });

  it('should update order data if requestedBy is provided', async () => {
    const order = { id: '123', status: OrderStatus.PENDING } as Order;
    jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValue(order);

    await service.updateOrder('123', { requestedBy: 'John' });
    expect(orderRepositoryMock.save).toHaveBeenCalledWith({ ...order, requestedBy: 'John' });
  });

  it('should update order data if notes are provided', async () => {
    const order = { id: '123', status: OrderStatus.PENDING } as Order;
    jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValue(order);

    await service.updateOrder('123', { notes: 'Updated notes' });
    expect(orderRepositoryMock.save).toHaveBeenCalledWith({ ...order, notes: 'Updated notes' });
  });

  it('should update order data if both requestedBy and notes are provided', async () => {
    const order = { id: '123', status: OrderStatus.PENDING } as Order;
    jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValue(order);

    await service.updateOrder('123', { requestedBy: 'John', notes: 'Updated notes' });
    expect(orderRepositoryMock.save).toHaveBeenCalledWith({ ...order, requestedBy: 'John', notes: 'Updated notes' });
  });

  it('should not update order data if neither requestedBy nor notes are provided', async () => {
    const order = { id: '123', status: OrderStatus.PENDING } as Order;
    jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValue(order);

    await service.updateOrder('123', {});
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
  });
});

  // TESTS_APPEND_HERE
});
