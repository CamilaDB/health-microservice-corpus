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
  it('should throw NotFoundException if patient is not found', async () => {
    patientRepositoryMock.findById.mockResolvedValue(null);

    await expect(service.getPatientById('some-id')).rejects.toThrow(NotFoundException);
    await expect(service.getPatientById('some-id')).rejects.toThrow('Patient with id some-id not found');
  });

  it('should return the patient if found', async () => {
    const mockPatient = {
      id: '123',
      name: 'Test Name',
      birthDate: new Date(),
      cpf: '11111111111',
      sex: Sex.M,
      email: 'test@example.com',
      phone: null,
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      encounters: [],
    };

    patientRepositoryMock.findById.mockResolvedValue(mockPatient);

    const result = await service.getPatientById('123');

    expect(result).toEqual(mockPatient);
    expect(patientRepositoryMock.findById).toHaveBeenCalledWith('123');
  });
});
});

  describe('FN_listPatients_END', () => {
describe('listPatients', () => {
  it('should return an array of patients when findAll resolves successfully', async () => {
    const mockPatients = [
      { id: '1', name: 'Patient A', birthDate: new Date(), cpf: '111', sex: Sex.M, email: 'a@a.com', phone: '123', active: true, created_at: new Date(), updated_at: new Date(), encounters: [] },
      { id: '2', name: 'Patient B', birthDate: new Date(), cpf: '222', sex: Sex.F, email: 'b@b.com', phone: '456', active: false, created_at: new Date(), updated_at: new Date(), encounters: [] },
    ];
    patientRepositoryMock.findAll.mockResolvedValue(mockPatients);

    await expect(service.listPatients()).resolves.toEqual(mockPatients);
    expect(patientRepositoryMock.findAll).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if findAll throws an exception', async () => {
    const error = new Error('Database error');
    patientRepositoryMock.findAll.mockRejectedValue(error);

    await expect(service.listPatients()).rejects.toThrow(error);
    expect(patientRepositoryMock.findAll).toHaveBeenCalledTimes(1);
  });
});
});

  describe('FN_createPatient_END', () => {
describe('createPatient', () => {
  it('should throw ConflictException if CPF already exists', async () => {
        patientRepositoryMock.findByCpf.mockResolvedValue({ id: '1', cpf: '1234567890', name: 'Existing Patient' });
        await expect(service.createPatient({ cpf: '1234567890', name: 'New Patient', birthDate: '2000-01-01' })).rejects.toThrow(`CPF 1234567890 already registered`);
        expect(patientRepositoryMock.findByCpf).toHaveBeenCalledTimes(1);
        expect(patientRepositoryMock.findByEmail).not.toHaveBeenCalled();
        expect(patientRepositoryMock.create).not.toHaveBeenCalled();
        expect(patientRepositoryMock.save).not.toHaveBeenCalled();
    });


  it('should throw ConflictException if email already exists', async () => {
        patientRepositoryMock.findByCpf.mockResolvedValue(undefined);
        patientRepositoryMock.findByEmail.mockResolvedValue({ id: '2', email: 'test@example.com' });
        await expect(service.createPatient({ cpf: '1111111111', email: 'test@example.com', name: 'New Patient', birthDate: '2000-01-01' })).rejects.toThrow(ConflictException);
        await expect(service.createPatient({ cpf: '1111111111', email: 'test@example.com', name: 'New Patient', birthDate: '2000-01-01' })).rejects.toThrow(`Email test@example.com already registered`);
        expect(patientRepositoryMock.findByCpf).toHaveBeenCalledTimes(2);
        expect(patientRepositoryMock.findByEmail).toHaveBeenCalledTimes(2);
        expect(patientRepositoryMock.create).not.toHaveBeenCalled();
        expect(patientRepositoryMock.save).not.toHaveBeenCalled();
    });


  it('should successfully create and save a new patient', async () => {
    patientRepositoryMock.findByCpf.mockResolvedValue(undefined);
    patientRepositoryMock.findByEmail.mockResolvedValue(undefined);
    patientRepositoryMock.create.mockReturnValue({ id: '3', name: 'New Patient', cpf: '1234567890', email: 'new@example.com', birthDate: new Date('2000-01-01') });
    patientRepositoryMock.save.mockResolvedValue({ id: '3', name: 'New Patient', cpf: '1234567890', email: 'new@example.com', birthDate: new Date('2000-01-01') });

    const newPatientData = {
      cpf: '1234567890',
      email: 'new@example.com',
      name: 'New Patient',
      birthDate: '2000-01-01',
    };

    const result = await service.createPatient(newPatientData);

    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith('1234567890');
    expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith('new@example.com');
    expect(patientRepositoryMock.create).toHaveBeenCalledWith({
      ...newPatientData,
      cpf: '1234567890',
      email: 'new@example.com',
      birthDate: new Date('2000-01-01'),
    });
    expect(patientRepositoryMock.save).toHaveBeenCalledWith({
      id: '3',
      name: 'New Patient',
      cpf: '1234567890',
      email: 'new@example.com',
      birthDate: new Date('2000-01-01'),
    });
    expect(result).toEqual({ id: '3', name: 'New Patient', cpf: '1234567890', email: 'new@example.com', birthDate: new Date('2000-01-01') });
  });
});
});

  describe('FN_findByCpfOrFail_END', () => {
describe('findByCpfOrFail', () => {
  it('should throw NotFoundException if patient with the given cpf is not found', async () => {
    patientRepositoryMock.findByCpf.mockResolvedValue(undefined);

    await expect(service.findByCpfOrFail('1234567890123')).rejects.toThrow(NotFoundException);
    await expect(service.findByCpfOrFail('1234567890123')).rejects.toThrow('Patient with cpf 1234567890123 not found');
    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith('1234567890123');
  });

  it('should return the patient if found', async () => {
    const mockPatient = {
      id: '1',
      name: 'Test Name',
      birthDate: new Date(),
      cpf: '1234567890123',
      sex: Sex.M,
      email: null,
      phone: null,
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      encounters: [],
    };

    patientRepositoryMock.findByCpf.mockResolvedValue(mockPatient);

    const result = await service.findByCpfOrFail('1234567890123');

    expect(result).toEqual(mockPatient);
    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith('1234567890123');
  });
});
});

  // TESTS_APPEND_HERE
});
