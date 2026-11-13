import { baseApiSlice } from "../apiSlice";

export interface DictionaryWord {
  id: string;
  word: string;
  definition: string;
  numberOfTimeSearch: number;
}

export interface CreateDictionaryWordPayload {
  word: string;
  definition: string;
}

export const dictionaryApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createDictionaryWord: builder.mutation<
      DictionaryWord,
      CreateDictionaryWordPayload
    >({
      query: (body) => ({
        url: "/dictionary",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Dictionary", id: "LIST" }],
    }),

    incrementDictionaryWordSearch: builder.mutation<DictionaryWord, string>({
      query: (id) => ({
        url: `/dictionary/${id}/search`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Dictionary", id },
        { type: "Dictionary", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateDictionaryWordMutation,
  useIncrementDictionaryWordSearchMutation,
} = dictionaryApiSlice;
