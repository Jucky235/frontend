import { configureStore } from "@reduxjs/toolkit";
import { baseApiSlice } from "./apiSlice";
import authReducer from "./auth/authSlice";
import examReducer from "./exam/examSlice";
import userReducer from "./user/userSlice"; // 1. Import your user reducer

export const store = configureStore({
  reducer: {
    [baseApiSlice.reducerPath]: baseApiSlice.reducer,
    auth: authReducer,
    exam: examReducer,
    user: userReducer, // 2. Mount it under the 'user' key
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
