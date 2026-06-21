import { baseApiSlice } from "../apiSlice"; // Import from the parent directory
import { type LoginFormData } from "@/validadtion/login";
import { type SignupFormData } from "@/validadtion/register";

interface SignupResponse {
  message?: string;
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}
interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
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
    }),
    signup: builder.mutation<SignupResponse, SignupFormData>({
      query: (userData) => ({
        url: "/auth/signup", // Adjust this to match your backend signup URL (e.g., /auth/register)
        method: "POST",
        body: userData,
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation } = authApiSlice;
