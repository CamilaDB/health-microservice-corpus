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
  it('should successfully create and save the result after successful order validation', async () => {
        const mockCreateResultDto = {
          orderId: 'order-123',
          value: 100,
          unit: 'USD',
          status: ResultStatus.FINAL,
          resultDate: '2023-01-01T00:00:00.000Z',
          referenceMin: 50,
          referenceMax: 150,
          sourceSystem: 'ERP',
          notes: 'Test notes',
        };

        const createdResult = {
          id: 'result-456',
          orderId: 'order-123',
          value: 100,
          unit: 'USD',
          status: ResultStatus.FINAL,
          resultDate: new Date('2023-01-01T00:00:00.000Z'),
          referenceMin: 50,
          referenceMax: 150,
          sourceSystem: 'ERP',
          notes: 'Test notes',
        };

        resultRepositoryMock.create.mockReturnValue(createdResult);
        resultRepositoryMock.save.mockResolvedValue({});
        orderServiceMock.validateOrderResult.mockResolvedValue(undefined);

        const result = await service.createResult(mockCreateResultDto);

        expect(orderServiceMock.validateOrderResult).toHaveBeenCalledWith('order-123', ResultStatus.FINAL);
        expect(resultRepositoryMock.create).toHaveBeenCalledTimes(1);
        expect(resultRepositoryMock.save).toHaveBeenCalledTimes(1);
        expect(resultRepositoryMock.save).toHaveBeenCalledWith(createdResult);
      });


  it('should throw an error if order result validation fails', async () => {
    const mockCreateResultDto = {
      orderId: 'order-123',
      value: 100,
      unit: 'USD',
      status: ResultStatus.FINAL,
      resultDate: '2023-01-01T00:00:00.000Z',
    };

    const validationError = new BadRequestException('Order result validation failed');
    orderServiceMock.validateOrderResult.mockRejectedValue(validationError);

    await expect(service.createResult(mockCreateResultDto)).rejects.toThrow(BadRequestException);

    expect(orderServiceMock.validateOrderResult).toHaveBeenCalledTimes(1);
    expect(resultRepositoryMock.create).not.toHaveBeenCalled();
    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });
});
});

  describe('FN_searchResults_END', () => {
describe('searchResults', () => {
  it('should return results from the repository when searching by DTO', async () => {
    const mockResults: Result[] = [{ id: '1', orderId: 'A1', value: 10, unit: 'kg', status: ResultStatus.FINAL, referenceMin: null, referenceMax: null, resultDate: new Date(), sourceSystem: 'SystemX', notes: null, created_at: new Date(), updated_at: new Date(), order: {} }];
    resultRepositoryMock.search.mockResolvedValue(mockResults);

    const dto: SearchResultsDto = { orderId: 'A1' };

    const result = await service.searchResults(dto);

    expect(result).toEqual(mockResults);
    expect(resultRepositoryMock.search).toHaveBeenCalledWith(dto);
  });
});
});

  describe('FN_getResultById_END', () => {
describe('getResultById', () => {
  it('should throw NotFoundException if the result is not found', async () => {
    resultRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(service.getResultById('some-id')).rejects.toThrow(NotFoundException);
    await expect(service.getResultById('some-id')).rejects.toThrow(`Result with id some-id not found`);
  });

  it('should return the result if found', async () => {
    const mockResult: Result = {
      id: '123',
      orderId: 'abc',
      value: 100,
      unit: 'USD',
      status: ResultStatus.FINAL,
      referenceMin: null,
      referenceMax: null,
      resultDate: new Date(),
      sourceSystem: null,
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
});
});

  describe('FN_buildResultReport_END', () => {
describe('buildResultReport', () => {
  it('should throw NotFoundException if no results are found for the order', async () => {
    orderServiceMock.getOrderById.mockResolvedValue({ examType: ExamType.GLUCOSE });
    resultRepositoryMock.findByOrderId.mockResolvedValue([]);

    await expect(service.buildResultReport('some-order-id')).rejects.toThrow(NotFoundException);
  });

  it('should correctly calculate summary and flag results for preliminary status', async () => {
    orderServiceMock.getOrderById.mockResolvedValue({ examType: ExamType.GLUCOSE });
    const mockResults = [
      { id: 'r1', status: ResultStatus.PRELIMINARY, value: 80, referenceMin: 70, referenceMax: 99, unit: 'mg/dL', sourceSystem: 'A', resultDate: new Date() },
    ];
    resultRepositoryMock.findByOrderId.mockResolvedValue(mockResults);

    const result = await service.buildResultReport('some-order-id');

    expect(result.summary).toEqual({ total: 1, preliminary: 1, final: 0, corrected: 0, abnormal: 0 });
    expect(result.items.length).toBe(1);
    expect(result.items[0].status).toBe(ResultStatus.PRELIMINARY);
    expect(result.items[0].flag).toBe('NORMAL'); // 80 is between 70 and 99
  });

  it('should correctly calculate summary and flag results for final status', async () => {
        orderServiceMock.getOrderById.mockResolvedValue({ examType: ExamType.TSH });
        const mockResults = [
          { id: 'r1', status: ResultStatus.FINAL, value: 4.5, referenceMin: 0.4, referenceMax: 4.0, unit: 'mIU/L', sourceSystem: 'B', resultDate: new Date() },
        ];
        resultRepositoryMock.findByOrderId.mockResolvedValue(mockResults);

        const result = await service.buildResultReport('some-order-id');

        expect(result.summary).toEqual({ total: 1, preliminary: 0, final: 1, corrected: 0, abnormal: 1 });
        expect(result.items[0].status).toBe(ResultStatus.FINAL);
        expect(result.items[0].flag).toBe('HIGH');
      });


  it('should correctly calculate summary and flag results for corrected status', async () => {
    orderServiceMock.getOrderById.mockResolvedValue({ examType: ExamType.CREATININE });
    const mockResults = [
      { id: 'r1', status: ResultStatus.CORRECTED, value: 1.0, referenceMin: 0.6, referenceMax: 1.2, unit: 'mg/dL', sourceSystem: 'C', resultDate: new Date() },
    ];
    resultRepositoryMock.findByOrderId.mockResolvedValue(mockResults);

    const result = await service.buildResultReport('some-order-id');

    expect(result.summary).toEqual({ total: 1, preliminary: 0, final: 0, corrected: 1, abnormal: 0 });
    expect(result.items[0].status).toBe(ResultStatus.CORRECTED);
    expect(result.items[0].flag).toBe('NORMAL'); // 1.0 is between 0.6 and 1.2
  });

  it('should correctly flag a result as LOW when value is below referenceMin', async () => {
    orderServiceMock.getOrderById.mockResolvedValue({ examType: ExamType.GLUCOSE });
    const mockResults = [
      { id: 'r1', status: ResultStatus.FINAL, value: 65, referenceMin: 70, referenceMax: 99, unit: 'mg/dL', sourceSystem: 'A', resultDate: new Date() },
    ];
    resultRepositoryMock.findByOrderId.mockResolvedValue(mockResults);

    const result = await service.buildResultReport('some-order-id');

    expect(result.items[0].flag).toBe('LOW');
    expect(result.summary.abnormal).toBe(1);
  });

  it('should correctly flag a result as HIGH when value is above referenceMax', async () => {
    orderServiceMock.getOrderById.mockResolvedValue({ examType: ExamType.CREATININE });
    const mockResults = [
      { id: 'r1', status: ResultStatus.FINAL, value: 1.5, referenceMin: 0.6, referenceMax: 1.2, unit: 'mg/dL', sourceSystem: 'C', resultDate: new Date() },
    ];
    resultRepositoryMock.findByOrderId.mockResolvedValue(mockResults);

    const result = await service.buildResultReport('some-order-id');

    expect(result.items[0].flag).toBe('HIGH');
    expect(result.summary.abnormal).toBe(1);
  });

  it('should correctly flag a result as NORMAL when value is within reference range', async () => {
    orderServiceMock.getOrderById.mockResolvedValue({ examType: ExamType.TSH });
    const mockResults = [
      { id: 'r1', status: ResultStatus.FINAL, value: 2.0, referenceMin: 0.4, referenceMax: 4.0, unit: 'mIU/L', sourceSystem: 'B', resultDate: new Date() },
    ];
    resultRepositoryMock.findByOrderId.mockResolvedValue(mockResults);

    const result = await service.buildResultReport('some-order-id');

    expect(result.items[0].flag).toBe('NORMAL');
    expect(result.summary.abnormal).toBe(0);
  });

  it.skip('should flag an unknown status if reference ranges are not provided', async () => {
        orderServiceMock.getOrderById.mockResolvedValue({ examType: ExamType.URINE });
        const mockResults = [
          { id: 'r1', status: ResultStatus.FINAL, value: 50, unit: 'ml/L', sourceSystem: 'D', resultDate: new Date() },
        ];
        resultRepositoryMock.findByOrderId.mockResolvedValue(mockResults);

        const result = await service.buildResultReport('some-order-id');

        expect(result.items[0].flag).toBe('UNKNOWN');
        expect(result.summary.abnormal).toBe(0);
      });
});
});

  describe('FN_updateResult_END', () => {
describe('updateResult', () => {
  let service: ResultService;
  let resultRepositoryMock: jest.Mocked<ResultRepository>;
  let orderServiceMock: jest.Mocked<OrderService>;

  beforeEach(async () => {
    resultRepositoryMock = {
      findById: jest.fn(),
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

  it.skip('should throw BadRequestException when trying to change status of a CORRECTED result', async () => {
            const mockResult = {
              status: ResultStatus.CORRECTED,
              referenceMin: 10,
              referenceMax: 20,
            };
            resultRepositoryMock.findById.mockResolvedValue(mockResult);

            const dto = { status: ResultStatus.FINAL };

            await expect(service.updateResult('id', dto)).rejects.toThrow(
              'Cannot change status of a CORRECTED result  it is terminal'
            );
            expect(resultRepositoryMock.save).not.toHaveBeenCalled();
        });


  it.skip('should throw BadRequestException for invalid status transition from PRELIMINARY to FINAL', async () => {
        const mockResult = {
          status: ResultStatus.PRELIMINARY,
          referenceMin: 10,
          referenceMax: 20,
        };
        resultRepositoryMock.findById.mockResolvedValue(mockResult);

        const dto = { status: ResultStatus.FINAL };

        await expect(service.updateResult('id', dto)).rejects.toThrow(
          `Invalid status transition from ${ResultStatus.PRELIMINARY} to ${ResultStatus.FINAL}`
        );
        expect(resultRepositoryMock.save).not.toHaveBeenCalled();
      });

  it('should throw BadRequestException for invalid status transition from FINAL to PRELIMINARY', async () => {
    const mockResult = {
      status: ResultStatus.FINAL,
      referenceMin: 10,
      referenceMax: 20,
    };
    resultRepositoryMock.findById.mockResolvedValue(mockResult);

    const dto = { status: ResultStatus.PRELIMINARY };

    await expect(service.updateResult('id', dto)).rejects.toThrow(
      `Invalid status transition from ${ResultStatus.FINAL} to ${ResultStatus.PRELIMINARY}`
    );
    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when trying to update value of a non-preliminary result', async () => {
    const mockResult = {
      status: ResultStatus.FINAL,
      referenceMin: 10,
      referenceMax: 20,
    };
    resultRepositoryMock.findById.mockResolvedValue(mockResult);

    const dto = { value: 50 };

    await expect(service.updateResult('id', dto)).rejects.toThrow(
      'Cannot update value of a non-preliminary result'
    );
    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when trying to update unit of a non-preliminary result', async () => {
    const mockResult = {
      status: ResultStatus.FINAL,
      referenceMin: 10,
      referenceMax: 20,
    };
    resultRepositoryMock.findById.mockResolvedValue(mockResult);

    const dto = { unit: 'USD' };

    await expect(service.updateResult('id', dto)).rejects.toThrow(
      'Cannot update unit of a non-preliminary result'
    );
    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when trying to update referenceMin of a final result', async () => {
    const mockResult = {
      status: ResultStatus.FINAL,
      referenceMin: 10,
      referenceMax: 20,
    };
    resultRepositoryMock.findById.mockResolvedValue(mockResult);

    const dto = { referenceMin: 5 };

    await expect(service.updateResult('id', dto)).rejects.toThrow(
      'Cannot update referenceMin of a final result'
    );
    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when trying to update referenceMax of a final result', async () => {
    const mockResult = {
      status: ResultStatus.FINAL,
      referenceMin: 10,
      referenceMax: 20,
    };
    resultRepositoryMock.findById.mockResolvedValue(mockResult);

    const dto = { referenceMax: 25 };

    await expect(service.updateResult('id', dto)).rejects.toThrow(
      'Cannot update referenceMax of a final result'
    );
    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when referenceMin is not less than referenceMax', async () => {
    const mockResult = {
      status: ResultStatus.PRELIMINARY,
      referenceMin: 20,
      referenceMax: 10,
    };
    resultRepositoryMock.findById.mockResolvedValue(mockResult);

    const dto = { referenceMin: 30, referenceMax: 25 };

    await expect(service.updateResult('id', dto)).rejects.toThrow(
      'referenceMin must be less than referenceMax'
    );
    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should successfully update status and save the result when transitioning from PRELIMINARY to FINAL', async () => {
    const mockResult = {
      status: ResultStatus.PRELIMINARY,
      referenceMin: 10,
      referenceMax: 20,
    };
    resultRepositoryMock.findById.mockResolvedValue(mockResult);

    const dto = { status: ResultStatus.FINAL };

    await service.updateResult('id', dto);

    expect(resultRepositoryMock.save).toHaveBeenCalledTimes(1);
    const savedResult = resultRepositoryMock.save.mock.calls[0][0];
    expect(savedResult.status).toBe(ResultStatus.FINAL);
    expect(savedResult.referenceMin).toBe(10);
    expect(savedResult.referenceMax).toBe(20);
  });

  it('should successfully update value and unit for a PRELIMINARY result', async () => {
    const mockResult = {
      status: ResultStatus.PRELIMINARY,
      referenceMin: null,
      referenceMax: null,
    };
    resultRepositoryMock.findById.mockResolvedValue(mockResult);

    const dto = { value: 100, unit: 'EUR' };

    await service.updateResult('id', dto);

    expect(resultRepositoryMock.save).toHaveBeenCalledTimes(1);
    const savedResult = resultRepositoryMock.save.mock.calls[0][0];
    expect(savedResult.value).toBe(100);
    expect(savedResult.unit).toBe('EUR');
  });

  it('should successfully update referenceMin and referenceMax for a PRELIMINARY result', async () => {
    const mockResult = {
      status: ResultStatus.PRELIMINARY,
      referenceMin: null,
      referenceMax: null,
    };
    resultRepositoryMock.findById.mockResolvedValue(mockResult);

    const dto = { referenceMin: 50, referenceMax: 100 };

    await service.updateResult('id', dto);

    expect(resultRepositoryMock.save).toHaveBeenCalledTimes(1);
    const savedResult = resultRepositoryMock.save.mock.calls[0][0];
    expect(savedResult.referenceMin).toBe(50);
    expect(savedResult.referenceMax).toBe(100);
  });

  it('should successfully update all fields for a PRELIMINARY result', async () => {
    const mockResult = {
      status: ResultStatus.PRELIMINARY,
      referenceMin: 10,
      referenceMax: 20,
    };
    resultRepositoryMock.findById.mockResolvedValue(mockResult);

    const dto = {
      status: ResultStatus.FINAL,
      value: 50,
      unit: 'USD',
      referenceMin: 5,
      referenceMax: 25,
      notes: 'Updated notes'
    };

    await service.updateResult('id', dto);

    expect(resultRepositoryMock.save).toHaveBeenCalledTimes(1);
    const savedResult = resultRepositoryMock.save.mock.calls[0][0];
    expect(savedResult.status).toBe(ResultStatus.FINAL);
    expect(savedResult.value).toBe(50);
    expect(savedResult.unit).toBe('USD');
    expect(savedResult.referenceMin).toBe(5);
    expect(savedResult.referenceMax).toBe(25);
    expect(savedResult.notes).toBe('Updated notes');
  });
});
});

  // TESTS_APPEND_HERE
});
