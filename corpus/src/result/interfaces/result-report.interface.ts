import { ExamType } from 'src/order/enums/exam-type.enum';
import { ResultStatus } from '../enums/result-status.enum';

export interface ResultReportItem {
  resultId: string;
  examType: ExamType;
  value: number;
  unit: string;
  status: ResultStatus;
  referenceMin: number | null;
  referenceMax: number | null;
  flag: 'LOW' | 'NORMAL' | 'HIGH' | 'UNKNOWN';
  sourceSystem: string | null;
  resultDate: Date;
}

export interface ResultReport {
  orderId: string;
  examType: ExamType;
  items: ResultReportItem[];
  summary: {
    total: number;
    preliminary: number;
    final: number;
    corrected: number;
    abnormal: number;
  };
}
