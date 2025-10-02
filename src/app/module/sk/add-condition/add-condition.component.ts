import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {TagService} from '../../../service/tag/tag.service';

export enum Field {
  TAG = 'TAG'
}

export enum Type {
  EQUAL = 'EQUAL',
  NOT_EQUAL = 'NOT_EQUAL'
}


@Component({
  selector: 'vex-question-dialog',
  templateUrl: './add-condition.component.html',
  styleUrls: ['./add-condition.component.scss']
})
export class AddConditionComponent implements OnInit {

  fields = Field;
  types = Type;
  values;

  form: UntypedFormGroup;

  constructor(private _dialogRef: MatDialogRef<AddConditionComponent>,
              private _fb: UntypedFormBuilder,
              private _tagService: TagService,
              private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      field: ['', Validators.required],
      type: ['', Validators.required],
      value: ['', Validators.required],
    });

    this.form
      .get('field')
      .valueChanges
      .subscribe(field => {
        this._tagService.list(null)
          .subscribe(groups => {
            this.values = groups
              .content
              .map(group => {
                return {
                  id: group.id,
                  description: group.description
                };
              });
          });
      });
  }

  onGetFieldI18n(field: Field): string {
    return this.translate.instant(`contact-filter.field-${field.toLowerCase()}`);
  }

  onGetTypeI18n(type: Type): string {
    return this.translate.instant(`contact-filter.type-${type.toLowerCase()}`);
  }

  onSubmit() {
    if (this.form.valid) {
      this._dialogRef.close(this.form.value);
    }
  }
}
