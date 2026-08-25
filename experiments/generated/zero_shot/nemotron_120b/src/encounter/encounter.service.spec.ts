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

  describe('FN_createEncounter_END', () => {
describe('createEncounter', () => {
  it('should throw NotFoundException when patient not found', async () {
        const createEncounterDto: CreateEncounterDto = {
          patientId: 'non-existent-id',
          adtType: AdtType.A01,
          admitDate: new Date().toISOString(),
        };
        patientServiceMock.getPatientById.mockRejectedValue(new NotFoundException());
        await expect(service.createEncounter(createEncounterDto)).rejects.toThrow(NotFoundException);
      });


  it('should throw ConflictException when active encounter exists', async () => {
        const patientId = 'existing-patient-id';
        const createEncounterDto: CreateEncounterDto = {
          patientId,
          adtType: AdtType.A01,
          admitDate: new Date().toISOString(),
        };
        patientServiceMock.getPatientById.mockResolvedValue({ id: patientId, active: true } as Patient);
        encounterRepositoryMock.findActiveByPatient.mockResolvedValue({ id: 'active-encounter', patientId } as Encounter);
        await expect(service.createEncounter(createEncounterDto)).rejects.toThrow(ConflictException);
      });


  it('should create and save encounter when patient exists and no active encounter', async () => {
        const patientId = 'existing-patient-id';
        const admitDate = new Date();
        const createEncounterDto: CreateEncounterDto = {
          patientId,
          adtType: AdtType.A01,
          admitDate: admitDate.toISOString(),
          ward: Ward.ICU,
        };
        const mockPatient = { id: patientId, active: true } as Patient;
        patientServiceMock.getPatientById.mockResolvedValue(mockPatient);
        encounterRepositoryMock.findActiveByPatient.mockResolvedValue(undefined);
        const mockEncounter = {
          id: 'encounter-id',
          patientId,
          adtType: AdtType.A01,
          status: EncounterStatus.ADMITTED,
          ward: Ward.ICU,
          admitDate,
          transferDate: null,
          dischargeDate: null,
          created_at: new Date(),
          updated_at: new Date(),
          patient: mockPatient,
          orders: [],
        };
        encounterRepositoryMock.create.mockReturnValue(mockEncounter);
        encounterRepositoryMock.save.mockResolvedValue(mockEncounter);
        const result = await service.createEncounter(createEncounterDto);
        expect(result).toEqual(mockEncounter);
        expect(encounterRepositoryMock.create).toHaveBeenCalledWith(
          expect.objectContaining({
            patientId,
            adtType: AdtType.A01,
            admitDate,
            ward: Ward.ICU,
            status: EncounterStatus.ADMITTED,
          })
        );
        expect(encounterRepositoryMock.save).toHaveBeenCalledWith(mockEncounter);
      });

});
});

  // TESTS_APPEND_HERE
});
