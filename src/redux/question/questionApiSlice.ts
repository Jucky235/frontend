import { baseApiSlice } from "../apiSlice";
import { type ExamCategory } from "../exam/examApiSlice";

export interface QuestionOptions {
  A: string;
  B: string;
  C: string;
  D: string;
  [key: string]: string;
}

export interface Question {
  id: number;
  content: string;
  options: QuestionOptions;
  right_answer: "A" | "B" | "C" | "D" | string;
  category: ExamCategory;
  partNumber?: number | null;
  explanation?: string | null;
  imagePath?: string | null;
  audioPath?: string | null;
  topicNumber?: number | null;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface GetQuestionsQueryParams {
  category?: string;
  partNumber?: number;
  status?: "ACTIVE" | "INACTIVE";
  search?: string;
  page?: number;
  limit?: number;
}

export interface GetQuestionsResponse {
  items: Question[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateQuestionPayload {
  content: string;
  options: QuestionOptions;
  right_answer: "A" | "B" | "C" | "D" | string;
  category?: string;
  partNumber?: number;
  explanation?: string;
  imagePath?: string;
  audioPath?: string;
  topicNumber?: number;
}

export interface BulkCreateQuestionsPayload {
  questions: CreateQuestionPayload[];
}

export interface UpdateQuestionPayload extends Partial<CreateQuestionPayload> {
  status?: "ACTIVE" | "INACTIVE";
}

export const questionApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuestions: builder.query<
      GetQuestionsResponse,
      GetQuestionsQueryParams | void
    >({
      query: (params) => ({
        url: "/questions",
        method: "GET",
        params: params || {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: "Question" as const,
                id,
              })),
              { type: "Question", id: "LIST" },
            ]
          : [{ type: "Question", id: "LIST" }],
    }),

    getQuestionById: builder.query<Question, number | string>({
      query: (id) => ({
        url: `/questions/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Question", id }],
    }),

    createQuestion: builder.mutation<Question, CreateQuestionPayload>({
      query: (body) => ({
        url: "/questions",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Question", id: "LIST" }],
    }),

    bulkCreateQuestions: builder.mutation<
      { message: string; count: number },
      BulkCreateQuestionsPayload
    >({
      query: (body) => ({
        url: "/questions/bulk",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Question", id: "LIST" }],
    }),

    updateQuestion: builder.mutation<
      Question,
      { id: number | string; data: UpdateQuestionPayload }
    >({
      query: ({ id, data }) => ({
        url: `/questions/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Question", id },
        { type: "Question", id: "LIST" },
      ],
    }),

    deleteQuestion: builder.mutation<{ message: string }, number | string>({
      query: (id) => ({
        url: `/questions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Question", id },
        { type: "Question", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetQuestionsQuery,
  useGetQuestionByIdQuery,
  useCreateQuestionMutation,
  useBulkCreateQuestionsMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} = questionApiSlice;
