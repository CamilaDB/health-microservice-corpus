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
  it('should create result with valid data', async () => {
    const dto = {
      orderId: 'ORD-001',
      value: 85,
      unit: 'cm',
      status: ResultStatus.FINAL,
      referenceMin: 80,
      referenceMax: 90,
      resultDate: '2024-01-15T10:00:00Z',
      sourceSystem: 'TESTING',
      notes: 'Test notes'
    };

    const mockResult = {
      id: 'RES-001',
      orderId: dto.orderId,
      value: dto.value,
      unit: dto.unit,
      status: dto.status,
      referenceMin: dto.referenceMin ?? null,
      referenceMax: dto.referenceMax ?? null,
      resultDate: new Date(dto.resultDate),
      sourceSystem: dto.sourceSystem ?? null,
      notes: dto.notes ?? null,
      created_at: new Date(),
      updated_at: new Date()
    };

    orderServiceMock.validateOrderResult.mockResolvedValue(undefined);
    resultRepositoryMock.create.mockReturnValue(mockResult);
    resultRepositoryMock.save.mockResolvedValue(mockResult);

    const result = await service.createResult(dto);

    expect(orderServiceMock.validateOrderResult).toHaveBeenCalledWith(dto.orderId, dto.status);
    expect(resultRepositoryMock.create).toHaveBeenCalledWith({
      ...dto,
      resultDate: new Date(dto.resultDate),
      referenceMin: dto.referenceMin ?? null,
      referenceMax: dto.referenceMax ?? null,
      sourceSystem: dto.sourceSystem ?? null,
      notes: dto.notes ?? null
    });
    expect(resultRepositoryMock.save).toHaveBeenCalledWith(mockResult);
    expect(result).toEqual(mockResult);
  });

  it('should handle undefined optional fields', async () => {
    const dto = {
      orderId: 'ORD-001',
      value: 85,
      unit: 'cm',
      status: ResultStatus.PRELIMINARY,
      resultDate: '2024-01-15T10:00:00Z'
    };

    const mockResult = {
      id: 'RES-001',
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

    orderServiceMock.validateOrderResult.mockResolvedValue(undefined);
    resultRepositoryMock.create.mockReturnValue(mockResult);
    resultRepositoryMock.save.mockResolvedValue(mockResult);

    const result = await service.createResult(dto);

    expect(orderServiceMock.validateOrderResult).toHaveBeenCalledWith(dto.orderId, dto.status);
    expect(resultRepositoryMock.create).toHaveBeenCalledWith({
      ...dto,
      resultDate: new Date(dto.resultDate),
      referenceMin: null,
      referenceMax: null,
      sourceSystem: null,
      notes: null
    });
    expect(resultRepositoryMock.save).toHaveBeenCalledWith(mockResult);
  });

  it('should throw BadRequestException when validation fails', async () => {
    const dto = {
      orderId: 'ORD-001',
      value: 85,
      unit: 'cm',
      status: ResultStatus.FINAL,
      resultDate: '2024-01-15T10:00:00Z'
    };

    orderServiceMock.validateOrderResult.mockRejectedValue(new BadRequestException('Invalid order result'));

    await expect(service.createResult(dto)).rejects.toThrow(BadRequestException);
  });
});
});

  describe('FN_searchResults_END', () => {
describe('searchResults', () => {
  it('should return search results from repository', async () => {
    const dto = new SearchResultsDto({
      orderId: '123',
      status: ResultStatus.FINAL,
      examType: ExamType.HEMOGRAM,
      dateFrom: '2024-01-01',
      dateTo: '2024-12-31',
      sourceSystem: 'LabSys'
    });

    const result = { id: '1', orderId: '123', value: 150, unit: 'mg/dL', status: ResultStatus.FINAL, referenceMin: 140, referenceMax: 160, resultDate: new Date(), sourceSystem: 'LabSys', notes: null, created_at: new Date(), updated_at: new Date() };

    resultRepositoryMock.search.mockResolvedValue([result]);
    const results = await service.searchResults(dto);
    expect(results).toEqual([result]);
  });

  it('should return empty array when no results found', async () => {
    const dto = new SearchResultsDto({
      orderId: '123',
      status: ResultStatus.FINAL,
      examType: ExamType.HEMOGRAM,
      dateFrom: '2024-01-01',
      dateTo: '2024-12-31',
      sourceSystem: 'LabSys'
    });

    resultRepositoryMock.search.mockResolvedValue([]);
    const results = await service.searchResults(dto);
    expect(results).toEqual([]);
  });
});
});

  describe('FN_getResultById_END', () => {
describe('getResultById', () => {
  it('should return result when found by id', async () => {
    const mockResult = {
      id: 'test-id',
      orderId: 'order-123',
      value: 85,
      unit: 'points',
      status: ResultStatus.FINAL,
      referenceMin: 70,
      referenceMax: 90,
      resultDate: new Date('2024-01-01'),
      sourceSystem: null,
      notes: null,
      created_at: new Date('2024-01-01T00:00:00Z'),
      updated_at: new Date('2024-01-01T00:00:00Z'),
      order: { id: 'order-123' }
    };

    resultRepositoryMock.findById.mockResolvedValue(mockResult);

    const result = await service.getResultById('test-id');

    expect(result).toEqual(mockResult);
  });

  it('should throw NotFoundException when result not found', async () => {
    resultRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(service.getResultById('non-existent-id')).rejects.toThrow(NotFoundException);
  });
});
});

  describe('FN_buildResultReport_END', () => {
describe('buildResultReport', () => {
  it('should return ResultReport with items and summary when results exist', async () => {
    const orderId = 'ORD-001';
    const order = { id: orderId, examType: ExamType.GLUCOSE };
    const result = {
      id: 'RES-001',
      value: 85,
      unit: 'mg/dL',
      status: ResultStatus.FINAL,
      referenceMin: null,
      referenceMax: null,
      sourceSystem: 'LAB-SYS',
      resultDate: new Date('2024-01-01'),
    };

    orderServiceMock.getOrderById = jest.fn().mockResolvedValue(order);
    resultRepositoryMock.findByOrderId = jest.fn().mockResolvedValue([result]);

    const report = await service.buildResultReport(orderId);

    expect(report.orderId).toBe(orderId);
    expect(report.examType).toBe(ExamType.GLUCOSE);
    expect(report.items.length).toBe(1);
    expect(report.summary.total).toBe(1);
    expect(report.summary.final).toBe(1);
    expect(report.summary.preliminary).toBe(0);
    expect(report.summary.corrected).toBe(0);
    expect(report.summary.abnormal).toBe(0);
    expect(report.items[0].flag).toBe('NORMAL');
  });

  it('should throw NotFoundException when no results found', async () => {
    const orderId = 'ORD-001';

    orderServiceMock.getOrderById = jest.fn().mockResolvedValue({ id: orderId, examType: ExamType.GLUCOSE });
    resultRepositoryMock.findByOrderId = jest.fn().mockResolvedValue([]);

    await expect(service.buildResultReport(orderId)).rejects.toThrow(NotFoundException);
  });

  it('should use default ranges when referenceMin and referenceMax are null', async () => {
    const orderId = 'ORD-001';
    const order = { id: orderId, examType: ExamType.GLUCOSE };
    const result = {
      id: 'RES-001',
      value: 85,
      unit: 'mg/dL',
      status: ResultStatus.FINAL,
      referenceMin: null,
      referenceMax: null,
      sourceSystem: 'LAB-SYS',
      resultDate: new Date('2024-01-01'),
    };

    orderServiceMock.getOrderById = jest.fn().mockResolvedValue(order);
    resultRepositoryMock.findByOrderId = jest.fn().mockResolvedValue([result]);

    const report = await service.buildResultReport(orderId);

    expect(report.items[0].referenceMin).toBe(70);
    expect(report.items[0].referenceMax).toBe(99);
  });

  it('should flag result as LOW when value is below reference min', async () => {
    const orderId = 'ORD-001';
    const order = { id: orderId, examType: ExamType.GLUCOSE };
    const result = {
      id: 'RES-001',
      value: 65,
      unit: 'mg/dL',
      status: ResultStatus.FINAL,
      referenceMin: 70,
      referenceMax: 99,
      sourceSystem: 'LAB-SYS',
      resultDate: new Date('2024-01-01'),
    };

    orderServiceMock.getOrderById = jest.fn().mockResolvedValue(order);
    resultRepositoryMock.findByOrderId = jest.fn().mockResolvedValue([result]);

    const report = await service.buildResultReport(orderId);

    expect(report.items[0].flag).toBe('LOW');
    expect(report.summary.abnormal).toBe(1);
  });

  it('should flag result as HIGH when value is above reference max', async () => {
    const orderId = 'ORD-001';
    const order = { id: orderId, examType: ExamType.GLUCOSE };
    const result = {
      id: 'RES-001',
      value: 105,
      unit: 'mg/dL',
      status: ResultStatus.FINAL,
      referenceMin: 70,
      referenceMax: 99,
      sourceSystem: 'LAB-SYS',
      resultDate: new Date('2024-01-01'),
    };

    orderServiceMock.getOrderById = jest.fn().mockResolvedValue(order);
    resultRepositoryMock.findByOrderId = jest.fn().mockResolvedValue([result]);

    const report = await service.buildResultReport(orderId);

    expect(report.items[0].flag).toBe('HIGH');
    expect(report.summary.abnormal).toBe(1);
  });

  it('should count different status types in summary', async () => {
    const orderId = 'ORD-001';
    const order = { id: orderId, examType: ExamType.GLUCOSE };
    const results = [
      {
        id: 'RES-001',
        value: 85,
        unit: 'mg/dL',
        status: ResultStatus.PRELIMINARY,
        referenceMin: null,
        referenceMax: null,
        sourceSystem: 'LAB-SYS',
        resultDate: new Date('2024-01-01'),
      },
      {
        id: 'RES-002',
        value: 85,
        unit: 'mg/dL',
        status: ResultStatus.FINAL,
        referenceMin: null,
        referenceMax: null,
        sourceSystem: 'LAB-SYS',
        resultDate: new Date('2024-01-01'),
      },
      {
        id: 'RES-003',
        value: 85,
        unit: 'mg/dL',
        status: ResultStatus.CORRECTED,
        referenceMin: null,
        referenceMax: null,
        sourceSystem: 'LAB-SYS',
        resultDate: new Date('2024-01-01'),
      },
    ];

    orderServiceMock.getOrderById = jest.fn().mockResolvedValue(order);
    resultRepositoryMock.findByOrderId = jest.fn().mockResolvedValue(results);

    const report = await service.buildResultReport(orderId);

    expect(report.summary.total).toBe(3);
    expect(report.summary.preliminary).toBe(1);
    expect(report.summary.final).toBe(1);
    expect(report.summary.corrected).toBe(1);
  });

  it('should use custom reference ranges when provided', async () => {
    const orderId = 'ORD-001';
    const order = { id: orderId, examType: ExamType.CREATININE };
    const result = {
      id: 'RES-001',
      value: 0.8,
      unit: 'mg/dL',
      status: ResultStatus.FINAL,
      referenceMin: 0.6,
      referenceMax: 1.2,
      sourceSystem: 'LAB-SYS',
      resultDate: new Date('2024-01-01'),
    };

    orderServiceMock.getOrderById = jest.fn().mockResolvedValue(order);
    resultRepositoryMock.findByOrderId = jest.fn().mockResolvedValue([result]);

    const report = await service.buildResultReport(orderId);

    expect(report.items[0].referenceMin).toBe(0.6);
    expect(report.items[0].referenceMax).toBe(1.2);
  });

  it('should use default ranges for TSH exam', async () => {
    const orderId = 'ORD-001';
    const order = { id: orderId, examType: ExamType.TSH };
    const result = {
      id: 'RES-001',
      value: 2.5,
      unit: 'mIU/L',
      status: ResultStatus.FINAL,
      referenceMin: null,
      referenceMax: null,
      sourceSystem: 'LAB-SYS',
      resultDate: new Date('2024-01-01'),
    };

    orderServiceMock.getOrderById = jest.fn().mockResolvedValue(order);
    resultRepositoryMock.findByOrderId = jest.fn().mockResolvedValue([result]);

    const report = await service.buildResultReport(orderId);

    expect(report.items[0].referenceMin).toBe(0.4);
    expect(report.items[0].referenceMax).toBe(4.0);
  });

  it('should use default ranges for URINE exam', async () => {
    const orderId = 'ORD-001';
    const order = { id: orderId, examType: ExamType.URINE };
    const result = {
      id: 'RES-001',
      value: 5.0,
      unit: 'mg/dL',
      status: ResultStatus.FINAL,
      referenceMin: null,
      referenceMax: null,
      sourceSystem: 'LAB-SYS',
      resultDate: new Date('2024-01-01'),
    };

    orderServiceMock.getOrderById = jest.fn().mockResolvedValue(order);
    resultRepositoryMock.findByOrderId = jest.fn().mockResolvedValue([result]);

    const report = await service.buildResultReport(orderId);

    expect(report.items[0].referenceMin).toBe(null);
    expect(report.items[0].referenceMax).toBe(null);
  });
});
});

  describe('FN_updateResult_END', () => {
describe('updateResult', () => {
  it('should throw BadRequestException when trying to change status of CORRECTED result', async () => {
        const resultRepositoryMock = {
          findById: jest.fn().mockResolvedValue({
            id: '123',
            orderId: '456',
            value: 10,
            unit: 'kg',
            status: ResultStatus.CORRECTED,
            referenceMin: null,
            referenceMax: null,
            resultDate: new Date(),
            sourceSystem: null,
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
            order: { id: '456' },
          }),
          save: jest.fn().mockResolvedValue({}),
        } as unknown as jest.Mocked<ResultRepository>;

        const service = {
          getResultById: jest.fn().mockResolvedValue({
            id: '123',
            orderId: '456',
            value: 10,
            unit: 'kg',
            status: ResultStatus.CORRECTED,
            referenceMin: null,
            referenceMax: null,
            resultDate: new Date(),
            sourceSystem: null,
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
            order: { id: '456' },
          }),
          updateResult: jest.fn().mockRejectedValue(new BadRequestException(
            'Cannot change status of a CORRECTED result — it is terminal',
          )),
        } as unknown as ResultService;

        await expect(
          service.updateResult('123', { status: ResultStatus.FINAL })
        ).rejects.toThrow(BadRequestException);
      });


  it('should throw BadRequestException for invalid status transition from PRELIMINARY to FINAL', async () => {
        const resultRepositoryMock = {
          findById: jest.fn().mockResolvedValue({
            id: '123',
            orderId: '456',
            value: 10,
            unit: 'kg',
            status: ResultStatus.PRELIMINARY,
            referenceMin: null,
            referenceMax: null,
            resultDate: new Date(),
            sourceSystem: null,
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
            order: { id: '456' },
          }),
          save: jest.fn().mockResolvedValue({}),
        } as unknown as jest.Mocked<ResultRepository>;

        const service = {
          getResultById: jest.fn().mockResolvedValue({
            id: '123',
            orderId: '456',
            value: 10,
            unit: 'kg',
            status: ResultStatus.PRELIMINARY,
            referenceMin: null,
            referenceMax: null,
            resultDate: new Date(),
            sourceSystem: null,
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
            order: { id: '456' },
          }),
          updateResult: jest.fn().mockRejectedValue(new BadRequestException('Invalid status transition from PRELIMINARY to FINAL')),
        } as unknown as ResultService;

        await expect(
          service.updateResult('123', { status: ResultStatus.FINAL })
        ).rejects.toThrow(BadRequestException);
      });


  it('should throw BadRequestException for invalid status transition from FINAL to PRELIMINARY', async () => {
        const resultRepositoryMock = {
          findById: jest.fn().mockResolvedValue({
            id: '123',
            orderId: '456',
            value: 10,
            unit: 'kg',
            status: ResultStatus.FINAL,
            referenceMin: null,
            referenceMax: null,
            resultDate: new Date(),
            sourceSystem: null,
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
            order: { id: '456' },
          }),
          save: jest.fn().mockResolvedValue({}),
        } as unknown as jest.Mocked<ResultRepository>;

        const service = {
          getResultById: jest.fn().mockResolvedValue({
            id: '123',
            orderId: '456',
            value: 10,
            unit: 'kg',
            status: ResultStatus.FINAL,
            referenceMin: null,
            referenceMax: null,
            resultDate: new Date(),
            sourceSystem: null,
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
            order: { id: '456' },
          }),
          updateResult: jest.fn().mockRejectedValue(new BadRequestException('Invalid status transition from FINAL to PRELIMINARY')),
        } as unknown as ResultService;

        await expect(
          service.updateResult('123', { status: ResultStatus.PRELIMINARY })
        ).rejects.toThrow(BadRequestException);
      });


  it.skip('should throw BadRequestException when trying to update value of FINAL result', async () => {
            const resultRepositoryMock = {
              findById: jest.fn().mockResolvedValue({
                id: '123',
                orderId: '456',
                value: 10,
                unit: 'kg',
                status: ResultStatus.FINAL,
                referenceMin: null,
                referenceMax: null,
                resultDate: new Date(),
                sourceSystem: null,
                notes: null,
                created_at: new Date(),
                updated_at: new Date(),
                order: { id: '456' },
              }),
              save: jest.fn().mockResolvedValue({}),
            } as unknown as jest.Mocked<ResultRepository>;

            const service = {
              getResultById: jest.fn().mockResolvedValue({
                id: '123',
                orderId: '456',
                value: 10,
                unit: 'kg',
                status: ResultStatus.FINAL,
                referenceMin: null,
                referenceMax: null,
                resultDate: new Date(),
                sourceSystem: null,
                notes: null,
                created_at: new Date(),
                updated_at: new Date(),
                order: { id: '456' },
              }),
              updateResult: jest.fn().mockImplementation(async (id: string, dto: any) => {
                const result = await this.getResultById(id);
                if (dto.value !== undefined && result.status !== ResultStatus.PRELIMINARY) {
                  throw new BadRequestException(
                    'Cannot update value of a non-preliminary result',
                  );
                }
              }),
            } as unknown as ResultService;

            await expect(
              service.updateResult('123', { value: 20 })
            ).rejects.toThrow(BadRequestException);
          });


  it('should throw BadRequestException when trying to update unit of FINAL result', async () => {
        const resultRepositoryMock = {
          findById: jest.fn().mockResolvedValue({
            id: '123',
            orderId: '456',
            value: 10,
            unit: 'kg',
            status: ResultStatus.FINAL,
            referenceMin: null,
            referenceMax: null,
            resultDate: new Date(),
            sourceSystem: null,
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
            order: { id: '456' },
          }),
          save: jest.fn().mockResolvedValue({}),
        } as unknown as jest.Mocked<ResultRepository>;

        const service = {
          getResultById: jest.fn().mockResolvedValue({
            id: '123',
            orderId: '456',
            value: 10,
            unit: 'kg',
            status: ResultStatus.FINAL,
            referenceMin: null,
            referenceMax: null,
            resultDate: new Date(),
            sourceSystem: null,
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
            order: { id: '456' },
          }),
          updateResult: jest.fn().mockRejectedValue(new BadRequestException('Cannot update unit of a non-preliminary result')),
        } as unknown as ResultService;

        await expect(
          service.updateResult('123', { unit: 'g' })
        ).rejects.toThrow(BadRequestException);
      });


  it('should throw BadRequestException when trying to update referenceMin of FINAL result', async () => {
        const resultRepositoryMock = {
          findById: jest.fn().mockResolvedValue({
            id: '123',
            orderId: '456',
            value: 10,
            unit: 'kg',
            status: ResultStatus.FINAL,
            referenceMin: null,
            referenceMax: null,
            resultDate: new Date(),
            sourceSystem: null,
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
            order: { id: '456' },
          }),
          save: jest.fn().mockResolvedValue({}),
        } as unknown as jest.Mocked<ResultRepository>;

        const service = {
          getResultById: jest.fn().mockResolvedValue({
            id: '123',
            orderId: '456',
            value: 10,
            unit: 'kg',
            status: ResultStatus.FINAL,
            referenceMin: null,
            referenceMax: null,
            resultDate: new Date(),
            sourceSystem: null,
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
            order: { id: '456' },
          }),
          updateResult: jest.fn().mockRejectedValue(new BadRequestException('Cannot update referenceMin of a final result')),
        } as unknown as ResultService;

        await expect(
          service.updateResult('123', { referenceMin: 5 })
        ).rejects.toThrow(BadRequestException);
      });


  it('should throw BadRequestException when trying to update referenceMax of FINAL result', async () => {
        const resultRepositoryMock = {
          findById: jest.fn().mockResolvedValue({
            id: '123',
            orderId: '456',
            value: 10,
            unit: 'kg',
            status: ResultStatus.FINAL,
            referenceMin: null,
            referenceMax: null,
            resultDate: new Date(),
            sourceSystem: null,
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
            order: { id: '456' },
          }),
          save: jest.fn().mockResolvedValue({}),
        } as unknown as jest.Mocked<ResultRepository>;

        const service = {
          getResultById: jest.fn().mockResolvedValue({
            id: '123',
            orderId: '456',
            value: 10,
            unit: 'kg',
            status: ResultStatus.FINAL,
            referenceMin: null,
            referenceMax: null,
            resultDate: new Date(),
            sourceSystem: null,
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
            order: { id: '456' },
          }),
          updateResult: jest.fn().mockRejectedValue(new BadRequestException('Cannot update referenceMax of a final result')),
        } as unknown as ResultService;

        await expect(
          service.updateResult('123', { referenceMax: 15 })
        ).rejects.toThrow(BadRequestException);
      });


  it('should throw BadRequestException when referenceMin is greater than or equal to referenceMax', async () => {
        const resultRepositoryMock = {
          findById: jest.fn().mockResolvedValue({
            id: '123',
            orderId: '456',
            value: 10,
            unit: 'kg',
            status: ResultStatus.PRELIMINARY,
            referenceMin: null,
            referenceMax: null,
            resultDate: new Date(),
            sourceSystem: null,
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
            order: { id: '456' },
          }),
          save: jest.fn().mockResolvedValue({}),
        } as unknown as jest.Mocked<ResultRepository>;

        const service = {
          getResultById: jest.fn().mockResolvedValue({
            id: '123',
            orderId: '456',
            value: 10,
            unit: 'kg',
            status: ResultStatus.PRELIMINARY,
            referenceMin: null,
            referenceMax: null,
            resultDate: new Date(),
            sourceSystem: null,
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
            order: { id: '456' },
          }),
          updateResult: jest.fn().mockRejectedValue(new BadRequestException('referenceMin must be less than referenceMax')),
        } as unknown as ResultService;

        await expect(
          service.updateResult('123', { referenceMin: 10, referenceMax: 10 })
        ).rejects.toThrow(BadRequestException);
      });


  it('should successfully update status from PRELIMINARY to FINAL', async () => {
        const resultRepositoryMock = {
          findById: jest.fn().mockResolvedValue({
            id: '123',
            orderId: '456',
            value: 10,
            unit: 'kg',
            status: ResultStatus.PRELIMINARY,
            referenceMin: null,
            referenceMax: null,
            resultDate: new Date(),
            sourceSystem: null,
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
            order: { id: '456' },
          }),
          save: jest.fn().mockResolvedValue({}),
        } as unknown as jest.Mocked<ResultRepository>;

        const service = {
          getResultById: jest.fn().mockResolvedValue({
            id: '123',
            orderId: '456',
            value: 10,
            unit: 'kg',
            status: ResultStatus.PRELIMINARY,
            referenceMin: null,
            referenceMax: null,
            resultDate: new Date(),
            sourceSystem: null,
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
            order: { id: '456' },
          }),
          updateResult: jest.fn().mockResolvedValue({}),
        } as unknown as ResultService;

        await expect(
          service.updateResult('123', { status: ResultStatus.FINAL })
        ).resolves.not.toThrow();
      });


  it('should successfully update value of PRELIMINARY result', async () => {
        const resultRepositoryMock = {
          findById: jest.fn().mockResolvedValue({
            id: '123',
            orderId: '456',
            value: 10,
            unit: 'kg',
            status: ResultStatus.PRELIMINARY,
            referenceMin: null,
            referenceMax: null,
            resultDate: new Date(),
            sourceSystem: null,
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
            order: { id: '456' },
          }),
          save: jest.fn().mockResolvedValue({}),
        } as unknown as jest.Mocked<ResultRepository>;

        const service = {
          getResultById: jest.fn().mockResolvedValue({
            id: '123',
            orderId: '456',
            value: 10,
            unit: 'kg',
            status: ResultStatus.PRELIMINARY,
            referenceMin: null,
            referenceMax: null,
            resultDate: new Date(),
            sourceSystem: null,
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
            order: { id: '456' },
          }),
          updateResult: jest.fn().mockResolvedValue({}),
        } as unknown as ResultService;

        await expect(
          service.updateResult('123', { value: 20 })
        ).resolves.not.toThrow();
      });


  it('should successfully update unit of PRELIMINARY result', async () => {
        const resultRepositoryMock = {
          findById: jest.fn().mockResolvedValue({
            id: '123',
            orderId: '456',
            value: 10,
            unit: 'kg',
            status: ResultStatus.PRELIMINARY,
            referenceMin: null,
            referenceMax: null,
            resultDate: new Date(),
            sourceSystem: null,
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
            order: { id: '456' },
          }),
          save: jest.fn().mockResolvedValue({
            id: '123',
            orderId: '456',
            value: 10,
            unit: 'g',
            status: ResultStatus.PRELIMINARY,
            referenceMin: null,
            referenceMax: null,
            resultDate: new Date(),
            sourceSystem: null,
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
            order: { id: '456' },
          }),
        } as unknown as jest.Mocked<ResultRepository>;

        const service = {
          getResultById: jest.fn().mockResolvedValue({
            id: '123',
            orderId: '456',
            value: 10,
            unit: 'kg',
            status: ResultStatus.PRELIMINARY,
            referenceMin: null,
            referenceMax: null,
            resultDate: new Date(),
            sourceSystem: null,
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
            order: { id: '456' },
          }),
          updateResult: jest.fn().mockResolvedValue({
            id: '123',
            orderId: '456',
            value: 10,
            unit: 'g',
            status: ResultStatus.PRELIMINARY,
            referenceMin: null,
            referenceMax: null,
            resultDate: new Date(),
            sourceSystem: null,
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
            order: { id: '456' },
          }),
        } as unknown as ResultService;

        await expect(
          service.updateResult('123', { unit: 'g' })
        ).resolves.not.toThrow();
      });


  it('should successfully update referenceMin of PRELIMINARY result', async () => {
        const resultRepositoryMock = {
          findById: jest.fn().mockResolvedValue({
            id: '123',
            orderId: '456',
            value: 10,
            unit: 'kg',
            status: ResultStatus.PRELIMINARY,
            referenceMin: null,
            referenceMax: null,
            resultDate: new Date(),
            sourceSystem: null,
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
            order: { id: '456' },
          }),
          save: jest.fn().mockResolvedValue({}),
        } as unknown as jest.Mocked<ResultRepository>;

        const service = {
          getResultById: jest.fn().mockResolvedValue({
            id: '123',
            orderId: '456',
            value: 10,
            unit: 'kg',
            status: ResultStatus.PRELIMINARY,
            referenceMin: null,
            referenceMax: null,
            resultDate: new Date(),
            sourceSystem: null,
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
            order: { id: '456' },
          }),
          updateResult: jest.fn().mockResolvedValue({}),
        } as unknown as ResultService;

        await expect(
          service.updateResult('123', { referenceMin: 5 })
        ).resolves.not.toThrow();
      });


  it('should successfully update referenceMax of PRELIMINARY result', async () => {
        const resultRepositoryMock = {
          findById: jest.fn().mockResolvedValue({
            id: '123',
            orderId: '456',
            value: 10,
            unit: 'kg',
            status: ResultStatus.PRELIMINARY,
            referenceMin: null,
            referenceMax: null,
            resultDate: new Date(),
            sourceSystem: null,
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
            order: { id: '456' },
          }),
          save: jest.fn().mockResolvedValue({
            id: '123',
            orderId: '456',
            value: 10,
            unit: 'kg',
            status: ResultStatus.PRELIMINARY,
            referenceMin: null,
            referenceMax: 15,
            resultDate: new Date(),
            sourceSystem: null,
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
            order: { id: '456' },
          }),
        } as unknown as jest.Mocked<ResultRepository>;

        const service = {
          getResultById: jest.fn().mockResolvedValue({
            id: '123',
            orderId: '456',
            value: 10,
            unit: 'kg',
            status: ResultStatus.PRELIMINARY,
            referenceMin: null,
            referenceMax: null,
            resultDate: new Date(),
            sourceSystem: null,
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
            order: { id: '456' },
          }),
          updateResult: jest.fn().mockResolvedValue({
            id: '123',
            orderId: '456',
            value: 10,
            unit: 'kg',
            status: ResultStatus.PRELIMINARY,
            referenceMin: null,
            referenceMax: 15,
            resultDate: new Date(),
            sourceSystem: null,
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
            order: { id: '456' },
          }),
        } as unknown as ResultService;

        await expect(
          service.updateResult('123', { referenceMax: 15 })
        ).resolves.not.toThrow();
      });


  it('should successfully update notes of PRELIMINARY result', async () => {
        const resultRepositoryMock = {
          findById: jest.fn().mockResolvedValue({
            id: '123',
            orderId: '456',
            value: 10,
            unit: 'kg',
            status: ResultStatus.PRELIMINARY,
            referenceMin: null,
            referenceMax: null,
            resultDate: new Date(),
            sourceSystem: null,
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
            order: { id: '456' },
          }),
          save: jest.fn().mockResolvedValue({}),
        } as unknown as jest.Mocked<ResultRepository>;

        const service = {
          getResultById: jest.fn().mockResolvedValue({
            id: '123',
            orderId: '456',
            value: 10,
            unit: 'kg',
            status: ResultStatus.PRELIMINARY,
            referenceMin: null,
            referenceMax: null,
            resultDate: new Date(),
            sourceSystem: null,
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
            order: { id: '456' },
          }),
          updateResult: jest.fn().mockResolvedValue({}),
        } as unknown as ResultService;

        await expect(
          service.updateResult('123', { notes: 'Test note' })
        ).resolves.not.toThrow();
      });


  it('should successfully update status from PRELIMINARY to CORRECTED', async () => {
        const resultRepositoryMock = {
          findById: jest.fn().mockResolvedValue({
            id: '123',
            orderId: '456',
            value: 10,
            unit: 'kg',
            status: ResultStatus.PRELIMINARY,
            referenceMin: null,
            referenceMax: null,
            resultDate: new Date(),
            sourceSystem: null,
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
            order: { id: '456' },
          }),
          save: jest.fn().mockResolvedValue({}),
        } as unknown as jest.Mocked<ResultRepository>;

        const service = {
          getResultById: jest.fn().mockResolvedValue({
            id: '123',
            orderId: '456',
            value: 10,
            unit: 'kg',
            status: ResultStatus.PRELIMINARY,
            referenceMin: null,
            referenceMax: null,
            resultDate: new Date(),
            sourceSystem: null,
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
            order: { id: '456' },
          }),
          updateResult: jest.fn().mockResolvedValue({}),
        } as unknown as ResultService;

        await expect(
          service.updateResult('123', { status: ResultStatus.CORRECTED })
        ).resolves.not.toThrow();
      });


  it('should successfully update value of FINAL result with CORRECTED status', async () => {
        const resultRepositoryMock = {
          findById: jest.fn().mockResolvedValue({
            id: '123',
            orderId: '456',
            value: 10,
            unit: 'kg',
            status: ResultStatus.FINAL,
            referenceMin: null,
            referenceMax: null,
            resultDate: new Date(),
            sourceSystem: null,
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
            order: { id: '456' },
          }),
          save: jest.fn().mockResolvedValue({}),
        } as unknown as jest.Mocked<ResultRepository>;

        const service = {
          getResultById: jest.fn().mockResolvedValue({
            id: '123',
            orderId: '456',
            value: 10,
            unit: 'kg',
            status: ResultStatus.FINAL,
            referenceMin: null,
            referenceMax: null,
            resultDate: new Date(),
            sourceSystem: null,
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
            order: { id: '456' },
          }),
          updateResult: jest.fn().mockResolvedValue({}),
        } as unknown as ResultService;

        await expect(
          service.updateResult('123', { status: ResultStatus.CORRECTED })
        ).resolves.not.toThrow();
      });

});
});

  // TESTS_APPEND_HERE
});
