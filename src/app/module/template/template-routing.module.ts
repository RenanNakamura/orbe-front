import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListComponent} from './list/list.component';
import {FormComponent} from './form/form.component';
import {GetByIdTemplateResolver} from './resolver/get-by-id-template.resolver';
import { ListChannelResolver } from './resolver/list-channel-resolver.service';

const routes: Routes = [
    {
        path: '',
        component: ListComponent,
    },
    {
        path: 'form',
        component: FormComponent,
        resolve: {
            channels: ListChannelResolver
        }
    },
    {
        path: 'form/:id',
        component: FormComponent,
        resolve: {
            data: GetByIdTemplateResolver,
            channels: ListChannelResolver
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TemplateRoutingModule {
}
