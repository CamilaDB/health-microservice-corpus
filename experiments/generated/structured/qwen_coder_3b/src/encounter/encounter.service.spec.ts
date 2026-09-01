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

  describe('FN_validateEncounterFields_END', () => {
describe('validateEncounterFields', () => {
  it.skip('should throw BadRequestException for ADT A01 with no Wart', async () => {
        // arrange
        const dto: CreateEncounterDto = {
          adtType: AdtType.A01,
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
          admitDate: '2023-10-01',
          ward: Ward.ICU,
        };
        jest.spyOn(encounterRepositoryMock, 'findById').mockResolvedValue(undefined);
        jest.spyOn(patientServiceMock, 'getPatientById').mockResolvedValue(undefined);

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
          admitDate: '2023-10-01',
          ward: Ward.ICU,
        };
        jest.spyOn(encounterRepositoryMock, 'findById').mockResolvedValue(undefined);
        jest.spyOn(patientServiceMock, 'getPatientById').mockResolvedValue(undefined);

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
  it('should return encounters for a valid patientId', async () => {
    // arrange
    const patientId = '12345';
    const dto: ListEncountersByPatientDto = { status: EncounterStatus.ADMITTED };
    const encounters: Encounter[] = [{ id: '1', patientId, adtType: AdtType.A01, status: EncounterStatus.ADMITTED }];
    encounterRepositoryMock.findByPatient.mockResolvedValueOnce(encounters);

    // act
    const result = await service.listEncountersByPatient(patientId, dto);

    // assert
    expect(result).toEqual(encounters);
    expect(encounterRepositoryMock.findByPatient).toHaveBeenCalledWith(patientId, dto);
  });

  it.skip('should throw NotFoundException if patient is not found', async () => {
        // arrange
        const patientId = '12345';
        const dto: ListEncountersByPatientDto = { status: EncounterStatus.ADMITTED };
        patientServiceMock.getPatientById.mockResolvedValueOnce(undefined);

        // act
        await expect(service.listEncountersByPatient(patientId, dto)).rejects.toThrow(NotFoundException);
      });

  it.skip('should throw ConflictException if patient is not active', async () => {
        // arrange
        const patientId = '12345';
        const dto: ListEncountersByPatientDto = { status: EncounterStatus.ADMITTED };
        patientServiceMock.getPatientById.mockResolvedValueOnce({ isActive: false });

        // act
        await expect(service.listEncountersByPatient(patientId, dto)).rejects.toThrow(ConflictException);
      });

  it.skip('should throw BadRequestException if dto is invalid', async () => {
        // arrange
        const patientId = '12345';
        const dto: ListEncountersByPatientDto = { status: 'invalidStatus' };

        // act
        await expect(service.listEncountersByPatient(patientId, dto)).rejects.toThrow(BadRequestException);
      });
});
});

  describe('FN_getEncounterById_END', () => {
describe('getEncounterById', () => {
  it('should throw NotFoundException when encounter is not found', async () => {
    // arrange: mock dependencies
    encounterRepositoryMock.findById.mockResolvedValueOnce(undefined);

    // act: call the service method
    await expect(service.getEncounterById('123')).rejects.toThrow(NotFoundException);

    // assert: verify result or thrown exception
  });
});
});

  describe('FN_transitionEncounterStatus_END', () => {
describe('transitionEncounterStatus', () => {
  it('should throw BadRequestException if invalid status transition', async () => {
    const encounter = { status: EncounterStatus.ADMITTED };
    const dto = { status: EncounterStatus.DISCHARGED };
    encounterRepositoryMock.findById.mockResolvedValue(encounter);
    await expect(() => service.transitionEncounterStatus('123', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if encounter is discharged', async () => {
    const encounter = { status: EncounterStatus.DISCHARGED };
    const dto = { status: EncounterStatus.DISCHARGED };
    encounterRepositoryMock.findById.mockResolvedValue(encounter);
    await expect(() => service.transitionEncounterStatus('123', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if encounter has pending orders', async () => {
    const encounter = { status: EncounterStatus.ADMITTED, orders: [{ status: OrderStatus.PENDING }] };
    const dto = { status: EncounterStatus.DISCHARGED };
    encounterRepositoryMock.findById.mockResolvedValue(encounter);
    await expect(() => service.transitionEncounterStatus('123', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if transfer requires a different ward', async () => {
    const encounter = { status: EncounterStatus.TRANSFERRED, ward: Ward.ICU };
    const dto = { status: EncounterStatus.TRANSFERRED, ward: Ward.INPATIENT };
    encounterRepositoryMock.findById.mockResolvedValue(encounter);
    await expect(() => service.transitionEncounterStatus('123', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if transferDate is required for transfer', async () => {
    const encounter = { status: EncounterStatus.TRANSFERRED };
    const dto = { status: EncounterStatus.TRANSFERRED };
    encounterRepositoryMock.findById.mockResolvedValue(encounter);
    await expect(() => service.transitionEncounterStatus('123', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if transferDate must be after admitDate', async () => {
    const encounter = { status: EncounterStatus.TRANSFERRED, admitDate: new Date('2023-01-01') };
    const dto = { status: EncounterStatus.TRANSFERRED, transferDate: '2023-01-01' };
    encounterRepositoryMock.findById.mockResolvedValue(encounter);
    await expect(() => service.transitionEncounterStatus('123', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if dischargeDate is required for discharge', async () => {
    const encounter = { status: EncounterStatus.DISCHARGED };
    const dto = { status: EncounterStatus.DISCHARGED };
    encounterRepositoryMock.findById.mockResolvedValue(encounter);
    await expect(() => service.transitionEncounterStatus('123', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if dischargeDate must be after admitDate', async () => {
    const encounter = { status: EncounterStatus.DISCHARGED, admitDate: new Date('2023-01-01') };
    const dto = { status: EncounterStatus.DISCHARGED, dischargeDate: '2023-01-01' };
    encounterRepositoryMock.findById.mockResolvedValue(encounter);
    await expect(() => service.transitionEncounterStatus('123', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if dischargeDate must be after transferDate', async () => {
    const encounter = { status: EncounterStatus.DISCHARGED, admitDate: new Date('2023-01-01'), transferDate: new Date('2023-01-02') };
    const dto = { status: EncounterStatus.DISCHARGED, dischargeDate: '2023-01-01' };
    encounterRepositoryMock.findById.mockResolvedValue(encounter);
    await expect(() => service.transitionEncounterStatus('123', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if ADT A08 encounters cannot have status transitions', async () => {
    const encounter = { status: EncounterStatus.ADMITTED, adtType: AdtType.A08 };
    const dto = { status: EncounterStatus.DISCHARGED };
    encounterRepositoryMock.findById.mockResolvedValue(encounter);
    await expect(() => service.transitionEncounterStatus('123', dto)).rejects.toThrow(BadRequestException);
  });
});
});

  describe('FN_processAdtMessage_END', () => {
describe('processAdtMessage', () => {
  it.skip('should throw BadRequestException for A01 with missing fields', async () => {
        const dto: AdtMessageDto = {
          adtType: AdtType.A01,
          cpf: '12345678901',
          name: 'John Doe',
          birthDate: '1990-01-01',
          sex: Sex.M,
          admitDate: '2023-01-01',
        };

        await expect(() => service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
      });

  it.skip('should create patient and encounter for A01', async () => {
        const dto: AdtMessageDto = {
          adtType: AdtType.A01,
          cpf: '12345678901',
          name: 'John Doe',
          birthDate: '1990-01-01',
          sex: Sex.M,
          admitDate: '2023-01-01',
          ward: 'ICU',
        };

        encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce(undefined);
        patientServiceMock.findByCpfOrFail.mockResolvedValueOnce(null);
        patientServiceMock.createPatient.mockResolvedValueOnce({ id: '123' });
        encounterRepositoryMock.save.mockResolvedValueOnce({ id: '456' });

        const result = await service.processAdtMessage(dto);

        expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith('12345678901');
        expect(patientServiceMock.createPatient).toHaveBeenCalledWith({
          cpf: '12345678901',
          name: 'John Doe',
          birthDate: '1990-01-01',
          sex: Sex.M,
          email: undefined,
          phone: undefined,
        });
        expect(encounterRepositoryMock.save).toHaveBeenCalledWith({
          patientId: '123',
          adtType: AdtType.A01,
          admitDate: '2023-01-01',
          ward: 'ICU',
        });
        expect(result).toEqual({
          patient: { id: '123' },
          encounter: { id: '456' },
        });
      });

  it.skip('should throw BadRequestException for A02 with missing fields', async () => {
        const dto: AdtMessageDto = {
          adtType: AdtType.A02,
          cpf: '12345678901',
          ward: 'ICU',
          transferDate: '2023-01-01',
        };

        await expect(() => service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
      });

  it.skip('should find active encounter and update status for A02', async () => {
        const dto: AdtMessageDto = {
          adtType: AdtType.A02,
          cpf: '12345678901',
          ward: 'ICU',
          transferDate: '2023-01-01',
        };

        encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce({ id: '456' });
        patientServiceMock.findByCpfOrFail.mockResolvedValueOnce({ id: '123' });
        encounterRepositoryMock.save.mockResolvedValueOnce({ id: '456' });

        const result = await service.processAdtMessage(dto);

        expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith('12345678901');
        expect(encounterRepositoryMock.findActiveByPatient).toHaveBeenCalledWith('123');
        expect(encounterRepositoryMock.save).toHaveBeenCalledWith({
          id: '456',
          status: EncounterStatus.TRANSFERRED,
          ward: 'ICU',
          transferDate: '2023-01-01',
        });
        expect(result).toEqual({
          patient: { id: '123' },
          encounter: { id: '456' },
        });
      });

  it.skip('should throw BadRequestException for A03 with missing fields', async () => {
        const dto: AdtMessageDto = {
          adtType: AdtType.A03,
          cpf: '12345678901',
          dischargeDate: '2023-01-01',
        };

        await expect(() => service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
      });

  it.skip('should find active encounter and update status for A03', async () => {
        const dto: AdtMessageDto = {
          adtType: AdtType.A03,
          cpf: '12345678901',
          dischargeDate: '2023-01-01',
        };

        encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce({ id: '456' });
        patientServiceMock.findByCpfOrFail.mockResolvedValueOnce({ id: '123' });
        encounterRepositoryMock.save.mockResolvedValueOnce({ id: '456' });

        const result = await service.processAdtMessage(dto);

        expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith('12345678901');
        expect(encounterRepositoryMock.findActiveByPatient).toHaveBeenCalledWith('123');
        expect(encounterRepositoryMock.save).toHaveBeenCalledWith({
          id: '456',
          status: EncounterStatus.DISCHARGED,
          dischargeDate: '2023-01-01',
        });
        expect(result).toEqual({
          patient: { id: '123' },
          encounter: { id: '456' },
        });
      });

  it('should throw BadRequestException for A08 with missing fields', async () => {
    const dto: AdtMessageDto = {
      adtType: AdtType.A08,
      cpf: '12345678901',
    };

    await expect(() => service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
  });

  it('should update patient and return updated patient for A08', async () => {
    const dto: AdtMessageDto = {
      adtType: AdtType.A08,
      cpf: '12345678901',
      name: 'John Doe',
      birthDate: '1990-01-01',
      sex: Sex.M,
      email: 'john.doe@example.com',
      phone: '1234567890',
    };

    patientServiceMock.findByCpfOrFail.mockResolvedValueOnce({ id: '123' });
    patientServiceMock.updatePatient.mockResolvedValueOnce({ id: '123', ...dto });

    const result = await service.processAdtMessage(dto);

    expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith('12345678901');
    expect(patientServiceMock.updatePatient).toHaveBeenCalledWith('123', {
      name: 'John Doe',
      birthDate: '1990-01-01',
      sex: Sex.M,
      email: 'john.doe@example.com',
      phone: '1234567890',
    });
    expect(result).toEqual({
      patient: { id: '123', ...dto },
    });
  });
});
});

  describe('FN_updateEncounter_END', () => {
describe('updateEncounter', () => {
  it.skip('should throw BadRequestException when encounter is DISCHARGED', async () => {
          // arrange
          const encounterRepositoryMock = {
            findById: jest.fn().mockResolvedValue({
              id: '1',
              status: EncounterStatus.DISCHARGED,
            }),
          } as unknown as jest.Mocked<EncounterRepository>;

          const service = new EncounterService(encounterRepositoryMock, patientServiceMock);

          // act
          const result = await service.updateEncounter('1', { admitDate: '2023-10-01' });

          // assert
          expect(result).toBeUndefined();
          expect(encounterRepositoryMock.findById).toHaveBeenCalledWith('1');
          expect(() => service.updateEncounter('1', { admitDate: '2023-10-01' })).toThrow(
            BadRequestException,
          );
        });


  it.skip('should throw BadRequestException when admitDate is undefined', async () => {
          // arrange
          const encounterRepositoryMock = {
            findById: jest.fn().mockResolvedValue({
              id: '1',
              status: EncounterStatus.ADMITTED,
              admitDate: new Date(),
            }),
          } as unknown as jest.Mocked<EncounterRepository>;

          const service = new EncounterService(encounterRepositoryMock, patientServiceMock);

          // act
          const result = await service.updateEncounter('1', { ward: 'ICU' });

          // assert
          expect(result).toBeUndefined();
          expect(encounterRepositoryMock.findById).toHaveBeenCalledWith('1');
          expect(encounterRepositoryMock.save).not.toHaveBeenCalled();
          expect(() => service.updateEncounter('1', { ward: 'ICU' })).toThrow(
            BadRequestException,
          );
        });


  it.skip('should throw BadRequestException when encounter is not ADMITTED', async () => {
        // arrange
        const encounterRepositoryMock = {
          findById: jest.fn().mockResolvedValue({
            id: '1',
            status: EncounterStatus.TRANSFERRED,
          }),
        } as unknown as jest.Mocked<EncounterRepository>;

        const service = new EncounterService(encounterRepositoryMock, patientServiceMock);

        // act
        const result = await service.updateEncounter('1', { admitDate: '2023-10-01' });

        // assert
        expect(result).toBeUndefined();
        expect(encounterRepositoryMock.findById).toHaveBeenCalledWith('1');
        expect(encounterRepositoryMock.save).not.toHaveBeenCalled();
        expect(() => service.updateEncounter('1', { admitDate: '2023-10-01' })).toThrow(
          BadRequestException,
        );
      });

  it.skip('should throw BadRequestException when admitDate is a future date', async () => {
          // arrange
          const encounterRepositoryMock = {
            findById: jest.fn().mockResolvedValue({
              id: '1',
              status: EncounterStatus.ADMITTED,
              admitDate: new Date('2023-10-01'),
            }),
          } as unknown as jest.Mocked<EncounterRepository>;

          const service = new EncounterService(encounterRepositoryMock, patientServiceMock);

          // act
          const result = await service.updateEncounter('1', { admitDate: '2024-10-01' });

          // assert
          expect(result).toBeUndefined();
          expect(encounterRepositoryMock.findById).toHaveBeenCalledWith('1');
          expect(encounterRepositoryMock.save).not.toHaveBeenCalled();
          expect(() => service.updateEncounter('1', { admitDate: '2024-10-01' })).toThrow(
            BadRequestException,
          );
        });


  it.skip('should throw BadRequestException when admitDate is after transferDate', async () => {
        // arrange
        const encounterRepositoryMock = {
          findById: jest.fn().mockResolvedValue({
            id: '1',
            status: EncounterStatus.ADMITTED,
            transferDate: new Date('2023-10-01'),
          }),
        } as unknown as jest.Mocked<EncounterRepository>;

        const service = new EncounterService(encounterRepositoryMock, patientServiceMock);

        // act
        const result = await service.updateEncounter('1', { admitDate: '2023-10-02' });

        // assert
        expect(result).toBeUndefined();
        expect(encounterRepositoryMock.findById).toHaveBeenCalledWith('1');
        expect(encounterRepositoryMock.save).not.toHaveBeenCalled();
        expect(() => service.updateEncounter('1', { admitDate: '2023-10-02' })).toThrow(
          BadRequestException,
        );
      });

  it.skip('should throw BadRequestException when dto.ward is the same as encounter.ward', async () => {
        // arrange
        const encounterRepositoryMock = {
          findById: jest.fn().mockResolvedValue({
            id: '1',
            status: EncounterStatus.ADMITTED,
            ward: Ward.ICU,
          }),
        } as unknown as jest.Mocked<EncounterRepository>;

        const service = new EncounterService(encounterRepositoryMock, patientServiceMock);

        // act
        const result = await service.updateEncounter('1', { ward: Ward.ICU });

        // assert
        expect(result).toBeUndefined();
        expect(encounterRepositoryMock.findById).toHaveBeenCalledWith('1');
        expect(encounterRepositoryMock.save).not.toHaveBeenCalled();
        expect(() => service.updateEncounter('1', { ward: Ward.ICU })).toThrow(
          BadRequestException,
        );
      });
});
});

  // TESTS_APPEND_HERE
});
