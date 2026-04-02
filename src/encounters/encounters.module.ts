import { Module } from '@nestjs/common';
import { EncountersService } from './encounters.service';
import { EncountersController } from './encounters.controller';
import { PatientModule } from 'src/patient/patient.module';
import { Encounter } from './entities/encounter.entity';
import { EncounterRepository } from './encounters.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Encounter]), PatientModule],
  controllers: [EncountersController],
  providers: [EncountersService, EncounterRepository],
  exports: [EncountersService],
})
export class EncountersModule {}
