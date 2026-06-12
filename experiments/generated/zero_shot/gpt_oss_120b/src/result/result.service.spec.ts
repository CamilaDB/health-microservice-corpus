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
  it('should validate order, create entity with defaults and save', async () => {
    const dto: CreateResultDto = {
      orderId: 'order-123',
      value: 42,
      unit: 'mg',
      status: ResultStatus.FINAL,
      resultDate: '2023-01-01T00:00:00.000Z',
    };
    const createdEntity = {
      ...dto,
      resultDate: new Date(dto.resultDate),
      referenceMin: null,
      referenceMax: null,
      sourceSystem: null,
      notes: null,
    } as any;
    const savedResult = { id: 'res-1', ...createdEntity } as Result;

    resultRepositoryMock.create.mockReturnValue(createdEntity);
    resultRepositoryMock.save.mockResolvedValue(savedResult);
    orderServiceMock.validateOrderResult.mockResolvedValue(undefined);

    const result = await service.createResult(dto);

    expect(orderServiceMock.validateOrderResult).toHaveBeenCalledWith(dto.orderId, dto.status);
    expect(resultRepositoryMock.create).toHaveBeenCalledWith(createdEntity);
    expect(resultRepositoryMock.save).toHaveBeenCalledWith(createdEntity);
    expect(result).toBe(savedResult);
  });

  it('should propagate validation error from OrderService', async () => {
    const dto: CreateResultDto = {
      orderId: 'order-456',
      value: 10,
      unit: 'g',
      status: ResultStatus.PRELIMINARY,
      resultDate: '2023-02-02T00:00:00.000Z',
    };
    const validationError = new BadRequestException('invalid');
    orderServiceMock.validateOrderResult.mockRejectedValue(validationError);

    await expect(service.createResult(dto)).rejects.toThrow(BadRequestException);
    expect(orderServiceMock.validateOrderResult).toHaveBeenCalledWith(dto.orderId, dto.status);
    expect(resultRepositoryMock.create).not.toHaveBeenCalled();
    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });
});

  describe('searchResults', () => {
  it('should return results from repository.search with given dto', async () => {
    const dto = {
      orderId: 'order-123',
      status: ResultStatus.FINAL,
      examType: ExamType.GLUCOSE,
      dateFrom: '2023-01-01',
      dateTo: '2023-01-31',
      sourceSystem: 'labX',
    };
    const expectedResults: Result[] = [
      {
        id: 'res1',
        orderId: 'order-123',
        value: 5.6,
        unit: 'mmol/L',
        status: ResultStatus.FINAL,
        referenceMin: 4.0,
        referenceMax: 6.0,
        resultDate: new Date('2023-01-15'),
        sourceSystem: 'labX',
        notes: null,
        created_at: new Date(),
        updated_at: new Date(),
        order: undefined as any,
      },
    ];
    resultRepositoryMock.search.mockResolvedValue(expectedResults);
    const results = await service.searchResults(dto);
    expect(resultRepositoryMock.search).toHaveBeenCalledWith(dto);
    expect(results).toBe(expectedResults);
  });
});

  describe('getResultById', () => {
  it('should throw NotFoundException when result does not exist', async () => {
    const id = 'nonexistent-id';
    resultRepositoryMock.findById.mockResolvedValueOnce(undefined);
    await expect(service.getResultById(id)).rejects.toThrow(NotFoundException);
  });

  it('should return the result when found', async () => {
    const id = 'existing-id';
    const mockResult: Result = {
      id,
      orderId: 'order-1',
      value: 42,
      unit: 'mg',
      status: ResultStatus.FINAL,
      referenceMin: null,
      referenceMax: null,
      resultDate: new Date(),
      sourceSystem: null,
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      order: undefined as any,
    };
    resultRepositoryMock.findById.mockResolvedValueOnce(mockResult);
    const result = await service.getResultById(id);
    expect(result).toBe(mockResult);
  });
});

  describe('buildResultReport', () => {
  it('throws NotFoundException when no results are found', async () => {
    orderServiceMock.getOrderById.mockResolvedValue({ id: 'order1', examType: ExamType.GLUCOSE });
    resultRepositoryMock.findByOrderId.mockResolvedValue([]);
    await expect(service.buildResultReport('order1')).rejects.toThrow(NotFoundException);
  });

  it('calculates summary and flags using default ranges', async () => {
    orderServiceMock.getOrderById.mockResolvedValue({ id: 'order2', examType: ExamType.CREATININE });
    resultRepositoryMock.findByOrderId.mockResolvedValue([
      {
        id: 'r1',
        value: '0.5',
        unit: 'mg/dL',
        status: ResultStatus.PRELIMINARY,
        referenceMin: null,
        referenceMax: null,
        sourceSystem: 'sys',
        resultDate: new Date('2023-01-01'),
      },
      {
        id: 'r2',
        value: '1.0',
        unit: 'mg/dL',
        status: ResultStatus.FINAL,
        referenceMin: null,
        referenceMax: null,
        sourceSystem: null,
        resultDate: new Date('2023-01-02'),
      },
    ]);
    const report = await service.buildResultReport('order2');
    expect(report.orderId).toBe('order2');
    expect(report.examType).toBe(ExamType.CREATININE);
    expect(report.summary.total).toBe(2);
    expect(report.summary.preliminary).toBe(1);
    expect(report.summary.final).toBe(1);
    expect(report.summary.corrected).toBe(0);
    expect(report.summary.abnormal).toBe(1);
    const item1 = report.items.find(i => i.resultId === 'r1')!;
    expect(item1.flag).toBe('LOW');
    expect(item1.referenceMin).toBe(0.6);
    expect(item1.referenceMax).toBe(1.2);
    const item2 = report.items.find(i => i.resultId === 'r2')!;
    expect(item2.flag).toBe('NORMAL');
  });

  it('uses custom reference values and sets UNKNOWN flag when both are null', async () => {
        orderServiceMock.getOrderById.mockResolvedValue({ id: 'order3', examType: ExamType.TSH });
        resultRepositoryMock.findByOrderId.mockResolvedValue([
          {
            id: 'r3',
            value: '5',
            unit: 'µIU/mL',
            status: ResultStatus.CORRECTED,
            referenceMin: null,
            referenceMax: null,
            sourceSystem: null,
            resultDate: new Date(),
          },
          {
            id: 'r4',
            value: '2',
            unit: 'µIU/mL',
            status: ResultStatus.FINAL,
            referenceMin: '1',
            referenceMax: '3',
            sourceSystem: null,
            resultDate: new Date(),
          },
        ]);
        const report = await service.buildResultReport('order3');
        expect(report.summary.total).toBe(2);
        expect(report.summary.corrected).toBe(1);
        expect(report.summary.final).toBe(1);
        expect(report.summary.abnormal).toBe(1);
        const unknownItem = report.items.find(i => i.resultId === 'r3')!;
        expect(unknownItem.flag).toBe('HIGH');
        expect(unknownItem.referenceMin).toBe(0.4);
        expect(unknownItem.referenceMax).toBe(4.0);
        const normalItem = report.items.find(i => i.resultId === 'r4')!;
        expect(normalItem.flag).toBe('NORMAL');
        expect(normalItem.referenceMin).toBe(1);
        expect(normalItem.referenceMax).toBe(3);
      });

});

  describe('updateResult', () => {
  it('throws BadRequestException when trying to change status of a CORRECTED result', async () => {
    const existing = {
      id: '1',
      status: ResultStatus.CORRECTED,
      referenceMin: null,
      referenceMax: null,
    } as Result;
    jest.spyOn(service as any, 'getResultById').mockResolvedValue(existing);
    const dto: UpdateResultDto = { status: ResultStatus.FINAL };
    await expect(service.updateResult('1', dto)).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequestException for invalid status transition from FINAL to PRELIMINARY', async () => {
    const existing = {
      id: '2',
      status: ResultStatus.FINAL,
      referenceMin: null,
      referenceMax: null,
    } as Result;
    jest.spyOn(service as any, 'getResultById').mockResolvedValue(existing);
    const dto: UpdateResultDto = { status: ResultStatus.PRELIMINARY };
    await expect(service.updateResult('2', dto)).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequestException when updating value of a non‑preliminary result', async () => {
    const existing = {
      id: '3',
      status: ResultStatus.FINAL,
      referenceMin: null,
      referenceMax: null,
    } as Result;
    jest.spyOn(service as any, 'getResultById').mockResolvedValue(existing);
    const dto: UpdateResultDto = { value: 42 };
    await expect(service.updateResult('3', dto)).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequestException when referenceMin is not less than referenceMax', async () => {
    const existing = {
      id: '4',
      status: ResultStatus.PRELIMINARY,
      referenceMin: 10,
      referenceMax: 20,
    } as Result;
    jest.spyOn(service as any, 'getResultById').mockResolvedValue(existing);
    const dto: UpdateResultDto = { referenceMin: 30, referenceMax: 25 };
    await expect(service.updateResult('4', dto)).rejects.toThrow(BadRequestException);
  });

  it('updates allowed fields and returns saved result', async () => {
    const existing = {
      id: '5',
      status: ResultStatus.PRELIMINARY,
      referenceMin: null,
      referenceMax: null,
    } as Result;
    jest.spyOn(service as any, 'getResultById').mockResolvedValue(existing);
    const saved = { ...existing, status: ResultStatus.FINAL, notes: 'updated' };
    resultRepositoryMock.save.mockResolvedValue(saved);
    const dto: UpdateResultDto = { status: ResultStatus.FINAL, notes: 'updated' };
    const result = await service.updateResult('5', dto);
    expect(result).toBe(saved);
    expect(resultRepositoryMock.save).toHaveBeenCalledWith(existing);
    expect(existing.status).toBe(ResultStatus.FINAL);
    expect(existing.notes).toBe('updated');
  });
});

  // TESTS_APPEND_HERE
});
