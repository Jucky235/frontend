import { baseApiSlice } from "../apiSlice";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    posts: number;
  };
}

export interface PostAuthor {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  role?: {
    id: string;
    name: string;
  };
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  parentId?: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: PostAuthor;
  replies?: Comment[];
}

export interface ForumPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  categoryId: string;
  authorId: string;
  attachments?: string[];
  upvotesCount: number;
  downvotesCount: number;
  commentsCount: number;
  isSaved?: boolean;
  userVote?: "UPVOTE" | "DOWNVOTE" | null;
  createdAt: string;
  updatedAt: string;
  author: PostAuthor;
  category: Category;
  comments?: Comment[];
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetPostsResponse {
  data: ForumPost[];
  pagination: PaginationInfo;
}

export interface GetPostsQueryParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  sortBy?: "hot" | "top" | "new";
  search?: string;
}

export interface CreatePostPayload {
  title: string;
  slug: string;
  content: string;
  categoryId: string;
  attachments?: string[];
}

export interface VotePostPayload {
  postId: string;
  type: "UPVOTE" | "DOWNVOTE";
}

export interface CreateCommentPayload {
  postId: string;
  content: string;
  parentId?: string;
}

export const forumApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🟢 1. Lấy danh sách tất cả Categories
    getAllCategories: builder.query<Category[], void>({
      query: () => ({
        url: "/forum/categories",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Category" as const,
                id,
              })),
              { type: "Category", id: "LIST" },
            ]
          : [{ type: "Category", id: "LIST" }],
    }),

    // 🟢 2. Lấy danh sách Posts (Phân trang, Filter, Sort, Search)
    getAllPosts: builder.query<GetPostsResponse, GetPostsQueryParams | void>({
      query: (params) => ({
        url: "/forum/posts",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "Post" as const,
                id,
              })),
              { type: "Post", id: "LIST" },
            ]
          : [{ type: "Post", id: "LIST" }],
    }),

    // 🟢 3. Lấy chi tiết 1 Post kèm Comments
    getPostById: builder.query<ForumPost, string>({
      query: (id) => ({
        url: `/forum/posts/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Post", id }],
    }),

    // 🟡 4. Tạo Bài Viết Mới
    createPost: builder.mutation<
      { message: string; data: ForumPost },
      CreatePostPayload
    >({
      query: (body) => ({
        url: "/forum/posts",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),

    // 🟡 5. Vote Bài Viết
    votePost: builder.mutation<
      { message: string; data: ForumPost },
      VotePostPayload
    >({
      query: ({ postId, type }) => ({
        url: `/forum/posts/${postId}/vote`,
        method: "POST",
        body: { type },
      }),
      invalidatesTags: (_result, _error, { postId }) => [
        { type: "Post", id: postId },
        { type: "Post", id: "LIST" },
      ],
    }),

    // 🟡 6. Bình Luận / Trả Lời Bình Luận
    createComment: builder.mutation<
      { message: string; data: Comment },
      CreateCommentPayload
    >({
      query: ({ postId, content, parentId }) => ({
        url: `/forum/posts/${postId}/comments`,
        method: "POST",
        body: { content, parentId },
      }),
      invalidatesTags: (_result, _error, { postId }) => [
        { type: "Post", id: postId },
      ],
    }),

    // 🟡 7. Bookmark / Hủy Bookmark
    toggleSavePost: builder.mutation<
      { message: string; saved: boolean },
      string
    >({
      query: (postId) => ({
        url: `/forum/posts/${postId}/save`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, postId) => [
        { type: "Post", id: postId },
      ],
    }),

    // 🔴 8. Xóa Bài Viết
    deletePost: builder.mutation<{ message: string; data: ForumPost }, string>({
      query: (id) => ({
        url: `/forum/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Post", id },
        { type: "Post", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetAllPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useVotePostMutation,
  useCreateCommentMutation,
  useToggleSavePostMutation,
  useDeletePostMutation,
} = forumApiSlice;
