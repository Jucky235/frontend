import * as React from "react";

export interface ChatMessage {
  id: string | number;
  user: {
    name: string;
    avatar?: string; // 👈 Made optional to support fallback initial/icon
    avatarUrl?: string; // 👈 Added support if your backend returns avatarUrl instead
  };
  text: string;
  timestamp: string;
  isMe?: boolean;
}

export interface MessageBubbleProps {
  message: ChatMessage;
}

// Helper to generate initials if no image is available
function getInitials(name?: string): string {
  if (!name || !name.trim()) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { user, text, timestamp, isMe } = message;

  // Check for avatar or avatarUrl (supports Cloudinary URLs)
  const userAvatarImage = user?.avatarUrl || user?.avatar;

  return (
    <div
      className={`flex items-start space-x-3 max-w-2xl ${
        isMe ? "ml-auto flex-row-reverse space-x-reverse" : ""
      }`}
    >
      <div className="flex flex-col items-center shrink-0">
        <div className="w-9 h-9 rounded-full overflow-hidden border border-border flex items-center justify-center bg-brand text-brand-foreground font-bold text-xs shadow-xs">
          {userAvatarImage ? (
            <img
              src={userAvatarImage}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            getInitials(user.name)
          )}
        </div>
        <span className="text-[10px] text-foreground-subtle mt-1 max-w-[60px] truncate font-semibold">
          {user.name}
        </span>
      </div>

      <div
        className={`border px-4 py-2.5 rounded-2xl space-y-1 shadow-xs max-w-xl ${
          isMe
            ? "bg-brand text-white border-brand rounded-tr-xs"
            : "bg-background-card text-foreground border-border/80 rounded-tl-xs"
        }`}
      >
        <p className="text-xs font-medium leading-relaxed">{text}</p>
        <div
          className={`text-[10px] font-semibold text-right ${
            isMe ? "text-brand-text-subtle" : "text-foreground-subtle"
          }`}
        >
          {timestamp}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
