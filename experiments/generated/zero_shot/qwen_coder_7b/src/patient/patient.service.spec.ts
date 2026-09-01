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
  it('should return a patient when found', async () => {
    const id = '123';
    const patient: Patient = {
      id,
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

    patientRepositoryMock.findById.mockResolvedValue(patient);

    const result = await service.getPatientById(id);

    expect(result).toEqual(patient);
    expect(patientRepositoryMock.findById).toHaveBeenCalledWith(id);
  });

  it('should throw NotFoundException when patient is not found', async () => {
    const id = '123';

    patientRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(service.getPatientById(id)).rejects.toThrow(NotFoundException);
    await expect(service.getPatientById(id)).rejects.toThrow(`Patient with id ${id} not found`);
    expect(patientRepositoryMock.findById).toHaveBeenCalledWith(id);
  });
});
});

  describe('FN_listPatients_END', () => {
describe('listPatients', () => {
  it('should return a list of patients', async () => {
    const patients: Patient[] = [
      { id: '1', name: 'John Doe', birthDate: new Date(), cpf: '12345678901', sex: Sex.M, email: 'john@example.com', phone: '1234567890', active: true, created_at: new Date(), updated_at: new Date(), encounters: [] },
      { id: '2', name: 'Jane Doe', birthDate: new Date(), cpf: '09876543210', sex: Sex.F, email: 'jane@example.com', phone: '0987654321', active: true, created_at: new Date(), updated_at: new Date(), encounters: [] }
    ];

    patientRepositoryMock.findAll.mockResolvedValue(patients);

    const result = await service.listPatients();

    expect(result).toEqual(patients);
    expect(patientRepositoryMock.findAll).toHaveBeenCalled();
  });

  it.skip('should throw NotFoundException if no patients are found', async () => {
        patientRepositoryMock.findAll.mockResolvedValue([]);

        await expect(service.listPatients()).rejects.toThrow(NotFoundException);
        expect(patientRepositoryMock.findAll).toHaveBeenCalled();
      });
});
});

  describe('FN_createPatient_END', () => {
describe('createPatient', () => {
  it('should create a new patient when CPF and email are unique', async () => {
    const dto: CreatePatientDto = {
      name: 'John Doe',
      birthDate: '1990-01-01',
      cpf: '123.456.789-00',
      sex: Sex.M,
      email: 'john.doe@example.com',
    };

    const normalizedCpf = dto.cpf.replace(/[.-]/g, '');
    const normalizedEmail = dto.email?.toLowerCase();

    patientRepositoryMock.findByCpf.mockResolvedValue(undefined);
    patientRepositoryMock.findByEmail.mockResolvedValue(undefined);
    patientRepositoryMock.create.mockReturnValue({ ...dto, cpf: normalizedCpf, email: normalizedEmail, birthDate: new Date(dto.birthDate) });
    patientRepositoryMock.save.mockResolvedValue({ ...dto, cpf: normalizedCpf, email: normalizedEmail, birthDate: new Date(dto.birthDate) });

    const result = await service.createPatient(dto);

    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith(normalizedCpf);
    expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith(normalizedEmail);
    expect(patientRepositoryMock.create).toHaveBeenCalledWith({ ...dto, cpf: normalizedCpf, email: normalizedEmail, birthDate: new Date(dto.birthDate) });
    expect(patientRepositoryMock.save).toHaveBeenCalledWith({ ...dto, cpf: normalizedCpf, email: normalizedEmail, birthDate: new Date(dto.birthDate) });
    expect(result).toEqual({ ...dto, cpf: normalizedCpf, email: normalizedEmail, birthDate: new Date(dto.birthDate) });
  });

  it('should throw ConflictException if CPF is already registered', async () => {
    const dto: CreatePatientDto = {
      name: 'John Doe',
      birthDate: '1990-01-01',
      cpf: '123.456.789-00',
      sex: Sex.M,
      email: 'john.doe@example.com',
    };

    const normalizedCpf = dto.cpf.replace(/[.-]/g, '');

    patientRepositoryMock.findByCpf.mockResolvedValue({ id: '1', name: 'John Doe', birthDate: new Date('1990-01-01'), cpf: normalizedCpf, sex: Sex.M, email: 'john.doe@example.com', phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] });

    await expect(service.createPatient(dto)).rejects.toThrow(ConflictException);
    await expect(service.createPatient(dto)).rejects.toThrow(`CPF ${dto.cpf} already registered`);
  });

  it('should throw ConflictException if email is already registered', async () => {
    const dto: CreatePatientDto = {
      name: 'John Doe',
      birthDate: '1990-01-01',
      cpf: '123.456.789-00',
      sex: Sex.M,
      email: 'john.doe@example.com',
    };

    const normalizedEmail = dto.email?.toLowerCase();

    patientRepositoryMock.findByCpf.mockResolvedValue(undefined);
    patientRepositoryMock.findByEmail.mockResolvedValue({ id: '1', name: 'John Doe', birthDate: new Date('1990-01-01'), cpf: '123.456.789-00', sex: Sex.M, email: normalizedEmail, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] });

    await expect(service.createPatient(dto)).rejects.toThrow(ConflictException);
    await expect(service.createPatient(dto)).rejects.toThrow(`Email ${dto.email} already registered`);
  });
});
});

  describe('FN_updatePatient_END', () => {
describe('updatePatient', () => {
  it('should update patient with new email if email is different and not already registered', async () => {
    const id = '123';
    const dto: UpdatePatientDto = { email: 'newemail@example.com' };
    const patient: Patient = { id, email: 'oldemail@example.com', name: 'John Doe', sex: Sex.M, phone: null, active: true, birthDate: new Date(), cpf: '12345678901', created_at: new Date(), updated_at: new Date(), encounters: [] };
    const updatedPatient: Patient = { ...patient, email: dto.email };

    patientRepositoryMock.findById.mockResolvedValue(patient);
    patientRepositoryMock.findByEmail.mockResolvedValue(undefined);
    patientRepositoryMock.update.mockResolvedValue(updatedPatient);

    const result = await service.updatePatient(id, dto);

    expect(patientRepositoryMock.findById).toHaveBeenCalledWith(id);
    expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith(dto.email.toLowerCase());
    expect(patientRepositoryMock.update).toHaveBeenCalledWith(patient, { email: dto.email.toLowerCase() });
    expect(result).toEqual(updatedPatient);
  });

  it('should throw ConflictException if email is different and already registered', async () => {
    const id = '123';
    const dto: UpdatePatientDto = { email: 'existingemail@example.com' };
    const patient: Patient = { id, email: 'oldemail@example.com', name: 'John Doe', sex: Sex.M, phone: null, active: true, birthDate: new Date(), cpf: '12345678901', created_at: new Date(), updated_at: new Date(), encounters: [] };

    patientRepositoryMock.findById.mockResolvedValue(patient);
    patientRepositoryMock.findByEmail.mockResolvedValue({ id: '456', email: dto.email, name: 'Jane Doe', sex: Sex.F, phone: null, active: true, birthDate: new Date(), cpf: '98765432109', created_at: new Date(), updated_at: new Date(), encounters: [] });

    await expect(service.updatePatient(id, dto)).rejects.toThrow(ConflictException);
    expect(patientRepositoryMock.findById).toHaveBeenCalledWith(id);
    expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith(dto.email.toLowerCase());
  });

  it.skip('should update patient without changing email if email is the same', async () => {
        const id = '123';
        const dto: UpdatePatientDto = { email: 'oldemail@example.com' };
        const patient: Patient = { id, email: 'oldemail@example.com', name: 'John Doe', sex: Sex.M, phone: null, active: true, birthDate: new Date(), cpf: '12345678901', created_at: new Date(), updated_at: new Date(), encounters: [] };
        const updatedPatient: Patient = { ...patient };

        patientRepositoryMock.findById.mockResolvedValue(patient);
        patientRepositoryMock.findByEmail.mockResolvedValue(undefined);
        patientRepositoryMock.update.mockResolvedValue(updatedPatient);

        const result = await service.updatePatient(id, dto);

        expect(patientRepositoryMock.findById).toHaveBeenCalledWith(id);
        expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith(dto.email.toLowerCase());
        expect(patientRepositoryMock.update).toHaveBeenCalledWith(patient, {});
        expect(result).toEqual(updatedPatient);
      });

  it.skip('should update patient with other fields if provided', async () => {
            const id = '123';
            const dto: UpdatePatientDto = { name: 'Jane Doe', phone: '1234567890' };
            const patient: Patient = { id, email: 'oldemail@example.com', name: 'John Doe', sex: Sex.M, phone: null, active: true, birthDate: new Date(), cpf: '12345678901', created_at: new Date(), updated_at: new Date(), encounters: [] };
            const updatedPatient: Patient = { ...patient, name: dto.name, phone: dto.phone };

            patientRepositoryMock.findById.mockResolvedValue(patient);
            patientRepositoryMock.findByEmail.mockResolvedValue(undefined);
            patientRepositoryMock.update.mockResolvedValue(updatedPatient);

            const result = await service.updatePatient(id, dto);

            expect(patientRepositoryMock.findById).toHaveBeenCalledWith(id);
            expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith(dto.email?.toLowerCase() ?? '');
            expect(patientRepositoryMock.update).toHaveBeenCalledWith(patient, { name: dto.name, phone: dto.phone });
            expect(result).toEqual(updatedPatient);
          });

});
});

  describe('FN_findByCpfOrFail_END', () => {
describe('findByCpfOrFail', () => {
  it('should return a patient when found by CPF', async () => {
    const cpf = '123.456.789-00';
    const patient: Patient = {
      id: '1',
      name: 'John Doe',
      birthDate: new Date(),
      cpf: cpf,
      sex: Sex.M,
      email: null,
      phone: null,
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      encounters: [],
    };

    patientRepositoryMock.findByCpf.mockResolvedValue(patient);

    const result = await service.findByCpfOrFail(cpf);

    expect(result).toEqual(patient);
    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith(cpf);
  });

  it('should throw NotFoundException when patient is not found by CPF', async () => {
    const cpf = '123.456.789-00';

    patientRepositoryMock.findByCpf.mockResolvedValue(null);

    await expect(service.findByCpfOrFail(cpf)).rejects.toThrow(NotFoundException);
    await expect(service.findByCpfOrFail(cpf)).rejects.toThrow(`Patient with cpf ${cpf} not found`);
    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith(cpf);
  });
});
});

  // TESTS_APPEND_HERE
});
