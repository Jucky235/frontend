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
    <div className="p-4 bg-background-card border-t border-border-subtle">
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <input
          type="text"
          placeholder="type message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-background-input text-foreground placeholder-foreground-subtle text-xs px-4 py-3.5 rounded-xl border border-transparent focus:outline-none focus:bg-background-card focus:border-brand transition-all font-medium"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="bg-brand hover:bg-brand-hover disabled:opacity-40 text-white px-6 py-3.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer active:scale-95 shadow-md shrink-0"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

export default MessageInputBar;
