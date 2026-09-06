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
  it('should return patient when found', async () => {
    const mockPatient = {
      id: '1',
      name: 'John Doe',
      birthDate: new Date(),
      cpf: '123.456.789-00',
      sex: Sex.M,
      email: 'john@example.com',
      phone: '123-456-7890',
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      encounters: [],
    };

    patientRepositoryMock.findById.mockResolvedValue(mockPatient);

    const result = await service.getPatientById('1');

    expect(result).toEqual(mockPatient);
  });

  it('should throw NotFoundException when patient not found', async () => {
    patientRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(service.getPatientById('999')).rejects.toThrow(NotFoundException);
  });
});
});

  describe('FN_listPatients_END', () => {
describe('listPatients', () => {
  it('should return all patients when repository findAll succeeds', async () => {
    const patients: Patient[] = [
      {
        id: '1',
        name: 'John Doe',
        birthDate: new Date(),
        cpf: '123.456.789-00',
        sex: Sex.M,
        email: 'john@example.com',
        phone: '123-456-7890',
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
        encounters: []
      },
      {
        id: '2',
        name: 'Jane Smith',
        birthDate: new Date(),
        cpf: '987.654.321-00',
        sex: Sex.F,
        email: null,
        phone: null,
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
        encounters: []
      }
    ];

    patientRepositoryMock.findAll.mockResolvedValue(patients);

    const result = await service.listPatients();

    expect(result).toEqual(patients);
  });

  it('should return empty array when repository findAll returns no patients', async () => {
    patientRepositoryMock.findAll.mockResolvedValue([]);

    const result = await service.listPatients();

    expect(result).toEqual([]);
  });

  it('should call repository findAll with correct parameters', async () => {
    const patients: Patient[] = [
      {
        id: '1',
        name: 'John Doe',
        birthDate: new Date(),
        cpf: '123.456.789-00',
        sex: Sex.M,
        email: 'john@example.com',
        phone: '123-456-7890',
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
        encounters: []
      }
    ];

    patientRepositoryMock.findAll.mockResolvedValue(patients);

    await service.listPatients();

    expect(patientRepositoryMock.findAll).toHaveBeenCalled();
  });
});
});

  describe('FN_createPatient_END', () => {
describe('createPatient', () => {
  it.skip('should create patient successfully with valid data', async () => {
        const dto = new CreatePatientDto({
          name: 'John Doe',
          birthDate: '1990-01-01',
          cpf: '123.456.789-00',
          sex: Sex.M,
          email: 'john@example.com',
        });

        const patient = {
          id: '1',
          name: dto.name,
          birthDate: new Date(dto.birthDate),
          cpf: dto.cpf.replace(/[.-]/g, ''),
          sex: dto.sex,
          email: dto.email?.toLowerCase(),
          phone: null,
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
          encounters: [],
        };

        patientRepositoryMock.findByCpf.mockResolvedValue(undefined);
        patientRepositoryMock.findByEmail.mockResolvedValue(undefined);
        patientRepositoryMock.create.mockReturnValue(patient);
        patientRepositoryMock.save.mockResolvedValue(patient);

        const result = await service.createPatient(dto);

        expect(result).toEqual(patient);
      });

  it.skip('should throw ConflictException when CPF already exists', async () => {
            const dto = new CreatePatientDto({
              name: 'John Doe',
              birthDate: '1990-01-01',
              cpf: '123.456.789-00',
              sex: Sex.M,
              email: 'john@example.com',
            });

            const existingPatient = { id: '1' } as Patient;

            patientRepositoryMock.findByCpf.mockResolvedValueOnce(existingPatient);

            await expect(service.createPatient(dto)).rejects.toThrow(ConflictException);
          });


  it.skip('should throw ConflictException when email already exists', async () => {
        const dto = new CreatePatientDto({
          name: 'John Doe',
          birthDate: '1990-01-01',
          cpf: '123.456.789-00',
          sex: Sex.M,
          email: 'john@example.com',
        });

        const existingPatient = { id: '1' } as Patient;

        patientRepositoryMock.findByCpf.mockResolvedValue(undefined);
        patientRepositoryMock.findByEmail.mockResolvedValue(existingPatient);

        await expect(service.createPatient(dto)).rejects.toThrow(ConflictException);
      });

  it.skip('should create patient with undefined email', async () => {
        const dto = new CreatePatientDto({
          name: 'John Doe',
          birthDate: '1990-01-01',
          cpf: '123.456.789-00',
          sex: Sex.M,
        });

        const patient = {
          id: '1',
          name: dto.name,
          birthDate: new Date(dto.birthDate),
          cpf: dto.cpf.replace(/[.-]/g, ''),
          sex: dto.sex,
          email: undefined,
          phone: null,
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
          encounters: [],
        };

        patientRepositoryMock.findByCpf.mockResolvedValue(undefined);
        patientRepositoryMock.findByEmail.mockResolvedValue(undefined);
        patientRepositoryMock.create.mockReturnValue(patient);
        patientRepositoryMock.save.mockResolvedValue(patient);

        const result = await service.createPatient(dto);

        expect(result).toEqual(patient);
      });
});
});

  describe('FN_updatePatient_END', () => {
describe('updatePatient', () => {
  it('should update patient successfully when no email conflict exists', async () => {
            const existingPatient = { id: '1' } as Patient;
            const updatedPatient = { id: '1', name: 'John Doe' } as Patient;

            patientRepositoryMock.findByEmail.mockResolvedValue(undefined);
            patientRepositoryMock.update.mockResolvedValue(updatedPatient);
            
            jest.spyOn(service, 'getPatientById').mockResolvedValue(existingPatient);

            const result = await service.updatePatient('1', new UpdatePatientDto({ name: 'John Doe' }));

            expect(result).toEqual(updatedPatient);
        });



  it.skip('should throw ConflictException when email already exists', async () => {
                const existingPatient = { id: '1' } as Patient;
                const conflictingEmail = 'new@example.com';

                patientRepositoryMock.findByEmail.mockResolvedValue({ id: '2', email: conflictingEmail } as Patient);
                jest.spyOn(service, 'getPatientById').mockResolvedValue(existingPatient);
                patientRepositoryMock.update.mockResolvedValue({ id: '1' } as Patient);

                await expect(service.updatePatient('1', new UpdatePatientDto({ email: conflictingEmail }))).rejects.toThrow(ConflictException);
              });




  it('should update patient with partial fields including sex and birthDate', async () => {
        const existingPatient = { id: '1' } as Patient;
        const updatedPatient = { id: '1', sex: Sex.M, birthDate: new Date() } as Patient;

        jest.spyOn(service, 'getPatientById').mockResolvedValue(existingPatient);
        patientRepositoryMock.findByEmail.mockResolvedValue(undefined);
        patientRepositoryMock.update.mockResolvedValue(updatedPatient);

        const result = await service.updatePatient('1', new UpdatePatientDto({ sex: Sex.M, birthDate: '2020-01-01' }));

        expect(result).toEqual(updatedPatient);
    });


});
});

  describe('FN_findByCpfOrFail_END', () => {
describe('findByCpfOrFail', () => {
  it('should return patient when found by CPF', async () => {
    const mockPatient = {
      id: '123',
      name: 'John Doe',
      birthDate: new Date(),
      cpf: '123.456.789-00',
      sex: Sex.M,
      email: null,
      phone: null,
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      encounters: []
    };

    patientRepositoryMock.findByCpf.mockResolvedValue(mockPatient);

    const result = await service.findByCpfOrFail('123.456.789-00');

    expect(result).toEqual(mockPatient);
  });

  it('should throw NotFoundException when patient not found by CPF', async () => {
    patientRepositoryMock.findByCpf.mockResolvedValue(undefined);

    await expect(service.findByCpfOrFail('123.456.789-00')).rejects.toThrow(NotFoundException);
  });
});
});

  // TESTS_APPEND_HERE
});
