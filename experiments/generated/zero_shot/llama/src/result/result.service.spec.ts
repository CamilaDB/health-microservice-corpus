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

  describe('createResult', () => {
  it('should throw NotFoundException when validateOrderResult fails', async () => {
    orderServiceMock.validateOrderResult.mockRejectedValueOnce(new NotFoundException());
    const dto: CreateResultDto = {
      orderId: 'orderId',
      value: 1,
      unit: 'unit',
      status: ResultStatus.PRELIMINARY,
      resultDate: '2022-01-01',
    };
    await expect(service.createResult(dto)).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException when validateOrderResult throws BadRequestException', async () => {
    orderServiceMock.validateOrderResult.mockRejectedValueOnce(new BadRequestException());
    const dto: CreateResultDto = {
      orderId: 'orderId',
      value: 1,
      unit: 'unit',
      status: ResultStatus.PRELIMINARY,
      resultDate: '2022-01-01',
    };
    await expect(service.createResult(dto)).rejects.toThrow(BadRequestException);
  });

  it('should save result when validateOrderResult succeeds', async () => {
    const result = { id: 'id', orderId: 'orderId', value: 1, unit: 'unit', status: ResultStatus.PRELIMINARY, resultDate: new Date('2022-01-01') } as Result;
    resultRepositoryMock.create.mockReturnValueOnce(result);
    resultRepositoryMock.save.mockResolvedValueOnce(result);
    const dto: CreateResultDto = {
      orderId: 'orderId',
      value: 1,
      unit: 'unit',
      status: ResultStatus.PRELIMINARY,
      resultDate: '2022-01-01',
    };
    const savedResult = await service.createResult(dto);
    expect(savedResult).toEqual(result);
  });
});

  describe('searchResults', () => {
  it('should return an empty array when no results are found', async () => {
    resultRepositoryMock.search.mockResolvedValue([]);
    const dto: SearchResultsDto = {};
    const results = await service.searchResults(dto);
    expect(results).toEqual([]);
  });

  it('should return results when found', async () => {
    const result: Result = {
      id: 'id',
      orderId: 'orderId',
      value: 10,
      unit: 'unit',
      status: ResultStatus.PRELIMINARY,
      referenceMin: 5,
      referenceMax: 15,
      resultDate: new Date(),
      sourceSystem: 'sourceSystem',
      notes: 'notes',
      created_at: new Date(),
      updated_at: new Date(),
      order: {} as any,
    };
    resultRepositoryMock.search.mockResolvedValue([result]);
    const dto: SearchResultsDto = {};
    const results = await service.searchResults(dto);
    expect(results).toEqual([result]);
  });

  it('should filter results by orderId', async () => {
    const result: Result = {
      id: 'id',
      orderId: 'orderId',
      value: 10,
      unit: 'unit',
      status: ResultStatus.PRELIMINARY,
      referenceMin: 5,
      referenceMax: 15,
      resultDate: new Date(),
      sourceSystem: 'sourceSystem',
      notes: 'notes',
      created_at: new Date(),
      updated_at: new Date(),
      order: {} as any,
    };
    resultRepositoryMock.search.mockResolvedValue([result]);
    const dto: SearchResultsDto = { orderId: 'orderId' };
    const results = await service.searchResults(dto);
    expect(results).toEqual([result]);
  });

  it('should filter results by status', async () => {
    const result: Result = {
      id: 'id',
      orderId: 'orderId',
      value: 10,
      unit: 'unit',
      status: ResultStatus.PRELIMINARY,
      referenceMin: 5,
      referenceMax: 15,
      resultDate: new Date(),
      sourceSystem: 'sourceSystem',
      notes: 'notes',
      created_at: new Date(),
      updated_at: new Date(),
      order: {} as any,
    };
    resultRepositoryMock.search.mockResolvedValue([result]);
    const dto: SearchResultsDto = { status: ResultStatus.PRELIMINARY };
    const results = await service.searchResults(dto);
    expect(results).toEqual([result]);
  });

  it('should filter results by examType', async () => {
    const result: Result = {
      id: 'id',
      orderId: 'orderId',
      value: 10,
      unit: 'unit',
      status: ResultStatus.PRELIMINARY,
      referenceMin: 5,
      referenceMax: 15,
      resultDate: new Date(),
      sourceSystem: 'sourceSystem',
      notes: 'notes',
      created_at: new Date(),
      updated_at: new Date(),
      order: {} as any,
    };
    resultRepositoryMock.search.mockResolvedValue([result]);
    const dto: SearchResultsDto = { examType: ExamType.HEMOGRAM };
    const results = await service.searchResults(dto);
    expect(results).toEqual([result]);
  });

  it('should filter results by dateFrom', async () => {
    const result: Result = {
      id: 'id',
      orderId: 'orderId',
      value: 10,
      unit: 'unit',
      status: ResultStatus.PRELIMINARY,
      referenceMin: 5,
      referenceMax: 15,
      resultDate: new Date(),
      sourceSystem: 'sourceSystem',
      notes: 'notes',
      created_at: new Date(),
      updated_at: new Date(),
      order: {} as any,
    };
    resultRepositoryMock.search.mockResolvedValue([result]);
    const dto: SearchResultsDto = { dateFrom: '2022-01-01' };
    const results = await service.searchResults(dto);
    expect(results).toEqual([result]);
  });

  it('should filter results by dateTo', async () => {
    const result: Result = {
      id: 'id',
      orderId: 'orderId',
      value: 10,
      unit: 'unit',
      status: ResultStatus.PRELIMINARY,
      referenceMin: 5,
      referenceMax: 15,
      resultDate: new Date(),
      sourceSystem: 'sourceSystem',
      notes: 'notes',
      created_at: new Date(),
      updated_at: new Date(),
      order: {} as any,
    };
    resultRepositoryMock.search.mockResolvedValue([result]);
    const dto: SearchResultsDto = { dateTo: '2022-01-01' };
    const results = await service.searchResults(dto);
    expect(results).toEqual([result]);
  });

  it('should filter results by sourceSystem', async () => {
    const result: Result = {
      id: 'id',
      orderId: 'orderId',
      value: 10,
      unit: 'unit',
      status: ResultStatus.PRELIMINARY,
      referenceMin: 5,
      referenceMax: 15,
      resultDate: new Date(),
      sourceSystem: 'sourceSystem',
      notes: 'notes',
      created_at: new Date(),
      updated_at: new Date(),
      order: {} as any,
    };
    resultRepositoryMock.search.mockResolvedValue([result]);
    const dto: SearchResultsDto = { sourceSystem: 'sourceSystem' };
    const results = await service.searchResults(dto);
    expect(results).toEqual([result]);
  });
});

  describe('getResultById', () => {
  it('should throw NotFoundException when result is not found', async () => {
    const id = 'non-existent-id';
    resultRepositoryMock.findById.mockResolvedValueOnce(undefined);
    await expect(service.getResultById(id)).rejects.toThrow(NotFoundException);
  });

  it('should return result when found', async () => {
    const id = 'existing-id';
    const result: Result = {
      id,
      orderId: 'order-id',
      value: 10,
      unit: 'unit',
      status: ResultStatus.PRELIMINARY,
      referenceMin: 5,
      referenceMax: 15,
      resultDate: new Date(),
      sourceSystem: 'source-system',
      notes: 'notes',
      created_at: new Date(),
      updated_at: new Date(),
      order: {} as any,
    };
    resultRepositoryMock.findById.mockResolvedValueOnce(result);
    const returnedResult = await service.getResultById(id);
    expect(returnedResult).toEqual(result);
  });
});

  describe('buildResultReport', () => {
  it('should throw NotFoundException when no results found for order', async () => {
    orderServiceMock.getOrderById.mockResolvedValue({ id: 'orderId', examType: ExamType.GLUCOSE });
    resultRepositoryMock.findByOrderId.mockResolvedValue([]);
    await expect(service.buildResultReport('orderId')).rejects.toThrow(NotFoundException);
  });
});

  describe('updateResult', () => {
  it('should throw BadRequestException when trying to change status of a CORRECTED result', async () => {
    const id = 'id';
    const dto: UpdateResultDto = { status: ResultStatus.FINAL };
    const result: Result = { status: ResultStatus.CORRECTED };
    resultRepositoryMock.findById.mockResolvedValue(result);
    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when trying to make an invalid status transition', async () => {
          const id = 'id';
          const dto: UpdateResultDto = { status: ResultStatus.CORRECTED };
          const result: Result = { status: ResultStatus.CORRECTED };
          resultRepositoryMock.findById.mockResolvedValue(result);
          await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
      });


  it('should throw BadRequestException when trying to update value of a non-preliminary result', async () => {
    const id = 'id';
    const dto: UpdateResultDto = { value: 10 };
    const result: Result = { status: ResultStatus.FINAL };
    resultRepositoryMock.findById.mockResolvedValue(result);
    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when trying to update unit of a non-preliminary result', async () => {
    const id = 'id';
    const dto: UpdateResultDto = { unit: 'unit' };
    const result: Result = { status: ResultStatus.FINAL };
    resultRepositoryMock.findById.mockResolvedValue(result);
    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when trying to update referenceMin of a final result', async () => {
    const id = 'id';
    const dto: UpdateResultDto = { referenceMin: 10 };
    const result: Result = { status: ResultStatus.FINAL };
    resultRepositoryMock.findById.mockResolvedValue(result);
    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when trying to update referenceMax of a final result', async () => {
    const id = 'id';
    const dto: UpdateResultDto = { referenceMax: 10 };
    const result: Result = { status: ResultStatus.FINAL };
    resultRepositoryMock.findById.mockResolvedValue(result);
    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when referenceMin is not less than referenceMax', async () => {
    const id = 'id';
    const dto: UpdateResultDto = { referenceMin: 10, referenceMax: 5 };
    const result: Result = { status: ResultStatus.PRELIMINARY };
    resultRepositoryMock.findById.mockResolvedValue(result);
    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });
});

  // TESTS_APPEND_HERE
});
