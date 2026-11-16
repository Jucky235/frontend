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
        state: { message: "Vui lòng đăng nhập bằng tài khoản bạn đã đăng ký" },
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
      <div className="absolute top-0 right-0 left-0 h-[34vh] min-h-64 bg-gradient-to-br from-banner-from to-banner-to rounded-b-[12%] sm:rounded-b-[24%] flex flex-col justify-center px-6 sm:px-10 md:px-16 text-white shadow-xl">
        <p className="text-sm sm:text-xl md:text-2xl font-medium tracking-wide opacity-90">
          Xây dựng thói quen luyện tập bền vững
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mt-1 tracking-tight">
          Tạo tài khoản
        </h1>
        <p className="mt-2 max-w-md text-xs sm:text-sm text-white/80">Tham gia S English để luyện tập với bài học thực tế và lưu lại tiến độ học.</p>
        <div className="absolute top-0 right-0 w-40 h-28 bg-brand rounded-bl-full opacity-40 blur-md pointer-events-none" />
      </div>

      {/* Spacer to push content below absolute header */}
      <div className="h-[36vh] min-h-64" />

      {/* 2. Main Input Form Container */}
      <div className="flex-1 w-full max-w-lg mx-auto px-4 sm:px-8 md:px-0 flex flex-col justify-start">
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
            label="TÊN NGƯỜI DÙNG"
            type="text"
            placeholder="Nguyễn Văn An"
            register={register("name")}
            error={errors.name?.message}
            disabled={isLoading}
            icon={<User className="w-5 h-5" strokeWidth={1.75} />}
          />

          {/* Email Address Input Field */}
          <FloatingInput
            id="email"
            label="ĐỊA CHỈ EMAIL"
            type="email"
            placeholder="email@example.com"
            register={register("email")}
            error={errors.email?.message}
            disabled={isLoading}
            icon={<Mail className="w-5 h-5" strokeWidth={1.75} />}
          />

          {/* Password Input Field */}
          <FloatingInput
            id="password"
            label="MẬT KHẨU"
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu"
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
              <div className="w-10 h-6 bg-border rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background-card after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand relative" />
            </label>
            <span className="text-sm text-muted-foreground font-medium">
              Tôi đồng ý với chính sách và điều khoản
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
                  <span>Đang đăng ký...</span>
                </>
              ) : (
                <span>Đăng ký</span>
              )}
            </button>
          </div>
        </form>

        {/* Login Navigation Prompt */}
        <div className="text-center pt-8">
          <p className="text-sm text-muted-foreground font-medium">
            Bạn đã có tài khoản?{" "}
            <Link
              to="/login"
              className="font-bold text-brand hover:underline transition-all"
            >
              Đăng nhập
            </Link>
          </p>
        </div>
        <div className="mt-8 rounded-2xl border border-border bg-background-card p-4 sm:p-5">
          <p className="text-xs font-bold text-foreground">Tài khoản miễn phí bao gồm</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-foreground-muted">
            <span>✓ Bài luyện nghe có hướng dẫn</span><span>✓ Thẻ ghi nhớ từ vựng</span>
            <span>✓ Lịch sử tiến độ cá nhân</span><span>✓ Thảo luận cộng đồng</span>
          </div>
        </div>
      </div>
    </div>
  );
}
