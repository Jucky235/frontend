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
  partNumber?: number | null; // Added partNumber
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
  partNumber: number; // e.g., 1, 2, 3...
  name: string; // e.g., "Part 1: Photographs"
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
  parts?: ExamPart[]; // Added multi-part support
  questions?: Question[]; // Fallback list if parts aren't grouped
  createdAt: string;
  updatedAt: string;
}

export interface SubmitExamPayload {
  examId: string;
  answers: Record<string, string>;
  startedAt: string;
  submittedAt: string;
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
    submitExam: builder.mutation<any, SubmitExamPayload>({
      invalidatesTags: [{ type: "Exam", id: "LIST" }],
      query: (body) => ({
        url: "/exams/submit",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetExamsQuery, useGetExamByIdQuery, useSubmitExamMutation } =
  examApiSlice;
