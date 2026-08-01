import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type NewsCategoryFilter =
  | "ALL"
  | "GENERAL"
  | "EXAM_TIPS"
  | "ANNOUNCEMENT"
  | "SYSTEM_UPDATE"
  | "FEATURED";

export type NewsStatusFilter = "ALL" | "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface NewsState {
  page: number;
  limit: number;
  search: string;
  selectedCategory: NewsCategoryFilter;
  selectedStatus: NewsStatusFilter;
  selectedNewsId: string | null;
}

const initialState: NewsState = {
  page: 1,
  limit: 10,
  search: "",
  selectedCategory: "ALL",
  selectedStatus: "ALL",
  selectedNewsId: null,
};

export const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.page = 1; // Reset to page 1 whenever limit changes
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1; // Reset to page 1 on new search
    },
    setSelectedCategory: (state, action: PayloadAction<NewsCategoryFilter>) => {
      state.selectedCategory = action.payload;
      state.page = 1; // Reset to page 1 on filter change
    },
    setSelectedStatus: (state, action: PayloadAction<NewsStatusFilter>) => {
      state.selectedStatus = action.payload;
      state.page = 1; // Reset to page 1 on filter change
    },
    setSelectedNewsId: (state, action: PayloadAction<string | null>) => {
      state.selectedNewsId = action.payload;
    },
    resetNewsFilters: (state) => {
      state.page = 1;
      state.search = "";
      state.selectedCategory = "ALL";
      state.selectedStatus = "ALL";
      state.selectedNewsId = null;
    },
  },
});

export const {
  setPage,
  setLimit,
  setSearch,
  setSelectedCategory,
  setSelectedStatus,
  setSelectedNewsId,
  resetNewsFilters,
} = newsSlice.actions;

export default newsSlice.reducer;
