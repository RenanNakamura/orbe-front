import {Component, OnInit} from '@angular/core';
import icAdd from '@iconify/icons-ic/twotone-add';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icSearch from '@iconify/icons-ic/twotone-search';
import icDevices from '@iconify/icons-ic/devices';
import icWhatsApp from '@iconify/icons-mdi/whatsapp';
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
import {QuestionDialogComponent} from '../../sk/question-dialog/question-dialog.component';
import {Channel, ChannelParams} from '../../../model/Channel';
import {ChannelService} from '../../../service/channel/channel.service';
import {Router} from '@angular/router';

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

    icAdd = icAdd;
    pageSize = 10;
    pageIndex = 0;
    sortBy = 'createdDate,desc';
    pageSizeOptions: number[] = [5, 10, 20, 50];
    length = 0;

    searchCtrl = new UntypedFormControl();

    columns: TableColumn<Channel>[] = [
        {label: 'name', property: 'name', type: 'text', visible: true, cssClasses: ['font-medium']},
        {label: 'number', property: 'phoneNumber', type: 'text', visible: true, cssClasses: ['font-medium']},
        {label: 'phoneNumberId', property: 'phoneNumberId', type: 'text', visible: true},
        {label: 'wabaId', property: 'wabaId', type: 'text', visible: true},
        {label: 'createdFrom', property: 'creationType', type: 'enum', visible: true},
        {label: 'actions', property: 'actions', type: 'button', visible: true}
    ];

    dataSource = new MatTableDataSource<Channel>();

    constructor(private _service: ChannelService,
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
        this._router.navigate([`channel/connect-whatsapp`]);
    }

    onUpdate(row) {
        this._router.navigate([`channel/form/${row.id}`]);
    }

    async onDelete(row) {
        const msg = await this._translate.get('channel.delete').toPromise();
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

    private load(params: ChannelParams) {
        this._service.list(params)
            .subscribe(data => {
                this.dataSource.data = data.content;
                this.length = data.totalElements;
            });
    }

    private getDefaultParams(): ChannelParams {
        return {
            size: this.pageSize,
            page: this.pageIndex,
            sort: this.sortBy || 'createdDate,desc',
            search: this.searchCtrl.value || ''
        };
    }

}
