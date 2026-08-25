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
  it.skip('should create a new result and save it to the repository', async () => {
          const dto: CreateResultDto = {
            orderId: '123',
            value: 10,
            unit: 'mm',
            status: ResultStatus.PRELIMINARY,
            referenceMin: null,
            referenceMax: null,
            resultDate: new Date(),
            sourceSystem: 'systemA',
            notes: 'Sample note',
          };

          const order = {
            id: '456',
            examType: ExamType.BIOCHEMISTRY,
          };

          jest.spyOn(orderServiceMock, 'getOrderById').mockResolvedValue(order);
          jest.spyOn(resultRepositoryMock, 'create').mockResolvedValue({ id: '789' });
          jest.spyOn(resultRepositoryMock, 'save').mockResolvedValue(undefined);

          await expect(service.createResult(dto)).resolves.toBeUndefined();

          expect(orderServiceMock.getOrderById).toHaveBeenCalledWith('123');
          expect(resultRepositoryMock.create).toHaveBeenCalledWith(dto);
          expect(resultRepositoryMock.save).toHaveBeenCalledWith({ id: '789' });
        });


  it.skip('should throw a BadRequestException if the order does not exist', async () => {
          const dto: CreateResultDto = {
            orderId: '123',
            value: 10,
            unit: 'mm',
            status: ResultStatus.PRELIMINARY,
            referenceMin: null,
            referenceMax: null,
            resultDate: new Date(),
            sourceSystem: 'systemA',
            notes: 'Sample note',
          };

          jest.spyOn(orderServiceMock, 'getOrderById').mockResolvedValueOnce(null);

          await expect(service.createResult(dto)).rejects.toThrow(BadRequestException);
        });



  it.skip('should throw a BadRequestException if the order type is not supported', async () => {
          const dto: CreateResultDto = {
            orderId: '123',
            value: 10,
            unit: 'mm',
            status: ResultStatus.PRELIMINARY,
            referenceMin: null,
            referenceMax: null,
            resultDate: new Date(),
            sourceSystem: 'systemA',
            notes: 'Sample note',
          };

          const order = {
            id: '456',
            examType: ExamType.HISTOLOGY,
          };

          jest.spyOn(orderServiceMock, 'getOrderById').mockResolvedValueOnce(order);
          jest.spyOn(resultServiceMock, 'validateOrderResult').mockRejectedValueOnce(new BadRequestException('Order type is not supported'));

          await expect(service.createResult(dto)).rejects.toThrow(BadRequestException);
        });


  it.skip('should throw a BadRequestException if the order status is not supported', async () => {
        const dto: CreateResultDto = {
          orderId: '123',
          value: 10,
          unit: 'mm',
          status: ResultStatus.IN_PROGRESS,
          referenceMin: null,
          referenceMax: null,
          resultDate: new Date(),
          sourceSystem: 'systemA',
          notes: 'Sample note',
        };

        const order = {
          id: '456',
          examType: ExamType.BIOCHEMISTRY,
        };

        jest.spyOn(orderServiceMock, 'getOrderById').mockResolvedValue(order);

        await expect(service.createResult(dto)).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw a BadRequestException if the result date is not provided', async () => {
        const dto: CreateResultDto = {
          orderId: '123',
          value: 10,
          unit: 'mm',
          status: ResultStatus.PRELIMINARY,
          referenceMin: null,
          referenceMax: null,
          sourceSystem: 'systemA',
          notes: 'Sample note',
        };

        const order = {
          id: '456',
          examType: ExamType.BIOCHEMISTRY,
        };

        jest.spyOn(orderServiceMock, 'getOrderById').mockResolvedValue(order);

        await expect(service.createResult(dto)).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw a BadRequestException if the result value is not provided', async () => {
        const dto: CreateResultDto = {
          orderId: '123',
          unit: 'mm',
          status: ResultStatus.PRELIMINARY,
          referenceMin: null,
          referenceMax: null,
          resultDate: new Date(),
          sourceSystem: 'systemA',
          notes: 'Sample note',
        };

        const order = {
          id: '456',
          examType: ExamType.BIOCHEMISTRY,
        };

        jest.spyOn(orderServiceMock, 'getOrderById').mockResolvedValue(order);

        await expect(service.createResult(dto)).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw a BadRequestException if the result unit is not provided', async () => {
        const dto: CreateResultDto = {
          orderId: '123',
          value: 10,
          status: ResultStatus.PRELIMINARY,
          referenceMin: null,
          referenceMax: null,
          resultDate: new Date(),
          sourceSystem: 'systemA',
          notes: 'Sample note',
        };

        const order = {
          id: '456',
          examType: ExamType.BIOCHEMISTRY,
        };

        jest.spyOn(orderServiceMock, 'getOrderById').mockResolvedValue(order);

        await expect(service.createResult(dto)).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw a BadRequestException if the result status is not provided', async () => {
        const dto: CreateResultDto = {
          orderId: '123',
          value: 10,
          unit: 'mm',
          referenceMin: null,
          referenceMax: null,
          resultDate: new Date(),
          sourceSystem: 'systemA',
          notes: 'Sample note',
        };

        const order = {
          id: '456',
          examType: ExamType.BIOCHEMISTRY,
        };

        jest.spyOn(orderServiceMock, 'getOrderById').mockResolvedValue(order);

        await expect(service.createResult(dto)).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw a BadRequestException if the result source system is not provided', async () => {
        const dto: CreateResultDto = {
          orderId: '123',
          value: 10,
          unit: 'mm',
          status: ResultStatus.PRELIMINARY,
          referenceMin: null,
          referenceMax: null,
          resultDate: new Date(),
          notes: 'Sample note',
        };

        const order = {
          id: '456',
          examType: ExamType.BIOCHEMISTRY,
        };

        jest.spyOn(orderServiceMock, 'getOrderById').mockResolvedValue(order);

        await expect(service.createResult(dto)).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw a BadRequestException if the result notes are not provided', async () => {
        const dto: CreateResultDto = {
          orderId: '123',
          value: 10,
          unit: 'mm',
          status: ResultStatus.PRELIMINARY,
          referenceMin: null,
          referenceMax: null,
          resultDate: new Date(),
          sourceSystem: 'systemA',
        };

        const order = {
          id: '456',
          examType: ExamType.BIOCHEMISTRY,
        };

        jest.spyOn(orderServiceMock, 'getOrderById').mockResolvedValue(order);

        await expect(service.createResult(dto)).rejects.toThrow(BadRequestException);
      });
});
});

  describe('FN_searchResults_END', () => {
describe('searchResults', () => {
  it('should return an empty array when no results are found', async () => {
    const result = await service.searchResults({ orderId: '123' });
    expect(result).toEqual([]);
  });

  it('should throw a NotFoundException if the order is not found', async () => {
    resultRepositoryMock.findByOrderId.mockResolvedValue(undefined);
    expect(service.searchResults({ orderId: '123' })).rejects.toThrow(NotFoundException);
  });

  it('should return results for a given order ID', async () => {
    const mockResult = { id: '456', orderId: '123', value: 10.5, unit: 'mg/dL', status: ResultStatus.PRELIMINARY };
    resultRepositoryMock.findByOrderId.mockResolvedValue([mockResult]);
    const result = await service.searchResults({ orderId: '123' });
    expect(result).toEqual([{ ...mockResult }]);
  });

  it('should return results based on search criteria', async () => {
    const mockResult1 = { id: '456', orderId: '123', value: 10.5, unit: 'mg/dL', status: ResultStatus.PRELIMINARY };
    const mockResult2 = { id: '789', orderId: '123', value: 11.0, unit: 'mg/dL', status: ResultStatus.FINAL };
    resultRepositoryMock.search.mockResolvedValue([mockResult1, mockResult2]);
    const result = await service.searchResults({ orderId: '123', status: ResultStatus.PRELIMINARY });
    expect(result).toEqual([{ ...mockResult1 }]);
  });

  it('should handle invalid search criteria gracefully', async () => {
    expect(service.searchResults({ orderId: '123', examType: 'invalid' })).rejects.toThrow(BadRequestException);
  });
});
});

  describe('FN_getResultById_END', () => {
describe('getResultById', () => {
  it('should return a Result if the result exists', async () => {
    const expectedResult: Result = { id: '123', orderId: '456', value: 789, unit: 'mg/dL', status: ResultStatus.PRELIMINARY, referenceMin: null, referenceMax: null, resultDate: new Date(), sourceSystem: null, notes: null, created_at: new Date(), updated_at: new Date(), order: { id: '456' } };
    resultRepositoryMock.findById.mockResolvedValue(expectedResult);

    const result = await service.getResultById('123');

    expect(result).toEqual(expectedResult);
  });

  it('should throw a NotFoundException if the result does not exist', async () => {
      resultRepositoryMock.findById.mockResolvedValueOnce(undefined);

      try {
        await service.getResultById('123');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('Result with id 123 not found');
      }
    });

});
});

  describe('FN_buildResultReport_END', () => {
describe('buildResultReport', () => {
  it('should throw NotFoundException if orderId is not found in resultRepository', async () => {
    const orderId = '12345';
    jest.spyOn(resultRepositoryMock, 'findByOrderId').mockResolvedValue(undefined);

    expect(() => service.buildResultReport(orderId)).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if order does not exist', async () => {
    const orderId = '12345';
    jest.spyOn(resultRepositoryMock, 'findByOrderId').mockResolvedValue(undefined);
    jest.spyOn(orderServiceMock, 'getOrderById').mockResolvedValue(null);

    expect(() => service.buildResultReport(orderId)).rejects.toThrow(BadRequestException);
  });

  it('should return a ResultReport with correct data', async () => {
    const orderId = '12345';
    const examType = ExamType.HEMOGRAM;
    const resultData: CreateResultDto[] = [
      { resultId: '67890', examType, value: 12.3, unit: 'mg/dL', status: ResultStatus.PRELIMINARY },
      { resultId: '54321', examType, value: 8.9, unit: 'mmol/L', status: ResultStatus.FINAL },
    ];

    const orderData = {
      id: orderId,
      patientId: 'patient-1',
      doctorId: 'doctor-1',
      results: resultData.map(result => ({ ...result, examType })),
    };

    jest.spyOn(orderServiceMock, 'getOrderById').mockResolvedValue(orderData);
    jest.spyOn(resultRepositoryMock, 'findByOrderId').mockResolvedValue(resultData);

    const expectedResultReport: ResultReport = {
      orderId,
      examType,
      items: resultData.map(item => ({
        ...item,
        referenceMin: null,
        referenceMax: null,
        flag: 'UNKNOWN',
        sourceSystem: null,
        resultDate: new Date(),
      })),
      summary: { total: 2, preliminary: 1, final: 1, corrected: 0, abnormal: 0 },
    };

    expect(await service.buildResultReport(orderId)).toEqual(expectedResultReport);
  });
});
});

  describe('FN_updateResult_END', () => {
describe('updateResult', () => {
  it('should throw NotFoundException when result is not found', async () => {
    const dto: UpdateResultDto = { status: ResultStatus.FINAL };
    jest.spyOn(resultRepositoryMock, 'findById').mockResolvedValue(undefined);

    await expect(service.updateResult('nonExistentId', dto)).rejects.toThrow(NotFoundException);
  });

  it.skip('should throw BadRequestException when invalid update data is provided', async () => {
        const result: Result = { id: 'validId', value: 10, unit: 'cm' };
        jest.spyOn(resultRepositoryMock, 'findById').mockResolvedValue(result);

        await expect(service.updateResult('validId', {} as UpdateResultDto)).rejects.toThrow(BadRequestException);
      });

  it.skip('should update result and return updated result', async () => {
        const dto: UpdateResultDto = { status: ResultStatus.FINAL, value: 15 };
        const result: Result = { id: 'validId', value: 10, unit: 'cm' };
        jest.spyOn(resultRepositoryMock, 'findById').mockResolvedValue(result);
        jest.spyOn(resultRepositoryMock, 'save').mockResolvedValue({ ...result, status: dto.status, value: dto.value });

        const updatedResult = await service.updateResult('validId', dto);

        expect(updatedResult).toEqual({ ...result, status: dto.status, value: dto.value });
      });
});
});

  // TESTS_APPEND_HERE
});
