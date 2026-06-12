// AUTO-GENERATED-BOOTSTRAP-START
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { OrderStatus } from '../order/enums/order-status.enum';
import { Patient } from '../patient/entities/patient.entity';
import { Sex } from '../patient/enums/sex.enum';
import { PatientService } from '../patient/patient.service';
import { ResultStatus } from '../result/enums/result-status.enum';
import { AdtMessageDto } from './dto/adt-message.dto';
import { CreateEncounterDto } from './dto/create-encounter.dto';
import { ListEncountersByPatientDto } from './dto/list-encounters-by-patient.dto';
import { TransitionEncounterStatusDto } from './dto/transition-encounter-status.dto';
import { UpdateEncounterDto } from './dto/update-encounter.dto';
import { EncounterRepository } from './encounter.repository';
import { Encounter } from './entities/encounter.entity';
import { AdtType } from './enums/adt-type.enum';
import { EncounterStatus } from './enums/encounter-status.enum';
import { Ward } from './enums/ward.enum';
import { EncounterSummary } from './interfaces/encounter.interface';
import { EncounterService } from './encounter.service';

describe('EncounterService', () => {

  let service: EncounterService;
  let encounterRepositoryMock: jest.Mocked<EncounterRepository>;
  let patientServiceMock: jest.Mocked<PatientService>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {

    encounterRepositoryMock = {
      findById: jest.fn().mockResolvedValue(undefined),
      findActiveByPatient: jest.fn().mockResolvedValue(undefined),
      findByPatient: jest.fn().mockResolvedValue(undefined),
      save: jest.fn().mockResolvedValue(undefined),
      create: jest.fn().mockReturnValue(undefined),
    } as unknown as jest.Mocked<EncounterRepository>;

    patientServiceMock = {
      getPatientById: jest.fn().mockResolvedValue(undefined),
      listPatients: jest.fn().mockResolvedValue(undefined),
      createPatient: jest.fn().mockResolvedValue(undefined),
      updatePatient: jest.fn().mockResolvedValue(undefined),
      findByCpfOrFail: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<PatientService>;

    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          EncounterService,
          { provide: EncounterRepository, useValue: encounterRepositoryMock },
          { provide: PatientService, useValue: patientServiceMock },
        ],
      }).compile();

    service = module.get<EncounterService>(EncounterService);

  });
  // AUTO-GENERATED-BOOTSTRAP-END

  Here is the Jest test for your `createEncounter` function:


describe('EncounterService', () => {
  let service: EncounterService;
  let encounterRepositoryMock: jest.Mocked<EncounterRepository>;
  let patientServiceMock: jest.Mocked<PatientService>;

  beforeEach(async () => {
    encounterRepositoryMock = {
      findActiveByPatient: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockReturnValue({} as Encounter),
      save: jest.fn().mockResolvedValue({} as Encounter),
    } as unknown as jest.Mocked<EncounterRepository>;

    patientServiceMock = {
      getPatientById: jest.fn().mockResolvedValue({ active: true } as Patient),
    } as unknown as jest.Mocked<PatientService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EncounterService,
        { provide: EncounterRepository, useValue: encounterRepositoryMock },
        { provide: PatientService, useValue: patientServiceMock },
      ],
    }).compile();

    service = module.get<EncounterService>(EncounterService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create encounter for active patient', async () => {
    const dto: CreateEncounterDto = {
      patientId: '1234567890',
      adtType: AdtType.A01,
      admitDate: '2022-01-01T00:00:00Z',
    };

    const result = await service.createEncounter(dto);

    expect(patientServiceMock.getPatientById).toHaveBeenCalledWith('1234567890');
    expect(encounterRepositoryMock.findActiveByPatient).toHaveBeenCalledWith('1234567890');
    expect(encounterRepositoryMock.create).toHaveBeenCalledWith({
      ...dto,
      admitDate: new Date('2022-01-01T00:00:00Z'),
      status: EncounterStatus.ADMITTED,
      ward: undefined,
      transferDate: null,
      dischargeDate: null,
    });
    expect(encounterRepositoryMock.save).toHaveBeenCalledWith({});
  });

  it('should throw BadRequestException if patient is not active', async () => {
    const dto: CreateEncounterDto = {
      patientId: '1234567890',
      adtType: AdtType.A01,
      admitDate: '2022-01-01T00:00:00Z',
    };

    patientServiceMock.getPatientById.mockResolvedValue({ active: false } as Patient);

    await expect(service.createEncounter(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw ConflictException if patient already has an active encounter', async () => {
    const dto: CreateEncounterDto = {
      patientId: '1234567890',
      adtType: AdtType.A01,
      admitDate: '2022-01-01T00:00:00Z',
    };

    encounterRepositoryMock.findActiveByPatient.mockResolvedValue({} as Encounter);

    await expect(service.createEncounter(dto)).rejects.toThrow(ConflictException);
  });
});

This test suite includes three tests:
1. `should create encounter for active patient` - This test checks if the function creates an encounter successfully when a valid DTO is passed and the patient is active. It also verifies that all necessary methods (`getPatientById`, `findActiveByPatient`, `create`, `save`) are called with the correct arguments.
2. `should throw BadRequestException if patient is not active` - This test checks if a `BadRequestException` is thrown when trying to create an encounter for an inactive patient.
3. `should throw ConflictException if patient already has an active encounter` - This test checks if a `ConflictException` is thrown when trying to create an encounter for a patient who already has an active encounter.

  // TESTS_APPEND_HERE
});
