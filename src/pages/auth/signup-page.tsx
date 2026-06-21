import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { signupSchema, type SignupFormData } from "@/validadtion/register"; // Ensure directory typo matches your project
import { useSignupMutation } from "@/redux/auth/authApiSlice";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [signup, { isLoading }] = useSignupMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      // 1. Send data to backend
      await signup(data).unwrap();

      // Success! Redirect to login page
      navigate("/login");
    } catch (err: any) {
      // 2. Debugging tool: Look at this log in your browser console (F12) to see the structure!
      console.error("Backend Signup Error Raw Payload:", err);

      // 3. Extract the error message string from common backend response structures
      const backendMessage = err?.data?.message || err?.data?.error || "";

      if (
        err?.status === 409 ||
        err?.status === 400 ||
        backendMessage.includes("Email already registered")
      ) {
        // 4. Manually set the validation error on the "email" field
        setError("email", {
          type: "manual",
          message: "Email này đã được sử dụng. Vui lòng chọn email khác.",
        });
      } else {
        // Fallback banner for other server issues (e.g., database connection lost)
        setError("root", {
          type: "manual",
          message:
            backendMessage || "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.",
        });
      }
    }
  };
  return (
    <div className="relative min-h-screen w-full bg-white font-inter overflow-x-hidden flex flex-col justify-between pb-8">
      {/* 1. Top Decorative Blob Backdrop */}
      <div className="absolute top-0 right-0 left-0 h-[38vh] bg-gradient-to-br from-blue-600 to-indigo-600 rounded-b-[35%] md:rounded-b-[45%] flex flex-col justify-center px-10 text-white shadow-lg">
        <p className="text-xl font-medium tracking-wide opacity-90">Hello,</p>
        <h1 className="text-4xl md:text-5xl font-extrabold mt-1 tracking-tight">
          Sign Up!
        </h1>
        <div className="absolute top-0 right-0 w-32 h-20 bg-indigo-600 rounded-bl-full opacity-40 blur-sm pointer-events-none" />
      </div>

      {/* Spacer to push content below absolute header */}
      <div className="h-[38vh]" />

      {/* 2. Main Input Form Container */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 w-full max-w-md mx-auto px-8 flex flex-col justify-start space-y-5"
      >
        {/* Global/Server Error Banner */}
        {errors.root && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl font-medium text-center">
            {errors.root.message}
          </div>
        )}

        {/* User Name Input Field */}
        <div>
          <div
            className={`relative border rounded-xl px-4 py-3 focus-within:border-indigo-500 transition-colors ${errors.name ? "border-red-400" : "border-neutral-300"}`}
          >
            <label className="absolute -top-2.5 left-4 bg-white px-1 text-xs font-semibold text-neutral-500 tracking-wide">
              User Name
            </label>
            <input
              type="text"
              placeholder="Jacob josef"
              {...register("name")}
              className="w-full bg-transparent text-sm text-neutral-800 placeholder-neutral-400 outline-none pt-1"
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-xs mt-1 ml-2">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Address Input Field */}
        <div>
          <div
            className={`relative border rounded-xl px-4 py-3 focus-within:border-indigo-500 transition-colors ${errors.email ? "border-red-400" : "border-neutral-300"}`}
          >
            <label className="absolute -top-2.5 left-4 bg-white px-1 text-xs font-semibold text-neutral-500 tracking-wide">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Jacob@gmail.com"
              {...register("email")}
              className="w-full bg-transparent text-sm text-neutral-800 placeholder-neutral-400 outline-none pt-1"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 ml-2">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Input Field */}
        <div>
          <div
            className={`relative border rounded-xl px-4 py-3 flex items-center justify-between focus-within:border-indigo-500 transition-colors ${errors.password ? "border-red-400" : "border-neutral-300"}`}
          >
            <label className="absolute -top-2.5 left-4 bg-white px-1 text-xs font-semibold text-neutral-500 tracking-wide">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              {...register("password")}
              className="w-full bg-transparent text-sm text-neutral-800 placeholder-neutral-400 outline-none pt-1 pr-2"
            />
            <Lock
              className="w-5 h-5 text-neutral-400 shrink-0"
              strokeWidth={1.5}
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1 ml-2">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* 3. Toggle/Checkbox Switch Row */}
        <div className="flex items-center space-x-3 pt-1">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" required className="sr-only peer" />
            <div className="w-9 h-5 bg-neutral-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500" />
          </label>
          <span className="text-xs text-neutral-500 font-medium">
            I accept the policy and terms
          </span>
        </div>

        {/* 4. Action Sign Up Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#5A67FF] hover:bg-indigo-600 disabled:bg-neutral-400 text-white font-bold text-base py-3.5 rounded-full tracking-wide transition-all shadow-[0_8px_20px_rgba(90,103,255,0.35)] disabled:shadow-none cursor-pointer active:scale-[0.99]"
          >
            {isLoading ? "Signing up..." : "Sign up"}
          </button>
        </div>
      </form>

      {/* 5. Bottom Social Sign-in Bar */}
      <div className="w-full max-w-xs mx-auto flex items-center justify-center space-x-8 pt-6">
        <button
          type="button"
          className="text-[#4F96FF] hover:scale-110 transition-transform cursor-pointer"
        ></button>
        <button
          type="button"
          className="text-[#EA4335] hover:scale-110 transition-transform cursor-pointer"
        ></button>
        <button
          type="button"
          className="text-[#0077B5] hover:scale-110 transition-transform cursor-pointer"
        ></button>
      </div>
    </div>
  );
}
