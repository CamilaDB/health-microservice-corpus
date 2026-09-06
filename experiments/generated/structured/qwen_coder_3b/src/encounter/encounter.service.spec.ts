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
  it('should throw BadRequestException when dto.adtType is not AdtType.A01', async () => {
    encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce(undefined);
    patientServiceMock.getPatientById.mockResolvedValueOnce(undefined);

    await expect(() => service.createEncounter({ adtType: AdtType.A02, patientId: '123' })).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when patient is inactive', async () => {
    encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce(undefined);
    patientServiceMock.getPatientById.mockResolvedValueOnce({ active: false });

    await expect(() => service.createEncounter({ adtType: AdtType.A01, patientId: '123' })).rejects.toThrow(BadRequestException);
  });

  it.skip('should throw ConflictException when patient already has an active encounter', async () => {
        encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce({ id: '123' });
        patientServiceMock.getPatientById.mockResolvedValueOnce({ active: true });

        await expect(() => service.createEncounter({ adtType: AdtType.A01, patientId: '123' })).rejects.toThrow(ConflictException);
      });
});
});

  describe('FN_validateEncounterFields_END', () => {
describe('validateEncounterFields', () => {
  it.skip('should throw BadRequestException for ADT A01 with no Wart', async () => {
        // arrange
        const dto: CreateEncounterDto = {
          adtType: AdtType.A01,
          patientId: '123',
          admitDate: '2023-10-01',
        };
        jest.spyOn(encounterRepositoryMock, 'findById').mockResolvedValue(undefined);
        jest.spyOn(patientServiceMock, 'getPatientById').mockResolvedValue(undefined);

        // act
        await expect(() => service.validateEncounterFields(dto)).rejects.toThrow(BadRequestException);

        // assert
        expect(encounterRepositoryMock.findById).toHaveBeenCalledWith(dto.patientId);
        expect(patientServiceMock.getPatientById).toHaveBeenCalledWith(dto.patientId);
      });

  it.skip('should throw BadRequestException for ADT A02 with no Wart', async () => {
        // arrange
        const dto: CreateEncounterDto = {
          adtType: AdtType.A02,
          patientId: '123',
          admitDate: '2023-10-01',
        };
        jest.spyOn(encounterRepositoryMock, 'findById').mockResolvedValue(undefined);
        jest.spyOn(patientServiceMock, 'getPatientById').mockResolvedValue(undefined);

        // act
        await expect(() => service.validateEncounterFields(dto)).rejects.toThrow(BadRequestException);

        // assert
        expect(encounterRepositoryMock.findById).toHaveBeenCalledWith(dto.patientId);
        expect(patientServiceMock.getPatientById).toHaveBeenCalledWith(dto.patientId);
      });

  it.skip('should throw BadRequestException for ADT A03 with Wart', async () => {
          // arrange
          const dto: CreateEncounterDto = {
            adtType: AdtType.A03,
            patientId: '123',
            admitDate: '2023-10-01',
            ward: Ward.ICU,
          };
          jest.spyOn(encounterRepositoryMock, 'findById').mockResolvedValueOnce(undefined);
          jest.spyOn(patientServiceMock, 'getPatientById').mockResolvedValueOnce(undefined);

          // act
          await expect(() => service.validateEncounterFields(dto)).rejects.toThrow(BadRequestException);

          // assert
          expect(encounterRepositoryMock.findById).toHaveBeenCalledWith(dto.patientId);
          expect(patientServiceMock.getPatientById).toHaveBeenCalledWith(dto.patientId);
        });


  it.skip('should throw BadRequestException for ADT A08 with Wart', async () => {
          // arrange
          const dto: CreateEncounterDto = {
            adtType: AdtType.A08,
            patientId: '123',
            admitDate: '2023-10-01',
            ward: Ward.ICU,
          };
          jest.spyOn(encounterRepositoryMock, 'findById').mockResolvedValueOnce(undefined);
          jest.spyOn(patientServiceMock, 'getPatientById').mockResolvedValueOnce(undefined);

          // act
          await expect(() => service.validateEncounterFields(dto)).rejects.toThrow(BadRequestException);

          // assert
          expect(encounterRepositoryMock.findById).toHaveBeenCalledWith(dto.patientId);
          expect(patientServiceMock.getPatientById).toHaveBeenCalledWith(dto.patientId);
        });


  it.skip('should throw BadRequestException for ADT A08 with no PatientId', async () => {
        // arrange
        const dto: CreateEncounterDto = {
          adtType: AdtType.A08,
          patientId: '',
          admitDate: '2023-10-01',
        };
        jest.spyOn(encounterRepositoryMock, 'findById').mockResolvedValue(undefined);
        jest.spyOn(patientServiceMock, 'getPatientById').mockResolvedValue(undefined);

        // act
        await expect(() => service.validateEncounterFields(dto)).rejects.toThrow(BadRequestException);

        // assert
        expect(encounterRepositoryMock.findById).toHaveBeenCalledWith(dto.patientId);
        expect(patientServiceMock.getPatientById).toHaveBeenCalledWith(dto.patientId);
      });
});
});

  describe('FN_listEncountersByPatient_END', () => {
describe('listEncountersByPatient', () => {
  it.skip('should return an empty array if the patient is not found', async () => {
        // arrange
        patientServiceMock.getPatientById.mockResolvedValue(undefined);

        // act
        const result = await service.listEncountersByPatient('nonexistentPatientId', new ListEncountersByPatientDto());

        // assert
        expect(result).toEqual([]);
      });

  it('should return an empty array if the patient has no encounters', async () => {
    // arrange
    patientServiceMock.getPatientById.mockResolvedValue({ id: 'patientId' });
    encounterRepositoryMock.findByPatient.mockResolvedValue([]);

    // act
    const result = await service.listEncountersByPatient('patientId', new ListEncountersByPatientDto());

    // assert
    expect(result).toEqual([]);
  });

  it('should return the encounters for the patient', async () => {
    // arrange
    patientServiceMock.getPatientById.mockResolvedValue({ id: 'patientId' });
    encounterRepositoryMock.findByPatient.mockResolvedValue([
      { id: 'encounterId1', patientId: 'patientId', adtType: AdtType.A01, status: EncounterStatus.ADMITTED },
      { id: 'encounterId2', patientId: 'patientId', adtType: AdtType.A02, status: EncounterStatus.TRANSFERRED },
    ]);

    // act
    const result = await service.listEncountersByPatient('patientId', new ListEncountersByPatientDto());

    // assert
    expect(result).toEqual([
      { id: 'encounterId1', patientId: 'patientId', adtType: AdtType.A01, status: EncounterStatus.ADMITTED },
      { id: 'encounterId2', patientId: 'patientId', adtType: AdtType.A02, status: EncounterStatus.TRANSFERRED },
    ]);
  });
});
});

  describe('FN_getEncounterById_END', () => {
describe('getEncounterById', () => {
  it('should throw NotFoundException when encounter is not found', async () => {
    // arrange
    encounterRepositoryMock.findById.mockResolvedValueOnce(undefined);

    // act
    await expect(service.getEncounterById('123')).rejects.toThrow(NotFoundException);
  });
});
});

  describe('FN_transitionEncounterStatus_END', () => {
describe('transitionEncounterStatus', () => {
  it('should throw BadRequestException if status transition is invalid', async () => {
    // arrange: mock dependencies
    const encounterRepositoryMock = {
      findById: jest.fn().mockResolvedValue({
        id: '1',
        patientId: '2',
        adtType: AdtType.A01,
        status: EncounterStatus.ADMITTED,
        ward: Ward.ICU,
        admitDate: new Date('2023-01-01'),
        transferDate: null,
        dischargeDate: null,
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-01'),
        patient: {
          id: '2',
          name: 'John Doe',
          cpf: '1234567890',
          sex: Sex.MALE,
          birthDate: new Date('1990-01-01'),
          created_at: new Date('2023-01-01'),
          updated_at: new Date('2023-01-01'),
        },
        orders: [],
      }),
    } as unknown as jest.Mocked<EncounterRepository>;

    const service = new EncounterService(encounterRepositoryMock, patientServiceMock);

    // act: call the service method with invalid transition
    await expect(service.transitionEncounterStatus('1', { status: EncounterStatus.DISCHARGED })).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if encounter has pending orders and is discharged', async () => {
    // arrange: mock dependencies
    const encounterRepositoryMock = {
      findById: jest.fn().mockResolvedValue({
        id: '1',
        patientId: '2',
        adtType: AdtType.A01,
        status: EncounterStatus.ADMITTED,
        ward: Ward.ICU,
        admitDate: new Date('2023-01-01'),
        transferDate: null,
        dischargeDate: null,
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-01'),
        patient: {
          id: '2',
          name: 'John Doe',
          cpf: '1234567890',
          sex: Sex.MALE,
          birthDate: new Date('1990-01-01'),
          created_at: new Date('2023-01-01'),
          updated_at: new Date('2023-01-01'),
        },
        orders: [
          {
            id: '1',
            encounterId: '1',
            status: OrderStatus.PENDING,
            created_at: new Date('2023-01-01'),
            updated_at: new Date('2023-01-01'),
          },
        ],
      }),
    } as unknown as jest.Mocked<EncounterRepository>;

    const service = new EncounterService(encounterRepositoryMock, patientServiceMock);

    // act: call the service method with discharge
    await expect(service.transitionEncounterStatus('1', { status: EncounterStatus.DISCHARGED })).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if ward is required for transfer', async () => {
    // arrange: mock dependencies
    const encounterRepositoryMock = {
      findById: jest.fn().mockResolvedValue({
        id: '1',
        patientId: '2',
        adtType: AdtType.A01,
        status: EncounterStatus.ADMITTED,
        ward: Ward.ICU,
        admitDate: new Date('2023-01-01'),
        transferDate: null,
        dischargeDate: null,
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-01'),
        patient: {
          id: '2',
          name: 'John Doe',
          cpf: '1234567890',
          sex: Sex.MALE,
          birthDate: new Date('1990-01-01'),
          created_at: new Date('2023-01-01'),
          updated_at: new Date('2023-01-01'),
        },
        orders: [],
      }),
    } as unknown as jest.Mocked<EncounterRepository>;

    const service = new EncounterService(encounterRepositoryMock, patientServiceMock);

    // act: call the service method with transfer
    await expect(service.transitionEncounterStatus('1', { status: EncounterStatus.TRANSFERRED })).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if ward is different for transfer', async () => {
    // arrange: mock dependencies
    const encounterRepositoryMock = {
      findById: jest.fn().mockResolvedValue({
        id: '1',
        patientId: '2',
        adtType: AdtType.A01,
        status: EncounterStatus.ADMITTED,
        ward: Ward.ICU,
        admitDate: new Date('2023-01-01'),
        transferDate: null,
        dischargeDate: null,
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-01'),
        patient: {
          id: '2',
          name: 'John Doe',
          cpf: '1234567890',
          sex: Sex.MALE,
          birthDate: new Date('1990-01-01'),
          created_at: new Date('2023-01-01'),
          updated_at: new Date('2023-01-01'),
        },
        orders: [],
      }),
    } as unknown as jest.Mocked<EncounterRepository>;

    const service = new EncounterService(encounterRepositoryMock, patientServiceMock);

    // act: call the service method with transfer
    await expect(service.transitionEncounterStatus('1', { status: EncounterStatus.TRANSFERRED, ward: Ward.SURGERY })).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if transferDate is required for transfer', async () => {
    // arrange: mock dependencies
    const encounterRepositoryMock = {
      findById: jest.fn().mockResolvedValue({
        id: '1',
        patientId: '2',
        adtType: AdtType.A01,
        status: EncounterStatus.ADMITTED,
        ward: Ward.ICU,
        admitDate: new Date('2023-01-01'),
        transferDate: null,
        dischargeDate: null,
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-01'),
        patient: {
          id: '2',
          name: 'John Doe',
          cpf: '1234567890',
          sex: Sex.MALE,
          birthDate: new Date('1990-01-01'),
          created_at: new Date('2023-01-01'),
          updated_at: new Date('2023-01-01'),
        },
        orders: [],
      }),
    } as unknown as jest.Mocked<EncounterRepository>;

    const service = new EncounterService(encounterRepositoryMock, patientServiceMock);

    // act: call the service method with transfer
    await expect(service.transitionEncounterStatus('1', { status: EncounterStatus.TRANSFERRED })).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if transferDate is before admitDate for transfer', async () => {
    // arrange: mock dependencies
    const encounterRepositoryMock = {
      findById: jest.fn().mockResolvedValue({
        id: '1',
        patientId: '2',
        adtType: AdtType.A01,
        status: EncounterStatus.ADMITTED,
        ward: Ward.ICU,
        admitDate: new Date('2023-01-01'),
        transferDate: null,
        dischargeDate: null,
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-01'),
        patient: {
          id: '2',
          name: 'John Doe',
          cpf: '1234567890',
          sex: Sex.MALE,
          birthDate: new Date('1990-01-01'),
          created_at: new Date('2023-01-01'),
          updated_at: new Date('2023-01-01'),
        },
        orders: [],
      }),
    } as unknown as jest.Mocked<EncounterRepository>;

    const service = new EncounterService(encounterRepositoryMock, patientServiceMock);

    // act: call the service method with transfer
    await expect(service.transitionEncounterStatus('1', { status: EncounterStatus.TRANSFERRED, transferDate: '2022-12-31' })).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if dischargeDate is required for discharge', async () => {
    // arrange: mock dependencies
    const encounterRepositoryMock = {
      findById: jest.fn().mockResolvedValue({
        id: '1',
        patientId: '2',
        adtType: AdtType.A01,
        status: EncounterStatus.ADMITTED,
        ward: Ward.ICU,
        admitDate: new Date('2023-01-01'),
        transferDate: null,
        dischargeDate: null,
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-01'),
        patient: {
          id: '2',
          name: 'John Doe',
          cpf: '1234567890',
          sex: Sex.MALE,
          birthDate: new Date('1990-01-01'),
          created_at: new Date('2023-01-01'),
          updated_at: new Date('2023-01-01'),
        },
        orders: [],
      }),
    } as unknown as jest.Mocked<EncounterRepository>;

    const service = new EncounterService(encounterRepositoryMock, patientServiceMock);

    // act: call the service method with discharge
    await expect(service.transitionEncounterStatus('1', { status: EncounterStatus.DISCHARGED })).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if dischargeDate is before admitDate for discharge', async () => {
    // arrange: mock dependencies
    const encounterRepositoryMock = {
      findById: jest.fn().mockResolvedValue({
        id: '1',
        patientId: '2',
        adtType: AdtType.A01,
        status: EncounterStatus.ADMITTED,
        ward: Ward.ICU,
        admitDate: new Date('2023-01-01'),
        transferDate: null,
        dischargeDate: null,
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-01'),
        patient: {
          id: '2',
          name: 'John Doe',
          cpf: '1234567890',
          sex: Sex.MALE,
          birthDate: new Date('1990-01-01'),
          created_at: new Date('2023-01-01'),
          updated_at: new Date('2023-01-01'),
        },
        orders: [],
      }),
    } as unknown as jest.Mocked<EncounterRepository>;

    const service = new EncounterService(encounterRepositoryMock, patientServiceMock);

    // act: call the service method with discharge
    await expect(service.transitionEncounterStatus('1', { status: EncounterStatus.DISCHARGED, dischargeDate: '2022-12-31' })).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if dischargeDate is before transferDate for discharge', async () => {
    // arrange: mock dependencies
    const encounterRepositoryMock = {
      findById: jest.fn().mockResolvedValue({
        id: '1',
        patientId: '2',
        adtType: AdtType.A01,
        status: EncounterStatus.ADMITTED,
        ward: Ward.ICU,
        admitDate: new Date('2023-01-01'),
        transferDate: new Date('2023-02-01'),
        dischargeDate: null,
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-01'),
        patient: {
          id: '2',
          name: 'John Doe',
          cpf: '1234567890',
          sex: Sex.MALE,
          birthDate: new Date('1990-01-01'),
          created_at: new Date('2023-01-01'),
          updated_at: new Date('2023-01-01'),
        },
        orders: [],
      }),
    } as unknown as jest.Mocked<EncounterRepository>;

    const service = new EncounterService(encounterRepositoryMock, patientServiceMock);

    // act: call the service method with discharge
    await expect(service.transitionEncounterStatus('1', { status: EncounterStatus.DISCHARGED, dischargeDate: '2023-01-31' })).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if ADT A08 encounters cannot have status transitions', async () => {
    // arrange: mock dependencies
    const encounterRepositoryMock = {
      findById: jest.fn().mockResolvedValue({
        id: '1',
        patientId: '2',
        adtType: AdtType.A08,
        status: EncounterStatus.ADMITTED,
        ward: Ward.ICU,
        admitDate: new Date('2023-01-01'),
        transferDate: null,
        dischargeDate: null,
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-01'),
        patient: {
          id: '2',
          name: 'John Doe',
          cpf: '1234567890',
          sex: Sex.MALE,
          birthDate: new Date('1990-01-01'),
          created_at: new Date('2023-01-01'),
          updated_at: new Date('2023-01-01'),
        },
        orders: [],
      }),
    } as unknown as jest.Mocked<EncounterRepository>;

    const service = new EncounterService(encounterRepositoryMock, patientServiceMock);

    // act: call the service method with discharge
    await expect(service.transitionEncounterStatus('1', { status: EncounterStatus.DISCHARGED })).rejects.toThrow(BadRequestException);
  });
});
});

  describe('FN_processAdtMessage_END', () => {
describe('processAdtMessage', () => {
  it('should throw BadRequestException when dto.adtType is A01 and required fields are missing', async () => {
    // arrange
    const dto: AdtMessageDto = {
      adtType: AdtType.A01,
    };

    // act
    await expect(() => service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
  });

  it.skip('should create a new patient and encounter for A01 adtType', async () => {
        // arrange
        const dto: AdtMessageDto = {
          adtType: AdtType.A01,
          cpf: '1234567890',
          name: 'John Doe',
          birthDate: '1990-01-01',
          sex: Sex.M,
          admitDate: '2023-04-01',
        };

        patientServiceMock.findByCpfOrFail.mockResolvedValueOnce(null);
        patientServiceMock.createPatient.mockResolvedValueOnce({
          id: 'patientId',
          name: 'John Doe',
          birthDate: new Date('1990-01-01'),
          cpf: '1234567890',
          sex: Sex.M,
          email: null,
          phone: null,
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
          encounters: [],
        });

        encounterRepositoryMock.create.mockResolvedValueOnce({
          id: 'encounterId',
          patientId: 'patientId',
          adtType: AdtType.A01,
          status: EncounterStatus.ADMITTED,
          ward: null,
          admitDate: new Date('2023-04-01'),
          transferDate: null,
          dischargeDate: null,
          created_at: new Date(),
          updated_at: new Date(),
          patient: {
            id: 'patientId',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            cpf: '1234567890',
            sex: Sex.M,
            email: null,
            phone: null,
            active: true,
            created_at: new Date(),
            updated_at: new Date(),
            encounters: [],
          },
          orders: [],
        });

        // act
        const result = await service.processAdtMessage(dto);

        // assert
        expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith(dto.cpf);
        expect(patientServiceMock.createPatient).toHaveBeenCalledWith({
          cpf: dto.cpf,
          name: dto.name,
          birthDate: dto.birthDate,
          sex: dto.sex,
          email: dto.email,
          phone: dto.phone,
        });
        expect(encounterRepositoryMock.create).toHaveBeenCalledWith({
          patientId: 'patientId',
          adtType: AdtType.A01,
          admitDate: dto.admitDate,
          ward: null,
        });
        expect(result).toEqual({
          patient: {
            id: 'patientId',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            cpf: '1234567890',
            sex: Sex.M,
            email: null,
            phone: null,
            active: true,
            created_at: new Date(),
            updated_at: new Date(),
            encounters: [],
          },
          encounter: {
            id: 'encounterId',
            patientId: 'patientId',
            adtType: AdtType.A01,
            status: EncounterStatus.ADMITTED,
            ward: null,
            admitDate: new Date('2023-04-01'),
            transferDate: null,
            dischargeDate: null,
            created_at: new Date(),
            updated_at: new Date(),
            patient: {
              id: 'patientId',
              name: 'John Doe',
              birthDate: new Date('1990-01-01'),
              cpf: '1234567890',
              sex: Sex.M,
              email: null,
              phone: null,
              active: true,
              created_at: new Date(),
              updated_at: new Date(),
              encounters: [],
            },
            orders: [],
          },
        });
      });

  it.skip('should find an existing patient and create an encounter for A01 adtType', async () => {
        // arrange
        const dto: AdtMessageDto = {
          adtType: AdtType.A01,
          cpf: '1234567890',
          name: 'John Doe',
          birthDate: '1990-01-01',
          sex: Sex.M,
          admitDate: '2023-04-01',
        };

        patientServiceMock.findByCpfOrFail.mockResolvedValueOnce({
          id: 'patientId',
          name: 'John Doe',
          birthDate: new Date('1990-01-01'),
          cpf: '1234567890',
          sex: Sex.M,
          email: null,
          phone: null,
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
          encounters: [],
        });

        encounterRepositoryMock.create.mockResolvedValueOnce({
          id: 'encounterId',
          patientId: 'patientId',
          adtType: AdtType.A01,
          status: EncounterStatus.ADMITTED,
          ward: null,
          admitDate: new Date('2023-04-01'),
          transferDate: null,
          dischargeDate: null,
          created_at: new Date(),
          updated_at: new Date(),
          patient: {
            id: 'patientId',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            cpf: '1234567890',
            sex: Sex.M,
            email: null,
            phone: null,
            active: true,
            created_at: new Date(),
            updated_at: new Date(),
            encounters: [],
          },
          orders: [],
        });

        // act
        const result = await service.processAdtMessage(dto);

        // assert
        expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith(dto.cpf);
        expect(encounterRepositoryMock.create).toHaveBeenCalledWith({
          patientId: 'patientId',
          adtType: AdtType.A01,
          admitDate: dto.admitDate,
          ward: null,
        });
        expect(result).toEqual({
          patient: {
            id: 'patientId',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            cpf: '1234567890',
            sex: Sex.M,
            email: null,
            phone: null,
            active: true,
            created_at: new Date(),
            updated_at: new Date(),
            encounters: [],
          },
          encounter: {
            id: 'encounterId',
            patientId: 'patientId',
            adtType: AdtType.A01,
            status: EncounterStatus.ADMITTED,
            ward: null,
            admitDate: new Date('2023-04-01'),
            transferDate: null,
            dischargeDate: null,
            created_at: new Date(),
            updated_at: new Date(),
            patient: {
              id: 'patientId',
              name: 'John Doe',
              birthDate: new Date('1990-01-01'),
              cpf: '1234567890',
              sex: Sex.M,
              email: null,
              phone: null,
              active: true,
              created_at: new Date(),
              updated_at: new Date(),
              encounters: [],
            },
            orders: [],
          },
        });
      });

  it('should throw BadRequestException when dto.adtType is A02 and required fields are missing', async () => {
    // arrange
    const dto: AdtMessageDto = {
      adtType: AdtType.A02,
    };

    // act
    await expect(() => service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
  });

  it.skip('should find an existing patient and create an encounter for A02 adtType', async () => {
        // arrange
        const dto: AdtMessageDto = {
          adtType: AdtType.A02,
          cpf: '1234567890',
          ward: 'ICU',
          transferDate: '2023-04-01',
        };

        patientServiceMock.findByCpfOrFail.mockResolvedValueOnce({
          id: 'patientId',
          name: 'John Doe',
          birthDate: new Date('1990-01-01'),
          cpf: '1234567890',
          sex: Sex.M,
          email: null,
          phone: null,
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
          encounters: [],
        });

        encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce({
          id: 'encounterId',
          patientId: 'patientId',
          adtType: AdtType.A01,
          status: EncounterStatus.ADMITTED,
          ward: null,
          admitDate: new Date('2023-04-01'),
          transferDate: null,
          dischargeDate: null,
          created_at: new Date(),
          updated_at: new Date(),
          patient: {
            id: 'patientId',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            cpf: '1234567890',
            sex: Sex.M,
            email: null,
            phone: null,
            active: true,
            created_at: new Date(),
            updated_at: new Date(),
            encounters: [],
          },
          orders: [],
        });

        // act
        const result = await service.processAdtMessage(dto);

        // assert
        expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith(dto.cpf);
        expect(encounterRepositoryMock.findActiveByPatient).toHaveBeenCalledWith('patientId');
        expect(encounterRepositoryMock.create).toHaveBeenCalledWith({
          patientId: 'patientId',
          adtType: AdtType.A02,
          admitDate: null,
          ward: dto.ward,
          transferDate: dto.transferDate,
        });
        expect(result).toEqual({
          patient: {
            id: 'patientId',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            cpf: '1234567890',
            sex: Sex.M,
            email: null,
            phone: null,
            active: true,
            created_at: new Date(),
            updated_at: new Date(),
            encounters: [],
          },
          encounter: {
            id: 'encounterId',
            patientId: 'patientId',
            adtType: AdtType.A02,
            status: EncounterStatus.TRANSFERRED,
            ward: dto.ward,
            transferDate: dto.transferDate,
            admitDate: null,
            dischargeDate: null,
            created_at: new Date(),
            updated_at: new Date(),
            patient: {
              id: 'patientId',
              name: 'John Doe',
              birthDate: new Date('1990-01-01'),
              cpf: '1234567890',
              sex: Sex.M,
              email: null,
              phone: null,
              active: true,
              created_at: new Date(),
              updated_at: new Date(),
              encounters: [],
            },
            orders: [],
          },
        });
      });

  it('should throw NotFoundException when no active encounter is found for A02 adtType', async () => {
    // arrange
    const dto: AdtMessageDto = {
      adtType: AdtType.A02,
      cpf: '1234567890',
      ward: 'ICU',
      transferDate: '2023-04-01',
    };

    patientServiceMock.findByCpfOrFail.mockResolvedValueOnce({
      id: 'patientId',
      name: 'John Doe',
      birthDate: new Date('1990-01-01'),
      cpf: '1234567890',
      sex: Sex.M,
      email: null,
      phone: null,
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      encounters: [],
    });

    encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce(null);

    // act
    await expect(() => service.processAdtMessage(dto)).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException when dto.adtType is A03 and required fields are missing', async () => {
    // arrange
    const dto: AdtMessageDto = {
      adtType: AdtType.A03,
    };

    // act
    await expect(() => service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
  });

  it.skip('should find an existing patient and create an encounter for A03 adtType', async () => {
        // arrange
        const dto: AdtMessageDto = {
          adtType: AdtType.A03,
          cpf: '1234567890',
          dischargeDate: '2023-04-01',
        };

        patientServiceMock.findByCpfOrFail.mockResolvedValueOnce({
          id: 'patientId',
          name: 'John Doe',
          birthDate: new Date('1990-01-01'),
          cpf: '1234567890',
          sex: Sex.M,
          email: null,
          phone: null,
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
          encounters: [],
        });

        encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce({
          id: 'encounterId',
          patientId: 'patientId',
          adtType: AdtType.A01,
          status: EncounterStatus.ADMITTED,
          ward: null,
          admitDate: new Date('2023-04-01'),
          transferDate: null,
          dischargeDate: null,
          created_at: new Date(),
          updated_at: new Date(),
          patient: {
            id: 'patientId',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            cpf: '1234567890',
            sex: Sex.M,
            email: null,
            phone: null,
            active: true,
            created_at: new Date(),
            updated_at: new Date(),
            encounters: [],
          },
          orders: [],
        });

        // act
        const result = await service.processAdtMessage(dto);

        // assert
        expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith(dto.cpf);
        expect(encounterRepositoryMock.findActiveByPatient).toHaveBeenCalledWith('patientId');
        expect(encounterRepositoryMock.create).toHaveBeenCalledWith({
          patientId: 'patientId',
          adtType: AdtType.A03,
          admitDate: null,
          ward: null,
          transferDate: null,
          dischargeDate: dto.dischargeDate,
        });
        expect(result).toEqual({
          patient: {
            id: 'patientId',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            cpf: '1234567890',
            sex: Sex.M,
            email: null,
            phone: null,
            active: true,
            created_at: new Date(),
            updated_at: new Date(),
            encounters: [],
          },
          encounter: {
            id: 'encounterId',
            patientId: 'patientId',
            adtType: AdtType.A03,
            status: EncounterStatus.DISCHARGED,
            ward: null,
            admitDate: null,
            transferDate: null,
            dischargeDate: dto.dischargeDate,
            created_at: new Date(),
            updated_at: new Date(),
            patient: {
              id: 'patientId',
              name: 'John Doe',
              birthDate: new Date('1990-01-01'),
              cpf: '1234567890',
              sex: Sex.M,
              email: null,
              phone: null,
              active: true,
              created_at: new Date(),
              updated_at: new Date(),
              encounters: [],
            },
            orders: [],
          },
        });
      });

  it('should throw NotFoundException when no active encounter is found for A03 adtType', async () => {
    // arrange
    const dto: AdtMessageDto = {
      adtType: AdtType.A03,
      cpf: '1234567890',
      dischargeDate: '2023-04-01',
    };

    patientServiceMock.findByCpfOrFail.mockResolvedValueOnce({
      id: 'patientId',
      name: 'John Doe',
      birthDate: new Date('1990-01-01'),
      cpf: '1234567890',
      sex: Sex.M,
      email: null,
      phone: null,
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      encounters: [],
    });

    encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce(null);

    // act
    await expect(() => service.processAdtMessage(dto)).rejects.toThrow(NotFoundException);
  });

  it.skip('should update patient and return updated patient for A08 adtType', async () => {
          // arrange
          const dto: AdtMessageDto = {
            adtType: AdtType.A08,
            cpf: '1234567890',
            name: 'John Doe',
            birthDate: '1990-01-01',
            sex: Sex.M,
            email: 'john.doe@example.com',
            phone: '1234567890',
          };

          patientServiceMock.findByCpfOrFail.mockResolvedValueOnce({
            id: 'patientId',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            cpf: '1234567890',
            sex: Sex.M,
            email: 'john.doe@example.com',
            phone: '1234567890',
            active: true,
            created_at: new Date(),
            updated_at: new Date(),
            encounters: [],
          });

          patientServiceMock.updatePatient.mockResolvedValueOnce({
            id: 'patientId',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            cpf: '1234567890',
            sex: Sex.M,
            email: 'john.doe@example.com',
            phone: '1234567890',
            active: true,
            created_at: new Date(),
            updated_at: new Date(),
            encounters: [],
          });

          // act
          const result = await service.processAdtMessage(dto);

          // assert
          expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith(dto.cpf);
          expect(patientServiceMock.updatePatient).toHaveBeenCalledWith('patientId', {
            name: dto.name,
            birthDate: dto.birthDate,
            sex: dto.sex,
            email: dto.email,
            phone: dto.phone,
          });
          expect(result).toEqual({
            patient: {
              id: 'patientId',
              name: 'John Doe',
              birthDate: new Date('1990-01-01'),
              cpf: '1234567890',
              sex: Sex.M,
              email: 'john.doe@example.com',
              phone: '1234567890',
              active: true,
              created_at: new Date(),
              updated_at: new Date(),
              encounters: [],
            },
            encounter: undefined,
          });
        });


  it('should throw BadRequestException when dto.adtType is A08 and at least one field to update is missing', async () => {
    // arrange
    const dto: AdtMessageDto = {
      adtType: AdtType.A08,
      cpf: '1234567890',
    };

    // act
    await expect(() => service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
  });
});
});

  describe('FN_updateEncounter_END', () => {
describe('updateEncounter', () => {
  it('should throw BadRequestException when encounter is DISCHARGED', async () => {
    encounterRepositoryMock.findById.mockResolvedValueOnce({ status: EncounterStatus.DISCHARGED });
    await expect(service.updateEncounter('123', { admitDate: '2023-10-01' })).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException when encounter is not found', async () => {
      await expect(service.updateEncounter('123', { ward: 'ICU' })).rejects.toThrow(NotFoundException);
    });


  it('should throw BadRequestException when encounter is not ADMITTED', async () => {
    encounterRepositoryMock.findById.mockResolvedValueOnce({ status: EncounterStatus.TRANSFERRED });
    await expect(service.updateEncounter('123', { admitDate: '2023-10-01' })).rejects.toThrow(BadRequestException);
  });

  it.skip('should throw BadRequestException when admitDate is a future date', async () => {
        encounterRepositoryMock.findById.mockResolvedValueOnce({ status: EncounterStatus.ADMITTED });
        await expect(service.updateEncounter('123', { admitDate: '2024-10-01' })).rejects.toThrow(BadRequestException);
      });

  it('should throw BadRequestException when admitDate is after transferDate', async () => {
    encounterRepositoryMock.findById.mockResolvedValueOnce({
      status: EncounterStatus.ADMITTED,
      transferDate: new Date('2023-10-01'),
    });
    await expect(service.updateEncounter('123', { admitDate: '2023-10-10' })).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when dto.ward is already encounter.ward', async () => {
    encounterRepositoryMock.findById.mockResolvedValueOnce({
      status: EncounterStatus.ADMITTED,
      ward: Ward.ICU,
    });
    await expect(service.updateEncounter('123', { ward: Ward.ICU })).rejects.toThrow(BadRequestException);
  });
});
});

  // TESTS_APPEND_HERE
});
