import { NgModule } from '@angular/core';
import { DriftReportRoutingModule } from './drift-report-routing.module';
import { DriftReportComponent } from './drift-report.component';
import {
  BivariateReportLegendComponent,
  DriftStatusComponent,
  FeatureReportComponent,
  HeatmapComponent,
  HistogramComponent,
} from './components';
import { ColorByDriftDirective } from './directives';
import { BivariateReportComponent } from './components/bivariate-report/bivariate-report.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  hsIconsCheck,
  hsIconsIconErrorOutline,
  hsIconsIconLoader,
  hsIconsWarning,
  HsUiKitModule,
  IconsRegistryService,
} from '@hydrosphere/hs-ui-kit';
import { MdlSelectModule } from '@angular-mdl/select';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ReportsHttpService } from '../reports/reports-http.service';

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
  providers: [IconsRegistryService, ReportsHttpService],
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
