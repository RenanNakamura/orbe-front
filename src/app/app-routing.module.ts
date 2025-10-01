import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layouts/layout/layout.component';
import { AuthGuardService } from './service/guard/auth-guard.service';
// import {AuthGuardService} from './service/guard/auth-guard.service';
// import {HomeComponent} from './module/home/home.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: LayoutComponent
  // },
  {
    path: 'login',
    loadChildren: () =>
      import('./module/login/login.module').then((m) => m.LoginModule),
    title: 'login.title'
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'analytics',
        loadChildren: () =>
          import('./module/analytics/analytics.module').then(
            (m) => m.AnalyticsModule
          ),
        title: 'analytics'
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./module/user/user.module').then((m) => m.UserModule),
        title: 'users'
      },
      {
        path: 'tag',
        loadChildren: () =>
          import('./module/tag/tag.module').then((m) => m.TagModule),
        title: 'tags'
      },
      {
        path: 'contact',
        loadChildren: () =>
          import('./module/contact/contact.module').then(
            (m) => m.ContactModule
          ),
        title: 'contacts'
      },
      {
        path: 'my-account',
        loadChildren: () =>
          import('./module/my-account/my-account.module').then(
            (m) => m.MyAccountModule
          ),
        title: 'my-account'
      },
      {
        path: 'template',
        loadChildren: () =>
          import('./module/template/template.module').then(
            (m) => m.TemplateModule
          ),
        title: 'templates'
      },
      // {
      //     path: 'campaign',
      //     loadChildren: () => import('./module/campaign/campaign.module').then((m) => m.CampaignModule),
      //     data: {title: 'campaigns'}
      // },
      {
        path: 'channel',
        loadChildren: () =>
          import('./module/channel/channel.module').then(
            (m) => m.ChannelModule
          ),
        title: 'channels'
      }
      // {
      //     path: 'flow',
      //     loadChildren: () => import('./module/flow/flow.module').then((m) => m.FlowModule),
      //     data: {title: 'flows'}
      // },
      // {
      //     path: 'calendar',
      //     loadChildren: () => import('./module/calendar/calendar.module').then((m) => m.CalendarModule),
      // },
      // {
      //     path: '',
      //     redirectTo: '/analytics',
      //     pathMatch: 'full'
      // }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
