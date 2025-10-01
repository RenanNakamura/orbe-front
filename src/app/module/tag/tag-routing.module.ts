import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListComponent} from './list/list.component';
import {FormComponent} from './form/form.component';
import {GetByIdTagResolver} from './resolver/get-by-id-tag.resolver';

const routes: Routes = [
    {
        path: '',
        component: ListComponent,
    },
    {
        path: 'form',
        component: FormComponent,
    },
    {
        path: 'form/:id',
        component: FormComponent,
        resolve: {
            data: GetByIdTagResolver
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TagRoutingModule {
}
