import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';

@Injectable()
export class PatientRepository {
  constructor(
    @InjectRepository(Patient)
    private readonly repo: Repository<Patient>,
  ) {}

  findAll(): Promise<Patient[]> {
    return this.repo.find();
  }

  findById(id: string): Promise<Patient | null> {
    return this.repo.findOne({ where: { id } });
  }

  findByCpf(cpf: string): Promise<Patient | null> {
    return this.repo.findOne({ where: { cpf } });
  }

  findByEmail(email: string): Promise<Patient | null> {
    return this.repo.findOne({ where: { email } });
  }

  save(patient: Patient): Promise<Patient> {
    return this.repo.save(patient);
  }

  create(data: Partial<Patient>): Patient {
    return this.repo.create(data);
  }

  async update(patient: Patient, data: Partial<Patient>): Promise<Patient> {
    Object.assign(patient, data);
    return this.repo.save(patient);
  }
}
