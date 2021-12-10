import { Injectable } from '@angular/core';
import { ReportsService } from './reports.service';
import { catchError, switchMap } from 'rxjs/operators';
import { ReportsStore } from './reports.store';
import { of } from 'rxjs';
import { RouterQuery } from '@datorama/akita-ng-router-store';

@Injectable({ providedIn: 'root' })
export class ReportsFacade {
  constructor(
    private service: ReportsService,
    private store: ReportsStore,
    private routerQuery: RouterQuery,
  ) {}

  public loadReports(): void {
    this.routerQuery
      .selectParams(['modelName', 'modelVersion'])
      .pipe(
        switchMap(([modelName, modelVersion]) => {
          return this.service
            .getReports({ model_name: modelName, model_version: modelVersion })
            .pipe(
              catchError(() => {
                return of(null);
              }),
            );
        }),
      )
      .subscribe(reports => this.store.update({ reports }));
  }
}
