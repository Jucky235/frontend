import * as React from "react";
import { Hash } from "lucide-react";
import MessageBubble, {
  type ChatMessage,
} from "@/components/molecules/MessageBubble";
import MessageInputBar from "@/components/molecules/MessageInputBar";

export interface ChatFeedProps {
  channelName: string;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
}

export const ChatFeed: React.FC<ChatFeedProps> = ({
  channelName,
  messages,
  onSendMessage,
}) => {
  return (
    <section className="flex-1 bg-white border border-neutral-200/80 rounded-2xl flex flex-col justify-between overflow-hidden shadow-xs relative">
      {/* Header Banner */}
      <div className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between border-b border-indigo-700/20">
        <div className="flex items-center space-x-2">
          <Hash className="w-5 h-5 opacity-80" />
          <h2 className="text-base font-extrabold tracking-tight">
            {channelName}
          </h2>
        </div>
        <span className="text-xs bg-white/20 font-bold px-3 py-1 rounded-full backdrop-blur-md">
          Community Channel
        </span>
      </div>

      {/* Stream Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-neutral-50/50">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>

      {/* Input Bar */}
      <MessageInputBar onSendMessage={onSendMessage} />
    </section>
  );
};

export default ChatFeed;
