import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AnalyticsState {
  selectedUserId: string | null;

  rankingPeriod: "ALL_TIME" | "MONTH" | "WEEK";
}

const initialState: AnalyticsState = {
  selectedUserId: null,

  rankingPeriod: "ALL_TIME",
};

const analyticsSlice = createSlice({
  name: "analytics",

  initialState,

  reducers: {
    setSelectedUser: (state, action: PayloadAction<string | null>) => {
      state.selectedUserId = action.payload;
    },

    setRankingPeriod: (
      state,
      action: PayloadAction<"ALL_TIME" | "MONTH" | "WEEK">,
    ) => {
      state.rankingPeriod = action.payload;
    },

    resetAnalytics: () => initialState,
  },
});

export const { setSelectedUser, setRankingPeriod, resetAnalytics } =
  analyticsSlice.actions;

export default analyticsSlice.reducer;
