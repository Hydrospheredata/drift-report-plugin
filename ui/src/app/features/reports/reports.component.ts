import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ReportsQuery } from './state/reports.query';
import { RouterQuery } from '@datorama/akita-ng-router-store';

@Component({
  selector: 'drift-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ReportsComponent {
  reports$ = this.query.selectReports();
  modelName$ = this.routerQuery.selectParams('modelName');
  modelVersion$ = this.routerQuery.selectParams('modelVersion');

  constructor(private query: ReportsQuery, private routerQuery: RouterQuery) {}

  displayedColumns: string[] = [
    'batch',
    'failed features',
    'total number of features',
  ];

  encode(url: any) {
    return btoa(url);
  }
}
