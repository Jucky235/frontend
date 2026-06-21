import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ExamState {
  activeExamId: string | null;
  userAnswers: Record<string, string>; // Maps questionId -> chosenOption ("A", "B", etc.)
  currentQuestionIndex: number;
  isSubmitting: boolean;
}

const initialState: ExamState = {
  activeExamId: null,
  userAnswers: {},
  currentQuestionIndex: 0,
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
      state.isSubmitting = false;
    },
    selectAnswer: (
      state,
      action: PayloadAction<{ questionId: string; answer: string }>,
    ) => {
      const { questionId, answer } = action.payload;
      state.userAnswers[questionId] = answer;
    },
    setQuestionIndex: (state, action: PayloadAction<number>) => {
      state.currentQuestionIndex = action.payload;
    },
    resetExamState: (state) => {
      return initialState;
    },
  },
});

export const { startExam, selectAnswer, setQuestionIndex, resetExamState } =
  examSlice.actions;
export default examSlice.reducer;
