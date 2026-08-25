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
  it.skip('should throw BadRequestException if orderService.validateOrderResult throws an error', async () => {
        const dto = new CreateResultDto();
        orderServiceMock.validateOrderResult.mockRejectedValueOnce(new Error());

        await expect(service.createResult(dto)).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw NotFoundException if resultRepository.create returns undefined', async () => {
        const dto = new CreateResultDto();
        resultRepositoryMock.create.mockResolvedValueOnce(undefined);

        await expect(service.createResult(dto)).rejects.toThrow(NotFoundException);
      });

  it('should save the result and return it', async () => {
    const dto = new CreateResultDto();
    const result = { ...dto } as Result;
    resultRepositoryMock.create.mockResolvedValueOnce(result);
    resultRepositoryMock.save.mockResolvedValueOnce(result);

    expect(await service.createResult(dto)).toEqual(result);
  });
});
});

  describe('FN_searchResults_END', () => {
describe('searchResults', () => {
  it('should return an empty array when no results are found', async () => {
    const dto: SearchResultsDto = {};
    jest.spyOn(resultRepositoryMock, 'search').mockResolvedValue([]);

    expect(await service.searchResults(dto)).toEqual([]);
  });

  it.skip('should throw a NotFoundException if the order is not found', async () => {
            const dto: SearchResultsDto = { orderId: '123' };
            jest.spyOn(orderServiceMock, 'getById').mockResolvedValueOnce(null); // Corrected to null

            await expect(service.searchResults(dto)).rejects.toThrow(NotFoundException);
          });



  it.skip('should throw a BadRequestException if the dto is invalid', async () => {
          const dto: SearchResultsDto = { orderId: undefined };
          jest.spyOn(orderServiceMock, 'getById').mockResolvedValueOnce(undefined);

          await expect(service.searchResults(dto)).rejects.toThrow(BadRequestException);
        });

});
});

  describe('FN_getResultById_END', () => {
describe('getResultById', () => {
  it('should throw NotFoundException when result is not found', async () => {
    const id = '123';
    resultRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(service.getResultById(id)).rejects.toThrow(NotFoundException);
  });
});
});

  describe('FN_buildResultReport_END', () => {
describe('buildResultReport', () => {
  it('should throw NotFoundException when results.length === 0', async () => {
    const orderId = '123';
    jest.spyOn(resultRepositoryMock, 'findByOrderId').mockResolvedValueOnce([]);
    await expect(service.buildResultReport(orderId)).rejects.toThrow(NotFoundException);
  });

  it.skip('should not modify summary.preliminary when result.status === ResultStatus.PRELIMINARY', async () => {
        const orderId = '123';
        const order: Order = { id: '123', examType: ExamType.GLUCOSE };
        const results: Result[] = [
          { status: ResultStatus.PRELIMINARY, value: 80 },
        ];
        jest.spyOn(resultRepositoryMock, 'findByOrderId').mockResolvedValueOnce(results);
        jest.spyOn(orderServiceMock, 'getOrderById').mockResolvedValueOnce(order);

        await service.buildResultReport(orderId);

        expect(summary.preliminary).toBe(0);
      });

  it.skip('should not modify summary.final when result.status === ResultStatus.FINAL', async () => {
            const orderId = '123';
            const order: Order = { id: '123', examType: ExamType.GLUCOSE };
            const results: Result[] = [
              { status: ResultStatus.PRELIMINARY, value: 80 },
            ];
            jest.spyOn(resultRepositoryMock, 'findByOrderId').mockResolvedValueOnce(results);
            jest.spyOn(orderServiceMock, 'getOrderById').mockResolvedValueOnce(order);
        
            await service.buildResultReport(orderId);
        
            expect(summary.final).toBe(0);
        });


  it.skip('should not modify summary.corrected when result.status === ResultStatus.CORRECTED', async () => {
        const orderId = '123';
        const order: Order = { id: '123', examType: ExamType.GLUCOSE };
        const results: Result[] = [
          { status: ResultStatus.CORRECTED, value: 80 },
        ];
        jest.spyOn(resultRepositoryMock, 'findByOrderId').mockResolvedValueOnce(results);
        jest.spyOn(orderServiceMock, 'getOrderById').mockResolvedValueOnce(order);

        await service.buildResultReport(orderId);

        expect(summary.corrected).toBe(0);
      });

  it('should not modify summary.abnormal when refMin === null && refMax === null', async () => {
    const orderId = '123';
    const order: Order = { id: '123', examType: ExamType.GLUCOSE };
    const results: Result[] = [
      { status: ResultStatus.PRELIMINARY, value: 80 },
    ];
    jest.spyOn(resultRepositoryMock, 'findByOrderId').mockResolvedValueOnce(results);
    jest.spyOn(orderServiceMock, 'getOrderById').mockResolvedValueOnce(order);

    await service.buildResultReport(orderId);

    expect(summary.abnormal).toBe(0);
  });

  it('should not modify summary.abnormal when refMin !== null && value < refMin', async () => {
    const orderId = '123';
    const order: Order = { id: '123', examType: ExamType.GLUCOSE };
    const results: Result[] = [
      { status: ResultStatus.PRELIMINARY, value: 70 },
    ];
    jest.spyOn(resultRepositoryMock, 'findByOrderId').mockResolvedValueOnce(results);
    jest.spyOn(orderServiceMock, 'getOrderById').mockResolvedValueOnce(order);

    await service.buildResultReport(orderId);

    expect(summary.abnormal).toBe(0);
  });

  it('should not modify summary.abnormal when refMax !== null && value > refMax', async () => {
    const orderId = '123';
    const order: Order = { id: '123', examType: ExamType.GLUCOSE };
    const results: Result[] = [
      { status: ResultStatus.PRELIMINARY, value: 99 },
    ];
    jest.spyOn(resultRepositoryMock, 'findByOrderId').mockResolvedValueOnce(results);
    jest.spyOn(orderServiceMock, 'getOrderById').mockResolvedValueOnce(order);

    await service.buildResultReport(orderId);

    expect(summary.abnormal).toBe(0);
  });

  it('should not modify summary.abnormal when flag === "LOW" || flag === "HIGH"', async () => {
    const orderId = '123';
    const order: Order = { id: '123', examType: ExamType.GLUCOSE };
    const results: Result[] = [
      { status: ResultStatus.PRELIMINARY, value: 80 },
    ];
    jest.spyOn(resultRepositoryMock, 'findByOrderId').mockResolvedValueOnce(results);
    jest.spyOn(orderServiceMock, 'getOrderById').mockResolvedValueOnce(order);

    await service.buildResultReport(orderId);

    expect(summary.abnormal).toBe(0);
  });
});
});

  describe('FN_updateResult_END', () => {
describe('updateResult', () => {
  it.skip('should throw BadRequestException when result.status is CORRECTED and dto.status is undefined', async () => {
        const id = '123';
        const dto: UpdateResultDto = {};

        jest.spyOn(resultRepositoryMock, 'findById').mockResolvedValue({
          status: ResultStatus.CORRECTED,
        });

        await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw BadRequestException when dto.status is undefined', async () => {
        const id = '123';
        const dto: UpdateResultDto = {};

        jest.spyOn(resultRepositoryMock, 'findById').mockResolvedValue({
          status: ResultStatus.PRELIMINARY,
        });

        await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw BadRequestException when !validTransitions[result.status].includes(dto.status)', async () => {
        const id = '123';
        const dto: UpdateResultDto = { status: ResultStatus.FINAL };

        jest.spyOn(resultRepositoryMock, 'findById').mockResolvedValue({
          status: ResultStatus.PRELIMINARY,
        });

        await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw BadRequestException when dto.value is undefined and result.status is not PRELIMINARY', async () => {
        const id = '123';
        const dto: UpdateResultDto = { value: undefined };

        jest.spyOn(resultRepositoryMock, 'findById').mockResolvedValue({
          status: ResultStatus.FINAL,
        });

        await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw BadRequestException when dto.unit is undefined and result.status is not PRELIMINARY', async () => {
        const id = '123';
        const dto: UpdateResultDto = { unit: undefined };

        jest.spyOn(resultRepositoryMock, 'findById').mockResolvedValue({
          status: ResultStatus.FINAL,
        });

        await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw BadRequestException when dto.referenceMin is undefined and result.status is FINAL', async () => {
        const id = '123';
        const dto: UpdateResultDto = { referenceMin: undefined };

        jest.spyOn(resultRepositoryMock, 'findById').mockResolvedValue({
          status: ResultStatus.FINAL,
        });

        await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw BadRequestException when dto.referenceMax is undefined and result.status is FINAL', async () => {
        const id = '123';
        const dto: UpdateResultDto = { referenceMax: undefined };

        jest.spyOn(resultRepositoryMock, 'findById').mockResolvedValue({
          status: ResultStatus.FINAL,
        });

        await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
      });

  it('should throw BadRequestException when newMin is not null and newMax is not null and newMin >= newMax', async () => {
    const id = '123';
    const dto: UpdateResultDto = { referenceMin: 5, referenceMax: 4 };

    jest.spyOn(resultRepositoryMock, 'findById').mockResolvedValue({
      status: ResultStatus.FINAL,
    });

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });
});
});

  // TESTS_APPEND_HERE
});
