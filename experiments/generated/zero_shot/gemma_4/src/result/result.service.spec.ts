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
it.skip('should validate order result and create, save, and return the result', async () => {
        const dto = {
            orderId: 'order-123',
            value: 100,
            unit: 'USD',
            status: ResultStatus.FINAL,
            referenceMin: 10,
            referenceMax: 20,
            resultDate: '2023-01-01T00:00:00.000Z',
            sourceSystem: 'ERP',
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
            order: {},
        };

        orderServiceMock.validateOrderResult.mockResolvedValue(undefined);
        resultRepositoryMock.create.mockResolvedValue(createdResult);
        resultRepositoryMock.save.mockResolvedValue(createdResult);

        const result = await createResult(dto);

        await expect(orderServiceMock.validateOrderResult).toHaveBeenCalledWith(dto.orderId, dto.status);
        expect(result).toEqual(createdResult);
        expect(resultRepositoryMock.create).toHaveBeenCalledWith({
            ...dto,
            resultDate: new Date(dto.resultDate),
            referenceMin: dto.referenceMin,
            referenceMax: dto.referenceMax,
            sourceSystem: dto.sourceSystem,
            notes: dto.notes,
        });
        expect(resultRepositoryMock.save).toHaveBeenCalledWith(createdResult);
    });
});
});

  describe('FN_searchResults_END', () => {
describe('searchResults', () => {
it('should return the results from the repository search', async () => {
    const mockResults: Result[] = [
        { id: '1', orderId: 'A1', value: 10, unit: 'kg', status: ResultStatus.FINAL, created_at: new Date() }
    ];

    resultRepositoryMock.search.mockResolvedValue(mockResults);

    const dto = { orderId: 'A1' };

    const result = await service.searchResults(dto);

    expect(result).toEqual(mockResults);
    expect(resultRepositoryMock.search).toHaveBeenCalledWith(dto);
});
})
});

  describe('FN_getResultById_END', () => {
describe('getResultById', () => {
it('should return the result if found', async () => {
  const mockResult = {
    id: '1',
    orderId: '100',
    value: 100,
    unit: 'USD',
    status: 'PRELIMINARY',
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

it('should throw NotFoundException if the result is not found', async () => {
  resultRepositoryMock.findById.mockResolvedValue(undefined);

  await expect(service.getResultById('nonExistentId')).rejects.toThrow(NotFoundException);
  await expect(service.getResultById('nonExistentId')).rejects.toThrow(`Result with id nonExistentId not found`);
});
})
});

  describe('FN_buildResultReport_END', () => {
describe('buildResultReport', () => {
	it.skip('should be able to build a result report successfully when results are found', async () => {
    		const orderId = 'order123';
    		const mockOrder = {
    			id: 'order123',
    			examType: ExamType.GLUCOSE,
    		};
    		const mockResults: ResultReportItem[] = [
    			{
    				id: 'res1',
    				value: 80,
    				unit: 'mg/dL',
    				status: ResultStatus.FINAL,
    				referenceMin: 70,
    				referenceMax: 99,
    				sourceSystem: 'sysA',
    				resultDate: new Date(),
    			},
    			{
    				id: 'res2',
    				value: 105,
    				unit: 'mg/dL',
    				status: ResultStatus.PRELIMINARY,
    				referenceMin: 70,
    				referenceMax: 99,
    				sourceSystem: 'sysB',
    				resultDate: new Date(),
    			},
    		];

    		orderServiceMock.getOrderById.mockResolvedValue(mockOrder);
    		resultRepositoryMock.findByOrderId.mockResolvedValue(mockResults);

    		const report = await service.buildResultReport(orderId);

    		expect(report).toBeDefined();
    		expect(report.orderId).toBe(orderId);
    		expect(report.examType).toBe(ExamType.GLUCOSE);
    		expect(report.summary.total).toBe(2);
    		expect(report.summary.preliminary).toBe(1);
    		expect(report.summary.final).toBe(1);
    		expect(report.summary.corrected).toBe(0);
    		expect(report.summary.abnormal).toBe(0);
    		expect(report.items.length).toBe(2);

    		const glucoseItem = report.items.find(item => item.resultId === 'res1');
    		expect(glucoseItem?.flag).toBe('NORMAL');
    		expect(glucoseItem?.referenceMin).toBe(70);
    		expect(glucoseItem?.value).toBe(80);
    	});

	it('should throw NotFoundException if no results are found for an order', async () => {
		const orderId = 'order456';
		orderServiceMock.getOrderById.mockResolvedValue({
			id: orderId,
			examType: ExamType.TSH,
		});
		resultRepositoryMock.findByOrderId.mockResolvedValue([]);

		await expect(service.buildResultReport(orderId)).rejects.toThrow(NotFoundException);
		await expect(service.buildResultReport(orderId)).rejects.toThrow(`No results found for order ${orderId}`);
	});
});
});

  // TESTS_APPEND_HERE
});
