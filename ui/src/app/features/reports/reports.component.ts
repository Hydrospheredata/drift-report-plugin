import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ReportsFacade } from './state/reports.facade';
import { Observable } from 'rxjs';
import { Reports } from './models/reports';
import { ReportsQuery } from './state/reports.query';
import { ReportsService } from './state/reports.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'drift-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  providers: [ReportsFacade, ReportsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ReportsComponent implements OnInit {
  reports$!: Observable<Reports>;
  constructor(private facade: ReportsFacade, private query: ReportsQuery, private http: HttpClient) {}
  displayedColumns: string[] = ['batch'];

  // reports: Report[] = [{ batch: 'batch_1.csv' }];

  ngOnInit() {
    this.reports$ = this.query.getReports();

    this.facade.loadReports();
  }
}
