import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api", // Matches your local Vite dev proxy routing
    prepareHeaders: (headers, { getState }) => {
      // 1. Grab the token dynamic path out of the active auth slice state
      const token = (getState() as any).auth?.token;

      // 2. If present, assign it to the Authorization header
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["User", "History"],
  endpoints: () => ({}),
});
