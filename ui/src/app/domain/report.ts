interface PerFeatureReport {
  [featureName: string]: { [x: string]: number };
}

export interface ReportCommon {
  report: {
    per_feature_report: PerFeatureReport;
  };
}

export const isFeatureFailed =
  (report: PerFeatureReport) => (feature: string) =>
    report[feature]['drift-probability'] > 0.25;
