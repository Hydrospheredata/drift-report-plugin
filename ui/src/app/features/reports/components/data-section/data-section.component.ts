import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Report } from '../../models/reports';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterQuery } from '@datorama/akita-ng-router-store';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'drift-data-section',
  templateUrl: './data-section.component.html',
  styleUrls: ['./data-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataSectionComponent {
  @Input() reports!: Report[];
  @Input() features: string[] = [];

  selectedFileName = this.routerQuery.selectParams('fileName').pipe(
    filter(x => x),
    map(x => atob(x)),
  );

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private routerQuery: RouterQuery,
  ) {}

  onColumnClick(column: Report) {
    const encoded = btoa(column.filename);

    this.router.navigate([encoded], { relativeTo: this.route });
  }
}
