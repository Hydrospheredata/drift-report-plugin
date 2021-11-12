import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriftReportComponent } from './drift-report.component';

const routes: Routes = [{ path: '', component: DriftReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriftReportRoutingModule {}
