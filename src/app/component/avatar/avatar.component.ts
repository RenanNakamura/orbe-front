import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getInitials } from './avatar.utils';
import { tenantAndUserIdAndNameToColor } from './avatar-color.utils';

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
  @Input({ required: true }) userId!: string;
  @Input({ required: true }) name!: string;
  @Input({ required: true }) tenantId!: string;
  @Input() size = 36;

  initials = '';
  backgroundColor = '#999';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'] || changes['name'] || changes['tenantId']) {
      this.resolveAvatar();
    }
  }

  private resolveAvatar(): void {
    const key = cacheKey(this.tenantId, this.userId, this.name);
    const cached = AVATAR_CACHE.get(key);

    if (cached) {
      this.initials = cached.initials;
      this.backgroundColor = cached.color;
      return;
    }

    this.initials = getInitials(this.name);
    this.backgroundColor = tenantAndUserIdAndNameToColor(this.tenantId, this.userId, this.name);

    AVATAR_CACHE.set(key, {
      initials: this.initials,
      color: this.backgroundColor
    });
  }
}
