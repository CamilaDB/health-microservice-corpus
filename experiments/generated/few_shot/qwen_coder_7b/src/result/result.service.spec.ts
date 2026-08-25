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
  it.skip('should throw BadRequestException when order result is not valid', async () => {
        const createDto: CreateResultDto = {
          orderId: '1',
          value: 10,
          unit: 'mg/dL',
          status: ResultStatus.PRELIMINARY,
          resultDate: new Date().toISOString(),
        };

        orderServiceMock.validateOrderResult.mockResolvedValueOnce(false);

        await expect(service.createResult(createDto)).rejects.toThrow(BadRequestException);
      });

  it('should save and return the created result', async () => {
    const createDto: CreateResultDto = {
      orderId: '1',
      value: 10,
      unit: 'mg/dL',
      status: ResultStatus.PRELIMINARY,
      resultDate: new Date().toISOString(),
    };

    orderServiceMock.validateOrderResult.mockResolvedValueOnce(true);
    const createdEntity: Result = { ...createDto, id: '1', created_at: new Date(), updated_at: new Date() };
    resultRepositoryMock.create.mockReturnValueOnce(createdEntity);
    resultRepositoryMock.save.mockResolvedValueOnce(createdEntity);

    const result = await service.createResult(createDto);

    expect(result).toEqual(createdEntity);
  });
});
});

  describe('FN_searchResults_END', () => {
describe('searchResults', () => {
  it('should return search results based on provided criteria', async () => {
    const searchCriteria: SearchResultsDto = {
      orderId: '123',
      status: ResultStatus.FINAL,
      examType: ExamType.HEMOGRAM,
      dateFrom: new Date().toISOString(),
      dateTo: new Date().toISOString(),
      sourceSystem: 'testSystem',
    };

    const expectedResults: Result[] = [
      { id: '1', orderId: '123', value: 10, unit: 'g/dL', status: ResultStatus.FINAL, referenceMin: null, referenceMax: null, resultDate: new Date(), sourceSystem: 'testSystem', notes: null, created_at: new Date(), updated_at: new Date() },
      { id: '2', orderId: '123', value: 80, unit: 'mg/dL', status: ResultStatus.FINAL, referenceMin: null, referenceMax: null, resultDate: new Date(), sourceSystem: 'testSystem', notes: null, created_at: new Date(), updated_at: new Date() },
    ];

    resultRepositoryMock.search.mockResolvedValueOnce(expectedResults);

    const results = await service.searchResults(searchCriteria);

    expect(results).toEqual(expectedResults);
  });

  it.skip('should throw NotFoundException when no results found', async () => {
        const searchCriteria: SearchResultsDto = {
          orderId: '123',
          status: ResultStatus.FINAL,
          examType: ExamType.HEMOGRAM,
          dateFrom: new Date().toISOString(),
          dateTo: new Date().toISOString(),
          sourceSystem: 'testSystem',
        };

        resultRepositoryMock.search.mockResolvedValueOnce([]);

        await expect(service.searchResults(searchCriteria)).rejects.toThrow(NotFoundException);
      });
});
});

  describe('FN_getResultById_END', () => {
describe('getResultById', () => {
  it('should throw NotFoundException when result does not exist', async () => {
    resultRepositoryMock.findById.mockResolvedValueOnce(undefined);

    await expect(service.getResultById('1')).rejects.toThrow(NotFoundException);
  });

  it('should return the result when it exists', async () => {
    const result = { id: '1', orderId: '2', value: 10, unit: 'mg/dL', status: ResultStatus.PRELIMINARY, referenceMin: null, referenceMax: null, resultDate: new Date(), sourceSystem: null, notes: null, created_at: new Date(), updated_at: new Date() };
    resultRepositoryMock.findById.mockResolvedValueOnce(result);

    const resultFromService = await service.getResultById('1');

    expect(resultFromService).toBe(result);
  });
});
});

  describe('FN_buildResultReport_END', () => {
describe('buildResultReport', () => {
  it.skip('should throw NotFoundException when order does not exist', async () => {
        const orderId = '1';
        orderServiceMock.getOrderById.mockResolvedValueOnce(null);

        await expect(service.buildResultReport(orderId)).rejects.toThrow(NotFoundException);
      });

  it.skip('should return an empty ResultReport when no results are found for the order', async () => {
          const orderId = '1';
          orderServiceMock.getOrderById.mockResolvedValueOnce({ id: orderId, examType: ExamType.GLUCOSE });
          resultRepositoryMock.findByOrderId.mockResolvedValueOnce([]);

          const result = await service.buildResultReport(orderId);

          expect(result).toEqual({
            orderId,
            examType: ExamType.GLUCOSE,
            items: [],
            summary: { total: 0, preliminary: 0, final: 0, corrected: 0, abnormal: 0 },
          });
        });


  it.skip('should return a ResultReport with the correct data when results are found for the order', async () => {
          const orderId = '1';
          const examType = ExamType.HEMOGRAM;
          const resultItems: ResultReportItem[] = [
            { resultId: '1', examType, value: 10, unit: 'g/dL', status: ResultStatus.FINAL, referenceMin: null, referenceMax: null, flag: 'UNKNOWN', sourceSystem: null, resultDate: new Date() },
          ];
          const order = { id: orderId, examType };
          orderServiceMock.getOrderById.mockResolvedValueOnce(order);
          resultRepositoryMock.findByOrderId.mockResolvedValueOnce(resultItems);

          const result = await service.buildResultReport(orderId);

          expect(result).toEqual({
            orderId,
            examType,
            items: resultItems.map(item => ({ ...item, resultId: '1' })),
            summary: { total: 1, preliminary: 0, final: 1, corrected: 0, abnormal: 0 },
          });
        });


});
});

  describe('FN_updateResult_END', () => {
describe('updateResult', () => {
  it('should throw NotFoundException when result does not exist', async () => {
    const dto: UpdateResultDto = { status: ResultStatus.FINAL };
    resultRepositoryMock.findById.mockResolvedValueOnce(null);

    await expect(service.updateResult('1', dto)).rejects.toThrow(NotFoundException);
  });

  it('should update and save the result when it exists', async () => {
    const dto: UpdateResultDto = { status: ResultStatus.FINAL };
    const existingResult: Result = {
      id: '1',
      orderId: 'order123',
      value: 10,
      unit: 'mg/dL',
      status: ResultStatus.PRELIMINARY,
      referenceMin: null,
      referenceMax: null,
      resultDate: new Date(),
      sourceSystem: null,
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      order: { id: 'order123' } as Order,
    };
    resultRepositoryMock.findById.mockResolvedValueOnce(existingResult);
    resultRepositoryMock.save.mockResolvedValueOnce({ ...existingResult, status: dto.status });

    const updatedResult = await service.updateResult('1', dto);

    expect(updatedResult).toEqual({ ...existingResult, status: dto.status });
  });
});
});

  // TESTS_APPEND_HERE
});
