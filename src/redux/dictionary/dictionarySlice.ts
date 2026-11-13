import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DictionaryWord } from "./dictionaryApiSlice";

export interface DictionaryState {
  searchQuery: string;
  selectedWord: DictionaryWord | null;
}

const initialState: DictionaryState = {
  searchQuery: "",
  selectedWord: null,
};

const dictionarySlice = createSlice({
  name: "dictionary",
  initialState,
  reducers: {
    setDictionarySearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedDictionaryWord: (
      state,
      action: PayloadAction<DictionaryWord | null>,
    ) => {
      state.selectedWord = action.payload;
    },
    resetDictionaryState: () => initialState,
  },
});

export const {
  setDictionarySearchQuery,
  setSelectedDictionaryWord,
  resetDictionaryState,
} = dictionarySlice.actions;

export default dictionarySlice.reducer;
