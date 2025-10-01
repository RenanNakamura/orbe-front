export interface Message {
    type: Type;
    body: string;
}

export interface MediaMessage extends Message {
    link: string;
    body: string;
    filename: string;
    originalFilename: string;
}

export enum Type {
    TEXT = 'TEXT', BUTTON = 'BUTTON', IMAGE = 'IMAGE', VIDEO = 'VIDEO', DOCUMENT = 'DOCUMENT', LIST = 'LIST'
}

export interface TextMessage extends Message {
    body: string;
    previewUrl: boolean;
}

export interface ButtonMessage extends Message {
    body: string;
    buttons: { id: string, text: string }[];
}

export interface ListMessage extends Message {
    body: string;
    button: string;
    sections: any[];
}

export interface ImageMessage extends Message {
    link: string;
    body: string;
    filename: string;
}

export interface DocumentMessage extends Message {
    link: string;
    body: string;
    filename: string;
}

export interface VideoMessage extends Message {
    link: string;
    body: string;
    filename: string;
}