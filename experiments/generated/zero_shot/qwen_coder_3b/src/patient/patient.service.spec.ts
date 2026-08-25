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
  it('should return a Patient if the patient exists', async () => {
    const patientId = '12345';
    const expectedPatient: Patient = {
      id: patientId,
      name: 'John Doe',
      birthDate: new Date(),
      cpf: '123.456.789-00',
      sex: Sex.M,
      email: 'john.doe@example.com',
      phone: '(11) 98765-4321',
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      encounters: [],
    };

    patientRepositoryMock.findById.mockResolvedValue(expectedPatient);

    const result = await service.getPatientById(patientId);

    expect(result).toEqual(expectedPatient);
  });

  it('should throw a NotFoundException if the patient does not exist', async () => {
    const patientId = '12345';

    patientRepositoryMock.findById.mockResolvedValue(undefined);

    try {
      await service.getPatientById(patientId);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toEqual(`Patient with id ${patientId} not found`);
    }
  });
});
});

  describe('FN_listPatients_END', () => {
describe('listPatients', () => {
  it('should return an empty array when no patients are found', async () => {
    patientRepositoryMock.findAll.mockResolvedValue([]);

    const result = await service.listPatients();

    expect(result).toEqual([]);
  });

  it('should throw a NotFoundException if the repository throws one', async () => {
    patientRepositoryMock.findAll.mockRejectedValue(new NotFoundException());

    try {
      await service.listPatients();
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });
});
});

  describe('FN_createPatient_END', () => {
describe('createPatient', () => {
  it.skip('should create a new patient and return the created patient', async () => {
        const dto: CreatePatientDto = {
          name: 'John Doe',
          birthDate: '1990-01-01',
          cpf: '12345678901',
          sex: Sex.M,
          email: 'john.doe@example.com',
          phone: '1234567890',
        };

        const expectedPatient = {
          id: expect.any(String),
          name: dto.name,
          birthDate: new Date(dto.birthDate),
          cpf: dto.cpf,
          sex: Sex.M,
          email: dto.email,
          phone: dto.phone,
          active: true,
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          encounters: [],
        };

        patientRepositoryMock.findByCpf.mockResolvedValue(null);
        patientRepositoryMock.findByEmail.mockResolvedValue(null);
        patientRepositoryMock.create.mockReturnValue(expectedPatient);
        patientRepositoryMock.save.mockResolvedValue(expectedPatient);

        const result = await service.createPatient(dto);

        expect(result).toEqual(expectedPatient);
        expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith(dto.cpf);
        expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith(dto.email);
        expect(patientRepositoryMock.create).toHaveBeenCalledWith(dto);
        expect(patientRepositoryMock.save).toHaveBeenCalledWith(expectedPatient);
      });

  it('should throw a ConflictException if the CPF already exists', async () => {
    const dto: CreatePatientDto = {
      name: 'John Doe',
      birthDate: '1990-01-01',
      cpf: '12345678901',
      sex: Sex.M,
      email: 'john.doe@example.com',
      phone: '1234567890',
    };

    patientRepositoryMock.findByCpf.mockResolvedValue({ id: 'existingPatientId' });

    await expect(service.createPatient(dto)).rejects.toThrow(ConflictException);
  });

  it('should throw a ConflictException if the email already exists', async () => {
    const dto: CreatePatientDto = {
      name: 'John Doe',
      birthDate: '1990-01-01',
      cpf: '12345678902',
      sex: Sex.M,
      email: 'john.doe@example.com',
      phone: '1234567890',
    };

    patientRepositoryMock.findByEmail.mockResolvedValue({ id: 'existingPatientId' });

    await expect(service.createPatient(dto)).rejects.toThrow(ConflictException);
  });
});
});

  describe('FN_updatePatient_END', () => {
describe('updatePatient', () => {
  it('should throw NotFoundException when patient is not found by email', async () => {
    const dto: UpdatePatientDto = { name: 'Updated Name' };
    jest.spyOn(patientRepositoryMock, 'findByEmail').mockResolvedValueOnce(null);

    await expect(service.updatePatient(dto, 'nonexistent@example.com')).rejects.toThrow(NotFoundException);
  });

  it.skip('should update patient details correctly', async () => {
        const dto: UpdatePatientDto = { name: 'Updated Name' };
        const patient: Patient = {
          id: '123',
          name: 'Original Name',
          birthDate: new Date(),
          cpf: '12345678901',
          sex: Sex.M,
          email: 'existing@example.com',
          phone: '1234567890',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
          encounters: [],
        };
        jest.spyOn(patientRepositoryMock, 'findByEmail').mockResolvedValueOnce(patient);
        jest.spyOn(patientRepositoryMock, 'update').mockResolvedValueOnce(patient);

        await expect(service.updatePatient(dto, 'existing@example.com')).resolves.toEqual(patient);
      });

  it.skip('should throw ConflictException when patient with the same email already exists', async () => {
        const dto: UpdatePatientDto = { name: 'Updated Name' };
        const existingPatient: Patient = {
          id: '123',
          name: 'Existing Name',
          birthDate: new Date(),
          cpf: '12345678901',
          sex: Sex.M,
          email: 'existing@example.com',
          phone: '1234567890',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
          encounters: [],
        };
        const newPatient: Patient = {
          id: '456',
          name: 'Updated Name',
          birthDate: new Date(),
          cpf: '12345678901',
          sex: Sex.M,
          email: 'existing@example.com',
          phone: '1234567890',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
          encounters: [],
        };
        jest.spyOn(patientRepositoryMock, 'findByEmail').mockResolvedValueOnce(existingPatient);
        jest.spyOn(patientRepositoryMock, 'update').mockResolvedValueOnce(newPatient);

        await expect(service.updatePatient(dto, 'existing@example.com')).rejects.toThrow(ConflictException);
      });
});
});

  describe('FN_findByCpfOrFail_END', () => {
describe('findByCpfOrFail', () => {
  it('should throw NotFoundException when patient is not found by CPF', async () => {
    const cpf = '12345678901';
    patientRepositoryMock.findByCpf.mockResolvedValueOnce(null);

    await expect(service.findByCpfOrFail(cpf)).rejects.toThrow(NotFoundException);
  });

  it('should return the patient when found by CPF', async () => {
    const cpf = '12345678901';
    const expectedPatient: Patient = {
      id: 'patientId',
      name: 'John Doe',
      birthDate: new Date(),
      cpf,
      sex: Sex.M,
      email: null,
      phone: null,
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      encounters: [],
    };
    patientRepositoryMock.findByCpf.mockResolvedValueOnce(expectedPatient);

    const result = await service.findByCpfOrFail(cpf);
    expect(result).toEqual(expectedPatient);
  });
});
});

  // TESTS_APPEND_HERE
});
