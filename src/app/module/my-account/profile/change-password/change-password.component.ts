import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import icClose from '@iconify/icons-ic/twotone-close';
import {MatDialogRef} from '@angular/material/dialog';
import {UserService} from '../../../../service/user/user.service';

@Component({
    selector: 'vex-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

    icClose = icClose;

    form: UntypedFormGroup;

    constructor(private _fb: UntypedFormBuilder,
                private _dialogRef: MatDialogRef<ChangePasswordComponent>,
                private _service: UserService) {
    }

    ngOnInit(): void {
        this.initForm();
    }

    async onSubmit() {
        if (this.form.valid) {
            await this._service.changePassword(this.form.value);
            this._dialogRef.close();
        }
    }

    private initForm() {
        this.form = this._fb.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', [Validators.required]],
            confirmNewPassword: ['', Validators.required],
        }, {
            validator: this.passwordIsMatch
        });
    }

    passwordIsMatch(control: UntypedFormGroup) {
        const password = control.get('newPassword');
        const confirmPassword = control.get('confirmNewPassword');

        if (!confirmPassword?.value) {
            return;
        }

        if (password?.value !== confirmPassword?.value) {
            control.get('confirmNewPassword').setErrors({passwordNotMatch: true});
        }

        if (password?.value === confirmPassword?.value) {
            control.get('confirmNewPassword').setErrors(null);
        }
    }
}
