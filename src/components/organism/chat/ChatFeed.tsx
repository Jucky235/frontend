import * as React from "react";
import { Hash, MessageCircle } from "lucide-react";
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
    <section className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-background-card shadow-sm">
      {/* Header Banner */}
      <div className="flex min-h-16 items-center justify-between gap-3 border-b border-brand/15 bg-gradient-to-r from-banner-from to-banner-to px-4 py-3 text-white sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/15"><Hash className="h-4 w-4"/></span>
          <div className="min-w-0"><h2 className="truncate text-sm font-extrabold tracking-tight sm:text-base">
            {channelName}
          </h2><p className="mt-0.5 hidden truncate text-[10px] text-white/75 sm:block">Trò chuyện với học viên trong kênh cộng đồng này</p></div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-bold backdrop-blur-md sm:inline-flex">
            <MessageCircle className="h-3 w-3"/>
            Kênh cộng đồng
          </span>
          {headerAction}
        </div>
      </div>

      {/* Stream Area */}
      <div className="flex-1 space-y-4 overflow-y-auto bg-background-feed p-4 sm:p-6">
        {messages.length ? messages.map((msg) => <MessageBubble key={msg.id} message={msg} />) : <div className="grid min-h-full place-items-center py-12 text-center"><div className="max-w-xs"><span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-brand"><MessageCircle className="h-5 w-5"/></span><h3 className="mt-3 text-sm font-bold">Bắt đầu trò chuyện</h3><p className="mt-1 text-xs leading-5 text-foreground-subtle">Chào hỏi và luyện tiếng Anh cùng cộng đồng.</p></div></div>}
        {/* Invisible target element to scroll into view */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <MessageInputBar onSendMessage={onSendMessage} />
    </section>
  );
};

export default ChatFeed;
