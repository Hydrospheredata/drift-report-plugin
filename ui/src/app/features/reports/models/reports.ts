import { DriftReport } from '../../drift-report/models';

export interface Report {
  filename: string;
  file_timestamp: string;
  model_name: string;
  model_version: number;
  report: DriftReport;
}
