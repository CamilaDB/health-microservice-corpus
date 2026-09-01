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
      patientRepositoryMock.findById.mockResolvedValue(null);

      expect(() => service.getPatientById('123')).rejects.toThrow(NotFoundException);
    });


  it('should return patient when found', async () => {
    const patient: Patient = {
      id: '123',
      name: 'John Doe',
      birthDate: new Date('1990-01-01'),
      cpf: '12345678901',
      sex: Sex.M,
      email: 'john.doe@example.com',
      phone: '1234567890',
      active: true,
      created_at: new Date('2023-01-01'),
      updated_at: new Date('2023-01-01'),
      encounters: [],
    };

    patientRepositoryMock.findById.mockResolvedValue(patient);

    expect(await service.getPatientById('123')).toEqual(patient);
  });
})
});

  describe('FN_listPatients_END', () => {
describe('listPatients', () => {
  it('should return an array of patients', async () => {
    const patients: Patient[] = [
      { id: '1', name: 'John Doe', birthDate: new Date('1990-01-01'), cpf: '12345678901', sex: Sex.M, email: 'john.doe@example.com', phone: '1234567890', active: true, created_at: new Date('2021-01-01'), updated_at: new Date('2021-01-01'), encounters: [] },
      { id: '2', name: 'Jane Smith', birthDate: new Date('1995-05-15'), cpf: '09876543210', sex: Sex.F, email: 'jane.smith@example.com', phone: '0987654321', active: true, created_at: new Date('2021-01-01'), updated_at: new Date('2021-01-01'), encounters: [] },
    ];

    patientRepositoryMock.findAll.mockResolvedValue(patients);

    const result = await service.listPatients();

    expect(result).toEqual(patients);
    expect(patientRepositoryMock.findAll).toHaveBeenCalled();
  });

  it.skip('should throw a NotFoundException if no patients are found', async () => {
        patientRepositoryMock.findAll.mockResolvedValue([]);

        await expect(service.listPatients()).rejects.toThrow(NotFoundException);
        expect(patientRepositoryMock.findAll).toHaveBeenCalled();
      });
});
});

  // TESTS_APPEND_HERE
});
