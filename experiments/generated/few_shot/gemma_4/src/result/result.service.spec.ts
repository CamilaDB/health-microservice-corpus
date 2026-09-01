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
  it('should validate the order result and save the created result', async () => {
    const dto = {
      orderId: 'order-123',
      status: ResultStatus.FINAL,
      value: 100,
      unit: 'USD',
      referenceMin: 90,
      resultDate: '2023-01-01T00:00:00.000Z',
      sourceSystem: 'ERP',
      notes: 'Test notes',
    };

    const createdResult = {
      id: 'result-456',
      orderId: 'order-123',
      value: 100,
      unit: 'USD',
      status: ResultStatus.FINAL,
      referenceMin: 90,
      referenceMax: null,
      resultDate: new Date('2023-01-01T00:00:00.000Z'),
      sourceSystem: 'ERP',
      notes: 'Test notes',
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    };

    orderServiceMock.validateOrderResult.mockResolvedValue(undefined);
    resultRepositoryMock.create.mockReturnValue(createdResult);
    resultRepositoryMock.save.mockResolvedValue(createdResult);

    const result = await service.createResult(dto);

    await expect(orderServiceMock.validateOrderResult).toHaveBeenCalledWith('order-123', ResultStatus.FINAL);
    expect(result).toBe(createdResult);
    expect(resultRepositoryMock.create).toHaveBeenCalledWith({
      orderId: 'order-123',
      status: ResultStatus.FINAL,
      value: 100,
      unit: 'USD',
      resultDate: new Date('2023-01-01T00:00:00.000Z'),
      referenceMin: 90,
      referenceMax: null,
      sourceSystem: 'ERP',
      notes: 'Test notes',
    });
    expect(resultRepositoryMock.save).toHaveBeenCalledWith(createdResult);
  });
});
});

  describe('FN_searchResults_END', () => {
describe('searchResults', () => {
  it('should return the results from the repository search', async () => {
    const mockResults: Result[] = [
      {
        id: '1',
        orderId: 'A1',
        value: 100,
        unit: 'mg/dl',
        status: ResultStatus.FINAL,
        resultDate: new Date(),
        sourceSystem: 'SystemX',
        notes: 'Normal result',
        created_at: new Date(),
        updated_at: new Date(),
        order: {},
      },
    ];

    resultRepositoryMock.search.mockResolvedValue(mockResults);

    const dto = {
      orderId: 'A1',
      status: ResultStatus.FINAL,
    };

    const result = await service.searchResults(dto);

    expect(result).toEqual(mockResults);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });
});
});

  describe('FN_getResultById_END', () => {
describe('getResultById', () => {
  it('should return the result when found', async () => {
    const mockResult = { id: '1', orderId: '100', value: 10, unit: 'USD', status: 'FINAL' };
    resultRepositoryMock.findById.mockResolvedValue(mockResult);

    const result = await service.getResultById('1');

    expect(result).toEqual(mockResult);
    expect(result).toBe(mockResult);
    expect(resultRepositoryMock.findById).toHaveBeenCalledWith('1');
  });

  it('should throw NotFoundException when result is not found', async () => {
    resultRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      service.getResultById('999')
    ).rejects.toThrow(NotFoundException);
    expect(
      service.getResultById('999')
    ).rejects.toThrow('Result with id 999 not found');
  });
});
});

  describe('FN_buildResultReport_END', () => {
describe('buildResultReport', () => {
  it('should throw NotFoundException when no results are found for the order', async () => {
    orderServiceMock.getOrderById.mockResolvedValue({ examType: ExamType.GLUCOSE });
    resultRepositoryMock.findByOrderId.mockResolvedValue([]);

    await expect(
      service.buildResultReport('order123'),
    ).rejects.toThrow(NotFoundException);
    expect(orderServiceMock.getOrderById).toHaveBeenCalledWith('order123');
    expect(resultRepositoryMock.findByOrderId).toHaveBeenCalledWith('order123');
  });

  it.skip('should correctly calculate summary and items when results are found', async () => {
            const orderId = 'order123';
            const order = { examType: ExamType.GLUCOSE };
            const results = [
              {
                id: 'r1',
                value: 80,
                unit: 'mg/dL',
                status: ResultStatus.PRELIMINARY,
                referenceMin: 70,
                referenceMax: 99,
                sourceSystem: 'labA',
                resultDate: new Date(),
              },
              {
                id: 'r2',
                value: 105,
                unit: 'mg/dL',
                status: ResultStatus.FINAL,
                referenceMin: 70,
                referenceMax: 99,
                sourceSystem: 'labB',
                resultDate: new Date(),
              },
              {
                id: 'r3',
                value: 110,
                unit: 'mg/dL',
                status: ResultStatus.CORRECTED,
                referenceMin: 70,
                referenceMax: 99,
                sourceSystem: 'labC',
                resultDate: new Date(),
              },
            ];

            orderServiceMock.getOrderById.mockResolvedValue(order);
            resultRepositoryMock.findByOrderId.mockResolvedValue(results);

            const report = await service.buildResultReport(orderId);

            expect(report.orderId).toBe(orderId);
            expect(report.examType).toBe(ExamType.GLUCOSE);
            expect(report.summary.total).toBe(3);
            expect(report.summary.preliminary).toBe(1);
            expect(report.summary.final).toBe(1);
            expect(report.summary.corrected).toBe(1);
            expect(report.summary.abnormal).toBe(2);
            expect(report.items.length).toBe(3);

            // Check item mapping for r1 (PRELIMINARY, falls within range)
            const item1 = report.items.find(item => item.resultId === 'r1');
            expect(item1.status).toBe(ResultStatus.PRELIMINARY);
            expect(item1.flag).toBe('NORMAL');
            expect(item1.referenceMin).toBe(70);
            expect(item1.referenceMax).toBe(99);
            expect(item1.value).toBe(80);

            // Check item mapping for r2 (FINAL, falls within range)
            const item2 = report.items.find(item => item.resultId === 'r2');
            expect(item2.status).toBe(ResultStatus.FINAL);
            expect(item2.flag).toBe('NORMAL');
            expect(item2.value).toBe(105);

            // Check item mapping for r3 (CORRECTED, is HIGH)
            const item3 = report.items.find(item => item.resultId === 'r3');
            expect(item3.status).toBe(ResultStatus.CORRECTED);
            expect(item3.flag).toBe('HIGH');
            expect(item3.value).toBe(110);
          });


  it('should correctly calculate abnormal count when values are outside reference ranges', async () => {
    const orderId = 'order456';
    const order = { examType: ExamType.CREATININE }; // Default range: min: 0.6, max: 1.2
    const results = [
      {
        id: 'r1',
        value: 0.5, // Below min (0.6) -> LOW
        unit: 'mmol/L',
        status: ResultStatus.FINAL,
        referenceMin: 0.6,
        referenceMax: 1.2,
        sourceSystem: 'labA',
        resultDate: new Date(),
      },
      {
        id: 'r2',
        value: 1.5, // Above max (1.2) -> HIGH
        unit: 'mmol/L',
        status: ResultStatus.FINAL,
        referenceMin: 0.6,
        referenceMax: 1.2,
        sourceSystem: 'labB',
        resultDate: new Date(),
      },
      {
        id: 'r3',
        value: 1.0, // Normal
        unit: 'mmol/L',
        status: ResultStatus.CORRECTED,
        referenceMin: 0.6,
        referenceMax: 1.2,
        sourceSystem: 'labC',
        resultDate: new Date(),
      },
    ];

    orderServiceMock.getOrderById.mockResolvedValue(order);
    resultRepositoryMock.findByOrderId.mockResolvedValue(results);

    const report = await service.buildResultReport(orderId);

    expect(report.summary.abnormal).toBe(2); // r1 (LOW) + r2 (HIGH)
    expect(report.items.find(item => item.resultId === 'r1')?.flag).toBe('LOW');
    expect(report.items.find(item => item.resultId === 'r2')?.flag).toBe('HIGH');
    expect(report.items.find(item => item.resultId === 'r3')?.flag).toBe('NORMAL');
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
    };
    resultRepositoryMock.findById.mockResolvedValue(result);

    const dto = { status: ResultStatus.FINAL };

    await expect(
      service.updateResult('1', dto),
    ).rejects.toThrow(BadRequestException);
    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException for invalid status transitions', async () => {
            const result = {
              id: '1',
              status: ResultStatus.PRELIMINARY,
            };

            // Mock the result retrieval to ensure the flow reaches status validation
            resultRepositoryMock.findById.mockResolvedValue(result);

            // Attempt invalid transition: PRELIMINARY to some other state (e.g., trying to jump directly)
            const dto = { status: ResultStatus.PRELIMINARY };

            await expect(
              service.updateResult('1', dto),
            ).rejects.toThrow(BadRequestException);
            expect(resultRepositoryMock.save).not.toHaveBeenCalled();
        });



  it.skip('should throw BadRequestException for invalid status transition from FINAL', async () => {
            accountMock.findById.mockResolvedValueOnce({
              id: '1',
              status: ResultStatus.FINAL,
            });

            const dto = { status: ResultStatus.PRELIMINARY };

            await expect(
              service.updateResult('1', dto),
            ).rejects.toThrow(BadRequestException);
            expect(resultRepositoryMock.save).not.toHaveBeenCalled();
        });


  it('should throw BadRequestException for invalid referenceMin/Max update on FINAL result', async () => {
        const result = {
          id: '1',
          status: ResultStatus.FINAL,
          referenceMin: 10,
          referenceMax: 20,
        };
        const dto = { referenceMin: 5 };

        resultRepositoryMock.findById.mockResolvedValue(result);

        await expect(
          service.updateResult('1', dto),
        ).rejects.toThrow(BadRequestException);
        expect(resultRepositoryMock.save).not.toHaveBeenCalled();
    });


  it('should throw BadRequestException when referenceMin is greater than referenceMax', async () => {
        const result = {
          id: '1',
          status: ResultStatus.PRELIMINARY,
          referenceMin: 20,
          referenceMax: 10,
        };
        const dto = { referenceMin: 25, referenceMax: 15 };

        resultRepositoryMock.findById.mockResolvedValueOnce(result);

        await expect(
          service.updateResult('1', dto),
        ).rejects.toThrow(BadRequestException);
        expect(resultRepositoryMock.save).not.toHaveBeenCalled();
    });


  it('should throw BadRequestException when updating value of a non-preliminary result', async () => {
        const result = {
          id: '1',
          status: ResultStatus.FINAL,
          value: 100,
        };
        const dto = { value: 150 };

        resultRepositoryMock.findById.mockResolvedValueOnce(result);

        await expect(
          service.updateResult('1', dto),
        ).rejects.toThrow(BadRequestException);
        expect(resultRepositoryMock.save).not.toHaveBeenCalled();
    });


  it('should throw BadRequestException when updating unit of a non-preliminary result', async () => {
        const result = {
          id: '1',
          status: ResultStatus.FINAL,
          unit: 'USD',
        };
        const dto = { unit: 'EUR' };

        // Mock the result retrieval to return the defined result object
        resultRepositoryMock.findById.mockResolvedValue(result);

        await expect(
          service.updateResult('1', dto),
        ).rejects.toThrow(BadRequestException);
        expect(resultRepositoryMock.save).not.toHaveBeenCalled();
    });


  it('should successfully update status and value for a PRELIMINARY result', async () => {
    const initialResult = {
      id: '1',
      status: ResultStatus.PRELIMINARY,
      value: 10,
    };
    resultRepositoryMock.findById.mockResolvedValue(initialResult);

    const dto = {
      status: ResultStatus.FINAL,
      value: 20,
    };
    resultRepositoryMock.save.mockResolvedValue({ id: '1', status: ResultStatus.FINAL, value: 20 });

    const result = await service.updateResult('1', dto);

    expect(result).toEqual({ id: '1', status: ResultStatus.FINAL, value: 20 });
    expect(resultRepositoryMock.save).toHaveBeenCalledWith({
      id: '1',
      status: ResultStatus.FINAL,
      value: 20,
    });
  });

  it('should successfully update value and notes for a PRELIMINARY result without reference fields', async () => {
    const initialResult = {
      id: '1',
      status: ResultStatus.PRELIMINARY,
      value: 10,
    };
    resultRepositoryMock.findById.mockResolvedValue(initialResult);

    const dto = {
      value: 15,
      notes: 'New value',
    };
    resultRepositoryMock.save.mockResolvedValue({ id: '1', status: ResultStatus.PRELIMINARY, value: 15, notes: 'New value' });

    const result = await service.updateResult('1', dto);

    expect(result).toEqual({ id: '1', status: ResultStatus.PRELIMINARY, value: 15, notes: 'New value' });
    expect(resultRepositoryMock.save).toHaveBeenCalledWith({
      id: '1',
      status: ResultStatus.PRELIMINARY,
      value: 15,
      notes: 'New value',
    });
  });

  it('should successfully update referenceMin and referenceMax for a PRELIMINARY result', async () => {
    const initialResult = {
      id: '1',
      status: ResultStatus.PRELIMINARY,
      referenceMin: 10,
      referenceMax: 20,
    };
    resultRepositoryMock.findById.mockResolvedValue(initialResult);

    const dto = {
      referenceMin: 5,
      referenceMax: 25,
    };
    resultRepositoryMock.save.mockResolvedValue({ id: '1', status: ResultStatus.PRELIMINARY, referenceMin: 5, referenceMax: 25 });

    const result = await service.updateResult('1', dto);

    expect(result).toEqual({ id: '1', status: ResultStatus.PRELIMINARY, referenceMin: 5, referenceMax: 25 });
    expect(resultRepositoryMock.save).toHaveBeenCalledWith({
      id: '1',
      status: ResultStatus.PRELIMINARY,
      referenceMin: 5,
      referenceMax: 25,
    });
  });

  it('should correctly handle null reference values when updating', async () => {
    const initialResult = {
      id: '1',
      status: ResultStatus.PRELIMINARY,
      referenceMin: null,
      referenceMax: null,
    };
    resultRepositoryMock.findById.mockResolvedValue(initialResult);

    const dto = {
      referenceMin: 10,
      referenceMax: null,
    };
    resultRepositoryMock.save.mockResolvedValue({ id: '1', status: ResultStatus.PRELIMINARY, referenceMin: 10, referenceMax: null });

    const result = await service.updateResult('1', dto);

    expect(result).toEqual({ id: '1', status: ResultStatus.PRELIMINARY, referenceMin: 10, referenceMax: null });
    expect(resultRepositoryMock.save).toHaveBeenCalledWith({
      id: '1',
      status: ResultStatus.PRELIMINARY,
      referenceMin: 10,
      referenceMax: null,
    });
  });
});
});

  // TESTS_APPEND_HERE
});
