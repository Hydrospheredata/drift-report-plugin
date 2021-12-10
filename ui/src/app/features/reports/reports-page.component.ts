import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ReportsFacade } from './state/reports.facade';
import { ReportsService } from './state/reports.service';

@Component({
  templateUrl: './reports-page.component.html',
  providers: [ReportsFacade, ReportsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ReportsPageComponent implements OnInit {
  constructor(private facade: ReportsFacade) {}
  ngOnInit(): void {
    this.facade.loadReports();
  }
}
