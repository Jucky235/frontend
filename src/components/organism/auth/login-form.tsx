import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux"; // 1. Add Redux hook
import { loginSchema, type LoginFormData } from "@/validadtion/login"; // Adjust path if needed
import { useLoginMutation } from "@/redux/auth/authApiSlice"; // 2. Import API hook
import { setCredentials } from "@/redux/auth/authSlice"; // 3. Import local action

export const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation(); // 4. Initialize API mutation

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

  const onSubmit = async (data: LoginFormData) => {
    try {
      // 5. Fire your RTK Query network mutation and unwrap the promise
      const result = await login(data).unwrap();

      // 6. Save the resulting state globally inside Redux memory
      dispatch(
        setCredentials({
          user: result.user,
          token: result.accessToken,
        }),
      );

      // Optional: keep token persistently in local storage for refresh persistence
      localStorage.setItem("token", result.accessToken);

      alert(`Đăng nhập thành công! Chào ${result.user.name}`);
    } catch (error: any) {
      // RTK Query catches error responses from backends under error.data
      alert(`Lỗi: ${error?.data?.message || "Đăng nhập thất bại"}`);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "40px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h2>Đăng Nhập</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email Input */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>Email</label>
          <input
            type="email"
            {...register("email")}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            placeholder="example@domain.com"
          />
          {errors.email && (
            <p style={{ color: "red", fontSize: "14px", margin: "4px 0 0" }}>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Mật khẩu
          </label>
          <input
            type="password"
            {...register("password")}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            placeholder="••••••••"
          />
          {errors.password && (
            <p style={{ color: "red", fontSize: "14px", margin: "4px 0 0" }}>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading} // 7. Swap isSubmitting for Redux isLoading status
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: isLoading ? "#ccc" : "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Đang xử lý..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
};
