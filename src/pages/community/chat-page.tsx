import * as React from "react";
import Header from "@/components/organism/common/Header";
import ChatSidebar, {
  type ChannelItem,
} from "@/components/organism/chat/ChatSidebar";
import ChatFeed from "@/components/organism/chat/ChatFeed";
import type { ChatMessage } from "@/components/molecules/MessageBubble";
import { Sparkles, RefreshCw, X, AlertCircle } from "lucide-react";

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

export default function ChatPage() {
  const dispatch = useAppDispatch();

  // 1. Redux State - Active Channel ID
  const selectedChannelId = useAppSelector(selectActiveChannelId);

  // 2. Local State for AI Summary Panel
  const [isSummaryPanelOpen, setIsSummaryPanelOpen] = React.useState(false);

  // 3. RTK Query Hooks
  const { data: channelsResponse, isLoading: isLoadingChannels } =
    useGetAllChannelsQuery();

  const { data: currentUserProfile } = useGetUserProfileQuery();
  const [sendMessage] = useSendMessageMutation();

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
    setIsSummaryPanelOpen(false); // Close AI panel when user switches channel
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

    return rawMessages.map((msg: any) => {
      const senderId = msg.sender?.id ?? msg.userId;
      const currentUserId = currentUserProfile?.id;

      return {
        id: msg.id || msg._id || Math.random(),
        user: {
          name:
            msg.sender?.name ||
            msg.sender?.username ||
            msg.user?.name ||
            msg.senderName ||
            "Me",
          avatar:
            msg.sender?.avatarUrl ||
            msg.user?.avatar ||
            msg.avatarUrl ||
            "https://api.dicebear.com/7.x/bottts/svg?seed=User",
        },
        text: msg.content || msg.text || "",
        timestamp: msg.createdAt
          ? new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : msg.timestamp || "",
        isMe: Boolean(
          senderId &&
          currentUserId &&
          String(senderId) === String(currentUserId),
        ),
      };
    });
  }, [fetchedMessages, currentUserProfile]);

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

    const tempMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      user: {
        name: currentUserProfile?.name || currentUserProfile?.email || "Me",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=User",
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
    <div className="h-screen w-full bg-background text-foreground flex flex-col overflow-hidden select-none">
      <Header />

      <div className="flex-1 max-w-7xl w-full mx-auto p-4 flex gap-4 overflow-hidden h-[calc(100vh-4rem)]">
        {/* Left: Chat Sidebar */}
        <ChatSidebar
          channels={isLoadingChannels ? [] : channels}
          directMessages={[]}
          selectedChannel={String(selectedChannelId || "")}
          onSelectChannel={handleSelectChannel}
        />

        {/* Center: Main Chat Feed */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatFeed
            channelName={currentChannelName}
            messages={isLoadingMessages ? [] : allMessages}
            onSendMessage={handleSendMessage}
            headerAction={
              selectedChannelId && (
                <button
                  onClick={handleFetchSummary}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-white hover:bg-indigo-50 rounded-lg transition-colors shadow-sm cursor-pointer shrink-0 dark:bg-white dark:text-indigo-600 dark:hover:bg-indigo-50"
                  title={`Tóm tắt #${currentChannelName}`}
                >
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Tóm tắt AI</span>
                </button>
              )
            }
          />
        </div>

        {/* Right: AI Summary Panel */}
        {isSummaryPanelOpen && (
          <aside className="w-80 bg-background-card border border-border/80 rounded-2xl flex flex-col overflow-hidden shadow-xs transition-all duration-300 shrink-0">
            {/* Panel Header */}
            <div className="p-4 border-b border-border/80 flex items-center justify-between bg-background-subtle-hover/80">
              <div className="flex items-center gap-2 overflow-hidden">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <h3 className="text-sm font-semibold text-foreground truncate">
                  Tóm tắt #{currentChannelName}
                </h3>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={handleFetchSummary}
                  disabled={isGeneratingSummary}
                  className="p-1.5 text-foreground-muted hover:text-foreground rounded-md hover:bg-background-hover transition-colors disabled:opacity-50"
                  title="Tải lại tóm tắt"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${
                      isGeneratingSummary ? "animate-spin text-indigo-600" : ""
                    }`}
                  />
                </button>
                <button
                  onClick={() => setIsSummaryPanelOpen(false)}
                  className="p-1.5 text-foreground-muted hover:text-foreground rounded-md hover:bg-background-hover transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Panel Content Body */}
            <div className="flex-1 p-4 overflow-y-auto text-sm text-foreground-muted leading-relaxed">
              {isGeneratingSummary ? (
                <div className="h-full flex flex-col items-center justify-center gap-3 text-foreground-subtle py-12">
                  <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
                  <p className="text-xs font-medium text-foreground-muted">
                    Đang đọc tin nhắn kênh #{currentChannelName}...
                  </p>
                </div>
              ) : isSummaryError ? (
                <div className="p-3 bg-status-danger-bg border border-status-danger/30 rounded-xl flex items-start gap-2 text-status-danger text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    {(summaryError as any)?.data?.error ||
                      "Không thể tạo tóm tắt lúc này."}
                  </span>
                </div>
              ) : summaryContent ? (
                <div className="whitespace-pre-wrap font-sans space-y-2 text-foreground">
                  {summaryContent}
                </div>
              ) : (
                <div className="text-center py-12 text-foreground-subtle text-xs">
                  Nhấn "Tóm tắt AI" để xem tổng hợp kênh này.
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
