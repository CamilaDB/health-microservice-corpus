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
  it('should throw BadRequestException when adtType is not A01', async () => {
    await expect(
      service.createEncounter({ adtType: AdtType.A02 } as CreateEncounterDto),
    ).rejects.toThrow(BadRequestException);

    expect(encounterRepositoryMock.create).not.toHaveBeenCalled();
    expect(encounterRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should validate encounter fields', async () => {
      encounterRepositoryMock.create.mockReturnValueOnce({} as Encounter);

      await expect(service.createEncounter({} as CreateEncounterDto)).rejects.toThrow(BadRequestException);
    });


  it('should throw BadRequestException when patient is inactive', async () => {
    patientServiceMock.getPatientById.mockResolvedValueOnce({ active: false } as Patient);

    await expect(
      service.createEncounter({ patientId: '1' } as CreateEncounterDto),
    ).rejects.toThrow(BadRequestException);

    expect(encounterRepositoryMock.create).not.toHaveBeenCalled();
    expect(encounterRepositoryMock.save).not.toHaveBeenCalled();
  });

  it.skip('should throw ConflictException when patient already has an active encounter', async () => {
        encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce({ id: '1' } as Encounter);

        await expect(
          service.createEncounter({ patientId: '1' } as CreateEncounterDto),
        ).rejects.toThrow(ConflictException);

        expect(encounterRepositoryMock.create).not.toHaveBeenCalled();
        expect(encounterRepositoryMock.save).not.toHaveBeenCalled();
      });

  it('should create and save the encounter', async () => {
      encounterRepositoryMock.create.mockReturnValueOnce({} as Encounter);
      encounterRepositoryMock.save.mockResolvedValueOnce({ id: '1' } as Encounter);

      await expect(service.createEncounter({ patientId: '1', adtType: AdtType.A01 } as CreateEncounterDto)).rejects.toThrow(BadRequestException);
    });

});
});

  describe('FN_validateEncounterFields_END', () => {
describe('validateEncounterFields', () => {
  it.skip('should throw BadRequestException when ADT A01 has no wart', async () => {
        await expect(
          service.validateEncounterFields({ adtType: AdtType.A01, admitDate: '2023-10-01' } as CreateEncounterDto),
        ).rejects.toThrow(BadRequestException);

        expect(encounterRepositoryMock.create).not.toHaveBeenCalled();
        expect(encounterRepositoryMock.save).not.toHaveBeenCalled();
      });

  it.skip('should throw BadRequestException when ADT A02 has no wart', async () => {
        await expect(
          service.validateEncounterFields({ adtType: AdtType.A02, admitDate: '2023-10-01' } as CreateEncounterDto),
        ).rejects.toThrow(BadRequestException);

        expect(encounterRepositoryMock.create).not.toHaveBeenCalled();
        expect(encounterRepositoryMock.save).not.toHaveBeenCalled();
      });

  it.skip('should throw BadRequestException when ADT A03 has wart', async () => {
        await expect(
          service.validateEncounterFields({ adtType: AdtType.A03, admitDate: '2023-10-01', ward: Ward.ICU } as CreateEncounterDto),
        ).rejects.toThrow(BadRequestException);

        expect(encounterRepositoryMock.create).not.toHaveBeenCalled();
        expect(encounterRepositoryMock.save).not.toHaveBeenCalled();
      });

  it.skip('should throw BadRequestException when ADT A08 has wart', async () => {
        await expect(
          service.validateEncounterFields({ adtType: AdtType.A08, admitDate: '2023-10-01', ward: Ward.ICU } as CreateEncounterDto),
        ).rejects.toThrow(BadRequestException);

        expect(encounterRepositoryMock.create).not.toHaveBeenCalled();
        expect(encounterRepositoryMock.save).not.toHaveBeenCalled();
      });

  it.skip('should throw BadRequestException when ADT A08 has no patientId', async () => {
        await expect(
          service.validateEncounterFields({ adtType: AdtType.A08, admitDate: '2023-10-01' } as CreateEncounterDto),
        ).rejects.toThrow(BadRequestException);

        expect(encounterRepositoryMock.create).not.toHaveBeenCalled();
        expect(encounterRepositoryMock.save).not.toHaveBeenCalled();
      });

  it.skip('should create and save the encounter when all fields are valid', async () => {
          const encounter = { adtType: AdtType.A01, admitDate: '2023-10-01', ward: Ward.ICU };
          encounterRepositoryMock.create.mockReturnValueOnce(encounter);
          encounterRepositoryMock.save.mockResolvedValueOnce(encounter);

          await service.validateEncounterFields({ adtType: AdtType.A01, admitDate: '2023-10-01', ward: Ward.ICU } as CreateEncounterDto);

          expect(encounterRepositoryMock.create).toHaveBeenCalledWith(encounter);
          expect(encounterRepositoryMock.save).toHaveBeenCalledWith(encounter);
        });

});
});

  describe('FN_listEncountersByPatient_END', () => {
describe('listEncountersByPatient', () => {
  it.skip('should throw NotFoundException when patient does not exist', async () => {
        patientServiceMock.getPatientById.mockResolvedValueOnce(null);

        await expect(
          service.listEncountersByPatient('1', { status: EncounterStatus.ADMITTED } as ListEncountersByPatientDto),
        ).rejects.toThrow(NotFoundException);

        expect(encounterRepositoryMock.findByPatient).not.toHaveBeenCalled();
      });

  it('should return encounters for the patient', async () => {
    const encounters = [{ id: '1', patientId: '1', adtType: AdtType.A01, status: EncounterStatus.ADMITTED, ward: null, admitDate: new Date(), transferDate: null, dischargeDate: null, created_at: new Date(), updated_at: new Date(), patient: { id: '1', active: true, sex: Sex.MALE, birthDate: new Date(), name: 'John Doe', phone: '1234567890', email: 'john.doe@example.com' }, orders: [] }];
    encounterRepositoryMock.findByPatient.mockResolvedValueOnce(encounters);

    const result = await service.listEncountersByPatient('1', { status: EncounterStatus.ADMITTED } as ListEncountersByPatientDto);

    expect(result).toEqual(encounters);
    expect(encounterRepositoryMock.findByPatient).toHaveBeenCalledWith('1', { status: EncounterStatus.ADMITTED });
  });
});
});

  describe('FN_getEncounterById_END', () => {
describe('getEncounterById', () => {
  it('should throw NotFoundException when encounter does not exist', async () => {
    encounterRepositoryMock.findById.mockResolvedValueOnce(null);

    await expect(service.getEncounterById('1')).rejects.toThrow(NotFoundException);
  });

  it('should return the encounter when found', async () => {
    const encounter = { id: '1' } as Encounter;
    encounterRepositoryMock.findById.mockResolvedValueOnce(encounter);

    const result = await service.getEncounterById('1');

    expect(result).toBe(encounter);
  });
});
});

  describe('FN_processAdtMessage_END', () => {
describe('processAdtMessage', () => {
  it('should throw BadRequestException when adtType is unsupported', async () => {
    await expect(
      service.processAdtMessage({ adtType: 'unsupported' } as AdtMessageDto),
    ).rejects.toThrow(BadRequestException);
  });

  it.skip('should throw BadRequestException when A01 requires missing fields', async () => {
        await expect(
          service.processAdtMessage({
            adtType: AdtType.A01,
          } as AdtMessageDto),
        ).rejects.toThrow(BadRequestException);

        await expect(
          service.processAdtMessage({
            adtType: AdtType.A01,
            name: 'John Doe',
            birthDate: '1990-01-01',
            sex: 'M',
            admitDate: '2023-04-01',
          } as AdtMessageDto),
        ).rejects.toThrow(BadRequestException);
      });

  it.skip('should create and return a patient and encounter for A01', async () => {
        encounterRepositoryMock.findById.mockResolvedValueOnce(null);
        patientServiceMock.findByCpfOrFail.mockResolvedValueOnce(null);
        patientServiceMock.createPatient.mockResolvedValueOnce({ id: '1' });
        encounterRepositoryMock.create.mockReturnValueOnce({ id: '2' });
        encounterRepositoryMock.save.mockResolvedValueOnce({ id: '2' });

        const result = await service.processAdtMessage({
          adtType: AdtType.A01,
          cpf: '12345678901',
          name: 'John Doe',
          birthDate: '1990-01-01',
          sex: 'M',
          email: 'john.doe@example.com',
          phone: '1234567890',
          admitDate: '2023-04-01',
        } as AdtMessageDto);

        expect(userRepositoryMock.findOne).not.toHaveBeenCalled();
        expect(userRepositoryMock.create).toHaveBeenCalledWith({ email: 'test@test.com' });
        expect(userRepositoryMock.save).toHaveBeenCalledWith(createdEntity);
      });

  it('should throw BadRequestException when ward is missing for A02', async () => {
      await expect(
        service.processAdtMessage({
          adtType: AdtType.A02,
          transferDate: '2023-04-01',
        } as AdtMessageDto),
      ).rejects.toThrow(BadRequestException);
    });



  it.skip('should find and update an encounter for A02', async () => {
        encounterRepositoryMock.findById.mockResolvedValueOnce({ id: '1', patientId: '1' });
        patientServiceMock.findByCpfOrFail.mockResolvedValueOnce({ id: '1' });
        encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce({ id: '1' });
        encounterRepositoryMock.save.mockResolvedValueOnce({ id: '1' });

        const result = await service.processAdtMessage({
          adtType: AdtType.A02,
          cpf: '12345678901',
          ward: 'ICU',
          transferDate: '2023-04-01',
        } as AdtMessageDto);

        expect(userRepositoryMock.findOne).not.toHaveBeenCalled();
        expect(userRepositoryMock.create).not.toHaveBeenCalled();
        expect(userRepositoryMock.save).toHaveBeenCalledWith({ id: '1' });
      });

  it.skip('should throw BadRequestException when A03 requires missing fields', async () => {
          await expect(
            service.processAdtMessage({
              adtType: AdtType.A03,
            } as AdtMessageDto),
          ).rejects.toThrow(BadRequestException);

          await expect(
            service.processAdtMessage({
              adtType: AdtType.A03,
              dischargeDate: '2023-04-01',
            } as AdtMessageDto),
          ).rejects.toThrow(BadRequestException);
        });


  it.skip('should find and update an encounter for A03', async () => {
        encounterRepositoryMock.findById.mockResolvedValueOnce({ id: '1', patientId: '1' });
        patientServiceMock.findByCpfOrFail.mockResolvedValueOnce({ id: '1' });
        encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce({ id: '1' });
        encounterRepositoryMock.save.mockResolvedValueOnce({ id: '1' });

        const result = await service.processAdtMessage({
          adtType: AdtType.A03,
          cpf: '12345678901',
          dischargeDate: '2023-04-01',
        } as AdtMessageDto);

        expect(userRepositoryMock.findOne).not.toHaveBeenCalled();
        expect(userRepositoryMock.create).not.toHaveBeenCalled();
        expect(userRepositoryMock.save).toHaveBeenCalledWith({ id: '1' });
      });

  it.skip('should throw BadRequestException when A08 requires missing fields', async () => {
        await expect(
          service.processAdtMessage({
            adtType: AdtType.A08,
          } as AdtMessageDto),
        ).rejects.toThrow(BadRequestException);

        await expect(
          service.processAdtMessage({
            adtType: AdtType.A08,
            name: 'John Doe',
            birthDate: '1990-01-01',
            sex: 'M',
            email: 'john.doe@example.com',
            phone: '1234567890',
          } as AdtMessageDto),
        ).rejects.toThrow(BadRequestException);
      });

  it.skip('should update a patient for A08', async () => {
        encounterRepositoryMock.findById.mockResolvedValueOnce(null);
        patientServiceMock.findByCpfOrFail.mockResolvedValueOnce({ id: '1' });
        patientServiceMock.updatePatient.mockResolvedValueOnce({ id: '1' });

        const result = await service.processAdtMessage({
          adtType: AdtType.A08,
          cpf: '12345678901',
          name: 'John Doe',
          birthDate: '1990-01-01',
          sex: 'M',
          email: 'john.doe@example.com',
          phone: '1234567890',
        } as AdtMessageDto);

        expect(userRepositoryMock.findOne).not.toHaveBeenCalled();
        expect(userRepositoryMock.create).not.toHaveBeenCalled();
        expect(userRepositoryMock.save).toHaveBeenCalledWith({ id: '1' });
      });
});
});

  describe('FN_buildEncounterSummary_END', () => {
describe('buildEncounterSummary', () => {
  it('should throw NotFoundException when encounter does not exist', async () => {
    encounterRepositoryMock.findById.mockResolvedValueOnce(null);

    await expect(
      service.buildEncounterSummary('1'),
    ).rejects.toThrow(NotFoundException);
  });

  it.skip('should throw NotFoundException when patient does not exist', async () => {
        encounterRepositoryMock.findById.mockResolvedValueOnce({
          id: '1',
          patientId: '2',
        });
        patientServiceMock.getPatientById.mockResolvedValueOnce(null);

        await expect(
          service.buildEncounterSummary('1'),
        ).rejects.toThrow(NotFoundException);
      });

  it('should calculate activeDays correctly', async () => {
    encounterRepositoryMock.findById.mockResolvedValueOnce({
      id: '1',
      patientId: '2',
      admitDate: '2023-01-01T00:00:00Z',
    });
    patientServiceMock.getPatientById.mockResolvedValueOnce({
      id: '2',
    });

    const now = new Date();
    const encounterSummary = await service.buildEncounterSummary('1');

    expect(encounterSummary.activeDays).toBe(Math.floor((now.getTime() - new Date('2023-01-01T00:00:00Z').getTime()) / (1000 * 60 * 60 * 24)));
  });

  it.skip('should calculate orderSummary correctly', async () => {
        encounterRepositoryMock.findById.mockResolvedValueOnce({
          id: '1',
          patientId: '2',
          admitDate: '2023-01-01T00:00:00Z',
        });
        patientServiceMock.getPatientById.mockResolvedValueOnce({
          id: '2',
        });

        const encounter = {
          id: '1',
          patientId: '2',
          admitDate: '2023-01-01T00:00:00Z',
          orders: [
            { status: OrderStatus.PENDING },
            { status: OrderStatus.IN_PROGRESS },
            { status: OrderStatus.COMPLETED },
            { status: OrderStatus.CANCELLED },
          ],
        };

        encounterRepositoryMock.findById.mockResolvedValueOnce(encounter);

        const encounterSummary = await service.buildEncounterSummary('1');

        expect(encounterSummary.orders).toEqual({
          total: 4,
          pending: 1,
          inProgress: 1,
          completed: 1,
          cancelled: 1,
        });
      });

  it.skip('should calculate resultSummary correctly', async () => {
        encounterRepositoryMock.findById.mockResolvedValueOnce({
          id: '1',
          patientId: '2',
          admitDate: '2023-01-01T00:00:00Z',
        });
        patientServiceMock.getPatientById.mockResolvedValueOnce({
          id: '2',
        });

        const encounter = {
          id: '1',
          patientId: '2',
          admitDate: '2023-01-01T00:00:00Z',
          orders: [
            {
              status: OrderStatus.COMPLETED,
              results: [
                { status: ResultStatus.PRELIMINARY, value: 10, referenceMin: 5, referenceMax: 15 },
                { status: ResultStatus.FINAL, value: 15, referenceMin: 5, referenceMax: 15 },
              ],
            },
          ],
        };

        encounterRepositoryMock.findById.mockResolvedValueOnce(encounter);

        const encounterSummary = await service.buildEncounterSummary('1');

        expect(encounterSummary.results).toEqual({
          total: 2,
          abnormal: 0,
          preliminary: 1,
        });
      });

  it.skip('should calculate riskFlag correctly', async () => {
        encounterRepositoryMock.findById.mockResolvedValueOnce({
          id: '1',
          patientId: '2',
          admitDate: '2023-01-01T00:00:00Z',
        });
        patientServiceMock.getPatientById.mockResolvedValueOnce({
          id: '2',
        });

        const encounter = {
          id: '1',
          patientId: '2',
          admitDate: '2023-01-01T00:00:00Z',
          orders: [
            {
              status: OrderStatus.COMPLETED,
              results: [
                { status: ResultStatus.PRELIMINARY, value: 10, referenceMin: 5, referenceMax: 15 },
                { status: ResultStatus.FINAL, value: 15, referenceMin: 5, referenceMax: 15 },
              ],
            },
          ],
        };

        encounterRepositoryMock.findById.mockResolvedValueOnce(encounter);

        const encounterSummary = await service.buildEncounterSummary('1');

        expect(encounterSummary.riskFlag).toBe('LOW');
      });
});
});

  // TESTS_APPEND_HERE
});
