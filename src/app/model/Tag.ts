import {Contact} from './Contact';

export interface Tag {
    id?: string;
    description: string;
    color: string;
    contacts?: Contact[];
}

export interface CreateTag {
    id?: string;
    description: string;
    color: string;
    contacts?: string[];
}

export interface UpdateTag {
    id?: string;
    description: string;
    color: string;
    contacts?: string[];
}

export interface ListTag {
    id?: string;
    description: string;
    color: string;
}

export interface TagParams {
    page?: number;
    size?: number;
    sort?: string;
    search?: string;
}
