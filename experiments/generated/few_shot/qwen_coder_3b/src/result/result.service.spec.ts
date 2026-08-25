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
        orderServiceMock.getOrderById.mockResolvedValueOnce(null);

        await expect(
          service.createResult({ orderId: '1' } as CreateResultDto),
        ).rejects.toThrow(NotFoundException);
      });

  it.skip('should save and return the created result', async () => {
        const createResultDto = { orderId: '1', value: 10, unit: 'cm' };
        orderServiceMock.getOrderById.mockResolvedValueOnce({ id: '1' } as Order);

        resultRepositoryMock.create.mockReturnValueOnce(createResultDto);
        resultRepositoryMock.save.mockResolvedValueOnce({
          id: '1',
          ...createResultDto,
        });

        await service.createResult(createResultDto);

        expect(orderServiceMock.getOrderById).toHaveBeenCalledWith('1');
        expect(resultRepositoryMock.create).toHaveBeenCalledWith(createResultDto);
        expect(resultRepositoryMock.save).toHaveBeenCalledWith(createResultDto);
      });
});
});

  describe('FN_searchResults_END', () => {
describe('searchResults', () => {
  it.skip('should throw NotFoundException when order does not exist', async () => {
        resultRepositoryMock.search.mockResolvedValueOnce([]);

        await expect(
          service.searchResults({ orderId: '1' } as SearchResultsDto),
        ).rejects.toThrow(NotFoundException);

        expect(resultRepositoryMock.search).toHaveBeenCalledWith({
          orderId: '1',
        });
      });

  it('should return an empty array when no results are found', async () => {
    resultRepositoryMock.search.mockResolvedValueOnce([]);

    const result = await service.searchResults({} as SearchResultsDto);

    expect(result).toEqual([]);
  });

  it.skip('should return the search results for a given order', async () => {
        const result: Result[] = [
          { id: '1', orderId: '1', value: 10, unit: 'mg/dL', status: ResultStatus.PRELIMINARY },
        ];
        resultRepositoryMock.search.mockResolvedValueOnce(result);

        const resultDto: SearchResultsDto = {};
        const resultDtoWithOrderId: SearchResultsDto = { orderId: '1' };

        const result1 = await service.searchResults(resultDto);
        expect(result1).toEqual([]);

        const result2 = await service.searchResults(resultDtoWithOrderId);
        expect(result2).toEqual(result);
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
    const result = { id: '1' } as Result;
    resultRepositoryMock.findById.mockResolvedValueOnce(result);

    const resultData = await service.getResultById('1');

    expect(resultData).toBe(result);
  });
});
});

  describe('FN_buildResultReport_END', () => {
describe('buildResultReport', () => {
  it.skip('should throw NotFoundException when order does not exist', async () => {
        orderServiceMock.getOrderById.mockResolvedValueOnce(null);

        await expect(service.buildResultReport('1')).rejects.toThrow(NotFoundException);
      });

  it.skip('should build and return the result report', async () => {
        const order = { id: '1' };
        orderServiceMock.getOrderById.mockResolvedValueOnce(order);

        const resultItems = [
          { resultId: '1', examType: ExamType.HEMOGRAM, value: 123, unit: '%', status: ResultStatus.PRELIMINARY, referenceMin: null, referenceMax: null, flag: "UNKNOWN", sourceSystem: null, resultDate: new Date() },
        ];

        resultRepositoryMock.findByOrderId.mockResolvedValueOnce(resultItems);

        const resultReport = await service.buildResultReport('1');

        expect(orderServiceMock.getOrderById).toHaveBeenCalledWith('1');
        expect(resultRepositoryMock.findByOrderId).toHaveBeenCalledWith('1');
        expect(resultReport).toEqual({
          orderId: '1',
          examType: ExamType.HEMOGRAM,
          items: resultItems,
          summary: { total: 1, preliminary: 1, final: 0, corrected: 0, abnormal: 0 },
        });
      });
});
});

  describe('FN_updateResult_END', () => {
describe('updateResult', () => {
  it('should throw NotFoundException when result does not exist', async () => {
    resultRepositoryMock.findById.mockResolvedValueOnce(null);

    await expect(
      service.updateResult({ id: '1' } as UpdateResultDto),
    ).rejects.toThrow(NotFoundException);
  });

  it.skip('should throw BadRequestException when status is CORRECTED and dto.status is not undefined', async () => {
          const result = { id: '1', status: ResultStatus.CORRECTED };
          resultRepositoryMock.findById.mockResolvedValueOnce(result);

          await expect(service.updateResult({ status: ResultStatus.FINAL } as UpdateResultDto)).rejects.toThrow(BadRequestException);
        });

});
});

  // TESTS_APPEND_HERE
});
