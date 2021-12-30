import { Injectable } from '@angular/core';
import { combineQueries, Query } from '@datorama/akita';
import { ReportsStore, ReportsState } from './reports.store';
import { Observable } from 'rxjs';
import { RouterQuery } from '@datorama/akita-ng-router-store';
import { filter, map, pluck } from 'rxjs/operators';
import { DriftReport } from '../../drift-report/models';
import { ReportCommon } from 'src/app/domain/report';

@Injectable()
export class ReportsQuery extends Query<ReportsState> {
  reports$ = this.select(s => s.reports);

  constructor(protected store: ReportsStore, private routerQuery: RouterQuery) {
    super(store);
  }

  selectCurrentDriftReport(): Observable<DriftReport | undefined> {
    return combineQueries([
      this.reports$,
      this.routerQuery.selectParams('fileName'),
    ]).pipe(
      filter(([reports, filename]) => reports && filename),
      map(([reports, filename]) => {
        const name = atob(filename);
        return reports.find(
          (report: { filename: string }) => report.filename === name,
        );
      }),
      pluck('report'),
      map((report: DriftReport) => {
        const sortedFeatureReport = Object.fromEntries(
          Object.entries(report.per_feature_report).sort(([, a], [, b]) => {
            return b['drift-probability'] - a['drift-probability'];
          }),
        );
        return { ...report, per_feature_report: sortedFeatureReport };
      }),
    );
  }

  selectReports() {
    return this.reports$.pipe(
      map(
        reports =>
          reports &&
          reports.map((reportCommon: ReportCommon) => {
            const perFeatureReport = reportCommon.report.per_feature_report;
            const featureNames = Object.keys(perFeatureReport);

            return {
              ...reportCommon,
              features: featureNames,
            };
          }),
      ),
    );
  }
}
