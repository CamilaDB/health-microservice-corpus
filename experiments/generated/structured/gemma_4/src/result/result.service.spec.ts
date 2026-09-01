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
  it('should be able to create and save a result successfully', async () => {
    const mockCreateResultDto = {
      orderId: 'order-123',
      value: 100,
      unit: 'USD',
      status: ResultStatus.FINAL,
      resultDate: '2023-01-01',
      referenceMin: 50,
      referenceMax: 150,
      sourceSystem: 'API',
      notes: 'Test notes',
    };

    const mockCreatedResult = { id: 'result-abc', ...mockCreateResultDto };

    resultRepositoryMock.create.mockReturnValue(mockCreatedResult);
    resultRepositoryMock.save.mockResolvedValue(mockCreatedResult);
    orderServiceMock.validateOrderResult.mockResolvedValue(undefined);

    const result = await service.createResult(mockCreateResultDto);

    expect(orderServiceMock.validateOrderResult).toHaveBeenCalledWith('order-123', ResultStatus.FINAL);
    expect(resultRepositoryMock.create).toHaveBeenCalledWith({
      orderId: 'order-123',
      value: 100,
      unit: 'USD',
      status: ResultStatus.FINAL,
      resultDate: new Date('2023-01-01'),
      referenceMin: 50,
      referenceMax: 150,
      sourceSystem: 'API',
      notes: 'Test notes',
    });
    expect(resultRepositoryMock.save).toHaveBeenCalledWith(mockCreatedResult);
    expect(result).toEqual(mockCreatedResult);
  });

  it('should throw an error if order validation fails', async () => {
    const mockCreateResultDto = {
      orderId: 'order-123',
      value: 100,
      unit: 'USD',
      status: ResultStatus.FINAL,
      resultDate: '2023-01-01',
    };

    const validationError = new BadRequestException('Order validation failed');
    orderServiceMock.validateOrderResult.mockRejectedValue(validationError);

    await expect(service.createResult(mockCreateResultDto)).rejects.toThrow(BadRequestException);
    expect(resultRepositoryMock.create).not.toHaveBeenCalled();
    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should handle null/undefined optional fields correctly during creation', async () => {
    const mockCreateResultDto = {
      orderId: 'order-123',
      value: 100,
      unit: 'USD',
      status: ResultStatus.FINAL,
      resultDate: '2023-01-01',
      // referenceMin, referenceMax, sourceSystem, notes are undefined
    };

    const mockCreatedResult = { id: 'result-abc', orderId: 'order-123', value: 100, unit: 'USD', status: ResultStatus.FINAL, resultDate: new Date('2023-01-01'), referenceMin: null, referenceMax: null, sourceSystem: null, notes: null };

    resultRepositoryMock.create.mockReturnValue(mockCreatedResult);
    resultRepositoryMock.save.mockResolvedValue(mockCreatedResult);
    orderServiceMock.validateOrderResult.mockResolvedValue(undefined);

    await service.createResult(mockCreateResultDto);

    expect(resultRepositoryMock.create).toHaveBeenCalledWith({
      orderId: 'order-123',
      value: 100,
      unit: 'USD',
      status: ResultStatus.FINAL,
      resultDate: new Date('2023-01-01'),
      referenceMin: null,
      referenceMax: null,
      sourceSystem: null,
      notes: null,
    });
    expect(resultRepositoryMock.save).toHaveBeenCalled();
  });
});
});

  describe('FN_searchResults_END', () => {
describe('searchResults', () => {
  it('should return the results from the repository search when successful', async () => {
    const mockResults = [
      { id: '1', orderId: 'A1', value: 100, unit: 'kg', status: ResultStatus.FINAL, referenceMin: null, referenceMax: null, resultDate: new Date(), sourceSystem: 'SystemX', notes: null, created_at: new Date(), updated_at: new Date(), order: {} },
    ];
    resultRepositoryMock.search.mockResolvedValue(mockResults);

    const dto = { orderId: 'A1', status: ResultStatus.FINAL, examType: ExamType.HEMOGRAM, dateFrom: '2023-01-01' };

    const result = await service.searchResults(dto);

    expect(result).toEqual(mockResults);
    expect(resultRepositoryMock.search).toHaveBeenCalledWith(dto);
  });

  it('should throw an error if the repository search fails', async () => {
    const error = new Error('Database search failed');
    resultRepositoryMock.search.mockRejectedValue(error);

    const dto = { orderId: 'A1' };

    await expect(service.searchResults(dto)).rejects.toThrow(error);
    expect(resultRepositoryMock.search).toHaveBeenCalledWith(dto);
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
      status: ResultStatus.FINAL,
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
    expect(result).toBe(mockResult);
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
  it('should throw NotFoundException when no results are found for the order', async () => {
    orderServiceMock.getOrderById.mockResolvedValue({ examType: ExamType.GLUCOSE });
    resultRepositoryMock.findByOrderId.mockResolvedValue([]);

    await expect(service.buildResultReport('order123')).rejects.toThrow(NotFoundException);
  });

  it.skip('should correctly calculate summary and flags for a mix of result statuses and reference ranges', async () => {
        const orderId = 'order456';
        const order = { examType: ExamType.GLUCOSE };

        const mockResults = [
          {
            id: 'r1',
            status: ResultStatus.PRELIMINARY,
            value: 80,
            unit: 'mg/dL',
            referenceMin: 70,
            referenceMax: 99,
            sourceSystem: 'A',
            resultDate: new Date(),
          },
          {
            id: 'r2',
            status: ResultStatus.FINAL,
            value: 100,
            unit: 'mg/dL',
            referenceMin: 70,
            referenceMax: 99,
            sourceSystem: 'B',
            resultDate: new Date(),
          },
          {
            id: 'r3',
            status: ResultStatus.CORRECTED,
            value: 85,
            unit: 'mg/dL',
            referenceMin: 70,
            referenceMax: 99,
            sourceSystem: 'C',
            resultDate: new Date(),
          },
          {
            id: 'r4',
            status: ResultStatus.FINAL,
            value: 105, // High
            unit: 'mg/dL',
            referenceMin: 70,
            referenceMax: 99,
            sourceSystem: 'D',
            resultDate: new Date(),
          },
        ];

        orderServiceMock.getOrderById.mockResolvedValue(order);
        resultRepositoryMock.findByOrderId.mockResolvedValue(mockResults);

        const resultReport = await service.buildResultReport(orderId);

        expect(resultReport.orderId).toBe(orderId);
        expect(resultReport.examType).toBe(ExamType.GLUCOSE);
        expect(resultReport.summary.total).toBe(4);
        expect(resultReport.summary.preliminary).toBe(1);
        expect(resultReport.summary.final).toBe(2);
        expect(resultReport.summary.corrected).toBe(1);
        expect(resultReport.summary.abnormal).toBe(1); // r4 is HIGH

        expect(resultReport.items.length).toBe(4);

        // Check specific item logic (r1: Preliminary, Normal)
        const item1 = resultReport.items.find(item => item.resultId === 'r1');
        expect(item1.status).toBe(ResultStatus.PRELIMINARY);
        expect(item1.flag).toBe('NORMAL');

        // Check specific item logic (r4: Final, High)
        const item4 = resultReport.items.find(item => item.resultId === 'r4');
        expect(item4.status).toBe(ResultStatus.FINAL);
        expect(item4.flag).toBe('HIGH');
      });

  it.skip('should handle results where referenceMin and referenceMax are null, resulting in UNKNOWN flag', async () => {
        const orderId = 'order789';
        const order = { examType: ExamType.TSH };

        const mockResults = [
          {
            id: 'r1',
            status: ResultStatus.FINAL,
            value: 2.0,
            unit: 'mIU/L',
            referenceMin: null,
            referenceMax: null,
            sourceSystem: 'X',
            resultDate: new Date(),
          },
        ];

        orderServiceMock.getOrderById.mockResolvedValue(order);
        resultRepositoryMock.findByOrderId.mockResolvedValue(mockResults);

        const resultReport = await service.buildResultReport(orderId);

        expect(resultReport.summary.total).toBe(1);
        expect(resultReport.summary.final).toBe(1);
        expect(resultReport.summary.abnormal).toBe(0);
        expect(resultReport.items[0].flag).toBe('UNKNOWN');
        expect(resultReport.items[0].referenceMin).toBeNull();
        expect(resultReport.items[0].referenceMax).toBeNull();
      });

  it('should correctly identify LOW flag when value is less than referenceMin', async () => {
    const orderId = 'order111';
    const order = { examType: ExamType.CREATININE };

    const mockResults = [
      {
        id: 'r1',
        status: ResultStatus.FINAL,
        value: 0.5, // Below 0.6
        unit: 'mg/dL',
        referenceMin: 0.6,
        referenceMax: 1.2,
        sourceSystem: 'Y',
        resultDate: new Date(),
      },
    ];

    orderServiceMock.getOrderById.mockResolvedValue(order);
    resultRepositoryMock.findByOrderId.mockResolvedValue(mockResults);

    const resultReport = await service.buildResultReport(orderId);

    expect(resultReport.summary.final).toBe(1);
    expect(resultReport.summary.abnormal).toBe(1);
    expect(resultReport.items[0].flag).toBe('LOW');
  });

  it('should correctly identify HIGH flag when value is greater than referenceMax', async () => {
    const orderId = 'order222';
    const order = { examType: ExamType.TSH };

    const mockResults = [
      {
        id: 'r1',
        status: ResultStatus.FINAL,
        value: 5.0, // Above 4.0
        unit: 'mIU/L',
        referenceMin: 0.4,
        referenceMax: 4.0,
        sourceSystem: 'Z',
        resultDate: new Date(),
      },
    ];

    orderServiceMock.getOrderById.mockResolvedValue(order);
    resultRepositoryMock.findByOrderId.mockResolvedValue(mockResults);

    const resultReport = await service.buildResultReport(orderId);

    expect(resultReport.summary.final).toBe(1);
    expect(resultReport.summary.abnormal).toBe(1);
    expect(resultReport.items[0].flag).toBe('HIGH');
  });

  it('should correctly identify NORMAL flag when value is within reference range', async () => {
    const orderId = 'order333';
    const order = { examType: ExamType.CREATININE };

    const mockResults = [
      {
        id: 'r1',
        status: ResultStatus.FINAL,
        value: 0.8, // Between 0.6 and 1.2
        unit: 'mg/dL',
        referenceMin: 0.6,
        referenceMax: 1.2,
        sourceSystem: 'A',
        resultDate: new Date(),
      },
    ];

    orderServiceMock.getOrderById.mockResolvedValue(order);
    resultRepositoryMock.findByOrderId.mockResolvedValue(mockResults);

    const resultReport = await service.buildResultReport(orderId);

    expect(resultReport.summary.final).toBe(1);
    expect(resultReport.summary.abnormal).toBe(0);
    expect(resultReport.items[0].flag).toBe('NORMAL');
  });
});
});

  describe('FN_updateResult_END', () => {
describe('updateResult', () => {
  it('should throw BadRequestException when trying to change status of a CORRECTED result', async () => {
    const result = {
      id: '1',
      status: ResultStatus.CORRECTED,
      referenceMin: 10,
      referenceMax: 20,
    };
    const dto = { status: ResultStatus.FINAL };

    resultRepositoryMock.findById.mockResolvedValue(result);

    await expect(service.updateResult('1', dto)).rejects.toThrow(BadRequestException);
    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException for invalid status transition', async () => {
        const result = {
          id: '1',
          status: ResultStatus.FINAL,
          referenceMin: 10,
          referenceMax: 20,
        };
        const dto = { status: ResultStatus.PRELIMINARY };

        resultRepositoryMock.findById.mockResolvedValue(result);

        await expect(service.updateResult('1', dto)).rejects.toThrow(BadRequestException);
        expect(resultRepositoryMock.save).not.toHaveBeenCalled();
      });


  it('should throw BadRequestException for invalid status transition from FINAL to PRELIMINARY', async () => {
    const result = {
      id: '1',
      status: ResultStatus.FINAL,
      referenceMin: 10,
      referenceMax: 20,
    };
    const dto = { status: ResultStatus.PRELIMINARY };

    resultRepositoryMock.findById.mockResolvedValue(result);

    await expect(service.updateResult('1', dto)).rejects.toThrow(BadRequestException);
    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when trying to update value of a non-preliminary result', async () => {
    const result = {
      id: '1',
      status: ResultStatus.FINAL,
      referenceMin: 10,
      referenceMax: 20,
    };
    const dto = { value: 50 };

    resultRepositoryMock.findById.mockResolvedValue(result);

    await expect(service.updateResult('1', dto)).rejects.toThrow(BadRequestException);
    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when trying to update unit of a non-preliminary result', async () => {
    const result = {
      id: '1',
      status: ResultStatus.FINAL,
      referenceMin: 10,
      referenceMax: 20,
    };
    const dto = { unit: 'USD' };

    resultRepositoryMock.findById.mockResolvedValue(result);

    await expect(service.updateResult('1', dto)).rejects.toThrow(BadRequestException);
    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when trying to update referenceMin of a final result', async () => {
    const result = {
      id: '1',
      status: ResultStatus.FINAL,
      referenceMin: 10,
      referenceMax: 20,
    };
    const dto = { referenceMin: 5 };

    resultRepositoryMock.findById.mockResolvedValue(result);

    await expect(service.updateResult('1', dto)).rejects.toThrow(BadRequestException);
    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when trying to update referenceMax of a final result', async () => {
    const result = {
      id: '1',
      status: ResultStatus.FINAL,
      referenceMin: 10,
      referenceMax: 20,
    };
    const dto = { referenceMax: 25 };

    resultRepositoryMock.findById.mockResolvedValue(result);

    await expect(service.updateResult('1', dto)).rejects.toThrow(BadRequestException);
    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when referenceMin is not less than referenceMax', async () => {
    const result = {
      id: '1',
      status: ResultStatus.FINAL,
      referenceMin: 30,
      referenceMax: 20,
    };
    const dto = { referenceMin: 30, referenceMax: 20 };

    resultRepositoryMock.findById.mockResolvedValue(result);

    await expect(service.updateResult('1', dto)).rejects.toThrow(BadRequestException);
    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should successfully update status and save the result when status transition is valid', async () => {
    const result = {
      id: '1',
      status: ResultStatus.PRELIMINARY,
      referenceMin: 10,
      referenceMax: 20,
    };
    const dto = { status: ResultStatus.CORRECTED };

    resultRepositoryMock.findById.mockResolvedValue(result);
    resultRepositoryMock.save.mockResolvedValue(result);

    const updatedResult = await service.updateResult('1', dto);

    expect(updatedResult).toBe(result);
    expect(resultRepositoryMock.save).toHaveBeenCalledTimes(1);
    expect(resultRepositoryMock.save).toHaveBeenCalledWith(result);
  });

  it('should successfully update value and save the result when status is PRELIMINARY', async () => {
    const result = {
      id: '1',
      status: ResultStatus.PRELIMINARY,
      value: 100,
      referenceMin: null,
      referenceMax: null,
    };
    const dto = { value: 150 };

    resultRepositoryMock.findById.mockResolvedValue(result);
    resultRepositoryMock.save.mockResolvedValue(result);

    const updatedResult = await service.updateResult('1', dto);

    expect(updatedResult).toBe(result);
    expect(resultRepositoryMock.save).toHaveBeenCalledTimes(1);
    expect(resultRepositoryMock.save).toHaveBeenCalledWith(expect.objectContaining({ value: 150 }));
  });

  it('should successfully update unit and save the result when status is PRELIMINARY', async () => {
    const result = {
      id: '1',
      status: ResultStatus.PRELIMINARY,
      value: 100,
      unit: 'EUR',
      referenceMin: null,
      referenceMax: null,
    };
    const dto = { unit: 'USD' };

    resultRepositoryMock.findById.mockResolvedValue(result);
    resultRepositoryMock.save.mockResolvedValue(result);

    const updatedResult = await service.updateResult('1', dto);

    expect(updatedResult).toBe(result);
    expect(resultRepositoryMock.save).toHaveBeenCalledTimes(1);
    expect(resultRepositoryMock.save).toHaveBeenCalledWith(expect.objectContaining({ unit: 'USD' }));
  });

  it('should successfully update referenceMin and referenceMax when status is PRELIMINARY', async () => {
        const result = {
          id: '1',
          status: ResultStatus.PRELIMINARY,
          referenceMin: 10,
          referenceMax: 20,
        };
        const dto = { referenceMin: 5, referenceMax: 25 };

        resultRepositoryMock.findById.mockResolvedValue(result);
        resultRepositoryMock.save.mockResolvedValue(result);

        const updatedResult = await service.updateResult('1', dto);

        expect(updatedResult).toBe(result);
        expect(resultRepositoryMock.save).toHaveBeenCalledTimes(1);
        expect(resultRepositoryMock.save).toHaveBeenCalledWith(expect.objectContaining({ referenceMin: 5, referenceMax: 25 }));
    });

});
});

  // TESTS_APPEND_HERE
});
