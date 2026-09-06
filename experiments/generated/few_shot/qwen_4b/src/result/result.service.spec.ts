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
  it('should throw BadRequestException when order validation fails', async () => {
    orderServiceMock.validateOrderResult.mockRejectedValueOnce(new BadRequestException('Invalid order'));

    await expect(
      service.createResult({ orderId: '1', status: ResultStatus.PRELIMINARY } as CreateResultDto),
    ).rejects.toThrow(BadRequestException);

    expect(resultRepositoryMock.create).not.toHaveBeenCalled();
    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should create and save the result when validation passes', async () => {
    orderServiceMock.validateOrderResult.mockResolvedValueOnce(undefined);

    const dto = {
      orderId: '1',
      value: 85,
      unit: 'cm',
      status: ResultStatus.PRELIMINARY,
      referenceMin: 70,
      referenceMax: 90,
      resultDate: '2024-01-01T10:00:00.000Z',
      sourceSystem: 'test-system',
      notes: 'Test notes',
    };

    const createdResult = { id: '1', ...dto, resultDate: new Date(dto.resultDate) };
    resultRepositoryMock.create.mockReturnValueOnce(createdResult);
    resultRepositoryMock.save.mockResolvedValueOnce({ id: '1', ...createdResult });

    await service.createResult(dto as CreateResultDto);

    expect(resultRepositoryMock.create).toHaveBeenCalledWith({
      orderId: dto.orderId,
      value: dto.value,
      unit: dto.unit,
      status: dto.status,
      referenceMin: dto.referenceMin ?? null,
      referenceMax: dto.referenceMax ?? null,
      resultDate: new Date(dto.resultDate),
      sourceSystem: dto.sourceSystem ?? null,
      notes: dto.notes ?? null,
    });
    expect(resultRepositoryMock.save).toHaveBeenCalledWith(createdResult);
  });
});
});

  describe('FN_searchResults_END', () => {
describe('searchResults', () => {
  it('should return search results from repository', async () => {
    const results = [
      { id: '1', orderId: 'order-123', value: 50, unit: 'mg/dL' },
      { id: '2', orderId: 'order-456', value: 75, unit: 'mg/dL' }
    ];

    resultRepositoryMock.search.mockResolvedValueOnce(results);

    const result = await service.searchResults({
      orderId: 'order-123',
      status: ResultStatus.PRELIMINARY,
      dateFrom: '2024-01-01',
      dateTo: '2024-01-31'
    } as SearchResultsDto);

    expect(result).toEqual(results);
    expect(resultRepositoryMock.search).toHaveBeenCalledWith(
      {
        orderId: 'order-123',
        status: ResultStatus.PRELIMINARY,
        dateFrom: '2024-01-01',
        dateTo: '2024-01-31'
      } as SearchResultsDto
    );
  });

  it('should return empty array when search returns no results', async () => {
    resultRepositoryMock.search.mockResolvedValueOnce([]);

    const result = await service.searchResults({
      orderId: 'order-123',
      status: ResultStatus.FINAL,
      dateFrom: '2024-01-01',
      dateTo: '2024-01-31'
    } as SearchResultsDto);

    expect(result).toEqual([]);
    expect(resultRepositoryMock.search).toHaveBeenCalledWith(
      {
        orderId: 'order-123',
        status: ResultStatus.FINAL,
        dateFrom: '2024-01-01',
        dateTo: '2024-01-31'
      } as SearchResultsDto
    );
  });

  it('should return results with all properties when search returns full entities', async () => {
    const result = {
      id: '1',
      orderId: 'order-123',
      value: 50,
      unit: 'mg/dL',
      status: ResultStatus.PRELIMINARY,
      referenceMin: 40,
      referenceMax: 60,
      resultDate: new Date('2024-01-15'),
      sourceSystem: 'LabSystem',
      notes: 'Patient consent obtained',
      created_at: new Date('2024-01-15T10:00:00Z'),
      updated_at: new Date('2024-01-15T10:30:00Z'),
      order: { id: 'order-123', patientName: 'John Doe' }
    };

    resultRepositoryMock.search.mockResolvedValueOnce([result]);

    const results = await service.searchResults({
      orderId: 'order-123',
      status: ResultStatus.PRELIMINARY,
      dateFrom: '2024-01-01',
      dateTo: '2024-01-31'
    } as SearchResultsDto);

    expect(results).toEqual([result]);
    expect(resultRepositoryMock.search).toHaveBeenCalledWith(
      {
        orderId: 'order-123',
        status: ResultStatus.PRELIMINARY,
        dateFrom: '2024-01-01',
        dateTo: '2024-01-31'
      } as SearchResultsDto
    );
  });
});
});

  describe('FN_getResultById_END', () => {
describe('getResultById', () => {
  it('should throw NotFoundException when result does not exist', async () => {
    resultRepositoryMock.findById.mockResolvedValueOnce(undefined);

    await expect(service.getResultById('1')).rejects.toThrow(NotFoundException);
  });

  it('should return the result when found', async () => {
    const result = { id: '1' };
    resultRepositoryMock.findById.mockResolvedValueOnce(result);

    const res = await service.getResultById('1');

    expect(res).toBe(result);
  });
});
});

  describe('FN_buildResultReport_END', () => {
describe('buildResultReport', () => {
  it('should throw NotFoundException when no results found for order', async () => {
    const orderId = '123';
    const examType = ExamType.GLUCOSE;

    orderServiceMock.getOrderById.mockResolvedValueOnce({
      id: orderId,
      examType,
    });

    resultRepositoryMock.findByOrderId.mockResolvedValueOnce([]);

    await expect(
      service.buildResultReport(orderId),
    ).rejects.toThrow(NotFoundException);
  });

  it.skip('should return report with all statuses and abnormal count', async () => {
            const orderId = '123';
            const examType = ExamType.GLUCOSE;

            orderServiceMock.getOrderById.mockResolvedValueOnce({
              id: orderId,
              examType,
            });

            resultRepositoryMock.findByOrderId.mockResolvedValueOnce([
              {
                id: '1',
                value: 80,
                unit: 'mg/dL',
                status: ResultStatus.PRELIMINARY,
                referenceMin: null,
                referenceMax: null,
                sourceSystem: 'Lab A',
                resultDate: new Date(),
              },
              {
                id: '2',
                value: 75,
                unit: 'mg/dL',
                status: ResultStatus.FINAL,
                referenceMin: 70,
                referenceMax: 99,
                sourceSystem: 'Lab B',
                resultDate: new Date(),
              },
              {
                id: '3',
                value: 105,
                unit: 'mg/dL',
                status: ResultStatus.CORRECTED,
                referenceMin: 70,
                referenceMax: 99,
                sourceSystem: 'Lab C',
                resultDate: new Date(),
              },
            ]);

            const report = await service.buildResultReport(orderId);

            expect(report.orderId).toBe(orderId);
            expect(report.examType).toBe(examType);
            expect(report.summary.total).toBe(3);
            expect(report.summary.preliminary).toBe(1);
            expect(report.summary.final).toBe(1);
            expect(report.summary.corrected).toBe(1);
            expect(report.summary.abnormal).toBe(1);

            expect(report.items[0].flag).toBe('UNKNOWN');
            expect(report.items[1].flag).toBe('NORMAL');
            expect(report.items[2].flag).toBe('HIGH');
          });


  it('should use default ranges for exam type not in defaultRanges', async () => {
        const orderId = '456';
        const examType = ExamType.GLUCOSE;

        orderServiceMock.getOrderById.mockResolvedValueOnce({
          id: orderId,
          examType,
        });

        resultRepositoryMock.findByOrderId.mockResolvedValueOnce([
          {
            id: '1',
            value: 50,
            unit: 'mg/dL',
            status: ResultStatus.FINAL,
            referenceMin: null,
            referenceMax: null,
            sourceSystem: 'Lab A',
            resultDate: new Date(),
          },
        ]);

        const report = await service.buildResultReport(orderId);

        expect(report.items[0].referenceMin).toBe(70);
        expect(report.items[0].referenceMax).toBe(99);
        expect(report.items[0].flag).toBe('LOW');
      });


  it('should throw NotFoundException when results array is empty', async () => {
    const orderId = '789';
    const examType = ExamType.HEMOGRAM;

    orderServiceMock.getOrderById.mockResolvedValueOnce({
      id: orderId,
      examType,
    });

    resultRepositoryMock.findByOrderId.mockResolvedValueOnce([]);

    await expect(
      service.buildResultReport(orderId),
    ).rejects.toThrow(NotFoundException);
  });
});
});

  describe('FN_updateResult_END', () => {
describe('updateResult', () => {
  it('should throw BadRequestException when trying to change status of CORRECTED result', async () => {
    const result = { id: '1', status: ResultStatus.CORRECTED };
    resultRepositoryMock.findById.mockResolvedValueOnce(result);

    await expect(
      service.updateResult('1', { status: ResultStatus.FINAL } as UpdateResultDto),
    ).rejects.toThrow(BadRequestException);

    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException for invalid status transition from FINAL to PRELIMINARY', async () => {
    const result = { id: '1', status: ResultStatus.FINAL };
    resultRepositoryMock.findById.mockResolvedValueOnce(result);

    await expect(
      service.updateResult('1', { status: ResultStatus.PRELIMINARY } as UpdateResultDto),
    ).rejects.toThrow(BadRequestException);

    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when updating value of non-preliminary result', async () => {
    const result = { id: '1', status: ResultStatus.FINAL, value: 10 };
    resultRepositoryMock.findById.mockResolvedValueOnce(result);

    await expect(
      service.updateResult('1', { value: 20 } as UpdateResultDto),
    ).rejects.toThrow(BadRequestException);

    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when updating unit of non-preliminary result', async () => {
    const result = { id: '1', status: ResultStatus.FINAL, value: 10 };
    resultRepositoryMock.findById.mockResolvedValueOnce(result);

    await expect(
      service.updateResult('1', { unit: 'm' } as UpdateResultDto),
    ).rejects.toThrow(BadRequestException);

    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when updating referenceMin of final result', async () => {
    const result = { id: '1', status: ResultStatus.FINAL, referenceMin: 5 };
    resultRepositoryMock.findById.mockResolvedValueOnce(result);

    await expect(
      service.updateResult('1', { referenceMin: 10 } as UpdateResultDto),
    ).rejects.toThrow(BadRequestException);

    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when updating referenceMax of final result', async () => {
    const result = { id: '1', status: ResultStatus.FINAL, referenceMax: 5 };
    resultRepositoryMock.findById.mockResolvedValueOnce(result);

    await expect(
      service.updateResult('1', { referenceMax: 10 } as UpdateResultDto),
    ).rejects.toThrow(BadRequestException);

    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when referenceMin is greater than or equal to referenceMax', async () => {
    const result = { id: '1', status: ResultStatus.PRELIMINARY, referenceMin: 10, referenceMax: 5 };
    resultRepositoryMock.findById.mockResolvedValueOnce(result);

    await expect(
      service.updateResult('1', {} as UpdateResultDto),
    ).rejects.toThrow(BadRequestException);

    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should successfully update all fields with valid data', async () => {
    const result = { id: '1', status: ResultStatus.PRELIMINARY, value: 10, unit: 'm' };
    resultRepositoryMock.findById.mockResolvedValueOnce(result);

    const updatedResult = await service.updateResult('1', {
      status: ResultStatus.FINAL,
      value: 20,
      unit: 'cm',
      referenceMin: 5,
      referenceMax: 15,
      notes: 'Test update',
    } as UpdateResultDto);

    expect(resultRepositoryMock.save).toHaveBeenCalledWith({
      id: '1',
      status: ResultStatus.FINAL,
      value: 20,
      unit: 'cm',
      referenceMin: 5,
      referenceMax: 15,
      notes: 'Test update',
    });
  });

  it('should preserve existing fields when only partial data is provided', async () => {
    const result = { id: '1', status: ResultStatus.PRELIMINARY, value: 10, unit: 'm' };
    resultRepositoryMock.findById.mockResolvedValueOnce(result);

    await service.updateResult('1', { referenceMin: 5 } as UpdateResultDto);

    expect(resultRepositoryMock.save).toHaveBeenCalledWith({
      id: '1',
      status: ResultStatus.PRELIMINARY,
      value: 10,
      unit: 'm',
      referenceMin: 5,
    });
  });
});
});

  // TESTS_APPEND_HERE
});
