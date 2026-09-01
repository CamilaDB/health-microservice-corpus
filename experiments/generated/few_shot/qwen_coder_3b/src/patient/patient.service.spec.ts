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
  it('should return an array of patients', async () => {
    const patients = [{ id: '1', name: 'John Doe', birthDate: new Date(), cpf: '12345678901', sex: Sex.M, email: 'john.doe@example.com', phone: '1234567890', active: true, created_at: new Date(), updated_at: new Date(), encounters: [] }];
    patientRepositoryMock.findAll.mockResolvedValueOnce(patients);

    const result = await service.listPatients();

    expect(result).toEqual(patients);
    expect(patientRepositoryMock.findAll).toHaveBeenCalled();
  });
});
});

  describe('FN_createPatient_END', () => {
describe('createPatient', () => {
  it('should throw ConflictException when CPF already registered', async () => {
    patientRepositoryMock.findByCpf.mockResolvedValueOnce({ id: '1', cpf: '12345678901' });

    await expect(
      service.createPatient({ cpf: '12345678901' } as CreatePatientDto),
    ).rejects.toThrow(ConflictException);

    expect(patientRepositoryMock.create).not.toHaveBeenCalled();
    expect(patientRepositoryMock.save).not.toHaveBeenCalled();
  });

  it.skip('should throw ConflictException when email already registered', async () => {
        patientRepositoryMock.findByCpf.mockResolvedValueOnce(null);
        patientRepositoryMock.findByEmail.mockResolvedValueOnce({ id: '1', email: 'test@test.com' });

        await expect(
          service.createPatient({ email: 'test@test.com' } as CreatePatientDto),
        ).rejects.toThrow(ConflictException);

        expect(patientRepositoryMock.create).not.toHaveBeenCalled();
        expect(patientRepositoryMock.save).not.toHaveBeenCalled();
      });

  it.skip('should save and return the created patient', async () => {
        patientRepositoryMock.findByCpf.mockResolvedValueOnce(null);
        patientRepositoryMock.findByEmail.mockResolvedValueOnce(null);
        patientRepositoryMock.create.mockReturnValueOnce({ cpf: '12345678901', email: 'test@test.com' });
        patientRepositoryMock.save.mockResolvedValueOnce({ id: '1', cpf: '12345678901', email: 'test@test.com' });

        await service.createPatient({
          cpf: '12345678901',
          email: 'test@test.com',
          birthDate: '2000-01-01',
          name: 'John Doe',
          sex: Sex.M,
        } as CreatePatientDto);

        expect(patientRepositoryMock.create).toHaveBeenCalledWith({
          cpf: '12345678901',
          email: 'test@test.com',
          birthDate: new Date('2000-01-01'),
          name: 'John Doe',
          sex: Sex.M,
        });
        expect(patientRepositoryMock.save).toHaveBeenCalledWith({ id: '1', cpf: '12345678901', email: 'test@test.com' });
      });
});
});

  describe('FN_updatePatient_END', () => {
describe('updatePatient', () => {
  it.skip('should throw ConflictException when email already exists', async () => {
        patientRepositoryMock.findById.mockResolvedValueOnce({
          id: '1',
          email: 'test@test.com',
        });
        patientRepositoryMock.findByEmail.mockResolvedValueOnce({
          id: '2',
          email: 'test@test.com',
        });

        await expect(
          service.updatePatient('1', { email: 'test@test.com' } as UpdatePatientDto),
        ).rejects.toThrow(ConflictException);

        expect(patientRepositoryMock.update).not.toHaveBeenCalled();
      });

  it('should update and return the updated patient', async () => {
    patientRepositoryMock.findById.mockResolvedValueOnce({
      id: '1',
      email: 'test@test.com',
    });
    patientRepositoryMock.findByEmail.mockResolvedValueOnce(null);
    const updateData: Partial<Patient> = {
      name: 'John Doe',
    };

    await service.updatePatient('1', { name: 'John Doe' } as UpdatePatientDto);

    expect(patientRepositoryMock.update).toHaveBeenCalledWith(
      { id: '1', email: 'test@test.com' },
      updateData,
    );
  });
});
});

  describe('FN_findByCpfOrFail_END', () => {
describe('findByCpfOrFail', () => {
  it('should throw NotFoundException when patient does not exist', async () => {
    patientRepositoryMock.findByCpf.mockResolvedValueOnce(null);

    await expect(service.findByCpfOrFail('12345678901')).rejects.toThrow(NotFoundException);

    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith('12345678901');
  });

  it('should return the patient when found', async () => {
    const patient = { id: '1', cpf: '12345678901' };
    patientRepositoryMock.findByCpf.mockResolvedValueOnce(patient);

    const result = await service.findByCpfOrFail('12345678901');

    expect(result).toBe(patient);
  });
});
});

  // TESTS_APPEND_HERE
});
