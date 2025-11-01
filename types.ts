
export type Role = 'user' | 'model';

export interface InlineDataPart {
  inlineData: {
    mimeType: string;
    data: string;
  };
}

export interface TextPart {
  text: string;
}

export type MessagePart = InlineDataPart | TextPart;

export interface Message {
  role: Role;
  parts: MessagePart[];
}
