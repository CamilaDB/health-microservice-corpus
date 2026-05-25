// AUTO-GENERATED-BOOTSTRAP-START
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { SortDirection } from '../common/enums/sort-direction.enum';
import { AdtMessageDto } from '../encounter/dto/adt-message.dto';
import { CreateEncounterDto } from '../encounter/dto/create-encounter.dto';
import { ListEncountersByPatientDto } from '../encounter/dto/list-encounters-by-patient.dto';
import { TransitionEncounterStatusDto } from '../encounter/dto/transition-encounter-status.dto';
import { AdtType } from '../encounter/enums/adt-type.enum';
import { EncounterStatus } from '../encounter/enums/encounter-status.enum';
import { Ward } from '../encounter/enums/ward.enum';
import { ResultStatus } from '../result/enums/result-status.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { SearchOrdersAdvancedDto } from './dto/search-orders-advanced';
import { SearchOrdersDto } from './dto/search-orders.dto';
import { ExamType } from './enums/exam-type.enum';
import { OrderSortField } from './enums/order-sort-field.enum';
import { OrderStatus } from './enums/order-status.enum';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { EncounterService } from 'src/encounter/encounter.service';

describe('OrderService', () => {

  let service: OrderService;
  let orderRepositoryMock: jest.Mocked<OrderRepository>;
  let encounterServiceMock: jest.Mocked<EncounterService>;

  beforeEach(async () => {

    orderRepositoryMock = {
          findById: jest.fn().mockResolvedValue(undefined),
          search: jest.fn().mockResolvedValue(undefined),
          searchAdvanced: jest.fn().mockResolvedValue(undefined),
          save: jest.fn().mockResolvedValue(undefined),
          create: jest.fn().mockReturnValue(undefined),
        } as jest.Mocked<OrderRepository>;

    encounterServiceMock = {
          createEncounter: jest.fn().mockResolvedValue(undefined),
          validateEncounterFields: jest.fn().mockReturnValue(undefined),
          listEncountersByPatient: jest.fn().mockResolvedValue(undefined),
          getEncounterById: jest.fn().mockResolvedValue(undefined),
          transitionEncounterStatus: jest.fn().mockResolvedValue(undefined),
          processAdtMessage: jest.fn().mockResolvedValue(undefined),
        } as jest.Mocked<EncounterService>;

    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          OrderService,
          { provide: OrderRepository, useValue: orderRepositoryMock },
          { provide: EncounterService, useValue: encounterServiceMock },
        ],
      }).compile();

    service = module.get<OrderService>(OrderService);

    jest.clearAllMocks();
  });
  // AUTO-GENERATED-BOOTSTRAP-END

  // TESTS_APPEND_HERE
});
