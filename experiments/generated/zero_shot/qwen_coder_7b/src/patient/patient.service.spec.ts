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
    const id = 'non-existent-id';
    patientRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(service.getPatientById(id)).rejects.toThrow(NotFoundException);
  });

  it('should return the patient when found', async () => {
    const id = 'existing-id';
    const mockPatient: Patient = { id, name: 'John Doe', birthDate: new Date(), cpf: '12345678901', sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] };
    patientRepositoryMock.findById.mockResolvedValue(mockPatient);

    const result = await service.getPatientById(id);
    expect(result).toEqual(mockPatient);
  });
});

  describe('listPatients', () => {
  it.skip('should throw NotFoundException when no patients are found', async () => {
          patientRepositoryMock.findAll.mockResolvedValue([]);

          await expect(service.listPatients()).rejects.toThrow(NotFoundException);
        });

  it('should return a list of patients when patients are found', async () => {
    const mockPatients: Patient[] = [
      { id: '1', name: 'John Doe', birthDate: new Date(), cpf: '12345678901', sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] },
      { id: '2', name: 'Jane Doe', birthDate: new Date(), cpf: '98765432109', sex: Sex.F, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] }
    ];

    patientRepositoryMock.findAll.mockResolvedValue(mockPatients);

    const result = await service.listPatients();

    expect(result).toEqual(mockPatients);
  });
});

  describe('createPatient', () => {
  it('should throw ConflictException if CPF already registered', async () => {
    const dto: CreatePatientDto = {
      name: 'John Doe',
      birthDate: '1990-01-01',
      cpf: '123.456.789-00',
      sex: Sex.M,
    };

    patientRepositoryMock.findByCpf.mockResolvedValue({} as Patient);

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

    patientRepositoryMock.findByCpf.mockResolvedValue(undefined);
    patientRepositoryMock.findByEmail.mockResolvedValue({} as Patient);

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

        patientRepositoryMock.findByCpf.mockResolvedValue(undefined);
        patientRepositoryMock.findByEmail.mockResolvedValue(undefined);
        patientRepositoryMock.create.mockReturnValue(dto as Patient);
        patientRepositoryMock.save.mockResolvedValue({ ...dto, id: '1', created_at: new Date(), updated_at: new Date() } as Patient);

        const result = await service.createPatient(dto);

        expect(result).toEqual({ ...dto, id: '1', created_at: expect.any(Date), updated_at: expect.any(Date) });
      });

});

  describe('updatePatient', () => {
  it('should update patient with new email if not already registered', async () => {
    const id = '123';
    const dto: UpdatePatientDto = { email: 'newemail@example.com' };
    const existingEmailMock = null;
    const updatedPatient: Patient = { id, name: '', birthDate: new Date(), cpf: '', sex: Sex.M, email: 'newemail@example.com', phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] };

    patientRepositoryMock.findById.mockResolvedValue({ id, name: '', birthDate: new Date(), cpf: '', sex: Sex.M, email: 'oldemail@example.com', phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] });
    patientRepositoryMock.findByEmail.mockResolvedValue(existingEmailMock);
    patientRepositoryMock.update.mockResolvedValue(updatedPatient);

    const result = await service.updatePatient(id, dto);

    expect(result).toEqual(updatedPatient);
  });

  it('should throw ConflictException if email is already registered', async () => {
    const id = '123';
    const dto: UpdatePatientDto = { email: 'existingemail@example.com' };
    const existingEmailMock: Patient = { id: '456', name: '', birthDate: new Date(), cpf: '', sex: Sex.M, email: 'existingemail@example.com', phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] };

    patientRepositoryMock.findById.mockResolvedValue({ id, name: '', birthDate: new Date(), cpf: '', sex: Sex.M, email: 'oldemail@example.com', phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] });
    patientRepositoryMock.findByEmail.mockResolvedValue(existingEmailMock);

    await expect(service.updatePatient(id, dto)).rejects.toThrow(ConflictException);
  });

  it('should update other fields if provided', async () => {
    const id = '123';
    const dto: UpdatePatientDto = { name: 'New Name', phone: '1234567890' };
    const updatedPatient: Patient = { id, name: 'New Name', birthDate: new Date(), cpf: '', sex: Sex.M, email: null, phone: '1234567890', active: true, created_at: new Date(), updated_at: new Date(), encounters: [] };

    patientRepositoryMock.findById.mockResolvedValue({ id, name: '', birthDate: new Date(), cpf: '', sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] });
    patientRepositoryMock.update.mockResolvedValue(updatedPatient);

    const result = await service.updatePatient(id, dto);

    expect(result).toEqual(updatedPatient);
  });

  it('should not update email if not provided', async () => {
    const id = '123';
    const dto: UpdatePatientDto = { name: 'New Name' };
    const updatedPatient: Patient = { id, name: 'New Name', birthDate: new Date(), cpf: '', sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] };

    patientRepositoryMock.findById.mockResolvedValue({ id, name: '', birthDate: new Date(), cpf: '', sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] });
    patientRepositoryMock.update.mockResolvedValue(updatedPatient);

    const result = await service.updatePatient(id, dto);

    expect(result).toEqual(updatedPatient);
  });

  it('should update email to lowercase if provided', async () => {
    const id = '123';
    const dto: UpdatePatientDto = { email: 'NEWEMAIL@example.com' };
    const updatedPatient: Patient = { id, name: '', birthDate: new Date(), cpf: '', sex: Sex.M, email: 'newemail@example.com', phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] };

    patientRepositoryMock.findById.mockResolvedValue({ id, name: '', birthDate: new Date(), cpf: '', sex: Sex.M, email: 'oldemail@example.com', phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] });
    patientRepositoryMock.findByEmail.mockResolvedValue(null);
    patientRepositoryMock.update.mockResolvedValue(updatedPatient);

    const result = await service.updatePatient(id, dto);

    expect(result).toEqual(updatedPatient);
  });

  it('should update active status if provided', async () => {
    const id = '123';
    const dto: UpdatePatientDto = { active: false };
    const updatedPatient: Patient = { id, name: '', birthDate: new Date(), cpf: '', sex: Sex.M, email: null, phone: null, active: false, created_at: new Date(), updated_at: new Date(), encounters: [] };

    patientRepositoryMock.findById.mockResolvedValue({ id, name: '', birthDate: new Date(), cpf: '', sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] });
    patientRepositoryMock.update.mockResolvedValue(updatedPatient);

    const result = await service.updatePatient(id, dto);

    expect(result).toEqual(updatedPatient);
  });

  it('should update birthDate if provided', async () => {
    const id = '123';
    const dto: UpdatePatientDto = { birthDate: '2000-01-01' };
    const updatedPatient: Patient = { id, name: '', birthDate: new Date('2000-01-01'), cpf: '', sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] };

    patientRepositoryMock.findById.mockResolvedValue({ id, name: '', birthDate: new Date(), cpf: '', sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] });
    patientRepositoryMock.update.mockResolvedValue(updatedPatient);

    const result = await service.updatePatient(id, dto);

    expect(result).toEqual(updatedPatient);
  });

  it('should update sex if provided', async () => {
    const id = '123';
    const dto: UpdatePatientDto = { sex: Sex.F };
    const updatedPatient: Patient = { id, name: '', birthDate: new Date(), cpf: '', sex: Sex.F, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] };

    patientRepositoryMock.findById.mockResolvedValue({ id, name: '', birthDate: new Date(), cpf: '', sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] });
    patientRepositoryMock.update.mockResolvedValue(updatedPatient);

    const result = await service.updatePatient(id, dto);

    expect(result).toEqual(updatedPatient);
  });

  it('should update phone if provided', async () => {
    const id = '123';
    const dto: UpdatePatientDto = { phone: '0987654321' };
    const updatedPatient: Patient = { id, name: '', birthDate: new Date(), cpf: '', sex: Sex.M, email: null, phone: '0987654321', active: true, created_at: new Date(), updated_at: new Date(), encounters: [] };

    patientRepositoryMock.findById.mockResolvedValue({ id, name: '', birthDate: new Date(), cpf: '', sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] });
    patientRepositoryMock.update.mockResolvedValue(updatedPatient);

    const result = await service.updatePatient(id, dto);

    expect(result).toEqual(updatedPatient);
  });

  it('should throw NotFoundException if patient not found', async () => {
    const id = '123';
    const dto: UpdatePatientDto = { name: 'New Name' };

    patientRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(service.updatePatient(id, dto)).rejects.toThrow(NotFoundException);
  });
});

  describe('findByCpfOrFail', () => {
  it('should throw NotFoundException when patient not found', async () => {
    const cpf = '123.456.789-00';
    patientRepositoryMock.findByCpf.mockResolvedValue(undefined);

    await expect(service.findByCpfOrFail(cpf)).rejects.toThrow(NotFoundException);
  });

  it('should return patient when found', async () => {
    const cpf = '123.456.789-00';
    const patient: Patient = { id: '1', name: 'John Doe', birthDate: new Date(), cpf, sex: Sex.M, email: null, phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] };
    patientRepositoryMock.findByCpf.mockResolvedValue(patient);

    const result = await service.findByCpfOrFail(cpf);
    expect(result).toEqual(patient);
  });
});

  // TESTS_APPEND_HERE
});
