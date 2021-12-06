import { Report } from '../models/reports';
import { mockDrift1, mockDrift2 } from '../../drift-report/mocks';

export const mockReports: Report[] | any = [
  {
    filename: 's3://adult/inference/batch_1.csv',
    model_name: 'adult',
    model_version: 1,
    report: mockDrift1,
  },
  {
    filename: 's3://adult/inference/batch_2.csv',
    model_name: 'adult',
    model_version: 1,
    report: mockDrift2,
  },
];
