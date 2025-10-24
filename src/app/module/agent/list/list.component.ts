import {Component, OnInit, ViewChild} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';
import {TableColumn} from '@vex/interfaces/table-column.interface';
import {MatTableDataSource} from '@angular/material/table';
import {Contact} from '../../../model/Contact';
import {MatPaginator} from '@angular/material/paginator';
import {fadeInUp400ms} from '@vex/animations/fade-in-up.animation';
import {stagger40ms} from '@vex/animations/stagger.animation';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions} from '@angular/material/form-field';
import {MatDialog} from '@angular/material/dialog';
import {User} from '../../../model/User';
import {DialogComponent} from '../dialog/dialog.component';
import {AgentService} from "../../../service/agent/agent.service";
import {AgentStatus, ListAgentResponse} from "../../../model/chat/agent";
import {QuestionDialogComponent} from "../../sk/question-dialog/question-dialog.component";
import {TranslateService} from "@ngx-translate/core";
import {MatSort} from "@angular/material/sort";

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

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  pageSize = 10;
  pageIndex = 0;
  sortBy = 'createdDate,desc';
  pageSizeOptions: number[] = [5, 10, 20, 50];
  length = 0;

  searchCtrl = new UntypedFormControl();

  columns: TableColumn<Contact>[] = [
    {
      label: 'createdDate',
      property: 'createdAt',
      type: 'date',
      visible: true,
      cssClasses: ['font-medium']
    },
    {label: 'name', property: 'name', type: 'text', visible: true},
    {label: 'email', property: 'email', type: 'text', visible: true},
    {label: 'status', property: 'status', type: 'enum', visible: true},
    {label: 'actions', property: 'actions', type: 'button', visible: true}
  ];

  dataSource = new MatTableDataSource<ListAgentResponse>();

  constructor(
    private _service: AgentService,
    private _dialog: MatDialog,
    private _translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.load();

    this.searchCtrl
      .valueChanges
      .subscribe((value) => {
        this.dataSource.filter = value?.trim().toLowerCase() || '';
      });
  }

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  onCreate() {
    this._dialog
      .open(DialogComponent, {width: '600px'})
      .afterClosed()
      .subscribe(() => this.load());
  }

  onUpdate(row) {
    this._dialog
      .open(DialogComponent, {width: '600px', data: row})
      .afterClosed()
      .subscribe(() => this.load());
  }

  async onActivate(row: User) {
    this._service
      .activate(row.id)
      .subscribe(() => this.load());
  }

  async onInactivate(row) {
    this._service
      .deactivate(row.id)
      .subscribe(() => this.load());
  }

  async onDelete(row) {
    const msg = this._translate.instant('agent.delete');
    const questionConfig = {
      description: `${msg}${row.name}`
    };

    this._dialog.open(QuestionDialogComponent, {width: '400px', data: questionConfig})
      .afterClosed()
      .subscribe(async (result) => {
        if (result) {
          this._service
            .delete(row.id)
            .subscribe(() => this.load());
        }
      });
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  isActive(row: ListAgentResponse) {
    return row.status === AgentStatus.ACTIVE;
  }

  isInactive(row: ListAgentResponse) {
    return row.status === AgentStatus.INACTIVE;
  }

  isPendingInvite(row: ListAgentResponse) {
    return row.status === AgentStatus.PENDING_INVITE;
  }

  private load() {
    this._service.list()
      .subscribe((data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.length = data?.length ?? 0;

        this.dataSource.filterPredicate = (data: ListAgentResponse, filter: string) => {
          const lowerFilter = filter.trim().toLowerCase();
          return (
            data.name?.toLowerCase().includes(lowerFilter) ||
            data.email?.toLowerCase().includes(lowerFilter)
          );
        };
      });
  }

}
