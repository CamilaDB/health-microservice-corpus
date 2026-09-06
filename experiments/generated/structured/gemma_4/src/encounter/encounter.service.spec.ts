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
  });

  it('should throw BadRequestException if the patient is inactive', async () => {
        const dto = {
          patientId: 'patient123',
          adtType: AdtType.A01,
          admitDate: '2023-01-01',
          ward: Ward.INPATIENT,
        };
        const patient = { id: 'patient123', active: false };
        patientServiceMock.getPatientById.mockResolvedValue(patient);

        await expect(service.createEncounter(dto)).rejects.toThrow(
          'Cannot admit an inactive patient',
        );
    });


  it('should throw ConflictException if an active encounter already exists for the patient', async () => {
        const dto = {
          patientId: 'patient123',
          adtType: AdtType.A01,
          admitDate: '2023-01-01',
          ward: Ward.INPATIENT,
        };
        const patient = { id: 'patient123', active: true };
        patientServiceMock.getPatientById.mockResolvedValue(patient);

        const activeEncounter = { id: 'encounter456' };
        encounterRepositoryMock.findActiveByPatient.mockResolvedValue(activeEncounter);

        await expect(service.createEncounter(dto)).rejects.toThrow(ConflictException);
        await expect(service.createEncounter(dto)).rejects.toThrow(
          `Patient already has an active encounter (id: ${activeEncounter.id})`,
        );
      });


  it('should successfully create and save an encounter for ADT A01', async () => {
    const dto = {
      patientId: 'patient123',
      adtType: AdtType.A01,
      admitDate: '2023-01-01',
      ward: Ward.INPATIENT,
    };
    const patient = { id: 'patient123', active: true };
    patientServiceMock.getPatientById.mockResolvedValue(patient);
    encounterRepositoryMock.findActiveByPatient.mockResolvedValue(undefined);
    const createdEncounter = { id: 'encounter789' };
    encounterRepositoryMock.create.mockReturnValue(createdEncounter);
    encounterRepositoryMock.save.mockResolvedValue(createdEncounter);

    const result = await service.createEncounter(dto);

    expect(result).toEqual(createdEncounter);
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
            };
            await expect(service.validateEncounterFields(dto)).rejects.toThrow('Ward is required for ADT A02 (transfer)');
        });


  it.skip('should throw BadRequestException when adtType is A03 and ward is present', async () => {
            const dto = {
              adtType: AdtType.A03,
              ward: Ward.INPATIENT,
              admitDate: '2023-01-01',
            };
            await expect(service.validateEncounterFields(dto)).rejects.toThrow('Ward must not be informed for ADT A03 (discharge)');
        });


  it.skip('should throw BadRequestException with specific message when adtType is A08 and ward is present', async () => {
            const dto = {
              adtType: AdtType.A08,
              ward: Ward.INPATIENT,
              patientId: 'some-patient-id',
              admitDate: '2023-01-01',
            };
            await expect(service.validateEncounterFields(dto)).rejects.toThrow('Ward must not be informed for ADT A08 (update)');
        });


  it.skip('should throw BadRequestException when adtType is A08 and patientId is missing', async () => {
            const dto = {
              adtType: AdtType.A08,
              ward: undefined,
              admitDate: '2023-01-01',
            };
            await expect(service.validateEncounterFields(dto)).rejects.toThrow('PatientId is required for ADT A08 (update)');
        });

});
});

  describe('FN_listEncountersByPatient_END', () => {
describe('listEncountersByPatient', () => {
  it('should return an array of encounters when patient exists and encounters are found', async () => {
    const patientId = 'patient123';
    const dto = { status: EncounterStatus.ADMITTED };
    const encounters: Encounter[] = [{ id: 'e1', patientId: patientId, status: EncounterStatus.ADMITTED, ward: Ward.INPATIENT, admitDate: new Date() }];

    patientServiceMock.getPatientById.mockResolvedValue(undefined);
    encounterRepositoryMock.findByPatient.mockResolvedValue(encounters);

    const result = await service.listEncountersByPatient(patientId, dto);

    expect(patientServiceMock.getPatientById).toHaveBeenCalledWith(patientId);
    expect(encounterRepositoryMock.findByPatient).toHaveBeenCalledWith(patientId, dto);
    expect(result).toEqual(encounters);
  });

  it('should throw an error if getPatientById fails', async () => {
    const patientId = 'patient123';
    const dto = { status: EncounterStatus.ADMITTED };
    const error = new NotFoundException('Patient not found');

    patientServiceMock.getPatientById.mockRejectedValue(error);
    encounterRepositoryMock.findByPatient.mockResolvedValue([]);

    await expect(service.listEncountersByPatient(patientId, dto)).rejects.toThrow(error);
    expect(encounterRepositoryMock.findByPatient).not.toHaveBeenCalled();
  });

  it('should return an empty array if findByPatient returns an empty array', async () => {
    const patientId = 'patient123';
    const dto = { status: EncounterStatus.ADMITTED };
    encounterRepositoryMock.findByPatient.mockResolvedValue([]);

    patientServiceMock.getPatientById.mockResolvedValue(undefined);

    const result = await service.listEncountersByPatient(patientId, dto);

    expect(patientServiceMock.getPatientById).toHaveBeenCalledWith(patientId);
    expect(encounterRepositoryMock.findByPatient).toHaveBeenCalledWith(patientId, dto);
    expect(result).toEqual([]);
  });

  it('should throw an error if findByPatient fails', async () => {
    const patientId = 'patient123';
    const dto = { status: EncounterStatus.ADMITTED };
    const error = new Error('Database error');

    patientServiceMock.getPatientById.mockResolvedValue(undefined);
    encounterRepositoryMock.findByPatient.mockRejectedValue(error);

    await expect(service.listEncountersByPatient(patientId, dto)).rejects.toThrow(error);
  });
});
});

  describe('FN_getEncounterById_END', () => {
describe('getEncounterById', () => {
  it('should throw NotFoundException if encounter is not found', async () => {
    encounterRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(service.getEncounterById('some-id')).rejects.toThrow(NotFoundException);
    await expect(service.getEncounterById('some-id')).rejects.toThrow('Encounter with id some-id not found');
  });

  it('should return the encounter if found', async () => {
    const mockEncounter = {
      id: 'some-id',
      patientId: 'patient-123',
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

    const result = await service.getEncounterById('some-id');

    expect(encounterRepositoryMock.findById).toHaveBeenCalledWith('some-id');
    expect(result).toEqual(mockEncounter);
  });
});
});

  describe('FN_transitionEncounterStatus_END', () => {
describe('transitionEncounterStatus', () => {
  it.skip('should throw BadRequestException if the status transition is invalid', async () => {
            const mockEncounter = {
              id: '123',
              status: EncounterStatus.ADMITTED,
              ward: Ward.INPATIENT,
              admitDate: new Date('2023-01-01'),
              orders: [],
              adtType: AdtType.A01,
            };
            encounterRepositoryMock.findById.mockResolvedValue(mockEncounter);

            const dto = { status: EncounterStatus.DISCHARGED, dischargeDate: new Date('2023-01-02') };

            await expect(service.transitionEncounterStatus('123', dto)).rejects.toThrow(BadRequestException);
            await expect(service.transitionEncounterStatus('123', dto)).rejects.toThrow(
              `Invalid status transition from ${EncounterStatus.ADMITTED} to ${EncounterStatus.DISCHARGED}`,
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
    encounterRepositoryMock.findById.mockResolvedValue(mockEncounter);

    const dto = { status: EncounterStatus.DISCHARGED, dischargeDate: new Date('2023-01-02') };

    await expect(service.transitionEncounterStatus('123', dto)).rejects.toThrow(
      'Cannot discharge encounter with pending or in-progress orders',
    );
  });

  it('should throw BadRequestException if attempting to transfer without specifying ward', async () => {
    const mockEncounter = {
      id: '123',
      status: EncounterStatus.ADMITTED,
      ward: Ward.INPATIENT,
      admitDate: new Date('2023-01-01'),
      orders: [],
      adtType: AdtType.A01,
    };
    encounterRepositoryMock.findById.mockResolvedValue(mockEncounter);

    const dto = { status: EncounterStatus.TRANSFERRED, transferDate: new Date('2023-01-05') };

    await expect(service.transitionEncounterStatus('123', dto)).rejects.toThrow(
      'Ward is required for transfer',
    );
  });

  it('should throw BadRequestException if attempting to transfer with the same ward', async () => {
    const mockEncounter = {
      id: '123',
      status: EncounterStatus.ADMITTED,
      ward: Ward.INPATIENT,
      admitDate: new Date('2023-01-01'),
      orders: [],
      adtType: AdtType.A01,
    };
    encounterRepositoryMock.findById.mockResolvedValue(mockEncounter);

    const dto = { status: EncounterStatus.TRANSFERRED, ward: Ward.INPATIENT, transferDate: new Date('2023-01-05') };

    await expect(service.transitionEncounterStatus('123', dto)).rejects.toThrow(
      `Transfer requires a different ward. Current ward: ${Ward.INPATIENT}`,
    );
  });

  it('should throw BadRequestException if transferDate is missing', async () => {
    const mockEncounter = {
      id: '123',
      status: EncounterStatus.ADMITTED,
      ward: Ward.INPATIENT,
      admitDate: new Date('2023-01-01'),
      orders: [],
      adtType: AdtType.A01,
    };
    encounterRepositoryMock.findById.mockResolvedValue(mockEncounter);

    const dto = { status: EncounterStatus.TRANSFERRED, ward: Ward.SURGERY };

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
    encounterRepositoryMock.findById.mockResolvedValue(mockEncounter);

    const dto = { status: EncounterStatus.TRANSFERRED, ward: Ward.SURGERY, transferDate: new Date('2023-01-04') };

    await expect(service.transitionEncounterStatus('123', dto)).rejects.toThrow(
      'transferDate must be after admitDate',
    );
  });

  it('should successfully transition status to TRANSFERRED and update dates and ward', async () => {
    const admitDate = new Date('2023-01-01');
    const transferDate = new Date('2023-01-05');
    const encounter = {
      id: '123',
      status: EncounterStatus.ADMITTED,
      ward: Ward.INPATIENT,
      admitDate: admitDate,
      orders: [],
      adtType: AdtType.A01,
    };
    encounterRepositoryMock.findById.mockResolvedValue(encounter);
    encounterRepositoryMock.save.mockResolvedValue(encounter);

    const dto = {
      status: EncounterStatus.TRANSFERRED,
      ward: Ward.SURGERY,
      transferDate: transferDate,
    };

    await service.transitionEncounterStatus('123', dto);

    expect(encounterRepositoryMock.save).toHaveBeenCalledTimes(1);
    const savedEncounter = await encounterRepositoryMock.save.mock.results[0].value;
    expect(savedEncounter.status).toBe(EncounterStatus.TRANSFERRED);
    expect(savedEncounter.ward).toBe(Ward.SURGERY);
    expect(savedEncounter.transferDate).toEqual(transferDate);
  });

  it('should successfully transition status to DISCHARGED and update dates', async () => {
    const admitDate = new Date('2023-01-01');
    const transferDate = new Date('2023-01-05');
    const dischargeDate = new Date('2023-01-10');
    const encounter = {
      id: '123',
      status: EncounterStatus.TRANSFERRED,
      ward: Ward.SURGERY,
      admitDate: admitDate,
      transferDate: transferDate,
      orders: [],
      adtType: AdtType.A01,
    };
    encounterRepositoryMock.findById.mockResolvedValue(encounter);
    encounterRepositoryMock.save.mockResolvedValue(encounter);

    const dto = {
      status: EncounterStatus.DISCHARGED,
      dischargeDate: dischargeDate,
    };

    await service.transitionEncounterStatus('123', dto);

    expect(encounterRepositoryMock.save).toHaveBeenCalledTimes(1);
    const savedEncounter = await encounterRepositoryMock.save.mock.results[0].value;
    expect(savedEncounter.status).toBe(EncounterStatus.DISCHARGED);
    expect(savedEncounter.dischargeDate).toEqual(dischargeDate);
  });

  it('should throw BadRequestException if dischargeDate is missing', async () => {
    const mockEncounter = {
      id: '123',
      status: EncounterStatus.TRANSFERRED,
      ward: Ward.SURGERY,
      admitDate: new Date('2023-01-01'),
      transferDate: new Date('2023-01-05'),
      orders: [],
      adtType: AdtType.A01,
    };
    encounterRepositoryMock.findById.mockResolvedValue(mockEncounter);

    const dto = { status: EncounterStatus.DISCHARGED };

    await expect(service.transitionEncounterStatus('123', dto)).rejects.toThrow(
      'dischargeDate is required for discharge',
    );
  });

  it('should throw BadRequestException if dischargeDate is before admitDate', async () => {
    const admitDate = new Date('2023-01-10');
    const transferDate = new Date('2023-01-05');
    const encounter = {
      id: '123',
      status: EncounterStatus.TRANSFERRED,
      ward: Ward.SURGERY,
      admitDate: admitDate,
      transferDate: transferDate,
      orders: [],
      adtType: AdtType.A01,
    };
    encounterRepositoryMock.findById.mockResolvedValue(encounter);

    const dto = {
      status: EncounterStatus.DISCHARGED,
      dischargeDate: new Date('2023-01-01'), // Before admitDate
    };

    await expect(service.transitionEncounterStatus('123', dto)).rejects.toThrow(
      'dischargeDate must be after admitDate',
    );
  });

  it('should throw BadRequestException if dischargeDate is before transferDate', async () => {
    const admitDate = new Date('2023-01-01');
    const transferDate = new Date('2023-01-05');
    const dischargeDate = new Date('2023-01-04'); // Before transferDate
    const encounter = {
      id: '123',
      status: EncounterStatus.TRANSFERRED,
      ward: Ward.SURGERY,
      admitDate: admitDate,
      transferDate: transferDate,
      orders: [],
      adtType: AdtType.A01,
    };
    encounterRepositoryMock.findById.mockResolvedValue(encounter);

    const dto = {
      status: EncounterStatus.DISCHARGED,
      dischargeDate: dischargeDate,
    };

    await expect(service.transitionEncounterStatus('123', dto)).rejects.toThrow(
      'dischargeDate must be after transferDate',
    );
  });

  it('should throw BadRequestException if ADT A08 encounter attempts a status transition', async () => {
    const mockEncounter = {
      id: '123',
      status: EncounterStatus.ADMITTED,
      ward: Ward.INPATIENT,
      admitDate: new Date('2023-01-01'),
      orders: [],
      adtType: AdtType.A08,
    };
    encounterRepositoryMock.findById.mockResolvedValue(mockEncounter);

    const dto = { status: EncounterStatus.TRANSFERRED, ward: Ward.SURGERY, transferDate: new Date('2023-01-05') };

    await expect(service.transitionEncounterStatus('123', dto)).rejects.toThrow(
      'ADT A08 encounters cannot have status transitions',
    );
  });
});
});

  describe('FN_processAdtMessage_END', () => {
describe('processAdtMessage', () => {
  it.skip('should handle AdtType A01 successfully by creating an encounter', async () => {
            patientServiceMock.findByCpfOrFail.mockResolvedValue({ id: 'p1', name: 'Test', birthDate: new Date(), sex: Sex.M, cpf: '123' });
            service.createEncounter.mockResolvedValue({ id: 'e1', patientId: 'p1', adtType: AdtType.A01, admitDate: new Date(), ward: null });

            const dto = {
              adtType: AdtType.A01,
              cpf: '123',
              name: 'Test',
              birthDate: '1990-01-01',
              sex: Sex.M,
              admitDate: '2023-01-01',
            };

            const result = await service.processAdtMessage(dto);

            expect(result).toEqual({
              patient: { id: 'p1', name: 'Test', birthDate: new Date(), cpf: '123', sex: Sex.M, email: undefined, phone: undefined, active: true, created_at: expect.any(Date), updated_at: expect.any(Date), encounters: [] },
              encounter: { id: 'e1', patientId: 'p1', adtType: AdtType.A01, admitDate: new Date(), ward: null }
            });

            expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith('123');
            expect(service.createEncounter).toHaveBeenCalledWith({
              patientId: 'p1',
              adtType: AdtType.A01,
              admitDate: '2023-01-01',
              ward: undefined,
            });
        });


  it('should throw BadRequestException if A01 requires missing fields', async () => {
    const dto = {
      adtType: AdtType.A01,
      cpf: '123',
      name: undefined,
      birthDate: '1990-01-01',
      sex: Sex.M,
      admitDate: '2023-01-01',
    };

    await expect(service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
    await expect(service.processAdtMessage(dto)).rejects.toThrow('A01 requires: name, birthDate, sex, admitDate');
    expect(patientServiceMock.findByCpfOrFail).not.toHaveBeenCalled();
  });

  it.skip('should handle AdtType A02 successfully by transferring an encounter', async () => {
            patientServiceMock.findByCpfOrFail.mockResolvedValue({ id: 'p1', name: 'Test', birthDate: new Date(), sex: Sex.M, cpf: '123' });
            encounterRepositoryMock.findActiveByPatient.mockResolvedValue({ id: 'e1', patientId: 'p1', status: EncounterStatus.ADMITTED, ward: Ward.INPATIENT, admitDate: new Date(), updated_at: new Date() });
            service.transitionEncounterStatus.mockResolvedValue({ status: EncounterStatus.TRANSFERRED, ward: 'WardB', transferDate: '2023-02-01' });

            const dto = {
              adtType: AdtType.A02,
              cpf: '123',
              ward: 'WardB',
              transferDate: '2023-02-01',
            };

            const result = await service.processAdtMessage(dto);

            expect(result).toEqual({
              patient: { id: 'p1', name: 'Test', birthDate: new Date(), cpf: '123', sex: Sex.M, email: undefined, phone: undefined, active: true, created_at: expect.any(Date), updated_at: expect.any(Date), encounters: [] },
              encounter: { id: 'e1', patientId: 'p1', status: EncounterStatus.TRANSFERRED, ward: 'WardB', transferDate: '2023-02-01', created_at: expect.any(Date), updated_at: expect.any(Date), patient: { id: 'p1', name: 'Test', birthDate: new Date(), cpf: '123', sex: Sex.M, email: undefined, phone: undefined, active: true, created_at: expect.any(Date), updated_at: expect.any(Date), encounters: [] } }
            });

            expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith('123');
            expect(encounterRepositoryMock.findActiveByPatient).toHaveBeenCalledWith('p1');
            expect(service.transitionEncounterStatus).toHaveBeenCalledWith('e1', { status: EncounterStatus.TRANSFERRED, ward: 'WardB', transferDate: '2023-02-01' });
        });


  it('should throw BadRequestException if A02 requires missing ward or transferDate', async () => {
    const dto = {
      adtType: AdtType.A02,
      cpf: '123',
      ward: undefined,
      transferDate: '2023-02-01',
    };

    await expect(service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
    await expect(service.processAdtMessage(dto)).rejects.toThrow('A02 requires: ward, transferDate');
  });

  it('should throw NotFoundException if no active encounter is found for A02', async () => {
        patientServiceMock.findByCpfOrFail.mockResolvedValue({ id: 'p1', name: 'Test', birthDate: new Date(), sex: Sex.M, cpf: '123' });
        encounterRepositoryMock.findActiveByPatient.mockResolvedValue(undefined);
        jest.spyOn(service, 'transitionEncounterStatus').mockResolvedValue({});

        const dto = {
          adtType: AdtType.A02,
          cpf: '123',
          ward: 'WardB',
          transferDate: '2023-02-01',
        };

        await expect(service.processAdtMessage(dto)).rejects.toThrow(NotFoundException);
        await expect(service.processAdtMessage(dto)).rejects.toThrow('No active encounter found for patient with cpf 123');
        expect(service.transitionEncounterStatus).not.toHaveBeenCalled();
    });


  it.skip('should handle AdtType A03 successfully by discharging an encounter', async () => {
                    patientServiceMock.findByCpfOrFail.mockResolvedValue({ id: 'p1', name: 'Test', birthDate: new Date(), sex: Sex.M, cpf: '123' });
                    encounterRepositoryMock.findActiveByPatient.mockResolvedValue({ id: 'e1', patientId: 'p1', status: EncounterStatus.ADMITTED, ward: Ward.INPATIENT, admitDate: new Date(), updated_at: new Date() });
                    jest.spyOn(service, 'transitionEncounterStatus').mockResolvedValue({ status: EncounterStatus.DISCHARGED, dischargeDate: '2023-03-01' });

                    const dto = {
                      adtType: AdtType.A03,
                      cpf: '123',
                      dischargeDate: '2023-03-01',
                    };

                    const result = await service.processAdtMessage(dto);

                    expect(result).toEqual({
                      patient: { id: 'p1', name: 'Test', birthDate: '2026-09-01T09:30:09.367Z', cpf: '123', sex: Sex.M, email: undefined, phone: undefined, active: true, created_at: expect.any(Date), updated_at: expect.any(Date), encounters: [] },
                      encounter: { id: 'e1', status: EncounterStatus.DISCHARGED, dischargeDate: '2023-03-01', created_at: expect.any(Date), updated_at: expect.any(Date), patient: { id: 'p1', name: 'Test', birthDate: '2026-09-01T09:30:09.367Z', cpf: '123', sex: Sex.M, email: undefined, phone: undefined, active: true, created_at: expect.any(Date), updated_at: expect.any(Date), encounters: [] } }
                    });

                    expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith('123');
                    expect(encounterRepositoryMock.findActiveByPatient).toHaveBeenCalledWith('p1');
                    expect(service.transitionEncounterStatus).toHaveBeenCalledWith('e1', { status: EncounterStatus.DISCHARGED, dischargeDate: '2023-03-01' });
                });




  it('should throw BadRequestException if A03 requires missing dischargeDate', async () => {
    const dto = {
      adtType: AdtType.A03,
      cpf: '123',
      dischargeDate: undefined,
    };

    await expect(service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
    await expect(service.processAdtMessage(dto)).rejects.toThrow('A03 requires: dischargeDate');
  });

  it('should throw NotFoundException if no active encounter is found for A03', async () => {
    patientServiceMock.findByCpfOrFail.mockResolvedValue({ id: 'p1', name: 'Test', birthDate: new Date(), sex: Sex.M, cpf: '123' });
    encounterRepositoryMock.findActiveByPatient.mockResolvedValue(undefined);

    const dto = {
      adtType: AdtType.A03,
      cpf: '123',
      dischargeDate: '2023-03-01',
    };

    await expect(service.processAdtMessage(dto)).rejects.toThrow(NotFoundException);
    await expect(service.processAdtMessage(dto)).rejects.toThrow('No active encounter found for patient with cpf 123');
  });

  it('should handle AdtType A08 successfully by updating patient details', async () => {
        patientServiceMock.findByCpfOrFail.mockResolvedValue({ id: 'p1', name: 'OldName', birthDate: '1990-01-01', sex: Sex.M, cpf: '123', email: 'old@example.com', phone: '111' });
        patientServiceMock.updatePatient.mockResolvedValue({ id: 'p1', name: 'NewName', birthDate: '1990-01-01', sex: Sex.M, cpf: '123', email: 'new@example.com', phone: '111', active: true, created_at: expect.any(Date), updated_at: expect.any(Date) });

        const dto = {
          adtType: AdtType.A08,
          cpf: '123',
          name: 'NewName',
          birthDate: '1990-01-01',
          sex: Sex.M,
          email: 'new@example.com',
          phone: '111',
        };

        const result = await service.processAdtMessage(dto);

        expect(result).toEqual({
          patient: { id: 'p1', name: 'NewName', birthDate: '1990-01-01', cpf: '123', sex: Sex.M, email: 'new@example.com', phone: '111', active: true, created_at: expect.any(Date), updated_at: expect.any(Date) },
        });

        expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith('123');
        expect(patientServiceMock.updatePatient).toHaveBeenCalledWith('p1', {
          name: 'NewName',
          birthDate: '1990-01-01',
          sex: Sex.M,
          email: 'new@example.com',
          phone: '111',
        });
      });


  it('should throw BadRequestException if A08 requires missing fields', async () => {
    const dto = {
      adtType: AdtType.A08,
      cpf: '123',
      name: undefined,
      birthDate: undefined,
      sex: undefined,
      email: undefined,
      phone: undefined,
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
  });
});
});

  describe('FN_updateEncounter_END', () => {
describe('updateEncounter', () => {
  it('should throw BadRequestException if the encounter is DISCHARGED', async () => {
    const id = 'encounter-1';
    const dto = { admitDate: '2023-01-01' };

    encounterRepositoryMock.findById.mockResolvedValue({
      id,
      status: EncounterStatus.DISCHARGED,
      ward: Ward.INPATIENT,
      admitDate: new Date(),
      transferDate: null,
    });

    await expect(service.updateEncounter(id, dto)).rejects.toThrow(BadRequestException);
    await expect(service.updateEncounter(id, dto)).rejects.toThrow('Cannot update a discharged encounter');
    expect(encounterRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException if admitDate is provided but encounter status is not ADMITTED', async () => {
    const id = 'encounter-2';
    const dto = { admitDate: '2023-01-01' };

    encounterRepositoryMock.findById.mockResolvedValue({
      id,
      status: EncounterStatus.TRANSFERRED,
      ward: Ward.INPATIENT,
      admitDate: new Date(),
      transferDate: null,
    });

    await expect(service.updateEncounter(id, dto)).rejects.toThrow(BadRequestException);
    await expect(service.updateEncounter(id, dto)).rejects.toThrow('admitDate can only be updated when encounter is ADMITTED');
    expect(encounterRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException if admitDate is a future date', async () => {
    const id = 'encounter-3';
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const dto = { admitDate: futureDate.toISOString() };

    encounterRepositoryMock.findById.mockResolvedValue({
      id,
      status: EncounterStatus.ADMITTED,
      ward: Ward.INPATIENT,
      admitDate: new Date(),
      transferDate: null,
    });

    await expect(service.updateEncounter(id, dto)).rejects.toThrow(BadRequestException);
    await expect(service.updateEncounter(id, dto)).rejects.toThrow('admitDate cannot be a future date');
    expect(encounterRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException if admitDate is not before transferDate', async () => {
    const id = 'encounter-4';
    const transferDate = new Date('2023-01-01');
    const admitDate = new Date('2023-01-02'); // admitDate >= transferDate
    const dto = { admitDate: admitDate.toISOString() };

    encounterRepositoryMock.findById.mockResolvedValue({
      id,
      status: EncounterStatus.ADMITTED,
      ward: Ward.INPATIENT,
      admitDate: new Date(),
      transferDate: transferDate,
    });

    await expect(service.updateEncounter(id, dto)).rejects.toThrow(BadRequestException);
    await expect(service.updateEncounter(id, dto)).rejects.toThrow('admitDate must be before transferDate');
    expect(encounterRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should successfully update admitDate when conditions are met', async () => {
            const id = 'encounter-5';
            const admitDate = new Date('2023-01-01T10:00:00.000Z');
            const dto = { admitDate: admitDate.toISOString() };

            encounterRepositoryMock.findById.mockResolvedValue({
              id,
              status: EncounterStatus.ADMITTED,
              ward: Ward.INPATIENT,
              admitDate: new Date(),
              transferDate: null,
            });

            encounterRepositoryMock.save.mockResolvedValue({
              id,
              status: EncounterStatus.ADMITTED,
              ward: Ward.INPATIENT,
              admitDate: admitDate,
              transferDate: null,
            });

            const result = await service.updateEncounter(id, dto);

            expect(result).toBeDefined();
            expect(result.admitDate).toEqual(admitDate);
            expect(encounterRepositoryMock.save).toHaveBeenCalledTimes(1);
        });



  it.skip('should successfully update ward when ward is provided and different from current ward', async () => {
        const id = 'encounter-6';
        const newWard = Ward.SURGERY;
        const dto = { ward: newWard };

        encounterRepositoryMock.findById.mockResolvedValue({
          id,
          status: EncounterStatus.ADMITTED,
          ward: Ward.INPATIENT,
          admitDate: new Date(),
          transferDate: null,
        });

        const result = await service.updateEncounter(id, dto);

        expect(result.ward).toBe(newWard);
        expect(encounterRepositoryMock.save).toHaveBeenCalledTimes(1);
      });

  it('should throw BadRequestException if ward is provided but is the same as the current ward', async () => {
    const id = 'encounter-7';
    const currentWard = Ward.INPATIENT;
    const dto = { ward: currentWard };

    encounterRepositoryMock.findById.mockResolvedValue({
      id,
      status: EncounterStatus.ADMITTED,
      ward: currentWard,
      admitDate: new Date(),
      transferDate: null,
    });

    await expect(service.updateEncounter(id, dto)).rejects.toThrow(BadRequestException);
    await expect(service.updateEncounter(id, dto)).rejects.toThrow(`Ward is already ${currentWard}. Use status transition for transfers`);
    expect(encounterRepositoryMock.save).not.toHaveBeenCalled();
  });
});
});

  // TESTS_APPEND_HERE
});
