import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ColorPaletteService } from '../../utils/color-palette.service';
import * as Highcharts from 'highcharts';
import { Chart } from 'highcharts';
import { FeatureReportHistogram } from '../../models';

@Component({
  selector: 'drift-histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistogramComponent implements OnChanges, AfterViewInit {
  @Input() config!: FeatureReportHistogram;
  @ViewChild('anchor', { read: ElementRef, static: true }) anchor!: ElementRef;
  private chart!: Chart;

  constructor(private readonly colorPalette: ColorPaletteService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.config && changes.config.currentValue && this.chart) {
      const { bins, training, deployment } = changes.config
        .currentValue as FeatureReportHistogram;
      this.chart.series[0].update({ type: 'column', data: training });
      this.chart.series[1].update({ type: 'column', data: deployment });
      this.chart.axes[0].update({ categories: bins as string[] });

      this.chart.tooltip.update({
        formatter: function () {
          return chooseFormatter.call(this, bins, deployment);
        },
      });
    }
  }

  ngAfterViewInit(): void {
    const bins = this.config.bins as string[];
    const deployment = this.config.deployment;
    const [trainingColor, productionColor] =
      this.colorPalette.getComplementaryColors();
    this.chart = Highcharts.chart(this.anchor.nativeElement, {
      chart: {
        type: 'histogram',
      },
      yAxis: {
        title: {
          text: 'Density',
        },
        min: 0,
      },
      title: {
        text: '',
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        shared: true,
        useHTML: true,
        formatter: function () {
          return chooseFormatter.call(this, bins, deployment);
        },
      },
      plotOptions: {
        column: {
          grouping: false,
          shadow: false,
          groupPadding: 0,
          borderWidth: 0,
          pointPadding: 0,
        },
      },
      xAxis: {
        categories: this.config.bins as string[],
        labels: {
          format: '{value:,.5f}',
        },
      },
      series: [
        {
          type: 'column',
          name: 'Training Data',
          data: this.config.training,
          color: trainingColor,
          opacity: 0.8,
        },
        {
          type: 'column',
          name: 'Production Data',
          data: this.config.deployment,
          color: productionColor,
          opacity: 0.8,
        },
      ],
    });
  }
}

function chooseFormatter(
  this: any,
  bins: string | any[],
  deployment: string | any[]
) {
  if (bins.length > deployment.length) {
    const binIndex = bins.indexOf(this.x);
    return `
            <div style="color: #102A43;line-height: 24px;font-weight: bold">${
              bins[binIndex]
            } - ${bins[binIndex + 1]}</div>
            <div style="color: #334E68;line-height: 18px">${
              this.points[0].series.name
            }: <span style="color: ${this.points[0].color};font-weight: bold">${
      this.points[0].y
    }</span></div>
            <div style="color: #334E68;line-height: 18px">${
              this.points[1].series.name
            }: <span style="color: ${this.points[1].color};font-weight: bold">${
      this.points[1].y
    }</span></div>
          `;
  } else {
    return `
            <div style="color: #102A43;line-height: 24px;font-weight: bold">${this.x}</div>
            <div style="color: #334E68;line-height: 18px">${this.points[0].series.name}: <span style="color: ${this.points[0].color};font-weight: bold">${this.points[0].y}</span></div>
            <div style="color: #334E68;line-height: 18px">${this.points[1].series.name}: <span style="color: ${this.points[1].color};font-weight: bold">${this.points[1].y}</span></div>
          `;
  }
}
