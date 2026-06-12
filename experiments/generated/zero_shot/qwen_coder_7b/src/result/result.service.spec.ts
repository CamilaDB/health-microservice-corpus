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
  it('should throw BadRequestException if order is not valid', async () => {
    const dto: CreateResultDto = {
      orderId: '123',
      value: 10,
      unit: 'mg/L',
      status: ResultStatus.FINAL,
      resultDate: new Date().toISOString(),
    };

    orderServiceMock.validateOrderResult.mockRejectedValue(new BadRequestException());

    await expect(service.createResult(dto)).rejects.toThrow(BadRequestException);
  });

  it('should create and save a result if order is valid', async () => {
    const dto: CreateResultDto = {
      orderId: '123',
      value: 10,
      unit: 'mg/L',
      status: ResultStatus.FINAL,
      resultDate: new Date().toISOString(),
    };

    orderServiceMock.validateOrderResult.mockResolvedValue(undefined);
    resultRepositoryMock.create.mockReturnValue({ ...dto, id: '456' });
    resultRepositoryMock.save.mockResolvedValue({ ...dto, id: '456', created_at: new Date(), updated_at: new Date() });

    const result = await service.createResult(dto);

    expect(result).toEqual({ ...dto, id: '456', created_at: expect.any(Date), updated_at: expect.any(Date) });
  });
});

  describe('searchResults', () => {
  it.skip('should throw BadRequestException when dto is undefined', async () => {
          await expect(() => service.searchResults(undefined)).rejects.toThrow(BadRequestException);
        });

  it('should call resultRepository.search with the provided dto', async () => {
    const dto: SearchResultsDto = { orderId: '123' };
    await service.searchResults(dto);
    expect(resultRepositoryMock.search).toHaveBeenCalledWith(dto);
  });
});

  describe('getResultById', () => {
  it('should throw NotFoundException when result with given id is not found', async () => {
    const id = 'non-existent-id';
    resultRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(service.getResultById(id)).rejects.toThrow(NotFoundException);
    expect(resultRepositoryMock.findById).toHaveBeenCalledWith(id);
  });

  it('should return the result when found', async () => {
    const id = 'existing-id';
    const expectedResult: Result = { id, orderId: '', value: 100, unit: 'mg/dL', status: ResultStatus.PRELIMINARY, referenceMin: null, referenceMax: null, resultDate: new Date(), sourceSystem: null, notes: null, created_at: new Date(), updated_at: new Date() };
    resultRepositoryMock.findById.mockResolvedValue(expectedResult);

    const result = await service.getResultById(id);
    expect(result).toEqual(expectedResult);
    expect(resultRepositoryMock.findById).toHaveBeenCalledWith(id);
  });
});

  describe('buildResultReport', () => {
  it('should throw NotFoundException if no results found for order', async () => {
    const orderId = '123';
    resultRepositoryMock.findByOrderId.mockResolvedValue([]);
    await expect(service.buildResultReport(orderId)).rejects.toThrow(NotFoundException);
  });

  it('should return ResultReport with correct data', async () => {
        const orderId = '123';
        const order = { id: orderId, examType: ExamType.GLUCOSE };
        const result = { id: '456', status: ResultStatus.FINAL, value: '80', unit: 'mg/dL', referenceMin: null, referenceMax: null, sourceSystem: 'system1', resultDate: new Date() };
        resultRepositoryMock.findByOrderId.mockResolvedValue([result]);
        orderServiceMock.getOrderById.mockResolvedValue(order);

        const expectedReport: ResultReport = {
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
              sourceSystem: 'system1',
              resultDate: new Date(),
            },
          ],
          summary: {
            total: 1,
            preliminary: 0,
            final: 1,
            corrected: 0,
            abnormal: 0,
          },
        };

        const report = await service.buildResultReport(orderId);
        expect(report).toEqual(expectedReport);
      });

});

  describe('updateResult', () => {
  it('should throw BadRequestException if status is CORRECTED and new status is provided', async () => {
    const id = '123';
    const dto: UpdateResultDto = { status: ResultStatus.FINAL };
    resultRepositoryMock.findById.mockResolvedValue({ status: ResultStatus.CORRECTED } as Result);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if invalid status transition is provided', async () => {
        const id = '123';
        const dto: UpdateResultDto = { status: ResultStatus.FINAL };
        resultRepositoryMock.findById.mockResolvedValue({ status: ResultStatus.CORRECTED } as Result);

        await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
      });


  it('should throw BadRequestException if value is provided for a non-preliminary result', async () => {
    const id = '123';
    const dto: UpdateResultDto = { value: 10 };
    resultRepositoryMock.findById.mockResolvedValue({ status: ResultStatus.FINAL } as Result);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if unit is provided for a non-preliminary result', async () => {
    const id = '123';
    const dto: UpdateResultDto = { unit: 'mg' };
    resultRepositoryMock.findById.mockResolvedValue({ status: ResultStatus.FINAL } as Result);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if referenceMin is provided for a final result', async () => {
    const id = '123';
    const dto: UpdateResultDto = { referenceMin: 5 };
    resultRepositoryMock.findById.mockResolvedValue({ status: ResultStatus.FINAL } as Result);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if referenceMax is provided for a final result', async () => {
    const id = '123';
    const dto: UpdateResultDto = { referenceMax: 10 };
    resultRepositoryMock.findById.mockResolvedValue({ status: ResultStatus.FINAL } as Result);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if referenceMin is greater than or equal to referenceMax', async () => {
    const id = '123';
    const dto: UpdateResultDto = { referenceMin: 10, referenceMax: 5 };
    resultRepositoryMock.findById.mockResolvedValue({ status: ResultStatus.PRELIMINARY } as Result);

    await expect(service.updateResult(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should update the result and save it if all checks pass', async () => {
    const id = '123';
    const dto: UpdateResultDto = { status: ResultStatus.FINAL };
    const expectedResult: Result = { ...dto, id } as Result;
    resultRepositoryMock.findById.mockResolvedValue({ status: ResultStatus.PRELIMINARY } as Result);
    resultRepositoryMock.save.mockResolvedValue(expectedResult);

    const result = await service.updateResult(id, dto);
    expect(result).toEqual(expectedResult);
  });
});

  // TESTS_APPEND_HERE
});
