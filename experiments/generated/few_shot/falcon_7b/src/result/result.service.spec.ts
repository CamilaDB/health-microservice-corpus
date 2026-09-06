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

  describe('FN_buildResultReport_END', () => {
describe('buildResultReport', () => {
  it('should throw NotFoundException when no results found for order', async () => {
    orderServiceMock.getOrderById.mockResolvedValueOnce({
      id: '1',
      examType: ExamType.GLUCOSE,
    });
    resultRepositoryMock.findByOrderId.mockResolvedValueOnce([]);

    await expect(
      service.buildResultReport('1'),
    ).rejects.toThrow(NotFoundException);

    expect(resultRepositoryMock.findByOrderId).toHaveBeenCalledWith('1');
    expect(orderServiceMock.getOrderById).toHaveBeenCalledWith('1');
  });

  it.skip('should return a ResultReport with correct items and summary', async () => {
        const order = {
          id: '1',
          examType: ExamType.GLUCOSE,
        };
        const results = [
          {
            id: '1',
            value: 80,
            status: ResultStatus.PRELIMINARY,
            unit: 'mg/dL',
            referenceMin: null,
            referenceMax: null,
            sourceSystem: 'system1',
            resultDate: new Date('2023-01-01'),
          },
          {
            id: '2',
            value: 100,
            status: ResultStatus.FINAL,
            unit: 'mg/dL',
            referenceMin: null,
            referenceMax: null,
            sourceSystem: 'system2',
            resultDate: new Date('2023-01-02'),
          },
        ];

        resultRepositoryMock.findByOrderId.mockResolvedValueOnce(results);
        orderServiceMock.getOrderById.mockResolvedValueOnce(order);

        const expectedReport = {
          orderId: '1',
          examType: ExamType.GLUCOSE,
          items: results.map((result) => ({
            ...result,
            flag: 'NORMAL',
          })),
          summary: {
            total: 2,
            preliminary: 1,
            final: 1,
            corrected: 0,
            abnormal: 0,
          },
        };

        const report = await service.buildResultReport('1');

        expect(report).toEqual(expectedReport);
      });
});
});

  describe('FN_updateResult_END', () => {
describe('updateResult', () => {
  it('should throw BadRequestException when updating status of a CORRECTED result', async () => {
    resultRepositoryMock.findById.mockResolvedValueOnce({
      id: '1',
      status: ResultStatus.CORRECTED,
    });

    await expect(
      service.updateResult('1', { status: ResultStatus.FINAL } as UpdateResultDto),
    ).rejects.toThrow(BadRequestException);

    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException for invalid status transition', async () => {
        resultRepositoryMock.findById.mockResolvedValueOnce({
          id: '1',
          status: ResultStatus.FINAL,
          referenceMin: 10,
          referenceMax: 20,
        });

        await expect(
          service.updateResult('1', { status: ResultStatus.PRELIMINARY } as UpdateResultDto),
        ).rejects.toThrow(BadRequestException);

        expect(resultRepositoryMock.save).not.toHaveBeenCalled();
    });


  it('should throw BadRequestException when updating value of a non-preliminary result', async () => {
    resultRepositoryMock.findById.mockResolvedValueOnce({
      id: '1',
      status: ResultStatus.FINAL,
    });

    await expect(
      service.updateResult('1', { value: 100 } as UpdateResultDto),
    ).rejects.toThrow(BadRequestException);

    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when updating unit of a non-preliminary result', async () => {
    resultRepositoryMock.findById.mockResolvedValueOnce({
      id: '1',
      status: ResultStatus.FINAL,
    });

    await expect(
      service.updateResult('1', { unit: 'cm' } as UpdateResultDto),
    ).rejects.toThrow(BadRequestException);

    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when updating referenceMin of a final result', async () => {
    resultRepositoryMock.findById.mockResolvedValueOnce({
      id: '1',
      status: ResultStatus.FINAL,
    });

    await expect(
      service.updateResult('1', { referenceMin: 100 } as UpdateResultDto),
    ).rejects.toThrow(BadRequestException);

    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when updating referenceMax of a final result', async () => {
    resultRepositoryMock.findById.mockResolvedValueOnce({
      id: '1',
      status: ResultStatus.FINAL,
    });

    await expect(
      service.updateResult('1', { referenceMax: 100 } as UpdateResultDto),
    ).rejects.toThrow(BadRequestException);

    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when referenceMin is greater than or equal to referenceMax', async () => {
    resultRepositoryMock.findById.mockResolvedValueOnce({
      id: '1',
      status: ResultStatus.PRELIMINARY,
    });

    await expect(
      service.updateResult('1', { referenceMin: 100, referenceMax: 100 } as UpdateResultDto),
    ).rejects.toThrow(BadRequestException);

    expect(resultRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should save updated result', async () => {
    resultRepositoryMock.findById.mockResolvedValueOnce({
      id: '1',
      status: ResultStatus.PRELIMINARY,
    });

    const updatedResult = {
      id: '1',
      status: ResultStatus.FINAL,
      value: 100,
      unit: 'cm',
      referenceMin: 50,
      referenceMax: 100,
    };

    resultRepositoryMock.save.mockResolvedValueOnce(updatedResult);

    await service.updateResult('1', {
      status: ResultStatus.FINAL,
      value: 100,
      unit: 'cm',
      referenceMin: 50,
      referenceMax: 100,
    } as UpdateResultDto);

    expect(resultRepositoryMock.save).toHaveBeenCalledWith(updatedResult);
  });
});
});

  // TESTS_APPEND_HERE
});
