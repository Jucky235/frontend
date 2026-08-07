export type ExamStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED";

export interface ExamItem {
  id: string;
  title: string;
  code: string;
  category: string;
  durationMinutes: number;
  totalQuestions: number;
  totalSubmissions: number;
  status: ExamStatus;
  createdAt: string;
}

export type FilterStatus = "ALL" | ExamStatus;
