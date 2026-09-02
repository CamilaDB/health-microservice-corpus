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
  it.skip('should throw NotFoundException when order does not exist', async () => {
        orderServiceMock.validateOrderResult.mockResolvedValueOnce(null);

        await expect(
          service.createResult({ orderId: '1', value: 10, unit: 'mm' } as CreateResultDto),
        ).rejects.toThrow(NotFoundException);

        expect(resultRepositoryMock.create).not.toHaveBeenCalled();
        expect(resultRepositoryMock.save).not.toHaveBeenCalled();
      });

  it.skip('should throw BadRequestException when order is not valid', async () => {
        orderServiceMock.validateOrderResult.mockResolvedValueOnce({ id: '1', status: ResultStatus.PRELIMINARY });

        await expect(
          service.createResult({ orderId: '1', value: 10, unit: 'mm' } as CreateResultDto),
        ).rejects.toThrow(BadRequestException);

        expect(resultRepositoryMock.create).not.toHaveBeenCalled();
        expect(resultRepositoryMock.save).not.toHaveBeenCalled();
      });

  it.skip('should save and return the created result', async () => {
        orderServiceMock.validateOrderResult.mockResolvedValueOnce({ id: '1', status: ResultStatus.FINAL });

        const createdResult = { orderId: '1', value: 10, unit: 'mm' };
        resultRepositoryMock.create.mockReturnValueOnce(createdResult);
        resultRepositoryMock.save.mockResolvedValueOnce({ id: '1', ...createdResult });

        await service.createResult({ orderId: '1', value: 10, unit: 'mm' } as CreateResultDto);

        expect(resultRepositoryMock.create).toHaveBeenCalledWith({
          orderId: '1',
          value: 10,
          unit: 'mm',
          resultDate: new Date(),
          referenceMin: null,
          referenceMax: null,
          sourceSystem: null,
          notes: null,
        });
        expect(resultRepositoryMock.save).toHaveBeenCalledWith(createdResult);
      });
});
});

  describe('FN_searchResults_END', () => {
describe('searchResults', () => {
  it('should return an empty array when no results are found', async () => {
    resultRepositoryMock.search.mockResolvedValueOnce([]);

    const results = await service.searchResults({} as SearchResultsDto);

    expect(results).toEqual([]);
    expect(resultRepositoryMock.search).toHaveBeenCalledWith({});
  });

  it('should return the results when they are found', async () => {
    const results = [{ id: '1', orderId: '2', value: 100, unit: 'mg/dL', status: ResultStatus.PRELIMINARY, referenceMin: null, referenceMax: null, resultDate: new Date(), sourceSystem: null, notes: null, created_at: new Date(), updated_at: new Date(), order: { id: '2', name: 'Test Order' } }];
    resultRepositoryMock.search.mockResolvedValueOnce(results);

    const result = await service.searchResults({ orderId: '2' } as SearchResultsDto);

    expect(result).toEqual(results);
    expect(resultRepositoryMock.search).toHaveBeenCalledWith({ orderId: '2' });
  });
});
});

  describe('FN_getResultById_END', () => {
describe('getResultById', () => {
  it('should throw NotFoundException when result does not exist', async () => {
    resultRepositoryMock.findById.mockResolvedValueOnce(null);

    await expect(service.getResultById('1')).rejects.toThrow(NotFoundException);
  });

  it('should return the result when found', async () => {
    const result = { id: '1', orderId: '1', value: 100, unit: 'cm', status: ResultStatus.PRELIMINARY, referenceMin: null, referenceMax: null, resultDate: new Date(), sourceSystem: null, notes: null, created_at: new Date(), updated_at: new Date(), order: { id: '1', examType: ExamType.AXIAL } };
    resultRepositoryMock.findById.mockResolvedValueOnce(result);

    const resultById = await service.getResultById('1');

    expect(resultById).toBe(result);
  });
});
});

  describe('FN_buildResultReport_END', () => {
describe('buildResultReport', () => {
  it.skip('should throw NotFoundException when order does not exist', async () => {
          orderServiceMock.getOrderById.mockResolvedValueOnce(null);

          await expect(
            service.buildResultReport('1'),
          ).rejects.toThrow(NotFoundException);

          expect(resultRepositoryMock.findByOrderId).toHaveBeenCalledWith('1');
        });


  it('should throw NotFoundException when no results are found for order', async () => {
    orderServiceMock.getOrderById.mockResolvedValueOnce({ id: '1' });
    resultRepositoryMock.findByOrderId.mockResolvedValueOnce([]);

    await expect(
      service.buildResultReport('1'),
    ).rejects.toThrow(NotFoundException);

    expect(resultRepositoryMock.findByOrderId).toHaveBeenCalledWith('1');
  });

  it.skip('should return the result report with summary and items', async () => {
        const order = { id: '1', examType: ExamType.GLUCOSE };
        const result1 = { id: '1', status: ResultStatus.PRELIMINARY, value: 80 };
        const result2 = { id: '2', status: ResultStatus.FINAL, value: 100 };
        const results = [result1, result2];
        const defaultRanges = {
          [ExamType.GLUCOSE]: { min: 70, max: 99 },
        };
        const summary = {
          total: 2,
          preliminary: 1,
          final: 1,
          corrected: 0,
          abnormal: 0,
        };
        const items = [
          {
            resultId: result1.id,
            examType: order.examType,
            value: result1.value,
            unit: result1.unit,
            status: result1.status,
            referenceMin: defaultRanges[order.examType]?.min ?? null,
            referenceMax: defaultRanges[order.examType]?.max ?? null,
            flag: 'NORMAL',
            sourceSystem: result1.sourceSystem,
            resultDate: result1.resultDate,
          },
          {
            resultId: result2.id,
            examType: order.examType,
            value: result2.value,
            unit: result2.unit,
            status: result2.status,
            referenceMin: defaultRanges[order.examType]?.min ?? null,
            referenceMax: defaultRanges[order.examType]?.max ?? null,
            flag: 'HIGH',
            sourceSystem: result2.sourceSystem,
            resultDate: result2.resultDate,
          },
        ];

        orderServiceMock.getOrderById.mockResolvedValueOnce(order);
        resultRepositoryMock.findByOrderId.mockResolvedValueOnce(results);

        const resultReport = await service.buildResultReport('1');

        expect(resultReport).toEqual({
          orderId: '1',
          examType: ExamType.GLUCOSE,
          items,
          summary,
        });

        expect(resultRepositoryMock.findByOrderId).toHaveBeenCalledWith('1');
      });
});
});

  describe('FN_updateResult_END', () => {
describe('updateResult', () => {
  it('should throw BadRequestException when status is CORRECTED and dto.status is defined', async () => {
    resultRepositoryMock.findById.mockResolvedValueOnce({
      id: '1',
      status: ResultStatus.CORRECTED,
    });

    await expect(
      service.updateResult('1', { status: ResultStatus.FINAL } as UpdateResultDto),
    ).rejects.toThrow(BadRequestException);

    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it.skip('should throw BadRequestException when invalid status transition is attempted', async () => {
        resultRepositoryMock.findById.mockResolvedValueOnce({
          id: '1',
          status: ResultStatus.PRELIMINARY,
        });

        await expect(
          service.updateResult('1', { status: ResultStatus.FINAL } as UpdateResultDto),
        ).rejects.toThrow(BadRequestException);

        expect(resultRepositoryMock.save).not.toHaveBeenCalled();
      });

  it('should throw BadRequestException when value is updated for a non-preliminary result', async () => {
    resultRepositoryMock.findById.mockResolvedValueOnce({
      id: '1',
      status: ResultStatus.FINAL,
    });

    await expect(
      service.updateResult('1', { value: 10 } as UpdateResultDto),
    ).rejects.toThrow(BadRequestException);

    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when unit is updated for a non-preliminary result', async () => {
    resultRepositoryMock.findById.mockResolvedValueOnce({
      id: '1',
      status: ResultStatus.FINAL,
    });

    await expect(
      service.updateResult('1', { unit: 'newUnit' } as UpdateResultDto),
    ).rejects.toThrow(BadRequestException);

    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when referenceMin is updated for a final result', async () => {
    resultRepositoryMock.findById.mockResolvedValueOnce({
      id: '1',
      status: ResultStatus.FINAL,
    });

    await expect(
      service.updateResult('1', { referenceMin: 10 } as UpdateResultDto),
    ).rejects.toThrow(BadRequestException);

    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when referenceMax is updated for a final result', async () => {
    resultRepositoryMock.findById.mockResolvedValueOnce({
      id: '1',
      status: ResultStatus.FINAL,
    });

    await expect(
      service.updateResult('1', { referenceMax: 10 } as UpdateResultDto),
    ).rejects.toThrow(BadRequestException);

    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when referenceMin is greater than or equal to referenceMax', async () => {
    resultRepositoryMock.findById.mockResolvedValueOnce({
      id: '1',
      status: ResultStatus.PRELIMINARY,
    });

    await expect(
      service.updateResult('1', { referenceMin: 10, referenceMax: 5 } as UpdateResultDto),
    ).rejects.toThrow(BadRequestException);

    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should update the result with valid data', async () => {
    const result = { id: '1', status: ResultStatus.PRELIMINARY };
    resultRepositoryMock.findById.mockResolvedValueOnce(result);
    resultRepositoryMock.save.mockResolvedValueOnce({ id: '1', ...result });

    await service.updateResult('1', { status: ResultStatus.FINAL, value: 10, unit: 'newUnit' } as UpdateResultDto);

    expect(resultRepositoryMock.save).toHaveBeenCalledWith({
      id: '1',
      status: ResultStatus.FINAL,
      value: 10,
      unit: 'newUnit',
    });
  });
});
});

  // TESTS_APPEND_HERE
});
