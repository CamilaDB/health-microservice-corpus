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
  it('should return the order when found', async () => {
    const mockOrder = {
      id: '123',
      encounterId: 'E456',
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

    const result = await service.getOrderById('123');

    expect(result).toEqual(mockOrder);
    expect(orderRepositoryMock.findById).toHaveBeenCalledWith('123');
  });

  it('should throw NotFoundException when order is not found', async () => {
    orderRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(service.getOrderById('456')).rejects.toThrow(NotFoundException);
    await expect(service.getOrderById('456')).rejects.toThrow('Order with id 456 not found');
    expect(orderRepositoryMock.findById).toHaveBeenCalledWith('456');
  });
});
});

  describe('FN_createOrder_END', () => {
describe('createOrder', () => {
  it('should throw BadRequestException if the encounter is discharged', async () => {
    const dto = {
      encounterId: 'enc123',
      examType: ExamType.HEMOGRAM,
      requestedAt: '2023-01-01T10:00:00Z',
      requestedBy: 'user1',
      notes: null,
    };
    const encounter = {
      status: EncounterStatus.DISCHARGED,
      admitDate: '2022-12-01T10:00:00Z',
    };

    encounterServiceMock.getEncounterById.mockResolvedValue(encounter);
    
    await expect(service.createOrder(dto)).rejects.toThrow(BadRequestException);
    await expect(service.createOrder(dto)).rejects.toThrow('Cannot create order for a discharged encounter');
    expect(orderRepositoryMock.existsPendingOrder).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException if the requested date is before the admission date', async () => {
    const dto = {
      encounterId: 'enc123',
      examType: ExamType.GLUCOSE,
      requestedAt: '2022-12-01T10:00:00Z', // Before admitDate
      requestedBy: 'user1',
    };
    const encounter = {
      status: EncounterStatus.ADMITTED,
      admitDate: '2023-01-01T10:00:00Z',
    };

    encounterServiceMock.getEncounterById.mockResolvedValue(encounter);
    
    await expect(service.createOrder(dto)).rejects.toThrow(BadRequestException);
    await expect(service.createOrder(dto)).rejects.toThrow('Order date cannot be before admission date');
    expect(orderRepositoryMock.existsPendingOrder).not.toHaveBeenCalled();
  });

  it('should throw ConflictException if a pending order already exists', async () => {
    const dto = {
      encounterId: 'enc123',
      examType: ExamType.CREATININE,
      requestedAt: '2023-01-01T10:00:00Z',
      requestedBy: 'user1',
    };

    encounterServiceMock.getEncounterById.mockResolvedValue({
      status: EncounterStatus.ADMITTED,
      admitDate: '2023-01-01T10:00:00Z',
    });
    
    orderRepositoryMock.existsPendingOrder.mockResolvedValue(true);

    await expect(service.createOrder(dto)).rejects.toThrow(ConflictException);
    await expect(service.createOrder(dto)).rejects.toThrow('A pending order for this exam already exists');
    expect(orderRepositoryMock.create).not.toHaveBeenCalled();
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should successfully create and save a new order', async () => {
    const dto = {
      encounterId: 'enc123',
      examType: ExamType.TSH,
      requestedAt: '2023-01-01T10:00:00Z',
      requestedBy: 'user1',
      notes: 'Some notes',
    };
    const encounter = {
      status: EncounterStatus.ADMITTED,
      admitDate: '2023-01-01T10:00:00Z',
    };
    const createdOrder = {
      id: 'order456',
      encounterId: 'enc123',
      examType: ExamType.TSH,
      status: OrderStatus.PENDING,
      requestedAt: new Date('2023-01-01T10:00:00Z'),
      requestedBy: 'user1',
      notes: 'Some notes',
      created_at: new Date(),
      updated_at: new Date(),
      encounter: encounter,
      results: [],
    };

    encounterServiceMock.getEncounterById.mockResolvedValue(encounter);
    orderRepositoryMock.existsPendingOrder.mockResolvedValue(false);
    orderRepositoryMock.create.mockReturnValue(createdOrder);
    orderRepositoryMock.save.mockResolvedValue(createdOrder);

    const result = await service.createOrder(dto);

    expect(result).toEqual(createdOrder);
    expect(encounterServiceMock.getEncounterById).toHaveBeenCalledWith('enc123');
    expect(orderRepositoryMock.existsPendingOrder).toHaveBeenCalledWith('enc123', ExamType.TSH);
    expect(orderRepositoryMock.create).toHaveBeenCalledWith({
      ...dto,
      requestedAt: new Date(dto.requestedAt),
      status: OrderStatus.PENDING,
      notes: 'Some notes',
    });
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(createdOrder);
  });
});
});

  describe('FN_searchOrders_END', () => {
describe('searchOrders', () => {
  it('should return the orders found by the repository when a search is successful', async () => {
    const mockOrders = [
      { id: '1', encounterId: 'e1', examType: 'HEMOGRAM', status: 'PENDING', requestedAt: new Date(), requestedBy: 'userA', notes: null, created_at: new Date(), updated_at: new Date(), encounter: {}, results: [] },
      { id: '2', encounterId: 'e2', examType: 'GLUCOSE', status: 'IN_PROGRESS', requestedAt: new Date(), requestedBy: 'userB', notes: 'some notes', created_at: new Date(), updated_at: new Date(), encounter: {}, results: [] },
    ];
    orderRepositoryMock.search.mockResolvedValue(mockOrders);

    const dto = { status: 'PENDING' };
    const result = await service.searchOrders(dto);

    expect(orderRepositoryMock.search).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockOrders);
  });

  it('should throw an error if the repository search fails', async () => {
    const error = new Error('Database search failed');
    orderRepositoryMock.search.mockRejectedValue(error);

    const dto = { status: 'PENDING' };

    await expect(service.searchOrders(dto)).rejects.toThrow(error);
    expect(orderRepositoryMock.search).toHaveBeenCalledWith(dto);
  });
});
});

  describe('FN_searchOrdersAdvanced_END', () => {
describe('searchOrdersAdvanced', () => {
  it('should return the result from orderRepository.searchAdvanced when successful', async () => {
    const mockPaginatedOrders = {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };
    orderRepositoryMock.searchAdvanced.mockResolvedValue(mockPaginatedOrders);

    const dto = {
      status: OrderStatus.PENDING,
    };

    const result = await service.searchOrdersAdvanced(dto);

    expect(result).toBe(mockPaginatedOrders);
    expect(orderRepositoryMock.searchAdvanced).toHaveBeenCalledWith(dto);
  });

  it('should throw an error if orderRepository.searchAdvanced throws an exception', async () => {
    const error = new Error('Repository search failed');
    orderRepositoryMock.searchAdvanced.mockRejectedValue(error);

    const dto = {
      status: OrderStatus.PENDING,
    };

    await expect(service.searchOrdersAdvanced(dto)).rejects.toThrow(error);
    expect(orderRepositoryMock.searchAdvanced).toHaveBeenCalledWith(dto);
  });
});
});

  describe('FN_validateOrderResult_END', () => {
describe('validateOrderResult', () => {
  it('should throw BadRequestException if the order is cancelled', async () => {
    const orderId = 'order123';
    const order = {
      id: orderId,
      status: OrderStatus.CANCELLED,
      encounterId: 'enc456',
      results: [],
    };
    orderRepositoryMock.findById.mockResolvedValue(order);

    await expect(service.validateOrderResult(orderId, ResultStatus.FINAL)).rejects.toThrow(BadRequestException);
    await expect(service.validateOrderResult(orderId, ResultStatus.FINAL)).rejects.toThrow(`Cannot add result to a cancelled order (id: ${orderId})`);
  });

  it('should throw BadRequestException if the encounter is discharged', async () => {
    const orderId = 'order123';
    const order = {
      id: orderId,
      status: OrderStatus.PENDING,
      encounterId: 'enc456',
      results: [],
    };
    const encounter = { status: EncounterStatus.DISCHARGED };
    orderRepositoryMock.findById.mockResolvedValue(order);
    encounterServiceMock.getEncounterById.mockResolvedValue(encounter);

    await expect(service.validateOrderResult(orderId, ResultStatus.FINAL)).rejects.toThrow(BadRequestException);
    await expect(service.validateOrderResult(orderId, ResultStatus.FINAL)).rejects.toThrow(`Cannot add result to an order from a discharged encounter (id: ${order.encounterId})`);
  });

  it('should return the order when incomingStatus is CORRECTED and conditions are met', async () => {
        const orderId = 'order123';
        const order = {
          id: orderId,
          status: OrderStatus.COMPLETED,
          encounterId: 'enc456',
          results: [{ status: ResultStatus.FINAL }],
        };
        const encounter = { status: EncounterStatus.TRANSFERRED };
        orderRepositoryMock.findById.mockResolvedValue(order);
        encounterServiceMock.getEncounterById.mockResolvedValue(encounter);

        await expect(service.validateOrderResult(orderId, ResultStatus.CORRECTED)).resolves.toBe(order);
      });


  it('should throw BadRequestException if order status is not COMPLETED when incomingStatus is CORRECTED', async () => {
    const orderId = 'order123';
    const order = {
      id: orderId,
      status: OrderStatus.PENDING,
      encounterId: 'enc456',
      results: [{ status: ResultStatus.FINAL }],
    };
    orderRepositoryMock.findById.mockResolvedValue(order);
    encounterServiceMock.getEncounterById.mockResolvedValue({ status: EncounterStatus.TRANSFERRED });

    await expect(service.validateOrderResult(orderId, ResultStatus.CORRECTED)).rejects.toThrow(BadRequestException);
    await expect(service.validateOrderResult(orderId, ResultStatus.CORRECTED)).rejects.toThrow('Cannot register a CORRECTED result until the order is COMPLETED');
  });

  it('should throw BadRequestException if the order lacks a final result or has a corrected result when incomingStatus is CORRECTED', async () => {
        const orderId = 'order123';
        const order = {
          id: orderId,
          status: OrderStatus.COMPLETED,
          encounterId: 'enc456',
          results: [{ status: ResultStatus.CORRECTED }],
        };
        orderRepositoryMock.findById.mockResolvedValue(order);
        encounterServiceMock.getEncounterById.mockResolvedValue({ status: EncounterStatus.TRANSFERRED });

        await expect(service.validateOrderResult(orderId, ResultStatus.CORRECTED)).rejects.toThrow(BadRequestException);
        await expect(service.validateOrderResult(orderId, ResultStatus.CORRECTED)).rejects.toThrow('Order (id: order123) must have exactly one final result available for correction');
    });


  it('should throw BadRequestException if the order is already COMPLETED', async () => {
    const orderId = 'order123';
    const order = {
      id: orderId,
      status: OrderStatus.COMPLETED,
      encounterId: 'enc456',
      results: [{ status: ResultStatus.FINAL }],
    };
    orderRepositoryMock.findById.mockResolvedValue(order);
    encounterServiceMock.getEncounterById.mockResolvedValue({ status: EncounterStatus.TRANSFERRED });

    await expect(service.validateOrderResult(orderId, ResultStatus.FINAL)).rejects.toThrow(BadRequestException);
    await expect(service.validateOrderResult(orderId, ResultStatus.FINAL)).rejects.toThrow('Order already completed (id: order123). Cannot add another result');
  });

  it('should throw BadRequestException if the order already has a final result', async () => {
    const orderId = 'order123';
    const order = {
      id: orderId,
      status: OrderStatus.IN_PROGRESS,
      encounterId: 'enc456',
      results: [{ status: ResultStatus.FINAL }],
    };
    orderRepositoryMock.findById.mockResolvedValue(order);
    encounterServiceMock.getEncounterById.mockResolvedValue({ status: EncounterStatus.TRANSFERRED });

    await expect(service.validateOrderResult(orderId, ResultStatus.FINAL)).rejects.toThrow(BadRequestException);
    await expect(service.validateOrderResult(orderId, ResultStatus.FINAL)).rejects.toThrow('Order (id: order123) already has a final or corrected result');
  });

  it('should throw BadRequestException if status is PENDING and incomingStatus is FINAL', async () => {
    const orderId = 'order123';
    const order = {
      id: orderId,
      status: OrderStatus.PENDING,
      encounterId: 'enc456',
      results: [],
    };
    orderRepositoryMock.findById.mockResolvedValue(order);
    encounterServiceMock.getEncounterById.mockResolvedValue({ status: EncounterStatus.TRANSFERRED });

    await expect(service.validateOrderResult(orderId, ResultStatus.FINAL)).rejects.toThrow(BadRequestException);
    await expect(service.validateOrderResult(orderId, ResultStatus.FINAL)).rejects.toThrow('Cannot register a FINAL result for a PENDING order. Order must be IN_PROGRESS first');
  });

  it.skip('should transition order status from PENDING to IN_PROGRESS when incomingStatus is CORRECTED', async () => {
                    const orderId = 'order123';
                    const order = {
                      id: orderId,
                      status: OrderStatus.PENDING,
                      encounterId: 'enc456',
                      results: [],
                    };
                    orderRepositoryMock.findById.mockResolvedValue(order);
                    encounterServiceMock.getEncounterById.mockResolvedValue({ status: EncounterStatus.TRANSFERRED });
                    orderRepositoryMock.save.mockResolvedValue(order);

                    const result = await service.validateOrderResult(orderId, ResultStatus.CORRECTED);

                    expect(result).toBe(order);
                    expect(order.status).toBe(OrderStatus.IN_PROGRESS);
                    expect(orderRepositoryMock.save).toHaveBeenCalledTimes(1);
                    expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
                  });




  it('should transition order status from IN_PROGRESS to COMPLETED when incomingStatus is FINAL', async () => {
    const orderId = 'order123';
    const order = {
      id: orderId,
      status: OrderStatus.IN_PROGRESS,
      encounterId: 'enc456',
      results: [],
    };
    orderRepositoryMock.findById.mockResolvedValue(order);
    encounterServiceMock.getEncounterById.mockResolvedValue({ status: EncounterStatus.TRANSFERRED });
    orderRepositoryMock.save.mockResolvedValue(order);

    const result = await service.validateOrderResult(orderId, ResultStatus.FINAL);

    expect(result).toBe(order);
    expect(order.status).toBe(OrderStatus.COMPLETED);
    expect(orderRepositoryMock.save).toHaveBeenCalledTimes(1);
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
  });
});
});

  describe('FN_cancelOrder_END', () => {
describe('cancelOrder', () => {
  it('should return the saved order when the order is not cancelled', async () => {
    const orderId = 'order123';
    const mockOrder = {
      id: orderId,
      status: OrderStatus.PENDING,
      // other properties required by Order entity, though not strictly tested here
    };

    orderRepositoryMock.findById.mockResolvedValue(mockOrder);
    orderRepositoryMock.save.mockResolvedValue(mockOrder);

    const result = await service.cancelOrder(orderId);

    expect(orderRepositoryMock.findById).toHaveBeenCalledWith(orderId);
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(mockOrder);
    expect(result).toEqual(mockOrder);
  });

  it('should throw BadRequestException if the order is already cancelled', async () => {
    const orderId = 'order456';
    const cancelledOrder = {
      id: orderId,
      status: OrderStatus.CANCELLED,
    };

    orderRepositoryMock.findById.mockResolvedValue(cancelledOrder);

    await expect(service.cancelOrder(orderId)).rejects.toThrow(BadRequestException);
    await expect(service.cancelOrder(orderId)).rejects.toThrow(`Order ${orderId} is already cancelled`);
    
    expect(orderRepositoryMock.findById).toHaveBeenCalledWith(orderId);
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });
});
});

  describe('FN_updateOrder_END', () => {
describe('updateOrder', () => {
  it('should throw BadRequestException if the order status is CANCELLED', async () => {
    const orderId = 'order1';
    const mockOrder = {
      id: orderId,
      status: OrderStatus.CANCELLED,
      requestedBy: 'userA',
      notes: 'initial notes',
    };

    orderRepositoryMock.findById.mockResolvedValue(mockOrder);
    orderRepositoryMock.save.mockResolvedValue(mockOrder);

    await expect(service.updateOrder(orderId, { notes: 'new notes' })).rejects.toThrow(BadRequestException);
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException if the order status is COMPLETED', async () => {
    const orderId = 'order2';
    const mockOrder = {
      id: orderId,
      status: OrderStatus.COMPLETED,
      requestedBy: 'userB',
      notes: 'initial notes',
    };

    orderRepositoryMock.findById.mockResolvedValue(mockOrder);
    orderRepositoryMock.save.mockResolvedValue(mockOrder);

    await expect(service.updateOrder(orderId, { notes: 'new notes' })).rejects.toThrow(BadRequestException);
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException if the order status is IN_PROGRESS and requestedBy is provided', async () => {
    const orderId = 'order3';
    const mockOrder = {
      id: orderId,
      status: OrderStatus.IN_PROGRESS,
      requestedBy: 'userC',
      notes: 'initial notes',
    };
    const dto = { requestedBy: 'userD' };

    orderRepositoryMock.findById.mockResolvedValue(mockOrder);
    orderRepositoryMock.save.mockResolvedValue(mockOrder);

    await expect(service.updateOrder(orderId, dto)).rejects.toThrow(BadRequestException);
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should update requestedBy and notes successfully when status is IN_PROGRESS and no requestedBy is provided', async () => {
    const orderId = 'order4';
    const initialOrder = {
      id: orderId,
      status: OrderStatus.IN_PROGRESS,
      requestedBy: 'userE',
      notes: 'initial notes',
    };
    const dto = { notes: 'updated notes' };

    orderRepositoryMock.findById.mockResolvedValue(initialOrder);
    orderRepositoryMock.save.mockResolvedValue({ ...initialOrder, notes: 'updated notes' });

    const result = await service.updateOrder(orderId, dto);

    expect(result).toEqual({
      ...initialOrder,
      notes: 'updated notes',
    });
    expect(orderRepositoryMock.save).toHaveBeenCalledTimes(1);
    expect(orderRepositoryMock.save).toHaveBeenCalledWith({
      id: orderId,
      status: OrderStatus.IN_PROGRESS,
      requestedBy: 'userE',
      notes: 'updated notes',
    });
  });

  it('should update requestedBy and notes successfully when both are provided', async () => {
        const orderId = 'order5';
        const initialOrder = {
          id: orderId,
          status: OrderStatus.IN_PROGRESS,
          requestedBy: 'userF',
          notes: 'initial notes',
        };
        const dto = { notes: 'final notes' };

        orderRepositoryMock.findById.mockResolvedValue(initialOrder);
        orderRepositoryMock.save.mockResolvedValue({
          ...initialOrder,
          notes: 'final notes',
        });

        const result = await service.updateOrder(orderId, dto);

        expect(result).toEqual({
          id: orderId,
          status: OrderStatus.IN_PROGRESS,
          requestedBy: 'userF',
          notes: 'final notes',
        });
        expect(orderRepositoryMock.save).toHaveBeenCalledTimes(1);
        expect(orderRepositoryMock.save).toHaveBeenCalledWith({
          id: orderId,
          status: OrderStatus.IN_PROGRESS,
          requestedBy: 'userF',
          notes: 'final notes',
        });
      });

});
});

  // TESTS_APPEND_HERE
});
