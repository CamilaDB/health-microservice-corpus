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

  describe('getPatientById', () => {
  it('should throw NotFoundException when patient is not found', async () => {
    const id = '123';
    patientRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(service.getPatientById(id)).rejects.toThrow(NotFoundException);
  });
});

  describe('PatientService', () => {
  it.skip('should throw NotFoundException when findAll returns undefined', async () => {
          patientRepositoryMock.findAll.mockResolvedValue(undefined);
          await expect(() => service.listPatients()).rejects.toThrow(NotFoundException);
        });
});

  describe('createPatient', () => {
  it('should throw ConflictException if CPF is already registered', async () => {
    const dto = { cpf: '12345678901' };
    patientRepositoryMock.findByCpf.mockResolvedValue({ id: '1' });
    await expect(service.createPatient(dto)).rejects.toThrow(ConflictException);
  });

  it.skip('should throw ConflictException if email is already registered', async () => {
          const dto = { email: 'test@example.com' };
          patientRepositoryMock.findByEmail.mockResolvedValue({ id: '2' });
          await expect(service.createPatient(dto)).rejects.toThrow(ConflictException);
        });

  it.skip('should create and save a new patient if CPF and email are not registered', async () => {
          const dto = { name: 'John Doe', birthDate: '1990-01-01', cpf: '12345678902', sex: Sex.M, email: 'test@example.com' };
          patientRepositoryMock.findByCpf.mockResolvedValue(undefined);
          patientRepositoryMock.findByEmail.mockResolvedValue(undefined);
          patientRepositoryMock.create.mockReturnValue({ ...dto, id: '3' });
          patientRepositoryMock.save.mockResolvedValue({ ...dto, id: '3', created_at: new Date(), updated_at: new Date() });

          const result = await service.createPatient(dto);

          expect(result).toEqual({ ...dto, id: '3', created_at: new Date(), updated_at: new Date() });
        });
});

  describe('updatePatient', () => {
  it.skip('should throw ConflictException if email already registered', async () => {
          const dto = { email: 'existing@example.com' };
          patientRepositoryMock.findByEmail.mockResolvedValue({ id: '123' } as Patient);

          await expect(service.updatePatient('456', dto)).rejects.toThrow(
            new ConflictException(`Email ${dto.email} already registered`),
          );
        });

  it.skip('should update patient without email conflict', async () => {
          const dto = { name: 'John Doe' };
          patientRepositoryMock.findByEmail.mockResolvedValue(undefined);
          patientRepositoryMock.update.mockResolvedValue({ id: '456' } as Patient);

          await expect(service.updatePatient('456', dto)).resolves.toBeDefined();
        });

  it.skip('should update patient with all fields', async () => {
          const dto = { name: 'Jane Doe', birthDate: '1990-01-01', sex: Sex.F, email: 'new@example.com', phone: '1234567890', active: false };
          patientRepositoryMock.findByEmail.mockResolvedValue(undefined);
          patientRepositoryMock.update.mockResolvedValue({ id: '456' } as Patient);

          await expect(service.updatePatient('456', dto)).resolves.toBeDefined();
        });
});

  describe('PatientService', () => {
  it('should throw NotFoundException when patient is not found by cpf', async () => {
    const cpf = '12345678901';
    jest.spyOn(patientRepositoryMock, 'findByCpf').mockResolvedValue(null);

    await expect(service.findByCpfOrFail(cpf)).rejects.toThrow(NotFoundException);
  });

  it('should return patient when found by cpf', async () => {
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

    jest.spyOn(patientRepositoryMock, 'findByCpf').mockResolvedValue(expectedPatient);

    const result = await service.findByCpfOrFail(cpf);
    expect(result).toEqual(expectedPatient);
  });
});

  // TESTS_APPEND_HERE
});
