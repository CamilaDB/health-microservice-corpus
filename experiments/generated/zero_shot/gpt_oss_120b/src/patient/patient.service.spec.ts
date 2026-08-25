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
  it('should return patient when found', async () => {
    const patient: Patient = {
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
    patientRepositoryMock.findById.mockResolvedValue(patient);
    await expect(service.getPatientById('123')).resolves.toEqual(patient);
    expect(patientRepositoryMock.findById).toHaveBeenCalledWith('123');
  });

  it('should throw NotFoundException when patient does not exist', async () => {
    patientRepositoryMock.findById.mockResolvedValue(undefined);
    await expect(service.getPatientById('nonexistent')).rejects.toBeInstanceOf(NotFoundException);
    expect(patientRepositoryMock.findById).toHaveBeenCalledWith('nonexistent');
  });
});
});

  describe('FN_listPatients_END', () => {
describe('listPatients', () => {
  it('should return an array of patients when repository provides data', async () => {
    const patients: Patient[] = [
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
      {
        id: '2',
        name: 'Jane Smith',
        birthDate: new Date('1985-05-15'),
        cpf: '10987654321',
        sex: Sex.F,
        email: null,
        phone: null,
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
        encounters: [],
      },
    ];
    patientRepositoryMock.findAll.mockResolvedValue(patients);
    const result = await service.listPatients();
    expect(result).toEqual(patients);
    expect(patientRepositoryMock.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return an empty array when repository has no patients', async () => {
    patientRepositoryMock.findAll.mockResolvedValue([]);
    const result = await service.listPatients();
    expect(result).toEqual([]);
    expect(patientRepositoryMock.findAll).toHaveBeenCalledTimes(1);
  });
});
});

  describe('FN_createPatient_END', () => {
describe('createPatient', () => {
  it('should create and return a patient when CPF and email are unique', async () => {
    const dto: CreatePatientDto = {
      name: 'John Doe',
      birthDate: '1990-01-01',
      cpf: '12345678901',
      sex: Sex.M,
      email: 'john@example.com',
      phone: '555-1234',
    };

    patientRepositoryMock.findByCpf.mockResolvedValue(undefined);
    patientRepositoryMock.findByEmail.mockResolvedValue(undefined);

    const createdPatient = {
      id: 'uuid-1',
      ...dto,
      birthDate: new Date(dto.birthDate),
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      encounters: [],
    } as Patient;

    patientRepositoryMock.create.mockReturnValue(createdPatient);
    patientRepositoryMock.save.mockResolvedValue(createdPatient);

    const result = await service.createPatient(dto);

    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith(dto.cpf);
    expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith(dto.email);
    expect(patientRepositoryMock.create).toHaveBeenCalledWith({
      ...dto,
      birthDate: new Date(dto.birthDate),
    });
    expect(patientRepositoryMock.save).toHaveBeenCalledWith(createdPatient);
    expect(result).toBe(createdPatient);
  });

  it('should throw ConflictException when a patient with the same CPF already exists', async () => {
    const dto: CreatePatientDto = {
      name: 'Jane Doe',
      birthDate: '1985-05-05',
      cpf: '98765432100',
      sex: Sex.F,
      email: 'jane@example.com',
      phone: '555-5678',
    };

    const existingPatient = { id: 'uuid-2' } as Patient;
    patientRepositoryMock.findByCpf.mockResolvedValue(existingPatient);
    patientRepositoryMock.findByEmail.mockResolvedValue(undefined);

    await expect(service.createPatient(dto)).rejects.toBeInstanceOf(ConflictException);
    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith(dto.cpf);
    expect(patientRepositoryMock.findByEmail).not.toHaveBeenCalled();
    expect(patientRepositoryMock.create).not.toHaveBeenCalled();
    expect(patientRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw ConflictException when a patient with the same email already exists', async () => {
    const dto: CreatePatientDto = {
      name: 'Alice Smith',
      birthDate: '1970-12-12',
      cpf: '11122233344',
      sex: Sex.U,
      email: 'alice@example.com',
      phone: '555-9999',
    };

    patientRepositoryMock.findByCpf.mockResolvedValue(undefined);
    const existingPatient = { id: 'uuid-3' } as Patient;
    patientRepositoryMock.findByEmail.mockResolvedValue(existingPatient);

    await expect(service.createPatient(dto)).rejects.toBeInstanceOf(ConflictException);
    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith(dto.cpf);
    expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith(dto.email);
    expect(patientRepositoryMock.create).not.toHaveBeenCalled();
    expect(patientRepositoryMock.save).not.toHaveBeenCalled();
  });
});
});

  describe('FN_updatePatient_END', () => {
describe('updatePatient', () => {
  const existingPatient: Patient = {
    id: 'patient-1',
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

  it('should throw NotFoundException when patient does not exist', async () => {
    patientRepositoryMock.findById.mockResolvedValue(undefined);
    const dto: UpdatePatientDto = { name: 'New Name' };
    await expect(service.updatePatient('non-existent-id', dto)).rejects.toBeInstanceOf(NotFoundException);
    expect(patientRepositoryMock.findById).toHaveBeenCalledWith('non-existent-id');
    expect(patientRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should throw ConflictException when new email is already used by another patient', async () => {
    patientRepositoryMock.findById.mockResolvedValue(existingPatient);
    const otherPatient: Patient = { ...existingPatient, id: 'patient-2', email: 'conflict@example.com' };
    patientRepositoryMock.findByEmail.mockResolvedValue(otherPatient);
    const dto: UpdatePatientDto = { email: 'conflict@example.com' };
    await expect(service.updatePatient(existingPatient.id, dto)).rejects.toBeInstanceOf(ConflictException);
    expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith('conflict@example.com');
    expect(patientRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should update patient when data is valid and email is unchanged', async () => {
      patientRepositoryMock.findById.mockResolvedValue(existingPatient);
      patientRepositoryMock.findByEmail.mockResolvedValue(undefined);
      patientRepositoryMock.update.mockResolvedValue(undefined);
      const dto: UpdatePatientDto = { name: 'Jane Doe', sex: Sex.F };
      await service.updatePatient(existingPatient.id, dto);
      expect(patientRepositoryMock.update).toHaveBeenCalledWith(
        existingPatient,
        expect.objectContaining({
          name: 'Jane Doe',
          sex: Sex.F,
        }),
      );
    });

});
});

  describe('FN_findByCpfOrFail_END', () => {
describe('findByCpfOrFail', () => {
  it('should return the patient when found by CPF', async () => {
    const cpf = '12345678900';
    const patient: Patient = {
      id: 'patient-id',
      name: 'Alice',
      birthDate: new Date('1990-01-01'),
      cpf,
      sex: Sex.F,
      email: null,
      phone: null,
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      encounters: [],
    };
    patientRepositoryMock.findByCpf.mockResolvedValue(patient);
    await expect(service.findByCpfOrFail(cpf)).resolves.toBe(patient);
    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith(cpf);
  });

  it('should throw NotFoundException when patient is not found', async () => {
    const cpf = '98765432100';
    patientRepositoryMock.findByCpf.mockResolvedValue(undefined);
    await expect(service.findByCpfOrFail(cpf)).rejects.toBeInstanceOf(NotFoundException);
    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith(cpf);
  });
});
});

  // TESTS_APPEND_HERE
});
