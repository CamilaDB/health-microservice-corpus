import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Encounter } from './entities/encounter.entity';
import { PatientService } from '../patient/patient.service';
import { CreateEncounterDto } from './dto/create-encounter.dto';
import { TransitionEncounterStatusDto } from './dto/transition-encounter-status.dto';
import { ListEncountersByPatientDto } from './dto/list-encounters-by-patient.dto';
import { EncounterRepository } from './encounter.repository';
import { AdtMessageDto } from './dto/adt-message.dto';
import { Patient } from 'src/patient/entities/patient.entity';
import { EncounterStatus } from './enums/encounter-status.enum';
import { AdtType } from './enums/adt-type.enum';
import { Ward } from './enums/ward.enum';
import { OrderStatus } from 'src/order/enums/order-status.enum';
import { UpdateEncounterDto } from './dto/update-encounter.dto';
import { ResultStatus } from 'src/result/enums/result-status.enum';
import { EncounterSummary } from './interfaces/encounter.interface';

@Injectable()
export class EncounterService {
  constructor(
    private readonly encounterRepository: EncounterRepository,
    private readonly patientService: PatientService,
  ) {}

  async createEncounter(dto: CreateEncounterDto): Promise<Encounter> {
    const patient = await this.patientService.getPatientById(dto.patientId);

    if (!patient.active) {
      throw new BadRequestException('Cannot admit an inactive patient');
    }

    const active = await this.encounterRepository.findActiveByPatient(
      dto.patientId,
    );
    if (active) {
      throw new ConflictException(
        `Patient already has an active encounter (id: ${active.id})`,
      );
    }

    const encounter = this.encounterRepository.create({
      ...dto,
      admitDate: new Date(dto.admitDate),
      status: EncounterStatus.ADMITTED,
      ward: dto.ward ?? null,
      transferDate: null,
      dischargeDate: null,
    });

    return this.encounterRepository.save(encounter);
  }

  validateEncounterFields(dto: CreateEncounterDto): void {
    if (dto.adtType === AdtType.A01 && !dto.ward) {
      throw new BadRequestException('Ward is required for ADT A01 (admission)');
    }

    if (dto.adtType === AdtType.A02 && !dto.ward) {
      throw new BadRequestException('Ward is required for ADT A02 (transfer)');
    }

    if (dto.adtType === AdtType.A03 && dto.ward) {
      throw new BadRequestException(
        'Ward must not be informed for ADT A03 (discharge)',
      );
    }

    if (dto.adtType === AdtType.A08 && dto.ward) {
      throw new BadRequestException(
        'Ward must not be informed for ADT A08 (update)',
      );
    }

    if (dto.adtType === AdtType.A08 && !dto.patientId) {
      throw new BadRequestException(
        'PatientId is required for ADT A08 (update)',
      );
    }
  }

  async listEncountersByPatient(
    patientId: string,
    dto: ListEncountersByPatientDto,
  ): Promise<Encounter[]> {
    await this.patientService.getPatientById(patientId);
    return this.encounterRepository.findByPatient(patientId, dto);
  }

  async getEncounterById(id: string): Promise<Encounter> {
    const encounter = await this.encounterRepository.findById(id);
    if (!encounter) {
      throw new NotFoundException(`Encounter with id ${id} not found`);
    }
    return encounter;
  }

  async transitionEncounterStatus(
    id: string,
    dto: TransitionEncounterStatusDto,
  ): Promise<Encounter> {
    const encounter = await this.getEncounterById(id);
    const { status: currentStatus } = encounter;
    const { status: nextStatus } = dto;

    const validTransitions: Record<EncounterStatus, EncounterStatus[]> = {
      [EncounterStatus.ADMITTED]: [
        EncounterStatus.TRANSFERRED,
        EncounterStatus.DISCHARGED,
      ],
      [EncounterStatus.TRANSFERRED]: [EncounterStatus.DISCHARGED],
      [EncounterStatus.DISCHARGED]: [],
    };

    if (!validTransitions[currentStatus].includes(nextStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${nextStatus}`,
      );
    }

    if (nextStatus === EncounterStatus.DISCHARGED) {
      const hasPendingOrders = encounter.orders?.some(
        (order) =>
          order.status === OrderStatus.PENDING ||
          order.status === OrderStatus.IN_PROGRESS,
      );
      if (hasPendingOrders) {
        throw new BadRequestException(
          'Cannot discharge encounter with pending or in-progress orders',
        );
      }
    }

    if (nextStatus === EncounterStatus.TRANSFERRED) {
      if (!dto.ward) {
        throw new BadRequestException('Ward is required for transfer');
      }
      if (dto.ward === encounter.ward) {
        throw new BadRequestException(
          `Transfer requires a different ward. Current ward: ${encounter.ward}`,
        );
      }
    }

    if (nextStatus === EncounterStatus.TRANSFERRED) {
      if (!dto.transferDate) {
        throw new BadRequestException('transferDate is required for transfer');
      }
      const transferDate = new Date(dto.transferDate);
      if (transferDate <= encounter.admitDate) {
        throw new BadRequestException('transferDate must be after admitDate');
      }
      encounter.transferDate = transferDate;
      encounter.ward = dto.ward as Ward;
    }

    if (nextStatus === EncounterStatus.DISCHARGED) {
      if (!dto.dischargeDate) {
        throw new BadRequestException(
          'dischargeDate is required for discharge',
        );
      }
      const dischargeDate = new Date(dto.dischargeDate);
      if (dischargeDate <= encounter.admitDate) {
        throw new BadRequestException('dischargeDate must be after admitDate');
      }
      if (encounter.transferDate && dischargeDate <= encounter.transferDate) {
        throw new BadRequestException(
          'dischargeDate must be after transferDate',
        );
      }
      encounter.dischargeDate = dischargeDate;
    }

    if (
      encounter.adtType === AdtType.A08 &&
      nextStatus !== EncounterStatus.ADMITTED
    ) {
      throw new BadRequestException(
        'ADT A08 encounters cannot have status transitions',
      );
    }

    encounter.status = nextStatus;
    return this.encounterRepository.save(encounter);
  }

  async processAdtMessage(
    dto: AdtMessageDto,
  ): Promise<{ patient: Patient; encounter?: Encounter }> {
    // A01 — Admissão: cria paciente se não existir, cria encounter
    if (dto.adtType === AdtType.A01) {
      if (!dto.name || !dto.birthDate || !dto.sex || !dto.admitDate) {
        throw new BadRequestException(
          'A01 requires: name, birthDate, sex, admitDate',
        );
      }

      let patient = await this.patientService.findByCpfOrFail(dto.cpf);
      if (!patient) {
        patient = await this.patientService.createPatient({
          cpf: dto.cpf,
          name: dto.name,
          birthDate: dto.birthDate,
          sex: dto.sex,
          email: dto.email,
          phone: dto.phone,
        });
      }

      const encounter = await this.createEncounter({
        patientId: patient.id,
        adtType: AdtType.A01,
        admitDate: dto.admitDate,
        ward: dto.ward,
      });

      return { patient, encounter };
    }

    // A02 — Transferência: busca encounter ativo e transiciona
    if (dto.adtType === AdtType.A02) {
      if (!dto.ward || !dto.transferDate) {
        throw new BadRequestException('A02 requires: ward, transferDate');
      }

      const patient = await this.patientService.findByCpfOrFail(dto.cpf);
      const encounter = await this.encounterRepository.findActiveByPatient(
        patient.id,
      );

      if (!encounter) {
        throw new NotFoundException(
          `No active encounter found for patient with cpf ${dto.cpf}`,
        );
      }

      const transitionDto: TransitionEncounterStatusDto = {
        status: EncounterStatus.TRANSFERRED,
        ward: dto.ward,
        transferDate: dto.transferDate,
      };

      const updated = await this.transitionEncounterStatus(
        encounter.id,
        transitionDto,
      );
      return { patient, encounter: updated };
    }

    // A03 — Alta: busca encounter ativo e transiciona para discharged
    if (dto.adtType === AdtType.A03) {
      if (!dto.dischargeDate) {
        throw new BadRequestException('A03 requires: dischargeDate');
      }

      const patient = await this.patientService.findByCpfOrFail(dto.cpf);
      const encounter = await this.encounterRepository.findActiveByPatient(
        patient.id,
      );

      if (!encounter) {
        throw new NotFoundException(
          `No active encounter found for patient with cpf ${dto.cpf}`,
        );
      }

      const transitionDto: TransitionEncounterStatusDto = {
        status: EncounterStatus.DISCHARGED,
        dischargeDate: dto.dischargeDate,
      };

      const updated = await this.transitionEncounterStatus(
        encounter.id,
        transitionDto,
      );
      return { patient, encounter: updated };
    }

    // A08 — Atualização de dados do paciente
    if (dto.adtType === AdtType.A08) {
      if (!dto.name && !dto.birthDate && !dto.sex && !dto.email && !dto.phone) {
        throw new BadRequestException(
          'A08 requires at least one field to update: name, birthDate, sex, email or phone',
        );
      }

      const patient = await this.patientService.findByCpfOrFail(dto.cpf);
      const updated = await this.patientService.updatePatient(patient.id, {
        name: dto.name,
        birthDate: dto.birthDate,
        sex: dto.sex,
        email: dto.email,
        phone: dto.phone,
      });

      return { patient: updated };
    }

    throw new BadRequestException(`Unsupported ADT type: ${dto.adtType}`);
  }

  async updateEncounter(
    id: string,
    dto: UpdateEncounterDto,
  ): Promise<Encounter> {
    const encounter = await this.getEncounterById(id);

    if (encounter.status === EncounterStatus.DISCHARGED) {
      throw new BadRequestException('Cannot update a discharged encounter');
    }

    if (dto.admitDate !== undefined) {
      if (encounter.status !== EncounterStatus.ADMITTED) {
        throw new BadRequestException(
          'admitDate can only be updated when encounter is ADMITTED',
        );
      }

      const admitDate = new Date(dto.admitDate);
      const now = new Date();

      if (admitDate > now) {
        throw new BadRequestException('admitDate cannot be a future date');
      }

      if (
        encounter.transferDate &&
        admitDate >= new Date(encounter.transferDate)
      ) {
        throw new BadRequestException('admitDate must be before transferDate');
      }

      encounter.admitDate = admitDate;
    }

    if (dto.ward !== undefined) {
      if (dto.ward === encounter.ward) {
        throw new BadRequestException(
          `Ward is already ${encounter.ward}. Use status transition for transfers`,
        );
      }
      encounter.ward = dto.ward;
    }

    return this.encounterRepository.save(encounter);
  }

  async buildEncounterSummary(id: string): Promise<EncounterSummary> {
    const encounter = await this.getEncounterById(id);
    const patient = await this.patientService.getPatientById(
      encounter.patientId,
    );

    const admitDate = new Date(encounter.admitDate);
    const now = new Date();
    const activeDays = Math.floor(
      (now.getTime() - admitDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    const orderSummary = {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0,
    };

    const resultSummary = {
      total: 0,
      abnormal: 0,
      preliminary: 0,
    };

    for (const order of encounter.orders ?? []) {
      orderSummary.total++;

      if (order.status === OrderStatus.PENDING) orderSummary.pending++;
      else if (order.status === OrderStatus.IN_PROGRESS)
        orderSummary.inProgress++;
      else if (order.status === OrderStatus.COMPLETED) orderSummary.completed++;
      else if (order.status === OrderStatus.CANCELLED) orderSummary.cancelled++;

      for (const result of order.results ?? []) {
        resultSummary.total++;

        if (result.status === ResultStatus.PRELIMINARY) {
          resultSummary.preliminary++;
        }

        const value = Number(result.value);
        const refMin = result.referenceMin ? Number(result.referenceMin) : null;
        const refMax = result.referenceMax ? Number(result.referenceMax) : null;

        const isAbnormal =
          (refMin !== null && value < refMin) ||
          (refMax !== null && value > refMax);

        if (isAbnormal) resultSummary.abnormal++;
      }
    }

    const hasAbnormalResults = resultSummary.abnormal > 0;

    let riskFlag: 'LOW' | 'MEDIUM' | 'HIGH';
    if (hasAbnormalResults && activeDays > 7) {
      riskFlag = 'HIGH';
    } else if (hasAbnormalResults || activeDays > 7) {
      riskFlag = 'MEDIUM';
    } else {
      riskFlag = 'LOW';
    }

    return {
      encounter,
      patient,
      activeDays,
      orders: orderSummary,
      results: resultSummary,
      hasAbnormalResults,
      riskFlag,
    };
  }
}
