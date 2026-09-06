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
  it('should create a result and save it to the repository', async () => {
    const dto: CreateResultDto = {
      orderId: '123',
      value: 100,
      unit: 'mm',
      status: ResultStatus.PRELIMINARY,
      resultDate: '2023-10-01',
    };

    const result: Result = {
      id: '456',
      orderId: '123',
      value: 100,
      unit: 'mm',
      status: ResultStatus.PRELIMINARY,
      referenceMin: null,
      referenceMax: null,
      resultDate: new Date('2023-10-01'),
      sourceSystem: null,
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      order: null,
    };

    resultRepositoryMock.create.mockReturnValue(result);
    resultRepositoryMock.save.mockResolvedValue(result);

    const resultEntity = await service.createResult(dto);

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

  it.skip('should throw a BadRequestException if the order ID is invalid', async () => {
        const dto: CreateResultDto = {
          orderId: 'invalid',
          value: 100,
          unit: 'mm',
          status: ResultStatus.PRELIMINARY,
          resultDate: '2023-10-01',
        };

        await expect(service.createResult(dto)).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw a NotFoundException if the order is not found', async () => {
          const dto: CreateResultDto = {
            orderId: '123',
            value: 100,
            unit: 'mm',
            status: ResultStatus.PRELIMINARY,
            resultDate: '2023-10-01',
          };

          orderServiceMock.validateOrderResult.mockResolvedValueOnce(null);

          await expect(service.createResult(dto)).rejects.toThrow(NotFoundException);
        });


});
});

  describe('FN_searchResults_END', () => {
describe('ResultService', () => {
  let service: ResultService;
  let resultRepositoryMock: jest.Mocked<ResultRepository>;

  beforeEach(async () => {
    resultRepositoryMock = {
      search: jest.fn().mockResolvedValue([]),
    } as unknown as jest.Mocked<ResultRepository>;

    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          ResultService,
          { provide: ResultRepository, useValue: resultRepositoryMock },
        ],
      }).compile();

    service = module.get<ResultService>(ResultService);
  });

  it.skip('should return an empty array when no results are found', async () => {
        const dto: SearchResultsDto = {};
        const results = await service.searchResults(dto);
        expect(results).toEqual([]);
      });

  it.skip('should call the resultRepository.search method with the correct dto', async () => {
        const dto: SearchResultsDto = { orderId: '123' };
        await service.searchResults(dto);
        expect(resultRepositoryMock.search).toHaveBeenCalledWith(dto);
      });
});
});

  describe('FN_updateResult_END', () => {
describe('ResultService', () => {
  let service: ResultService;
  let resultRepositoryMock: jest.Mocked<ResultRepository>;

  beforeEach(async () => {
    resultRepositoryMock = {
      findById: jest.fn().mockResolvedValue(undefined),
      findByOrderId: jest.fn().mockResolvedValue(undefined),
      search: jest.fn().mockResolvedValue(undefined),
      save: jest.fn().mockResolvedValue(undefined),
      create: jest.fn().mockReturnValue(undefined),
    } as unknown as jest.Mocked<ResultRepository>;

    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          ResultService,
          { provide: ResultRepository, useValue: resultRepositoryMock },
        ],
      }).compile();

    service = module.get<ResultService>(ResultService);
  });

  it.skip('should throw BadRequestException if status is CORRECTED and dto.status is provided', async () => {
        const result = { status: ResultStatus.CORRECTED } as Result;
        resultRepositoryMock.findById.mockResolvedValue(result);

        await expect(() => service.updateResult('1', { status: ResultStatus.FINAL })).rejects.toThrowError(
          new BadRequestException('Cannot change status of a CORRECTED result — it is terminal'),
        );
      });

  it.skip('should throw BadRequestException if dto.status is invalid for the current result status', async () => {
        const result = { status: ResultStatus.PRELIMINARY } as Result;
        resultRepositoryMock.findById.mockResolvedValue(result);

        await expect(() => service.updateResult('1', { status: ResultStatus.FINAL })).rejects.toThrowError(
          new BadRequestException('Invalid status transition from PRELIMINARY to FINAL'),
        );
      });

  it.skip('should throw BadRequestException if dto.value is provided for a non-preliminary result', async () => {
        const result = { status: ResultStatus.FINAL } as Result;
        resultRepositoryMock.findById.mockResolvedValue(result);

        await expect(() => service.updateResult('1', { value: 100 })).rejects.toThrowError(
          new BadRequestException('Cannot update value of a non-preliminary result'),
        );
      });

  it.skip('should throw BadRequestException if dto.unit is provided for a non-preliminary result', async () => {
        const result = { status: ResultStatus.FINAL } as Result;
        resultRepositoryMock.findById.mockResolvedValue(result);

        await expect(() => service.updateResult('1', { unit: 'cm' })).rejects.toThrowError(
          new BadRequestException('Cannot update unit of a non-preliminary result'),
        );
      });

  it.skip('should throw BadRequestException if dto.referenceMin is provided for a final result', async () => {
        const result = { status: ResultStatus.FINAL } as Result;
        resultRepositoryMock.findById.mockResolvedValue(result);

        await expect(() => service.updateResult('1', { referenceMin: 100 })).rejects.toThrowError(
          new BadRequestException('Cannot update referenceMin of a final result'),
        );
      });

  it.skip('should throw BadRequestException if dto.referenceMax is provided for a final result', async () => {
        const result = { status: ResultStatus.FINAL } as Result;
        resultRepositoryMock.findById.mockResolvedValue(result);

        await expect(() => service.updateResult('1', { referenceMax: 100 })).rejects.toThrowError(
          new BadRequestException('Cannot update referenceMax of a final result'),
        );
      });

  it.skip('should throw BadRequestException if newMin is greater than or equal to newMax', async () => {
        const result = { status: ResultStatus.PRELIMINARY } as Result;
        resultRepositoryMock.findById.mockResolvedValue(result);

        await expect(() => service.updateResult('1', { referenceMin: 100, referenceMax: 50 })).rejects.toThrowError(
          new BadRequestException('referenceMin must be less than referenceMax'),
        );
      });

  it.skip('should update the result with provided dto fields', async () => {
          const result = { status: ResultStatus.PRELIMINARY } as Result;
          resultRepositoryMock.findById.mockResolvedValue(result);
          orderServiceMock.findById.mockResolvedValue({ id: '1' });

          await service.updateResult('1', { status: ResultStatus.FINAL, value: 100, unit: 'cm' });

          expect(resultRepositoryMock.save).toHaveBeenCalledWith({
            id: '1',
            status: ResultStatus.FINAL,
            value: 100,
            unit: 'cm',
          });
        });

});
});

  // TESTS_APPEND_HERE
});
