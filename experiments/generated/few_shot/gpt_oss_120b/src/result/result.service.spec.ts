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
  it('should propagate NotFoundException from order validation', async () => {
    orderServiceMock.validateOrderResult.mockRejectedValueOnce(new NotFoundException());

    await expect(
      service.createResult({
        orderId: 'order-1',
        value: 10,
        unit: 'mg',
        status: ResultStatus.PRELIMINARY,
        resultDate: new Date().toISOString(),
      } as CreateResultDto),
    ).rejects.toThrow(NotFoundException);

    expect(resultRepositoryMock.create).not.toHaveBeenCalled();
    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should propagate BadRequestException from order validation', async () => {
    orderServiceMock.validateOrderResult.mockRejectedValueOnce(new BadRequestException());

    await expect(
      service.createResult({
        orderId: 'order-2',
        value: 5,
        unit: 'ml',
        status: ResultStatus.FINAL,
        resultDate: new Date().toISOString(),
      } as CreateResultDto),
    ).rejects.toThrow(BadRequestException);

    expect(resultRepositoryMock.create).not.toHaveBeenCalled();
    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should create and save a result when order validation succeeds', async () => {
            orderServiceMock.validateOrderResult.mockResolvedValueOnce(undefined);

            const dto: CreateResultDto = {
              orderId: 'order-3',
              value: 7.5,
              unit: 'g',
              status: ResultStatus.CORRECTED,
              resultDate: new Date().toISOString(),
            };

            const createdEntity = {
              ...dto,
              resultDate: new Date(dto.resultDate),
              referenceMin: null,
              referenceMax: null,
              sourceSystem: null,
              notes: null,
            } as Result;

            const savedEntity = {
              ...createdEntity,
              id: 'res-1',
              created_at: new Date(),
              updated_at: new Date(),
            } as Result;

            resultRepositoryMock.create.mockReturnValueOnce(createdEntity);
            resultRepositoryMock.save.mockResolvedValueOnce(savedEntity);

            const result = await service.createResult(dto);

            expect(orderServiceMock.validateOrderResult).toHaveBeenCalledWith(dto.orderId, dto.status);
            expect(resultRepositoryMock.create).toHaveBeenCalledWith(createdEntity);
            expect(resultRepositoryMock.save).toHaveBeenCalledWith(createdEntity);
            expect(result).toBe(savedEntity);
          });


});
});

  describe('FN_searchResults_END', () => {
describe('searchResults', () => {
  it('should throw BadRequestException when dateFrom is after dateTo', async () => {
      const dto = {
        dateFrom: '2023-05-10',
        dateTo: '2023-04-01',
      } as SearchResultsDto;

      resultRepositoryMock.search.mockRejectedValueOnce(new BadRequestException());

      await expect(service.searchResults(dto)).rejects.toThrow(BadRequestException);
    });


  it('should call repository.search with orderId filter and return results', async () => {
    const dto = {
      orderId: 'order-123',
    } as SearchResultsDto;

    const mockResults: Result[] = [
      {
        id: 'res-1',
        orderId: 'order-123',
        value: 5,
        unit: 'mg/dL',
        status: ResultStatus.FINAL,
        referenceMin: null,
        referenceMax: null,
        resultDate: new Date(),
        sourceSystem: null,
        notes: null,
        created_at: new Date(),
        updated_at: new Date(),
        order: {} as any,
      },
    ];

    resultRepositoryMock.search.mockResolvedValueOnce(mockResults);

    const result = await service.searchResults(dto);

    expect(resultRepositoryMock.search).toHaveBeenCalledWith(
      expect.objectContaining({ orderId: 'order-123' }),
    );
    expect(result).toBe(mockResults);
  });

  it('should pass combined filters (status, examType, sourceSystem) to repository.search', async () => {
    const dto = {
      status: ResultStatus.PRELIMINARY,
      examType: ExamType.HEMOGRAM,
      sourceSystem: 'labX',
    } as SearchResultsDto;

    const mockResults: Result[] = [];

    resultRepositoryMock.search.mockResolvedValueOnce(mockResults);

    const result = await service.searchResults(dto);

    expect(resultRepositoryMock.search).toHaveBeenCalledWith(
      expect.objectContaining({
        status: ResultStatus.PRELIMINARY,
        examType: ExamType.HEMOGRAM,
        sourceSystem: 'labX',
      }),
    );
    expect(result).toBe(mockResults);
  });
});
});

  describe('FN_getResultById_END', () => {
describe('getResultById', () => {
  it('should throw NotFoundException when result does not exist', async () => {
    resultRepositoryMock.findById.mockResolvedValueOnce(undefined);

    await expect(service.getResultById('test-id')).rejects.toThrow(NotFoundException);

    expect(resultRepositoryMock.findById).toHaveBeenCalledWith('test-id');
  });

  it('should return the result when found', async () => {
    const mockResult: Result = {
      id: 'test-id',
      orderId: 'order-1',
      value: 123,
      unit: 'mg',
      status: ResultStatus.FINAL,
      referenceMin: null,
      referenceMax: null,
      resultDate: new Date(),
      sourceSystem: null,
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      order: {} as any,
    };

    resultRepositoryMock.findById.mockResolvedValueOnce(mockResult);

    const result = await service.getResultById('test-id');

    expect(result).toBe(mockResult);
    expect(resultRepositoryMock.findById).toHaveBeenCalledWith('test-id');
  });
});
});

  describe('FN_buildResultReport_END', () => {
describe('buildResultReport', () => {
  it('should throw NotFoundException when order does not exist', async () => {
      orderServiceMock.getOrderById.mockResolvedValueOnce({ id: 'order-1', examType: ExamType.GLUCOSE });
      resultRepositoryMock.findByOrderId.mockResolvedValueOnce([]);
      await expect(service.buildResultReport('order-1')).rejects.toThrow(NotFoundException);
      expect(resultRepositoryMock.findByOrderId).toHaveBeenCalledWith('order-1');
    });


  it('should throw NotFoundException when no results are found for the order', async () => {
        orderServiceMock.getOrderById.mockResolvedValueOnce({ id: 'order-1' } as any);
        resultRepositoryMock.findByOrderId.mockResolvedValueOnce([]);

        await expect(service.buildResultReport('order-1')).rejects.toThrow(NotFoundException);
    });


  it('should build a correct ResultReport with summary and items', async () => {
        const order = { id: 'order-1', examType: ExamType.GLUCOSE } as any;
        orderServiceMock.getOrderById.mockResolvedValueOnce(order);

        const results = [
          {
            resultId: 'r1',
            examType: ExamType.GLUCOSE,
            value: 90,
            unit: 'mg/dL',
            status: ResultStatus.FINAL,
            referenceMin: 70,
            referenceMax: 110,
            flag: 'NORMAL',
            sourceSystem: 'lab',
            resultDate: new Date('2023-01-01T00:00:00Z'),
          },
          {
            resultId: 'r2',
            examType: ExamType.GLUCOSE,
            value: 130,
            unit: 'mg/dL',
            status: ResultStatus.PRELIMINARY,
            referenceMin: 70,
            referenceMax: 110,
            flag: 'HIGH',
            sourceSystem: 'lab',
            resultDate: new Date('2023-01-02T00:00:00Z'),
          },
          {
            resultId: 'r3',
            examType: ExamType.CREATININE,
            value: 0.5,
            unit: 'mg/dL',
            status: ResultStatus.CORRECTED,
            referenceMin: null,
            referenceMax: null,
            flag: 'UNKNOWN',
            sourceSystem: null,
            resultDate: new Date('2023-01-03T00:00:00Z'),
          },
        ] as ResultReportItem[];

        resultRepositoryMock.findByOrderId.mockResolvedValueOnce(results);

        const report = await service.buildResultReport('order-1');

        expect(report.orderId).toBe('order-1');
        expect(report.items).toHaveLength(3);
        expect(report.summary.total).toBe(3);
        expect(report.summary.preliminary).toBe(1);
        expect(report.summary.final).toBe(1);
        expect(report.summary.corrected).toBe(1);
        expect(report.summary.abnormal).toBe(2); // HIGH and LOW (due to fallback range)

        const glucoseItems = report.items.filter(i => i.examType === ExamType.GLUCOSE);
        expect(glucoseItems).toHaveLength(3);
        const highItem = glucoseItems.find(i => i.flag === 'HIGH');
        expect(highItem?.value).toBe(130);
      });

});
});

  describe('FN_updateResult_END', () => {
describe('updateResult', () => {
  it('should throw NotFoundException when result does not exist', async () => {
    resultRepositoryMock.findById.mockResolvedValueOnce(undefined);

    await expect(
      service.updateResult('nonexistent-id', {} as UpdateResultDto),
    ).rejects.toThrow(NotFoundException);
  });

  it('should update result with provided fields and return the saved entity', async () => {
    const existingResult = {
      id: 'res-1',
      orderId: 'ord-1',
      value: 10,
      unit: 'mg',
      status: ResultStatus.PRELIMINARY,
      referenceMin: null,
      referenceMax: null,
      notes: null,
    } as Result;

    resultRepositoryMock.findById.mockResolvedValueOnce(existingResult);
    const updatedDto = {
      value: 20,
      unit: 'g',
      notes: 'updated',
    } as UpdateResultDto;
    const savedResult = { ...existingResult, ...updatedDto };
    resultRepositoryMock.save.mockReturnValueOnce(savedResult);

    const result = await service.updateResult('res-1', updatedDto);

    expect(resultRepositoryMock.save).toHaveBeenCalledWith(savedResult);
    expect(result).toBe(savedResult);
  });

  it('should throw BadRequestException when attempting to downgrade status from FINAL to PRELIMINARY', async () => {
    const existingResult = {
      id: 'res-2',
      status: ResultStatus.FINAL,
    } as Result;

    resultRepositoryMock.findById.mockResolvedValueOnce(existingResult);
    const dto = { status: ResultStatus.PRELIMINARY } as UpdateResultDto;

    await expect(
      service.updateResult('res-2', dto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when referenceMin is greater than referenceMax', async () => {
    const existingResult = {
      id: 'res-3',
      status: ResultStatus.PRELIMINARY,
    } as Result;

    resultRepositoryMock.findById.mockResolvedValueOnce(existingResult);
    const dto = {
      referenceMin: 10,
      referenceMax: 5,
    } as UpdateResultDto;

    await expect(
      service.updateResult('res-3', dto),
    ).rejects.toThrow(BadRequestException);
  });
});
});

  // TESTS_APPEND_HERE
});
