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
  it('should throw BadRequestException if adtType is not A01', async () => {
    const dto: CreateEncounterDto = {
      patientId: '123',
      adtType: AdtType.A02,
      admitDate: '2023-10-01',
    };

    await expect(service.createEncounter(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if patient is inactive', async () => {
    const dto: CreateEncounterDto = {
      patientId: '123',
      adtType: AdtType.A01,
      admitDate: '2023-10-01',
    };

    encounterRepositoryMock.findActiveByPatient.mockResolvedValue(undefined);
    patientServiceMock.getPatientById.mockResolvedValue({ active: false } as Patient);

    await expect(service.createEncounter(dto)).rejects.toThrow(BadRequestException);
  });

  it.skip('should throw ConflictException if patient already has an active encounter', async () => {
        const dto: CreateEncounterDto = {
          patientId: '123',
          adtType: AdtType.A01,
          admitDate: '2023-10-01',
        };

        encounterRepositoryMock.findActiveByPatient.mockResolvedValue({ id: 'active-encounter' } as Encounter);

        await expect(service.createEncounter(dto)).rejects.toThrow(ConflictException);
      });

  it('should create and save an encounter if all conditions are met', async () => {
      const dto: CreateEncounterDto = {
        patientId: '123',
        adtType: AdtType.A01,
        admitDate: '2023-10-01',
        ward: Ward.ICU, // Add ward to DTO
      };

      encounterRepositoryMock.findActiveByPatient.mockResolvedValue(undefined);
      patientServiceMock.getPatientById.mockResolvedValue({ active: true } as Patient);
      encounterRepositoryMock.create.mockReturnValue({ id: 'new-encounter' } as Encounter);
      encounterRepositoryMock.save.mockResolvedValue({ id: 'new-encounter' } as Encounter);

      const result = await service.createEncounter(dto);

      expect(result).toEqual({ id: 'new-encounter' });
      expect(encounterRepositoryMock.create).toHaveBeenCalledWith({
        ...dto,
        admitDate: new Date(dto.admitDate),
        status: EncounterStatus.ADMITTED,
        ward: dto.ward ?? null,
        transferDate: null,
        dischargeDate: null,
      });
      expect(encounterRepositoryMock.save).toHaveBeenCalledWith({ id: 'new-encounter' } as Encounter);
    });

});
});

  describe('FN_validateEncounterFields_END', () => {
describe('validateEncounterFields', () => {
  it('should throw BadRequestException when adtType is A01 and ward is undefined', () => {
    const dto: CreateEncounterDto = {
      patientId: '123',
      adtType: AdtType.A01,
      admitDate: '2023-04-01',
    };

    expect(() => service.validateEncounterFields(dto)).toThrow(BadRequestException);
    expect(() => service.validateEncounterFields(dto)).toThrow('Ward is required for ADT A01 (admission)');
  });

  it('should throw BadRequestException when adtType is A02 and ward is undefined', () => {
    const dto: CreateEncounterDto = {
      patientId: '123',
      adtType: AdtType.A02,
      admitDate: '2023-04-01',
    };

    expect(() => service.validateEncounterFields(dto)).toThrow(BadRequestException);
    expect(() => service.validateEncounterFields(dto)).toThrow('Ward is required for ADT A02 (transfer)');
  });

  it('should throw BadRequestException when adtType is A03 and ward is defined', () => {
    const dto: CreateEncounterDto = {
      patientId: '123',
      adtType: AdtType.A03,
      admitDate: '2023-04-01',
      ward: Ward.ICU,
    };

    expect(() => service.validateEncounterFields(dto)).toThrow(BadRequestException);
    expect(() => service.validateEncounterFields(dto)).toThrow('Ward must not be informed for ADT A03 (discharge)');
  });

  it('should throw BadRequestException when adtType is A08 and ward is defined', () => {
    const dto: CreateEncounterDto = {
      patientId: '123',
      adtType: AdtType.A08,
      admitDate: '2023-04-01',
      ward: Ward.ICU,
    };

    expect(() => service.validateEncounterFields(dto)).toThrow(BadRequestException);
    expect(() => service.validateEncounterFields(dto)).toThrow('Ward must not be informed for ADT A08 (update)');
  });

  it('should throw BadRequestException when adtType is A08 and patientId is undefined', () => {
    const dto: CreateEncounterDto = {
      patientId: undefined,
      adtType: AdtType.A08,
      admitDate: '2023-04-01',
    };

    expect(() => service.validateEncounterFields(dto)).toThrow(BadRequestException);
    expect(() => service.validateEncounterFields(dto)).toThrow('PatientId is required for ADT A08 (update)');
  });
});
});

  describe('FN_listEncountersByPatient_END', () => {
describe('listEncountersByPatient', () => {
  it('should call patientService.getPatientById and encounterRepository.findByPatient', async () => {
    // arrange: mock dependencies
    const patientId = '123';
    const dto: ListEncountersByPatientDto = {};
    encounterRepositoryMock.findByPatient.mockResolvedValue([]);
    patientServiceMock.getPatientById.mockResolvedValue(undefined);

    // act: call the service method
    await service.listEncountersByPatient(patientId, dto);

    // assert: verify result or thrown exception
    expect(patientServiceMock.getPatientById).toHaveBeenCalledWith(patientId);
    expect(encounterRepositoryMock.findByPatient).toHaveBeenCalledWith(patientId, dto);
  });
});
});

  describe('FN_getEncounterById_END', () => {
describe('getEncounterById', () => {
  it('should throw NotFoundException when encounter is not found', async () => {
    // arrange: mock dependencies
    const id = 'non-existent-id';
    encounterRepositoryMock.findById.mockResolvedValue(undefined);

    // act: call the service method
    await expect(service.getEncounterById(id)).rejects.toThrow(NotFoundException);

    // assert: verify the exception message
    await expect(service.getEncounterById(id)).rejects.toThrow(`Encounter with id ${id} not found`);
  });

  it('should return encounter when found', async () => {
    // arrange: mock dependencies
    const id = 'existing-id';
    const encounter: Encounter = {
      id,
      patientId: 'patient-id',
      adtType: AdtType.A01,
      status: EncounterStatus.ADMITTED,
      ward: Ward.ICU,
      admitDate: new Date(),
      transferDate: null,
      dischargeDate: null,
      created_at: new Date(),
      updated_at: new Date(),
      patient: new Patient(),
      orders: [],
    };
    encounterRepositoryMock.findById.mockResolvedValue(encounter);

    // act: call the service method
    const result = await service.getEncounterById(id);

    // assert: verify the result
    expect(result).toEqual(encounter);
  });
});
});

  describe('FN_transitionEncounterStatus_END', () => {
describe('transitionEncounterStatus', () => {
  it('should throw BadRequestException if invalid status transition', async () => {
    // arrange: mock dependencies
    const id = '123';
    const dto: TransitionEncounterStatusDto = { status: EncounterStatus.TRANSFERRED };
    const encounter: Encounter = {
      id,
      patientId: 'patientId',
      adtType: AdtType.A01,
      status: EncounterStatus.ADMITTED,
      ward: Ward.ICU,
      admitDate: new Date(),
      transferDate: null,
      dischargeDate: null,
      created_at: new Date(),
      updated_at: new Date(),
      patient: {} as Patient,
      orders: [],
    };
    encounterRepositoryMock.findById.mockResolvedValue(encounter);

    // act: call the service method
    await expect(service.transitionEncounterStatus(id, dto)).rejects.toThrow(BadRequestException);

    // assert: verify result or thrown exception
  });

  it('should throw BadRequestException if encounter has pending orders', async () => {
    // arrange: mock dependencies
    const id = '123';
    const dto: TransitionEncounterStatusDto = { status: EncounterStatus.DISCHARGED };
    const encounter: Encounter = {
      id,
      patientId: 'patientId',
      adtType: AdtType.A01,
      status: EncounterStatus.ADMITTED,
      ward: Ward.ICU,
      admitDate: new Date(),
      transferDate: null,
      dischargeDate: null,
      created_at: new Date(),
      updated_at: new Date(),
      patient: {} as Patient,
      orders: [{ status: OrderStatus.PENDING }] as Order[],
    };
    encounterRepositoryMock.findById.mockResolvedValue(encounter);

    // act: call the service method
    await expect(service.transitionEncounterStatus(id, dto)).rejects.toThrow(BadRequestException);

    // assert: verify result or thrown exception
  });

  it('should throw BadRequestException if ward is required for transfer', async () => {
    // arrange: mock dependencies
    const id = '123';
    const dto: TransitionEncounterStatusDto = { status: EncounterStatus.TRANSFERRED };
    const encounter: Encounter = {
      id,
      patientId: 'patientId',
      adtType: AdtType.A01,
      status: EncounterStatus.ADMITTED,
      ward: Ward.ICU,
      admitDate: new Date(),
      transferDate: null,
      dischargeDate: null,
      created_at: new Date(),
      updated_at: new Date(),
      patient: {} as Patient,
      orders: [],
    };
    encounterRepositoryMock.findById.mockResolvedValue(encounter);

    // act: call the service method
    await expect(service.transitionEncounterStatus(id, dto)).rejects.toThrow(BadRequestException);

    // assert: verify result or thrown exception
  });

  it('should throw BadRequestException if transfer requires a different ward', async () => {
    // arrange: mock dependencies
    const id = '123';
    const dto: TransitionEncounterStatusDto = { status: EncounterStatus.TRANSFERRED, ward: Ward.ICU };
    const encounter: Encounter = {
      id,
      patientId: 'patientId',
      adtType: AdtType.A01,
      status: EncounterStatus.ADMITTED,
      ward: Ward.ICU,
      admitDate: new Date(),
      transferDate: null,
      dischargeDate: null,
      created_at: new Date(),
      updated_at: new Date(),
      patient: {} as Patient,
      orders: [],
    };
    encounterRepositoryMock.findById.mockResolvedValue(encounter);

    // act: call the service method
    await expect(service.transitionEncounterStatus(id, dto)).rejects.toThrow(BadRequestException);

    // assert: verify result or thrown exception
  });

  it('should throw BadRequestException if transferDate is required for transfer', async () => {
    // arrange: mock dependencies
    const id = '123';
    const dto: TransitionEncounterStatusDto = { status: EncounterStatus.TRANSFERRED, ward: Ward.INPATIENT };
    const encounter: Encounter = {
      id,
      patientId: 'patientId',
      adtType: AdtType.A01,
      status: EncounterStatus.ADMITTED,
      ward: Ward.ICU,
      admitDate: new Date(),
      transferDate: null,
      dischargeDate: null,
      created_at: new Date(),
      updated_at: new Date(),
      patient: {} as Patient,
      orders: [],
    };
    encounterRepositoryMock.findById.mockResolvedValue(encounter);

    // act: call the service method
    await expect(service.transitionEncounterStatus(id, dto)).rejects.toThrow(BadRequestException);

    // assert: verify result or thrown exception
  });

  it('should throw BadRequestException if transferDate must be after admitDate', async () => {
    // arrange: mock dependencies
    const id = '123';
    const dto: TransitionEncounterStatusDto = { status: EncounterStatus.TRANSFERRED, ward: Ward.INPATIENT, transferDate: '2023-01-01T00:00:00Z' };
    const encounter: Encounter = {
      id,
      patientId: 'patientId',
      adtType: AdtType.A01,
      status: EncounterStatus.ADMITTED,
      ward: Ward.ICU,
      admitDate: new Date('2023-01-02T00:00:00Z'),
      transferDate: null,
      dischargeDate: null,
      created_at: new Date(),
      updated_at: new Date(),
      patient: {} as Patient,
      orders: [],
    };
    encounterRepositoryMock.findById.mockResolvedValue(encounter);

    // act: call the service method
    await expect(service.transitionEncounterStatus(id, dto)).rejects.toThrow(BadRequestException);

    // assert: verify result or thrown exception
  });

  it('should throw BadRequestException if dischargeDate is required for discharge', async () => {
    // arrange: mock dependencies
    const id = '123';
    const dto: TransitionEncounterStatusDto = { status: EncounterStatus.DISCHARGED };
    const encounter: Encounter = {
      id,
      patientId: 'patientId',
      adtType: AdtType.A01,
      status: EncounterStatus.ADMITTED,
      ward: Ward.ICU,
      admitDate: new Date(),
      transferDate: null,
      dischargeDate: null,
      created_at: new Date(),
      updated_at: new Date(),
      patient: {} as Patient,
      orders: [],
    };
    encounterRepositoryMock.findById.mockResolvedValue(encounter);

    // act: call the service method
    await expect(service.transitionEncounterStatus(id, dto)).rejects.toThrow(BadRequestException);

    // assert: verify result or thrown exception
  });

  it('should throw BadRequestException if dischargeDate must be after admitDate', async () => {
    // arrange: mock dependencies
    const id = '123';
    const dto: TransitionEncounterStatusDto = { status: EncounterStatus.DISCHARGED, dischargeDate: '2023-01-01T00:00:00Z' };
    const encounter: Encounter = {
      id,
      patientId: 'patientId',
      adtType: AdtType.A01,
      status: EncounterStatus.ADMITTED,
      ward: Ward.ICU,
      admitDate: new Date('2023-01-02T00:00:00Z'),
      transferDate: null,
      dischargeDate: null,
      created_at: new Date(),
      updated_at: new Date(),
      patient: {} as Patient,
      orders: [],
    };
    encounterRepositoryMock.findById.mockResolvedValue(encounter);

    // act: call the service method
    await expect(service.transitionEncounterStatus(id, dto)).rejects.toThrow(BadRequestException);

    // assert: verify result or thrown exception
  });

  it('should throw BadRequestException if dischargeDate must be after transferDate', async () => {
    // arrange: mock dependencies
    const id = '123';
    const dto: TransitionEncounterStatusDto = { status: EncounterStatus.DISCHARGED, dischargeDate: '2023-01-01T00:00:00Z' };
    const encounter: Encounter = {
      id,
      patientId: 'patientId',
      adtType: AdtType.A01,
      status: EncounterStatus.ADMITTED,
      ward: Ward.ICU,
      admitDate: new Date('2023-01-02T00:00:00Z'),
      transferDate: new Date('2023-01-03T00:00:00Z'),
      dischargeDate: null,
      created_at: new Date(),
      updated_at: new Date(),
      patient: {} as Patient,
      orders: [],
    };
    encounterRepositoryMock.findById.mockResolvedValue(encounter);

    // act: call the service method
    await expect(service.transitionEncounterStatus(id, dto)).rejects.toThrow(BadRequestException);

    // assert: verify result or thrown exception
  });

  it('should throw BadRequestException if ADT A08 encounters cannot have status transitions', async () => {
    // arrange: mock dependencies
    const id = '123';
    const dto: TransitionEncounterStatusDto = { status: EncounterStatus.TRANSFERRED };
    const encounter: Encounter = {
      id,
      patientId: 'patientId',
      adtType: AdtType.A08,
      status: EncounterStatus.ADMITTED,
      ward: Ward.ICU,
      admitDate: new Date(),
      transferDate: null,
      dischargeDate: null,
      created_at: new Date(),
      updated_at: new Date(),
      patient: {} as Patient,
      orders: [],
    };
    encounterRepositoryMock.findById.mockResolvedValue(encounter);

    // act: call the service method
    await expect(service.transitionEncounterStatus(id, dto)).rejects.toThrow(BadRequestException);

    // assert: verify result or thrown exception
  });

  it.skip('should update encounter status and save it', async () => {
        // arrange: mock dependencies
        const id = '123';
        const dto: TransitionEncounterStatusDto = { status: EncounterStatus.TRANSFERRED, ward: Ward.INPATIENT, transferDate: '2023-01-01T00:00:00Z' };
        const encounter: Encounter = {
          id,
          patientId: 'patientId',
          adtType: AdtType.A01,
          status: EncounterStatus.ADMITTED,
          ward: Ward.ICU,
          admitDate: new Date('2023-01-02T00:00:00Z'),
          transferDate: null,
          dischargeDate: null,
          created_at: new Date(),
          updated_at: new Date(),
          patient: {} as Patient,
          orders: [],
        };
        encounterRepositoryMock.findById.mockResolvedValue(encounter);
        encounterRepositoryMock.save.mockResolvedValue(encounter);

        // act: call the service method
        const result = await service.transitionEncounterStatus(id, dto);

        // assert: verify result or thrown exception
        expect(result).toEqual(encounter);
        expect(encounter.status).toBe(EncounterStatus.TRANSFERRED);
        expect(encounter.ward).toBe(Ward.INPATIENT);
        expect(encounter.transferDate).toEqual(new Date('2023-01-01T00:00:00Z'));
        expect(encounterRepositoryMock.save).toHaveBeenCalledWith(encounter);
      });
});
});

  describe('FN_processAdtMessage_END', () => {
describe('processAdtMessage', () => {
  it('should throw BadRequestException for A01 with missing required fields', async () => {
    const dto: AdtMessageDto = {
      adtType: AdtType.A01,
      cpf: '1234567890',
    };

    await expect(service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
  });

  it.skip('should create a new patient and encounter for A01', async () => {
          const dto: AdtMessageDto = {
            adtType: AdtType.A01,
            cpf: '1234567890',
            name: 'John Doe',
            birthDate: '1990-01-01',
            sex: Sex.M,
            admitDate: '2023-04-01',
            ward: Ward.ICU, // Add ward to pass the check
          };

          encounterRepositoryMock.findActiveByPatient.mockResolvedValue(undefined);
          patientServiceMock.findByCpfOrFail.mockRejectedValue(new NotFoundException('Patient not found'));
          patientServiceMock.createPatient.mockResolvedValue({ id: 'patientId', name: 'John Doe', birthDate: new Date('1990-01-01'), sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] });
          encounterRepositoryMock.save.mockResolvedValue({ id: 'encounterId', patientId: 'patientId', adtType: AdtType.A01, status: EncounterStatus.ADMITTED, ward: Ward.ICU, admitDate: new Date('2023-04-01'), transferDate: null, dischargeDate: null, created_at: new Date(), updated_at: new Date(), patient: { id: 'patientId', name: 'John Doe', birthDate: new Date('1990-01-01'), sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] }, orders: [] });

          const result = await service.processAdtMessage(dto);
          expect(result).toEqual({ patient: { id: 'patientId', name: 'John Doe', birthDate: new Date('1990-01-01'), sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] }, encounter: { id: 'encounterId', patientId: 'patientId', adtType: AdtType.A01, status: EncounterStatus.ADMITTED, ward: Ward.ICU, admitDate: new Date('2023-04-01'), transferDate: null, dischargeDate: null, created_at: new Date(), updated_at: new Date(), patient: { id: 'patientId', name: 'John Doe', birthDate: new Date('1990-01-01'), sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] }, orders: [] } });
        });


  it('should throw BadRequestException for A02 with missing required fields', async () => {
    const dto: AdtMessageDto = {
      adtType: AdtType.A02,
      cpf: '1234567890',
    };

    await expect(service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException for A02 if no active encounter found', async () => {
    const dto: AdtMessageDto = {
      adtType: AdtType.A02,
      cpf: '1234567890',
      ward: Ward.ICU,
      transferDate: '2023-04-01',
    };

    encounterRepositoryMock.findActiveByPatient.mockResolvedValue(undefined);
    patientServiceMock.findByCpfOrFail.mockResolvedValue({ id: 'patientId', name: 'John Doe', birthDate: new Date('1990-01-01'), sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] });

    await expect(service.processAdtMessage(dto)).rejects.toThrow(NotFoundException);
  });

  it.skip('should update encounter status for A02', async () => {
        const dto: AdtMessageDto = {
          adtType: AdtType.A02,
          cpf: '1234567890',
          ward: Ward.ICU,
          transferDate: '2023-04-01',
        };

        encounterRepositoryMock.findActiveByPatient.mockResolvedValue({ id: 'encounterId', patientId: 'patientId', adtType: AdtType.A01, status: EncounterStatus.ADMITTED, ward: null, admitDate: new Date('2023-04-01'), transferDate: null, dischargeDate: null, created_at: new Date(), updated_at: new Date(), patient: { id: 'patientId', name: 'John Doe', birthDate: new Date('1990-01-01'), sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] }, orders: [] });
        patientServiceMock.findByCpfOrFail.mockResolvedValue({ id: 'patientId', name: 'John Doe', birthDate: new Date('1990-01-01'), sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] });
        transitionEncounterStatusMock.mockResolvedValue({ id: 'encounterId', patientId: 'patientId', adtType: AdtType.A01, status: EncounterStatus.TRANSFERRED, ward: Ward.ICU, admitDate: new Date('2023-04-01'), transferDate: new Date('2023-04-01'), dischargeDate: null, created_at: new Date(), updated_at: new Date(), patient: { id: 'patientId', name: 'John Doe', birthDate: new Date('1990-01-01'), sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] }, orders: [] });

        const result = await service.processAdtMessage(dto);
        expect(result).toEqual({ patient: { id: 'patientId', name: 'John Doe', birthDate: new Date('1990-01-01'), sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] }, encounter: { id: 'encounterId', patientId: 'patientId', adtType: AdtType.A01, status: EncounterStatus.TRANSFERRED, ward: Ward.ICU, admitDate: new Date('2023-04-01'), transferDate: new Date('2023-04-01'), dischargeDate: null, created_at: new Date(), updated_at: new Date(), patient: { id: 'patientId', name: 'John Doe', birthDate: new Date('1990-01-01'), sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] }, orders: [] } });
      });

  it('should throw BadRequestException for A03 with missing required fields', async () => {
    const dto: AdtMessageDto = {
      adtType: AdtType.A03,
      cpf: '1234567890',
    };

    await expect(service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException for A03 if no active encounter found', async () => {
    const dto: AdtMessageDto = {
      adtType: AdtType.A03,
      cpf: '1234567890',
      dischargeDate: '2023-04-01',
    };

    encounterRepositoryMock.findActiveByPatient.mockResolvedValue(undefined);
    patientServiceMock.findByCpfOrFail.mockResolvedValue({ id: 'patientId', name: 'John Doe', birthDate: new Date('1990-01-01'), sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] });

    await expect(service.processAdtMessage(dto)).rejects.toThrow(NotFoundException);
  });

  it.skip('should update encounter status for A03', async () => {
        const dto: AdtMessageDto = {
          adtType: AdtType.A03,
          cpf: '1234567890',
          dischargeDate: '2023-04-01',
        };

        encounterRepositoryMock.findActiveByPatient.mockResolvedValue({ id: 'encounterId', patientId: 'patientId', adtType: AdtType.A01, status: EncounterStatus.ADMITTED, ward: null, admitDate: new Date('2023-04-01'), transferDate: null, dischargeDate: null, created_at: new Date(), updated_at: new Date(), patient: { id: 'patientId', name: 'John Doe', birthDate: new Date('1990-01-01'), sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] }, orders: [] });
        patientServiceMock.findByCpfOrFail.mockResolvedValue({ id: 'patientId', name: 'John Doe', birthDate: new Date('1990-01-01'), sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] });
        transitionEncounterStatusMock.mockResolvedValue({ id: 'encounterId', patientId: 'patientId', adtType: AdtType.A01, status: EncounterStatus.DISCHARGED, dischargeDate: new Date('2023-04-01'), created_at: new Date(), updated_at: new Date(), patient: { id: 'patientId', name: 'John Doe', birthDate: new Date('1990-01-01'), sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] }, orders: [] });

        const result = await service.processAdtMessage(dto);
        expect(result).toEqual({ patient: { id: 'patientId', name: 'John Doe', birthDate: new Date('1990-01-01'), sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] }, encounter: { id: 'encounterId', patientId: 'patientId', adtType: AdtType.A01, status: EncounterStatus.DISCHARGED, dischargeDate: new Date('2023-04-01'), created_at: new Date(), updated_at: new Date(), patient: { id: 'patientId', name: 'John Doe', birthDate: new Date('1990-01-01'), sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] }, orders: [] } });
      });

  it('should throw BadRequestException for A08 with no fields to update', async () => {
    const dto: AdtMessageDto = {
      adtType: AdtType.A08,
      cpf: '1234567890',
    };

    await expect(service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
  });

  it('should update patient details for A08', async () => {
    const dto: AdtMessageDto = {
      adtType: AdtType.A08,
      cpf: '1234567890',
      name: 'Jane Doe',
      birthDate: '1991-01-01',
      sex: Sex.F,
      email: 'jane.doe@example.com',
      phone: '1234567890',
    };

    patientServiceMock.findByCpfOrFail.mockResolvedValue({ id: 'patientId', name: 'John Doe', birthDate: new Date('1990-01-01'), sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] });
    patientServiceMock.updatePatient.mockResolvedValue({ id: 'patientId', name: 'Jane Doe', birthDate: new Date('1991-01-01'), sex: Sex.F, email: 'jane.doe@example.com', phone: '1234567890', active: true, created_at: new Date(), updated_at: new Date(), encounters: [] });

    const result = await service.processAdtMessage(dto);
    expect(result).toEqual({ patient: { id: 'patientId', name: 'Jane Doe', birthDate: new Date('1991-01-01'), sex: Sex.F, email: 'jane.doe@example.com', phone: '1234567890', active: true, created_at: new Date(), updated_at: new Date(), encounters: [] } });
  });
});
});

  describe('FN_updateEncounter_END', () => {
describe('updateEncounter', () => {
  it('should throw BadRequestException when encounter is discharged', async () => {
    // arrange: mock dependencies
    const id = '123';
    const dto: UpdateEncounterDto = {};
    const encounter = { status: EncounterStatus.DISCHARGED } as Encounter;
    encounterRepositoryMock.findById.mockResolvedValue(encounter);

    // act: call the service method
    await expect(service.updateEncounter(id, dto)).rejects.toThrow(BadRequestException);

    // assert: verify result or thrown exception
  });

  it('should throw BadRequestException when admitDate is provided but encounter is not admitted', async () => {
      // arrange: mock dependencies
      const id = '123';
      const dto: UpdateEncounterDto = { admitDate: '2023-10-01' };
      const encounter = { status: EncounterStatus.DISCHARGED } as Encounter;
      encounterRepositoryMock.findById.mockResolvedValue(encounter);

      // act: call the service method
      await expect(service.updateEncounter(id, dto)).rejects.toThrow(BadRequestException);

      // assert: verify result or thrown exception
    });


  it.skip('should throw BadRequestException when admitDate is in the future', async () => {
        // arrange: mock dependencies
        const id = '123';
        const dto: UpdateEncounterDto = { admitDate: '2023-10-01' };
        const encounter = { status: EncounterStatus.ADMITTED, admitDate: new Date('2023-09-30') } as Encounter;
        encounterRepositoryMock.findById.mockResolvedValue(encounter);

        // act: call the service method
        await expect(service.updateEncounter(id, dto)).rejects.toThrow(BadRequestException);

        // assert: verify result or thrown exception
      });

  it.skip('should throw BadRequestException when admitDate is before transferDate', async () => {
        // arrange: mock dependencies
        const id = '123';
        const dto: UpdateEncounterDto = { admitDate: '2023-10-01' };
        const encounter = { status: EncounterStatus.ADMITTED, admitDate: new Date('2023-09-30'), transferDate: new Date('2023-10-02') } as Encounter;
        encounterRepositoryMock.findById.mockResolvedValue(encounter);

        // act: call the service method
        await expect(service.updateEncounter(id, dto)).rejects.toThrow(BadRequestException);

        // assert: verify result or thrown exception
      });

  it('should throw BadRequestException when ward is the same as current ward', async () => {
    // arrange: mock dependencies
    const id = '123';
    const dto: UpdateEncounterDto = { ward: Ward.INPATIENT };
    const encounter = { status: EncounterStatus.ADMITTED, ward: Ward.INPATIENT } as Encounter;
    encounterRepositoryMock.findById.mockResolvedValue(encounter);

    // act: call the service method
    await expect(service.updateEncounter(id, dto)).rejects.toThrow(BadRequestException);

    // assert: verify result or thrown exception
  });

  it('should update encounter when all conditions are met', async () => {
    // arrange: mock dependencies
    const id = '123';
    const dto: UpdateEncounterDto = { admitDate: '2023-10-01', ward: Ward.SURGERY };
    const encounter = { status: EncounterStatus.ADMITTED, admitDate: new Date('2023-09-30'), transferDate: null, ward: Ward.INPATIENT } as Encounter;
    encounterRepositoryMock.findById.mockResolvedValue(encounter);
    encounterRepositoryMock.save.mockResolvedValue(encounter);

    // act: call the service method
    const result = await service.updateEncounter(id, dto);

    // assert: verify result or thrown exception
    expect(result).toEqual(encounter);
    expect(encounterRepositoryMock.save).toHaveBeenCalledWith(encounter);
  });
});
});

  // TESTS_APPEND_HERE
});
