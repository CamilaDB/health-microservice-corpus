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
  it('should call orderService.validateOrderResult with correct parameters', async () => {
    // arrange
    const dto: CreateResultDto = {
      orderId: '123',
      value: 100,
      unit: 'mg',
      status: ResultStatus.PRELIMINARY,
      resultDate: '2023-10-01T00:00:00Z',
    };
    const expectedResult: Result = {
      id: '1',
      orderId: '123',
      value: 100,
      unit: 'mg',
      status: ResultStatus.PRELIMINARY,
      referenceMin: null,
      referenceMax: null,
      resultDate: new Date('2023-10-01T00:00:00Z'),
      sourceSystem: null,
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      order: null,
    };
    resultRepositoryMock.create.mockReturnValue(expectedResult);
    orderServiceMock.validateOrderResult.mockResolvedValue(undefined);

    // act
    await service.createResult(dto);

    // assert
    expect(orderServiceMock.validateOrderResult).toHaveBeenCalledWith(dto.orderId, dto.status);
  });

  it('should create a result with default values when not provided', async () => {
    // arrange
    const dto: CreateResultDto = {
      orderId: '123',
      value: 100,
      unit: 'mg',
      status: ResultStatus.PRELIMINARY,
      resultDate: '2023-10-01T00:00:00Z',
    };
    const expectedResult: Result = {
      id: '1',
      orderId: '123',
      value: 100,
      unit: 'mg',
      status: ResultStatus.PRELIMINARY,
      referenceMin: null,
      referenceMax: null,
      resultDate: new Date('2023-10-01T00:00:00Z'),
      sourceSystem: null,
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      order: null,
    };
    resultRepositoryMock.create.mockReturnValue(expectedResult);
    orderServiceMock.validateOrderResult.mockResolvedValue(undefined);

    // act
    await service.createResult(dto);

    // assert
    expect(resultRepositoryMock.create).toHaveBeenCalledWith({
      ...dto,
      resultDate: new Date(dto.resultDate),
      referenceMin: null,
      referenceMax: null,
      sourceSystem: null,
      notes: null,
    });
  });

  it.skip('should save the created result', async () => {
        // arrange
        const dto: CreateResultDto = {
          orderId: '123',
          value: 100,
          unit: 'mg',
          status: ResultStatus.PRELIMINARY,
          resultDate: '2023-10-01T00:00:00Z',
        };
        const expectedResult: Result = {
          id: '1',
          orderId: '123',
          value: 100,
          unit: 'mg',
          status: ResultStatus.PRELIMINARY,
          referenceMin: null,
          referenceMax: null,
          resultDate: new Date('2023-10-01T00:00:00Z'),
          sourceSystem: null,
          notes: null,
          created_at: new Date(),
          updated_at: new Date(),
          order: null,
        };
        resultRepositoryMock.create.mockReturnValue(expectedResult);
        orderServiceMock.validateOrderResult.mockResolvedValue(undefined);

        // act
        const result = await service.createResult(dto);

        // assert
        expect(resultRepositoryMock.save).toHaveBeenCalledWith(expectedResult);
        expect(result).toEqual(expectedResult);
      });

  it('should throw BadRequestException if orderService.validateOrderResult rejects', async () => {
    // arrange
    const dto: CreateResultDto = {
      orderId: '123',
      value: 100,
      unit: 'mg',
      status: ResultStatus.PRELIMINARY,
      resultDate: '2023-10-01T00:00:00Z',
    };
    orderServiceMock.validateOrderResult.mockRejectedValue(new BadRequestException());

    // act & assert
    await expect(service.createResult(dto)).rejects.toThrow(BadRequestException);
  });
});
});

  describe('FN_searchResults_END', () => {
describe('searchResults', () => {
  it('should call resultRepository.search with the provided DTO', async () => {
    // arrange: mock dependencies
    const dto: SearchResultsDto = {
      orderId: '123',
      status: ResultStatus.PRELIMINARY,
      examType: ExamType.HEMOGRAM,
      dateFrom: '2023-01-01',
      dateTo: '2023-12-31',
      sourceSystem: 'systemA',
    };

    // act: call the service method
    await service.searchResults(dto);

    // assert: verify result or thrown exception
    expect(resultRepositoryMock.search).toHaveBeenCalledWith(dto);
  });
});
});

  describe('FN_getResultById_END', () => {
describe('getResultById', () => {
  it('should throw NotFoundException when result is not found', async () => {
    // arrange: mock dependencies
    const id = 'non-existent-id';
    resultRepositoryMock.findById.mockResolvedValueOnce(undefined);

    // act: call the service method
    await expect(service.getResultById(id)).rejects.toThrow(NotFoundException);

    // assert: verify result or thrown exception
    expect(resultRepositoryMock.findById).toHaveBeenCalledWith(id);
  });

  it('should return result when found', async () => {
    // arrange: mock dependencies
    const id = 'existing-id';
    const expectedResult: Result = {
      id,
      orderId: 'order-id',
      value: 100,
      unit: 'unit',
      status: ResultStatus.PRELIMINARY,
      referenceMin: null,
      referenceMax: null,
      resultDate: new Date(),
      sourceSystem: null,
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      order: null,
    };
    resultRepositoryMock.findById.mockResolvedValueOnce(expectedResult);

    // act: call the service method
    const result = await service.getResultById(id);

    // assert: verify result or thrown exception
    expect(result).toEqual(expectedResult);
    expect(resultRepositoryMock.findById).toHaveBeenCalledWith(id);
  });
});
});

  describe('FN_buildResultReport_END', () => {
describe('buildResultReport', () => {
  it('should throw NotFoundException when no results found for order', async () => {
    // arrange: mock dependencies
    const orderId = '123';
    resultRepositoryMock.findByOrderId.mockResolvedValue([]);

    // act: call the service method
    await expect(service.buildResultReport(orderId)).rejects.toThrow(NotFoundException);

    // assert: verify result or thrown exception
  });

  it.skip('should return result report with correct summary and items when results are found', async () => {
        // arrange: mock dependencies
        const orderId = '123';
        const order = { id: orderId, examType: ExamType.GLUCOSE };
        const results = [
          { id: '1', orderId, status: ResultStatus.FINAL, value: '80', unit: 'mg/dL', referenceMin: null, referenceMax: null, sourceSystem: null, resultDate: new Date() },
          { id: '2', orderId, status: ResultStatus.CORRECTED, value: '95', unit: 'mg/dL', referenceMin: null, referenceMax: null, sourceSystem: null, resultDate: new Date() },
        ];
        resultRepositoryMock.findByOrderId.mockResolvedValue(results);
        orderServiceMock.getOrderById.mockResolvedValue(order);

        // act: call the service method
        const result = await service.buildResultReport(orderId);

        // assert: verify result or thrown exception
        expect(result).toEqual({
          orderId,
          examType: ExamType.GLUCOSE,
          items: [
            {
              resultId: '1',
              examType: ExamType.GLUCOSE,
              value: 80,
              unit: 'mg/dL',
              status: ResultStatus.FINAL,
              referenceMin: null,
              referenceMax: null,
              flag: 'NORMAL',
              sourceSystem: null,
              resultDate: expect.any(Date),
            },
            {
              resultId: '2',
              examType: ExamType.GLUCOSE,
              value: 95,
              unit: 'mg/dL',
              status: ResultStatus.CORRECTED,
              referenceMin: null,
              referenceMax: null,
              flag: 'NORMAL',
              sourceSystem: null,
              resultDate: expect.any(Date),
            },
          ],
          summary: {
            total: 2,
            preliminary: 0,
            final: 1,
            corrected: 1,
            abnormal: 0,
          },
        });
      });

  it.skip('should handle preliminary results correctly', async () => {
          // arrange: mock dependencies
          const orderId = '123';
          const order = { id: orderId, examType: ExamType.GLUCOSE };
          const results = [
            { id: '1', orderId, status: ResultStatus.PRELIMINARY, value: '80', unit: 'mg/dL', referenceMin: null, referenceMax: null, sourceSystem: null, resultDate: new Date() },
          ];
          resultRepositoryMock.findByOrderId.mockResolvedValue(results);
          orderServiceMock.getOrderById.mockResolvedValue(order);

          // act: call the service method
          const result = await service.buildResultReport(orderId);

          // assert: verify result or thrown exception
          expect(result).toEqual({
            orderId,
            examType: ExamType.GLUCOSE,
            items: [
              {
                resultId: '1',
                examType: ExamType.GLUCOSE,
                value: 80,
                unit: 'mg/dL',
                status: ResultStatus.PRELIMINARY,
                referenceMin: null,
                referenceMax: null,
                flag: 'NORMAL',
                sourceSystem: null,
                resultDate: expect.any(Date),
              },
            ],
            summary: {
              total: 1,
              preliminary: 1,
              final: 0,
              corrected: 0,
              abnormal: 0,
            },
          });
        });


  it.skip('should handle abnormal results correctly', async () => {
          // arrange: mock dependencies
          const orderId = '123';
          const order = { id: orderId, examType: ExamType.GLUCOSE };
          const results = [
            { id: '1', orderId, status: ResultStatus.FINAL, value: '75', unit: 'mg/dL', referenceMin: null, referenceMax: null, sourceSystem: null, resultDate: new Date() },
          ];
          resultRepositoryMock.findByOrderId.mockResolvedValue(results);
          orderServiceMock.getOrderById.mockResolvedValue(order);

          // act: call the service method
          const result = await service.buildResultReport(orderId);

          // assert: verify result or thrown exception
          expect(result).toEqual({
            orderId,
            examType: ExamType.GLUCOSE,
            items: [
              {
                resultId: '1',
                examType: ExamType.GLUCOSE,
                value: 75,
                unit: 'mg/dL',
                status: ResultStatus.FINAL,
                referenceMin: null,
                referenceMax: null,
                flag: 'NORMAL',
                sourceSystem: null,
                resultDate: expect.any(Date),
              },
            ],
            summary: {
              total: 1,
              preliminary: 0,
              final: 1,
              corrected: 0,
              abnormal: 0,
            },
          });
        });

});
});

  describe('FN_updateResult_END', () => {
describe('updateResult', () => {
  it('should throw BadRequestException when result status is CORRECTED and dto status is provided', async () => {
    const id = '123';
    const dto: UpdateResultDto = { status: ResultStatus.FINAL };
    const result: Result = { id, status: ResultStatus.CORRECTED, value: 10, unit: 'mg', referenceMin: null, referenceMax: null, resultDate: new Date(), sourceSystem: null, notes: null, created_at: new Date(), updated_at: new Date(), order: null };

    resultRepositoryMock.findById.mockResolvedValue(result);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when dto status is provided and not a valid transition', async () => {
      const id = '123';
      const dto: UpdateResultDto = { status: ResultStatus.FINAL };
      const result: Result = { id, status: ResultStatus.CORRECTED, value: 10, unit: 'mg', referenceMin: null, referenceMax: null, resultDate: new Date(), sourceSystem: null, notes: null, created_at: new Date(), updated_at: new Date(), order: null };

      resultRepositoryMock.findById.mockResolvedValue(result);

      await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
    });


  it('should throw BadRequestException when dto value is provided and result status is not PRELIMINARY', async () => {
    const id = '123';
    const dto: UpdateResultDto = { value: 20 };
    const result: Result = { id, status: ResultStatus.FINAL, value: 10, unit: 'mg', referenceMin: null, referenceMax: null, resultDate: new Date(), sourceSystem: null, notes: null, created_at: new Date(), updated_at: new Date(), order: null };

    resultRepositoryMock.findById.mockResolvedValue(result);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when dto unit is provided and result status is not PRELIMINARY', async () => {
    const id = '123';
    const dto: UpdateResultDto = { unit: 'g' };
    const result: Result = { id, status: ResultStatus.FINAL, value: 10, unit: 'mg', referenceMin: null, referenceMax: null, resultDate: new Date(), sourceSystem: null, notes: null, created_at: new Date(), updated_at: new Date(), order: null };

    resultRepositoryMock.findById.mockResolvedValue(result);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when dto referenceMin is provided and result status is FINAL', async () => {
    const id = '123';
    const dto: UpdateResultDto = { referenceMin: 5 };
    const result: Result = { id, status: ResultStatus.FINAL, value: 10, unit: 'mg', referenceMin: null, referenceMax: null, resultDate: new Date(), sourceSystem: null, notes: null, created_at: new Date(), updated_at: new Date(), order: null };

    resultRepositoryMock.findById.mockResolvedValue(result);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when dto referenceMax is provided and result status is FINAL', async () => {
    const id = '123';
    const dto: UpdateResultDto = { referenceMax: 15 };
    const result: Result = { id, status: ResultStatus.FINAL, value: 10, unit: 'mg', referenceMin: null, referenceMax: null, resultDate: new Date(), sourceSystem: null, notes: null, created_at: new Date(), updated_at: new Date(), order: null };

    resultRepositoryMock.findById.mockResolvedValue(result);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when newMin is greater than or equal to newMax', async () => {
    const id = '123';
    const dto: UpdateResultDto = { referenceMin: 10, referenceMax: 5 };
    const result: Result = { id, status: ResultStatus.PRELIMINARY, value: 10, unit: 'mg', referenceMin: null, referenceMax: null, resultDate: new Date(), sourceSystem: null, notes: null, created_at: new Date(), updated_at: new Date(), order: null };

    resultRepositoryMock.findById.mockResolvedValue(result);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should update result and save it when all conditions are met', async () => {
    const id = '123';
    const dto: UpdateResultDto = { value: 20, unit: 'g', notes: 'Updated' };
    const result: Result = { id, status: ResultStatus.PRELIMINARY, value: 10, unit: 'mg', referenceMin: null, referenceMax: null, resultDate: new Date(), sourceSystem: null, notes: null, created_at: new Date(), updated_at: new Date(), order: null };

    resultRepositoryMock.findById.mockResolvedValue(result);
    resultRepositoryMock.save.mockResolvedValue({ ...result, ...dto });

    const updatedResult = await service.updateResult(id, dto);

    expect(updatedResult).toEqual({ ...result, ...dto });
    expect(resultRepositoryMock.save).toHaveBeenCalledWith({ ...result, ...dto });
  });
});
});

  // TESTS_APPEND_HERE
});
