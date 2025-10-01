import { Component, OnInit } from '@angular/core';
import { WhatsAppService } from '../../service/whatsapp/whatsapp.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageData } from 'src/app/model/whatsapp/MessageData';
import { Channel } from 'src/app/model/Channel';
import { ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ApexOptions } from '@vex/components/vex-chart/vex-chart.component';

@Component({
  selector: 'vex-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit {
  form: UntypedFormGroup;
  options: Partial<ApexOptions>;
  totalMessagesSent = 0;
  totalMessagesDeliveredAndRead = 0;
  totalMessagesSending = 0;
  totalMessagesRead = 0;
  totalMessagesFailed = 0;
  channels: Channel[];
  periodOptions: any;
  series: ApexNonAxisChartSeries | ApexAxisChartSeries;

  constructor(
      private _activatedRoute: ActivatedRoute,
      private fb: UntypedFormBuilder,
      private _whatsAppService: WhatsAppService,
      private _translateService: TranslateService
  ) {}

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
        .subscribe((data) => {
          this.setTotalAmountMessagesSending(data);
          this.setTotalAmountMessagesSent(data);
          this.setTotalAmountMessagesDeliveredAndRead(data);
          this.setTotalAmountMessagesFailed(data);
          this.buildChartInSeries(data);
        });
  }

  private onChannelChange(selectedValue: string): void {
    this.loadDashBoards(selectedValue, this.form.get('periodValue').value);
  }

  private onPeriodChange(selectedValue: string): void {
    this.loadDashBoards(this.form.get('phoneNumberId').value, selectedValue);
  }

  private setTotalAmountMessagesFailed(data: MessageData[]) {
    this.totalMessagesFailed = data
        .filter((item) => item.status === 'FAILED')
        .reduce((total, item) => total + item.amount, 0);
  }

  private setTotalAmountMessagesDeliveredAndRead(data: MessageData[]) {
    this.totalMessagesDeliveredAndRead = data
        .filter((item) => item.status === 'DELIVERED' || item.status === 'READ')
        .reduce((total, item) => total + item.amount, 0);
  }

  private setTotalAmountMessagesSending(data: MessageData[]) {
    this.totalMessagesSending = data
        .filter((item) => item.status === 'SENDING')
        .reduce((total, item) => total + item.amount, 0);
  }

  private setTotalAmountMessagesSent(data: MessageData[]) {
    this.totalMessagesSent = data.reduce(
        (total, item) => total + item.amount,
        0
    );
  }

  private buildChartInSeries(data: MessageData[]) {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - this.form.get('periodValue').value);

    const dataInSeries = this.fillMissingDates(
        this.transformMessageData(data, 'DELIVERED', 'READ', 'SENT'),
        startDate,
        today
    );

    this.series = [
      {
        name: this._translateService.instant(
            'dashboard.point-of-chart-messages'
        ),
        data: dataInSeries
      }
    ];
  }

  // Método para converter MessageData para o formato { x: string, y: number }
  private transformMessageData(
      data: MessageData[],
      ...filterStatuses: string[]
  ): { x: string; y: number }[] {
    const groupedData: Record<string, number> = {};

    data
        .filter(({ status }) => filterStatuses.length === 0 || filterStatuses.includes(status))
        .forEach(({ dayTime, amount }) => {
          groupedData[dayTime] = (groupedData[dayTime] || 0) + amount;
        });

    return Object.entries(groupedData).map(([dayTime, totalAmount]) => {
      // Converte a data para o formato 'dd/MM/yyyy'
      const [year, month, day] = dayTime.split('-');
      const formattedDate = `${day}/${month}/${year}`;
      return { x: formattedDate, y: totalAmount };
    });
  }

  // Preencher as datas ausentes antes de passar os dados para o gráfico
  private fillMissingDates(data, startDate, endDate) {
    const filledData = [];
    const currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      const dateStr = currentDate.toLocaleDateString(); // Formato 'YYYY-MM-DD'
      const existingData = data.find((d) => d.x === dateStr);

      if (existingData) {
        filledData.push(existingData);
      } else {
        filledData.push({ x: dateStr, y: 0 });
      }

      currentDate.setDate(currentDate.getDate() + 1); // Próximo dia
    }

    return filledData;
  }
}
