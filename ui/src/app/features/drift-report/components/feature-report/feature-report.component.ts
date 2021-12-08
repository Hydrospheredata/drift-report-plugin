import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FeatureReport, DriftReport, Statistics } from '../../models';

@Component({
  selector: 'drift-feature-report',
  templateUrl: './feature-report.component.html',
  styleUrls: ['./feature-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureReportComponent implements OnInit {
  @Input() perFeatureReport!: DriftReport['per_feature_report'];
  selectedFeatureReport!: FeatureReport;
  columnsToDisplayNumerical = [
    'name',
    'training data',
    'production data',
    "change's status",
  ];
  columnsToDisplayCategorical = ['name', "change's status"];

  ngOnInit() {
    if (this.perFeatureReport) {
      this.selectedFeatureReport = this.perFeatureReport[this.featureNames[0]];
    }
  }

  get featureNames(): string[] {
    return this.perFeatureReport ? Object.keys(this.perFeatureReport) : [];
  }

  isCategoricalFeature(statistics: Statistics): boolean {
    return Object.keys(statistics).includes('Category densities');
  }
}
