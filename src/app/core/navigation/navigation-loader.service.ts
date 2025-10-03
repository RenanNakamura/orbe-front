import { Injectable } from '@angular/core';
import { NavigationItem } from './navigation-item.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { PlanEnum, Role } from '../../model/User';

@Injectable({
  providedIn: 'root'
})
export class NavigationLoaderService {
  private readonly _items: BehaviorSubject<NavigationItem[]> =
    new BehaviorSubject<NavigationItem[]>([]);

  get items$(): Observable<NavigationItem[]> {
    return this._items.asObservable();
  }

  constructor() {
    this.loadNavigation();
  }

  loadNavigation(): void {
    this._items.next([
      {
        type: 'subheading',
        label: 'dashboard.name',
        children: [
          {
            type: 'link',
            label: 'analytics',
            route: 'analytics',
            icon: 'mat:insights',
            roles: [Role.ADMIN, Role.USER]
          }
        ]
      },
      {
        type: 'subheading',
        label: 'records',
        children: [
          {
            type: 'link',
            label: 'users',
            route: 'user',
            icon: 'mat:person',
            roles: [Role.ADMIN]
          },
          {
            type: 'link',
            label: 'channels',
            route: 'channel',
            icon: 'mat:devices',
            roles: [Role.ADMIN, Role.USER],
            plans: [PlanEnum.BASIC, PlanEnum.PRO]
          },
          {
            type: 'link',
            label: 'contacts',
            route: 'contact',
            icon: 'mat:contacts',
            roles: [Role.ADMIN, Role.USER],
            plans: [PlanEnum.BASIC, PlanEnum.PRO]
          },
          {
            type: 'link',
            label: 'tags',
            route: 'tag',
            icon: 'mat:label',
            roles: [Role.ADMIN, Role.USER],
            plans: [PlanEnum.BASIC, PlanEnum.PRO]
          },
          {
            type: 'link',
            label: 'templates',
            route: 'template',
            icon: 'mat:message',
            roles: [Role.ADMIN, Role.USER],
            plans: [PlanEnum.BASIC, PlanEnum.PRO]
          }
        ]
      },
      {
        type: 'subheading',
        label: 'services',
        children: [
          // {
          //     type: 'link',
          //     label: 'calendars',
          //     route: 'calendar',
          //     icon: icCalendar,
          //     roles: [Role.ADMIN, Role.USER],
          // },
          {
            type: 'link',
            label: 'campaigns',
            route: 'campaign',
            icon: 'mat:local_fire_department',
            roles: [Role.ADMIN, Role.USER],
            plans: [PlanEnum.BASIC, PlanEnum.PRO]
          },
          {
            type: 'link',
            label: 'flows',
            route: 'flow',
            icon: 'mat:account_tree',
            roles: [Role.ADMIN, Role.USER],
            plans: [PlanEnum.BASIC, PlanEnum.PRO]
          }
        ]
      }
    ]);
  }
}
