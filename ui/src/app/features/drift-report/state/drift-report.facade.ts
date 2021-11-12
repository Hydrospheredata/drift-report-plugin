import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DriftReportService } from './drift-report.service';
import { catchError, switchMap } from 'rxjs/operators';
import { DriftReportStore } from './drift-report.store';
import { of } from 'rxjs';
import { RouterQuery } from '@datorama/akita-ng-router-store';

@Injectable()
export class DriftReportFacade {
  constructor(
    private router: ActivatedRoute,
    private service: DriftReportService,
    private store: DriftReportStore,
    private routerQuery: RouterQuery
  ) {}

  public loadDrift(): void {
    this.routerQuery
      .selectParams(['modelName', 'modelVersion'])
      .pipe(
        switchMap(([modelName, modelVersion]) => {
          this.store.update({ loading: true });
          return this.service.getDrift(modelName, modelVersion).pipe(
            catchError((error) => {
              this.store.update({ error, loading: false });
              return of(null);
            })
          );
        })
      )
      .subscribe((drift) => this.store.update({ drift, loading: false }));
  }
}
