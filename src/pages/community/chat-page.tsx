import * as React from "react";
import Header from "@/components/organism/common/Header";
import ChatSidebar, {
  type ChannelItem,
} from "@/components/organism/chat/ChatSidebar";
import ChatFeed from "@/components/organism/chat/ChatFeed";
import type { ChatMessage } from "@/components/molecules/MessageBubble";

// Redux & RTK Query Imports
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  setActiveChannelId,
  selectActiveChannelId,
} from "@/redux/channel/channelSlice";
import {
  useGetAllChannelsQuery,
  useGetMessagesByChannelIdQuery,
} from "@/redux/channel/channelApiSlice";
import {
  useGetUserProfileQuery,
  useSendMessageMutation,
} from "@/redux/user/userApiSlice";

export default function ChatPage() {
  const dispatch = useAppDispatch();

  // 1. Redux State
  const selectedChannelId = useAppSelector(selectActiveChannelId);

  // 2. RTK Query Hooks
  const { data: channelsResponse, isLoading: isLoadingChannels } =
    useGetAllChannelsQuery();

  const { data: currentUserProfile } = useGetUserProfileQuery();
  const [sendMessage] = useSendMessageMutation();

  // 3. Extract channels list from backend response
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

  // 4. Auto-select first channel from backend if none is selected or selection is invalid
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

  // 5. Query Messages for current channel
  const {
    data: fetchedMessages,
    isLoading: isLoadingMessages,
    isFetching: isFetchingMessages,
    isError: isMessagesError,
    error: messagesError,
    status: messagesQueryStatus,
  } = useGetMessagesByChannelIdQuery(
    { channelId: selectedChannelId! },
    { skip: !selectedChannelId },
  );

  // DEBUG: Deep log for Messages Query
  React.useEffect(() => {
    if (selectedChannelId) {
      console.group(`💬 [DEBUG] Messages Query Status: ${messagesQueryStatus}`);
      console.log("Channel ID:", selectedChannelId);
      console.log("isLoading:", isLoadingMessages);
      console.log("isFetching:", isFetchingMessages);
      console.log("isError:", isMessagesError);
      console.log("Raw fetchedMessages:", fetchedMessages);

      if (messagesError) {
        console.error("❌ Messages Fetch Error Object:", messagesError);
      }
      console.groupEnd();
    }
  }, [
    selectedChannelId,
    fetchedMessages,
    messagesError,
    isLoadingMessages,
    isFetchingMessages,
    isMessagesError,
    messagesQueryStatus,
  ]);

  // 6. Map fetched messages to ChatMessage interface
  const messages: ChatMessage[] = React.useMemo(() => {
    const rawMessages = fetchedMessages?.data || fetchedMessages || [];
    if (!Array.isArray(rawMessages)) return [];

    return rawMessages.map((msg: any) => ({
      id: msg.id,
      user: {
        name:
          msg.sender?.username ||
          msg.sender?.name ||
          msg.user?.name ||
          msg.senderName ||
          "Unknown",
        avatar:
          msg.sender?.avatarUrl || msg.user?.avatar || msg.avatarUrl || "",
      },
      text: msg.content || msg.text || "",
      timestamp: msg.createdAt
        ? new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        : msg.timestamp || "",
      isMe:
        msg.sender?.id === currentUserProfile?.id ||
        msg.userId === currentUserProfile?.id,
    }));
  }, [fetchedMessages, currentUserProfile]);

  // 7. Handlers
  const handleSelectChannel = (id: string) => {
    dispatch(setActiveChannelId(id));
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !selectedChannelId) return;

    const payload = {
      channelId: selectedChannelId,
      content: text,
    };

    try {
      await sendMessage(payload).unwrap();
    } catch (error: any) {
      console.error("Failed to send message:", error);
    }
  };

  const currentChannelName =
    channels.find((ch) => String(ch.id) === String(selectedChannelId))?.name ||
    "";

  return (
    <div className="h-screen w-full bg-neutral-50 font-inter flex flex-col overflow-hidden select-none">
      <Header />

      <div className="flex-1 max-w-7xl w-full mx-auto p-4 flex gap-4 overflow-hidden h-[calc(100vh-4rem)]">
        <ChatSidebar
          channels={isLoadingChannels ? [] : channels}
          directMessages={[]}
          selectedChannel={String(selectedChannelId || "")}
          onSelectChannel={handleSelectChannel}
        />

        <ChatFeed
          channelName={currentChannelName}
          messages={isLoadingMessages ? [] : messages}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}
