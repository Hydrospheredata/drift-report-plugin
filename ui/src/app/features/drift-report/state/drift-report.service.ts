import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DriftReport } from '../models';
import { DriftReportHttpService } from '../drift-report-http.service';

@Injectable({
  providedIn: 'root',
})
export class DriftReportService {
  constructor(private readonly http: DriftReportHttpService) {}

  getDrift(modelName: string, modelVersion: number): Observable<DriftReport> {
    return this.http.get<DriftReport>(
      `drift-report/${modelName}/${modelVersion}`
    );
  }
}
