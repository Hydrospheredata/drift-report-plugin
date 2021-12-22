import { NgModule } from '@angular/core';
import { DriftReportRoutingModule } from './drift-report-routing.module';
import { DriftReportComponent } from './drift-report.component';
import {
  DriftStatusComponent,
  FeatureReportComponent,
  HeatmapComponent,
  HistogramComponent,
} from './components';
import { ColorByDriftDirective } from './directives';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  hsIconsCheck,
  hsIconsError,
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
import { FeatureChipComponent } from './components/feature-chip/feature-chip.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    DriftReportComponent,
    FeatureReportComponent,
    ColorByDriftDirective,
    DriftStatusComponent,
    HistogramComponent,
    HeatmapComponent,
    FeatureChipComponent,
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
    MatProgressSpinnerModule,
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
      hsIconsError,
    ]);
  }
}
