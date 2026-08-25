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

  describe('FN_getPatientById_END', () => {
describe('getPatientById', () => {
  it('should throw NotFoundException when patient does not exist', async () => {
    const id = 'nonexistent-id';
    patientRepositoryMock.findById.mockResolvedValueOnce(undefined);
    await expect(service.getPatientById(id)).rejects.toThrow(NotFoundException);
  });
});
});

  describe('FN_listPatients_END', () => {
describe('listPatients', () => {
  it('should return all patients', async () => {
    const patients: Patient[] = [
      {
        id: '1',
        name: 'John Doe',
        birthDate: new Date('1990-01-01'),
        cpf: '12345678901',
        sex: Sex.M,
        email: 'john@example.com',
        phone: '123456789',
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
        encounters: [],
      },
    ];
    patientRepositoryMock.findAll.mockResolvedValueOnce(patients);
    const result = await service.listPatients();
    expect(result).toBe(patients);
    expect(patientRepositoryMock.findAll).toHaveBeenCalledTimes(1);
  });
});
});

  describe('FN_createPatient_END', () => {
describe('createPatient', () => {
  it('should throw ConflictException when CPF already registered', async () => {
    const dto: CreatePatientDto = {
      name: 'John Doe',
      birthDate: '1990-01-01',
      cpf: '123.456.789-00',
      sex: Sex.M,
    };
    const existing = {} as Patient;
    patientRepositoryMock.findByCpf.mockResolvedValueOnce(existing);
    await expect(service.createPatient(dto)).rejects.toThrow(ConflictException);
  });

  it('should throw ConflictException when Email already registered', async () => {
    const dto: CreatePatientDto = {
      name: 'Jane Doe',
      birthDate: '1992-02-02',
      cpf: '987.654.321-00',
      sex: Sex.F,
      email: 'EXAMPLE@DOMAIN.COM',
    };
    patientRepositoryMock.findByCpf.mockResolvedValueOnce(undefined);
    const existingEmail = {} as Patient;
    patientRepositoryMock.findByEmail.mockResolvedValueOnce(existingEmail);
    await expect(service.createPatient(dto)).rejects.toThrow(ConflictException);
  });

  it('should create and return patient when data is valid', async () => {
    const dto: CreatePatientDto = {
      name: 'Alice Smith',
      birthDate: '1985-05-15',
      cpf: '111.222.333-44',
      sex: Sex.F,
      email: 'Alice@example.com',
      phone: '555-1234',
    };
    patientRepositoryMock.findByCpf.mockResolvedValueOnce(undefined);
    patientRepositoryMock.findByEmail.mockResolvedValueOnce(undefined);
    const createdPatient = {} as Patient;
    patientRepositoryMock.create.mockReturnValueOnce(createdPatient);
    const savedPatient = { id: '1', ...createdPatient } as Patient;
    patientRepositoryMock.save.mockResolvedValueOnce(savedPatient);
    const result = await service.createPatient(dto);
    expect(result).toBe(savedPatient);
    expect(patientRepositoryMock.create).toHaveBeenCalledWith({
      ...dto,
      cpf: '11122233344',
      email: 'alice@example.com',
      birthDate: new Date('1985-05-15'),
    });
    expect(patientRepositoryMock.save).toHaveBeenCalledWith(createdPatient);
  });
});
});

  describe('FN_updatePatient_END', () => {
describe('updatePatient', () => {
  it('should throw ConflictException when email already registered', async () => {
    const patient = {
      id: '1',
      email: 'old@example.com',
      name: 'John',
      sex: Sex.M,
      phone: null,
      active: true,
      birthDate: new Date('1990-01-01'),
      cpf: '12345678900',
      created_at: new Date(),
      updated_at: new Date(),
      encounters: [],
    } as Patient;

    const dto = { email: 'New@example.com' } as UpdatePatientDto;

    jest.spyOn(service, 'getPatientById').mockResolvedValueOnce(patient);
    patientRepositoryMock.findByEmail.mockResolvedValueOnce(patient);

    await expect(service.updatePatient('1', dto)).rejects.toThrow(ConflictException);
    expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith('new@example.com');
    expect(patientRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should update patient when email not registered', async () => {
    const patient = {
      id: '1',
      email: 'old@example.com',
      name: 'John',
      sex: Sex.M,
      phone: null,
      active: true,
      birthDate: new Date('1990-01-01'),
      cpf: '12345678900',
      created_at: new Date(),
      updated_at: new Date(),
      encounters: [],
    } as Patient;

    const dto = { email: 'New@example.com', name: 'Jane', active: false } as UpdatePatientDto;

    const updatedPatient = {
      ...patient,
      email: 'new@example.com',
      name: 'Jane',
      active: false,
    } as Patient;

    jest.spyOn(service, 'getPatientById').mockResolvedValueOnce(patient);
    patientRepositoryMock.findByEmail.mockResolvedValueOnce(null);
    patientRepositoryMock.update.mockResolvedValueOnce(updatedPatient);

    const result = await service.updatePatient('1', dto);

    expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith('new@example.com');
    expect(patientRepositoryMock.update).toHaveBeenCalledWith(patient, {
      name: 'Jane',
      active: false,
      email: 'new@example.com',
    });
    expect(result).toBe(updatedPatient);
  });
});
});

  describe('FN_findByCpfOrFail_END', () => {
describe('findByCpfOrFail', () => {
  it('should return patient when found', async () => {
    const cpf = '12345678900';
    const patient: Patient = {
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
    patientRepositoryMock.findByCpf.mockResolvedValueOnce(patient);
    const result = await service.findByCpfOrFail(cpf);
    expect(result).toEqual(patient);
    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith(cpf);
  });

  it('should throw NotFoundException when patient does not exist', async () => {
    const cpf = '98765432100';
    patientRepositoryMock.findByCpf.mockResolvedValueOnce(undefined);
    await expect(service.findByCpfOrFail(cpf)).rejects.toThrow(NotFoundException);
    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith(cpf);
  });
});
});

  // TESTS_APPEND_HERE
});
