import { RouterModule, Routes } from '@angular/router';
import { AnalyticsComponent } from './analytics.component';
import { NgModule } from '@angular/core';
import { ListChannelsResolver } from './resolver/list-channels-resolver.service';

const routes: Routes = [
    {
      path: '',
      component: AnalyticsComponent,
      resolve: {
        channels: ListChannelsResolver
      }
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule { }
