import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DriftReportService } from './state/drift-report.service';
import { Observable, of } from 'rxjs';
import { DriftReport } from './models';
import { DriftReportQuery } from './state/drift-report.query';
import { DriftReportFacade } from './state/drift-report.facade';
import { mockDrift } from './mocks';

@Component({
  templateUrl: './drift-report.component.html',
  styleUrls: ['./drift-report.component.scss'],
  providers: [DriftReportService, DriftReportFacade],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriftReportComponent implements OnInit {
  drift$!: Observable<DriftReport | null>;
  error$!: Observable<string | null>;
  isLoading$!: Observable<boolean>;

  constructor(
    private http: HttpClient,
    private query: DriftReportQuery,
    private facade: DriftReportFacade
  ) {}

  ngOnInit() {
    this.error$ = this.query.getError();
    this.drift$ = of(mockDrift);
    // this.drift$ = this.query.getDrift();
    this.isLoading$ = this.query.getLoading();

    this.facade.loadDrift();
  }
}
