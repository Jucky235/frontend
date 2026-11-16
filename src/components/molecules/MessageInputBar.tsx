import * as React from "react";
import { Send } from "lucide-react";

export interface MessageInputBarProps {
  onSendMessage: (text: string) => void;
}

export const MessageInputBar: React.FC<MessageInputBarProps> = ({
  onSendMessage,
}) => {
  const [inputText, setInputText] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText("");
  };

  return (
    <div className="border-t border-border bg-background-card p-3 sm:p-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
        <input
          type="text"
          aria-label="Viết tin nhắn"
          placeholder="Viết tin nhắn..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="h-12 min-w-0 flex-1 rounded-xl border border-transparent bg-background-hover/70 px-4 text-xs font-medium text-foreground outline-none transition placeholder:text-foreground-subtle focus:border-brand/40 focus:bg-background focus:ring-4 focus:ring-brand/10"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="flex h-12 shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-brand px-4 text-xs font-bold text-brand-foreground shadow-sm shadow-brand/20 transition hover:bg-brand-hover active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 sm:px-5"
        >
          <span className="hidden sm:inline">Gửi</span>
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

export default MessageInputBar;
