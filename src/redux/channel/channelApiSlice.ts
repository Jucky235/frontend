import { baseApiSlice } from "../apiSlice";

export type ChannelStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

export interface Channel {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  status: ChannelStatus;
  createdAt: string;
  updatedAt: string;
  _count?: {
    messages: number;
  };
}

export interface UserSender {
  id: string;
  name: string;
  email: string;
  role?: {
    id: string;
    name: string;
  };
}

export interface ChatMessage {
  id: string;
  channelId: string;
  content: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  sender: UserSender;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetMessagesResponse {
  data: ChatMessage[];
  pagination: PaginationInfo;
}

export interface GetMessagesQueryParams {
  channelId: string;
  page?: number;
  limit?: number;
}

export const channelApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🟢 1. Lấy danh sách tất cả Channels
    getAllChannels: builder.query<
      { data: Channel[] },
      { status?: ChannelStatus; search?: string } | void
    >({
      query: (params) => ({
        url: "/channels",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "Channel" as const,
                id,
              })),
              { type: "Channel", id: "LIST" },
            ]
          : [{ type: "Channel", id: "LIST" }],
    }),

    // 🟢 2. Lấy thông tin chi tiết 1 Channel theo ID
    getChannelById: builder.query<{ data: Channel }, string>({
      query: (id) => ({
        url: `/channels/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Channel", id }],
    }),

    // 🟢 3. Lấy tất cả tin nhắn theo Channel ID
    getMessagesByChannelId: builder.query<
      GetMessagesResponse,
      GetMessagesQueryParams
    >({
      query: ({ channelId, page = 1, limit = 50 }) => ({
        url: `/channels/${channelId}/messages`,
        method: "GET",
        params: { page, limit },
      }),
      providesTags: (_result, _error, { channelId }) => [
        { type: "Message", id: channelId },
      ],
    }),
  }),
});

export const {
  useGetAllChannelsQuery,
  useGetChannelByIdQuery,
  useGetMessagesByChannelIdQuery,
} = channelApiSlice;
