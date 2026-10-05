import { useState } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, User, Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import { signupSchema, type SignupFormData } from "@/validadtion/register";
import { useSignupMutation } from "@/redux/auth/authApiSlice";
import { useNavigate, Link } from "react-router-dom";

// ==========================================
// REUSABLE SUB-COMPONENTS
// ==========================================

interface FloatingInputProps {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  error?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

function FloatingInput({
  id,
  label,
  type = "text",
  placeholder,
  register,
  error,
  disabled,
  icon,
  rightElement,
}: FloatingInputProps) {
  return (
    <div className="w-full">
      <div
        className={`relative flex items-center border-2 rounded-2xl px-5 py-3.5 transition-all duration-200 bg-background-card shadow-sm ${
          error ? "border-red-500" : "border-border"
        } focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10`}
      >
        {icon && (
          <span className="mr-3.5 text-muted-foreground shrink-0">{icon}</span>
        )}

        <div className="relative flex-1">
          <label
            htmlFor={id}
            className="absolute -top-7.5 left-0 bg-background-card px-1.5 text-xs font-bold text-muted-foreground tracking-wider cursor-pointer"
          >
            {label}
          </label>
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            {...register}
            className="w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground/60 outline-none pt-1 disabled:opacity-50 appearance-none border-none shadow-none ring-0 focus:outline-none focus:ring-0 caret-brand text-[16px] leading-6"
          />
        </div>

        {rightElement && <div className="ml-3 shrink-0">{rightElement}</div>}
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-1.5 ml-4 font-medium animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
}

// ==========================================
// MAIN SIGNUP PAGE COMPONENT
// ==========================================

export default function SignupPage() {
  const [signup, { isLoading }] = useSignupMutation();
  const navigate = useNavigate();

  // Local state for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);

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

      // 2. Success! Redirect to login page with state message for toast/banner
      navigate("/login", {
        state: { message: "Please login with your registered account" },
      });
    } catch (err: any) {
      console.error("Backend Signup Error Raw Payload:", err);

      const backendMessage = err?.data?.message || err?.data?.error || "";

      if (
        err?.status === 409 ||
        err?.status === 400 ||
        backendMessage.includes("Email already registered")
      ) {
        setError("email", {
          type: "manual",
          message: "Email này đã được sử dụng. Vui lòng chọn email khác.",
        });
      } else {
        setError("root", {
          type: "manual",
          message:
            backendMessage || "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.",
        });
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-background font-inter overflow-x-hidden flex flex-col justify-between pb-12">
      {/* 1. Top Decorative Blob Backdrop */}
      <div className="absolute top-0 right-0 left-0 h-[40vh] bg-gradient-to-br from-banner-from to-banner-to rounded-b-[40%] md:rounded-b-[50%] flex flex-col justify-center px-12 md:px-16 text-white shadow-xl">
        <p className="text-xl md:text-2xl font-medium tracking-wide opacity-90">
          Hello,
        </p>
        <h1 className="text-5xl md:text-6xl font-extrabold mt-1 tracking-tight">
          Sign Up!
        </h1>
        <div className="absolute top-0 right-0 w-40 h-28 bg-brand rounded-bl-full opacity-40 blur-md pointer-events-none" />
      </div>

      {/* Spacer to push content below absolute header */}
      <div className="h-[44vh]" />

      {/* 2. Main Input Form Container */}
      <div className="flex-1 w-full max-w-lg mx-auto px-8 md:px-0 flex flex-col justify-start">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col space-y-6"
        >
          {/* Global/Server Error Banner */}
          {errors.root && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl font-medium text-center">
              {errors.root.message}
            </div>
          )}

          {/* User Name Input Field */}
          <FloatingInput
            id="name"
            label="USER NAME"
            type="text"
            placeholder="Jacob josef"
            register={register("name")}
            error={errors.name?.message}
            disabled={isLoading}
            icon={<User className="w-5 h-5" strokeWidth={1.75} />}
          />

          {/* Email Address Input Field */}
          <FloatingInput
            id="email"
            label="EMAIL ADDRESS"
            type="email"
            placeholder="Jacob@gmail.com"
            register={register("email")}
            error={errors.email?.message}
            disabled={isLoading}
            icon={<Mail className="w-5 h-5" strokeWidth={1.75} />}
          />

          {/* Password Input Field */}
          <FloatingInput
            id="password"
            label="PASSWORD"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            register={register("password")}
            error={errors.password?.message}
            disabled={isLoading}
            icon={<Lock className="w-5 h-5" strokeWidth={1.75} />}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" strokeWidth={1.75} />
                ) : (
                  <Eye className="w-5 h-5" strokeWidth={1.75} />
                )}
              </button>
            }
          />

          {/* 3. Toggle/Checkbox Switch Row */}
          <div className="flex items-center space-x-3 pt-1">
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                required
                disabled={isLoading}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-border rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand relative" />
            </label>
            <span className="text-sm text-muted-foreground font-medium">
              I accept the policy and terms
            </span>
          </div>

          {/* 4. Action Sign Up Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand hover:opacity-90 disabled:bg-muted text-white font-bold text-lg py-4 rounded-full tracking-wide transition-all shadow-lg disabled:shadow-none cursor-pointer active:scale-[0.99] disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Signing up...</span>
                </>
              ) : (
                <span>Sign up</span>
              )}
            </button>
          </div>
        </form>

        {/* Login Navigation Prompt */}
        <div className="text-center pt-8">
          <p className="text-sm text-muted-foreground font-medium">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-brand hover:underline transition-all"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
