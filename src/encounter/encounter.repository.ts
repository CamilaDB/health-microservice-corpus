import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Encounter, EncounterStatus } from './entities/encounter.entity';
import { ListEncountersByPatientDto } from './dto/list-encounters-by-patient.dto';

@Injectable()
export class EncounterRepository {
  constructor(
    @InjectRepository(Encounter)
    private readonly repo: Repository<Encounter>,
  ) {}

  findById(id: string): Promise<Encounter | null> {
    return this.repo.findOne({ where: { id }, relations: ['orders'] });
  }

  findActiveByPatient(patientId: string): Promise<Encounter | null> {
    return this.repo.findOne({
      where: [
        { patientId, status: EncounterStatus.ADMITTED },
        { patientId, status: EncounterStatus.TRANSFERRED },
      ],
    });
  }

  findByPatient(
    patientId: string,
    dto: ListEncountersByPatientDto,
  ): Promise<Encounter[]> {
    const qb = this.repo
      .createQueryBuilder('encounter')
      .where('encounter.patientId = :patientId', { patientId });

    if (dto.status) {
      qb.andWhere('encounter.status = :status', { status: dto.status });
    }

    const orderBy = dto.orderBy ?? 'admitDate';
    const order = dto.order ?? 'DESC';
    qb.orderBy(`encounter.${orderBy}`, order);

    return qb.getMany();
  }

  save(encounter: Encounter): Promise<Encounter> {
    return this.repo.save(encounter);
  }

  create(data: Partial<Encounter>): Encounter {
    return this.repo.create(data);
  }
}
