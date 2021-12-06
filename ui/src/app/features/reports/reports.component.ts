import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ReportsFacade } from './state/reports.facade';
import { ReportsQuery } from './state/reports.query';
import { ReportsService } from './state/reports.service';
import { RouterQuery } from '@datorama/akita-ng-router-store';

@Component({
  selector: 'drift-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  providers: [ReportsFacade, ReportsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ReportsComponent {
  reports$ = this.query.selectReports();
  modelName$ = this.routerQuery.selectParams('modelName');
  modelVersion$ = this.routerQuery.selectParams('modelVersion');

  constructor(
    private facade: ReportsFacade,
    private query: ReportsQuery,
    private routerQuery: RouterQuery
  ) {
    this.facade.loadReports();
  }
  displayedColumns: string[] = [
    'batch',
    'failed features',
    'total number of features',
  ];

  encode(url: any) {
    return encodeURIComponent(url);
  }
}
