import * as React from "react";
import {
  MessageSquare,
  Hash,
  Plus,
  Users,
  Mail,
  ChevronRight,
  Send,
} from "lucide-react";
import Header from "@/components/organism/common/Header";

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

export interface ChannelItem {
  id: string;
  name: string;
  active?: boolean;
}

export interface DirectMessageUser {
  id: string;
  name: string;
  avatar: string;
  online?: boolean;
}

const CHANNELS: ChannelItem[] = [
  { id: "lazer", name: "lazer", active: true },
  { id: "lobby", name: "lobby", active: true },
  { id: "osu", name: "osu" },
];

const DIRECT_MESSAGES: DirectMessageUser[] = [
  {
    id: "hukachi113",
    name: "hukachi113",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    online: true,
  },
  {
    id: "TrungNe0909",
    name: "TrungNe0909",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150",
    online: true,
  },
  {
    id: "Take",
    name: "Take",
    avatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: "Tillerino",
    name: "Tillerino",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: "BanchoBot",
    name: "BanchoBot",
    avatar:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: "TranquilSilence",
    name: "TranquilSilence",
    avatar:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=150",
  },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    user: {
      name: "[-Name-]",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    },
    text: "maw",
    timestamp: "22:56",
  },
  {
    id: 2,
    user: {
      name: "FERNAAAA...",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    },
    text: "and u have an answer or pushing?",
    timestamp: "22:56",
  },
  {
    id: 3,
    user: {
      name: "WastingSp...",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150",
    },
    text: "playing maps you can barely A rank",
    timestamp: "22:56",
  },
  {
    id: 4,
    user: {
      name: "Agigoose",
      avatar:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150",
    },
    text: "lol",
    timestamp: "22:56",
  },
  {
    id: 5,
    user: {
      name: "FERNAAAA...",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    },
    text: "alright",
    timestamp: "22:56",
  },
  {
    id: 6,
    user: {
      name: "Agigoose",
      avatar:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150",
    },
    text: "mmmrrowww.",
    timestamp: "22:56",
  },
  {
    id: 7,
    user: {
      name: "FERNAAAA...",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    },
    text: "also how do u place ur wrist while playing",
    timestamp: "22:57",
  },
  {
    id: 8,
    user: {
      name: "WastingSp...",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150",
    },
    text: "i use homerow on the keyboard and rest the bottom of my palm on the edge of my desk.",
    timestamp: "22:57",
  },
];

export default function ChatPage() {
  const [messages, setMessages] =
    React.useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = React.value ?? React.useState("");
  const [selectedChannel, setSelectedChannel] = React.useState("osu");

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      user: {
        name: "You",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      },
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      isMe: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
  };

  return (
    <div className="h-screen w-full bg-neutral-50 font-inter flex flex-col overflow-hidden select-none">
      <Header />

      {/* Main Workspace Frame */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 flex gap-4 overflow-hidden h-[calc(100vh-4rem)]">
        {/* Left Navigation Sidebar */}
        <aside className="w-64 bg-white border border-neutral-200/80 rounded-2xl flex flex-col justify-between overflow-y-auto shrink-0 py-4 text-xs font-semibold shadow-xs">
          <div className="space-y-6">
            {/* CHANNELS SECTION */}
            <div className="space-y-1">
              <div className="px-6 flex items-center space-x-2 text-neutral-400 font-bold uppercase tracking-wider text-[11px] mb-2">
                <span>CHANNELS</span>
                <MessageSquare className="w-3.5 h-3.5 text-neutral-400" />
              </div>

              {CHANNELS.map((ch) => {
                const isSelected = selectedChannel === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setSelectedChannel(ch.id)}
                    className={`w-full px-6 py-2 flex items-center justify-between transition-colors relative cursor-pointer ${
                      isSelected
                        ? "bg-indigo-50/80 text-[#5A67FF]"
                        : "hover:bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Active green indicator bar */}
                      {ch.active && (
                        <span className="absolute left-2 w-1 h-3.5 bg-emerald-500 rounded-full" />
                      )}
                      <div
                        className={`w-6 h-6 rounded flex items-center justify-center ${
                          isSelected
                            ? "bg-[#5A67FF] text-white"
                            : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        <Hash className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-extrabold text-sm">#{ch.name}</span>
                    </div>

                    {isSelected && (
                      <ChevronRight className="w-4 h-4 text-[#5A67FF]" />
                    )}
                  </button>
                );
              })}

              {/* Join Channel Button */}
              <button className="w-full px-6 py-2 flex items-center space-x-3 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer">
                <div className="w-6 h-6 rounded bg-neutral-100 flex items-center justify-center">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                <span className="font-extrabold text-sm">join channel</span>
              </button>
            </div>

            {/* TEAM SECTION */}
            <div className="space-y-1">
              <div className="px-6 flex items-center space-x-2 text-neutral-400 font-bold uppercase tracking-wider text-[11px] mb-2">
                <span>TEAM</span>
                <Users className="w-3.5 h-3.5" />
              </div>

              <button className="w-full px-6 py-2 flex items-center space-x-3 text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer">
                <div className="w-6 h-6 rounded bg-neutral-100 flex items-center justify-center text-neutral-500">
                  <Hash className="w-3.5 h-3.5" />
                </div>
                <span className="font-extrabold text-sm">Maesre</span>
              </button>
            </div>

            {/* DIRECT MESSAGES SECTION */}
            <div className="space-y-1">
              <div className="px-6 flex items-center space-x-2 text-neutral-400 font-bold uppercase tracking-wider text-[11px] mb-2">
                <span>DIRECT MESSAGES</span>
                <Mail className="w-3.5 h-3.5" />
              </div>

              {DIRECT_MESSAGES.map((user) => (
                <button
                  key={user.id}
                  className="w-full px-6 py-1.5 flex items-center space-x-3 text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <div className="relative shrink-0">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-6 h-6 rounded-full object-cover border border-neutral-200"
                    />
                    {user.online && (
                      <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-white" />
                    )}
                  </div>
                  <span className="font-bold text-xs truncate">
                    {user.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Section: Main Chat Feed */}
        <section className="flex-1 bg-white border border-neutral-200/80 rounded-2xl flex flex-col justify-between overflow-hidden shadow-xs relative">
          {/* Channel Header Banner */}
          <div className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between border-b border-indigo-700/20">
            <div className="flex items-center space-x-2">
              <Hash className="w-5 h-5 opacity-80" />
              <h2 className="text-base font-extrabold tracking-tight">
                {selectedChannel}
              </h2>
            </div>
            <span className="text-xs bg-white/20 font-bold px-3 py-1 rounded-full backdrop-blur-md">
              Community Channel
            </span>
          </div>

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-neutral-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 max-w-2xl ${
                  msg.isMe ? "ml-auto flex-row-reverse space-x-reverse" : ""
                }`}
              >
                {/* User Avatar */}
                <div className="flex flex-col items-center shrink-0">
                  <img
                    src={msg.user.avatar}
                    alt={msg.user.name}
                    className="w-9 h-9 rounded-full object-cover border border-neutral-200"
                  />
                  <span className="text-[10px] text-neutral-400 mt-1 max-w-[60px] truncate font-semibold">
                    {msg.user.name}
                  </span>
                </div>

                {/* Message Bubble Card */}
                <div
                  className={`border px-4 py-2.5 rounded-2xl space-y-1 shadow-xs max-w-xl ${
                    msg.isMe
                      ? "bg-[#5A67FF] text-white border-[#5A67FF] rounded-tr-xs"
                      : "bg-white text-neutral-800 border-neutral-200/80 rounded-tl-xs"
                  }`}
                >
                  <p className="text-xs font-medium leading-relaxed">
                    {msg.text}
                  </p>
                  <div
                    className={`text-[10px] font-semibold text-right ${
                      msg.isMe ? "text-indigo-200" : "text-neutral-400"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Message Input Bar */}
          <div className="p-4 bg-white border-t border-neutral-100">
            <form
              onSubmit={handleSendMessage}
              className="flex items-center space-x-3"
            >
              {/* Input Field */}
              <input
                type="text"
                placeholder="type message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-neutral-100 text-neutral-800 placeholder-neutral-400 text-xs px-4 py-3.5 rounded-xl border border-transparent focus:outline-none focus:bg-white focus:border-[#5A67FF] transition-all font-medium"
              />

              {/* Accent Indigo Send Button */}
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
        </section>
      </div>
    </div>
  );
}
