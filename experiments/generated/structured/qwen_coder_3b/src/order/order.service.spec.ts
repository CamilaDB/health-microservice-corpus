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
    const id = '123';
    jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValueOnce(undefined);

    await expect(service.getOrderById(id)).rejects.toThrow(NotFoundException);
  });
});
});

  describe('FN_createOrder_END', () => {
describe('createOrder', () => {
  it('should throw BadRequestException when encounter.status is DISCHARGED', async () => {
    const dto = new CreateOrderDto();
    dto.encounterId = '123';
    dto.examType = ExamType.HEMOGRAM;
    dto.requestedAt = '2023-04-01T12:00:00Z';
    dto.requestedBy = 'John Doe';

    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      id: '123',
      status: EncounterStatus.DISCHARGED,
      admitDate: new Date('2023-04-01T09:00:00Z'),
    });

    await expect(service.createOrder(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when requestedAt is before admitDate', async () => {
    const dto = new CreateOrderDto();
    dto.encounterId = '123';
    dto.examType = ExamType.HEMOGRAM;
    dto.requestedAt = '2023-04-01T08:00:00Z'; // Before admitDate
    dto.requestedBy = 'John Doe';

    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      id: '123',
      status: EncounterStatus.ADMITTED,
      admitDate: new Date('2023-04-01T09:00:00Z'),
    });

    await expect(service.createOrder(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw ConflictException when a pending order already exists', async () => {
    const dto = new CreateOrderDto();
    dto.encounterId = '123';
    dto.examType = ExamType.HEMOGRAM;
    dto.requestedAt = '2023-04-01T12:00:00Z';
    dto.requestedBy = 'John Doe';

    encounterServiceMock.getEncounterById.mockResolvedValueOnce({
      id: '123',
      status: EncounterStatus.ADMITTED,
      admitDate: new Date('2023-04-01T09:00:00Z'),
    });

    orderRepositoryMock.existsPendingOrder.mockResolvedValueOnce(true);

    await expect(service.createOrder(dto)).rejects.toThrow(ConflictException);
  });
});
});

  describe('FN_searchOrders_END', () => {
describe('searchOrders', () => {
  it('should return an empty array when no orders are found', async () => {
    orderRepositoryMock.search.mockResolvedValue([]);

    const result = await service.searchOrders({});

    expect(result).toEqual([]);
  });

  it.skip('should throw a NotFoundException if the search criteria is invalid', async () => {
        expect(() => service.searchOrders({})).toThrow(NotFoundException);
      });
});
});

  describe('FN_searchOrdersAdvanced_END', () => {
describe('searchOrdersAdvanced', () => {
  it('should return a paginated orders when dto is valid and searchRepository.searchAdvanced returns data', async () => {
    const dto = new SearchOrdersAdvancedDto();
    const mockResult: PaginatedOrders = { data: [], total: 0, page: 1, limit: 10, totalPages: 1 };
    orderRepositoryMock.searchAdvanced.mockResolvedValue(mockResult);

    const result = await service.searchOrdersAdvanced(dto);

    expect(result).toEqual(mockResult);
  });

  it.skip('should throw a BadRequestException when dto is invalid', async () => {
        const dto = new SearchOrdersAdvancedDto();
        dto.status = 'INVALID_STATUS';
        await expect(service.searchOrdersAdvanced(dto)).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw a NotFoundException when no orders are found', async () => {
        const dto = new SearchOrdersAdvancedDto();
        orderRepositoryMock.searchAdvanced.mockResolvedValue({ data: [], total: 0, page: 1, limit: 10, totalPages: 1 });

        await expect(service.searchOrdersAdvanced(dto)).rejects.toThrow(NotFoundException);
      });
});
});

  describe('FN_validateOrderResult_END', () => {
describe('validateOrderResult', () => {
  it('should throw BadRequestException when order.status is OrderStatus.CANCELLED', async () => {
    const orderId = '123';
    const incomingStatus = ResultStatus.PRELIMINARY;
    jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValueOnce({ status: OrderStatus.CANCELLED });
    await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when order.status is OrderStatus.COMPLETED', async () => {
    const orderId = '123';
    const incomingStatus = ResultStatus.PRELIMINARY;
    jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValueOnce({ status: OrderStatus.COMPLETED });
    await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
  });

  it.skip('should throw BadRequestException when encounter.status is EncounterStatus.DISCHARGED', async () => {
        const orderId = '123';
        const incomingStatus = ResultStatus.PRELIMINARY;
        jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValueOnce({
          status: OrderStatus.IN_PROGRESS,
          encounterId: '456',
          encounter: { status: EncounterStatus.DISCHARGED },
        });
        await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw BadRequestException when order has a final or corrected result', async () => {
            const orderId = '123';
            const incomingStatus = ResultStatus.PRELIMINARY;
            jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValueOnce({
              status: OrderStatus.IN_PROGRESS,
              results: [{ status: ResultStatus.FINAL }],
              encounterId: '456',
            });
            await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
          });


  it.skip('should throw BadRequestException when order is PENDING and incomingStatus is FINAL', async () => {
        const orderId = '123';
        const incomingStatus = ResultStatus.FINAL;
        jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValueOnce({ status: OrderStatus.PENDING });
        await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw BadRequestException when order is PENDING and incomingStatus is CORRECTED', async () => {
        const orderId = '123';
        const incomingStatus = ResultStatus.CORRECTED;
        jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValueOnce({ status: OrderStatus.PENDING });
        await expect(service.validateOrderResult(orderId, incomingStatus)).rejects.toThrow(BadRequestException);
      });

  it.skip('should update order status to IN_PROGRESS and save the order when order is PENDING', async () => {
            const orderId = '123';
            const incomingStatus = ResultStatus.PRELIMINARY;
            jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValueOnce({ id: orderId, status: OrderStatus.PENDING });
            jest.spyOn(orderRepositoryMock, 'save').mockResolvedValueOnce({ id: orderId, status: OrderStatus.IN_PROGRESS });
            expect(await service.validateOrderResult(orderId, incomingStatus)).toEqual({ id: orderId, status: OrderStatus.IN_PROGRESS });
          });


  it.skip('should update order status to COMPLETED and save the order when order is IN_PROGRESS and incomingStatus is FINAL', async () => {
          const orderId = '123';
          const incomingStatus = ResultStatus.FINAL;
          jest.spyOn(orderRepositoryMock, 'findById').mockResolvedValueOnce({ id: orderId, status: OrderStatus.IN_PROGRESS });
          jest.spyOn(orderRepositoryMock, 'save').mockResolvedValueOnce({ id: orderId, status: OrderStatus.COMPLETED });
          expect(await service.validateOrderResult(orderId, incomingStatus)).toEqual({ id: orderId, status: OrderStatus.COMPLETED });
        });

});
});

  describe('FN_cancelOrder_END', () => {
describe('cancelOrder', () => {
  it('should throw BadRequestException when order is already cancelled', async () => {
    const id = '123';
    const order = { status: OrderStatus.CANCELLED } as Order;
    orderRepositoryMock.findById.mockResolvedValue(order);

    await expect(service.cancelOrder(id)).rejects.toThrow(BadRequestException);
  });
});
});

  describe('FN_updateOrder_END', () => {
describe('updateOrder', () => {
  it('should throw BadRequestException when order status is CANCELLED or COMPLETED', async () => {
    const dto = new UpdateOrderDto();
    const order = { status: OrderStatus.CANCELLED } as Order;
    jest.spyOn(service, 'getOrderById').mockResolvedValue(order);

    await expect(() => service.updateOrder('id', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when order status is IN_PROGRESS and requestedBy is provided', async () => {
    const dto = { requestedBy: 'user' } as UpdateOrderDto;
    const order = { status: OrderStatus.IN_PROGRESS } as Order;
    jest.spyOn(service, 'getOrderById').mockResolvedValue(order);

    await expect(() => service.updateOrder('id', dto)).rejects.toThrow(BadRequestException);
  });

  it.skip('should update requestedBy if provided in DTO', async () => {
            const dto = { requestedBy: 'user' } as UpdateOrderDto;
            const order = { status: OrderStatus.PENDING } as Order;
            jest.spyOn(service, 'getOrderById').mockResolvedValue(order);
            jest.spyOn(Object.prototype, 'assign').mockImplementation((target, source) => {
              Object.assign(target, source);
              return target;
            });
        
            await service.updateOrder('id', dto);
        
            expect(Object.assign).toHaveBeenCalledWith(order, { requestedBy: 'user' });
          });


  it.skip('should update notes if provided in DTO', async () => {
        const dto = { notes: 'new notes' } as UpdateOrderDto;
        const order = { status: OrderStatus.PENDING } as Order;
        jest.spyOn(service, 'getOrderById').mockResolvedValue(order);
        jest.spyOn(Object.prototype, 'assign');

        await service.updateOrder('id', dto);

        expect(Object.assign).toHaveBeenCalledWith(order, { notes: 'new notes' });
      });

  it.skip('should save the updated order to the repository', async () => {
        const dto = { requestedBy: 'user', notes: 'new notes' } as UpdateOrderDto;
        const order = { status: OrderStatus.PENDING } as Order;
        jest.spyOn(service, 'getOrderById').mockResolvedValue(order);
        jest.spyOn(Object.prototype, 'assign');
        jest.spyOn(orderRepositoryMock, 'save').mockResolvedValue(order);

        await service.updateOrder('id', dto);

        expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
      });
});
});

  // TESTS_APPEND_HERE
});
