import {Component, OnInit} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';
import {TableColumn} from '@vex/interfaces/table-column.interface';
import {MatTableDataSource} from '@angular/material/table';
import {debounceTime} from 'rxjs/operators';
import {PageEvent} from '@angular/material/paginator';
import {Sort} from '@angular/material/sort';
import {TranslateService} from '@ngx-translate/core';
import {fadeInUp400ms} from '@vex/animations/fade-in-up.animation';
import {stagger40ms} from '@vex/animations/stagger.animation';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions} from '@angular/material/form-field';
import {MatDialog} from '@angular/material/dialog';
import {Flow, FlowExecution, FlowExecutionStatus, FlowParams} from '../../../model/flow/Flow';
import {ActivatedRoute, Router} from '@angular/router';
import {FlowExecutionService} from '../../../service/flow/flow-execution.service';
import {PhoneUtil} from '../../../util/phone.util';
import {HistoryDialogComponent} from '../history-dialog/history-dialog.component';
import {AlertService} from '../../../service/sk/alert.service';

@Component({
  selector: 'vex-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
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
export class HistoryListComponent implements OnInit {

  pageSize = 10;
  pageIndex = 0;
  sortBy = 'createdDate,desc';
  pageSizeOptions: number[] = [5, 10, 20, 50];
  length = 0;
  flow: Flow;

  searchCtrl = new UntypedFormControl();

  columns: TableColumn<FlowExecution>[] = [
    {label: 'createdDate', property: 'createdDate', type: 'date', visible: true, cssClasses: ["w-64"]},
    {label: 'number', property: 'phone', type: 'text', visible: true, cssClasses: ['font-medium']},
    {label: 'phoneNumberId', property: 'phoneNumberId', type: 'text', visible: true},
    {label: 'status', property: 'status', type: 'enum', visible: true},
    {label: 'actions', property: 'actions', type: 'button', visible: true}
  ];

  dataSource = new MatTableDataSource<FlowExecution>();

  constructor(private _service: FlowExecutionService,
              private _router: Router,
              private _dialog: MatDialog,
              private _translate: TranslateService,
              private _alert: AlertService,
              private _activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this._activatedRoute
      .data
      .subscribe(param => {
        this.flow = param?.['data'];
        this.load(this.getDefaultParams());
      });

    this.searchCtrl.valueChanges
      .pipe(debounceTime(600))
      .subscribe(() => this.load(this.getDefaultParams()));
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  isNotExecution(row: FlowExecution): boolean {
    return row.status !== FlowExecutionStatus.EXECUTION;
  }

  onView(row: FlowExecution) {
    this._dialog.open(HistoryDialogComponent, {width: '800px', data: row})
      .afterClosed()
      .subscribe();
  }

  onInterrupt(row: FlowExecution) {
    this._service.interrupt(row?.id)
      .subscribe({
        next: () => {
          this._translate.get('flowExecution.interrupt')
            .subscribe(value => this._alert.success(value));
        },
        complete: () => {
          this.load(this.getDefaultParams());
        }
      });
  }

  onPage(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;

    this.load(this.getDefaultParams());
  }

  onSortBy(event: Sort) {
    this.sortBy = event.active && event.direction && event.active !== 'actions' ? Object.values(event).join(',') : '';
    const params = this.getDefaultParams();
    this.load(params);
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  private load(params: FlowParams) {
    this._service.list(params)
      .subscribe(data => {
        this.dataSource.data = data.content
          .map(flowExecution => Object.assign(flowExecution, {phone: PhoneUtil.getPhoneWithMask(flowExecution.phone)}));
        this.length = data.totalElements;
        this.dataSource.data = data.content;
        this.length = data.totalElements;
      });
  }

  private getDefaultParams(): FlowParams {
    return {
      size: this.pageSize,
      page: this.pageIndex,
      sort: this.sortBy || 'createdDate,desc',
      search: this.searchCtrl.value || '',
      flowId: this.flow?.id || ''
    };
  }

}
