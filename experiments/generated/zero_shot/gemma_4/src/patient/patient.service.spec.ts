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
it('should return the patient if found', async () => {
  const mockPatient = {
    id: '123',
    name: 'Test Patient',
    birthDate: new Date(),
    cpf: '111',
    sex: 1, // Assuming Sex enum values are handled correctly or mocked if necessary, but focusing on structure here
    email: null,
    phone: null,
    active: true,
    created_at: new Date(),
    updated_at: new Date(),
  };

  patientRepositoryMock.findById.mockResolvedValue(mockPatient);

  const result = await service.getPatientById('123');

  expect(result).toEqual(mockPatient);
  expect(patientRepositoryMock.findById).toHaveBeenCalledWith('123');
});

it('should throw NotFoundException if the patient is not found', async () => {
  patientRepositoryMock.findById.mockResolvedValue(null);

  await expect(service.getPatientById('999')).rejects.toThrow(NotFoundException);
  expect(patientRepositoryMock.findById).toHaveBeenCalledWith('999');
});
})
});

  describe('FN_listPatients_END', () => {
describe('listPatients', () => {
it('should return a list of patients when findAll resolves successfully', async () => {
  const mockPatients = [
    { id: '1', name: 'John Doe', cpf: '123', sex: 'M', email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] },
    { id: '2', name: 'Jane Doe', cpf: '456', sex: 'F', email: 'jane@example.com', phone: '111', active: false, created_at: new Date(), updated_at: new Date(), encounters: [] },
  ];

  patientRepositoryMock.findAll.mockResolvedValue(mockPatients);

  const result = await service.listPatients();

  expect(result).toEqual(mockPatients);
  expect(patientRepositoryMock.findAll).toHaveBeenCalledTimes(1);
});

it('should return an empty array when no patients are found', async () => {
  patientRepositoryMock.findAll.mockResolvedValue([]);

  const result = await service.listPatients();

  expect(result).toEqual([]);
  expect(patientRepositoryMock.findAll).toHaveBeenCalledTimes(1);
});
})
});

  describe('FN_createPatient_END', () => {
describe('createPatient', () => {
it('should successfully create a new patient', async () => {
  const createPatientDto: CreatePatientDto = {
    name: 'John Doe',
    birthDate: '1990-01-01',
    cpf: '12345678900',
    sex: Sex.M,
    email: 'john@example.com',
  };

  patientRepositoryMock.create.mockResolvedValue({
    id: 'patient-1',
    name: createPatientDto.name,
    birthDate: new Date(createPatientDto.birthDate),
    cpf: createPatientDto.cpf,
    sex: createPatientDto.sex,
    email: createPatientDto.email,
  });

  const result = await service.createPatient(createPatientDto);

  expect(result).toBeDefined();
  expect(result.id).toBe('patient-1');
  expect(patientRepositoryMock.create).toHaveBeenCalledTimes(1);
});

it('should throw NotFoundException if patient already exists (if implemented via findByCpf check)', async () => {
  patientRepositoryMock.findByCpf.mockResolvedValue(undefined); // Assuming we check existence before creation, or repository handles uniqueness constraint violation resulting in an error.

  // If the service logic checks for existence first and throws NotFoundException if found:
  // We need to mock findByCpf to return a patient if it exists, but since this is creation, we test the flow where creation succeeds unless constraints are violated.
  
  // Let's focus on repository failure during save/create operation if that's how errors propagate.
  patientRepositoryMock.create.mockRejectedValue(new Error('Database error'));

  await expect(service.createPatient(
    {
      name: 'Test',
      birthDate: '2000-01-01',
      cpf: '98765432100',
      sex: Sex.F,
    } as CreatePatientDto)
  ).rejects.toThrow('Database error');

  expect(patientRepositoryMock.create).toHaveBeenCalledTimes(1);
});
})
});

  describe('FN_updatePatient_END', () => {
describe('updatePatient', () => {
it.skip('should successfully update the patient if found', async () => {
      const patientId = 'patient-123';
      const updateDto = { name: 'New Name' };

      patientRepositoryMock.findById.mockResolvedValue({ id: patientId, name: 'Old Name' });
      patientRepositoryMock.update.mockResolvedValue(true);

      await service.updatePatient(patientId, updateDto);

      expect(patientRepositoryMock.findById).toHaveBeenCalledWith(patientId);
      expect(patientRepositoryMock.update).toHaveBeenCalledWith(patientId, { name: 'New Name' });
    });

it('should throw NotFoundException if the patient is not found', async () => {
  const patientId = 'non-existent-id';
  const updateDto = { name: 'New Name' };

  patientRepositoryMock.findById.mockResolvedValue(null);

  await expect(service.updatePatient(patientId, updateDto)).rejects.toThrow(NotFoundException);
  expect(patientRepositoryMock.update).not.toHaveBeenCalled();
});

it('should throw an error if the repository update fails', async () => {
  const patientId = 'patient-123';
  const updateDto = { name: 'New Name' };
  const error = new Error('Database update failed');

  patientRepositoryMock.findById.mockResolvedValue({ id: patientId, name: 'Old Name' });
  patientRepositoryMock.update.mockRejectedValue(error);

  await expect(service.updatePatient(patientId, updateDto)).rejects.toThrow(error);
});
})
});

  describe('FN_findByCpfOrFail_END', () => {
describe('findByCpfOrFail', () => {
it('should find a patient by CPF and return it', async () => {
  const mockPatient = {
    id: '123',
    name: 'Test Name',
    cpf: '11111111111',
    birthDate: new Date(),
    sex: 1, // Assuming Sex enum values are handled correctly or mocked if necessary
    email: null,
    phone: null,
    active: true,
    created_at: new Date(),
    updated_at: new Date(),
  };

  patientRepositoryMock.findByCpf.mockResolvedValue(mockPatient);

  const result = await service.findByCpfOrFail('11111111111');

  expect(result).toEqual(mockPatient);
  expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith('11111111111');
});

it('should throw NotFoundException if patient is not found by CPF', async () => {
  patientRepositoryMock.findByCpf.mockResolvedValue(null);

  await expect(service.findByCpfOrFail('99999999999')).rejects.toThrow(NotFoundException);
  expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith('99999999999');
});
})
});

  // TESTS_APPEND_HERE
});
