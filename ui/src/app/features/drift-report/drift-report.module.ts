import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriftReportRoutingModule } from './drift-report-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { DriftReportComponent } from './drift-report.component';
import {
  BivariateReportLegendComponent,
  DriftStatusComponent,
  FeatureReportComponent,
  HeatmapComponent,
  HistogramComponent,
} from './components';
import { ColorByDriftDirective } from './directives';
import { MdlSelectModule } from '@angular-mdl/select';
import { FormsModule } from '@angular/forms';
import { BivariateReportComponent } from './components/bivariate-report/bivariate-report.component';
import { DriftReportStore } from './state/drift-report.store';
import { DriftReportQuery } from './state/drift-report.query';
import {
  hsIconsCheck,
  hsIconsIconErrorOutline,
  hsIconsIconLoader,
  hsIconsWarning,
  HsUiKitModule,
  IconsRegistryService,
} from '@hydrosphere/hs-ui-kit';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { DriftReportHttpService } from './drift-report-http.service';

@NgModule({
  declarations: [
    DriftReportComponent,
    FeatureReportComponent,
    ColorByDriftDirective,
    DriftStatusComponent,
    HistogramComponent,
    BivariateReportComponent,
    BivariateReportLegendComponent,
    HeatmapComponent,
  ],
  imports: [
    CommonModule,
    DriftReportRoutingModule,
    HttpClientModule,
    HsUiKitModule,
    MdlSelectModule,
    FormsModule,
    MatSelectModule,
    MatTableModule,
  ],
  providers: [
    DriftReportStore,
    DriftReportQuery,
    IconsRegistryService,
    DriftReportHttpService,
  ],
})
export class DriftReportModule {
  constructor(private iconRegistry: IconsRegistryService) {
    this.iconRegistry.registerIcons([
      hsIconsIconLoader,
      hsIconsIconErrorOutline,
      hsIconsCheck,
      hsIconsWarning,
    ]);
  }
}
