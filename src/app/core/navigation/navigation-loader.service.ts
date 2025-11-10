import {Injectable} from '@angular/core';
import {NavigationItem} from './navigation-item.interface';
import {BehaviorSubject, Observable} from 'rxjs';
import {PlanEnum, Role} from '../../model/User';
import {TokenStorage} from "../../storage/user/token.storage";

@Injectable({
  providedIn: 'root'
})
export class NavigationLoaderService {
  private readonly _items: BehaviorSubject<NavigationItem[]> =
    new BehaviorSubject<NavigationItem[]>([]);

  get items$(): Observable<NavigationItem[]> {
    return this._items.asObservable();
  }

  constructor(private _tokenStorage: TokenStorage) {
    this.loadNavigation();
  }

  loadNavigation(): void {
    const isUser = this._tokenStorage.isUserToken();

    if (isUser) {
      this.buildNavigation();
    } else {
      this.buildAgentNavigation();
    }
  }

  private buildAgentNavigation() {
    this._items.next([
      {
        type: 'subheading',
        label: 'services',
        roles: [Role.ADMIN, Role.USER, Role.AGENT],
        children: [
          {
            type: 'link',
            label: 'chat.label',
            route: 'chat',
            icon: 'mat:forum',
            roles: [Role.ADMIN, Role.USER, Role.AGENT],
            plans: [PlanEnum.BASIC, PlanEnum.PRO]
          }
        ]
      }
    ]);
  }

  private buildNavigation() {
    this._items.next([
      {
        type: 'subheading',
        label: 'dashboard.name',
        roles: [Role.ADMIN, Role.USER],
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
        roles: [Role.ADMIN, Role.USER],
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
            label: 'agents',
            route: 'agent',
            icon: 'mat:support_agent',
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
        roles: [Role.ADMIN, Role.USER, Role.AGENT],
        children: [
          {
            type: 'link',
            label: 'campaigns',
            route: 'campaign',
            icon: 'mat:campaign',
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
          },
          {
            type: 'link',
            label: 'chat.label',
            route: 'chat',
            icon: 'mat:forum',
            roles: [Role.ADMIN, Role.USER, Role.AGENT],
            plans: [PlanEnum.BASIC, PlanEnum.PRO]
          }
        ]
      }
    ]);
  }
}
