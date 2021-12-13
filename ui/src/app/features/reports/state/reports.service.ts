import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportsHttpService } from '../reports-http.service';
import { Report } from '../models/reports';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  constructor(private readonly http: ReportsHttpService) {}

  getReports(params: {
    model_name: string;
    model_version: number;
  }): Observable<Report[]> {
    return this.http.get<Report[]>(`report`, params).pipe(
      map(reports =>
        reports.sort((a, b) => {
          return (
            <any>new Date(a.file_timestamp) - <any>new Date(b.file_timestamp)
          );
        }),
      ),
    );
  }
}
