import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { DriftReport } from './models';
import { RouterQuery } from '@datorama/akita-ng-router-store';
import { ReportsQuery } from '../reports/state/reports.query';
import { map } from 'rxjs/operators';

@Component({
  selector: 'drift-report',
  templateUrl: './drift-report.component.html',
  styleUrls: ['./drift-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriftReportComponent implements OnInit {
  drift$!: Observable<DriftReport | undefined>;
  fileName$ = this.routerQuery
    .selectParams('fileName')
    .pipe(map(name => atob(name)));

  constructor(private query: ReportsQuery, private routerQuery: RouterQuery) {}

  ngOnInit() {
    this.drift$ = this.query.selectCurrentDriftReport();
  }
}
