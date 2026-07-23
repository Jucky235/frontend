import { baseApiSlice } from "../apiSlice"; // Adjusted path to step up one directory level

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
  explanation: string | null;
  topicNumber: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Exam {
  id: string;
  name: string;
  category: ExamCategory;
  time: number;
  status: ExamStatus;
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
      providesTags: (result, error, id) => [{ type: "Exam", id }],
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
