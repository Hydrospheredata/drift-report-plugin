import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FeatureReport, DriftReport } from '../../models';

@Component({
  selector: 'drift-feature-report',
  templateUrl: './feature-report.component.html',
  styleUrls: ['./feature-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureReportComponent implements OnInit {
  @Input() perFeatureReport!: DriftReport['per_feature_report'];
  selectedFeatureReport!: FeatureReport;
  // statistics!: {
  //   [statisticName: string]: {
  //     change_probability?: number | undefined;
  //     deployment: string | number | string[] | number[];
  //     training: string | number | string[] | number[];
  //     message: string;
  //     has_changed: boolean;
  //   };
  // };
  columnsToDisplay = [
    'name',
    'training data',
    'production data',
    "change's status",
  ];

  ngOnInit() {
    if (this.perFeatureReport) {
      this.selectedFeatureReport = this.perFeatureReport[this.featureNames[0]];
    }
  }

  get featureNames(): string[] {
    return this.perFeatureReport ? Object.keys(this.perFeatureReport) : [];
  }
}
