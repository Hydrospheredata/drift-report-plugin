import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DriftReport } from './models';
import { RouterQuery } from '@datorama/akita-ng-router-store';
import { ReportsQuery } from '../reports/state/reports.query';

@Component({
  selector: 'drift-report',
  templateUrl: './drift-report.component.html',
  styleUrls: ['./drift-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriftReportComponent implements OnInit {
  drift$!: Observable<DriftReport | undefined>;
  modelName$ = this.routerQuery.selectParams('modelName');
  modelVersion$ = this.routerQuery.selectParams('modelVersion');

  constructor(
    private http: HttpClient,
    private query: ReportsQuery,
    private routerQuery: RouterQuery,
  ) {}

  ngOnInit() {
    this.drift$ = this.query.selectCurrentDriftReport();
  }
}
