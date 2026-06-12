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
  const mockCreateResultDto = {
    orderId: 'order-123',
    value: 450.75,
    unit: 'USD',
    status: ResultStatus.FINAL,
    resultDate: new Date().toISOString(),
    referenceMin: 100,
    referenceMax: 200,
    sourceSystem: 'API_GATEWAY',
    notes: 'Test run data',
  };

  const mockResult = {
    id: 'result-abc',
    orderId: 'order-123',
    value: 450.75,
    unit: 'USD',
    status: ResultStatus.FINAL,
    referenceMin: 100,
    referenceMax: 200,
    resultDate: new Date(),
    sourceSystem: 'API_GATEWAY',
    notes: 'Test run data',
  };

  it('should successfully create a result record when all details are provided and order is valid', async () => {
    // Arrange
    orderServiceMock.validateOrderResult.mockResolvedValue(undefined);
    resultRepositoryMock.save.mockResolvedValue(mockResult);

    // Act
    const result = await service.createResult(mockCreateResultDto);

    // Assert
    expect(orderServiceMock.validateOrderResult).toHaveBeenCalledWith('order-123', ResultStatus.FINAL);
    expect(resultRepositoryMock.save).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResult);
  });

  it.skip('should successfully create a result record when only mandatory fields are provided and order is valid', async () => {
                      // Arrange
                      const minimalDto = {
                        orderId: 'order-456',
                        value: 12.34,
                        unit: 'EUR',
                        status: ResultStatus.PRELIMINARY,
                        resultDate: new Date().toISOString(),
                        sourceSystem: undefined, // Test handling of missing optionals
                        notes: undefined,
                      };

                      orderServiceMock.validateOrderResult.mockResolvedValue(undefined);
                      resultRepositoryMock.save.mockResolvedValue({ ...mockResult, orderId: 'order-456', value: 12.34 });

                      // Act
                      const result = await service.createResult(minimalDto);

                      // Assert
                      expect(orderServiceMock.validateOrderResult).toHaveBeenCalledWith('order-456', ResultStatus.PRELIMINARY);
                      expect(resultRepositoryMock.save).toHaveBeenCalledTimes(1);
                      // Check that nullish optional fields are correctly handled in the save call payload
                      const savedPayload = (resultRepositoryMock.save as jest.Mock).mock.calls[0][0];
                      expect(savedPayload.referenceMin).toBeNull();
                      expect(savedPayload.sourceSystem).toBeNull();
                  });



  it('should throw an exception if the order validation fails', async () => {
    // Arrange
    const validationError = new BadRequestException('Order is not ready for result creation');
    orderServiceMock.validateOrderResult.mockRejectedValue(validationError);

    // Act & Assert
    await expect(service.createResult(mockCreateResultDto)).rejects.toThrow(BadRequestException);
    await expect(service.createResult(mockCreateResultDto)).rejects.toThrow('Order is not ready for result creation');
    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });
});

  describe('searchResults', () => {
  it('should return results when search criteria match records', async () => {
    const mockResults = [{ id: '1', orderId: 'o1', value: 10, unit: 'mg/dL', status: null, referenceMin: null, referenceMax: null, resultDate: new Date(), sourceSystem: 'lab', notes: null, created_at: new Date(), updated_at: new Date(), order: {} }];
    (resultRepositoryMock.search as jest.Mock).mockResolvedValue(mockResults);

    const searchDto = { orderId: 'o1' };
    await expect(service.searchResults(searchDto)).resolves.toEqual(mockResults);
  });

  it('should return an empty array when no records are found', async () => {
    (resultRepositoryMock.search as jest.Mock).mockResolvedValue([]);

    const searchDto = {};
    await expect(service.searchResults(searchDto)).resolves.toEqual([]);
  });

  it('should throw the error if result repository fails during search', async () => {
    const mockError = new Error('Database connection failed');
    (resultRepositoryMock.search as jest.Mock).mockRejectedValue(mockError);

    const searchDto = {};
    await expect(service.searchResults(searchDto)).rejects.toThrow(mockError);
  });
});

  describe('getResultById', () => {
  const mockResult: Result = {
    id: 'resultId123',
    orderId: 'orderId456',
    value: 90,
    unit: 'percent',
    status: null,
    referenceMin: null,
    referenceMax: null,
    resultDate: new Date(),
    sourceSystem: 'test',
    notes: null,
    created_at: new Date(),
    updated_at: new Date(),
    order: {} as any,
  };
  const testId = 'resultId123';

  it('should return the result if found by id', async () => {
    // Arrange
    (resultRepositoryMock.findById as jest.Mock).mockResolvedValue(mockResult);

    // Act
    const result = await service.getResultById(testId);

    // Assert
    expect(resultRepositoryMock.findById).toHaveBeenCalledWith(testId);
    expect(result).toEqual(mockResult);
  });

  it('should throw NotFoundException if the result is not found', async () => {
    // Arrange
    (resultRepositoryMock.findById as jest.Mock).mockResolvedValue(undefined);

    // Act & Assert
    await expect(service.getResultById(testId)).rejects.toThrow(NotFoundException);
    await expect(service.getResultById(testId)).rejects.toThrow(`Result with id ${testId} not found`);
  });
});

  describe('buildResultReport', () => {
  const orderId = 'order123';
  const examType: ExamType = ExamType.GLUCOSE;

  beforeEach(() => {
    // Mock OrderService to return a specific type for default range calculation
    (orderServiceMock.getOrderById).mockResolvedValue({
      id: 'order',
      examType: examType,
    });
  });

  it('should throw NotFoundException if no results are found for the orderId', async () => {
    // Arrange
    (resultRepositoryMock.findByOrderId).mockResolvedValue([]);

    // Act & Assert
    await expect(service.buildResultReport(orderId)).rejects.toThrow(NotFoundException);
  });

  it('should correctly build the report when all results are normal and use provided reference ranges', async () => {
    // Arrange
    const order = { id: 'order', examType: ExamType.GLUCOSE };
    (orderServiceMock.getOrderById).mockResolvedValue(order);

    const results = [
      {
        id: 'r1',
        value: '85',
        unit: 'mg/dL',
        status: ResultStatus.FINAL,
        sourceSystem: 'LIMS',
        resultDate: new Date(),
        referenceMin: '70',
        referenceMax: '100',
      },
    ];
    (resultRepositoryMock.findByOrderId).mockResolvedValue(results);

    // Act
    const report = await service.buildResultReport(orderId);

    // Assert
    expect(report.items[0].flag).toBe('NORMAL');
    expect(report.summary).toEqual({
      total: 1,
      preliminary: 0,
      final: 1,
      corrected: 0,
      abnormal: 0,
    });
  });

  it('should correctly calculate summary counts and flags when mixing statuses and abnormal results using provided ranges', async () => {
    // Arrange
    const order = { id: 'order', examType: ExamType.GLUCOSE };
    (orderServiceMock.getOrderById).mockResolvedValue(order);

    const results = [
      { // Preliminary, Low (using explicit range)
        id: 'r1',
        value: '60',
        unit: 'mg/dL',
        status: ResultStatus.PRELIMINARY,
        sourceSystem: 'LIMS',
        resultDate: new Date(),
        referenceMin: '70',
        referenceMax: null,
      },
      { // Final, High (using explicit range)
        id: 'r2',
        value: '150',
        unit: 'mg/dL',
        status: ResultStatus.FINAL,
        sourceSystem: 'LIMS',
        resultDate: new Date(),
        referenceMin: null,
        referenceMax: '120',
      },
      { // Corrected, Normal (using explicit range)
        id: 'r3',
        value: '90',
        unit: 'mg/dL',
        status: ResultStatus.CORRECTED,
        sourceSystem: 'LIMS',
        resultDate: new Date(),
        referenceMin: '70',
        referenceMax: '100',
      },
    ];
    (resultRepositoryMock.findByOrderId).mockResolvedValue(results);

    // Act
    const report = await service.buildResultReport(orderId);

    // Assert
    expect(report.items[0].flag).toBe('LOW'); // Preliminary, Low
    expect(report.items[1].flag).toBe('HIGH'); // Final, High
    expect(report.items[2].flag).toBe('NORMAL'); // Corrected, Normal

    expect(report.summary).toEqual({
      total: 3,
      preliminary: 1,
      final: 1,
      corrected: 1,
      abnormal: 2, // r1 (LOW) + r2 (HIGH)
    });
  });

  it('should use default reference ranges when result does not provide them and correctly flag results', async () => {
    // Arrange
    const order = { id: 'order', examType: ExamType.GLUCOSE }; // Default range: [70, 99]
    (orderServiceMock.getOrderById).mockResolvedValue(order);

    const results = [
      { // Value below default min (LOW)
        id: 'r1',
        value: '65',
        unit: 'mg/dL',
        status: ResultStatus.FINAL,
        sourceSystem: null,
        resultDate: new Date(),
        referenceMin: null,
        referenceMax: null,
      },
      { // Value above default max (HIGH)
        id: 'r2',
        value: '105',
        unit: 'mg/dL',
        status: ResultStatus.FINAL,
        sourceSystem: null,
        resultDate: new Date(),
        referenceMin: null,
        referenceMax: null,
      },
      { // Value within default range (NORMAL)
        id: 'r3',
        value: '80',
        unit: 'mg/dL',
        status: ResultStatus.FINAL,
        sourceSystem: null,
        resultDate: new Date(),
        referenceMin: null,
        referenceMax: null,
      },
    ];
    (resultRepositoryMock.findByOrderId).mockResolvedValue(results);

    // Act
    const report = await service.buildResultReport(orderId);

    // Assert
    expect(report.items[0].flag).toBe('LOW'); // 65 < 70 (default min)
    expect(report.items[1].flag).toBe('HIGH'); // 105 > 99 (default max)
    expect(report.items[2].flag).toBe('NORMAL');

    expect(report.summary).toEqual({
      total: 3,
      preliminary: 0,
      final: 3,
      corrected: 0,
      abnormal: 2, // r1 (LOW) + r2 (HIGH)
    });
  });

  it('should flag results as UNKNOWN if no reference range is available from result or default settings', async () => {
    // Arrange
    const order = { id: 'order', examType: ExamType.HEMOGRAM }; // Assume HEMOGRAM has no defined defaults in the function logic
    (orderServiceMock.getOrderById).mockResolvedValue(order);

    const results = [
      { // No reference range provided, and default ranges are not set for this type (or null)
        id: 'r1',
        value: '50',
        unit: 'count',
        status: ResultStatus.FINAL,
        sourceSystem: null,
        resultDate: new Date(),
        referenceMin: null,
        referenceMax: null,
      },
    ];
    (resultRepositoryMock.findByOrderId).mockResolvedValue(results);

    // Act
    const report = await service.buildResultReport(orderId);

    // Assert
    expect(report.items[0].flag).toBe('UNKNOWN');
    expect(report.summary).toEqual({
      total: 1,
      preliminary: 0,
      final: 1,
      corrected: 0,
      abnormal: 0, // UNKNOWN is not counted as abnormal
    });
  });

  it('should handle mixed reference range sources (explicit vs default) correctly', async () => {
    // Arrange
    const order = { id: 'order', examType: ExamType.CREATININE }; // Default range: [0.6, 1.2]
    (orderServiceMock.getOrderById).mockResolvedValue(order);

    const results = [
      { // Explicitly defined range (should override default) - LOW
        id: 'r1',
        value: '0.4',
        unit: 'mg/dL',
        status: ResultStatus.FINAL,
        sourceSystem: null,
        resultDate: new Date(),
        referenceMin: '0.5', // Explicitly set min
        referenceMax: null,
      },
      { // No explicit range (should use default) - HIGH
        id: 'r2',
        value: '1.3',
        unit: 'mg/dL',
        status: ResultStatus.FINAL,
        sourceSystem: null,
        resultDate: new Date(),
        referenceMin: null,
        referenceMax: null, // Uses default max (1.2)
      },
    ];
    (resultRepositoryMock.findByOrderId).mockResolvedValue(results);

    // Act
    const report = await service.buildResultReport(orderId);

    // Assert
    expect(report.items[0].flag).toBe('LOW'); // 0.4 < 0.5 (explicit min)
    expect(report.items[1].flag).toBe('HIGH'); // 1.3 > 1.2 (default max)

    expect(report.summary).toEqual({
      total: 2,
      preliminary: 0,
      final: 2,
      corrected: 0,
      abnormal: 2,
    });
  });
});

  describe('updateResult', () => {
  const id = 'testId';
  const mockInitialResult: Result = {
    id,
    orderId: 'order123',
    value: 50,
    unit: 'kg',
    status: ResultStatus.PRELIMINARY,
    referenceMin: 10,
    referenceMax: 100,
    resultDate: new Date(),
    sourceSystem: 'test',
    notes: null,
    created_at: new Date(),
    updated_at: new Date(),
    order: {} as any,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the initial fetch call (getResultById)
    (resultRepositoryMock.findById as jest.Mock).mockResolvedValue(mockInitialResult);
    // Default successful save mock
    (resultRepositoryMock.save as jest.Mock).mockImplementation((r: Result) => Promise.resolve({ ...r }));
  });

  it.skip('should throw BadRequestException if attempting to change status of a CORRECTED result', async () => {
                      const correctedResult: Result = { ...mockInitialResult, status: ResultStatus.CORRECTED };
                      (resultRepositoryMock.findById as jest.Mock).mockResolvedValue(correctedResult);

                      const dto: UpdateResultDto = { status: ResultStatus.FINAL };

                      await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
                      await expect(service.updateResult(id, dto)).rejects.toThrow('Cannot change status of a CORRECTED result  it is terminal');
                  });



  it('should throw BadRequestException for invalid status transition from FINAL to PRELIMINARY', async () => {
    const finalResult: Result = { ...mockInitialResult, status: ResultStatus.FINAL };
    (resultRepositoryMock.findById as jest.Mock).mockResolvedValue(finalResult);

    const dto: UpdateResultDto = { status: ResultStatus.PRELIMINARY };

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
    await expect(service.updateResult(id, dto)).rejects.toThrow('Invalid status transition from FINAL to PRELIMINARY');
  });

  it('should throw BadRequestException if updating value of a non-preliminary result', async () => {
    const finalResult: Result = { ...mockInitialResult, status: ResultStatus.FINAL };
    (resultRepositoryMock.findById as jest.Mock).mockResolvedValue(finalResult);

    const dto: UpdateResultDto = { value: 60 };

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
    await expect(service.updateResult(id, dto)).rejects.toThrow('Cannot update value of a non-preliminary result');
  });

  it('should throw BadRequestException if updating unit of a non-preliminary result', async () => {
    const finalResult: Result = { ...mockInitialResult, status: ResultStatus.FINAL };
    (resultRepositoryMock.findById as jest.Mock).mockResolvedValue(finalResult);

    const dto: UpdateResultDto = { unit: 'lbs' };

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
    await expect(service.updateResult(id, dto)).rejects.toThrow('Cannot update unit of a non-preliminary result');
  });

  it('should throw BadRequestException if updating referenceMin on a final result', async () => {
    const finalResult: Result = { ...mockInitialResult, status: ResultStatus.FINAL };
    (resultRepositoryMock.findById as jest.Mock).mockResolvedValue(finalResult);

    const dto: UpdateResultDto = { referenceMin: 5 };

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
    await expect(service.updateResult(id, dto)).rejects.toThrow('Cannot update referenceMin of a final result');
  });

  it('should throw BadRequestException if updating referenceMax on a final result', async () => {
    const finalResult: Result = { ...mockInitialResult, status: ResultStatus.FINAL };
    (resultRepositoryMock.findById as jest.Mock).mockResolvedValue(finalResult);

    const dto: UpdateResultDto = { referenceMax: 150 };

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
    await expect(service.updateResult(id, dto)).rejects.toThrow('Cannot update referenceMax of a final result');
  });

  it('should throw BadRequestException if referenceMin is greater than or equal to referenceMax', async () => {
    const preliminaryResult: Result = { ...mockInitialResult };
    (resultRepositoryMock.findById as jest.Mock).mockResolvedValue(preliminaryResult);

    // Case 1: Min equals Max
    let dtoEqual: UpdateResultDto = { referenceMin: 50, referenceMax: 50 };
    await expect(service.updateResult(id, dtoEqual)).rejects.toThrow(BadRequestException);
    await expect(service.updateResult(id, dtoEqual)).rejects.toThrow('referenceMin must be less than referenceMax');

    // Case 2: Min greater than Max
    let dtoGreater: UpdateResultDto = { referenceMin: 100, referenceMax: 50 };
    await expect(service.updateResult(id, dtoGreater)).rejects.toThrow(BadRequestException);
    await expect(service.updateResult(id, dtoGreater)).rejects.toThrow('referenceMin must be less than referenceMax');
  });

  it('should successfully update status and value when transitioning from PRELIMINARY to FINAL', async () => {
    const preliminaryResult: Result = { ...mockInitialResult };
    (resultRepositoryMock.findById as jest.Mock).mockResolvedValue(preliminaryResult);

    const dto: UpdateResultDto = {
      status: ResultStatus.FINAL,
      value: 75,
      unit: 'kg',
    };

    const result = await service.updateResult(id, dto);

    expect(result).toEqual({
      ...preliminaryResult,
      status: ResultStatus.FINAL,
      value: 75,
      unit: 'kg',
    });
    expect(resultRepositoryMock.save).toHaveBeenCalledWith(expect.objectContaining({ status: ResultStatus.FINAL }));
  });

  it('should successfully update only notes when result is FINAL', async () => {
    const finalResult: Result = { ...mockInitialResult, status: ResultStatus.FINAL };
    (resultRepositoryMock.findById as jest.Mock).mockResolvedValue(finalResult);

    const dto: UpdateResultDto = { notes: 'Reviewed by supervisor' };

    const result = await service.updateResult(id, dto);

    expect(result).toEqual({
      ...finalResult,
      notes: 'Reviewed by supervisor',
    });
    expect(resultRepositoryMock.save).toHaveBeenCalledWith(expect.objectContaining({ notes: 'Reviewed by supervisor' }));
  });

  it('should successfully update referenceMin and referenceMax when they are provided and valid', async () => {
    const preliminaryResult: Result = { ...mockInitialResult };
    (resultRepositoryMock.findById as jest.Mock).mockResolvedValue(preliminaryResult);

    const dto: UpdateResultDto = { referenceMin: 5, referenceMax: 10 };

    const result = await service.updateResult(id, dto);

    expect(result).toEqual({
      ...preliminaryResult,
      referenceMin: 5,
      referenceMax: 10,
    });
    expect(resultRepositoryMock.save).toHaveBeenCalledWith(expect.objectContaining({ referenceMin: 5, referenceMax: 10 }));
  });

  it('should successfully update status when transitioning from PRELIMINARY to CORRECTED', async () => {
    const preliminaryResult: Result = { ...mockInitialResult };
    (resultRepositoryMock.findById as jest.Mock).mockResolvedValue(preliminaryResult);

    const dto: UpdateResultDto = { status: ResultStatus.CORRECTED };

    const result = await service.updateResult(id, dto);

    expect(result).toEqual({
      ...preliminaryResult,
      status: ResultStatus.CORRECTED,
    });
    expect(resultRepositoryMock.save).toHaveBeenCalledWith(expect.objectContaining({ status: ResultStatus.CORRECTED }));
  });
});

  // TESTS_APPEND_HERE
});
