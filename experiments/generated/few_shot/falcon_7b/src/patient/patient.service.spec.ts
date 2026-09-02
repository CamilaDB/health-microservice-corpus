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
    patientRepositoryMock.findById.mockResolvedValueOnce(null);

    await expect(service.getPatientById('1')).rejects.toThrow(NotFoundException);
  });

  it('should return the patient when found', async () => {
    const patient = { id: '1', name: 'John Doe', birthDate: new Date(), cpf: '12345678901', sex: Sex.M, email: 'john@test.com', phone: '1234567890', active: true, created_at: new Date(), updated_at: new Date(), encounters: [] };
    patientRepositoryMock.findById.mockResolvedValueOnce(patient);

    const result = await service.getPatientById('1');

    expect(result).toEqual(patient);
  });
});
});

  describe('FN_listPatients_END', () => {
describe('listPatients', () => {
  it('should return all patients', async () => {
    const patients = [
      { id: '1', name: 'John Doe', birthDate: new Date('1990-01-01'), cpf: '123.456.789-00', sex: Sex.M, email: 'john@example.com', phone: '123-456-7890', active: true, created_at: new Date('2020-01-01'), updated_at: new Date('2020-01-01'), encounters: [] },
      { id: '2', name: 'Jane Doe', birthDate: new Date('1991-02-02'), cpf: '987.654.321-00', sex: Sex.F, email: null, phone: '098-765-4321', active: false, created_at: new Date('2020-01-02'), updated_at: new Date('2020-01-02'), encounters: [] },
    ];

    patientRepositoryMock.findAll.mockResolvedValueOnce(patients);

    const result = await service.listPatients();

    expect(result).toEqual(patients);
  });
});
});

  // TESTS_APPEND_HERE
});
