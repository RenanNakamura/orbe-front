export interface Condition {
    type: Type;
    field: string;
    values: string[];
}

export enum Type {
    EQUAL = 'EQUAL',
    NOT_EQUAL = 'NOT_EQUAL',
    CONTAINS = 'CONTAINS',
    NOT_CONTAINS = 'NOT_CONTAINS',
    START_WITH = 'START_WITH',
    EMPTY = 'EMPTY',
    NOT_EMPTY = 'NOT_EMPTY'
}

export enum Field {
    name = 'name',
    phone = 'phone',
    email = 'email',
    tag = 'tag',
    address = 'address',
}
