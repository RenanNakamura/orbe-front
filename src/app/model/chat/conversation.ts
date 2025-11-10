export interface Conversation {
  id: string;
  customerId: string;
  name: string;
  messages: Message[];
}

export class Message {
  createdAt: string;
  senderId: string;
  senderType: SenderType;
  content: MessageContent;
}

export class MessageContent {
  to: string;
  messageType: MessageType;
  text: TextMessage;
}

export class TextMessage {
  body: string;
  previewUrl: boolean;
}

export enum SenderType {
  AGENT = 'AGENT', CUSTOMER = 'CUSTOMER', BOT = 'BOT'
}

export enum MessageType {
  TEXT = 'TEXT',
}
