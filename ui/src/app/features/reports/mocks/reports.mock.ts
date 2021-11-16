import { Report } from '../models/reports';
import { mockDrift } from '../../drift-report/mocks';

export const mockReports: Report[] = [
  {
    filename: 's3://adult/inference/batch_1.csv',
    model_name: 'adult',
    model_version: 1,
    report: mockDrift,
  },
];
