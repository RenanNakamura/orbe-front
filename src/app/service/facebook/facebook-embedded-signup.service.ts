import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';

declare var FB: any;

@Injectable({ providedIn: 'root' })
export class FacebookEmbeddedSignupService {

    wabaIdRecovered: string | null = null;
    phoneNumberIdRecovered: string | null = null;

    private boundMessageHandler = this.handleFacebookMessage.bind(this);

    constructor() {
        this.loadFacebookSDK();
        window.addEventListener('message', this.boundMessageHandler);
    }

    private loadFacebookSDK(): void {
        (window as any).fbAsyncInit = () => {
            FB.init({
                appId: environment.facebookApp.appId,
                autoLogAppEvents: true,
                xfbml: true,
                version: environment.facebookApp.version
            });
        };

        const script = document.createElement('script');
        script.async = true;
        script.defer = true;
        script.crossOrigin = 'anonymous';
        script.src = 'https://connect.facebook.net/en_US/sdk.js';
        document.body.appendChild(script);
    }

    private handleFacebookMessage(event: MessageEvent): void {
        if (
            event.origin !== 'https://www.facebook.com' &&
            event.origin !== 'https://web.facebook.com'
        ) {
            return;
        }

        try {
            const data = JSON.parse(event.data);
            if (data.type === 'WA_EMBEDDED_SIGNUP' && data.event === 'FINISH') {
                const { phone_number_id, waba_id } = data.data;
                this.phoneNumberIdRecovered = phone_number_id;
                this.wabaIdRecovered = waba_id;
            }
        } catch (e) {
            console.error('Non JSON Responses', event.data);
        }
    }

    public launchSignup(callback: (params: { wabaId: string; phoneNumberId: string; code: string }) => void): void {
        if (!(window as any).FB) {
            console.error('Facebook SDK not loaded');
            return;
        }

        FB.login(
            (response: any) => {
                if (response.authResponse) {
                    if (this.wabaIdRecovered && this.phoneNumberIdRecovered) {
                        callback({
                            wabaId: this.wabaIdRecovered,
                            phoneNumberId: this.phoneNumberIdRecovered,
                            code: response.authResponse.code
                        });
                    } else {
                        console.warn('wabaIdRecovered or phoneNumberIdRecovered not populated');
                    }
                } else {
                    console.warn('Facebook login canceled');
                }
            },
            {
                config_id: environment.facebookApp.configId,
                response_type: 'code',
                override_default_response_type: true,
                extras: {
                    setup: {},
                    featureType: '',
                    sessionInfoVersion: '2',
                }
            }
        );
    }
}
