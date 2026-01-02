import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getInitials } from './avatar.utils';
import { tenantAndNameToColor } from './avatar-color.utils';
import { TokenStorage } from '../../storage/user/token.storage';

type AvatarCacheEntry = {
  initials: string;
  color: string;
};

const AVATAR_CACHE = new Map<string, AvatarCacheEntry>();

function cacheKey(tenantId: string, userId: string, name: string): string {
  return `${tenantId}:${userId}:${name}`;
}

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="rounded-full flex items-center justify-center select-none"
      [style.width.px]="size"
      [style.height.px]="size"
      [style.background]="backgroundColor">
      <span class="text-white font-semibold" [style.fontSize.px]="size * 0.42">
        {{ initials }}
      </span>
    </div>
  `
})
export class AvatarComponent implements OnChanges {
  private tenantId!: string;
  private agentId!: string;

  @Input({ required: true }) name!: string;
  @Input() size = 36;

  initials = '';
  backgroundColor = '#999';

  constructor(private _tokenStorage: TokenStorage) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.tenantId = this._tokenStorage.getTenantId();
    this.agentId = this._tokenStorage.getAgentId();
    if (changes['name']) {
      this.resolveAvatar();
    }
  }

  private resolveAvatar(): void {
    const key = cacheKey(this.tenantId, this.agentId, this.name);
    const cached = AVATAR_CACHE.get(key);

    if (cached) {
      this.initials = cached.initials;
      this.backgroundColor = cached.color;
      return;
    }

    this.initials = getInitials(this.name);
    this.backgroundColor = tenantAndNameToColor(
      this.tenantId,
      this.name
    );

    AVATAR_CACHE.set(key, {
      initials: this.initials,
      color: this.backgroundColor
    });
  }
}
