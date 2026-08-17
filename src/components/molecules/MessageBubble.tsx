import * as React from "react";

export interface ChatMessage {
  id: string | number;
  user: {
    name: string;
    avatar: string;
  };
  text: string;
  timestamp: string;
  isMe?: boolean;
}

export interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { user, text, timestamp, isMe } = message;

  return (
    <div
      className={`flex items-start space-x-3 max-w-2xl ${
        isMe ? "ml-auto flex-row-reverse space-x-reverse" : ""
      }`}
    >
      <div className="flex flex-col items-center shrink-0">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-9 h-9 rounded-full object-cover border border-border"
        />
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
