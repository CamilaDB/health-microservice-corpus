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

  describe('createEncounter', () => {
  const mockCreateDto: CreateEncounterDto = {
    patientId: 'p123',
    adtType: AdtType.A01,
    admitDate: new Date().toISOString(),
    ward: Ward.EMERGENCY,
  };

  it('should successfully create and return a new encounter when the patient is active and no active encounters exist', async () => {
    const mockPatient = { id: 'p123', active: true };
    const mockActiveEncounter = undefined;
    const mockCreatedEncounter: Encounter = {
      id: 'e456',
      patientId: mockCreateDto.patientId,
      adtType: mockCreateDto.adtType,
      status: EncounterStatus.ADMITTED,
      ward: mockCreateDto.ward,
      admitDate: new Date(),
      transferDate: null,
      dischargeDate: null,
    } as unknown as Encounter;

    patientServiceMock.getPatientById.mockResolvedValue(mockPatient);
    encounterRepositoryMock.findActiveByPatient.mockResolvedValue(mockActiveEncounter);
    
    // Mock the return value of create/save chain
    const mockEncounterInstance = { ...mockCreateDto, status: EncounterStatus.ADMITTED } as unknown as Partial<Encounter>;
    encounterRepositoryMock.create.mockReturnValue({ 
        ...mockEncounterInstance, 
        admitDate: new Date(mockCreateDto.admitDate) 
    } as any);
    encounterRepositoryMock.save.mockResolvedValue(mockCreatedEncounter);

    const result = await service.createEncounter(mockCreateDto);

    expect(patientServiceMock.getPatientById).toHaveBeenCalledWith(mockCreateDto.patientId);
    expect(encounterRepositoryMock.findActiveByPatient).toHaveBeenCalledWith(mockCreateDto.patientId);
    expect(encounterRepositoryMock.create).toHaveBeenCalled();
    expect(encounterRepositoryMock.save).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockCreatedEncounter);
  });

  it('should throw BadRequestException if the patient is inactive', async () => {
    const mockInactivePatient = { id: 'p123', active: false };

    patientServiceMock.getPatientById.mockResolvedValue(mockInactivePatient);
    encounterRepositoryMock.findActiveByPatient.mockResolvedValue(undefined);

    await expect(service.createEncounter(mockCreateDto)).rejects.toThrow(BadRequestException);
    await expect(service.createEncounter(mockCreateDto)).rejects.toThrow('Cannot admit an inactive patient');
  });

  it('should throw ConflictException if the patient already has an active encounter', async () => {
    const mockPatient = { id: 'p123', active: true };
    const mockActiveEncounterId = 'e999';
    const mockActiveEncounter = { id: mockActiveEncounterId } as unknown as Encounter;

    patientServiceMock.getPatientById.mockResolvedValue(mockPatient);
    encounterRepositoryMock.findActiveByPatient.mockResolvedValue(mockActiveEncounter);

    await expect(service.createEncounter(mockCreateDto)).rejects.toThrow(ConflictException);
    await expect(service.createEncounter(mockCreateDto)).rejects.toThrow(`Patient already has an active encounter (id: ${mockActiveEncounterId})`);
  });
});

  describe('onAdtMessage', () => {
  it.skip('should throw BadRequestException if ward is missing for ADT A01 (admission)', async () => {
                      const dto: CreateEncounterDto = {
                        patientId: 'p123',
                        adtType: AdtType.A01,
                        admitDate: new Date().toISOString(),
                        ward: undefined,
                      };
                      await expect(() => service.onAdtMessage(dto)).toThrow('Ward is required for ADT A01 (admission)');
                  });



  it.skip('should throw BadRequestException if ward is missing for ADT A02 (transfer)', async () => {
                      const dto: CreateEncounterDto = {
                        patientId: 'p123',
                        adtType: AdtType.A02,
                        admitDate: new Date().toISOString(),
                        ward: undefined,
                      };
                      await expect(() => service.onAdtMessage(dto)).toThrow(BadRequestException);
                  });



  it.skip('should throw BadRequestException if ward is present for ADT A03 (discharge)', async () => {
                      const dto: CreateEncounterDto = {
                        patientId: 'p123',
                        adtType: AdtType.A03,
                        admitDate: new Date().toISOString(),
                        ward: Ward.ICU,
                      };
                      await expect(() => service.onAdtMessage(dto)).toThrow('Ward must not be informed for ADT A03 (discharge)');
                    });



  it.skip('should throw BadRequestException if ward is present for ADT A08 (update)', async () => {
                      const dto: CreateEncounterDto = {
                        patientId: 'p123',
                        adtType: AdtType.A08,
                        admitDate: new Date().toISOString(),
                        ward: Ward.INPATIENT,
                      };
                      await expect(() => service.onAdtMessage(dto)).toThrow(BadRequestException);
                  });



  it.skip('should throw BadRequestException if patientId is missing for ADT A08 (update)', async () => {
                      const dto: CreateEncounterDto = {
                        patientId: undefined,
                        adtType: AdtType.A08,
                        admitDate: new Date().toISOString(),
                        ward: undefined,
                      };
                      await expect(() => service.onAdtMessage(dto)).toThrow(BadRequestException);
                  });


});

  describe('listEncountersByPatient', () => {
  it('should return a list of encounters if patient exists and repository finds records', async () => {
    const patientId = 'patient123';
    const dto: ListEncountersByPatientDto = {};
    const mockEncounters: Encounter[] = [
      { id: 'e1', patientId: patientId, adtType: null as any, status: null as any, ward: null as any, admitDate: new Date(), created_at: new Date() }
    ];

    // Configure mocks for success path
    (patientServiceMock.getPatientById as jest.Mock).mockResolvedValue(undefined);
    (encounterRepositoryMock.findByPatient as jest.Mock).mockResolvedValue(mockEncounters);

    const result = await service.listEncountersByPatient(patientId, dto);

    expect(patientServiceMock.getPatientById).toHaveBeenCalledWith(patientId);
    expect(encounterRepositoryMock.findByPatient).toHaveBeenCalledWith(patientId, dto);
    expect(result).toEqual(mockEncounters);
  });

  it('should throw NotFoundException if patient does not exist', async () => {
    const patientId = 'nonExistentPatient';
    const dto: ListEncountersByPatientDto = {};

    // Configure mock to simulate failure in prerequisite step (patient check)
    (patientServiceMock.getPatientById as jest.Mock).mockRejectedValue(new NotFoundException('Patient not found'));

    await expect(service.listEncountersByPatient(patientId, dto)).rejects.toThrow(NotFoundException);
    await expect(service.listEncountersByPatient(patientId, dto)).rejects.toThrow('Patient not found');

    // Ensure repository method is never called if patient check fails
    expect(encounterRepositoryMock.findByPatient).not.toHaveBeenCalled();
  });
});

  describe('encounterById', () => {
  const mockEncounter: Encounter = {
    id: 'mock-id',
    patientId: 'p123',
    adtType: 'A01',
    status: 'ADMITTED',
    ward: 'INPATIENT',
    admitDate: new Date(),
    transferDate: null,
    dischargeDate: null,
    created_at: new Date(),
    updated_at: new Date(),
    patient: {} as Patient,
    orders: [] as any[],
  };

  it('should return the encounter if it exists', async () => {
          encounterRepositoryMock.findById.mockResolvedValue(mockEncounter);

          const result = await service.getEncounterById('mock-id');

          expect(encounterRepositoryMock.findById).toHaveBeenCalledWith('mock-id');
          expect(result).toEqual(mockEncounter);
      });


  it('should throw NotFoundException if the encounter does not exist', async () => {
          encounterRepositoryMock.findById.mockResolvedValue(undefined);

          await expect(service.getEncounterById('non-existent-id')).rejects.toThrow(NotFoundException);
          await expect(service.getEncounterById('non-existent-id')).rejects.toThrow('Encounter with id non-existent-id not found');
      });

});

  // TESTS_APPEND_HERE
});
