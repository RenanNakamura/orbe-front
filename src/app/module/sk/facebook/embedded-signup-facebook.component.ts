import {Component, EventEmitter, Input, Output} from '@angular/core';
import iconFacebook from '@iconify/icons-mdi/facebook';
import {FacebookEmbeddedSignupService} from '../../../service/facebook/facebook-embedded-signup.service';

@Component({
    selector: 'app-facebook-embedded-signup',
    templateUrl: './embedded-signup-facebook.component.html',
    styleUrls: ['./embedded-signup-facebook.component.scss']
})
export class EmbeddedSignupFacebookComponent {

    @Output() completed = new EventEmitter<{
        wabaId: string;
        phoneNumberId: string;
        code: string;
    }>();

    icFacebook = iconFacebook;
    @Input() disabled: boolean;

    constructor(
        private facebookEmbeddedSignupService: FacebookEmbeddedSignupService
    ) { }

    signup(): void {
        this.facebookEmbeddedSignupService.launchSignup(({wabaId, phoneNumberId, code}) => {
            this.completed.emit({ wabaId, phoneNumberId, code });
        });
    }
}
