import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ExamState {
  activeExamId: string | null;
  userAnswers: Record<string, string>; // Maps questionId -> chosenOption ("A", "B", etc.)
  currentQuestionIndex: number;
  startedAt: string | null; // ISO timestamp when test was started
  isSubmitting: boolean;
}

const initialState: ExamState = {
  activeExamId: null,
  userAnswers: {},
  currentQuestionIndex: 0,
  startedAt: null,
  isSubmitting: false,
};

const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    startExam: (state, action: PayloadAction<{ examId: string }>) => {
      state.activeExamId = action.payload.examId;
      state.userAnswers = {};
      state.currentQuestionIndex = 0;
      state.startedAt = new Date().toISOString();
      state.isSubmitting = false;
    },
    selectAnswer: (
      state,
      action: PayloadAction<{ questionId: string; answer: string }>,
    ) => {
      const { questionId, answer } = action.payload;
      state.userAnswers[questionId] = answer;
    },
    clearAnswer: (state, action: PayloadAction<{ questionId: string }>) => {
      delete state.userAnswers[action.payload.questionId];
    },
    setQuestionIndex: (state, action: PayloadAction<number>) => {
      state.currentQuestionIndex = action.payload;
    },
    setIsSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    resetExamState: () => {
      return initialState;
    },
  },
});

export const {
  startExam,
  selectAnswer,
  clearAnswer,
  setQuestionIndex,
  setIsSubmitting,
  resetExamState,
} = examSlice.actions;

export default examSlice.reducer;
