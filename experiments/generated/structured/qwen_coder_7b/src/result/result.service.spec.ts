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
  it('should throw BadRequestException if order validation fails', async () => {
    // arrange: mock dependencies
    const dto: CreateResultDto = {
      orderId: '123',
      value: 100,
      unit: 'mg',
      status: ResultStatus.PRELIMINARY,
      resultDate: '2023-10-01T12:00:00Z',
    };
    orderServiceMock.validateOrderResult.mockRejectedValueOnce(new BadRequestException());

    // act: call the service method
    await expect(service.createResult(dto)).rejects.toThrow(BadRequestException);

    // assert: verify orderService.validateOrderResult was called with the correct arguments
    expect(orderServiceMock.validateOrderResult).toHaveBeenCalledWith(dto.orderId, dto.status);
  });

  it('should create and save a result if order validation succeeds', async () => {
    // arrange: mock dependencies
    const dto: CreateResultDto = {
      orderId: '123',
      value: 100,
      unit: 'mg',
      status: ResultStatus.PRELIMINARY,
      resultDate: '2023-10-01T12:00:00Z',
    };
    const result: Result = {
      id: '456',
      orderId: dto.orderId,
      value: dto.value,
      unit: dto.unit,
      status: dto.status,
      resultDate: new Date(dto.resultDate),
      referenceMin: null,
      referenceMax: null,
      sourceSystem: null,
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      order: null,
    };
    orderServiceMock.validateOrderResult.mockResolvedValueOnce();
    resultRepositoryMock.create.mockReturnValueOnce(result);
    resultRepositoryMock.save.mockResolvedValueOnce(result);

    // act: call the service method
    const actualResult = await service.createResult(dto);

    // assert: verify result was created and saved
    expect(resultRepositoryMock.create).toHaveBeenCalledWith({
      ...dto,
      resultDate: new Date(dto.resultDate),
      referenceMin: null,
      referenceMax: null,
      sourceSystem: null,
      notes: null,
    });
    expect(resultRepositoryMock.save).toHaveBeenCalledWith(result);
    expect(actualResult).toEqual(result);
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
      sourceSystem: 'system1',
    };
    resultRepositoryMock.search.mockResolvedValue([]);

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
    const id = 'nonexistent-id';
    resultRepositoryMock.findById.mockResolvedValue(undefined);

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
      order: undefined,
    };
    resultRepositoryMock.findById.mockResolvedValue(expectedResult);

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
  it.skip('should throw NotFoundException when no results found for order', async () => {
        // arrange: mock dependencies
        const orderId = '123';
        resultRepositoryMock.findByOrderId.mockResolvedValue([]);

        // act: call the service method
        await expect(service.buildResultReport(orderId)).rejects.toThrow(NotFoundException);

        // assert: verify no further calls
        expect(resultRepositoryMock.findByOrderId).toHaveBeenCalledWith(orderId);
        expect(orderServiceMock.getOrderById).not.toHaveBeenCalled();
      });

  it.skip('should build result report with preliminary status', async () => {
          // arrange: mock dependencies
          const orderId = '123';
          const order = { id: orderId, examType: ExamType.GLUCOSE };
          const result = { id: '456', status: ResultStatus.PRELIMINARY, value: 80, unit: 'mg/dL', referenceMin: null, referenceMax: null, sourceSystem: null, resultDate: new Date() };
          resultRepositoryMock.findByOrderId.mockResolvedValue([result]);
          orderServiceMock.getOrderById.mockResolvedValue(order);

          // act: call the service method
          const resultReport = await service.buildResultReport(orderId);

          // assert: verify result
          expect(resultReport).toEqual({
            orderId,
            examType: ExamType.GLUCOSE,
            items: [
              {
                resultId: '456',
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


  it.skip('should build result report with final status', async () => {
          // arrange: mock dependencies
          const orderId = '123';
          const order = { id: orderId, examType: ExamType.GLUCOSE };
          const result = { id: '456', status: ResultStatus.FINAL, value: 80, unit: 'mg/dL', referenceMin: null, referenceMax: null, sourceSystem: null, resultDate: new Date() };
          resultRepositoryMock.findByOrderId.mockResolvedValue([result]);
          orderServiceMock.getOrderById.mockResolvedValue(order);

          // act: call the service method
          const resultReport = await service.buildResultReport(orderId);

          // assert: verify result
          expect(resultReport).toEqual({
            orderId,
            examType: ExamType.GLUCOSE,
            items: [
              {
                resultId: '456',
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


  it.skip('should build result report with corrected status', async () => {
          // arrange: mock dependencies
          const orderId = '123';
          const order = { id: orderId, examType: ExamType.GLUCOSE };
          const result = { id: '456', status: ResultStatus.CORRECTED, value: 80, unit: 'mg/dL', referenceMin: null, referenceMax: null, sourceSystem: null, resultDate: new Date() };
          resultRepositoryMock.findByOrderId.mockResolvedValue([result]);
          orderServiceMock.getOrderById.mockResolvedValue(order);

          // act: call the service method
          const resultReport = await service.buildResultReport(orderId);

          // assert: verify result
          expect(resultReport).toEqual({
            orderId,
            examType: ExamType.GLUCOSE,
            items: [
              {
                resultId: '456',
                examType: ExamType.GLUCOSE,
                value: 80,
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
              total: 1,
              preliminary: 0,
              final: 0,
              corrected: 1,
              abnormal: 0,
            },
          });
        });


  it('should build result report with low flag', async () => {
    // arrange: mock dependencies
    const orderId = '123';
    const order = { id: orderId, examType: ExamType.GLUCOSE };
    const result = { id: '456', status: ResultStatus.FINAL, value: 60, unit: 'mg/dL', referenceMin: 70, referenceMax: 99, sourceSystem: null, resultDate: new Date() };
    resultRepositoryMock.findByOrderId.mockResolvedValue([result]);
    orderServiceMock.getOrderById.mockResolvedValue(order);

    // act: call the service method
    const resultReport = await service.buildResultReport(orderId);

    // assert: verify result
    expect(resultReport).toEqual({
      orderId,
      examType: ExamType.GLUCOSE,
      items: [
        {
          resultId: '456',
          examType: ExamType.GLUCOSE,
          value: 60,
          unit: 'mg/dL',
          status: ResultStatus.FINAL,
          referenceMin: 70,
          referenceMax: 99,
          flag: 'LOW',
          sourceSystem: null,
          resultDate: expect.any(Date),
        },
      ],
      summary: {
        total: 1,
        preliminary: 0,
        final: 1,
        corrected: 0,
        abnormal: 1,
      },
    });
  });

  it('should build result report with high flag', async () => {
    // arrange: mock dependencies
    const orderId = '123';
    const order = { id: orderId, examType: ExamType.GLUCOSE };
    const result = { id: '456', status: ResultStatus.FINAL, value: 110, unit: 'mg/dL', referenceMin: 70, referenceMax: 99, sourceSystem: null, resultDate: new Date() };
    resultRepositoryMock.findByOrderId.mockResolvedValue([result]);
    orderServiceMock.getOrderById.mockResolvedValue(order);

    // act: call the service method
    const resultReport = await service.buildResultReport(orderId);

    // assert: verify result
    expect(resultReport).toEqual({
      orderId,
      examType: ExamType.GLUCOSE,
      items: [
        {
          resultId: '456',
          examType: ExamType.GLUCOSE,
          value: 110,
          unit: 'mg/dL',
          status: ResultStatus.FINAL,
          referenceMin: 70,
          referenceMax: 99,
          flag: 'HIGH',
          sourceSystem: null,
          resultDate: expect.any(Date),
        },
      ],
      summary: {
        total: 1,
        preliminary: 0,
        final: 1,
        corrected: 0,
        abnormal: 1,
      },
    });
  });

  it('should build result report with normal flag', async () => {
    // arrange: mock dependencies
    const orderId = '123';
    const order = { id: orderId, examType: ExamType.GLUCOSE };
    const result = { id: '456', status: ResultStatus.FINAL, value: 80, unit: 'mg/dL', referenceMin: 70, referenceMax: 99, sourceSystem: null, resultDate: new Date() };
    resultRepositoryMock.findByOrderId.mockResolvedValue([result]);
    orderServiceMock.getOrderById.mockResolvedValue(order);

    // act: call the service method
    const resultReport = await service.buildResultReport(orderId);

    // assert: verify result
    expect(resultReport).toEqual({
      orderId,
      examType: ExamType.GLUCOSE,
      items: [
        {
          resultId: '456',
          examType: ExamType.GLUCOSE,
          value: 80,
          unit: 'mg/dL',
          status: ResultStatus.FINAL,
          referenceMin: 70,
          referenceMax: 99,
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
  it('should throw BadRequestException if result status is CORRECTED and dto status is provided', async () => {
    const id = '123';
    const dto: UpdateResultDto = { status: ResultStatus.FINAL };

    resultRepositoryMock.findById.mockResolvedValueOnce({
      id,
      status: ResultStatus.CORRECTED,
    } as Result);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if dto status is provided and not a valid transition', async () => {
      const id = '123';
      const dto: UpdateResultDto = { status: ResultStatus.FINAL };

      resultRepositoryMock.findById.mockResolvedValueOnce({
        id,
        status: ResultStatus.CORRECTED,
      } as Result);

      await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
    });


  it('should throw BadRequestException if dto value is provided and result status is not PRELIMINARY', async () => {
    const id = '123';
    const dto: UpdateResultDto = { value: 10 };

    resultRepositoryMock.findById.mockResolvedValueOnce({
      id,
      status: ResultStatus.FINAL,
    } as Result);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if dto unit is provided and result status is not PRELIMINARY', async () => {
    const id = '123';
    const dto: UpdateResultDto = { unit: 'mg' };

    resultRepositoryMock.findById.mockResolvedValueOnce({
      id,
      status: ResultStatus.FINAL,
    } as Result);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if dto referenceMin is provided and result status is FINAL', async () => {
    const id = '123';
    const dto: UpdateResultDto = { referenceMin: 5 };

    resultRepositoryMock.findById.mockResolvedValueOnce({
      id,
      status: ResultStatus.FINAL,
    } as Result);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if dto referenceMax is provided and result status is FINAL', async () => {
    const id = '123';
    const dto: UpdateResultDto = { referenceMax: 15 };

    resultRepositoryMock.findById.mockResolvedValueOnce({
      id,
      status: ResultStatus.FINAL,
    } as Result);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if newMin is greater than or equal to newMax', async () => {
    const id = '123';
    const dto: UpdateResultDto = { referenceMin: 10, referenceMax: 10 };

    resultRepositoryMock.findById.mockResolvedValueOnce({
      id,
      referenceMin: 5,
      referenceMax: 15,
    } as Result);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should update result and save it if all conditions are met', async () => {
    const id = '123';
    const dto: UpdateResultDto = { status: ResultStatus.FINAL, value: 10, unit: 'mg', referenceMin: 5, referenceMax: 15, notes: 'Updated' };

    resultRepositoryMock.findById.mockResolvedValueOnce({
      id,
      status: ResultStatus.PRELIMINARY,
      referenceMin: 5,
      referenceMax: 15,
    } as Result);

    resultRepositoryMock.save.mockResolvedValueOnce({
      id,
      status: ResultStatus.FINAL,
      value: 10,
      unit: 'mg',
      referenceMin: 5,
      referenceMax: 15,
      notes: 'Updated',
    } as Result);

    const result = await service.updateResult(id, dto);

    expect(result).toEqual({
      id,
      status: ResultStatus.FINAL,
      value: 10,
      unit: 'mg',
      referenceMin: 5,
      referenceMax: 15,
      notes: 'Updated',
    });
  });
});
});

  // TESTS_APPEND_HERE
});
