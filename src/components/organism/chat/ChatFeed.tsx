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
  headerAction?: React.ReactNode;
}

export const ChatFeed: React.FC<ChatFeedProps> = ({
  channelName,
  messages,
  onSendMessage,
  headerAction,
}) => {
  // 1. Ref for the scroll anchor target
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  // 2. Helper function to scroll to bottom smoothly
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 3. Auto-scroll whenever messages list updates or active channel changes
  React.useEffect(() => {
    scrollToBottom();
  }, [messages, channelName]);

  return (
    <section className="flex-1 bg-background-card border border-border/80 rounded-2xl flex flex-col justify-between overflow-hidden shadow-xs relative">
      {/* Header Banner */}
      <div className="px-6 py-3.5 bg-gradient-to-r from-banner-from to-banner-to text-white flex items-center justify-between border-b border-banner-border/20">
        <div className="flex items-center space-x-2 min-w-0">
          <Hash className="w-5 h-5 opacity-80 shrink-0" />
          <h2 className="text-base font-extrabold tracking-tight truncate">
            {channelName}
          </h2>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs bg-white/20 font-bold px-3 py-1 rounded-full backdrop-blur-md">
            Community Channel
          </span>
          {headerAction}
        </div>
      </div>

      {/* Stream Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-background-feed">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {/* Invisible target element to scroll into view */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <MessageInputBar onSendMessage={onSendMessage} />
    </section>
  );
};

export default ChatFeed;
