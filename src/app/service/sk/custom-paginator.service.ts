import {Injectable} from '@angular/core';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class CustomPaginatorService extends MatPaginatorIntl {

    constructor(private _translate: TranslateService) {
        super();
        this.init();
    }

    init() {
        this._translate.get('itemsPerPageLabel').subscribe(value => this.itemsPerPageLabel = value);
        this.changes.next();
    }

    getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
            return `0 / ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} / ${length}`;
    }

}
