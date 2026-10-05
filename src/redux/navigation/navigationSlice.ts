import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { NavigationSearchResponse } from "./navigationApiSlice";

export interface NavigationState {
  searchQuery: string;
  isSearchModalOpen: boolean;
  recentSearches: string[];
  lastRecommendation: NavigationSearchResponse | null;
}

const initialState: NavigationState = {
  searchQuery: "",
  isSearchModalOpen: false,
  recentSearches: [],
  lastRecommendation: null,
};

export const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    toggleSearchModal: (state) => {
      state.isSearchModalOpen = !state.isSearchModalOpen;
    },
    setSearchModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isSearchModalOpen = action.payload;
    },
    setLastRecommendation: (
      state,
      action: PayloadAction<NavigationSearchResponse | null>,
    ) => {
      state.lastRecommendation = action.payload;
    },
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const trimmed = action.payload.trim();
      if (trimmed) {
        state.recentSearches = [
          trimmed,
          ...state.recentSearches.filter((item) => item !== trimmed),
        ].slice(0, 5);
      }
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
    resetNavigationState: (state) => {
      state.searchQuery = "";
      state.isSearchModalOpen = false;
      state.lastRecommendation = null;
    },
  },
});

export const {
  setSearchQuery,
  toggleSearchModal,
  setSearchModalOpen,
  setLastRecommendation,
  addRecentSearch,
  clearRecentSearches,
  resetNavigationState,
} = navigationSlice.actions;

export default navigationSlice.reducer;

// --- Selectors ---
export const selectSearchQuery = (state: any) =>
  state.navigation?.searchQuery ?? "";
export const selectIsSearchModalOpen = (state: any) =>
  state.navigation?.isSearchModalOpen ?? false;
export const selectRecentSearches = (state: any) =>
  state.navigation?.recentSearches ?? [];
export const selectLastRecommendation = (state: any) =>
  state.navigation?.lastRecommendation ?? null;
