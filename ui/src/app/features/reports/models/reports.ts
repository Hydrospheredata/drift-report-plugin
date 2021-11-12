import { DriftReport } from '../../drift-report/models';

export interface Reports {
  filename: string;
  model_name: string;
  model_version: number;
  report: DriftReport;
}
