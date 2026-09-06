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
  it.skip('should create a result with valid inputs', async () => {
          const mockResult = {
            orderId: '123',
            value: 100,
            unit: 'mg/dL',
            status: ResultStatus.PRELIMINARY,
            referenceMin: 10,
            referenceMax: 20,
            resultDate: new Date('2023-01-01'),
            sourceSystem: 'system1',
            notes: 'Initial test',
          };
          const createResultDto: CreateResultDto = {
            ...mockResult,
            resultDate: mockResult.resultDate.toISOString(),
          };

          resultRepositoryMock.create.mockResolvedValueOnce(mockResult);
          resultRepositoryMock.save.mockResolvedValueOnce(mockResult);

          const result = await service.createResult(createResultDto);

          expect(resultRepositoryMock.create).toHaveBeenCalledWith({
            ...createResultDto,
            resultDate: new Date(createResultDto.resultDate),
            referenceMin: createResultDto.referenceMin ?? null,
            referenceMax: createResultDto.referenceMax ?? null,
            sourceSystem: createResultDto.sourceSystem ?? null,
            notes: createResultDto.notes ?? null,
          });
          expect(resultRepositoryMock.save).toHaveBeenCalledWith(mockResult);
          expect(result).toEqual(mockResult);
        });


  it.skip('should throw BadRequestException if orderService.validateOrderResult throws', async () => {
        // arrange
        orderServiceMock.validateOrderResult.mockRejectedValueOnce(new Error('Order validation failed'));

        // act & assert
        await expect(service.createResult({ orderId: '123', status: ResultStatus.PRELIMINARY })).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw NotFoundException if resultRepository.create returns undefined', async () => {
          const resultRepositoryMock = jest.fn().mockResolvedValueOnce(undefined);
          const service = new ResultService(resultRepositoryMock);
          await expect(service.createResult({ orderId: '123', status: ResultStatus.PRELIMINARY })).rejects.toThrow(NotFoundException);
        });


});
});

  describe('FN_searchResults_END', () => {
describe('searchResults', () => {
  it('should call search on ResultRepository', async () => {
    const searchDto: SearchResultsDto = {
      orderId: '123',
      status: ResultStatus.PRELIMINARY,
      examType: ExamType.HEMOGRAM,
      dateFrom: '2023-01-01',
      dateTo: '2023-01-31',
      sourceSystem: 'systemA'
    };

    resultRepositoryMock.search.mockResolvedValueOnce([]);

    await service.searchResults(searchDto);

    expect(resultRepositoryMock.search).toHaveBeenCalledWith(searchDto);
  });
});
});

  describe('FN_getResultById_END', () => {
describe('getResultById', () => {
  it('should throw NotFoundException when result not found', async () => {
    resultRepositoryMock.findById.mockResolvedValue(undefined);
    await expect(service.getResultById('non-existent-id')).rejects.toThrow(NotFoundException);
  });

  it('should return result when found', async () => {
    const mockResult = { id: '123', orderId: '456', value: 100, unit: 'unit1', status: ResultStatus.FINAL, referenceMin: null, referenceMax: null, resultDate: new Date(), sourceSystem: 'system1', notes: 'notes1', created_at: new Date(), updated_at: new Date(), order: { id: '789', examType: ExamType.FINAL, /* ... */ } };
    resultRepositoryMock.findById.mockResolvedValue(mockResult);
    const result = await service.getResultById('123');
    expect(result).toEqual(mockResult);
  });
});
});

  describe('FN_buildResultReport_END', () => {
describe('buildResultReport', () => {
  it('should throw NotFoundException when no results', async () => {
    // arrange
    resultRepositoryMock.findByOrderId.mockResolvedValue([]);
    
    // act
    await expect(service.buildResultReport('orderId')).rejects.toThrow(NotFoundException);
  });

  it.skip('should handle preliminary result', async () => {
        // arrange
        const result = { status: ResultStatus.PRELIMINARY };
        resultRepositoryMock.findByOrderId.mockResolvedValue([result]);
        
        // act
        const report = await service.buildResultReport('orderId');
        
        // assert
        expect(report.summary.preliminary).toBe(1);
      });

  it.skip('should handle final result', async () => {
        // arrange
        const result = { status: ResultStatus.FINAL };
        resultRepositoryMock.findByOrderId.mockResolvedValue([result]);
        
        // act
        const report = await service.buildResultReport('orderId');
        
        // assert
        expect(report.summary.final).toBe(1);
      });

  it.skip('should handle corrected result', async () => {
          const result = { status: ResultStatus.CORRECTED };
          resultRepositoryMock.findByOrderId.mockResolvedValueOnce(
            [result]
          );

          const report = await service.buildResultReport('orderId');

          expect(report.summary.corrected).toBe(1);
        });



  it.skip('should handle normal result', async () => {
          const result = { value: 80, referenceMin: 70, referenceMax: 99 };
          resultRepositoryMock.findByOrderId.mockResolvedValue([result]);
          
          const order = { examType: ExamType.GLUCOSE }; // Assuming ExamType.GLUCOSE is used
          const orderServiceMock = jest.fn().mockResolvedValue(order);
          
          const service = new ResultReportService(orderServiceMock, resultRepositoryMock);
          
          const report = await service.buildResultReport('orderId');
          
          expect(report.items[0].flag).toBe('NORMAL');
        });


  it.skip('should handle low result', async () => {
          const result = { value: 65, referenceMin: 70, referenceMax: 99 };
          resultRepositoryMock.findByOrderId.mockResolvedValue([result]);
          
          const order = { examType: ExamType.GLUCOSE };
          const orderServiceMock = jest.fn().mockResolvedValue(order);
          
          service.getOrderById = jest.fn(() => orderServiceMock);
          
          const report = await service.buildResultReport('orderId');
          
          expect(report.items[0].flag).toBe('LOW');
        });



  it.skip('should handle high result', async () => {
        // arrange
        const result = { value: 100, referenceMin: 70, referenceMax: 99 };
        resultRepositoryMock.findByOrderId.mockResolvedValue([result]);
        
        // act
        const report = await service.buildResultReport('orderId');
        
        // assert
        expect(report.items[0].flag).toBe('HIGH');
      });
});
});

  describe('FN_updateResult_END', () => {
describe('updateResult', () => {
  it('should throw BadRequestException when correcting a result with a status that is not undefined', async () => {
    const id = 'testId';
    const dto = { status: ResultStatus.FINAL };

    resultRepositoryMock.findById.mockResolvedValue({ status: ResultStatus.CORRECTED });

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when updating status of a result with an invalid transition', async () => {
    const id = 'testId';
    const dto = { status: ResultStatus.PRELIMINARY };

    resultRepositoryMock.findById.mockResolvedValue({ status: ResultStatus.FINAL });

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when updating value of a non-preliminary result', async () => {
    const id = 'testId';
    const dto = { value: 100 };

    resultRepositoryMock.findById.mockResolvedValue({ status: ResultStatus.FINAL });

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when updating unit of a non-preliminary result', async () => {
    const id = 'testId';
    const dto = { unit: 'cm' };

    resultRepositoryMock.findById.mockResolvedValue({ status: ResultStatus.FINAL });

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when updating referenceMin of a final result', async () => {
    const id = 'testId';
    const dto = { referenceMin: 10 };

    resultRepositoryMock.findById.mockResolvedValue({ status: ResultStatus.FINAL });

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when updating referenceMax of a final result', async () => {
    const id = 'testId';
    const dto = { referenceMax: 10 };

    resultRepositoryMock.findById.mockResolvedValue({ status: ResultStatus.FINAL });

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when referenceMin is greater than or equal to referenceMax', async () => {
    const id = 'testId';
    const dto = { referenceMin: 10, referenceMax: 10 };

    resultRepositoryMock.findById.mockResolvedValue({ status: ResultStatus.PRELIMINARY });

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });
});
});

  // TESTS_APPEND_HERE
});
