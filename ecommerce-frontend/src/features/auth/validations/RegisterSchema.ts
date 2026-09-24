import { z } from "zod";

const signUpSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: "First Name is Required" })
      .max(50, { message: "First Name cannot exceed 50 characters" }),
    lastName: z
      .string()
      .min(1, { message: "Last Name is Required" })
      .max(50, { message: "Last Name cannot exceed 50 characters" }),
    email: z
      .string()
      .min(1, { message: "email Address is Required" })
      .email()
      .max(100, { message: "Email cannot exceed 100 characters" }),
    password: z
      .string()
      .min(8, { message: "password must be at least 8 charachters" })
      .max(100, { message: "Password cannot exceed 100 characters" })
      .regex(/.*[!@#$%^&*()_+{}|[\]\\:";'<>?,./].*/, {
        message: "Password should contain at least 1 special character",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "confirm Password is Required" }),
  })
  .refine((input) => input.password === input.confirmPassword, {
    message: "password and confirmPassword does not match",
    path: ["confirmPassword"],
  });

type signUpType = z.infer<typeof signUpSchema>;

export { signUpSchema, type signUpType };
