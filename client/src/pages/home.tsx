import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import ChatArea from "@/components/chat-area";
import { useWebSocket } from "@/hooks/use-websocket";
import type { Chat, Message, User } from "@/lib/types";

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});

  const { sendMessage: sendWSMessage } = useWebSocket({
    onMessage: (data) => {
      if (data.type === "new_message") {
        // Only add message if it's for the currently selected chat
        if (selectedChat && data.data.chatId === selectedChat.id) {
          setMessages(prev => {
            // Check if message already exists (avoid duplicates)
            const messageExists = prev.some(msg => msg.id === data.data.id);
            if (messageExists) return prev;
            return [...prev, data.data];
          });
        }
      } else if (data.type === "user_typing") {
        setTypingUsers(prev => ({
          ...prev,
          [`${data.data.chatId}-${data.data.userId}`]: data.data.isTyping
        }));
      }
    }
  });

  useEffect(() => {
    // Fetch current user
    fetch('/api/user')
      .then(res => res.json())
      .then(setCurrentUser);

    // Fetch chats
    fetch('/api/chats')
      .then(res => res.json())
      .then(setChats);
  }, []);

  useEffect(() => {
    if (selectedChat) {
      // Fetch messages for selected chat
      fetch(`/api/chats/${selectedChat.id}/messages`)
        .then(res => res.json())
        .then(setMessages);
    }
  }, [selectedChat]);

  const sendMessage = async (content: string, messageType: string = "text", metadata?: any) => {
    if (!selectedChat || !currentUser) return;

    const messageData = {
      content,
      messageType,
      metadata
    };

    try {
      const response = await fetch(`/api/chats/${selectedChat.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Message will be added via WebSocket, no need for optimistic updates
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = (isTyping: boolean) => {
    if (selectedChat) {
      sendWSMessage({
        type: 'typing',
        chatId: selectedChat.id,
        isTyping
      });
    }
  };

  if (!currentUser) {
    return <div className="flex items-center justify-center h-screen whatsapp-bg whatsapp-text">Loading...</div>;
  }

  return (
    <div className="flex h-screen whatsapp-bg overflow-hidden">
      <div className={`${selectedChat ? 'hidden lg:block' : 'block'} w-full lg:w-96 flex-shrink-0`}>
        <Sidebar
          currentUser={currentUser}
          chats={chats}
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
        />
      </div>
      <div className={`${selectedChat ? 'block' : 'hidden lg:block'} flex-1`}>
        <ChatArea
          selectedChat={selectedChat}
          messages={messages}
          currentUser={currentUser}
          onSendMessage={sendMessage}
          onTyping={handleTyping}
          typingUsers={typingUsers}
          onBackToChats={() => setSelectedChat(null)}
        />
      </div>
    </div>
  );
}
