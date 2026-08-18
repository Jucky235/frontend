import * as React from "react";
import { MessageSquare, Users, Mail, Hash, Plus } from "lucide-react";
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
    <aside className="w-64 bg-background-card border border-border/80 rounded-2xl flex flex-col justify-between overflow-y-auto shrink-0 py-4 text-xs font-semibold shadow-xs">
      <div className="space-y-6">
        {/* CHANNELS SECTION */}
        <div className="space-y-1">
          <div className="px-6 flex items-center space-x-2 text-foreground-subtle font-bold uppercase tracking-wider text-[11px] mb-2">
            <span>CHANNELS</span>
            <MessageSquare className="w-3.5 h-3.5 text-foreground-subtle" />
          </div>

          {channels.map((ch) => (
            <ChannelButton
              key={ch.id}
              id={ch.id}
              name={ch.name}
              activeIndicator={ch.active}
              isSelected={selectedChannel === ch.id}
              onSelect={onSelectChannel}
            />
          ))}

          <button className="w-full px-6 py-2 flex items-center space-x-3 text-foreground-subtle hover:text-foreground transition-colors cursor-pointer">
            <div className="w-6 h-6 rounded bg-background-hover flex items-center justify-center">
              <Plus className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-sm">join channel</span>
          </button>
        </div>

        {/* TEAM SECTION */}
        <div className="space-y-1">
          <div className="px-6 flex items-center space-x-2 text-foreground-subtle font-bold uppercase tracking-wider text-[11px] mb-2">
            <span>TEAM</span>
            <Users className="w-3.5 h-3.5" />
          </div>

          <button className="w-full px-6 py-2 flex items-center space-x-3 text-foreground hover:bg-background-hover transition-colors cursor-pointer">
            <div className="w-6 h-6 rounded bg-background-hover flex items-center justify-center text-foreground-muted">
              <Hash className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-sm">Maesre</span>
          </button>
        </div>

        {/* DIRECT MESSAGES SECTION */}
        <div className="space-y-1">
          <div className="px-6 flex items-center space-x-2 text-foreground-subtle font-bold uppercase tracking-wider text-[11px] mb-2">
            <span>DIRECT MESSAGES</span>
            <Mail className="w-3.5 h-3.5" />
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
