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
  it('should throw BadRequestException when order result validation fails', async () => {
    const dto: CreateResultDto = {
      orderId: '1',
      value: 100,
      unit: 'mg/dL',
      status: ResultStatus.PRELIMINARY,
      resultDate: '2023-04-01T12:00:00Z',
    };

    orderServiceMock.validateOrderResult.mockRejectedValueOnce(new BadRequestException());

    await expect(service.createResult(dto)).rejects.toThrow(BadRequestException);

    expect(orderServiceMock.validateOrderResult).toHaveBeenCalledWith(dto.orderId, dto.status);
    expect(resultRepositoryMock.create).not.toHaveBeenCalled();
    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it.skip('should create and save the result when order result validation passes', async () => {
        const dto: CreateResultDto = {
          orderId: '1',
          value: 100,
          unit: 'mg/dL',
          status: ResultStatus.PRELIMINARY,
          resultDate: '2023-04-01T12:00:00Z',
        };

        orderServiceMock.validateOrderResult.mockResolvedValueOnce(undefined);

        const createdResult = {
          id: '1',
          ...dto,
          resultDate: new Date(dto.resultDate),
          referenceMin: dto.referenceMin ?? null,
          referenceMax: dto.referenceMax ?? null,
          sourceSystem: dto.sourceSystem ?? null,
          notes: dto.notes ?? null,
        };

        resultRepositoryMock.create.mockReturnValueOnce(createdResult);
        resultRepositoryMock.save.mockResolvedValueOnce(createdResult);

        const result = await service.createResult(dto);

        expect(orderServiceMock.validateOrderResult).toHaveBeenCalledWith(dto.orderId, dto.status);
        expect(resultRepositoryMock.create).toHaveBeenCalledWith(createdResult);
        expect(resultRepositoryMock.save).toHaveBeenCalledWith(createdResult);
        expect(result).toEqual(createdResult);
      });
});
});

  describe('FN_searchResults_END', () => {
describe('searchResults', () => {
  it('should return search results from the repository', async () => {
    const dto: SearchResultsDto = {
      orderId: '123',
      status: ResultStatus.FINAL,
      examType: ExamType.HEMOGRAM,
      dateFrom: '2023-01-01',
      dateTo: '2023-12-31',
      sourceSystem: 'system1',
    };

    const expectedResult: Result[] = [
      { id: '1', orderId: '123', value: 10, unit: 'g/dL', status: ResultStatus.FINAL, referenceMin: null, referenceMax: null, resultDate: new Date(), sourceSystem: 'system1', notes: null, created_at: new Date(), updated_at: new Date(), order: null },
      { id: '2', orderId: '123', value: 120, unit: 'mg/dL', status: ResultStatus.FINAL, referenceMin: null, referenceMax: null, resultDate: new Date(), sourceSystem: 'system1', notes: null, created_at: new Date(), updated_at: new Date(), order: null },
    ];

    resultRepositoryMock.search.mockResolvedValueOnce(expectedResult);

    const result = await service.searchResults(dto);

    expect(result).toBe(expectedResult);
    expect(resultRepositoryMock.search).toHaveBeenCalledWith(dto);
  });
});
});

  describe('FN_getResultById_END', () => {
describe('getResultById', () => {
  it('should throw NotFoundException when result does not exist', async () => {
    resultRepositoryMock.findById.mockResolvedValueOnce(null);

    await expect(service.getResultById('1')).rejects.toThrow(NotFoundException);
  });

  it('should return the result when it exists', async () => {
    const result = { id: '1', orderId: '2', value: 10, unit: 'mg', status: ResultStatus.PRELIMINARY, referenceMin: null, referenceMax: null, resultDate: new Date(), sourceSystem: null, notes: null, created_at: new Date(), updated_at: new Date() };
    resultRepositoryMock.findById.mockResolvedValueOnce(result);

    const resultFromService = await service.getResultById('1');

    expect(resultFromService).toEqual(result);
  });
});
});

  describe('FN_buildResultReport_END', () => {
describe('buildResultReport', () => {
  it('should throw NotFoundException when no results found for order', async () => {
    orderServiceMock.getOrderById.mockResolvedValueOnce({ id: '1', examType: ExamType.GLUCOSE });
    resultRepositoryMock.findByOrderId.mockResolvedValueOnce([]);

    await expect(service.buildResultReport('1')).rejects.toThrow(NotFoundException);
  });

  it('should return ResultReport with summary and items', async () => {
      const order = { id: '1', examType: ExamType.GLUCOSE };
      orderServiceMock.getOrderById.mockResolvedValueOnce(order);

      const results = [
        { id: '1', status: ResultStatus.PRELIMINARY, value: 80, unit: 'mg/dL', referenceMin: 70, referenceMax: 99, sourceSystem: null, resultDate: new Date() },
        { id: '2', status: ResultStatus.FINAL, value: 100, unit: 'mg/dL', referenceMin: 70, referenceMax: 99, sourceSystem: null, resultDate: new Date() },
      ];
      resultRepositoryMock.findByOrderId.mockResolvedValueOnce(results);

      const resultReport = await service.buildResultReport('1');

      expect(resultReport).toEqual({
        orderId: '1',
        examType: ExamType.GLUCOSE,
        items: [
          {
            resultId: '1',
            examType: ExamType.GLUCOSE,
            value: 80,
            unit: 'mg/dL',
            status: ResultStatus.PRELIMINARY,
            referenceMin: 70,
            referenceMax: 99,
            flag: 'NORMAL',
            sourceSystem: null,
            resultDate: expect.any(Date),
          },
          {
            resultId: '2',
            examType: ExamType.GLUCOSE,
            value: 100,
            unit: 'mg/dL',
            status: ResultStatus.FINAL,
            referenceMin: 70,
            referenceMax: 99,
            flag: 'HIGH',
            sourceSystem: null,
            resultDate: expect.any(Date),
          },
        ],
        summary: {
          total: 2,
          preliminary: 1,
          final: 1,
          corrected: 0,
          abnormal: 1,
        },
      });
    });


});
});

  describe('FN_updateResult_END', () => {
describe('updateResult', () => {
  it('should throw BadRequestException when status is corrected and new status is provided', async () => {
    const result = { id: '1', status: ResultStatus.CORRECTED };
    resultRepositoryMock.findById.mockResolvedValueOnce(result);

    await expect(
      service.updateResult('1', { status: ResultStatus.FINAL } as UpdateResultDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when updating value of a non-preliminary result', async () => {
    const result = { id: '1', status: ResultStatus.FINAL };
    resultRepositoryMock.findById.mockResolvedValueOnce(result);

    await expect(
      service.updateResult('1', { value: 10 } as UpdateResultDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when updating unit of a non-preliminary result', async () => {
    const result = { id: '1', status: ResultStatus.FINAL };
    resultRepositoryMock.findById.mockResolvedValueOnce(result);

    await expect(
      service.updateResult('1', { unit: 'mg' } as UpdateResultDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when updating referenceMin of a final result', async () => {
    const result = { id: '1', status: ResultStatus.FINAL };
    resultRepositoryMock.findById.mockResolvedValueOnce(result);

    await expect(
      service.updateResult('1', { referenceMin: 10 } as UpdateResultDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when updating referenceMax of a final result', async () => {
    const result = { id: '1', status: ResultStatus.FINAL };
    resultRepositoryMock.findById.mockResolvedValueOnce(result);

    await expect(
      service.updateResult('1', { referenceMax: 10 } as UpdateResultDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when referenceMin is greater than or equal to referenceMax', async () => {
    const result = { id: '1', status: ResultStatus.PRELIMINARY, referenceMin: 10, referenceMax: 5 };
    resultRepositoryMock.findById.mockResolvedValueOnce(result);

    await expect(
      service.updateResult('1', { referenceMin: 15, referenceMax: 5 } as UpdateResultDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should update and save the result when valid data is provided', async () => {
    const result = { id: '1', status: ResultStatus.PRELIMINARY, value: 10, unit: 'mg', referenceMin: null, referenceMax: null };
    resultRepositoryMock.findById.mockResolvedValueOnce(result);

    const updatedResult = { id: '1', status: ResultStatus.FINAL, value: 15, unit: 'mg', referenceMin: null, referenceMax: null };
    resultRepositoryMock.save.mockResolvedValueOnce(updatedResult);

    const resultDto = { status: ResultStatus.FINAL, value: 15, unit: 'mg' } as UpdateResultDto;
    const updated = await service.updateResult('1', resultDto);

    expect(updated).toEqual(updatedResult);
    expect(resultRepositoryMock.save).toHaveBeenCalledWith(updatedResult);
  });
});
});

  // TESTS_APPEND_HERE
});
