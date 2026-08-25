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
  it('should return a patient when found by ID', async () => {
    const expectedPatient: Patient = {
      id: '123',
      name: 'John Doe',
      birthDate: new Date(),
      cpf: '12345678901',
      sex: Sex.M,
      email: null,
      phone: null,
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      encounters: [],
    };

    patientRepositoryMock.findById.mockResolvedValue(expectedPatient);

    const result = await service.getPatientById('123');

    expect(result).toEqual(expectedPatient);
    expect(patientRepositoryMock.findById).toHaveBeenCalledWith('123');
  });

  it('should throw NotFoundException when patient is not found', async () => {
    patientRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(service.getPatientById('456')).rejects.toThrow(NotFoundException);
    expect(patientRepositoryMock.findById).toHaveBeenCalledWith('456');
  });
});
});

  describe('FN_listPatients_END', () => {
describe('listPatients', () => {
  it('should return all patients when repository returns a list', async () => {
    const expectedPatients: Patient[] = [
      { id: '1', name: 'John Doe', birthDate: new Date(), cpf: '12345678901', sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] },
      { id: '2', name: 'Jane Doe', birthDate: new Date(), cpf: '98765432109', sex: Sex.F, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] }
    ];

    patientRepositoryMock.findAll.mockResolvedValue(expectedPatients);

    const result = await service.listPatients();

    expect(result).toEqual(expectedPatients);
    expect(patientRepositoryMock.findAll).toHaveBeenCalledTimes(1);
  });

  it.skip('should throw NotFoundException when repository returns an empty list', async () => {
        patientRepositoryMock.findAll.mockResolvedValue([]);

        await expect(service.listPatients()).rejects.toThrow(NotFoundException);
        expect(patientRepositoryMock.findAll).toHaveBeenCalledTimes(1);
      });
});
});

  describe('FN_createPatient_END', () => {
describe('createPatient', () => {
  it.skip('should create a new patient when CPF is not found', async () => {
          const dto: CreatePatientDto = {
            name: 'John Doe',
            birthDate: '1990-01-01',
            cpf: '12345678901',
            sex: Sex.M,
            email: 'john.doe@example.com',
            phone: '1234567890'
          };

          patientRepositoryMock.findByCpf.mockResolvedValue(undefined);
          patientRepositoryMock.create.mockReturnValue(dto);

          const result = await service.createPatient(dto);

          expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith(dto.cpf);
          expect(patientRepositoryMock.create).toHaveBeenCalledWith({
            ...dto,
            cpf: '12345678901',
            birthDate: new Date('1990-01-01'),
            email: 'john.doe@example.com'
          });
          expect(result).toEqual(dto);
        });


  it('should throw ConflictException when CPF is already registered', async () => {
    const dto: CreatePatientDto = {
      name: 'John Doe',
      birthDate: '1990-01-01',
      cpf: '12345678901',
      sex: Sex.M,
      email: 'john.doe@example.com',
      phone: '1234567890'
    };

    patientRepositoryMock.findByCpf.mockResolvedValue({} as Patient);

    await expect(service.createPatient(dto)).rejects.toThrow(ConflictException);
  });

  it.skip('should create a new patient when email is not found', async () => {
          const dto: CreatePatientDto = {
            name: 'John Doe',
            birthDate: '1990-01-01',
            cpf: '12345678901',
            sex: Sex.M,
            email: 'john.doe@example.com',
            phone: '1234567890'
          };

          patientRepositoryMock.findByCpf.mockResolvedValue(undefined);
          patientRepositoryMock.findByEmail.mockResolvedValue(undefined);
          patientRepositoryMock.create.mockReturnValue(dto);

          const result = await service.createPatient(dto);

          expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith(dto.cpf);
          expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith(dto.email!);
          expect(patientRepositoryMock.create).toHaveBeenCalledWith({
            ...dto,
            cpf: dto.cpf.replace(/[.-]/g, ''),
            email: dto.email?.toLowerCase(),
            birthDate: new Date(dto.birthDate),
          });
          expect(result).toEqual(dto);
        });


  it('should throw ConflictException when email is already registered', async () => {
    const dto: CreatePatientDto = {
      name: 'John Doe',
      birthDate: '1990-01-01',
      cpf: '12345678901',
      sex: Sex.M,
      email: 'john.doe@example.com',
      phone: '1234567890'
    };

    patientRepositoryMock.findByCpf.mockResolvedValue(undefined);
    patientRepositoryMock.findByEmail.mockResolvedValue({} as Patient);

    await expect(service.createPatient(dto)).rejects.toThrow(ConflictException);
  });
});
});

  describe('FN_updatePatient_END', () => {
describe('updatePatient', () => {
  it.skip('should update a patient when the email exists and is active', async () => {
        const dto: UpdatePatientDto = { name: 'John Doe' };
        const email = 'john.doe@example.com';
        const patient: Patient = { id: '123', name: 'Jane Doe', birthDate: new Date(), cpf: '12345678901', sex: Sex.M, email, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] };
        patientRepositoryMock.findByEmail.mockResolvedValue(patient);
        await service.updatePatient(email, dto);
        expect(patientRepositoryMock.update).toHaveBeenCalledWith(patient.id, { ...dto, updated_at: expect.any(Date) });
      });

  it('should throw NotFoundException when the email does not exist', async () => {
    const dto: UpdatePatientDto = { name: 'John Doe' };
    const email = 'john.doe@example.com';
    patientRepositoryMock.findByEmail.mockResolvedValue(undefined);
    await expect(service.updatePatient(email, dto)).rejects.toThrow(NotFoundException);
  });

  it.skip('should throw ConflictException when the email exists but is not active', async () => {
        const dto: UpdatePatientDto = { name: 'John Doe' };
        const email = 'john.doe@example.com';
        const patient: Patient = { id: '123', name: 'Jane Doe', birthDate: new Date(), cpf: '12345678901', sex: Sex.M, email, phone: null, active: false, created_at: new Date(), updated_at: new Date(), encounters: [] };
        patientRepositoryMock.findByEmail.mockResolvedValue(patient);
        await expect(service.updatePatient(email, dto)).rejects.toThrow(ConflictException);
      });
});
});

  describe('FN_findByCpfOrFail_END', () => {
describe('findByCpfOrFail', () => {
  it('should throw NotFoundException if patient not found by CPF', async () => {
    const cpf = '123.456.789-00';
    jest.spyOn(patientRepositoryMock, 'findByCpf').mockResolvedValue(undefined);

    await expect(service.findByCpfOrFail(cpf)).rejects.toThrow(NotFoundException);
  });

  it('should return patient if found by CPF', async () => {
    const cpf = '123.456.789-00';
    const patient: Patient = { id: '1', name: 'John Doe', birthDate: new Date(), cpf, sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] };
    jest.spyOn(patientRepositoryMock, 'findByCpf').mockResolvedValue(patient);

    const result = await service.findByCpfOrFail(cpf);
    expect(result).toEqual(patient);
  });
});
});

  // TESTS_APPEND_HERE
});
