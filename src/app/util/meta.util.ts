export function getMetaStatusInfo(status: string): { labelKey: string; classes: string } {
    const classesMap: Record<string, string> = {
        PENDING:       'bg-amber-100 text-amber-400',
        DELETED:       'bg-gray-100 text-gray-400',
        MIGRATED:      'bg-cyan-100 text-cyan-400',
        BANNED:        'bg-red-100 text-red-400',
        RESTRICTED:    'bg-orange-100 text-orange-400',
        RATE_LIMITED:  'bg-amber-100 text-amber-400',
        FLAGGED:       'bg-pink-100 text-pink-400',
        CONNECTED:     'bg-green-100 text-green-400',
        DISCONNECTED:  'bg-red-100 text-red-400',
        UNKNOWN:       'bg-gray-100 text-gray-400',
        UNVERIFIED:    'bg-gray-100 text-gray-400'
    };

    const normalizedStatus = status && status in classesMap ? status : 'UNKNOWN';
    return {
        labelKey: `channel.meta-status.${normalizedStatus}`,
        classes: classesMap[normalizedStatus]
    };
}

export function getMessagingTierLabelKey(tier: string): string {
    const knownTiers = [
        'TIER_50',
        'TIER_250',
        'TIER_1K',
        'TIER_10K',
        'TIER_100K',
        'TIER_UNLIMITED'
    ];

    return knownTiers.includes(tier)
        ? `channel.messaging-tier.${tier}`
        : 'channel.messaging-tier.UNKNOWN';
}

export function getQualityRatingInfo(rating: string): { label: string; classes: string } {
    const map: Record<string, { label: string; classes: string }> = {
        GREEN:   { label: 'channel.quality-rating.GREEN',   classes: 'bg-green-100 text-green-400' },
        YELLOW:  { label: 'channel.quality-rating.YELLOW',  classes: 'bg-amber-100 text-amber-400' },
        RED:     { label: 'channel.quality-rating.RED',     classes: 'bg-red-100 text-red-400' },
        UNKNOWN: { label: 'channel.quality-rating.UNKNOWN', classes: 'bg-gray-100 text-gray-400' }
    };

    return map[rating] ?? map?.['UNKNOWN'];
}
