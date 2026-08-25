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
    patientRepositoryMock.findById.mockResolvedValueOnce(null);
    await expect(service.getPatientById('1')).rejects.toThrow(NotFoundException);
  });

  it('should return the patient when found', async () => {
    const patient = {
      id: '1',
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
    };
    patientRepositoryMock.findById.mockResolvedValueOnce(patient);
    const result = await service.getPatientById('1');
    expect(result).toBe(patient);
  });
});
});

  describe('FN_listPatients_END', () => {
describe('listPatients', () => {
  it('should return an empty array when no patients are found', async () => {
    patientRepositoryMock.findAll.mockResolvedValueOnce([]);

    const result = await service.listPatients();

    expect(result).toEqual([]);
    expect(patientRepositoryMock.findAll).toHaveBeenCalled();
  });

  it('should return an array of patients', async () => {
    const patients = [
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
    expect(patientRepositoryMock.findAll).toHaveBeenCalled();
  });
});
});

  describe('FN_createPatient_END', () => {
describe('createPatient', () => {
  it('should throw ConflictException when a patient with the same CPF already exists', async () => {
    patientRepositoryMock.findByCpf.mockResolvedValueOnce({ id: '1', cpf: '12345678900' } as Patient);
    patientRepositoryMock.findByEmail.mockResolvedValueOnce(null);

    const dto = {
      name: 'John Doe',
      birthDate: '1990-01-01',
      cpf: '12345678900',
      sex: Sex.M,
    } as CreatePatientDto;

    await expect(service.createPatient(dto)).rejects.toThrow(ConflictException);

    expect(patientRepositoryMock.create).not.toHaveBeenCalled();
    expect(patientRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw ConflictException when a patient with the same email already exists', async () => {
    patientRepositoryMock.findByCpf.mockResolvedValueOnce(null);
    patientRepositoryMock.findByEmail.mockResolvedValueOnce({ id: '2', email: 'test@example.com' } as Patient);

    const dto = {
      name: 'Jane Doe',
      birthDate: '1992-02-02',
      cpf: '09876543211',
      sex: Sex.F,
      email: 'test@example.com',
    } as CreatePatientDto;

    await expect(service.createPatient(dto)).rejects.toThrow(ConflictException);

    expect(patientRepositoryMock.create).not.toHaveBeenCalled();
    expect(patientRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should create and save a new patient when no conflicts are found', async () => {
        patientRepositoryMock.findByCpf.mockResolvedValueOnce(null);
        patientRepositoryMock.findByEmail.mockResolvedValueOnce(null);

        const dto = {
          name: 'Alice Smith',
          birthDate: '1985-05-15',
          cpf: '11223344556',
          sex: Sex.F,
          email: 'alice@example.com',
          phone: '555-1234',
        } as CreatePatientDto;

        const createdEntity = {
          ...dto,
          birthDate: new Date(dto.birthDate),
          cpf: dto.cpf.replace(/[.-]/g, ''),
          email: dto.email?.toLowerCase(),
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
          encounters: [],
        } as Patient;

        patientRepositoryMock.create.mockReturnValueOnce(createdEntity);
        patientRepositoryMock.save.mockResolvedValueOnce({ id: '3', ...createdEntity } as Patient);

        const result = await service.createPatient(dto);

        expect(patientRepositoryMock.create).toHaveBeenCalledWith({
          ...dto,
          birthDate: new Date(dto.birthDate),
          cpf: dto.cpf.replace(/[.-]/g, ''),
          email: dto.email?.toLowerCase(),
        });
        expect(patientRepositoryMock.save).toHaveBeenCalledWith(createdEntity);
        expect(result).toEqual({ id: '3', ...createdEntity });
      });

});
});

  describe('FN_updatePatient_END', () => {
describe('updatePatient', () => {
  it('should throw ConflictException when email is already used by another patient', async () => {
    const existingPatient = { id: '2', email: 'taken@example.com' } as Patient;
    patientRepositoryMock.findByEmail.mockResolvedValueOnce(existingPatient);
    patientRepositoryMock.findById = jest.fn().mockResolvedValueOnce({ id: '1', email: null } as Patient);

    await expect(
      service.updatePatient('1', { email: 'taken@example.com' } as UpdatePatientDto),
    ).rejects.toThrow(ConflictException);

    expect(patientRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when patient does not exist', async () => {
    patientRepositoryMock.findById = jest.fn().mockResolvedValueOnce(null);
    patientRepositoryMock.findByEmail.mockResolvedValueOnce(null);

    await expect(
      service.updatePatient('non-existent-id', {} as UpdatePatientDto),
    ).rejects.toThrow(NotFoundException);

    expect(patientRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should update and return the patient when data is valid', async () => {
        const patient = {
          id: '1',
          name: 'John Doe',
          email: 'old@example.com',
          sex: Sex.M,
        } as Patient;

        patientRepositoryMock.findById = jest.fn().mockResolvedValueOnce(patient);
        patientRepositoryMock.findByEmail.mockResolvedValueOnce(null);
        const updatedPatient = { ...patient, name: 'Jane Doe', email: 'new@example.com' };
        patientRepositoryMock.update.mockResolvedValueOnce(updatedPatient);

        const result = await service.updatePatient('1', {
          name: 'Jane Doe',
          email: 'new@example.com',
        } as UpdatePatientDto);

        expect(patientRepositoryMock.update).toHaveBeenCalledWith(patient, {
          name: 'Jane Doe',
          email: 'new@example.com',
        });
        expect(result).toBe(updatedPatient);
      });

});
});

  describe('FN_findByCpfOrFail_END', () => {
describe('findByCpfOrFail', () => {
  it('should throw NotFoundException when patient does not exist', async () => {
    patientRepositoryMock.findByCpf.mockResolvedValueOnce(null);

    await expect(service.findByCpfOrFail('12345678900')).rejects.toThrow(
      NotFoundException,
    );

    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith('12345678900');
  });

  it('should return the patient when found', async () => {
    const patient = {
      id: '1',
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

    patientRepositoryMock.findByCpf.mockResolvedValueOnce(patient);

    const result = await service.findByCpfOrFail('12345678900');

    expect(result).toBe(patient);
    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith('12345678900');
  });
});
});

  // TESTS_APPEND_HERE
});
