import { Check, CheckCheck } from "lucide-react";
import type { Message } from "@/lib/types";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const renderLinkPreview = (metadata: any) => {
    if (!metadata?.url) return null;
    
    return (
      <div className="border border-whatsapp-border rounded-lg overflow-hidden mt-3 bg-whatsapp-chat-bg">
        {metadata.thumbnail && (
          <img
            src={metadata.thumbnail}
            alt="Link preview"
            className="w-full h-32 object-cover"
          />
        )}
        <div className="p-3">
          <h4 className="text-whatsapp-text text-sm font-medium mb-1">
            {metadata.title || "Link Preview"}
          </h4>
          <p className="text-whatsapp-secondary text-xs">
            {metadata.description || "Link description"}
          </p>
          <p className="text-whatsapp-secondary text-xs mt-2">
            {metadata.domain || "website.com"}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className="max-w-md">
        <div
          className={`p-3 rounded-lg shadow-sm ${
            isOwn
              ? "bg-whatsapp-sent rounded-br-none"
              : "bg-whatsapp-received rounded-bl-none"
          }`}
        >
          {message.messageType === "link" && message.metadata?.domain && (
            <p className="text-whatsapp-green-light text-sm mb-2">
              {message.metadata.domain}
            </p>
          )}
          
          <p className={`text-sm ${isOwn ? "text-white" : "text-whatsapp-text"}`}>
            {message.content}
          </p>
          
          {message.messageType === "link" && renderLinkPreview(message.metadata)}
          
          <div className="flex justify-end items-center mt-2 space-x-1">
            <span className={`text-xs ${isOwn ? "text-white/70" : "text-whatsapp-secondary"}`}>
              {formatTime(new Date(message.createdAt!))}
            </span>
            {isOwn && (
              <CheckCheck className="w-3 h-3 text-blue-300" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
