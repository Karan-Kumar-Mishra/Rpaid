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
    // Mock last messages based on chat name
    const mockMessages: Record<string, { content: string; time: Date; type?: string }> = {
      "Bhaiya": {
        content: "https://youtube.com/shorts/4MDyVZ2b9...",
        time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      "Papa Ji": {
        content: "7895552273",
        time: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      },
      "Gaurav Sir Mindstein Software": {
        content: "Photo",
        time: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        type: "image"
      },
      "AccioJob": {
        content: "Hi Karna Kumar Mishra, Your slot booking is confir...",
        time: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      },
    };

    return mockMessages[chat.name || ""] || {
      content: "No messages yet",
      time: new Date(chat.updatedAt!),
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
                    {lastMessage.type === "image" && (
                      <Camera className="w-4 h-4 text-whatsapp-secondary mr-1 flex-shrink-0" />
                    )}
                    <p className="text-whatsapp-secondary text-sm truncate">
                      {lastMessage.content}
                    </p>
                  </div>
                  {/* Mock unread count for some chats */}
                  {(chat.name === "Bhaiya" || chat.name === "AccioJob") && (
                    <div className="bg-whatsapp-green text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2 flex-shrink-0">
                      1
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
