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
  it.skip('should create a new result and save it to the repository', async () => {
        // Arrange
        const dto: CreateResultDto = {
          orderId: '123',
          value: 100,
          unit: 'cm',
          status: ResultStatus.PRELIMINARY,
          resultDate: '2023-10-01',
        };
        const result: Result = {
          id: '456',
          orderId: '123',
          value: 100,
          unit: 'cm',
          status: ResultStatus.PRELIMINARY,
          referenceMin: null,
          referenceMax: null,
          resultDate: new Date('2023-10-01'),
          sourceSystem: null,
          notes: null,
          created_at: new Date(),
          updated_at: new Date(),
          order: undefined,
        };
        resultRepositoryMock.create.mockResolvedValue(result);
        resultRepositoryMock.save.mockResolvedValue(result);

        // Act
        const resultEntity = await service.createResult(dto);

        // Assert
        expect(resultEntity).toEqual(result);
        expect(resultRepositoryMock.create).toHaveBeenCalledWith({
          ...dto,
          resultDate: new Date(dto.resultDate),
          referenceMin: dto.referenceMin ?? null,
          referenceMax: dto.referenceMax ?? null,
          sourceSystem: dto.sourceSystem ?? null,
          notes: dto.notes ?? null,
        });
        expect(resultRepositoryMock.save).toHaveBeenCalledWith(result);
      });

  it.skip('should throw an error if the order does not exist', async () => {
          // Arrange
          const dto: CreateResultDto = {
            orderId: '123',
            value: 100,
            unit: 'cm',
            status: ResultStatus.PRELIMINARY,
            resultDate: '2023-10-01',
          };
          orderServiceMock.validateOrderResult.mockResolvedValueOnce(null);

          // Act
          await expect(service.createResult(dto)).rejects.toThrow();

          // Assert
          expect(orderServiceMock.validateOrderResult).toHaveBeenCalledWith('123', ResultStatus.PRELIMINARY);
          expect(resultRepositoryMock.create).not.toHaveBeenCalled();
          expect(resultRepositoryMock.save).not.toHaveBeenCalled();
        });



  it.skip('should throw an error if the order is not valid', async () => {
          // Arrange
          const dto: CreateResultDto = {
            orderId: '123',
            value: 100,
            unit: 'cm',
            status: ResultStatus.PRELIMINARY,
            resultDate: '2023-10-01',
          };
          orderServiceMock.validateOrderResult.mockResolvedValueOnce(new Error('Order is invalid'));

          // Act
          await expect(service.createResult(dto)).rejects.toThrow('Order is invalid');

          // Assert
          expect(orderServiceMock.validateOrderResult).toHaveBeenCalledWith('123', ResultStatus.PRELIMINARY);
          expect(resultRepositoryMock.create).not.toHaveBeenCalled();
          expect(resultRepositoryMock.save).not.toHaveBeenCalled();
        });

});
});

  describe('FN_searchResults_END', () => {
describe('searchResults', () => {
  it('should return an empty array when no results are found', async () => {
    // arrange
    resultRepositoryMock.search.mockResolvedValue([]);

    // act
    const results = await service.searchResults({});

    // assert
    expect(results).toEqual([]);
  });

  it('should return results based on the provided dto', async () => {
    // arrange
    const dto: SearchResultsDto = { orderId: '123' };
    const expectedResults: Result[] = [
      { id: '1', orderId: '123', value: 100, unit: 'mg/dL', status: ResultStatus.PRELIMINARY, created_at: new Date() },
    ];
    resultRepositoryMock.search.mockResolvedValue(expectedResults);

    // act
    const results = await service.searchResults(dto);

    // assert
    expect(results).toEqual(expectedResults);
  });

  it.skip('should throw a NotFoundException if no results are found', async () => {
        // arrange
        resultRepositoryMock.search.mockResolvedValue([]);

        // act
        await expect(service.searchResults({})).rejects.toThrow(NotFoundException);
      });

  it.skip('should throw a BadRequestException if dto is invalid', async () => {
        // arrange
        const dto: SearchResultsDto = { orderId: '123' as any };

        // act
        await expect(service.searchResults(dto)).rejects.toThrow(BadRequestException);
      });
});
});

  describe('FN_getResultById_END', () => {
describe('getResultById', () => {
  it('should throw NotFoundException when result is not found', async () => {
    // arrange: mock dependencies
    resultRepositoryMock.findById.mockResolvedValueOnce(undefined);

    // act: call the service method
    await expect(service.getResultById('123')).rejects.toThrow(NotFoundException);
  });
});
});

  describe('FN_buildResultReport_END', () => {
describe('buildResultReport', () => {
  it('should throw NotFoundException when no results are found for order', async () => {
    // arrange
    const orderId = '123';
    resultRepositoryMock.findByOrderId.mockResolvedValueOnce([]);
    orderServiceMock.getOrderById.mockResolvedValueOnce({ id: orderId, examType: ExamType.GLUCOSE });

    // act
    await expect(service.buildResultReport(orderId)).rejects.toThrow(NotFoundException);
  });

  it('should handle preliminary results', async () => {
    // arrange
    const orderId = '123';
    const result = { id: '456', status: ResultStatus.PRELIMINARY, value: 80, unit: 'mg/dL', referenceMin: 70, referenceMax: 99, sourceSystem: 'system1', resultDate: new Date() };
    const results = [result];
    resultRepositoryMock.findByOrderId.mockResolvedValueOnce(results);
    orderServiceMock.getOrderById.mockResolvedValueOnce({ id: orderId, examType: ExamType.GLUCOSE });

    // act
    const resultReport = await service.buildResultReport(orderId);

    // assert
    expect(resultReport.summary.preliminary).toBe(1);
    expect(resultReport.summary.final).toBe(0);
    expect(resultReport.summary.corrected).toBe(0);
    expect(resultReport.summary.abnormal).toBe(0);
    expect(resultReport.items.length).toBe(1);
    expect(resultReport.items[0].status).toBe(ResultStatus.PRELIMINARY);
  });

  it('should handle final results', async () => {
    // arrange
    const orderId = '123';
    const result = { id: '456', status: ResultStatus.FINAL, value: 90, unit: 'mg/dL', referenceMin: 70, referenceMax: 99, sourceSystem: 'system1', resultDate: new Date() };
    const results = [result];
    resultRepositoryMock.findByOrderId.mockResolvedValueOnce(results);
    orderServiceMock.getOrderById.mockResolvedValueOnce({ id: orderId, examType: ExamType.GLUCOSE });

    // act
    const resultReport = await service.buildResultReport(orderId);

    // assert
    expect(resultReport.summary.preliminary).toBe(0);
    expect(resultReport.summary.final).toBe(1);
    expect(resultReport.summary.corrected).toBe(0);
    expect(resultReport.summary.abnormal).toBe(0);
    expect(resultReport.items.length).toBe(1);
    expect(resultReport.items[0].status).toBe(ResultStatus.FINAL);
  });

  it('should handle corrected results', async () => {
    // arrange
    const orderId = '123';
    const result = { id: '456', status: ResultStatus.CORRECTED, value: 85, unit: 'mg/dL', referenceMin: 70, referenceMax: 99, sourceSystem: 'system1', resultDate: new Date() };
    const results = [result];
    resultRepositoryMock.findByOrderId.mockResolvedValueOnce(results);
    orderServiceMock.getOrderById.mockResolvedValueOnce({ id: orderId, examType: ExamType.GLUCOSE });

    // act
    const resultReport = await service.buildResultReport(orderId);

    // assert
    expect(resultReport.summary.preliminary).toBe(0);
    expect(resultReport.summary.final).toBe(0);
    expect(resultReport.summary.corrected).toBe(1);
    expect(resultReport.summary.abnormal).toBe(0);
    expect(resultReport.items.length).toBe(1);
    expect(resultReport.items[0].status).toBe(ResultStatus.CORRECTED);
  });

  it.skip('should handle referenceMin and referenceMax as null', async () => {
        // arrange
        const orderId = '123';
        const result = { id: '456', status: ResultStatus.FINAL, value: 85, unit: 'mg/dL', referenceMin: null, referenceMax: null, sourceSystem: 'system1', resultDate: new Date() };
        const results = [result];
        resultRepositoryMock.findByOrderId.mockResolvedValueOnce(results);
        orderServiceMock.getOrderById.mockResolvedValueOnce({ id: orderId, examType: ExamType.GLUCOSE });

        // act
        const resultReport = await service.buildResultReport(orderId);

        // assert
        expect(resultReport.summary.preliminary).toBe(0);
        expect(resultReport.summary.final).toBe(1);
        expect(resultReport.summary.corrected).toBe(0);
        expect(resultReport.summary.abnormal).toBe(0);
        expect(resultReport.items.length).toBe(1);
        expect(resultReport.items[0].status).toBe(ResultStatus.FINAL);
        expect(resultReport.items[0].flag).toBe('UNKNOWN');
      });

  it('should handle referenceMin and referenceMax as numbers', async () => {
    // arrange
    const orderId = '123';
    const result = { id: '456', status: ResultStatus.FINAL, value: 85, unit: 'mg/dL', referenceMin: 70, referenceMax: 99, sourceSystem: 'system1', resultDate: new Date() };
    const results = [result];
    resultRepositoryMock.findByOrderId.mockResolvedValueOnce(results);
    orderServiceMock.getOrderById.mockResolvedValueOnce({ id: orderId, examType: ExamType.GLUCOSE });

    // act
    const resultReport = await service.buildResultReport(orderId);

    // assert
    expect(resultReport.summary.preliminary).toBe(0);
    expect(resultReport.summary.final).toBe(1);
    expect(resultReport.summary.corrected).toBe(0);
    expect(resultReport.summary.abnormal).toBe(0);
    expect(resultReport.items.length).toBe(1);
    expect(resultReport.items[0].status).toBe(ResultStatus.FINAL);
    expect(resultReport.items[0].flag).toBe('NORMAL');
  });

  it.skip('should handle referenceMin less than value', async () => {
        // arrange
        const orderId = '123';
        const result = { id: '456', status: ResultStatus.FINAL, value: 75, unit: 'mg/dL', referenceMin: 70, referenceMax: 99, sourceSystem: 'system1', resultDate: new Date() };
        const results = [result];
        resultRepositoryMock.findByOrderId.mockResolvedValueOnce(results);
        orderServiceMock.getOrderById.mockResolvedValueOnce({ id: orderId, examType: ExamType.GLUCOSE });

        // act
        const resultReport = await service.buildResultReport(orderId);

        // assert
        expect(resultReport.summary.preliminary).toBe(0);
        expect(resultReport.summary.final).toBe(1);
        expect(resultReport.summary.corrected).toBe(0);
        expect(resultReport.summary.abnormal).toBe(1);
        expect(resultReport.items.length).toBe(1);
        expect(resultReport.items[0].status).toBe(ResultStatus.FINAL);
        expect(resultReport.items[0].flag).toBe('LOW');
      });

  it('should handle referenceMax greater than value', async () => {
    // arrange
    const orderId = '123';
    const result = { id: '456', status: ResultStatus.FINAL, value: 100, unit: 'mg/dL', referenceMin: 70, referenceMax: 99, sourceSystem: 'system1', resultDate: new Date() };
    const results = [result];
    resultRepositoryMock.findByOrderId.mockResolvedValueOnce(results);
    orderServiceMock.getOrderById.mockResolvedValueOnce({ id: orderId, examType: ExamType.GLUCOSE });

    // act
    const resultReport = await service.buildResultReport(orderId);

    // assert
    expect(resultReport.summary.preliminary).toBe(0);
    expect(resultReport.summary.final).toBe(1);
    expect(resultReport.summary.corrected).toBe(0);
    expect(resultReport.summary.abnormal).toBe(1);
    expect(resultReport.items.length).toBe(1);
    expect(resultReport.items[0].status).toBe(ResultStatus.FINAL);
    expect(resultReport.items[0].flag).toBe('HIGH');
  });
});
});

  describe('FN_updateResult_END', () => {
describe('updateResult', () => {
  it('should throw BadRequestException if result.status is CORRECTED and dto.status is provided', async () => {
    const result = { status: ResultStatus.CORRECTED } as Result;
    const dto = { status: ResultStatus.FINAL } as UpdateResultDto;
    jest.spyOn(resultRepositoryMock, 'findById').mockResolvedValue(result);
    await expect(service.updateResult('id', dto)).rejects.toThrow(BadRequestException);
  });

  it.skip('should throw BadRequestException if dto.status is provided but not a valid transition', async () => {
        const result = { status: ResultStatus.PRELIMINARY } as Result;
        const dto = { status: ResultStatus.CORRECTED } as UpdateResultDto;
        jest.spyOn(resultRepositoryMock, 'findById').mockResolvedValue(result);
        await expect(service.updateResult('id', dto)).rejects.toThrow(BadRequestException);
      });

  it('should throw BadRequestException if dto.value is provided but result.status is not PRELIMINARY', async () => {
    const result = { status: ResultStatus.FINAL } as Result;
    const dto = { value: 10 } as UpdateResultDto;
    jest.spyOn(resultRepositoryMock, 'findById').mockResolvedValue(result);
    await expect(service.updateResult('id', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if dto.unit is provided but result.status is not PRELIMINARY', async () => {
    const result = { status: ResultStatus.FINAL } as Result;
    const dto = { unit: 'cm' } as UpdateResultDto;
    jest.spyOn(resultRepositoryMock, 'findById').mockResolvedValue(result);
    await expect(service.updateResult('id', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if dto.referenceMin is provided but result.status is FINAL', async () => {
    const result = { status: ResultStatus.FINAL } as Result;
    const dto = { referenceMin: 10 } as UpdateResultDto;
    jest.spyOn(resultRepositoryMock, 'findById').mockResolvedValue(result);
    await expect(service.updateResult('id', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if dto.referenceMax is provided but result.status is FINAL', async () => {
    const result = { status: ResultStatus.FINAL } as Result;
    const dto = { referenceMax: 10 } as UpdateResultDto;
    jest.spyOn(resultRepositoryMock, 'findById').mockResolvedValue(result);
    await expect(service.updateResult('id', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if newMin is greater than or equal to newMax', async () => {
    const result = { status: ResultStatus.PRELIMINARY } as Result;
    const dto = { referenceMin: 10, referenceMax: 5 } as UpdateResultDto;
    jest.spyOn(resultRepositoryMock, 'findById').mockResolvedValue(result);
    await expect(service.updateResult('id', dto)).rejects.toThrow(BadRequestException);
  });
});
});

  // TESTS_APPEND_HERE
});
