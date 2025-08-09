import { useEffect, useRef } from "react";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

export default function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const emojis = [
    "😀", "😂", "😍", "🤔", "👍", "❤️", "🔥", "💯",
    "😊", "😎", "🥳", "😴", "🤗", "🙄", "😘", "😜",
    "👏", "🙌", "💪", "🤝", "🙏", "✌️", "🤟", "👌",
    "🎉", "🎊", "🎈", "🎁", "🌟", "⭐", "💫", "✨"
  ];

  return (
    <div
      ref={pickerRef}
      className="absolute bottom-16 right-4 bg-whatsapp-panel border border-whatsapp-border rounded-lg shadow-xl p-4 z-50"
    >
      <div className="grid grid-cols-8 gap-2 text-xl">
        {emojis.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onSelect(emoji)}
            className="hover:bg-whatsapp-hover p-2 rounded transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
