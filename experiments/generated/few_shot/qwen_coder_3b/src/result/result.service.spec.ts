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
  it.skip('should throw NotFoundException when order does not exist', async () => {
        orderServiceMock.validateOrderResult.mockResolvedValueOnce(null);

        await expect(
          service.createResult({ orderId: '1', status: ResultStatus.PRELIMINARY } as CreateResultDto),
        ).rejects.toThrow(NotFoundException);

        expect(resultRepositoryMock.create).not.toHaveBeenCalled();
        expect(resultRepositoryMock.save).not.toHaveBeenCalled();
      });

  it.skip('should throw BadRequestException when order is inactive', async () => {
        orderServiceMock.validateOrderResult.mockResolvedValueOnce({ id: '1', active: false });

        await expect(
          service.createResult({ orderId: '1', status: ResultStatus.PRELIMINARY } as CreateResultDto),
        ).rejects.toThrow(BadRequestException);

        expect(resultRepositoryMock.create).not.toHaveBeenCalled();
        expect(resultRepositoryMock.save).not.toHaveBeenCalled();
      });

  it.skip('should save and return the created entity', async () => {
        orderServiceMock.validateOrderResult.mockResolvedValueOnce({ id: '1', active: true });

        const createdEntity = { orderId: '1', status: ResultStatus.PRELIMINARY };
        resultRepositoryMock.create.mockReturnValueOnce(createdEntity);
        resultRepositoryMock.save.mockResolvedValueOnce({ id: '1', ...createdEntity });

        await service.createResult({ orderId: '1', status: ResultStatus.PRELIMINARY } as CreateResultDto);

        expect(resultRepositoryMock.create).toHaveBeenCalledWith({ orderId: '1', status: ResultStatus.PRELIMINARY });
        expect(resultRepositoryMock.save).toHaveBeenCalledWith(createdEntity);
      });
});
});

  describe('FN_searchResults_END', () => {
describe('searchResults', () => {
  it('should call resultRepository.search with the provided dto', async () => {
    const dto: SearchResultsDto = { orderId: '1', status: ResultStatus.PRELIMINARY };
    const result = await service.searchResults(dto);

    expect(resultRepositoryMock.search).toHaveBeenCalledWith(dto);
  });
});
});

  describe('FN_getResultById_END', () => {
describe('getResultById', () => {
  it('should throw NotFoundException when result does not exist', async () => {
    resultRepositoryMock.findById.mockResolvedValueOnce(null);

    await expect(service.getResultById('1')).rejects.toThrow(NotFoundException);
  });

  it('should return the result when found', async () => {
    const result = { id: '1', orderId: '2', value: 100, unit: 'mm', status: ResultStatus.PRELIMINARY, referenceMin: null, referenceMax: null, resultDate: new Date(), sourceSystem: null, notes: null, created_at: new Date(), updated_at: new Date(), order: { id: '2', examType: ExamType.PHYSICAL } };
    resultRepositoryMock.findById.mockResolvedValueOnce(result);

    const resultById = await service.getResultById('1');

    expect(resultById).toBe(result);
  });
});
});

  describe('FN_buildResultReport_END', () => {
describe('buildResultReport', () => {
  it.skip('should throw NotFoundException when order does not exist', async () => {
        orderServiceMock.getOrderById.mockResolvedValueOnce(null);

        await expect(
          service.buildResultReport('1'),
        ).rejects.toThrow(NotFoundException);

        expect(resultRepositoryMock.findByOrderId).not.toHaveBeenCalled();
        expect(resultRepositoryMock.search).not.toHaveBeenCalled();
        expect(resultRepositoryMock.save).not.toHaveBeenCalled();
        expect(resultRepositoryMock.create).not.toHaveBeenCalled();
      });

  it('should throw NotFoundException when no results are found for order', async () => {
    orderServiceMock.getOrderById.mockResolvedValueOnce({ id: '1' });
    resultRepositoryMock.findByOrderId.mockResolvedValueOnce([]);

    await expect(
      service.buildResultReport('1'),
    ).rejects.toThrow(NotFoundException);

    expect(resultRepositoryMock.findByOrderId).toHaveBeenCalledWith('1');
    expect(resultRepositoryMock.search).not.toHaveBeenCalled();
    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
    expect(resultRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('should return the result report when order and results are found', async () => {
    const order = { id: '1' };
    const results = [
      { id: '1', status: ResultStatus.PRELIMINARY },
      { id: '2', status: ResultStatus.FINAL },
      { id: '3', status: ResultStatus.CORRECTED },
    ];
    const defaultRanges: Partial<
      Record<ExamType, { min: number; max: number }>
    > = {
      [ExamType.GLUCOSE]: { min: 70, max: 99 },
      [ExamType.CREATININE]: { min: 0.6, max: 1.2 },
      [ExamType.TSH]: { min: 0.4, max: 4.0 },
    };
    const summary = {
      total: 3,
      preliminary: 1,
      final: 1,
      corrected: 1,
      abnormal: 0,
    };
    const items: ResultReportItem[] = results.map((result) => {
      const refMin =
        result.referenceMin !== null
          ? Number(result.referenceMin)
          : (defaultRanges[order.examType]?.min ?? null);
      const refMax =
        result.referenceMax !== null
          ? Number(result.referenceMax)
          : (defaultRanges[order.examType]?.max ?? null);
      const value = Number(result.value);
      let flag: 'LOW' | 'NORMAL' | 'HIGH' | 'UNKNOWN';
      if (refMin === null && refMax === null) {
        flag = 'UNKNOWN';
      } else if (refMin !== null && value < refMin) {
        flag = 'LOW';
      } else if (refMax !== null && value > refMax) {
        flag = 'HIGH';
      } else {
        flag = 'NORMAL';
      }
      if (flag === 'LOW' || flag === 'HIGH') summary.abnormal++;
      return {
        resultId: result.id,
        examType: order.examType,
        value,
        unit: result.unit,
        status: result.status,
        referenceMin: refMin,
        referenceMax: refMax,
        flag,
        sourceSystem: result.sourceSystem,
        resultDate: result.resultDate,
      };
    });
    resultRepositoryMock.findByOrderId.mockResolvedValueOnce(results);
    orderServiceMock.getOrderById.mockResolvedValueOnce(order);

    const resultReport = await service.buildResultReport('1');

    expect(resultReport).toEqual({
      orderId: '1',
      examType: order.examType,
      items,
      summary,
    });

    expect(resultRepositoryMock.findByOrderId).toHaveBeenCalledWith('1');
    expect(resultRepositoryMock.search).not.toHaveBeenCalled();
    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
    expect(resultRepositoryMock.create).not.toHaveBeenCalled();
  });
});
});

  describe('FN_updateResult_END', () => {
describe('updateResult', () => {
  it('should throw BadRequestException when result status is CORRECTED and status is provided', async () => {
    resultRepositoryMock.findById.mockResolvedValueOnce({
      id: '1',
      status: ResultStatus.CORRECTED,
    });

    await expect(
      service.updateResult('1', { status: ResultStatus.FINAL } as UpdateResultDto),
    ).rejects.toThrow(BadRequestException);

    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it.skip('should throw BadRequestException when status transition is invalid', async () => {
          resultRepositoryMock.findById.mockResolvedValueOnce({
            id: '1',
            status: ResultStatus.PRELIMINARY,
          });

          await expect(
            service.updateResult('1', { status: ResultStatus.CORRECTED } as UpdateResultDto),
          ).rejects.toThrow(BadRequestException);

          expect(resultRepositoryMock.save).not.toHaveBeenCalled();
        });


  it('should throw BadRequestException when value is provided for non-preliminary result', async () => {
    resultRepositoryMock.findById.mockResolvedValueOnce({
      id: '1',
      status: ResultStatus.FINAL,
    });

    await expect(
      service.updateResult('1', { value: 10 } as UpdateResultDto),
    ).rejects.toThrow(BadRequestException);

    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when unit is provided for non-preliminary result', async () => {
    resultRepositoryMock.findById.mockResolvedValueOnce({
      id: '1',
      status: ResultStatus.FINAL,
    });

    await expect(
      service.updateResult('1', { unit: 'cm' } as UpdateResultDto),
    ).rejects.toThrow(BadRequestException);

    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when referenceMin is provided for final result', async () => {
    resultRepositoryMock.findById.mockResolvedValueOnce({
      id: '1',
      status: ResultStatus.FINAL,
    });

    await expect(
      service.updateResult('1', { referenceMin: 10 } as UpdateResultDto),
    ).rejects.toThrow(BadRequestException);

    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when referenceMax is provided for final result', async () => {
    resultRepositoryMock.findById.mockResolvedValueOnce({
      id: '1',
      status: ResultStatus.FINAL,
    });

    await expect(
      service.updateResult('1', { referenceMax: 10 } as UpdateResultDto),
    ).rejects.toThrow(BadRequestException);

    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when referenceMin is greater than or equal to referenceMax', async () => {
    resultRepositoryMock.findById.mockResolvedValueOnce({
      id: '1',
      status: ResultStatus.PRELIMINARY,
    });

    await expect(
      service.updateResult('1', { referenceMin: 10, referenceMax: 5 } as UpdateResultDto),
    ).rejects.toThrow(BadRequestException);

    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should update result status and save it', async () => {
    resultRepositoryMock.findById.mockResolvedValueOnce({
      id: '1',
      status: ResultStatus.PRELIMINARY,
    });

    const updateData = { status: ResultStatus.FINAL };
    resultRepositoryMock.save.mockResolvedValueOnce({ id: '1', ...updateData });

    await service.updateResult('1', updateData as UpdateResultDto);

    expect(resultRepositoryMock.save).toHaveBeenCalledWith({ id: '1', ...updateData });
  });

  it.skip('should update result value and save it', async () => {
        resultRepositoryMock.findById.mockResolvedValueOnce({
          id: '1',
          status: ResultStatus.PRELIMINARY,
        });

        const updateData = { value: 10 };
        resultRepositoryMock.save.mockResolvedValueOnce({ id: '1', ...updateData });

        await service.updateResult('1', updateData as UpdateResultDto);

        expect(resultRepositoryMock.save).toHaveBeenCalledWith({ id: '1', ...updateData });
      });

  it.skip('should update result unit and save it', async () => {
        resultRepositoryMock.findById.mockResolvedValueOnce({
          id: '1',
          status: ResultStatus.PRELIMINARY,
        });

        const updateData = { unit: 'cm' };
        resultRepositoryMock.save.mockResolvedValueOnce({ id: '1', ...updateData });

        await service.updateResult('1', updateData as UpdateResultDto);

        expect(resultRepositoryMock.save).toHaveBeenCalledWith({ id: '1', ...updateData });
      });

  it.skip('should update result referenceMin and save it', async () => {
          resultRepositoryMock.findById.mockResolvedValueOnce({
            id: '1',
            status: ResultStatus.PRELIMINARY,
            referenceMin: 10,
          });

          const updateData = { referenceMin: 10 };
          resultRepositoryMock.save.mockResolvedValueOnce({ id: '1', ...updateData });

          await expect(service.updateResult('1', updateData as UpdateResultDto)).resolves.toBeDefined();
        });


  it('should throw BadRequestException when status is CORRECTED', async () => {
      resultRepositoryMock.findById.mockResolvedValueOnce({
        id: '1',
        status: ResultStatus.CORRECTED,
        referenceMin: 50,
      });

      await expect(service.updateResult('1', { status: ResultStatus.FINAL })).rejects.toThrow(BadRequestException);
    });



  it.skip('should update result notes and save it', async () => {
          resultRepositoryMock.findById.mockResolvedValueOnce({
            id: '1',
            status: ResultStatus.PRELIMINARY,
            notes: 'test notes',
          });

          const updateData = { notes: 'updated notes' };
          resultRepositoryMock.save.mockResolvedValueOnce({ id: '1', ...updateData });

          await service.updateResult('1', updateData as UpdateResultDto);

          expect(resultRepositoryMock.save).toHaveBeenCalledWith({ id: '1', ...updateData });
        });

});
});

  // TESTS_APPEND_HERE
});
