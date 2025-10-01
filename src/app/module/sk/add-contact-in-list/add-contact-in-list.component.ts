import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';
import {TableColumn} from '@vex/interfaces/table-column.interface';
import {Contact} from '../../../model/Contact';
import {MatTableDataSource} from '@angular/material/table';
import icSearch from '@iconify/icons-ic/twotone-search';
import {fadeInUp400ms} from '@vex/animations/fade-in-up.animation';
import {stagger40ms} from '@vex/animations/stagger.animation';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions} from '@angular/material/form-field';
import {MatDialog} from '@angular/material/dialog';
import {SelectContactListComponent} from '../select-contact-list/select-contact-list.component';
import {debounceTime} from 'rxjs/operators';
import icPlaylistAddCheck from '@iconify/icons-ic/playlist-add-check';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {PhoneUtil} from '../../../util/phone.util';

@Component({
    selector: 'add-contact-in-list',
    templateUrl: './add-contact-in-list.component.html',
    styleUrls: ['./add-contact-in-list.component.scss'],
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
export class AddContactInListComponent implements OnInit {

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    @Input()
    dataSource = new MatTableDataSource<Contact>();

    icPlaylistAddCheck = icPlaylistAddCheck;
    icSearch = icSearch;
    pageSize = 10;
    pageSizeOptions: number[] = [5, 10, 20, 50];
    searchCtrl = new UntypedFormControl();
    columns: TableColumn<Contact>[] = [
        {label: 'name', property: 'name', type: 'text', visible: true, cssClasses: ['font-medium']},
        {label: 'email', property: 'email', type: 'text', visible: true},
        {label: 'number', property: 'number', type: 'phone', visible: true},
    ];

    constructor(private _dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.searchCtrl.valueChanges
            .pipe(debounceTime(600))
            .subscribe((value) => this.filter(value));
    }

    get visibleColumns() {
        return this.columns.filter(column => column.visible).map(column => column.property);
    }

    trackByProperty<T>(index: number, column: TableColumn<T>) {
        return column.property;
    }

    onAdd() {
        this._dialog.open(SelectContactListComponent, {width: '1000px', data: this.dataSource.data, disableClose: true})
            .afterClosed()
            .subscribe((contacts) => this.add(contacts));
    }

    onGetMask(row: Contact) {
        return PhoneUtil.getPhoneMask(row.ddi);
    }

    private add(contacts: Contact[]) {
        this.dataSource.data = contacts;
    }

    private filter(value: string) {
        this.dataSource.filter = value;
    }

}
