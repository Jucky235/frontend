import { configureStore } from "@reduxjs/toolkit";
import { baseApiSlice } from "./apiSlice"; // FIX: Import directly from the central apiSlice
import authReducer from "./auth/authSlice";
import examReducer from "./exam/examSlice";

export const store = configureStore({
  reducer: {
    // 1. Bind your RTK Query network cache reducer
    [baseApiSlice.reducerPath]: baseApiSlice.reducer,
    // 2. Bind your local user authentication slice state
    auth: authReducer,
    exam: examReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
