import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    private _config: MatSnackBarConfig = {
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        duration: 5000,
    };

    constructor(private readonly _snackBar: MatSnackBar,
                private readonly _translate: TranslateService) {
    }

    async success(message: string) {
        const action = await this._translate.get('close').toPromise();
        this._snackBar.open(message, action, { ...this._config, panelClass: ['snackbar-success'] });
    }

    async warning(message: string) {
        const action = await this._translate.get('close').toPromise();
        this._snackBar.open(message, action, { ...this._config, panelClass: ['snackbar-warning'] });
    }

    async error(message: string) {
        const action = await this._translate.get('close').toPromise();
        this._snackBar.open(message, action, { ...this._config, panelClass: ['snackbar-error'] });
    }

}
