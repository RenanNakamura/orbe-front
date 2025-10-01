import {Component, OnInit} from '@angular/core';
import {fadeInUp400ms} from '../../../../@vex/animations/fade-in-up.animation';
import {stagger40ms} from '../../../../@vex/animations/stagger.animation';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions} from '@angular/material/form-field';
import {UntypedFormControl} from '@angular/forms';
import {TableColumn} from '../../../../@vex/interfaces/table-column.interface';
import {MatTableDataSource} from '@angular/material/table';
import {TranslateService} from '@ngx-translate/core';
import {debounceTime} from 'rxjs/operators';
import {PageEvent} from '@angular/material/paginator';
import {Sort} from '@angular/material/sort';
import icAdd from '@iconify/icons-ic/twotone-add';
import icSync from '@iconify/icons-ic/sync';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icSearch from '@iconify/icons-ic/twotone-search';
import icTemplate from '@iconify/icons-ic/message';
import {Status, Template, TemplateParams} from '../../../model/Template';
import {TemplateService} from '../../../service/template/template.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {QuestionDialogComponent} from '../../sk/question-dialog/question-dialog.component';
import {AlertService} from '../../../service/sk/alert.service';
import languages from '../../../../assets/json/language.json';
import {LanguageUtil} from '../../../util/language.util';

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

    icSearch = icSearch;
    icSync = icSync;
    icAdd = icAdd;
    icMoreHoriz = icMoreHoriz;
    icEdit = icEdit;
    icDelete = icDelete;
    icTemplate = icTemplate;
    pageSize = 10;
    pageIndex = 0;
    sortBy = 'createdDate,desc';
    pageSizeOptions: number[] = [5, 10, 20, 50];
    length = 0;

    searchCtrl = new UntypedFormControl();

    columns: TableColumn<Template>[] = [
        {label: 'channel.title', property: 'channel', type: 'text', visible: true, cssClasses: ['font-medium']},
        {label: 'name', property: 'name', type: 'text', visible: true, cssClasses: ['font-medium']},
        {label: 'category', property: 'category', type: 'enum', visible: true},
        {label: 'language', property: 'language', type: 'enum', visible: true},
        {label: 'status', property: 'status', type: 'enum', visible: true},
        {label: 'actions', property: 'actions', type: 'button', visible: true}
    ];

    dataSource = new MatTableDataSource<Template>();
    languagesOptions: { language: string; code: string }[] = languages;

    constructor(private _service: TemplateService,
                private _router: Router,
                private _dialog: MatDialog,
                private _translate: TranslateService,
                private _activatedRoute: ActivatedRoute,
                private _alert: AlertService) {
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
        this._router.navigate(['template/form']);
    }

    onSync() {
        this._service.sync()
            .subscribe(async result => {
                const message = await this._translate.instant(`template.request-sync`);
                await this._alert.success(message);
            });
    }

    onUpdate(row) {
        this._router.navigate([`template/form/${row.id}`]);
    }

    async onDelete(row) {
        const msg = await this._translate.get('template.delete').toPromise();
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

    onCanUpdate(row: Template) {
        return row.status === Status.APPROVED || row.status === Status.REJECTED || row.status === Status.PAUSED;
    }

    trackByProperty<T>(index: number, column: TableColumn<T>) {
        return column.property;
    }

    private load(params: TemplateParams) {
        this._service.list(params)
            .subscribe(data => {
                this.dataSource.data = data.content.map(template => ({
                    ...template,
                    language: LanguageUtil.getLanguageName(template.language)
                }));
                this.length = data.totalElements;
            });
    }

    private getDefaultParams(): TemplateParams {
        return {
            size: this.pageSize,
            page: this.pageIndex,
            sort: this.sortBy || 'createdDate,desc',
            search: this.searchCtrl.value || ''
        };
    }

}
