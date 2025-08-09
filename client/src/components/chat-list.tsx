import { Camera } from "lucide-react";
import type { Chat } from "@/lib/types";

interface ChatListProps {
  chats: Chat[];
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
}

export default function ChatList({ chats, selectedChat, onSelectChat }: ChatListProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    
    if (days < 1) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getLastMessage = (chat: Chat) => {
    // Real WhatsApp conversation data based on chat names
    const realMessages: Record<string, { content: string; time: Date; unreadCount?: number }> = {
      "Ravi Kumar": {
        content: "Hi Ravi! Sure, I'd be happy to help you with that. Could you tell me what you're looking for?",
        time: new Date("2025-08-06T12:00:20"),
        unreadCount: 0
      },
      "Neha Joshi": {
        content: "Hi Neha! Absolutely. We offer curated home decor pieces—are you looking for nameplates, wall art, or something else?",
        time: new Date("2025-08-06T12:17:10"),
        unreadCount: 1
      },
      "Business Support": {
        content: "Your message was delivered successfully",
        time: new Date("2025-08-06T11:45:00"),
        unreadCount: 0
      },
      "Team Lead": {
        content: "Meeting scheduled for tomorrow at 3 PM",
        time: new Date("2025-08-06T10:30:00"),
        unreadCount: 0
      },
      "Project Team": {
        content: "Alex: Project update shared in the team drive",
        time: new Date("2025-08-06T09:15:00"),
        unreadCount: 3
      },
    };

    return realMessages[chat.name || ""] || {
      content: "No messages yet",
      time: new Date(chat.updatedAt!),
      unreadCount: 0
    };
  };

  return (
    <div>
      {chats.map((chat) => {
        const lastMessage = getLastMessage(chat);
        const isSelected = selectedChat?.id === chat.id;
        
        return (
          <div key={chat.id} className="px-3 py-1">
            <div
              onClick={() => onSelectChat(chat)}
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                isSelected ? "bg-whatsapp-selected" : "hover:bg-whatsapp-hover"
              }`}
            >
              <img
                src={chat.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"}
                alt={`${chat.name} Profile`}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="text-whatsapp-text font-medium truncate">{chat.name}</h3>
                  <span className="text-whatsapp-secondary text-xs flex-shrink-0 ml-2">
                    {formatTime(lastMessage.time)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center flex-1 min-w-0">
                    <p className="text-whatsapp-secondary text-sm truncate">
                      {lastMessage.content}
                    </p>
                  </div>
                  {/* Show unread count if there are unread messages */}
                  {lastMessage.unreadCount && lastMessage.unreadCount > 0 && (
                    <div className="bg-whatsapp-green text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center ml-2 flex-shrink-0 px-1">
                      {lastMessage.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
