import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientRepository } from './patient.repository';

@Injectable()
export class PatientService {
  constructor(private readonly patientRepository: PatientRepository) {}

  async getPatientById(id: string): Promise<Patient> {
    const patient = await this.patientRepository.findById(id);
    if (!patient) {
      throw new NotFoundException(`Patient with id ${id} not found`);
    }
    return patient;
  }

  listPatients(): Promise<Patient[]> {
    return this.patientRepository.findAll();
  }

  async createPatient(dto: CreatePatientDto): Promise<Patient> {
    const normalizedCpf = dto.cpf.replace(/[.-]/g, '');
    const normalizedEmail = dto.email?.toLowerCase();

    const existingCpf = await this.patientRepository.findByCpf(normalizedCpf);
    if (existingCpf) {
      throw new ConflictException(`CPF ${dto.cpf} already registered`);
    }

    if (normalizedEmail) {
      const existingEmail =
        await this.patientRepository.findByEmail(normalizedEmail);
      if (existingEmail) {
        throw new ConflictException(`Email ${dto.email} already registered`);
      }
    }

    const patient = this.patientRepository.create({
      ...dto,
      cpf: normalizedCpf,
      email: normalizedEmail,
      birthDate: new Date(dto.birthDate),
    });
    return this.patientRepository.save(patient);
  }

  async updatePatient(id: string, dto: UpdatePatientDto): Promise<Patient> {
    const patient = await this.getPatientById(id);

    if (dto.email && dto.email.toLowerCase() !== patient.email) {
      const existingEmail = await this.patientRepository.findByEmail(
        dto.email.toLowerCase(),
      );
      if (existingEmail) {
        throw new ConflictException(`Email ${dto.email} already registered`);
      }
    }

    const updateData: Partial<Patient> = {
      ...(dto.name && { name: dto.name }),
      ...(dto.sex && { sex: dto.sex }),
      ...(dto.phone !== undefined && { phone: dto.phone }),
      ...(dto.active !== undefined && { active: dto.active }),
      ...(dto.email && { email: dto.email.toLowerCase() }),
      ...(dto.birthDate && { birthDate: new Date(dto.birthDate) }),
    };

    return this.patientRepository.update(patient, updateData);
  }

  async findByCpfOrFail(cpf: string): Promise<Patient> {
    const patient = await this.patientRepository.findByCpf(cpf);
    if (!patient) {
      throw new NotFoundException(`Patient with cpf ${cpf} not found`);
    }
    return patient;
  }
}
