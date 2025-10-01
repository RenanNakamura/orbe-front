import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ListTag, TagParams } from '../../../model/Tag';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { UntypedFormControl } from '@angular/forms';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldDefaultOptions
} from '@angular/material/form-field';
import { TagService } from '../../../service/tag/tag.service';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { debounceTime } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { QuestionDialogComponent } from '../../sk/question-dialog/question-dialog.component';
import { Router } from '@angular/router';

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

  columns: TableColumn<ListTag>[] = [
    {
      label: 'description',
      property: 'description',
      type: 'text',
      visible: true,
      cssClasses: ['font-medium']
    },
    { label: 'actions', property: 'actions', type: 'button', visible: true }
  ];

  dataSource = new MatTableDataSource<ListTag>();

  constructor(
    private _service: TagService,
    private _dialog: MatDialog,
    private _translate: TranslateService,
    private _router: Router
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
    this._router.navigate(['tag/form']);
  }

  onUpdate(row: ListTag) {
    this._router.navigate([`tag/form/${row.id}`]);
  }

  async onDelete(row) {
    const msg = await this._translate.get('tag.delete').toPromise();
    const questionConfig = {
      description: `${msg}${row.description}`
    };

    this._dialog
      .open(QuestionDialogComponent, { width: '400px', data: questionConfig })
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
    this.sortBy =
      event.active && event.direction && event.active !== 'actions'
        ? Object.values(event).join(',')
        : '';
    const params = this.getDefaultParams();
    this.load(params);
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  private load(params: TagParams) {
    this._service.list(params).subscribe((data) => {
      this.dataSource.data = data.content;
      this.length = data.totalElements;
    });
  }

  private getDefaultParams(): TagParams {
    return {
      size: this.pageSize,
      page: this.pageIndex,
      sort: this.sortBy || 'createdDate,desc',
      search: this.searchCtrl.value || ''
    };
  }
}
