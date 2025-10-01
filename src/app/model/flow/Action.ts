export interface Action {
    type: Type;
    values: string[];
}

export enum Type {
    ADD_TAG = 'ADD_TAG',
    REMOVE_TAG = 'REMOVE_TAG'
}
