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
  it('should validate order, create entity with transformed fields, save and return the result', async () => {
    const dto = {
      orderId: 'order-123',
      value: 42,
      unit: 'mg',
      status: ResultStatus.PRELIMINARY,
      resultDate: '2023-01-01T00:00:00.000Z',
    } as CreateResultDto;

    orderServiceMock.validateOrderResult.mockResolvedValueOnce(undefined);

    const createdEntity = {
      ...dto,
      resultDate: new Date(dto.resultDate),
      referenceMin: null,
      referenceMax: null,
      sourceSystem: null,
      notes: null,
    } as any;

    resultRepositoryMock.create.mockReturnValueOnce(createdEntity);

    const savedResult = {
      ...createdEntity,
      id: 'result-456',
      created_at: new Date(),
      updated_at: new Date(),
    } as any;

    resultRepositoryMock.save.mockResolvedValueOnce(savedResult);

    const result = await service.createResult(dto);

    expect(orderServiceMock.validateOrderResult).toHaveBeenCalledWith(dto.orderId, dto.status);
    expect(resultRepositoryMock.create).toHaveBeenCalledWith({
      ...dto,
      resultDate: new Date(dto.resultDate),
      referenceMin: null,
      referenceMax: null,
      sourceSystem: null,
      notes: null,
    });
    expect(resultRepositoryMock.save).toHaveBeenCalledWith(createdEntity);
    expect(result).toBe(savedResult);
  });
});
});

  describe('FN_searchResults_END', () => {
describe('searchResults', () => {
  it('should return results from repository', async () => {
    const dto = { orderId: 'order-123' } as SearchResultsDto;
    const expected: Result[] = [
      {
        id: 'res-1',
        orderId: 'order-123',
        value: 42,
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
    resultRepositoryMock.search.mockReturnValueOnce(expected);
    const result = await service.searchResults(dto);
    expect(result).toBe(expected);
    expect(resultRepositoryMock.search).toHaveBeenCalledWith(dto);
  });
});
});

  describe('FN_getResultById_END', () => {
describe('getResultById', () => {
  it('should throw NotFoundException when result does not exist', async () => {
    const id = 'test-id';
    resultRepositoryMock.findById.mockResolvedValueOnce(undefined);
    await expect(service.getResultById(id)).rejects.toThrow(NotFoundException);
  });
});
});

  describe('FN_updateResult_END', () => {
describe('updateResult', () => {
  it('should throw BadRequestException when trying to change status of a CORRECTED result', async () => {
    const result = {
      id: '1',
      status: ResultStatus.CORRECTED,
      referenceMin: null,
      referenceMax: null,
    } as unknown as Result;
    const dto = { status: ResultStatus.FINAL } as UpdateResultDto;
    jest.spyOn(service as any, 'getResultById').mockResolvedValueOnce(result);
    await expect(service.updateResult('1', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException for invalid status transition', async () => {
    const result = {
      id: '2',
      status: ResultStatus.PRELIMINARY,
      referenceMin: null,
      referenceMax: null,
    } as unknown as Result;
    const dto = { status: ResultStatus.PRELIMINARY } as UpdateResultDto;
    jest.spyOn(service as any, 'getResultById').mockResolvedValueOnce(result);
    await expect(service.updateResult('2', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when updating value of a non‑preliminary result', async () => {
    const result = {
      id: '3',
      status: ResultStatus.FINAL,
      referenceMin: null,
      referenceMax: null,
    } as unknown as Result;
    const dto = { value: 42 } as UpdateResultDto;
    jest.spyOn(service as any, 'getResultById').mockResolvedValueOnce(result);
    await expect(service.updateResult('3', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when updating unit of a non‑preliminary result', async () => {
    const result = {
      id: '4',
      status: ResultStatus.FINAL,
      referenceMin: null,
      referenceMax: null,
    } as unknown as Result;
    const dto = { unit: 'kg' } as UpdateResultDto;
    jest.spyOn(service as any, 'getResultById').mockResolvedValueOnce(result);
    await expect(service.updateResult('4', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when updating referenceMin of a FINAL result', async () => {
    const result = {
      id: '5',
      status: ResultStatus.FINAL,
      referenceMin: null,
      referenceMax: null,
    } as unknown as Result;
    const dto = { referenceMin: 10 } as UpdateResultDto;
    jest.spyOn(service as any, 'getResultById').mockResolvedValueOnce(result);
    await expect(service.updateResult('5', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when updating referenceMax of a FINAL result', async () => {
    const result = {
      id: '6',
      status: ResultStatus.FINAL,
      referenceMin: null,
      referenceMax: null,
    } as unknown as Result;
    const dto = { referenceMax: 100 } as UpdateResultDto;
    jest.spyOn(service as any, 'getResultById').mockResolvedValueOnce(result);
    await expect(service.updateResult('6', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when referenceMin is not less than referenceMax', async () => {
    const result = {
      id: '7',
      status: ResultStatus.PRELIMINARY,
      referenceMin: null,
      referenceMax: null,
    } as unknown as Result;
    const dto = { referenceMin: 20, referenceMax: 10 } as UpdateResultDto;
    jest.spyOn(service as any, 'getResultById').mockResolvedValueOnce(result);
    await expect(service.updateResult('7', dto)).rejects.toThrow(BadRequestException);
  });
});
});

  // TESTS_APPEND_HERE
});
