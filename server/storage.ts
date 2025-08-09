import { type User, type InsertUser, type Chat, type InsertChat, type Message, type InsertMessage, type ChatMember } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserOnlineStatus(userId: string, isOnline: boolean): Promise<void>;
  
  // Chats
  getChatsForUser(userId: string): Promise<Chat[]>;
  getChat(chatId: string): Promise<Chat | undefined>;
  createChat(chat: InsertChat): Promise<Chat>;
  
  // Messages
  getMessagesForChat(chatId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(messageId: string, userId: string): Promise<void>;
  
  // Chat Members
  addUserToChat(chatId: string, userId: string): Promise<ChatMember>;
  getChatMembers(chatId: string): Promise<User[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private chats: Map<string, Chat>;
  private messages: Map<string, Message>;
  private chatMembers: Map<string, ChatMember>;

  constructor() {
    this.users = new Map();
    this.chats = new Map();
    this.messages = new Map();
    this.chatMembers = new Map();
    
    // Initialize with mock data
    this.initializeMockData();
  }

  private initializeMockData() {
    // Create current user
    const currentUser: User = {
      id: "user-1",
      username: "bhaiya",
      password: "password",
      displayName: "Bhaiya",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      lastSeen: new Date(),
      isOnline: true,
    };
    this.users.set(currentUser.id, currentUser);

    // Create other users
    const contacts = [
      {
        id: "user-2",
        username: "papa_ji",
        displayName: "Papa Ji",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      },
      {
        id: "user-3",
        username: "gaurav_sir",
        displayName: "Gaurav Sir Mindstein Software",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      },
      {
        id: "user-4",
        username: "acciojob",
        displayName: "AccioJob",
        avatar: "https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      },
      {
        id: "user-5",
        username: "sarah",
        displayName: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b776?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      },
      {
        id: "user-6",
        username: "alex",
        displayName: "Alex Chen",
        avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      },
    ];

    contacts.forEach(contact => {
      const user: User = {
        ...contact,
        avatar: contact.avatar || null,
        password: "password",
        lastSeen: new Date(Date.now() - Math.random() * 86400000),
        isOnline: Math.random() > 0.5,
      };
      this.users.set(user.id, user);
    });

    // Create chats
    const chats = [
      { id: "chat-1", name: "Bhaiya", isGroup: false, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
      { id: "chat-2", name: "Papa Ji", isGroup: false, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
      { id: "chat-3", name: "Gaurav Sir Mindstein Software", isGroup: false, avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
      { id: "chat-4", name: "AccioJob", isGroup: false, avatar: "https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
    ];

    chats.forEach(chat => {
      const chatData: Chat = {
        ...chat,
        name: chat.name || null,
        avatar: chat.avatar || null,
        isGroup: chat.isGroup || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.chats.set(chat.id, chatData);
      
      // Add current user to all chats
      const membershipId = randomUUID();
      this.chatMembers.set(membershipId, {
        id: membershipId,
        chatId: chat.id,
        userId: "user-1",
        joinedAt: new Date(),
      });
    });

    // Create messages
    const messages = [
      {
        id: "msg-1",
        chatId: "chat-1",
        senderId: "user-2",
        content: "https://youtube.com/shorts/4MDyVZ2b9-DeaJ_ZJBGAOoPaCfRcBGJ",
        messageType: "link",
        metadata: {
          url: "https://youtube.com/shorts/4MDyVZ2b9-DeaJ_ZJBGAOoPaCfRcBGJ",
          title: "The SHOCKING Truth About $35 Dalal Being Sold for $40",
          description: "The SHOCKING Truth About $35 Dalal Being youtube.com",
          thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225",
          domain: "youtube.com"
        },
        createdAt: new Date(Date.now() - 3600000),
      },
      {
        id: "msg-2",
        chatId: "chat-1",
        senderId: "user-1",
        content: "Hi",
        messageType: "text",
        createdAt: new Date(Date.now() - 86400000),
      },
      {
        id: "msg-3",
        chatId: "chat-2",
        senderId: "user-3",
        content: "7895552273",
        messageType: "text",
        createdAt: new Date(Date.now() - 7200000),
      },
      {
        id: "msg-4",
        chatId: "chat-3",
        senderId: "user-4",
        content: "Photo",
        messageType: "image",
        createdAt: new Date(Date.now() - 14400000),
      },
    ];

    messages.forEach(message => {
      const messageData: Message = {
        ...message,
        readBy: [],
        metadata: message.metadata || null,
      };
      this.messages.set(message.id, messageData);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser,
      avatar: insertUser.avatar || null,
      id,
      lastSeen: new Date(),
      isOnline: true,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.isOnline = isOnline;
      if (!isOnline) {
        user.lastSeen = new Date();
      }
      this.users.set(userId, user);
    }
  }

  async getChatsForUser(userId: string): Promise<Chat[]> {
    const userChatIds = Array.from(this.chatMembers.values())
      .filter(member => member.userId === userId)
      .map(member => member.chatId);
    
    return Array.from(this.chats.values())
      .filter(chat => userChatIds.includes(chat.id))
      .sort((a, b) => b.updatedAt!.getTime() - a.updatedAt!.getTime());
  }

  async getChat(chatId: string): Promise<Chat | undefined> {
    return this.chats.get(chatId);
  }

  async createChat(insertChat: InsertChat): Promise<Chat> {
    const id = randomUUID();
    const chat: Chat = {
      ...insertChat,
      name: insertChat.name || null,
      avatar: insertChat.avatar || null,
      isGroup: insertChat.isGroup || false,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.chats.set(id, chat);
    return chat;
  }

  async getMessagesForChat(chatId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.chatId === chatId)
      .sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      ...insertMessage,
      messageType: insertMessage.messageType || "text",
      id,
      createdAt: new Date(),
      readBy: [],
      metadata: insertMessage.metadata || null,
    };
    this.messages.set(id, message);
    
    // Update chat timestamp
    const chat = this.chats.get(insertMessage.chatId);
    if (chat) {
      chat.updatedAt = new Date();
      this.chats.set(insertMessage.chatId, chat);
    }
    
    return message;
  }

  async markMessageAsRead(messageId: string, userId: string): Promise<void> {
    const message = this.messages.get(messageId);
    if (message) {
      const readBy = Array.isArray(message.readBy) ? message.readBy : [];
      if (!readBy.includes(userId)) {
        readBy.push(userId);
        message.readBy = readBy;
        this.messages.set(messageId, message);
      }
    }
  }

  async addUserToChat(chatId: string, userId: string): Promise<ChatMember> {
    const id = randomUUID();
    const member: ChatMember = {
      id,
      chatId,
      userId,
      joinedAt: new Date(),
    };
    this.chatMembers.set(id, member);
    return member;
  }

  async getChatMembers(chatId: string): Promise<User[]> {
    const memberUserIds = Array.from(this.chatMembers.values())
      .filter(member => member.chatId === chatId)
      .map(member => member.userId);
    
    return Array.from(this.users.values())
      .filter(user => memberUserIds.includes(user.id));
  }
}

export const storage = new MemStorage();
