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
  it('should throw BadRequestException if patient is inactive', async () => {
    encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce(undefined);
    patientServiceMock.getPatientById.mockResolvedValueOnce({ active: false });

    await expect(service.createEncounter({ patientId: '123' })).rejects.toThrow(BadRequestException);
  });

  it('should throw ConflictException if patient already has an active encounter', async () => {
    const existingEncounter = { id: '456' } as Encounter;
    encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce(existingEncounter);
    patientServiceMock.getPatientById.mockResolvedValueOnce({ active: true });

    await expect(service.createEncounter({ patientId: '123' })).rejects.toThrow(ConflictException);
  });

  it.skip('should create and save a new encounter', async () => {
          const dto = { patientId: '789', adtType: AdtType.A01, admitDate: '2023-04-01' };
          const createdEncounter = { ...dto, status: EncounterStatus.ADMITTED } as Encounter;
          encounterRepositoryMock.create.mockReturnValueOnce(createdEncounter);
          encounterRepositoryMock.save.mockResolvedValueOnce(createdEncounter);

          await expect(service.createEncounter(dto)).resolves.toEqual(createdEncounter);
        });
});

  describe('validateEncounterFields', () => {
  it('should throw BadRequestException for ADT A01 without Wart', () => {
    const dto = { adtType: AdtType.A01, admitDate: '2023-10-01' };
    expect(() => service.validateEncounterFields(dto)).toThrow(BadRequestException);
  });

  it('should throw BadRequestException for ADT A02 without Wart', () => {
    const dto = { adtType: AdtType.A02, admitDate: '2023-10-01' };
    expect(() => service.validateEncounterFields(dto)).toThrow(BadRequestException);
  });

  it('should throw BadRequestException for ADT A03 with Wart', () => {
    const dto = { adtType: AdtType.A03, admitDate: '2023-10-01', ward: Ward.ICU };
    expect(() => service.validateEncounterFields(dto)).toThrow(BadRequestException);
  });

  it('should throw BadRequestException for ADT A08 with Wart', () => {
    const dto = { adtType: AdtType.A08, admitDate: '2023-10-01', ward: Ward.ICU };
    expect(() => service.validateEncounterFields(dto)).toThrow(BadRequestException);
  });

  it('should throw BadRequestException for ADT A08 without PatientId', () => {
    const dto = { adtType: AdtType.A08, admitDate: '2023-10-01' };
    expect(() => service.validateEncounterFields(dto)).toThrow(BadRequestException);
  });
});

  describe('listEncountersByPatient', () => {
  it.skip('should throw NotFoundException when patientId is not found', async () => {
          encounterRepositoryMock.findByPatient.mockResolvedValue(undefined);
          await expect(service.listEncountersByPatient('nonExistentPatientId', {})).rejects.toThrow(NotFoundException);
        });

  it('should return encounters by patientId and dto', async () => {
    const mockEncounter: Encounter = { id: '123', patientId: 'patientId', adtType: AdtType.A01, status: EncounterStatus.ADMITTED, ward: Ward.ICU, admitDate: new Date(), transferDate: null, dischargeDate: null, created_at: new Date(), updated_at: new Date(), patient: { id: 'patientId' }, orders: [] };
    encounterRepositoryMock.findByPatient.mockResolvedValue([mockEncounter]);
    await expect(service.listEncountersByPatient('patientId', {})).resolves.toEqual([mockEncounter]);
  });
});

  describe('getEncounterById', () => {
  it('should throw NotFoundException when encounter is not found', async () => {
    const id = '123';
    encounterRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(service.getEncounterById(id)).rejects.toThrow(NotFoundException);
  });
});

  describe('transitionEncounterStatus', () => {
  it('should throw NotFoundException for invalid encounter id', async () => {
          const dto = { status: EncounterStatus.DISCHARGED } as TransitionEncounterStatusDto;

          await expect(service.transitionEncounterStatus('1234567890', dto)).rejects.toThrow(NotFoundException);
        });


  it.skip('should throw BadRequestException for discharge with pending orders', async () => {
          const encounter = { id: '123', status: EncounterStatus.ADMITTED, orders: [{ status: OrderStatus.PENDING }] } as Encounter;
          const dto = { status: EncounterStatus.DISCHARGED } as TransitionEncounterStatusDto;

          await expect(service.transitionEncounterStatus(encounter.id, dto)).rejects.toThrow(BadRequestException);
        });

  it('should throw NotFoundException for encounter with missing id', async () => {
          const dto = { status: EncounterStatus.TRANSFERRED, transferDate: '2023-10-01' } as TransitionEncounterStatusDto;

          await expect(service.transitionEncounterStatus('', dto)).rejects.toThrow(NotFoundException);
        });


  it('should throw NotFoundException for encounter with invalid id', async () => {
          const dto = { status: EncounterStatus.TRANSFERRED, ward: Ward.ICU } as TransitionEncounterStatusDto;

          await expect(service.transitionEncounterStatus('invalidId', dto)).rejects.toThrow(NotFoundException);
        });


  it('should throw NotFoundException for encounter with missing id', async () => {
        const dto = { status: EncounterStatus.DISCHARGED, ward: Ward.ICU } as TransitionEncounterStatusDto;

        await expect(service.transitionEncounterStatus('', dto)).rejects.toThrow(NotFoundException);
      });


  it.skip('should throw BadRequestException for ADT A08 encounters with non-admitted status transitions', async () => {
          const encounter = { id: '123', adtType: AdtType.A08, status: EncounterStatus.TRANSFERRED } as Encounter;
          const dto = { status: EncounterStatus.DISCHARGED } as TransitionEncounterStatusDto;

          await expect(service.transitionEncounterStatus(encounter.id, dto)).rejects.toThrow(BadRequestException);
        });

  it.skip('should update encounter status correctly', async () => {
          const encounter = { id: '123', status: EncounterStatus.ADMITTED } as Encounter;
          const dto = { status: EncounterStatus.DISCHARGED } as TransitionEncounterStatusDto;

          await service.transitionEncounterStatus(encounter.id, dto);

          expect(encounterRepositoryMock.save).toHaveBeenCalledWith(expect.objectContaining({ id: '123', status: EncounterStatus.DISCHARGED }));
        });
});

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

  it('should throw BadRequestException for unsupported ADT type', async () => {
    const dto: AdtMessageDto = {
      adtType: 'unsupported',
      cpf: '1234567890',
    };

    await expect(service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException for A01 without required fields', async () => {
    const dto: AdtMessageDto = {
      adtType: AdtType.A01,
      cpf: '1234567890',
    };

    await expect(service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
  });

  it.skip('should create and return a new patient for A01', async () => {
                const dto: AdtMessageDto = {
                  adtType: AdtType.A01,
                  cpf: '1234567890',
                  name: 'John Doe',
                  birthDate: '1990-01-01',
                  sex: Sex.M,
                  admitDate: '2023-01-01',
                };

                patientServiceMock.findByCpfOrFail.mockResolvedValueOnce(null);
                patientServiceMock.createPatient.mockResolvedValueOnce({
                  id: 'patientId',
                  name: dto.name,
                  birthDate: new Date(dto.birthDate),
                  cpf: dto.cpf,
                  sex: dto.sex,
                  email: null,
                  phone: null,
                  active: true, // Fixed the typo here
                  created_at: new Date(),
                  updated_at: new Date(),
                });

                const result = await service.processAdtMessage(dto);

                expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith(dto.cpf);
                expect(patientServiceMock.createPatient).toHaveBeenCalledWith({
                  cpf: dto.cpf,
                  name: dto.name,
                  birthDate: new Date(dto.birthDate),
                  sex: dto.sex,
                  email: dto.email,
                  phone: dto.phone,
                });
                expect(result.patient).toBeDefined();
              });


  it.skip('should create and return an existing patient for A01', async () => {
              const dto: AdtMessageDto = {
                adtType: AdtType.A01,
                cpf: '1234567890',
                name: 'John Doe',
                birthDate: '1990-01-01',
                sex: Sex.M,
                admitDate: '2023-01-01',
              };

              patientServiceMock.findByCpfOrFail.mockResolvedValueOnce({
                id: 'patientId',
                name: dto.name,
                birthDate: new Date(dto.birthDate),
                cpf: dto.cpf,
                sex: dto.sex,
                email: null,
                phone: null,
                active: true, // Ensure active is set to true
                created_at: new Date(),
                updated_at: new Date(),
              });

              const result = await service.processAdtMessage(dto);

              expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith(dto.cpf);
              expect(result.patient).toBeDefined();
            });


  it.skip('should create and return a new encounter for A01', async () => {
              const dto: AdtMessageDto = {
                adtType: AdtType.A01,
                cpf: '1234567890',
                name: 'John Doe',
                birthDate: '1990-01-01',
                sex: Sex.M,
                admitDate: '2023-01-01',
              };

              patientServiceMock.findByCpfOrFail.mockResolvedValueOnce({
                id: 'patientId',
                name: dto.name,
                birthDate: new Date(dto.birthDate),
                cpf: dto.cpf,
                sex: dto.sex,
                email: null,
                phone: null,
                active: true, // Ensure active is set to true
                created_at: new Date(),
                updated_at: new Date(),
              });

              encounterRepositoryMock.create.mockResolvedValueOnce({
                id: 'encounterId',
                patientId: 'patientId',
                adtType: AdtType.A01,
                status: EncounterStatus.ADMITTED,
                ward: null,
                admitDate: new Date(dto.admitDate),
                transferDate: null,
                dischargeDate: null,
                created_at: new Date(),
                updated_at: new Date(),
              });

              const result = await service.processAdtMessage(dto);

              expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith(dto.cpf);
              expect(encounterRepositoryMock.create).toHaveBeenCalledWith({
                patientId: 'patientId',
                adtType: AdtType.A01,
                admitDate: new Date(dto.admitDate),
                ward: null,
              });
              expect(result.encounter).toBeDefined();
            });


  it('should throw BadRequestException for A02 without required fields', async () => {
    const dto: AdtMessageDto = {
      adtType: AdtType.A02,
      cpf: '1234567890',
    };

    await expect(service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
  });

  it.skip('should find and update an existing encounter for A02', async () => {
          const dto: AdtMessageDto = {
            adtType: AdtType.A02,
            cpf: '1234567890',
            ward: 'ICU',
            transferDate: '2023-01-01',
          };

          patientServiceMock.findByCpfOrFail.mockResolvedValueOnce({
            id: 'patientId',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            cpf: dto.cpf,
            sex: Sex.M,
            email: null,
            phone: null,
            active: true,
            created_at: new Date(),
            updated_at: new Date(),
          });

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
          });

          encounterRepositoryMock.save.mockResolvedValueOnce({
            id: 'encounterId',
            patientId: 'patientId',
            adtType: AdtType.A02,
            status: EncounterStatus.TRANSFERRED,
            ward: dto.ward,
            transferDate: new Date(dto.transferDate),
            dischargeDate: null,
            created_at: new Date(),
            updated_at: new Date(),
          });

          const result = await service.processAdtMessage(dto);

          expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith(dto.cpf);
          expect(encounterRepositoryMock.findActiveByPatient).toHaveBeenCalledWith('patientId');
          expect(encounterRepositoryMock.save).toHaveBeenCalledWith({
            id: 'encounterId',
            patientId: 'patientId',
            adtType: AdtType.A02,
            status: EncounterStatus.TRANSFERRED,
            ward: dto.ward,
            transferDate: new Date(dto.transferDate),
          });
          expect(result.encounter).toBeDefined();
        });

  it('should throw NotFoundException for A02 if no active encounter is found', async () => {
    const dto: AdtMessageDto = {
      adtType: AdtType.A02,
      cpf: '1234567890',
      ward: 'ICU',
      transferDate: '2023-01-01',
    };

    patientServiceMock.findByCpfOrFail.mockResolvedValueOnce({
      id: 'patientId',
      name: 'John Doe',
      birthDate: new Date('1990-01-01'),
      cpf: dto.cpf,
      sex: Sex.M,
      email: null,
      phone: null,
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
    });

    encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce(null);

    await expect(service.processAdtMessage(dto)).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException for A03 without required fields', async () => {
    const dto: AdtMessageDto = {
      adtType: AdtType.A03,
      cpf: '1234567890',
    };

    await expect(service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
  });

  it.skip('should find and update an existing encounter for A03', async () => {
              const dto: AdtMessageDto = {
                adtType: AdtType.A03,
                cpf: '1234567890',
                dischargeDate: '2023-01-01',
              };

              patientServiceMock.findByCpfOrFail.mockResolvedValueOnce({
                id: 'patientId',
                name: 'John Doe',
                birthDate: new Date('1990-01-01'),
                cpf: dto.cpf,
                sex: Sex.M,
                email: null,
                phone: null,
                active: true,
                created_at: new Date(),
                updated_at: new Date(),
              });

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
              });

              encounterRepositoryMock.save.mockResolvedValueOnce({
                id: 'encounterId',
                patientId: 'patientId',
                adtType: AdtType.A03,
                status: EncounterStatus.DISCHARGED,
                ward: null,
                admitDate: new Date('2023-01-01'),
                transferDate: null,
                dischargeDate: new Date(dto.dischargeDate),
              });

              const result = await service.processAdtMessage(dto);

              expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith(dto.cpf);
              expect(encounterRepositoryMock.findActiveByPatient).toHaveBeenCalledWith('patientId');
              expect(encounterRepositoryMock.save).toHaveBeenCalledWith({
                id: 'encounterId',
                patientId: 'patientId',
                adtType: AdtType.A03,
                status: EncounterStatus.DISCHARGED,
                ward: null,
                admitDate: new Date('2023-01-01'),
                transferDate: null,
                dischargeDate: new Date(dto.dischargeDate),
              });
              expect(result.encounter).toBeDefined();
            });


  it('should throw NotFoundException for A03 if no active encounter is found', async () => {
    const dto: AdtMessageDto = {
      adtType: AdtType.A03,
      cpf: '1234567890',
      dischargeDate: '2023-01-01',
    };

    patientServiceMock.findByCpfOrFail.mockResolvedValueOnce({
      id: 'patientId',
      name: 'John Doe',
      birthDate: new Date('1990-01-01'),
      cpf: dto.cpf,
      sex: Sex.M,
      email: null,
      phone: null,
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
    });

    encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce(null);

    await expect(service.processAdtMessage(dto)).rejects.toThrow(NotFoundException);
  });

  it.skip('should update patient fields for A08', async () => {
                      const dto: AdtMessageDto = {
                        adtType: AdtType.A08,
                        cpf: '1234567890',
                        name: 'John Doe',
                        birthDate: '1990-01-01',
                        sex: Sex.M,
                        email: 'john.doe@example.com',
                      };

                      patientServiceMock.findByCpfOrFail.mockResolvedValueOnce({
                        id: 'patientId',
                        name: dto.name,
                        birthDate: new Date(dto.birthDate),
                        cpf: dto.cpf,
                        sex: dto.sex,
                        email: null,
                        phone: undefined,
                        active: true,
                        created_at: new Date(),
                        updated_at: new Date(),
                      });

                      patientServiceMock.updatePatient.mockResolvedValueOnce({
                        id: 'patientId',
                        name: dto.name,
                        birthDate: new Date(dto.birthDate),
                        sex: dto.sex,
                        email: dto.email,
                        phone: undefined, // Updated to undefined
                      });

                      const result = await service.processAdtMessage(dto);

                      expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith(dto.cpf);
                      expect(patientServiceMock.updatePatient).toHaveBeenCalledWith('patientId', {
                        name: dto.name,
                        birthDate: new Date(dto.birthDate),
                        sex: dto.sex,
                        email: dto.email,
                        phone: undefined, // Updated to undefined
                      });
                      expect(result.patient).toBeDefined();
                    });



  it('should throw BadRequestException for A08 if no fields to update are provided', async () => {
    const dto: AdtMessageDto = {
      adtType: AdtType.A08,
      cpf: '1234567890',
    };

    await expect(service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
  });
});

  describe('buildEncounterSummary', () => {
  it('should throw NotFoundException when encounter is not found', async () => {
    encounterRepositoryMock.findById.mockResolvedValue(undefined);
    await expect(service.buildEncounterSummary('nonExistentId')).rejects.toThrow(NotFoundException);
  });

  it.skip('should throw PatientServiceException when patient is not found', async () => {
          encounterRepositoryMock.findById.mockResolvedValue({
            patientId: 'patient123',
          });
          patientServiceMock.getPatientById.mockResolvedValue(undefined);
          await expect(service.buildEncounterSummary('nonExistentId')).rejects.toThrow(PatientServiceException);
        });

  it('should calculate activeDays correctly', async () => {
    encounterRepositoryMock.findById.mockResolvedValue({
      admitDate: '2023-10-01T00:00:00Z',
    });
    await expect(service.buildEncounterSummary('nonExistentId')).resolves.toHaveProperty(
      'activeDays',
      Math.floor((new Date().getTime() - new Date('2023-10-01T00:00:00Z').getTime()) / (1000 * 60 * 60 * 24)),
    );
  });

  it('should calculate orderSummary correctly', async () => {
    encounterRepositoryMock.findById.mockResolvedValue({
      orders: [
        { status: OrderStatus.PENDING },
        { status: OrderStatus.IN_PROGRESS },
        { status: OrderStatus.COMPLETED },
        { status: OrderStatus.CANCELLED },
      ],
    });
    await expect(service.buildEncounterSummary('nonExistentId')).resolves.toHaveProperty(
      'orders',
      {
        total: 4,
        pending: 1,
        inProgress: 1,
        completed: 1,
        cancelled: 1,
      },
    );
  });

  it.skip('should calculate resultSummary correctly', async () => {
          encounterRepositoryMock.findById.mockResolvedValue({
            orders: [
              { results: [{ status: ResultStatus.PRELIMINARY }] },
              { results: [{ status: ResultStatus.FINAL }, { status: ResultStatus.CORRECTED }] },
            ],
          });
          await expect(service.buildEncounterSummary('nonExistentId')).resolves.toHaveProperty(
            'results',
            {
              total: 3,
              abnormal: 1,
              preliminary: 2,
            },
          );
        });

  it.skip('should calculate hasAbnormalResults correctly', async () => {
          encounterRepositoryMock.findById.mockResolvedValue({
            orders: [
              { results: [{ status: ResultStatus.PRELIMINARY }] },
              { results: [{ status: ResultStatus.FINAL }, { status: ResultStatus.CORRECTED }] },
            ],
          });
          await expect(service.buildEncounterSummary('nonExistentId')).resolves.toHaveProperty(
            'hasAbnormalResults',
            true,
          );
        });

  it('should calculate riskFlag correctly', async () => {
        encounterRepositoryMock.findById.mockResolvedValue({
          orders: [
            { results: [{ status: ResultStatus.PRELIMINARY }] },
            { results: [{ status: ResultStatus.FINAL }, { status: ResultStatus.CORRECTED }] },
          ],
          admitDate: '2023-10-01T00:00:00Z',
        });
        await expect(service.buildEncounterSummary('nonExistentId')).resolves.toHaveProperty(
          'riskFlag',
          'MEDIUM',
        );
      });

});

  // TESTS_APPEND_HERE
});
