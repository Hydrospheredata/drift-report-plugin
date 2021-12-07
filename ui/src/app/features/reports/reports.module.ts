import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import ReportsComponent from './reports.component';
import { RouterModule, Routes } from '@angular/router';
import { ReportsRoutingModule } from './reports-routing.module';
import { DriftReportModule } from '../drift-report/drift-report.module';
import { HttpClientModule } from '@angular/common/http';
import { ReportsStore } from './state/reports.store';
import { ReportsQuery } from './state/reports.query';
import { ReportsHttpService } from './reports-http.service';
import { HttpService } from '../http.service';
import { MdlSelectModule } from '@angular-mdl/select';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { DriftReportComponent } from '../drift-report/drift-report.component';
import { AkitaNgRouterStoreModule } from '@datorama/akita-ng-router-store';
import {
  hsIconsIconLeft,
  HsUiKitModule,
  IconsRegistryService,
} from '@hydrosphere/hs-ui-kit';

export const routes: Routes = [
  { path: '', component: ReportsComponent },
  {
    path: ':fileName',
    component: DriftReportComponent,
    loadChildren: () =>
      import('../drift-report/drift-report.module').then(
        m => m.DriftReportModule,
      ),
  },
];

@NgModule({
  declarations: [ReportsComponent],
  imports: [
    CommonModule,
    MatTableModule,
    RouterModule,
    ReportsRoutingModule,
    DriftReportModule,
    HttpClientModule,
    MdlSelectModule,
    FormsModule,
    MatSelectModule,
    RouterModule.forChild(routes),
    AkitaNgRouterStoreModule,
    HsUiKitModule,
  ],
  providers: [
    ReportsStore,
    ReportsQuery,
    ReportsHttpService,
    HttpService,
    IconsRegistryService,
  ],
})
export class ReportsModule {
  constructor(private iconRegistry: IconsRegistryService) {
    this.iconRegistry.registerIcons([hsIconsIconLeft]);
  }
}
