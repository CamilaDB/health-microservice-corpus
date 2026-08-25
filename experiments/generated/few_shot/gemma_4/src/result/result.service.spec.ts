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
  it('should successfully create and save a result', async () => {
        const createResultDto = {
          orderId: 'order-123',
          value: 100,
          unit: 'USD',
          status: ResultStatus.FINAL,
          resultDate: '2023-01-01',
          sourceSystem: 'SystemA',
        };
        const createdEntity = { id: 'res-456', ...createResultDto };

        resultRepositoryMock.create.mockReturnValue(createdEntity);
        resultRepositoryMock.save.mockResolvedValue(createdEntity);

        await service.createResult(createResultDto);

        expect(resultRepositoryMock.create).toHaveBeenCalledWith(expect.objectContaining({
          orderId: 'order-123',
          value: 100,
          unit: 'USD',
          status: ResultStatus.FINAL,
          resultDate: expect.any(Date),
          sourceSystem: 'SystemA',
          referenceMin: null,
          referenceMax: null,
          notes: null,
        }));
        expect(resultRepositoryMock.save).toHaveBeenCalledWith(createdEntity);
      });


  it('should throw an error if order validation fails', async () => {
    const createResultDto = {
      orderId: 'invalid-order',
      value: 10,
      unit: 'EUR',
      status: ResultStatus.PRELIMINARY,
      resultDate: '2023-01-01',
    };

    orderServiceMock.validateOrderResult.mockRejectedValue(new BadRequestException('Order validation failed'));

    await expect(service.createResult(createResultDto)).rejects.toThrow(BadRequestException);
    expect(resultRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('should throw an error if saving the result fails', async () => {
    const createResultDto = {
      orderId: 'order-123',
      value: 100,
      unit: 'USD',
      status: ResultStatus.FINAL,
      resultDate: '2023-01-01',
    };

    resultRepositoryMock.create.mockReturnValue({ id: 'new-id' });
    resultRepositoryMock.save.mockRejectedValue(new Error('Database save error'));

    await expect(service.createResult(createResultDto)).rejects.toThrow(Error('Database save error'));
  });
});
});

  describe('FN_searchResults_END', () => {
describe('searchResults', () => {
  it('should return results when a search is successful', async () => {
    const mockSearchResults = [
      { id: '1', status: ResultStatus.FINAL },
      { id: '2', status: ResultStatus.CORRECTED },
    ];
    resultRepositoryMock.search.mockResolvedValue(mockSearchResults);

    const dto = { orderId: 'ORD123' };
    const result = await service.searchResults(dto);

    expect(result).toEqual(mockSearchResults);
    expect(resultRepositoryMock.search).toHaveBeenCalledWith(dto);
  });

  it('should throw an error if the search operation fails', async () => {
    const error = new Error('Search failed');
    resultRepositoryMock.search.mockRejectedValue(error);

    const dto = { orderId: 'ORD123' };

    await expect(service.searchResults(dto)).rejects.toThrow(Error);
  });
});
});

  describe('FN_getResultById_END', () => {
describe('getResultById', () => {
  it('should return the result when found', async () => {
    const mockResult = { id: '1', value: 10, status: ResultStatus.FINAL };
    resultRepositoryMock.findById.mockResolvedValue(mockResult);

    const result = await service.getResultById('1');

    expect(result).toEqual(mockResult);
    expect(resultRepositoryMock.findById).toHaveBeenCalledWith('1');
  });

  it('should throw NotFoundException when the result is not found', async () => {
    resultRepositoryMock.findById.mockResolvedValue(null);

    await expect(service.getResultById('999')).rejects.toThrow(NotFoundException);
    expect(resultRepositoryMock.findById).toHaveBeenCalledWith('999');
  });
});
});

  describe('FN_updateResult_END', () => {
describe('updateResult', () => {
  it('should throw NotFoundException when the result to update does not exist', async () => {
    resultRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      service.updateResult('nonExistentId', { status: 'FINAL' } as UpdateResultDto),
    ).rejects.toThrow(NotFoundException);
  });

  it('should successfully update the result and save it', async () => {
    const existingResult = {
      id: '123',
      status: ResultStatus.PRELIMINARY,
      value: 100,
    };
    resultRepositoryMock.findById.mockResolvedValue(existingResult);
    resultRepositoryMock.save.mockResolvedValue(existingResult);

    const updateDto = {
      status: ResultStatus.FINAL,
      value: 150,
    };

    await service.updateResult('123', updateDto);

    expect(resultRepositoryMock.findById).toHaveBeenCalledWith('123');
    expect(resultRepositoryMock.save).toHaveBeenCalledWith(existingResult);
  });
});
});

  // TESTS_APPEND_HERE
});
