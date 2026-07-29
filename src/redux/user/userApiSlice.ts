import { baseApiSlice } from "../apiSlice";

export interface Role {
  id: string;
  name: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  gender?: string;
  roleId?: string;
  role?: Role;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  name?: string;
  phoneNumber?: string;
  gender?: string;
  password?: string;
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

// 🟢 Params cho query getAllUsers
export interface GetUsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

// 🟢 Trả về danh sách user có phân trang
export interface GetUsersResponse {
  data: UserProfile[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const userApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🟢 Fetch list of all users (Admin)
    getUsers: builder.query<GetUsersResponse, GetUsersQueryParams | void>({
      query: (params) => ({
        url: "/users",
        method: "GET",
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
          ...(params?.search ? { search: params.search } : {}),
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "User" as const, id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

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
      // Invalidates both profile and user list cache
      invalidatesTags: (result) =>
        result
          ? [
              { type: "User", id: result.id },
              { type: "User", id: "LIST" },
            ]
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
          currentPassword: credentials.currentPassword,
          password: credentials.newPassword,
        },
      }),
    }),

    // 🔴 Delete user by ID (Admin)
    deleteUser: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      // Tự động xóa cache của user bị xóa và làm mới danh sách (LIST)
      invalidatesTags: (_result, _error, id) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetUserHistoryQuery,
  useChangePasswordMutation,
  useDeleteUserMutation,
} = userApiSlice;
