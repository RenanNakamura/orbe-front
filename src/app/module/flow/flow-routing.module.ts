import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListComponent} from './list/list.component';
import {FormComponent} from './form/form.component';
import {GetByIdFlowResolver} from "./resolver/get-by-id-flow.resolver";
import {HistoryListComponent} from "./history-list/history-list.component";

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
            data: GetByIdFlowResolver
        }
    },
    {
        path: ':id/history',
        component: HistoryListComponent,
        resolve: {
            data: GetByIdFlowResolver
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FlowRoutingModule {
}
