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

// API Response Wrapper for Single Article
export interface GetNewsByIdResponse {
  success: boolean;
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

    getNewsById: builder.query<GetNewsByIdResponse, string>({
      query: (id) => ({
        url: `/news/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "News", id }],
    }),
  }),
});

export const { useGetNewsQuery, useGetNewsByIdQuery } = newsApiSlice;
