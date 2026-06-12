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
  it('should return the order if found by id', async () => {
    const mockOrderId = 'order-123';
    const mockOrder: Order = {
      id: mockOrderId,
      encounterId: 'enc-456',
      examType: 'HEMOGRAM',
      status: 'PENDING',
      requestedAt: new Date(),
      requestedBy: 'user1',
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      encounter: {} as any,
      results: []
    } as Order;

    (orderRepositoryMock.findById as jest.Mock).mockResolvedValue(mockOrder);

    const result = await service.getOrderById(mockOrderId);

    expect(orderRepositoryMock.findById).toHaveBeenCalledWith(mockOrderId);
    expect(result).toEqual(mockOrder);
  });

  it('should throw NotFoundException if order is not found', async () => {
    const mockOrderId = 'non-existent-id';

    (orderRepositoryMock.findById as jest.Mock).mockResolvedValue(undefined);

    await expect(service.getOrderById(mockOrderId)).rejects.toThrow(NotFoundException);
    await expect(service.getOrderById(mockOrderId)).rejects.toThrow(`Order with id ${mockOrderId} not found`);
  });
});

  describe('createOrder', () => {
  const mockCreateOrderDto = {
    encounterId: 'enc123',
    examType: 'HEMOGRAM',
    requestedAt: '2024-06-15T10:00:00Z',
    requestedBy: 'userA',
  };

  const mockEncounter = {
    status: 'ADMITTED',
    admitDate: new Date('2024-06-10'),
  };

  it('should throw BadRequestException if the encounter is discharged', async () => {
    encounterServiceMock.getEncounterById.mockResolvedValue({
      status: 'DISCHARGED',
    });

    await expect(service.createOrder(mockCreateOrderDto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if the requested date is before the admission date', async () => {
    encounterServiceMock.getEncounterById.mockResolvedValue({
      status: 'ADMITTED',
      admitDate: new Date('2024-06-15'),
    });

    const dtoBeforeAdmission = {
      ...mockCreateOrderDto,
      requestedAt: '2024-06-10T08:00:00Z',
    };

    await expect(service.createOrder(dtoBeforeAdmission)).rejects.toThrow(BadRequestException);
  });

  it.skip('should throw ConflictException if a pending order already exists for the exam type', async () => {
                      encounterServiceMock.getEncounterById.mockResolvedValue({
                        status: 'ADMITTED',
                        admitDate: new Date(),
                      });

                      orderRepositoryMock.existsPendingOrder.mockResolvedValue(true);

                      await expect(service.createOrder(mockCreateOrderDto)).rejects.toThrow('A pending order for this exam already exists');
                    });



  it('should successfully create and save a pending order when all validations pass', async () => {
    const expectedOrder = {
      id: 'order456',
      encounterId: mockCreateOrderDto.encounterId,
      examType: mockCreateOrderDto.examType,
      status: 'PENDING',
      requestedAt: new Date(mockCreateOrderDto.requestedAt),
      requestedBy: mockCreateOrderDto.requestedBy,
      notes: null,
    };

    // 1. Mock Encounter retrieval (Success)
    encounterServiceMock.getEncounterById.mockResolvedValue({
      status: 'ADMITTED',
      admitDate: new Date('2024-06-10'),
    });

    // 2. Mock existence check (No conflict)
    orderRepositoryMock.existsPendingOrder.mockResolvedValue(false);

    // 3. Mock save operation (Success)
    const createSpy = orderRepositoryMock.create;
    const saveSpy = orderRepositoryMock.save;
    
    // Ensure the mock setup for 'create' is correct before saving
    orderRepositoryMock.create.mockReturnValue({
      ...mockCreateOrderDto,
      requestedAt: new Date(mockCreateOrderDto.requestedAt),
      status: 'PENDING',
      notes: null,
    });

    saveSpy.mockResolvedValue(expectedOrder);

    const result = await service.createOrder(mockCreateOrderDto);

    expect(encounterServiceMock.getEncounterById).toHaveBeenCalledWith(mockCreateOrderDto.encounterId);
    expect(orderRepositoryMock.existsPendingOrder).toHaveBeenCalledWith(mockCreateOrderDto.encounterId, mockCreateOrderDto.examType);
    expect(createSpy).toHaveBeenCalled();
    expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'PENDING' }));
    expect(result).toEqual(expectedOrder);
  });

  it('should handle optional notes field correctly during creation', async () => {
    const dtoWithNotes = {
      ...mockCreateOrderDto,
      notes: 'Routine checkup',
    };

    const expectedOrder = {
      id: 'order456',
      encounterId: mockCreateOrderDto.encounterId,
      examType: mockCreateOrderDto.examType,
      status: 'PENDING',
      requestedAt: new Date(mockCreateOrderDto.requestedAt),
      requestedBy: mockCreateOrderDto.requestedBy,
      notes: 'Routine checkup',
    };

    encounterServiceMock.getEncounterById.mockResolvedValue({
      status: 'ADMITTED',
      admitDate: new Date('2024-06-10'),
    });
    orderRepositoryMock.existsPendingOrder.mockResolvedValue(false);
    orderRepositoryMock.save.mockResolvedValue(expectedOrder);

    await service.createOrder(dtoWithNotes);
  });
});

  describe('searchOrders', () => {
  it('should return a list of orders when search is successful', async () => {
    const mockOrders = [{ id: '1', status: OrderStatus.COMPLETED } as any[]];
    (orderRepositoryMock.search as jest.Mock).mockResolvedValue(mockOrders);

    const dto = { status: OrderStatus.PENDING };
    const result = await service.searchOrders(dto);

    expect(orderRepositoryMock.search).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockOrders);
  });

  it('should throw an error if the repository search fails', async () => {
    const mockError = new Error('Database connection failed');
    (orderRepositoryMock.search as jest.Mock).mockRejectedValue(mockError);

    const dto = {};
    await expect(service.searchOrders(dto)).rejects.toThrow(mockError);
  });
});

  describe('searchOrdersAdvanced', () => {
  it('should return paginated orders when searching advanced criteria', async () => {
    const mockDto: SearchOrdersAdvancedDto = {
      status: OrderStatus.COMPLETED,
      examType: ExamType.GLUCOSE,
      patientId: 'patient-123',
      page: 1,
      limit: 10,
    };
    const mockPaginatedOrders: PaginatedOrders = {
      data: [],
      total: 50,
      page: 1,
      limit: 10,
      totalPages: 5,
    };

    orderRepositoryMock.searchAdvanced.mockResolvedValue(mockPaginatedOrders);

    const result = await service.searchOrdersAdvanced(mockDto);

    expect(orderRepositoryMock.searchAdvanced).toHaveBeenCalledWith(mockDto);
    expect(result).toEqual(mockPaginatedOrders);
  });

  it('should return paginated orders when searching with only pagination parameters', async () => {
    const mockDto: SearchOrdersAdvancedDto = {
      page: 2,
      limit: 20,
    };
    const mockPaginatedOrders: PaginatedOrders = {
      data: [],
      total: 100,
      page: 2,
      limit: 20,
      totalPages: 5,
    };

    orderRepositoryMock.searchAdvanced.mockResolvedValue(mockPaginatedOrders);

    const result = await service.searchOrdersAdvanced(mockDto);

    expect(orderRepositoryMock.searchAdvanced).toHaveBeenCalledWith(mockDto);
    expect(result).toEqual(mockPaginatedOrders);
  });
});

  describe('validateOrderResult', () => {
  const orderId = 'order123';
  const encounterId = 'enc456';

  let mockOrder: Order;
  let mockEncounter: any;

  beforeEach(() => {
    mockEncounter = { status: EncounterStatus.ADMITTED };

    // Default successful order state (IN_PROGRESS, no results)
    mockOrder = {
      id: orderId,
      encounterId: encounterId,
      status: OrderStatus.IN_PROGRESS,
      results: [],
    };

    // Mock the internal call to getOrderById using findById on the repository mock
    (orderRepositoryMock.findById as jest.Mock).mockResolvedValue(mockOrder);
    // Mock encounter retrieval
    (encounterServiceMock.getEncounterById as jest.Mock).mockResolvedValue(mockEncounter);
  });

  it('should throw BadRequestException if the order is CANCELLED', async () => {
    mockOrder = { ...mockOrder, status: OrderStatus.CANCELLED };
    (orderRepositoryMock.findById as jest.Mock).mockResolvedValue(mockOrder);

    await expect(service.validateOrderResult(orderId, ResultStatus.PRELIMINARY)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if the order is COMPLETED', async () => {
    mockOrder = { ...mockOrder, status: OrderStatus.COMPLETED };
    (orderRepositoryMock.findById as jest.Mock).mockResolvedValue(mockOrder);

    await expect(service.validateOrderResult(orderId, ResultStatus.PRELIMINARY)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if the encounter is DISCHARGED', async () => {
    mockEncounter = { status: EncounterStatus.DISCHARGED };
    (encounterServiceMock.getEncounterById as jest.Mock).mockResolvedValue(mockEncounter);

    await expect(service.validateOrderResult(orderId, ResultStatus.PRELIMINARY)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if the order already has a FINAL result', async () => {
    const closedResult: any = { status: ResultStatus.FINAL };
    mockOrder = { ...mockOrder, results: [closedResult] };
    (orderRepositoryMock.findById as jest.Mock).mockResolvedValue(mockOrder);

    await expect(service.validateOrderResult(orderId, ResultStatus.PRELIMINARY)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if the order already has a CORRECTED result', async () => {
    const closedResult: any = { status: ResultStatus.CORRECTED };
    mockOrder = { ...mockOrder, results: [closedResult] };
    (orderRepositoryMock.findById as jest.Mock).mockResolvedValue(mockOrder);

    await expect(service.validateOrderResult(orderId, ResultStatus.PRELIMINARY)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when trying to register FINAL result for PENDING order', async () => {
    mockOrder = { ...mockOrder, status: OrderStatus.PENDING };
    (orderRepositoryMock.findById as jest.Mock).mockResolvedValue(mockOrder);

    await expect(service.validateOrderResult(orderId, ResultStatus.FINAL)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when trying to register CORRECTED result for PENDING order', async () => {
    mockOrder = { ...mockOrder, status: OrderStatus.PENDING };
    (orderRepositoryMock.findById as jest.Mock).mockResolvedValue(mockOrder);

    await expect(service.validateOrderResult(orderId, ResultStatus.CORRECTED)).rejects.toThrow(BadRequestException);
  });

  it('should transition PENDING order to IN_PROGRESS when receiving a valid result status', async () => {
    const initialMockOrder = { ...mockOrder, status: OrderStatus.PENDING };
    (orderRepositoryMock.findById as jest.Mock).mockResolvedValue(initialMockOrder);

    // Mock save to return the updated order object
    (orderRepositoryMock.save as jest.Mock).mockResolvedValue({ ...initialMockOrder, status: OrderStatus.IN_PROGRESS });

    const result = await service.validateOrderResult(orderId, ResultStatus.PRELIMINARY);

    expect(result.status).toBe(OrderStatus.IN_PROGRESS);
    expect(orderRepositoryMock.save).toHaveBeenCalledTimes(1);
  });

  it('should transition IN_PROGRESS order to COMPLETED when receiving a FINAL result', async () => {
    const initialMockOrder = { ...mockOrder, status: OrderStatus.IN_PROGRESS };
    (orderRepositoryMock.findById as jest.Mock).mockResolvedValue(initialMockOrder);

    // Mock save to return the updated order object
    (orderRepositoryMock.save as jest.Mock).mockResolvedValue({ ...initialMockOrder, status: OrderStatus.COMPLETED });

    const result = await service.validateOrderResult(orderId, ResultStatus.FINAL);

    expect(result.status).toBe(OrderStatus.COMPLETED);
    expect(orderRepositoryMock.save).toHaveBeenCalledTimes(1);
  });

  it('should return the order object without status change if already IN_PROGRESS and receiving a non-final result', async () => {
    const initialMockOrder = { ...mockOrder, status: OrderStatus.IN_PROGRESS };
    (orderRepositoryMock.findById as jest.Mock).mockResolvedValue(initialMockOrder);

    // Ensure save is not called if no state change happens
    (orderRepositoryMock.save as jest.Mock).mockResolvedValue(undefined);

    const result = await service.validateOrderResult(orderId, ResultStatus.PRELIMINARY);

    expect(result).toEqual(initialMockOrder);
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });
});

  describe('cancelOrder', () => {
  const orderId = 'order-123';

  it('should successfully cancel an order if its status is not already cancelled', async () => {
    const initialStatus = OrderStatus.PENDING;
    const updatedOrder: Order = {
      id: orderId,
      status: OrderStatus.CANCELLED,
      // Include other necessary fields for a valid return object
    } as unknown as Order;

    // Mock the retrieval of the existing order
    (orderRepositoryMock.findById as jest.Mock).mockResolvedValue({
      ...updatedOrder,
      status: initialStatus,
    });

    // Mock the saving operation to return the cancelled state
    (orderRepositoryMock.save as jest.Mock).mockResolvedValue(updatedOrder);

    const result = await service.cancelOrder(orderId);

    expect(result).toEqual(updatedOrder);
    expect(orderRepositoryMock.findById).toHaveBeenCalledWith(orderId);
    expect(orderRepositoryMock.save).toHaveBeenCalledTimes(1);
  });

  it('should throw BadRequestException if the order is already cancelled', async () => {
    const initialStatus = OrderStatus.CANCELLED;

    // Mock the retrieval of the existing order (already cancelled)
    (orderRepositoryMock.findById as jest.Mock).mockResolvedValue({
      id: orderId,
      status: initialStatus,
    });

    await expect(service.cancelOrder(orderId)).rejects.toThrow(BadRequestException);
    await expect(service.cancelOrder(orderId)).rejects.toThrow(`Order ${orderId} is already cancelled`);
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException if the order does not exist', async () => {
    // Mock findById to return undefined, simulating not found
    (orderRepositoryMock.findById as jest.Mock).mockResolvedValue(undefined);

    await expect(service.cancelOrder(orderId)).rejects.toThrow(NotFoundException);
  });
});

  describe('updateOrder', () => {
  const mockOrderId = 'order-123';
  let baseOrder: Order;

  beforeEach(() => {
    baseOrder = {
      id: mockOrderId,
      encounterId: 'enc-456',
      examType: ExamType.GLUCOSE,
      status: OrderStatus.PENDING,
      requestedAt: new Date(),
      requestedBy: 'initialUser',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Default successful mocks for the start of each test
    orderRepositoryMock.findById = jest.fn().mockResolvedValue(baseOrder);
    orderRepositoryMock.save = jest.fn().mockResolvedValue({ ...baseOrder, updated_at: new Date() });
  });

  it('should successfully update only notes for an order in PENDING status', async () => {
    const dto: UpdateOrderDto = { notes: 'Patient reported mild symptoms.' };
    await service.updateOrder(mockOrderId, dto);

    expect(orderRepositoryMock.findById).toHaveBeenCalledWith(mockOrderId);
    expect(orderRepositoryMock.save).toHaveBeenCalledTimes(1);
  });

  it('should successfully update only requestedBy for an order in PENDING status', async () => {
    const newRequestedBy = 'nurse-john';
    const dto: UpdateOrderDto = { requestedBy: newRequestedBy };
    await service.updateOrder(mockOrderId, dto);

    expect(orderRepositoryMock.findById).toHaveBeenCalledWith(mockOrderId);
    // Check if the saved object reflects the change
    const savedOrder = orderRepositoryMock.save.mock.calls[0][0];
    expect(savedOrder.requestedBy).toBe(newRequestedBy);
  });

  it('should successfully update both notes and requestedBy for an order in PENDING status', async () => {
    const dto: UpdateOrderDto = { requestedBy: 'doctor-jane', notes: 'Follow up required.' };
    await service.updateOrder(mockOrderId, dto);

    expect(orderRepositoryMock.findById).toHaveBeenCalledWith(mockOrderId);
    // Check if the saved object reflects both changes
    const savedOrder = orderRepositoryMock.save.mock.calls[0][0];
    expect(savedOrder.requestedBy).toBe('doctor-jane');
    expect(savedOrder.notes).toBe('Follow up required.');
  });

  it('should throw BadRequestException if the order status is CANCELLED', async () => {
    const cancelledOrder = { ...baseOrder, status: OrderStatus.CANCELLED };
    orderRepositoryMock.findById = jest.fn().mockResolvedValue(cancelledOrder);
    const dto: UpdateOrderDto = { notes: 'Attempting update' };

    await expect(service.updateOrder(mockOrderId, dto)).rejects.toThrow(BadRequestException);
    await expect(service.updateOrder(mockOrderId, dto)).rejects.toThrow('Cannot update order with status CANCELLED');
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException if the order status is COMPLETED', async () => {
    const completedOrder = { ...baseOrder, status: OrderStatus.COMPLETED };
    orderRepositoryMock.findById = jest.fn().mockResolvedValue(completedOrder);
    const dto: UpdateOrderDto = { notes: 'Attempting update' };

    await expect(service.updateOrder(mockOrderId, dto)).rejects.toThrow(BadRequestException);
    await expect(service.updateOrder(mockOrderId, dto)).rejects.toThrow('Cannot update order with status COMPLETED');
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException if the order is IN_PROGRESS and requestedBy is updated', async () => {
    const inProgressOrder = { ...baseOrder, status: OrderStatus.IN_PROGRESS };
    orderRepositoryMock.findById = jest.fn().mockResolvedValue(inProgressOrder);
    const dto: UpdateOrderDto = { requestedBy: 'newUser' };

    await expect(service.updateOrder(mockOrderId, dto)).rejects.toThrow(BadRequestException);
    await expect(service.updateOrder(mockOrderId, dto)).rejects.toThrow('Cannot update requestedBy for an order in progress. Only notes can be updated');
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should allow updating only notes if the order is IN_PROGRESS', async () => {
    const inProgressOrder = { ...baseOrder, status: OrderStatus.IN_PROGRESS };
    orderRepositoryMock.findById = jest.fn().mockResolvedValue(inProgressOrder);
    const dto: UpdateOrderDto = { notes: 'Only notes allowed.' };

    await service.updateOrder(mockOrderId, dto);

    expect(orderRepositoryMock.save).toHaveBeenCalledTimes(1);
  });
});

  // TESTS_APPEND_HERE
});
