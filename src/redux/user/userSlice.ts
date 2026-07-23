import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type UserProfile, userApiSlice } from "./userApiSlice";

interface UserState {
  profile: UserProfile | null;
  isEditingProfile: boolean;
  uiPreferences: {
    theme: "light" | "dark";
  };
}

const initialState: UserState = {
  profile: null,
  isEditingProfile: false,
  uiPreferences: {
    theme: "light",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLocalProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    setEditingProfile: (state, action: PayloadAction<boolean>) => {
      state.isEditingProfile = action.payload;
    },
    toggleTheme: (state) => {
      state.uiPreferences.theme =
        state.uiPreferences.theme === "light" ? "dark" : "light";
    },
    resetUserState: () => {
      return initialState;
    },
  },
  // Automatically mirror successful RTK Query cache results into your Redux state
  extraReducers: (builder) => {
    builder
      .addMatcher(
        userApiSlice.endpoints.getUserProfile.matchFulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.profile = action.payload;
        },
      )
      .addMatcher(
        userApiSlice.endpoints.updateUserProfile.matchFulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.profile = action.payload;
          state.isEditingProfile = false; // Turn off editing mode on successful save
        },
      );
  },
});

export const {
  setLocalProfile,
  setEditingProfile,
  toggleTheme,
  resetUserState,
} = userSlice.actions;
export default userSlice.reducer;

export const selectUserProfile = (state: any) => state.user.profile;
export const selectIsEditingProfile = (state: any) =>
  state.user.isEditingProfile;
export const selectThemePreference = (state: any) =>
  state.user.uiPreferences.theme;
