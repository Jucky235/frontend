import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Category, type ForumPost, forumApiSlice } from "./forumApiSlice";

interface ForumState {
  activeCategoryId: string | null;
  activeCategory: Category | null;
  activePostId: string | null;
  activePost: ForumPost | null;
  searchQuery: string;
  sortBy: "hot" | "top" | "new";
  page: number;
}

const initialState: ForumState = {
  activeCategoryId: null,
  activeCategory: null,
  activePostId: null,
  activePost: null,
  searchQuery: "",
  sortBy: "new",
  page: 1,
};

const forumSlice = createSlice({
  name: "forum",
  initialState,
  reducers: {
    // Select category filter
    setActiveCategory: (state, action: PayloadAction<Category | null>) => {
      state.activeCategory = action.payload;
      state.activeCategoryId = action.payload ? action.payload.id : null;
      state.page = 1; // Reset pagination when category changes
    },
    setActiveCategoryId: (state, action: PayloadAction<string | null>) => {
      state.activeCategoryId = action.payload;
      if (!action.payload) {
        state.activeCategory = null;
      }
      state.page = 1;
    },

    // Select active post for detailed view
    setActivePost: (state, action: PayloadAction<ForumPost | null>) => {
      state.activePost = action.payload;
      state.activePostId = action.payload ? action.payload.id : null;
    },
    setActivePostId: (state, action: PayloadAction<string | null>) => {
      state.activePostId = action.payload;
      if (!action.payload) {
        state.activePost = null;
      }
    },

    // Filter, Sorting & Pagination
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.page = 1;
    },
    setSortBy: (state, action: PayloadAction<"hot" | "top" | "new">) => {
      state.sortBy = action.payload;
      state.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },

    resetForumState: () => {
      return initialState;
    },
  },

  // Automatically mirror RTK Query response data into local Redux state
  extraReducers: (builder) => {
    builder
      // Sync active post details when fetched by ID
      .addMatcher(
        forumApiSlice.endpoints.getPostById.matchFulfilled,
        (state, action) => {
          state.activePost = action.payload;
          state.activePostId = action.payload.id;
        },
      )
      // Optimistically/realtime update local activePost when a vote occurs
      .addMatcher(
        forumApiSlice.endpoints.votePost.matchFulfilled,
        (state, action) => {
          const updatedPost = action.payload.data;
          if (state.activePost && state.activePost.id === updatedPost.id) {
            state.activePost = updatedPost;
          }
        },
      );
  },
});

export const {
  setActiveCategory,
  setActiveCategoryId,
  setActivePost,
  setActivePostId,
  setSearchQuery,
  setSortBy,
  setPage,
  resetForumState,
} = forumSlice.actions;

export default forumSlice.reducer;

// Selectors
export const selectActiveCategoryId = (state: any) =>
  state.forum.activeCategoryId;
export const selectActiveCategory = (state: any) => state.forum.activeCategory;
export const selectActivePostId = (state: any) => state.forum.activePostId;
export const selectActivePost = (state: any) => state.forum.activePost;
export const selectForumSearchQuery = (state: any) => state.forum.searchQuery;
export const selectForumSortBy = (state: any) => state.forum.sortBy;
export const selectForumPage = (state: any) => state.forum.page;
