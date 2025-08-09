import { useState, useEffect, useRef } from "react";
import { Video, Phone, Search, MoreVertical, Paperclip, Smile, Mic, Send, MessageCircle, ArrowLeft } from "lucide-react";
import MessageBubble from "./message-bubble";
import EmojiPicker from "./emoji-picker";
import AttachmentMenu from "./attachment-menu";
import type { Chat, Message, User } from "@/lib/types";

interface ChatAreaProps {
  selectedChat: Chat | null;
  messages: Message[];
  currentUser: User;
  onSendMessage: (content: string, messageType?: string, metadata?: any) => void;
  onTyping: (isTyping: boolean) => void;
  typingUsers: Record<string, boolean>;
  onBackToChats?: () => void;
}

export default function ChatArea({ 
  selectedChat, 
  messages, 
  currentUser, 
  onSendMessage, 
  onTyping,
  typingUsers,
  onBackToChats
}: ChatAreaProps) {
  const [messageInput, setMessageInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    
    // Handle typing indicator
    onTyping(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false);
    }, 1000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() && selectedChat) {
      // Check if it's a URL
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const isUrl = urlRegex.test(messageInput.trim());
      
      if (isUrl) {
        // Mock link preview metadata
        const metadata = {
          url: messageInput.trim(),
          title: "Link Preview",
          description: "This is a preview of the shared link",
          thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225",
          domain: new URL(messageInput.trim()).hostname
        };
        onSendMessage(messageInput.trim(), "link", metadata);
      } else {
        onSendMessage(messageInput.trim());
      }
      
      setMessageInput("");
      onTyping(false);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessageInput(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.createdAt!);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let dateKey;
      if (date.toDateString() === today.toDateString()) {
        dateKey = "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateKey = "Yesterday";
      } else {
        dateKey = date.toLocaleDateString('en-US', { weekday: 'long' });
      }
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    
    return groups;
  };

  const isTyping = selectedChat && typingUsers[`${selectedChat.id}-user-2`]; // Mock typing for contact

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-whatsapp-chat-bg">
        <div className="text-center text-whatsapp-secondary">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-semibold mb-2 text-whatsapp-text">WhatsApp Web</h2>
          <p>Send and receive messages without keeping your phone online.</p>
          <p className="mt-2 text-sm">Use WhatsApp on up to 4 linked devices and 1 phone at the same time.</p>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex-1 flex flex-col bg-whatsapp-chat-bg min-w-0 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-whatsapp-panel px-4 py-3 border-b border-whatsapp-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Mobile back button */}
            <button
              onClick={onBackToChats}
              className="lg:hidden text-whatsapp-secondary hover:text-whatsapp-text transition-colors p-2 -ml-2 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <img
              src={selectedChat.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"}
              alt={`${selectedChat.name} Profile`}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h2 className="text-whatsapp-text font-medium">{selectedChat.name}</h2>
              <p className="text-whatsapp-secondary text-xs">last seen today at 2:44 PM</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-whatsapp-secondary">
            <button className="hover:bg-whatsapp-hover hover:text-whatsapp-text transition-colors p-2 rounded-full">
              <Video className="w-5 h-5" />
            </button>
            <button className="hover:bg-whatsapp-hover hover:text-whatsapp-text transition-colors p-2 rounded-full">
              <Phone className="w-5 h-5" />
            </button>
            <button className="hover:bg-whatsapp-hover hover:text-whatsapp-text transition-colors p-2 rounded-full">
              <Search className="w-5 h-5" />
            </button>
            <button className="hover:bg-whatsapp-hover hover:text-whatsapp-text transition-colors p-2 rounded-full">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-1 chat-pattern custom-scrollbar bg-whatsapp-chat-bg">
        {Object.entries(messageGroups).map(([date, dateMessages]) => (
          <div key={date}>
            {/* Date Separator */}
            <div className="flex justify-center mb-4">
              <span className="bg-whatsapp-panel text-whatsapp-secondary text-xs px-3 py-1 rounded-lg shadow-sm">
                {date}
              </span>
            </div>
            
            {/* Messages for this date */}
            {dateMessages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.senderId === currentUser.id}
              />
            ))}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 bg-whatsapp-received p-3 rounded-lg rounded-bl-none shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-whatsapp-secondary rounded-full typing-indicator"></div>
                <div className="w-2 h-2 bg-whatsapp-secondary rounded-full typing-indicator"></div>
                <div className="w-2 h-2 bg-whatsapp-secondary rounded-full typing-indicator"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Area */}
      <div className="bg-whatsapp-panel px-2 sm:px-4 py-3 border-t border-whatsapp-border">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-1 sm:space-x-2">
          {/* Attachment Button */}
          <button
            type="button"
            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
            className="text-whatsapp-secondary hover:bg-whatsapp-hover hover:text-whatsapp-text transition-colors p-1 sm:p-2 rounded-full flex-shrink-0"
          >
            <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          {/* Message Input */}
          <div className="flex-1 relative min-w-0">
            <input
              type="text"
              placeholder="Type a message"
              className="w-full bg-whatsapp-chat-bg text-whatsapp-text px-3 sm:px-4 py-2 sm:py-3 pr-8 sm:pr-12 rounded-lg border-none outline-none placeholder-whatsapp-secondary focus:ring-1 focus:ring-whatsapp-green text-sm sm:text-base"
              value={messageInput}
              onChange={handleInputChange}
            />
            {/* Emoji Button */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-1 sm:right-3 top-1/2 transform -translate-y-1/2 text-whatsapp-secondary hover:text-whatsapp-text transition-colors p-1"
            >
              <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          
          {/* Voice/Send Button */}
          <button
            type="submit"
            className="bg-whatsapp-green text-white p-2 sm:p-3 rounded-full hover:opacity-80 transition-opacity flex-shrink-0 min-w-[40px] sm:min-w-[48px]"
          >
            {messageInput.trim() ? <Send className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </form>
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <EmojiPicker
          onSelect={handleEmojiSelect}
          onClose={() => setShowEmojiPicker(false)}
        />
      )}

      {/* Attachment Menu */}
      {showAttachmentMenu && (
        <AttachmentMenu
          onClose={() => setShowAttachmentMenu(false)}
          onAttach={(type) => {
            console.log("Attach:", type);
            setShowAttachmentMenu(false);
          }}
        />
      )}
    </div>
  );
}
