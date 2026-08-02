import { baseApiSlice } from "../apiSlice";

export interface NewsTagItem {
  id: number;
  name: string;
  slug: string;
}

export interface NewsData {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  content: string;
  thumbnail?: string | null;
  category:
    | "GENERAL"
    | "EXAM_TIPS"
    | "ANNOUNCEMENT"
    | "SYSTEM_UPDATE"
    | "FEATURED";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  viewsCount: number;
  authorName?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  tags: NewsTagItem[];
}

// Request Query Parameters
export interface GetNewsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
}

// Request Payload for Creating Article
export interface CreateNewsPayload {
  title: string;
  summary?: string;
  content: string;
  category:
    | "GENERAL"
    | "EXAM_TIPS"
    | "ANNOUNCEMENT"
    | "SYSTEM_UPDATE"
    | "FEATURED";
  thumbnail?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  tagIds?: string[];
}

// Request Payload for Updating Article
export interface UpdateNewsPayload {
  id: string;
  data: Partial<CreateNewsPayload>;
}

// API Response Wrapper for List
export interface GetNewsResponse {
  data: NewsData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API Response Wrapper for Single Article, Creation, & Update
export interface SingleNewsResponse {
  success: boolean;
  message?: string;
  data: NewsData;
}

// RTK Query Endpoint Injection
export const newsApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNews: builder.query<GetNewsResponse, GetNewsQueryParams | void>({
      query: (params) => ({
        url: "/news",
        method: "GET",
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
          ...(params?.search ? { search: params.search } : {}),
          ...(params?.category ? { category: params.category } : {}),
          ...(params?.status ? { status: params.status } : {}),
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "News" as const, id })),
              { type: "News", id: "LIST" },
            ]
          : [{ type: "News", id: "LIST" }],
    }),

    getNewsById: builder.query<SingleNewsResponse, string>({
      query: (id) => ({
        url: `/news/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "News", id }],
    }),

    createNew: builder.mutation<SingleNewsResponse, CreateNewsPayload>({
      query: (body) => ({
        url: "/news",
        method: "POST",
        body,
      }),
      // Refetches list queries when a new article is created
      invalidatesTags: [{ type: "News", id: "LIST" }],
    }),

    updateNews: builder.mutation<SingleNewsResponse, UpdateNewsPayload>({
      query: ({ id, data }) => ({
        url: `/news/${id}`,
        method: "PUT",
        body: data,
      }),
      // Invalidates both the specific cache entry and the list cache to maintain UI consistency
      invalidatesTags: (_result, _error, { id }) => [
        { type: "News", id },
        { type: "News", id: "LIST" },
      ],
    }),

    deleteNews: builder.mutation<
      { success: boolean; message?: string },
      string
    >({
      query: (id) => ({
        url: `/news/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "News", id },
        { type: "News", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetNewsQuery,
  useGetNewsByIdQuery,
  useCreateNewMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
} = newsApiSlice;
