export interface Conversation {
  id: string;
  customerId: string;
  channelId: string;
  phoneNumberId: string;
  name: string;
  ddi: string;
  phoneNumber: string;
  lastMessageAt: string;
  messages: Message[];
}

export class Message {
  id: string;
  createdAt: string;
  senderId: string;
  senderType: SenderType;
  content: MessageContent;
  status: MessageStatus;
  error: MessageError;
}

export class MessageContent {
  to: string;
  type: MessageType;
  text?: TextMessage;
  image?: ImageMessage;
  video?: VideoMessage;
  audio?: AudioMessage;
  document?: DocumentMessage;
  sticker?: StickerMessage;
  button?: ButtonMessage;
}

export class MessageError {
  code: string;
  messages: { ptBr: string; enUs: string };
}

export class TextMessage {
  body: string;
  previewUrl?: boolean;
}

export class ButtonMessage {
  text: string;
  payload: string;
}

export class ImageMessage {
  id: string;
  sha256: string;
  caption: string;
  mime_type: string;
  url?: string;
}

export class VideoMessage {
  id: string;
  sha256: string;
  caption: string;
  mime_type: string;
  url?: string;
}

export class AudioMessage {
  id: string;
  voice: boolean;
  sha256: string;
  mime_type: string;
  url?: string;
}

export class DocumentMessage {
  id: string;
  filename: string;
  sha256: string;
  caption: string;
  mime_type: string;
  url?: string;
}

export class StickerMessage {
  id: string;
  sha256: string;
  mime_type: string;
  animated: boolean;
  url?: string;
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

export class SendMessageRequest {
  senderId: string; // TODO no back deve pegar do agentId do token
  senderType: SenderType;
  phoneNumberId: string;
  content: MessageContentRequest;
}

export class MessageContentRequest {
  to: string;
  type: MessageType;
  text?: TextMessageRequest;
  image?: ImageMessageRequest;
}

export class TextMessageRequest {
  body: string;
  previewUrl?: boolean;
}

export class ImageMessageRequest {
  id: string;
  caption?: string;
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
  AUDIO = 'AUDIO',
  STICKER = 'STICKER',
  BUTTON = 'BUTTON',
  UNSUPPORTED = 'UNSUPPORTED'
}

export enum MessageStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  FAILED = 'FAILED',
  PLAYED = 'PLAYED',
  ERROR = 'ERROR'
}

export const MessageStatusIconMap: Record<MessageStatus, string> = {
  PENDING: 'mat:access_time',
  SENT: 'mat:done',
  DELIVERED: 'mat:done_all',
  READ: 'mat:done_all',
  FAILED: 'mat:error',
  ERROR: 'mat:error',
  PLAYED: 'mat:done_all'
};

export const MessageStatusColorMap: Record<MessageStatus, string> = {
  PENDING: 'text-white',
  SENT: 'text-white',
  DELIVERED: 'text-white',
  READ: 'text-[#3897f8]',
  FAILED: 'text-red-600',
  ERROR: 'text-red-600',
  PLAYED: 'text-[#3897f8]'
};
