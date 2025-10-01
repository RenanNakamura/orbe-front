import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListComponent} from './list/list.component';
import {FormComponent} from './form/form.component';
import {GetByIdChannelResolver} from './resolver/get-by-id-channel.resolver';
import {GetPhoneNumberInfoByIdChannelResolver} from './resolver/get-phone-number-info-by-id-channel.resolver';
import {ConnectWhatsappComponent} from './connect-channel/connect-whatsapp.component';

const routes: Routes = [
    {
        path: '',
        component: ListComponent,
    },
    {
        path: 'form/:id',
        component: FormComponent,
        resolve: {
            channel: GetByIdChannelResolver,
            phoneNumberInfo: GetPhoneNumberInfoByIdChannelResolver
        }
    },
    {
        path: 'connect-whatsapp',
        component: ConnectWhatsappComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChannelRoutingModule {
}
