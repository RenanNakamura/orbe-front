import {Component, OnInit} from '@angular/core';
import {fadeInUp400ms} from '@vex/animations/fade-in-up.animation';
import {stagger40ms} from '@vex/animations/stagger.animation';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions} from '@angular/material/form-field';
import {UntypedFormControl} from '@angular/forms';
import {TableColumn} from '@vex/interfaces/table-column.interface';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {debounceTime} from 'rxjs/operators';
import {PageEvent} from '@angular/material/paginator';
import {Sort} from '@angular/material/sort';
import {CampaignService} from '../../../service/campaign/campaign.service';
import {Campaign, CampaignParams} from '../../../model/Campaign';
import {InputDialogComponent} from '../../sk/input-dialog/input-dialog.component';
import {QuestionDialogComponent} from '../../sk/question-dialog/question-dialog.component';

@Component({
  selector: 'vex-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
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
export class ListComponent implements OnInit {

  pageSize = 10;
  pageIndex = 0;
  sortBy = 'createdDate,desc';
  pageSizeOptions: number[] = [5, 10, 20, 50];
  length = 0;

  searchCtrl = new UntypedFormControl();

  columns: TableColumn<Campaign>[] = [
    {label: 'createdDate', property: 'createdDate', type: 'date', visible: true, cssClasses: ["w-64"]},
    {label: 'name', property: 'name', type: 'text', visible: true, cssClasses: ['font-medium']},
    {label: 'status', property: 'status', type: 'enum', visible: true},
    {label: 'actions', property: 'actions', type: 'button', visible: true}
  ];

  dataSource = new MatTableDataSource<Campaign>();

  constructor(private _service: CampaignService,
              private _router: Router,
              private _dialog: MatDialog,
              private _translate: TranslateService) {
  }

  ngOnInit(): void {
    this.load(this.getDefaultParams());

    this.searchCtrl.valueChanges
      .pipe(debounceTime(600))
      .subscribe(() => this.load(this.getDefaultParams()));
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  onCreate() {
    this._router.navigate(['campaign/form']);
  }

  onRename(row: Campaign) {
    const inputDialogConfig = {
      header: 'rename',
      inputLabel: 'name',
      value: row.name,
      required: true,
      messageRequired: 'name.required'
    };

    this._dialog.open(InputDialogComponent, {width: '400px', data: inputDialogConfig})
      .afterClosed()
      .subscribe(async (rename) => {
        if (rename) {
          await this._service.rename(row.id, rename);
          this.load(this.getDefaultParams());
        }
      });
  }

  onVisualize(row: Campaign) {
    this._router.navigate([`campaign/view/${row.id}`]);
  }

  async onDelete(row: Campaign) {
    const msg = await this._translate.get('campaign.delete').toPromise();
    const questionConfig = {
      description: `${msg}${row.name}`
    };

    this._dialog.open(QuestionDialogComponent, {width: '400px', data: questionConfig})
      .afterClosed()
      .subscribe(async (result) => {
        if (result) {
          await this._service.delete(row.id);
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

  private load(params: CampaignParams) {
    this._service.list(params)
      .subscribe(data => {
        this.dataSource.data = data.content;
        this.length = data.totalElements;
      });
  }

  private getDefaultParams(): CampaignParams {
    return {
      size: this.pageSize,
      page: this.pageIndex,
      sort: this.sortBy || 'createdDate,desc',
      search: this.searchCtrl.value || ''
    };
  }

}
