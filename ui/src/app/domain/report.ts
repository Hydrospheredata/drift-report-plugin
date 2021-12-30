interface PerFeatureReport {
  [featureName: string]: { [x: string]: number };
}

export interface ReportCommon {
  report: {
    per_feature_report: PerFeatureReport;
  };
}
