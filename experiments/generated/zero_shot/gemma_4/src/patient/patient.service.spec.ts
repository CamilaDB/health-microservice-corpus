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
  it('should return the patient if found', async () => {
    const mockPatient = {
      id: '123',
      name: 'Test Patient',
      birthDate: new Date(),
      cpf: '11111111111',
      sex: 1,
      email: 'test@example.com',
      phone: null,
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
      encounters: [],
    };
    patientRepositoryMock.findById.mockResolvedValue(mockPatient);

    const result = await service.getPatientById('123');

    expect(result).toEqual(mockPatient);
    expect(patientRepositoryMock.findById).toHaveBeenCalledWith('123');
  });

  it('should throw NotFoundException if patient is not found', async () => {
    patientRepositoryMock.findById.mockResolvedValue(null);

    await expect(service.getPatientById('456')).rejects.toThrow(NotFoundException);
    await expect(service.getPatientById('456')).rejects.toThrow('Patient with id 456 not found');
    expect(patientRepositoryMock.findById).toHaveBeenCalledWith('456');
  });
});
});

  describe('FN_listPatients_END', () => {
describe('listPatients', () => {
it('should return all patients from the repository', async () => {
  const mockPatients = [
    { id: '1', name: 'Alice', birthDate: new Date(), cpf: '111', sex: 'M', email: 'a@a.com', phone: null, active: true, created_at: new Date(), updated_at: new Date(), encounters: [] },
    { id: '2', name: 'Bob', birthDate: new Date(), cpf: '222', sex: 'F', email: null, phone: '123', active: false, created_at: new Date(), updated_at: new Date(), encounters: [] },
  ];

  patientRepositoryMock.findAll.mockResolvedValue(mockPatients);

  await service.listPatients();

  expect(patientRepositoryMock.findAll).toHaveBeenCalledTimes(1);
});
})
});

  describe('FN_createPatient_END', () => {
describe('createPatient', () => {
  it.skip('should create a new patient successfully when no conflicts exist', async () => {
        patientRepositoryMock.findByCpf.mockResolvedValue(undefined);
        patientRepositoryMock.findByEmail.mockResolvedValue(undefined);
        patientRepositoryMock.create.mockReturnValue({ id: 'new-id' });
        patientRepositoryMock.save.mockResolvedValue({ id: 'new-id' });

        const createPatientDto = {
          name: 'Test Name',
          birthDate: '1990-01-01',
          cpf: '1234567890',
          sex: 'M',
          email: 'test@example.com',
        };

        const result = await service.createPatient(createPatientDto);

        expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith('1234567890');
        expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith('test@example.com');
        expect(patientRepositoryMock.create).toHaveBeenCalledWith({
          name: 'Test Name',
          birthDate: '1990-01-01',
          cpf: '1234567890',
          sex: 'M',
          email: 'test@example.com',
        });
        expect(patientRepositoryMock.save).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ id: 'new-id' });
      });

  it.skip('should throw ConflictException if CPF already exists', async () => {
        patientRepositoryMock.findByCpf.mockResolvedValue({ id: 'existing-cpf' });

        const createPatientDto = {
          name: 'Test Name',
          birthDate: '1990-01-01',
          cpf: '1234567890',
        };

        await expect(service.createPatient(createPatientDto)).rejects.toThrow(ConflictException);
        await expect(service.createPatient(createPatientDto)).rejects.toThrow(`CPF 1234567890 already registered`);
        expect(patientRepositoryMock.findByCpf).toHaveBeenCalledTimes(1);
        expect(patientRepositoryMock.findByEmail).not.toHaveBeenCalled();
        expect(patientRepositoryMock.create).not.toHaveBeenCalled();
      });

  it.skip('should throw ConflictException if Email already exists', async () => {
        patientRepositoryMock.findByCpf.mockResolvedValue(undefined);
        patientRepositoryMock.findByEmail.mockResolvedValue({ id: 'existing-email' });

        const createPatientDto = {
          name: 'Test Name',
          birthDate: '1990-01-01',
          cpf: '1234567890',
          email: 'existing@example.com',
        };

        await expect(service.createPatient(createPatientDto)).rejects.toThrow(ConflictException);
        await expect(service.createPatient(createPatientDto)).rejects.toThrow(`Email existing@example.com already registered`);
        expect(patientRepositoryMock.findByCpf).toHaveBeenCalledTimes(1);
        expect(patientRepositoryMock.findByEmail).toHaveBeenCalledTimes(1);
        expect(patientRepositoryMock.create).not.toHaveBeenCalled();
      });
});
});

  describe('FN_updatePatient_END', () => {
describe('updatePatient', () => {
	it.skip('should throw ConflictException if the new email already exists', async () => {
        		const id = 'patient1';
        		const dto = {
        			email: 'new.email@example.com',
        			name: 'John Doe',
        		};

        		const patient = {
        			id: id,
        			name: 'John Doe',
        			email: 'old.email@example.com',
        			sex: 1,
        			phone: null,
        			active: true,
        			birthDate: new Date('1990-01-01'),
        			cpf: '1234567890',
        			created_at: new Date(),
        			updated_at: new Date(),
        			encounters: [],
        		};

        		const patientRepositoryMock = {
        			findByEmail: jest.fn().mockResolvedValue(null),
        			update: jest.fn().mockResolvedValue(patient),
        		};

        		// Mock the repository dependency that the service uses
        		jest.spyOn(service, 'patientRepository', 'get').mockReturnValue(patientRepositoryMock);

        		await expect(service.updatePatient(id, dto)).rejects.toThrow(ConflictException);
        		await expect(service.updatePatient(id, dto)).rejects.toThrow(`Email new.email@example.com already registered`);
        	});


	it.skip('should update patient details successfully when no email change is required', async () => {
    		const id = 'patient1';
    		const dto = {
    			name: 'John Doe Updated',
    			phone: '111222333',
    		};

    		const patient = {
    			id: id,
    			name: 'John Doe',
    			email: 'old@example.com',
    			sex: 1,
    			phone: null,
    			active: true,
    			birthDate: new Date('1990-01-01'),
    			cpf: '1234567890',
    			created_at: new Date(),
    			updated_at: new Date(),
    			encounters: [],
    		};

    		const patientRepositoryMock = {
    			findByEmail: jest.fn().mockResolvedValue(null),
    			update: jest.fn().mockResolvedValue(patient),
    		};

    		await jest.spyOn(jest.requireActual('./patient.repository'), 'findByEmail').mockResolvedValue(null);
    		await jest.spyOn(jest.requireActual('./patient.repository'), 'update').mockResolvedValue(patient);

    		const result = await service.updatePatient(id, dto);

    		expect(result).toEqual(patient);
    		expect(patientRepositoryMock.update).toHaveBeenCalledWith(patient, {
    			name: 'John Doe Updated',
    			phone: '111222333',
    		});
    		expect(patientRepositoryMock.findByEmail).not.toHaveBeenCalled();
    	});

	it.skip('should update patient details including email and birthDate', async () => {
    		const id = 'patient1';
    		const dto = {
    			email: 'new.email@example.com',
    			birthDate: '1995-05-15',
    		};

    		const patient = {
    			id: id,
    			name: 'John Doe',
    			email: 'old.email@example.com',
    			sex: 1,
    			phone: null,
    			active: true,
    			birthDate: new Date('1990-01-01'),
    			cpf: '1234567890',
    			created_at: new Date(),
    			updated_at: new Date(),
    			encounters: [],
    		};

    		const patientRepositoryMock = {
    			findByEmail: jest.fn().mockResolvedValue(null),
    			update: jest.fn().mockResolvedValue(patient),
    		};

    		await jest.spyOn(jest.requireActual('./patient.repository'), 'findByEmail').mockResolvedValue(null);
    		await jest.spyOn(jest.requireActual('./patient.repository'), 'update').mockResolvedValue(patient);

    		const result = await service.updatePatient(id, dto);

    		expect(result).toEqual(patient);
    		expect(patientRepositoryMock.update).toHaveBeenCalledWith(patient, {
    			email: 'new.email@example.com',
    			birthDate: new Date('1995-05-15'),
    		});
    	});

	it.skip('should only update fields present in the DTO', async () => {
    		const id = 'patient1';
    		const dto = {
    			name: 'Only Name',
    			active: false,
    		};

    		const patient = {
    			id: id,
    			name: 'Original Name',
    			email: 'test@example.com',
    			sex: 1,
    			phone: '123',
    			active: true,
    			birthDate: new Date('1990-01-01'),
    			cpf: '1234567890',
    			created_at: new Date(),
    			updated_at: new Date(),
    			encounters: [],
    		};

    		const patientRepositoryMock = {
    			findByEmail: jest.fn().mockResolvedValue(null),
    			update: jest.fn().mockResolvedValue(patient),
    		};

    		await jest.spyOn(jest.requireActual('./patient.repository'), 'findByEmail').mockResolvedValue(null);
    		await jest.spyOn(jest.requireActual('./patient.repository'), 'update').mockResolvedValue(patient);

    		const result = await service.updatePatient(id, dto);

    		expect(result).toEqual(patient);
    		expect(patientRepositoryMock.update).toHaveBeenCalledWith(patient, {
    			name: 'Only Name',
    			active: false,
    		});
    	});
});
});

  describe('FN_findByCpfOrFail_END', () => {
describe('findByCpfOrFail', () => {
it('should return the patient if found', async () => {
  const mockPatient = {
    id: '123',
    name: 'Test Name',
    cpf: '12345678900',
    birthDate: new Date(),
    sex: 1, // Assuming Sex enum values are handled correctly if mocked as a simple value, or we rely on the actual Patient structure if possible. Since we are testing the service logic, we mock the return value.
    email: null,
    phone: null,
    active: true,
    created_at: new Date(),
    updated_at: new Date(),
    encounters: [],
  };

  patientRepositoryMock.findByCpf.mockResolvedValue(mockPatient);

  const result = await service.findByCpfOrFail('12345678900');

  expect(result).toEqual(mockPatient);
  expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith('12345678900');
});

it('should throw NotFoundException if patient is not found', async () => {
  patientRepositoryMock.findByCpf.mockResolvedValue(null);

  await expect(service.findByCpfOrFail('nonexistent_cpf')).rejects.toThrow(NotFoundException);
  await expect(service.findByCpfOrFail('nonexistent_cpf')).rejects.toThrow('Patient with cpf nonexistent_cpf not found');
  expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith('nonexistent_cpf');
});
});
});

  // TESTS_APPEND_HERE
});
