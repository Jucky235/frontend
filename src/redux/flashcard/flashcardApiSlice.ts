import { baseApiSlice } from "../apiSlice";

export type ExamCategory = "TOEIC";
export type DeckStatus = "ACTIVE" | "INACTIVE";
export type DeckVisibility = "PUBLIC" | "PRIVATE";

export type BoxLevel =
  | "BOX_1"
  | "BOX_2"
  | "BOX_3"
  | "BOX_4"
  | "BOX_5"
  | "BOX_6"
  | "BOX_7";

export const FSRSRating = {
  AGAIN: 1,
  HARD: 2,
  GOOD: 3,
  EASY: 4,
} as const;

export type FSRSRating = (typeof FSRSRating)[keyof typeof FSRSRating];

export interface FlashcardProgress {
  id: string;
  userId: string;
  flashcardId: string;
  box: BoxLevel;
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  nextReviewAt: string;
  lastReviewedAt: string;
}

export interface Flashcard {
  id: string;
  deckId: string;
  frontContent: string;
  backContent: string;
  explanation: string | null;
  imagePath?: string | null;
  audioPath?: string | null;
  partNumber?: number | null;
  createdAt: string;
  updatedAt: string;
  userProgresses?: FlashcardProgress[];
}

export interface DeckCreator {
  id: string;
  name: string;
  email: string;
}

export interface Deck {
  id: string;
  name: string;
  description: string | null;
  category: ExamCategory;
  status: DeckStatus;
  visibility: DeckVisibility;
  creatorId: string | null;
  creator?: DeckCreator;
  cards?: Flashcard[];
  _count?: {
    cards: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DeckStudyStats {
  newCardsCount: number;
  learningCount: number;
  reviewCount: number;
  totalDue: number;
  totalCards: number;
}

export interface DueCardsResponse {
  cards: Flashcard[];
  counts: {
    new: number;
    learning: number;
    review: number;
  };
}

export interface CreateDeckPayload {
  name: string;
  description?: string | null;
  category: ExamCategory;
  visibility?: DeckVisibility;
}

export interface CreateFlashcardPayload {
  deckId: string;
  frontContent: string;
  backContent: string;
  explanation?: string | null;
  imagePath?: string | null;
  audioPath?: string | null;
  partNumber?: number | null;
}

export interface ReviewCardPayload {
  cardId: string;
  deckId: string; // Included for tag invalidation
  rating: FSRSRating;
}

export interface GetDueCardsArgs {
  deckId: string;
  limit?: number;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export const flashcardApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDecks: builder.query<Deck[], void>({
      query: () => ({
        url: "/flashcards/decks",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<Deck[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Deck" as const, id })),
              { type: "Deck", id: "LIST" },
            ]
          : [{ type: "Deck", id: "LIST" }],
    }),

    getDeckById: builder.query<Deck, string>({
      query: (id) => ({
        url: `/flashcards/decks/${id}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<Deck>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Deck", id }],
    }),

    getDeckStudyStats: builder.query<DeckStudyStats, string>({
      query: (deckId) => ({
        url: `/flashcards/decks/${deckId}/stats`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<DeckStudyStats>) =>
        response.data,
      providesTags: (_result, _error, deckId) => [
        { type: "DueCards" as const, id: deckId },
      ],
    }),

    getDueCards: builder.query<DueCardsResponse, GetDueCardsArgs>({
      query: ({ deckId, limit = 20 }) => ({
        url: `/flashcards/decks/${deckId}/due`,
        method: "GET",
        params: { limit },
      }),
      transformResponse: (response: ApiResponse<DueCardsResponse>) =>
        response.data,
      providesTags: (_result, _error, { deckId }) => [
        { type: "DueCards" as const, id: deckId },
      ],
    }),

    createDeck: builder.mutation<Deck, CreateDeckPayload>({
      query: (body) => ({
        url: "/flashcards/decks",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<Deck>) => response.data,
      invalidatesTags: [{ type: "Deck", id: "LIST" }],
    }),

    addFlashcard: builder.mutation<Flashcard, CreateFlashcardPayload>({
      query: ({ deckId, ...body }) => ({
        url: `/flashcards/decks/${deckId}/cards`,
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<Flashcard>) => response.data,
      invalidatesTags: (_result, _error, { deckId }) => [
        { type: "Deck", id: deckId },
        { type: "Deck", id: "LIST" },
        { type: "DueCards", id: deckId },
      ],
    }),

    submitCardReview: builder.mutation<FlashcardProgress, ReviewCardPayload>({
      query: ({ cardId, rating }) => ({
        url: `/flashcards/cards/${cardId}/review`,
        method: "POST",
        body: { rating },
      }),
      transformResponse: (response: ApiResponse<FlashcardProgress>) =>
        response.data,
      invalidatesTags: (_result, _error, { deckId }) => [
        { type: "DueCards", id: deckId },
        { type: "Deck", id: deckId },
        { type: "Deck", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetDecksQuery,
  useGetDeckByIdQuery,
  useGetDeckStudyStatsQuery,
  useGetDueCardsQuery,
  useCreateDeckMutation,
  useAddFlashcardMutation,
  useSubmitCardReviewMutation,
} = flashcardApiSlice;
