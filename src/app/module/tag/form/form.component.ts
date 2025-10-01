import {Component, OnInit} from '@angular/core';
import {fadeInUp400ms} from '@vex/animations/fade-in-up.animation';
import {stagger40ms} from '@vex/animations/stagger.animation';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions} from '@angular/material/form-field';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {Contact} from '../../../model/Contact';
import {TagService} from '../../../service/tag/tag.service';
import {ActivatedRoute, Router} from '@angular/router';
import icTag from '@iconify/icons-ic/label';

@Component({
    selector: 'vex-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
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
export class FormComponent implements OnInit {

    icTag = icTag;

    form: UntypedFormGroup;
    dsContacts = new MatTableDataSource<Contact>();

    constructor(private _fb: UntypedFormBuilder,
                private _service: TagService,
                private _router: Router,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.activatedRoute
            .data
            .subscribe(param => this.initForm(param?.['data']));
    }

    private initForm(group) {
        if (group?.contacts) {
            this.dsContacts.data = group?.contacts;
        }

        this.form = this._fb.group({
            id: [group?.id] || '',
            description: [group?.description || '', Validators.required],
            contacts: [this.dsContacts.data]
        });
    }

    async onSubmit() {
        if (this.form.valid) {
            const group = {
                id: this.form.get('id').value,
                description: this.form.get('description').value,
                contacts: this.mapContactsToOnlyIds()
            };

            !this.form.get('id').value
                ? await this._service.create(group)
                : await this._service.update(group);

            this._router.navigate(['tag']);
        }
    }

    onCancel() {
        this._router.navigate(['tag']);
    }

    private mapContactsToOnlyIds(): string [] {
        const contacts: Contact[] = this.dsContacts.data;
        return contacts.map(c => c.id);
    }

}
