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
  it('should throw NotFoundException when patient is not found', async () => {
    // arrange: mock dependencies
    patientRepositoryMock.findById.mockResolvedValueOnce(null);

    // act: call the service method
    await expect(service.getPatientById('123')).rejects.toThrow(NotFoundException);
  });
});
});

  describe('FN_listPatients_END', () => {
describe('listPatients', () => {
  it('should return an empty array when no patients are found', async () => {
    // arrange
    patientRepositoryMock.findAll.mockResolvedValue([]);

    // act
    const result = await service.listPatients();

    // assert
    expect(result).toEqual([]);
  });

  it.skip('should throw a NotFoundException when no patients are found', async () => {
        // arrange
        patientRepositoryMock.findAll.mockResolvedValue([]);

        // act
        await expect(service.listPatients()).rejects.toThrow(NotFoundException);
      });

  it('should return all patients when found', async () => {
    // arrange
    const patients = [
      { id: '1', name: 'John Doe', birthDate: new Date('1990-01-01'), cpf: '12345678901', sex: Sex.M, email: 'john.doe@example.com', phone: '1234567890', active: true, created_at: new Date(), updated_at: new Date(), encounters: [] },
      { id: '2', name: 'Jane Doe', birthDate: new Date('1990-01-02'), cpf: '09876543210', sex: Sex.F, email: 'jane.doe@example.com', phone: '0987654321', active: true, created_at: new Date(), updated_at: new Date(), encounters: [] },
    ];
    patientRepositoryMock.findAll.mockResolvedValue(patients);

    // act
    const result = await service.listPatients();

    // assert
    expect(result).toEqual(patients);
  });
});
});

  describe('FN_createPatient_END', () => {
describe('createPatient', () => {
  it('should throw ConflictException when CPF is already registered', async () => {
    const dto: CreatePatientDto = {
      name: 'John Doe',
      birthDate: '1990-01-01',
      cpf: '12345678901',
      sex: Sex.M,
      email: 'johndoe@example.com',
    };

    patientRepositoryMock.findByCpf.mockResolvedValueOnce({ id: '123' });

    await expect(service.createPatient(dto)).rejects.toThrow(ConflictException);
  });

  it('should throw ConflictException when email is already registered', async () => {
    const dto: CreatePatientDto = {
      name: 'John Doe',
      birthDate: '1990-01-01',
      cpf: '12345678902',
      sex: Sex.M,
      email: 'johndoe@example.com',
    };

    patientRepositoryMock.findByEmail.mockResolvedValueOnce({ id: '123' });

    await expect(service.createPatient(dto)).rejects.toThrow(ConflictException);
  });

  it('should create and save a new patient', async () => {
      const dto: CreatePatientDto = {
        name: 'John Doe',
        birthDate: '1990-01-01',
        cpf: '12345678903',
        sex: Sex.M,
        email: 'johndoe@example.com',
      };

      patientRepositoryMock.findByCpf.mockResolvedValueOnce(null);
      patientRepositoryMock.findByEmail.mockResolvedValueOnce(null);
      patientRepositoryMock.create.mockReturnValueOnce({ id: '123' });
      patientRepositoryMock.save.mockResolvedValueOnce({ id: '123' });

      const result = await service.createPatient(dto);

      expect(result).toEqual({ id: '123' });
      expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith('12345678903');
      expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith('johndoe@example.com');
      expect(patientRepositoryMock.create).toHaveBeenCalledWith({
        ...dto,
        cpf: '12345678903',
        email: 'johndoe@example.com',
        birthDate: new Date('1990-01-01'),
      });
      expect(patientRepositoryMock.save).toHaveBeenCalledWith({ id: '123' });
    });

});
});

  describe('FN_updatePatient_END', () => {
describe('updatePatient', () => {
  it.skip('should throw ConflictException when dto.email is already registered', async () => {
        const dto: UpdatePatientDto = { email: 'existing@example.com' };
        const patient: Patient = { id: '1', email: 'original@example.com' };
        patientRepositoryMock.findByEmail.mockResolvedValueOnce(patient);

        await expect(() => service.updatePatient('1', dto)).rejects.toThrow(
          ConflictException,
        );
      });

  it.skip('should update patient data correctly', async () => {
        const dto: UpdatePatientDto = { name: 'John Doe', email: 'new@example.com' };
        const patient: Patient = { id: '1', name: 'Jane Doe', email: 'original@example.com' };
        patientRepositoryMock.findByEmail.mockResolvedValueOnce(null);
        patientRepositoryMock.update.mockResolvedValueOnce(patient);

        const result = await service.updatePatient('1', dto);
        expect(result).toEqual(patient);
      });
});
});

  describe('FN_findByCpfOrFail_END', () => {
describe('findByCpfOrFail', () => {
  it('should throw NotFoundException when patient is not found', async () => {
    // arrange
    patientRepositoryMock.findByCpf.mockResolvedValueOnce(null);

    // act
    await expect(service.findByCpfOrFail('12345678901')).rejects.toThrow(NotFoundException);
  });
});
});

  // TESTS_APPEND_HERE
});
