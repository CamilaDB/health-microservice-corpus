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
    const dto = { patientId: '123', adtType: AdtType.A01, admitDate: '2023-10-01' };
    jest.spyOn(patientServiceMock, 'getPatientById').mockResolvedValueOnce({ active: false });

    await expect(service.createEncounter(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw ConflictException when patient already has an active encounter', async () => {
    const dto = { patientId: '123', adtType: AdtType.A01, admitDate: '2023-10-01' };
    jest.spyOn(patientServiceMock, 'getPatientById').mockResolvedValueOnce({ active: true });
    jest.spyOn(encounterRepositoryMock, 'findActiveByPatient').mockResolvedValueOnce({ id: '456' });

    await expect(service.createEncounter(dto)).rejects.toThrow(ConflictException);
  });
});
});

  describe('FN_validateEncounterFields_END', () => {
describe('validateEncounterFields', () => {
  it.skip('should throw BadRequestException for ADT A01 with missing wart', async () => {
        const dto = { adtType: AdtType.A01, admitDate: '2023-10-01' };
        await expect(() => service.validateEncounterFields(dto)).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw BadRequestException for ADT A02 with missing wart', async () => {
        const dto = { adtType: AdtType.A02, admitDate: '2023-10-01' };
        await expect(() => service.validateEncounterFields(dto)).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw BadRequestException for ADT A03 with wart', async () => {
        const dto = { adtType: AdtType.A03, admitDate: '2023-10-01', ward: Ward.ICU };
        await expect(() => service.validateEncounterFields(dto)).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw BadRequestException for ADT A08 with wart', async () => {
        const dto = { adtType: AdtType.A08, admitDate: '2023-10-01', ward: Ward.ICU };
        await expect(() => service.validateEncounterFields(dto)).rejects.toThrow(BadRequestException);
      });

  it.skip('should throw BadRequestException for ADT A08 with missing patientId', async () => {
        const dto = { adtType: AdtType.A08, admitDate: '2023-10-01' };
        await expect(() => service.validateEncounterFields(dto)).rejects.toThrow(BadRequestException);
      });
});
});

  describe('FN_listEncountersByPatient_END', () => {
describe('listEncountersByPatient', () => {
  it.skip('should return an empty array when patientId is not found', async () => {
        encounterRepositoryMock.findByPatient.mockResolvedValueOnce(undefined);

        const result = await service.listEncountersByPatient('nonExistentPatientId', new ListEncountersByPatientDto());

        expect(result).toEqual([]);
      });

  it('should return an empty array when patient has no encounters', async () => {
    encounterRepositoryMock.findByPatient.mockResolvedValueOnce([]);

    const result = await service.listEncountersByPatient('patientWithNoEncountersId', new ListEncountersByPatientDto());

    expect(result).toEqual([]);
  });

  it.skip('should throw a NotFoundException when patient is not found', async () => {
        encounterRepositoryMock.findByPatient.mockResolvedValueOnce(undefined);

        await expect(service.listEncountersByPatient('nonExistentPatientId', new ListEncountersByPatientDto())).rejects.toThrow(NotFoundException);
      });
});
});

  describe('FN_getEncounterById_END', () => {
describe('getEncounterById', () => {
  it('should throw NotFoundException when encounter is not found', async () => {
    // arrange: mock dependencies to return undefined for findById
    encounterRepositoryMock.findById.mockResolvedValue(undefined);

    // act: call the service method with a non-existent id
    await expect(service.getEncounterById('nonExistentId')).rejects.toThrow(NotFoundException);
  });
});
});

  describe('FN_transitionEncounterStatus_END', () => {
describe('transitionEncounterStatus', () => {
  it('should throw BadRequestException when invalid status transition is attempted', async () => {
    const encounter = { id: '123', status: EncounterStatus.ADMITTED } as Encounter;
    const dto = { status: EncounterStatus.DISCHARGED } as TransitionEncounterStatusDto;

    jest.spyOn(encounterRepositoryMock, 'findById').mockResolvedValueOnce(encounter);

    await expect(() => service.transitionEncounterStatus('123', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when encounter has pending orders and is discharged', async () => {
    const encounter = { id: '123', status: EncounterStatus.ADMITTED, orders: [{ status: OrderStatus.PENDING }] } as Encounter;
    const dto = { status: EncounterStatus.DISCHARGED } as TransitionEncounterStatusDto;

    jest.spyOn(encounterRepositoryMock, 'findById').mockResolvedValueOnce(encounter);

    await expect(() => service.transitionEncounterStatus('123', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when transfer requires a different ward', async () => {
    const encounter = { id: '123', status: EncounterStatus.ADMITTED, ward: Ward.ICU } as Encounter;
    const dto = { status: EncounterStatus.TRANSFERRED, ward: Ward.INPATIENT } as TransitionEncounterStatusDto;

    jest.spyOn(encounterRepositoryMock, 'findById').mockResolvedValueOnce(encounter);

    await expect(() => service.transitionEncounterStatus('123', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when transferDate is required for transfer', async () => {
    const encounter = { id: '123', status: EncounterStatus.ADMITTED } as Encounter;
    const dto = { status: EncounterStatus.TRANSFERRED } as TransitionEncounterStatusDto;

    jest.spyOn(encounterRepositoryMock, 'findById').mockResolvedValueOnce(encounter);

    await expect(() => service.transitionEncounterStatus('123', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when transferDate must be after admitDate for transfer', async () => {
    const encounter = { id: '123', status: EncounterStatus.ADMITTED, admitDate: new Date() } as Encounter;
    const dto = { status: EncounterStatus.TRANSFERRED, transferDate: new Date().toISOString() } as TransitionEncounterStatusDto;

    jest.spyOn(encounterRepositoryMock, 'findById').mockResolvedValueOnce(encounter);

    await expect(() => service.transitionEncounterStatus('123', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when dischargeDate is required for discharge', async () => {
    const encounter = { id: '123', status: EncounterStatus.ADMITTED } as Encounter;
    const dto = { status: EncounterStatus.DISCHARGED } as TransitionEncounterStatusDto;

    jest.spyOn(encounterRepositoryMock, 'findById').mockResolvedValueOnce(encounter);

    await expect(() => service.transitionEncounterStatus('123', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when dischargeDate must be after admitDate for discharge', async () => {
    const encounter = { id: '123', status: EncounterStatus.ADMITTED, admitDate: new Date() } as Encounter;
    const dto = { status: EncounterStatus.DISCHARGED, dischargeDate: new Date().toISOString() } as TransitionEncounterStatusDto;

    jest.spyOn(encounterRepositoryMock, 'findById').mockResolvedValueOnce(encounter);

    await expect(() => service.transitionEncounterStatus('123', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when dischargeDate must be after transferDate for discharge', async () => {
    const encounter = { id: '123', status: EncounterStatus.ADMITTED, admitDate: new Date(), transferDate: new Date() } as Encounter;
    const dto = { status: EncounterStatus.DISCHARGED, dischargeDate: new Date().toISOString() } as TransitionEncounterStatusDto;

    jest.spyOn(encounterRepositoryMock, 'findById').mockResolvedValueOnce(encounter);

    await expect(() => service.transitionEncounterStatus('123', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when ADT A08 encounters cannot have status transitions', async () => {
    const encounter = { id: '123', adtType: AdtType.A08, status: EncounterStatus.ADMITTED } as Encounter;
    const dto = { status: EncounterStatus.TRANSFERRED } as TransitionEncounterStatusDto;

    jest.spyOn(encounterRepositoryMock, 'findById').mockResolvedValueOnce(encounter);

    await expect(() => service.transitionEncounterStatus('123', dto)).rejects.toThrow(BadRequestException);
  });
});
});

  describe('FN_processAdtMessage_END', () => {
describe('processAdtMessage', () => {
  it('should throw BadRequestException for A01 with missing fields', async () => {
    const dto = new AdtMessageDto();
    dto.adtType = AdtType.A01;

    await expect(() => service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
  });

  it.skip('should create patient and encounter for A01', async () => {
        const dto = new AdtMessageDto();
        dto.adtType = AdtType.A01;
        dto.cpf = '1234567890';
        dto.name = 'John Doe';
        dto.birthDate = '1990-01-01';
        dto.sex = Sex.M;
        dto.admitDate = '2023-04-01';

        patientServiceMock.findByCpfOrFail.mockResolvedValueOnce(null);
        patientServiceMock.createPatient.mockResolvedValueOnce({ id: 'patientId' });
        encounterRepositoryMock.create.mockResolvedValueOnce({ id: 'encounterId', patientId: 'patientId' });

        const result = await service.processAdtMessage(dto);

        expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith('1234567890');
        expect(patientServiceMock.createPatient).toHaveBeenCalledWith({
          cpf: '1234567890',
          name: 'John Doe',
          birthDate: new Date('1990-01-01'),
          sex: Sex.M,
          email: undefined,
          phone: undefined,
        });
        expect(encounterRepositoryMock.create).toHaveBeenCalledWith({
          patientId: 'patientId',
          adtType: AdtType.A01,
          admitDate: new Date('2023-04-01'),
          ward: null,
        });

        expect(result).toEqual({ patient: { id: 'patientId' }, encounter: { id: 'encounterId', patientId: 'patientId' } });
      });

  it('should throw BadRequestException for A02 with missing fields', async () => {
    const dto = new AdtMessageDto();
    dto.adtType = AdtType.A02;

    await expect(() => service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
  });

  it.skip('should find active encounter and update status for A02', async () => {
          const dto = new AdtMessageDto();
          dto.adtType = AdtType.A02;
          dto.cpf = '1234567890';
          dto.ward = 'WartName';
          dto.transferDate = '2023-04-01';

          patientServiceMock.findByCpfOrFail.mockResolvedValueOnce({ id: 'patientId' });
          encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce({ id: 'encounterId', patientId: 'patientId', status: EncounterStatus.ADMITTED });
          transitionEncounterStatusMock.mockResolvedValueOnce({ id: 'encounterId', status: EncounterStatus.TRANSFERRED, ward: dto.wart, transferDate: new Date('2023-04-01') });

          const result = await service.processAdtMessage(dto);

          expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith('1234567890');
          expect(encounterRepositoryMock.findActiveByPatient).toHaveBeenCalledWith('patientId');
          expect(transitionEncounterStatusMock).toHaveBeenCalledWith('encounterId', {
            status: EncounterStatus.TRANSFERRED,
            ward: dto.wart,
            transferDate: new Date('2023-04-01'),
          });

          expect(result).toEqual({ patient: { id: 'patientId' }, encounter: { id: 'encounterId', status: EncounterStatus.TRANSFERRED, ward: dto.wart, transferDate: new Date('2023-04-01') } });
        });



  it('should throw BadRequestException for A03 with missing fields', async () => {
    const dto = new AdtMessageDto();
    dto.adtType = AdtType.A03;

    await expect(() => service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
  });

  it.skip('should find active encounter and update status for A03', async () => {
        const dto = new AdtMessageDto();
        dto.adtType = AdtType.A03;
        dto.cpf = '1234567890';
        dto.dischargeDate = '2023-04-01';

        patientServiceMock.findByCpfOrFail.mockResolvedValueOnce({ id: 'patientId' });
        encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce({ id: 'encounterId', patientId: 'patientId', status: EncounterStatus.ADMITTED });
        transitionEncounterStatusMock.mockResolvedValueOnce({ id: 'encounterId', status: EncounterStatus.DISCHARGED, dischargeDate: new Date('2023-04-01') });

        const result = await service.processAdtMessage(dto);

        expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith('1234567890');
        expect(encounterRepositoryMock.findActiveByPatient).toHaveBeenCalledWith('patientId');
        expect(transitionEncounterStatusMock).toHaveBeenCalledWith('encounterId', {
          status: EncounterStatus.DISCHARGED,
          dischargeDate: new Date('2023-04-01'),
        });

        expect(result).toEqual({ patient: { id: 'patientId' }, encounter: { id: 'encounterId', status: EncounterStatus.DISCHARGED, dischargeDate: new Date('2023-04-01') } });
      });

  it('should update patient for A08 with at least one field', async () => {
    const dto = new AdtMessageDto();
    dto.adtType = AdtType.A08;
    dto.cpf = '1234567890';
    dto.name = 'John Doe';

    patientServiceMock.findByCpfOrFail.mockResolvedValueOnce({ id: 'patientId' });
    patientServiceMock.updatePatient.mockResolvedValueOnce({ id: 'patientId', name: dto.name });

    const result = await service.processAdtMessage(dto);

    expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith('1234567890');
    expect(patientServiceMock.updatePatient).toHaveBeenCalledWith('patientId', {
      name: dto.name,
      birthDate: undefined,
      sex: undefined,
      email: undefined,
      phone: undefined,
    });

    expect(result).toEqual({ patient: { id: 'patientId', name: dto.name } });
  });

  it('should throw BadRequestException for A08 with no fields to update', async () => {
    const dto = new AdtMessageDto();
    dto.adtType = AdtType.A08;

    await expect(() => service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
  });
});
});

  describe('FN_updateEncounter_END', () => {
describe('updateEncounter', () => {
  it('should throw BadRequestException if encounter status is DISCHARGED', async () => {
    const dto = new UpdateEncounterDto();
    encounterRepositoryMock.findById.mockResolvedValue({
      id: '1',
      patientId: '2',
      adtType: AdtType.A01,
      status: EncounterStatus.DISCHARGED,
      ward: Ward.ICU,
      admitDate: new Date(),
      transferDate: null,
      dischargeDate: null,
      created_at: new Date(),
      updated_at: new Date(),
      patient: {} as Patient,
      orders: [],
    });

    await expect(() => service.updateEncounter('1', dto)).rejects.toThrow(BadRequestException);
  });

  it.skip('should throw BadRequestException if admitDate is undefined and encounter status is ADMITTED', async () => {
        const dto = new UpdateEncounterDto();
        encounterRepositoryMock.findById.mockResolvedValue({
          id: '1',
          patientId: '2',
          adtType: AdtType.A01,
          status: EncounterStatus.ADMITTED,
          ward: Ward.ICU,
          admitDate: null,
          transferDate: null,
          dischargeDate: null,
          created_at: new Date(),
          updated_at: new Date(),
          patient: {} as Patient,
          orders: [],
        });

        await expect(() => service.updateEncounter('1', dto)).rejects.toThrow(BadRequestException);
      });

  it('should throw BadRequestException if encounter status is not ADMITTED and admitDate is provided', async () => {
    const dto = new UpdateEncounterDto();
    dto.admitDate = '2023-10-01';
    encounterRepositoryMock.findById.mockResolvedValue({
      id: '1',
      patientId: '2',
      adtType: AdtType.A01,
      status: EncounterStatus.TRANSFERRED,
      ward: Ward.ICU,
      admitDate: null,
      transferDate: null,
      dischargeDate: null,
      created_at: new Date(),
      updated_at: new Date(),
      patient: {} as Patient,
      orders: [],
    });

    await expect(() => service.updateEncounter('1', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if admitDate is a future date', async () => {
    const dto = new UpdateEncounterDto();
    dto.admitDate = '2030-10-01';
    encounterRepositoryMock.findById.mockResolvedValue({
      id: '1',
      patientId: '2',
      adtType: AdtType.A01,
      status: EncounterStatus.ADMITTED,
      ward: Ward.ICU,
      admitDate: null,
      transferDate: null,
      dischargeDate: null,
      created_at: new Date(),
      updated_at: new Date(),
      patient: {} as Patient,
      orders: [],
    });

    await expect(() => service.updateEncounter('1', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if admitDate is after transferDate', async () => {
    const dto = new UpdateEncounterDto();
    dto.admitDate = '2030-10-01';
    encounterRepositoryMock.findById.mockResolvedValue({
      id: '1',
      patientId: '2',
      adtType: AdtType.A01,
      status: EncounterStatus.ADMITTED,
      ward: Ward.ICU,
      admitDate: null,
      transferDate: new Date('2030-09-30'),
      dischargeDate: null,
      created_at: new Date(),
      updated_at: new Date(),
      patient: {} as Patient,
      orders: [],
    });

    await expect(() => service.updateEncounter('1', dto)).rejects.toThrow(BadRequestException);
  });

  it.skip('should throw BadRequestException if ward is provided and encounter status is not ADMITTED', async () => {
        const dto = new UpdateEncounterDto();
        dto.ward = Ward.ICU;
        encounterRepositoryMock.findById.mockResolvedValue({
          id: '1',
          patientId: '2',
          adtType: AdtType.A01,
          status: EncounterStatus.TRANSFERRED,
          ward: null,
          admitDate: null,
          transferDate: null,
          dischargeDate: null,
          created_at: new Date(),
          updated_at: new Date(),
          patient: {} as Patient,
          orders: [],
        });

        await expect(() => service.updateEncounter('1', dto)).rejects.toThrow(BadRequestException);
      });
});
});

  // TESTS_APPEND_HERE
});
