export interface FeatureReportHistogram {
  bins: Array<number | string>;
  deployment: number[];
  training: number[];
}

export interface FeatureReport {
  'drift-probability': number;
  histogram: FeatureReportHistogram;
  statistics: {
    [statisticName: string]: {
      change_probability?: number;
      deployment: number | string | string[] | number[];
      training: number | string | string[] | number[];
      message: string;
      has_changed: boolean;
    };
  };
}

export interface DriftReport {
  overall_probability_drift: number;
  per_feature_report: {
    [featureName: string]: FeatureReport;
  };
  warnings: {
    final_decision: string | null;
    report: Array<{ drift_probability_per_feature: number; message: string }>;
  };
}
