import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, { message: "Vui lòng điền tên" }),
  email: z
    .string()
    .min(1, { message: "Email là bắt buộc" })
    .email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

export type SignupFormData = z.infer<typeof signupSchema>;
