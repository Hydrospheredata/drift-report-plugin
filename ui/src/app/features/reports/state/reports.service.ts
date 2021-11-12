import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DriftReportHttpService } from '../drift-report-http.service';
import { Reports } from '../models/reports';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  constructor(private readonly http: DriftReportHttpService) {}

  getReports(params: {
    model_name: string;
    model_version: number;
  }): Observable<Reports> {
    return this.http.get<Reports>(`report`, params);
  }
}
