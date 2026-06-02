import { Patient } from 'src/patient/entities/patient.entity';
import { Encounter } from '../entities/encounter.entity';

export interface EncounterSummary {
  encounter: Encounter;
  patient: Patient;
  activeDays: number;
  orders: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
  results: {
    total: number;
    abnormal: number;
    preliminary: number;
  };
  hasAbnormalResults: boolean;
  riskFlag: 'LOW' | 'MEDIUM' | 'HIGH';
}
