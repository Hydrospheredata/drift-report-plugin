import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RouterQuery } from '@datorama/akita-ng-router-store';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class DriftReportHttpService {
  constructor(private http: HttpClient, private routerQuery: RouterQuery) {}

  get<T>(url: string): Observable<T> {
    return this.routerQuery.selectData('shellBackendUrl').pipe(
      switchMap((shellUrlWithBaseHref: string) => {
        if (shellUrlWithBaseHref) {
          return this.http.get<T>(
            `${shellUrlWithBaseHref}/api/v1/plugin-proxy/data_drift/api/${url}`
          );
        } else {
          if (environment.production) {
            const { protocol, hostname } = window.location;
            return this.http.get<T>(`${protocol}//${hostname}/${url}`);
          } else {
            return this.http.get<T>(
              `${environment.host}${
                environment.port ? ':' + environment.port : ''
              }/${url}`
            );
          }
        }
      })
    );
  }
}
