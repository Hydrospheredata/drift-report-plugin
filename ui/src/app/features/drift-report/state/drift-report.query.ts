import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { DriftReportStore, DriftReportState } from './drift-report.store';

@Injectable()
export class DriftReportQuery extends Query<DriftReportState> {
  constructor(protected store: DriftReportStore) {
    super(store);
  }

  getError() {
    return this.select((state) => state.error);
  }

  getDrift() {
    return this.select((state) => state.drift);
  }

  getLoading() {
    return this.select((state) => state.loading);
  }
}
