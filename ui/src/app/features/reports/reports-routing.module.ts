import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriftReportComponent } from '../drift-report/drift-report.component';
import ReportsPageComponent from './reports-page.component';
import ReportsComponent from './reports.component';

export const routes: Routes = [
  {
    path: '',
    component: ReportsPageComponent,
    children: [
      { path: '', component: ReportsComponent },
      {
        path: ':fileName',
        component: DriftReportComponent,
        loadChildren: () =>
          import('../drift-report/drift-report.module').then(
            m => m.DriftReportModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
