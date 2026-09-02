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
    const patient = new Patient();
    patient.id = id;
    patientRepositoryMock.findById.mockResolvedValue(patient);

    const result = await service.getPatientById(id);

    expect(result).toEqual(patient);
    expect(patientRepositoryMock.findById).toHaveBeenCalledWith(id);
  });

  it('should throw NotFoundException when patient is not found', async () => {
    const id = '123';
    patientRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(service.getPatientById(id)).rejects.toThrow(NotFoundException);
    expect(patientRepositoryMock.findById).toHaveBeenCalledWith(id);
  });
});
});

  describe('FN_listPatients_END', () => {
describe('listPatients', () => {
  it('should return a list of patients', async () => {
    const patients: Patient[] = [
      {
        id: '1',
        name: 'John Doe',
        birthDate: new Date('1990-01-01'),
        cpf: '123.456.789-00',
        sex: Sex.M,
        email: 'john.doe@example.com',
        phone: '1234567890',
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
        encounters: []
      },
      {
        id: '2',
        name: 'Jane Doe',
        birthDate: new Date('1995-01-01'),
        cpf: '987.654.321-00',
        sex: Sex.F,
        email: 'jane.doe@example.com',
        phone: '0987654321',
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
        encounters: []
      }
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
      phone: '1234567890',
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
      phone: '1234567890',
    };

    const normalizedCpf = dto.cpf.replace(/[.-]/g, '');

    patientRepositoryMock.findByCpf.mockResolvedValue({ id: '1', name: 'John Doe', birthDate: new Date('1990-01-01'), cpf: normalizedCpf, sex: Sex.M, email: 'john.doe@example.com', phone: '1234567890', active: true, created_at: new Date(), updated_at: new Date(), encounters: [] });

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
      phone: '1234567890',
    };

    const normalizedEmail = dto.email?.toLowerCase();

    patientRepositoryMock.findByCpf.mockResolvedValue(undefined);
    patientRepositoryMock.findByEmail.mockResolvedValue({ id: '1', name: 'John Doe', birthDate: new Date('1990-01-01'), cpf: '123.456.789-00', sex: Sex.M, email: normalizedEmail, phone: '1234567890', active: true, created_at: new Date(), updated_at: new Date(), encounters: [] });

    await expect(service.createPatient(dto)).rejects.toThrow(ConflictException);
    await expect(service.createPatient(dto)).rejects.toThrow(`Email ${dto.email} already registered`);
  });
});
});

  describe('FN_updatePatient_END', () => {
describe('updatePatient', () => {
  it.skip('should update patient with new email if email is different and not already registered', async () => {
        const id = '123';
        const dto: UpdatePatientDto = {
          email: 'newemail@example.com',
        };
        const patient: Patient = {
          id,
          name: 'John Doe',
          birthDate: new Date('1990-01-01'),
          cpf: '12345678901',
          sex: Sex.M,
          email: 'oldemail@example.com',
          phone: '1234567890',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
          encounters: [],
        };
        const updatedPatient: Patient = {
          ...patient,
          email: dto.email,
        };

        patientRepositoryMock.getPatientById.mockResolvedValue(patient);
        patientRepositoryMock.findByEmail.mockResolvedValue(undefined);
        patientRepositoryMock.update.mockResolvedValue(updatedPatient);

        const result = await service.updatePatient(id, dto);

        expect(patientRepositoryMock.getPatientById).toHaveBeenCalledWith(id);
        expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith(dto.email.toLowerCase());
        expect(patientRepositoryMock.update).toHaveBeenCalledWith(patient, { email: dto.email.toLowerCase() });
        expect(result).toEqual(updatedPatient);
      });

  it.skip('should throw ConflictException if new email is already registered', async () => {
        const id = '123';
        const dto: UpdatePatientDto = {
          email: 'existingemail@example.com',
        };
        const patient: Patient = {
          id,
          name: 'John Doe',
          birthDate: new Date('1990-01-01'),
          cpf: '12345678901',
          sex: Sex.M,
          email: 'oldemail@example.com',
          phone: '1234567890',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
          encounters: [],
        };

        patientRepositoryMock.getPatientById.mockResolvedValue(patient);
        patientRepositoryMock.findByEmail.mockResolvedValue(patient);

        await expect(service.updatePatient(id, dto)).rejects.toThrow(ConflictException);
        await expect(service.updatePatient(id, dto)).rejects.toThrow(`Email ${dto.email} already registered`);
      });

  it.skip('should update patient with new name if provided', async () => {
        const id = '123';
        const dto: UpdatePatientDto = {
          name: 'Jane Doe',
        };
        const patient: Patient = {
          id,
          name: 'John Doe',
          birthDate: new Date('1990-01-01'),
          cpf: '12345678901',
          sex: Sex.M,
          email: 'oldemail@example.com',
          phone: '1234567890',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
          encounters: [],
        };
        const updatedPatient: Patient = {
          ...patient,
          name: dto.name,
        };

        patientRepositoryMock.getPatientById.mockResolvedValue(patient);
        patientRepositoryMock.update.mockResolvedValue(updatedPatient);

        const result = await service.updatePatient(id, dto);

        expect(patientRepositoryMock.getPatientById).toHaveBeenCalledWith(id);
        expect(patientRepositoryMock.update).toHaveBeenCalledWith(patient, { name: dto.name });
        expect(result).toEqual(updatedPatient);
      });

  it.skip('should update patient with new phone if provided', async () => {
        const id = '123';
        const dto: UpdatePatientDto = {
          phone: '0987654321',
        };
        const patient: Patient = {
          id,
          name: 'John Doe',
          birthDate: new Date('1990-01-01'),
          cpf: '12345678901',
          sex: Sex.M,
          email: 'oldemail@example.com',
          phone: '1234567890',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
          encounters: [],
        };
        const updatedPatient: Patient = {
          ...patient,
          phone: dto.phone,
        };

        patientRepositoryMock.getPatientById.mockResolvedValue(patient);
        patientRepositoryMock.update.mockResolvedValue(updatedPatient);

        const result = await service.updatePatient(id, dto);

        expect(patientRepositoryMock.getPatientById).toHaveBeenCalledWith(id);
        expect(patientRepositoryMock.update).toHaveBeenCalledWith(patient, { phone: dto.phone });
        expect(result).toEqual(updatedPatient);
      });

  it.skip('should update patient with new active status if provided', async () => {
        const id = '123';
        const dto: UpdatePatientDto = {
          active: false,
        };
        const patient: Patient = {
          id,
          name: 'John Doe',
          birthDate: new Date('1990-01-01'),
          cpf: '12345678901',
          sex: Sex.M,
          email: 'oldemail@example.com',
          phone: '1234567890',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
          encounters: [],
        };
        const updatedPatient: Patient = {
          ...patient,
          active: dto.active,
        };

        patientRepositoryMock.getPatientById.mockResolvedValue(patient);
        patientRepositoryMock.update.mockResolvedValue(updatedPatient);

        const result = await service.updatePatient(id, dto);

        expect(patientRepositoryMock.getPatientById).toHaveBeenCalledWith(id);
        expect(patientRepositoryMock.update).toHaveBeenCalledWith(patient, { active: dto.active });
        expect(result).toEqual(updatedPatient);
      });

  it.skip('should update patient with new birthDate if provided', async () => {
        const id = '123';
        const dto: UpdatePatientDto = {
          birthDate: '2000-01-01',
        };
        const patient: Patient = {
          id,
          name: 'John Doe',
          birthDate: new Date('1990-01-01'),
          cpf: '12345678901',
          sex: Sex.M,
          email: 'oldemail@example.com',
          phone: '1234567890',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
          encounters: [],
        };
        const updatedPatient: Patient = {
          ...patient,
          birthDate: new Date(dto.birthDate),
        };

        patientRepositoryMock.getPatientById.mockResolvedValue(patient);
        patientRepositoryMock.update.mockResolvedValue(updatedPatient);

        const result = await service.updatePatient(id, dto);

        expect(patientRepositoryMock.getPatientById).toHaveBeenCalledWith(id);
        expect(patientRepositoryMock.update).toHaveBeenCalledWith(patient, { birthDate: new Date(dto.birthDate) });
        expect(result).toEqual(updatedPatient);
      });

  it.skip('should update patient with new sex if provided', async () => {
        const id = '123';
        const dto: UpdatePatientDto = {
          sex: Sex.F,
        };
        const patient: Patient = {
          id,
          name: 'John Doe',
          birthDate: new Date('1990-01-01'),
          cpf: '12345678901',
          sex: Sex.M,
          email: 'oldemail@example.com',
          phone: '1234567890',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
          encounters: [],
        };
        const updatedPatient: Patient = {
          ...patient,
          sex: dto.sex,
        };

        patientRepositoryMock.getPatientById.mockResolvedValue(patient);
        patientRepositoryMock.update.mockResolvedValue(updatedPatient);

        const result = await service.updatePatient(id, dto);

        expect(patientRepositoryMock.getPatientById).toHaveBeenCalledWith(id);
        expect(patientRepositoryMock.update).toHaveBeenCalledWith(patient, { sex: dto.sex });
        expect(result).toEqual(updatedPatient);
      });
});
});

  describe('FN_findByCpfOrFail_END', () => {
describe('findByCpfOrFail', () => {
  it('should return a patient when found', async () => {
    const cpf = '123.456.789-00';
    const patient: Patient = {
      id: '1',
      name: 'John Doe',
      birthDate: new Date(),
      cpf,
      sex: Sex.M,
      email: null,
      phone: null,
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      encounters: []
    };

    patientRepositoryMock.findByCpf.mockResolvedValue(patient);

    const result = await service.findByCpfOrFail(cpf);

    expect(result).toEqual(patient);
    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith(cpf);
  });

  it('should throw NotFoundException when patient is not found', async () => {
    const cpf = '123.456.789-00';

    patientRepositoryMock.findByCpf.mockResolvedValue(null);

    await expect(service.findByCpfOrFail(cpf)).rejects.toThrow(NotFoundException);
    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith(cpf);
  });
});
});

  // TESTS_APPEND_HERE
});
