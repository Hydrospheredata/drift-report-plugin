import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { ReportsStore, ReportsState } from './reports.store';

@Injectable()
export class ReportsQuery extends Query<ReportsState> {
  constructor(protected store: ReportsStore) {
    super(store);
  }

  // getError() {
  //   return this.select((state) => state.error);
  // }

  getReports() {
    return this.select((state) => state.reports);
  }

  // getLoading() {
  //   return this.select((state) => state.loading);
  // }
}
