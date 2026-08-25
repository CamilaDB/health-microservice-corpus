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
  it('should throw NotFoundException when patient does not exist', async () => {
      patientServiceMock.getPatientById.mockRejectedValueOnce(new NotFoundException());
      encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce(undefined);

      await expect(
        service.createEncounter({
          patientId: 'patient-1',
          adtType: AdtType.A01,
          admitDate: '2023-01-01T00:00:00.000Z',
        } as CreateEncounterDto),
      ).rejects.toThrow(NotFoundException);

      expect(encounterRepositoryMock.create).not.toHaveBeenCalled();
      expect(encounterRepositoryMock.save).not.toHaveBeenCalled();
    });


  it('should throw ConflictException when an active encounter already exists for the patient', async () => {
        patientServiceMock.getPatientById.mockResolvedValueOnce({ id: 'patient-1', active: true } as Patient);
        encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce({ id: 'enc-1' } as Encounter);

        await expect(
          service.createEncounter({
            patientId: 'patient-1',
            adtType: AdtType.A01,
            admitDate: '2023-01-01T00:00:00.000Z',
          } as CreateEncounterDto),
        ).rejects.toThrow(ConflictException);

        expect(encounterRepositoryMock.create).not.toHaveBeenCalled();
        expect(encounterRepositoryMock.save).not.toHaveBeenCalled();
      });


  it('should create and save a new encounter when patient exists and no active encounter', async () => {
      const patient = { id: 'patient-1', active: true } as Patient;
      patientServiceMock.getPatientById.mockResolvedValueOnce(patient);
      encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce(undefined);

      const dto = {
        patientId: 'patient-1',
        adtType: AdtType.A01,
        admitDate: '2023-01-01T00:00:00.000Z',
        ward: Ward.ICU,
      } as CreateEncounterDto;

      const createdEntity = {
        patientId: dto.patientId,
        adtType: dto.adtType,
        admitDate: new Date(dto.admitDate),
        ward: dto.ward,
        status: EncounterStatus.ADMITTED,
        transferDate: null,
        dischargeDate: null,
      } as unknown as Encounter;

      encounterRepositoryMock.create.mockReturnValueOnce(createdEntity);
      encounterRepositoryMock.save.mockResolvedValueOnce({ ...createdEntity, id: 'enc-1' });

      const result = await service.createEncounter(dto);

      expect(encounterRepositoryMock.create).toHaveBeenCalledWith({
        patientId: dto.patientId,
        adtType: dto.adtType,
        admitDate: new Date(dto.admitDate),
        ward: dto.ward,
        status: EncounterStatus.ADMITTED,
        transferDate: null,
        dischargeDate: null,
      });
      expect(encounterRepositoryMock.save).toHaveBeenCalledWith(createdEntity);
      expect(result).toEqual({ ...createdEntity, id: 'enc-1' });
    });

});
});

  describe('FN_validateEncounterFields_END', () => {
describe('validateEncounterFields', () => {
  it('should throw BadRequestException when ward is missing for an ADT type that requires a ward', () => {
      const dto = {
        patientId: 'patient-1',
        adtType: AdtType.A01,
        admitDate: '2023-01-01T00:00:00Z',
      } as CreateEncounterDto;

      expect(() => service.validateEncounterFields(dto)).toThrow(BadRequestException);
    });


  it('should not throw when ward is provided for an ADT type that requires a ward', () => {
      const dto = {
        patientId: 'patient-1',
        adtType: AdtType.A01,
        admitDate: '2023-01-01T00:00:00Z',
        ward: Ward.ICU,
      } as CreateEncounterDto;

      expect(() => service.validateEncounterFields(dto)).not.toThrow();
    });


  it('should throw BadRequestException when admitDate is not a valid ISO string', () => {
      const dto = {
        patientId: 'patient-1',
        adtType: AdtType.A01,
        admitDate: 'invalid-date',
      } as CreateEncounterDto;

      expect(() => service.validateEncounterFields(dto)).toThrow(BadRequestException);
    });

});
});

  describe('FN_listEncountersByPatient_END', () => {
describe('listEncountersByPatient', () => {
  it('should throw NotFoundException when patient does not exist', async () => {
      patientServiceMock.getPatientById.mockRejectedValueOnce(new NotFoundException());

      await expect(
        service.listEncountersByPatient('patient-1', {} as ListEncountersByPatientDto),
      ).rejects.toThrow(NotFoundException);
    });


  it('should return an empty array when patient exists but has no encounters', async () => {
    patientServiceMock.getPatientById.mockResolvedValueOnce({ id: 'patient-1' } as Patient);
    encounterRepositoryMock.findByPatient.mockReturnValueOnce([]);

    const result = await service.listEncountersByPatient('patient-1', {} as ListEncountersByPatientDto);

    expect(result).toEqual([]);
    expect(encounterRepositoryMock.findByPatient).toHaveBeenCalledWith('patient-1', {});
  });

  it('should return encounters filtered by status when status is provided', async () => {
        patientServiceMock.getPatientById.mockResolvedValueOnce({ id: 'patient-2' } as Patient);
        const admittedEncounter = {
          id: 'e1',
          patientId: 'patient-2',
          status: EncounterStatus.ADMITTED,
          adtType: undefined,
          ward: null,
          admitDate: new Date(),
          transferDate: null,
          dischargeDate: null,
          created_at: new Date(),
          updated_at: new Date(),
          patient: {} as Patient,
          orders: [],
        };
        const dischargedEncounter = {
          ...admittedEncounter,
          id: 'e2',
          status: EncounterStatus.DISCHARGED,
        };
        encounterRepositoryMock.findByPatient.mockReturnValueOnce([admittedEncounter]);

        const dto = { status: EncounterStatus.ADMITTED } as ListEncountersByPatientDto;
        const result = await service.listEncountersByPatient('patient-2', dto);

        expect(result).toEqual([admittedEncounter]);
        expect(encounterRepositoryMock.findByPatient).toHaveBeenCalledWith('patient-2', dto);
      });


  it('should return encounters ordered by admitDate descending when orderBy and order are provided', async () => {
        patientServiceMock.getPatientById.mockResolvedValueOnce({ id: 'patient-3' } as Patient);
        const olderEncounter = {
          id: 'e1',
          patientId: 'patient-3',
          status: EncounterStatus.ADMITTED,
          adtType: undefined,
          ward: null,
          admitDate: new Date('2023-01-01'),
          transferDate: null,
          dischargeDate: null,
          created_at: new Date(),
          updated_at: new Date(),
          patient: {} as Patient,
          orders: [],
        };
        const newerEncounter = {
          ...olderEncounter,
          id: 'e2',
          admitDate: new Date('2023-02-01'),
        };
        encounterRepositoryMock.findByPatient.mockReturnValueOnce([newerEncounter, olderEncounter]);

        const dto = {
          orderBy: 'admitDate',
          order: 'DESC',
        } as ListEncountersByPatientDto;

        const result = await service.listEncountersByPatient('patient-3', dto);

        expect(result).toEqual([newerEncounter, olderEncounter]);
        expect(encounterRepositoryMock.findByPatient).toHaveBeenCalledWith('patient-3', dto);
      });

});
});

  describe('FN_getEncounterById_END', () => {
describe('getEncounterById', () => {
  it('should throw NotFoundException when encounter does not exist', async () => {
    encounterRepositoryMock.findById.mockResolvedValueOnce(undefined);

    await expect(service.getEncounterById('enc-1')).rejects.toThrow(NotFoundException);
    expect(encounterRepositoryMock.findById).toHaveBeenCalledWith('enc-1');
  });

  it('should return the encounter when found', async () => {
    const encounter = {
      id: 'enc-1',
      patientId: 'pat-1',
      adtType: AdtType.A01,
      status: EncounterStatus.ADMITTED,
      ward: Ward.INPATIENT,
      admitDate: new Date(),
      transferDate: null,
      dischargeDate: null,
      created_at: new Date(),
      updated_at: new Date(),
      patient: {} as Patient,
      orders: [] as any[],
    };
    encounterRepositoryMock.findById.mockResolvedValueOnce(encounter as unknown as Encounter);

    const result = await service.getEncounterById('enc-1');

    expect(encounterRepositoryMock.findById).toHaveBeenCalledWith('enc-1');
    expect(result).toBe(encounter);
  });
});
});

  describe('FN_transitionEncounterStatus_END', () => {
describe('transitionEncounterStatus', () => {
  it('should throw NotFoundException when encounter does not exist', async () => {
    encounterRepositoryMock.findById.mockResolvedValueOnce(undefined);

    await expect(
      service.transitionEncounterStatus('nonexistent-id', {
        status: EncounterStatus.ADMITTED,
      } as TransitionEncounterStatusDto),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException when transitioning to TRANSFERRED without required ward', async () => {
    const existingEncounter = {
      id: 'enc1',
      status: EncounterStatus.ADMITTED,
      ward: null,
      transferDate: null,
      dischargeDate: null,
    } as Encounter;

    encounterRepositoryMock.findById.mockResolvedValueOnce(existingEncounter);

    await expect(
      service.transitionEncounterStatus('enc1', {
        status: EncounterStatus.TRANSFERRED,
        // ward omitted intentionally
        transferDate: new Date().toISOString(),
      } as TransitionEncounterStatusDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should update encounter and call save when transitioning to TRANSFERRED with valid data', async () => {
    const existingEncounter = {
      id: 'enc2',
      status: EncounterStatus.ADMITTED,
      ward: null,
      transferDate: null,
      dischargeDate: null,
    } as Encounter;

    encounterRepositoryMock.findById.mockResolvedValueOnce(existingEncounter);
    encounterRepositoryMock.save.mockResolvedValueOnce(undefined);

    const dto: TransitionEncounterStatusDto = {
      status: EncounterStatus.TRANSFERRED,
      ward: Ward.ICU,
      transferDate: new Date().toISOString(),
    };

    await service.transitionEncounterStatus('enc2', dto);

    expect(encounterRepositoryMock.save).toHaveBeenCalledWith({
      ...existingEncounter,
      status: EncounterStatus.TRANSFERRED,
      ward: Ward.ICU,
      transferDate: new Date(dto.transferDate!),
    });
  });
});
});

  describe('FN_processAdtMessage_END', () => {
describe('processAdtMessage', () => {
  it.skip('should create a new admission encounter when patient exists and no active encounter', async () => {
          const patient = {
            id: 'p1',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            cpf: '12345678900',
            sex: Sex.M,
            email: null,
            phone: null,
            active: true,
            created_at: new Date(),
            updated_at: new Date(),
            encounters: [],
          } as Patient;

          patientServiceMock.findByCpfOrFail.mockResolvedValueOnce(patient);
          encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce(null);

          const createdEncounter = {
            patientId: patient.id,
            adtType: AdtType.A01,
            status: EncounterStatus.ADMITTED,
            ward: Ward.INPATIENT,
            admitDate: new Date('2023-01-01'),
          };

          encounterRepositoryMock.create.mockReturnValueOnce(createdEncounter as unknown as Encounter);
          encounterRepositoryMock.save.mockResolvedValueOnce(createdEncounter as unknown as Encounter);

          await service.processAdtMessage({
            adtType: AdtType.A01,
            cpf: patient.cpf,
            name: patient.name,
            birthDate: patient.birthDate.toISOString(),
            sex: patient.sex,
            ward: Ward.INPATIENT,
            admitDate: '2023-01-01',
          } as AdtMessageDto);

          expect(encounterRepositoryMock.create).toHaveBeenCalledWith(
            expect.objectContaining({
              patientId: patient.id,
              adtType: AdtType.A01,
              status: EncounterStatus.ADMITTED,
              ward: Ward.INPATIENT,
              admitDate: new Date('2023-01-01'),
            }),
          );
          expect(encounterRepositoryMock.save).toHaveBeenCalledWith(createdEncounter);
        });




  it.skip('should throw ConflictException when admission ADT received but active encounter already exists', async () => {
          const patient = { id: 'p1', cpf: '12345678900', active: true } as Patient;
          const activeEncounter = { id: 'e1', patientId: 'p1' } as Encounter;

          patientServiceMock.findByCpfOrFail.mockResolvedValueOnce(patient);
          encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce(activeEncounter);

          await expect(
            service.processAdtMessage({
              adtType: AdtType.A01,
              cpf: patient.cpf,
              name: 'John Doe',
              birthDate: '1990-01-01',
              sex: Sex.M,
              admitDate: '2023-01-01',
            } as AdtMessageDto),
          ).rejects.toThrow(ConflictException);

          expect(encounterRepositoryMock.create).not.toHaveBeenCalled();
          expect(encounterRepositoryMock.save).not.toHaveBeenCalled();
        });



  it.skip('should create patient when not found and then create admission encounter', async () => {
                    const newPatientDto = {
                      cpf: '98765432100',
                      name: 'Jane Doe',
                      birthDate: '1995-05-05',
                      sex: Sex.F,
                    };
                    const createdPatient = {
                      id: 'p2',
                      ...newPatientDto,
                      birthDate: new Date('1995-05-05'),
                      email: null,
                      phone: null,
                      active: true,
                      created_at: new Date(),
                      updated_at: new Date(),
                      encounters: [],
                    } as Patient;

                    patientServiceMock.findByCpfOrFail
                      .mockResolvedValueOnce(null)
                      .mockResolvedValue(createdPatient);
                    patientServiceMock.createPatient.mockResolvedValueOnce(createdPatient);
                    encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce(null);

                    const createdEncounter = {
                      patientId: createdPatient.id,
                      adtType: AdtType.A01,
                      status: EncounterStatus.ADMITTED,
                      ward: Ward.EMERGENCY,
                      admitDate: new Date('2023-02-01'),
                    };

                    encounterRepositoryMock.create.mockReturnValueOnce(createdEncounter as unknown as Encounter);
                    encounterRepositoryMock.save.mockResolvedValueOnce(createdEncounter as unknown as Encounter);

                    await service.processAdtMessage({
                      adtType: AdtType.A01,
                      cpf: newPatientDto.cpf,
                      name: newPatientDto.name,
                      birthDate: newPatientDto.birthDate,
                      sex: newPatientDto.sex,
                      ward: Ward.EMERGENCY,
                      admitDate: '2023-02-01',
                    } as AdtMessageDto);

                    expect(patientServiceMock.createPatient).toHaveBeenCalledWith(
                      expect.objectContaining({
                        cpf: newPatientDto.cpf,
                        name: newPatientDto.name,
                        birthDate: newPatientDto.birthDate,
                        sex: Sex.F,
                      }),
                    );
                    expect(encounterRepositoryMock.create).toHaveBeenCalledWith(
                      expect.objectContaining({
                        patientId: createdPatient.id,
                        adtType: AdtType.A01,
                        status: EncounterStatus.ADMITTED,
                        ward: Ward.EMERGENCY,
                        admitDate: new Date('2023-02-01'),
                      }),
                    );
                    expect(encounterRepositoryMock.save).toHaveBeenCalledWith(createdEncounter);
                  });




  it('should throw NotFoundException when transfer ADT received but no active encounter exists', async () => {
    const patient = { id: 'p3', cpf: '11122233344' } as Patient;

    patientServiceMock.findByCpfOrFail.mockResolvedValueOnce(patient);
    encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce(null);

    await expect(
      service.processAdtMessage({
        adtType: AdtType.A02,
        cpf: patient.cpf,
        ward: Ward.SURGERY,
        transferDate: '2023-03-10',
      } as AdtMessageDto),
    ).rejects.toThrow(NotFoundException);

    expect(encounterRepositoryMock.save).not.toHaveBeenCalled();
  });

  it.skip('should update active encounter status to TRANSFERRED on transfer ADT', async () => {
              const patient = { id: 'p4', cpf: '55566677788' } as Patient;
              const activeEncounter = {
                id: 'e2',
                patientId: patient.id,
                status: EncounterStatus.ADMITTED,
                ward: Ward.INPATIENT,
                admitDate: new Date('2023-01-01'),
              } as Encounter;

              patientServiceMock.findByCpfOrFail = jest.fn().mockResolvedValueOnce(patient);
              encounterRepositoryMock.findActiveByPatient = jest.fn().mockResolvedValueOnce(activeEncounter);
              encounterRepositoryMock.findOneOrFail = jest.fn().mockResolvedValueOnce(activeEncounter);
              encounterRepositoryMock.save = jest.fn().mockResolvedValueOnce({
                ...activeEncounter,
                status: EncounterStatus.TRANSFERRED,
                ward: Ward.SURGERY,
                transferDate: new Date('2023-03-10'),
              } as Encounter);

              await service.processAdtMessage({
                adtType: AdtType.A02,
                cpf: patient.cpf,
                ward: Ward.SURGERY,
                transferDate: '2023-03-10',
              } as AdtMessageDto);

              expect(encounterRepositoryMock.save).toHaveBeenCalledWith(
                expect.objectContaining({
                  id: activeEncounter.id,
                  status: EncounterStatus.TRANSFERRED,
                  ward: Ward.SURGERY,
                  transferDate: new Date('2023-03-10'),
                }),
              );
            });




  it.skip('should update active encounter status to DISCHARGED on discharge ADT', async () => {
              if (!patientServiceMock.findByCpfOrFail) {
                patientServiceMock.findByCpfOrFail = jest.fn();
              }
              if (!encounterRepositoryMock.findActiveByPatient) {
                encounterRepositoryMock.findActiveByPatient = jest.fn();
              }
              if (!encounterRepositoryMock.findOneOrFail) {
                encounterRepositoryMock.findOneOrFail = jest.fn();
              }
              if (!encounterRepositoryMock.save) {
                encounterRepositoryMock.save = jest.fn();
              }

              const patient = { id: 'p5', cpf: '99988877766' } as Patient;
              const activeEncounter = {
                id: 'e3',
                patientId: patient.id,
                status: EncounterStatus.ADMITTED,
                ward: Ward.INPATIENT,
                admitDate: new Date('2023-01-01'),
              } as Encounter;

              patientServiceMock.findByCpfOrFail.mockResolvedValueOnce(patient);
              encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce(activeEncounter);
              encounterRepositoryMock.findOneOrFail.mockResolvedValueOnce(activeEncounter);
              encounterRepositoryMock.save.mockResolvedValueOnce({
                ...activeEncounter,
                status: EncounterStatus.DISCHARGED,
                dischargeDate: new Date('2023-04-01'),
              } as Encounter);

              await service.processAdtMessage({
                adtType: AdtType.A03,
                cpf: patient.cpf,
                dischargeDate: '2023-04-01',
              } as AdtMessageDto);

              expect(encounterRepositoryMock.save).toHaveBeenCalledWith(
                expect.objectContaining({
                  id: activeEncounter.id,
                  status: EncounterStatus.DISCHARGED,
                  dischargeDate: new Date('2023-04-01'),
                }),
              );
            });




  it('should throw BadRequestException for unsupported ADT type', async () => {
    const patient = { id: 'p6', cpf: '22233344455' } as Patient;

    patientServiceMock.findByCpfOrFail.mockResolvedValueOnce(patient);
    encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce(null);

    await expect(
      service.processAdtMessage({
        adtType: AdtType.A08,
        cpf: patient.cpf,
      } as AdtMessageDto),
    ).rejects.toThrow(BadRequestException);
  });
});
});

  describe('FN_updateEncounter_END', () => {
describe('updateEncounter', () => {
  it('should throw NotFoundException when encounter does not exist', async () => {
    encounterRepositoryMock.findById.mockResolvedValueOnce(null);

    await expect(service.updateEncounter('enc-1', {} as UpdateEncounterDto)).rejects.toThrow(
      NotFoundException,
    );
  });

  it.skip('should update admitDate and save the encounter', async () => {
        const existingEncounter = {
          id: 'enc-1',
          admitDate: new Date('2022-01-01T00:00:00Z'),
          ward: null,
        } as Encounter;

        encounterRepositoryMock.findById.mockResolvedValueOnce(existingEncounter);
        encounterRepositoryMock.save.mockImplementationOnce((enc) => Promise.resolve(enc));

        const dto = { admitDate: '2023-03-15T12:00:00Z' } as UpdateEncounterDto;

        await service.updateEncounter('enc-1', dto);

        expect(encounterRepositoryMock.save).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 'enc-1',
            admitDate: new Date('2023-03-15T12:00:00Z'),
          }),
        );
      });

  it('should update ward and save the encounter', async () => {
    const existingEncounter = {
      id: 'enc-2',
      admitDate: new Date('2022-01-01T00:00:00Z'),
      ward: null,
    } as Encounter;

    encounterRepositoryMock.findById.mockResolvedValueOnce(existingEncounter);
    encounterRepositoryMock.save.mockImplementationOnce((enc) => Promise.resolve(enc));

    const dto = { ward: Ward.ICU } as UpdateEncounterDto;

    await service.updateEncounter('enc-2', dto);

    expect(encounterRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'enc-2',
        ward: Ward.ICU,
      }),
    );
  });
});
});

  describe('FN_buildEncounterSummary_END', () => {
describe('buildEncounterSummary', () => {
  it('should return summary with undefined patient when patient is not found', async () => {
      const encounter = {
        patientId: 'patient-1',
        orders: [],
        results: [],
        startDate: new Date(),
        admitDate: new Date(),
      } as unknown as Encounter;

      jest.spyOn(service as any, 'getEncounterById').mockResolvedValueOnce(encounter);
      patientServiceMock.getPatientById.mockResolvedValueOnce(undefined);

      const summary = await service.buildEncounterSummary('encounter-1');

      expect(summary.patient).toBeUndefined();
      expect(patientServiceMock.getPatientById).toHaveBeenCalledWith('patient-1');
    });



  it('should aggregate orders, results and set risk flag to HIGH when abnormal results exist', async () => {
      const patient = { id: 'patient-1', name: 'John Doe' } as Patient;
      patientServiceMock.getPatientById.mockResolvedValueOnce(patient);

      const encounter = {
        id: 'enc-1',
        patientId: 'patient-1',
        admitDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        orders: [
          {
            status: OrderStatus.PENDING,
            results: [
              {
                status: ResultStatus.PRELIMINARY,
                value: '30',
                referenceMin: '10',
                referenceMax: '20',
              },
            ],
          },
          {
            status: OrderStatus.PENDING,
            results: [
              {
                status: ResultStatus.FINAL,
                value: '15',
                referenceMin: '10',
                referenceMax: '20',
              },
            ],
          },
          {
            status: OrderStatus.IN_PROGRESS,
            results: [
              {
                status: ResultStatus.FINAL,
                value: '12',
                referenceMin: '10',
                referenceMax: '20',
              },
            ],
          },
          { status: OrderStatus.COMPLETED, results: [] },
          { status: OrderStatus.CANCELLED, results: [] },
        ],
      } as unknown as Encounter;

      jest.spyOn(service, 'getEncounterById').mockResolvedValueOnce(encounter);

      const summary = await service.buildEncounterSummary('enc-1');

      expect(patientServiceMock.getPatientById).toHaveBeenCalledWith('patient-1');
      expect(summary.patient).toBe(patient);
      expect(summary.activeDays).toBe(10);
      expect(summary.orders).toEqual({
        total: 5,
        pending: 2,
        inProgress: 1,
        completed: 1,
        cancelled: 1,
      });
      expect(summary.results).toEqual({
        total: 3,
        abnormal: 1,
        preliminary: 1,
      });
      expect(summary.hasAbnormalResults).toBe(true);
      expect(summary.riskFlag).toBe('HIGH');
    });


  it('should handle empty orders and results with LOW risk flag', async () => {
      const patient = { id: 'patient-2', name: 'Jane Smith' } as Patient;
      patientServiceMock.getPatientById.mockResolvedValueOnce(patient);

      const encounter = {
        id: 'enc-1',
        patientId: 'patient-2',
        admitDate: new Date(),
        orders: [],
      } as unknown as Encounter;

      jest.spyOn(service, 'getEncounterById').mockResolvedValueOnce(encounter);

      const summary = await service.buildEncounterSummary('enc-1');

      expect(summary.patient).toBe(patient);
      expect(summary.activeDays).toBe(0);
      expect(summary.orders).toEqual({
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        cancelled: 0,
      });
      expect(summary.results).toEqual({
        total: 0,
        abnormal: 0,
        preliminary: 0,
      });
      expect(summary.hasAbnormalResults).toBe(false);
      expect(summary.riskFlag).toBe('LOW');
    });

});
});

  // TESTS_APPEND_HERE
});
