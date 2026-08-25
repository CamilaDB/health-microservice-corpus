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
    patientRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(service.getPatientById('nonExistentId')).rejects.toThrow(NotFoundException);
    await expect(service.getPatientById('nonExistentId')).rejects.toThrow(`Patient with id nonExistentId not found`);
  });

  it('should return the patient if found', async () => {
    const mockPatient = {
      id: '123',
      name: 'John Doe',
      birthDate: new Date(),
      cpf: '12345678900',
      sex: Sex.M,
      email: 'john@example.com',
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
  it('should return the list of patients from the repository when findAll succeeds', async () => {
        patientRepositoryMock.findAll.mockResolvedValue(expect.arrayContaining([{ id: '1', name: 'Test Patient' }]));
        const mockPatients = [{ id: '1', name: 'Test Patient' }];

        await expect(service.listPatients()).resolves.toEqual(mockPatients);
    });


  it('should throw an error if findAll throws an exception', async () => {
    const error = new Error('Repository error');
    patientRepositoryMock.findAll.mockRejectedValue(error);

    await expect(service.listPatients()).rejects.toThrow(error);
  });
});
});

  describe('FN_createPatient_END', () => {
describe('createPatient', () => {
  it('should throw ConflictException if CPF already exists', async () => {
        patientRepositoryMock.findByCpf.mockResolvedValue({ id: '1', cpf: '12345678900' });
        await expect(service.createPatient({ cpf: '12345678900', name: 'Test', birthDate: '2000-01-01' })).rejects.toThrow(ConflictException);
        expect(patientRepositoryMock.findByCpf).toHaveBeenCalledTimes(1);
        expect(patientRepositoryMock.create).not.toHaveBeenCalled();
      });


  it('should throw ConflictException if email already exists', async () => {
        patientRepositoryMock.findByCpf.mockResolvedValue(undefined);
        patientRepositoryMock.findByEmail.mockResolvedValue({ id: '1', email: 'test@example.com' });
        await expect(service.createPatient({ cpf: '12345678900', name: 'Test', birthDate: '2000-01-01', email: 'test@example.com' })).rejects.toThrow(ConflictException);
        expect(patientRepositoryMock.findByCpf).toHaveBeenCalledTimes(1);
        expect(patientRepositoryMock.findByEmail).toHaveBeenCalledTimes(1);
        expect(patientRepositoryMock.create).not.toHaveBeenCalled();
      });


  it('should successfully create and save a new patient', async () => {
    patientRepositoryMock.findByCpf.mockResolvedValue(undefined);
    patientRepositoryMock.findByEmail.mockResolvedValue(undefined);
    patientRepositoryMock.create.mockReturnValue({ id: 'new-id', cpf: '12345678900', email: 'test@example.com', birthDate: new Date('2000-01-01') });
    patientRepositoryMock.save.mockResolvedValue({ id: 'new-id', cpf: '12345678900', email: 'test@example.com', birthDate: new Date('2000-01-01') });

    const result = await service.createPatient({
      cpf: '12345678900',
      name: 'Test Name',
      birthDate: '2000-01-01',
      email: 'test@example.com'
    });

    expect(result).toEqual({ id: 'new-id', cpf: '12345678900', email: 'test@example.com', birthDate: new Date('2000-01-01') });
    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledTimes(1);
    expect(patientRepositoryMock.findByEmail).toHaveBeenCalledTimes(1);
    expect(patientRepositoryMock.create).toHaveBeenCalledTimes(1);
    expect(patientRepositoryMock.save).toHaveBeenCalledTimes(1);
  });
});
});

  describe('FN_updatePatient_END', () => {
describe('updatePatient', () => {
  it('should update patient details successfully when email changes and no conflict exists', async () => {
    const patientId = '1';
    const dto = {
      name: 'New Name',
      email: 'new.email@example.com',
      birthDate: '2000-01-01',
    };

    const existingPatient = {
      id: patientId,
      name: 'Old Name',
      email: 'old.email@example.com',
      birthDate: new Date('1990-01-01'),
      sex: 1, // Assuming Sex enum value exists
      phone: null,
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      encounters: [],
    };

    const updatedPatient = {
      id: patientId,
      name: 'New Name',
      email: 'new.email@example.com',
      birthDate: new Date('2000-01-01'),
      sex: 1,
      phone: null,
      active: true,
      created_at: existingPatient.created_at,
      updated_at: new Date(),
      encounters: [],
    };

    const existingEmailResult = undefined;

    // Arrange
    jest.spyOn(service, 'getPatientById').mockResolvedValue(existingPatient);
    jest.spyOn(patientRepositoryMock, 'findByEmail').mockResolvedValue(existingEmailResult);
    jest.spyOn(patientRepositoryMock, 'update').mockResolvedValue(updatedPatient);

    // Act
    const result = await service.updatePatient(patientId, dto);

    // Assert
    expect(result).toEqual(updatedPatient);
    expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith('new.email@example.com');
    expect(patientRepositoryMock.update).toHaveBeenCalledWith(existingPatient, {
      name: 'New Name',
      email: 'new.email@example.com',
      birthDate: new Date('2000-01-01'),
    });
  });

  it('should throw ConflictException if the new email already exists', async () => {
    const patientId = '1';
    const dto = {
      email: 'existing.email@example.com',
    };

    const existingPatient = {
      id: patientId,
      name: 'Test',
      email: 'old@example.com',
      birthDate: new Date(),
      sex: 1,
      phone: null,
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      encounters: [],
    };

    // Arrange
    jest.spyOn(service, 'getPatientById').mockResolvedValue(existingPatient);
    // Simulate finding an existing email
    jest.spyOn(patientRepositoryMock, 'findByEmail').mockResolvedValue('old@example.com');
    jest.spyOn(patientRepositoryMock, 'update').mockRejectedValue(new Error('should not be called'));

    // Act & Assert
    await expect(service.updatePatient(patientId, dto)).rejects.toThrow(ConflictException);
    expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith('existing.email@example.com');
    expect(patientRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should update patient details when only non-email fields are provided and no conflict occurs', async () => {
    const patientId = '2';
    const dto = {
      name: 'Updated Name',
      sex: 2, // Assuming Sex enum value exists
      phone: '1234567890',
      active: false,
    };

    const existingPatient = {
      id: patientId,
      name: 'Old Name',
      email: 'test@example.com',
      birthDate: new Date(),
      sex: 1,
      phone: null,
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      encounters: [],
    };

    // Arrange
    jest.spyOn(service, 'getPatientById').mockResolvedValue(existingPatient);
    jest.spyOn(patientRepositoryMock, 'findByEmail').mockResolvedValue(undefined);
    jest.spyOn(patientRepositoryMock, 'update').mockResolvedValue({ ...existingPatient, name: 'Updated Name', sex: 2, phone: '1234567890', active: false });

    // Act
    const result = await service.updatePatient(patientId, dto);

    // Assert
    expect(result).toEqual({
      ...existingPatient,
      name: 'Updated Name',
      sex: 2,
      phone: '1234567890',
      active: false,
    });
    expect(patientRepositoryMock.findByEmail).not.toHaveBeenCalled();
    expect(patientRepositoryMock.update).toHaveBeenCalledTimes(1);
  });
});
});

  describe('FN_findByCpfOrFail_END', () => {
describe('findByCpfOrFail', () => {
  it('should return the patient when found', async () => {
    const mockPatient = { id: '123', name: 'Test Patient', cpf: '11111111111', birthDate: new Date(), sex: 1, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] };
    patientRepositoryMock.findByCpf.mockResolvedValue(mockPatient);

    const result = await service.findByCpfOrFail('11111111111');

    expect(result).toEqual(mockPatient);
    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith('11111111111');
  });

  it('should throw NotFoundException when patient is not found', async () => {
    patientRepositoryMock.findByCpf.mockResolvedValue(undefined);

    await expect(service.findByCpfOrFail('99999999999')).rejects.toThrow(NotFoundException);
    await expect(service.findByCpfOrFail('99999999999')).rejects.toThrow('Patient with cpf 99999999999 not found');
    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith('99999999999');
  });
});
});

  // TESTS_APPEND_HERE
});
