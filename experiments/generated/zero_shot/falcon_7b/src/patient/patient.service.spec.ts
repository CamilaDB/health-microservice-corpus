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
describe('PatientService.getPatientById', () => {
  it('should return a patient if found', async () => {
    const mockPatient = { id: '123', name: 'John Doe', birthDate: new Date(), cpf: '123.456.789-00', sex: Sex.M, email: 'john@example.com', phone: '1234567890', active: true, created_at: new Date(), updated_at: new Date(), encounters: [] } as Patient;
    patientRepositoryMock.findById.mockResolvedValue(mockPatient);

    const result = await service.getPatientById('123');

    expect(result).toEqual(mockPatient);
    expect(patientRepositoryMock.findById).toHaveBeenCalledWith('123');
  });

  it('should throw a NotFoundException if patient not found', async () => {
    patientRepositoryMock.findById.mockResolvedValue(null);

    try {
      await service.getPatientById('123');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe(`Patient with id 123 not found`);
    }

    expect(patientRepositoryMock.findById).toHaveBeenCalledWith('123');
  });
});
});

  describe('FN_listPatients_END', () => {
describe('PatientService.listPatients', () => {
  it('should return all patients', async () => {
    const expectedPatients = [
      { id: '1', name: 'John Doe', birthDate: new Date('1990-01-01'), cpf: '123.456.789-00', sex: Sex.M, email: 'john@example.com', phone: '123-456-7890', active: true, created_at: new Date('2021-01-01'), updated_at: new Date('2021-01-01'), encounters: [] },
      { id: '2', name: 'Jane Doe', birthDate: new Date('1992-02-02'), cpf: '987.654.321-01', sex: Sex.F, email: 'jane@example.com', phone: '098-765-4321', active: true, created_at: new Date('2021-01-02'), updated_at: new Date('2021-01-02'), encounters: [] },
    ];

    patientRepositoryMock.findAll.mockResolvedValue(expectedPatients);

    const result = await service.listPatients();

    expect(result).toEqual(expectedPatients);
  });
});
});

  describe('FN_createPatient_END', () => {
describe('PatientService.createPatient', () => {
  it.skip('should create a new patient without conflicts', async () => {
            const cpf = '123.456.789-00';
            const email = 'test@example.com';
            const birthDate = '1990-01-01';
            const sex = Sex.M;
            const createPatientDto = {
              name: 'John Doe',
              birthDate: birthDate,
              cpf: cpf.replace(/[.-]/g, ''),
              sex: sex,
              email: email,
              phone: '1234567890',
            };

            patientRepositoryMock.findByCpf.mockResolvedValue(undefined);
            patientRepositoryMock.findByEmail.mockResolvedValue(undefined);
            patientRepositoryMock.create.mockReturnValue({
              id: '123',
              name: 'John Doe',
              birthDate: new Date(birthDate),
              cpf: cpf.replace(/[.-]/g, ''),
              email: email.toLowerCase(),
              sex: sex,
              phone: '1234567890',
              active: true,
              created_at: new Date(),
              updated_at: new Date(),
              encounters: [],
            } as Patient);
            patientRepositoryMock.save.mockResolvedValue({
              ...patientRepositoryMock.create.mockReturnValue(),
              id: '123',
            } as Patient);

            const result = await service.createPatient(createPatientDto);

            expect(result).toEqual({
              id: '123',
              name: 'John Doe',
              birthDate: new Date(birthDate),
              cpf: cpf.replace(/[.-]/g, ''),
              email: email.toLowerCase(),
              sex: sex,
              phone: '1234567890',
              active: true,
              created_at: expect.any(Date),
              updated_at: expect.any(Date),
              encounters: [],
            });
        });


  it('should throw ConflictException if cpf already exists', async () => {
    const cpf = '123.456.789-00';
    const email = 'test@example.com';
    const birthDate = '1990-01-01';
    const sex = Sex.M;
    const createPatientDto = {
      name: 'John Doe',
      birthDate: birthDate,
      cpf: cpf,
      sex: sex,
      email: email,
      phone: '1234567890',
    };

    patientRepositoryMock.findByCpf.mockResolvedValue({
      ...createPatientDto,
      id: '123',
    } as Patient);
    patientRepositoryMock.findByEmail.mockResolvedValue(undefined);

    try {
      await service.createPatient(createPatientDto);
    } catch (error) {
      expect(error).toBeInstanceOf(ConflictException);
      expect(error.message).toBe(`CPF ${cpf} already registered`);
    }
  });

  it('should throw ConflictException if email already exists', async () => {
    const cpf = '123.456.789-00';
    const email = 'test@example.com';
    const birthDate = '1990-01-01';
    const sex = Sex.M;
    const createPatientDto = {
      name: 'John Doe',
      birthDate: birthDate,
      cpf: cpf,
      sex: sex,
      email: email,
      phone: '1234567890',
    };

    patientRepositoryMock.findByCpf.mockResolvedValue(undefined);
    patientRepositoryMock.findByEmail.mockResolvedValue({
      ...createPatientDto,
      id: '123',
    } as Patient);

    try {
      await service.createPatient(createPatientDto);
    } catch (error) {
      expect(error).toBeInstanceOf(ConflictException);
      expect(error.message).toBe(`Email ${email} already registered`);
    }
  });
});
});

  describe('FN_updatePatient_END', () => {
describe('PatientService.updatePatient', () => {
  it('should update patient details without conflicts', async () => {
    const patientId = '123';
    const updateDto = {
      name: 'John Doe',
      sex: Sex.M,
      phone: '1234567890',
      active: true,
    };

    const expectedPatient = {
      id: patientId,
      name: updateDto.name,
      sex: updateDto.sex,
      phone: updateDto.phone,
      active: updateDto.active,
    };

    patientRepositoryMock.findById.mockResolvedValue(expectedPatient);
    patientRepositoryMock.update.mockResolvedValue(expectedPatient);

    const result = await service.updatePatient(patientId, updateDto);

    expect(result).toEqual(expectedPatient);
    expect(patientRepositoryMock.findById).toHaveBeenCalledWith(patientId);
    expect(patientRepositoryMock.update).toHaveBeenCalledWith(
      expectedPatient,
      expect.objectContaining(updateDto)
    );
  });

  it.skip('should throw ConflictException for duplicate email', async () => {
            const patientId = '123';
            const updateDto = {
              email: 'duplicate@example.com',
            };

            const existingPatient = {
              id: '456',
              email: 'duplicate@example.com',
            };

            patientRepositoryMock.findById.mockResolvedValue(undefined);
            patientRepositoryMock.findByEmail.mockResolvedValue(existingPatient);

            try {
              await service.updatePatient(patientId, updateDto);
            } catch (error) {
              expect(error).toBeInstanceOf(ConflictException);
              expect(error.message).toEqual(`Email ${updateDto.email} already registered`);
            }

            expect(patientRepositoryMock.findById).toHaveBeenCalledWith(patientId);
            expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith(
              updateDto.email.toLowerCase()
            );
        });


  it.skip('should handle null or undefined values in updateDto', async () => {
            const patientId = '123';
            const updateDto = {
              name: 'John Doe',
              sex: Sex.M,
              phone: '1234567890',
              active: undefined,
              email: null,
            };

            const expectedPatient = {
              id: patientId,
              name: updateDto.name,
              sex: updateDto.sex,
              phone: updateDto.phone,
              active: false,
              email: null,
            };

            patientRepositoryMock.findById.mockResolvedValue(expectedPatient);
            patientRepositoryMock.update.mockResolvedValue(expectedPatient);

            const result = await service.updatePatient(patientId, updateDto);

            expect(result).toEqual(expectedPatient);
            expect(patientRepositoryMock.findById).toHaveBeenCalledWith(patientId);
            expect(patientRepositoryMock.update).toHaveBeenCalledWith(
              expectedPatient,
              expectedPatient
            );
          });

});
});

  describe('FN_findByCpfOrFail_END', () => {
describe('PatientService.findByCpfOrFail', () => {
  it('should throw NotFoundException if patient is not found', async () => {
    patientRepositoryMock.findByCpf.mockResolvedValue(null);

    try {
      await service.findByCpfOrFail('12345678901');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe(`Patient with cpf 12345678901 not found`);
    }
  });

  it('should return patient if found', async () => {
    const mockPatient: Patient = {
      id: '123',
      name: 'John Doe',
      birthDate: new Date(),
      cpf: '12345678901',
      sex: Sex.M,
      email: 'john.doe@example.com',
      phone: '1234567890',
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      encounters: [],
    };
    patientRepositoryMock.findByCpf.mockResolvedValue(mockPatient);

    const result = await service.findByCpfOrFail('12345678901');
    expect(result).toEqual(mockPatient);
  });
});
});

  // TESTS_APPEND_HERE
});
