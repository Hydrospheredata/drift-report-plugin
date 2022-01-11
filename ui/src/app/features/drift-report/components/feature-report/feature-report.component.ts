import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FeatureReport, DriftReport, Statistics } from '../../models';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'drift-feature-report',
  templateUrl: './feature-report.component.html',
  styleUrls: ['./feature-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureReportComponent implements OnChanges {
  @Input() perFeatureReport!: DriftReport['per_feature_report'];
  selectedFeatureReport!: FeatureReport;
  selectedFeatureName: string = '';
  columnsToDisplayNumerical = [
    'name',
    'training data',
    'production data',
    "change's status",
  ];
  columnsToDisplayCategorical = ['name', "change's status"];

  ngOnChanges(changes: SimpleChanges) {
    if (this.perFeatureReport) {
      this.selectedFeatureReport = this.perFeatureReport[this.featureNames[0]];
      this.selectedFeatureName = this.featureNames[0];
    }
  }

  get featureNames(): string[] {
    return this.perFeatureReport ? Object.keys(this.perFeatureReport) : [];
  }

  isCategoricalFeature(statistics: Statistics): boolean {
    return Object.keys(statistics).includes('Category densities');
  }

  sortByDrift(
    a: KeyValue<string, FeatureReport>,
    b: KeyValue<string, FeatureReport>,
  ) {
    return b.value['drift-probability'] - a.value['drift-probability'];
  }

  selectFeature(featureReport: KeyValue<string, FeatureReport>) {
    this.selectedFeatureReport = featureReport.value;
    this.selectedFeatureName = featureReport.key;
  }
}
