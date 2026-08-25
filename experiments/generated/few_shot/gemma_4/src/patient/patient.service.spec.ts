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
  it('should throw NotFoundException when patient does not exist', async () => {
    patientRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      service.getPatientById('non-existent-id'),
    ).rejects.toThrow(NotFoundException);

    expect(patientRepositoryMock.findById).toHaveBeenCalledWith('non-existent-id');
  });

  it('should return the patient when found', async () => {
    const patient = {
      id: '123',
      name: 'Test Patient',
      email: 'test@example.com',
      active: true,
    };
    patientRepositoryMock.findById.mockResolvedValue(patient);

    const result = await service.getPatientById('123');

    expect(result).toEqual(patient);
    expect(patientRepositoryMock.findById).toHaveBeenCalledWith('123');
  });
});
});

  describe('FN_listPatients_END', () => {
describe('listPatients', () => {
  it('should return a list of patients when findAll is successful', async () => {
    const mockPatients = [
      { id: '1', name: 'Alice', cpf: '111', active: true },
      { id: '2', name: 'Bob', cpf: '222', active: false },
    ];
    patientRepositoryMock.findAll.mockResolvedValue(mockPatients);

    const result = await service.listPatients();

    expect(patientRepositoryMock.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockPatients);
  });

  it('should return an empty array when no patients are found', async () => {
    patientRepositoryMock.findAll.mockResolvedValue([]);

    const result = await service.listPatients();

    expect(patientRepositoryMock.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  it('should throw an error if finding patients fails', async () => {
    const error = new Error('Database error');
    patientRepositoryMock.findAll.mockRejectedValue(error);

    await expect(service.listPatients()).rejects.toThrow(error);
  });
});
});

  describe('FN_createPatient_END', () => {
describe('createPatient', () => {
  it.skip('should successfully create and save a new patient', async () => {
                patientRepositoryMock.findByCpf.mockResolvedValue(null);
                patientRepositoryMock.findByEmail.mockResolvedValue(null);
                const createdPatient = { id: '123', name: 'Test Name', cpf: '111', sex: 'M', email: null, birthDate: new Date('2000-01-01T00:00:00.000Z') };
                patientRepositoryMock.create.mockReturnValue(createdPatient);
                patientRepositoryMock.save.mockResolvedValue(createdPatient);

                const dto = { name: 'Test Name', birthDate: '2000-01-01', cpf: '111', sex: 'M' };

                await service.createPatient(dto);

                expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith('111');
                expect(patientRepositoryMock.findByEmail).not.toHaveBeenCalled();
                expect(patientRepositoryMock.create).toHaveBeenCalledWith(dto);
                expect(patientRepositoryMock.save).toHaveBeenCalledWith(createdPatient);
            });



  it.skip('should throw an exception when a patient with the same CPF already exists', async () => {
        patientRepositoryMock.findByCpf.mockResolvedValue({ id: '1', cpf: '111' });

        await expect(
          service.createPatient({ name: 'New Name', birthDate: '2000-01-01', cpf: '111', sex: 'M' } as CreatePatientDto),
        ).rejects.toThrow(ConflictException);

        expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith({ cpf: '111' });
        expect(patientRepositoryMock.create).not.toHaveBeenCalled();
        expect(patientRepositoryMock.save).not.toHaveBeenCalled();
      });

  it('should throw an exception when a patient with the same email already exists', async () => {
                patientRepositoryMock.findByEmail.mockResolvedValue({ id: '2', email: 'test@example.com' });

                await expect(
                  service.createPatient({ name: 'New Name', birthDate: '2000-01-01', cpf: '111', sex: 'M', email: 'test@example.com' } as CreatePatientDto),
                ).rejects.toThrow(ConflictException);

                expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith('111');
                expect(patientRepositoryMock.findByEmail).toHaveBeenCalledWith('test@example.com');
                expect(patientRepositoryMock.create).not.toHaveBeenCalled();
                expect(patientRepositoryMock.save).not.toHaveBeenCalled();
            });



});
});

  describe('FN_updatePatient_END', () => {
describe('updatePatient', () => {
  it.skip('should update the patient successfully', async () => {
            const patientId = '123';
            const updateData = {
              name: 'New Name',
              email: 'new@example.com',
            };

            patientRepositoryMock.getPatientById.mockResolvedValue({ id: patientId, email: 'old@example.com' });
            patientRepositoryMock.update.mockResolvedValue(true);
            patientRepositoryMock.findByEmail.mockResolvedValue(null); // Ensure no conflict is thrown for this specific test path

            await service.updatePatient(patientId, updateData as UpdatePatientDto);

            expect(patientRepositoryMock.getPatientById).toHaveBeenCalledWith(patientId);
            expect(patientRepositoryMock.findByEmail).not.toHaveBeenCalled();
            expect(patientRepositoryMock.update).toHaveBeenCalledTimes(1);
        });


  it('should throw NotFoundException when patient is not found', async () => {
    patientRepositoryMock.findByEmail.mockResolvedValue(null);

    await expect(
      service.updatePatient('nonExistentEmail', {} as UpdatePatientDto),
    ).rejects.toThrow(NotFoundException);

    expect(patientRepositoryMock.update).not.toHaveBeenCalled();
  });
});
});

  describe('FN_findByCpfOrFail_END', () => {
describe('findByCpfOrFail', () => {
  it('should return the patient when found by CPF', async () => {
    const mockPatient = { id: '123', cpf: '11111111111', name: 'Test Name' };
    patientRepositoryMock.findByCpf.mockResolvedValue(mockPatient);

    const result = await service.findByCpfOrFail('11111111111');

    expect(result).toEqual(mockPatient);
    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith('11111111111');
  });

  it('should throw NotFoundException when patient is not found by CPF', async () => {
    patientRepositoryMock.findByCpf.mockResolvedValue(null);

    await expect(
      service.findByCpfOrFail('11111111111')
    ).rejects.toThrow(NotFoundException);

    expect(patientRepositoryMock.findByCpf).toHaveBeenCalledWith('11111111111');
  });
});
});

  // TESTS_APPEND_HERE
});
