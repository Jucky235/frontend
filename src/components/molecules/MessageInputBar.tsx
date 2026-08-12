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
    <div className="p-4 bg-white border-t border-neutral-100">
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <input
          type="text"
          placeholder="type message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-neutral-100 text-neutral-800 placeholder-neutral-400 text-xs px-4 py-3.5 rounded-xl border border-transparent focus:outline-none focus:bg-white focus:border-[#5A67FF] transition-all font-medium"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="bg-[#5A67FF] hover:bg-indigo-600 disabled:opacity-40 text-white px-6 py-3.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer active:scale-95 shadow-md shrink-0"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

export default MessageInputBar;
