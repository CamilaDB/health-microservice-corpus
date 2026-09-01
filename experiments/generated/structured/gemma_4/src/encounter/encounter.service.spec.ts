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
    const dto = {
      patientId: 'patient123',
      adtType: AdtType.A02,
      admitDate: '2023-01-01',
      ward: Ward.INPATIENT,
    };
    await expect(service.createEncounter(dto)).rejects.toThrow(BadRequestException);
    await expect(service.createEncounter(dto)).rejects.toThrow(
      'Only ADT A01 can create an encounter; use the ADT workflow for A02, A03 and A08',
    );
    await expect(encounterRepositoryMock.findActiveByPatient).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException if the patient is inactive', async () => {
    const dto = {
      patientId: 'patient123',
      adtType: AdtType.A01,
      admitDate: '2023-01-01',
      ward: Ward.INPATIENT,
    };
    await patientServiceMock.getPatientById.mockResolvedValue({ active: false });
    await expect(service.createEncounter(dto)).rejects.toThrow(BadRequestException);
    await expect(service.createEncounter(dto)).rejects.toThrow(
      'Cannot admit an inactive patient',
    );
    await expect(encounterRepositoryMock.findActiveByPatient).not.toHaveBeenCalled();
  });

  it('should throw ConflictException if an active encounter already exists for the patient', async () => {
    const dto = {
      patientId: 'patient123',
      adtType: AdtType.A01,
      admitDate: '2023-01-01',
      ward: Ward.INPATIENT,
    };
    await patientServiceMock.getPatientById.mockResolvedValue({ active: true });
    await encounterRepositoryMock.findActiveByPatient.mockResolvedValue({ id: 'existing_encounter_id' });
    await expect(service.createEncounter(dto)).rejects.toThrow(ConflictException);
    await expect(service.createEncounter(dto)).rejects.toThrow(
      'Patient already has an active encounter (id: existing_encounter_id)',
    );
  });

  it('should successfully create and save an encounter', async () => {
    const dto = {
      patientId: 'patient123',
      adtType: AdtType.A01,
      admitDate: '2023-01-01T00:00:00.000Z',
      ward: Ward.INPATIENT,
    };
    await patientServiceMock.getPatientById.mockResolvedValue({ active: true });
    await encounterRepositoryMock.findActiveByPatient.mockResolvedValue(undefined);
    const savedEncounter = {
      id: 'new_encounter_id',
      patientId: 'patient123',
      adtType: AdtType.A01,
      status: EncounterStatus.ADMITTED,
      ward: Ward.INPATIENT,
      admitDate: new Date('2023-01-01'),
      transferDate: null,
      dischargeDate: null,
      created_at: new Date(),
      updated_at: new Date(),
      patient: undefined,
      orders: [],
    };
    
    // Mock create to return the entity being created
    encounterRepositoryMock.create.mockReturnValue(savedEncounter);
    // Mock save to return the saved entity
    encounterRepositoryMock.save.mockResolvedValue(savedEncounter);

    const result = await service.createEncounter(dto);

    expect(result).toEqual(savedEncounter);
    expect(encounterRepositoryMock.create).toHaveBeenCalledTimes(1);
    expect(encounterRepositoryMock.save).toHaveBeenCalledTimes(1);
    expect(patientServiceMock.getPatientById).toHaveBeenCalledWith('patient123');
    expect(encounterRepositoryMock.findActiveByPatient).toHaveBeenCalledWith('patient123');
  });
});
});

  describe('FN_validateEncounterFields_END', () => {
describe('validateEncounterFields', () => {
  it.skip('should throw BadRequestException when adtType is A01 and ward is missing', async () => {
            const dto = {
              adtType: AdtType.A01,
              admitDate: '2023-01-01',
            };
            await expect(service.validateEncounterFields(dto)).rejects.toThrow('Ward is required for ADT A01 (admission)');
        });


  it.skip('should throw BadRequestException when adtType is A02 and ward is missing', async () => {
          const dto = {
            adtType: AdtType.A02,
            admitDate: '2023-01-01',
            ward: undefined,
          };
          await expect(service.validateEncounterFields(dto)).rejects.toThrow('Ward is required for ADT A02 (transfer)');
        });



  it.skip('should throw BadRequestException when adtType is A03 and ward is present', async () => {
            const dto = {
              adtType: AdtType.A03,
              ward: Ward.INPATIENT,
            };
            await expect(service.validateEncounterFields(dto)).rejects.toThrow('Ward must not be informed for ADT A03 (discharge)');
        });


  it.skip('should throw BadRequestException when adtType is A08 and ward is present', async () => {
            const dto = {
              adtType: AdtType.A08,
              ward: Ward.INPATIENT,
            };
            await expect(service.validateEncounterFields(dto)).rejects.toThrow('Ward must not be informed for ADT A08 (update)');
        });


  it.skip('should throw BadRequestException when adtType is A08 and patientId is missing', async () => {
            const dto = {
              adtType: AdtType.A08,
              ward: undefined,
              patientId: undefined,
            };
            await expect(service.validateEncounterFields(dto)).rejects.toThrow('PatientId is required for ADT A08 (update)');
          });

});
});

  describe('FN_listEncountersByPatient_END', () => {
describe('listEncountersByPatient', () => {
  it('should return an array of encounters by finding the patient and querying the repository', async () => {
    const patientId = 'patient123';
    const dto = { status: 'ADMITTED' };
    const encounters = [{ id: 'e1', patientId: patientId, status: 'ADMITTED' }];

    patientServiceMock.getPatientById.mockResolvedValue(undefined);
    encounterRepositoryMock.findByPatient.mockResolvedValue(encounters);

    const result = await service.listEncountersByPatient(patientId, dto);

    expect(patientServiceMock.getPatientById).toHaveBeenCalledWith(patientId);
    expect(encounterRepositoryMock.findByPatient).toHaveBeenCalledWith(patientId, dto);
    expect(result).toEqual(encounters);
  });

  it('should throw an error if patientService.getPatientById fails', async () => {
    const patientId = 'patient123';
    const dto = { status: 'ADMITTED' };
    const error = new Error('Patient not found');

    patientServiceMock.getPatientById.mockRejectedValue(error);

    await expect(service.listEncountersByPatient(patientId, dto)).rejects.toThrow(error);
    expect(encounterRepositoryMock.findByPatient).not.toHaveBeenCalled();
  });

  it('should return an empty array if encounterRepository.findByPatient returns an empty array', async () => {
    const patientId = 'patient123';
    const dto = { status: 'ADMITTED' };
    encounterRepositoryMock.findByPatient.mockResolvedValue([]);

    const result = await service.listEncountersByPatient(patientId, dto);

    expect(patientServiceMock.getPatientById).toHaveBeenCalledWith(patientId);
    expect(encounterRepositoryMock.findByPatient).toHaveBeenCalledWith(patientId, dto);
    expect(result).toEqual([]);
  });

  it('should throw an error if encounterRepository.findByPatient fails', async () => {
    const patientId = 'patient123';
    const dto = { status: 'ADMITTED' };
    const error = new Error('Database error');

    patientServiceMock.getPatientById.mockResolvedValue(undefined);
    encounterRepositoryMock.findByPatient.mockRejectedValue(error);

    await expect(service.listEncountersByPatient(patientId, dto)).rejects.toThrow(error);
  });
});
});

  describe('FN_getEncounterById_END', () => {
describe('getEncounterById', () => {
  it('should return the encounter when found', async () => {
    const mockEncounter = {
      id: '123',
      patientId: 'p1',
      adtType: 'A01',
      status: 'ADMITTED',
      ward: 'INPATIENT',
      admitDate: new Date(),
      transferDate: null,
      dischargeDate: null,
      created_at: new Date(),
      updated_at: new Date(),
      patient: {},
      orders: [],
    };

    encounterRepositoryMock.findById.mockResolvedValue(mockEncounter);

    const result = await service.getEncounterById('123');

    expect(result).toEqual(mockEncounter);
    expect(encounterRepositoryMock.findById).toHaveBeenCalledWith('123');
  });

  it('should throw NotFoundException if the encounter is not found', async () => {
    encounterRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(service.getEncounterById('456')).rejects.toThrow(NotFoundException);
    await expect(service.getEncounterById('456')).rejects.toThrow('Encounter with id 456 not found');
    expect(encounterRepositoryMock.findById).toHaveBeenCalledWith('456');
  });
});
});

  describe('FN_transitionEncounterStatus_END', () => {
describe('transitionEncounterStatus', () => {
  it('should throw BadRequestException if the status transition is invalid', async () => {
        const mockEncounter = {
          id: '123',
          status: EncounterStatus.ADMITTED,
          ward: Ward.INPATIENT,
          admitDate: new Date('2023-01-01'),
          orders: [],
          adtType: AdtType.A01,
        };
        const dto = { status: EncounterStatus.DISCHARGED };

        encounterRepositoryMock.findById.mockResolvedValue(mockEncounter);

        await expect(service.transitionEncounterStatus('123', dto)).rejects.toThrow(BadRequestException);
        await expect(service.transitionEncounterStatus('123', dto)).rejects.toThrow(
          'dischargeDate is required for discharge',
        );
    });


  it('should throw BadRequestException if attempting to discharge an encounter with pending orders', async () => {
    const mockEncounter = {
      id: '123',
      status: EncounterStatus.ADMITTED,
      ward: Ward.INPATIENT,
      admitDate: new Date('2023-01-01'),
      orders: [{ status: OrderStatus.PENDING }],
      adtType: AdtType.A01,
    };
    const dto = { status: EncounterStatus.DISCHARGED, dischargeDate: new Date('2023-01-02') };

    encounterRepositoryMock.findById.mockResolvedValue(mockEncounter);

    await expect(service.transitionEncounterStatus('123', dto)).rejects.toThrow(
      'Cannot discharge encounter with pending or in-progress orders',
    );
  });

  it('should throw BadRequestException if ward is missing for transfer', async () => {
    const mockEncounter = {
      id: '123',
      status: EncounterStatus.ADMITTED,
      ward: null,
      admitDate: new Date('2023-01-01'),
      orders: [],
      adtType: AdtType.A01,
    };
    const dto = { status: EncounterStatus.TRANSFERRED, transferDate: '2023-01-05' };

    encounterRepositoryMock.findById.mockResolvedValue(mockEncounter);

    await expect(service.transitionEncounterStatus('123', dto)).rejects.toThrow(
      'Ward is required for transfer',
    );
  });

  it('should throw BadRequestException if the ward is the same during transfer', async () => {
    const mockEncounter = {
      id: '123',
      status: EncounterStatus.ADMITTED,
      ward: Ward.INPATIENT,
      admitDate: new Date('2023-01-01'),
      orders: [],
      adtType: AdtType.A01,
    };
    const dto = { status: EncounterStatus.TRANSFERRED, ward: Ward.INPATIENT, transferDate: '2023-01-05' };

    encounterRepositoryMock.findById.mockResolvedValue(mockEncounter);

    await expect(service.transitionEncounterStatus('123', dto)).rejects.toThrow(
      `Transfer requires a different ward. Current ward: ${mockEncounter.ward}`,
    );
  });

  it('should throw BadRequestException if transferDate is missing for transfer', async () => {
    const mockEncounter = {
      id: '123',
      status: EncounterStatus.ADMITTED,
      ward: Ward.INPATIENT,
      admitDate: new Date('2023-01-01'),
      orders: [],
      adtType: AdtType.A01,
    };
    const dto = { status: EncounterStatus.TRANSFERRED, ward: Ward.SURGERY };

    encounterRepositoryMock.findById.mockResolvedValue(mockEncounter);

    await expect(service.transitionEncounterStatus('123', dto)).rejects.toThrow(
      'transferDate is required for transfer',
    );
  });

  it('should throw BadRequestException if transferDate is before admitDate', async () => {
    const mockEncounter = {
      id: '123',
      status: EncounterStatus.ADMITTED,
      ward: Ward.INPATIENT,
      admitDate: new Date('2023-01-05'),
      orders: [],
      adtType: AdtType.A01,
    };
    const dto = { status: EncounterStatus.TRANSFERRED, ward: Ward.SURGERY, transferDate: '2023-01-04' };

    encounterRepositoryMock.findById.mockResolvedValue(mockEncounter);

    await expect(service.transitionEncounterStatus('123', dto)).rejects.toThrow(
      'transferDate must be after admitDate',
    );
  });

  it('should successfully transition status to TRANSFERRED and update dates and ward', async () => {
    const mockEncounter = {
      id: '123',
      status: EncounterStatus.ADMITTED,
      ward: Ward.INPATIENT,
      admitDate: new Date('2023-01-01'),
      orders: [],
      adtType: AdtType.A01,
    };
    const dto = {
      status: EncounterStatus.TRANSFERRED,
      ward: Ward.SURGERY,
      transferDate: '2023-01-05',
    };

    encounterRepositoryMock.findById.mockResolvedValue(mockEncounter);
    encounterRepositoryMock.save.mockResolvedValue(mockEncounter);

    const result = await service.transitionEncounterStatus('123', dto);

    expect(result.status).toBe(EncounterStatus.TRANSFERRED);
    expect(result.ward).toBe(Ward.SURGERY);
    expect(result.transferDate).toEqual(new Date('2023-01-05'));
    expect(encounterRepositoryMock.save).toHaveBeenCalledTimes(1);
  });

  it('should successfully transition status to DISCHARGED and set dischargeDate', async () => {
    const mockEncounter = {
      id: '123',
      status: EncounterStatus.TRANSFERRED,
      ward: Ward.SURGERY,
      admitDate: new Date('2023-01-01'),
      transferDate: new Date('2023-01-05'),
      orders: [],
      adtType: AdtType.A01,
    };
    const dto = { status: EncounterStatus.DISCHARGED, dischargeDate: '2023-01-10' };

    encounterRepositoryMock.findById.mockResolvedValue(mockEncounter);
    encounterRepositoryMock.save.mockResolvedValue(mockEncounter);

    const result = await service.transitionEncounterStatus('123', dto);

    expect(result.status).toBe(EncounterStatus.DISCHARGED);
    expect(result.dischargeDate).toEqual(new Date('2023-01-10'));
    expect(encounterRepositoryMock.save).toHaveBeenCalledTimes(1);
  });

  it('should throw BadRequestException if dischargeDate is missing for discharge', async () => {
    const mockEncounter = {
      id: '123',
      status: EncounterStatus.TRANSFERRED,
      ward: Ward.SURGERY,
      admitDate: new Date('2023-01-01'),
      transferDate: new Date('2023-01-05'),
      orders: [],
      adtType: AdtType.A01,
    };
    const dto = { status: EncounterStatus.DISCHARGED };

    encounterRepositoryMock.findById.mockResolvedValue(mockEncounter);

    await expect(service.transitionEncounterStatus('123', dto)).rejects.toThrow(
      'dischargeDate is required for discharge',
    );
  });

  it('should throw BadRequestException if dischargeDate is before admitDate', async () => {
    const mockEncounter = {
      id: '123',
      status: EncounterStatus.TRANSFERRED,
      ward: Ward.SURGERY,
      admitDate: new Date('2023-01-10'),
      transferDate: new Date('2023-01-05'),
      orders: [],
      adtType: AdtType.A01,
    };
    const dto = { status: EncounterStatus.DISCHARGED, dischargeDate: '2023-01-04' };

    encounterRepositoryMock.findById.mockResolvedValue(mockEncounter);

    await expect(service.transitionEncounterStatus('123', dto)).rejects.toThrow(
      'dischargeDate must be after admitDate',
    );
  });

  it('should throw BadRequestException if dischargeDate is before transferDate', async () => {
    const mockEncounter = {
      id: '123',
      status: EncounterStatus.TRANSFERRED,
      ward: Ward.SURGERY,
      admitDate: new Date('2023-01-01'),
      transferDate: new Date('2023-01-05'),
      orders: [],
      adtType: AdtType.A01,
    };
    const dto = { status: EncounterStatus.DISCHARGED, dischargeDate: '2023-01-03' };

    encounterRepositoryMock.findById.mockResolvedValue(mockEncounter);

    await expect(service.transitionEncounterStatus('123', dto)).rejects.toThrow(
      'dischargeDate must be after transferDate',
    );
  });

  it('should throw BadRequestException for ADT A08 encounters attempting status transitions', async () => {
    const mockEncounter = {
      id: '123',
      status: EncounterStatus.ADMITTED,
      ward: Ward.INPATIENT,
      admitDate: new Date('2023-01-01'),
      orders: [],
      adtType: AdtType.A08,
    };
    const dto = { status: EncounterStatus.TRANSFERRED, ward: Ward.SURGERY, transferDate: '2023-01-05' };

    encounterRepositoryMock.findById.mockResolvedValue(mockEncounter);

    await expect(service.transitionEncounterStatus('123', dto)).rejects.toThrow(
      'ADT A08 encounters cannot have status transitions',
    );
  });
});
});

  describe('FN_processAdtMessage_END', () => {
describe('processAdtMessage', () => {
  it.skip('should handle ADT type A01 successfully by creating a new patient and encounter', async () => {
            patientServiceMock.findByCpfOrFail.mockResolvedValue({ id: 'p1', name: 'Test', birthDate: new Date(), sex: Sex.M, cpf: '123' });
            service.createEncounter.mockResolvedValue({ id: 'e1', patientId: 'p1', adtType: AdtType.A01, admitDate: new Date(), ward: null });

            const dto = {
              adtType: AdtType.A01,
              cpf: '123',
              name: 'Test',
              birthDate: '1990-01-01',
              sex: Sex.M,
              admitDate: '2023-01-01',
              ward: null,
            };

            const result = await service.processAdtMessage(dto);

            expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith('123');
            expect(service.createEncounter).toHaveBeenCalledWith({
              patientId: 'p1',
              adtType: AdtType.A01,
              admitDate: '2023-01-01',
              ward: null,
            });
            expect(result).toEqual({
              patient: { id: 'p1', name: 'Test', birthDate: new Date(), cpf: '123', sex: Sex.M, email: null, phone: null, active: false, created_at: expect.any(Date), updated_at: expect.any(Date), encounters: [] },
              encounter: { id: 'e1', patientId: 'p1', adtType: AdtType.A01, status: EncounterStatus.ADMITTED, ward: null, admitDate: '2023-01-01', created_at: expect.any(Date), updated_at: expect.any(Date), patient: expect.any(Object), orders: [] },
            });
        });


  it('should throw BadRequestException if A01 requires missing fields', async () => {
    const dto = {
      adtType: AdtType.A01,
      cpf: '123',
      name: '',
      birthDate: '1990-01-01',
      sex: Sex.M,
      admitDate: '2023-01-01',
    };

    await expect(service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
    await expect(service.processAdtMessage(dto)).rejects.toThrow('A01 requires: name, birthDate, sex, admitDate');
    expect(patientServiceMock.findByCpfOrFail).not.toHaveBeenCalled();
  });

  it.skip('should handle patient creation if findByCpfOrFail throws NotFoundException for A01', async () => {
            const notFoundError = new NotFoundException('Patient not found');
            patientServiceMock.findByCpfOrFail.mockRejectedValueOnce(notFoundError);
            patientServiceMock.createPatient.mockResolvedValue({ id: 'new_patient', name: 'New', birthDate: new Date(), cpf: '123', sex: Sex.M, email: null, phone: null, active: false, created_at: new Date(), updated_at: new Date(), encounters: [] });
            service.createEncounter.mockResolvedValue({ id: 'e1', patientId: 'new_patient', adtType: AdtType.A01, admitDate: new Date(), ward: null });

            const dto = {
              adtType: AdtType.A01,
              cpf: '123',
              name: 'New',
              birthDate: '1990-01-01',
              sex: Sex.M,
              admitDate: '2023-01-01',
            };

            const result = await service.processAdtMessage(dto);

            expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith('123');
            expect(patientServiceMock.createPatient).toHaveBeenCalledWith({
              cpf: '123',
              name: 'New',
              birthDate: '1990-01-01',
              sex: Sex.M,
              email: null,
              phone: null,
            });
            expect(service.createEncounter).toHaveBeenCalledWith({
              patientId: 'new_patient',
              adtType: AdtType.A01,
              admitDate: '2023-01-01',
              ward: null,
            });
            expect(result.patient.id).toBe('new_patient');
            expect(result.encounter).toBeDefined();
        });


  it.skip('should handle ADT type A02 successfully by transferring an existing encounter', async () => {
        patientServiceMock.findByCpfOrFail.mockResolvedValue({ id: 'p1', name: 'Test', birthDate: new Date(), sex: Sex.M, cpf: '123' });
        encounterRepositoryMock.findActiveByPatient.mockResolvedValue({ id: 'e1', patientId: 'p1', adtType: AdtType.A01, status: EncounterStatus.ADMITTED, ward: null, admitDate: new Date(), transferDate: null, dischargeDate: null, created_at: new Date(), updated_at: new Date(), patient: expect.any(Object), orders: [] });
        transitionEncounterStatus.mockResolvedValue({ status: EncounterStatus.TRANSFERRED, ward: 'ICU', transferDate: '2023-02-01' });

        const dto = {
          adtType: AdtType.A02,
          cpf: '123',
          ward: 'ICU',
          transferDate: '2023-02-01',
        };

        const result = await service.processAdtMessage(dto);

        expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith('123');
        expect(encounterRepositoryMock.findActiveByPatient).toHaveBeenCalledWith('p1');
        expect(transitionEncounterStatus).toHaveBeenCalledWith('e1', {
          status: EncounterStatus.TRANSFERRED,
          ward: 'ICU',
          transferDate: '2023-02-01',
        });
        expect(result.patient.id).toBe('p1');
        expect(result.encounter.status).toBe(EncounterStatus.TRANSFERRED);
        expect(result.encounter.ward).toBe('ICU');
      });

  it('should throw BadRequestException if A02 requires missing ward or transferDate', async () => {
    const dto = {
      adtType: AdtType.A02,
      cpf: '123',
      ward: null,
      transferDate: null,
    };

    await expect(service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
    await expect(service.processAdtMessage(dto)).rejects.toThrow('A02 requires: ward, transferDate');
    expect(patientServiceMock.findByCpfOrFail).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException if no active encounter is found for A02', async () => {
            patientServiceMock.findByCpfOrFail.mockResolvedValue({ id: 'p1', name: 'Test', birthDate: new Date(), sex: Sex.M, cpf: '123' });
            encounterRepositoryMock.findActiveByPatient.mockResolvedValue(undefined);
            jest.spyOn(service, 'transitionEncounterStatus').mockResolvedValue({});

            const dto = {
              adtType: AdtType.A02,
              cpf: '123',
              ward: 'ICU',
              transferDate: '2023-02-01',
            };

            await expect(service.processAdtMessage(dto)).rejects.toThrow(NotFoundException);
            await expect(service.processAdtMessage(dto)).rejects.toThrow('No active encounter found for patient with cpf 123');
          });



  it.skip('should handle ADT type A03 successfully by discharging an existing encounter', async () => {
                    patientServiceMock.findByCpfOrFail.mockResolvedValue({ id: 'p1', name: 'Test', birthDate: new Date(), sex: Sex.M, cpf: '123' });
                    encounterRepositoryMock.findActiveByPatient.mockResolvedValue({ id: 'e1', patientId: 'p1', adtType: AdtType.A01, status: EncounterStatus.ADMITTED, ward: null, admitDate: new Date(), transferDate: null, dischargeDate: null, created_at: new Date(), updated_at: new Date(), patient: expect.any(Object), orders: [] });
                    service.transitionEncounterStatus.mockResolvedValue({ status: EncounterStatus.DISCHARGED, dischargeDate: '2023-03-01' });

                    const dto = {
                      adtType: AdtType.A03,
                      cpf: '123',
                      dischargeDate: '2023-03-01',
                    };

                    const result = await service.processAdtMessage(dto);

                    expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith('123');
                    expect(encounterRepositoryMock.findActiveByPatient).toHaveBeenCalledWith('p1');
                    expect(service.transitionEncounterStatus).toHaveBeenCalledWith('e1', {
                      status: EncounterStatus.DISCHARGED,
                      dischargeDate: '2023-03-01',
                    });
                    expect(result.patient.id).toBe('p1');
                    expect(result.encounter.status).toBe(EncounterStatus.DISCHARGED);
                    expect(result.encounter.dischargeDate).toBe('2023-03-01');
                  });




  it('should throw BadRequestException if A03 requires missing dischargeDate', async () => {
    const dto = {
      adtType: AdtType.A03,
      cpf: '123',
    };

    await expect(service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
    await expect(service.processAdtMessage(dto)).rejects.toThrow('A03 requires: dischargeDate');
    expect(patientServiceMock.findByCpfOrFail).not.toHaveBeenCalled();
  });

  it('should handle ADT type A08 successfully by updating patient details', async () => {
        patientServiceMock.findByCpfOrFail.mockResolvedValue({ id: 'p1', name: 'Old Name', birthDate: '1990-01-01', sex: Sex.M, cpf: '123' });
        patientServiceMock.updatePatient.mockResolvedValue({ id: 'p1', name: 'New Name', birthDate: '1990-01-01', sex: Sex.M, cpf: '123', email: 'new@example.com', phone: '1234567890', active: true, created_at: new Date(), updated_at: new Date() });

        const dto = {
          adtType: AdtType.A08,
          cpf: '123',
          name: 'New Name',
          birthDate: '1990-01-01',
          sex: Sex.M,
          email: 'new@example.com',
          phone: '1234567890',
        };

        const result = await service.processAdtMessage(dto);

        expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith('123');
        expect(patientServiceMock.updatePatient).toHaveBeenCalledWith('p1', {
          name: 'New Name',
          birthDate: '1990-01-01',
          sex: Sex.M,
          email: 'new@example.com',
          phone: '1234567890',
        });
        expect(result.patient.name).toBe('New Name');
        expect(result.patient.email).toBe('new@example.com');
      });


  it('should throw BadRequestException if A08 requires no fields to be updated', async () => {
    const dto = {
      adtType: AdtType.A08,
      cpf: '123',
      name: '',
      birthDate: '',
      sex: '',
      email: '',
      phone: '',
    };

    await expect(service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
    await expect(service.processAdtMessage(dto)).rejects.toThrow('A08 requires at least one field to update: name, birthDate, sex, email or phone');
    expect(patientServiceMock.findByCpfOrFail).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException for unsupported ADT type', async () => {
    const dto = {
      adtType: 999,
      cpf: '123',
    };

    await expect(service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
    await expect(service.processAdtMessage(dto)).rejects.toThrow('Unsupported ADT type: 999');
    expect(patientServiceMock.findByCpfOrFail).not.toHaveBeenCalled();
  });
});
});

  describe('FN_updateEncounter_END', () => {
describe('updateEncounter', () => {
  it('should throw BadRequestException if the encounter status is DISCHARGED', async () => {
    const id = '1';
    const dto = { admitDate: '2023-01-01' };

    encounterRepositoryMock.findById.mockResolvedValue({
      id: id,
      status: EncounterStatus.DISCHARGED,
      admitDate: new Date(),
      ward: Ward.INPATIENT,
      transferDate: null,
    });

    await expect(service.updateEncounter(id, dto)).rejects.toThrow(BadRequestException);
    await expect(service.updateEncounter(id, dto)).rejects.toThrow('Cannot update a discharged encounter');
    expect(encounterRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException if admitDate is provided but encounter status is not ADMITTED', async () => {
    const id = '1';
    const dto = { admitDate: '2023-01-01' };

    encounterRepositoryMock.findById.mockResolvedValue({
      id: id,
      status: EncounterStatus.TRANSFERRED,
      admitDate: new Date(),
      ward: Ward.INPATIENT,
      transferDate: null,
    });

    await expect(service.updateEncounter(id, dto)).rejects.toThrow(BadRequestException);
    await expect(service.updateEncounter(id, dto)).rejects.toThrow('admitDate can only be updated when encounter is ADMITTED');
    expect(encounterRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException if admitDate is a future date', async () => {
    const id = '1';
    const dto = { admitDate: '2099-01-01' };

    const now = new Date();
    encounterRepositoryMock.findById.mockResolvedValue({
      id: id,
      status: EncounterStatus.ADMITTED,
      admitDate: now,
      ward: Ward.INPATIENT,
      transferDate: null,
    });

    await expect(service.updateEncounter(id, dto)).rejects.toThrow(BadRequestException);
    await expect(service.updateEncounter(id, dto)).rejects.toThrow('admitDate cannot be a future date');
    expect(encounterRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException if admitDate is not before transferDate', async () => {
    const id = '1';
    const dto = { admitDate: '2023-01-01' };
    const transferDate = new Date('2023-01-01');

    encounterRepositoryMock.findById.mockResolvedValue({
      id: id,
      status: EncounterStatus.ADMITTED,
      admitDate: new Date('2023-01-01'),
      ward: Ward.INPATIENT,
      transferDate: transferDate,
    });

    await expect(service.updateEncounter(id, dto)).rejects.toThrow(BadRequestException);
    await expect(service.updateEncounter(id, dto)).rejects.toThrow('admitDate must be before transferDate');
    expect(encounterRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should update admitDate successfully when conditions are met', async () => {
        const id = '1';
        const dto = { admitDate: '2023-01-01' };
        const newAdmitDate = new Date('2023-01-01');
        const now = new Date();

        encounterRepositoryMock.findById.mockResolvedValue({
          id: id,
          status: EncounterStatus.ADMITTED,
          admitDate: new Date('2022-01-01'),
          ward: Ward.INPATIENT,
          transferDate: null,
        });

        encounterRepositoryMock.save.mockResolvedValue({
          id: id,
          status: EncounterStatus.ADMITTED,
          admitDate: newAdmitDate,
          ward: Ward.INPATIENT,
          transferDate: null,
        });

        await expect(service.updateEncounter(id, dto)).resolves.toBeDefined();
        expect(encounterRepositoryMock.save).toHaveBeenCalledTimes(1);
        const savedEncounter = encounterRepositoryMock.save.mock.calls[0][0];
        expect(savedEncounter.admitDate).toEqual(newAdmitDate);
    });


  it('should update ward successfully when ward is provided and different', async () => {
        const id = '1';
        const dto = { ward: Ward.ICU };

        encounterRepositoryMock.findById.mockResolvedValue({
          id: id,
          status: EncounterStatus.ADMITTED,
          ward: Ward.INPATIENT,
          admitDate: new Date(),
          transferDate: null,
        });

        encounterRepositoryMock.save.mockResolvedValue({
          id: id,
          status: EncounterStatus.ADMITTED,
          ward: Ward.ICU,
          admitDate: new Date(),
          transferDate: null,
        });

        await expect(service.updateEncounter(id, dto)).resolves.toBeDefined();
        expect(encounterRepositoryMock.save).toHaveBeenCalledTimes(1);
        const savedEncounter = encounterRepositoryMock.save.mock.calls[0][0];
        expect(savedEncounter.ward).toBe(Ward.ICU);
        expect(savedEncounter.admitDate).toBeDefined();
    });


  it('should throw BadRequestException if ward is provided and already matches the current ward', async () => {
    const id = '1';
    const dto = { ward: Ward.INPATIENT };

    encounterRepositoryMock.findById.mockResolvedValue({
      id: id,
      status: EncounterStatus.ADMITTED,
      ward: Ward.INPATIENT,
      admitDate: new Date(),
      transferDate: null,
    });

    await expect(service.updateEncounter(id, dto)).rejects.toThrow(BadRequestException);
    await expect(service.updateEncounter(id, dto)).rejects.toThrow('Ward is already INPATIENT. Use status transition for transfers');
    expect(encounterRepositoryMock.save).not.toHaveBeenCalled();
  });

  it.skip('should successfully update encounter without modifying admitDate or ward', async () => {
                    const id = '1';
                    const dto = {};

                    encounterRepositoryMock.findById.mockResolvedValue({
                      id: id,
                      status: EncounterStatus.ADMITTED,
                      admitDate: new Date(),
                      ward: Ward.INPATIENT,
                      transferDate: null,
                    });

                    encounterRepositoryMock.save.mockResolvedValue({
                      id: id,
                      status: EncounterStatus.ADMITTED,
                      admitDate: new Date(),
                      ward: Ward.INPATIENT,
                      transferDate: null,
                    });

                    const savedEncounter = await service.updateEncounter(id, dto);
                    await expect(savedEncounter).toEqual({
                      id: id,
                      status: EncounterStatus.ADMITTED,
                      admitDate: new Date(),
                      ward: Ward.INPATIENT,
                      transferDate: null,
                    });
                    expect(encounterRepositoryMock.save).toHaveBeenCalledTimes(1);
                    expect(savedEncounter.admitDate).toEqual(new Date());
                    expect(savedEncounter.ward).toEqual(Ward.INPATIENT);
                });



});
});

  // TESTS_APPEND_HERE
});
