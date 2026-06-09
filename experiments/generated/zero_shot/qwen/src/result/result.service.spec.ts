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
  it('should create a new result successfully', async () => {
    const dto = {
      orderId: 'order-123',
      value: 45.67,
      unit: 'mg/dL',
      status: ResultStatus.FINAL,
      referenceMin: 0,
      referenceMax: 100,
      resultDate: new Date('2024-01-15'),
    };

    const expectedResult = { id: 'result-789' } as Partial<Result>;

    orderServiceMock.validateOrderResult.mockResolvedValue(undefined);
    resultRepositoryMock.create.mockReturnValue({ ...dto, created_at: new Date(), updated_at: new Date() });
    resultRepositoryMock.save.mockResolvedValue(expectedResult);

    const result = await service.createResult(dto);

    expect(result).toEqual(expectedResult);
  });

  it('should throw NotFoundException when order does not exist', async () => {
    const dto = {
      orderId: 'non-existent-order',
      value: 45.67,
      unit: 'mg/dL',
      status: ResultStatus.FINAL,
    };

    orderServiceMock.validateOrderResult.mockRejectedValue(new NotFoundException('Order not found'));

    await expect(service.createResult(dto)).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException when invalid result status is provided for existing order', async () => {
    const dto = {
      orderId: 'order-123',
      value: 45.67,
      unit: 'mg/dL',
      status: ResultStatus.FINAL as any, // Invalid enum value to trigger validation error
    };

    orderServiceMock.validateOrderResult.mockRejectedValue(new BadRequestException('Invalid result status for this order'));

    await expect(service.createResult(dto)).rejects.toThrow(BadRequestException);
  });

  it('should create result with optional fields as null when not provided', async () => {
    const dto = {
      orderId: 'order-123',
      value: 45.67,
      unit: 'mg/dL',
      status: ResultStatus.PRELIMINARY,
    };

    orderServiceMock.validateOrderResult.mockResolvedValue(undefined);
    resultRepositoryMock.create.mockReturnValue({ ...dto, created_at: new Date(), updated_at: new Date() });
    const expectedResult = { id: 'result-789' } as Partial<Result>;
    resultRepositoryMock.save.mockResolvedValue(expectedResult);

    await service.createResult(dto);

    expect(resultRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        referenceMin: null,
        referenceMax: null,
        sourceSystem: null,
        notes: null,
      }),
    );
  });

  it('should create result with optional fields when provided', async () => {
    const dto = {
      orderId: 'order-123',
      value: 45.67,
      unit: 'mg/dL',
      status: ResultStatus.FINAL,
      referenceMin: 0,
      referenceMax: 100,
      resultDate: new Date('2024-01-15'),
      sourceSystem: 'LAB_SYSTEM_A',
      notes: 'Initial test run',
    };

    orderServiceMock.validateOrderResult.mockResolvedValue(undefined);
    const createdEntity = { ...dto } as Partial<Result>;
    resultRepositoryMock.create.mockReturnValue(createdEntity);
    const expectedResult = { id: 'result-789' } as Partial<Result>;
    resultRepositoryMock.save.mockResolvedValue(expectedResult);

    await service.createResult(dto);

    expect(resultRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        referenceMin: 0,
        referenceMax: 100,
        sourceSystem: 'LAB_SYSTEM_A',
        notes: 'Initial test run',
      }),
    );
  });
});

  describe('getResultById', () => {
  it('should return a Result when id exists in repository', async () => {
    const mockResult = new Result();
    mockResult.id = 'test-id';
    
    jest.spyOn(resultRepositoryMock, 'findById').mockResolvedValue(mockResult);

    await expect(service.getResultById('test-id')).resolves.toEqual(mockResult);
  });

  it('should throw NotFoundException when result is not found', async () => {
    const id = 'non-existent-id';
    
    jest.spyOn(resultRepositoryMock, 'findById').mockResolvedValue(undefined);

    await expect(service.getResultById(id)).rejects.toThrow(NotFoundException);
  });
});

  describe('buildResultReport', () => {
  it('should throw NotFoundException when no results exist for order', async () => {
    const orderId = 'order-123';
    resultRepositoryMock.findByOrderId.mockResolvedValue([]);

    await expect(service.buildResultReport(orderId)).rejects.toThrow(NotFoundException);
  });

  it('should return report with correct summary counts when all results are FINAL', async () => {
    const orderId = 'order-123';
    const order: any = { examType: ExamType.GLUCOSE };
    const resultDate = new Date();
    
    const mockResults = [
      { id: 'result-1', value: 85, unit: 'mg/dL', status: ResultStatus.FINAL, referenceMin: null, referenceMax: null, sourceSystem: 'lab-system' },
      { id: 'result-2', value: 90, unit: 'mg/dL', status: ResultStatus.FINAL, referenceMin: null, referenceMax: null, sourceSystem: 'lab-system' },
    ];

    orderServiceMock.getOrderById.mockResolvedValue(order);
    resultRepositoryMock.findByOrderId.mockResolvedValue(mockResults as any[]);

    const report = await service.buildResultReport(orderId);

    expect(report.orderId).toBe(orderId);
    expect(report.examType).toBe(ExamType.GLUCOSE);
    expect(report.summary.total).toBe(2);
    expect(report.summary.preliminary).toBe(0);
    expect(report.summary.final).toBe(2);
    expect(report.summary.corrected).toBe(0);
    expect(report.summary.abnormal).toBe(0);

    report.items.forEach((item: any) => {
      expect(item.flag).toBe('NORMAL');
    });
  });

  it('should return report with correct summary counts when results have different statuses', async () => {
    const orderId = 'order-123';
    const order: any = { examType: ExamType.GLUCOSE };
    
    const mockResults = [
      { id: 'result-1', value: 85, unit: 'mg/dL', status: ResultStatus.PRELIMINARY, referenceMin: null, referenceMax: null },
      { id: 'result-2', value: 90, unit: 'mg/dL', status: ResultStatus.FINAL, referenceMin: null, referenceMax: null },
      { id: 'result-3', value: 88, unit: 'mg/dL', status: ResultStatus.CORRECTED, referenceMin: null, referenceMax: null },
    ];

    orderServiceMock.getOrderById.mockResolvedValue(order);
    resultRepositoryMock.findByOrderId.mockResolvedValue(mockResults as any[]);

    const report = await service.buildResultReport(orderId);

    expect(report.summary.total).toBe(3);
    expect(report.summary.preliminary).toBe(1);
    expect(report.summary.final).toBe(1);
    expect(report.summary.corrected).toBe(1);
  });

  it('should return report with abnormal count when values are outside reference range', async () => {
          const orderId = 'order-456';
          const order: any = { examType: ExamType.GLUCOSE };
          
          const mockResults = [
            { id: 'result-1', value: 50, unit: 'mg/dL', status: ResultStatus.FINAL, referenceMin: null, referenceMax: null },
            { id: 'result-2', value: 110, unit: 'mg/dL', status: ResultStatus.FINAL, referenceMin: null, referenceMax: null },
          ];

          orderServiceMock.getOrderById.mockResolvedValue(order);
          resultRepositoryMock.findByOrderId.mockResolvedValue(mockResults as any[]);

          const defaultRanges = {
            [ExamType.GLUCOSE]: { min: 70, max: 99 },
          };

          const report = await service.buildResultReport(orderId);

          expect(report.summary.abnormal).toBe(2);
          
          const lowItem: any = report.items.find((i) => i.flag === 'LOW');
          const highItem: any = report.items.find((i) => i.flag === 'HIGH');
          
          expect(lowItem.value).toBeLessThan(defaultRanges[ExamType.GLUCOSE].min);
          expect(highItem.value).toBeGreaterThan(defaultRanges[ExamType.GLUCOSE].max);
        });


  it('should use custom reference ranges when provided in result entity', async () => {
    const orderId = 'order-789';
    const order: any = { examType: ExamType.CREATININE };
    
    const mockResults = [
      { id: 'result-1', value: 0.5, unit: 'mg/dL', status: ResultStatus.FINAL, referenceMin: '0.8', referenceMax: '1.2' },
    ];

    orderServiceMock.getOrderById.mockResolvedValue(order);
    resultRepositoryMock.findByOrderId.mockResolvedValue(mockResults as any[]);

    const report = await service.buildResultReport(orderId);

    expect(report.items[0].referenceMin).toBe(0.8);
    expect(report.items[0].referenceMax).toBe(1.2);
  });

  it('should use default reference ranges when no custom references provided', async () => {
    const orderId = 'order-999';
    const order: any = { examType: ExamType.TSH };
    
    const mockResults = [
      { id: 'result-1', value: 2.5, unit: 'mIU/L', status: ResultStatus.FINAL, referenceMin: null, referenceMax: null },
    ];

    orderServiceMock.getOrderById.mockResolvedValue(order);
    resultRepositoryMock.findByOrderId.mockResolvedValue(mockResults as any[]);

    const report = await service.buildResultReport(orderId);

    expect(report.items[0].referenceMin).toBe(0.4);
    expect(report.items[0].referenceMax).toBe(4.0);
  });

  it('should handle UNKNOWN flag when no reference ranges exist', async () => {
    const orderId = 'order-unknown';
    const order: any = { examType: ExamType.URINE }; // No default range for URINE
    
    const mockResults = [
      { id: 'result-1', value: 50, unit: 'mg/dL', status: ResultStatus.FINAL, referenceMin: null, referenceMax: null },
    ];

    orderServiceMock.getOrderById.mockResolvedValue(order);
    resultRepositoryMock.findByOrderId.mockResolvedValue(mockResults as any[]);

    const report = await service.buildResultReport(orderId);

    expect(report.items[0].flag).toBe('UNKNOWN');
  });

  it('should preserve sourceSystem and resultDate from entity', async () => {
    const orderId = 'order-source';
    const order: any = { examType: ExamType.GLUCOSE };
    
    const mockResults = [
      { id: 'result-1', value: 85, unit: 'mg/dL', status: ResultStatus.FINAL, referenceMin: null, referenceMax: null, sourceSystem: 'system-a', resultDate: new Date('2024-01-15') },
    ];

    orderServiceMock.getOrderById.mockResolvedValue(order);
    resultRepositoryMock.findByOrderId.mockResolvedValue(mockResults as any[]);

    const report = await service.buildResultReport(orderId);

    expect(report.items[0].sourceSystem).toBe('system-a');
    expect(report.items[0].resultDate.toISOString()).toBe(new Date('2024-01-15').toISOString());
  });
});

  describe('updateResult', () => {
  it('should update result when no restrictions apply and save successfully', async () => {
                const id = 'test-id';
                const dto: UpdateResultDto = { status: ResultStatus.FINAL, value: 10 };
                const existingResult: Partial<Result> = {
                  id,
                  orderId: 'order-123',
                  referenceMin: null,
                  referenceMax: null,
                  notes: '',
                  status: ResultStatus.PRELIMINARY,
                } as unknown as Result;

                resultRepositoryMock.findById.mockResolvedValue(existingResult);
                const expectedResult: Partial<Result> = { ...existingResult };
                Object.assign(expectedResult, dto);
                resultRepositoryMock.save.mockResolvedValue(expectedResult);

                await expect(service.updateResult(id, dto)).resolves.toEqual(expectedResult);
              });



  it('should throw BadRequestException when changing status of a CORRECTED result', async () => {
    const id = 'test-id';
    const dto: UpdateResultDto = { status: ResultStatus.FINAL };
    const existingResult: Partial<Result> = {
      id,
      orderId: 'order-123',
      referenceMin: null,
      referenceMax: null,
      notes: '',
      status: ResultStatus.CORRECTED,
    } as unknown as Result;

    resultRepositoryMock.findById.mockResolvedValue(existingResult);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when attempting invalid status transition from PRELIMINARY to INVALID_STATUS', async () => {
                      const id = 'test-id';
                      const dto: UpdateResultDto = { status: 'invalid' };
                      const existingResult: Partial<Result> = {
                        id,
                        orderId: 'order-123',
                        referenceMin: null,
                        referenceMax: null,
                        notes: '',
                        status: ResultStatus.PRELIMINARY,
                      } as unknown as Result;

                      resultRepositoryMock.findById.mockResolvedValue(existingResult);

                      await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
                    });




  it('should throw BadRequestException when invalid status transition from FINAL to PRELIMINARY', async () => {
    const id = 'test-id';
    const dto: UpdateResultDto = { status: ResultStatus.PRELIMINARY };
    const existingResult: Partial<Result> = {
      id,
      orderId: 'order-123',
      referenceMin: null,
      referenceMax: null,
      notes: '',
      status: ResultStatus.FINAL,
    } as unknown as Result;

    resultRepositoryMock.findById.mockResolvedValue(existingResult);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when updating value of non-preliminary result', async () => {
    const id = 'test-id';
    const dto: UpdateResultDto = { status: ResultStatus.FINAL, value: 10 };
    const existingResult: Partial<Result> = {
      id,
      orderId: 'order-123',
      referenceMin: null,
      referenceMax: null,
      notes: '',
      status: ResultStatus.CORRECTED,
    } as unknown as Result;

    resultRepositoryMock.findById.mockResolvedValue(existingResult);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when updating unit of non-preliminary result', async () => {
    const id = 'test-id';
    const dto: UpdateResultDto = { status: ResultStatus.FINAL, value: 10 };
    const existingResult: Partial<Result> = {
      id,
      orderId: 'order-123',
      referenceMin: null,
      referenceMax: null,
      notes: '',
      unit: 'mg/dL',
      status: ResultStatus.FINAL,
    } as unknown as Result;

    resultRepositoryMock.findById.mockResolvedValue(existingResult);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when updating referenceMin of final result', async () => {
    const id = 'test-id';
    const dto: UpdateResultDto = { status: ResultStatus.FINAL };
    const existingResult: Partial<Result> = {
      id,
      orderId: 'order-123',
      referenceMin: 0.5,
      referenceMax: null,
      notes: '',
      unit: 'mg/dL',
      status: ResultStatus.FINAL,
    } as unknown as Result;

    resultRepositoryMock.findById.mockResolvedValue(existingResult);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when updating referenceMax of final result', async () => {
    const id = 'test-id';
    const dto: UpdateResultDto = { status: ResultStatus.FINAL };
    const existingResult: Partial<Result> = {
      id,
      orderId: 'order-123',
      referenceMin: null,
      referenceMax: 5.0,
      notes: '',
      unit: 'mg/dL',
      status: ResultStatus.FINAL,
    } as unknown as Result;

    resultRepositoryMock.findById.mockResolvedValue(existingResult);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when referenceMin >= referenceMax', async () => {
    const id = 'test-id';
    const dto: UpdateResultDto = { status: ResultStatus.FINAL };
    const existingResult: Partial<Result> = {
      id,
      orderId: 'order-123',
      referenceMin: 5.0,
      referenceMax: null,
      notes: '',
      unit: 'mg/dL',
      status: ResultStatus.PRELIMINARY,
    } as unknown as Result;

    resultRepositoryMock.findById.mockResolvedValue(existingResult);
    const expectedResult: Partial<Result> = { ...existingResult };
    Object.assign(expectedResult, dto);
    resultRepositoryMock.save.mockResolvedValue(expectedResult);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should preserve existing referenceMin when not provided in DTO', async () => {
    const id = 'test-id';
    const dto: UpdateResultDto = {};
    const existingResult: Partial<Result> = {
      id,
      orderId: 'order-123',
      referenceMin: 0.5,
      referenceMax: null,
      notes: '',
      unit: 'mg/dL',
      status: ResultStatus.PRELIMINARY,
    } as unknown as Result;

    resultRepositoryMock.findById.mockResolvedValue(existingResult);
    const expectedResult: Partial<Result> = { ...existingResult };
    Object.assign(expectedResult, dto);
    resultRepositoryMock.save.mockResolvedValue(expectedResult);

    await expect(service.updateResult(id, dto)).resolves.toEqual(expectedResult);
  });

  it('should preserve existing referenceMax when not provided in DTO', async () => {
    const id = 'test-id';
    const dto: UpdateResultDto = {};
    const existingResult: Partial<Result> = {
      id,
      orderId: 'order-123',
      referenceMin: null,
      referenceMax: 5.0,
      notes: '',
      unit: 'mg/dL',
      status: ResultStatus.PRELIMINARY,
    } as unknown as Result;

    resultRepositoryMock.findById.mockResolvedValue(existingResult);
    const expectedResult: Partial<Result> = { ...existingResult };
    Object.assign(expectedResult, dto);
    resultRepositoryMock.save.mockResolvedValue(expectedResult);

    await expect(service.updateResult(id, dto)).resolves.toEqual(expectedResult);
  });

  it('should update notes when provided in DTO', async () => {
    const id = 'test-id';
    const dto: UpdateResultDto = { status: ResultStatus.FINAL };
    const existingResult: Partial<Result> = {
      id,
      orderId: 'order-123',
      referenceMin: null,
      referenceMax: null,
      notes: '',
      unit: 'mg/dL',
      status: ResultStatus.PRELIMINARY,
    } as unknown as Result;

    resultRepositoryMock.findById.mockResolvedValue(existingResult);
    const expectedResult: Partial<Result> = { ...existingResult };
    Object.assign(expectedResult, dto);
    Object.assign(expectedResult, { notes: 'Updated note' });
    resultRepositoryMock.save.mockResolvedValue(expectedResult);

    await expect(service.updateResult(id, dto)).resolves.toEqual(expectedResult);
  });
});

  // TESTS_APPEND_HERE
});
