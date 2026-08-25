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
    const patient = { id: '1', name: 'John Doe' };
    patientRepositoryMock.findById.mockResolvedValueOnce(patient);

    const result = await service.getPatientById('1');

    expect(result).toBe(patient);
  });
});
});

  describe('FN_listPatients_END', () => {
describe('listPatients', () => {
  it('should return all patients when found', async () => {
    const patients = [
      { id: '1', name: 'John Doe', birthDate: new Date(), cpf: '12345678901', sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] },
      { id: '2', name: 'Jane Doe', birthDate: new Date(), cpf: '98765432109', sex: Sex.F, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] }
    ];

    patientRepositoryMock.findAll.mockResolvedValue(patients);

    const result = await service.listPatients();

    expect(result).toBe(patients);
    expect(patientRepositoryMock.findAll).toHaveBeenCalled();
  });

  it('should return an empty array when no patients are found', async () => {
    patientRepositoryMock.findAll.mockResolvedValue([]);

    const result = await service.listPatients();

    expect(result).toEqual([]);
    expect(patientRepositoryMock.findAll).toHaveBeenCalled();
  });
});
});

  describe('FN_createPatient_END', () => {
describe('createPatient', () => {
  it('should throw ConflictException when patient already exists by CPF', async () => {
    const dto: CreatePatientDto = {
      name: 'John Doe',
      birthDate: '1990-01-01',
      cpf: '12345678901',
      sex: Sex.M,
    };

    patientRepositoryMock.findByCpf.mockResolvedValueOnce({
      id: '1',
      name: 'John Doe',
      birthDate: new Date('1990-01-01'),
      cpf: '12345678901',
      sex: Sex.M,
      email: null,
      phone: null,
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      encounters: [],
    });

    await expect(service.createPatient(dto)).rejects.toThrow(ConflictException);

    expect(patientRepositoryMock.create).not.toHaveBeenCalled();
    expect(patientRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw ConflictException when patient already exists by email', async () => {
    const dto: CreatePatientDto = {
      name: 'John Doe',
      birthDate: '1990-01-01',
      cpf: '12345678901',
      sex: Sex.M,
      email: 'john.doe@example.com',
    };

    patientRepositoryMock.findByEmail.mockResolvedValueOnce({
      id: '1',
      name: 'John Doe',
      birthDate: new Date('1990-01-01'),
      cpf: '12345678901',
      sex: Sex.M,
      email: 'john.doe@example.com',
      phone: null,
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      encounters: [],
    });

    await expect(service.createPatient(dto)).rejects.toThrow(ConflictException);

    expect(patientRepositoryMock.create).not.toHaveBeenCalled();
    expect(patientRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should save and return the created patient', async () => {
    const dto: CreatePatientDto = {
      name: 'John Doe',
      birthDate: '1990-01-01',
      cpf: '12345678901',
      sex: Sex.M,
      email: 'john.doe@example.com',
    };

    patientRepositoryMock.findByCpf.mockResolvedValueOnce(null);
    patientRepositoryMock.findByEmail.mockResolvedValueOnce(null);

    const createdEntity: Patient = {
      id: '1',
      name: 'John Doe',
      birthDate: new Date('1990-01-01'),
      cpf: '12345678901',
      sex: Sex.M,
      email: 'john.doe@example.com',
      phone: null,
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      encounters: [],
    };

    patientRepositoryMock.create.mockReturnValueOnce(createdEntity);
    patientRepositoryMock.save.mockResolvedValueOnce(createdEntity);

    const result = await service.createPatient(dto);

    expect(patientRepositoryMock.create).toHaveBeenCalledWith({
      name: 'John Doe',
      birthDate: new Date('1990-01-01'),
      cpf: '12345678901',
      sex: Sex.M,
      email: 'john.doe@example.com',
    });
    expect(patientRepositoryMock.save).toHaveBeenCalledWith(createdEntity);
    expect(result).toBe(createdEntity);
  });
});
});

  describe('FN_updatePatient_END', () => {
describe('updatePatient', () => {
  it('should throw NotFoundException when patient does not exist', async () => {
    patientRepositoryMock.findByEmail.mockResolvedValueOnce(null);

    await expect(
      service.updatePatient({ email: 'test@test.com' } as UpdatePatientDto),
    ).rejects.toThrow(NotFoundException);
  });

  it.skip('should update and return the patient entity', async () => {
        const existingPatient = { id: '1', email: 'test@test.com' };
        patientRepositoryMock.findByEmail.mockResolvedValueOnce(existingPatient);

        const updatedEntity = { ...existingPatient, name: 'Updated Name' };
        patientRepositoryMock.update.mockReturnValueOnce(updatedEntity);

        await service.updatePatient({ email: 'test@test.com', name: 'Updated Name' } as UpdatePatientDto);

        expect(patientRepositoryMock.update).toHaveBeenCalledWith('1', { name: 'Updated Name' });
      });
});
});

  describe('FN_findByCpfOrFail_END', () => {
describe('findByCpfOrFail', () => {
  it('should throw NotFoundException when patient does not exist', async () => {
    patientRepositoryMock.findByCpf.mockResolvedValueOnce(null);

    await expect(service.findByCpfOrFail('1234567890')).rejects.toThrow(NotFoundException);
  });

  it('should return the patient when found', async () => {
    const patient = { id: '1', name: 'John Doe', birthDate: new Date(), cpf: '1234567890', sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] };
    patientRepositoryMock.findByCpf.mockResolvedValueOnce(patient);

    const result = await service.findByCpfOrFail('1234567890');

    expect(result).toBe(patient);
  });
});
});

  // TESTS_APPEND_HERE
});
