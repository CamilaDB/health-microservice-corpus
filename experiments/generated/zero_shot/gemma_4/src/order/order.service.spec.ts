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
it('should return the order if found', async () => {
  const mockOrder = {
    id: '123',
    encounterId: 'enc1',
    examType: 'HEMOGRAM',
    status: 'PENDING',
    requestedAt: new Date(),
    requestedBy: 'user1',
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

it('should throw NotFoundException if the order is not found', async () => {
  orderRepositoryMock.findById.mockResolvedValue(undefined);

  await expect(service.getOrderById('456')).rejects.toThrow(NotFoundException);
  await expect(service.getOrderById('456')).rejects.toThrow('Order with id 456 not found');
  expect(orderRepositoryMock.findById).toHaveBeenCalledWith('456');
});
})
});

  describe('FN_createOrder_END', () => {
describe('createOrder', () => {
	it.skip('should be able to create an order successfully', async () => {
    		const dto = {
    			encounterId: 'enc123',
    			examType: ExamType.HEMOGRAM,
    			requestedAt: '2023-01-01T10:00:00Z',
    			requestedBy: 'patientA',
    			notes: 'Test notes',
    		};
    		const encounter = {
    			status: EncounterStatus.ADMITTED,
    			admitDate: '2023-01-01T12:00:00Z',
    		};

    		encounterServiceMock.getEncounterById.mockResolvedValue(encounter);
    		orderRepositoryMock.existsPendingOrder.mockResolvedValue(false);
    		orderRepositoryMock.create.mockResolvedValue({
    			id: 'order456',
    			encounterId: 'enc123',
    			examType: ExamType.HEMOGRAM,
    			status: OrderStatus.PENDING,
    			requestedAt: new Date('2023-01-01T10:00:00Z'),
    			requestedBy: 'patientA',
    			notes: 'Test notes',
    			created_at: new Date(),
    			updated_at: new Date(),
    		});
    		orderRepositoryMock.save.mockResolvedValue({
    			id: 'order456',
    			encounterId: 'enc123',
    			examType: ExamType.HEMOGRAM,
    			status: OrderStatus.PENDING,
    			requestedAt: new Date('2023-01-01T10:00:00Z'),
    			requestedBy: 'patientA',
    			notes: 'Test notes',
    			created_at: new Date(),
    			updated_at: new Date(),
    		});

    		const result = await createOrder(dto);

    		expect(encounterServiceMock.getEncounterById).toHaveBeenCalledWith(dto.encounterId);
    		expect(orderRepositoryMock.existsPendingOrder).toHaveBeenCalledWith(dto.encounterId, dto.examType);
    		expect(orderRepositoryMock.create).toHaveBeenCalledWith({
    			...dto,
    			requestedAt: new Date(dto.requestedAt),
    			status: OrderStatus.PENDING,
    			notes: 'Test notes',
    		});
    		expect(orderRepositoryMock.save).toHaveBeenCalledWith(result);
    	});

	it.skip('should throw BadRequestException if the encounter is discharged', async () => {
    		const dto = {
    			encounterId: 'enc123',
    			examType: ExamType.HEMOGRAM,
    			requestedAt: '2023-01-01T10:00:00Z',
    			requestedBy: 'patientA',
    		};

    		const encounter = {
    			status: EncounterStatus.DISCHARGED,
    			admitDate: '2023-01-01T12:00:00Z',
    		};

    		encounterServiceMock.getEncounterById.mockResolvedValue(encounter);

    		await expect(createOrder(dto)).rejects.toThrow(BadRequestException);
    		await expect(createOrder(dto)).rejects.toThrow('Cannot create order for a discharged encounter');
    		expect(orderRepositoryMock.existsPendingOrder).not.toHaveBeenCalled();
    	});

	it.skip('should throw BadRequestException if requested date is before admission date', async () => {
    		const dto = {
    			encounterId: 'enc123',
    			examType: ExamType.GLUCOSE,
    			requestedAt: '2022-12-31T10:00:00Z',
    			requestedBy: 'patientA',
    		};

    		const encounter = {
    			status: EncounterStatus.ADMITTED,
    			admitDate: '2023-01-01T12:00:00Z',
    		};

    		encounterServiceMock.getEncounterById.mockResolvedValue(encounter);
    		orderRepositoryMock.existsPendingOrder.mockResolvedValue(false);

    		await expect(createOrder(dto)).rejects.toThrow(BadRequestException);
    		await expect(createOrder(dto)).rejects.toThrow('Order date cannot be before admission date');
    		expect(orderRepositoryMock.existsPendingOrder).not.toHaveBeenCalled();
    	});

	it.skip('should throw ConflictException if a pending order already exists', async () => {
    		const dto = {
    			encounterId: 'enc123',
    			examType: ExamType.CREATININE,
    			requestedAt: '2023-01-01T10:00:00Z',
    			requestedBy: 'patientA',
    		};

    		const encounter = {
    			status: EncounterStatus.ADMITTED,
    			admitDate: '2023-01-01T12:00:00Z',
    		};

    		encounterServiceMock.getEncounterById.mockResolvedValue(encounter);
    		orderRepositoryMock.existsPendingOrder.mockResolvedValue(true);

    		await expect(createOrder(dto)).rejects.toThrow(ConflictException);
    		await expect(createOrder(dto)).rejects.toThrow('A pending order for this exam already exists');
    		expect(orderRepositoryMock.create).not.toHaveBeenCalled();
    	});
});
});

  describe('FN_searchOrders_END', () => {
describe('searchOrders', () => {
    it.skip('should return orders found by the repository search method', async () => {
            const mockOrders = [
                { id: 'order1', encounterId: 'enc1', examType: ExamType.HEMOGRAM, status: OrderStatus.COMPLETED, requestedAt: new Date(), requestedBy: 'patientA', notes: null, created_at: new Date(), updated_at: new Date(), encounter: {}, results: [] },
                { id: 'order2', encounterId: 'enc2', examType: ExamType.GLUCOSE, status: OrderStatus.PENDING, requestedAt: new Date(), requestedBy: 'patientB', notes: 'Need follow up', created_at: new Date(), updated_at: new Date(), encounter: {}, results: [] },
            ];

            orderRepositoryMock.search.mockResolvedValue(mockOrders);

            const searchDto = {
                status: OrderStatus.COMPLETED,
                patientId: 'patient123',
            };

            const result = await searchOrders(searchDto);

            expect(orderRepositoryMock.search).toHaveBeenCalledWith(searchDto);
            expect(result).toEqual(mockOrders);
        });
});
});

  describe('FN_searchOrdersAdvanced_END', () => {
describe('searchOrdersAdvanced', () => {
it('should return the paginated orders from the repository', async () => {
    const mockSearchOrdersAdvancedDto = {
        status: 'COMPLETED',
        examType: 'HEMOGRAM',
        page: 1,
        limit: 10,
    };

    const mockPaginatedOrders: PaginatedOrders = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    };

    orderRepositoryMock.searchAdvanced.mockResolvedValue(mockPaginatedOrders);

    const result = await service.searchOrdersAdvanced(mockSearchOrdersAdvancedDto);

    expect(orderRepositoryMock.searchAdvanced).toHaveBeenCalledWith(mockSearchOrdersAdvancedDto);
    expect(result).toEqual(mockPaginatedOrders);
});
})
});

  describe('FN_cancelOrder_END', () => {
describe('cancelOrder', () => {
it('should successfully cancel an order if it is not already cancelled', async () => {
  const orderId = 'order123';
  const existingOrder = {
    id: orderId,
    status: OrderStatus.PENDING,
    // other fields...
  };

  orderRepositoryMock.findById.mockResolvedValue(existingOrder);
  orderRepositoryMock.save.mockResolvedValue(existingOrder);

  const result = await service.cancelOrder(orderId);

  expect(orderRepositoryMock.findById).toHaveBeenCalledWith(orderId);
  expect(orderRepositoryMock.save).toHaveBeenCalledWith(existingOrder);
  expect(result).toEqual(existingOrder);
});

it('should throw BadRequestException if the order is already cancelled', async () => {
  const orderId = 'order456';
  const cancelledOrder = {
    id: orderId,
    status: OrderStatus.CANCELLED,
    // other fields...
  };

  orderRepositoryMock.findById.mockResolvedValue(cancelledOrder);

  await expect(service.cancelOrder(orderId)).rejects.toThrow(`Order ${orderId} is already cancelled`);
  expect(orderRepositoryMock.save).not.toHaveBeenCalled();
});
})
});

  describe('FN_updateOrder_END', () => {
describe('updateOrder', () => {
	it('should successfully update notes for an order if status is valid', async () => {
		const orderId = 'order123';
		const dto = { notes: 'New notes' };
		const order = {
			id: orderId,
			status: OrderStatus.PENDING,
			notes: 'Old notes',
		};
		orderRepositoryMock.findById.mockResolvedValue(order);
		orderRepositoryMock.save.mockResolvedValue(order);

		const result = await service.updateOrder(orderId, dto);

		expect(orderRepositoryMock.findById).toHaveBeenCalledWith(orderId);
		expect(orderRepositoryMock.save).toHaveBeenCalledWith(expect.objectContaining({
			id: orderId,
			notes: 'New notes',
		}));
		expect(result).toEqual(order);
	});

	it('should successfully update requestedBy for an order if status is valid', async () => {
		const orderId = 'order123';
		const dto = { requestedBy: 'new_user' };
		const order = {
			id: orderId,
			status: OrderStatus.PENDING,
			requestedBy: 'old_user',
		};
		orderRepositoryMock.findById.mockResolvedValue(order);
		orderRepositoryMock.save.mockResolvedValue(order);

		const result = await service.updateOrder(orderId, dto);

		expect(orderRepositoryMock.findById).toHaveBeenCalledWith(orderId);
		expect(orderRepositoryMock.save).toHaveBeenCalledWith(expect.objectContaining({
			id: orderId,
			requestedBy: 'new_user',
		}));
		expect(result).toEqual(order);
	});

	it('should update both requestedBy and notes if provided', async () => {
		const orderId = 'order123';
		const dto = { requestedBy: 'new_user', notes: 'Updated notes' };
		const order = {
			id: orderId,
			status: OrderStatus.PENDING,
			requestedBy: 'old_user',
			notes: 'Old notes',
		};
		orderRepositoryMock.findById.mockResolvedValue(order);
		orderRepositoryMock.save.mockResolvedValue(order);

		const result = await service.updateOrder(orderId, dto);

		expect(orderRepositoryMock.save).toHaveBeenCalledWith(expect.objectContaining({
			id: orderId,
			requestedBy: 'new_user',
			notes: 'Updated notes',
		}));
		expect(result).toEqual(order);
	});

	it('should throw BadRequestException if the order status is CANCELLED', async () => {
		const orderId = 'order123';
		const dto = { notes: 'Some notes' };
		const order = {
			id: orderId,
			status: OrderStatus.CANCELLED,
		};
		orderRepositoryMock.findById.mockResolvedValue(order);

		await expect(service.updateOrder(orderId, dto)).rejects.toThrow(BadRequestException);
		await expect(service.updateOrder(orderId, dto)).rejects.toThrow(
			`Cannot update order with status CANCELLED`
		);
		expect(orderRepositoryMock.save).not.toHaveBeenCalled();
	});

	it('should throw BadRequestException if the order status is COMPLETED', async () => {
		const orderId = 'order123';
		const dto = { notes: 'Some notes' };
		const order = {
			id: orderId,
			status: OrderStatus.COMPLETED,
		};
		orderRepositoryMock.findById.mockResolvedValue(order);

		await expect(service.updateOrder(orderId, dto)).rejects.toThrow(BadRequestException);
		await expect(service.updateOrder(orderId, dto)).rejects.toThrow(
			`Cannot update order with status COMPLETED`
		);
		expect(orderRepositoryMock.save).not.toHaveBeenCalled();
	});

	it('should throw BadRequestException if the order is IN_PROGRESS and requestedBy is provided', async () => {
		const orderId = 'order123';
		const dto = { requestedBy: 'new_user' };
		const order = {
			id: orderId,
			status: OrderStatus.IN_PROGRESS,
		};
		orderRepositoryMock.findById.mockResolvedValue(order);

		await expect(service.updateOrder(orderId, dto)).rejects.toThrow(BadRequestException);
		await expect(service.updateOrder(orderId, dto)).rejects.toThrow(
			'Cannot update requestedBy for an order in progress. Only notes can be updated'
		);
		expect(orderRepositoryMock.save).not.toHaveBeenCalled();
	});

	it('should successfully update notes for an IN_PROGRESS order', async () => {
		const orderId = 'order123';
		const dto = { notes: 'Updated notes for in progress' };
		const order = {
			id: orderId,
			status: OrderStatus.IN_PROGRESS,
			notes: 'Old notes',
		};
		orderRepositoryMock.findById.mockResolvedValue(order);
		orderRepositoryMock.save.mockResolvedValue(order);

		const result = await service.updateOrder(orderId, dto);

		expect(orderRepositoryMock.save).toHaveBeenCalledWith(expect.objectContaining({
			id: orderId,
			notes: 'Updated notes for in progress',
		}));
		expect(result).toEqual(order);
	});
});
});

  // TESTS_APPEND_HERE
});
