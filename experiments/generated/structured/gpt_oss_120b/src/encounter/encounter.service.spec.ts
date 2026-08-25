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
  it('should throw BadRequestException when patient is inactive', async () => {
    const dto: CreateEncounterDto = {
      patientId: 'patient-1',
      adtType: AdtType.A01,
      admitDate: '2023-01-01',
      ward: Ward.ICU,
    };
    const inactivePatient = { id: 'patient-1', active: false } as any;
    patientServiceMock.getPatientById.mockResolvedValueOnce(inactivePatient);
    await expect(service.createEncounter(dto)).rejects.toThrow(BadRequestException);
    expect(encounterRepositoryMock.findActiveByPatient).not.toHaveBeenCalled();
    expect(encounterRepositoryMock.create).not.toHaveBeenCalled();
    expect(encounterRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw ConflictException when an active encounter already exists', async () => {
    const dto: CreateEncounterDto = {
      patientId: 'patient-2',
      adtType: AdtType.A02,
      admitDate: '2023-02-01',
      ward: Ward.SURGERY,
    };
    const activePatient = { id: 'patient-2', active: true } as any;
    const existingEncounter = { id: 'encounter-123' } as any;
    patientServiceMock.getPatientById.mockResolvedValueOnce(activePatient);
    encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce(existingEncounter);
    await expect(service.createEncounter(dto)).rejects.toThrow(ConflictException);
    expect(encounterRepositoryMock.create).not.toHaveBeenCalled();
    expect(encounterRepositoryMock.save).not.toHaveBeenCalled();
  });
});
});

  describe('FN_validateEncounterFields_END', () => {
describe('validateEncounterFields', () => {
  it('should throw BadRequestException when adtType is A01 and ward is missing', () => {
    const dto = {
      patientId: 'patient-1',
      adtType: AdtType.A01,
      admitDate: '2023-01-01',
    };
    expect(() => service.validateEncounterFields(dto)).toThrow(BadRequestException);
  });

  it('should throw BadRequestException when adtType is A02 and ward is missing', () => {
    const dto = {
      patientId: 'patient-2',
      adtType: AdtType.A02,
      admitDate: '2023-01-02',
    };
    expect(() => service.validateEncounterFields(dto)).toThrow(BadRequestException);
  });

  it('should throw BadRequestException when adtType is A03 and ward is provided', () => {
    const dto = {
      patientId: 'patient-3',
      adtType: AdtType.A03,
      admitDate: '2023-01-03',
      ward: Ward.ICU,
    };
    expect(() => service.validateEncounterFields(dto)).toThrow(BadRequestException);
  });

  it('should throw BadRequestException when adtType is A08 and ward is provided', () => {
    const dto = {
      patientId: 'patient-4',
      adtType: AdtType.A08,
      admitDate: '2023-01-04',
      ward: Ward.SURGERY,
    };
    expect(() => service.validateEncounterFields(dto)).toThrow(BadRequestException);
  });

  it('should throw BadRequestException when adtType is A08 and patientId is missing', () => {
    const dto = {
      adtType: AdtType.A08,
      admitDate: '2023-01-05',
    } as any;
    expect(() => service.validateEncounterFields(dto)).toThrow(BadRequestException);
  });
});
});

  describe('FN_listEncountersByPatient_END', () => {
describe('listEncountersByPatient', () => {
  it('should retrieve encounters for a patient', async () => {
    const patientId = 'patient-123';
    const dto = {
      status: EncounterStatus.ADMITTED,
      orderBy: 'admitDate',
      order: 'ASC',
    };
    const expectedEncounters: Encounter[] = [
      {
        id: 'enc1',
        patientId,
        adtType: AdtType.A01,
        status: EncounterStatus.ADMITTED,
        ward: Ward.ICU,
        admitDate: new Date(),
        transferDate: null,
        dischargeDate: null,
        created_at: new Date(),
        updated_at: new Date(),
        patient: {} as Patient,
        orders: [] as any[],
      },
    ];
    patientServiceMock.getPatientById.mockResolvedValueOnce(undefined);
    encounterRepositoryMock.findByPatient.mockReturnValueOnce(expectedEncounters);
    const result = await service.listEncountersByPatient(patientId, dto);
    expect(patientServiceMock.getPatientById).toHaveBeenCalledWith(patientId);
    expect(encounterRepositoryMock.findByPatient).toHaveBeenCalledWith(patientId, dto);
    expect(result).toBe(expectedEncounters);
  });
});
});

  describe('FN_getEncounterById_END', () => {
describe('getEncounterById', () => {
  it('should throw NotFoundException when encounter does not exist', async () => {
    const id = 'nonexistent-id';
    encounterRepositoryMock.findById.mockResolvedValueOnce(undefined);
    await expect(service.getEncounterById(id)).rejects.toThrow(NotFoundException);
  });

  it('should return encounter when found', async () => {
    const id = 'existing-id';
    const mockEncounter: Encounter = {
      id,
      patientId: 'patient-1',
      adtType: AdtType.A01,
      status: EncounterStatus.ADMITTED,
      ward: Ward.INPATIENT,
      admitDate: new Date(),
      transferDate: null,
      dischargeDate: null,
      created_at: new Date(),
      updated_at: new Date(),
      patient: {} as Patient,
      orders: [],
    } as unknown as Encounter;
    encounterRepositoryMock.findById.mockResolvedValueOnce(mockEncounter);
    const result = await service.getEncounterById(id);
    expect(result).toBe(mockEncounter);
  });
});
});

  describe('FN_transitionEncounterStatus_END', () => {
describe('transitionEncounterStatus', () => {
  it('should throw BadRequestException for invalid status transition', async () => {
    const encounter = {
      id: 'enc1',
      status: EncounterStatus.DISCHARGED,
      admitDate: new Date('2023-01-01'),
      ward: Ward.INPATIENT,
      orders: [],
      adtType: AdtType.A01,
    } as unknown as Encounter;
    jest.spyOn(service, 'getEncounterById').mockResolvedValueOnce(encounter);
    const dto: TransitionEncounterStatusDto = {
      status: EncounterStatus.ADMITTED,
    };
    await expect(service.transitionEncounterStatus('enc1', dto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw BadRequestException when discharging with pending orders', async () => {
    const encounter = {
      id: 'enc2',
      status: EncounterStatus.ADMITTED,
      admitDate: new Date('2023-01-01'),
      ward: Ward.INPATIENT,
      orders: [{ status: OrderStatus.PENDING } as any],
      adtType: AdtType.A01,
    } as unknown as Encounter;
    jest.spyOn(service, 'getEncounterById').mockResolvedValueOnce(encounter);
    const dto: TransitionEncounterStatusDto = {
      status: EncounterStatus.DISCHARGED,
      dischargeDate: '2023-01-10',
    };
    await expect(service.transitionEncounterStatus('enc2', dto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw BadRequestException when transferring without ward', async () => {
    const encounter = {
      id: 'enc3',
      status: EncounterStatus.ADMITTED,
      admitDate: new Date('2023-01-01'),
      ward: Ward.INPATIENT,
      orders: [],
      adtType: AdtType.A01,
    } as unknown as Encounter;
    jest.spyOn(service, 'getEncounterById').mockResolvedValueOnce(encounter);
    const dto: TransitionEncounterStatusDto = {
      status: EncounterStatus.TRANSFERRED,
      transferDate: '2023-01-05',
    };
    await expect(service.transitionEncounterStatus('enc3', dto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw BadRequestException when transferring to the same ward', async () => {
    const encounter = {
      id: 'enc4',
      status: EncounterStatus.ADMITTED,
      admitDate: new Date('2023-01-01'),
      ward: Ward.ICU,
      orders: [],
      adtType: AdtType.A01,
    } as unknown as Encounter;
    jest.spyOn(service, 'getEncounterById').mockResolvedValueOnce(encounter);
    const dto: TransitionEncounterStatusDto = {
      status: EncounterStatus.TRANSFERRED,
      ward: Ward.ICU,
      transferDate: '2023-01-05',
    };
    await expect(service.transitionEncounterStatus('enc4', dto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw BadRequestException when transferring without transferDate', async () => {
    const encounter = {
      id: 'enc5',
      status: EncounterStatus.ADMITTED,
      admitDate: new Date('2023-01-01'),
      ward: Ward.INPATIENT,
      orders: [],
      adtType: AdtType.A01,
    } as unknown as Encounter;
    jest.spyOn(service, 'getEncounterById').mockResolvedValueOnce(encounter);
    const dto: TransitionEncounterStatusDto = {
      status: EncounterStatus.TRANSFERRED,
      ward: Ward.SURGERY,
    };
    await expect(service.transitionEncounterStatus('enc5', dto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw BadRequestException when transferDate is before or equal to admitDate', async () => {
    const encounter = {
      id: 'enc6',
      status: EncounterStatus.ADMITTED,
      admitDate: new Date('2023-01-10'),
      ward: Ward.INPATIENT,
      orders: [],
      adtType: AdtType.A01,
    } as unknown as Encounter;
    jest.spyOn(service, 'getEncounterById').mockResolvedValueOnce(encounter);
    const dto: TransitionEncounterStatusDto = {
      status: EncounterStatus.TRANSFERRED,
      ward: Ward.SURGERY,
      transferDate: '2023-01-10',
    };
    await expect(service.transitionEncounterStatus('enc6', dto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw BadRequestException when discharging without dischargeDate', async () => {
    const encounter = {
      id: 'enc7',
      status: EncounterStatus.ADMITTED,
      admitDate: new Date('2023-01-01'),
      ward: Ward.INPATIENT,
      orders: [],
      adtType: AdtType.A01,
    } as unknown as Encounter;
    jest.spyOn(service, 'getEncounterById').mockResolvedValueOnce(encounter);
    const dto: TransitionEncounterStatusDto = {
      status: EncounterStatus.DISCHARGED,
    };
    await expect(service.transitionEncounterStatus('enc7', dto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw BadRequestException when dischargeDate is before or equal to admitDate', async () => {
    const encounter = {
      id: 'enc8',
      status: EncounterStatus.ADMITTED,
      admitDate: new Date('2023-01-10'),
      ward: Ward.INPATIENT,
      orders: [],
      adtType: AdtType.A01,
    } as unknown as Encounter;
    jest.spyOn(service, 'getEncounterById').mockResolvedValueOnce(encounter);
    const dto: TransitionEncounterStatusDto = {
      status: EncounterStatus.DISCHARGED,
      dischargeDate: '2023-01-10',
    };
    await expect(service.transitionEncounterStatus('enc8', dto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw BadRequestException when dischargeDate is before transferDate', async () => {
    const encounter = {
      id: 'enc9',
      status: EncounterStatus.TRANSFERRED,
      admitDate: new Date('2023-01-01'),
      transferDate: new Date('2023-01-05'),
      ward: Ward.SURGERY,
      orders: [],
      adtType: AdtType.A01,
    } as unknown as Encounter;
    jest.spyOn(service, 'getEncounterById').mockResolvedValueOnce(encounter);
    const dto: TransitionEncounterStatusDto = {
      status: EncounterStatus.DISCHARGED,
      dischargeDate: '2023-01-04',
    };
    await expect(service.transitionEncounterStatus('enc9', dto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw BadRequestException for ADT A08 encounters when transitioning away from ADMITTED', async () => {
    const encounter = {
      id: 'enc10',
      status: EncounterStatus.ADMITTED,
      admitDate: new Date('2023-01-01'),
      ward: Ward.INPATIENT,
      orders: [],
      adtType: AdtType.A08,
    } as unknown as Encounter;
    jest.spyOn(service, 'getEncounterById').mockResolvedValueOnce(encounter);
    const dto: TransitionEncounterStatusDto = {
      status: EncounterStatus.TRANSFERRED,
      ward: Ward.SURGERY,
      transferDate: '2023-01-05',
    };
    await expect(service.transitionEncounterStatus('enc10', dto)).rejects.toThrow(
      BadRequestException,
    );
  });
});
});

  describe('FN_processAdtMessage_END', () => {
describe('processAdtMessage', () => {
  it('should throw BadRequestException when A01 missing required fields', async () => {
    const dto = { adtType: AdtType.A01, cpf: '123', name: undefined, birthDate: undefined, sex: undefined, admitDate: undefined };
    await expect(service.processAdtMessage(dto as any)).rejects.toThrow(BadRequestException);
  });

  it('should process A01 and return existing patient with encounter', async () => {
    const patient = { id: 'p1', name: 'John', birthDate: new Date(), cpf: '123', sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] } as Patient;
    const encounter = { id: 'e1', patientId: 'p1', adtType: AdtType.A01, status: EncounterStatus.ADMITTED, ward: null, admitDate: new Date(), transferDate: null, dischargeDate: null, created_at: new Date(), updated_at: new Date(), patient, orders: [] } as Encounter;
    patientServiceMock.findByCpfOrFail.mockResolvedValueOnce(patient);
    jest.spyOn(service as any, 'createEncounter').mockResolvedValueOnce(encounter);
    const dto = { adtType: AdtType.A01, cpf: '123', name: 'John', birthDate: '2000-01-01', sex: Sex.M, admitDate: '2023-01-01', ward: Ward.INPATIENT };
    const result = await service.processAdtMessage(dto as any);
    expect(result.patient).toBe(patient);
    expect(result.encounter).toBe(encounter);
    expect(patientServiceMock.createPatient).not.toHaveBeenCalled();
  });

  it('should process A01, create patient when not found, and return encounter', async () => {
    const newPatient = { id: 'p2', name: 'Jane', birthDate: new Date(), cpf: '456', sex: Sex.F, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] } as Patient;
    const encounter = { id: 'e2', patientId: 'p2', adtType: AdtType.A01, status: EncounterStatus.ADMITTED, ward: Ward.ICU, admitDate: new Date(), transferDate: null, dischargeDate: null, created_at: new Date(), updated_at: new Date(), patient: newPatient, orders: [] } as Encounter;
    patientServiceMock.findByCpfOrFail.mockResolvedValueOnce(undefined);
    patientServiceMock.createPatient.mockResolvedValueOnce(newPatient);
    jest.spyOn(service as any, 'createEncounter').mockResolvedValueOnce(encounter);
    const dto = { adtType: AdtType.A01, cpf: '456', name: 'Jane', birthDate: '1995-05-05', sex: Sex.F, admitDate: '2023-02-02', ward: Ward.ICU };
    const result = await service.processAdtMessage(dto as any);
    expect(result.patient).toBe(newPatient);
    expect(result.encounter).toBe(encounter);
    expect(patientServiceMock.createPatient).toHaveBeenCalled();
  });

  it('should throw BadRequestException when A02 missing required fields', async () => {
    const dto = { adtType: AdtType.A02, cpf: '123', ward: undefined, transferDate: undefined };
    await expect(service.processAdtMessage(dto as any)).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException when A02 active encounter not found', async () => {
    const patient = { id: 'p1' } as Patient;
    patientServiceMock.findByCpfOrFail.mockResolvedValueOnce(patient);
    encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce(undefined);
    const dto = { adtType: AdtType.A02, cpf: '123', ward: Ward.SURGERY, transferDate: '2023-03-03' };
    await expect(service.processAdtMessage(dto as any)).rejects.toThrow(NotFoundException);
  });

  it('should process A02 and return updated encounter', async () => {
    const patient = { id: 'p1' } as Patient;
    const activeEncounter = { id: 'e1', patientId: 'p1' } as Encounter;
    const updatedEncounter = { ...activeEncounter, status: EncounterStatus.TRANSFERRED } as Encounter;
    patientServiceMock.findByCpfOrFail.mockResolvedValueOnce(patient);
    encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce(activeEncounter);
    jest.spyOn(service as any, 'transitionEncounterStatus').mockResolvedValueOnce(updatedEncounter);
    const dto = { adtType: AdtType.A02, cpf: '123', ward: Ward.SURGERY, transferDate: '2023-03-03' };
    const result = await service.processAdtMessage(dto as any);
    expect(result.patient).toBe(patient);
    expect(result.encounter).toBe(updatedEncounter);
  });

  it('should throw BadRequestException when A03 missing dischargeDate', async () => {
    const dto = { adtType: AdtType.A03, cpf: '123', dischargeDate: undefined };
    await expect(service.processAdtMessage(dto as any)).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException when A03 active encounter not found', async () => {
    const patient = { id: 'p1' } as Patient;
    patientServiceMock.findByCpfOrFail.mockResolvedValueOnce(patient);
    encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce(undefined);
    const dto = { adtType: AdtType.A03, cpf: '123', dischargeDate: '2023-04-04' };
    await expect(service.processAdtMessage(dto as any)).rejects.toThrow(NotFoundException);
  });

  it('should process A03 and return discharged encounter', async () => {
    const patient = { id: 'p1' } as Patient;
    const activeEncounter = { id: 'e1', patientId: 'p1' } as Encounter;
    const updatedEncounter = { ...activeEncounter, status: EncounterStatus.DISCHARGED } as Encounter;
    patientServiceMock.findByCpfOrFail.mockResolvedValueOnce(patient);
    encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce(activeEncounter);
    jest.spyOn(service as any, 'transitionEncounterStatus').mockResolvedValueOnce(updatedEncounter);
    const dto = { adtType: AdtType.A03, cpf: '123', dischargeDate: '2023-04-04' };
    const result = await service.processAdtMessage(dto as any);
    expect(result.patient).toBe(patient);
    expect(result.encounter).toBe(updatedEncounter);
  });

  it('should throw BadRequestException when A08 has no updatable fields', async () => {
    const dto = { adtType: AdtType.A08, cpf: '123' };
    await expect(service.processAdtMessage(dto as any)).rejects.toThrow(BadRequestException);
  });

  it('should process A08 and return updated patient', async () => {
    const patient = { id: 'p1' } as Patient;
    const updatedPatient = { ...patient, name: 'Updated' } as Patient;
    patientServiceMock.findByCpfOrFail.mockResolvedValueOnce(patient);
    patientServiceMock.updatePatient.mockResolvedValueOnce(updatedPatient);
    const dto = { adtType: AdtType.A08, cpf: '123', name: 'Updated' };
    const result = await service.processAdtMessage(dto as any);
    expect(result.patient).toBe(updatedPatient);
    expect(result.encounter).toBeUndefined();
  });
});
});

  // TESTS_APPEND_HERE
});
