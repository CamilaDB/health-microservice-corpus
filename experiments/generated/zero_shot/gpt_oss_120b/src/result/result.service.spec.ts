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
  it('should create and save a result when order validation passes', async () => {
        const dto: CreateResultDto = {
          orderId: 'order-123',
          value: 42,
          unit: 'mg/dL',
          status: ResultStatus.FINAL,
          resultDate: new Date().toISOString(),
        };

        const createdEntity = {
          ...dto,
          referenceMin: null,
          referenceMax: null,
          sourceSystem: null,
          notes: null,
          created_at: new Date(),
          updated_at: new Date(),
          order: { id: dto.orderId } as any,
        } as Result;

        const savedEntity = {
          ...createdEntity,
          id: 'result-456',
        } as Result;

        orderServiceMock.validateOrderResult.mockResolvedValue(undefined);
        resultRepositoryMock.create.mockReturnValue(createdEntity);
        resultRepositoryMock.save.mockResolvedValue(savedEntity);

        const result = await service.createResult(dto);

        expect(orderServiceMock.validateOrderResult).toHaveBeenCalledWith(dto.orderId, dto.status);
        expect(resultRepositoryMock.create).toHaveBeenCalledWith(expect.objectContaining({
          orderId: dto.orderId,
          value: dto.value,
          unit: dto.unit,
          status: dto.status,
          resultDate: expect.any(Date),
        }));
        expect(resultRepositoryMock.save).toHaveBeenCalledWith(createdEntity);
        expect(result).toEqual(savedEntity);
      });


  it('should throw BadRequestException when order validation fails', async () => {
        const dto: CreateResultDto = {
          orderId: 'order-789',
          value: 100,
          unit: 'mmol/L',
          status: ResultStatus.PRELIMINARY,
          resultDate: new Date().toISOString(),
        };

        orderServiceMock.validateOrderResult.mockRejectedValue(new BadRequestException('Invalid result'));

        await expect(service.createResult(dto)).rejects.toBeInstanceOf(BadRequestException);
        expect(orderServiceMock.validateOrderResult).toHaveBeenCalledWith(dto.orderId, dto.status);
        expect(resultRepositoryMock.create).not.toHaveBeenCalled();
        expect(resultRepositoryMock.save).not.toHaveBeenCalled();
      });

});
});

  describe('FN_searchResults_END', () => {
describe('searchResults', () => {
  it('should return results when repository finds matching records', async () => {
    const mockResult: Result = {
      id: 'r1',
      orderId: 'o1',
      value: 5,
      unit: 'mg/dL',
      status: ResultStatus.FINAL,
      referenceMin: null,
      referenceMax: null,
      resultDate: new Date(),
      sourceSystem: null,
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      order: {} as any,
    };
    const dto: SearchResultsDto = {
      orderId: 'o1',
      status: ResultStatus.FINAL,
    };
    resultRepositoryMock.search.mockResolvedValue([mockResult]);

    const result = await service.searchResults(dto);

    expect(resultRepositoryMock.search).toHaveBeenCalledWith(dto);
    expect(result).toEqual([mockResult]);
  });

  it('should throw BadRequestException when dateFrom is after dateTo', async () => {
      const dto: SearchResultsDto = {
        dateFrom: '2023-12-31',
        dateTo: '2023-01-01',
      };
      resultRepositoryMock.search.mockRejectedValueOnce(new BadRequestException());
      await expect(service.searchResults(dto)).rejects.toBeInstanceOf(BadRequestException);
      expect(resultRepositoryMock.search).toHaveBeenCalled();
    });


  it('should return empty array when repository returns empty array', async () => {
      const dto: SearchResultsDto = {
        examType: ExamType.GLUCOSE,
      };
      resultRepositoryMock.search.mockResolvedValue([]);

      await expect(service.searchResults(dto)).resolves.toEqual([]);
      expect(resultRepositoryMock.search).toHaveBeenCalledWith(dto);
    });

});
});

  describe('FN_getResultById_END', () => {
describe('getResultById', () => {
  it('returns the result when it exists', async () => {
    const mockResult: Result = {
      id: 'res-1',
      orderId: 'ord-1',
      value: 42,
      unit: 'mg',
      status: ResultStatus.FINAL,
      referenceMin: 10,
      referenceMax: 100,
      resultDate: new Date('2023-01-01'),
      sourceSystem: 'sys',
      notes: 'note',
      created_at: new Date(),
      updated_at: new Date(),
      order: {} as any,
    };
    resultRepositoryMock.findById.mockResolvedValueOnce(mockResult);
    await expect(service.getResultById('res-1')).resolves.toEqual(mockResult);
    expect(resultRepositoryMock.findById).toHaveBeenCalledWith('res-1');
  });

  it('throws NotFoundException when result does not exist', async () => {
    resultRepositoryMock.findById.mockResolvedValueOnce(undefined);
    await expect(service.getResultById('non-existent')).rejects.toBeInstanceOf(NotFoundException);
    expect(resultRepositoryMock.findById).toHaveBeenCalledWith('non-existent');
  });

  it('throws NotFoundException when id is empty', async () => {
        await expect(service.getResultById('')).rejects.toBeInstanceOf(NotFoundException);
        expect(resultRepositoryMock.findById).toHaveBeenCalledWith('');
      });

});
});

  describe('FN_buildResultReport_END', () => {
describe('buildResultReport', () => {
  it('should throw NotFoundException when order is not found', async () => {
      orderServiceMock.getOrderById.mockResolvedValue({ id: 'order-1', examType: ExamType.GLUCOSE });
      resultRepositoryMock.findByOrderId.mockResolvedValue([]);
      await expect(service.buildResultReport('order-1')).rejects.toBeInstanceOf(NotFoundException);
      expect(orderServiceMock.getOrderById).toHaveBeenCalledWith('order-1');
      expect(resultRepositoryMock.findByOrderId).toHaveBeenCalledWith('order-1');
    });


  it('should throw NotFoundException when no results are found for the order', async () => {
    orderServiceMock.getOrderById.mockResolvedValue({ id: 'order-1', examType: ExamType.HEMOGRAM } as any);
    resultRepositoryMock.findByOrderId.mockResolvedValue([]);
    await expect(service.buildResultReport('order-1')).rejects.toBeInstanceOf(NotFoundException);
    expect(orderServiceMock.getOrderById).toHaveBeenCalledWith('order-1');
    expect(resultRepositoryMock.findByOrderId).toHaveBeenCalledWith('order-1');
  });

  it('should build a report with correct summary and flags', async () => {
    const order = { id: 'order-1', examType: ExamType.GLUCOSE } as any;
    const results = [
      {
        id: 'r1',
        examType: ExamType.GLUCOSE,
        value: 70,
        unit: 'mg/dL',
        status: ResultStatus.PRELIMINARY,
        referenceMin: 80,
        referenceMax: 120,
        sourceSystem: 'labA',
        resultDate: new Date('2023-01-01T00:00:00Z'),
      },
      {
        id: 'r2',
        examType: ExamType.GLUCOSE,
        value: 130,
        unit: 'mg/dL',
        status: ResultStatus.FINAL,
        referenceMin: 80,
        referenceMax: 120,
        sourceSystem: 'labA',
        resultDate: new Date('2023-01-02T00:00:00Z'),
      },
      {
        id: 'r3',
        examType: ExamType.GLUCOSE,
        value: 100,
        unit: 'mg/dL',
        status: ResultStatus.CORRECTED,
        referenceMin: 80,
        referenceMax: 120,
        sourceSystem: null,
        resultDate: new Date('2023-01-03T00:00:00Z'),
      },
    ] as any[];
    orderServiceMock.getOrderById.mockResolvedValue(order);
    resultRepositoryMock.findByOrderId.mockResolvedValue(results);
    const report = await service.buildResultReport('order-1');
    expect(report.orderId).toBe('order-1');
    expect(report.examType).toBe(ExamType.GLUCOSE);
    expect(report.items).toHaveLength(3);
    const flags = report.items.map(i => i.flag);
    expect(flags).toEqual(['LOW', 'HIGH', 'NORMAL']);
    expect(report.summary).toEqual({
      total: 3,
      preliminary: 1,
      final: 1,
      corrected: 1,
      abnormal: 2,
    });
    expect(orderServiceMock.getOrderById).toHaveBeenCalledWith('order-1');
    expect(resultRepositoryMock.findByOrderId).toHaveBeenCalledWith('order-1');
  });
});
});

  describe('FN_updateResult_END', () => {
describe('updateResult', () => {
  it('throws NotFoundException when result does not exist', async () => {
    resultRepositoryMock.findById.mockResolvedValue(undefined);
    await expect(service.updateResult('nonexistent-id', {} as UpdateResultDto)).rejects.toBeInstanceOf(NotFoundException);
    expect(resultRepositoryMock.findById).toHaveBeenCalledWith('nonexistent-id');
    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('throws BadRequestException on invalid status transition', async () => {
    const existingResult = {
      id: 'res1',
      orderId: 'ord1',
      value: 10,
      unit: 'mg',
      status: ResultStatus.FINAL,
      referenceMin: null,
      referenceMax: null,
      resultDate: new Date(),
      sourceSystem: null,
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      order: {} as any,
    } as Result;
    resultRepositoryMock.findById.mockResolvedValue(existingResult);
    const dto: UpdateResultDto = { status: ResultStatus.PRELIMINARY };
    await expect(service.updateResult('res1', dto)).rejects.toBeInstanceOf(BadRequestException);
    expect(resultRepositoryMock.findById).toHaveBeenCalledWith('res1');
    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('updates allowed fields and persists the result', async () => {
    const existingResult = {
      id: 'res2',
      orderId: 'ord2',
      value: 5,
      unit: 'mmol',
      status: ResultStatus.PRELIMINARY,
      referenceMin: 3,
      referenceMax: 7,
      resultDate: new Date(),
      sourceSystem: null,
      notes: 'initial',
      created_at: new Date(),
      updated_at: new Date(),
      order: {} as any,
    } as Result;
    resultRepositoryMock.findById.mockResolvedValue(existingResult);
    const dto: UpdateResultDto = {
      value: 6,
      unit: 'mmol/L',
      notes: 'updated',
    };
    resultRepositoryMock.save.mockImplementation(async (entity) => entity);
    const result = await service.updateResult('res2', dto);
    expect(resultRepositoryMock.findById).toHaveBeenCalledWith('res2');
    expect(resultRepositoryMock.save).toHaveBeenCalledWith(expect.objectContaining({
      id: 'res2',
      value: 6,
      unit: 'mmol/L',
      notes: 'updated',
    }));
    expect(result.value).toBe(6);
    expect(result.unit).toBe('mmol/L');
    expect(result.notes).toBe('updated');
    expect(result.status).toBe(ResultStatus.PRELIMINARY);
  });
});
});

  // TESTS_APPEND_HERE
});
