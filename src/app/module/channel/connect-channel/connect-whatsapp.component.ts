import {Component, OnInit} from '@angular/core';
import {fadeInUp400ms} from '@vex/animations/fade-in-up.animation';
import {fadeInRight400ms} from '@vex/animations/fade-in-right.animation';
import {scaleIn400ms} from '@vex/animations/scale-in.animation';
import {stagger40ms} from '@vex/animations/stagger.animation';
import {Router} from '@angular/router';
import icPhone from '@iconify/icons-mdi/phone';
import icMeta from '@iconify/icons-simple-icons/meta';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {ChannelService} from '../../../service/channel/channel.service';
import icCreditCardOutline from '@iconify/icons-mdi/credit-card-outline';
import icWarning from '@iconify/icons-ic/warning';

@Component({
    selector: 'vex-form',
    templateUrl: './connect-whatsapp.component.html',
    styleUrls: ['./connect-whatsapp.component.scss'],
    animations: [
        fadeInUp400ms,
        fadeInRight400ms,
        scaleIn400ms,
        stagger40ms
    ]
})
export class ConnectWhatsappComponent implements OnInit {

    step = 1;
    finishedFacebookSignup = false;
    selectedOption: string | null = null;
    selectedOptionHowConnect: string | null = null;
    hasBusinessManagerAccess: boolean | null = null;
    twoFactorDisabledBusiness: boolean | null = null;
    twoFactorDisabledProvider: boolean | null = null;
    form: UntypedFormGroup;
    protected readonly icPhone = icPhone;
    protected readonly icMeta = icMeta;
    protected readonly icCreditCardOutline = icCreditCardOutline;
    protected readonly icWarning = icWarning;

    constructor(private _router: Router,
                private _fb: UntypedFormBuilder,
                private _service: ChannelService) { }

    ngOnInit() { }

    onNextStep() {
        if (this.selectedOption) {
            if (this.selectedOption === 'manual') {
                this.initForm();
            }
            this.step = 2; // vai para o próximo "estado" da tela
        }
    }

    onToGoBack() {
        if (this.step === 1) {
            this.onToGoBackChannel();
        }
        this.step = 1; // volta para seleção inicial
    }

    onToGoBackChannel() {
        this._router.navigate([`channel`]);
    }

    async onFacebookSignupCompleted({ wabaId, phoneNumberId, code }: {
        wabaId: string;
        phoneNumberId: string;
        code: string;
    }) {
        try {
            await this._service.createWith({
                wabaId,
                phoneNumberId,
                code
            }).then(r => {
                console.log(r);
            }).catch(err => {
                console.error(err);
            });
        } finally {
            setTimeout(() => this.onToGoBackChannel(), 100);
        }
    }

    disabledFacebookButton() {
        if (this.selectedOptionHowConnect === 'new' && this.hasBusinessManagerAccess === true) {
            return false;
        }

        if (this.selectedOptionHowConnect === 'business' && this.twoFactorDisabledBusiness && this.hasBusinessManagerAccess) {
            return false;
        }

        return !(this.selectedOptionHowConnect === 'provider' && this.twoFactorDisabledProvider && this.hasBusinessManagerAccess);
    }

    async onSubmit() {
        if (this.form.valid) {
            await this._service.create(this.form.value);
            this.onToGoBackChannel();
        }
    }

    private initForm() {
        this.form = this._fb.group({
            id: [''],
            name: ['', Validators.required],
            phoneNumberId: ['', [Validators.required]],
            wabaId: ['', [Validators.required]],
            applicationId: ['', [Validators.required]],
            accessToken: ['', [Validators.required]],
        });
    }

}
