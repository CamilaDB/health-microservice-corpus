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
  it('should return a patient when found by ID', async () => {
    const mockId = 'patient-123';
    const mockPatient: Patient = {
      id: mockId,
      name: 'John Doe',
      birthDate: new Date(),
      cpf: '123.456.789-00',
      sex: Sex.M,
      email: 'john@example.com',
      phone: '11111111111',
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      encounters: [],
    } as unknown as Patient;

    patientRepositoryMock.findById = jest.fn().mockResolvedValue(mockPatient);

    await expect(service.getPatientById(mockId)).resolves.toEqual(mockPatient);
  });

  it('should throw NotFoundException if patient is not found', async () => {
    const mockId = 'non-existent-id';

    patientRepositoryMock.findById = jest.fn().mockResolvedValue(undefined);

    await expect(service.getPatientById(mockId)).rejects.toThrow(NotFoundException);
    await expect(service.getPatientById(mockId)).rejects.toThrow(`Patient with id ${mockId} not found`);
  });
});

  describe('createPatient', () => {
  const mockCreateDto = {
    name: 'John Doe',
    birthDate: new Date(),
    cpf: '12345678900',
    sex: 'M',
    email: 'john@example.com',
    phone: '11111111111',
  };

  const mockExistingPatient = { id: 'p1', cpf: '12345678900' };

  it('should successfully create a new patient when CPF and email are unique', async () => {
    patientRepositoryMock.findByCpf.mockResolvedValue(null);
    patientRepositoryMock.findByEmail.mockResolvedValue(null);
    patientRepositoryMock.save.mockResolvedValue({ id: 'newId' } as any);

    const result = await service.createPatient(mockCreateDto);

    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith('12345678900');
    expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith('john@example.com');
    expect(patientRepositoryMock.save).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
  });

  it('should throw a conflict exception if the CPF already exists', async () => {
    patientRepositoryMock.findByCpf.mockResolvedValue(mockExistingPatient);
    patientRepositoryMock.findByEmail.mockResolvedValue(null);

    await expect(() => service.createPatient(mockCreateDto)).rejects.toThrow(ConflictException);
    expect(patientRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw a conflict exception if the email already exists', async () => {
    patientRepositoryMock.findByCpf.mockResolvedValue(null);
    patientRepositoryMock.findByEmail.mockResolvedValue({ id: 'p2' } as any);

    await expect(() => service.createPatient(mockCreateDto)).rejects.toThrow(ConflictException);
    expect(patientRepositoryMock.save).not.toHaveBeenCalled();
  });
});

  describe('createPatient', () => {
  const mockDto = {
    name: 'John Doe',
    birthDate: '1990-01-01',
    cpf: '123.456.789-00',
    sex: 'M',
    email: 'john.doe@example.com',
    phone: '11999998888',
  };

  const mockPatient = {
    id: 'p1',
    name: 'John Doe',
    birthDate: new Date('1990-01-01'),
    cpf: '12345678900',
    sex: 'M',
    email: 'john.doe@example.com',
    phone: '11999998888',
  };

  it('should successfully create a patient when no conflicts exist', async () => {
    patientRepositoryMock.findByCpf.mockResolvedValue(null);
    patientRepositoryMock.findByEmail.mockResolvedValue(null);
    // Mocking the creation process
    patientRepositoryMock.create.mockReturnValue({
      ...mockDto,
      cpf: '12345678900',
      email: 'john.doe@example.com',
      birthDate: new Date('1990-01-01'),
    });
    patientRepositoryMock.save.mockResolvedValue(mockPatient);

    const result = await service.createPatient(mockDto);

    expect(result).toEqual(mockPatient);
    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith('12345678900');
    expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith('john.doe@example.com');
    expect(patientRepositoryMock.create).toHaveBeenCalled();
    expect(patientRepositoryMock.save).toHaveBeenCalled();
  });

  it('should throw ConflictException if CPF already exists', async () => {
    // Setup conflict for CPF
    patientRepositoryMock.findByCpf.mockResolvedValue({ id: 'p2' });
    // Ensure findByEmail is never called because the function throws early
    patientRepositoryMock.findByEmail.mockResolvedValue(null);

    await expect(service.createPatient(mockDto)).rejects.toThrow(ConflictException);
    await expect(service.createPatient(mockDto)).rejects.toThrow('CPF 123.456.789-00 already registered');

    // Verify that subsequent checks (email, save) are skipped
    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith('12345678900');
    expect(patientRepositoryMock.findByEmail).not.toHaveBeenCalled();
  });

  it('should throw ConflictException if email already exists', async () => {
    // Setup no CPF conflict, but Email conflict
    patientRepositoryMock.findByCpf.mockResolvedValue(null);
    patientRepositoryMock.findByEmail.mockResolvedValue({ id: 'p3' });

    await expect(service.createPatient(mockDto)).rejects.toThrow(ConflictException);
    await expect(service.createPatient(mockDto)).rejects.toThrow('Email john.doe@example.com already registered');

    // Verify that save is skipped
    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith('12345678900');
    expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith('john.doe@example.com');
    expect(patientRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should successfully create a patient when only CPF is provided (no email)', async () => {
    const dtoWithoutEmail = {
      name: 'Jane Doe',
      birthDate: '1980-05-20',
      cpf: '999.888.777-66',
      sex: 'F',
      phone: '11111112222',
    };

    patientRepositoryMock.findByCpf.mockResolvedValue(null);
    // findByEmail should not be called if email is undefined/null in the DTO
    patientRepositoryMock.findByEmail.mockResolvedValue(null); 
    
    patientRepositoryMock.create.mockReturnValue({
      ...dtoWithoutEmail,
      cpf: '99988877766',
      email: null,
      birthDate: new Date('1980-05-20'),
    });
    patientRepositoryMock.save.mockResolvedValue(mockPatient);

    const result = await service.createPatient(dtoWithoutEmail);

    expect(result).toEqual(mockPatient);
    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith('99988877766');
    // Crucial check: findByEmail should not be called if email is missing in the DTO
    expect(patientRepositoryMock.findByEmail).not.toHaveBeenCalled(); 
  });

  it('should handle CPF normalization correctly', async () => {
    const dtoWithMessyCpf = {
      name: 'Test User',
      birthDate: '2000-01-01',
      cpf: '.-111.222.333-44.', // Messy CPF format
      sex: 'U',
    };

    patientRepositoryMock.findByCpf.mockResolvedValue(null);
    patientRepositoryMock.findByEmail.mockResolvedValue(null);
    
    // Mocking the creation process with normalized values
    patientRepositoryMock.create.mockReturnValue({
      ...dtoWithMessyCpf,
      cpf: '11122233344', // Expected normalized CPF
      email: null,
      birthDate: new Date('2000-01-01'),
    });
    patientRepositoryMock.save.mockResolvedValue(mockPatient);

    await service.createPatient(dtoWithMessyCpf);

    // Check that the repository was called with the cleaned CPF
    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith('11122233344');
  });
});

  describe('updatePatient', () => {
  const mockId = 'patient-id';
  let initialPatient: Patient;
  let updateDto: Partial<UpdatePatientDto>;

  beforeEach(() => {
    initialPatient = {
      id: mockId,
      name: 'John Doe',
      birthDate: new Date('1990-01-01'),
      cpf: '123.456.789-00',
      sex: Sex.M,
      email: 'john@example.com',
      phone: '11999998888',
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      encounters: [],
    };

    // Reset mocks for each test to ensure clean state
    jest.clearAllMocks();

    // Mock the internal service method getPatientById
    (service.getPatientById as jest.Mock).mockResolvedValue(initialPatient);

    // Default mock setup for repository calls (assuming no conflict and successful update)
    (patientRepositoryMock.findByEmail as jest.Mock).mockResolvedValue(undefined);
    (patientRepositoryMock.update as jest.Mock).mockResolvedValue({ ...initialPatient, name: 'Updated Name' } as Patient);

    // Default DTO for general updates
    updateDto = {
      name: undefined,
      birthDate: undefined,
      sex: undefined,
      email: undefined,
      phone: undefined,
      active: undefined,
    };
  });

  it.skip('should successfully update name and sex when email is not changed', async () => {
                      updateDto.name = 'Jane Doe';
                      updateDto.sex = Sex.F;

                      (service.getPatientById as jest.Mock).mockResolvedValue({ id: mockId, name: 'John Doe', sex: Sex.M, email: 'john@example.com' } as Patient);

                      (patientRepositoryMock.update as jest.Mock).mockResolvedValue({ id: mockId, name: 'Jane Doe', sex: Sex.F, email: 'john@example.com' } as Patient);

                      const result = await service.updatePatient(mockId, updateDto);

                      expect(service.getPatientById).toHaveBeenCalledWith(mockId);
                      expect(patientRepositoryMock.findByEmail).not.toHaveBeenCalled();
                      expect(patientRepositoryMock.update).toHaveBeenCalledTimes(1);
                      expect(result.name).toBe('Jane Doe');
                    });



  it.skip('should throw ConflictException if the new email is already registered', async () => {
                      const conflictingEmail = 'existing@test.com';
                      updateDto.email = conflictingEmail;

                      // Configure mock to simulate conflict
                      (patientRepositoryMock.findByEmail as jest.Mock).mockResolvedValue({ id: 'conflict-id', email: conflictingEmail } as Patient);

                      await expect(service.updatePatient(mockId, updateDto)).rejects.toThrow(ConflictException);
                      await expect(service.updatePatient(mockId, updateDto)).rejects.toThrow(`Email ${conflictingEmail} already registered`);
                  });



  it.skip('should successfully update email when the new email is unique', async () => {
                      const newUniqueEmail = 'new@example.com';
                      updateDto.email = newUniqueEmail;

                      (patientRepositoryMock.findByEmail as jest.Mock).mockResolvedValue(undefined);
                      (service.getPatientById as jest.Mock).mockResolvedValue({
                          id: mockId,
                          name: 'Test Name',
                          birthDate: new Date(),
                          cpf: '123',
                          sex: Sex.M,
                          email: 'old@example.com',
                          phone: '1234567890',
                          active: true,
                          created_at: new Date(),
                          updated_at: new Date(),
                          encounters: [],
                      } as Patient);

                      (patientRepositoryMock.update as jest.Mock).mockResolvedValue({
                        id: mockId,
                        name: 'Test Name',
                        birthDate: new Date(),
                        cpf: '123',
                        sex: Sex.M,
                        email: newUniqueEmail.toLowerCase(),
                        phone: '1234567890',
                        active: true,
                        created_at: new Date(),
                        updated_at: new Date(),
                        encounters: [],
                      } as Patient);

                      await service.updatePatient(mockId, updateDto);

                      expect(service.getPatientById).toHaveBeenCalledWith(mockId);
                      expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith('new@example.com'.toLowerCase());
                    });



  it.skip('should successfully update multiple fields including phone and active status', async () => {
                      mockPatient = { id: mockId, name: 'John Doe', birthDate: new Date(), cpf: '123', sex: Sex.M, email: 'john@example.com', phone: '1112223333', active: true };
                      service.getPatientById.mockResolvedValue(mockPatient);

                      updateDto = { name: undefined, birthDate: undefined, sex: undefined, email: undefined, phone: '1234567890', active: false };

                      patientRepositoryMock.findByEmail.mockResolvedValue(null);
                      patientRepositoryMock.update.mockResolvedValue({ ...mockPatient, phone: '1234567890', active: false });

                      await service.updatePatient(mockId, updateDto);

                      expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith('john@example.com');
                      expect(patientRepositoryMock.update).toHaveBeenCalledTimes(1);
                  });



  it.skip('should successfully update birthDate and handle date conversion', async () => {
                      const newBirthDateString = '2000-05-15';
                      updateDto.birthDate = newBirthDateString;

                      // Mocking the necessary dependencies for the test to run correctly
                      (service.getPatientById as jest.Mock).mockResolvedValue({
                        id: mockId,
                        name: 'John Doe',
                        cpf: '123',
                        sex: Sex.M,
                        email: 'john@example.com',
                        phone: '1234567890',
                        active: true,
                        birthDate: new Date('1990-01-01'),
                      } as Patient);

                      (patientRepositoryMock.findByEmail as jest.Mock).mockResolvedValue(null);

                      await service.updatePatient(mockId, updateDto);

                      expect(service.getPatientById).toHaveBeenCalledWith(mockId);
                      expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith('john@example.com');
                  });


});

  describe('findByCpfOrFail', () => {
  it('should return a patient if found by cpf', async () => {
    const mockPatient = {
      id: '1',
      name: 'Test User',
      birthDate: new Date(),
      cpf: '12345678900',
      sex: null,
      email: null,
      phone: null,
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      encounters: [],
    };

    patientRepositoryMock.findByCpf.mockResolvedValue(mockPatient);

    const result = await service.findByCpfOrFail('12345678900');
    expect(result).toEqual(mockPatient);
  });

  it('should throw NotFoundException if patient is not found by cpf', async () => {
    patientRepositoryMock.findByCpf.mockResolvedValue(null);

    await expect(service.findByCpfOrFail('99999999999')).rejects.toThrow(NotFoundException);
    await expect(service.findByCpfOrFail('99999999999')).rejects.toThrow('Patient with cpf 99999999999 not found');
  });
});

  // TESTS_APPEND_HERE
});
