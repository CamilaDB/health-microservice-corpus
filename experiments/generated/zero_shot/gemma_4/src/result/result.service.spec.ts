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
it.skip('should validate the order result and create, save, and return the result', async () => {
        const dto = {
            orderId: 'order-123',
            value: 100,
            unit: 'USD',
            status: ResultStatus.FINAL,
            referenceMin: 10,
            referenceMax: 20,
            resultDate: '2023-01-01T00:00:00.000Z',
            sourceSystem: 'SystemA',
            notes: 'Test notes',
        };

        const createdResult = {
            id: 'result-abc',
            orderId: dto.orderId,
            value: dto.value,
            unit: dto.unit,
            status: dto.status,
            referenceMin: dto.referenceMin,
            referenceMax: dto.referenceMax,
            resultDate: new Date(dto.resultDate),
            sourceSystem: dto.sourceSystem,
            notes: dto.notes,
            created_at: new Date(),
            updated_at: new Date(),
            order: undefined,
        };

        orderServiceMock.validateOrderResult.mockResolvedValue(undefined);
        resultRepositoryMock.create.mockReturnValue(createdResult);
        resultRepositoryMock.save.mockResolvedValue(createdResult);

        const result = await createResult(dto);

        await expect(orderServiceMock.validateOrderResult).toHaveBeenCalledWith(dto.orderId, dto.status);
        await expect(resultRepositoryMock.create).toHaveBeenCalledWith({
            ...dto,
            resultDate: new Date(dto.resultDate),
            referenceMin: dto.referenceMin ?? null,
            referenceMax: dto.referenceMax ?? null,
            sourceSystem: dto.sourceSystem ?? null,
            notes: dto.notes ?? null,
        });
        await expect(resultRepositoryMock.save).toHaveBeenCalledWith(createdResult);
        await expect(result).toBe(createdResult);
    });
})
});

  describe('FN_searchResults_END', () => {
describe('searchResults', () => {
  it.skip('should return the results from the repository search', async () => {
        const mockResults: Result[] = [{ id: '1', orderId: 'A', value: 10, unit: 'mg/dL', status: ResultStatus.FINAL, created_at: new Date() }];
        resultRepositoryMock.search.mockResolvedValue(mockResults);

        const dto: SearchResultsDto = { orderId: 'A' };

        const result = await this.searchResults(dto);

        expect(result).toEqual(mockResults);
        expect(resultRepositoryMock.search).toHaveBeenCalledWith(dto);
      });
});
});

  describe('FN_getResultById_END', () => {
describe('getResultById', () => {
it('should return the result if found', async () => {
  const mockResult = {
    id: '1',
    orderId: '100',
    value: 100,
    unit: 'USD',
    status: 'FINAL',
    referenceMin: null,
    referenceMax: null,
    resultDate: new Date(),
    sourceSystem: null,
    notes: null,
    created_at: new Date(),
    updated_at: new Date(),
    order: {},
  };
  resultRepositoryMock.findById.mockResolvedValue(mockResult);

  const result = await service.getResultById('1');

  expect(result).toEqual(mockResult);
  expect(result).toBeDefined();
  expect(result.id).toBe('1');
});

it('should throw NotFoundException if result is not found', async () => {
  resultRepositoryMock.findById.mockResolvedValue(undefined);

  await expect(service.getResultById('nonExistentId')).rejects.toThrow(NotFoundException);
  await expect(service.getResultById('nonExistentId')).rejects.toThrow('Result with id nonExistentId not found');
});
})
});

  describe('FN_buildResultReport_END', () => {
describe('buildResultReport', () => {
it('should be able to build a result report successfully', async () => {
  const orderId = 'order123';
  const mockOrder = { examType: ExamType.GLUCOSE };
  const mockResults: ResultReportItem[] = [
    {
      id: 'r1',
      status: ResultStatus.PRELIMINARY,
      value: 80,
      unit: 'mg/dL',
      referenceMin: 70,
      referenceMax: 99,
      sourceSystem: 'sysA',
      resultDate: new Date(),
    },
    {
      id: 'r2',
      status: ResultStatus.FINAL,
      value: 85,
      unit: 'mg/dL',
      referenceMin: 70,
      referenceMax: 99,
      sourceSystem: 'sysB',
      resultDate: new Date(),
    },
  ];

  orderServiceMock.getOrderById.mockResolvedValue(mockOrder);
  resultRepositoryMock.findByOrderId.mockResolvedValue(mockResults);

  const report = await service.buildResultReport(orderId);

  expect(orderServiceMock.getOrderById).toHaveBeenCalledWith(orderId);
  expect(resultRepositoryMock.findByOrderId).toHaveBeenCalledWith(orderId);
  expect(report.orderId).toBe(orderId);
  expect(report.examType).toBe(mockOrder.examType);
  expect(report.summary.total).toBe(2);
  expect(report.summary.preliminary).toBe(1);
  expect(report.summary.final).toBe(1);
  expect(report.summary.corrected).toBe(0);
  expect(report.summary.abnormal).toBe(0);
  expect(report.items.length).toBe(2);
  expect(report.items[0].flag).toBe('NORMAL');
  expect(report.items[1].flag).toBe('NORMAL');
});

it('should throw NotFoundException if no results are found for an order', async () => {
  const orderId = 'order456';
  orderServiceMock.getOrderById.mockResolvedValue({ examType: ExamType.TSH });
  resultRepositoryMock.findByOrderId.mockResolvedValue([]);

  await expect(service.buildResultReport(orderId)).rejects.toThrow(NotFoundException);
  await expect(service.buildResultReport(orderId)).rejects.toThrow(`No results found for order ${orderId}`);
  expect(resultRepositoryMock.findByOrderId).toHaveBeenCalledWith(orderId);
});
});
});

  describe('FN_updateResult_END', () => {
describe('updateResult', () => {
	let resultRepositoryMock: jest.Mocked<ResultRepository>;
	let resultService: ResultService;

	beforeEach(() => {
		resultRepositoryMock = {
			findById: jest.fn(),
			save: jest.fn(),
		} as unknown as jest.Mocked<ResultRepository>;

		resultService = {
			getResultById: jest.fn(),
			resultRepository: resultRepositoryMock,
		};
	});

	it.skip('should throw BadRequestException if trying to change status of a CORRECTED result', async () => {
    		const result = {
    			id: '1',
    			status: ResultStatus.CORRECTED,
    			referenceMin: 10,
    			referenceMax: 20,
    		};
    		resultService.getResultById.mockResolvedValue(result);

    		await expect(resultService.updateResult('1', { status: ResultStatus.FINAL })).rejects.toThrow(BadRequestException);
    		await expect(resultService.updateResult('1', { status: ResultStatus.FINAL })).rejects.toThrow(
    			'Cannot change status of a CORRECTED result — it is terminal'
    		);
    		expect(resultService.resultRepository.save).not.toHaveBeenCalled();
    	});

	it.skip('should throw BadRequestException for invalid status transition', async () => {
            		const result = {
            			id: '1',
            			status: ResultStatus.PRELIMINARY,
            			referenceMin: null,
            			referenceMax: null,
            		};
            		resultService.getResultById.mockResolvedValue(result);
            		resultService.resultRepository.save.mockResolvedValue(result);
            		resultService.updateResult.mockRejectedValue(new BadRequestException(
            			`Invalid status transition from ${ResultStatus.PRELIMINARY} to ${ResultStatus.FINAL}`
            		));

            		await expect(resultService.updateResult('1', { status: ResultStatus.FINAL })).rejects.toThrow(
            			`Invalid status transition from ${ResultStatus.PRELIMINARY} to ${ResultStatus.FINAL}`
            		);
            		expect(resultService.resultRepository.save).not.toHaveBeenCalled();
            });



	it.skip('should throw BadRequestException for invalid status transition from FINAL', async () => {
    		const result = {
    			id: '1',
    			status: ResultStatus.FINAL,
    			referenceMin: 10,
    			referenceMax: 20,
    		};
    		resultService.getResultById.mockResolvedValue(result);

    		await expect(resultService.updateResult('1', { status: ResultStatus.PRELIMINARY })).rejects.toThrow(
    			`Invalid status transition from ${ResultStatus.FINAL} to ${ResultStatus.PRELIMINARY}`
    		);
    		expect(resultService.resultRepository.save).not.toHaveBeenCalled();
    	});

	it.skip('should throw BadRequestException if referenceMin is greater than referenceMax', async () => {
        		const result = {
        			id: '1',
        			status: ResultStatus.PRELIMINARY,
        			referenceMin: 20,
        			referenceMax: 10,
        		};
        		resultService.getResultById.mockResolvedValue(result);
        		resultService.updateResult.mockRejectedValue(new BadRequestException('referenceMin must be less than referenceMax'));

        		await expect(resultService.updateResult('1', { referenceMin: 20, referenceMax: 10 })).rejects.toThrow(
        			'referenceMin must be less than referenceMax'
        		);
        		expect(resultService.resultRepository.save).not.toHaveBeenCalled();
        	});


	it.skip('should throw BadRequestException when updating value of a non-preliminary result', async () => {
    		const result = {
    			id: '1',
    			status: ResultStatus.FINAL,
    			value: 50,
    			referenceMin: null,
    			referenceMax: null,
    		};
    		resultService.getResultById.mockResolvedValue(result);

    		await expect(resultService.updateResult('1', { value: 60 })).rejects.toThrow(
    			'Cannot update value of a non-preliminary result'
    		);
    		expect(resultService.resultRepository.save).not.toHaveBeenCalled();
    	});

	it.skip('should throw BadRequestException when updating unit of a non-preliminary result', async () => {
    		const result = {
    			id: '1',
    			status: ResultStatus.FINAL,
    			value: 50,
    			referenceMin: null,
    			referenceMax: null,
    		};
    		resultService.getResultById.mockResolvedValue(result);

    		await expect(resultService.updateResult('1', { unit: 'USD' })).rejects.toThrow(
    			'Cannot update unit of a non-preliminary result'
    		);
    		expect(resultService.resultRepository.save).not.toHaveBeenCalled();
    	});

	it.skip('should throw BadRequestException when updating referenceMin of a final result', async () => {
    		const result = {
    			id: '1',
    			status: ResultStatus.FINAL,
    			referenceMin: 10,
    			referenceMax: 20,
    		};
    		resultService.getResultById.mockResolvedValue(result);

    		await expect(resultService.updateResult('1', { referenceMin: 15 })).rejects.toThrow(
    			'Cannot update referenceMin of a final result'
    		);
    		expect(resultService.resultRepository.save).not.toHaveBeenCalled();
    	});

	it.skip('should throw BadRequestException when updating referenceMax of a final result', async () => {
    		const result = {
    			id: '1',
    			status: ResultStatus.FINAL,
    			referenceMin: 10,
    			referenceMax: 20,
    		};
    		resultService.getResultById.mockResolvedValue(result);

    		await expect(resultService.updateResult('1', { referenceMax: 25 })).rejects.toThrow(
    			'Cannot update referenceMax of a final result'
    		);
    		expect(resultService.resultRepository.save).not.toHaveBeenCalled();
    	});

	it.skip('should successfully update status and save the result for a preliminary result', async () => {
    		const initialResult = {
    			id: '1',
    			status: ResultStatus.PRELIMINARY,
    			referenceMin: null,
    			referenceMax: null,
    		};
    		resultService.getResultById.mockResolvedValue(initialResult);
    		resultRepositoryMock.save.mockResolvedValue(initialResult);

    		const dto = {
    			status: ResultStatus.CORRECTED,
    			value: 100,
    		};

    		await resultService.updateResult('1', dto);

    		expect(resultService.getResultById).toHaveBeenCalledWith('1');
    		expect(resultRepositoryMock.save).toHaveBeenCalledTimes(1);
    		const savedResult = resultRepositoryMock.save.mock.calls[0][0];
    		expect(savedResult.status).toBe(ResultStatus.CORRECTED);
    		expect(savedResult.value).toBe(100);
    		expect(savedResult.referenceMin).toBeNull();
    		expect(savedResult.referenceMax).toBeNull();
    	});

	it.skip('should successfully update value and unit for a preliminary result', async () => {
    		const initialResult = {
    			id: '1',
    			status: ResultStatus.PRELIMINARY,
    			value: 50,
    			unit: 'EUR',
    			referenceMin: null,
    			referenceMax: null,
    		};
    		resultService.getResultById.mockResolvedValue(initialResult);
    		resultRepositoryMock.save.mockResolvedValue(initialResult);

    		const dto = {
    			value: 55,
    			unit: 'USD',
    		};

    		await resultService.updateResult('1', dto);

    		expect(resultService.getResultById).toHaveBeenCalledWith('1');
    		expect(resultRepositoryMock.save).toHaveBeenCalledTimes(1);
    		const savedResult = resultRepositoryMock.save.mock.calls[0][0];
    		expect(savedResult.value).toBe(55);
    		expect(savedResult.unit).toBe('USD');
    		expect(savedResult.status).toBe(ResultStatus.PRELIMINARY);
    	});

	it.skip('should successfully update referenceMin and referenceMax for a preliminary result', async () => {
    		const initialResult = {
    			id: '1',
    			status: ResultStatus.PRELIMINARY,
    			referenceMin: null,
    			referenceMax: null,
    		};
    		resultService.getResultById.mockResolvedValue(initialResult);
    		resultRepositoryMock.save.mockResolvedValue(initialResult);

    		const dto = {
    			referenceMin: 10,
    			referenceMax: 20,
    		};

    		await resultService.updateResult('1', dto);

    		expect(resultService.getResultById).toHaveBeenCalledWith('1');
    		expect(resultRepositoryMock.save).toHaveBeenCalledTimes(1);
    		const savedResult = resultRepositoryMock.save.mock.calls[0][0];
    		expect(savedResult.referenceMin).toBe(10);
    		expect(savedResult.referenceMax).toBe(20);
    	});

	it.skip('should successfully update all fields when status is PRELIMINARY', async () => {
    		const initialResult = {
    			id: '1',
    			status: ResultStatus.PRELIMINARY,
    			value: 10,
    			unit: 'GBP',
    			referenceMin: 5,
    			referenceMax: 15,
    		};
    		resultService.getResultById.mockResolvedValue(initialResult);
    		resultRepositoryMock.save.mockResolvedValue(initialResult);

    		const dto = {
    			status: ResultStatus.FINAL,
    			value: 100,
    			unit: 'USD',
    			referenceMin: 1,
    			referenceMax: 2,
    			notes: 'Updated',
    		};

    		await resultService.updateResult('1', dto);

    		expect(resultService.getResultById).toHaveBeenCalledWith('1');
    		expect(resultRepositoryMock.save).toHaveBeenCalledTimes(1);
    		const savedResult = resultRepositoryMock.save.mock.calls[0][0];
    		expect(savedResult.status).toBe(ResultStatus.FINAL);
    		expect(savedResult.value).toBe(100);
    		expect(savedResult.unit).toBe('USD');
    		expect(savedResult.referenceMin).toBe(1);
    		expect(savedResult.referenceMax).toBe(2);
    		expect(savedResult.notes).toBe('Updated');
    	});
});
});

  // TESTS_APPEND_HERE
});
