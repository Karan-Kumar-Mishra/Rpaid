export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string | null;
  lastSeen: Date | null;
  isOnline: boolean;
}

export interface Chat {
  id: string;
  name?: string | null;
  isGroup: boolean;
  avatar?: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  messageType: string;
  metadata?: any;
  createdAt: Date | null;
  readBy: any;
}

export interface ChatMember {
  id: string;
  chatId: string;
  userId: string;
  joinedAt: Date | null;
}
