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
    const id = 'nonexistent-id';
    patientRepositoryMock.findById.mockResolvedValueOnce(undefined);

    await expect(service.getPatientById(id)).rejects.toThrow(NotFoundException);
    expect(patientRepositoryMock.findById).toHaveBeenCalledWith(id);
  });

  it('should return patient when found', async () => {
    const id = 'existing-id';
    const expectedPatient: Patient = { id, name: 'John Doe', birthDate: new Date(), cpf: '12345678901', sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] };
    patientRepositoryMock.findById.mockResolvedValueOnce(expectedPatient);

    const result = await service.getPatientById(id);
    expect(result).toEqual(expectedPatient);
    expect(patientRepositoryMock.findById).toHaveBeenCalledWith(id);
  });
});
});

  describe('FN_listPatients_END', () => {
describe('listPatients', () => {
  it('should return a list of patients when repository returns a non-empty array', async () => {
    // arrange: mock dependencies
    const expectedPatients: Patient[] = [
      { id: '1', name: 'John Doe', birthDate: new Date(), cpf: '12345678901', sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] },
      { id: '2', name: 'Jane Doe', birthDate: new Date(), cpf: '98765432109', sex: Sex.F, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] }
    ];
    patientRepositoryMock.findAll.mockResolvedValue(expectedPatients);

    // act: call the service method
    const result = await service.listPatients();

    // assert: verify result or thrown exception
    expect(result).toEqual(expectedPatients);
  });

  it('should return an empty array when repository returns an empty array', async () => {
    // arrange: mock dependencies
    patientRepositoryMock.findAll.mockResolvedValue([]);

    // act: call the service method
    const result = await service.listPatients();

    // assert: verify result or thrown exception
    expect(result).toEqual([]);
  });
});
});

  describe('FN_createPatient_END', () => {
describe('createPatient', () => {
  it('should throw ConflictException if CPF already registered', async () => {
    const dto: CreatePatientDto = {
      name: 'John Doe',
      birthDate: '1990-01-01',
      cpf: '123.456.789-00',
      sex: Sex.M,
    };

    patientRepositoryMock.findByCpf.mockResolvedValueOnce({} as Patient);

    await expect(service.createPatient(dto)).rejects.toThrow(ConflictException);
  });

  it('should throw ConflictException if email already registered', async () => {
    const dto: CreatePatientDto = {
      name: 'John Doe',
      birthDate: '1990-01-01',
      cpf: '123.456.789-00',
      sex: Sex.M,
      email: 'john.doe@example.com',
    };

    patientRepositoryMock.findByCpf.mockResolvedValueOnce(undefined);
    patientRepositoryMock.findByEmail.mockResolvedValueOnce({} as Patient);

    await expect(service.createPatient(dto)).rejects.toThrow(ConflictException);
  });

  it('should create and save a new patient if CPF and email are unique', async () => {
    const dto: CreatePatientDto = {
      name: 'John Doe',
      birthDate: '1990-01-01',
      cpf: '123.456.789-00',
      sex: Sex.M,
      email: 'john.doe@example.com',
    };

    patientRepositoryMock.findByCpf.mockResolvedValueOnce(undefined);
    patientRepositoryMock.findByEmail.mockResolvedValueOnce(undefined);
    patientRepositoryMock.create.mockReturnValueOnce({} as Patient);
    patientRepositoryMock.save.mockResolvedValueOnce({ id: '1', ...dto } as Patient);

    const result = await service.createPatient(dto);

    expect(result).toEqual({ id: '1', ...dto });
  });
});
});

  describe('FN_updatePatient_END', () => {
describe('updatePatient', () => {
  it.skip('should update patient with new data', async () => {
        const id = '123';
        const dto: UpdatePatientDto = { name: 'John Doe' };
        const patient: Patient = { id, name: 'Jane Doe', email: null, phone: null, active: true, birthDate: new Date(), cpf: '', sex: Sex.M, created_at: new Date(), updated_at: new Date(), encounters: [] };

        patientRepositoryMock.getPatientById.mockResolvedValue(patient);
        patientRepositoryMock.update.mockReturnValue(patient);

        const result = await service.updatePatient(id, dto);

        expect(result).toEqual(patient);
      });

  it.skip('should throw ConflictException if email is already registered', async () => {
        const id = '123';
        const dto: UpdatePatientDto = { email: 'existing@example.com' };
        const patient: Patient = { id, name: 'Jane Doe', email: null, phone: null, active: true, birthDate: new Date(), cpf: '', sex: Sex.M, created_at: new Date(), updated_at: new Date(), encounters: [] };

        patientRepositoryMock.getPatientById.mockResolvedValue(patient);
        patientRepositoryMock.findByEmail.mockResolvedValue({ id: '456', name: 'Existing User', email: dto.email.toLowerCase(), phone: null, active: true, birthDate: new Date(), cpf: '', sex: Sex.M, created_at: new Date(), updated_at: new Date(), encounters: [] });

        await expect(service.updatePatient(id, dto)).rejects.toThrow(ConflictException);
      });
});
});

  describe('FN_findByCpfOrFail_END', () => {
describe('findByCpfOrFail', () => {
  it('should throw NotFoundException when patient is not found', async () => {
    const cpf = '123.456.789-00';
    patientRepositoryMock.findByCpf.mockResolvedValueOnce(undefined);

    await expect(service.findByCpfOrFail(cpf)).rejects.toThrow(NotFoundException);
  });
});
});

  // TESTS_APPEND_HERE
});
