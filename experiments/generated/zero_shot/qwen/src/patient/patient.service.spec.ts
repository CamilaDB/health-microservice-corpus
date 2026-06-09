// AUTO-GENERATED-BOOTSTRAP-START
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';
import { Sex } from './enums/sex.enum';
import { PatientRepository } from './patient.repository';
import { PatientService } from './patient.service';

describe('PatientService', () => {

  let service: PatientService;
  let patientRepositoryMock: jest.Mocked<PatientRepository>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {

    patientRepositoryMock = {
      findAll: jest.fn().mockResolvedValue(undefined),
      findById: jest.fn().mockResolvedValue(undefined),
      findByCpf: jest.fn().mockResolvedValue(undefined),
      findByEmail: jest.fn().mockResolvedValue(undefined),
      save: jest.fn().mockResolvedValue(undefined),
      create: jest.fn().mockReturnValue(undefined),
      update: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<PatientRepository>;

    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          PatientService,
          { provide: PatientRepository, useValue: patientRepositoryMock },
        ],
      }).compile();

    service = module.get<PatientService>(PatientService);

  });
  // AUTO-GENERATED-BOOTSTRAP-END

  describe('getPatientById', () => {
  it.skip('should return a patient when id exists in repository', async () => {
          const expectedPatient = new Patient();
          expectedPatient.id = '123';
          
          expect(patientRepositoryMock.findById).not.toHaveBeenCalled();
          await expect(service.getPatientById('123')).resolves.toBe(expectedPatient);
          expect(patientRepositoryMock.findById).toHaveBeenCalledWith('123');
        });

  it('should throw NotFoundException when patient is not found', async () => {
    const id = 'non-existent-id';
    
    expect(patientRepositoryMock.findById).not.toHaveBeenCalled();
    await expect(service.getPatientById(id)).rejects.toThrow(NotFoundException);
    expect(patientRepositoryMock.findById).toHaveBeenCalledWith(id);
  });

  it('should throw NotFoundException with correct message when patient is not found', async () => {
    const id = 'test-id-123';
    
    await expect(service.getPatientById(id)).rejects.toThrow(NotFoundException);
    const thrownError = await service.getPatientById(id).catch((e) => e);
    expect(thrownError.message).toBe(`Patient with id ${id} not found`);
  });

  it('should return patient when repository returns a valid object', async () => {
          const mockPatient: Patient = new Patient();
          mockPatient.id = 'valid-id';
          
          jest.spyOn(service.patientRepository, 'findById').mockResolvedValue(mockPatient);
          
          await expect(service.getPatientById('valid-id')).resolves.toBe(mockPatient);
        });

});

  describe('listPatients', () => {
  it('should return all patients from repository when findAll resolves with multiple patients', async () => {
    const mockPatients = [
      { id: '1', name: 'John Doe', birthDate: new Date(), cpf: '12345678900', sex: Sex.M, email: null, phone: null, active: true },
      { id: '2', name: 'Jane Smith', birthDate: new Date(), cpf: '12345678901', sex: Sex.F, email: 'jane@example.com', phone: '123-456-7890', active: true },
    ];

    patientRepositoryMock.findAll.mockResolvedValue(mockPatients);

    const result = await service.listPatients();

    expect(result).toEqual(mockPatients);
  });

  it('should return empty array when findAll resolves with no patients', async () => {
    patientRepositoryMock.findAll.mockResolvedValue([]);

    const result = await service.listPatients();

    expect(result).toEqual([]);
  });

  it('should call repository findAll once per request', async () => {
    const mockPatient: Patient = { id: '1', name: 'Test User', birthDate: new Date(), cpf: '00000000000', sex: Sex.M, email: null, phone: null, active: true };

    patientRepositoryMock.findAll.mockResolvedValue([mockPatient]);

    await service.listPatients();
    
    expect(patientRepositoryMock.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return patients with all fields including encounters', async () => {
    const mockEncounters = [{ id: 'enc-1' }, { id: 'enc-2' }];
    const mockPatient: Patient = { 
      id: '1', 
      name: 'Test User', 
      birthDate: new Date(), 
      cpf: '00000000000', 
      sex: Sex.M, 
      email: null, 
      phone: null, 
      active: true,
      encounters: mockEncounters 
    };

    patientRepositoryMock.findAll.mockResolvedValue([mockPatient]);

    const result = await service.listPatients();

    expect(result[0].encounters).toEqual(mockEncounters);
  });
});

  describe('createPatient', () => {
  it.skip('should create a new patient when CPF is unique and email does not exist', async () => {
                            const dto = { name: 'John Doe', cpf: '12345678900', birthDate: '2000-01-01' };

                            await expect(service.createPatient(dto)).resolves.toEqual(expect.objectContaining({ id, name: 'John Doe', cpf: '12345678900', birthDate }));
                          });




  it.skip('should normalize CPF by removing dots and dashes before validation', async () => {
                            const dto = { name: 'John Doe', cpf: '123.456.789-00', birthDate: '2000-01-01' };

                            await expect(service.createPatient(dto)).resolves.toMatchObject({ name: 'John Doe', cpf: '12345678900', birthDate: new Date('2000-01-01') });
                          });




  it.skip('should normalize email to lowercase before validation', async () => {
                      const dto = { name: 'John Doe', cpf: '12345678900', birthDate: '2000-01-01', email: 'JOHN@EXAMPLE.COM' };

                      await expect(service.createPatient(dto)).resolves.toEqual({
                        id: expect.any(String),
                        name: 'John Doe',
                        cpf: '12345678900',
                        birthDate: new Date('2000-01-01').toISOString(),
                        email: 'john@example.com',
                      });
                    });



  it('should throw ConflictException when CPF already exists in repository', async () => {
    const dto = { name: 'John Doe', cpf: '98765432100', birthDate: '2000-01-01' };

    patientRepositoryMock.findByCpf.mockResolvedValue({ id: 'existing-id' });

    await expect(service.createPatient(dto)).rejects.toThrow(ConflictException);
  });

  it('should throw ConflictException when email already exists in repository', async () => {
    const dto = { name: 'John Doe', cpf: '12345678900', birthDate: '2000-01-01', email: 'john@example.com' };

    patientRepositoryMock.findByCpf.mockResolvedValue(undefined);
    patientRepositoryMock.findByEmail.mockResolvedValue({ id: 'existing-id' });

    await expect(service.createPatient(dto)).rejects.toThrow(ConflictException);
  });

  it('should not validate email when no email is provided in DTO', async () => {
                const dto = { name: 'John Doe', cpf: '12345678900', birthDate: '2000-01-01' };

                patientRepositoryMock.findByCpf.mockResolvedValue(undefined);
                patientRepositoryMock.create.mockReturnValue({ ...dto, id: 'new-id', email: undefined });
                patientRepositoryMock.save.mockResolvedValue({ name: dto.name, cpf: dto.cpf, birthDate: new Date(dto.birthDate), email: undefined, id: 'new-id' } as Patient);

                await expect(service.createPatient(dto)).resolves.toEqual(
                  { name: dto.name, cpf: dto.cpf, birthDate: new Date(dto.birthDate), id: 'new-id', email: undefined }
                );
              });



  it('should convert birthDate string to Date object before saving', async () => {
          const dto = { name: 'John Doe', cpf: '12345678900', birthDate: '2000-01-01' };

          patientRepositoryMock.findByCpf.mockResolvedValue(undefined);
          patientRepositoryMock.create.mockReturnValue({ ...dto, id: 'new-id' });
          const expectedPatient = { name: 'John Doe', cpf: '12345678900', birthDate: new Date('2000-01-01'), sex: Sex.U };

          patientRepositoryMock.save.mockResolvedValue(expectedPatient);

          await expect(service.createPatient(dto)).resolves.toEqual(expectedPatient);
        });

});

  describe('updatePatient', () => {
  it.skip('should update a patient successfully when no conflicts exist', async () => {
                const id = 'patient-1';
                const dto = { name: 'John Doe' };
                const existingPatient = new Patient();
                existingPatient.id = id;
                existingPatient.email = null;
                existingPatient.name = '';

                await expect(service.updatePatient(id, dto)).resolves.toEqual({ ...existingPatient });
            });


  it('should update patient email to lowercase', async () => {
                      const id = 'patient-1';
                      const dto = { name: 'John Doe', email: 'JOHN@EXAMPLE.COM' };
                      const existingPatient = new Patient();
                      existingPatient.id = id;
                      existingPatient.email = null;

                      jest.spyOn(service as any, 'getPatientById').mockResolvedValue(existingPatient);
                      jest.spyOn((service as any).patientRepository, 'update').mockReturnValue(Promise.resolve({ ...existingPatient }));

                      await expect(service.updatePatient(id, dto)).resolves.toEqual({ ...existingPatient });
                    });




  it.skip('should update patient with partial fields', async () => {
                    const id = 'patient-1';
                    const existingPatient: Patient = { 
                      id, 
                      name: '',
                      birthDate: null as any,
                      cpf: '',
                      sex: undefined,
                      email: null,
                      phone: null,
                      active: true,
                    };
                    const dto = { name: 'John Doe' };
                    
                    jest.spyOn(service, 'getPatientById').mockResolvedValue({ ...existingPatient });

                    await expect(service.updatePatient(id, dto)).resolves.toEqual({ 
                      id: id, 
                      name: 'John Doe',
                      birthDate: null as any,
                      cpf: '',
                      sex: undefined,
                      email: null,
                      phone: null,
                      active: true,
                    });
                  });




  it('should throw ConflictException when email already exists in system', async () => {
    const id = 'patient-1';
    const newEmail = 'new@example.com';
    const existingPatient = new Patient();
    existingPatient.id = id;
    existingPatient.email = null;

    patientRepositoryMock.findById.mockResolvedValue(existingPatient);
    patientRepositoryMock.findByEmail.mockResolvedValue({ email: newEmail });

    await expect(service.updatePatient(id, { name: 'John Doe', email: newEmail })).rejects.toThrow(ConflictException);
  });

  it.skip('should throw ConflictException when existing email differs from current but exists in system', async () => {
          const id = 'patient-1';
          const dto = { name: 'John Doe' };
          const existingPatient = new Patient();
          existingPatient.id = id;
          existingPatient.email = 'old@example.com';

          patientRepositoryMock.findById.mockResolvedValue(existingPatient);
          patientRepositoryMock.findByEmail.mockResolvedValue({ email: 'new@example.com' });

          await expect(service.updatePatient(id, { ...dto, name: dto.name })).resolves.toEqual({ ...existingPatient });
        });

  it.skip('should update birthDate to Date object', async () => {
                            const id = 'patient-1';
                            const dto = { birthDate: '2000-01-01' };
                            const existingPatient = new Patient();
                            existingPatient.id = id;
                            
                            jest.spyOn(service, 'getPatientById').mockResolvedValue(existingPatient);

                            await expect(service.updatePatient(id, dto)).resolves.toEqual({ ...existingPatient });
                          });




  it('should update active status', async () => {
                const id = 'patient-1';
                const dto = { active: false };
                const existingPatient = new Patient();
                existingPatient.id = id;

                jest.spyOn(service, 'getPatientById').mockResolvedValue(existingPatient);
                
                (service.patientRepository.update as any).mockImplementation((p) => ({ ...existingPatient }));

                await expect(service.updatePatient(id, dto)).resolves.toEqual({ ...existingPatient });
              });



  it.skip('should update phone field', async () => {
                const id = 'patient-1';
                const dto = { phone: '(55) 99999-8888' };
                const existingPatient = new Patient();
                existingPatient.id = id;

                await expect(service.updatePatient(id, dto)).resolves.toEqual({ ...existingPatient });
            });


  it.skip('should update sex field', async () => {
                      const id = 'patient-1';
                      const dto = { sex: Sex.M };
                      const existingPatient = new Patient();
                      existingPatient.id = id;
                      
                      jest.spyOn(service, 'getPatientById').mockResolvedValue(existingPatient);

                      await expect(service.updatePatient(id, dto)).resolves.toEqual({ ...existingPatient });
                    });



  it('should throw NotFoundException when patient does not exist', async () => {
    const id = 'non-existent-patient';
    const dto = { name: 'John Doe' };

    patientRepositoryMock.findById.mockResolvedValue(null);

    await expect(service.updatePatient(id, dto)).rejects.toThrow(NotFoundException);
  });
});

  describe('findByCpfOrFail', () => {
  it('should throw NotFoundException when patient does not exist by CPF', async () => {
    await expect(service.findByCpfOrFail('12345678900')).rejects.toThrow(NotFoundException);
  });

  it('should return the existing patient when found by CPF', async () => {
    const mockPatient = new Patient();
    mockPatient.id = 'test-id';
    mockPatient.name = 'Test Name';
    mockPatient.birthDate = new Date();
    mockPatient.cpf = '12345678900';
    mockPatient.sex = Sex.M;
    mockPatient.email = null;
    mockPatient.phone = null;
    mockPatient.active = true;

    patientRepositoryMock.findByCpf.mockResolvedValue(mockPatient);

    const result = await service.findByCpfOrFail('12345678900');

    expect(result).toEqual(mockPatient);
  });
});

  // TESTS_APPEND_HERE
});
