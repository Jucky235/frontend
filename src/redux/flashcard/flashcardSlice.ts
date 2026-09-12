import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { FSRSRating, type Flashcard } from "./flashcardApiSlice";

// Re-export or align interface with backend Prisma model
export type { Flashcard } from "./flashcardApiSlice";

export interface SessionCounts {
  new: number;
  learning: number;
  review: number;
}

interface FlashcardState {
  activeDeckId: string | null;
  cards: Flashcard[];
  counts: SessionCounts;
  currentCardIndex: number;
  isFlipped: boolean;
  userRatings: Record<string, FSRSRating>; // Maps cardId -> FSRSRating (1, 2, 3, 4)
  isSubmitting: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: FlashcardState = {
  activeDeckId: null,
  cards: [],
  counts: {
    new: 0,
    learning: 0,
    review: 0,
  },
  currentCardIndex: 0,
  isFlipped: false,
  userRatings: {},
  isSubmitting: false,
  isLoading: false,
  error: null,
};

const flashcardSlice = createSlice({
  name: "flashcard",
  initialState,
  reducers: {
    startSession: (
      state,
      action: PayloadAction<{
        deckId: string;
        cards: Flashcard[];
        counts?: SessionCounts;
      }>,
    ) => {
      state.activeDeckId = action.payload.deckId;
      state.cards = action.payload.cards;
      state.counts = action.payload.counts ?? {
        new: 0,
        learning: 0,
        review: 0,
      };
      state.currentCardIndex = 0;
      state.isFlipped = false;
      state.userRatings = {};
      state.isSubmitting = false;
      state.error = null;
    },
    toggleFlip: (state) => {
      state.isFlipped = !state.isFlipped;
    },
    setFlipped: (state, action: PayloadAction<boolean>) => {
      state.isFlipped = action.payload;
    },
    recordRating: (
      state,
      action: PayloadAction<{ cardId: string; rating: FSRSRating }>,
    ) => {
      const { cardId, rating } = action.payload;
      state.userRatings[cardId] = rating;

      // Automatically advance card and reset flip on review rating
      if (state.currentCardIndex < state.cards.length - 1) {
        state.currentCardIndex += 1;
        state.isFlipped = false;
      }
    },
    removeCurrentCard: (state) => {
      // Removes reviewed card from active deck array and adjusts current index
      state.cards.splice(state.currentCardIndex, 1);
      state.isFlipped = false;
      if (state.currentCardIndex >= state.cards.length) {
        state.currentCardIndex = Math.max(0, state.cards.length - 1);
      }
    },
    nextCard: (state) => {
      if (state.currentCardIndex < state.cards.length - 1) {
        state.currentCardIndex += 1;
        state.isFlipped = false;
      }
    },
    prevCard: (state) => {
      if (state.currentCardIndex > 0) {
        state.currentCardIndex -= 1;
        state.isFlipped = false;
      }
    },
    setCardIndex: (state, action: PayloadAction<number>) => {
      if (action.payload >= 0 && action.payload < state.cards.length) {
        state.currentCardIndex = action.payload;
        state.isFlipped = false;
      }
    },
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetFlashcardState: () => {
      return initialState;
    },
  },
});

export const {
  startSession,
  toggleFlip,
  setFlipped,
  recordRating,
  removeCurrentCard,
  nextCard,
  prevCard,
  setCardIndex,
  setSubmitting,
  setLoading,
  setError,
  resetFlashcardState,
} = flashcardSlice.actions;

export default flashcardSlice.reducer;
