import { Component, Input, OnInit } from '@angular/core';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import {defaultChartOptions} from '@vex/utils/default-chart-options';
import {createDateArray} from '@vex/utils/create-date-array';
import icSend from '@iconify/icons-ic/send';
import icError from '@iconify/icons-ic/error';
import icSending from '@iconify/icons-ic/query-builder';
import {ApexOptions} from '../chart.component';

@Component({
  selector: 'widget-analytics-messages-overview-chart',
  templateUrl: './widget-analytics-messages-overview-chart.html'
})
export class WidgetAnalyticsMessagesOverviewChart implements OnInit {

  @Input() total: number;
  @Input() amountMessagesDeliveredRead: number;
  @Input() amountMessagesSending: number;
  @Input() amountMessagesFailed: number;
  @Input() series: ApexNonAxisChartSeries | ApexAxisChartSeries;
  @Input() options: ApexOptions = defaultChartOptions({
    grid: {
      show: true,
      strokeDashArray: 3,
      padding: {
        left: 16
      }
    },
    chart: {
      type: 'line',
      height: 300,
      sparkline: {
        enabled: false
      },
      zoom: {
        enabled: false
      }
    },
    stroke: {
      width: 4
    },
    labels: createDateArray(12),
    xaxis: {
      type: 'category',
      labels: {
        show: true
      }
    },
    yaxis: {
      labels: {
        show: true
      }
    }
  });

  constructor() { }

  ngOnInit() { }

}
