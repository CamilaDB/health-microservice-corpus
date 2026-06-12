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
  it('should throw NotFoundException when patient is not found', async () => {
    const id = 'non-existent-id';
    patientRepositoryMock.findById.mockResolvedValueOnce(undefined);
    await expect(service.getPatientById(id)).rejects.toThrow(NotFoundException);
  });

  it('should return patient when found', async () => {
    const id = 'existing-id';
    const patient: Patient = {
      id: 'existing-id',
      name: 'John Doe',
      birthDate: new Date(),
      cpf: '12345678901',
      sex: Sex.M,
      email: 'john@example.com',
      phone: '1234567890',
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      encounters: [],
    };
    patientRepositoryMock.findById.mockResolvedValueOnce(patient);
    const result = await service.getPatientById(id);
    expect(result).toEqual(patient);
  });
});

  describe('listPatients', () => {
  it('should return an empty array when no patients are found', async () => {
    patientRepositoryMock.findAll.mockResolvedValue([]);
    const result = await service.listPatients();
    expect(result).toEqual([]);
  });

  it('should return a list of patients when patients are found', async () => {
    const patients: Patient[] = [
      { id: '1', name: 'John Doe', birthDate: new Date(), cpf: '12345678901', sex: Sex.M, email: 'john@example.com', phone: '1234567890', active: true, created_at: new Date(), updated_at: new Date(), encounters: [] },
      { id: '2', name: 'Jane Doe', birthDate: new Date(), cpf: '98765432109', sex: Sex.F, email: 'jane@example.com', phone: '9876543210', active: true, created_at: new Date(), updated_at: new Date(), encounters: [] },
    ];
    patientRepositoryMock.findAll.mockResolvedValue(patients);
    const result = await service.listPatients();
    expect(result).toEqual(patients);
  });
});

  describe('createPatient', () => {
  it('should throw ConflictException when CPF already registered', async () => {
    const createPatientDto: CreatePatientDto = {
      name: 'John Doe',
      birthDate: '1990-01-01',
      cpf: '12345678901',
      sex: Sex.M,
    };
    patientRepositoryMock.findByCpf.mockResolvedValueOnce({} as Patient);
    await expect(service.createPatient(createPatientDto)).rejects.toThrow(ConflictException);
  });

  it('should throw ConflictException when email already registered', async () => {
    const createPatientDto: CreatePatientDto = {
      name: 'John Doe',
      birthDate: '1990-01-01',
      cpf: '12345678901',
      sex: Sex.M,
      email: 'johndoe@example.com',
    };
    patientRepositoryMock.findByCpf.mockResolvedValueOnce(undefined);
    patientRepositoryMock.findByEmail.mockResolvedValueOnce({} as Patient);
    await expect(service.createPatient(createPatientDto)).rejects.toThrow(ConflictException);
  });

  it('should create patient when CPF and email are not registered', async () => {
    const createPatientDto: CreatePatientDto = {
      name: 'John Doe',
      birthDate: '1990-01-01',
      cpf: '12345678901',
      sex: Sex.M,
      email: 'johndoe@example.com',
    };
    patientRepositoryMock.findByCpf.mockResolvedValueOnce(undefined);
    patientRepositoryMock.findByEmail.mockResolvedValueOnce(undefined);
    const patient = {} as Patient;
    patientRepositoryMock.create.mockReturnValueOnce(patient);
    patientRepositoryMock.save.mockResolvedValueOnce(patient);
    const result = await service.createPatient(createPatientDto);
    expect(result).toBe(patient);
  });
});

  describe('updatePatient', () => {
  it.skip('should throw ConflictException when email is already registered', async () => {
              const id = 'existing-patient-id';
              const existingPatient = { id: 'existing-patient-id', email: 'existing-email@example.com' } as Patient;
              const existingPatientWithDifferentEmail = { id: 'different-patient-id', email: 'existing-email@example.com' } as Patient;
              const dto: UpdatePatientDto = { email: 'existing-email@example.com' };
              patientRepositoryMock.findById.mockResolvedValue(existingPatient);
              patientRepositoryMock.findByEmail.mockResolvedValue(existingPatientWithDifferentEmail);
              await expect(service.updatePatient(id, dto)).rejects.toThrowError(ConflictException);
            });



});

  describe('findByCpfOrFail', () => {
  it('should throw NotFoundException when patient is not found', async () => {
    patientRepositoryMock.findByCpf.mockResolvedValueOnce(undefined);
    await expect(service.findByCpfOrFail('12345678901')).rejects.toThrow(NotFoundException);
  });

  it('should return patient when found', async () => {
    const patient = { id: '1', name: 'John Doe', birthDate: new Date(), cpf: '12345678901', sex: Sex.M, email: 'johndoe@example.com', phone: '1234567890', active: true, created_at: new Date(), updated_at: new Date(), encounters: [] };
    patientRepositoryMock.findByCpf.mockResolvedValueOnce(patient);
    const result = await service.findByCpfOrFail('12345678901');
    expect(result).toEqual(patient);
  });
});

  // TESTS_APPEND_HERE
});
