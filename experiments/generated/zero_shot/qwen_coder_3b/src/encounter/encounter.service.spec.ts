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
  it.skip('should throw BadRequestException for invalid ADT type', async () => {
        const dto: CreateEncounterDto = {
          patientId: '123',
          adtType: AdtType.A02,
          admitDate: '2023-01-01',
          ward: Ward.ICU,
        };

        await expect(() => service.createEncounter(dto)).rejects.toThrowError(
          new BadRequestException(
            'Only ADT A01 can create an encounter; use the ADT workflow for A02, A03 and A08',
          ),
        );
      });

  it.skip('should throw BadRequestException for inactive patient', async () => {
        const dto: CreateEncounterDto = {
          patientId: '123',
          adtType: AdtType.A01,
          admitDate: '2023-01-01',
          ward: Ward.ICU,
        };

        patientServiceMock.getPatientById.mockResolvedValueOnce({
          active: false,
        });

        await expect(() => service.createEncounter(dto)).rejects.toThrowError(
          new BadRequestException('Cannot admit an inactive patient'),
        );
      });

  it.skip('should throw ConflictException if patient already has an active encounter', async () => {
        const dto: CreateEncounterDto = {
          patientId: '123',
          adtType: AdtType.A01,
          admitDate: '2023-01-01',
          ward: Ward.ICU,
        };

        const activeEncounter: Encounter = {
          id: '456',
          patientId: '123',
          status: EncounterStatus.ADMITTED,
        };

        encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce(activeEncounter);

        await expect(() => service.createEncounter(dto)).rejects.toThrowError(
          new ConflictException(
            `Patient already has an active encounter (id: ${activeEncounter.id})`,
          ),
        );
      });

  it.skip('should create and save a new encounter', async () => {
        const dto: CreateEncounterDto = {
          patientId: '123',
          adtType: AdtType.A01,
          admitDate: '2023-01-01',
          ward: Ward.ICU,
        };

        encounterRepositoryMock.create.mockReturnValueOnce({
          ...dto,
          admitDate: new Date(dto.admitDate),
          status: EncounterStatus.ADMITTED,
          ward: dto.ward ?? null,
          transferDate: null,
          dischargeDate: null,
        });

        encounterRepositoryMock.save.mockResolvedValueOnce({
          ...dto,
          admitDate: new Date(dto.admitDate),
          status: EncounterStatus.ADMITTED,
          ward: dto.ward ?? null,
          transferDate: null,
          dischargeDate: null,
        });

        const result = await service.createEncounter(dto);

        expect(result).toEqual({
          ...dto,
          admitDate: new Date(dto.admitDate),
          status: EncounterStatus.ADMITTED,
          ward: dto.ward ?? null,
          transferDate: null,
          dischargeDate: null,
        });
      });
});
});

  describe('FN_validateEncounterFields_END', () => {
describe('validateEncounterFields', () => {
  it('should throw BadRequestException for ADT A01 without Wart', () => {
    const dto: CreateEncounterDto = {
      adtType: AdtType.A01,
      ward: undefined,
    };

    expect(() => service.validateEncounterFields(dto)).toThrow(BadRequestException);
  });

  it('should throw BadRequestException for ADT A02 without Wart', () => {
    const dto: CreateEncounterDto = {
      adtType: AdtType.A02,
      ward: undefined,
    };

    expect(() => service.validateEncounterFields(dto)).toThrow(BadRequestException);
  });

  it('should throw BadRequestException for ADT A03 with Wart', () => {
    const dto: CreateEncounterDto = {
      adtType: AdtType.A03,
      ward: Ward.ICU,
    };

    expect(() => service.validateEncounterFields(dto)).toThrow(BadRequestException);
  });

  it('should throw BadRequestException for ADT A08 with Wart', () => {
    const dto: CreateEncounterDto = {
      adtType: AdtType.A08,
      ward: Ward.ICU,
    };

    expect(() => service.validateEncounterFields(dto)).toThrow(BadRequestException);
  });

  it('should throw BadRequestException for ADT A08 without PatientId', () => {
    const dto: CreateEncounterDto = {
      adtType: AdtType.A08,
      ward: undefined,
    };

    expect(() => service.validateEncounterFields(dto)).toThrow(BadRequestException);
  });
})
});

  describe('FN_listEncountersByPatient_END', () => {
describe('listEncountersByPatient', () => {
  it.skip('should return encounters by patient id', async () => {
            const patientId = '123';
            const dto: ListEncountersByPatientDto = { status: EncounterStatus.ADMITTED };

            encounterRepositoryMock.findByPatient.mockResolvedValue([
              {
                id: '1',
                patientId,
                adtType: AdtType.A01,
                status: EncounterStatus.ADMITTED,
                ward: Ward.ICU,
                admitDate: new Date(),
                transferDate: null,
                dischargeDate: null,
                created_at: new Date(),
                updated_at: new Date(),
                patient: {
                  id: '1',
                  cpf: '1234567890',
                  name: 'John Doe',
                  sex: undefined, // Assuming undefined is a valid value for sex
                  birthDate: new Date(),
                  address: '123 Main St',
                  phone: '555-555-5555',
                  email: 'johndoe@example.com',
                  created_at: new Date(),
                  updated_at: new Date(),
                },
                orders: [],
              },
            ]);

            const result = await service.listEncountersByPatient(patientId, dto);

            expect(result).toEqual([
              {
                id: '1',
                patientId,
                adtType: AdtType.A01,
                status: EncounterStatus.ADMITTED,
                ward: Ward.ICU,
                admitDate: new Date(),
                transferDate: null,
                dischargeDate: null,
                created_at: new Date(),
                updated_at: new Date(),
                patient: {
                  id: '1',
                  cpf: '1234567890',
                  name: 'John Doe',
                  sex: undefined, // Assuming undefined is a valid value for sex
                  birthDate: new Date(),
                  address: '123 Main St',
                  phone: '555-555-5555',
                  email: 'johndoe@example.com',
                  created_at: new Date(),
                  updated_at: new Date(),
                },
                orders: [],
              },
            ]);
          });

});
});

  describe('FN_getEncounterById_END', () => {
describe('EncounterService', () => {
  it.skip('should throw NotFoundException when encounter is not found', async () => {
        encounterRepositoryMock.findById.mockResolvedValue(undefined);

        expect(() => service.getEncounterById('123')).rejects.toThrowError(
          new NotFoundException(`Encounter with id 123 not found`),
        );
      });

  it('should return encounter when found', async () => {
    const encounter: Encounter = {
      id: '123',
      patientId: '456',
      adtType: AdtType.A01,
      status: EncounterStatus.ADMITTED,
      ward: Ward.ICU,
      admitDate: new Date(),
      transferDate: null,
      dischargeDate: null,
      created_at: new Date(),
      updated_at: new Date(),
      patient: {
        id: '456',
        name: 'John Doe',
        cpf: '1234567890',
        sex: Sex.MALE,
        birthDate: new Date(),
        address: {
          street: '123 Main St',
          number: '123',
          complement: '',
          district: 'Anytown',
          city: 'Anycity',
          state: 'Anystate',
          zipCode: '12345',
        },
        phone: '1234567890',
        email: 'johndoe@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      orders: [],
    };

    encounterRepositoryMock.findById.mockResolvedValue(encounter);

    expect(await service.getEncounterById('123')).toEqual(encounter);
  });
});
});

  describe('FN_transitionEncounterStatus_END', () => {
describe('transitionEncounterStatus', () => {
  it.skip('should throw BadRequestException if invalid status transition', async () => {
          const encounter = { status: EncounterStatus.ADMITTED } as Encounter;
          const dto = { status: EncounterStatus.DISCHARGED } as TransitionEncounterStatusDto;
          await expect(() => service.transitionEncounterStatus('1', dto)).rejects.toThrow(
            new BadRequestException(
              `Invalid status transition from ADMITTED to DISCHARGED`,
            ),
          );
        });


  it.skip('should throw BadRequestException if discharge with pending orders', async () => {
        const encounter = { status: EncounterStatus.ADMITTED, orders: [{ status: OrderStatus.PENDING }] } as Encounter;
        const dto = { status: EncounterStatus.DISCHARGED } as TransitionEncounterStatusDto;
        await expect(() => service.transitionEncounterStatus('1', dto)).rejects.toThrowError(
          new BadRequestException(
            'Cannot discharge encounter with pending or in-progress orders',
          ),
        );
      });

  it.skip('should throw BadRequestException if transfer requires a different ward', async () => {
        const encounter = { status: EncounterStatus.ADMITTED, ward: Ward.ICU } as Encounter;
        const dto = { status: EncounterStatus.TRANSFERRED, ward: Ward.INPATIENT } as TransitionEncounterStatusDto;
        await expect(() => service.transitionEncounterStatus('1', dto)).rejects.toThrowError(
          new BadRequestException(
            `Transfer requires a different ward. Current ward: ICU`,
          ),
        );
      });

  it.skip('should throw BadRequestException if transferDate is required for transfer', async () => {
        const encounter = { status: EncounterStatus.ADMITTED } as Encounter;
        const dto = { status: EncounterStatus.TRANSFERRED } as TransitionEncounterStatusDto;
        await expect(() => service.transitionEncounterStatus('1', dto)).rejects.toThrowError(
          new BadRequestException('transferDate is required for transfer'),
        );
      });

  it.skip('should throw BadRequestException if transferDate must be after admitDate', async () => {
        const encounter = { status: EncounterStatus.ADMITTED, admitDate: new Date('2023-01-01') } as Encounter;
        const dto = { status: EncounterStatus.TRANSFERRED, transferDate: '2023-01-01' } as TransitionEncounterStatusDto;
        await expect(() => service.transitionEncounterStatus('1', dto)).rejects.toThrowError(
          new BadRequestException('transferDate must be after admitDate'),
        );
      });

  it.skip('should throw BadRequestException if dischargeDate is required for discharge', async () => {
        const encounter = { status: EncounterStatus.ADMITTED } as Encounter;
        const dto = { status: EncounterStatus.DISCHARGED } as TransitionEncounterStatusDto;
        await expect(() => service.transitionEncounterStatus('1', dto)).rejects.toThrowError(
          new BadRequestException('dischargeDate is required for discharge'),
        );
      });

  it.skip('should throw BadRequestException if dischargeDate must be after admitDate', async () => {
        const encounter = { status: EncounterStatus.ADMITTED, admitDate: new Date('2023-01-01') } as Encounter;
        const dto = { status: EncounterStatus.DISCHARGED, dischargeDate: '2023-01-01' } as TransitionEncounterStatusDto;
        await expect(() => service.transitionEncounterStatus('1', dto)).rejects.toThrowError(
          new BadRequestException('dischargeDate must be after admitDate'),
        );
      });

  it.skip('should throw BadRequestException if dischargeDate must be after transferDate', async () => {
        const encounter = { status: EncounterStatus.ADMITTED, admitDate: new Date('2023-01-01'), transferDate: new Date('2023-01-02') } as Encounter;
        const dto = { status: EncounterStatus.DISCHARGED, dischargeDate: '2023-01-01' } as TransitionEncounterStatusDto;
        await expect(() => service.transitionEncounterStatus('1', dto)).rejects.toThrowError(
          new BadRequestException('dischargeDate must be after transferDate'),
        );
      });

  it.skip('should throw BadRequestException if ADT A08 encounters cannot have status transitions', async () => {
        const encounter = { status: EncounterStatus.ADMITTED, adtType: AdtType.A08 } as Encounter;
        const dto = { status: EncounterStatus.TRANSFERRED } as TransitionEncounterStatusDto;
        await expect(() => service.transitionEncounterStatus('1', dto)).rejects.toThrowError(
          new BadRequestException(
            'ADT A08 encounters cannot have status transitions',
          ),
        );
      });

  it.skip('should update encounter status and save it', async () => {
        const encounter = { status: EncounterStatus.ADMITTED } as Encounter;
        const dto = { status: EncounterStatus.TRANSFERRED } as TransitionEncounterStatusDto;
        encounterRepositoryMock.save.mockResolvedValue(encounter);
        await service.transitionEncounterStatus('1', dto);
        expect(encounterRepositoryMock.save).toHaveBeenCalledWith(encounter);
      });
});
});

  describe('FN_processAdtMessage_END', () => {
describe('processAdtMessage', () => {
  it.skip('should throw BadRequestException for A01 with missing fields', async () => {
        const dto: AdtMessageDto = {
          adtType: AdtType.A01,
          cpf: '12345678901',
        };

        await expect(() => service.processAdtMessage(dto)).rejects.toThrowError(
          new BadRequestException('A01 requires: name, birthDate, sex, admitDate'),
        );
      });

  it.skip('should create a new patient and encounter for A01', async () => {
        const dto: AdtMessageDto = {
          adtType: AdtType.A01,
          cpf: '12345678901',
          name: 'John Doe',
          birthDate: '1990-01-01',
          sex: Sex.M,
          admitDate: '2023-01-01',
        };

        encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce(undefined);
        patientServiceMock.findByCpfOrFail.mockResolvedValueOnce(undefined);
        patientServiceMock.createPatient.mockResolvedValueOnce({
          id: 'patientId',
          name: 'John Doe',
          birthDate: new Date('1990-01-01'),
          cpf: '12345678901',
          sex: Sex.M,
          email: null,
          phone: null,
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
          encounters: [],
        });

        const encounter = {
          id: 'encounterId',
          patientId: 'patientId',
          adtType: AdtType.A01,
          status: EncounterStatus.ADMITTED,
          ward: null,
          admitDate: new Date('2023-01-01'),
          transferDate: null,
          dischargeDate: null,
          created_at: new Date(),
          updated_at: new Date(),
          patient: {
            id: 'patientId',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            cpf: '12345678901',
            sex: Sex.M,
            email: null,
            phone: null,
            active: true,
            created_at: new Date(),
            updated_at: new Date(),
            encounters: [],
          },
          orders: [],
        };

        encounterRepositoryMock.save.mockResolvedValueOnce(encounter);

        const result = await service.processAdtMessage(dto);

        expect(result).toEqual({
          patient: {
            id: 'patientId',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            cpf: '12345678901',
            sex: Sex.M,
            email: null,
            phone: null,
            active: true,
            created_at: new Date(),
            updated_at: new Date(),
            encounters: [],
          },
          encounter: encounter,
        });

        expect(encounterRepositoryMock.findActiveByPatient).toHaveBeenCalledWith('patientId');
        expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith('12345678901');
        expect(patientServiceMock.createPatient).toHaveBeenCalledWith({
          cpf: '12345678901',
          name: 'John Doe',
          birthDate: new Date('1990-01-01'),
          sex: Sex.M,
          email: null,
          phone: null,
        });
        expect(encounterRepositoryMock.save).toHaveBeenCalledWith(encounter);
      });

  it.skip('should update an existing patient and encounter for A01', async () => {
        const dto: AdtMessageDto = {
          adtType: AdtType.A01,
          cpf: '12345678901',
          name: 'John Doe',
          birthDate: '1990-01-01',
          sex: Sex.M,
          admitDate: '2023-01-01',
        };

        encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce({
          id: 'encounterId',
          patientId: 'patientId',
          adtType: AdtType.A01,
          status: EncounterStatus.ADMITTED,
          ward: null,
          admitDate: new Date('2023-01-01'),
          transferDate: null,
          dischargeDate: null,
          created_at: new Date(),
          updated_at: new Date(),
          patient: {
            id: 'patientId',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            cpf: '12345678901',
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

        patientServiceMock.updatePatient.mockResolvedValueOnce({
          id: 'patientId',
          name: 'John Doe',
          birthDate: new Date('1990-01-01'),
          cpf: '12345678901',
          sex: Sex.M,
          email: null,
          phone: null,
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
          encounters: [],
        });

        const encounter = {
          id: 'encounterId',
          patientId: 'patientId',
          adtType: AdtType.A01,
          status: EncounterStatus.ADMITTED,
          ward: null,
          admitDate: new Date('2023-01-01'),
          transferDate: null,
          dischargeDate: null,
          created_at: new Date(),
          updated_at: new Date(),
          patient: {
            id: 'patientId',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            cpf: '12345678901',
            sex: Sex.M,
            email: null,
            phone: null,
            active: true,
            created_at: new Date(),
            updated_at: new Date(),
            encounters: [],
          },
          orders: [],
        };

        encounterRepositoryMock.save.mockResolvedValueOnce(encounter);

        const result = await service.processAdtMessage(dto);

        expect(result).toEqual({
          patient: {
            id: 'patientId',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            cpf: '12345678901',
            sex: Sex.M,
            email: null,
            phone: null,
            active: true,
            created_at: new Date(),
            updated_at: new Date(),
            encounters: [],
          },
          encounter: encounter,
        });

        expect(encounterRepositoryMock.findActiveByPatient).toHaveBeenCalledWith('patientId');
        expect(patientServiceMock.updatePatient).toHaveBeenCalledWith('patientId', {
          name: 'John Doe',
          birthDate: new Date('1990-01-01'),
          sex: Sex.M,
          email: null,
          phone: null,
        });
        expect(encounterRepositoryMock.save).toHaveBeenCalledWith(encounter);
      });

  it.skip('should throw BadRequestException for A02 with missing fields', async () => {
        const dto: AdtMessageDto = {
          adtType: AdtType.A02,
          cpf: '12345678901',
        };

        await expect(() => service.processAdtMessage(dto)).rejects.toThrowError(
          new BadRequestException('A02 requires: ward, transferDate'),
        );
      });

  it.skip('should find an active encounter and update it for A02', async () => {
        const dto: AdtMessageDto = {
          adtType: AdtType.A02,
          cpf: '12345678901',
          ward: 'ICU',
          transferDate: '2023-01-01',
        };

        encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce({
          id: 'encounterId',
          patientId: 'patientId',
          adtType: AdtType.A02,
          status: EncounterStatus.ADMITTED,
          ward: null,
          admitDate: new Date('2023-01-01'),
          transferDate: null,
          dischargeDate: null,
          created_at: new Date(),
          updated_at: new Date(),
          patient: {
            id: 'patientId',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            cpf: '12345678901',
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

        const encounter = {
          id: 'encounterId',
          patientId: 'patientId',
          adtType: AdtType.A02,
          status: EncounterStatus.TRANSFERRED,
          ward: 'ICU',
          admitDate: new Date('2023-01-01'),
          transferDate: new Date('2023-01-01'),
          dischargeDate: null,
          created_at: new Date(),
          updated_at: new Date(),
          patient: {
            id: 'patientId',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            cpf: '12345678901',
            sex: Sex.M,
            email: null,
            phone: null,
            active: true,
            created_at: new Date(),
            updated_at: new Date(),
            encounters: [],
          },
          orders: [],
        };

        encounterRepositoryMock.save.mockResolvedValueOnce(encounter);

        const result = await service.processAdtMessage(dto);

        expect(result).toEqual({
          patient: {
            id: 'patientId',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            cpf: '12345678901',
            sex: Sex.M,
            email: null,
            phone: null,
            active: true,
            created_at: new Date(),
            updated_at: new Date(),
            encounters: [],
          },
          encounter: encounter,
        });

        expect(encounterRepositoryMock.findActiveByPatient).toHaveBeenCalledWith('patientId');
        expect(encounterRepositoryMock.save).toHaveBeenCalledWith(encounter);
      });

  it.skip('should throw BadRequestException for A03 with missing fields', async () => {
        const dto: AdtMessageDto = {
          adtType: AdtType.A03,
          cpf: '12345678901',
        };

        await expect(() => service.processAdtMessage(dto)).rejects.toThrowError(
          new BadRequestException('A03 requires: dischargeDate'),
        );
      });

  it.skip('should find an active encounter and update it for A03', async () => {
        const dto: AdtMessageDto = {
          adtType: AdtType.A03,
          cpf: '12345678901',
          dischargeDate: '2023-01-01',
        };

        encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce({
          id: 'encounterId',
          patientId: 'patientId',
          adtType: AdtType.A03,
          status: EncounterStatus.ADMITTED,
          ward: null,
          admitDate: new Date('2023-01-01'),
          transferDate: null,
          dischargeDate: null,
          created_at: new Date(),
          updated_at: new Date(),
          patient: {
            id: 'patientId',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            cpf: '12345678901',
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

        const encounter = {
          id: 'encounterId',
          patientId: 'patientId',
          adtType: AdtType.A03,
          status: EncounterStatus.DISCHARGED,
          ward: null,
          admitDate: new Date('2023-01-01'),
          transferDate: null,
          dischargeDate: new Date('2023-01-01'),
          created_at: new Date(),
          updated_at: new Date(),
          patient: {
            id: 'patientId',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            cpf: '12345678901',
            sex: Sex.M,
            email: null,
            phone: null,
            active: true,
            created_at: new Date(),
            updated_at: new Date(),
            encounters: [],
          },
          orders: [],
        };

        encounterRepositoryMock.save.mockResolvedValueOnce(encounter);

        const result = await service.processAdtMessage(dto);

        expect(result).toEqual({
          patient: {
            id: 'patientId',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            cpf: '12345678901',
            sex: Sex.M,
            email: null,
            phone: null,
            active: true,
            created_at: new Date(),
            updated_at: new Date(),
            encounters: [],
          },
          encounter: encounter,
        });

        expect(encounterRepositoryMock.findActiveByPatient).toHaveBeenCalledWith('patientId');
        expect(encounterRepositoryMock.save).toHaveBeenCalledWith(encounter);
      });

  it.skip('should throw BadRequestException for A08 with missing fields', async () => {
        const dto: AdtMessageDto = {
          adtType: AdtType.A08,
          cpf: '12345678901',
        };

        await expect(() => service.processAdtMessage(dto)).rejects.toThrowError(
          new BadRequestException(
            'A08 requires at least one field to update: name, birthDate, sex, email or phone',
          ),
        );
      });

  it.skip('should update an existing patient and encounter for A08', async () => {
            const dto: AdtMessageDto = {
              adtType: AdtType.A08,
              cpf: '12345678901',
              name: 'John Doe',
              birthDate: '1990-01-01',
              sex: Sex.M,
              email: 'john.doe@example.com',
              phone: '1234567890',
            };

            encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce({
              id: 'encounterId',
              patientId: 'patientId',
              adtType: AdtType.A08,
              status: EncounterStatus.ADMITTED,
              ward: null,
              admitDate: new Date('2023-01-01'),
              transferDate: null,
              dischargeDate: null,
              created_at: new Date(),
              updated_at: new Date(),
              patient: {
                id: 'patientId',
                name: 'John Doe',
                birthDate: new Date('1990-01-01'),
                cpf: '12345678901',
                sex: Sex.M,
                email: 'john.doe@example.com',
                phone: '1234567890',
                active: true,
                created_at: new Date(),
                updated_at: new Date(),
                encounters: [],
              },
              orders: [],
            });

            patientServiceMock.updatePatient.mockResolvedValueOnce({
              id: 'patientId',
              name: 'John Doe',
              birthDate: new Date('1990-01-01'),
              cpf: '12345678901',
              sex: Sex.M,
              email: 'john.doe@example.com',
              phone: '1234567890',
              active: true,
              created_at: new Date(),
              updated_at: new Date(),
              encounters: [],
            });

            const encounter = {
              id: 'encounterId',
              patientId: 'patientId',
              adtType: AdtType.A08,
              status: EncounterStatus.ADMITTED,
              ward: null,
              admitDate: new Date('2023-01-01'),
              transferDate: null,
              dischargeDate: null,
              created_at: new Date(),
              updated_at: new Date(),
              patient: {
                id: 'patientId',
                name: 'John Doe',
                birthDate: new Date('1990-01-01'),
                cpf: '12345678901',
                sex: Sex.M,
                email: 'john.doe@example.com',
                phone: '1234567890',
                active: true,
                created_at: new Date(),
                updated_at: new Date(),
                encounters: [],
              },
              orders: [],
            };

            encounterRepositoryMock.save.mockResolvedValueOnce(encounter);

            const result = await service.processAdtMessage(dto);

            expect(result).toEqual({
              patient: {
                id: 'patientId',
                name: 'John Doe',
                birthDate: new Date('1990-01-01'),
                cpf: '12345678901',
                sex: Sex.M,
                email: 'john.doe@example.com',
                phone: '1234567890',
                active: true,
                created_at: new Date(),
                updated_at: new Date(),
                encounters: [],
              },
              encounter: encounter,
            });

            expect(encounterRepositoryMock.findActiveByPatient).toHaveBeenCalledWith('patientId');
            expect(patientServiceMock.updatePatient).toHaveBeenCalledWith('patientId', {
              name: 'John Doe',
              birthDate: new Date('1990-01-01'),
              sex: Sex.M,
              email: 'john.doe@example.com',
              phone: '1234567890',
            });
            expect(encounterRepositoryMock.save).toHaveBeenCalledWith(encounter);
          });


  it.skip('should throw BadRequestException for unsupported ADT type', async () => {
        const dto: AdtMessageDto = {
          adtType: AdtType.A04,
          cpf: '12345678901',
        };

        await expect(() => service.processAdtMessage(dto)).rejects.toThrowError(
          new BadRequestException(`Unsupported ADT type: ${dto.adtType}`),
        );
      });
});
});

  describe('FN_buildEncounterSummary_END', () => {
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

  it.skip('should build an encounter summary with no abnormal results and no risk flag', async () => {
        const encounter: Encounter = {
          id: '1',
          patientId: '2',
          admitDate: new Date('2023-01-01'),
          orders: [],
        };

        patientServiceMock.getPatientById.mockResolvedValue({
          id: '2',
          name: 'John Doe',
          sex: Sex.MALE,
          birthDate: new Date('1990-01-01'),
        });

        const result = await service.buildEncounterSummary('1');

        expect(result).toEqual({
          encounter,
          patient: {
            id: '2',
            name: 'John Doe',
            sex: Sex.MALE,
            birthDate: new Date('1990-01-01'),
          },
          activeDays: 0,
          orders: { total: 0, pending: 0, inProgress: 0, completed: 0, cancelled: 0 },
          results: { total: 0, abnormal: 0, preliminary: 0 },
          hasAbnormalResults: false,
          riskFlag: 'LOW',
        });
      });

  it.skip('should build an encounter summary with abnormal results and a risk flag of MEDIUM', async () => {
        const encounter: Encounter = {
          id: '1',
          patientId: '2',
          admitDate: new Date('2023-01-01'),
          orders: [
            {
              id: '3',
              status: OrderStatus.PENDING,
              results: [
                {
                  id: '4',
                  status: ResultStatus.PRELIMINARY,
                  value: 10,
                  referenceMin: 5,
                  referenceMax: 15,
                },
              ],
            },
          ],
        };

        patientServiceMock.getPatientById.mockResolvedValue({
          id: '2',
          name: 'John Doe',
          sex: Sex.MALE,
          birthDate: new Date('1990-01-01'),
        });

        const result = await service.buildEncounterSummary('1');

        expect(result).toEqual({
          encounter,
          patient: {
            id: '2',
            name: 'John Doe',
            sex: Sex.MALE,
            birthDate: new Date('1990-01-01'),
          },
          activeDays: 0,
          orders: { total: 1, pending: 1, inProgress: 0, completed: 0, cancelled: 0 },
          results: { total: 1, abnormal: 1, preliminary: 1 },
          hasAbnormalResults: true,
          riskFlag: 'MEDIUM',
        });
      });

  it.skip('should build an encounter summary with abnormal results and a risk flag of HIGH', async () => {
            const encounter: Encounter = {
              id: '1',
              patientId: '2',
              admitDate: new Date('2023-01-01'),
              orders: [
                {
                  id: '3',
                  status: OrderStatus.PENDING,
                  results: [
                    {
                      id: '4',
                      status: ResultStatus.PRELIMINARY,
                      value: 10,
                      referenceMin: 5,
                      referenceMax: 15,
                    },
                  ],
                },
              ],
            };

            patientServiceMock.getPatientById.mockResolvedValue({
              id: '2',
              name: 'John Doe',
              sex: Sex.MALE,
              birthDate: new Date('1990-01-01'),
            });

            const now = new Date();
            const admitDate = new Date('2023-01-01');
            const activeDays = Math.floor(
              (now.getTime() - admitDate.getTime()) / (1000 * 60 * 60 * 24),
            );

            encounterRepositoryMock.findById.mockResolvedValue(encounter);

            const result = await service.buildEncounterSummary('1');

            expect(result).toEqual({
              encounter,
              patient: {
                id: '2',
                name: 'John Doe',
                sex: Sex.MALE,
                birthDate: new Date('1990-01-01'),
              },
              activeDays,
              orders: { total: 1, pending: 1, inProgress: 0, completed: 0, cancelled: 0 },
              results: { total: 1, abnormal: 1, preliminary: 1 },
              hasAbnormalResults: true,
              riskFlag: 'HIGH',
            });
          });

});
});

  // TESTS_APPEND_HERE
});
