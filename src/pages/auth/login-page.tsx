import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Import your validation schemas and redux slices
import { loginSchema, type LoginFormData } from "@/validadtion/login";
import { useLoginMutation } from "@/redux/auth/authApiSlice";
import { setCredentials } from "@/redux/auth/authSlice";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  // Initialize React Hook Form connected to your Zod schema
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

  // Connect form data submission straight to Redux network actions
  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data).unwrap();

      // 1. Save user payload and token details globally inside store memory
      dispatch(
        setCredentials({
          user: result.user,
          token: result.accessToken, // Maps back-end accessToken to state.auth.token
        }),
      );

      // 2. Head directly to workspace hub
      navigate("/");
    } catch (error: any) {
      alert(`Đăng nhập thất bại: ${error?.data?.message || "Có lỗi xảy ra"}`);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-background font-inter overflow-x-hidden flex flex-col justify-between pb-8">
      {/* Top Decorative Blob Backdrop */}
      <div className="absolute top-0 right-0 left-0 h-[38vh] bg-gradient-to-br from-banner-from to-banner-to rounded-b-[35%] md:rounded-b-[45%] flex flex-col justify-center px-10 text-white shadow-lg">
        <p className="text-xl font-medium tracking-wide opacity-90">
          Welcome Back,
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold mt-1 tracking-tight">
          Log In!
        </h1>
        <div className="absolute top-0 right-0 w-32 h-20 bg-brand rounded-bl-full opacity-40 blur-sm pointer-events-none" />
      </div>

      <div className="h-[40vh]" />

      {/* Main Input Form Container */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 w-full max-w-md mx-auto px-8 flex flex-col justify-start space-y-6"
      >
        {/* Email Address Input Field */}
        <div>
          <div
            className={`relative border rounded-xl px-4 py-3 focus-within:border-brand transition-colors ${
              errors.email ? "border-red-500" : "border-border"
            }`}
          >
            <label className="absolute -top-2.5 left-4 bg-background px-1 text-xs font-semibold text-muted-foreground tracking-wide">
              EMAIL ADDRESS
            </label>
            <input
              type="text"
              placeholder="example@domain.com"
              {...register("email")}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none pt-1"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 ml-4">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Input Field */}
        <div>
          <div
            className={`relative border rounded-xl px-4 py-3 flex items-center justify-between focus-within:border-brand transition-colors ${
              errors.password ? "border-red-500" : "border-border"
            }`}
          >
            <label className="absolute -top-2.5 left-4 bg-background px-1 text-xs font-semibold text-muted-foreground tracking-wide">
              PASSWORD
            </label>
            <input
              type="password"
              placeholder="Enter password"
              {...register("password")}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none pt-1 pr-2"
            />
            <Lock
              className="w-5 h-5 text-muted-foreground shrink-0"
              strokeWidth={1.5}
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1 ml-4">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Toggle/Checkbox Switch Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-9 h-5 bg-border rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand" />
            </label>
            <span className="text-xs text-muted-foreground font-medium">
              Remember me
            </span>
          </div>

          <a
            href="/forgot-password"
            className="text-xs font-semibold text-brand hover:opacity-80 transition-opacity"
          >
            Forgot password?
          </a>
        </div>

        {/* Action Login Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand hover:opacity-90 disabled:bg-muted text-white font-bold text-base py-3.5 rounded-full tracking-wide transition-all shadow-md disabled:shadow-none cursor-pointer active:scale-[0.99] disabled:cursor-not-allowed"
          >
            {isLoading ? "Đang xử lý..." : "Log in"}
          </button>
        </div>
      </form>

      <div className="w-full max-w-xs mx-auto flex items-center justify-center space-x-8 pt-8">
        {/* Social target injections */}
      </div>
    </div>
  );
}
