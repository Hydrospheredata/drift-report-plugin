import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { ReportsModule } from '../features/reports/reports.module';

@NgModule({
  declarations: [LayoutComponent],
  imports: [CommonModule, LayoutRoutingModule, ReportsModule],
})
export class LayoutModule {}
