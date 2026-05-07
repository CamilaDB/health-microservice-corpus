import { Module } from '@nestjs/common';
import { EncounterService } from './encounter.service';
import { EncounterController } from './encounter.controller';
import { PatientModule } from 'src/patient/patient.module';
import { Encounter } from './entities/encounter.entity';
import { EncounterRepository } from './encounter.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Encounter]), PatientModule],
  controllers: [EncounterController],
  providers: [EncounterService, EncounterRepository],
  exports: [EncounterService],
})
export class EncounterModule {}
