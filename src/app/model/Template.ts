export interface Template {
  id?: string;
  name: string;
  channelId: string;
  category: Category;
  allowCategoryChange: string;
  language: string;
  status: Status;
  rejectedReason: string;
  components: Component[];
}

export interface Component {
  type: Type;
}

export enum Type {
  HEADER = 'HEADER',
  BODY = 'BODY',
  FOOTER = 'FOOTER',
  BUTTONS = 'BUTTONS'
}

export interface Header extends Component {

  format: Format;
  text: string;
  fileNameOriginal: string;
  fileNameStored: string;
  example: HeaderExample;

}

export interface HeaderExample {

  headerHandle: string;
  headerText: string[];

}

export interface Body extends Component {

  text: string;
  example: BodyExample;

}

export interface BodyExample {
  bodyText: string[];
}

export interface Footer extends Component {

  text: string;

}

export interface Button extends Component {

  buttons: ItemButton[];

}

export interface ItemButton {

  type: ButtonType;

  text: string;

  phoneNumber: string;

  url: string;

  example: string[];

}

export enum Category {
  AUTHENTICATION = 'AUTHENTICATION',
  MARKETING = 'MARKETING',
  UTILITY = 'UTILITY'
}

export enum Format {
  NONE = 'NONE',
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
  // LOCATION = 'LOCATION'
}

// Função auxiliar para verificar se é um tipo de mídia
export function isMediaType(format: Format): boolean {
  return format === Format.IMAGE ||
    format === Format.VIDEO ||
    format === Format.DOCUMENT;
}

export enum ButtonType {
  PHONE_NUMBER = 'PHONE_NUMBER',
  URL = 'URL',
  QUICK_REPLY = 'QUICK_REPLY'
}

export enum Status {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PAUSED = 'PAUSED'
}

export interface TemplateParams {
  page?: number;
  size?: number;
  sort?: string;
  search?: string;
  name?: string;
  status?: Status;
  channelId?: string;
}

export function isFormatMedia(format: Format): boolean {
  return format === Format.IMAGE ||
    format === Format.VIDEO ||
    format === Format.DOCUMENT;
}
