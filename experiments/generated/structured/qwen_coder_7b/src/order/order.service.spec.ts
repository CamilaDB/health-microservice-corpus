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
  it('should throw NotFoundException when order is not found', async () => {
    const id = 'non-existent-id';
    orderRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(service.getOrderById(id)).rejects.toThrow(NotFoundException);
    expect(orderRepositoryMock.findById).toHaveBeenCalledWith(id);
  });

  it('should return order when found', async () => {
    const id = 'existing-id';
    const mockOrder: Order = { id, encounterId: '', examType: ExamType.HEMOGRAM, status: OrderStatus.PENDING, requestedAt: new Date(), requestedBy: '', notes: null, created_at: new Date(), updated_at: new Date() };
    orderRepositoryMock.findById.mockResolvedValue(mockOrder);

    const result = await service.getOrderById(id);
    expect(result).toEqual(mockOrder);
    expect(orderRepositoryMock.findById).toHaveBeenCalledWith(id);
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
      requestedAt: new Date(new Date().getTime() - 86400000).toISOString(), // one day before
      requestedBy: 'user123',
    };

    encounterServiceMock.getEncounterById.mockResolvedValue({
      status: EncounterStatus.ADMITTED,
      admitDate: new Date(),
    });

    await expect(service.createOrder(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw ConflictException if a pending order already exists', async () => {
    const dto: CreateOrderDto = {
      encounterId: 'encounter123',
      examType: ExamType.HEMOGRAM,
      requestedAt: new Date().toISOString(),
      requestedBy: 'user123',
    };

    encounterServiceMock.getEncounterById.mockResolvedValue({
      status: EncounterStatus.ADMITTED,
      admitDate: new Date(),
    });

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

    encounterServiceMock.getEncounterById.mockResolvedValue({
      status: EncounterStatus.ADMITTED,
      admitDate: new Date(),
    });

    orderRepositoryMock.existsPendingOrder.mockResolvedValue(false);
    orderRepositoryMock.create.mockReturnValue({ ...dto, id: 'order123', requestedAt: new Date(dto.requestedAt), status: OrderStatus.PENDING, notes: null });
    orderRepositoryMock.save.mockResolvedValue({ ...dto, id: 'order123', requestedAt: new Date(dto.requestedAt), status: OrderStatus.PENDING, notes: null });

    const result = await service.createOrder(dto);

    expect(result).toEqual({
      ...dto,
      id: 'order123',
      requestedAt: new Date(dto.requestedAt),
      status: OrderStatus.PENDING,
      notes: null,
    });
  });
});

  describe('OrderService', () => {
  it('should throw BadRequestException when searchOrders is called without any parameters', async () => {
    expect(() => service.searchOrders({})).rejects.toThrow(BadRequestException);
  });

  it('should call orderRepository.search with the provided DTO', async () => {
    const dto: SearchOrdersDto = { status: OrderStatus.PENDING };
    await service.searchOrders(dto);
    expect(orderRepositoryMock.search).toHaveBeenCalledWith(dto);
  });
});

  // TESTS_APPEND_HERE
});
