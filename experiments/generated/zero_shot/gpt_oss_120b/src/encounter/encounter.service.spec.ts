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
  it('throws BadRequestException when patient is inactive', async () => {
    const dto: CreateEncounterDto = {
      patientId: 'p1',
      adtType: AdtType.A01,
      admitDate: '2023-01-01T00:00:00.000Z',
    };
    patientServiceMock.getPatientById.mockResolvedValue({ active: false } as Patient);
    await expect(service.createEncounter(dto)).rejects.toThrow(BadRequestException);
    expect(patientServiceMock.getPatientById).toHaveBeenCalledWith('p1');
    expect(encounterRepositoryMock.findActiveByPatient).not.toHaveBeenCalled();
  });

  it('throws ConflictException when patient already has an active encounter', async () => {
    const dto: CreateEncounterDto = {
      patientId: 'p2',
      adtType: AdtType.A02,
      admitDate: '2023-02-02T00:00:00.000Z',
    };
    patientServiceMock.getPatientById.mockResolvedValue({ active: true } as Patient);
    encounterRepositoryMock.findActiveByPatient.mockResolvedValue({ id: 'e1' } as Encounter);
    await expect(service.createEncounter(dto)).rejects.toThrow(ConflictException);
    expect(patientServiceMock.getPatientById).toHaveBeenCalledWith('p2');
    expect(encounterRepositoryMock.findActiveByPatient).toHaveBeenCalledWith('p2');
  });

  it('creates and saves a new encounter when patient is active and no active encounter exists', async () => {
    const dto: CreateEncounterDto = {
      patientId: 'p3',
      adtType: AdtType.A03,
      admitDate: '2023-03-03T00:00:00.000Z',
      ward: Ward.ICU,
    };
    const patient = { active: true } as Patient;
    const createdEncounter = {} as Encounter;
    const savedEncounter = { id: 'e2' } as Encounter;
    patientServiceMock.getPatientById.mockResolvedValue(patient);
    encounterRepositoryMock.findActiveByPatient.mockResolvedValue(undefined);
    encounterRepositoryMock.create.mockReturnValue(createdEncounter);
    encounterRepositoryMock.save.mockResolvedValue(savedEncounter);
    const result = await service.createEncounter(dto);
    expect(result).toBe(savedEncounter);
    expect(patientServiceMock.getPatientById).toHaveBeenCalledWith('p3');
    expect(encounterRepositoryMock.findActiveByPatient).toHaveBeenCalledWith('p3');
    expect(encounterRepositoryMock.create).toHaveBeenCalledWith({
      ...dto,
      admitDate: new Date(dto.admitDate),
      status: EncounterStatus.ADMITTED,
      ward: dto.ward,
      transferDate: null,
      dischargeDate: null,
    });
    expect(encounterRepositoryMock.save).toHaveBeenCalledWith(createdEncounter);
  });
});

  describe('validateEncounterFields', () => {
  it('throws BadRequestException when ADT A01 without ward', () => {
    const dto = { patientId: 'p1', adtType: AdtType.A01, admitDate: '2023-01-01' };
    expect(() => service.validateEncounterFields(dto as any)).toThrow(BadRequestException);
  });

  it('does not throw when ADT A01 with ward', () => {
    const dto = { patientId: 'p1', adtType: AdtType.A01, admitDate: '2023-01-01', ward: Ward.ICU };
    expect(() => service.validateEncounterFields(dto as any)).not.toThrow();
  });

  it('throws BadRequestException when ADT A02 without ward', () => {
    const dto = { patientId: 'p1', adtType: AdtType.A02, admitDate: '2023-01-01' };
    expect(() => service.validateEncounterFields(dto as any)).toThrow(BadRequestException);
  });

  it('does not throw when ADT A02 with ward', () => {
    const dto = { patientId: 'p1', adtType: AdtType.A02, admitDate: '2023-01-01', ward: Ward.INPATIENT };
    expect(() => service.validateEncounterFields(dto as any)).not.toThrow();
  });

  it('throws BadRequestException when ADT A03 with ward', () => {
    const dto = { patientId: 'p1', adtType: AdtType.A03, admitDate: '2023-01-01', ward: Ward.SURGERY };
    expect(() => service.validateEncounterFields(dto as any)).toThrow(BadRequestException);
  });

  it('does not throw when ADT A03 without ward', () => {
    const dto = { patientId: 'p1', adtType: AdtType.A03, admitDate: '2023-01-01' };
    expect(() => service.validateEncounterFields(dto as any)).not.toThrow();
  });

  it('throws BadRequestException when ADT A08 with ward', () => {
    const dto = { patientId: 'p1', adtType: AdtType.A08, admitDate: '2023-01-01', ward: Ward.EMERGENCY };
    expect(() => service.validateEncounterFields(dto as any)).toThrow(BadRequestException);
  });

  it('throws BadRequestException when ADT A08 without patientId', () => {
    const dto = { adtType: AdtType.A08, admitDate: '2023-01-01' };
    expect(() => service.validateEncounterFields(dto as any)).toThrow(BadRequestException);
  });

  it('does not throw when ADT A08 with patientId and without ward', () => {
    const dto = { patientId: 'p1', adtType: AdtType.A08, admitDate: '2023-01-01' };
    expect(() => service.validateEncounterFields(dto as any)).not.toThrow();
  });
});

  describe('listEncountersByPatient', () => {
  it('returns encounters when patient exists', async () => {
    const patientId = 'patient-123';
    const dto = {} as ListEncountersByPatientDto;
    const expectedEncounters: Encounter[] = [
      {
        id: 'enc-1',
        patientId,
        adtType: undefined as any,
        status: undefined as any,
        ward: null,
        admitDate: new Date(),
        transferDate: null,
        dischargeDate: null,
        created_at: new Date(),
        updated_at: new Date(),
        patient: {} as Patient,
        orders: [],
      },
    ];
    patientServiceMock.getPatientById.mockResolvedValue({} as Patient);
    encounterRepositoryMock.findByPatient.mockResolvedValue(expectedEncounters);
    const result = await service.listEncountersByPatient(patientId, dto);
    expect(patientServiceMock.getPatientById).toHaveBeenCalledWith(patientId);
    expect(encounterRepositoryMock.findByPatient).toHaveBeenCalledWith(patientId, dto);
    expect(result).toBe(expectedEncounters);
  });

  it('throws NotFoundException when patient does not exist', async () => {
    const patientId = 'nonexistent';
    const dto = {} as ListEncountersByPatientDto;
    patientServiceMock.getPatientById.mockRejectedValue(new NotFoundException());
    await expect(service.listEncountersByPatient(patientId, dto)).rejects.toThrow(NotFoundException);
    expect(patientServiceMock.getPatientById).toHaveBeenCalledWith(patientId);
    expect(encounterRepositoryMock.findByPatient).not.toHaveBeenCalled();
  });
});

  describe('getEncounterById', () => {
  it('should return the encounter when found', async () => {
    const mockEncounter = {
      id: 'enc1',
      patientId: 'pat1',
      adtType: 0,
      status: 0,
      ward: null,
      admitDate: new Date(),
      transferDate: null,
      dischargeDate: null,
      created_at: new Date(),
      updated_at: new Date(),
      patient: {} as any,
      orders: [],
    } as Encounter;
    encounterRepositoryMock.findById.mockResolvedValueOnce(mockEncounter);
    const result = await service.getEncounterById('enc1');
    expect(result).toBe(mockEncounter);
    expect(encounterRepositoryMock.findById).toHaveBeenCalledWith('enc1');
  });

  it('should throw NotFoundException when encounter does not exist', async () => {
    encounterRepositoryMock.findById.mockResolvedValueOnce(undefined);
    await expect(service.getEncounterById('nonexistent')).rejects.toThrow(NotFoundException);
    expect(encounterRepositoryMock.findById).toHaveBeenCalledWith('nonexistent');
  });
});

  describe('transitionEncounterStatus', () => {
  it('throws BadRequestException for invalid status transition', async () => {
    const encounter = {
      id: '1',
      status: EncounterStatus.ADMITTED,
      adtType: AdtType.A01,
      admitDate: new Date('2023-01-01'),
      ward: Ward.INPATIENT,
      orders: [],
    } as unknown as Encounter;
    jest.spyOn(service as any, 'getEncounterById').mockResolvedValue(encounter);
    const dto = { status: EncounterStatus.ADMITTED } as TransitionEncounterStatusDto;
    await expect(service.transitionEncounterStatus('1', dto)).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequestException when transferring without ward', async () => {
    const encounter = {
      id: '2',
      status: EncounterStatus.ADMITTED,
      adtType: AdtType.A01,
      admitDate: new Date('2023-01-01'),
      ward: Ward.INPATIENT,
      orders: [],
    } as unknown as Encounter;
    jest.spyOn(service as any, 'getEncounterById').mockResolvedValue(encounter);
    const dto = {
      status: EncounterStatus.TRANSFERRED,
      transferDate: '2023-01-02T00:00:00Z',
    } as TransitionEncounterStatusDto;
    await expect(service.transitionEncounterStatus('2', dto)).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequestException when transferring to same ward', async () => {
    const encounter = {
      id: '3',
      status: EncounterStatus.ADMITTED,
      adtType: AdtType.A01,
      admitDate: new Date('2023-01-01'),
      ward: Ward.ICU,
      orders: [],
    } as unknown as Encounter;
    jest.spyOn(service as any, 'getEncounterById').mockResolvedValue(encounter);
    const dto = {
      status: EncounterStatus.TRANSFERRED,
      ward: Ward.ICU,
      transferDate: '2023-01-02T00:00:00Z',
    } as TransitionEncounterStatusDto;
    await expect(service.transitionEncounterStatus('3', dto)).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequestException when transferDate is before admitDate', async () => {
    const encounter = {
      id: '4',
      status: EncounterStatus.ADMITTED,
      adtType: AdtType.A01,
      admitDate: new Date('2023-01-05'),
      ward: Ward.INPATIENT,
      orders: [],
    } as unknown as Encounter;
    jest.spyOn(service as any, 'getEncounterById').mockResolvedValue(encounter);
    const dto = {
      status: EncounterStatus.TRANSFERRED,
      ward: Ward.ICU,
      transferDate: '2023-01-01T00:00:00Z',
    } as TransitionEncounterStatusDto;
    await expect(service.transitionEncounterStatus('4', dto)).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequestException when discharging with pending orders', async () => {
    const encounter = {
      id: '5',
      status: EncounterStatus.ADMITTED,
      adtType: AdtType.A01,
      admitDate: new Date('2023-01-01'),
      ward: Ward.INPATIENT,
      orders: [{ status: OrderStatus.PENDING }],
    } as unknown as Encounter;
    jest.spyOn(service as any, 'getEncounterById').mockResolvedValue(encounter);
    const dto = {
      status: EncounterStatus.DISCHARGED,
      dischargeDate: '2023-01-10T00:00:00Z',
    } as TransitionEncounterStatusDto;
    await expect(service.transitionEncounterStatus('5', dto)).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequestException when dischargeDate missing', async () => {
    const encounter = {
      id: '6',
      status: EncounterStatus.ADMITTED,
      adtType: AdtType.A01,
      admitDate: new Date('2023-01-01'),
      ward: Ward.INPATIENT,
      orders: [],
    } as unknown as Encounter;
    jest.spyOn(service as any, 'getEncounterById').mockResolvedValue(encounter);
    const dto = { status: EncounterStatus.DISCHARGED } as TransitionEncounterStatusDto;
    await expect(service.transitionEncounterStatus('6', dto)).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequestException when dischargeDate before admitDate', async () => {
    const encounter = {
      id: '7',
      status: EncounterStatus.ADMITTED,
      adtType: AdtType.A01,
      admitDate: new Date('2023-01-10'),
      ward: Ward.INPATIENT,
      orders: [],
    } as unknown as Encounter;
    jest.spyOn(service as any, 'getEncounterById').mockResolvedValue(encounter);
    const dto = {
      status: EncounterStatus.DISCHARGED,
      dischargeDate: '2023-01-05T00:00:00Z',
    } as TransitionEncounterStatusDto;
    await expect(service.transitionEncounterStatus('7', dto)).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequestException when dischargeDate before transferDate', async () => {
    const encounter = {
      id: '8',
      status: EncounterStatus.TRANSFERRED,
      adtType: AdtType.A01,
      admitDate: new Date('2023-01-01'),
      transferDate: new Date('2023-01-05'),
      ward: Ward.ICU,
      orders: [],
    } as unknown as Encounter;
    jest.spyOn(service as any, 'getEncounterById').mockResolvedValue(encounter);
    const dto = {
      status: EncounterStatus.DISCHARGED,
      dischargeDate: '2023-01-03T00:00:00Z',
    } as TransitionEncounterStatusDto;
    await expect(service.transitionEncounterStatus('8', dto)).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequestException for ADT A08 status transition', async () => {
    const encounter = {
      id: '9',
      status: EncounterStatus.ADMITTED,
      adtType: AdtType.A08,
      admitDate: new Date('2023-01-01'),
      ward: Ward.INPATIENT,
      orders: [],
    } as unknown as Encounter;
    jest.spyOn(service as any, 'getEncounterById').mockResolvedValue(encounter);
    const dto = {
      status: EncounterStatus.TRANSFERRED,
      ward: Ward.ICU,
      transferDate: '2023-01-02T00:00:00Z',
    } as TransitionEncounterStatusDto;
    await expect(service.transitionEncounterStatus('9', dto)).rejects.toThrow(BadRequestException);
  });

  it('successfully transfers encounter and saves', async () => {
    const encounter = {
      id: '10',
      status: EncounterStatus.ADMITTED,
      adtType: AdtType.A01,
      admitDate: new Date('2023-01-01'),
      ward: Ward.INPATIENT,
      orders: [],
    } as unknown as Encounter;
    jest.spyOn(service as any, 'getEncounterById').mockResolvedValue(encounter);
    const dto = {
      status: EncounterStatus.TRANSFERRED,
      ward: Ward.ICU,
      transferDate: '2023-01-02T00:00:00Z',
    } as TransitionEncounterStatusDto;
    await service.transitionEncounterStatus('10', dto);
    expect(encounterRepositoryMock.save).toHaveBeenCalledWith(expect.objectContaining({
      status: EncounterStatus.TRANSFERRED,
      ward: Ward.ICU,
      transferDate: new Date('2023-01-02T00:00:00Z'),
    }));
  });

  it('successfully discharges encounter and saves', async () => {
    const encounter = {
      id: '11',
      status: EncounterStatus.ADMITTED,
      adtType: AdtType.A01,
      admitDate: new Date('2023-01-01'),
      ward: Ward.INPATIENT,
      orders: [],
    } as unknown as Encounter;
    jest.spyOn(service as any, 'getEncounterById').mockResolvedValue(encounter);
    const dto = {
      status: EncounterStatus.DISCHARGED,
      dischargeDate: '2023-01-10T00:00:00Z',
    } as TransitionEncounterStatusDto;
    await service.transitionEncounterStatus('11', dto);
    expect(encounterRepositoryMock.save).toHaveBeenCalledWith(expect.objectContaining({
      status: EncounterStatus.DISCHARGED,
      dischargeDate: new Date('2023-01-10T00:00:00Z'),
    }));
  });
});

  describe('processAdtMessage', () => {
  it('throws BadRequestException for A01 when required fields are missing', async () => {
    const dto = { adtType: AdtType.A01, cpf: '123' } as any;
    await expect(service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
  });

  it('creates patient and encounter for A01 when patient does not exist', async () => {
    const dto = {
      adtType: AdtType.A01,
      cpf: '123',
      name: 'John Doe',
      birthDate: '1990-01-01',
      sex: Sex.M,
      admitDate: '2023-01-01',
      ward: Ward.INPATIENT,
    } as any;
    patientServiceMock.findByCpfOrFail.mockResolvedValue(undefined);
    const createdPatient = { id: 'p1' } as Patient;
    patientServiceMock.createPatient.mockResolvedValue(createdPatient);
    const createdEncounter = { id: 'e1' } as Encounter;
    jest.spyOn(service, 'createEncounter').mockResolvedValue(createdEncounter);
    const result = await service.processAdtMessage(dto);
    expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith('123');
    expect(patientServiceMock.createPatient).toHaveBeenCalledWith({
      cpf: '123',
      name: 'John Doe',
      birthDate: '1990-01-01',
      sex: Sex.M,
      email: undefined,
      phone: undefined,
    });
    expect(service.createEncounter).toHaveBeenCalledWith({
      patientId: 'p1',
      adtType: AdtType.A01,
      admitDate: '2023-01-01',
      ward: Ward.INPATIENT,
    });
    expect(result).toEqual({ patient: createdPatient, encounter: createdEncounter });
  });

  it('throws BadRequestException for A02 when required fields are missing', async () => {
    const dto = { adtType: AdtType.A02, cpf: '123' } as any;
    await expect(service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
  });

  it('throws NotFoundException for A02 when no active encounter', async () => {
    const dto = {
      adtType: AdtType.A02,
      cpf: '123',
      ward: Ward.ICU,
      transferDate: '2023-02-01',
    } as any;
    const patient = { id: 'p1' } as Patient;
    patientServiceMock.findByCpfOrFail.mockResolvedValue(patient);
    encounterRepositoryMock.findActiveByPatient.mockResolvedValue(undefined);
    await expect(service.processAdtMessage(dto)).rejects.toThrow(NotFoundException);
  });

  it('transfers encounter for A02 when active encounter exists', async () => {
    const dto = {
      adtType: AdtType.A02,
      cpf: '123',
      ward: Ward.ICU,
      transferDate: '2023-02-01',
    } as any;
    const patient = { id: 'p1' } as Patient;
    const activeEncounter = { id: 'e1' } as Encounter;
    patientServiceMock.findByCpfOrFail.mockResolvedValue(patient);
    encounterRepositoryMock.findActiveByPatient.mockResolvedValue(activeEncounter);
    const updatedEncounter = { id: 'e1', status: EncounterStatus.TRANSFERRED } as Encounter;
    jest.spyOn(service, 'transitionEncounterStatus').mockResolvedValue(updatedEncounter);
    const result = await service.processAdtMessage(dto);
    expect(service.transitionEncounterStatus).toHaveBeenCalledWith('e1', {
      status: EncounterStatus.TRANSFERRED,
      ward: Ward.ICU,
      transferDate: '2023-02-01',
    });
    expect(result).toEqual({ patient, encounter: updatedEncounter });
  });

  it('throws BadRequestException for A03 when dischargeDate missing', async () => {
    const dto = { adtType: AdtType.A03, cpf: '123' } as any;
    await expect(service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
  });

  it('throws NotFoundException for A03 when no active encounter', async () => {
    const dto = { adtType: AdtType.A03, cpf: '123', dischargeDate: '2023-03-01' } as any;
    const patient = { id: 'p1' } as Patient;
    patientServiceMock.findByCpfOrFail.mockResolvedValue(patient);
    encounterRepositoryMock.findActiveByPatient.mockResolvedValue(undefined);
    await expect(service.processAdtMessage(dto)).rejects.toThrow(NotFoundException);
  });

  it('discharges encounter for A03 when active encounter exists', async () => {
    const dto = { adtType: AdtType.A03, cpf: '123', dischargeDate: '2023-03-01' } as any;
    const patient = { id: 'p1' } as Patient;
    const activeEncounter = { id: 'e1' } as Encounter;
    patientServiceMock.findByCpfOrFail.mockResolvedValue(patient);
    encounterRepositoryMock.findActiveByPatient.mockResolvedValue(activeEncounter);
    const updatedEncounter = { id: 'e1', status: EncounterStatus.DISCHARGED } as Encounter;
    jest.spyOn(service, 'transitionEncounterStatus').mockResolvedValue(updatedEncounter);
    const result = await service.processAdtMessage(dto);
    expect(service.transitionEncounterStatus).toHaveBeenCalledWith('e1', {
      status: EncounterStatus.DISCHARGED,
      dischargeDate: '2023-03-01',
    });
    expect(result).toEqual({ patient, encounter: updatedEncounter });
  });

  it('throws BadRequestException for A08 when no updatable fields provided', async () => {
    const dto = { adtType: AdtType.A08, cpf: '123' } as any;
    await expect(service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
  });

  it('updates patient for A08 with provided fields', async () => {
    const dto = {
      adtType: AdtType.A08,
      cpf: '123',
      name: 'Jane Doe',
      email: 'jane@example.com',
    } as any;
    const patient = { id: 'p1' } as Patient;
    const updatedPatient = { id: 'p1', name: 'Jane Doe', email: 'jane@example.com' } as Patient;
    patientServiceMock.findByCpfOrFail.mockResolvedValue(patient);
    patientServiceMock.updatePatient.mockResolvedValue(updatedPatient);
    const result = await service.processAdtMessage(dto);
    expect(patientServiceMock.updatePatient).toHaveBeenCalledWith('p1', {
      name: 'Jane Doe',
      birthDate: undefined,
      sex: undefined,
      email: 'jane@example.com',
      phone: undefined,
    });
    expect(result).toEqual({ patient: updatedPatient });
  });

  it('throws BadRequestException for unsupported ADT type', async () => {
    const dto = { adtType: 'UNKNOWN' as any, cpf: '123' } as any;
    await expect(service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
  });
});

  describe('updateEncounter', () => {
  it('throws BadRequestException when encounter is discharged', async () => {
    const encounter = {
      id: '1',
      status: EncounterStatus.DISCHARGED,
      ward: Ward.ICU,
      admitDate: new Date(),
      transferDate: null,
    } as unknown as Encounter;
    jest.spyOn(service as any, 'getEncounterById').mockResolvedValue(encounter);
    await expect(
      service.updateEncounter('1', {} as UpdateEncounterDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequestException when admitDate is provided and status is not admitted', async () => {
    const encounter = {
      id: '2',
      status: EncounterStatus.TRANSFERRED,
      ward: Ward.ICU,
      admitDate: new Date(),
      transferDate: null,
    } as unknown as Encounter;
    jest.spyOn(service as any, 'getEncounterById').mockResolvedValue(encounter);
    await expect(
      service.updateEncounter('2', { admitDate: '2023-01-01' } as UpdateEncounterDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequestException when admitDate is in the future', async () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60);
    const encounter = {
      id: '3',
      status: EncounterStatus.ADMITTED,
      ward: Ward.ICU,
      admitDate: new Date(),
      transferDate: null,
    } as unknown as Encounter;
    jest.spyOn(service as any, 'getEncounterById').mockResolvedValue(encounter);
    await expect(
      service.updateEncounter('3', { admitDate: futureDate.toISOString() } as UpdateEncounterDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequestException when admitDate is after transferDate', async () => {
    const transferDate = new Date('2023-01-02');
    const admitDate = new Date('2023-01-03');
    const encounter = {
      id: '4',
      status: EncounterStatus.ADMITTED,
      ward: Ward.ICU,
      admitDate: new Date(),
      transferDate,
    } as unknown as Encounter;
    jest.spyOn(service as any, 'getEncounterById').mockResolvedValue(encounter);
    await expect(
      service.updateEncounter('4', { admitDate: admitDate.toISOString() } as UpdateEncounterDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequestException when ward is unchanged', async () => {
    const encounter = {
      id: '5',
      status: EncounterStatus.ADMITTED,
      ward: Ward.SURGERY,
      admitDate: new Date(),
      transferDate: null,
    } as unknown as Encounter;
    jest.spyOn(service as any, 'getEncounterById').mockResolvedValue(encounter);
    await expect(
      service.updateEncounter('5', { ward: Ward.SURGERY } as UpdateEncounterDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('updates admitDate and ward and saves the encounter', async () => {
    const encounter = {
      id: '6',
      status: EncounterStatus.ADMITTED,
      ward: Ward.EMERGENCY,
      admitDate: new Date('2023-01-01'),
      transferDate: null,
    } as unknown as Encounter;
    jest.spyOn(service as any, 'getEncounterById').mockResolvedValue(encounter);
    const savedEncounter = { ...encounter };
    encounterRepositoryMock.save.mockResolvedValue(savedEncounter);
    const result = await service.updateEncounter('6', {
      admitDate: '2023-01-01',
      ward: Ward.ICU,
    } as UpdateEncounterDto);
    expect(encounter.admitDate.toISOString()).toBe(new Date('2023-01-01').toISOString());
    expect(encounter.ward).toBe(Ward.ICU);
    expect(encounterRepositoryMock.save).toHaveBeenCalledWith(encounter);
    expect(result).toBe(savedEncounter);
  });
});

  describe('buildEncounterSummary', () => {
  it('returns LOW risk when no abnormal results and activeDays <= 7', async () => {
    const encounter = {
      id: 'e1',
      patientId: 'p1',
      admitDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      orders: [],
    } as any;
    const patient = {} as any;
    jest.spyOn(service as any, 'getEncounterById').mockResolvedValue(encounter);
    patientServiceMock.getPatientById.mockResolvedValue(patient);
    const result = await service.buildEncounterSummary('e1');
    expect(result.activeDays).toBeLessThanOrEqual(7);
    expect(result.hasAbnormalResults).toBeFalsy();
    expect(result.riskFlag).toBe('LOW');
    expect(result.orders.total).toBe(0);
    expect(result.results.total).toBe(0);
  });

  it('returns MEDIUM risk when abnormal results exist but activeDays <= 7', async () => {
    const encounter = {
      id: 'e2',
      patientId: 'p2',
      admitDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      orders: [
        {
          status: OrderStatus.PENDING,
          results: [
            {
              status: ResultStatus.FINAL,
              value: '5',
              referenceMin: '10',
              referenceMax: '20',
            },
          ],
        },
      ],
    } as any;
    const patient = {} as any;
    jest.spyOn(service as any, 'getEncounterById').mockResolvedValue(encounter);
    patientServiceMock.getPatientById.mockResolvedValue(patient);
    const result = await service.buildEncounterSummary('e2');
    expect(result.activeDays).toBeLessThanOrEqual(7);
    expect(result.hasAbnormalResults).toBeTruthy();
    expect(result.riskFlag).toBe('MEDIUM');
    expect(result.results.abnormal).toBe(1);
  });

  it('returns MEDIUM risk when no abnormal results but activeDays > 7', async () => {
    const encounter = {
      id: 'e3',
      patientId: 'p3',
      admitDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      orders: [],
    } as any;
    const patient = {} as any;
    jest.spyOn(service as any, 'getEncounterById').mockResolvedValue(encounter);
    patientServiceMock.getPatientById.mockResolvedValue(patient);
    const result = await service.buildEncounterSummary('e3');
    expect(result.activeDays).toBeGreaterThan(7);
    expect(result.hasAbnormalResults).toBeFalsy();
    expect(result.riskFlag).toBe('MEDIUM');
  });

  it('returns HIGH risk when abnormal results exist and activeDays > 7', async () => {
    const encounter = {
      id: 'e4',
      patientId: 'p4',
      admitDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      orders: [
        {
          status: OrderStatus.COMPLETED,
          results: [
            {
              status: ResultStatus.PRELIMINARY,
              value: '30',
              referenceMin: '10',
              referenceMax: '20',
            },
            {
              status: ResultStatus.FINAL,
              value: '5',
              referenceMin: '10',
              referenceMax: '20',
            },
          ],
        },
        {
          status: OrderStatus.CANCELLED,
          results: [],
        },
      ],
    } as any;
    const patient = {} as any;
    jest.spyOn(service as any, 'getEncounterById').mockResolvedValue(encounter);
    patientServiceMock.getPatientById.mockResolvedValue(patient);
    const result = await service.buildEncounterSummary('e4');
    expect(result.activeDays).toBeGreaterThan(7);
    expect(result.hasAbnormalResults).toBeTruthy();
    expect(result.riskFlag).toBe('HIGH');
    expect(result.results.abnormal).toBe(2);
    expect(result.results.preliminary).toBe(1);
    expect(result.orders.total).toBe(2);
    expect(result.orders.completed).toBe(1);
    expect(result.orders.cancelled).toBe(1);
  });
});

  // TESTS_APPEND_HERE
});
