import { DriftReport } from '../../drift-report/models';

export interface Report {
  filename: string;
  model_name: string;
  model_version: number;
  report: DriftReport;
}
