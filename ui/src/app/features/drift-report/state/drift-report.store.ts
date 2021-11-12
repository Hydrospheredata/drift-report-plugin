import { Injectable } from '@angular/core';
import { StoreConfig, Store } from '@datorama/akita';
import { DriftReport } from '../models';

export interface DriftReportState {
  loading: boolean;
  error: string | null;
  drift: DriftReport | null | any;
}

function createInitialState(): DriftReportState {
  return {
    loading: false,
    error: null,
    drift: null,
  };
}

@Injectable()
@StoreConfig({ name: 'stat' })
export class DriftReportStore extends Store<DriftReportState> {
  constructor() {
    super(createInitialState());
  }
}
