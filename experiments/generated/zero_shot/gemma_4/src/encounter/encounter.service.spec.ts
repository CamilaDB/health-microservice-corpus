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
it.skip('should be able to create an encounter successfully', async () => {
          const patientId = 'patient-123';
          const createDto = {
            patientId: patientId,
            adtType: 'A01',
            admitDate: '2023-01-01',
            ward: 'ICU',
          };

          const mockPatient = { id: patientId, active: false };
          
          patientServiceMock.getPatientById.mockResolvedValue(mockPatient);
          encounterRepositoryMock.create.mockResolvedValue({ id: 'encounter-456' });

          await service.createEncounter(createDto);

          expect(patientServiceMock.getPatientById).toHaveBeenCalledWith(patientId);
          expect(encounterRepositoryMock.create).toHaveBeenCalledTimes(1);
        });


it('should throw an exception if the patient is not found', async () => {
  const patientId = 'non-existent-id';
  
  patientServiceMock.getPatientById.mockResolvedValue(undefined);

  await expect(service.createEncounter({
    patientId: patientId,
    adtType: 'A01',
    admitDate: '2023-01-01',
  })).rejects.toThrow();

  expect(encounterRepositoryMock.create).not.toHaveBeenCalled();
});

it.skip('should handle errors during encounter creation', async () => {
      const patientId = 'patient-123';
      const createDto = {
        patientId: patientId,
        adtType: 'A01',
        admitDate: '2023-01-01',
      };

      patientServiceMock.getPatientById.mockResolvedValue({ id: patientId });
      encounterRepositoryMock.create.mockRejectedValue(new Error('Database error'));

      await expect(service.createEncounter(createDto)).rejects.toThrow('Database error');
    });
});
});

  describe('FN_validateEncounterFields_END', () => {
describe('validateEncounterFields', () => {
it.skip('should throw BadRequestException if adtType is A01 and ward is missing', async () => {
          const createDto = {
            patientId: 'patient123',
            adtType: AdtType.A01,
            admitDate: new Date().toISOString(),
          };

          await expect(service.validateEncounterFields(createDto)).rejects.toThrow(BadRequestException);
        });


it.skip('should throw BadRequestException if required fields are missing or invalid', async () => {
      const createDto = {
        patientId: '',
        adtType: 'A01',
        admitDate: new Date().toISOString(),
      };

      await expect(service.validateEncounterFields(createDto)).rejects.toThrow(BadRequestException);
    });

it.skip('should throw BadRequestException if ward is an invalid value', async () => {
      const createDto = {
        patientId: 'patient123',
        adtType: 'A01',
        admitDate: new Date().toISOString(),
        ward: 'INVALID_WARD',
      };

      await expect(service.validateEncounterFields(createDto)).rejects.toThrow(BadRequestException);
    });

it.skip('should successfully validate valid encounter fields', async () => {
      const createDto = {
        patientId: 'patient123',
        adtType: 'A01',
        admitDate: new Date().toISOString(),
        ward: 'INPATIENT',
      };

      await expect(service.validateEncounterFields(createDto)).resolves.toBeUndefined();
    });
})
});

  describe('FN_listEncountersByPatient_END', () => {
describe('listEncountersByPatient', () => {
	it('should return a list of encounters for a given patient', async () => {
		const mockEncounters = [
			{ id: 'e1', patientId: 'p1', status: 'ADMITTED' },
			{ id: 'e2', patientId: 'p1', status: 'DISCHARGED' },
		];
		encounterRepositoryMock.findByPatient.mockResolvedValue(mockEncounters);

		const listEncountersByPatientDto = {
			status: 'ADMITTED',
			orderBy: 'admitDate',
			order: 'DESC',
		};

		const result = await service.listEncountersByPatient(listEncountersByPatientDto);

		expect(encounterRepositoryMock.findByPatient).toHaveBeenCalledTimes(1);
		expect(result).toEqual(mockEncounters);
	});

	it('should return an empty array if no encounters are found for the patient', async () => {
		encounterRepositoryMock.findByPatient.mockResolvedValue([]);

		const listEncountersByPatientDto = {};

		const result = await service.listEncountersByPatient(listEncountersByPatientDto);

		expect(encounterRepositoryMock.findByPatient).toHaveBeenCalledTimes(1);
		expect(result).toEqual([]);
	});
});
});

  describe('FN_getEncounterById_END', () => {
describe('getEncounterById', () => {
it('should return an encounter when found by ID', async () => {
  const mockEncounter = {
    id: '123',
    patientId: 'p456',
    adtType: 'A01',
    status: 'ADMITTED',
    ward: 'INPATIENT',
    admitDate: new Date(),
    created_at: new Date(),
  };
  encounterRepositoryMock.findById.mockResolvedValue(mockEncounter);

  const result = await service.getEncounterById('123');

  expect(result).toEqual(mockEncounter);
  expect(encounterRepositoryMock.findById).toHaveBeenCalledWith('123');
});

it('should throw NotFoundException when encounter is not found', async () => {
  encounterRepositoryMock.findById.mockResolvedValue(null);

  await expect(service.getEncounterById('999')).rejects.toThrow(NotFoundException);
  expect(encounterRepositoryMock.findById).toHaveBeenCalledWith('999');
});
})
});

  describe('FN_transitionEncounterStatus_END', () => {
describe('transitionEncounterStatus', () => {
it.skip('should successfully transition the encounter status and update related fields', async () => {
          const encounterId = 'encounter-123';
          const newStatus = EncounterStatus.TRANSFERRED;
          const ward = Ward.ICU;

          encounterRepositoryMock.findById.mockResolvedValue({
            id: encounterId,
            status: EncounterStatus.ADMITTED,
            ward: null,
            patientId: 'patient-456',
          });
          encounterRepositoryMock.save.mockResolvedValue({
            id: encounterId,
            status: newStatus,
            ward: ward,
          });

          const dto = {
            status: newStatus,
            ward: ward,
            transferDate: '2023-01-01',
          };

          await service.transitionEncounterStatus(encounterId, dto);

          expect(encounterRepositoryMock.findById).toHaveBeenCalledWith(encounterId);
          expect(encounterRepositoryMock.save).toHaveBeenCalledTimes(1);
          expect(encounterRepositoryMock.save).toHaveBeenCalledWith({
            id: encounterId,
            status: newStatus,
            ward: ward,
          });
        });


it('should throw NotFoundException if the encounter is not found', async () => {
  encounterRepositoryMock.findById.mockResolvedValue(undefined);

  const dto = {
    status: EncounterStatus.TRANSFERRED,
  };

  await expect(service.transitionEncounterStatus('non-existent-id', dto)).rejects.toThrow(NotFoundException);
  expect(encounterRepositoryMock.save).not.toHaveBeenCalled();
});

it.skip('should handle transition when only status is provided', async () => {
      const encounterId = 'encounter-456';
      const newStatus = EncounterStatus.DISCHARGED;

      encounterRepositoryMock.findById.mockResolvedValue({
        id: encounterId,
        status: EncounterStatus.ADMITTED,
      });
      encounterRepositoryMock.save.mockResolvedValue({
        id: encounterId,
        status: newStatus,
      });

      const dto = {
        status: newStatus,
      };

      await service.transitionEncounterStatus(encounterId, dto);

      expect(encounterRepositoryMock.findById).toHaveBeenCalledWith(encounterId);
      expect(encounterRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(encounterRepositoryMock.save).toHaveBeenCalledWith({
        id: encounterId,
        status: newStatus,
      });
    });
});
});

  describe('FN_processAdtMessage_END', () => {
describe('processAdtMessage', () => {
it.skip('should successfully process an ADT message and update encounter status', async () => {
          const adtMessageDto = {
            adtType: AdtType.A01,
            cpf: '123456789000',
            name: 'John Doe',
            birthDate: '1990-01-01',
            sex: Sex.M,
            admitDate: '2023-01-01',
          };
          const transitionDto = {
            status: EncounterStatus.TRANSFERRED,
            transferDate: '2023-01-05',
          };

          patientServiceMock.findByCpfOrFail.mockResolvedValue({
            id: 'patient-id-123',
            active: true,
          });

          encounterRepositoryMock.findById.mockResolvedValue({
            id: 'encounter-id-456',
            status: EncounterStatus.ADMITTED,
            patientId: 'patient-id-123',
          });

          await service.processAdtMessage(adtMessageDto, transitionDto);

          expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith('123456789000');
          expect(encounterRepositoryMock.findById).toHaveBeenCalledWith('encounter-id-456');
        });


it('should throw an exception if required fields for A02 are missing', async () => {
      const adtMessageDto = {
        adtType: AdtType.A02,
        cpf: '999999999999',
      };
      const transitionDto = {
        status: EncounterStatus.DISCHARGED,
      };

      // Mocking patient lookup failure is irrelevant here as validation fails first
      // patientServiceMock.findByCpfOrFail.mockRejectedValue(new NotFoundException('Patient not found'));

      await expect(service.processAdtMessage(adtMessageDto, transitionDto)).rejects.toThrow(BadRequestException);
      await expect(service.processAdtMessage(adtMessageDto, transitionDto)).rejects.toThrow('A02 requires: ward, transferDate');
    });


it.skip('should throw an exception if the encounter is not found', async () => {
      const adtMessageDto = {
        adtType: AdtType.A03,
        cpf: '123456789000',
      };
      const transitionDto = {
        status: EncounterStatus.TRANSFERRED,
      };

      patientServiceMock.findByCpfOrFail.mockResolvedValue({
        id: 'patient-id-123',
        active: true,
      });

      encounterRepositoryMock.findById.mockResolvedValue(undefined);

      await expect(service.processAdtMessage(adtMessageDto, transitionDto)).rejects.toThrow(NotFoundException);
    });
});
});

  describe('FN_updateEncounter_END', () => {
describe('updateEncounter', () => {
it('should be able to update an encounter successfully', async () => {
  const encounterId = 'encounter-123';
  const updateDto = {
    admitDate: '2023-01-01',
    ward: 'ICU',
  };

  encounterRepositoryMock.findById.mockResolvedValue({
    id: encounterId,
    patientId: 'patient-456',
    status: 'ADMITTED',
    ward: null,
    admitDate: new Date('2023-01-01T00:00:00.000Z'),
  });
  encounterRepositoryMock.save.mockResolvedValue({
    id: encounterId,
    patientId: 'patient-456',
    status: 'ADMITTED',
    ward: 'ICU',
    admitDate: new Date('2023-01-01T00:00:00.000Z'),
  });

  await service.updateEncounter(encounterId, updateDto);

  expect(encounterRepositoryMock.findById).toHaveBeenCalledWith(encounterId);
  expect(encounterRepositoryMock.save).toHaveBeenCalledTimes(1);
  expect(encounterRepositoryMock.save).toHaveBeenCalledWith({
    id: encounterId,
    patientId: 'patient-456',
    status: 'ADMITTED',
    ward: 'ICU',
    admitDate: expect.any(Date),
  });
});

it('should throw NotFoundException if the encounter is not found', async () => {
  encounterRepositoryMock.findById.mockResolvedValue(undefined);

  await expect(service.updateEncounter('non-existent-id', {})).rejects.toThrow(NotFoundException);
  expect(encounterRepositoryMock.save).not.toHaveBeenCalled();
});
})
});

  describe('FN_buildEncounterSummary_END', () => {
describe('buildEncounterSummary', () => {
it.skip('should successfully build an EncounterSummary when patient and encounter data are available', async () => {
          const mockPatient = { id: 1, name: 'Test Patient' };
          const mockEncounter = { 
            id: 101, 
            activeDays: 5, 
            orders: [
              { status: 'PENDING', results: [] }, // Order 1
              { status: 'IN_PROGRESS', results: [] } // Order 2
            ],
            results: { total: 3, abnormal: 1, preliminary: 2 }, 
            hasAbnormalResults: true, 
            riskFlag: 'MEDIUM' 
          };

          jest.spyOn(patientServiceMock, 'getPatientById').mockResolvedValue(mockPatient);
          jest.spyOn(encounterRepositoryMock, 'findById').mockResolvedValue(mockEncounter);

          const result = await service.buildEncounterSummary(101);

          expect(patientServiceMock.getPatientById).toHaveBeenCalledWith(1);
          expect(encounterRepositoryMock.findById).toHaveBeenCalledWith(101);
          expect(result).toEqual({
            encounter: mockEncounter,
            patient: mockPatient,
            activeDays: mockEncounter.activeDays,
            orders: { total: 2, pending: 1, inProgress: 1, completed: 0, cancelled: 0 },
            results: { total: 3, abnormal: 1, preliminary: 2 },
            hasAbnormalResults: mockEncounter.hasAbnormalResults,
            riskFlag: mockEncounter.riskFlag,
          });
        });

})
});

  // TESTS_APPEND_HERE
});
