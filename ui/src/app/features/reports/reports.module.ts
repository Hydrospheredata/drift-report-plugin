import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import ReportsComponent from './reports.component';
import { RouterModule } from '@angular/router';
import { ReportsRoutingModule } from './reports-routing.module';
import { DriftReportModule } from '../drift-report/drift-report.module';
import { HttpClientModule } from '@angular/common/http';
import { ReportsStore } from './state/reports.store';
import { ReportsQuery } from './state/reports.query';
import { DriftReportHttpService } from './drift-report-http.service';
import { HttpService } from '../http.service';

@NgModule({
  declarations: [ReportsComponent],
  imports: [
    CommonModule,
    MatTableModule,
    RouterModule,
    ReportsRoutingModule,
    DriftReportModule,
    HttpClientModule,
  ],
  providers: [ReportsStore, ReportsQuery, DriftReportHttpService, HttpService],
})
export class ReportsModule {}
