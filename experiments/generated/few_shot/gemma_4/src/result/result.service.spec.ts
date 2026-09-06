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
  it('should call validateOrderResult and create the result', async () => {
    const dto = {
      orderId: 'order-123',
      status: 'FINAL',
      resultDate: '2023-01-01',
      referenceMin: 10,
      referenceMax: 20,
      sourceSystem: 'SystemA',
      notes: 'Test notes',
    };
    const createdResult = { id: 'res-456', orderId: 'order-123', status: 'FINAL', resultDate: new Date('2023-01-01') };

    orderServiceMock.validateOrderResult.mockResolvedValue(undefined);
    resultRepositoryMock.create.mockReturnValue(createdResult);
    resultRepositoryMock.save.mockResolvedValue(createdResult);

    await service.createResult(dto);

    expect(orderServiceMock.validateOrderResult).toHaveBeenCalledWith('order-123', 'FINAL');
    expect(resultRepositoryMock.create).toHaveBeenCalledTimes(1);
    expect(resultRepositoryMock.save).toHaveBeenCalledWith(createdResult);
  });

  it('should handle missing optional fields by setting them to null', async () => {
    const dto = {
      orderId: 'order-456',
      status: 'CORRECTED',
      resultDate: '2023-01-01',
      referenceMin: 50,
      referenceMax: undefined,
      sourceSystem: undefined,
      notes: undefined,
    };
    const createdResult = { id: 'res-789', orderId: 'order-456', status: 'CORRECTED', resultDate: new Date('2023-01-01') };

    orderServiceMock.validateOrderResult.mockResolvedValue(undefined);
    resultRepositoryMock.create.mockReturnValue(createdResult);
    resultRepositoryMock.save.mockResolvedValue(createdResult);

    await service.createResult(dto);

    expect(resultRepositoryMock.create).toHaveBeenCalledWith({
      orderId: 'order-456',
      status: 'CORRECTED',
      resultDate: new Date('2023-01-01'),
      referenceMin: 50,
      referenceMax: null,
      sourceSystem: null,
      notes: null,
    });
    expect(resultRepositoryMock.save).toHaveBeenCalledTimes(1);
  });
});
});

  describe('FN_searchResults_END', () => {
describe('searchResults', () => {
  it('should return the results from the repository search', async () => {
    const mockResults: Result[] = [
      { id: '1', orderId: 'A1', value: 10, unit: 'kg', status: ResultStatus.FINAL, resultDate: new Date(), sourceSystem: 'SystemA', notes: null, created_at: new Date(), updated_at: new Date(), order: {} },
      { id: '2', orderId: 'A2', value: 20, unit: 'g', status: ResultStatus.PRELIMINARY, resultDate: new Date(), sourceSystem: 'SystemB', notes: 'Note', created_at: new Date(), updated_at: new Date(), order: {} },
    ];

    resultRepositoryMock.search.mockResolvedValue(mockResults);

    const dto = { orderId: 'A1', status: ResultStatus.FINAL };

    const result = await service.searchResults(dto);

    expect(result).toEqual(mockResults);
    expect(result).toHaveLength(2);
    expect(result[0].orderId).toBe('A1');
  });
});
});

  describe('FN_getResultById_END', () => {
describe('getResultById', () => {
  it('should throw NotFoundException when the result is not found', async () => {
    resultRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      service.getResultById('123')
    ).rejects.toThrow(NotFoundException);
    await expect(
      service.getResultById('123')
    ).rejects.toThrow('Result with id 123 not found');
  });

  it('should return the result when found', async () => {
    const mockResult = { id: '1', orderId: 'abc', value: 100 };
    resultRepositoryMock.findById.mockResolvedValue(mockResult);

    const result = await service.getResultById('1');

    expect(result).toEqual(mockResult);
    expect(result).toBe(mockResult);
  });
});
});

  describe('FN_updateResult_END', () => {
describe('updateResult', () => {
  it('should throw BadRequestException when trying to change status of a CORRECTED result', async () => {
    const result = {
      status: ResultStatus.CORRECTED,
      referenceMin: 10,
      referenceMax: 20,
    };
    resultRepositoryMock.findById.mockResolvedValue(result);

    await expect(
      service.updateResult('1', { status: ResultStatus.FINAL })
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException for invalid status transitions', async () => {
        const result = {
          status: ResultStatus.FINAL,
          referenceMin: 0,
          referenceMax: 100,
        };
        resultRepositoryMock.findById.mockResolvedValue(result);

        await expect(
          service.updateResult('1', { status: ResultStatus.PRELIMINARY })
        ).rejects.toThrow(BadRequestException);
    });


  it('should throw BadRequestException when updating value on a non-preliminary result', async () => {
    const result = {
      status: ResultStatus.FINAL,
      value: 50,
      referenceMin: 0,
      referenceMax: 100,
    };
    resultRepositoryMock.findById.mockResolvedValue(result);

    await expect(
      service.updateResult('1', { value: 60 })
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when updating unit on a non-preliminary result', async () => {
    const result = {
      status: ResultStatus.FINAL,
      unit: 'USD',
      referenceMin: 0,
      referenceMax: 100,
    };
    resultRepositoryMock.findById.mockResolvedValue(result);

    await expect(
      service.updateResult('1', { unit: 'EUR' })
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when updating referenceMin on a final result', async () => {
    const result = {
      status: ResultStatus.FINAL,
      referenceMin: 10,
      referenceMax: 20,
    };
    resultRepositoryMock.findById.mockResolvedValue(result);

    await expect(
      service.updateResult('1', { referenceMin: 5 })
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when updating referenceMax on a final result', async () => {
    const result = {
      status: ResultStatus.FINAL,
      referenceMin: 10,
      referenceMax: 20,
    };
    resultRepositoryMock.findById.mockResolvedValue(result);

    await expect(
      service.updateResult('1', { referenceMax: 25 })
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when referenceMin is not less than referenceMax', async () => {
    const result = {
      status: ResultStatus.PRELIMINARY,
      referenceMin: 20,
      referenceMax: 10,
    };
    resultRepositoryMock.findById.mockResolvedValue(result);

    await expect(
      service.updateResult('1', { referenceMin: 20, referenceMax: 10 })
    ).rejects.toThrow(BadRequestException);
  });

  it('should successfully update status, value, unit, and notes for a preliminary result', async () => {
    const initialResult = {
      id: '1',
      status: ResultStatus.PRELIMINARY,
      value: 100,
      unit: 'USD',
      referenceMin: 0,
      referenceMax: 100,
    };
    resultRepositoryMock.findById.mockResolvedValue(initialResult);
    resultRepositoryMock.save.mockResolvedValue(initialResult);

    const dto = {
      status: ResultStatus.CORRECTED,
      value: 105,
      unit: 'EUR',
      notes: 'Updated status and details',
    };

    const updatedResult = await service.updateResult('1', dto);

    expect(resultRepositoryMock.save).toHaveBeenCalledWith({
      ...initialResult,
      status: ResultStatus.CORRECTED,
      value: 105,
      unit: 'EUR',
      notes: 'Updated status and details',
    });
    expect(updatedResult).toEqual({
      ...initialResult,
      status: ResultStatus.CORRECTED,
      value: 105,
      unit: 'EUR',
      notes: 'Updated status and details',
    });
  });
});
});

  // TESTS_APPEND_HERE
});
