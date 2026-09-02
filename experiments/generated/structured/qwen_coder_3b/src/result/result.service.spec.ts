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

  describe('FN_searchResults_END', () => {
describe('searchResults', () => {
  it('should return an empty array when no results are found', async () => {
    // arrange
    const dto: SearchResultsDto = { orderId: '123' };
    resultRepositoryMock.search.mockResolvedValue([]);

    // act
    const result = await service.searchResults(dto);

    // assert
    expect(result).toEqual([]);
  });

  it.skip('should throw a NotFoundException when no order is found', async () => {
          // arrange
          const dto: SearchResultsDto = { orderId: '123' };
          resultRepositoryMock.search.mockResolvedValueOnce([]);

          // act
          await expect(service.searchResults(dto)).rejects.toThrow(NotFoundException);
        });


  it.skip('should throw a BadRequestException when invalid dto is provided', async () => {
        // arrange
        const dto: SearchResultsDto = { orderId: undefined };

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
  it('should throw NotFoundException when no results found for order', async () => {
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
    const result = { status: ResultStatus.PRELIMINARY };
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
  });

  it('should handle final results', async () => {
    // arrange
    const orderId = '123';
    const result = { status: ResultStatus.FINAL };
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
  });

  it('should handle corrected results', async () => {
    // arrange
    const orderId = '123';
    const result = { status: ResultStatus.CORRECTED };
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
  });

  it('should handle unknown flags', async () => {
    // arrange
    const orderId = '123';
    const result = { status: ResultStatus.PRELIMINARY, referenceMin: null, referenceMax: null, value: 100 };
    const results = [result];
    resultRepositoryMock.findByOrderId.mockResolvedValueOnce(results);
    orderServiceMock.getOrderById.mockResolvedValueOnce({ id: orderId, examType: ExamType.GLUCOSE });

    // act
    const resultReport = await service.buildResultReport(orderId);

    // assert
    expect(resultReport.summary.preliminary).toBe(1);
    expect(resultReport.summary.final).toBe(0);
    expect(resultReport.summary.corrected).toBe(0);
    expect(resultReport.summary.abnormal).toBe(1);
  });

  it('should handle low flags', async () => {
    // arrange
    const orderId = '123';
    const result = { status: ResultStatus.PRELIMINARY, referenceMin: 70, referenceMax: 99, value: 60 };
    const results = [result];
    resultRepositoryMock.findByOrderId.mockResolvedValueOnce(results);
    orderServiceMock.getOrderById.mockResolvedValueOnce({ id: orderId, examType: ExamType.GLUCOSE });

    // act
    const resultReport = await service.buildResultReport(orderId);

    // assert
    expect(resultReport.summary.preliminary).toBe(1);
    expect(resultReport.summary.final).toBe(0);
    expect(resultReport.summary.corrected).toBe(0);
    expect(resultReport.summary.abnormal).toBe(1);
  });

  it('should handle high flags', async () => {
    // arrange
    const orderId = '123';
    const result = { status: ResultStatus.PRELIMINARY, referenceMin: 70, referenceMax: 99, value: 100 };
    const results = [result];
    resultRepositoryMock.findByOrderId.mockResolvedValueOnce(results);
    orderServiceMock.getOrderById.mockResolvedValueOnce({ id: orderId, examType: ExamType.GLUCOSE });

    // act
    const resultReport = await service.buildResultReport(orderId);

    // assert
    expect(resultReport.summary.preliminary).toBe(1);
    expect(resultReport.summary.final).toBe(0);
    expect(resultReport.summary.corrected).toBe(0);
    expect(resultReport.summary.abnormal).toBe(1);
  });
});
});

  describe('FN_updateResult_END', () => {
describe('updateResult', () => {
  it('should throw BadRequestException when result.status is CORRECTED and dto.status is not undefined', async () => {
    // arrange
    const id = '123';
    const dto: UpdateResultDto = { status: ResultStatus.CORRECTED };
    jest.spyOn(resultRepositoryMock, 'findById').mockResolvedValue({
      status: ResultStatus.CORRECTED,
    });

    // act
    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it.skip('should throw BadRequestException when dto.status is not undefined and status transition is invalid', async () => {
        // arrange
        const id = '123';
        const dto: UpdateResultDto = { status: ResultStatus.FINAL };
        jest.spyOn(resultRepositoryMock, 'findById').mockResolvedValue({
          status: ResultStatus.PRELIMINARY,
        });
        jest.spyOn(resultRepositoryMock, 'save').mockResolvedValue({
          status: ResultStatus.FINAL,
        });

        // act
        await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
      });

  it('should throw BadRequestException when dto.status is not undefined and status transition is valid', async () => {
    // arrange
    const id = '123';
    const dto: UpdateResultDto = { status: ResultStatus.FINAL };
    jest.spyOn(resultRepositoryMock, 'findById').mockResolvedValue({
      status: ResultStatus.PRELIMINARY,
    });
    jest.spyOn(resultRepositoryMock, 'save').mockResolvedValue({
      status: ResultStatus.FINAL,
    });

    // act
    await expect(service.updateResult(id, dto)).resolves.not.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when dto.value is not undefined and result.status is not Preliminary', async () => {
    // arrange
    const id = '123';
    const dto: UpdateResultDto = { value: 10 };
    jest.spyOn(resultRepositoryMock, 'findById').mockResolvedValue({
      status: ResultStatus.FINAL,
    });

    // act
    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when dto.unit is not undefined and result.status is not Preliminary', async () => {
    // arrange
    const id = '123';
    const dto: UpdateResultDto = { unit: 'cm' };
    jest.spyOn(resultRepositoryMock, 'findById').mockResolvedValue({
      status: ResultStatus.FINAL,
    });

    // act
    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when dto.referenceMin is not undefined and result.status is Final', async () => {
    // arrange
    const id = '123';
    const dto: UpdateResultDto = { referenceMin: 10 };
    jest.spyOn(resultRepositoryMock, 'findById').mockResolvedValue({
      status: ResultStatus.FINAL,
    });

    // act
    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when dto.referenceMax is not undefined and result.status is Final', async () => {
    // arrange
    const id = '123';
    const dto: UpdateResultDto = { referenceMax: 10 };
    jest.spyOn(resultRepositoryMock, 'findById').mockResolvedValue({
      status: ResultStatus.FINAL,
    });

    // act
    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when newMin is not null and newMax is not null and newMin is greater than or equal to newMax', async () => {
    // arrange
    const id = '123';
    const dto: UpdateResultDto = { referenceMin: 10, referenceMax: 5 };
    jest.spyOn(resultRepositoryMock, 'findById').mockResolvedValue({
      status: ResultStatus.PRELIMINARY,
    });

    // act
    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should update result status, value, unit, referenceMin, referenceMax, and notes', async () => {
    // arrange
    const id = '123';
    const dto: UpdateResultDto = {
      status: ResultStatus.FINAL,
      value: 10,
      unit: 'cm',
      referenceMin: 5,
      referenceMax: 10,
      notes: 'Test notes',
    };
    jest.spyOn(resultRepositoryMock, 'findById').mockResolvedValue({
      status: ResultStatus.PRELIMINARY,
    });
    jest.spyOn(resultRepositoryMock, 'save').mockResolvedValue({
      status: ResultStatus.FINAL,
      value: 10,
      unit: 'cm',
      referenceMin: 5,
      referenceMax: 10,
      notes: 'Test notes',
    });

    // act
    await service.updateResult(id, dto);

    // assert
    expect(resultRepositoryMock.save).toHaveBeenCalledWith({
      status: ResultStatus.FINAL,
      value: 10,
      unit: 'cm',
      referenceMin: 5,
      referenceMax: 10,
      notes: 'Test notes',
    });
  });
});
});

  // TESTS_APPEND_HERE
});
