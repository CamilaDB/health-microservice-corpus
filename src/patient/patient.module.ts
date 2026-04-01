import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { PatientRepository } from './patient.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Patient])],
  controllers: [PatientController],
  providers: [PatientService, PatientRepository],
  exports: [PatientService],
})
export class PatientModule {}
