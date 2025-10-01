import { Component, OnInit } from '@angular/core';
import { fadeInUp400ms } from '../../../../@vex/animations/fade-in-up.animation';
import { fadeInRight400ms } from '../../../../@vex/animations/fade-in-right.animation';
import { scaleIn400ms } from '../../../../@vex/animations/scale-in.animation';
import { stagger40ms } from '../../../../@vex/animations/stagger.animation';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Channel, ChannelCreationType } from '../../../model/Channel';
import { HealthStatus, PhoneNumberInfo } from '../../../model/PhoneNumberInfo';
import {
  getMessagingTierLabelKey,
  getMetaStatusInfo,
  getQualityRatingInfo
} from '../../../util/meta.util';
import { ChannelService } from '../../../service/channel/channel.service';
import { WebhookService } from '../../../service/webhook/webhook.service';
import { environment } from '../../../../environments/environment';
import { PhoneUtil } from '../../../util/phone.util';

@Component({
  selector: 'vex-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  animations: [fadeInUp400ms, fadeInRight400ms, scaleIn400ms, stagger40ms]
})
export class FormComponent implements OnInit {
  protected form: FormGroup;
  protected isCreatedFromFacebook = false;
  protected metaStatusInfo: { labelKey: string; classes: string };
  protected messagingTierInfo: string;
  protected qualityInfo: { label: string; classes: string };
  protected healthStatus: HealthStatus;
  protected isLoading = false;
  protected webhookLink: string;
  protected webhookVerifyToken: string;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _fb: FormBuilder,
    private _service: ChannelService,
    private _webhookService: WebhookService,
    private _router: Router
  ) {}

  ngOnInit() {
    this._activatedRoute.data.subscribe((param) => {
      this.initForm(param?.['channel'], param?.['phoneNumberInfo']);
    });
  }

  onGetMask(phone: string) {
    const ddi = PhoneUtil.extractOnlyCountryCode(phone);
    return PhoneUtil.getPhoneMask(ddi);
  }

  async onSubmit() {
    if (this.form.valid && !this.isLoading) {
      try {
        this.isLoading = true;
        await this._service.update(this.form.value);
        this._router.navigate(['channel']);
      } finally {
        this.isLoading = false;
      }
    }
  }

  async onCopy(text: string) {
    await navigator.clipboard.writeText(text);
  }

  onCancel() {
    this._router.navigate(['channel']);
  }

  private initForm(channel: Channel, phoneNumberInfo: PhoneNumberInfo) {
    this.form = this._fb.group({
      id: [channel.id],
      name: [channel.name || '', Validators.required],
      phoneNumberId: [channel.phoneNumberId || '', Validators.required],
      wabaId: [channel.wabaId || '', Validators.required],
      applicationId: [channel.applicationId || '', Validators.required],
      accessToken: [channel.accessToken || '', Validators.required],
      verifiedName: [phoneNumberInfo?.verified_name || '?'],
      displayPhoneNumber: [phoneNumberInfo?.display_phone_number || '?']
    });

    this.isCreatedFromFacebook =
      channel.creationType === ChannelCreationType.FACEBOOK;
    this.metaStatusInfo = getMetaStatusInfo(phoneNumberInfo?.status);
    this.qualityInfo = getQualityRatingInfo(phoneNumberInfo?.quality_rating);
    this.messagingTierInfo = getMessagingTierLabelKey(
      phoneNumberInfo?.messaging_limit_tier
    );
    this.healthStatus = phoneNumberInfo?.health_status;

    if (!this.isCreatedFromFacebook) {
      this.loadWebhook();
    }
  }

  private loadWebhook() {
    this._webhookService.get().subscribe((response) => {
      this.webhookLink = `${environment.webhook}/api/v1/webhook/${response?.hash}`;
      this.webhookVerifyToken = response?.verifyToken;
    });
  }
}
