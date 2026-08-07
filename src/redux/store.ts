import { configureStore } from "@reduxjs/toolkit";
import { baseApiSlice } from "./apiSlice";
import authReducer from "./auth/authSlice";
import examReducer from "./exam/examSlice";
import userReducer from "./user/userSlice";
import newsReducer from "./news/newsSlice";
import questionReducer from "./question/questionSlice";

export const store = configureStore({
  reducer: {
    [baseApiSlice.reducerPath]: baseApiSlice.reducer,
    auth: authReducer,
    exam: examReducer,
    user: userReducer,
    news: newsReducer,
    question: questionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
