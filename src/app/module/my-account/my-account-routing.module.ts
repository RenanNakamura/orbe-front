import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FormComponent} from './form/form.component';

const routes: Routes = [
    {
        path: '',
        component: FormComponent,
        data: {
            toolbarShadowEnabled: true,
            containerEnabled: true
        },
        children: [
            {
                path: '',
                loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MyAccountRoutingModule {
}
