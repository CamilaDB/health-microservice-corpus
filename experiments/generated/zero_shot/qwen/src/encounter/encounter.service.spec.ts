// AUTO-GENERATED-BOOTSTRAP-START
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { OrderStatus } from '../order/enums/order-status.enum';
import { CreatePatientDto } from '../patient/dto/create-patient.dto';
import { UpdatePatientDto } from '../patient/dto/update-patient.dto';
import { Sex } from '../patient/enums/sex.enum';
import { AdtMessageDto } from './dto/adt-message.dto';
import { CreateEncounterDto } from './dto/create-encounter.dto';
import { ListEncountersByPatientDto } from './dto/list-encounters-by-patient.dto';
import { TransitionEncounterStatusDto } from './dto/transition-encounter-status.dto';
import { AdtType } from './enums/adt-type.enum';
import { EncounterStatus } from './enums/encounter-status.enum';
import { Ward } from './enums/ward.enum';
import { EncounterService } from './encounter.service';
import { EncounterRepository } from './encounter.repository';
import { PatientService } from '../patient/patient.service';

describe('EncounterService', () => {

  let service: EncounterService;
  let encounterRepositoryMock: jest.Mocked<EncounterRepository>;
  let patientServiceMock: jest.Mocked<PatientService>;

  beforeEach(async () => {

    encounterRepositoryMock = {
          findById: jest.fn().mockResolvedValue(undefined),
          findActiveByPatient: jest.fn().mockResolvedValue(undefined),
          findByPatient: jest.fn().mockResolvedValue(undefined),
          save: jest.fn().mockResolvedValue(undefined),
          create: jest.fn().mockReturnValue(undefined),
        } as jest.Mocked<EncounterRepository>;

    patientServiceMock = {
          getPatientById: jest.fn().mockResolvedValue(undefined),
          listPatients: jest.fn().mockResolvedValue(undefined),
          createPatient: jest.fn().mockResolvedValue(undefined),
          updatePatient: jest.fn().mockResolvedValue(undefined),
          findByCpfOrFail: jest.fn().mockResolvedValue(undefined),
        } as jest.Mocked<PatientService>;

    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          EncounterService,
          { provide: EncounterRepository, useValue: encounterRepositoryMock },
          { provide: PatientService, useValue: patientServiceMock },
        ],
      }).compile();

    service = module.get<EncounterService>(EncounterService);

    jest.clearAllMocks();
  });
  // AUTO-GENERATED-BOOTSTRAP-END

  
        describe('createEncounter', () => {
  it('should throw ConflictException if patient already has an active encounter', async () => {
    const dto: CreateEncounterDto = {
      patientId: '123',
      adtType: AdtType.A01,
      admitDate: '2023-10-01T14:30:00Z',
      ward: Ward.ICU,
    };

    encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce({
      id: 1,
    });

    await expect(service.createEncounter(dto)).rejects.toThrow(ConflictException);
  });

  it('should create and save a new encounter', async () => {
    const dto: CreateEncounterDto = {
      patientId: '456',
      adtType: AdtType.A02,
      admitDate: '2023-10-02T15:45:00Z',
      ward: null,
    };

    encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce(null);

    const createdEncounter = {
      ...dto,
      admitDate: new Date(dto.admitDate),
      status: EncounterStatus.ADMITTED,
      ward: dto.ward ?? null,
      transferDate: null,
      dischargeDate: null,
    };

    encounterRepositoryMock.create.mockReturnValueOnce(createdEncounter);
    encounterRepositoryMock.save.mockResolvedValueOnce(createdEncounter);

    const result = await service.createEncounter(dto);

    expect(result).toEqual(createdEncounter);
    expect(encounterRepositoryMock.findActiveByPatient).toHaveBeenCalledWith('456');
    expect(encounterRepositoryMock.create).toHaveBeenCalledWith({
      ...dto,
      admitDate: new Date(dto.admitDate),
      status: EncounterStatus.ADMITTED,
      ward: dto.ward ?? null,
      transferDate: null,
      dischargeDate: null,
    });
    expect(encounterRepositoryMock.save).toHaveBeenCalledWith(createdEncounter);
  });

  it('should throw BadRequestException if patientId is missing', async () => {
                          const dto: CreateEncounterDto = {
                            adtType: AdtType.A03,
                            admitDate: '2023-10-03T16:00:00Z',
                            ward: Ward.INPATIENT,
                          };

                          await expect(service.createEncounter(dto)).rejects.toThrow(BadRequestException);
                        });






});

        
        describe('validateEncounterFields', () => {
  it('should throw BadRequestException for ADT A01 with missing Ward', async () => {
                                                    const dto: CreateEncounterDto = { adtType: AdtType.A01, admitDate: '2023-10-01' };
                                                    await expect(() => service.validateEncounterFields(dto)).rejects.toThrow(
                                                      BadRequestException,
                                                      'Ward is required for ADT A01 (admission)',
                                                    );
                                                  });






  it('should throw BadRequestException for ADT A02 with missing Wart', async () => {
              const dto: CreateEncounterDto = { adtType: AdtType.A02, admitDate: '2023-10-01' };
              await expect(() => service.validateEncounterFields(dto)).rejects.toThrow(
                BadRequestException,
                'Ward is required for ADT A02 (transfer)',
              );
            });






  it('should throw BadRequestException for ADT A03 with provided Wart', async () => {
                const dto: CreateEncounterDto = { adtType: AdtType.A03, admitDate: '2023-10-01' };
                await expect(service.validateEncounterFields(dto)).rejects.toThrow(BadRequestException);
            });






  it('should throw BadRequestException for ADT A08 with provided Wart', async () => {
                const dto: CreateEncounterDto = { adtType: AdtType.A08, admitDate: '2023-10-01', ward: Ward.ICU };
                await expect(() => service.validateEncounterFields(dto)).rejects.toThrow(
                  BadRequestException,
                  'Ward must not be informed for ADT A08 (update)',
                );
              });






  it('should throw BadRequestException for ADT A08 with missing PatientId', async () => {
                const dto: CreateEncounterDto = { adtType: AdtType.A08, admitDate: '2023-10-01' };
                await expect(() => service.validateEncounterFields(dto)).rejects.toThrow(
                  BadRequestException,
                  'PatientId is required for ADT A08 (update)',
                );
              });





});

        
        describe('getEncounterById', () => {
  it('should throw NotFoundException when encounter is not found', async () => {
    const id = '123';
    encounterRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(service.getEncounterById(id)).rejects.toThrow(NotFoundException);
  });

  it('should return the encounter if found', async () => {
    const id = '123';
    const encounter: Encounter = { id, /* other properties */ };
    encounterRepositoryMock.findById.mockResolvedValue(encounter);

    expect(await service.getEncounterById(id)).toBe(encounter);
  });
});

        
        describe('transitionEncounterStatus', () => {
  it('should throw BadRequestException if invalid status transition is attempted', async () => {
                                        const id = '123';
                                        const dto: TransitionEncounterStatusDto = { status: EncounterStatus.DISCHARGED };

                                        await expect(() =>
                                          service.transitionEncounterStatus(id, dto),
                                        ).rejects.toThrow(BadRequestException);
                                      });




  it('should throw BadRequestException if discharge is attempted with pending orders', async () => {
    const id = '123';
    const encounter: Encounter = { status: EncounterStatus.ADMITTED };
    const dto: TransitionEncounterStatusDto = { status: EncounterStatus.DISCHARGED };

    encounterRepositoryMock.findById.mockResolvedValue(encounter);
    encounter.orders = [{ status: OrderStatus.PENDING }];

    await expect(() =>
      service.transitionEncounterStatus(id, dto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if transfer is attempted without a ward', async () => {
    const id = '123';
    const encounter: Encounter = { status: EncounterStatus.ADMITTED };
    const dto: TransitionEncounterStatusDto = { status: EncounterStatus.TRANSFERRED };

    encounterRepositoryMock.findById.mockResolvedValue(encounter);

    await expect(() =>
      service.transitionEncounterStatus(id, dto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if transfer is attempted with the same ward', async () => {
    const id = '123';
    const encounter: Encounter = { status: EncounterStatus.ADMITTED, ward: Ward.ICU };
    const dto: TransitionEncounterStatusDto = { status: EncounterStatus.TRANSFERRED, ward: Ward.ICU };

    encounterRepositoryMock.findById.mockResolvedValue(encounter);

    await expect(() =>
      service.transitionEncounterStatus(id, dto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if transfer is attempted without a transferDate', async () => {
    const id = '123';
    const encounter: Encounter = { status: EncounterStatus.ADMITTED };
    const dto: TransitionEncounterStatusDto = { status: EncounterStatus.TRANSFERRED, ward: Ward.ICU };

    encounterRepositoryMock.findById.mockResolvedValue(encounter);

    await expect(() =>
      service.transitionEncounterStatus(id, dto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if transferDate is before admitDate', async () => {
    const id = '123';
    const encounter: Encounter = { status: EncounterStatus.ADMITTED, admitDate: new Date('2023-01-01') };
    const dto: TransitionEncounterStatusDto = { status: EncounterStatus.TRANSFERRED, ward: Ward.ICU, transferDate: '2022-12-31' };

    encounterRepositoryMock.findById.mockResolvedValue(encounter);

    await expect(() =>
      service.transitionEncounterStatus(id, dto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if discharge is attempted without a dischargeDate', async () => {
    const id = '123';
    const encounter: Encounter = { status: EncounterStatus.ADMITTED };
    const dto: TransitionEncounterStatusDto = { status: EncounterStatus.DISCHARGED };

    encounterRepositoryMock.findById.mockResolvedValue(encounter);

    await expect(() =>
      service.transitionEncounterStatus(id, dto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if dischargeDate is before admitDate', async () => {
    const id = '123';
    const encounter: Encounter = { status: EncounterStatus.ADMITTED, admitDate: new Date('2023-01-01') };
    const dto: TransitionEncounterStatusDto = { status: EncounterStatus.DISCHARGED, dischargeDate: '2022-12-31' };

    encounterRepositoryMock.findById.mockResolvedValue(encounter);

    await expect(() =>
      service.transitionEncounterStatus(id, dto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if dischargeDate is before transferDate', async () => {
    const id = '123';
    const encounter: Encounter = { status: EncounterStatus.ADMITTED, admitDate: new Date('2023-01-01'), transferDate: new Date('2023-02-01') };
    const dto: TransitionEncounterStatusDto = { status: EncounterStatus.DISCHARGED, dischargeDate: '2023-01-31' };

    encounterRepositoryMock.findById.mockResolvedValue(encounter);

    await expect(() =>
      service.transitionEncounterStatus(id, dto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if ADT A08 encounters cannot have status transitions', async () => {
    const id = '123';
    const encounter: Encounter = { status: EncounterStatus.ADMITTED, adtType: AdtType.A08 };
    const dto: TransitionEncounterStatusDto = { status: EncounterStatus.TRANSFERRED };

    encounterRepositoryMock.findById.mockResolvedValue(encounter);

    await expect(() =>
      service.transitionEncounterStatus(id, dto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should update the encounter status and save it', async () => {
                            const id = '123';
                            const encounter: Encounter = { status: EncounterStatus.ADMITTED };
                            const dto: TransitionEncounterStatusDto = { status: EncounterStatus.TRANSFERRED, ward: 'wardValue' };

                            encounterRepositoryMock.findById.mockResolvedValue(encounter);

                            await service.transitionEncounterStatus(id, dto);

                            expect(encounterRepositoryMock.save).toHaveBeenCalledWith(encounter);
                          });



});

        
        describe('processAdtMessage', () => {
  it('should throw BadRequestException for A01 with missing fields', async () => {
    const dto: AdtMessageDto = {
      adtType: AdtType.A01,
      cpf: '1234567890',
      name: '',
      birthDate: new Date(),
      sex: Sex.MALE,
      admitDate: new Date(),
    };

    await expect(() => service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
  });

  it('should create a patient and encounter for A01', async () => {
                const dto: AdtMessageDto = {
                    adtType: AdtType.A01,
                    cpf: '1234567890',
                    name: 'John Doe',
                    birthDate: new Date('1990-01-01'),
                    sex: Sex.MALE,
                    admitDate: new Date(),
                };

                const patientMock = {
                    id: 1,
                    cpf: dto.cpf,
                    name: dto.name,
                    birthDate: dto.birthDate,
                    sex: dto.sex,
                    email: '',
                    phone: '',
                };

                encounterRepositoryMock.create.mockResolvedValueOnce({
                    id: 2,
                    patientId: patientMock.id,
                    adtType: AdtType.A01,
                    admitDate: dto.admitDate,
                    ward: '',
                });

                const result = await service.processAdtMessage(dto);

                expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith(dto.cpf);
                expect(patientServiceMock.createPatient).toHaveBeenCalledWith({
                    cpf: dto.cpf,
                    name: dto.name,
                    birthDate: dto.birthDate,
                    sex: dto.sex,
                    email: '',
                    phone: '',
                });
                expect(encounterRepositoryMock.create).toHaveBeenCalledWith({
                    patientId: patientMock.id,
                    adtType: AdtType.A01,
                    admitDate: dto.admitDate,
                    ward: '',
                });
                expect(result).toEqual({ patient: patientMock, encounter: { id: 2 } });
            });



  it('should throw BadRequestException for A02 with missing fields', async () => {
    const dto: AdtMessageDto = {
      adtType: AdtType.A02,
      cpf: '1234567890',
      ward: '',
      transferDate: new Date(),
    };

    await expect(() => service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
  });

  it('should find an active encounter for A02', async () => {
              const dto: AdtMessageDto = {
                adtType: AdtType.A02,
                cpf: '1234567890',
                ward: 'ICU',
                transferDate: new Date(),
              };

              const patientMock = { id: 1, cpf: dto.cpf };
              const encounterMock = {
                id: 2,
                patientId: patientMock.id,
                adtType: AdtType.A01,
                admitDate: new Date('1990-01-01'),
                ward: 'ICU',
              };

              encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce(encounterMock);

              await expect(() => service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
            });



  it('should transition an encounter to transferred for A02', async () => {
                            const dto: AdtMessageDto = {
                              adtType: AdtType.A02,
                              cpf: '1234567890',
                              ward: 'ICU',
                              transferDate: new Date(),
                            };

                            const patientMock = { id: 1, cpf: dto.cpf };
                            const encounterMock = {
                              id: 2,
                              patientId: patientMock.id,
                              adtType: AdtType.A01,
                              admitDate: new Date('1990-01-01'),
                              ward: 'ICU',
                            };

                            encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce(encounterMock);
                            encounterRepositoryMock.save.mockResolvedValueOnce({
                              ...encounterMock,
                              status: EncounterStatus.TRANSFERRED,
                            });

                            patientServiceMock.findByCpfOrFail.mockResolvedValueOnce(patientMock);

                            const result = await service.processAdtMessage(dto);

                            expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith(dto.cpf);
                            expect(encounterRepositoryMock.findActiveByPatient).toHaveBeenCalledWith(patientMock.id);
                            expect(encounterRepositoryMock.save).toHaveBeenCalledWith({
                              ...encounterMock,
                              status: EncounterStatus.TRANSFERRED,
                            });
                            expect(result).toEqual({ patient: patientMock, encounter: { id: 2 } });
                          });



  it('should throw BadRequestException for A03 with missing fields', async () => {
              const dto: AdtMessageDto = {
                adtType: AdtType.A03,
                cpf: '1234567890',
                dischargeDate: new Date(),
              };

              await expect(() => service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
            });



  it('should find an active encounter for A03', async () => {
                          const dto: AdtMessageDto = {
                            adtType: AdtType.A03,
                            cpf: '1234567890',
                            dischargeDate: new Date(),
                          };

                          const patientMock = { id: 1, cpf: dto.cpf };
                          const encounterMock = {
                            id: 2,
                            patientId: patientMock.id,
                            adtType: AdtType.A01,
                            admitDate: new Date('1990-01-01'),
                            ward: 'ICU',
                          };

                          encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce(encounterMock);

                          await expect(() => service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
                        });



  it('should transition an encounter to discharged for A03', async () => {
                          const dto: AdtMessageDto = {
                            adtType: AdtType.A03,
                            cpf: '1234567890',
                            dischargeDate: new Date(),
                          };

                          const patientMock = { id: 1, cpf: dto.cpf };
                          const encounterMock = {
                            id: 2,
                            patientId: patientMock.id,
                            adtType: AdtType.A01,
                            admitDate: new Date('1990-01-01'),
                            ward: 'ICU',
                            status: EncounterStatus.ACTIVE, // Ensure the encounter is active
                          };

                          encounterRepositoryMock.findActiveByPatient.mockResolvedValueOnce(encounterMock);
                          encounterRepositoryMock.save.mockResolvedValueOnce({
                            ...encounterMock,
                            status: EncounterStatus.DISCHARGED,
                          });

                          const result = await service.processAdtMessage(dto);

                          expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith(dto.cpf);
                          expect(encounterRepositoryMock.findActiveByPatient).toHaveBeenCalledWith(patientMock.id);
                          expect(encounterRepositoryMock.save).toHaveBeenCalledWith({
                            ...encounterMock,
                            status: EncounterStatus.DISCHARGED,
                          });
                          expect(result).toEqual({ patient: patientMock, encounter: { id: 2 } });
                        });



  it('should throw BadRequestException for A08 with missing fields', async () => {
    const dto: AdtMessageDto = {
      adtType: AdtType.A08,
      cpf: '1234567890',
    };

    await expect(() => service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
  });

  it('should update a patient for A08', async () => {
                            const dto: AdtMessageDto = {
                              adtType: AdtType.A08,
                              cpf: '1234567890',
                              name: 'John Doe',
                              birthDate: new Date('1990-01-01'),
                              sex: Sex.MALE,
                              email: 'john.doe@example.com',
                              phone: '123-456-7890',
                            };

                            const patientMock = {
                              id: 1,
                              cpf: dto.cpf,
                              name: '',
                              birthDate: new Date(),
                              sex: Sex.MALE,
                              email: '',
                              phone: '',
                            };

                            patientServiceMock.updatePatient.mockResolvedValueOnce(patientMock);

                            const result = await service.processAdtMessage(dto);

                            expect(patientServiceMock.findByCpfOrFail).toHaveBeenCalledWith(dto.cpf);
                            expect(patientServiceMock.updatePatient).toHaveBeenCalledWith({
                              ...patientMock,
                              name: dto.name,
                              birthDate: dto.birthDate,
                              sex: dto.sex,
                              email: dto.email,
                              phone: dto.phone,
                            });
                            expect(result).toEqual({ patient: patientMock, encounter: undefined });
                          });



  it('should throw BadRequestException for A08 with no fields to update', async () => {
    const dto: AdtMessageDto = {
      adtType: AdtType.A08,
      cpf: '1234567890',
    };

    await expect(() => service.processAdtMessage(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException for unsupported ADT type', async () => {
                const dto: AdtMessageDto = {
                  adtType: 'UNKNOWN',
                  cpf: '1234567890',
                };

                await expect(() => service.processAdtMessage(dto)).rejects.toThrow(NotFoundException);
              });


});

        // TESTS_APPEND_HERE
        
        
        
        
        
});
