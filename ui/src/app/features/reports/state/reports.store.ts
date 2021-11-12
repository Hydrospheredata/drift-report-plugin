import { Injectable } from '@angular/core';
import { StoreConfig, Store } from '@datorama/akita';
import { Reports } from '../models/reports';

export interface ReportsState {
  // loading: boolean;
  // error: string | null;
  reports: Reports | null | any;
}

function createInitialState(): ReportsState {
  return {
    // loading: false,
    // error: null,
    reports: null,
  };
}

@Injectable()
@StoreConfig({ name: 'stat' })
export class ReportsStore extends Store<ReportsState> {
  constructor() {
    super(createInitialState());
  }
}
