import {Contact} from './Contact';

export interface Tag {
    id?: string;
    description: string;
    contacts?: Contact[];
}

export interface CreateTag {
    id?: string;
    description: string;
    contacts?: string[];
}

export interface UpdateTag {
    id?: string;
    description: string;
    contacts?: string[];
}

export interface ListTag {
    id?: string;
    description: string;
}

export interface TagParams {
    page?: number;
    size?: number;
    sort?: string;
    search?: string;
}
