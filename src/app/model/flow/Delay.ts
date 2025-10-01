export interface Delay {
    type: Type;
    value: number;
}

export enum Type {
    SECONDS = 'SECONDS',
    MINUTE = 'MINUTE',
    HOUR = 'HOUR',
    DAY = 'DAY'
}