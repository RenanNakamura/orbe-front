import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';
import {TableColumn} from '@vex/interfaces/table-column.interface';
import {Contact, ContactParams} from '../../../model/Contact';
import {MatTableDataSource} from '@angular/material/table';
import {debounceTime} from 'rxjs/operators';
import {PageEvent} from '@angular/material/paginator';
import {Sort} from '@angular/material/sort';
import {ContactService} from '../../../service/contact/contact.service';
import icSearch from '@iconify/icons-ic/twotone-search';
import {fadeInUp400ms} from '@vex/animations/fade-in-up.animation';
import {stagger40ms} from '@vex/animations/stagger.animation';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions} from '@angular/material/form-field';
import icClose from '@iconify/icons-ic/twotone-close';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {PhoneUtil} from '../../../util/phone.util';

@Component({
    selector: 'select-contact-list',
    templateUrl: './select-contact-list.component.html',
    styleUrls: ['./select-contact-list.component.scss'],
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
export class SelectContactListComponent implements OnInit {

    icSearch = icSearch;
    icClose = icClose;
    pageSize = 10;
    pageIndex = 0;
    sortBy = 'createdDate,asc';
    pageSizeOptions: number[] = [5, 10, 20, 50];
    length = 0;
    searchCtrl = new UntypedFormControl();
    columns: TableColumn<Contact>[] = [
        {label: 'checkbox', property: 'checkbox', type: 'checkbox', visible: true},
        {label: 'name', property: 'name', type: 'text', visible: true, cssClasses: ['font-medium']},
        {label: 'email', property: 'email', type: 'text', visible: true},
        {label: 'number', property: 'number', type: 'phone', visible: true},
    ];
    dataSource = new MatTableDataSource<Contact>();
    selected: Contact[] = new Array<Contact>();
    snapshot: Contact[] = new Array<Contact>();

    constructor(@Inject(MAT_DIALOG_DATA) private _data: Contact[],
                private _service: ContactService,
                private _dialogRef: MatDialogRef<SelectContactListComponent>) {
    }

    ngOnInit(): void {
        this.load(this.getDefaultParams());
        this.selected = this._data || [];
        this.snapshot = Object.assign([], this._data) || [];

        this.searchCtrl.valueChanges
            .pipe(debounceTime(600))
            .subscribe(() => this.load(this.getDefaultParams()));
    }

    get visibleColumns() {
        return this.columns.filter(column => column.visible).map(column => column.property);
    }

    onPage(event: PageEvent) {
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;

        this.load(this.getDefaultParams());
    }

    onSortBy(event: Sort) {
        this.sortBy = event.active && event.direction ? Object.values(event).join(',') : '';
        const params = this.getDefaultParams();
        this.load(params);
    }

    onMasterToggle() {
        this.isAllSelected() ? this.selected = [] : this.dataSource.data.forEach(row => this.select(row));
    }

    onToggle(row: Contact) {
        !this.isSelected(row) ? this.select(row) : this.deselect(row);
    }

    onAdd() {
        this._dialogRef.close(this.selected);
    }

    onClose() {
        this._dialogRef.close(this.snapshot);
    }

    onGetMask(row: Contact) {
        return PhoneUtil.getPhoneMask(row.ddi);
    }

    isAllSelected() {
        return this.selected.length === this.length;
    }

    isSelected(row: Contact): boolean {
        return this.selected.some(contact => contact.id === row.id);
    }

    trackByProperty<T>(index: number, column: TableColumn<T>) {
        return column.property;
    }

    private load(params: ContactParams) {
        this._service.list(params)
            .subscribe(data => {
                this.dataSource.data = data.content;
                this.length = data.totalElements;
            });
    }

    private getDefaultParams(): ContactParams {
        return {
            size: this.pageSize,
            page: this.pageIndex,
            sort: this.sortBy || 'createdDate,asc',
            search: this.searchCtrl.value || ''
        };
    }

    private deselect(row: Contact) {
        const index = this.selected.findIndex(contact => contact.id === row.id);
        if (index > -1) {
            this.selected.splice(index, 1);
        }
    }

    private select(row: Contact) {
        if (!this.isSelected(row)) {
            this.selected.push(row);
        }
    }

}
