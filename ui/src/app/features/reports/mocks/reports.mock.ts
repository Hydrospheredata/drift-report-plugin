import { Report } from '../models/reports';
import { mockDrift1, mockDrift2 } from '../../drift-report/mocks';

export const mockReports: Report[] | any = [
  {
    filename: 's3://adult/inference/batch_1.csv',
    file_timestamp: '2021-12-10 15:41:24.298000',
    model_name: 'adult',
    model_version: 1,
    report: mockDrift1,
  },
  {
    filename: 's3://adult/inference/batch_2.csv',
    file_timestamp: '2021-12-10 15:41:25.272000',
    model_name: 'adult',
    model_version: 1,
    report: mockDrift2,
  },
  {
    filename: 's3://adult/inference/batch_3.csv',
    file_timestamp: '2021-12-10 15:41:24.786000',
    model_name: 'adult',
    model_version: 1,
    report: mockDrift2,
  },
];
