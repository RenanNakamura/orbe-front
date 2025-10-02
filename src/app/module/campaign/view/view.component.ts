import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Campaign, CampaignContact, CampaignDashboard, CampaignParams} from '../../../model/Campaign';
import {TargetAudienceType} from '../form/form.component';
import moment from 'moment-timezone';
import {stagger80ms} from '@vex/animations/stagger.animation';
import {fadeInUp400ms} from '@vex/animations/fade-in-up.animation';
import {scaleIn400ms} from '@vex/animations/scale-in.animation';
import {fadeInRight400ms} from '@vex/animations/fade-in-right.animation';
import {TranslateService} from '@ngx-translate/core';
import {CampaignService} from '../../../service/campaign/campaign.service';
import {CampaignContactService} from '../../../service/campaign/campaign-contact.service';
import {UntypedFormControl} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';
import {MatTableDataSource} from '@angular/material/table';
import {Sort} from '@angular/material/sort';
import {TableColumn} from '@vex/interfaces/table-column.interface';
import {PageEvent} from '@angular/material/paginator';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions} from '@angular/material/form-field';
import {PhoneUtil} from '../../../util/phone.util';
import {MatDialog} from '@angular/material/dialog';
import {InfoErrorDialogComponent} from '../../sk/info-error-dialog/info-error-dialog.component';
import {LanguageService} from 'src/app/service/sk/language.service';
import * as echarts from 'echarts';

@Component({
  selector: 'vex-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class ViewComponent implements OnInit, AfterViewInit {

  @ViewChild('pieChart', {static: true}) pieChart!: ElementRef<HTMLDivElement>;

  campaign: Campaign;
  sentCount = 0;
  deliveredCount = 0;
  readCount = 0;
  waitingCount = 0;
  sendingCount = 0;
  shootingErrorCount = 0;
  invalidNumberErrorCount = 0;
  whatsAppNotExistCount = 0;
  errorCount = 0;
  failedCount = 0;
  totalCount = 0;
  triggeredMessagesCount = 0;
  progress = 0;

  chartInstance: echarts.ECharts | null = null;

  pageSize = 10;
  pageIndex = 0;
  sortBy = 'name,asc';
  pageSizeOptions: number[] = [5, 10, 20, 50];
  length = 0;

  searchCtrl = new UntypedFormControl();

  dataSource = new MatTableDataSource<CampaignContact>();

  columns: TableColumn<CampaignContact>[] = [
    {label: 'name', property: 'name', type: 'text', visible: true, cssClasses: ['font-medium']},
    {label: 'email', property: 'email', type: 'text', visible: true},
    {label: 'number', property: 'phone', type: 'text', visible: true},
    {label: 'status', property: 'status', type: 'enum', visible: true}
  ];

  constructor(private activatedRoute: ActivatedRoute,
              private _service: CampaignService,
              private _contactservice: CampaignContactService,
              private _cd: ChangeDetectorRef,
              private _dialog: MatDialog,
              private _translate: TranslateService,
              private _languageService: LanguageService) {
  }

  ngOnInit(): void {
    this.activatedRoute
      .data
      .subscribe(param => {
        this.campaign = param?.['data'];
        this.loadDashboard(this.campaign?.id);
        this.loadContacts(this.campaign?.id);
      });

    this.loadPieConfig();

    this.searchCtrl.valueChanges
      .pipe(debounceTime(600))
      .subscribe(() => this.loadContacts(this.campaign?.id));
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.chartInstance = echarts.init(this.pieChart.nativeElement);
      this.loadPieConfig();
    }, 100);
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  onGetTargetAudienceTypeI18n(type: string): string {
    switch (type) {
      case TargetAudienceType.FILE:
        return 'target-audience-type.file';
      default:
        return 'target-audience-type.filter';
    }
  }

  onGetSchedulingMessage(scheduling): string {
    if (!scheduling) {
      return 'send-type.immediately';
    }

    return moment(scheduling).format('DD/MM/YYYY HH:mm:ss');
  }

  onGetTotalMessagesLabel(): string {
    return this._translate.instant('totalMessages');
  }

  onSortBy(event: Sort) {
    this.sortBy = event.active && event.direction && event.active !== 'actions' ? Object.values(event).join(',') : '';
    this.loadContacts(this.campaign?.id);
  }

  onPage(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;

    this.loadContacts(this.campaign?.id);
  }

  hasError(row: CampaignContact) {
    return (row.status === 'SHOOTING_ERROR' || row.status === 'FAILED') && !!row.error;
  }

  onShowError(row: CampaignContact) {
    const message = this._languageService.isPtBR() ? row?.error?.messages.pt_br : row?.error?.messages.en_us;

    const config = {
      code: row?.error?.code,
      details: message,
    };

    this._dialog.open(InfoErrorDialogComponent, {width: '400px', data: config})
      .afterClosed()
      .subscribe();
  }

  private loadPieConfig() {
    const waiting = this._translate.instant('totalMessagesWaitingSending');
    const sending = this._translate.instant('totalMessagesSending');
    const sent = this._translate.instant('totalMessagesSent');
    const delivered = this._translate.instant('totalMessagesDelivered');
    const read = this._translate.instant('totalMessagesRead');
    const error = this._translate.instant('totalMessagesError');
    const failed = this._translate.instant('totalMessagesFailed');

    const labels = [waiting, sending, sent, delivered, read, error, failed];
    const data = [
      this.waitingCount,
      this.sendingCount,
      this.sentCount,
      this.deliveredCount,
      this.readCount,
      this.errorCount,
      this.failedCount
    ];

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        top: '5%',
        left: 'center',
        data: labels
      },
      series: [
        {
          name: this._translate.instant('totalMessages'),
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          data: labels.map((label, i) => ({value: data[i], name: label})),
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
        }
      ],
      color: ['#f1f2f4', '#fce2a1', '#90da8e', '#8dc8f8', '#008afc', '#f6a5b8', '#c0c2c4']
    };

    this.chartInstance?.setOption(option);
  }

  private loadDashboard(id: string) {
    this._service.dashboard(id)
      .subscribe(dash => {
        this.loadCount(dash);
        this.loadPieConfig();

        this._cd.detectChanges();
      });
  }

  private loadContacts(id: string) {
    const params = Object.assign(this.getDefaultParams(), {campaignId: id});

    this._contactservice.list(params)
      .subscribe(data => {
        this.dataSource.data = data.content
          .map(contact => Object.assign(contact, {phone: PhoneUtil.getPhoneWithMask(contact.phone)}));
        this.length = data.totalElements;
      });
  }

  private getDefaultParams(): CampaignParams {
    return {
      size: this.pageSize,
      page: this.pageIndex,
      sort: this.sortBy || 'name,asc',
      search: this.searchCtrl.value || ''
    };
  }

  private loadCount(dash: CampaignDashboard) {
    this.sentCount = dash?.sentCount || 0;
    this.deliveredCount = dash?.deliveredCount || 0;
    this.readCount = dash?.readCount || 0;
    this.waitingCount = dash?.waitingCount || 0;
    this.sendingCount = dash?.sendingCount || 0;
    this.shootingErrorCount = dash?.shootingErrorCount || 0;
    this.invalidNumberErrorCount = dash?.invalidNumberCount || 0;
    this.whatsAppNotExistCount = dash?.whatsAppNotExistCount || 0;
    this.errorCount = this.shootingErrorCount + this.invalidNumberErrorCount + this.whatsAppNotExistCount;
    this.failedCount = dash?.failedCount || 0;
    this.totalCount = this.sentCount +
      this.deliveredCount +
      this.readCount +
      this.waitingCount +
      this.sendingCount +
      this.errorCount +
      this.failedCount;
    this.triggeredMessagesCount = this.sentCount + this.deliveredCount + this.readCount + this.errorCount + this.failedCount;
    this.progress = +((this.triggeredMessagesCount / this.totalCount) * 100)?.toFixed(2) || 0;
  }

}
