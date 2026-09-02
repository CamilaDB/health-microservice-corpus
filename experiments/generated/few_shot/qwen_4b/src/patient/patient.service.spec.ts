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
    const patient = { id: '1', name: 'John Doe', birthDate: new Date(), cpf: '123.456.789-00' };
    patientRepositoryMock.findById.mockResolvedValueOnce(patient);

    const result = await service.getPatientById('1');

    expect(result).toBe(patient);
  });
});
});

  describe('FN_listPatients_END', () => {
describe('listPatients', () => {
  it('should return all patients from repository', async () => {
    const patients = [
      { id: '1', name: 'John Doe' },
      { id: '2', name: 'Jane Smith' }
    ];

    patientRepositoryMock.findAll.mockResolvedValueOnce(patients);

    const result = await service.listPatients();

    expect(result).toEqual(patients);
  });
});
});

  describe('FN_createPatient_END', () => {
describe('createPatient', () => {
  it('should throw ConflictException when CPF already exists', async () => {
    patientRepositoryMock.findByCpf.mockResolvedValueOnce({ id: '1' } as Patient);

    await expect(
      service.createPatient({ cpf: '123.456.789-00', name: 'Test' } as CreatePatientDto),
    ).rejects.toThrow(ConflictException);

    expect(patientRepositoryMock.findByEmail).not.toHaveBeenCalled();
    expect(patientRepositoryMock.create).not.toHaveBeenCalled();
    expect(patientRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw ConflictException when email already exists', async () => {
    patientRepositoryMock.findByCpf.mockResolvedValueOnce(null);
    patientRepositoryMock.findByEmail.mockResolvedValueOnce({ id: '1' } as Patient);

    await expect(
      service.createPatient({ cpf: '123.456.789-00', email: 'test@test.com', name: 'Test' } as CreatePatientDto),
    ).rejects.toThrow(ConflictException);

    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith('12345678900');
    expect(patientRepositoryMock.create).not.toHaveBeenCalled();
    expect(patientRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should save and return the created patient', async () => {
    patientRepositoryMock.findByCpf.mockResolvedValueOnce(null);
    patientRepositoryMock.findByEmail.mockResolvedValueOnce(null);

    const dto = { cpf: '123.456.789-00', email: 'test@test.com', name: 'Test', birthDate: '2000-01-01', sex: Sex.M };
    const createdPatient = { id: '1' } as Patient;

    patientRepositoryMock.create.mockReturnValueOnce(createdPatient);
    patientRepositoryMock.save.mockResolvedValueOnce(createdPatient);

    await service.createPatient(dto as CreatePatientDto);

    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith('12345678900');
    expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith('test@test.com');
    expect(patientRepositoryMock.save).toHaveBeenCalledWith(createdPatient);
  });
});
});

  describe('FN_updatePatient_END', () => {
describe('updatePatient', () => {
  it('should throw ConflictException when email already exists', async () => {
        patientRepositoryMock.findByEmail.mockResolvedValueOnce({ id: '1' });
        service.patientRepository.findById.mockResolvedValueOnce({ id: '1', email: 'old@test.com' });

        await expect(
          service.updatePatient('1', { email: 'test@test.com' } as UpdatePatientDto),
        ).rejects.toThrow(ConflictException);

        expect(patientRepositoryMock.update).not.toHaveBeenCalled();
      });


  it('should update patient with all fields', async () => {
        const patient = { id: '1', email: 'old@test.com' };
        patientRepositoryMock.findById.mockResolvedValueOnce(patient);

        patientRepositoryMock.findByEmail.mockResolvedValueOnce(undefined);

        const updateData = { name: 'John', sex: Sex.M, phone: '123', active: true, email: 'new@test.com', birthDate: new Date('2020-01-01') };
        patientRepositoryMock.update.mockResolvedValueOnce(patient);

        await service.updatePatient('1', updateData as UpdatePatientDto);

        expect(patientRepositoryMock.update).toHaveBeenCalledWith(patient, { name: 'John', sex: Sex.M, phone: '123', active: true, email: 'new@test.com', birthDate: new Date('2020-01-01') });
      });


  it('should update patient with partial fields', async () => {
    const patient = { id: '1', email: 'old@test.com' };
    patientRepositoryMock.findById.mockResolvedValueOnce(patient);

    const updateData = { name: 'John', sex: Sex.M };
    patientRepositoryMock.update.mockResolvedValueOnce(patient);

    await service.updatePatient('1', updateData as UpdatePatientDto);

    expect(patientRepositoryMock.update).toHaveBeenCalledWith(patient, { name: 'John', sex: Sex.M });
  });
});
});

  describe('FN_findByCpfOrFail_END', () => {
describe('findByCpfOrFail', () => {
  it('should throw NotFoundException when patient not found', async () => {
    patientRepositoryMock.findByCpf.mockResolvedValueOnce(undefined);

    await expect(
      service.findByCpfOrFail('123.456.789-00'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should return the patient when found', async () => {
    const patient = { id: '1', name: 'John Doe', cpf: '123.456.789-00' };
    patientRepositoryMock.findByCpf.mockResolvedValueOnce(patient);

    const result = await service.findByCpfOrFail('123.456.789-00');

    expect(result).toBe(patient);
  });
});
});

  // TESTS_APPEND_HERE
});
