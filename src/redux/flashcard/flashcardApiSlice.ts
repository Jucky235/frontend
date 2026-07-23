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

export interface Flashcard {
  id: string;
  deckId: string;
  frontContent: string;
  backContent: string;
  explanation: string | null;
  imagePath: string | null;
  audioPath: string | null;
  partNumber: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
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

export interface CreateDeckPayload {
  name: string;
  description?: string;
  category: ExamCategory;
  visibility?: DeckVisibility;
}

export interface CreateFlashcardPayload {
  deckId: string;
  frontContent: string;
  backContent: string;
  explanation?: string;
  imagePath?: string;
  audioPath?: string;
  partNumber?: number;
}

export interface ReviewCardPayload {
  cardId: string;
  quality: number; // SM-2 score (0 to 5)
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
        url: `/decks/${id}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<Deck>) => response.data,
      providesTags: (result, error, id) => [{ type: "Deck", id }],
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
        url: `/decks/${deckId}/cards`,
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<Flashcard>) => response.data,
      invalidatesTags: (result, error, { deckId }) => [
        { type: "Deck", id: deckId },
        { type: "Deck", id: "LIST" },
      ],
    }),

    submitCardReview: builder.mutation<any, ReviewCardPayload>({
      query: ({ cardId, quality }) => ({
        url: `/flashcards/${cardId}/review`,
        method: "POST",
        body: { quality },
      }),
      invalidatesTags: [{ type: "Deck", id: "LIST" }],
    }),
  }),
});

export const {
  useGetDecksQuery,
  useGetDeckByIdQuery,
  useCreateDeckMutation,
  useAddFlashcardMutation,
  useSubmitCardReviewMutation,
} = flashcardApiSlice;
