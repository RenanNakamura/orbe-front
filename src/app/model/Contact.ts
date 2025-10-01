export interface Contact {
    id?: string;
    name: string;
    email: string;
    ddi: string;
    number: string;
    address?: string;
}

export interface ContactParams {
    page?: number;
    size?: number;
    sort?: string;
    search?: string;
    operation?: string;
    conditions?: any[];
}
