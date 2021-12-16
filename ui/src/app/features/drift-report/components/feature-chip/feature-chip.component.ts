import { Component, Input } from '@angular/core';

type DriftStatusIconType = 'error' | 'check' | 'warning';

@Component({
  selector: 'drift-feature-chip',
  templateUrl: './feature-chip.component.html',
  styleUrls: ['./feature-chip.component.scss'],
})
export class FeatureChipComponent {
  @Input() drift: number | undefined;
  @Input() featureName: string = '';
  @Input() selectedFeatureName: string = '';

  constructor() {}

  get iconType(): DriftStatusIconType {
    if (this.drift === 0 || (this.drift && this.drift <= 0.25)) {
      return 'check';
    } else if (this.drift && this.drift > 0.25 && this.drift <= 0.75) {
      return 'error';
    } else {
      return 'warning';
    }
  }

  get iconColor(): string {
    if (this.drift === 0 || (this.drift && this.drift <= 0.25)) {
      return '#3ebd93';
    } else if (this.drift && this.drift > 0.25 && this.drift <= 0.5) {
      return '#f7c948';
    } else if (this.drift && this.drift > 0.5 && this.drift <= 0.75) {
      return '#cb6e17';
    } else {
      return '#e12d39';
    }
  }
}
