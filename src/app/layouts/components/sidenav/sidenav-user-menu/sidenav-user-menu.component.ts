import { Component, OnInit } from '@angular/core';
import { VexPopoverRef } from '@vex/components/vex-popover/vex-popover-ref';
import { MatRippleModule } from '@angular/material/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { TokenStorage } from '../../../../storage/user/token.storage';
import { RefreshTokenStorage } from '../../../../storage/user/refresh-token.storage';
import { UserStorage } from '../../../../storage/user/user.storage';

@Component({
  selector: 'vex-sidenav-user-menu',
  templateUrl: './sidenav-user-menu.component.html',
  styleUrls: ['./sidenav-user-menu.component.scss'],
  imports: [MatRippleModule, RouterLink, MatIconModule, TranslateModule],
  standalone: true
})
export class SidenavUserMenuComponent implements OnInit {
  constructor(
    private readonly _popoverRef: VexPopoverRef,
    private _tokenStorage: TokenStorage,
    private _refreshTokenStorage: RefreshTokenStorage,
    private _userStorage: UserStorage
  ) {}

  ngOnInit(): void {}

  onLogout() {
    console.log('CHAMOU LOGUT');
    // this._refreshTokenStorage.clear();
    // this._tokenStorage.clear();
    // this._userStorage.clear();
    // this._popoverRef.close();
    setTimeout(() => this._popoverRef.close(), 250);
  }
}
