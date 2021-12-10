import { Injectable } from '@angular/core';
import { StoreConfig, Store } from '@datorama/akita';
import { Report } from '../models/reports';

export interface ReportsState {
  reports: Report[] | null | any;
}

function createInitialState(): ReportsState {
  return {
    reports: null,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'reports' })
export class ReportsStore extends Store<ReportsState> {
  constructor() {
    super(createInitialState());
  }
}
