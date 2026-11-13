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
      className={`flex max-w-2xl items-end gap-2.5 sm:gap-3 ${
        isMe ? "ml-auto flex-row-reverse" : ""
      }`}
    >
      <div className="flex flex-col items-center shrink-0">
        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-brand/20 bg-gradient-to-br from-brand to-violet-600 text-xs font-bold text-white shadow-sm">
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
        <span className="mt-1 max-w-[72px] truncate text-[9px] font-semibold text-foreground-subtle">
          {user.name}
        </span>
      </div>

      <div
        className={`max-w-[82%] space-y-1 rounded-2xl border px-4 py-2.5 shadow-sm sm:max-w-xl ${
          isMe
            ? "rounded-br-md border-brand bg-brand text-brand-foreground"
            : "rounded-bl-md border-border bg-background-card text-foreground"
        }`}
      >
        <p className="break-words text-xs font-medium leading-relaxed">{text}</p>
        <div
          className={`text-[10px] font-semibold text-right ${
            isMe ? "text-white/75" : "text-foreground-subtle"
          }`}
        >
          {timestamp}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
