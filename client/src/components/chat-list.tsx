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
    <div className="overflow-y-auto max-h-screen px-2 py-2 sm:px-4 sm:py-4">
      {chats.map((chat) => {
        const lastMessage = getLastMessage(chat);
        const isSelected = selectedChat?.id === chat.id;
        return (
          <div key={chat.id} className="px-1 py-1 sm:px-2 sm:py-2">
            <div
              onClick={() => onSelectChat(chat)}
              className={`flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg cursor-pointer transition-colors ${
                isSelected ? "bg-whatsapp-selected" : "hover:bg-whatsapp-hover"
              }`}
            >
              <img
                src={chat.avatar && chat.avatar.trim() !== "" ? chat.avatar : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"}
                alt={`${chat.name} Profile`}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                onError={e => { e.currentTarget.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"; }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                  <h3 className="text-whatsapp-text font-medium truncate text-base sm:text-lg">{chat.name}</h3>
                  <span className="text-whatsapp-secondary text-xs sm:text-sm flex-shrink-0 sm:ml-2 mt-1 sm:mt-0">
                    {formatTime(lastMessage.time)}
                  </span>
                </div>
                <div className="flex flex-row items-center justify-between mt-1">
                  <div className="flex items-center flex-1 min-w-0">
                    <p className="text-whatsapp-secondary text-sm sm:text-base truncate">
                      {lastMessage.content}
                    </p>
                  </div>
                  {lastMessage.unreadCount && lastMessage.unreadCount > 0 && (
                    <div className="bg-whatsapp-green  text-white text-xs sm:text-sm rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center ml-2 flex-shrink-0 shadow-md">
                      <span className="w-full text-center  truncate">{lastMessage.unreadCount > 99 ? '99+' : lastMessage.unreadCount}</span>
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
