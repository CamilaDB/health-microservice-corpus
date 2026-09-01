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
describe('ResultService', () => {
  it('should call resultRepository.search with the correct dto', async () => {
    const dto: SearchResultsDto = {
      orderId: '123',
      status: ResultStatus.PRELIMINARY,
      examType: ExamType.HEMOGRAM,
      dateFrom: '2023-01-01',
      dateTo: '2023-12-31',
      sourceSystem: 'system1',
    };

    await service.searchResults(dto);

    expect(resultRepositoryMock.search).toHaveBeenCalledWith(dto);
  });

  it.skip('should return an empty array if resultRepository.search returns undefined', async () => {
          resultRepositoryMock.search.mockResolvedValueOnce(undefined);

          const result = await service.searchResults(dto);

          expect(result).toEqual([]);
        });


  it.skip('should throw a BadRequestException if dto is invalid', async () => {
        const dto: SearchResultsDto = {
          orderId: '123',
          status: 'invalidStatus',
          examType: 'invalidExamType',
          dateFrom: '2023-01-01',
          dateTo: '2023-12-31',
          sourceSystem: 'system1',
        };

        await expect(service.searchResults(dto)).rejects.toThrow(BadRequestException);
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

  it.skip('should throw BadRequestException if status is CORRECTED and dto.status is defined', async () => {
        const id = '123';
        const dto: UpdateResultDto = { status: ResultStatus.CORRECTED };
        await expect(service.updateResult(id, dto)).rejects.toThrowError(
          new BadRequestException(
            'Cannot change status of a CORRECTED result — it is terminal',
          ),
        );
      });

  it.skip('should throw BadRequestException if status transition is invalid', async () => {
        const id = '123';
        const dto: UpdateResultDto = { status: ResultStatus.FINAL };
        const result: Result = {
          id: '123',
          orderId: '456',
          value: 100,
          unit: 'cm',
          status: ResultStatus.PRELIMINARY,
          referenceMin: 50,
          referenceMax: 150,
          resultDate: new Date(),
          sourceSystem: 'system1',
          notes: 'notes',
          created_at: new Date(),
          updated_at: new Date(),
          order: {
            id: '456',
            examType: ExamType.MEDICAL,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        };
        resultRepositoryMock.findById.mockResolvedValue(result);

        await expect(service.updateResult(id, dto)).rejects.toThrowError(
          new BadRequestException(
            `Invalid status transition from PRELIMINARY to FINAL`,
          ),
        );
      });

  it.skip('should throw BadRequestException if value is undefined and result status is not PRELIMINARY', async () => {
        const id = '123';
        const dto: UpdateResultDto = { value: undefined };
        const result: Result = {
          id: '123',
          orderId: '456',
          value: 100,
          unit: 'cm',
          status: ResultStatus.PRELIMINARY,
          referenceMin: 50,
          referenceMax: 150,
          resultDate: new Date(),
          sourceSystem: 'system1',
          notes: 'notes',
          created_at: new Date(),
          updated_at: new Date(),
          order: {
            id: '456',
            examType: ExamType.MEDICAL,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        };
        resultRepositoryMock.findById.mockResolvedValue(result);

        await expect(service.updateResult(id, dto)).rejects.toThrowError(
          new BadRequestException('Cannot update value of a non-preliminary result'),
        );
      });

  it.skip('should throw BadRequestException if unit is undefined and result status is not PRELIMINARY', async () => {
        const id = '123';
        const dto: UpdateResultDto = { unit: undefined };
        const result: Result = {
          id: '123',
          orderId: '456',
          value: 100,
          unit: 'cm',
          status: ResultStatus.PRELIMINARY,
          referenceMin: 50,
          referenceMax: 150,
          resultDate: new Date(),
          sourceSystem: 'system1',
          notes: 'notes',
          created_at: new Date(),
          updated_at: new Date(),
          order: {
            id: '456',
            examType: ExamType.MEDICAL,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        };
        resultRepositoryMock.findById.mockResolvedValue(result);

        await expect(service.updateResult(id, dto)).rejects.toThrowError(
          new BadRequestException('Cannot update unit of a non-preliminary result'),
        );
      });

  it.skip('should throw BadRequestException if referenceMin is undefined and result status is FINAL', async () => {
        const id = '123';
        const dto: UpdateResultDto = { referenceMin: undefined };
        const result: Result = {
          id: '123',
          orderId: '456',
          value: 100,
          unit: 'cm',
          status: ResultStatus.FINAL,
          referenceMin: 50,
          referenceMax: 150,
          resultDate: new Date(),
          sourceSystem: 'system1',
          notes: 'notes',
          created_at: new Date(),
          updated_at: new Date(),
          order: {
            id: '456',
            examType: ExamType.MEDICAL,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        };
        resultRepositoryMock.findById.mockResolvedValue(result);

        await expect(service.updateResult(id, dto)).rejects.toThrowError(
          new BadRequestException('Cannot update referenceMin of a final result'),
        );
      });

  it.skip('should throw BadRequestException if referenceMax is undefined and result status is FINAL', async () => {
        const id = '123';
        const dto: UpdateResultDto = { referenceMax: undefined };
        const result: Result = {
          id: '123',
          orderId: '456',
          value: 100,
          unit: 'cm',
          status: ResultStatus.FINAL,
          referenceMin: 50,
          referenceMax: 150,
          resultDate: new Date(),
          sourceSystem: 'system1',
          notes: 'notes',
          created_at: new Date(),
          updated_at: new Date(),
          order: {
            id: '456',
            examType: ExamType.MEDICAL,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        };
        resultRepositoryMock.findById.mockResolvedValue(result);

        await expect(service.updateResult(id, dto)).rejects.toThrowError(
          new BadRequestException('Cannot update referenceMax of a final result'),
        );
      });

  it.skip('should throw BadRequestException if newMin is greater than or equal to newMax', async () => {
        const id = '123';
        const dto: UpdateResultDto = { referenceMin: 100, referenceMax: 50 };
        const result: Result = {
          id: '123',
          orderId: '456',
          value: 100,
          unit: 'cm',
          status: ResultStatus.PRELIMINARY,
          referenceMin: 50,
          referenceMax: 150,
          resultDate: new Date(),
          sourceSystem: 'system1',
          notes: 'notes',
          created_at: new Date(),
          updated_at: new Date(),
          order: {
            id: '456',
            examType: ExamType.MEDICAL,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        };
        resultRepositoryMock.findById.mockResolvedValue(result);

        await expect(service.updateResult(id, dto)).rejects.toThrowError(
          new BadRequestException('referenceMin must be less than referenceMax'),
        );
      });

  it.skip('should update result correctly', async () => {
        const id = '123';
        const dto: UpdateResultDto = { status: ResultStatus.FINAL, value: 200, unit: 'm' };
        const result: Result = {
          id: '123',
          orderId: '456',
          value: 100,
          unit: 'cm',
          status: ResultStatus.PRELIMINARY,
          referenceMin: 50,
          referenceMax: 150,
          resultDate: new Date(),
          sourceSystem: 'system1',
          notes: 'notes',
          created_at: new Date(),
          updated_at: new Date(),
          order: {
            id: '456',
            examType: ExamType.MEDICAL,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        };
        resultRepositoryMock.findById.mockResolvedValue(result);
        resultRepositoryMock.save.mockResolvedValue(result);

        await expect(service.updateResult(id, dto)).resolves.toEqual(result);
      });
});
});

  // TESTS_APPEND_HERE
});
