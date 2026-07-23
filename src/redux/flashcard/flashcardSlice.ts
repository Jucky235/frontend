import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Types matching your Prisma Flashcard model
export interface Flashcard {
  id: string;
  deckId: string;
  frontContent: string;
  backContent: string;
  explanation?: string | null;
  imagePath?: string | null;
  audioPath?: string | null;
  partNumber?: number | null;
}

interface FlashcardState {
  activeDeckId: string | null;
  cards: Flashcard[];
  currentCardIndex: number;
  isFlipped: boolean;
  userRatings: Record<string, number>; // Maps cardId -> quality score (0 to 5)
  isSubmitting: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: FlashcardState = {
  activeDeckId: null,
  cards: [],
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
      action: PayloadAction<{ deckId: string; cards: Flashcard[] }>,
    ) => {
      state.activeDeckId = action.payload.deckId;
      state.cards = action.payload.cards;
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
      action: PayloadAction<{ cardId: string; quality: number }>,
    ) => {
      const { cardId, quality } = action.payload;
      state.userRatings[cardId] = quality;
    },
    nextCard: (state) => {
      if (state.currentCardIndex < state.cards.length - 1) {
        state.currentCardIndex += 1;
        state.isFlipped = false; // Reset flip state for the next card
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
  nextCard,
  prevCard,
  setCardIndex,
  setSubmitting,
  setLoading,
  setError,
  resetFlashcardState,
} = flashcardSlice.actions;

export default flashcardSlice.reducer;
