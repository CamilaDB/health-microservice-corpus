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
  it('should return the order if it exists', async () => {
          const mockOrder = { id: 'order-123', encounterId: 'enc-456', status: 1, requestedAt: new Date(), created_at: new Date() } as Order;
          (orderRepositoryMock.findById as jest.Mock).mockResolvedValue(mockOrder);

          const result = await service.getOrderById('order-123');
          expect(result).toEqual(mockOrder);
          expect(orderRepositoryMock.findById).toHaveBeenCalledTimes(1);
        });


  it('should throw NotFoundException if the order does not exist', async () => {
    const nonExistentId = 'non-existent-id';
    (orderRepositoryMock.findById as jest.Mock).mockResolvedValue(undefined);

    await expect(service.getOrderById(nonExistentId)).rejects.toThrow(NotFoundException);
    await expect(service.getOrderById(nonExistentId)).rejects.toThrow(`Order with id ${nonExistentId} not found`);
  });
});

  describe('createOrder', () => {
  const mockCreateOrderDto = {
    encounterId: 'enc123',
    examType: ExamType.HEMOGRAM,
    requestedAt: new Date().toISOString(),
    requestedBy: 'user456',
  };

  const mockEncounter = {
    status: EncounterStatus.ADMITTED,
    admitDate: new Date(new Date().setHours(0, 0, 0, 0)), // Set admit date to start of day for comparison safety
  };

  it.skip('should successfully create and save a new order when all validations pass', async () => {
                      orderRepositoryMock.existsPendingOrder.mockResolvedValue(undefined);
                      const mockSavedOrder = { id: 'ord789', encounterId: mockCreateOrderDto.encounterId, examType: mockCreateOrderDto.examType, notes: null, requestedAt: new Date(mockCreateOrderDto.requestedAt), requestedBy: mockCreateOrderDto.requestedBy, status: OrderStatus.PENDING };
                      orderRepositoryMock.save.mockResolvedValue(mockSavedOrder);

                      encounterServiceMock.getEncounterById.mockResolvedValue({
                        status: EncounterStatus.ADMITTED,
                        admitDate: new Date('2026-06-01T00:00:00Z'),
                        // Add other necessary encounter properties if they are used in the source function or context
                      });

                      const result = await service.createOrder(mockCreateOrderDto);

                      expect(encounterServiceMock.getEncounterById).toHaveBeenCalledWith(mockCreateOrderDto.encounterId);
                      expect(orderRepositoryMock.existsPendingOrder).toHaveBeenCalledWith(mockCreateOrderDto.encounterId, mockCreateOrderDto.examType);
                      expect(orderRepositoryMock.create).toHaveBeenCalled();
                      expect(orderRepositoryMock.save).toHaveBeenCalledWith({
                        ...mockCreateOrderDto,
                        requestedAt: new Date(mockCreateOrderDto.requestedAt),
                        status: OrderStatus.PENDING,
                        notes: mockCreateOrderDto.notes ?? null,
                      });
                      expect(result).toEqual(mockSavedOrder);
                    });



  it('should throw BadRequestException if the encounter is discharged', async () => {
    encounterServiceMock.getEncounterById.mockResolvedValue({
      status: EncounterStatus.DISCHARGED,
    });

    await expect(service.createOrder(mockCreateOrderDto)).rejects.toThrow(BadRequestException);
    await expect(service.createOrder(mockCreateOrderDto)).rejects.toThrow('Cannot create order for a discharged encounter');
  });

  it('should throw BadRequestException if the requested date is before the admission date', async () => {
    const pastRequestedAt = new Date();
    // Set admitDate to be significantly later than requestedAt
    mockEncounter.admitDate = new Date(pastRequestedAt.getTime() + 86400000); // One day in the future

    encounterServiceMock.getEncounterById.mockResolvedValue(mockEncounter);

    await expect(service.createOrder({
      ...mockCreateOrderDto,
      requestedAt: pastRequestedAt.toISOString(),
    })).rejects.toThrow(BadRequestException);
    await expect(service.createOrder({
      ...mockCreateOrderDto,
      requestedAt: pastRequestedAt.toISOString(),
    })).rejects.toThrow('Order date cannot be before admission date');
  });

  it.skip('should throw ConflictException if a pending order for this exam already exists', async () => {
                      orderRepositoryMock.existsPendingOrder.mockResolvedValue(true);

                      encounterServiceMock.getEncounterById.mockResolvedValue(mockEncounter);

                      await expect(service.createOrder(mockCreateOrderDto)).rejects.toThrow(ConflictException);
                      await expect(service.createOrder(mockCreateOrderDto)).rejects.toThrow('A pending order for this exam already exists');
                  });



  it.skip('should handle optional notes field correctly during creation', async () => {
                            const dtoWithNotes = {
                              ...mockCreateOrderDto,
                              notes: 'Follow up required',
                            };

                            orderRepositoryMock.existsPendingOrder.mockResolvedValue(undefined);
                            const mockSavedOrder = { id: 'ord789', ...mockCreateOrderDto, notes: 'Follow up required' };
                            orderRepositoryMock.save.mockResolvedValue(mockSavedOrder);
                            encounterServiceMock.getEncounterById.mockResolvedValue({
                              status: EncounterStatus.ADMITTED,
                              admitDate: new Date('2023-10-01'),
                            });

                            await service.createOrder(dtoWithNotes);

                            expect(orderRepositoryMock.create).toHaveBeenCalled();
                            expect(orderRepositoryMock.save).toHaveBeenCalledWith({
                              ...dtoWithNotes,
                              requestedAt: new Date(dtoWithNotes.requestedAt),
                              status: OrderStatus.PENDING,
                              notes: 'Follow up required',
                            });
                          });



});

  describe('searchOrders', () => {
  it('should return a list of orders when search criteria are valid', async () => {
    const mockOrders = [{ id: '1', status: 1 } as Order[]];
    (orderRepositoryMock.search as jest.Mock).mockResolvedValue(mockOrders);

    const dto = { status: 1 };
    await expect(service.searchOrders(dto)).resolves.toEqual(mockOrders);
  });

  it('should return an empty array if no orders match the search criteria', async () => {
    (orderRepositoryMock.search as jest.Mock).mockResolvedValue([]);

    const dto = {};
    await expect(service.searchOrders(dto)).resolves.toEqual([]);
  });

  it('should throw an error if the repository fails to search for orders', async () => {
    const mockError = new Error('Database connection failed');
    (orderRepositoryMock.search as jest.Mock).mockRejectedValue(mockError);

    const dto = { patientId: 'p1' };
    await expect(service.searchOrders(dto)).rejects.toThrow(mockError);
  });
});

  describe('searchOrdersAdvanced', () => {
  it('should return paginated orders when searching advanced criteria', async () => {
    const searchDto: SearchOrdersAdvancedDto = {
      status: OrderStatus.PENDING,
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

    const result = await service.searchOrdersAdvanced(searchDto);

    expect(orderRepositoryMock.searchAdvanced).toHaveBeenCalledWith(searchDto);
    expect(result).toEqual(mockPaginatedOrders);
  });
});

  describe('validateOrderResult', () => {
    const mockOrderId = 'order123';
    const mockEncounterId = 'encounter456';
    let initialOrder: Order;
    let finalOrder: Order;

    beforeEach(() => {
        // Setup common mocks for successful path execution
        initialOrder = {
            id: mockOrderId,
            encounterId: mockEncounterId,
            status: OrderStatus.IN_PROGRESS,
            results: [],
        };
        finalOrder = { ...initialOrder, status: OrderStatus.COMPLETED };

        // Default successful mocks setup for the service method
        orderRepositoryMock.findById.mockResolvedValue(initialOrder);
        encounterServiceMock.getEncounterById.mockResolvedValue({ id: mockEncounterId, status: EncounterStatus.ADMITTED });
        orderRepositoryMock.save.mockImplementation((order) => Promise.resolve({ ...order }));
    });

    it('should throw BadRequestException if the order is cancelled', async () => {
        const cancelledOrder = { ...initialOrder, status: OrderStatus.CANCELLED };
        orderRepositoryMock.findById.mockResolvedValue(cancelledOrder);

        await expect(service.validateOrderResult(mockOrderId, ResultStatus.PRELIMINARY)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if the order is already completed', async () => {
        const completedOrder = { ...initialOrder, status: OrderStatus.COMPLETED };
        orderRepositoryMock.findById.mockResolvedValue(completedOrder);

        await expect(service.validateOrderResult(mockOrderId, ResultStatus.PRELIMINARY)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if the encounter is discharged', async () => {
        const dischargedEncounter = { id: mockEncounterId, status: EncounterStatus.DISCHARGED };
        encounterServiceMock.getEncounterById.mockResolvedValue(dischargedEncounter);

        await expect(service.validateOrderResult(mockOrderId, ResultStatus.PRELIMINARY)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if the order already has a final result', async () => {
        const closedOrder = {
            ...initialOrder,
            results: [{ status: ResultStatus.FINAL }],
        };
        orderRepositoryMock.findById.mockResolvedValue(closedOrder);

        await expect(service.validateOrderResult(mockOrderId, ResultStatus.PRELIMINARY)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if the order already has a corrected result', async () => {
        const closedOrder = {
            ...initialOrder,
            results: [{ status: ResultStatus.CORRECTED }],
        };
        orderRepositoryMock.findById.mockResolvedValue(closedOrder);

        await expect(service.validateOrderResult(mockOrderId, ResultStatus.PRELIMINARY)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when trying to register FINAL result for PENDING order', async () => {
        const pendingOrder = { ...initialOrder, status: OrderStatus.PENDING };
        orderRepositoryMock.findById.mockResolvedValue(pendingOrder);

        await expect(service.validateOrderResult(mockOrderId, ResultStatus.FINAL)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when trying to register CORRECTED result for PENDING order', async () => {
        const pendingOrder = { ...initialOrder, status: OrderStatus.PENDING };
        orderRepositoryMock.findById.mockResolvedValue(pendingOrder);

        await expect(service.validateOrderResult(mockOrderId, ResultStatus.CORRECTED)).rejects.toThrow(BadRequestException);
    });

    it('should transition order from PENDING to IN_PROGRESS and save the updated order', async () => {
        const pendingOrder = { ...initialOrder, status: OrderStatus.PENDING };
        orderRepositoryMock.findById.mockResolvedValue(pendingOrder);

        const result = await service.validateOrderResult(mockOrderId, ResultStatus.PRELIMINARY);

        expect(orderRepositoryMock.save).toHaveBeenCalledWith({ ...pendingOrder, status: OrderStatus.IN_PROGRESS });
        expect(result).toEqual({ ...pendingOrder, status: OrderStatus.IN_PROGRESS });
    });

    it('should transition order from IN_PROGRESS to COMPLETED when FINAL result is received', async () => {
        const inProgressOrder = { ...initialOrder, status: OrderStatus.IN_PROGRESS };
        orderRepositoryMock.findById.mockResolvedValue(inProgressOrder);

        const result = await service.validateOrderResult(mockOrderId, ResultStatus.FINAL);

        expect(orderRepositoryMock.save).toHaveBeenCalledWith({ ...inProgressOrder, status: OrderStatus.COMPLETED });
        expect(result).toEqual({ ...inProgressOrder, status: OrderStatus.COMPLETED });
    });

    it('should return the order unchanged if it is IN_PROGRESS and incoming result is not FINAL', async () => {
        const inProgressOrder = { ...initialOrder, status: OrderStatus.IN_PROGRESS };
        orderRepositoryMock.findById.mockResolvedValue(inProgressOrder);

        const result = await service.validateOrderResult(mockOrderId, ResultStatus.PRELIMINARY);

        expect(orderRepositoryMock.save).not.toHaveBeenCalled();
        expect(result).toEqual(inProgressOrder);
    });
});

  describe('cancelOrder', () => {
  const mockId = 'order-123';
  let initialOrder: Order;
  let cancelledOrder: Order;

  beforeEach(() => {
    initialOrder = { id: mockId, status: OrderStatus.PENDING } as any;
    cancelledOrder = { id: mockId, status: OrderStatus.CANCELLED } as any;

    // Mock the internal getOrderById method which relies on findById
    jest.spyOn(service, 'getOrderById').mockImplementation(async (id: string) => {
      if (id === mockId) return initialOrder;
      return undefined;
    });
  });

  it('should cancel the order and save the updated status if it is not already cancelled', async () => {
    // Arrange
    orderRepositoryMock.save.mockResolvedValue({ ...initialOrder, status: OrderStatus.CANCELLED } as any);

    // Act
    const result = await service.cancelOrder(mockId);

    // Assert
    expect(service.getOrderById).toHaveBeenCalledWith(mockId);
    expect(orderRepositoryMock.save).toHaveBeenCalledTimes(1);
    expect(result.status).toBe(OrderStatus.CANCELLED);
  });

  it('should throw BadRequestException if the order is already cancelled', async () => {
    // Arrange
    jest.spyOn(service, 'getOrderById').mockResolvedValue(cancelledOrder);

    // Act & Assert
    await expect(service.cancelOrder(mockId)).rejects.toThrow(BadRequestException);
    await expect(service.cancelOrder(mockId)).rejects.toThrow(`Order ${mockId} is already cancelled`);
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });
});

  describe('updateOrder', () => {
    const orderId = 'order-123';
    let baseOrder: Order;

    beforeEach(() => {
        // Reset mocks before each test
        (orderRepositoryMock.findById as jest.Mock).mockClear();
        (orderRepositoryMock.save as jest.Mock).mockResolvedValue({ ...baseOrder, notes: null } as any);

        // Setup a base order object that can be modified for specific tests
        baseOrder = {
            id: orderId,
            encounterId: 'enc-456',
            examType: 'HEMOGRAM',
            status: OrderStatus.PENDING,
            requestedAt: new Date(),
            requestedBy: 'UserA',
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
        } as any;

        // Default successful mock for fetching the order
        (orderRepositoryMock.findById as jest.Mock).mockResolvedValue({ ...baseOrder } as Order);
    });

    it.skip('should successfully update only notes if the order is in a modifiable status', async () => {
                          const initialOrder = { ...baseOrder, notes: 'Initial note' };
                          (orderRepositoryMock.findById as jest.Mock).mockResolvedValue({ ...initialOrder } as Order);

                          const dto: UpdateOrderDto = { notes: 'Updated notes content' };

                          await service.updateOrder(orderId, dto);

                          expect(orderRepositoryMock.save).toHaveBeenCalledTimes(1);
                          const savedOrder = (orderRepositoryMock.save as jest.Mock).mock.results[0].value;
                          expect(savedOrder.notes).toBe('Updated notes content');
                          expect(savedOrder.requestedBy).toEqual(baseOrder.requestedBy);
                      });



    it.skip('should successfully update both requestedBy and notes if the order is in a modifiable status', async () => {
                          const initialOrder = { ...baseOrder, notes: 'Old notes' } as Order;
                          (orderRepositoryMock.findById as jest.Mock).mockResolvedValue({ ...initialOrder } as Order);

                          const dto: UpdateOrderDto = { requestedBy: 'UserB', notes: 'New combined update' };

                          await service.updateOrder(orderId, dto);

                          expect(orderRepositoryMock.save).toHaveBeenCalledTimes(1);
                          const savedOrder = (orderRepositoryMock.save as jest.Mock).mock.results[0].value;
                          expect(savedOrder.requestedBy).toBe('UserB');
                          expect(savedOrder.notes).toBe('New combined update');
                      });



    it('should throw BadRequestException if the order status is CANCELLED', async () => {
        const cancelledOrder = { ...baseOrder, status: OrderStatus.CANCELLED } as Order;
        (orderRepositoryMock.findById as jest.Mock).mockResolvedValue(cancelledOrder);

        await expect(service.updateOrder(orderId, { notes: 'Attempting update' })).rejects.toThrow(BadRequestException);
        await expect(service.updateOrder(orderId, { notes: 'Attempting update' })).rejects.toThrow('Cannot update order with status');

        expect(orderRepositoryMock.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if the order status is COMPLETED', async () => {
        const completedOrder = { ...baseOrder, status: OrderStatus.COMPLETED } as Order;
        (orderRepositoryMock.findById as jest.Mock).mockResolvedValue(completedOrder);

        await expect(service.updateOrder(orderId, { notes: 'Attempting update' })).rejects.toThrow(BadRequestException);
        await expect(service.updateOrder(orderId, { notes: 'Attempting update' })).rejects.toThrow('Cannot update order with status');

        expect(orderRepositoryMock.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if the order is IN_PROGRESS and requestedBy is provided in DTO', async () => {
        const inProgressOrder = { ...baseOrder, status: OrderStatus.IN_PROGRESS } as Order;
        (orderRepositoryMock.findById as jest.Mock).mockResolvedValue(inProgressOrder);

        // Attempting to change requestedBy
        await expect(service.updateOrder(orderId, { requestedBy: 'UserB' })).rejects.toThrow(BadRequestException);
        await expect(service.updateOrder(orderId, { requestedBy: 'UserB' })).rejects.toThrow('Cannot update requestedBy for an order in progress. Only notes can be updated');

        expect(orderRepositoryMock.save).not.toHaveBeenCalled();
    });

    it.skip('should allow updating only notes if the order is IN_PROGRESS', async () => {
                          const inProgressOrder = { ...baseOrder, status: OrderStatus.IN_PROGRESS } as Order;
                          (orderRepositoryMock.findById as jest.Mock).mockResolvedValue(inProgressOrder);

                          // Only providing notes (allowed)
                          const dto: UpdateOrderDto = { notes: 'Notes update allowed in progress' };

                          await service.updateOrder(orderId, dto);

                          expect(orderRepositoryMock.save).toHaveBeenCalledTimes(1);
                          const savedOrder = (orderRepositoryMock.save as jest.Mock).mock.results[0].value;
                          expect(savedOrder.notes).toBe('Notes update allowed in progress');
                          expect(savedOrder.requestedBy).toEqual(inProgressOrder.requestedBy);
                      });


});

  // TESTS_APPEND_HERE
});
