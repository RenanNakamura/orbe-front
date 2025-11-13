export interface Conversation {
  id: string;
  customerId: string;
  name: string;
  lastMessageAt: string;
  messages: Message[];
}

export class Message {
  id: string;
  createdAt: string;
  senderId: string;
  senderType: SenderType;
  content: MessageContent;
}

export class MessageContent {
  to: string;
  type: MessageType;
  text: TextMessage;
}

export class TextMessage {
  body: string;
  previewUrl?: boolean;
}

export class CreateConversation {
  channelId: string;
  phoneNumberId: string;
  ddi: string;
  phoneNumber?: string;
  name: string;
  status: ConversationStatus;
  channel: ConversationChannel
}

export enum ConversationStatus {
  OPEN = 'OPEN', CLOSED = 'CLOSED'
}

export enum ConversationChannel {
  WHATSAPP = 'WHATSAPP'
}

export enum SenderType {
  AGENT = 'AGENT', CUSTOMER = 'CUSTOMER', BOT = 'BOT'
}

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
}
