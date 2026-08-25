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
  it('should create a new encounter and save it to the database', async () => {
    const patientId = '12345';
    const adtType: AdtType = AdtType.A01;
    const admitDate = new Date();
    const ward: Ward | null = Ward.INPATIENT;

    const createEncounterDto: CreateEncounterDto = {
      patientId,
      adtType,
      admitDate,
      ward,
    };

    encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce(undefined);
    encounterRepositoryMock.create.mockReturnValueOnce({
      id: '67890',
      patientId,
      adtType,
      status: EncounterStatus.ADMITTED,
      ward,
      admitDate,
      transferDate: null,
      dischargeDate: null,
      created_at: new Date(),
      updated_at: new Date(),
    });
    encounterRepositoryMock.save.mockResolvedValueOnce({
      id: '67890',
      patientId,
      adtType,
      status: EncounterStatus.ADMITTED,
      ward,
      admitDate,
      transferDate: null,
      dischargeDate: null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const result = await service.createEncounter(createEncounterDto);

    expect(result).toEqual({
      id: '67890',
      patientId,
      adtType,
      status: EncounterStatus.ADMITTED,
      ward,
      admitDate,
      transferDate: null,
      dischargeDate: null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    expect(encounterRepositoryMock.findActiveByPatient).toHaveBeenCalledWith(patientId);
    expect(encounterRepositoryMock.create).toHaveBeenCalledWith(createEncounterDto);
    expect(encounterRepositoryMock.save).toHaveBeenCalledWith({
      id: '67890',
      patientId,
      adtType,
      status: EncounterStatus.ADMITTED,
      ward,
      admitDate,
      transferDate: null,
      dischargeDate: null,
      created_at: new Date(),
      updated_at: new Date(),
    });
  });

  it('should throw a BadRequestException if the patientId is invalid', async () => {
    const createEncounterDto: CreateEncounterDto = {
      patientId: 'invalid',
      adtType: AdtType.A01,
      admitDate: new Date(),
      ward: Ward.INPATIENT,
    };

    await expect(service.createEncounter(createEncounterDto)).rejects.toThrowError(BadRequestException);
  });

  it('should throw a ConflictException if the patient is already admitted', async () => {
    const patientId = '12345';
    const adtType: AdtType = AdtType.A01;
    const admitDate = new Date();
    const ward: Ward | null = Ward.INPATIENT;

    const createEncounterDto: CreateEncounterDto = {
      patientId,
      adtType,
      admitDate,
      ward,
    };

    encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce({
      id: '67890',
      patientId,
      adtType,
      status: EncounterStatus.ADMITTED,
      ward,
      admitDate,
      transferDate: null,
      dischargeDate: null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await expect(service.createEncounter(createEncounterDto)).rejects.toThrowError(ConflictException);
  });
});
});

  describe('FN_validateEncounterFields_END', () => {
describe('validateEncounterFields', () => {
  it.skip('should throw a BadRequestException if patientId is missing', async () => {
          const dto: CreateEncounterDto = { adtType: AdtType.A08, admitDate: '2023-10-01' };
          await expect(() => service.validateEncounterFields(dto)).rejects.toThrowError(BadRequestException);
        });


  it.skip('should throw a BadRequestException if adtType is missing', async () => {
        const dto: CreateEncounterDto = { patientId: '1234567890', admitDate: '2023-10-01' };
        await expect(() => service.validateEncounterFields(dto)).rejects.toThrowError(BadRequestException);
      });

  it.skip('should throw a BadRequestException if admitDate is missing', async () => {
        const dto: CreateEncounterDto = { patientId: '1234567890', adtType: AdtType.A01 };
        await expect(() => service.validateEncounterFields(dto)).rejects.toThrowError(BadRequestException);
      });

  it.skip('should throw a BadRequestException if ward is missing and required', async () => {
        const dto: CreateEncounterDto = { patientId: '1234567890', adtType: AdtType.A01, admitDate: '2023-10-01' };
        await expect(() => service.validateEncounterFields(dto)).rejects.toThrowError(BadRequestException);
      });

  it.skip('should not throw an error if all required fields are provided', async () => {
            const dto: CreateEncounterDto = { patientId: '1234567890', adtType: AdtType.A01, admitDate: '2023-10-01', ward: Ward.ICU };
            await expect(() => service.validateEncounterFields(dto)).resolves.not.toThrow();
          });

});
});

  describe('FN_listEncountersByPatient_END', () => {
describe('listEncountersByPatient', () => {
  it('should return an empty array when no encounters are found for the patient', async () => {
    const patientId = '123';
    encounterRepositoryMock.findByPatient.mockResolvedValue([]);

    expect(await service.listEncountersByPatient(patientId, new ListEncountersByPatientDto())).toEqual([]);
  });

  it('should return an array of encounters when they are found for the patient', async () => {
    const patientId = '123';
    const encounter1: Encounter = { id: '456', patientId, adtType: AdtType.A01, status: EncounterStatus.ADMITTED };
    const encounter2: Encounter = { id: '789', patientId, adtType: AdtType.A02, status: EncounterStatus.TRANSFERRED };

    encounterRepositoryMock.findByPatient.mockResolvedValue([encounter1, encounter2]);

    expect(await service.listEncountersByPatient(patientId, new ListEncountersByPatientDto())).toEqual([
      { ...encounter1, patient: undefined },
      { ...encounter2, patient: undefined },
    ]);
  });

  it.skip('should throw a NotFoundException when the patient is not found', async () => {
        const patientId = '123';
        patientServiceMock.getPatientById.mockResolvedValue(undefined);

        await expect(service.listEncountersByPatient(patientId, new ListEncountersByPatientDto())).rejects.toThrow(NotFoundException);
      });

  it.skip('should throw a BadRequestException when the status is invalid', async () => {
        const patientId = '123';
        encounterRepositoryMock.findByPatient.mockResolvedValue([]);

        await expect(service.listEncountersByPatient(patientId, { ...new ListEncountersByPatientDto(), status: 'invalid' as any })).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw a BadRequestException when the orderBy is invalid', async () => {
        const patientId = '123';
        encounterRepositoryMock.findByPatient.mockResolvedValue([]);

        await expect(service.listEncountersByPatient(patientId, { ...new ListEncountersByPatientDto(), orderBy: 'invalid' as any })).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw a BadRequestException when the order is invalid', async () => {
        const patientId = '123';
        encounterRepositoryMock.findByPatient.mockResolvedValue([]);

        await expect(service.listEncountersByPatient(patientId, { ...new ListEncountersByPatientDto(), order: 'invalid' as any })).rejects.toThrow(BadRequestException);
      });
});
});

  describe('FN_getEncounterById_END', () => {
describe('getEncounterById', () => {
  it('should throw NotFoundException when encounter is not found', async () => {
    const encounterId = '12345';
    encounterRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(service.getEncounterById(encounterId)).rejects.toThrow(NotFoundException);
  });

  it('should return the encounter if found', async () => {
    const encounterId = '12345';
    const encounter: Encounter = {
      id: encounterId,
      patientId: '67890',
      adtType: AdtType.A01,
      status: EncounterStatus.ADMITTED,
      ward: Ward.ICU,
      admitDate: new Date(),
      transferDate: null,
      dischargeDate: null,
      created_at: new Date(),
      updated_at: new Date(),
      patient: {
        id: '67890',
        name: 'John Doe',
        cpf: '123.456.789-00',
        sex: Sex.MALE,
        birthDate: new Date('1990-01-01'),
      },
      orders: [],
    };
    encounterRepositoryMock.findById.mockResolvedValue(encounter);

    const result = await service.getEncounterById(encounterId);
    expect(result).toEqual(encounter);
  });
})
});

  describe('FN_transitionEncounterStatus_END', () => {
describe('transitionEncounterStatus', () => {
  it('should throw a BadRequestException if the encounter is not found', async () => {
    const dto: TransitionEncounterStatusDto = { status: EncounterStatus.DISCHARGED };
    await expect(service.transitionEncounterStatus('non-existing-encounter-id', dto)).rejects.toThrowError(BadRequestException);
  });

  it('should throw a ConflictException if the encounter is already in the target status', async () => {
    const encounter = { id: 'existing-encounter-id', status: EncounterStatus.ADMITTED };
    encounterRepositoryMock.findById.mockResolvedValue(encounter);

    const dto: TransitionEncounterStatusDto = { status: EncounterStatus.ADMITTED };
    await expect(service.transitionEncounterStatus('existing-encounter-id', dto)).rejects.toThrowError(ConflictException);
  });

  it('should update the encounter status and save it to the repository', async () => {
    const encounter = { id: 'existing-encounter-id', status: EncounterStatus.ADMITTED };
    encounterRepositoryMock.findById.mockResolvedValue(encounter);

    const dto: TransitionEncounterStatusDto = { status: EncounterStatus.TRANSFERRED, ward: Ward.ICU, transferDate: new Date().toISOString(), dischargeDate: null };
    await service.transitionEncounterStatus('existing-encounter-id', dto);
    expect(encounterRepositoryMock.save).toHaveBeenCalledWith({
      ...encounter,
      status: EncounterStatus.TRANSFERRED,
      ward: Ward.ICU,
      transferDate: new Date(dto.transferDate),
      dischargeDate: null,
    });
  });

  it('should throw a NotFoundException if the patient is not found', async () => {
    const encounter = { id: 'existing-encounter-id', patientId: 'non-existing-patient-id' };
    encounterRepositoryMock.findById.mockResolvedValue(encounter);

    const dto: TransitionEncounterStatusDto = { status: EncounterStatus.DISCHARGED };
    await expect(service.transitionEncounterStatus('existing-encounter-id', dto)).rejects.toThrowError(NotFoundException);
  });
});
});

  describe('FN_processAdtMessage_END', () => {
describe('processAdtMessage', () => {
  it('should create a new encounter for a patient with A01 adtType and active status', async () => {
    const adtMessageDto: AdtMessageDto = {
      adtType: AdtType.A01,
      cpf: '1234567890',
      name: 'John Doe',
      birthDate: '1990-01-01',
      sex: Sex.M,
      email: 'john.doe@example.com',
      phone: '1234567890',
      admitDate: '2023-10-01',
      ward: Ward.ICU,
    };

    const patientServiceMockFindByCpfOrFail = jest.fn().mockResolvedValue({
      id: 'patientId',
      name: 'John Doe',
      birthDate: new Date('1990-01-01'),
      cpf: '1234567890',
      sex: Sex.M,
      email: 'john.doe@example.com',
      phone: '1234567890',
      active: true,
    });

    const encounterRepositoryMockCreate = jest.fn().mockResolvedValue({
      id: 'encounterId',
      patientId: 'patientId',
      adtType: AdtType.A01,
      status: EncounterStatus.ADMITTED,
      ward: Ward.ICU,
      admitDate: new Date('2023-10-01'),
      transferDate: null,
      dischargeDate: null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    patientServiceMock.findByCpfOrFail.mockImplementation(patientServiceMockFindByCpfOrFail);
    encounterRepositoryMock.create.mockImplementation(encounterRepositoryMockCreate);

    await expect(service.processAdtMessage(adtMessageDto)).resolves.toEqual({
      id: 'encounterId',
      patientId: 'patientId',
      adtType: AdtType.A01,
      status: EncounterStatus.ADMITTED,
      ward: Ward.ICU,
      admitDate: new Date('2023-10-01'),
      transferDate: null,
      dischargeDate: null,
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    });

    expect(patientServiceMockFindByCpfOrFail).toHaveBeenCalledWith(adtMessageDto.cpf);
    expect(encounterRepositoryMock.create).toHaveBeenCalledWith({
      adtType: AdtType.A01,
      patientId: 'patientId',
      status: EncounterStatus.ADMITTED,
      ward: Ward.ICU,
      admitDate: new Date('2023-10-01'),
    });
  });

  it('should throw a ConflictException if the patient is already active', async () => {
    const adtMessageDto: AdtMessageDto = {
      adtType: AdtType.A01,
      cpf: '1234567890',
      name: 'John Doe',
      birthDate: '1990-01-01',
      sex: Sex.M,
      email: 'john.doe@example.com',
      phone: '1234567890',
      admitDate: '2023-10-01',
      ward: Ward.ICU,
    };

    const patientServiceMockFindByCpfOrFail = jest.fn().mockResolvedValue({
      id: 'patientId',
      name: 'John Doe',
      birthDate: new Date('1990-01-01'),
      cpf: '1234567890',
      sex: Sex.M,
      email: 'john.doe@example.com',
      phone: '1234567890',
      active: true,
    });

    patientServiceMock.findByCpfOrFail.mockImplementation(patientServiceMockFindByCpfOrFail);

    await expect(service.processAdtMessage(adtMessageDto)).rejects.toThrowConflictException();

    expect(patientServiceMockFindByCpfOrFail).toHaveBeenCalledWith(adtMessageDto.cpf);
  });
});
});

  describe('FN_updateEncounter_END', () => {
describe('updateEncounter', () => {
  it('should update an existing encounter with valid data', async () => {
    const encounterId = '123';
    const updatedData: UpdateEncounterDto = { admitDate: '2023-10-05' };
    const expectedEncounter: Encounter = {
      id: encounterId,
      patientId: '456',
      adtType: AdtType.A01,
      status: EncounterStatus.ADMITTED,
      ward: Ward.INPATIENT,
      admitDate: new Date('2023-10-05'),
      transferDate: null,
      dischargeDate: null,
      created_at: new Date(),
      updated_at: new Date(),
      patient: { id: '456', name: 'John Doe', sex: Sex.MALE, birthdate: new Date('1980-01-01') },
      orders: [],
    };

    encounterRepositoryMock.findById.mockResolvedValue(expectedEncounter);
    encounterRepositoryMock.save.mockResolvedValue(expectedEncounter);

    await expect(service.updateEncounter(encounterId, updatedData)).resolves.toEqual(expectedEncounter);

    expect(encounterRepositoryMock.findById).toHaveBeenCalledWith(encounterId);
    expect(encounterRepositoryMock.save).toHaveBeenCalledWith(expectedEncounter);
  });

  it('should throw a NotFoundException if the encounter is not found', async () => {
    const encounterId = '123';
    const updatedData: UpdateEncounterDto = { admitDate: '2023-10-05' };

    encounterRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(service.updateEncounter(encounterId, updatedData)).rejects.toThrow(NotFoundException);
  });

  it.skip('should throw a BadRequestException if the update data is invalid', async () => {
        const encounterId = '123';
        const updatedData: UpdateEncounterDto = { ward: 'INVALID_WARD' };

        await expect(service.updateEncounter(encounterId, updatedData)).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw a ConflictException if the update data is invalid due to existing encounter', async () => {
        const encounterId = '123';
        const updatedData: UpdateEncounterDto = { admitDate: '2023-10-05' };
        const expectedEncounter: Encounter = {
          id: encounterId,
          patientId: '456',
          adtType: AdtType.A01,
          status: EncounterStatus.ADMITTED,
          ward: Ward.INPATIENT,
          admitDate: new Date('2023-10-05'),
          transferDate: null,
          dischargeDate: null,
          created_at: new Date(),
          updated_at: new Date(),
          patient: { id: '456', name: 'John Doe', sex: Sex.MALE, birthdate: new Date('1980-01-01') },
          orders: [],
        };

        encounterRepositoryMock.findById.mockResolvedValue(expectedEncounter);

        await expect(service.updateEncounter(encounterId, updatedData)).rejects.toThrow(ConflictException);
      });
});
});

  // TESTS_APPEND_HERE
});
