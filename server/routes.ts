import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current user (in a real app, this would come from authentication)
  app.get("/api/user", async (req, res) => {
    const user = await storage.getUser("user-1");
    res.json(user);
  });

  // Get chats for current user
  app.get("/api/chats", async (req, res) => {
    const chats = await storage.getChatsForUser("user-1");
    res.json(chats);
  });

  // Get messages for a chat
  app.get("/api/chats/:chatId/messages", async (req, res) => {
    const { chatId } = req.params;
    const messages = await storage.getMessagesForChat(chatId);
    res.json(messages);
  });

  // Send a message
  app.post("/api/chats/:chatId/messages", async (req, res) => {
    try {
      const { chatId } = req.params;
      const messageData = {
        ...req.body,
        chatId,
        senderId: "user-1", // Current user
      };
      
      const validatedMessage = insertMessageSchema.parse(messageData);
      const message = await storage.createMessage(validatedMessage);
      
      // Broadcast message to WebSocket clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: "new_message",
            data: message
          }));
        }
      });
      
      res.json(message);
    } catch (error) {
      res.status(400).json({ error: "Invalid message data" });
    }
  });

  const httpServer = createServer(app);
  
  // WebSocket server for real-time messaging
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    // Update user online status
    storage.updateUserOnlineStatus("user-1", true);
    
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'typing') {
          // Broadcast typing indicator to other clients
          wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: "user_typing",
                data: {
                  chatId: message.chatId,
                  userId: "user-1",
                  isTyping: message.isTyping
                }
              }));
            }
          });
        }
      } catch (error) {
        console.error('Invalid WebSocket message:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
      storage.updateUserOnlineStatus("user-1", false);
    });
  });

  return httpServer;
}
