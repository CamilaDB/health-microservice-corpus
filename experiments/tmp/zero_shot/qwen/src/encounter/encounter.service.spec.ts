// AUTO-GENERATED-BOOTSTRAP-START
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { OrderStatus } from '../order/enums/order-status.enum';
import { CreatePatientDto } from '../patient/dto/create-patient.dto';
import { UpdatePatientDto } from '../patient/dto/update-patient.dto';
import { Sex } from '../patient/enums/sex.enum';
import { AdtMessageDto } from './dto/adt-message.dto';
import { CreateEncounterDto } from './dto/create-encounter.dto';
import { ListEncountersByPatientDto } from './dto/list-encounters-by-patient.dto';
import { TransitionEncounterStatusDto } from './dto/transition-encounter-status.dto';
import { AdtType } from './enums/adt-type.enum';
import { EncounterStatus } from './enums/encounter-status.enum';
import { Ward } from './enums/ward.enum';
import { EncounterService } from './encounter.service';
import { EncounterRepository } from './encounter.repository';
import { PatientService } from '../patient/patient.service';

describe('EncounterService', () => {

  let service: EncounterService;
  let encounterRepositoryMock: jest.Mocked<EncounterRepository>;
  let patientServiceMock: jest.Mocked<PatientService>;

  beforeEach(async () => {

    encounterRepositoryMock = {
          findById: jest.fn().mockResolvedValue(undefined),
          findActiveByPatient: jest.fn().mockResolvedValue(undefined),
          findByPatient: jest.fn().mockResolvedValue(undefined),
          save: jest.fn().mockResolvedValue(undefined),
          create: jest.fn().mockReturnValue(undefined),
        } as jest.Mocked<EncounterRepository>;

    patientServiceMock = {
          getPatientById: jest.fn().mockResolvedValue(undefined),
          listPatients: jest.fn().mockResolvedValue(undefined),
          createPatient: jest.fn().mockResolvedValue(undefined),
          updatePatient: jest.fn().mockResolvedValue(undefined),
          findByCpfOrFail: jest.fn().mockResolvedValue(undefined),
        } as jest.Mocked<PatientService>;

    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          EncounterService,
          { provide: EncounterRepository, useValue: encounterRepositoryMock },
          { provide: PatientService, useValue: patientServiceMock },
        ],
      }).compile();

    service = module.get<EncounterService>(EncounterService);

    jest.clearAllMocks();
  });
  // AUTO-GENERATED-BOOTSTRAP-END

  // TESTS_APPEND_HERE
});
