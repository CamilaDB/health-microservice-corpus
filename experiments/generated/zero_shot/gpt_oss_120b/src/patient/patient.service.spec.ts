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
  it('should return patient when found', async () => {
    const mockPatient: Patient = {
      id: '123',
      name: 'John Doe',
      birthDate: new Date('1990-01-01'),
      cpf: '12345678901',
      sex: Sex.M,
      email: 'john@example.com',
      phone: '555-1234',
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      encounters: [],
    };
    patientRepositoryMock.findById.mockResolvedValueOnce(mockPatient);
    const result = await service.getPatientById('123');
    expect(result).toBe(mockPatient);
    expect(patientRepositoryMock.findById).toHaveBeenCalledWith('123');
  });

  it('should throw NotFoundException when patient does not exist', async () => {
    patientRepositoryMock.findById.mockResolvedValueOnce(undefined);
    await expect(service.getPatientById('nonexistent')).rejects.toThrow(NotFoundException);
    expect(patientRepositoryMock.findById).toHaveBeenCalledWith('nonexistent');
  });
});

  describe('listPatients', () => {
  it('should return patients from repository', async () => {
    const patients = [
      {
        id: '1',
        name: 'John Doe',
        birthDate: new Date('1990-01-01'),
        cpf: '12345678901',
        sex: Sex.M,
        email: 'john@example.com',
        phone: '555-1234',
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
        encounters: [],
      },
    ];
    patientRepositoryMock.findAll.mockResolvedValue(patients);
    await expect(service.listPatients()).resolves.toEqual(patients);
    expect(patientRepositoryMock.findAll).toHaveBeenCalledTimes(1);
  });
});

  describe('createPatient', () => {
  it('throws ConflictException when CPF already exists', async () => {
    const dto: CreatePatientDto = {
      name: 'John Doe',
      birthDate: '1990-01-01',
      cpf: '123.456.789-00',
      sex: Sex.M,
    };
    patientRepositoryMock.findByCpf.mockResolvedValue({} as Patient);
    await expect(service.createPatient(dto)).rejects.toThrow(ConflictException);
    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith('12345678900');
  });

  it('throws ConflictException when email already exists', async () => {
    const dto: CreatePatientDto = {
      name: 'Jane Doe',
      birthDate: '1992-02-02',
      cpf: '987.654.321-00',
      sex: Sex.F,
      email: 'EXAMPLE@DOMAIN.COM',
    };
    patientRepositoryMock.findByCpf.mockResolvedValue(undefined);
    patientRepositoryMock.findByEmail.mockResolvedValue({} as Patient);
    await expect(service.createPatient(dto)).rejects.toThrow(ConflictException);
    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith('98765432100');
    expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith('example@domain.com');
  });

  it('creates and saves patient when data is valid', async () => {
    const dto: CreatePatientDto = {
      name: 'Alice',
      birthDate: '2000-03-03',
      cpf: '111.222.333-44',
      sex: Sex.F,
      email: 'alice@example.com',
    };
    const createdPatient = {} as Patient;
    const savedPatient = { id: '1' } as Patient;
    patientRepositoryMock.findByCpf.mockResolvedValue(undefined);
    patientRepositoryMock.findByEmail.mockResolvedValue(undefined);
    patientRepositoryMock.create.mockReturnValue(createdPatient);
    patientRepositoryMock.save.mockResolvedValue(savedPatient);
    const result = await service.createPatient(dto);
    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith('11122233344');
    expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith('alice@example.com');
    expect(patientRepositoryMock.create).toHaveBeenCalledWith({
      ...dto,
      cpf: '11122233344',
      email: 'alice@example.com',
      birthDate: new Date('2000-03-03'),
    });
    expect(patientRepositoryMock.save).toHaveBeenCalledWith(createdPatient);
    expect(result).toBe(savedPatient);
  });
});

  describe('updatePatient', () => {
  it('throws ConflictException when new email is already registered', async () => {
    const existingPatient = {
      id: '1',
      email: 'old@example.com',
    } as any;
    const dto = { email: 'new@example.com' } as any;
    jest.spyOn(service as any, 'getPatientById').mockResolvedValue(existingPatient);
    patientRepositoryMock.findByEmail.mockResolvedValue({ id: '2' } as any);
    await expect(service.updatePatient('1', dto)).rejects.toThrow(ConflictException);
    expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith('new@example.com');
  });

  it('updates patient with transformed fields when email is changed and not taken', async () => {
    const existingPatient = {
      id: '1',
      email: 'old@example.com',
    } as any;
    const dto = {
      name: 'John Doe',
      email: 'NEW@EXAMPLE.COM',
      birthDate: '2000-01-01',
      sex: undefined,
      phone: '123456',
      active: true,
    } as any;
    jest.spyOn(service as any, 'getPatientById').mockResolvedValue(existingPatient);
    patientRepositoryMock.findByEmail.mockResolvedValue(undefined);
    patientRepositoryMock.update.mockResolvedValue({ ...existingPatient, ...dto } as any);
    const result = await service.updatePatient('1', dto);
    expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith('new@example.com');
    expect(patientRepositoryMock.update).toHaveBeenCalledWith(existingPatient, {
      name: 'John Doe',
      email: 'new@example.com',
      birthDate: new Date('2000-01-01'),
      phone: '123456',
      active: true,
    });
    expect(result).toBeDefined();
  });

  it('updates patient without email check when email not provided', async () => {
    const existingPatient = {
      id: '1',
      email: 'old@example.com',
    } as any;
    const dto = {
      name: 'Jane',
      active: false,
    } as any;
    jest.spyOn(service as any, 'getPatientById').mockResolvedValue(existingPatient);
    patientRepositoryMock.update.mockResolvedValue({ ...existingPatient, ...dto } as any);
    const result = await service.updatePatient('1', dto);
    expect(patientRepositoryMock.findByEmail).not.toHaveBeenCalled();
    expect(patientRepositoryMock.update).toHaveBeenCalledWith(existingPatient, {
      name: 'Jane',
      active: false,
    });
    expect(result).toBeDefined();
  });
});

  describe('findByCpfOrFail', () => {
  it('should return patient when found by cpf', async () => {
    const cpf = '12345678901';
    const expectedPatient: Patient = {
      id: '1',
      name: 'John Doe',
      birthDate: new Date('1990-01-01'),
      cpf,
      sex: Sex.M,
      email: null,
      phone: null,
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      encounters: [],
    };
    patientRepositoryMock.findByCpf.mockResolvedValue(expectedPatient);
    const result = await service.findByCpfOrFail(cpf);
    expect(result).toBe(expectedPatient);
    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith(cpf);
  });

  it('should throw NotFoundException when patient not found', async () => {
    const cpf = '98765432100';
    patientRepositoryMock.findByCpf.mockResolvedValue(undefined);
    await expect(service.findByCpfOrFail(cpf)).rejects.toThrow(NotFoundException);
    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith(cpf);
  });
});

  // TESTS_APPEND_HERE
});
