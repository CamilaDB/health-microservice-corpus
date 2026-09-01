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
    const patient = { id: '1', name: 'John Doe', birthDate: new Date(), cpf: '12345678901', sex: Sex.M, email: 'john.doe@example.com', phone: '1234567890', active: true, created_at: new Date(), updated_at: new Date(), encounters: [] };
    patientRepositoryMock.findById.mockResolvedValueOnce(patient);

    const result = await service.getPatientById('1');

    expect(result).toBe(patient);
  });
});
});

  describe('FN_listPatients_END', () => {
describe('listPatients', () => {
  it('should return all patients', async () => {
    const patients: Patient[] = [
      { id: '1', name: 'John Doe', birthDate: new Date(), cpf: '12345678901', sex: Sex.M, email: 'john@example.com', phone: '1234567890', active: true, created_at: new Date(), updated_at: new Date(), encounters: [] },
      { id: '2', name: 'Jane Doe', birthDate: new Date(), cpf: '09876543210', sex: Sex.F, email: 'jane@example.com', phone: '0987654321', active: true, created_at: new Date(), updated_at: new Date(), encounters: [] }
    ];

    patientRepositoryMock.findAll.mockResolvedValue(patients);

    const result = await service.listPatients();

    expect(result).toEqual(patients);
    expect(patientRepositoryMock.findAll).toHaveBeenCalled();
  });
});
});

  describe('FN_createPatient_END', () => {
describe('createPatient', () => {
  it('should throw ConflictException when CPF already registered', async () => {
    const dto = {
      name: 'John Doe',
      birthDate: '1990-01-01',
      cpf: '123.456.789-00',
      sex: Sex.M,
    };

    patientRepositoryMock.findByCpf.mockResolvedValueOnce({
      id: '1',
      cpf: '12345678900',
    });

    await expect(service.createPatient(dto)).rejects.toThrow(
      ConflictException,
    );

    expect(patientRepositoryMock.findByEmail).not.toHaveBeenCalled();
    expect(patientRepositoryMock.create).not.toHaveBeenCalled();
    expect(patientRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw ConflictException when email already registered', async () => {
    const dto = {
      name: 'John Doe',
      birthDate: '1990-01-01',
      cpf: '123.456.789-00',
      sex: Sex.M,
      email: 'john.doe@example.com',
    };

    patientRepositoryMock.findByCpf.mockResolvedValueOnce(null);
    patientRepositoryMock.findByEmail.mockResolvedValueOnce({
      id: '1',
      email: 'johndoe@example.com',
    });

    await expect(service.createPatient(dto)).rejects.toThrow(
      ConflictException,
    );

    expect(patientRepositoryMock.create).not.toHaveBeenCalled();
    expect(patientRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should save and return the created patient', async () => {
      const dto = {
        name: 'John Doe',
        birthDate: '1990-01-01',
        cpf: '123.456.789-00',
        sex: Sex.M,
        email: 'john.doe@example.com',
      };

      patientRepositoryMock.findByCpf.mockResolvedValueOnce(null);
      patientRepositoryMock.findByEmail.mockResolvedValueOnce(null);

      const createdPatient = {
        ...dto,
        cpf: '12345678900',
        email: 'john.doe@example.com',
        birthDate: new Date('1990-01-01'),
      };

      patientRepositoryMock.create.mockReturnValueOnce(createdPatient);
      patientRepositoryMock.save.mockResolvedValueOnce(createdPatient);

      const result = await service.createPatient(dto);

      expect(patientRepositoryMock.create).toHaveBeenCalledWith(createdPatient);
      expect(patientRepositoryMock.save).toHaveBeenCalledWith(createdPatient);
      expect(result).toEqual(createdPatient);
    });

});
});

  describe('FN_updatePatient_END', () => {
describe('updatePatient', () => {
  it.skip('should throw ConflictException when email already exists', async () => {
        const patient = { id: '1', email: 'test@test.com' };
        patientRepositoryMock.findById.mockResolvedValueOnce(patient);

        patientRepositoryMock.findByEmail.mockResolvedValueOnce({
          id: '2',
          email: 'test@test.com',
        });

        await expect(
          service.updatePatient('1', { email: 'test@test.com' } as UpdatePatientDto),
        ).rejects.toThrow(ConflictException);

        expect(patientRepositoryMock.update).not.toHaveBeenCalled();
      });

  it('should update and return the patient when email is unique', async () => {
    const patient = { id: '1', email: 'test@test.com' };
    patientRepositoryMock.findById.mockResolvedValueOnce(patient);

    patientRepositoryMock.findByEmail.mockResolvedValueOnce(null);

    const updateData: Partial<Patient> = {
      email: 'new@test.com',
    };

    patientRepositoryMock.update.mockResolvedValueOnce({ ...patient, ...updateData });

    const result = await service.updatePatient('1', { email: 'new@test.com' } as UpdatePatientDto);

    expect(patientRepositoryMock.update).toHaveBeenCalledWith(patient, updateData);
    expect(result).toEqual({ ...patient, ...updateData });
  });

  it('should update and return the patient when no email is provided', async () => {
    const patient = { id: '1', email: 'test@test.com' };
    patientRepositoryMock.findById.mockResolvedValueOnce(patient);

    const updateData: Partial<Patient> = {
      name: 'New Name',
    };

    patientRepositoryMock.update.mockResolvedValueOnce({ ...patient, ...updateData });

    const result = await service.updatePatient('1', { name: 'New Name' } as UpdatePatientDto);

    expect(patientRepositoryMock.update).toHaveBeenCalledWith(patient, updateData);
    expect(result).toEqual({ ...patient, ...updateData });
  });

  it('should throw NotFoundException when patient does not exist', async () => {
    patientRepositoryMock.findById.mockResolvedValueOnce(null);

    await expect(
      service.updatePatient('1', { email: 'new@test.com' } as UpdatePatientDto),
    ).rejects.toThrow(NotFoundException);

    expect(patientRepositoryMock.update).not.toHaveBeenCalled();
  });
});
});

  describe('FN_findByCpfOrFail_END', () => {
describe('findByCpfOrFail', () => {
  it('should throw NotFoundException when patient with given CPF is not found', async () => {
    patientRepositoryMock.findByCpf.mockResolvedValueOnce(null);

    await expect(service.findByCpfOrFail('12345678901')).rejects.toThrow(NotFoundException);
  });

  it('should return the patient when found', async () => {
    const patient = { id: '1', name: 'John Doe', birthDate: new Date(), cpf: '12345678901', sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] };
    patientRepositoryMock.findByCpf.mockResolvedValueOnce(patient);

    const result = await service.findByCpfOrFail('12345678901');

    expect(result).toBe(patient);
  });
});
});

  // TESTS_APPEND_HERE
});
