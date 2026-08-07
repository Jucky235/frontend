import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface QuestionFilters {
  category: string;
  partNumber: number | null;
  status: "ACTIVE" | "INACTIVE" | "ALL";
  search: string;
}

interface QuestionState {
  selectedQuestionIds: string[]; // For bulk actions/deletion
  activeQuestionId: string | null; // For viewing/editing a single question in a modal or drawer
  isCreateModalOpen: boolean;
  isBulkImportModalOpen: boolean;
  isEditModalOpen: boolean;
  filters: QuestionFilters;
  pagination: {
    page: number;
    limit: number;
  };
}

const initialState: QuestionState = {
  selectedQuestionIds: [],
  activeQuestionId: null,
  isCreateModalOpen: false,
  isBulkImportModalOpen: false,
  isEditModalOpen: false,
  filters: {
    category: "",
    partNumber: null,
    status: "ACTIVE",
    search: "",
  },
  pagination: {
    page: 1,
    limit: 20,
  },
};

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    // Selection Management
    toggleSelectQuestion: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.selectedQuestionIds.indexOf(id);
      if (index > -1) {
        state.selectedQuestionIds.splice(index, 1);
      } else {
        state.selectedQuestionIds.push(id);
      }
    },
    selectAllQuestions: (state, action: PayloadAction<string[]>) => {
      state.selectedQuestionIds = action.payload;
    },
    clearSelectedQuestions: (state) => {
      state.selectedQuestionIds = [];
    },

    // Active Question Modal/Drawer State
    setActiveQuestionId: (state, action: PayloadAction<string | null>) => {
      state.activeQuestionId = action.payload;
    },

    // Modal Control
    setCreateModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateModalOpen = action.payload;
    },
    setBulkImportModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isBulkImportModalOpen = action.payload;
    },
    setEditModalOpen: (
      state,
      action: PayloadAction<{ isOpen: boolean; questionId?: string }>,
    ) => {
      state.isEditModalOpen = action.payload.isOpen;
      if (action.payload.questionId !== undefined) {
        state.activeQuestionId = action.payload.questionId;
      }
    },

    // Filter & Search Management
    setFilters: (state, action: PayloadAction<Partial<QuestionFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page when filters change
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },

    // Pagination Controls
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload;
      state.pagination.page = 1;
    },

    // Reset entire state
    resetQuestionState: () => initialState,
  },
});

export const {
  toggleSelectQuestion,
  selectAllQuestions,
  clearSelectedQuestions,
  setActiveQuestionId,
  setCreateModalOpen,
  setBulkImportModalOpen,
  setEditModalOpen,
  setFilters,
  resetFilters,
  setPage,
  setLimit,
  resetQuestionState,
} = questionSlice.actions;

export default questionSlice.reducer;
