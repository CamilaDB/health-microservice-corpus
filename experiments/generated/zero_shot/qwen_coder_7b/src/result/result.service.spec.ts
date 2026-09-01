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
  it('should create and save a result', async () => {
    const dto: CreateResultDto = {
      orderId: 'order123',
      value: 100,
      unit: 'mg',
      status: ResultStatus.PRELIMINARY,
      resultDate: '2023-10-01T12:00:00Z',
      sourceSystem: 'system1',
      notes: 'notes1',
    };

    const result: Result = {
      id: 'result123',
      orderId: dto.orderId,
      value: dto.value,
      unit: dto.unit,
      status: dto.status,
      referenceMin: dto.referenceMin ?? null,
      referenceMax: dto.referenceMax ?? null,
      resultDate: new Date(dto.resultDate),
      sourceSystem: dto.sourceSystem ?? null,
      notes: dto.notes ?? null,
      created_at: new Date(),
      updated_at: new Date(),
      order: undefined,
    };

    resultRepositoryMock.create.mockReturnValue(result);
    resultRepositoryMock.save.mockResolvedValue(result);

    const createdResult = await service.createResult(dto);

    expect(createdResult).toEqual(result);
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

  it('should throw BadRequestException if order validation fails', async () => {
    const dto: CreateResultDto = {
      orderId: 'order123',
      value: 100,
      unit: 'mg',
      status: ResultStatus.PRELIMINARY,
      resultDate: '2023-10-01T12:00:00Z',
      sourceSystem: 'system1',
      notes: 'notes1',
    };

    orderServiceMock.validateOrderResult.mockRejectedValue(new BadRequestException('Invalid order'));

    await expect(service.createResult(dto)).rejects.toThrow(BadRequestException);
  });
});
});

  describe('FN_searchResults_END', () => {
describe('searchResults', () => {
  it('should return search results based on the provided DTO', async () => {
    const dto: SearchResultsDto = {
      orderId: 'order123',
      status: ResultStatus.FINAL,
      examType: ExamType.GLUCOSE,
      dateFrom: '2023-01-01',
      dateTo: '2023-12-31',
      sourceSystem: 'systemA',
    };

    const expectedResult: Result[] = [
      {
        id: 'result1',
        orderId: 'order123',
        value: 120,
        unit: 'mg/dL',
        status: ResultStatus.FINAL,
        referenceMin: 70,
        referenceMax: 140,
        resultDate: new Date(),
        sourceSystem: 'systemA',
        notes: null,
        created_at: new Date(),
        updated_at: new Date(),
        order: null,
      },
    ];

    resultRepositoryMock.search.mockResolvedValue(expectedResult);

    const result = await service.searchResults(dto);

    expect(resultRepositoryMock.search).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expectedResult);
  });

  it.skip('should throw BadRequestException if the DTO is invalid', async () => {
        const dto: SearchResultsDto = {
          orderId: 'order123',
          status: ResultStatus.FINAL,
          examType: ExamType.GLUCOSE,
          dateFrom: '2023-01-01',
          dateTo: '2023-12-31',
          sourceSystem: 'systemA',
        };

        resultRepositoryMock.search.mockResolvedValue(undefined);

        await expect(service.searchResults(dto)).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw NotFoundException if no results are found', async () => {
        const dto: SearchResultsDto = {
          orderId: 'order123',
          status: ResultStatus.FINAL,
          examType: ExamType.GLUCOSE,
          dateFrom: '2023-01-01',
          dateTo: '2023-12-31',
          sourceSystem: 'systemA',
        };

        resultRepositoryMock.search.mockResolvedValue([]);

        await expect(service.searchResults(dto)).rejects.toThrow(NotFoundException);
      });
});
});

  describe('FN_getResultById_END', () => {
describe('getResultById', () => {
  it('should return the result when found', async () => {
    const id = '123';
    const expectedResult: Result = {
      id,
      orderId: 'order123',
      value: 100,
      unit: 'mg/dL',
      status: ResultStatus.PRELIMINARY,
      referenceMin: 80,
      referenceMax: 120,
      resultDate: new Date(),
      sourceSystem: 'system1',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      order: null,
    };

    resultRepositoryMock.findById.mockResolvedValue(expectedResult);

    const result = await service.getResultById(id);

    expect(result).toEqual(expectedResult);
    expect(resultRepositoryMock.findById).toHaveBeenCalledWith(id);
  });

  it('should throw NotFoundException when result not found', async () => {
    const id = '123';

    resultRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(service.getResultById(id)).rejects.toThrow(NotFoundException);
    await expect(service.getResultById(id)).rejects.toThrow(`Result with id ${id} not found`);
    expect(resultRepositoryMock.findById).toHaveBeenCalledWith(id);
  });
});
});

  describe('FN_buildResultReport_END', () => {
describe('buildResultReport', () => {
  it('should throw NotFoundException if no results found for order', async () => {
    const orderId = '123';
    orderServiceMock.getOrderById.mockResolvedValue({ id: orderId, examType: ExamType.GLUCOSE });
    resultRepositoryMock.findByOrderId.mockResolvedValue([]);

    await expect(service.buildResultReport(orderId)).rejects.toThrow(NotFoundException);
  });

  it.skip('should build result report with preliminary results', async () => {
        const orderId = '123';
        const order = { id: orderId, examType: ExamType.GLUCOSE };
        const results = [
          { id: '1', status: ResultStatus.PRELIMINARY, value: '75', unit: 'mg/dL', referenceMin: null, referenceMax: null },
          { id: '2', status: ResultStatus.FINAL, value: '80', unit: 'mg/dL', referenceMin: null, referenceMax: null },
        ];

        orderServiceMock.getOrderById.mockResolvedValue(order);
        resultRepositoryMock.findByOrderId.mockResolvedValue(results);

        const resultReport = await service.buildResultReport(orderId);

        expect(resultReport).toEqual({
          orderId,
          examType: ExamType.GLUCOSE,
          items: [
            {
              resultId: '1',
              examType: ExamType.GLUCOSE,
              value: 75,
              unit: 'mg/dL',
              status: ResultStatus.PRELIMINARY,
              referenceMin: null,
              referenceMax: null,
              flag: 'UNKNOWN',
              sourceSystem: null,
              resultDate: expect.any(Date),
            },
            {
              resultId: '2',
              examType: ExamType.GLUCOSE,
              value: 80,
              unit: 'mg/dL',
              status: ResultStatus.FINAL,
              referenceMin: null,
              referenceMax: null,
              flag: 'UNKNOWN',
              sourceSystem: null,
              resultDate: expect.any(Date),
            },
          ],
          summary: {
            total: 2,
            preliminary: 1,
            final: 1,
            corrected: 0,
            abnormal: 0,
          },
        });
      });

  it.skip('should build result report with abnormal results', async () => {
        const orderId = '123';
        const order = { id: orderId, examType: ExamType.GLUCOSE };
        const results = [
          { id: '1', status: ResultStatus.FINAL, value: '65', unit: 'mg/dL', referenceMin: '70', referenceMax: '99' },
          { id: '2', status: ResultStatus.FINAL, value: '100', unit: 'mg/dL', referenceMin: '70', referenceMax: '99' },
        ];

        orderServiceMock.getOrderById.mockResolvedValue(order);
        resultRepositoryMock.findByOrderId.mockResolvedValue(results);

        const resultReport = await service.buildResultReport(orderId);

        expect(resultReport).toEqual({
          orderId,
          examType: ExamType.GLUCOSE,
          items: [
            {
              resultId: '1',
              examType: ExamType.GLUCOSE,
              value: 65,
              unit: 'mg/dL',
              status: ResultStatus.FINAL,
              referenceMin: 70,
              referenceMax: 99,
              flag: 'LOW',
              sourceSystem: null,
              resultDate: expect.any(Date),
            },
            {
              resultId: '2',
              examType: ExamType.GLUCOSE,
              value: 100,
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
            total: 2,
            preliminary: 0,
            final: 2,
            corrected: 0,
            abnormal: 2,
          },
        });
      });
});
});

  describe('FN_updateResult_END', () => {
describe('updateResult', () => {
  it('should throw BadRequestException when trying to change status of a CORRECTED result', async () => {
    const id = '123';
    const dto: UpdateResultDto = { status: ResultStatus.FINAL };
    const result: Result = {
      id,
      orderId: '456',
      value: 10,
      unit: 'mg',
      status: ResultStatus.CORRECTED,
      referenceMin: null,
      referenceMax: null,
      resultDate: new Date(),
      sourceSystem: null,
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
      order: null,
    };
    resultRepositoryMock.findById.mockResolvedValue(result);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
    expect(resultRepositoryMock.findById).toHaveBeenCalledWith(id);
  });

  it('should throw BadRequestException when trying to update value of a non-preliminary result', async () => {
    const id = '123';
    const dto: UpdateResultDto = { value: 20 };
    const result: Result = {
      id,
      orderId: '456',
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
      order: null,
    };
    resultRepositoryMock.findById.mockResolvedValue(result);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
    expect(resultRepositoryMock.findById).toHaveBeenCalledWith(id);
  });

  it('should throw BadRequestException when trying to update unit of a non-preliminary result', async () => {
    const id = '123';
    const dto: UpdateResultDto = { unit: 'g' };
    const result: Result = {
      id,
      orderId: '456',
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
      order: null,
    };
    resultRepositoryMock.findById.mockResolvedValue(result);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
    expect(resultRepositoryMock.findById).toHaveBeenCalledWith(id);
  });

  it('should throw BadRequestException when trying to update referenceMin of a final result', async () => {
    const id = '123';
    const dto: UpdateResultDto = { referenceMin: 5 };
    const result: Result = {
      id,
      orderId: '456',
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
      order: null,
    };
    resultRepositoryMock.findById.mockResolvedValue(result);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
    expect(resultRepositoryMock.findById).toHaveBeenCalledWith(id);
  });

  it('should throw BadRequestException when trying to update referenceMax of a final result', async () => {
    const id = '123';
    const dto: UpdateResultDto = { referenceMax: 15 };
    const result: Result = {
      id,
      orderId: '456',
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
      order: null,
    };
    resultRepositoryMock.findById.mockResolvedValue(result);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
    expect(resultRepositoryMock.findById).toHaveBeenCalledWith(id);
  });

  it('should throw BadRequestException when referenceMin is greater than or equal to referenceMax', async () => {
    const id = '123';
    const dto: UpdateResultDto = { referenceMin: 10, referenceMax: 10 };
    const result: Result = {
      id,
      orderId: '456',
      value: 10,
      unit: 'mg',
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
    resultRepositoryMock.findById.mockResolvedValue(result);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
    expect(resultRepositoryMock.findById).toHaveBeenCalledWith(id);
  });

  it('should update result and save it when all conditions are met', async () => {
    const id = '123';
    const dto: UpdateResultDto = { value: 20, unit: 'g', notes: 'Updated' };
    const result: Result = {
      id,
      orderId: '456',
      value: 10,
      unit: 'mg',
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
    resultRepositoryMock.findById.mockResolvedValue(result);
    resultRepositoryMock.save.mockResolvedValue(result);

    const updatedResult = await service.updateResult(id, dto);
    expect(updatedResult).toEqual(result);
    expect(resultRepositoryMock.findById).toHaveBeenCalledWith(id);
    expect(resultRepositoryMock.save).toHaveBeenCalledWith(result);
  });
});
});

  // TESTS_APPEND_HERE
});
