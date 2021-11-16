import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportsHttpService } from '../reports-http.service';
import { Report } from '../models/reports';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  constructor(private readonly http: ReportsHttpService) {}

  getReports(params: {
    model_name: string;
    model_version: number;
  }): Observable<Report[]> {
    return this.http.get<Report[]>(`report`, params);
  }
}
