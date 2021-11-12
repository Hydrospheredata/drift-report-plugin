import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriftReportComponent } from '../drift-report/drift-report.component';
import ReportsComponent from './reports.component';

const routes: Routes = [
  { path: '', component: ReportsComponent },
  {
    path: 'drift-report',
    component: DriftReportComponent,
    loadChildren: () =>
      import('../drift-report/drift-report.module').then(
        (m) => m.DriftReportModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
