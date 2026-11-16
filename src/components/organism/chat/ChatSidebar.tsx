import * as React from "react";
import { MessageSquare, Users, Mail, Hash, Plus, Search } from "lucide-react";
import ChannelButton from "@/components/atoms/ChannelButton";
import DirectMessageButton, {
  type DirectMessageUser,
} from "@/components/atoms/DirectMessageButton";

export interface ChannelItem {
  id: string;
  name: string;
  active?: boolean;
}

export interface ChatSidebarProps {
  channels: ChannelItem[];
  directMessages: DirectMessageUser[];
  selectedChannel: string;
  onSelectChannel: (id: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  channels,
  directMessages,
  selectedChannel,
  onSelectChannel,
}) => {
  return (
    <aside className="flex max-h-36 w-full shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-background-card py-3 text-xs font-semibold shadow-sm lg:max-h-none lg:w-64 lg:py-4">
      <div className="flex min-h-0 flex-1 flex-col gap-2 lg:gap-6">
        {/* CHANNELS SECTION */}
        <div className="min-w-0 lg:space-y-1">
          <div className="mb-2 flex items-center justify-between px-4 text-[9px] font-bold uppercase tracking-[0.14em] text-foreground-subtle lg:px-5 lg:text-[10px]">
            <span>Các kênh cộng đồng</span>
            <div className="flex items-center gap-2"><MessageSquare className="h-3.5 w-3.5"/><Search className="hidden h-3.5 w-3.5 lg:block"/></div>
          </div>

          <div className="flex gap-1.5 overflow-x-auto px-2 pb-1 lg:flex-col lg:gap-1 lg:overflow-x-visible lg:overflow-y-auto lg:px-0 lg:pb-0">
            {channels.map((ch) => <ChannelButton key={ch.id} id={ch.id} name={ch.name} activeIndicator={ch.active} isSelected={selectedChannel === ch.id} onSelect={onSelectChannel} />)}
            {!channels.length && <p className="px-3 py-2 text-[10px] text-foreground-subtle lg:px-5">Không có kênh nào.</p>}
          </div>

          <button type="button" className="hidden w-full cursor-pointer items-center gap-3 px-5 py-2 text-foreground-subtle transition-colors hover:text-brand lg:flex">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-background-hover"><Plus className="h-3.5 w-3.5"/></span><span className="text-xs font-bold">Tham gia kênh</span>
          </button>
        </div>

        {/* TEAM SECTION */}
        <div className="hidden space-y-1 lg:block">
          <div className="mb-2 flex items-center gap-2 px-5 text-[10px] font-bold uppercase tracking-[0.14em] text-foreground-subtle">
            <span>Nhóm học tập</span><Users className="h-3.5 w-3.5"/>
          </div>

          <button type="button" className="flex w-full cursor-pointer items-center gap-3 px-5 py-2 text-foreground transition-colors hover:bg-background-hover">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-background-hover text-foreground-muted"><Hash className="h-3.5 w-3.5"/></span><span className="text-xs font-bold">Thành viên</span>
          </button>
        </div>

        {/* DIRECT MESSAGES SECTION */}
        <div className="hidden space-y-1 lg:block">
          <div className="mb-2 flex items-center gap-2 px-5 text-[10px] font-bold uppercase tracking-[0.14em] text-foreground-subtle">
            <span>Tin nhắn riêng</span><Mail className="h-3.5 w-3.5"/>
          </div>

          {directMessages.map((user) => (
            <DirectMessageButton key={user.id} user={user} />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default ChatSidebar;
