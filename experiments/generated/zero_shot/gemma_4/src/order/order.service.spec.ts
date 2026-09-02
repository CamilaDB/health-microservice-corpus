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
it.skip('should return the order if found', async () => {
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

      const result = await this.getOrderById('123');

      expect(result).toEqual(mockOrder);
      expect(orderRepositoryMock.findById).toHaveBeenCalledWith('123');
    });

it.skip('should throw NotFoundException if the order is not found', async () => {
      orderRepositoryMock.findById.mockResolvedValue(undefined);

      await expect(this.getOrderById('456')).rejects.toThrow(NotFoundException);
      await expect(this.getOrderById('456')).rejects.toThrow('Order with id 456 not found');
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
    			admitDate: '2023-01-05T00:00:00Z',
    		};

    		encounterServiceMock.getEncounterById.mockResolvedValue(encounter);
    		orderRepositoryMock.existsPendingOrder.mockResolvedValue(false);
    		orderRepositoryMock.create.mockResolvedValue({ id: 'order456', ...dto });
    		orderRepositoryMock.save.mockResolvedValue({ id: 'order456', ...dto });

    		const result = await service.createOrder(dto);

    		expect(encounterServiceMock.getEncounterById).toHaveBeenCalledWith('enc123');
    		expect(orderRepositoryMock.existsPendingOrder).toHaveBeenCalledWith('enc123', ExamType.HEMOGRAM);
    		expect(orderRepositoryMock.create).toHaveBeenCalledWith({
    			...dto,
    			requestedAt: new Date(dto.requestedAt),
    			status: OrderStatus.PENDING,
    			notes: 'Test notes',
    		});
    		expect(orderRepositoryMock.save).toHaveBeenCalledTimes(1);
    		expect(result).toEqual({ id: 'order456', ...dto, status: OrderStatus.PENDING });
    	});

	it('should throw BadRequestException if the encounter is discharged', async () => {
		const dto = {
			encounterId: 'enc123',
			examType: ExamType.GLUCOSE,
			requestedAt: '2023-01-01T10:00:00Z',
			requestedBy: 'patientA',
		};
		const dischargedEncounter = {
			status: EncounterStatus.DISCHARGED,
			admitDate: '2023-01-05T00:00:00Z',
		};

		encounterServiceMock.getEncounterById.mockResolvedValue(dischargedEncounter);

		await expect(service.createOrder(dto)).rejects.toThrow(BadRequestException);
		await expect(service.createOrder(dto)).rejects.toThrow('Cannot create order for a discharged encounter');
		expect(orderRepositoryMock.existsPendingOrder).not.toHaveBeenCalled();
	});

	it('should throw BadRequestException if requestedAt is before admitDate', async () => {
    		const dto = {
    			encounterId: 'enc123',
    			examType: ExamType.CREATININE,
    			requestedAt: '2022-12-31T23:59:59Z',
    			requestedBy: 'patientA',
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
    			examType: ExamType.TSH,
    			requestedAt: '2023-01-06T10:00:00Z',
    			requestedBy: 'patientA',
    		};

    		encounterServiceMock.getEncounterById.mockResolvedValue({
    			status: EncounterStatus.ADMITTED,
    			admitDate: '2023-01-05T00:00:00Z',
    		});
    		orderRepositoryMock.existsPendingOrder.mockResolvedValue(true);

    		await expect(service.createOrder(dto)).rejects.toThrow(ConflictException);
    		await expect(service.createOrder(dto)).rejects.toThrow('A pending order for this exam already exists');
    		expect(orderRepositoryMock.create).not.toHaveBeenCalled();
    	});

});
});

  describe('FN_searchOrders_END', () => {
describe('searchOrders', () => {
it('should return the orders found by the repository based on the search criteria', async () => {
  const mockSearchOrdersDto = {
    status: 'PENDING',
    patientId: 'patient123',
    encounterId: 'enc456',
  };
  const mockOrders = [
    { id: 'order1', encounterId: 'enc456', status: 'PENDING', requestedAt: new Date(), requestedBy: 'userA', notes: null, created_at: new Date(), updated_at: new Date(), encounter: {}, results: [] },
  ];

  orderRepositoryMock.search.mockResolvedValue(mockOrders);

  const result = await service.searchOrders(mockSearchOrdersDto);

  expect(orderRepositoryMock.search).toHaveBeenCalledWith(mockSearchOrdersDto);
  expect(result).toEqual(mockOrders);
});
})
});

  describe('FN_searchOrdersAdvanced_END', () => {
describe('searchOrdersAdvanced', () => {
    it('should return paginated orders from the repository', async () => {
        const mockSearchOrdersAdvancedDto = {
            status: 'COMPLETED',
            examType: 'HEMOGRAM',
            page: 1,
            limit: 10,
        };

        const mockPaginatedOrders = {
            data: [
                { id: 'order1', status: 'COMPLETED' },
                { id: 'order2', status: 'COMPLETED' },
            ],
            total: 2,
            page: 1,
            limit: 10,
            totalPages: 1,
        };

        orderRepositoryMock.searchAdvanced.mockResolvedValue(mockPaginatedOrders);

        const result = await service.searchOrdersAdvanced(mockSearchOrdersAdvancedDto);

        expect(orderRepositoryMock.searchAdvanced).toHaveBeenCalledWith(mockSearchOrdersAdvancedDto);
        expect(result).toEqual(mockPaginatedOrders);
    });
});
});

  describe('FN_validateOrderResult_END', () => {
describe('validateOrderResult', () => {
	it('should throw BadRequestException if the order is cancelled', async () => {
		const orderId = 'order123';
		orderRepositoryMock.findById.mockResolvedValue({
			id: orderId,
			encounterId: 'enc456',
			status: OrderStatus.CANCELLED,
			results: [],
		});

		await expect(
			service.validateOrderResult(orderId, ResultStatus.FINAL)
		).rejects.toThrow(BadRequestException);
		await expect(
			service.validateOrderResult(orderId, ResultStatus.FINAL)
		).rejects.toThrow(`Cannot add result to a cancelled order (id: ${orderId})`);
	});

	it('should throw BadRequestException if the encounter is discharged', async () => {
		const orderId = 'order123';
		orderRepositoryMock.findById.mockResolvedValue({
			id: orderId,
			encounterId: 'enc456',
			status: OrderStatus.PENDING,
			results: [],
		});
		encounterServiceMock.getEncounterById.mockResolvedValue({
			status: EncounterStatus.DISCHARGED,
		});

		await expect(
			service.validateOrderResult(orderId, ResultStatus.FINAL)
		).rejects.toThrow(BadRequestException);
		await expect(
			service.validateOrderResult(orderId, ResultStatus.FINAL)
		).rejects.toThrow(`Cannot add result to an order from a discharged encounter (id: enc456)`);
	});

	it.skip('should throw BadRequestException if trying to register a CORRECTED result when order is not COMPLETED', async () => {
    		const orderId = 'order123';
    		orderRepositoryMock.findById.mockResolvedValue({
    			id: orderId,
    			encounterId: 'enc456',
    			status: OrderStatus.PENDING,
    			results: [{ status: ResultStatus.PRELIMINARY }],
    		});

    		await expect(
    			service.validateOrderResult(orderId, ResultStatus.CORRECTED)
    		).rejects.toThrow(BadRequestException);
    		await expect(
    			service.validateOrderResult(orderId, ResultStatus.CORRECTED)
    		).rejects.toThrow('Cannot register a CORRECTED result until the order is COMPLETED');
    	});

	it('should throw BadRequestException if order is already COMPLETED and trying to add another result', async () => {
    		const orderId = 'order123';
    		orderRepositoryMock.findById.mockResolvedValue({
    			id: orderId,
    			encounterId: 'enc456',
    			status: OrderStatus.COMPLETED,
    			results: [{ status: ResultStatus.FINAL }],
    		});

    		// Mock the encounter service to prevent TypeError when accessing encounter.status
    		encounterServiceMock.getEncounterById.mockResolvedValue({
    			status: EncounterStatus.ADMITTED,
    		});

    		await expect(
    			service.validateOrderResult(orderId, ResultStatus.FINAL)
    		).rejects.toThrow(BadRequestException);
    		await expect(
    			service.validateOrderResult(orderId, ResultStatus.FINAL)
    		).rejects.toThrow('Order already completed (id: order123). Cannot add another result');
    	});


	it.skip('should throw BadRequestException if order already has a final result', async () => {
    		const orderId = 'order123';
    		orderRepositoryMock.findById.mockResolvedValue({
    			id: orderId,
    			encounterId: 'enc456',
    			status: OrderStatus.IN_PROGRESS,
    			results: [{ status: ResultStatus.FINAL }],
    		});

    		await expect(
    			service.validateOrderResult(orderId, ResultStatus.FINAL)
    		).rejects.toThrow(BadRequestException);
    		await expect(
    			service.validateOrderResult(orderId, ResultStatus.FINAL)
    		).rejects.toThrow('Order (id: order123) already has a final or corrected result');
    	});

	it('should throw BadRequestException if order is PENDING and trying to register a FINAL result', async () => {
    		const orderId = 'order123';
    		orderRepositoryMock.findById.mockResolvedValue({
    			id: orderId,
    			encounterId: 'enc456',
    			status: OrderStatus.PENDING,
    			results: [],
    		});

    		encounterServiceMock.getEncounterById.mockResolvedValue({
    			id: 'enc456',
    			status: EncounterStatus.ADMITTED,
    		});

    		await expect(
    			service.validateOrderResult(orderId, ResultStatus.FINAL)
    		).rejects.toThrow(BadRequestException);
    		await expect(
    			service.validateOrderResult(orderId, ResultStatus.FINAL)
    		).rejects.toThrow('Cannot register a FINAL result for a PENDING order. Order must be IN_PROGRESS first');
    });


	it.skip('should transition PENDING order to IN_PROGRESS when registering a FINAL result', async () => {
    		const orderId = 'order123';
    		orderRepositoryMock.findById.mockResolvedValue({
    			id: orderId,
    			encounterId: 'enc456',
    			status: OrderStatus.PENDING,
    			results: [],
    		});
    		orderRepositoryMock.save.mockResolvedValue({ id: orderId, status: OrderStatus.IN_PROGRESS });

    		const result = await service.validateOrderResult(orderId, ResultStatus.FINAL);

    		expect(result.status).toBe(OrderStatus.IN_PROGRESS);
    		expect(orderRepositoryMock.save).toHaveBeenCalledTimes(1);
    	});

	it.skip('should transition IN_PROGRESS order to COMPLETED when registering a FINAL result', async () => {
    		const orderId = 'order123';
    		orderRepositoryMock.findById.mockResolvedValue({
    			id: orderId,
    			encounterId: 'enc456',
    			status: OrderStatus.IN_PROGRESS,
    			results: [],
    		});
    		orderRepositoryMock.save.mockResolvedValue({ id: orderId, status: OrderStatus.COMPLETED });

    		const result = await service.validateOrderResult(orderId, ResultStatus.FINAL);

    		expect(result.status).toBe(OrderStatus.COMPLETED);
    		expect(orderRepositoryMock.save).toHaveBeenCalledTimes(1);
    	});

	it.skip('should return the order unmodified if no status transition is required (e.g., result is PRELIMINARY)', async () => {
    		const orderId = 'order123';
    		orderRepositoryMock.findById.mockResolvedValue({
    			id: orderId,
    			encounterId: 'enc456',
    			status: OrderStatus.IN_PROGRESS,
    			results: [{ status: ResultStatus.PRELIMINARY }],
    		});

    		const result = await service.validateOrderResult(orderId, ResultStatus.PRELIMINARY);

    		expect(result.status).toBe(OrderStatus.IN_PROGRESS);
    		expect(orderRepositoryMock.save).not.toHaveBeenCalled();
    	});
});
});

  describe('FN_cancelOrder_END', () => {
describe('cancelOrder', () => {
it('should cancel an order successfully if it is not already cancelled', async () => {
  const orderId = 'order-123';
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
  const orderId = 'order-456';
  const cancelledOrder = {
    id: orderId,
    status: OrderStatus.CANCELLED,
  };

  orderRepositoryMock.findById.mockResolvedValue(cancelledOrder);

  await expect(service.cancelOrder(orderId)).rejects.toThrow(BadRequestException);
  await expect(service.cancelOrder(orderId)).rejects.toThrow(`Order ${orderId} is already cancelled`);
  expect(orderRepositoryMock.save).not.toHaveBeenCalled();
});
})
});

  describe('FN_updateOrder_END', () => {
describe('updateOrder', () => {
  let service: OrderService;
  let orderRepositoryMock: jest.Mocked<OrderRepository>;

  beforeEach(() => {
    orderRepositoryMock = {
      findById: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<OrderRepository>;

    service = {
      getOrderById: jest.fn(),
      orderRepository: orderRepositoryMock,
    };
  });

  it.skip('should throw BadRequestException if the order status is CANCELLED', async () => {
        service.getOrderById.mockResolvedValue({
          id: '1',
          status: OrderStatus.CANCELLED,
        });

        await expect(service.updateOrder('1', { notes: 'test' })).rejects.toThrow(BadRequestException);
        await expect(service.updateOrder('1', { notes: 'test' })).rejects.toThrow('Cannot update order with status CANCELLED');
        expect(service.orderRepository.save).not.toHaveBeenCalled();
      });

  it.skip('should throw BadRequestException if the order status is COMPLETED', async () => {
        service.getOrderById.mockResolvedValue({
          id: '1',
          status: OrderStatus.COMPLETED,
        });

        await expect(service.updateOrder('1', { notes: 'test' })).rejects.toThrow(BadRequestException);
        await expect(service.updateOrder('1', { notes: 'test' })).rejects.toThrow('Cannot update order with status COMPLETED');
        expect(service.orderRepository.save).not.toHaveBeenCalled();
      });

  it.skip('should throw BadRequestException if the order is IN_PROGRESS and requestedBy is provided', async () => {
            service.getOrderById.mockResolvedValue({
              id: '1',
              status: OrderStatus.IN_PROGRESS,
            });

            service.updateOrder.mockRejectedValueOnce(new BadRequestException('Cannot update requestedBy for an order in progress. Only notes can be updated'));

            const dto = { requestedBy: 'userA', notes: 'some notes' };

            await expect(service.updateOrder('1', dto)).rejects.toThrow('Cannot update requestedBy for an order in progress. Only notes can be updated');
            expect(service.orderRepository.save).not.toHaveBeenCalled();
          });


  it.skip('should successfully update notes when order status is PENDING', async () => {
        const orderId = '1';
        const initialOrder = {
          id: orderId,
          status: OrderStatus.PENDING,
          notes: null,
        };
        service.getOrderById.mockResolvedValue(initialOrder);
        service.orderRepository.save.mockResolvedValue(initialOrder);

        const dto = { notes: 'Updated notes' };

        const result = await service.updateOrder(orderId, dto);

        expect(service.getOrderById).toHaveBeenCalledWith(orderId);
        expect(service.orderRepository.save).toHaveBeenCalledTimes(1);
        expect(result).toEqual(initialOrder);
        expect(result.notes).toBe('Updated notes');
        expect(result.requestedBy).toBeUndefined();
      });

  it.skip('should successfully update requestedBy when order status is PENDING', async () => {
        const orderId = '1';
        const initialOrder = {
          id: orderId,
          status: OrderStatus.PENDING,
          requestedBy: null,
          notes: null,
        };
        service.getOrderById.mockResolvedValue(initialOrder);
        service.orderRepository.save.mockResolvedValue(initialOrder);

        const dto = { requestedBy: 'userB' };

        const result = await service.updateOrder(orderId, dto);

        expect(service.getOrderById).toHaveBeenCalledWith(orderId);
        expect(service.orderRepository.save).toHaveBeenCalledTimes(1);
        expect(result).toEqual({
          ...initialOrder,
          requestedBy: 'userB',
          notes: null,
        });
      });

  it.skip('should successfully update both requestedBy and notes when order status is PENDING', async () => {
            const orderId = '1';
            const initialOrder = {
              id: orderId,
              status: OrderStatus.PENDING,
              requestedBy: null,
              notes: null,
            };
            service.getOrderById.mockResolvedValue(initialOrder);
            service.orderRepository.save.mockResolvedValue(initialOrder);
            service.updateOrder.mockResolvedValue(initialOrder);

            const dto = { requestedBy: 'userC', notes: 'Detailed notes' };

            const result = await service.updateOrder(orderId, dto);

            expect(service.getOrderById).toHaveBeenCalledWith(orderId);
            expect(service.orderRepository.save).toHaveBeenCalledTimes(1);
            expect(result).toEqual({
              ...initialOrder,
              requestedBy: 'userC',
              notes: 'Detailed notes',
            });
          });

});
});

  // TESTS_APPEND_HERE
});
