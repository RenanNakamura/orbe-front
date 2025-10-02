import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListComponent} from './list/list.component';
import {FormComponent} from './form/form.component';
import {ViewComponent} from './view/view.component';
import {GetByIdCampaignResolver} from './resolver/get-by-id-campaign.resolver';
import {ListChannelsResolver} from './resolver/list-channels-resolver.service';

const routes: Routes = [
    {
        path: '',
        component: ListComponent,
    },
    {
        path: 'form',
        component: FormComponent,
        resolve: {
            channels: ListChannelsResolver
        }
    },
    {
        path: 'view/:id',
        component: ViewComponent,
        resolve: {
            data: GetByIdCampaignResolver
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CampaignRoutingModule {
}
