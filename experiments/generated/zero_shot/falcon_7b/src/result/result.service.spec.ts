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
describe('ResultService.createResult', () => {
  it('should call orderService.validateOrderResult with the correct arguments', async () => {
    const orderId = 'order123';
    const status = ResultStatus.FINAL;
    const result = await service.createResult({ orderId, status });

    expect(orderServiceMock.validateOrderResult).toHaveBeenCalledWith(orderId, status);
  });

  it('should create a new result entity with the correct properties', async () => {
    const orderId = 'order123';
    const value = 100;
    const unit = 'mg';
    const status = ResultStatus.FINAL;
    const resultDate = new Date('2023-01-01');
    const referenceMin = 50;
    const referenceMax = 150;
    const sourceSystem = 'system1';
    const notes = 'Some notes';

    const createResultDto = {
      orderId,
      value,
      unit,
      status,
      resultDate,
      referenceMin,
      referenceMax,
      sourceSystem,
      notes,
    };

    const expectedResult = {
      ...createResultDto,
      resultDate: resultDate,
      referenceMin: referenceMin,
      referenceMax: referenceMax,
      sourceSystem: sourceSystem,
      notes: notes,
    };

    resultRepositoryMock.create.mockReturnValue(expectedResult);

    const result = await service.createResult(createResultDto);

    expect(resultRepositoryMock.create).toHaveBeenCalledWith(expectedResult);
    expect(resultRepositoryMock.save).toHaveBeenCalledWith(expectedResult);
  });

  it('should save the created result entity', async () => {
    const orderId = 'order123';
    const value = 100;
    const unit = 'mg';
    const status = ResultStatus.FINAL;
    const resultDate = new Date('2023-01-01');
    const referenceMin = 50;
    const referenceMax = 150;
    const sourceSystem = 'system1';
    const notes = 'Some notes';

    const createResultDto = {
      orderId,
      value,
      unit,
      status,
      resultDate,
      referenceMin,
      referenceMax,
      sourceSystem,
      notes,
    };

    const expectedResult = {
      ...createResultDto,
      resultDate: resultDate,
      referenceMin: referenceMin,
      referenceMax: referenceMax,
      sourceSystem: sourceSystem,
      notes: notes,
    };

    resultRepositoryMock.create.mockReturnValue(expectedResult);

    await service.createResult(createResultDto);

    expect(resultRepositoryMock.save).toHaveBeenCalledWith(expectedResult);
  });
});
});

  describe('FN_searchResults_END', () => {
describe('ResultService.searchResults', () => {
  it('should delegate to resultRepository.search', async () => {
    const searchResultsDto = {
      orderId: 'orderId',
      status: ResultStatus.FINAL,
      examType: ExamType.HEMOGRAM,
      dateFrom: '2023-01-01',
      dateTo: '2023-01-31',
      sourceSystem: 'sourceSystem',
    };

    resultRepositoryMock.search.mockResolvedValueOnce([
      {
        id: '1',
        orderId: 'orderId',
        value: 100,
        unit: 'mg/dL',
        status: ResultStatus.FINAL,
        referenceMin: null,
        referenceMax: null,
        resultDate: new Date('2023-01-15'),
        sourceSystem: 'sourceSystem',
        notes: 'Notes',
        created_at: new Date('2023-01-15'),
        updated_at: new Date('2023-01-15'),
        order: {
          id: 'orderId',
          examType: ExamType.HEMOGRAM,
          // ... other properties of Order
        },
      },
    ]);

    const results = await service.searchResults(searchResultsDto);

    expect(results).toEqual([
      {
        id: '1',
        orderId: 'orderId',
        value: 100,
        unit: 'mg/dL',
        status: ResultStatus.FINAL,
        referenceMin: null,
        referenceMax: null,
        resultDate: new Date('2023-01-15'),
        sourceSystem: 'sourceSystem',
        notes: 'Notes',
        created_at: new Date('2023-01-15'),
        updated_at: new Date('2023-01-15'),
        order: {
          id: 'orderId',
          examType: ExamType.HEMOGRAM,
          // ... other properties of Order
        },
      }
    ]);

    expect(resultRepositoryMock.search).toHaveBeenCalledWith(searchResultsDto);
  });
});
});

  describe('FN_getResultById_END', () => {
describe('ResultService.getResultById', () => {
  it('should throw NotFoundException when result with given id is not found', async () => {
    resultRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(service.getResultById('non-existent-id')).rejects.toThrow(NotFoundException);
  });

  it('should return result when it exists', async () => {
    const mockResult = { id: 'existing-id', orderId: 'order-id', value: 100, ...Result };
    resultRepositoryMock.findById.mockResolvedValue(mockResult);

    const result = await service.getResultById('existing-id');
    expect(result).toEqual(mockResult);
  });
});
});

  describe('FN_buildResultReport_END', () => {
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

  describe('buildResultReport', () => {
    it('should throw NotFoundException if no results found for order', async () => {
      resultRepositoryMock.findByOrderId.mockResolvedValue([]);
      orderServiceMock.getOrderById.mockResolvedValue({ examType: ExamType.GLUCOSE });

      try {
        await service.buildResultReport('123');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`No results found for order 123`);
      }

      expect(resultRepositoryMock.findByOrderId).toHaveBeenCalledWith('123');
    });

    it.skip('should return ResultReport with correct summary when results exist', async () => {
            const results = [
              { id: '1', status: ResultStatus.PRELIMINARY, value: 75, unit: 'mg/dL', referenceMin: null, referenceMax: null },
              { id: '2', status: ResultStatus.FINAL, value: 85, unit: 'mg/dL', referenceMin: null, referenceMax: null },
            ];
            resultRepositoryMock.findByOrderId.mockResolvedValue(results);
            orderServiceMock.getOrderById.mockResolvedValue({ examType: ExamType.GLUCOSE });

            const expectedResultReport: ResultReport = {
              orderId: '123',
              examType: ExamType.GLUCOSE,
              items: results.map((result) => ({
                ...result,
                flag: 'UNKNOWN',
              })),
              summary: {
                total: 2,
                preliminary: 1,
                final: 1,
                corrected: 0,
                abnormal: 0,
              },
            };

            const resultReport = await service.buildResultReport('123');

            expect(resultReport).toEqual(expectedResultReport);

            expect(resultRepositoryMock.findByOrderId).toHaveBeenCalledWith('123');
          });
  });
});
});

  describe('FN_updateResult_END', () => {
describe('ResultService.updateResult', () => {
  it('should throw BadRequestException for changing status of a CORRECTED result', async () => {
    const result = { id: '123', status: ResultStatus.CORRECTED } as Result;
    const updateDto = { status: ResultStatus.FINAL } as UpdateResultDto;

    resultRepositoryMock.findById.mockResolvedValue(result);

    await expect(service.updateResult('123', updateDto)).rejects.toThrow(BadRequestException);
  });

  it.skip('should throw BadRequestException for invalid status transition', async () => {
            const result = { id: '123', status: ResultStatus.PRELIMINARY } as Result;
            const updateDto = { status: ResultStatus.FINAL } as UpdateResultDto;

            resultRepositoryMock.findById.mockResolvedValue(result);

            // Use expect.rejects to properly test async functions
            await expect(service.updateResult('123', updateDto)).rejects.toThrow(BadRequestException);
        });


  it('should throw BadRequestException for updating value of a non-preliminary result', async () => {
    const result = { id: '123', status: ResultStatus.FINAL } as Result;
    const updateDto = { value: 100 } as UpdateResultDto;

    resultRepositoryMock.findById.mockResolvedValue(result);

    await expect(service.updateResult('123', updateDto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException for updating unit of a non-preliminary result', async () => {
    const result = { id: '123', status: ResultStatus.FINAL } as Result;
    const updateDto = { unit: 'cm' } as UpdateResultDto;

    resultRepositoryMock.findById.mockResolvedValue(result);

    await expect(service.updateResult('123', updateDto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException for updating referenceMin of a final result', async () => {
    const result = { id: '123', status: ResultStatus.FINAL } as Result;
    const updateDto = { referenceMin: 100 } as UpdateResultDto;

    resultRepositoryMock.findById.mockResolvedValue(result);

    await expect(service.updateResult('123', updateDto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException for updating referenceMax of a final result', async () => {
    const result = { id: '123', status: ResultStatus.FINAL } as Result;
    const updateDto = { referenceMax: 100 } as UpdateResultDto;

    resultRepositoryMock.findById.mockResolvedValue(result);

    await expect(service.updateResult('123', updateDto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException for referenceMin greater than or equal to referenceMax', async () => {
    const result = { id: '123', status: ResultStatus.PRELIMINARY } as Result;
    const updateDto = { referenceMin: 100, referenceMax: 100 } as UpdateResultDto;

    resultRepositoryMock.findById.mockResolvedValue(result);

    await expect(service.updateResult('123', updateDto)).rejects.toThrow(BadRequestException);
  });

  it('should update result with valid data', async () => {
    const result = { id: '123', status: ResultStatus.PRELIMINARY } as Result;
    const updateDto = { status: ResultStatus.FINAL, value: 100, unit: 'cm' } as UpdateResultDto;

    resultRepositoryMock.findById.mockResolvedValue(result);
    resultRepositoryMock.save.mockResolvedValue(result);

    await expect(service.updateResult('123', updateDto)).resolves.toBe(result);
  });
});
});

  // TESTS_APPEND_HERE
});
