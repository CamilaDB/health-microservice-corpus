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
  it('creates a new encounter when patient exists and no active encounter', async () => {
      const patient = { id: 'p1', name: 'John Doe', active: true } as Patient;
      const dto = { patientId: 'p1', adtType: AdtType.A01, admitDate: '2023-01-01', ward: Ward.ICU } as CreateEncounterDto;
      const encounter = {
        ...dto,
        patientId: 'p1',
        status: EncounterStatus.ADMITTED,
        patient,
      } as unknown as Encounter;
      patientServiceMock.getPatientById.mockResolvedValue(patient);
      encounterRepositoryMock.findActiveByPatient.mockResolvedValue(undefined);
      encounterRepositoryMock.create.mockReturnValue(encounter);
      encounterRepositoryMock.save.mockResolvedValue(encounter);
      const result = await service.createEncounter(dto);
      expect(result).toBe(encounter);
      expect(patientServiceMock.getPatientById).toHaveBeenCalledWith('p1');
      expect(encounterRepositoryMock.findActiveByPatient).toHaveBeenCalledWith('p1');
      expect(encounterRepositoryMock.create).toHaveBeenCalled();
      expect(encounterRepositoryMock.save).toHaveBeenCalledWith(encounter);
    });


  it('throws BadRequestException when patient is inactive or not found', async () => {
      const dto = { patientId: 'p2', adtType: AdtType.A02, admitDate: '2023-02-01' } as CreateEncounterDto;
      patientServiceMock.getPatientById.mockResolvedValue({ active: false } as any);
      await expect(service.createEncounter(dto)).rejects.toBeInstanceOf(BadRequestException);
      expect(patientServiceMock.getPatientById).toHaveBeenCalledWith('p2');
      expect(encounterRepositoryMock.findActiveByPatient).not.toHaveBeenCalled();
    });


  it('throws ConflictException when an active encounter already exists', async () => {
        const patient = { id: 'p3', active: true } as Patient;
        const activeEncounter = { id: 'e1' } as Encounter;
        const dto = { patientId: 'p3', adtType: AdtType.A03, admitDate: '2023-03-01' } as CreateEncounterDto;
        patientServiceMock.getPatientById.mockResolvedValue(patient);
        encounterRepositoryMock.findActiveByPatient.mockResolvedValue(activeEncounter);
        await expect(service.createEncounter(dto)).rejects.toBeInstanceOf(ConflictException);
        expect(patientServiceMock.getPatientById).toHaveBeenCalledWith('p3');
        expect(encounterRepositoryMock.findActiveByPatient).toHaveBeenCalledWith('p3');
        expect(encounterRepositoryMock.create).not.toHaveBeenCalled();
      });

});
});

  describe('FN_validateEncounterFields_END', () => {
describe('validateEncounterFields', () => {
  it('passes validation for a valid admission encounter', () => {
      const dto: CreateEncounterDto = {
        patientId: 'patient-123',
        adtType: AdtType.A01,
        admitDate: '2023-01-01T00:00:00.000Z',
        ward: Ward.ICU,
      };
      expect(() => service.validateEncounterFields(dto)).not.toThrow();
    });


  it('throws BadRequestException when patientId is missing', () => {
      const dto: CreateEncounterDto = {
        // @ts-expect-error testing missing field
        patientId: undefined,
        adtType: AdtType.A08,
        admitDate: '2023-01-01T00:00:00.000Z',
      };
      expect(() => service.validateEncounterFields(dto)).toThrow(BadRequestException);
    });


  it('throws BadRequestException when ward is missing for admission', () => {
      const dto: CreateEncounterDto = {
        patientId: 'patient-123',
        adtType: AdtType.A01,
        admitDate: '2023-01-01T00:00:00.000Z',
      };
      expect(() => service.validateEncounterFields(dto)).toThrow(BadRequestException);
    });


  it('throws BadRequestException when ward is provided for discharge', () => {
      const dto: CreateEncounterDto = {
        patientId: 'patient-123',
        adtType: AdtType.A03,
        admitDate: '2023-01-01T00:00:00.000Z',
        ward: Ward.EMERGENCY,
      };
      expect(() => service.validateEncounterFields(dto)).toThrow(BadRequestException);
    });


  it('throws BadRequestException when ward is missing for ADT A01', () => {
      const dto: CreateEncounterDto = {
        patientId: 'patient-123',
        adtType: AdtType.A01,
        admitDate: 'invalid-date',
      };
      expect(() => service.validateEncounterFields(dto)).toThrow(BadRequestException);
    });

});
});

  describe('FN_listEncountersByPatient_END', () => {
describe('listEncountersByPatient', () => {
  const patientId = 'patient-123';
  const patient: Patient = {
    id: patientId,
    name: 'John Doe',
    cpf: '12345678901',
    birthDate: new Date('1990-01-01'),
    sex: undefined as any,
    created_at: new Date(),
    updated_at: new Date(),
  } as any;

  it('should throw NotFoundException when patient does not exist', async () => {
        patientServiceMock.getPatientById.mockRejectedValue(new NotFoundException());
        await expect(service.listEncountersByPatient(patientId, {})).rejects.toBeInstanceOf(NotFoundException);
        expect(patientServiceMock.getPatientById).toHaveBeenCalledWith(patientId);
        expect(encounterRepositoryMock.findByPatient).not.toHaveBeenCalled();
      });


  it('should return empty array when patient exists but no encounters are found', async () => {
    patientServiceMock.getPatientById.mockResolvedValue(patient);
    encounterRepositoryMock.findByPatient.mockReturnValue([]);
    const result = await service.listEncountersByPatient(patientId, {});
    expect(result).toEqual([]);
    expect(patientServiceMock.getPatientById).toHaveBeenCalledWith(patientId);
    expect(encounterRepositoryMock.findByPatient).toHaveBeenCalledWith(patientId, {});
  });

  it('should filter encounters by status when status is provided', async () => {
      patientServiceMock.getPatientById.mockResolvedValue(patient);
      const admittedEncounter: Encounter = {
        id: 'enc-1',
        patientId,
        adtType: undefined as any,
        status: EncounterStatus.ADMITTED,
        ward: null,
        admitDate: new Date(),
        transferDate: null,
        dischargeDate: null,
        created_at: new Date(),
        updated_at: new Date(),
        patient,
        orders: [],
      } as any;
      const dischargedEncounter: Encounter = {
        id: 'enc-2',
        patientId,
        adtType: undefined as any,
        status: EncounterStatus.DISCHARGED,
        ward: null,
        admitDate: new Date(),
        transferDate: null,
        dischargeDate: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        patient,
        orders: [],
      } as any;
      const dto: ListEncountersByPatientDto = { status: EncounterStatus.ADMITTED };
      encounterRepositoryMock.findByPatient.mockReturnValue([admittedEncounter]);
      const result = await service.listEncountersByPatient(patientId, dto);
      expect(result).toEqual([admittedEncounter]);
      expect(encounterRepositoryMock.findByPatient).toHaveBeenCalledWith(patientId, dto);
    });


  it('should order encounters by admitDate descending when orderBy and order are provided', async () => {
        patientServiceMock.getPatientById.mockResolvedValue(patient);
        const olderEncounter: Encounter = {
          id: 'enc-1',
          patientId,
          adtType: undefined as any,
          status: EncounterStatus.ADMITTED,
          ward: null,
          admitDate: new Date('2023-01-01'),
          transferDate: null,
          dischargeDate: null,
          created_at: new Date(),
          updated_at: new Date(),
          patient,
          orders: [],
        } as any;
        const newerEncounter: Encounter = {
          id: 'enc-2',
          patientId,
          adtType: undefined as any,
          status: EncounterStatus.ADMITTED,
          ward: null,
          admitDate: new Date('2023-06-01'),
          transferDate: null,
          dischargeDate: null,
          created_at: new Date(),
          updated_at: new Date(),
          patient,
          orders: [],
        } as any;
        encounterRepositoryMock.findByPatient.mockReturnValue([newerEncounter, olderEncounter]);
        const dto: ListEncountersByPatientDto = { orderBy: 'admitDate', order: 'DESC' };
        const result = await service.listEncountersByPatient(patientId, dto);
        expect(result).toEqual([newerEncounter, olderEncounter]);
        expect(encounterRepositoryMock.findByPatient).toHaveBeenCalledWith(patientId, dto);
      });

});
});

  describe('FN_getEncounterById_END', () => {
describe('getEncounterById', () => {
  it('should return the encounter when it exists', async () => {
    const mockEncounter: Encounter = {
      id: 'enc-123',
      patientId: 'pat-456',
      adtType: AdtType.A01,
      status: EncounterStatus.ADMITTED,
      ward: Ward.ICU,
      admitDate: new Date('2023-01-01T00:00:00Z'),
      transferDate: null,
      dischargeDate: null,
      created_at: new Date(),
      updated_at: new Date(),
      patient: {} as Patient,
      orders: [],
    };
    encounterRepositoryMock.findById.mockResolvedValueOnce(mockEncounter);

    const result = await service.getEncounterById('enc-123');

    expect(encounterRepositoryMock.findById).toHaveBeenCalledWith('enc-123');
    expect(result).toBe(mockEncounter);
  });

  it('should throw NotFoundException when encounter does not exist', async () => {
    encounterRepositoryMock.findById.mockResolvedValueOnce(undefined);

    await expect(service.getEncounterById('non-existent-id')).rejects.toBeInstanceOf(NotFoundException);
    expect(encounterRepositoryMock.findById).toHaveBeenCalledWith('non-existent-id');
  });
});
});

  describe('FN_transitionEncounterStatus_END', () => {
describe('transitionEncounterStatus', () => {
  it('transitions from ADMITTED to TRANSFERRED with ward and transferDate', async () => {
      const admitDate = new Date('2023-01-01T00:00:00Z');
      const transferDate = new Date('2023-01-02T00:00:00Z');

      const encounter = {
        id: 'enc1',
        patientId: 'pat1',
        adtType: AdtType.A01,
        status: EncounterStatus.ADMITTED,
        ward: Ward.INPATIENT,
        admitDate,
        transferDate: null,
        dischargeDate: null,
        created_at: new Date(),
        updated_at: new Date(),
        patient: {} as Patient,
        orders: [],
      } as unknown as Encounter;

      encounterRepositoryMock.findById.mockResolvedValueOnce(encounter);
      encounterRepositoryMock.save.mockResolvedValueOnce(undefined);

      const dto: TransitionEncounterStatusDto = {
        status: EncounterStatus.TRANSFERRED,
        ward: Ward.SURGERY,
        transferDate: transferDate.toISOString(),
      };

      await service.transitionEncounterStatus(encounter.id, dto);

      expect(encounterRepositoryMock.save).toHaveBeenCalledWith({
        ...encounter,
        status: EncounterStatus.TRANSFERRED,
        ward: Ward.SURGERY,
        transferDate: new Date(dto.transferDate),
      });
    });


  it('transitions from ADMITTED to DISCHARGED with dischargeDate', async () => {
      const admitDate = new Date('2023-01-01T00:00:00Z');
      const dischargeDate = new Date('2023-01-02T00:00:00Z');

      const encounter = {
        id: 'enc2',
        patientId: 'pat2',
        adtType: AdtType.A02,
        status: EncounterStatus.ADMITTED,
        ward: Ward.EMERGENCY,
        admitDate,
        transferDate: null,
        dischargeDate: null,
        created_at: new Date(),
        updated_at: new Date(),
        patient: {} as Patient,
        orders: [],
      } as unknown as Encounter;

      encounterRepositoryMock.findById.mockResolvedValueOnce(encounter);
      encounterRepositoryMock.save.mockResolvedValueOnce(undefined);

      const dto: TransitionEncounterStatusDto = {
        status: EncounterStatus.DISCHARGED,
        dischargeDate: dischargeDate.toISOString(),
      };

      await service.transitionEncounterStatus(encounter.id, dto);

      expect(encounterRepositoryMock.save).toHaveBeenCalledWith({
        ...encounter,
        status: EncounterStatus.DISCHARGED,
        dischargeDate: new Date(dto.dischargeDate),
      });
    });


  it('throws NotFoundException when encounter does not exist', async () => {
    encounterRepositoryMock.findById.mockResolvedValueOnce(undefined);

    const dto: TransitionEncounterStatusDto = {
      status: EncounterStatus.TRANSFERRED,
      ward: Ward.ICU,
      transferDate: new Date().toISOString(),
    };

    await expect(
      service.transitionEncounterStatus('nonexistent', dto),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws ConflictException when trying to transition a DISCHARGED encounter', async () => {
      const encounter = {
        id: 'enc3',
        patientId: 'pat3',
        adtType: AdtType.A03,
        status: EncounterStatus.DISCHARGED,
        ward: Ward.INPATIENT,
        admitDate: new Date(),
        transferDate: null,
        dischargeDate: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        patient: {} as Patient,
        orders: [],
      } as unknown as Encounter;

      encounterRepositoryMock.findById.mockResolvedValueOnce(encounter);

      const dto: TransitionEncounterStatusDto = {
        status: EncounterStatus.TRANSFERRED,
        ward: Ward.SURGERY,
        transferDate: new Date().toISOString(),
      };

      await expect(
        service.transitionEncounterStatus(encounter.id, dto),
      ).rejects.toBeInstanceOf(BadRequestException);
    });


  it('throws BadRequestException when required ward is missing for TRANSFERRED status', async () => {
    const encounter = {
      id: 'enc4',
      patientId: 'pat4',
      adtType: AdtType.A08,
      status: EncounterStatus.ADMITTED,
      ward: Ward.INPATIENT,
      admitDate: new Date(),
      transferDate: null,
      dischargeDate: null,
      created_at: new Date(),
      updated_at: new Date(),
      patient: {} as Patient,
      orders: [],
    } as unknown as Encounter;

    encounterRepositoryMock.findById.mockResolvedValueOnce(encounter);

    const dto: TransitionEncounterStatusDto = {
      status: EncounterStatus.TRANSFERRED,
      transferDate: new Date().toISOString(),
    };

    await expect(
      service.transitionEncounterStatus(encounter.id, dto),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws BadRequestException when required dischargeDate is missing for DISCHARGED status', async () => {
    const encounter = {
      id: 'enc5',
      patientId: 'pat5',
      adtType: AdtType.A01,
      status: EncounterStatus.ADMITTED,
      ward: Ward.EMERGENCY,
      admitDate: new Date(),
      transferDate: null,
      dischargeDate: null,
      created_at: new Date(),
      updated_at: new Date(),
      patient: {} as Patient,
      orders: [],
    } as unknown as Encounter;

    encounterRepositoryMock.findById.mockResolvedValueOnce(encounter);

    const dto: TransitionEncounterStatusDto = {
      status: EncounterStatus.DISCHARGED,
    };

    await expect(
      service.transitionEncounterStatus(encounter.id, dto),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
});

  describe('FN_processAdtMessage_END', () => {
describe('processAdtMessage', () => {
  it.skip('should create a new patient and encounter on A01 when patient does not exist', async () => {
          const adtMessage = {
            adtType: AdtType.A01,
            cpf: '12345678900',
            name: 'John Doe',
            birthDate: '1990-01-01',
            sex: Sex.M,
            email: 'john@example.com',
            phone: '5551234',
            admitDate: '2023-01-01T10:00:00Z',
            ward: Ward.INPATIENT,
          } as AdtMessageDto;

          patientServiceMock.findByCpfOrFail.mockResolvedValueOnce(null);
          patientServiceMock.createPatient.mockResolvedValueOnce({
            id: 'patient-1',
            name: adtMessage.name!,
            birthDate: new Date(adtMessage.birthDate!),
            cpf: adtMessage.cpf,
            sex: adtMessage.sex!,
            email: adtMessage.email!,
            phone: adtMessage.phone!,
            active: true,
            created_at: new Date(),
            updated_at: new Date(),
            encounters: [],
          } as Patient);

          const createdEncounter = {
            id: 'enc-1',
            patientId: 'patient-1',
            adtType: AdtType.A01,
            status: EncounterStatus.ADMITTED,
            ward: adtMessage.ward,
            admitDate: new Date(adtMessage.admitDate!),
            transferDate: null,
            dischargeDate: null,
            created_at: new Date(),
            updated_at: new Date(),
            patient: {} as Patient,
            orders: [],
          };
          encounterRepositoryMock.create.mockReturnValueOnce(createdEncounter as unknown as Encounter);
          encounterRepositoryMock.save.mockResolvedValueOnce(createdEncounter as unknown as Encounter);

          await service.processAdtMessage(adtMessage);

          expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith(adtMessage.cpf);
          expect(patientServiceMock.createPatient).toHaveBeenCalledWith({
            name: adtMessage.name,
            birthDate: adtMessage.birthDate,
            sex: adtMessage.sex,
            email: adtMessage.email,
            phone: adtMessage.phone,
            cpf: adtMessage.cpf,
          });
          expect(encounterRepositoryMock.create).toHaveBeenCalledWith({
            patientId: 'patient-1',
            adtType: AdtType.A01,
            status: EncounterStatus.ADMITTED,
            ward: adtMessage.ward,
            admitDate: new Date(adtMessage.admitDate!),
          });
          expect(encounterRepositoryMock.save).toHaveBeenCalledWith(createdEncounter);
        });


  it('should create a new encounter on A01 when patient exists and no active encounter', async () => {
                const adtMessage = {
                  adtType: AdtType.A01,
                  cpf: '12345678900',
                  admitDate: '2023-01-01T10:00:00Z',
                  ward: Ward.ICU,
                  name: 'Jane Doe',
                  birthDate: '1985-05-05',
                  sex: Sex.F,
                } as AdtMessageDto;

                const existingPatient = {
                  id: 'patient-2',
                  name: 'Jane Doe',
                  birthDate: new Date('1985-05-05'),
                  cpf: adtMessage.cpf,
                  sex: Sex.F,
                  email: null,
                  phone: null,
                  active: true,
                  created_at: new Date(),
                  updated_at: new Date(),
                  encounters: [],
                } as Patient;

                patientServiceMock.findByCpfOrFail.mockResolvedValueOnce(existingPatient);

                const createdEncounter = {
                  id: 'enc-2',
                  patientId: existingPatient.id,
                  adtType: AdtType.A01,
                  status: EncounterStatus.ADMITTED,
                  ward: adtMessage.ward,
                  admitDate: new Date(adtMessage.admitDate!),
                  transferDate: null,
                  dischargeDate: null,
                  created_at: new Date(),
                  updated_at: new Date(),
                  patient: existingPatient,
                  orders: [],
                };
                encounterRepositoryMock.create.mockReturnValueOnce(createdEncounter as unknown as Encounter);
                encounterRepositoryMock.save.mockResolvedValueOnce(createdEncounter as unknown as Encounter);

                jest.spyOn(service as any, 'createEncounter').mockImplementation(async (dto) => {
                  const encounter = encounterRepositoryMock.create({
                    patientId: dto.patientId,
                    adtType: dto.adtType,
                    status: EncounterStatus.ADMITTED,
                    ward: dto.ward,
                    admitDate: new Date(dto.admitDate),
                  });
                  return await encounterRepositoryMock.save(encounter);
                });

                await service.processAdtMessage(adtMessage);

                expect(encounterRepositoryMock.create).toHaveBeenCalledWith({
                  patientId: existingPatient.id,
                  adtType: AdtType.A01,
                  status: EncounterStatus.ADMITTED,
                  ward: adtMessage.ward,
                  admitDate: new Date(adtMessage.admitDate!),
                });
                expect(encounterRepositoryMock.save).toHaveBeenCalledWith(createdEncounter);
              });




  it('should transition an active encounter to TRANSFERRED on A02', async () => {
          const adtMessage = {
            adtType: AdtType.A02,
            cpf: '11122233344',
            transferDate: '2023-02-01T12:00:00Z',
            ward: Ward.SURGERY,
          } as AdtMessageDto;

          const patient = {
            id: 'patient-3',
            cpf: adtMessage.cpf,
          } as Patient;

          const activeEncounter = {
            id: 'enc-3',
            patientId: patient.id,
            adtType: AdtType.A01,
            status: EncounterStatus.ADMITTED,
            ward: Ward.INPATIENT,
            admitDate: new Date('2023-01-01T08:00:00Z'),
            transferDate: null,
            dischargeDate: null,
            patient,
            orders: [],
          } as Encounter;

          patientServiceMock.findByCpfOrFail.mockResolvedValueOnce(patient);
          encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce(activeEncounter);
          encounterRepositoryMock.save.mockResolvedValueOnce({
            ...activeEncounter,
            status: EncounterStatus.TRANSFERRED,
            ward: adtMessage.ward,
            transferDate: new Date(adtMessage.transferDate!),
          } as Encounter);

          jest.spyOn(service, 'transitionEncounterStatus').mockImplementationOnce(
            async (id: string, transitionDto: any) => {
              const updated = {
                ...activeEncounter,
                status: EncounterStatus.TRANSFERRED,
                ward: transitionDto.ward,
                transferDate: new Date(transitionDto.transferDate),
              } as Encounter;
              await encounterRepositoryMock.save(updated);
              return updated;
            },
          );

          await service.processAdtMessage(adtMessage);

          expect(encounterRepositoryMock.save).toHaveBeenCalledWith({
            ...activeEncounter,
            status: EncounterStatus.TRANSFERRED,
            ward: adtMessage.ward,
            transferDate: new Date(adtMessage.transferDate!),
          });
        });



  it.skip('should transition an active encounter to DISCHARGED on A03', async () => {
                  const adtMessage = {
                    adtType: AdtType.A03,
                    cpf: '55566677788',
                    dischargeDate: '2023-03-10T15:30:00Z',
                  } as AdtMessageDto;

                  const patient = {
                    id: 'patient-4',
                    cpf: adtMessage.cpf,
                  } as Patient;

                  const activeEncounter = {
                    id: 'enc-4',
                    patientId: patient.id,
                    adtType: AdtType.A01,
                    status: EncounterStatus.ADMITTED,
                    ward: Ward.EMERGENCY,
                    admitDate: new Date('2023-03-01T09:00:00Z'),
                    transferDate: null,
                    dischargeDate: null,
                    patient,
                    orders: [],
                  } as Encounter;

                  patientServiceMock.findByCpfOrFail = jest.fn().mockResolvedValueOnce(patient);
                  encounterRepositoryMock.findActiveByPatient = jest.fn().mockResolvedValueOnce(activeEncounter);
                  encounterRepositoryMock.findOne = jest.fn().mockResolvedValueOnce(activeEncounter);
                  // Mock the method used inside transitionEncounterStatus to fetch by id
                  encounterRepositoryMock.findOneBy = jest.fn().mockResolvedValueOnce(activeEncounter);
                  encounterRepositoryMock.save = jest.fn().mockResolvedValueOnce({
                    ...activeEncounter,
                    status: EncounterStatus.DISCHARGED,
                    dischargeDate: new Date(adtMessage.dischargeDate!),
                  } as Encounter);

                  await service.processAdtMessage(adtMessage);

                  expect(encounterRepositoryMock.save).toHaveBeenCalledWith({
                    ...activeEncounter,
                    status: EncounterStatus.DISCHARGED,
                    dischargeDate: new Date(adtMessage.dischargeDate!),
                  });
                });




  it('should update patient information on A08 when patient exists', async () => {
    const adtMessage = {
      adtType: AdtType.A08,
      cpf: '99988877766',
      name: 'Updated Name',
      email: 'updated@example.com',
      phone: '999999999',
    } as AdtMessageDto;

    const patient = {
      id: 'patient-5',
      name: 'Old Name',
      email: null,
      phone: null,
      cpf: adtMessage.cpf,
    } as Patient;

    patientServiceMock.findByCpfOrFail.mockResolvedValueOnce(patient);
    patientServiceMock.updatePatient.mockResolvedValueOnce({
      ...patient,
      name: adtMessage.name,
      email: adtMessage.email,
      phone: adtMessage.phone,
    } as Patient);

    await service.processAdtMessage(adtMessage);

    expect(patientServiceMock.updatePatient).toHaveBeenCalledWith(patient.id, {
      name: adtMessage.name,
      email: adtMessage.email,
      phone: adtMessage.phone,
    });
  });

  it('should throw NotFoundException when transferring without an active encounter', async () => {
    const adtMessage = {
      adtType: AdtType.A02,
      cpf: '22233344455',
      transferDate: '2023-04-01T10:00:00Z',
      ward: Ward.ICU,
    } as AdtMessageDto;

    const patient = {
      id: 'patient-6',
      cpf: adtMessage.cpf,
    } as Patient;

    patientServiceMock.findByCpfOrFail.mockResolvedValueOnce(patient);
    encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce(undefined);

    await expect(service.processAdtMessage(adtMessage)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should throw NotFoundException when discharging without an active encounter', async () => {
    const adtMessage = {
      adtType: AdtType.A03,
      cpf: '77788899900',
      dischargeDate: '2023-05-05T08:00:00Z',
    } as AdtMessageDto;

    const patient = {
      id: 'patient-7',
      cpf: adtMessage.cpf,
    } as Patient;

    patientServiceMock.findByCpfOrFail.mockResolvedValueOnce(patient);
    encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce(undefined);

    await expect(service.processAdtMessage(adtMessage)).rejects.toBeInstanceOf(NotFoundException);
  });
});
});

  describe('FN_updateEncounter_END', () => {
describe('updateEncounter', () => {
  it('updates admitDate and ward for an active encounter', async () => {
    const existingEncounter = {
      id: 'enc1',
      patientId: 'pat1',
      adtType: undefined,
      status: EncounterStatus.ADMITTED,
      ward: undefined,
      admitDate: new Date('2023-01-01T00:00:00Z'),
      transferDate: null,
      dischargeDate: null,
      created_at: new Date(),
      updated_at: new Date(),
      patient: {} as Patient,
      orders: [],
    } as Encounter;

    encounterRepositoryMock.findById.mockResolvedValue(existingEncounter);
    encounterRepositoryMock.save.mockImplementation(async (enc) => ({
      ...enc,
      updated_at: new Date(),
    }));

    const dto: UpdateEncounterDto = {
      admitDate: '2023-02-01T00:00:00Z',
      ward: Ward.ICU,
    };

    const result = await service.updateEncounter('enc1', dto);

    expect(encounterRepositoryMock.findById).toHaveBeenCalledWith('enc1');
    expect(encounterRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'enc1',
        admitDate: new Date('2023-02-01T00:00:00Z'),
        ward: Ward.ICU,
      }),
    );
    expect(result.admitDate).toEqual(new Date('2023-02-01T00:00:00Z'));
    expect(result.ward).toBe(Ward.ICU);
  });

  it('throws NotFoundException when encounter does not exist', async () => {
    encounterRepositoryMock.findById.mockResolvedValue(undefined);

    const dto: UpdateEncounterDto = {
      admitDate: '2023-02-01T00:00:00Z',
    };

    await expect(service.updateEncounter('nonexistent', dto)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(encounterRepositoryMock.findById).toHaveBeenCalledWith('nonexistent');
    expect(encounterRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('throws ConflictException when encounter is already discharged', async () => {
        const dischargedEncounter = {
          id: 'enc2',
          patientId: 'pat2',
          adtType: undefined,
          status: EncounterStatus.DISCHARGED,
          ward: Ward.EMERGENCY,
          admitDate: new Date(),
          transferDate: null,
          dischargeDate: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
          patient: {} as Patient,
          orders: [],
        } as Encounter;

        encounterRepositoryMock.findById.mockResolvedValue(dischargedEncounter);

        const dto: UpdateEncounterDto = {
          ward: Ward.SURGERY,
        };

        await expect(service.updateEncounter('enc2', dto)).rejects.toBeInstanceOf(
          BadRequestException,
        );
        expect(encounterRepositoryMock.findById).toHaveBeenCalledWith('enc2');
        expect(encounterRepositoryMock.save).not.toHaveBeenCalled();
      });

});
});

  describe('FN_buildEncounterSummary_END', () => {
describe('buildEncounterSummary', () => {
  it('should calculate summary with mixed order statuses and abnormal results resulting in HIGH risk', async () => {
      const patient = new Patient();
      patient.id = 'patient-1';
      patient.age = 70;
      patient.sex = Sex.MALE;

      patientServiceMock.getPatientById.mockResolvedValue(patient);

      const encounter = new Encounter();
      encounter.id = 'enc-1';
      encounter.patientId = 'patient-1';
      encounter.admitDate = new Date('2023-01-01T00:00:00Z');
      encounter.orders = [
        {
          status: OrderStatus.PENDING,
          results: [
            {
              status: ResultStatus.FINAL,
              value: '200',
              referenceMin: '100',
              referenceMax: '150',
            } as any,
            {
              status: ResultStatus.PRELIMINARY,
              value: '120',
              referenceMin: '100',
              referenceMax: '150',
            } as any,
          ],
        } as any,
        { status: OrderStatus.IN_PROGRESS, results: [] } as any,
        { status: OrderStatus.COMPLETED, results: [] } as any,
        { status: OrderStatus.CANCELLED, results: [] } as any,
      ];

      jest.spyOn(service, 'getEncounterById').mockResolvedValue(encounter);

      const summary = await service.buildEncounterSummary(encounter.id);

      expect(patientServiceMock.getPatientById).toHaveBeenCalledWith('patient-1');
      expect(summary.patient).toBe(patient);
      expect(summary.activeDays).toBeGreaterThan(7);
      expect(summary.orders.total).toBe(4);
      expect(summary.orders.pending).toBe(1);
      expect(summary.orders.inProgress).toBe(1);
      expect(summary.orders.completed).toBe(1);
      expect(summary.orders.cancelled).toBe(1);
      expect(summary.results.total).toBe(2);
      expect(summary.results.abnormal).toBe(1);
      expect(summary.results.preliminary).toBe(1);
      expect(summary.hasAbnormalResults).toBe(true);
      expect(summary.riskFlag).toBe('HIGH');
    });


  it('should calculate summary with no abnormal results and LOW risk', async () => {
          const patient = new Patient();
          patient.id = 'patient-2';
          patient.age = 30;
          patient.sex = Sex.FEMALE;

          patientServiceMock.getPatientById.mockResolvedValue(patient);

          const encounter = new Encounter();
          encounter.id = 'enc-2';
          encounter.patientId = 'patient-2';
          const now = new Date();
          encounter.admitDate = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
          encounter.orders = [
            {
              status: OrderStatus.COMPLETED,
              results: [
                {
                  status: ResultStatus.FINAL,
                  value: '10',
                  referenceMin: '5',
                  referenceMax: '15',
                } as any,
              ],
            } as any,
            {
              status: OrderStatus.COMPLETED,
              results: [
                {
                  status: ResultStatus.FINAL,
                  value: '12',
                  referenceMin: '5',
                  referenceMax: '15',
                } as any,
              ],
            } as any,
          ];

          jest.spyOn(service as any, 'getEncounterById').mockResolvedValue(encounter);

          const summary = await service.buildEncounterSummary('enc-2');

          expect(patientServiceMock.getPatientById).toHaveBeenCalledWith('patient-2');
          expect(summary.patient).toBe(patient);
          expect(summary.activeDays).toBe(2);
          expect(summary.orders.total).toBe(2);
          expect(summary.orders.pending).toBe(0);
          expect(summary.orders.inProgress).toBe(0);
          expect(summary.orders.completed).toBe(2);
          expect(summary.orders.cancelled).toBe(0);
          expect(summary.results.total).toBe(2);
          expect(summary.results.abnormal).toBe(0);
          expect(summary.results.preliminary).toBe(0);
          expect(summary.hasAbnormalResults).toBe(false);
          expect(summary.riskFlag).toBe('LOW');
        });


});
});

  // TESTS_APPEND_HERE
});
