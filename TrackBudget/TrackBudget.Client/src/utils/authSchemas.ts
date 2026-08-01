import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is rewuired")
    .email({ message: "Enter a valid email adress" }),

  password: z.string().trim().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(1, "Username is required")
      .max(30, "Username must be at most 30 characters"),

    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email({ message: "Enter a valid email address" }),

    password: z
      .string()
      .trim()
      .min(6, "Password must be at least 6 characters long")

      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),

    confirmPassword: z.string().trim().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
  });

export type LoginFromValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
