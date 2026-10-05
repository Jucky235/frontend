import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RoadmapNodeStatus } from "./roadmapApiSlice";

export type RoadmapNodeStatusFilter = "ALL" | RoadmapNodeStatus;

export interface RoadmapState {
  selectedNodeId: string | null;
  activeNodeIndex: number;
  selectedStatusFilter: RoadmapNodeStatusFilter;
  isGenerating: boolean;
  exerciseAnswers: Record<string, any>;
  isExerciseModalOpen: boolean;
}

const initialState: RoadmapState = {
  selectedNodeId: null,
  activeNodeIndex: 0,
  selectedStatusFilter: "ALL",
  isGenerating: false,
  exerciseAnswers: {},
  isExerciseModalOpen: false,
};

export const roadmapSlice = createSlice({
  name: "roadmap",
  initialState,
  reducers: {
    setSelectedNodeId: (state, action: PayloadAction<string | null>) => {
      state.selectedNodeId = action.payload;
    },
    setActiveNodeIndex: (state, action: PayloadAction<number>) => {
      state.activeNodeIndex = action.payload;
    },
    setSelectedStatusFilter: (
      state,
      action: PayloadAction<RoadmapNodeStatusFilter>,
    ) => {
      state.selectedStatusFilter = action.payload;
    },
    setIsGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload;
    },
    setExerciseAnswer: (
      state,
      action: PayloadAction<{ questionKey: string; answer: any }>,
    ) => {
      const { questionKey, answer } = action.payload;
      state.exerciseAnswers[questionKey] = answer;
    },
    clearExerciseAnswers: (state) => {
      state.exerciseAnswers = {};
    },
    setExerciseModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isExerciseModalOpen = action.payload;
    },
    resetRoadmapState: (state) => {
      state.selectedNodeId = null;
      state.activeNodeIndex = 0;
      state.selectedStatusFilter = "ALL";
      state.isGenerating = false;
      state.exerciseAnswers = {};
      state.isExerciseModalOpen = false;
    },
  },
});

export const {
  setSelectedNodeId,
  setActiveNodeIndex,
  setSelectedStatusFilter,
  setIsGenerating,
  setExerciseAnswer,
  clearExerciseAnswers,
  setExerciseModalOpen,
  resetRoadmapState,
} = roadmapSlice.actions;

export default roadmapSlice.reducer;
