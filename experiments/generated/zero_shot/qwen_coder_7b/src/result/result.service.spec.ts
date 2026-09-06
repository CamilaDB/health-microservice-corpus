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
        unit: 'mg/L',
        status: ResultStatus.PRELIMINARY,
        resultDate: '2023-04-01T12:00:00Z',
        sourceSystem: 'systemA',
        notes: 'Initial result',
      };

      const result: Result = {
        id: 'result123',
        orderId: dto.orderId,
        value: dto.value,
        unit: dto.unit,
        status: dto.status,
        referenceMin: null,
        referenceMax: null,
        resultDate: new Date(dto.resultDate),
        sourceSystem: dto.sourceSystem,
        notes: dto.notes,
        created_at: new Date(),
        updated_at: new Date(),
        order: null,
      };

      resultRepositoryMock.create.mockReturnValue(result);
      resultRepositoryMock.save.mockResolvedValue(result);

      const createdResult = await service.createResult(dto);

      expect(createdResult).toEqual(result);
      expect(resultRepositoryMock.create).toHaveBeenCalledWith({
        ...dto,
        resultDate: new Date(dto.resultDate),
        referenceMin: null,
        referenceMax: null,
        sourceSystem: dto.sourceSystem,
        notes: dto.notes,
      });
      expect(resultRepositoryMock.save).toHaveBeenCalledWith(result);
    });


  it('should throw BadRequestException if order validation fails', async () => {
    const dto: CreateResultDto = {
      orderId: 'order123',
      value: 100,
      unit: 'mg/L',
      status: ResultStatus.PRELIMINARY,
      resultDate: '2023-04-01T12:00:00Z',
      sourceSystem: 'systemA',
      notes: 'Initial result',
    };

    orderServiceMock.validateOrderResult.mockRejectedValue(new BadRequestException('Invalid order'));

    await expect(service.createResult(dto)).rejects.toThrow(BadRequestException);
    expect(orderServiceMock.validateOrderResult).toHaveBeenCalledWith(dto.orderId, dto.status);
  });
});
});

  describe('FN_searchResults_END', () => {
describe('searchResults', () => {
  it('should return search results based on the provided DTO', async () => {
    const dto: SearchResultsDto = {
      orderId: '123',
      status: ResultStatus.FINAL,
      examType: ExamType.HEMOGRAM,
      dateFrom: '2023-01-01',
      dateTo: '2023-12-31',
      sourceSystem: 'systemA',
    };

    const expectedResult: Result[] = [
      {
        id: '1',
        orderId: '123',
        value: 10,
        unit: 'g/dL',
        status: ResultStatus.FINAL,
        referenceMin: 4.0,
        referenceMax: 12.0,
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
});
});

  describe('FN_getResultById_END', () => {
describe('getResultById', () => {
  it('should return a result when found', async () => {
    const id = '123';
    const expectedResult: Result = {
      id,
      orderId: '456',
      value: 100,
      unit: 'mg/dL',
      status: ResultStatus.PRELIMINARY,
      referenceMin: 80,
      referenceMax: 120,
      resultDate: new Date(),
      sourceSystem: null,
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

  it.skip('should return ResultReport with correct data', async () => {
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
});
});

  describe('FN_updateResult_END', () => {
describe('updateResult', () => {
  it('should throw BadRequestException if status is CORRECTED and new status is provided', async () => {
    const id = '123';
    const dto: UpdateResultDto = { status: ResultStatus.FINAL };
    const result: Result = {
      id,
      orderId: 'order123',
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

    jest.spyOn(service, 'getResultById').mockResolvedValue(result);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it.skip('should throw BadRequestException if invalid status transition is provided', async () => {
          const id = '123';
          const dto: UpdateResultDto = { status: ResultStatus.CORRECTED };
          const result: Result = {
            id,
            orderId: 'order123',
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

          jest.spyOn(service, 'getResultById').mockResolvedValue(result);

          await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
        });


  it('should throw BadRequestException if value is provided for a non-preliminary result', async () => {
    const id = '123';
    const dto: UpdateResultDto = { value: 20 };
    const result: Result = {
      id,
      orderId: 'order123',
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

    jest.spyOn(service, 'getResultById').mockResolvedValue(result);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if unit is provided for a non-preliminary result', async () => {
    const id = '123';
    const dto: UpdateResultDto = { unit: 'g' };
    const result: Result = {
      id,
      orderId: 'order123',
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

    jest.spyOn(service, 'getResultById').mockResolvedValue(result);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if referenceMin is provided for a final result', async () => {
    const id = '123';
    const dto: UpdateResultDto = { referenceMin: 5 };
    const result: Result = {
      id,
      orderId: 'order123',
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

    jest.spyOn(service, 'getResultById').mockResolvedValue(result);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if referenceMax is provided for a final result', async () => {
    const id = '123';
    const dto: UpdateResultDto = { referenceMax: 15 };
    const result: Result = {
      id,
      orderId: 'order123',
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

    jest.spyOn(service, 'getResultById').mockResolvedValue(result);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if referenceMin is greater than or equal to referenceMax', async () => {
    const id = '123';
    const dto: UpdateResultDto = { referenceMin: 15, referenceMax: 10 };
    const result: Result = {
      id,
      orderId: 'order123',
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

    jest.spyOn(service, 'getResultById').mockResolvedValue(result);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should update result and save it if all conditions are met', async () => {
    const id = '123';
    const dto: UpdateResultDto = { value: 20, unit: 'g', notes: 'updated' };
    const result: Result = {
      id,
      orderId: 'order123',
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

    jest.spyOn(service, 'getResultById').mockResolvedValue(result);
    jest.spyOn(resultRepositoryMock, 'save').mockResolvedValue(result);

    const updatedResult = await service.updateResult(id, dto);

    expect(updatedResult).toEqual(result);
    expect(resultRepositoryMock.save).toHaveBeenCalledWith(result);
  });
});
});

  // TESTS_APPEND_HERE
});
