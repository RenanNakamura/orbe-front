import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {WhatsAppService} from '../../service/whatsapp/whatsapp.service';
import {TranslateService} from '@ngx-translate/core';
import {MessageData} from 'src/app/model/whatsapp/MessageData';
import {Channel} from 'src/app/model/Channel';
import {ActivatedRoute} from '@angular/router';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {ApexOptions} from '@vex/components/vex-chart/vex-chart.component';
import * as echarts from "echarts";

@Component({
  selector: 'vex-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit {

  @ViewChild('lineBarChart', {static: true}) lineBarChart!: ElementRef<HTMLDivElement>;
  @ViewChild('pieBarChart', {static: true}) pieBarChart!: ElementRef<HTMLDivElement>;

  lineBarInstance: echarts.ECharts | null = null;
  pieBarInstance: echarts.ECharts | null = null;

  form: UntypedFormGroup;
  options: Partial<ApexOptions>;
  channels: Channel[];
  periodOptions: any;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private _whatsAppService: WhatsAppService,
    private _translateService: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      phoneNumberId: [null],
      periodValue: [null],
    });

    this.translatePeriodOptions();
    this.form.get('periodValue')?.setValue(15);

    this._activatedRoute.data.subscribe((param) => {
      this.channels = param?.['channels']?.content;

      if (this.channels.length > 0) {
        const phoneNumberIdSelected = this.channels[0].phoneNumberId;
        this.form.get('phoneNumberId')?.setValue(phoneNumberIdSelected);
        this.loadDashBoards(
          phoneNumberIdSelected,
          this.form.get('periodValue').value
        );
      }  else {
        const lastDays = this.form.get('periodValue')?.value || 15;
        const emptyData = this.fillMissingDays([], lastDays);
        this.buildPieBarConfig(emptyData);
        this.buildLineBarConfig(emptyData);
      }
    });

    this.form.get('phoneNumberId')?.valueChanges.subscribe((selectedValue) => {
      this.onChannelChange(selectedValue);
    });

    this.form.get('periodValue')?.valueChanges.subscribe((selectedValue) => {
      this.onPeriodChange(selectedValue);
    });
  }

  private translatePeriodOptions() {
    const translatedPeriods = this._translateService.instant('dashboard.period-list');

    this.periodOptions = Object.entries(translatedPeriods).map(([key, label]) => ({
      value: parseInt(key.replace('last-', ''), 10),
      label,
    }));
  }

  private loadDashBoards(
    phoneNumberIdSelected: string,
    lastDays: string
  ): void {
    this._whatsAppService
      .getMessagesAmountSeries(phoneNumberIdSelected, lastDays)
      .subscribe({
        next: (result) => {
          const data = this.fillMissingDays(result, +lastDays);
          this.buildPieBarConfig(data);
          this.buildLineBarConfig(data);
        },
      });
  }

  private onChannelChange(selectedValue: string): void {
    this.loadDashBoards(selectedValue, this.form.get('periodValue').value);
  }

  private onPeriodChange(selectedValue: string): void {
    this.loadDashBoards(this.form.get('phoneNumberId').value, selectedValue);
  }

  private buildLineBarConfig(datas: MessageData[]) {
    if (!this.lineBarInstance) {
      this.lineBarInstance = echarts.init(this.lineBarChart.nativeElement, undefined, {
        renderer: 'canvas',
        useDirtyRect: false
      });

      window.addEventListener('resize', () => {
        this.lineBarInstance?.resize();
      });
    } else {
      this.lineBarInstance.clear();
    }

    const grouped = datas.reduce((acc, curr) => {
      if (!acc[curr.dayTime]) {
        acc[curr.dayTime] = {};
      }
      if (!acc[curr.dayTime][curr.status]) {
        acc[curr.dayTime][curr.status] = 0;
      }
      acc[curr.dayTime][curr.status] += curr.amount;
      return acc;
    }, {} as Record<string, Record<string, number>>);

    const categories = Object.keys(grouped).sort();
    const allStatuses = Array.from(new Set(datas.map(d => d.status))).sort();
    const statusColors: Record<string, string> = {
      SENT: '#90da8e',
      DELIVERED: '#8dc8f8',
      READ: '#328afc',
      FAILED: '#f6a5b8',
      SENDING: '#fce2a1',
    };

    const series = allStatuses.map(status => ({
      name: this._translateService.instant(status),
      type: 'line',
      itemStyle: {
        color: statusColors[status] || '#9E9E9E'
      },
      data: categories.map(day => grouped[day][status] || 0)
    }));

    const option = {
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: categories
      },
      yAxis: {type: 'value'},
      series
    };

    this.lineBarInstance?.setOption(option);

    console.log(this.lineBarInstance);
  }

  private buildPieBarConfig(datas: MessageData[]) {
    if (!this.pieBarInstance) {
      this.pieBarInstance = echarts.init(this.pieBarChart.nativeElement, undefined, {
        renderer: 'canvas',
        useDirtyRect: false
      });

      window.addEventListener('resize', () => {
        this.pieBarInstance?.resize();
      });
    } else {
      this.pieBarInstance.clear();
    }

    const statusColors: Record<string, string> = {
      SENDING: '#fce2a1',
      SENT: '#90da8e',
      DELIVERED: '#8dc8f8',
      READ: '#328afc',
      FAILED: '#f6a5b8'
    };

    const grouped = datas.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

    const pieData = Object.keys(grouped).map(status => ({
      name: this._translateService.instant(status),
      value: grouped[status],
      itemStyle: {color: statusColors[status] || '#9E9E9E'}
    }));

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        top: '2%',
        left: 'center'
      },
      series: [
        {
          name: 'Message Status',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          label: {
            show: false,
            position: 'center'
          },
          labelLine: {
            show: false
          },
          data: pieData
        }
      ]
    };

    this.pieBarInstance?.setOption(option);
  }

  private fillMissingDays(datas: MessageData[], lastDays: number): MessageData[] {
    const result: MessageData[] = [];
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - lastDays + 1);

    // cria mapa de datas existentes
    const map = new Map<string, MessageData[]>();
    datas.forEach(d => {
      if (!map.has(d.dayTime)) map.set(d.dayTime, []);
      map.get(d.dayTime)?.push(d);
    });

    // gerar os dias preenchidos
    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];

      if (map.has(dateStr)) {
        result.push(...map.get(dateStr)!);
      } else {
        result.push({ dayTime: dateStr, status: 'SENT', amount: 0 });
        result.push({ dayTime: dateStr, status: 'DELIVERED', amount: 0 });
        result.push({ dayTime: dateStr, status: 'READ', amount: 0 });
        result.push({ dayTime: dateStr, status: 'FAILED', amount: 0 });
        result.push({ dayTime: dateStr, status: 'SENDING', amount: 0 });
      }
    }

    return result;
  }

}
