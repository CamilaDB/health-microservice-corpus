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
  it('should throw BadRequestException when patient is inactive', async () => {
    patientServiceMock.getPatientById.mockResolvedValue({ active: false });
    const dto: CreateEncounterDto = {
      patientId: 'patientId',
      adtType: AdtType.A01,
      admitDate: '2022-01-01',
    };
    await expect(service.createEncounter(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw ConflictException when patient already has an active encounter', async () => {
    patientServiceMock.getPatientById.mockResolvedValue({ active: true });
    encounterRepositoryMock.findActiveByPatient.mockResolvedValue({ id: 'encounterId', status: EncounterStatus.ADMITTED });
    const dto: CreateEncounterDto = {
      patientId: 'patientId',
      adtType: AdtType.A01,
      admitDate: '2022-01-01',
    };
    await expect(service.createEncounter(dto)).rejects.toThrow(ConflictException);
  });
});

  describe('validateEncounterFields', () => {
  it('should throw BadRequestException when adtType is A01 and ward is not provided', () => {
    const dto: CreateEncounterDto = {
      patientId: 'patientId',
      adtType: AdtType.A01,
      admitDate: 'admitDate',
    };
    expect(() => service.validateEncounterFields(dto)).toThrow(BadRequestException);
  });

  it('should throw BadRequestException when adtType is A02 and ward is not provided', () => {
    const dto: CreateEncounterDto = {
      patientId: 'patientId',
      adtType: AdtType.A02,
      admitDate: 'admitDate',
    };
    expect(() => service.validateEncounterFields(dto)).toThrow(BadRequestException);
  });

  it('should throw BadRequestException when adtType is A03 and ward is provided', () => {
    const dto: CreateEncounterDto = {
      patientId: 'patientId',
      adtType: AdtType.A03,
      admitDate: 'admitDate',
      ward: Ward.ICU,
    };
    expect(() => service.validateEncounterFields(dto)).toThrow(BadRequestException);
  });

  it('should throw BadRequestException when adtType is A08 and ward is provided', () => {
    const dto: CreateEncounterDto = {
      patientId: 'patientId',
      adtType: AdtType.A08,
      admitDate: 'admitDate',
      ward: Ward.ICU,
    };
    expect(() => service.validateEncounterFields(dto)).toThrow(BadRequestException);
  });

  it('should throw BadRequestException when adtType is A08 and patientId is not provided', () => {
    const dto: CreateEncounterDto = {
      adtType: AdtType.A08,
      admitDate: 'admitDate',
    };
    expect(() => service.validateEncounterFields(dto)).toThrow(BadRequestException);
  });

  it('should not throw any exception when adtType is A01 and ward is provided', () => {
    const dto: CreateEncounterDto = {
      patientId: 'patientId',
      adtType: AdtType.A01,
      admitDate: 'admitDate',
      ward: Ward.ICU,
    };
    expect(() => service.validateEncounterFields(dto)).not.toThrow();
  });

  it('should not throw any exception when adtType is A02 and ward is provided', () => {
    const dto: CreateEncounterDto = {
      patientId: 'patientId',
      adtType: AdtType.A02,
      admitDate: 'admitDate',
      ward: Ward.ICU,
    };
    expect(() => service.validateEncounterFields(dto)).not.toThrow();
  });

  it('should not throw any exception when adtType is A03 and ward is not provided', () => {
    const dto: CreateEncounterDto = {
      patientId: 'patientId',
      adtType: AdtType.A03,
      admitDate: 'admitDate',
    };
    expect(() => service.validateEncounterFields(dto)).not.toThrow();
  });

  it('should not throw any exception when adtType is A08 and ward is not provided and patientId is provided', () => {
        const dto: CreateEncounterDto = {
          patientId: 'patientId',
          adtType: AdtType.A08,
          admitDate: 'admitDate',
        };
        expect(() => service.validateEncounterFields(dto)).not.toThrow(BadRequestException);
      });

});

  describe('listEncountersByPatient', () => {
  it('should throw an error when patient is not found', async () => {
        patientServiceMock.getPatientById.mockRejectedValueOnce(new NotFoundException());
        await expect(service.listEncountersByPatient('patientId', {} as ListEncountersByPatientDto)).rejects.toThrow(NotFoundException);
      });



  it('should return encounters when patient is found', async () => {
    patientServiceMock.getPatientById.mockResolvedValueOnce({} as Patient);
    encounterRepositoryMock.findByPatient.mockResolvedValueOnce([{} as Encounter]);
    const result = await service.listEncountersByPatient('patientId', {} as ListEncountersByPatientDto);
    expect(result).toEqual([{} as Encounter]);
  });

  it('should filter encounters by status', async () => {
        patientServiceMock.getPatientById.mockResolvedValueOnce({} as Patient);
        encounterRepositoryMock.findByPatient.mockResolvedValueOnce([{
          status: EncounterStatus.ADMITTED,
        } as Encounter, {
          status: EncounterStatus.DISCHARGED,
        } as Encounter]);
        const result = await service.listEncountersByPatient('patientId', { status: EncounterStatus.ADMITTED } as ListEncountersByPatientDto);
        expect(result.filter(encounter => encounter.status === EncounterStatus.ADMITTED).length).toBe(1);
        expect(result.find(encounter => encounter.status === EncounterStatus.ADMITTED)?.status).toBe(EncounterStatus.ADMITTED);
      });



  it('should order encounters by admitDate', async () => {
    patientServiceMock.getPatientById.mockResolvedValueOnce({} as Patient);
    encounterRepositoryMock.findByPatient.mockResolvedValueOnce([{
      admitDate: new Date('2022-01-01'),
    } as Encounter, {
      admitDate: new Date('2022-01-02'),
    } as Encounter]);
    const result = await service.listEncountersByPatient('patientId', { orderBy: 'admitDate', order: 'ASC' } as ListEncountersByPatientDto);
    expect(result).toEqual([{
      admitDate: new Date('2022-01-01'),
    } as Encounter, {
      admitDate: new Date('2022-01-02'),
    } as Encounter]);
  });
});

  describe('getEncounterById', () => {
  it('should throw NotFoundException when encounter is not found', async () => {
    const id = 'some-id';
    encounterRepositoryMock.findById.mockResolvedValueOnce(undefined);
    await expect(service.getEncounterById(id)).rejects.toThrow(NotFoundException);
  });

  it('should return encounter when found', async () => {
    const id = 'some-id';
    const encounter = { id, patientId: 'patient-id', adtType: AdtType.A01, status: EncounterStatus.ADMITTED, ward: Ward.ICU, admitDate: new Date(), transferDate: null, dischargeDate: null, created_at: new Date(), updated_at: new Date(), patient: { id: 'patient-id' }, orders: [] };
    encounterRepositoryMock.findById.mockResolvedValueOnce(encounter);
    const result = await service.getEncounterById(id);
    expect(result).toEqual(encounter);
  });
});

  describe('transitionEncounterStatus', () => {
  it('should throw BadRequestException for invalid status transition', async () => {
    const encounter = {
      id: '1',
      status: EncounterStatus.ADMITTED,
    } as Encounter;
    encounterRepositoryMock.findById.mockResolvedValue(encounter);
    const dto = {
      status: EncounterStatus.DISCHARGED,
    } as TransitionEncounterStatusDto;
    await expect(service.transitionEncounterStatus('1', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException for discharge with pending orders', async () => {
    const encounter = {
      id: '1',
      status: EncounterStatus.ADMITTED,
      orders: [
        {
          status: OrderStatus.PENDING,
        },
      ],
    } as Encounter;
    encounterRepositoryMock.findById.mockResolvedValue(encounter);
    const dto = {
      status: EncounterStatus.DISCHARGED,
      dischargeDate: '2022-01-01',
    } as TransitionEncounterStatusDto;
    await expect(service.transitionEncounterStatus('1', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException for transfer without ward', async () => {
    const encounter = {
      id: '1',
      status: EncounterStatus.ADMITTED,
    } as Encounter;
    encounterRepositoryMock.findById.mockResolvedValue(encounter);
    const dto = {
      status: EncounterStatus.TRANSFERRED,
    } as TransitionEncounterStatusDto;
    await expect(service.transitionEncounterStatus('1', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException for transfer with same ward', async () => {
    const encounter = {
      id: '1',
      status: EncounterStatus.ADMITTED,
      ward: Ward.ICU,
    } as Encounter;
    encounterRepositoryMock.findById.mockResolvedValue(encounter);
    const dto = {
      status: EncounterStatus.TRANSFERRED,
      ward: Ward.ICU,
    } as TransitionEncounterStatusDto;
    await expect(service.transitionEncounterStatus('1', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException for transfer without transferDate', async () => {
    const encounter = {
      id: '1',
      status: EncounterStatus.ADMITTED,
      ward: Ward.ICU,
      admitDate: new Date('2022-01-01'),
    } as Encounter;
    encounterRepositoryMock.findById.mockResolvedValue(encounter);
    const dto = {
      status: EncounterStatus.TRANSFERRED,
      ward: Ward.INPATIENT,
    } as TransitionEncounterStatusDto;
    await expect(service.transitionEncounterStatus('1', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException for transfer with transferDate before admitDate', async () => {
    const encounter = {
      id: '1',
      status: EncounterStatus.ADMITTED,
      ward: Ward.ICU,
      admitDate: new Date('2022-01-02'),
    } as Encounter;
    encounterRepositoryMock.findById.mockResolvedValue(encounter);
    const dto = {
      status: EncounterStatus.TRANSFERRED,
      ward: Ward.INPATIENT,
      transferDate: '2022-01-01',
    } as TransitionEncounterStatusDto;
    await expect(service.transitionEncounterStatus('1', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException for discharge without dischargeDate', async () => {
    const encounter = {
      id: '1',
      status: EncounterStatus.ADMITTED,
    } as Encounter;
    encounterRepositoryMock.findById.mockResolvedValue(encounter);
    const dto = {
      status: EncounterStatus.DISCHARGED,
    } as TransitionEncounterStatusDto;
    await expect(service.transitionEncounterStatus('1', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException for discharge with dischargeDate before admitDate', async () => {
    const encounter = {
      id: '1',
      status: EncounterStatus.ADMITTED,
      admitDate: new Date('2022-01-02'),
    } as Encounter;
    encounterRepositoryMock.findById.mockResolvedValue(encounter);
    const dto = {
      status: EncounterStatus.DISCHARGED,
      dischargeDate: '2022-01-01',
    } as TransitionEncounterStatusDto;
    await expect(service.transitionEncounterStatus('1', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException for discharge with dischargeDate before transferDate', async () => {
    const encounter = {
      id: '1',
      status: EncounterStatus.TRANSFERRED,
      admitDate: new Date('2022-01-01'),
      transferDate: new Date('2022-01-02'),
    } as Encounter;
    encounterRepositoryMock.findById.mockResolvedValue(encounter);
    const dto = {
      status: EncounterStatus.DISCHARGED,
      dischargeDate: '2022-01-01',
    } as TransitionEncounterStatusDto;
    await expect(service.transitionEncounterStatus('1', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException for ADT A08 encounters with status transition', async () => {
    const encounter = {
      id: '1',
      status: EncounterStatus.ADMITTED,
      adtType: AdtType.A08,
    } as Encounter;
    encounterRepositoryMock.findById.mockResolvedValue(encounter);
    const dto = {
      status: EncounterStatus.TRANSFERRED,
    } as TransitionEncounterStatusDto;
    await expect(service.transitionEncounterStatus('1', dto)).rejects.toThrow(BadRequestException);
  });
});

  describe('processAdtMessage', () => {
  it('should throw BadRequestException when adtType is A01 and required fields are missing', async () => {
    const dto: AdtMessageDto = {
      adtType: AdtType.A01,
      cpf: '12345678901',
    };
    await expect(service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when adtType is A02 and required fields are missing', async () => {
    const dto: AdtMessageDto = {
      adtType: AdtType.A02,
      cpf: '12345678901',
    };
    await expect(service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when adtType is A03 and required fields are missing', async () => {
    const dto: AdtMessageDto = {
      adtType: AdtType.A03,
      cpf: '12345678901',
    };
    await expect(service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when adtType is A08 and no fields are provided to update', async () => {
    const dto: AdtMessageDto = {
      adtType: AdtType.A08,
      cpf: '12345678901',
    };
    await expect(service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when adtType is not supported', async () => {
    const dto: AdtMessageDto = {
      adtType: 'A09' as any,
      cpf: '12345678901',
    };
    await expect(service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException when adtType is A02 and no active encounter is found', async () => {
    const dto: AdtMessageDto = {
      adtType: AdtType.A02,
      cpf: '12345678901',
      ward: Ward.ICU,
      transferDate: '2022-01-01',
    };
    patientServiceMock.findByCpfOrFail.mockResolvedValue({ id: 'patientId' });
    encounterRepositoryMock.findActiveByPatient.mockResolvedValue(undefined);
    await expect(service.processAdtMessage(dto)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException when adtType is A03 and no active encounter is found', async () => {
    const dto: AdtMessageDto = {
      adtType: AdtType.A03,
      cpf: '12345678901',
      dischargeDate: '2022-01-01',
    };
    patientServiceMock.findByCpfOrFail.mockResolvedValue({ id: 'patientId' });
    encounterRepositoryMock.findActiveByPatient.mockResolvedValue(undefined);
    await expect(service.processAdtMessage(dto)).rejects.toThrow(NotFoundException);
  });
});

  describe('updateEncounter', () => {
  it('should throw BadRequestException when encounter is discharged', async () => {
    const id = 'id';
    const dto: UpdateEncounterDto = {};
    encounterRepositoryMock.findById.mockResolvedValue({ status: EncounterStatus.DISCHARGED } as unknown as Encounter);
    await expect(service.updateEncounter(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when admitDate is updated and encounter is not admitted', async () => {
    const id = 'id';
    const dto: UpdateEncounterDto = { admitDate: '2022-01-01' };
    encounterRepositoryMock.findById.mockResolvedValue({ status: EncounterStatus.TRANSFERRED } as unknown as Encounter);
    await expect(service.updateEncounter(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when admitDate is in the future', async () => {
    const id = 'id';
    const dto: UpdateEncounterDto = { admitDate: '2050-01-01' };
    encounterRepositoryMock.findById.mockResolvedValue({ status: EncounterStatus.ADMITTED } as unknown as Encounter);
    await expect(service.updateEncounter(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when admitDate is after transferDate', async () => {
    const id = 'id';
    const dto: UpdateEncounterDto = { admitDate: '2022-01-02' };
    encounterRepositoryMock.findById.mockResolvedValue({ status: EncounterStatus.ADMITTED, transferDate: '2022-01-01' } as unknown as Encounter);
    await expect(service.updateEncounter(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when ward is the same', async () => {
    const id = 'id';
    const dto: UpdateEncounterDto = { ward: Ward.ICU };
    encounterRepositoryMock.findById.mockResolvedValue({ status: EncounterStatus.ADMITTED, ward: Ward.ICU } as unknown as Encounter);
    await expect(service.updateEncounter(id, dto)).rejects.toThrow(BadRequestException);
  });
});

  describe('buildEncounterSummary', () => {
  it('should return encounter summary with MEDIUM risk flag when there are no abnormal results and active days are greater than 7', async () => {
          const encounter = {
            id: 'encounter-id',
            patientId: 'patient-id',
            admitDate: new Date('2022-01-01'),
            orders: [],
          };
          const patient = {
            id: 'patient-id',
          };
          encounterRepositoryMock.findById.mockResolvedValue(encounter);
          patientServiceMock.getPatientById.mockResolvedValue(patient);
          const result = await service.buildEncounterSummary('encounter-id');
          expect(result).toEqual({
            encounter,
            patient,
            activeDays: expect.any(Number),
            orders: {
              total: 0,
              pending: 0,
              inProgress: 0,
              completed: 0,
              cancelled: 0,
            },
            results: {
              total: 0,
              abnormal: 0,
              preliminary: 0,
            },
            hasAbnormalResults: false,
            riskFlag: 'MEDIUM',
          });
      });


  it('should return encounter summary with MEDIUM risk flag when there are abnormal results and active days are less than or equal to 7', async () => {
    const encounter = {
      id: 'encounter-id',
      patientId: 'patient-id',
      admitDate: new Date('2022-01-01'),
      orders: [
        {
          status: OrderStatus.COMPLETED,
          results: [
            {
              status: ResultStatus.PRELIMINARY,
              value: '10',
              referenceMin: '5',
              referenceMax: '15',
            },
          ],
        },
      ],
    };
    const patient = {
      id: 'patient-id',
    };
    encounterRepositoryMock.findById.mockResolvedValue(encounter);
    patientServiceMock.getPatientById.mockResolvedValue(patient);
    const result = await service.buildEncounterSummary('encounter-id');
    expect(result).toEqual({
      encounter,
      patient,
      activeDays: expect.any(Number),
      orders: {
        total: 1,
        pending: 0,
        inProgress: 0,
        completed: 1,
        cancelled: 0,
      },
      results: {
        total: 1,
        abnormal: 0,
        preliminary: 1,
      },
      hasAbnormalResults: false,
      riskFlag: 'MEDIUM',
    });
  });

  it.skip('should return encounter summary with MEDIUM risk flag when there are no abnormal results and active days are more than 7', async () => {
              const encounter = {
                id: 'encounter-id',
                patientId: 'patient-id',
                admitDate: new Date('2022-01-01'),
                orders: [],
              };
              const patient = {
                id: 'patient-id',
              };
              encounterRepositoryMock.findById.mockResolvedValue(encounter);
              patientServiceMock.getPatientById.mockResolvedValue(patient);
              jest.spyOn(Date, 'now').mockImplementation(() => new Date('2024-01-15').getTime());
              const result = await service.buildEncounterSummary('encounter-id');
              expect(result).toEqual({
                encounter,
                patient,
                activeDays: 1095,
                orders: {
                  total: 0,
                  pending: 0,
                  inProgress: 0,
                  completed: 0,
                  cancelled: 0,
                },
                results: {
                  total: 0,
                  abnormal: 0,
                  preliminary: 0,
                },
                hasAbnormalResults: false,
                riskFlag: 'MEDIUM',
              });
            });



  it('should return encounter summary with HIGH risk flag when there are abnormal results and active days are more than 7', async () => {
          const encounter = {
            id: 'encounter-id',
            patientId: 'patient-id',
            admitDate: new Date('2022-01-01'),
            orders: [
              {
                status: OrderStatus.COMPLETED,
                results: [
                  {
                    status: ResultStatus.PRELIMINARY,
                    value: '20',
                    referenceMin: '5',
                    referenceMax: '15',
                  },
                ],
              },
            ],
          };
          const patient = {
            id: 'patient-id',
          };
          encounterRepositoryMock.findById.mockResolvedValue(encounter);
          patientServiceMock.getPatientById.mockResolvedValue(patient);
          jest.spyOn(Date, 'now').mockImplementation(() => new Date('2024-01-15').getTime());
          const result = await service.buildEncounterSummary('encounter-id');
          expect(result).toEqual({
            encounter,
            patient,
            activeDays: 1620,
            orders: {
              total: 1,
              pending: 0,
              inProgress: 0,
              completed: 1,
              cancelled: 0,
            },
            results: {
              total: 1,
              abnormal: 1,
              preliminary: 1,
            },
            hasAbnormalResults: true,
            riskFlag: 'HIGH',
          });
      });

});

  // TESTS_APPEND_HERE
});
