import { Injectable } from '@angular/core';
import { RouterQuery } from '@datorama/akita-ng-router-store';
import { switchMap } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { HttpService } from '../http.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DriftReportHttpService {
  constructor(
    private readonly http: HttpService,
    private routerQuery: RouterQuery
  ) {}

  get<T>(
    url: string,
    params: {
      model_name: string;
      model_version: number;
    }
  ): Observable<T> {
    return this.routerQuery.selectData('shellBackendUrl').pipe(
      switchMap((shellUrlWithBaseHref: string) => {
        if (shellUrlWithBaseHref) {
          return this.http.get<T>(
            `${shellUrlWithBaseHref}/api/v1/plugin-proxy/data_drift/api/${url}`,
            params
          );
        } else {
          if (environment.production) {
            const { protocol, hostname } = window.location;
            return this.http.get<T>(`${protocol}//${hostname}/${url}`, params);
          } else {
            return this.http.get<T>(
              `${environment.host}${
                environment.port ? ':' + environment.port : ''
              }/${url}`,
              params
            );
          }
        }
      })
    );
  }
}
