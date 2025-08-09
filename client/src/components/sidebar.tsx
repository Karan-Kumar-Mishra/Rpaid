import { useState } from "react";
import { Search, MessageCircle, Users, MoreVertical, Lock, Bookmark, Archive, Copy, Settings } from "lucide-react";
import ChatList from "./chat-list";
import type { User, Chat } from "@/lib/types";

interface SidebarProps {
  currentUser: User;
  chats: Chat[];
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
}

export default function Sidebar({ currentUser, chats, selectedChat, onSelectChat }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Unread", "Favorites", "Groups"];

  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    // For now, just filter by search. In a real app, you'd implement proper filtering
    return matchesSearch;
  });

  return (
    <div className="w-full lg:w-96 bg-whatsapp-panel border-r border-whatsapp-border flex flex-col h-full">
      {/* Header */}
      <div className="bg-whatsapp-panel px-4 py-3 border-b border-whatsapp-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <h1 className="text-whatsapp-text text-xl font-medium">WhatsApp</h1>
          </div>
          <div className="flex items-center space-x-1 text-whatsapp-secondary">
            <button className="hover:bg-whatsapp-hover hover:text-whatsapp-text transition-colors p-2 rounded-full">
              <Copy className="w-5 h-5" />
            </button>
            <button className="hover:bg-whatsapp-hover hover:text-whatsapp-text transition-colors p-2 rounded-full">
              <Archive className="w-5 h-5" />
            </button>
            <button className="hover:bg-whatsapp-hover hover:text-whatsapp-text transition-colors p-2 rounded-full">
              <Users className="w-5 h-5" />
            </button>
            <button className="hover:bg-whatsapp-hover hover:text-whatsapp-text transition-colors p-2 rounded-full">
              <MessageCircle className="w-5 h-5" />
            </button>
            <button className="hover:bg-whatsapp-hover hover:text-whatsapp-text transition-colors p-2 rounded-full">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-3 py-2 bg-whatsapp-panel">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-whatsapp-secondary w-4 h-4" />
          <input
            type="text"
            placeholder="Search or start a new chat"
            className="w-full bg-whatsapp-chat-bg text-whatsapp-text pl-10 pr-4 py-2 rounded-lg border-none outline-none placeholder-whatsapp-secondary focus:ring-1 focus:ring-whatsapp-green"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-3 py-2 border-b border-whatsapp-border bg-whatsapp-panel">
        <div className="flex space-x-6">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`pb-2 text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? "text-whatsapp-green-light border-b-2 border-whatsapp-green-light"
                  : "text-whatsapp-secondary hover:text-whatsapp-text"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-whatsapp-panel">
        {/* Locked Chats Section */}
        <div className="px-3 py-2">
          <div className="flex items-center space-x-3 p-3 hover:bg-whatsapp-hover rounded-lg cursor-pointer transition-colors">
            <div className="w-12 h-12 bg-whatsapp-green rounded-full flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-whatsapp-text font-medium">Locked chats</h3>
            </div>
          </div>
        </div>

        {/* Saved Messages */}
        <div className="px-3 py-1">
          <div className="flex items-center space-x-3 p-3 hover:bg-whatsapp-hover rounded-lg cursor-pointer transition-colors">
            <div className="w-12 h-12 bg-whatsapp-green rounded-full flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-whatsapp-text font-medium">Saved Messages</h3>
                <span className="text-whatsapp-secondary text-xs">Wednesday</span>
              </div>
              <p className="text-whatsapp-secondary text-sm truncate">https://drive.google.com/file/d/19kegS...</p>
            </div>
          </div>
        </div>

        <ChatList
          chats={filteredChats}
          selectedChat={selectedChat}
          onSelectChat={onSelectChat}
        />

        {/* Get WhatsApp for Windows */}
        <div className="px-3 py-3 border-t border-whatsapp-border">
          <div className="flex items-center space-x-3 p-2 hover:bg-whatsapp-hover rounded-lg cursor-pointer transition-colors">
            <div className="w-8 h-8 bg-whatsapp-green rounded-lg flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <span className="text-whatsapp-green text-sm font-medium">Get WhatsApp for Windows</span>
          </div>
        </div>
      </div>
    </div>
  );
}
