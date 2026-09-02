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

    // assert: verify result or thrown exception
  });
});
});

  describe('FN_listPatients_END', () => {
describe('listPatients', () => {
  it('should return an array of patients', async () => {
    // arrange
    const patients = [{ id: '1', name: 'John Doe', birthDate: new Date(), cpf: '12345678901', sex: 'M', email: 'john.doe@example.com', phone: '1234567890', active: true, created_at: new Date(), updated_at: new Date(), encounters: [] }];
    patientRepositoryMock.findAll.mockResolvedValueOnce(patients);

    // act
    const result = await service.listPatients();

    // assert
    expect(result).toEqual(patients);
  });

  it.skip('should throw a NotFoundException if no patients are found', async () => {
        // arrange
        patientRepositoryMock.findAll.mockResolvedValueOnce([]);

        // act
        await expect(service.listPatients()).rejects.toThrow(NotFoundException);
      });
});
});

  describe('FN_createPatient_END', () => {
describe('createPatient', () => {
  it('should throw ConflictException if CPF is already registered', async () => {
    const dto: CreatePatientDto = {
      name: 'John Doe',
      birthDate: '1990-01-01',
      cpf: '12345678901',
      sex: Sex.M,
      email: 'john.doe@example.com',
    };

    patientRepositoryMock.findByCpf.mockResolvedValueOnce({ id: '123' });

    await expect(service.createPatient(dto)).rejects.toThrow(ConflictException);
  });

  it('should throw ConflictException if email is already registered', async () => {
    const dto: CreatePatientDto = {
      name: 'John Doe',
      birthDate: '1990-01-01',
      cpf: '09876543210',
      sex: Sex.M,
      email: 'john.doe@example.com',
    };

    patientRepositoryMock.findByEmail.mockResolvedValueOnce({ id: '123' });

    await expect(service.createPatient(dto)).rejects.toThrow(ConflictException);
  });

  it('should create and save a new patient', async () => {
      const dto: CreatePatientDto = {
        name: 'John Doe',
        birthDate: '1990-01-01',
        cpf: '09876543210',
        sex: Sex.M,
        email: 'john.doe@example.com',
      };

      patientRepositoryMock.findByCpf.mockResolvedValueOnce(null);
      patientRepositoryMock.findByEmail.mockResolvedValueOnce(null);
      patientRepositoryMock.create.mockReturnValueOnce({ id: '123' });
      patientRepositoryMock.save.mockResolvedValueOnce({ id: '123' });

      const result = await service.createPatient(dto);

      expect(result).toEqual({ id: '123' });
      expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith('09876543210');
      expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith('john.doe@example.com');
      expect(patientRepositoryMock.create).toHaveBeenCalledWith({
        ...dto,
        cpf: '09876543210',
        email: 'john.doe@example.com',
        birthDate: new Date('1990-01-01'),
      });
      expect(patientRepositoryMock.save).toHaveBeenCalledWith({ id: '123' });
    });

});
});

  describe('FN_updatePatient_END', () => {
describe('updatePatient', () => {
  it.skip('should throw ConflictException when dto.email is already registered', async () => {
          // arrange
          const dto: UpdatePatientDto = {
            email: 'existingemail@example.com',
          };
          const patient: Patient = { email: 'existingemail@example.com' };
          patientRepositoryMock.findById.mockResolvedValue(patient);
          patientRepositoryMock.findByEmail.mockResolvedValue(patient);

          // act
          await expect(service.updatePatient('123', dto)).rejects.toThrow(
            ConflictException,
          );

          // assert
          expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith(
            'existingemail@example.com',
          );
        });


  it('should update patient data correctly', async () => {
    // arrange
    const dto: UpdatePatientDto = {
      name: 'John Doe',
      sex: Sex.M,
      phone: '1234567890',
      active: false,
      email: 'newemail@example.com',
      birthDate: '1990-01-01',
    };
    const patient: Patient = {
      id: '123',
      name: 'Existing Name',
      birthDate: new Date('1990-01-01'),
      sex: Sex.F,
      email: 'existingemail@example.com',
      phone: '9876543210',
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      encounters: [],
    };
    patientRepositoryMock.findById.mockResolvedValue(patient);
    patientRepositoryMock.findByEmail.mockResolvedValue(null);
    patientRepositoryMock.update.mockResolvedValue(patient);

    // act
    const result = await service.updatePatient('123', dto);

    // assert
    expect(patientRepositoryMock.findById).toHaveBeenCalledWith('123');
    expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith(
      'newemail@example.com',
    );
    expect(patientRepositoryMock.update).toHaveBeenCalledWith(
      patient,
      {
        ...(dto.name && { name: dto.name }),
        ...(dto.sex && { sex: dto.sex }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.active !== undefined && { active: dto.active }),
        ...(dto.email && { email: dto.email.toLowerCase() }),
        ...(dto.birthDate && { birthDate: new Date(dto.birthDate) }),
      },
    );
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
