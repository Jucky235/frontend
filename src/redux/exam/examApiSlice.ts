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
  id: string;
  content: string;
  options: QuestionOptions;
  right_answer: string;
  category: ExamCategory;
  partNumber?: number | null;
  explanation?: string | null;
  imagePath?: string | null;
  audioPath?: string | null;
  topicNumber?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExamPart {
  id: string;
  examId: string;
  partNumber: number;
  name: string;
  instructions?: string | null;
  audioPath?: string | null;
  sortOrder: number;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface Exam {
  id: string;
  name: string;
  category: ExamCategory;
  time: number;
  status: ExamStatus;
  parts?: ExamPart[];
  questions?: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface SubmitExamPayload {
  examId: string;
  answers: Record<string, string>;
  startedAt: string;
  submittedAt: string;
}

export interface CreateExamQuestionItem {
  questionId: string;
  sortOrder: number;
  partNumber?: number;
}

export interface CreateExamPayload {
  name: string;
  code?: string;
  description?: string;
  category: ExamCategory;
  status?: ExamStatus;
  durationMinutes?: number;
  questions?: CreateExamQuestionItem[];
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
    getExamById: builder.query<Exam, string>({
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
      invalidatesTags: [{ type: "Exam", id: "LIST" }],
    }),
    submitExam: builder.mutation<any, SubmitExamPayload>({
      query: (body) => ({
        url: "/exams/submit",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Exam", id: "LIST" }],
    }),
  }),
});

export const {
  useGetExamsQuery,
  useGetExamByIdQuery,
  useCreateExamMutation,
  useSubmitExamMutation,
} = examApiSlice;
