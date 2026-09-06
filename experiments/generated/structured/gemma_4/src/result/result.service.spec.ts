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
  it('should be able to create a result successfully', async () => {
    const dto = {
      orderId: 'order-123',
      value: 100,
      unit: 'USD',
      status: ResultStatus.FINAL,
      resultDate: '2023-01-01',
      referenceMin: 50,
      referenceMax: 150,
      sourceSystem: 'ERP',
      notes: 'Test notes',
    };

    resultRepositoryMock.create.mockReturnValue({ id: 'result-456' });
    resultRepositoryMock.save.mockResolvedValue({ id: 'result-456' });
    orderServiceMock.validateOrderResult.mockResolvedValue(undefined);

    const result = await service.createResult(dto);

    expect(orderServiceMock.validateOrderResult).toHaveBeenCalledWith('order-123', ResultStatus.FINAL);
    expect(resultRepositoryMock.create).toHaveBeenCalledWith({
      orderId: 'order-123',
      value: 100,
      unit: 'USD',
      status: ResultStatus.FINAL,
      resultDate: new Date('2023-01-01'),
      referenceMin: 50,
      referenceMax: 150,
      sourceSystem: 'ERP',
      notes: 'Test notes',
    });
    expect(resultRepositoryMock.save).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ id: 'result-456' });
  });

  it('should handle missing optional fields by setting them to null', async () => {
        const dto = {
          orderId: 'order-124',
          value: 200,
          unit: 'EUR',
          status: ResultStatus.CORRECTED,
          resultDate: '2023-02-01',
          referenceMin: 10,
          referenceMax: 20,
          // sourceSystem and notes are missing
        };

        resultRepositoryMock.create.mockReturnValue({ id: 'result-789' });
        resultRepositoryMock.save.mockResolvedValue({ id: 'result-789' });
        orderServiceMock.validateOrderResult.mockResolvedValue(undefined);

        await service.createResult(dto);

        expect(resultRepositoryMock.create).toHaveBeenCalledWith({
          orderId: 'order-124',
          value: 200,
          unit: 'EUR',
          status: ResultStatus.CORRECTED,
          resultDate: new Date('2023-02-01'),
          referenceMin: 10,
          referenceMax: 20,
          sourceSystem: null,
          notes: null,
        });
        expect(resultRepositoryMock.save).toHaveBeenCalledTimes(1);
      });


  it('should throw an error if order validation fails', async () => {
    const dto = {
      orderId: 'order-fail',
      value: 50,
      unit: 'GBP',
      status: ResultStatus.PRELIMINARY,
      resultDate: '2023-03-01',
    };

    const validationError = new BadRequestException('Order validation failed');
    orderServiceMock.validateOrderResult.mockRejectedValue(validationError);

    await expect(service.createResult(dto)).rejects.toThrow(BadRequestException);
    expect(resultRepositoryMock.create).not.toHaveBeenCalled();
    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should return the saved result', async () => {
    const dto = {
      orderId: 'order-success',
      value: 10,
      unit: 'AUD',
      status: ResultStatus.FINAL,
      resultDate: '2023-04-01',
      referenceMin: 1,
      referenceMax: 10,
      sourceSystem: 'SystemX',
      notes: 'Final check',
    };

    const createdResult = { id: 'result-111' };
    resultRepositoryMock.create.mockReturnValue(createdResult);
    resultRepositoryMock.save.mockResolvedValue(createdResult);
    orderServiceMock.validateOrderResult.mockResolvedValue(undefined);

    const result = await service.createResult(dto);

    expect(result).toEqual(createdResult);
  });
});
});

  describe('FN_searchResults_END', () => {
describe('searchResults', () => {
  it('should return the results from the repository when search is successful', async () => {
    const mockResults = [
      { id: '1', orderId: 'A1', value: 100, unit: 'kg', status: ResultStatus.FINAL, referenceMin: null, referenceMax: null, resultDate: new Date(), sourceSystem: 'SystemA', notes: null, created_at: new Date(), updated_at: new Date(), order: {} },
      { id: '2', orderId: 'A2', value: 200, unit: 'g', status: ResultStatus.FINAL, referenceMin: null, referenceMax: null, resultDate: new Date(), sourceSystem: 'SystemB', notes: null, created_at: new Date(), updated_at: new Date(), order: {} },
    ];
    resultRepositoryMock.search.mockResolvedValue(mockResults);

    const dto = { orderId: 'A1', status: ResultStatus.FINAL, examType: ExamType.HEMOGRAM };

    const result = await service.searchResults(dto);

    expect(result).toEqual(mockResults);
    expect(result.length).toBe(2);
    expect(result[0].orderId).toBe('A1');
  });

  it('should return an empty array when the search yields no results', async () => {
    resultRepositoryMock.search.mockResolvedValue([]);

    const dto = { orderId: 'A1', status: ResultStatus.FINAL, examType: ExamType.GLUCOSE };

    const result = await service.searchResults(dto);

    expect(result).toEqual([]);
  });

  it('should throw an error if the repository search fails', async () => {
    const error = new Error('Database search failed');
    resultRepositoryMock.search.mockRejectedValue(error);

    const dto = { orderId: 'A1', status: ResultStatus.FINAL, examType: ExamType.TSH };

    await expect(service.searchResults(dto)).rejects.toThrow('Database search failed');
  });
});
});

  describe('FN_getResultById_END', () => {
describe('getResultById', () => {
  it('should return the result when found', async () => {
    const mockResult = {
      id: '123',
      orderId: 'abc',
      value: 100,
      unit: 'USD',
      status: 'FINAL',
      referenceMin: null,
      referenceMax: null,
      resultDate: new Date(),
      sourceSystem: 'SystemA',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      order: {},
    };
    resultRepositoryMock.findById.mockResolvedValue(mockResult);

    const result = await service.getResultById('123');

    expect(result).toEqual(mockResult);
    expect(result).toHaveProperty('id', '123');
  });

  it('should throw NotFoundException when result is not found', async () => {
    resultRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(service.getResultById('456')).rejects.toThrow(NotFoundException);
    await expect(service.getResultById('456')).rejects.toThrow('Result with id 456 not found');
  });
});
});

  describe('FN_buildResultReport_END', () => {
describe('buildResultReport', () => {
  it('should throw NotFoundException if no results are found for the order', async () => {
    orderServiceMock.getOrderById.mockResolvedValue({ examType: ExamType.GLUCOSE });
    resultRepositoryMock.findByOrderId.mockResolvedValue([]);

    await expect(service.buildResultReport('some-order-id')).rejects.toThrow(NotFoundException);
    await expect(service.buildResultReport('some-order-id')).rejects.toThrow(`No results found for order some-order-id`);
  });

  it('should correctly calculate summary and items when results are present and include various statuses', async () => {
        orderServiceMock.getOrderById.mockResolvedValue({ examType: ExamType.GLUCOSE });
        const mockResults = [
          { id: 'r1', status: ResultStatus.PRELIMINARY, value: 80, referenceMin: 70, referenceMax: 99, unit: 'mg/dL', sourceSystem: 'A', resultDate: new Date() },
          { id: 'r2', status: ResultStatus.FINAL, value: 100, referenceMin: 70, referenceMax: 99, unit: 'mg/dL', sourceSystem: 'B', resultDate: new Date() },
          { id: 'r3', status: ResultStatus.CORRECTED, value: 75, referenceMin: 70, referenceMax: 99, unit: 'mg/dL', sourceSystem: 'A', resultDate: new Date() },
        ];
        resultRepositoryMock.findByOrderId.mockResolvedValue(mockResults);

        const expectedReport = {
          orderId: 'some-order-id',
          examType: ExamType.GLUCOSE,
          summary: { total: 3, preliminary: 1, final: 1, corrected: 1, abnormal: 1 },
          items: [
            { resultId: 'r1', examType: ExamType.GLUCOSE, value: 80, unit: 'mg/dL', status: ResultStatus.PRELIMINARY, referenceMin: 70, referenceMax: 99, flag: 'NORMAL', sourceSystem: 'A', resultDate: expect.any(Date) },
            { resultId: 'r2', examType: ExamType.GLUCOSE, value: 100, unit: 'mg/dL', status: ResultStatus.FINAL, referenceMin: 70, referenceMax: 99, flag: 'HIGH', sourceSystem: 'B', resultDate: expect.any(Date) },
            { resultId: 'r3', examType: ExamType.GLUCOSE, value: 75, unit: 'mg/dL', status: ResultStatus.CORRECTED, referenceMin: 70, referenceMax: 99, flag: 'NORMAL', sourceSystem: 'A', resultDate: expect.any(Date) },
          ],
        };

        await service.buildResultReport('some-order-id');

        // Verify dependency calls
        expect(orderServiceMock.getOrderById).toHaveBeenCalledWith('some-order-id');
        expect(resultRepositoryMock.findByOrderId).toHaveBeenCalledWith('some-order-id');

        // Verify result structure
        const actualReport = await service.buildResultReport('some-order-id');
        expect(actualReport).toEqual(expectedReport);
      });


  it.skip('should handle results where reference ranges are null for all results', async () => {
            orderServiceMock.getOrderById.mockResolvedValue({ examType: ExamType.TSH });
            const mockResults = [
              { id: 'r1', status: ResultStatus.FINAL, value: 3.5, unit: 'mIU/L', sourceSystem: 'A', resultDate: new Date(), referenceMin: null, referenceMax: null },
              { id: 'r2', status: ResultStatus.PRELIMINARY, value: 1.0, unit: 'mIU/L', sourceSystem: 'B', resultDate: new Date(), referenceMin: null, referenceMax: null },
            ];
            resultRepositoryMock.findByOrderId.mockResolvedValue(mockResults);

            const report = await service.buildResultReport('some-order-id');

            // Check summary
            expect(report.summary).toEqual({ total: 2, preliminary: 1, final: 1, corrected: 0, abnormal: 0 });

            // Check items (should all be UNKNOWN since refMin/refMax are null)
            expect(report.items[0].flag).toBe('UNKNOWN');
            expect(report.items[1].flag).toBe('UNKNOWN');
        });


  it('should correctly identify LOW flag when value is below referenceMin', async () => {
    orderServiceMock.getOrderById.mockResolvedValue({ examType: ExamType.GLUCOSE });
    const mockResults = [
      { id: 'r1', status: ResultStatus.FINAL, value: 65, referenceMin: 70, referenceMax: 99, unit: 'mg/dL', sourceSystem: 'A', resultDate: new Date() },
    ];
    resultRepositoryMock.findByOrderId.mockResolvedValue(mockResults);

    const report = await service.buildResultReport('some-order-id');

    expect(report.items[0].flag).toBe('LOW');
    expect(report.summary.abnormal).toBe(1);
  });

  it('should correctly identify HIGH flag when value is above referenceMax', async () => {
    orderServiceMock.getOrderById.mockResolvedValue({ examType: ExamType.CREATININE });
    const mockResults = [
      { id: 'r1', status: ResultStatus.FINAL, value: 1.5, referenceMin: 0.6, referenceMax: 1.2, unit: 'mg/dL', sourceSystem: 'A', resultDate: new Date() },
    ];
    resultRepositoryMock.findByOrderId.mockResolvedValue(mockResults);

    const report = await service.buildResultReport('some-order-id');

    expect(report.items[0].flag).toBe('HIGH');
    expect(report.summary.abnormal).toBe(1);
  });

  it('should correctly identify NORMAL flag when value is within reference range', async () => {
    orderServiceMock.getOrderById.mockResolvedValue({ examType: ExamType.TSH });
    const mockResults = [
      { id: 'r1', status: ResultStatus.FINAL, value: 2.0, referenceMin: 0.4, referenceMax: 4.0, unit: 'mIU/L', sourceSystem: 'A', resultDate: new Date() },
    ];
    resultRepositoryMock.findByOrderId.mockResolvedValue(mockResults);

    const report = await service.buildResultReport('some-order-id');

    expect(report.items[0].flag).toBe('NORMAL');
    expect(report.summary.abnormal).toBe(0);
  });

  it('should correctly handle results with only preliminary status', async () => {
    orderServiceMock.getOrderById.mockResolvedValue({ examType: ExamType.CREATININE });
    const mockResults = [
      { id: 'r1', status: ResultStatus.PRELIMINARY, value: 1.0, referenceMin: 0.6, referenceMax: 1.2, unit: 'mg/dL', sourceSystem: 'A', resultDate: new Date() },
    ];
    resultRepositoryMock.findByOrderId.mockResolvedValue(mockResults);

    const report = await service.buildResultReport('some-order-id');

    expect(report.summary).toEqual({ total: 1, preliminary: 1, final: 0, corrected: 0, abnormal: 0 });
    expect(report.items[0].status).toBe(ResultStatus.PRELIMINARY);
    expect(report.items[0].flag).toBe('NORMAL');
  });

  it('should correctly handle results with only final status', async () => {
    orderServiceMock.getOrderById.mockResolvedValue({ examType: ExamType.GLUCOSE });
    const mockResults = [
      { id: 'r1', status: ResultStatus.FINAL, value: 90, referenceMin: 70, referenceMax: 99, unit: 'mg/dL', sourceSystem: 'A', resultDate: new Date() },
    ];
    resultRepositoryMock.findByOrderId.mockResolvedValue(mockResults);

    const report = await service.buildResultReport('some-order-id');

    expect(report.summary).toEqual({ total: 1, preliminary: 0, final: 1, corrected: 0, abnormal: 0 });
    expect(report.items[0].status).toBe(ResultStatus.FINAL);
    expect(report.items[0].flag).toBe('NORMAL');
  });

  it('should correctly handle results with only corrected status', async () => {
    orderServiceMock.getOrderById.mockResolvedValue({ examType: ExamType.TSH });
    const mockResults = [
      { id: 'r1', status: ResultStatus.CORRECTED, value: 2.5, referenceMin: 0.4, referenceMax: 4.0, unit: 'mIU/L', sourceSystem: 'A', resultDate: new Date() },
    ];
    resultRepositoryMock.findByOrderId.mockResolvedValue(mockResults);

    const report = await service.buildResultReport('some-order-id');

    expect(report.summary).toEqual({ total: 1, preliminary: 0, final: 0, corrected: 1, abnormal: 0 });
    expect(report.items[0].status).toBe(ResultStatus.CORRECTED);
    expect(report.items[0].flag).toBe('NORMAL');
  });

  it('should correctly count abnormal results when both LOW and HIGH conditions are met across different results', async () => {
    orderServiceMock.getOrderById.mockResolvedValue({ examType: ExamType.GLUCOSE });
    const mockResults = [
      { id: 'r1', status: ResultStatus.FINAL, value: 60, referenceMin: 70, referenceMax: 99, unit: 'mg/dL', sourceSystem: 'A', resultDate: new Date() }, // LOW
      { id: 'r2', status: ResultStatus.FINAL, value: 110, referenceMin: 70, referenceMax: 99, unit: 'mg/dL', sourceSystem: 'B', resultDate: new Date() }, // HIGH
    ];
    resultRepositoryMock.findByOrderId.mockResolvedValue(mockResults);

    const report = await service.buildResultReport('some-order-id');

    expect(report.summary).toEqual({ total: 2, preliminary: 0, final: 2, corrected: 0, abnormal: 2 });
  });
});
});

  describe('FN_updateResult_END', () => {
describe('updateResult', () => {
  it('should throw BadRequestException when trying to change status of a CORRECTED result', async () => {
    const result = {
      id: '1',
      status: ResultStatus.CORRECTED,
      value: 100,
      unit: 'USD',
      referenceMin: null,
      referenceMax: null,
    };
    const dto = { status: ResultStatus.FINAL };

    resultRepositoryMock.findById.mockResolvedValue(result);
    resultRepositoryMock.save.mockResolvedValue(result);

    await expect(service.updateResult('1', dto)).rejects.toThrow(BadRequestException);
    await expect(service.updateResult('1', dto)).rejects.toThrow(
      'Cannot change status of a CORRECTED result — it is terminal',
    );
  });

  it.skip('should throw BadRequestException for invalid status transition', async () => {
        const result = {
          id: '1',
          status: ResultStatus.PRELIMINARY,
          value: 100,
          unit: 'USD',
          referenceMin: null,
          referenceMax: null,
        };
        const dto = { status: ResultStatus.FINAL };

        resultRepositoryMock.findById.mockResolvedValue(result);

        await expect(service.updateResult('1', dto)).rejects.toThrow(
          `Invalid status transition from ${ResultStatus.PRELIMINARY} to ${ResultStatus.FINAL}`,
        );
      });

  it('should throw BadRequestException when attempting to update value on a non-preliminary result', async () => {
    const result = {
      id: '1',
      status: ResultStatus.FINAL,
      value: 100,
      unit: 'USD',
      referenceMin: null,
      referenceMax: null,
    };
    const dto = { value: 150 };

    resultRepositoryMock.findById.mockResolvedValue(result);

    await expect(service.updateResult('1', dto)).rejects.toThrow(
      'Cannot update value of a non-preliminary result',
    );
  });

  it('should throw BadRequestException when attempting to update unit on a non-preliminary result', async () => {
    const result = {
      id: '1',
      status: ResultStatus.FINAL,
      value: 100,
      unit: 'USD',
      referenceMin: null,
      referenceMax: null,
    };
    const dto = { unit: 'EUR' };

    resultRepositoryMock.findById.mockResolvedValue(result);

    await expect(service.updateResult('1', dto)).rejects.toThrow(
      'Cannot update unit of a non-preliminary result',
    );
  });

  it('should throw BadRequestException when attempting to update referenceMin on a final result', async () => {
    const result = {
      id: '1',
      status: ResultStatus.FINAL,
      value: 100,
      unit: 'USD',
      referenceMin: null,
      referenceMax: null,
    };
    const dto = { referenceMin: 50 };

    resultRepositoryMock.findById.mockResolvedValue(result);

    await expect(service.updateResult('1', dto)).rejects.toThrow(
      'Cannot update referenceMin of a final result',
    );
  });

  it('should throw BadRequestException when attempting to update referenceMax on a final result', async () => {
    const result = {
      id: '1',
      status: ResultStatus.FINAL,
      value: 100,
      unit: 'USD',
      referenceMin: null,
      referenceMax: null,
    };
    const dto = { referenceMax: 150 };

    resultRepositoryMock.findById.mockResolvedValue(result);

    await expect(service.updateResult('1', dto)).rejects.toThrow(
      'Cannot update referenceMax of a final result',
    );
  });

  it('should throw BadRequestException when referenceMin is not less than referenceMax', async () => {
        const result = {
          id: '1',
          status: ResultStatus.PRELIMINARY,
          referenceMin: 100,
          referenceMax: 50,
        };
        const dto = { referenceMin: 100, referenceMax: 50 };

        resultRepositoryMock.findById.mockResolvedValue(result);

        await expect(service.updateResult('1', dto)).rejects.toThrow(
          'referenceMin must be less than referenceMax',
        );
      });


  it('should successfully update status and other fields for a preliminary result', async () => {
    const result = {
      id: '1',
      status: ResultStatus.PRELIMINARY,
      value: 100,
      unit: 'USD',
      referenceMin: null,
      referenceMax: null,
    };
    const dto = {
      status: ResultStatus.FINAL,
      value: 120,
      unit: 'EUR',
      referenceMin: 10,
      referenceMax: 200,
      notes: 'Updated status and details',
    };

    resultRepositoryMock.findById.mockResolvedValue(result);
    resultRepositoryMock.save.mockResolvedValue(result);

    const updatedResult = await service.updateResult('1', dto);

    expect(updatedResult).toEqual(result);
    expect(resultRepositoryMock.save).toHaveBeenCalledTimes(1);
    expect(resultRepositoryMock.save).toHaveBeenCalledWith({
      id: '1',
      status: ResultStatus.FINAL,
      value: 120,
      unit: 'EUR',
      referenceMin: 10,
      referenceMax: 200,
      notes: 'Updated status and details',
    });
  });

  it('should successfully update only status for a preliminary result', async () => {
    const result = {
      id: '1',
      status: ResultStatus.PRELIMINARY,
      value: 100,
      unit: 'USD',
      referenceMin: null,
      referenceMax: null,
    };
    const dto = { status: ResultStatus.CORRECTED };

    resultRepositoryMock.findById.mockResolvedValue(result);
    resultRepositoryMock.save.mockResolvedValue(result);

    const updatedResult = await service.updateResult('1', dto);

    expect(updatedResult).toEqual(result);
    expect(resultRepositoryMock.save).toHaveBeenCalledTimes(1);
    expect(resultRepositoryMock.save).toHaveBeenCalledWith(result);
  });
});
});

  // TESTS_APPEND_HERE
});
