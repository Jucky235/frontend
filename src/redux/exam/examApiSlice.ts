import { baseApiSlice } from "../apiSlice";

export type ExamCategory = "TOEIC";
export type ExamStatus = "ACTIVE" | "INACTIVE" | "OUTDATED";

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
  right_answer: string;
  category: ExamCategory;
  partNumber?: number | null;
  partId?: number | null;
  sortOrder?: number;
  explanation?: string | null;
  imagePath?: string | null;
  audioPath?: string | null;
  topicNumber?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExamPart {
  id: number;
  examId: number;
  partNumber: number;
  name: string;
  instructions?: string | null;
  description?: string | null;
  audioPath?: string | null;
  sortOrder: number;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface Exam {
  id: number;
  name: string;
  code?: string | null;
  description?: string | null;
  category: ExamCategory;
  time: number;
  status: ExamStatus;
  parts?: ExamPart[];
  questions?: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface SubmitExamPayload {
  examId: number;
  answers: Record<number | string, string>;
  startedAt: string;
  submittedAt: string;
}

export interface CreateExamQuestionItem {
  questionId: number;
  sortOrder: number;
  partNumber: number;
}

export interface CreateExamPartPayload {
  partNumber: number;
  name: string;
  instructions?: string;
  description?: string;
  sortOrder?: number;
}

export interface CreateExamPayload {
  name: string;
  code?: string;
  description?: string;
  category: ExamCategory;
  status?: ExamStatus;
  durationMinutes?: number;
  parts?: CreateExamPartPayload[];
  questions?: CreateExamQuestionItem[];
}

export interface AddQuestionsToExamItem {
  questionId: number;
  partNumber?: number;
  sortOrder?: number;
}

export interface AddQuestionsToExamPayload {
  examId: number;
  questions: AddQuestionsToExamItem[];
}

export const examApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExams: builder.query<Exam[], void>({
      query: () => ({
        url: "/exams",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Exam" as const, id })),
              { type: "Exam", id: "LIST" },
            ]
          : [{ type: "Exam", id: "LIST" }],
    }),

    getDailyExam: builder.query<Exam, void>({
      query: () => ({
        url: "/exams/daily",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Exam", id: result.id },
              { type: "Exam", id: "DAILY" },
            ]
          : [{ type: "Exam", id: "DAILY" }],
    }),

    getExamById: builder.query<Exam, number | string>({
      query: (id) => ({
        url: `/exams/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Exam", id }],
    }),

    createExam: builder.mutation<Exam, CreateExamPayload>({
      query: (body) => ({
        url: "/exams",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Exam", id: "LIST" },
        { type: "Exam", id: "DAILY" },
      ],
    }),

    addQuestionsToExam: builder.mutation<Exam, AddQuestionsToExamPayload>({
      query: ({ examId, questions }) => ({
        url: `/exams/${examId}/questions`,
        method: "POST",
        body: { questions },
      }),
      invalidatesTags: (_result, _error, { examId }) => [
        { type: "Exam", id: examId },
        { type: "Exam", id: "LIST" },
        { type: "Exam", id: "DAILY" },
      ],
    }),

    submitExam: builder.mutation<any, SubmitExamPayload>({
      query: (body) => ({
        url: "/exams/submit",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { examId }) => [
        { type: "Exam", id: examId },
        { type: "Exam", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetExamsQuery,
  useGetDailyExamQuery,
  useGetExamByIdQuery,
  useCreateExamMutation,
  useAddQuestionsToExamMutation,
  useSubmitExamMutation,
} = examApiSlice;
