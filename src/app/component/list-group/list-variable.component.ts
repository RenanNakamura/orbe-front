import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
    selector: 'list-variable',
    templateUrl: './list-variable.component.html',
    styleUrls: ['./list-variable.component.scss']
})
export class ListVariableComponent implements OnInit {

    @Output() onSelect = new EventEmitter<{ label: string, value: string }>();

    groups: { title: string, items: { label: string, value: string }[] }[] = [];

    ngOnInit(): void {
        setTimeout(() => this.groups.push(this.buildContactFields()), 100);
    }

    onClickVariable(item: { label: string, value: string }) {
        this.onSelect.emit(item);
    }

    private buildContactFields() {
        const items = [
            {
                label: 'firstName',
                value: '{{contact_first_name}}',
            },
            {
                label: 'name',
                value: '{{contact_name}}',
            },
            {
                label: 'email',
                value: '{{contact_email}}',
            },
            {
                label: 'phone',
                value: '{{contact_phone}}',
            }
        ];
        return {items, title: 'variable.contact-fields'};
    }

}
