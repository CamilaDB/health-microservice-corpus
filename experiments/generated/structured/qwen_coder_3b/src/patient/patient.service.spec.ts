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
    jest.spyOn(patientRepositoryMock, 'findById').mockResolvedValueOnce(null);

    await expect(service.getPatientById(id)).rejects.toThrow(NotFoundException);
  });
});
});

  describe('FN_listPatients_END', () => {
describe('listPatients', () => {
  it('should return an empty array if no patients are found', async () => {
    patientRepositoryMock.findAll.mockResolvedValue([]);

    const result = await service.listPatients();

    expect(result).toEqual([]);
  });

  it('should throw a NotFoundException if the repository throws an error', async () => {
        patientRepositoryMock.findAll.mockRejectedValueOnce(new NotFoundException());

        await expect(service.listPatients()).rejects.toThrow(NotFoundException);
      });

});
});

  describe('FN_createPatient_END', () => {
describe('createPatient', () => {
  it('should throw ConflictException if CPF is already registered', async () => {
    const dto = { cpf: '12345678901' };
    patientRepositoryMock.findByCpf.mockResolvedValueOnce({ id: '1' });

    await expect(service.createPatient(dto)).rejects.toThrow(ConflictException);
  });

  it('should throw ConflictException if email is already registered', async () => {
    const dto = { cpf: '09876543210', email: 'test@example.com' };
    patientRepositoryMock.findByCpf.mockResolvedValueOnce({ id: '1' });
    patientRepositoryMock.findByEmail.mockResolvedValueOnce({ id: '2' });

    await expect(service.createPatient(dto)).rejects.toThrow(ConflictException);
  });

  it.skip('should create and save a new patient', async () => {
            const dto = { name: 'John Doe', birthDate: '1990-01-01', cpf: '12345678901' };
            patientRepositoryMock.findByCpf.mockResolvedValueOnce(null);
            patientRepositoryMock.findByEmail.mockResolvedValueOnce(null);
            
            const expectedPatient = {
              ...dto,
              cpf: '12345678901',
              email: undefined,
              birthDate: new Date('1990-01-01'),
            };
            
            await service.createPatient(dto);
            expect(patientRepositoryMock.create).toHaveBeenCalledWith(expectedPatient);
            expect(patientRepositoryMock.save).toHaveBeenCalledWith(expectedPatient);
          });


});
});

  describe('FN_updatePatient_END', () => {
describe('updatePatient', () => {
  it.skip('should throw ConflictException when dto.email is already registered', async () => {
        const patient = { id: '123', email: 'test@example.com' };
        const dto = { email: 'existing@test.com' };

        jest.spyOn(patientRepositoryMock, 'findByEmail').mockResolvedValueOnce({ id: '456', email: 'existing@test.com' });

        await expect(service.updatePatient(patient.id, dto)).rejects.toThrow(ConflictException);
      });
});
});

  describe('FN_findByCpfOrFail_END', () => {
describe('findByCpfOrFail', () => {
  it('should throw NotFoundException when patient is not found', async () => {
    const cpf = '12345678901';
    jest.spyOn(patientRepositoryMock, 'findByCpf').mockResolvedValueOnce(null);

    await expect(service.findByCpfOrFail(cpf)).rejects.toThrow(NotFoundException);
  });
});
});

  // TESTS_APPEND_HERE
});
