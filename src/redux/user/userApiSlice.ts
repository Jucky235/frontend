import { baseApiSlice } from "../apiSlice";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface UserExamHistory {
  id: string;
  examId: string;
  examName: string;
  score: number;
  startedAt: string;
  submittedAt: string;
}

export const userApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch the current authenticated user's details
    getUserProfile: builder.query<UserProfile, void>({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [{ type: "User" as const, id: result.id }]
          : [{ type: "User", id: "PROFILE" }],
    }),

    // Update user information
    updateUserProfile: builder.mutation<UserProfile, UpdateProfilePayload>({
      query: (body) => ({
        url: "/users/me",
        method: "PUT",
        body,
      }),
      // Invalidates the profile cache so components automatically re-fetch updated data
      invalidatesTags: (result) =>
        result
          ? [{ type: "User", id: result.id }]
          : [{ type: "User", id: "PROFILE" }],
    }),

    // Fetch history of exams taken by the user
    getUserHistory: builder.query<UserExamHistory[], void>({
      query: () => ({
        url: "/users/history",
        method: "GET",
      }),
      providesTags: [{ type: "User", id: "HISTORY" }],
    }),

    // Update user security credentials
    changePassword: builder.mutation<any, ChangePasswordPayload>({
      query: (credentials) => ({
        url: "/users/me",
        method: "PUT",
        body: {
          currentPassword: credentials.currentPassword, // Included in case your backend validates the old password
          password: credentials.newPassword,
        },
      }),
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetUserHistoryQuery,
  useChangePasswordMutation, // <-- Exported hook
} = userApiSlice;
