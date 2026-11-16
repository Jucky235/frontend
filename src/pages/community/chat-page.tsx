import * as React from "react";
import Header from "@/components/organism/common/Header";
import ChatSidebar, {
  type ChannelItem,
} from "@/components/organism/chat/ChatSidebar";
import ChatFeed from "@/components/organism/chat/ChatFeed";
import type { ChatMessage } from "@/components/molecules/MessageBubble";
import { Sparkles, RefreshCw, X, AlertCircle } from "lucide-react";

import { useSelector } from "react-redux";
// Redux & RTK Query Imports
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  setActiveChannelId,
  selectActiveChannelId,
} from "@/redux/channel/channelSlice";
import {
  useGetAllChannelsQuery,
  useGetMessagesByChannelIdQuery,
  useLazyGetChannelSummaryQuery,
} from "@/redux/channel/channelApiSlice";
import {
  useGetUserProfileQuery,
  useSendMessageMutation,
} from "@/redux/user/userApiSlice";

import { selectUserProfile } from "@/redux/user/userSlice";

export default function ChatPage() {
  const dispatch = useAppDispatch();

  // Redux Profile State
  const reduxProfile = useSelector(selectUserProfile);

  // 1. Redux State - Active Channel ID
  const selectedChannelId = useAppSelector(selectActiveChannelId);

  // 2. Local State for AI Summary Panel
  const [isSummaryPanelOpen, setIsSummaryPanelOpen] = React.useState(false);

  // 3. RTK Query Hooks
  const { data: channelsResponse, isLoading: isLoadingChannels } =
    useGetAllChannelsQuery();

  const { data: queryUserProfile } = useGetUserProfileQuery();
  const [sendMessage] = useSendMessageMutation();

  // Combine RTK Query & Redux Profile state to guarantee we get user data
  const currentUser = React.useMemo(() => {
    const raw = queryUserProfile || reduxProfile;
    return raw?.userInfo || raw || {};
  }, [queryUserProfile, reduxProfile]);

  // Lazy Query trigger for AI Summarization
  const [
    triggerSummary,
    {
      data: summaryResponse,
      isFetching: isGeneratingSummary,
      isError: isSummaryError,
      error: summaryError,
    },
  ] = useLazyGetChannelSummaryQuery();

  // Local state for temporary optimistic messages
  const [optimisticMessages, setOptimisticMessages] = React.useState<
    ChatMessage[]
  >([]);

  // Extract channels list from backend response
  const channels: ChannelItem[] = React.useMemo(() => {
    const rawChannels = channelsResponse?.data || channelsResponse || [];
    if (Array.isArray(rawChannels)) {
      return rawChannels.map((ch: any) => ({
        id: ch.id ?? ch.channelId ?? ch._id,
        name: ch.name || "Unnamed Channel",
        active: ch.isActive ?? true,
      }));
    }
    return [];
  }, [channelsResponse]);

  // Auto-select first channel from backend if none is selected or selection is invalid
  React.useEffect(() => {
    if (channels.length > 0) {
      const isValid = channels.some(
        (ch) => String(ch.id) === String(selectedChannelId),
      );
      if (!selectedChannelId || !isValid) {
        dispatch(setActiveChannelId(channels[0].id));
      }
    }
  }, [channels, selectedChannelId, dispatch]);

  // Reset panel & optimistic messages on channel change
  React.useEffect(() => {
    setOptimisticMessages([]);
    setIsSummaryPanelOpen(false);
  }, [selectedChannelId]);

  // Query Messages for CURRENT channel
  const {
    data: fetchedMessages,
    isLoading: isLoadingMessages,
    refetch: refetchMessages,
  } = useGetMessagesByChannelIdQuery(
    { channelId: selectedChannelId! },
    {
      skip: !selectedChannelId,
      pollingInterval: 3000,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  // Map fetched messages to ChatMessage interface
  const serverMessages: ChatMessage[] = React.useMemo(() => {
    const rawMessages = fetchedMessages?.data || fetchedMessages || [];
    if (!Array.isArray(rawMessages)) return [];

    const currentUserId = currentUser?.id || currentUser?.user_id;
    const currentAvatar = currentUser?.avatarUrl || currentUser?.avatar;

    return rawMessages.map((msg: any) => {
      const senderId = msg.sender?.id ?? msg.userId ?? msg.senderId;
      const isMe = Boolean(
        senderId && currentUserId && String(senderId) === String(currentUserId),
      );

      // Extract sender's avatar URL. If message is sent by current logged in user, use current user avatar as fallback.
      const senderAvatar =
        msg.sender?.avatarUrl ||
        msg.sender?.avatar ||
        msg.user?.avatarUrl ||
        msg.user?.avatar ||
        msg.avatarUrl ||
        (isMe ? currentAvatar : undefined);

      return {
        id: msg.id || msg._id || Math.random(),
        user: {
          name:
            msg.sender?.name ||
            msg.sender?.username ||
            msg.user?.name ||
            msg.senderName ||
            (isMe ? "Me" : "User"),
          avatar: senderAvatar, // Maps to avatar
          avatarUrl: senderAvatar, // Maps to avatarUrl
        },
        text: msg.content || msg.text || "",
        timestamp: msg.createdAt
          ? new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : msg.timestamp || "",
        isMe,
      };
    });
  }, [fetchedMessages, currentUser]);

  // Combine server messages with unsaved optimistic messages
  const allMessages = React.useMemo(() => {
    const serverMessageIds = new Set(
      serverMessages.map((msg) => String(msg.id)),
    );

    const pendingOptimistic = optimisticMessages.filter(
      (optMsg) => !serverMessageIds.has(String(optMsg.id)),
    );

    return [...serverMessages, ...pendingOptimistic];
  }, [serverMessages, optimisticMessages]);

  React.useEffect(() => {
    if (optimisticMessages.length > 0 && serverMessages.length > 0) {
      setOptimisticMessages([]);
    }
  }, [serverMessages]);

  // Handlers
  const handleSelectChannel = (id: string) => {
    dispatch(setActiveChannelId(id));
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !selectedChannelId) return;

    const myName = currentUser?.name || currentUser?.email || "Me";
    const myAvatarUrl = currentUser?.avatarUrl || currentUser?.avatar;

    const tempMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      user: {
        name: myName,
        avatar: myAvatarUrl,
        avatarUrl: myAvatarUrl,
      },
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      isMe: true,
    };

    setOptimisticMessages((prev) => [...prev, tempMsg]);

    try {
      await sendMessage({
        channelId: selectedChannelId,
        content: text,
      }).unwrap();

      await refetchMessages();
    } catch (error: any) {
      console.error("Failed to send message:", error);
      setOptimisticMessages((prev) =>
        prev.filter((msg) => msg.id !== tempMsg.id),
      );
    }
  };

  // Trigger AI Summary only for currently active channel
  const handleFetchSummary = () => {
    if (!selectedChannelId) return;

    setIsSummaryPanelOpen(true);
    triggerSummary({ channelId: selectedChannelId, limit: 50 });
  };

  const currentChannelName =
    channels.find((ch) => String(ch.id) === String(selectedChannelId))?.name ||
    "";

  // Check if current summary result matches current channel
  const isSummaryForCurrentChannel =
    summaryResponse?.data?.channelId === selectedChannelId;

  const summaryContent = isSummaryForCurrentChannel
    ? summaryResponse?.data?.summary
    : null;

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground lg:h-screen lg:overflow-hidden">
      <Header />

      <main className="mx-auto flex min-h-0 w-full max-w-[1500px] flex-1 flex-col gap-3 px-3 py-3 lg:h-[calc(100vh-4rem)] lg:flex-row lg:gap-4 lg:px-5 lg:py-4">
        {/* Left: Chat Sidebar */}
        <ChatSidebar
          channels={isLoadingChannels ? [] : channels}
          directMessages={[]}
          selectedChannel={String(selectedChannelId || "")}
          onSelectChannel={handleSelectChannel}
        />

        {/* Center: Main Chat Feed */}
        <div className="flex min-h-[55vh] min-w-0 flex-1 flex-col overflow-hidden lg:min-h-0">
          <ChatFeed
            channelName={currentChannelName}
            messages={isLoadingMessages ? [] : allMessages}
            onSendMessage={handleSendMessage}
            headerAction={
              selectedChannelId && (
                <button
                  onClick={handleFetchSummary}
                  className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-[10px] font-bold text-white shadow-sm backdrop-blur transition hover:bg-white/25"
                  title={`Summarize #${currentChannelName} with AI`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Tóm tắt bằng AI</span>
                </button>
              )
            }
          />
        </div>

        {/* Right: AI Summary Panel */}
        {isSummaryPanelOpen && (
          <aside className="flex max-h-72 w-full shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-background-card shadow-sm transition-all duration-300 lg:max-h-none lg:w-80">
            {/* Panel Header */}
            <div className="flex items-center justify-between border-b border-border bg-background-hover/60 p-4">
              <div className="flex items-center gap-2 overflow-hidden">
                <Sparkles className="h-4 w-4 shrink-0 text-brand" />
                <h3 className="truncate text-sm font-semibold text-foreground">
                  Tóm tắt bằng AI · #{currentChannelName}
                </h3>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={handleFetchSummary}
                  disabled={isGeneratingSummary}
                  className="p-1.5 text-foreground-muted hover:text-foreground rounded-md hover:bg-background-hover transition-colors disabled:opacity-50"
                  title="Làm mới bản tóm tắt"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${
                      isGeneratingSummary ? "animate-spin text-brand" : ""
                    }`}
                  />
                </button>
                <button
                  onClick={() => setIsSummaryPanelOpen(false)}
                  aria-label="Đóng phần tóm tắt"
                  className="rounded-md p-1.5 text-foreground-muted transition-colors hover:bg-background-hover hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Panel Content Body */}
            <div className="flex-1 overflow-y-auto p-4 text-sm leading-relaxed text-foreground-muted">
              {isGeneratingSummary ? (
                <div className="h-full flex flex-col items-center justify-center gap-3 text-foreground-subtle py-12">
                  <RefreshCw className="h-6 w-6 animate-spin text-brand" />
                  <p className="text-xs font-medium text-foreground-muted">
                    Đọc tin nhắn gần đây trong #{currentChannelName}…
                  </p>
                </div>
              ) : isSummaryError ? (
                <div className="p-3 bg-status-danger-bg border border-status-danger/30 rounded-xl flex items-start gap-2 text-status-danger text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    {(summaryError as any)?.data?.error ||
                      "We couldn’t create a summary right now."}
                  </span>
                </div>
              ) : summaryContent ? (
                <div className="whitespace-pre-wrap font-sans space-y-2 text-foreground">
                  {summaryContent}
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-foreground-subtle">
                  Chọn tóm tắt AI để xem các ý chính của kênh này.
                </div>
              )}
            </div>
          </aside>
        )}
      </main>
    </div>
  );
}
