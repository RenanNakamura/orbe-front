import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { MatTableDataSource } from '@angular/material/table';
import { Contact } from '../../../model/Contact';
import { debounceTime } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldDefaultOptions
} from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { PhoneUtil } from '../../../util/phone.util';
import { UserService } from '../../../service/user/user.service';
import { Status, User, UserParams } from '../../../model/User';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'vex-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  animations: [fadeInUp400ms, stagger40ms],
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

  columns: TableColumn<Contact>[] = [
    {
      label: 'name',
      property: 'name',
      type: 'text',
      visible: true,
      cssClasses: ['font-medium']
    },
    { label: 'email', property: 'email', type: 'text', visible: true },
    { label: 'number', property: 'number', type: 'phone', visible: true },
    { label: 'status', property: 'status', type: 'enum', visible: true },
    { label: 'actions', property: 'actions', type: 'button', visible: true }
  ];

  dataSource = new MatTableDataSource<Contact>();

  constructor(
    private _service: UserService,
    private _dialog: MatDialog,
    private _translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.load(this.getDefaultParams());

    this.searchCtrl.valueChanges
      .pipe(debounceTime(600))
      .subscribe(() => this.load(this.getDefaultParams()));
  }

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  onCreate() {
    this._dialog
      .open(DialogComponent, { width: '600px' })
      .afterClosed()
      .subscribe(() => this.load(this.getDefaultParams()));
  }

  onUpdate(row) {
    this._dialog
      .open(DialogComponent, { width: '600px', data: row })
      .afterClosed()
      .subscribe(() => this.load(this.getDefaultParams()));
  }

  async onActivate(row: User) {
    await this._service.activate(row.id);
    this.load(this.getDefaultParams());
  }

  async onInactivate(row) {
    await this._service.inactivate(row.id);
    this.load(this.getDefaultParams());
  }

  onPage(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;

    this.load(this.getDefaultParams());
  }

  onSortBy(event: Sort) {
    this.sortBy =
      event.active && event.direction && event.active !== 'actions'
        ? Object.values(event).join(',')
        : '';
    const params = this.getDefaultParams();
    this.load(params);
  }

  onGetMask(row: Contact) {
    return PhoneUtil.getPhoneMask(row.ddi);
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  isActive(row: User) {
    return row.status === Status.ACTIVE;
  }

  isInactive(row: User) {
    return row.status === Status.INACTIVE;
  }

  private load(params: UserParams) {
    this._service.list(params).subscribe((data) => {
      this.dataSource.data = data.content;
      this.length = data.totalElements;
    });
  }

  private getDefaultParams(): UserParams {
    return {
      size: this.pageSize,
      page: this.pageIndex,
      sort: this.sortBy || 'createdDate,desc',
      search: this.searchCtrl.value || ''
    };
  }
}
