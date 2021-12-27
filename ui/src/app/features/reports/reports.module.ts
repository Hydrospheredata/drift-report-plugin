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
import { ReportsHttpService } from './reports-http.service';
import { HttpService } from '../http.service';
import { MdlSelectModule } from '@angular-mdl/select';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { AkitaNgRouterStoreModule } from '@datorama/akita-ng-router-store';
import {
  hsIconsIconLeft,
  HsUiKitModule,
  IconsRegistryService,
} from '@hydrosphere/hs-ui-kit';
import ReportsPageComponent from './reports-page.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [ReportsComponent, ReportsPageComponent],
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
    AkitaNgRouterStoreModule,
    HsUiKitModule,
    MatProgressSpinnerModule,
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
