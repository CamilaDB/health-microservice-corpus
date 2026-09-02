// AUTO-GENERATED-BOOTSTRAP-START
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ExamType } from '../order/enums/exam-type.enum';
import { OrderService } from '../order/order.service';
import { CreateResultDto } from './dto/create-result.dto';
import { SearchResultsDto } from './dto/search-results.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { Result } from './entities/result.entity';
import { ResultStatus } from './enums/result-status.enum';
import { ResultReport, ResultReportItem } from './interfaces/result-report.interface';
import { ResultRepository } from './result.repository';
import { ResultService } from './result.service';

describe('ResultService', () => {

  let service: ResultService;
  let resultRepositoryMock: jest.Mocked<ResultRepository>;
  let orderServiceMock: jest.Mocked<OrderService>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {

    resultRepositoryMock = {
      findById: jest.fn().mockResolvedValue(undefined),
      findByOrderId: jest.fn().mockResolvedValue(undefined),
      search: jest.fn().mockResolvedValue(undefined),
      save: jest.fn().mockResolvedValue(undefined),
      create: jest.fn().mockReturnValue(undefined),
    } as unknown as jest.Mocked<ResultRepository>;

    orderServiceMock = {
      getOrderById: jest.fn().mockResolvedValue(undefined),
      createOrder: jest.fn().mockResolvedValue(undefined),
      searchOrders: jest.fn().mockResolvedValue(undefined),
      searchOrdersAdvanced: jest.fn().mockResolvedValue(undefined),
      validateOrderResult: jest.fn().mockResolvedValue(undefined),
      cancelOrder: jest.fn().mockResolvedValue(undefined),
      updateOrder: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<OrderService>;

    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          ResultService,
          { provide: ResultRepository, useValue: resultRepositoryMock },
          { provide: OrderService, useValue: orderServiceMock },
        ],
      }).compile();

    service = module.get<ResultService>(ResultService);

  });
  // AUTO-GENERATED-BOOTSTRAP-END

  describe('FN_createResult_END', () => {
describe('createResult', () => {
  it('should create result with all fields and return saved result', async () => {
    const dto = {
      orderId: 'ORD-123',
      value: 100,
      unit: 'pcs',
      status: ResultStatus.FINAL,
      referenceMin: 5,
      referenceMax: 10,
      resultDate: '2024-01-15T10:00:00Z',
      sourceSystem: 'TEST_SYS',
      notes: 'Test notes'
    };

    const expectedResult = {
      id: 'RES-001',
      orderId: dto.orderId,
      value: dto.value,
      unit: dto.unit,
      status: dto.status,
      referenceMin: 5,
      referenceMax: 10,
      resultDate: new Date(dto.resultDate),
      sourceSystem: 'TEST_SYS',
      notes: 'Test notes',
      created_at: new Date(),
      updated_at: new Date()
    };

    orderServiceMock.validateOrderResult.mockResolvedValueOnce(undefined);
    resultRepositoryMock.create.mockReturnValueOnce(expectedResult);
    resultRepositoryMock.save.mockResolvedValueOnce(expectedResult);

    const result = await service.createResult(dto);

    expect(result).toEqual(expectedResult);
    expect(orderServiceMock.validateOrderResult).toHaveBeenCalledWith(dto.orderId, dto.status);
    expect(resultRepositoryMock.create).toHaveBeenCalledWith({
      ...dto,
      resultDate: new Date(dto.resultDate),
      referenceMin: 5,
      referenceMax: 10,
      sourceSystem: 'TEST_SYS',
      notes: 'Test notes'
    });
  });

  it('should create result with default values for optional fields', async () => {
    const dto = {
      orderId: 'ORD-456',
      value: 200,
      unit: 'pcs',
      status: ResultStatus.PRELIMINARY,
      resultDate: '2024-01-15T12:00:00Z'
    };

    const expectedResult = {
      id: 'RES-002',
      orderId: dto.orderId,
      value: dto.value,
      unit: dto.unit,
      status: dto.status,
      referenceMin: null,
      referenceMax: null,
      resultDate: new Date(dto.resultDate),
      sourceSystem: null,
      notes: null,
      created_at: new Date(),
      updated_at: new Date()
    };

    orderServiceMock.validateOrderResult.mockResolvedValueOnce(undefined);
    resultRepositoryMock.create.mockReturnValueOnce(expectedResult);
    resultRepositoryMock.save.mockResolvedValueOnce(expectedResult);

    const result = await service.createResult(dto);

    expect(result).toEqual(expectedResult);
    expect(orderServiceMock.validateOrderResult).toHaveBeenCalledWith(dto.orderId, dto.status);
    expect(resultRepositoryMock.create).toHaveBeenCalledWith({
      ...dto,
      resultDate: new Date(dto.resultDate),
      referenceMin: null,
      referenceMax: null,
      sourceSystem: null,
      notes: null
    });
  });

  it('should throw BadRequestException when order validation fails', async () => {
    const dto = {
      orderId: 'ORD-789',
      value: 300,
      unit: 'pcs',
      status: ResultStatus.CORRECTED,
      resultDate: '2024-01-15T14:00:00Z'
    };

    orderServiceMock.validateOrderResult.mockRejectedValueOnce(new BadRequestException('Invalid order'));

    await expect(service.createResult(dto)).rejects.toThrow(BadRequestException);
  });
});
});

  describe('FN_searchResults_END', () => {
describe('searchResults', () => {
  it('should return search results from repository', async () => {
    const dto = {
      orderId: 'ORD-123',
      status: ResultStatus.FINAL,
      examType: ExamType.HEMOGRAM,
      dateFrom: '2024-01-01',
      dateTo: '2024-01-31',
      sourceSystem: 'LAB_SYS'
    };

    const mockResults = [
      {
        id: 'RES-001',
        orderId: 'ORD-123',
        value: 150,
        unit: 'mg/dL',
        status: ResultStatus.FINAL,
        referenceMin: 70,
        referenceMax: 140,
        resultDate: new Date('2024-01-15'),
        sourceSystem: 'LAB_SYS',
        notes: null,
        created_at: new Date('2024-01-16'),
        updated_at: new Date('2024-01-17'),
        order: { id: 'ORD-123' }
      },
      {
        id: 'RES-002',
        orderId: 'ORD-123',
        value: 85,
        unit: 'mg/dL',
        status: ResultStatus.FINAL,
        referenceMin: 70,
        referenceMax: 140,
        resultDate: new Date('2024-01-16'),
        sourceSystem: 'LAB_SYS',
        notes: null,
        created_at: new Date('2024-01-17'),
        updated_at: new Date('2024-01-18'),
        order: { id: 'ORD-123' }
      }
    ];

    resultRepositoryMock.search.mockResolvedValueOnce(mockResults);

    const results = await service.searchResults(dto);

    expect(results).toEqual(mockResults);
    expect(resultRepositoryMock.search).toHaveBeenCalledWith(dto);
  });

  it('should return empty array when no results found', async () => {
    const dto = {
      orderId: 'ORD-999',
      status: ResultStatus.PRELIMINARY,
      examType: ExamType.GLUCOSE,
      dateFrom: '2024-02-01',
      dateTo: '2024-02-28'
    };

    resultRepositoryMock.search.mockResolvedValueOnce([]);

    const results = await service.searchResults(dto);

    expect(results).toEqual([]);
    expect(resultRepositoryMock.search).toHaveBeenCalledWith(dto);
  });

  it('should throw error when repository search fails', async () => {
    const dto = {
      orderId: 'ORD-888',
      status: ResultStatus.CORRECTED,
      examType: ExamType.TSH,
      dateFrom: '2024-03-01',
      dateTo: '2024-03-31'
    };

    resultRepositoryMock.search.mockRejectedValueOnce(new Error('Database connection failed'));

    await expect(service.searchResults(dto)).rejects.toThrow(Error);
  });
});
});

  describe('FN_getResultById_END', () => {
describe('getResultById', () => {
  it('should throw NotFoundException when result is not found', async () => {
    const id = 'test-id';
    resultRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(service.getResultById(id)).rejects.toThrow(NotFoundException);
  });
});
});

  describe('FN_updateResult_END', () => {
describe('updateResult', () => {
  it('should throw BadRequestException when trying to change status of CORRECTED result', async () => {
    const result = {
      id: '123',
      status: ResultStatus.CORRECTED,
      value: 100,
      unit: 'kg',
      referenceMin: null,
      referenceMax: null,
      resultDate: new Date(),
      sourceSystem: null,
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      order: {},
    };

    resultRepositoryMock.findById.mockResolvedValueOnce(result);
    const dto = { status: ResultStatus.FINAL };

    await expect(service.updateResult('123', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException for invalid status transition from FINAL to PRELIMINARY', async () => {
    const result = {
      id: '123',
      status: ResultStatus.FINAL,
      value: 100,
      unit: 'kg',
      referenceMin: null,
      referenceMax: null,
      resultDate: new Date(),
      sourceSystem: null,
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      order: {},
    };

    resultRepositoryMock.findById.mockResolvedValueOnce(result);
    const dto = { status: ResultStatus.PRELIMINARY };

    await expect(service.updateResult('123', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when trying to update value of non-preliminary result', async () => {
    const result = {
      id: '123',
      status: ResultStatus.FINAL,
      value: 100,
      unit: 'kg',
      referenceMin: null,
      referenceMax: null,
      resultDate: new Date(),
      sourceSystem: null,
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      order: {},
    };

    resultRepositoryMock.findById.mockResolvedValueOnce(result);
    const dto = { value: 200 };

    await expect(service.updateResult('123', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when trying to update unit of non-preliminary result', async () => {
    const result = {
      id: '123',
      status: ResultStatus.FINAL,
      value: 100,
      unit: 'kg',
      referenceMin: null,
      referenceMax: null,
      resultDate: new Date(),
      sourceSystem: null,
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      order: {},
    };

    resultRepositoryMock.findById.mockResolvedValueOnce(result);
    const dto = { unit: 'g' };

    await expect(service.updateResult('123', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when trying to update referenceMin of final result', async () => {
    const result = {
      id: '123',
      status: ResultStatus.FINAL,
      value: 100,
      unit: 'kg',
      referenceMin: null,
      referenceMax: null,
      resultDate: new Date(),
      sourceSystem: null,
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      order: {},
    };

    resultRepositoryMock.findById.mockResolvedValueOnce(result);
    const dto = { referenceMin: 50 };

    await expect(service.updateResult('123', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when trying to update referenceMax of final result', async () => {
    const result = {
      id: '123',
      status: ResultStatus.FINAL,
      value: 100,
      unit: 'kg',
      referenceMin: null,
      referenceMax: null,
      resultDate: new Date(),
      sourceSystem: null,
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      order: {},
    };

    resultRepositoryMock.findById.mockResolvedValueOnce(result);
    const dto = { referenceMax: 150 };

    await expect(service.updateResult('123', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when referenceMin is greater than or equal to referenceMax', async () => {
    const result = {
      id: '123',
      status: ResultStatus.PRELIMINARY,
      value: 100,
      unit: 'kg',
      referenceMin: null,
      referenceMax: null,
      resultDate: new Date(),
      sourceSystem: null,
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      order: {},
    };

    resultRepositoryMock.findById.mockResolvedValueOnce(result);
    const dto = { referenceMin: 100, referenceMax: 50 };

    await expect(service.updateResult('123', dto)).rejects.toThrow(BadRequestException);
  });

  it('should successfully update status from PRELIMINARY to FINAL', async () => {
    const result = {
      id: '123',
      status: ResultStatus.PRELIMINARY,
      value: 100,
      unit: 'kg',
      referenceMin: null,
      referenceMax: null,
      resultDate: new Date(),
      sourceSystem: null,
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      order: {},
    };

    const savedResult = { ...result, status: ResultStatus.FINAL, updated_at: new Date() };
    resultRepositoryMock.findById.mockResolvedValueOnce(result);
    resultRepositoryMock.save.mockResolvedValueOnce(savedResult);
    const dto = { status: ResultStatus.FINAL };

    const response = await service.updateResult('123', dto);

    expect(response).toEqual(savedResult);
  });

  it('should successfully update value of preliminary result', async () => {
    const result = {
      id: '123',
      status: ResultStatus.PRELIMINARY,
      value: 100,
      unit: 'kg',
      referenceMin: null,
      referenceMax: null,
      resultDate: new Date(),
      sourceSystem: null,
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      order: {},
    };

    const savedResult = { ...result, value: 200, updated_at: new Date() };
    resultRepositoryMock.findById.mockResolvedValueOnce(result);
    resultRepositoryMock.save.mockResolvedValueOnce(savedResult);
    const dto = { value: 200 };

    const response = await service.updateResult('123', dto);

    expect(response).toEqual(savedResult);
  });

  it('should successfully update referenceMin and referenceMax for preliminary result', async () => {
    const result = {
      id: '123',
      status: ResultStatus.PRELIMINARY,
      value: 100,
      unit: 'kg',
      referenceMin: null,
      referenceMax: null,
      resultDate: new Date(),
      sourceSystem: null,
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      order: {},
    };

    const savedResult = { ...result, referenceMin: 50, referenceMax: 100, updated_at: new Date() };
    resultRepositoryMock.findById.mockResolvedValueOnce(result);
    resultRepositoryMock.save.mockResolvedValueOnce(savedResult);
    const dto = { referenceMin: 50, referenceMax: 100 };

    const response = await service.updateResult('123', dto);

    expect(response).toEqual(savedResult);
  });

  it('should successfully update notes for preliminary result', async () => {
    const result = {
      id: '123',
      status: ResultStatus.PRELIMINARY,
      value: 100,
      unit: 'kg',
      referenceMin: null,
      referenceMax: null,
      resultDate: new Date(),
      sourceSystem: null,
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      order: {},
    };

    const savedResult = { ...result, notes: 'Test note', updated_at: new Date() };
    resultRepositoryMock.findById.mockResolvedValueOnce(result);
    resultRepositoryMock.save.mockResolvedValueOnce(savedResult);
    const dto = { notes: 'Test note' };

    const response = await service.updateResult('123', dto);

    expect(response).toEqual(savedResult);
  });
});
});

  // TESTS_APPEND_HERE
});
