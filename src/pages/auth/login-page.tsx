import { useState, useEffect } from "react";
import { Lock, Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";

// Import your validation schemas and redux slices
import { loginSchema, type LoginFormData } from "@/validadtion/login";
import { useLoginMutation } from "@/redux/auth/authApiSlice";
import { setCredentials } from "@/redux/auth/authSlice";

// Import your Toast components
import {
  ToastContainer,
  type ToastMessage,
} from "@/components/organism/common/Toast";

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
// MAIN LOGIN PAGE COMPONENT
// ==========================================

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [login, { isLoading }] = useLoginMutation();

  // Local state for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Toast stack state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Catch state message sent from router (e.g. after signup)
  useEffect(() => {
    if (location.state?.message) {
      addToast({
        type: "success",
        title: "Registration Successful",
        message: location.state.message,
      });

      // Clear router state so it doesn't re-trigger on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Initialize React Hook Form connected to Zod schema
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data).unwrap();

      // 1. Save user payload and token details globally inside store memory
      dispatch(
        setCredentials({
          user: result.user,
          token: result.accessToken,
        }),
      );

      // 2. Head directly to workspace hub
      navigate("/");
    } catch (error: any) {
      addToast({
        type: "error",
        title: "Login Failed",
        message: error?.data?.message || "Có lỗi xảy ra",
      });
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-background font-inter overflow-x-hidden flex flex-col justify-between pb-12">
      {/* Top Decorative Blob Backdrop */}
      <div className="absolute top-0 right-0 left-0 h-[40vh] bg-gradient-to-br from-banner-from to-banner-to rounded-b-[40%] md:rounded-b-[50%] flex flex-col justify-center px-12 md:px-16 text-white shadow-xl">
        <p className="text-xl md:text-2xl font-medium tracking-wide opacity-90">
          Welcome Back,
        </p>
        <h1 className="text-5xl md:text-6xl font-extrabold mt-1 tracking-tight">
          Log In!
        </h1>
        <div className="absolute top-0 right-0 w-40 h-28 bg-brand rounded-bl-full opacity-40 blur-md pointer-events-none" />
      </div>

      <div className="h-[44vh]" />

      {/* Main Input Form Container */}
      <div className="flex-1 w-full max-w-lg mx-auto px-8 md:px-0 flex flex-col justify-start">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col space-y-7"
        >
          {/* Email Address Input Field */}
          <FloatingInput
            id="email"
            label="EMAIL ADDRESS"
            type="email"
            placeholder="example@domain.com"
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

          {/* Toggle/Checkbox Switch Row */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-3 cursor-pointer select-none">
              <input
                type="checkbox"
                disabled={isLoading}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-border rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand relative" />
              <span className="text-sm text-muted-foreground font-medium">
                Remember me
              </span>
            </label>

            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-brand hover:opacity-80 transition-opacity"
            >
              Forgot password?
            </Link>
          </div>

          {/* Action Login Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand hover:opacity-90 disabled:bg-muted text-white font-bold text-lg py-4 rounded-full tracking-wide transition-all shadow-lg disabled:shadow-none cursor-pointer active:scale-[0.99] disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <span>Log in</span>
              )}
            </button>
          </div>
        </form>

        {/* Sign Up / Register Navigation Prompt */}
        <div className="text-center pt-8">
          <p className="text-sm text-muted-foreground font-medium">
            Don't have an account yet?{" "}
            <Link
              to="/signup"
              className="font-bold text-brand hover:underline transition-all"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Render the Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
