import { useEffect, useRef } from "react";
import { FileText, Camera, Image } from "lucide-react";

interface AttachmentMenuProps {
  onClose: () => void;
  onAttach: (type: string) => void;
}

export default function AttachmentMenu({ onClose, onAttach }: AttachmentMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const attachmentTypes = [
    { type: "document", label: "Document", icon: FileText, color: "bg-blue-500" },
    { type: "camera", label: "Camera", icon: Camera, color: "bg-purple-500" },
    { type: "gallery", label: "Gallery", icon: Image, color: "bg-pink-500" },
  ];

  return (
    <div
      ref={menuRef}
      className="absolute bottom-16 left-4 bg-whatsapp-panel border border-whatsapp-border rounded-lg shadow-xl p-2 z-50"
    >
      <div className="space-y-1">
        {attachmentTypes.map(({ type, label, icon: Icon, color }) => (
          <button
            key={type}
            onClick={() => onAttach(type)}
            className="flex items-center space-x-3 w-full p-3 hover:bg-whatsapp-hover rounded-lg transition-colors"
          >
            <div className={`w-10 h-10 ${color} rounded-full flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-whatsapp-text">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
