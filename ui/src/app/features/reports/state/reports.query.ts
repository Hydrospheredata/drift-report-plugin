import { Injectable } from '@angular/core';
import { combineQueries, Query } from '@datorama/akita';
import { ReportsStore, ReportsState } from './reports.store';
import { Observable } from 'rxjs';
import { RouterQuery } from '@datorama/akita-ng-router-store';
import { map, pluck } from 'rxjs/operators';
import { DriftReport } from '../../drift-report/models';

@Injectable()
export class ReportsQuery extends Query<ReportsState> {
  reports$ = this.select((s) => s.reports);

  constructor(protected store: ReportsStore, private routerQuery: RouterQuery) {
    super(store);
  }

  selectCurrentDriftReport(): Observable<DriftReport | undefined> {
    return combineQueries([
      this.reports$,
      this.routerQuery.selectParams('fileName'),
    ]).pipe(
      map(([reports, filename]) => {
        const name = decodeURIComponent(filename);
        return reports.find(
          (report: { filename: string }) => report.filename === name
        );
      }),
      pluck('report')
    );
  }
}
