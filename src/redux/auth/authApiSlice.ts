import { baseApiSlice } from "../apiSlice";
import { type LoginFormData } from "@/validadtion/login";
import { type SignupFormData } from "@/validadtion/register";

interface SignupResponse {
  message?: string;
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
}
interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

export const authApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginFormData>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      // 🟢 Invalidate user/profile tags on successful login so RTK Query refetches data for the new account
      invalidatesTags: ["User", "Profile", "Analytics", "ExamHistory"],
    }),
    signup: builder.mutation<SignupResponse, SignupFormData>({
      query: (userData) => ({
        url: "/auth/signup",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User", "Profile", "Analytics", "ExamHistory"],
    }),
  }),
});

export const { useLoginMutation, useSignupMutation } = authApiSlice;
