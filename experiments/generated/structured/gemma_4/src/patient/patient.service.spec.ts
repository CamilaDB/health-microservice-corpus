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
    expect(patientRepositoryMock.findById).toHaveBeenCalledWith('some-id');
  });

  it('should return the patient if found', async () => {
    const mockPatient = {
      id: '123',
      name: 'Test Name',
      birthDate: new Date(),
      cpf: '111',
      sex: 'M',
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
    patientRepositoryMock.findAll.mockResolvedValue([]);
    await service.listPatients();
    expect(patientRepositoryMock.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return the list of patients when findAll resolves with patients', async () => {
    const patients = [
      { id: '1', name: 'Alice', birthDate: new Date(), cpf: '111', sex: Sex.M, email: 'a@b.com', phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] },
      { id: '2', name: 'Bob', birthDate: new Date(), cpf: '222', sex: Sex.F, email: 'b@c.com', phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] },
    ];
    patientRepositoryMock.findAll.mockResolvedValue(patients);
    const result = await service.listPatients();
    expect(result).toEqual(patients);
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
    patientRepositoryMock.findByCpf.mockResolvedValue(true);
    await expect(service.createPatient({ cpf: '1234567890', name: 'Test', birthDate: '2000-01-01' })).rejects.toThrow(ConflictException);
    await expect(service.createPatient({ cpf: '1234567890', name: 'Test', birthDate: '2000-01-01' })).rejects.toThrow(`CPF 1234567890 already registered`);
    await expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith('1234567890');
    await expect(patientRepositoryMock.findByEmail).not.toHaveBeenCalled();
    await expect(patientRepositoryMock.create).not.toHaveBeenCalled();
    await expect(patientRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw ConflictException if email already exists', async () => {
    patientRepositoryMock.findByCpf.mockResolvedValue(false);
    patientRepositoryMock.findByEmail.mockResolvedValue(true);
    await expect(service.createPatient({ cpf: '1234567890', email: 'test@example.com', name: 'Test', birthDate: '2000-01-01' })).rejects.toThrow(ConflictException);
    await expect(service.createPatient({ cpf: '1234567890', email: 'test@example.com', name: 'Test', birthDate: '2000-01-01' })).rejects.toThrow(`Email test@example.com already registered`);
    await expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith('1234567890');
    await expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith('test@example.com');
    await expect(patientRepositoryMock.create).not.toHaveBeenCalled();
    await expect(patientRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should successfully create and save a new patient', async () => {
            patientRepositoryMock.findByCpf.mockResolvedValue(null);
            patientRepositoryMock.findByEmail.mockResolvedValue(null);
            const createdPatient = { id: 'new-id', name: 'Test', birthDate: '2000-01-01T00:00:00.000Z', cpf: '1234567890', email: 'test@example.com' };
            patientRepositoryMock.create.mockReturnValue(createdPatient);
            patientRepositoryMock.save.mockResolvedValue(createdPatient);

            const result = await service.createPatient({ cpf: '1234567890', name: 'Test', birthDate: '2000-01-01', email: 'test@example.com' });

            await expect(result).toEqual(createdPatient);
            await expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith('1234567890');
            await expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith('test@example.com');
            await expect(patientRepositoryMock.create).toHaveBeenCalledWith({
              name: 'Test',
              birthDate: new Date('2000-01-01'),
              cpf: '1234567890',
              email: 'test@example.com',
            });
            await expect(patientRepositoryMock.save).toHaveBeenCalledWith(createdPatient);
        });


});
});

  describe('FN_updatePatient_END', () => {
describe('updatePatient', () => {
  it('should update patient details successfully when no email conflict exists', async () => {
    const patientId = '1';
    const dto = {
      name: 'New Name',
      email: 'new.email@example.com',
      birthDate: '2000-01-01',
    };

    const patient = {
      id: patientId,
      name: 'Old Name',
      email: 'old.email@example.com',
      birthDate: new Date('1990-01-01'),
      cpf: '1234567890',
      sex: Sex.M,
      phone: null,
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      encounters: [],
    };

    const existingEmail = null;

    patientRepositoryMock.findByEmail.mockResolvedValue(existingEmail);
    patientRepositoryMock.update.mockResolvedValue(patient);
    patientRepositoryMock.findById.mockResolvedValue(patient);

    await service.updatePatient(patientId, dto);

    expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith('new.email@example.com');
    expect(patientRepositoryMock.update).toHaveBeenCalledWith(patient, {
      name: 'New Name',
      email: 'new.email@example.com',
      birthDate: new Date('2000-01-01'),
    });
  });

  it('should throw ConflictException if the new email already exists', async () => {
        const patientId = '1';
        const dto = {
          email: 'existing@example.com',
        };

        const patient = {
          id: patientId,
          name: 'Old Name',
          email: 'old.email@example.com',
          birthDate: new Date('1990-01-01'),
          cpf: '1234567890',
          sex: Sex.M,
          phone: null,
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
          encounters: [],
        };

        const existingEmail = 'existing@example.com';

        patientRepositoryMock.findById.mockResolvedValue(patient);
        patientRepositoryMock.findByEmail.mockResolvedValue(existingEmail);
        
        await expect(service.updatePatient(patientId, dto)).rejects.toThrow(ConflictException);
        await expect(service.updatePatient(patientId, dto)).rejects.toThrow(`Email ${dto.email} already registered`);
        
        expect(patientRepositoryMock.update).not.toHaveBeenCalled();
      });

});
});

  describe('FN_findByCpfOrFail_END', () => {
describe('findByCpfOrFail', () => {
  it('should throw NotFoundException if patient with cpf is not found', async () => {
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
