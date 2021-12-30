import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Report } from '../../models/reports';

@Component({
  selector: 'drift-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnComponent implements OnInit {
  @Input() column!: Report;
  @Input() features: string[] = [];

  colors: string[] = [];

  constructor() {}

  ngOnInit(): void {
    this.colors = this.features.map(feature => {
      return this.cellColor(
        this.column.report.per_feature_report[feature]['drift-probability'],
      );
    });
  }

  tooltip(column: Report) {
    return `${new Date(column.file_timestamp)} ${column.filename}`;
  }

  cellColor(drift: number) {
    if (drift === 0 || (drift && drift <= 0.25)) {
      return '#3ebd93';
    } else if (drift && drift > 0.25 && drift <= 0.5) {
      return '#f7c948';
    } else if (drift && drift > 0.5 && drift <= 0.75) {
      return '#cb6e17';
    } else {
      return '#e12d39';
    }
  }
}
